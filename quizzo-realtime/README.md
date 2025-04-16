# Quizzo Real-time WebSocket Server

This is the real-time WebSocket server for the Quizzo multiplayer game. It handles matchmaking, game rooms, and real-time communication between players.

## Features

- Real-time matchmaking system
- Room management for multiplayer games
- WebSocket communication using Socket.IO
- Integration with Quizzo API for questions and answer validation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:

```
PORT=8080
API_URL=https://your-vercel-app.vercel.app/api
```

Replace `your-vercel-app.vercel.app` with your actual Vercel deployment URL.

## Running Locally

```bash
npm run dev
```

## Deployment

### Heroku

This server includes a Procfile for Heroku deployment. To deploy:

1. Create a Heroku app
2. Connect your repository
3. Add environment variables in the Heroku dashboard
4. Deploy the main branch

### Railway, Render, or other platforms

Follow the platform-specific deployment instructions, ensuring that you set the environment variables properly.

## Important Notes

- This server connects to the Vercel API endpoints to fetch questions and validate answers.
- Make sure to update the API_URL in the .env file when deploying to production.
- The WebSocket server needs to run separately from Vercel since Vercel doesn't support persistent WebSocket connections. 