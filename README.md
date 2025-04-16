# Quizzo - Multiplayer Quiz Game

A real-time multiplayer quiz application where students can test their knowledge in various subjects including C, Data Structures & Algorithms, Python, Java, and Web Development.

## 🌟 Features

- **Solo Quiz Mode**: Practice on your own with timed quizzes
- **Multiplayer Mode**: Challenge other students in real-time
- **Subject Selection**: Choose from C, DSA, Python, Java, and Web Development
- **Real-time Matchmaking**: Find opponents instantly
- **Leaderboards**: Track your progress and rankings
- **Mobile-Friendly**: Play on any device

## 🏗️ Architecture

Quizzo uses a modern, scalable architecture:

- **Frontend**: React.js with Vite, TypeScript, and TailwindCSS
- **API Service**: Serverless functions (hosted on Vercel)
- **Real-time Server**: Node.js with Socket.IO (hosted separately)

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│    Frontend     │◄────►│   API Service   │      │  Real-time      │
│    (Vercel)     │      │    (Vercel)     │      │    Server       │
│                 │      │                 │      │                 │
└────────┬────────┘      └─────────────────┘      └────────▲────────┘
         │                                                  │
         │                                                  │
         └──────────────────────────────────────────────────┘
                           WebSocket Connection
```

## 🚀 Deployment

The application is split into two deployable parts:

### Frontend & API (Vercel)

The main application and API endpoints are deployed to Vercel:

1. **Frontend**: React application with UI components
2. **API Endpoints**: Serverless functions for:
   - `/api`: Health check and API information
   - `/api/questions/[subject]`: Get random questions for a specific subject
   - `/api/validate-answer`: Validate submitted answers

### Real-time Server (External)

The WebSocket server for real-time multiplayer functionality is deployed separately:

- Hosted on platforms like Render, Heroku, or Railway
- Handles matchmaking, live game sessions, and real-time updates
- Located in the `quizzo-realtime` directory

## 🛠️ Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Automatic Setup

Run the installation script:

```bash
node install.js
```

This will:
1. Set up environment files
2. Install dependencies for both the main app and real-time server
3. Build the project

### Manual Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/quizzo.git
   cd quizzo
   ```

2. **Install main app dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create a `.env` file in the root:
   ```
   VITE_API_URL=/api
   VITE_QUIZZO_REALTIME_URL=http://localhost:8080
   ```

4. **Setup real-time server**:
   ```bash
   cd quizzo-realtime
   npm install
   ```

5. **Configure real-time server**:
   Create a `.env` file in the `quizzo-realtime` directory:
   ```
   PORT=8080
   API_URL=http://localhost:5173/api
   ```

## 🏃‍♂️ Running Locally

You need to run both the main app and the real-time server:

1. **Start the main app** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Start the real-time server** (in another terminal):
   ```bash
   cd quizzo-realtime
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 🌐 Deployment Instructions

### Deploying the Frontend & API to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Deploying the Real-time Server

#### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set the following:
   - Root Directory: `quizzo-realtime`
   - Start Command: `node server.js`
   - Add environment variables from `.env`

#### Heroku

1. Create a new app on Heroku
2. Deploy from your repository, specifying the subdirectory:
   ```bash
   git subtree push --prefix quizzo-realtime heroku main
   ```
3. Set environment variables in the Heroku dashboard

#### Railway

1. Create a new project
2. Connect your GitHub repository
3. Specify the `quizzo-realtime` directory
4. Add environment variables

## 📝 Environment Variables

### Main App (.env)

- `VITE_API_URL`: URL for the API endpoints (default: `/api` for local, full URL for production)
- `VITE_QUIZZO_REALTIME_URL`: URL for the real-time WebSocket server

### Real-time Server (.env)

- `PORT`: Port for the WebSocket server (default: 8080)
- `API_URL`: URL to the API endpoints for question retrieval

## 👩‍💻 Development

### Project Structure

```
quizzo/
├── public/            # Static assets
├── src/               # Frontend source code
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Application pages
│   ├── services/      # API & socket services
│   └── types/         # TypeScript type definitions
├── api/               # Serverless API endpoints
│   ├── index.js       # API info endpoint
│   ├── questions/     # Question retrieval endpoints
│   └── validate-answer.js # Answer validation endpoint
├── quizzo-backend/    # Backend shared code
│   └── questions/     # Question database
└── quizzo-realtime/   # Real-time WebSocket server
    ├── server.js      # Main server code
    └── package.json   # Server dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Socket.IO Client
- Tailwind CSS
- Shadcn UI Components

### Backend
- Node.js
- Express
- Socket.IO
- UUID for room management

## License

MIT

## Screenshots

[Screenshots will be added here]

---

Made with ❤️ by Ahqaf and Team

