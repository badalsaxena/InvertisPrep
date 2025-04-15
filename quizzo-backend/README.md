# Quizzo Backend Service

This is the backend service for the Quizzo multiplayer quiz game feature of InvertisPrep. It handles real-time matchmaking, quiz sessions, and scoring for the multiplayer quiz battles.

## Features

- Real-time matchmaking based on subject selection
- Room-based multiplayer quiz sessions
- Automatic scoring based on correctness and answer speed
- Support for multiple subjects (C Programming, DSA, Python, Java, Web Dev)
- Robust handling of user connections and disconnections
- Network hosting for LAN/WAN multiplayer support

## Tech Stack

- Node.js
- Express
- Socket.IO (WebSockets)
- ES Modules

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quizzo-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a .env file:
   ```bash
   cp .env.example .env
   ```

4. Modify the .env file according to your environment:
   ```
   PORT=5000
   HOST=0.0.0.0  # 0.0.0.0 means listen on all network interfaces
   CLIENT_URL=*  # Allow any origin for CORS
   ```

## Running the Server

### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the server with nodemon for auto-reloading on file changes.

### Production Mode

```bash
npm start
# or
yarn start
```

The server will start on the port specified in your .env file (default: 5000).

## Network Hosting

The server is configured to listen on all network interfaces by default (`0.0.0.0`). This allows it to be accessible from other devices on the same network.

When the server starts, it will display available IP addresses:

```
Server running on port 5000
Server is accessible at:
- Local:            http://localhost:5000
- Network:          http://192.168.1.100:5000
```

You can use any of these URLs to connect from other devices on the network.

### Checking Server Status

To check the server status and get connection information:

```
GET /status
```

This endpoint returns a JSON with information about:
- Server uptime
- Active connections
- Active quiz rooms
- Users in matchmaking queues
- Available network addresses

## Connecting Clients

To connect from a client application:

1. Make sure the client and server are on the same network
2. Use the server's IP address in your client configuration:
   ```javascript
   // In your frontend project, set this environment variable
   VITE_QUIZZO_SERVER_URL=http://192.168.1.100:5000
   ```
3. Alternatively, the client will auto-detect the server based on the hostname

## API Endpoints

- `GET /` - Health check endpoint
- `GET /status` - Server status and connection information

## Socket.IO Events

### Connection Events
- `connect` - User connected to server
- `disconnect` - User disconnected from server

### Matchmaking Events
- `join_matchmaking` - User joins matchmaking queue with subject preference
- `leave_matchmaking` - User leaves matchmaking queue
- `match_found` - Match found between two users

### Quiz Events
- `quiz_start` - Quiz session starts
- `quiz_question` - New question is sent to users
- `submit_answer` - User submits an answer
- `answer_result` - Result of user's answer
- `opponent_answered` - Notification that opponent has answered
- `quiz_end` - Quiz session ends with results

## Questions Structure

Questions are organized by subject and follow this structure:

```javascript
{
  id: "unique_id",
  question: "Question text?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 2  // Index of correct answer (0-based)
}
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 