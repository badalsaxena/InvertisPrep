import { io, Socket } from 'socket.io-client';

// Define event types
export interface QuizUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface QuizRoom {
  id: string;
  players: QuizUser[];
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface QuizResult {
  userId: string;
  score: number;
  totalTime: number;
}

// Socket events
export enum QuizSocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Matchmaking events
  JOIN_MATCHMAKING = 'joinMatchmaking',
  LEAVE_MATCHMAKING = 'leaveMatchmaking',
  MATCH_FOUND = 'matchFound',
  
  // Quiz events
  QUIZ_START = 'quizStart',
  QUIZ_QUESTION = 'quizQuestion',
  SUBMIT_ANSWER = 'submitAnswer',
  ANSWER_RESULT = 'answerResult',
  OPPONENT_ANSWERED = 'opponentAnswered',
  QUIZ_END = 'quizEnd',
  
  // Room events
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_STATE = 'room_state',
  
  // Error events
  ERROR = 'error'
}

class QuizzoSocketService {
  private socket: Socket | null = null;
  
  // Get the server URL
  private getRealtimeServerUrl(): string {
    // First check if explicitly set in environment
    if (import.meta.env.VITE_QUIZZO_REALTIME_URL) {
      return import.meta.env.VITE_QUIZZO_REALTIME_URL;
    }
    
    // Fallback for development
    return 'http://localhost:8080';
  }
  
  // Connect to socket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serverUrl = this.getRealtimeServerUrl();
        console.log(`Connecting to Quizzo real-time server at: ${serverUrl}`);
        
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });
        
        this.socket.on('connect', () => {
          console.log('Connected to Quizzo real-time server');
          resolve();
        });
        
        this.socket.on('disconnect', () => {
          console.log('Disconnected from Quizzo real-time server');
        });
        
        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Failed to connect to Quizzo real-time server:', error);
        reject(error);
      }
    });
  }
  
  // Disconnect from socket server
  disconnect(): void {
    if (!this.socket) {
      return;
    }
    
    this.socket.disconnect();
    this.socket = null;
  }
  
  // Join matchmaking queue with subject selection
  joinMatchmaking(subject: string, username: string, uid?: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    // Include uid with the matchmaking request
    // This allows the backend to identify the user for rewards
    this.socket.emit('joinMatchmaking', { subject, username, uid });
  }
  
  // Leave matchmaking queue
  leaveMatchmaking(): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('leaveMatchmaking');
  }
  
  // Submit answer for a question
  submitAnswer(questionId: string, answerIndex: number, timeElapsed: number): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('submitAnswer', {
      questionId,
      answerIndex,
      timeElapsed
    });
  }
  
  // Event listeners
  onMatchmakingStatus(callback: (status: { status: string }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('matchmakingStatus', callback);
  }
  
  onMatchFound(callback: (data: { roomId: string, subject: string, opponent: string, players: QuizUser[] }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('matchFound', callback);
  }
  
  onQuizStart(callback: () => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('quizStart', callback);
  }
  
  onQuizQuestion(callback: (data: { question: QuizQuestion, questionCount: number, totalQuestions: number }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('quizQuestion', callback);
  }
  
  onAnswerResult(callback: (result: { correct: boolean, score: number }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('answerResult', callback);
  }
  
  onOpponentAnswered(callback: () => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('opponentAnswered', callback);
  }
  
  onOpponentLeft(callback: () => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('opponentLeft', callback);
  }
  
  onError(callback: (error: { message: string }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('error', callback);
  }
  
  onQuizEnd(callback: (results: { myResult: QuizResult, opponentResult: QuizResult }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on('quizEnd', callback);
  }
  
  // Remove event listeners
  removeAllListeners(): void {
    if (!this.socket) {
      return;
    }
    
    this.socket.removeAllListeners();
    
    // Add back the core listeners
    this.socket.on('connect', () => {
      console.log('Connected to Quizzo real-time server');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from Quizzo real-time server');
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
}

// Create a singleton instance
const quizzoSocketService = new QuizzoSocketService();
export default quizzoSocketService; 