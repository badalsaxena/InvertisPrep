import { io, Socket } from 'socket.io-client';

// Define event types
export interface QuizUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface QuizRoom {
  id: string;
  users: QuizUser[];
  subject: string;
  state: 'waiting' | 'playing' | 'completed';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number; // Only shown at the end or after answering
}

export interface QuizAnswer {
  questionId: string;
  answerIndex: number;
  timeElapsed: number; // ms taken to answer
}

export interface QuizResult {
  userId: string;
  score: number;
  answers: QuizAnswer[];
  totalTime: number;
}

// Socket events
export enum QuizSocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Matchmaking events
  JOIN_MATCHMAKING = 'join_matchmaking',
  LEAVE_MATCHMAKING = 'leave_matchmaking',
  MATCH_FOUND = 'match_found',
  
  // Quiz events
  QUIZ_START = 'quiz_start',
  QUIZ_QUESTION = 'quiz_question',
  SUBMIT_ANSWER = 'submit_answer',
  ANSWER_RESULT = 'answer_result',
  OPPONENT_ANSWERED = 'opponent_answered',
  QUIZ_END = 'quiz_end',
  
  // Room events
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_STATE = 'room_state',
  
  // Error events
  ERROR = 'error'
}

class QuizzoSocketService {
  private socket: Socket | null = null;
  
  // Get the server URL from environment variables or use dynamic detection
  private getServerUrl(): string {
    // First check if explicitly set in environment
    if (import.meta.env.VITE_QUIZZO_SERVER_URL) {
      return import.meta.env.VITE_QUIZZO_SERVER_URL;
    }
    
    // Otherwise, derive from current host dynamically
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname; // This will be the actual host IP/domain
    const port = '5000'; // Default Quizzo backend port
    
    return `${protocol}//${hostname}:${port}`;
  }
  
  // Connect to socket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serverUrl = this.getServerUrl();
        console.log(`Connecting to Quizzo server at: ${serverUrl}`);
        
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'], // Prefer WebSocket but fallback to polling
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });
        
        this.socket.on(QuizSocketEvents.CONNECT, () => {
          console.log('Connected to Quizzo server');
          resolve();
        });
        
        this.socket.on(QuizSocketEvents.DISCONNECT, () => {
          console.log('Disconnected from Quizzo server');
        });
        
        this.socket.on(QuizSocketEvents.ERROR, (error) => {
          console.error('Socket error:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Failed to connect to Quizzo server:', error);
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
  joinMatchmaking(subject: string, username: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(QuizSocketEvents.JOIN_MATCHMAKING, { subject, username });
  }
  
  // Leave matchmaking queue
  leaveMatchmaking(): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(QuizSocketEvents.LEAVE_MATCHMAKING);
  }
  
  // Submit answer for a question
  submitAnswer(questionId: string, answerIndex: number, timeElapsed: number): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(QuizSocketEvents.SUBMIT_ANSWER, {
      questionId,
      answerIndex,
      timeElapsed
    });
  }
  
  // Event listeners
  onMatchFound(callback: (room: QuizRoom) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.MATCH_FOUND, callback);
  }
  
  onQuizStart(callback: () => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.QUIZ_START, callback);
  }
  
  onQuizQuestion(callback: (question: QuizQuestion) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.QUIZ_QUESTION, callback);
  }
  
  onAnswerResult(callback: (result: { correct: boolean, score: number }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.ANSWER_RESULT, callback);
  }
  
  onOpponentAnswered(callback: () => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.OPPONENT_ANSWERED, callback);
  }
  
  onQuizEnd(callback: (results: { myResult: QuizResult, opponentResult: QuizResult }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.on(QuizSocketEvents.QUIZ_END, callback);
  }
  
  // Remove event listeners
  removeAllListeners(): void {
    if (!this.socket) {
      return;
    }
    
    this.socket.removeAllListeners();
    // Add back the core listeners
    this.socket.on(QuizSocketEvents.CONNECT, () => {
      console.log('Connected to Quizzo server');
    });
    
    this.socket.on(QuizSocketEvents.DISCONNECT, () => {
      console.log('Disconnected from Quizzo server');
    });
    
    this.socket.on(QuizSocketEvents.ERROR, (error) => {
      console.error('Socket error:', error);
    });
  }
}

// Create a singleton instance
const quizzoSocketService = new QuizzoSocketService();
export default quizzoSocketService; 