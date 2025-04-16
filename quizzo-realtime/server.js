require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Get API URL from environment variables or use default
const API_URL = process.env.API_URL || 'https://invertisprep.vercel.app/api';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Create Socket.IO server
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Game state storage
const matchmakingQueues = {};
const activeRooms = {};
const players = {};

// Express route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Quizzo WebSocket server is running',
    connections: Object.keys(players).length,
    matchmaking: Object.keys(matchmakingQueues).reduce((acc, subject) => {
      acc[subject] = matchmakingQueues[subject]?.length || 0;
      return acc;
    }, {}),
    rooms: Object.keys(activeRooms).length
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Store player info
  players[socket.id] = {
    id: socket.id,
    inGame: false,
    roomId: null
  };

  // Handle joinMatchmaking event
  socket.on('joinMatchmaking', async ({ username, subject }) => {
    console.log(`${username} joined matchmaking for ${subject}`);
    
    // Update player data
    players[socket.id].username = username;
    players[socket.id].subject = subject;
    
    // Create queue for subject if it doesn't exist
    if (!matchmakingQueues[subject]) {
      matchmakingQueues[subject] = [];
    }
    
    // Add player to queue
    matchmakingQueues[subject].push(socket.id);
    socket.emit('matchmakingStatus', { status: 'waiting' });
    
    // Check if we have enough players to start a game
    if (matchmakingQueues[subject].length >= 2) {
      try {
        await createGame(subject);
      } catch (error) {
        console.error('Error creating game:', error);
        socket.emit('error', { message: 'Failed to create game. Please try again.' });
      }
    }
  });
  
  // Handle leaveMatchmaking event
  socket.on('leaveMatchmaking', () => {
    const player = players[socket.id];
    if (player && player.subject) {
      // Remove player from queue
      if (matchmakingQueues[player.subject]) {
        matchmakingQueues[player.subject] = matchmakingQueues[player.subject].filter(id => id !== socket.id);
      }
      console.log(`${player.username} left matchmaking for ${player.subject}`);
    }
  });
  
  // Handle submitAnswer event
  socket.on('submitAnswer', ({ questionId, answerIndex, timeElapsed }) => {
    const player = players[socket.id];
    if (!player || !player.inGame || !player.roomId) return;
    
    const room = activeRooms[player.roomId];
    if (!room) return;
    
    handlePlayerAnswer(socket.id, room, questionId, answerIndex, timeElapsed);
  });
  
  // Handle disconnect event
  socket.on('disconnect', () => {
    const player = players[socket.id];
    console.log(`Client disconnected: ${socket.id}`);
    
    // Handle player in matchmaking
    if (player && player.subject && !player.inGame) {
      if (matchmakingQueues[player.subject]) {
        matchmakingQueues[player.subject] = matchmakingQueues[player.subject].filter(id => id !== socket.id);
      }
    }
    
    // Handle player in active game
    if (player && player.inGame && player.roomId) {
      const room = activeRooms[player.roomId];
      if (room) {
        // Notify other player that the opponent left
        room.players.forEach(playerId => {
          if (playerId !== socket.id) {
            io.to(playerId).emit('opponentLeft');
          }
        });
        
        // Clean up the room
        delete activeRooms[player.roomId];
      }
    }
    
    // Remove player from players list
    delete players[socket.id];
  });
});

// Create a new game with two players
async function createGame(subject) {
  // Get the first two players from the queue
  const playerIds = matchmakingQueues[subject].splice(0, 2);
  const roomId = uuidv4();
  
  try {
    // Fetch questions from API
    const response = await axios.get(`${API_URL}/questions/${subject}`);
    const questionsData = response.data;
    
    // Create room
    activeRooms[roomId] = {
      id: roomId,
      subject,
      players: playerIds,
      currentQuestionIndex: -1,
      questions: questionsData.questions || [],
      answers: {},
      scores: {},
      startTime: Date.now(),
      status: 'waiting'
    };
    
    // Initialize player scores and mark them as in game
    playerIds.forEach(playerId => {
      players[playerId].inGame = true;
      players[playerId].roomId = roomId;
      activeRooms[roomId].scores[playerId] = 0;
      activeRooms[roomId].answers[playerId] = [];
    });
    
    // Add players to room (Socket.IO room)
    playerIds.forEach(playerId => {
      const socket = io.sockets.sockets.get(playerId);
      if (socket) {
        socket.join(roomId);
        
        // Send match found event with opponent info
        const opponentId = playerIds.find(id => id !== playerId);
        const opponentName = players[opponentId].username;
        
        socket.emit('matchFound', {
          roomId,
          subject,
          opponent: opponentName,
          players: playerIds.map(id => ({
            id,
            username: players[id].username
          }))
        });
      }
    });
    
    // Start the game after a short delay
    setTimeout(() => startGame(roomId), 3000);
  } catch (error) {
    console.error('Error creating game:', error);
    
    // Put players back in queue
    if (matchmakingQueues[subject]) {
      playerIds.forEach(playerId => {
        matchmakingQueues[subject].push(playerId);
      });
    }
    
    // Notify players
    playerIds.forEach(playerId => {
      const socket = io.sockets.sockets.get(playerId);
      if (socket) {
        socket.emit('error', { message: 'Failed to start game. Please try again.' });
      }
    });
  }
}

// Start a game
function startGame(roomId) {
  const room = activeRooms[roomId];
  if (!room) return;
  
  room.status = 'playing';
  room.startTime = Date.now();
  
  // Notify all players that the game has started
  io.to(roomId).emit('quizStart');
  
  // Send the first question
  sendNextQuestion(roomId);
}

// Send the next question to all players in the room
function sendNextQuestion(roomId) {
  const room = activeRooms[roomId];
  if (!room) return;
  
  room.currentQuestionIndex++;
  
  // Check if we've reached the end of the questions
  if (room.currentQuestionIndex >= room.questions.length) {
    endGame(roomId);
    return;
  }
  
  const currentQuestion = room.questions[room.currentQuestionIndex];
  
  // Reset player answers for new question
  room.players.forEach(playerId => {
    room.answers[playerId][room.currentQuestionIndex] = null;
  });
  
  // Send question to all players
  io.to(roomId).emit('quizQuestion', {
    question: {
      id: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options
    },
    questionCount: room.currentQuestionIndex + 1,
    totalQuestions: room.questions.length
  });
  
  // Set timeout for question (15 seconds)
  setTimeout(() => {
    handleQuestionTimeout(roomId);
  }, 15000);
}

// Handle player answer
async function handlePlayerAnswer(playerId, room, questionId, answerIndex, timeElapsed) {
  const currentQuestionIndex = room.currentQuestionIndex;
  const currentQuestion = room.questions[currentQuestionIndex];
  
  // Ignore if player already answered this question
  if (room.answers[playerId][currentQuestionIndex] !== null) return;
  
  try {
    // Validate answer against the API
    const response = await axios.post(`${API_URL}/validate-answer`, {
      subject: room.subject,
      questionId,
      answerIndex
    });
    
    const isCorrect = response.data.correct;
    
    // Record the answer
    room.answers[playerId][currentQuestionIndex] = {
      answerIndex,
      timeElapsed,
      isCorrect
    };
    
    // Update score if correct
    if (isCorrect) {
      room.scores[playerId] += 1;
    }
    
    // Notify player of result
    io.to(playerId).emit('answerResult', {
      correct: isCorrect,
      score: room.scores[playerId]
    });
    
    // Notify opponent that player has answered
    room.players.forEach(pid => {
      if (pid !== playerId) {
        io.to(pid).emit('opponentAnswered');
      }
    });
    
    // Check if all players have answered
    const allAnswered = room.players.every(pid => 
      room.answers[pid][currentQuestionIndex] !== null
    );
    
    if (allAnswered) {
      // Wait 2 seconds before sending next question
      setTimeout(() => {
        sendNextQuestion(room.id);
      }, 2000);
    }
  } catch (error) {
    console.error('Error validating answer:', error);
    // In case of error, consider answer as incorrect
    room.answers[playerId][currentQuestionIndex] = {
      answerIndex,
      timeElapsed,
      isCorrect: false
    };
    
    // Notify player of result
    io.to(playerId).emit('answerResult', {
      correct: false,
      score: room.scores[playerId]
    });
    
    // Notify opponent that player has answered
    room.players.forEach(pid => {
      if (pid !== playerId) {
        io.to(pid).emit('opponentAnswered');
      }
    });
  }
}

// Handle question timeout
function handleQuestionTimeout(roomId) {
  const room = activeRooms[roomId];
  if (!room || room.status !== 'playing') return;
  
  const currentQuestionIndex = room.currentQuestionIndex;
  
  // Record timeout for players who haven't answered
  room.players.forEach(playerId => {
    if (room.answers[playerId][currentQuestionIndex] === null) {
      room.answers[playerId][currentQuestionIndex] = {
        answerIndex: -1,
        timeElapsed: 15000,
        isCorrect: false
      };
    }
  });
  
  // Send next question after delay
  setTimeout(() => {
    sendNextQuestion(room.id);
  }, 2000);
}

// End the game and send results
function endGame(roomId) {
  const room = activeRooms[roomId];
  if (!room) return;
  
  room.status = 'finished';
  
  // Calculate results for each player
  const results = {};
  
  room.players.forEach(playerId => {
    const playerAnswers = room.answers[playerId];
    let totalTime = 0;
    
    // Calculate total time
    playerAnswers.forEach(answer => {
      if (answer) {
        totalTime += answer.timeElapsed;
      }
    });
    
    results[playerId] = {
      score: room.scores[playerId],
      totalTime,
      answers: playerAnswers
    };
    
    // Mark player as not in game
    players[playerId].inGame = false;
    players[playerId].roomId = null;
  });
  
  // Send results to each player
  room.players.forEach(playerId => {
    const myResult = results[playerId];
    const opponentId = room.players.find(pid => pid !== playerId);
    const opponentResult = results[opponentId];
    
    io.to(playerId).emit('quizEnd', {
      myResult: {
        userId: playerId,
        score: myResult.score,
        totalTime: myResult.totalTime
      },
      opponentResult: {
        userId: opponentId,
        score: opponentResult.score,
        totalTime: opponentResult.totalTime
      }
    });
  });
  
  // Clean up the room after some time
  setTimeout(() => {
    delete activeRooms[roomId];
  }, 30000);
}

// Start the server
server.listen(PORT, () => {
  console.log(`Quizzo WebSocket server running on port ${PORT}`);
}); 