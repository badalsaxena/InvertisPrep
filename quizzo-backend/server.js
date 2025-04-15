import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import os from 'os';

// Load environment variables
dotenv.config();

// Set up Express and Socket.IO
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow any origin if not specified
  methods: ['GET', 'POST'],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*', // Allow any origin if not specified
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000, // Increase ping timeout for more stable connections
  pingInterval: 25000 // Ping interval
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces by default

// Get local IP addresses for display purposes
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    if (networkInterface) {
      for (const iface of networkInterface) {
        // Skip over non-IPv4 and internal (loopback) addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }
  }
  
  return addresses;
}

// Define Socket.IO event names
const EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Matchmaking events
  JOIN_MATCHMAKING: 'join_matchmaking',
  LEAVE_MATCHMAKING: 'leave_matchmaking',
  MATCH_FOUND: 'match_found',
  
  // Quiz events
  QUIZ_START: 'quiz_start',
  QUIZ_QUESTION: 'quiz_question',
  SUBMIT_ANSWER: 'submit_answer',
  ANSWER_RESULT: 'answer_result',
  OPPONENT_ANSWERED: 'opponent_answered',
  QUIZ_END: 'quiz_end',
  
  // Room events
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_STATE: 'room_state',
  
  // Error events
  ERROR: 'error'
};

// Map to hold users in matchmaking queue by subject
const matchmakingQueues = {
  c: [], // C programming
  dsa: [], // Data Structures & Algorithms
  python: [], // Python
  java: [], // Java
  web: [] // Web Development
};

// Map to hold active quiz rooms
const quizRooms = new Map();

// Map to track user data (current room, score, etc.)
const users = new Map();

// Questions database by subject (simplified for this example)
// In a real-world scenario, these would come from a database
import { loadQuestions } from './questions.js';
const questionsBySubject = loadQuestions();

// Function to create a new quiz room
function createQuizRoom(user1, user2, subject) {
  const roomId = uuidv4();
  
  // Get 10 random questions for the subject
  const allQuestions = questionsBySubject[subject] || [];
  let questions = [];
  
  if (allQuestions.length <= 10) {
    questions = [...allQuestions];
  } else {
    // Shuffle algorithm (Fisher-Yates shuffle)
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    questions = shuffled.slice(0, 10);
  }
  
  // Create room with users and questions
  const room = {
    id: roomId,
    subject,
    users: [user1, user2],
    questions,
    currentQuestionIndex: -1, // Start with -1 to indicate room created but quiz not started
    answers: {
      [user1.id]: [],
      [user2.id]: []
    },
    scores: {
      [user1.id]: 0,
      [user2.id]: 0
    },
    state: 'waiting', // waiting, playing, completed
    createdAt: Date.now()
  };
  
  // Store room
  quizRooms.set(roomId, room);
  
  // Update user data
  users.set(user1.id, { ...users.get(user1.id), roomId });
  users.set(user2.id, { ...users.get(user2.id), roomId });
  
  return room;
}

// Start a quiz in a room
function startQuiz(roomId) {
  const room = quizRooms.get(roomId);
  if (!room) return null;
  
  room.state = 'playing';
  room.startedAt = Date.now();
  
  return room;
}

// Send next question to room
function sendNextQuestion(roomId) {
  const room = quizRooms.get(roomId);
  if (!room || room.state !== 'playing') return null;
  
  // Move to next question
  room.currentQuestionIndex++;
  
  // Check if all questions have been asked
  if (room.currentQuestionIndex >= room.questions.length) {
    endQuiz(roomId);
    return null;
  }
  
  // Get current question (without correct answer)
  const fullQuestion = room.questions[room.currentQuestionIndex];
  const question = {
    id: fullQuestion.id,
    question: fullQuestion.question,
    options: fullQuestion.options
  };
  
  // Send question to all users in room
  io.to(roomId).emit(EVENTS.QUIZ_QUESTION, question);
  
  // Set timer for question (15 seconds)
  setTimeout(() => {
    processUnansweredQuestion(roomId);
  }, 16000); // Giving extra 1 second buffer
  
  return question;
}

// Process users who didn't answer in time
function processUnansweredQuestion(roomId) {
  const room = quizRooms.get(roomId);
  if (!room || room.state !== 'playing') return;
  
  // Get current question
  const currentQuestionIndex = room.currentQuestionIndex;
  if (currentQuestionIndex < 0 || currentQuestionIndex >= room.questions.length) return;
  
  const currentQuestion = room.questions[currentQuestionIndex];
  
  // For each user, check if they answered this question
  room.users.forEach(user => {
    const userAnswers = room.answers[user.id];
    
    // If user didn't answer this question, add a timeout answer
    if (!userAnswers.find(a => a.questionIndex === currentQuestionIndex)) {
      userAnswers.push({
        questionId: currentQuestion.id,
        questionIndex: currentQuestionIndex,
        answerIndex: -1, // -1 indicates no answer
        timeElapsed: 15000, // Maximum time
        isCorrect: false
      });
    }
  });
  
  // Check if all users have answered
  const allAnswered = room.users.every(user => 
    room.answers[user.id].some(a => a.questionIndex === currentQuestionIndex)
  );
  
  // If all answered, send next question after delay
  if (allAnswered) {
    setTimeout(() => {
      sendNextQuestion(roomId);
    }, 2000);
  }
}

