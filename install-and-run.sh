#!/bin/bash

echo "=== Quizzo Multiplayer Installation ==="
echo ""
echo "This script will install and run both the backend and frontend components."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed. Please install Node.js and npm first."
  echo "Visit https://nodejs.org/en/download/ to download and install Node.js."
  exit 1
fi

echo "=== Installing backend dependencies ==="
cd quizzo-backend
npm install
if [ $? -ne 0 ]; then
  echo "Error installing backend dependencies."
  exit 1
fi
echo "Backend dependencies installed successfully."
echo ""

echo "=== Installing frontend dependencies ==="
cd ..
npm install
if [ $? -ne 0 ]; then
  echo "Error installing frontend dependencies."
  exit 1
fi
echo "Frontend dependencies installed successfully."
echo ""

echo "=== Starting backend and frontend ==="
echo ""

# Start backend
cd quizzo-backend
echo "Starting backend server..."
gnome-terminal -- npm run dev 2>/dev/null || xterm -e "npm run dev" 2>/dev/null || open -a Terminal.app npm run dev 2>/dev/null || npm run dev &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 3

# Start frontend
cd ..
echo "Starting frontend server..."
gnome-terminal -- npm run dev 2>/dev/null || xterm -e "npm run dev" 2>/dev/null || open -a Terminal.app npm run dev 2>/dev/null || npm run dev &
FRONTEND_PID=$!

echo "Both backend and frontend should now be starting."
echo "Backend will run on http://localhost:5000"
echo "Frontend will typically run on http://localhost:5173"

echo ""
echo "Please wait for both services to start, and then you can access the application in your browser."
echo ""

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait 