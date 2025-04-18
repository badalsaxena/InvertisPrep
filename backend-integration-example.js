/**
 * Backend Integration Example for Quizzo Server
 * 
 * This file provides example code for implementing the quiz-reward endpoint
 * on your Node.js/Express backend server running on port 8080.
 */

// Express server setup
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Firebase Admin SDK setup (optional, only if direct Firebase writing is needed)
let admin;
try {
  admin = require('firebase-admin');
  // Check if a service account file exists
  try {
    const serviceAccount = require('./service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized');
  } catch (error) {
    console.warn('Firebase service account file not found. Direct Firebase updates will not be available.');
    console.warn('You can ignore this warning if you only use the frontend API.');
  }
} catch (error) {
  console.warn('Firebase Admin SDK not installed. Direct Firebase updates will not be available.');
  console.warn('You can ignore this warning if you only use the frontend API.');
}

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));
app.use(express.json());

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'development-secret-key';

// Add a root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Quizzo Backend Server is running',
    endpoints: ['/quiz-reward', '/questions/:subject']
  });
});

/**
 * Quiz Reward Endpoint - This is what you need to implement
 * POST /quiz-reward
 */
app.post('/quiz-reward', async (req, res) => {
  // Extract data from request
  const { uid, quizType, outcome, subject, score, opponent } = req.body;
  
  // Validate request
  if (!uid || !quizType || !outcome || !subject) {
    return res.status(400).json({
      error: 'Missing required parameters',
      required: ['uid', 'quizType', 'outcome', 'subject', 'score']
    });
  }
  
  try {
    // Calculate reward
    const isWinner = outcome === 'win';
    const reward = isWinner ? 5 : 1;
    
    console.log(`Processing reward for user ${uid}: ${reward} QCoins for ${isWinner ? 'winning' : 'participating in'} a ${quizType} quiz in ${subject}`);
    
    // First try to use the frontend API
    let frontendApiSuccess = false;
    let frontendApiError = null;
    
    try {
      // Prepare payload for frontend API
      const payload = {
        uid,
        amount: reward,
        isWinner,
        quizType,
        subject,
        score
      };
      
      // Encode the payload for URL transmission
      const encodedPayload = encodeURIComponent(JSON.stringify(payload));
      
      console.log(`Calling frontend API at: ${FRONTEND_URL}/api/quiz-rewards?payload=${encodedPayload.slice(0, 20)}...`);
      
      // Use node-fetch to make the request
      const fetch = require('node-fetch');
      
      const response = await fetch(`${FRONTEND_URL}/api/quiz-rewards?payload=${encodedPayload}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_SECRET_KEY
        }
      });
      
      // Read and log the complete response for debugging
      const responseText = await response.text();
      console.log(`Frontend API response (${response.status}):`, responseText);
      
      if (response.ok) {
        frontendApiSuccess = true;
        console.log('Frontend API call successful');
      } else {
        frontendApiError = `API returned ${response.status}: ${responseText}`;
        console.error('Frontend API error:', frontendApiError);
      }
    } catch (apiError) {
      frontendApiError = apiError.message;
      console.error('Frontend API call failed:', apiError);
    }
    
    // If frontend API failed and we have Firebase Admin, try direct update
    let directUpdateSuccess = false;
    let directUpdateError = null;
    
    if (!frontendApiSuccess && admin) {
      try {
        console.log('Attempting direct Firebase update...');
        
        // Get Firestore instance
        const db = admin.firestore();
        
        // Create a transaction to safely update the user's wallet
        await db.runTransaction(async (transaction) => {
          // Get reference to user document
          const userRef = db.collection('users').doc(uid);
          const userDoc = await transaction.get(userRef);
          
          if (!userDoc.exists) {
            throw new Error(`User ${uid} not found in Firestore`);
          }
          
          // Get current user data
          const userData = userDoc.data();
          
          // Get or initialize wallet
          const wallet = userData.wallet || { balance: 0, transactions: [] };
          
          // Create a transaction description based on quiz outcome
          const description = isWinner ? 
            `${quizType === 'multiplayer' ? 'Multiplayer' : 'Single Player'} Quiz victory in ${subject}` : 
            `${quizType === 'multiplayer' ? 'Multiplayer' : 'Single Player'} Quiz participation in ${subject}`;
          
          // Create transaction record
          const transactionRecord = {
            id: Date.now().toString(),
            amount: reward,
            type: 'REWARD',
            description,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED'
          };
          
          // Update user document with new wallet balance and transaction
          transaction.update(userRef, {
            'wallet.balance': (wallet.balance || 0) + reward,
            'wallet.lastUpdated': admin.firestore.FieldValue.serverTimestamp(),
            'wallet.transactions': admin.firestore.FieldValue.arrayUnion(transactionRecord)
          });
        });
        
        directUpdateSuccess = true;
        console.log(`Direct Firebase update successful - added ${reward} QCoins to user ${uid}`);
      } catch (dbError) {
        directUpdateError = dbError.message;
        console.error('Direct Firebase update failed:', dbError);
      }
    }
    
    // Determine final status based on which method succeeded
    const success = frontendApiSuccess || directUpdateSuccess;
    
    // Return response with appropriate status and details
    res.status(success ? 200 : 500).json({
      success,
      reward,
      user: uid,
      frontendApiSuccess,
      directUpdateSuccess,
      errors: {
        frontendApi: frontendApiError,
        directUpdate: directUpdateError
      },
      message: success 
        ? `${reward} QCoins added for ${isWinner ? 'winning' : 'participating in'} a ${quizType} quiz` 
        : 'Failed to add QCoins'
    });
  } catch (error) {
    console.error('Error processing quiz reward:', error);
    res.status(500).json({ 
      error: 'Failed to process reward',
      message: error.message
    });
  }
});

/**
 * Sample questions endpoint for testing
 */
app.get('/questions/:subject', (req, res) => {
  const subject = req.params.subject;
  
  // Sample questions
  const questions = [
    {
      id: '1',
      question: 'What is the time complexity of binary search?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswer: 2
    },
    {
      id: '2',
      question: 'Which of the following is not a JavaScript data type?',
      options: ['String', 'Boolean', 'Character', 'Number'],
      correctAnswer: 2
    }
  ];
  
  res.json({ 
    subject,
    questions
  });
});

/**
 * Socket.io Implementation for User Identification
 */
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Store user data in the socket
  let userData = {
    uid: null,
    username: null,
    subject: null
  };
  
  // Matchmaking - Updated to include UID
  socket.on('joinMatchmaking', async ({ subject, username, uid }) => {
    // Store user info including UID
    userData.uid = uid;
    userData.username = username;
    userData.subject = subject;
    
    console.log(`User ${username} (${uid || 'anonymous'}) joined matchmaking for ${subject}`);
    
    // Your existing matchmaking code...
    // When match is found and quiz ends, process rewards:
    
    // This is just a placeholder for where to trigger the rewards
    socket.on('quizEnd', async (results) => {
      // Your existing quiz end logic...
      
      // If both players have UIDs, process rewards
      if (userData.uid && opponentData.uid) {
        try {
          // Process reward for this player
          await processReward(
            userData.uid, 
            results.myScore > results.opponentScore,
            userData.subject,
            results.myScore
          );
          
          // Process reward for opponent
          await processReward(
            opponentData.uid,
            results.opponentScore > results.myScore,
            userData.subject,
            results.opponentScore
          );
        } catch (error) {
          console.error('Error processing rewards:', error);
        }
      }
    });
  });
  
  // Other socket event handlers...
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

/**
 * Helper function to process quiz rewards
 * This function calls the quiz-reward endpoint on the same server
 */
async function processReward(uid, isWinner, subject, score) {
  try {
    console.log(`Internal call to process reward for user ${uid}`);
    
    // Make an internal request to our own endpoint
    const fetch = require('node-fetch');
    const serverUrl = process.env.SERVER_URL || 'http://localhost:8080';
    
    const response = await fetch(`${serverUrl}/quiz-reward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        quizType: 'multiplayer',
        outcome: isWinner ? 'win' : 'lose',
        subject,
        score
      })
    });
    
    const result = await response.json();
    console.log('Reward processing result:', result);
    
    return result.success;
  } catch (error) {
    console.error(`Failed to process reward for user ${uid}:`, error);
    return false;
  }
}

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Quizzo server running on port ${PORT}`);
  console.log(`Frontend API URL: ${FRONTEND_URL}`);
}); 