// Calculate score based on answer correctness and time taken
function calculateScore(isCorrect, timeElapsedMs) {
  if (!isCorrect) return 0;
  
  // Base score for correct answer
  const baseScore = 8;
  
  // Time bonus (max 2 points)
  // 0-3 seconds: +2 points
  // 3-7 seconds: +1 point
  // 7+ seconds: +0 points
  let timeBonus = 0;
  if (timeElapsedMs <= 3000) {
    timeBonus = 2;
  } else if (timeElapsedMs <= 7000) {
    timeBonus = 1;
  }
  
  return baseScore + timeBonus;
}

// Process user's answer
function processAnswer(roomId, userId, questionId, answerIndex, timeElapsed) {
  const room = quizRooms.get(roomId);
  if (!room || room.state !== 'playing') return null;
  
  // Get current question
  const currentQuestionIndex = room.currentQuestionIndex;
  if (currentQuestionIndex < 0 || currentQuestionIndex >= room.questions.length) return null;
  
  const currentQuestion = room.questions[currentQuestionIndex];
  if (currentQuestion.id !== questionId) return null; // Verify correct question
  
  // Check if user already answered this question
  const userAnswers = room.answers[userId];
  if (userAnswers.some(a => a.questionIndex === currentQuestionIndex)) return null;
  
  // Check if answer is correct
  const isCorrect = answerIndex === currentQuestion.correctIndex;
  
  // Calculate score
  const score = calculateScore(isCorrect, timeElapsed);
  
  // Record answer
  userAnswers.push({
    questionId,
    questionIndex: currentQuestionIndex,
    answerIndex,
    timeElapsed,
    isCorrect
  });
  
  // Update user's score
  room.scores[userId] += score;
  
  // Notify user about their result
  const socket = io.sockets.sockets.get(userId);
  if (socket) {
    socket.emit(EVENTS.ANSWER_RESULT, {
      correct: isCorrect,
      score: room.scores[userId]
    });
  }
  
  // Notify opponent that this user answered
  room.users.forEach(user => {
    if (user.id !== userId) {
      const opponentSocket = io.sockets.sockets.get(user.id);
      if (opponentSocket) {
        opponentSocket.emit(EVENTS.OPPONENT_ANSWERED);
      }
    }
  });
  
  // Check if all users have answered
  const allAnswered = room.users.every(user => 
    room.answers[user.id].some(a => a.questionIndex === currentQuestionIndex)
  );
  
  // If all answered, send next question after delay
  if (allAnswered) {
    setTimeout(() => {
      sendNextQuestion(roomId);
    }, 2000);
  }
  
  return {
    isCorrect,
    score: room.scores[userId]
  };
}

// End quiz and calculate results
function endQuiz(roomId) {
  const room = quizRooms.get(roomId);
  if (!room) return null;
  
  room.state = 'completed';
  room.endedAt = Date.now();
  
  // Calculate results for each user
  const results = {};
  
  room.users.forEach(user => {
    const userAnswers = room.answers[user.id];
    const totalTime = userAnswers.reduce((sum, answer) => sum + answer.timeElapsed, 0);
    
    results[user.id] = {
      userId: user.id,
      username: user.name,
      score: room.scores[user.id],
      answers: userAnswers,
      totalTime
    };
  });
  
  // Send results to each user
  room.users.forEach(user => {
    const socket = io.sockets.sockets.get(user.id);
    if (socket) {
      // Find opponent
      const opponent = room.users.find(u => u.id !== user.id);
      if (!opponent) return;
      
      socket.emit(EVENTS.QUIZ_END, {
        myResult: results[user.id],
        opponentResult: results[opponent.id]
      });
    }
  });
  
  // Remove room after some time
  setTimeout(() => {
    quizRooms.delete(roomId);
  }, 3600000); // Keep for 1 hour for history
  
  return results;
}

// Socket.IO connection handling
io.on(EVENTS.CONNECT, (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Initialize user data
  users.set(socket.id, {
    id: socket.id,
    name: null,
    matchmaking: false,
    subject: null,
    roomId: null,
    joinedAt: Date.now()
  });
  
  // Join matchmaking
  socket.on(EVENTS.JOIN_MATCHMAKING, ({ subject, username }) => {
    if (!subject || !matchmakingQueues[subject]) {
      socket.emit(EVENTS.ERROR, { message: 'Invalid subject' });
      return;
    }
    
    // Update user data
    users.set(socket.id, {
      ...users.get(socket.id),
      name: username || `User_${socket.id.substr(0, 5)}`,
      matchmaking: true,
      subject
    });
    
    const userData = {
      id: socket.id,
      name: users.get(socket.id).name
    };
    
    // Add user to matchmaking queue
    matchmakingQueues[subject].push(userData);
    
    console.log(`User ${userData.name} joined matchmaking for ${subject}`);
    
    // If we have at least 2 users in the queue, create a match
    if (matchmakingQueues[subject].length >= 2) {
      // Get first two users
      const user1 = matchmakingQueues[subject][0];
      const user2 = matchmakingQueues[subject][1];
      
      // Remove users from queue
      matchmakingQueues[subject] = matchmakingQueues[subject].slice(2);
      
      // Create room
      const room = createQuizRoom(user1, user2, subject);
      
      // Add users to Socket.IO room
      io.sockets.sockets.get(user1.id)?.join(room.id);
      io.sockets.sockets.get(user2.id)?.join(room.id);
      
      // Notify users about match
      io.to(room.id).emit(EVENTS.MATCH_FOUND, {
        id: room.id,
        users: [user1, user2],
        subject,
        state: room.state
      });
      
      console.log(`Match created: ${user1.name} vs ${user2.name} for ${subject}`);
      
      // Start quiz after a brief delay to allow UI transitions
      setTimeout(() => {
        startQuiz(room.id);
        io.to(room.id).emit(EVENTS.QUIZ_START);
        
        // Send first question after a brief delay
        setTimeout(() => {
          sendNextQuestion(room.id);
        }, 2000);
      }, 3000);
    }
  });
  
  // Leave matchmaking
  socket.on(EVENTS.LEAVE_MATCHMAKING, () => {
    const userData = users.get(socket.id);
    if (!userData || !userData.matchmaking) return;
    
    // Remove user from matchmaking queue
    if (userData.subject && matchmakingQueues[userData.subject]) {
      matchmakingQueues[userData.subject] = matchmakingQueues[userData.subject]
        .filter(user => user.id !== socket.id);
    }
    
    // Update user data
    users.set(socket.id, {
      ...userData,
      matchmaking: false,
      subject: null
    });
    
    console.log(`User ${userData.name} left matchmaking`);
  });
  
  // Submit answer
  socket.on(EVENTS.SUBMIT_ANSWER, ({ questionId, answerIndex, timeElapsed }) => {
    const userData = users.get(socket.id);
    if (!userData || !userData.roomId) return;
    
    processAnswer(userData.roomId, socket.id, questionId, answerIndex, timeElapsed);
  });
  
  // Handle disconnection
  socket.on(EVENTS.DISCONNECT, () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    
    console.log(`User disconnected: ${userData.name || socket.id}`);
    
    // If user was in matchmaking, remove them
    if (userData.matchmaking && userData.subject) {
      matchmakingQueues[userData.subject] = matchmakingQueues[userData.subject]
        .filter(user => user.id !== socket.id);
    }
    
    // If user was in a room, notify opponent
    if (userData.roomId) {
      const room = quizRooms.get(userData.roomId);
      if (room && room.state === 'playing') {
        // Find opponent
        const opponent = room.users.find(user => user.id !== socket.id);
        if (opponent) {
          const opponentSocket = io.sockets.sockets.get(opponent.id);
          if (opponentSocket) {
            opponentSocket.emit(EVENTS.ERROR, {
              message: 'Your opponent disconnected'
            });
            
            // End the quiz giving win to opponent
            room.scores[opponent.id] = Math.max(room.scores[opponent.id], 100);
            endQuiz(userData.roomId);
          }
        }
      }
    }
    
    // Remove user data
    users.delete(socket.id);
  });
});

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Quizzo Backend Server is running');
});

// Status endpoint with connection info
app.get('/status', (req, res) => {
  const localIps = getLocalIPs();
  const status = {
    status: 'running',
    uptime: process.uptime(),
    connections: io.engine.clientsCount,
    rooms: quizRooms.size,
    matchmaking: {
      c: matchmakingQueues.c.length,
      dsa: matchmakingQueues.dsa.length,
      python: matchmakingQueues.python.length,
      java: matchmakingQueues.java.length,
      web: matchmakingQueues.web.length
    },
    server: {
      port: PORT,
      localIPs: localIps.map(ip => `http://${ip}:${PORT}`),
      host: HOST
    }
  };
  
  res.json(status);
});

// Start server
httpServer.listen(PORT, HOST, () => {
  const localIps = getLocalIPs();
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is accessible at:`);
  console.log(`- Local:            http://localhost:${PORT}`);
  for (const ip of localIps) {
    console.log(`- Network:          http://${ip}:${PORT}`);
  }
}); 