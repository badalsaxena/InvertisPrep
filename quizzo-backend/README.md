# Quizzo Multiplayer Backend

This is the backend server for the Quizzo multiplayer game, a real-time quiz battle application.

## Features

- Real-time multiplayer gameplay using Socket.IO
- Matchmaking system for finding opponents
- Question management for different subjects
- Score tracking and game results
- Support for multiple concurrent games

## Installation

1. Clone the repository
2. Navigate to the backend directory:

```bash
cd quizzo-backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following content:

```
PORT=5000
```

## Running the Server

Start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will be running at http://localhost:5000

## API

The backend uses Socket.IO for real-time communication with the frontend. Here are the main Socket.IO events:

### Client to Server Events

- `joinMatchmaking`: Join the matchmaking queue with username and subject
- `leaveMatchmaking`: Leave the matchmaking queue
- `submitAnswer`: Submit an answer to a question

### Server to Client Events

- `matchmakingStatus`: Status of matchmaking
- `matchFound`: Notifies players when a match is found
- `quizStart`: Signals the start of a quiz
- `quizQuestion`: Sends a new question to players
- `answerResult`: Result of a submitted answer
- `opponentAnswered`: Notifies when opponent has answered
- `opponentLeft`: Notifies when opponent has left the game
- `quizEnd`: End of the quiz with results

## Subject Categories

The quiz supports questions in several categories:

- C Programming
- Data Structures & Algorithms (DSA)
- Python
- Java
- Web Development

## Architecture

- `index.js`: Main server file with Socket.IO setup
- `questions.js`: Database of quiz questions by subject

## License

MIT 