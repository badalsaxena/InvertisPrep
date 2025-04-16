# Quizzo Backend

This is the backend server for the Quizzo multiplayer game. It handles real-time game logic, matchmaking, and question management.

## Features

- Real-time multiplayer using Socket.IO
- Matchmaking system
- Question management
- Score tracking
- Room management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

The server uses Socket.IO for real-time communication. Here are the main events:

### Client to Server Events

- `joinMatchmaking`: Join the matchmaking queue
  ```javascript
  {
    subject: string,  // Subject to play
    username: string  // Player's username
  }
  ```

- `leaveMatchmaking`: Leave the matchmaking queue

- `submitAnswer`: Submit an answer to a question
  ```javascript
  {
    questionId: string,
    answerIndex: number,
    timeElapsed: number
  }
  ```

### Server to Client Events

- `matchmakingStatus`: Current matchmaking status
  ```javascript
  {
    status: 'waiting' | 'matched'
  }
  ```

- `matchFound`: When a match is found
  ```javascript
  {
    room: {
      id: string,
      subject: string,
      players: Array<{
        id: string,
        username: string,
        score: number,
        totalTime: number
      }>
    },
    opponent: string
  }
  ```

- `quizQuestion`: New question for the game
  ```javascript
  {
    question: {
      id: string,
      question: string,
      options: string[],
      correctAnswer: number
    },
    questionCount: number,
    totalQuestions: number
  }
  ```

- `answerResult`: Result of submitted answer
  ```javascript
  {
    correct: boolean,
    score: number
  }
  ```

- `opponentAnswered`: Notification that opponent has answered

- `quizEnd`: Game results
  ```javascript
  {
    myResult: {
      score: number,
      totalTime: number
    },
    opponentResult: {
      score: number,
      totalTime: number
    }
  }
  ```

## Development

The server is built with:
- Node.js
- Express
- Socket.IO
- UUID for room management

## License

MIT 