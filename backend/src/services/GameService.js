const { v4: uuidv4 } = require('uuid');
const questions = require('../config/questions');

class GameService {
  constructor(io) {
    this.io = io;
    this.matchmakingQueues = {};
    this.rooms = {};
    this.questions = questions;
  }

  joinMatchmaking(socket, subject, username) {
    // Create queue for subject if it doesn't exist
    if (!this.matchmakingQueues[subject]) {
      this.matchmakingQueues[subject] = [];
    }

    // Add player to queue
    this.matchmakingQueues[subject].push({
      socket,
      username,
      subject
    });

    // Notify player they're in queue
    socket.emit('matchmakingStatus', { status: 'waiting' });

    // Check if we can create a match
    if (this.matchmakingQueues[subject].length >= 2) {
      this.createMatch(subject);
    }
  }

  leaveMatchmaking(socket) {
    // Remove player from all queues
    Object.keys(this.matchmakingQueues).forEach(subject => {
      this.matchmakingQueues[subject] = this.matchmakingQueues[subject].filter(
        player => player.socket.id !== socket.id
      );
    });
  }

  createMatch(subject) {
    const players = this.matchmakingQueues[subject].splice(0, 2);
    const roomId = uuidv4();

    // Create new room
    this.rooms[roomId] = {
      id: roomId,
      subject,
      players: players.map(player => ({
        id: player.socket.id,
        username: player.username,
        score: 0,
        totalTime: 0
      })),
      currentQuestion: null,
      questionCount: 0,
      totalQuestions: 10,
      status: 'waiting'
    };

    // Join players to room
    players.forEach(player => {
      player.socket.join(roomId);
      player.socket.emit('matchFound', {
        room: this.rooms[roomId],
        opponent: players.find(p => p.socket.id !== player.socket.id).username
      });
    });

    // Start the game after a short delay
    setTimeout(() => this.startGame(roomId), 3000);
  }

  startGame(roomId) {
    const room = this.rooms[roomId];
    room.status = 'playing';
    
    // Send first question
    this.sendNextQuestion(roomId);
  }

  sendNextQuestion(roomId) {
    const room = this.rooms[roomId];
    const subject = room.subject;
    const questions = this.questions[subject];
    
    if (room.questionCount >= room.totalQuestions) {
      this.endGame(roomId);
      return;
    }

    // Get random question
    const question = questions[Math.floor(Math.random() * questions.length)];
    room.currentQuestion = question;
    room.questionCount++;

    // Send question to all players in room
    this.io.to(roomId).emit('quizQuestion', {
      question,
      questionCount: room.questionCount,
      totalQuestions: room.totalQuestions
    });

    // Set timeout for question
    setTimeout(() => {
      if (room.status === 'playing') {
        this.handleQuestionTimeout(roomId);
      }
    }, 15000); // 15 seconds per question
  }

  handleAnswer(socket, questionId, answerIndex, timeElapsed) {
    const room = this.findPlayerRoom(socket.id);
    if (!room || room.status !== 'playing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const question = room.currentQuestion;
    const isCorrect = question.correctAnswer === answerIndex;

    // Update player score and time
    if (isCorrect) {
      player.score += 1;
    }
    player.totalTime += timeElapsed;

    // Notify player of their result
    socket.emit('answerResult', {
      correct: isCorrect,
      score: player.score
    });

    // Notify opponent that player has answered
    socket.to(room.id).emit('opponentAnswered');

    // Check if both players have answered
    const allAnswered = room.players.every(p => p.totalTime > 0);
    if (allAnswered) {
      setTimeout(() => this.sendNextQuestion(room.id), 2000);
    }
  }

  handleQuestionTimeout(roomId) {
    const room = this.rooms[roomId];
    if (!room || room.status !== 'playing') return;

    // Mark unanswered players
    room.players.forEach(player => {
      if (player.totalTime === 0) {
        player.totalTime = 15000; // Max time for unanswered questions
      }
    });

    // Move to next question
    setTimeout(() => this.sendNextQuestion(roomId), 2000);
  }

  endGame(roomId) {
    const room = this.rooms[roomId];
    if (!room) return;

    room.status = 'finished';

    // Calculate results
    const results = {
      myResult: room.players[0],
      opponentResult: room.players[1]
    };

    // Send results to all players
    this.io.to(roomId).emit('quizEnd', results);

    // Clean up room after delay
    setTimeout(() => {
      delete this.rooms[roomId];
    }, 30000); // Keep room for 30 seconds after game ends
  }

  findPlayerRoom(playerId) {
    return Object.values(this.rooms).find(room =>
      room.players.some(player => player.id === playerId)
    );
  }

  handleDisconnect(socket) {
    const room = this.findPlayerRoom(socket.id);
    if (room) {
      // If game is in progress, end it
      if (room.status === 'playing') {
        this.endGame(room.id);
      }
      // Remove player from room
      room.players = room.players.filter(p => p.id !== socket.id);
    }

    // Remove from matchmaking
    this.leaveMatchmaking(socket);
  }
}

module.exports = GameService; 