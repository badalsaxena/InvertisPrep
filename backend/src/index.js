const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

// Import game service
const GameService = require('./services/GameService');
const gameService = new GameService(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle matchmaking
  socket.on('joinMatchmaking', ({ subject, username }) => {
    gameService.joinMatchmaking(socket, subject, username);
  });

  // Handle leaving matchmaking
  socket.on('leaveMatchmaking', () => {
    gameService.leaveMatchmaking(socket);
  });

  // Handle answer submission
  socket.on('submitAnswer', ({ questionId, answerIndex, timeElapsed }) => {
    gameService.handleAnswer(socket, questionId, answerIndex, timeElapsed);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    gameService.handleDisconnect(socket);
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 