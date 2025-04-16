@echo off
echo === Quizzo Multiplayer Installation ===
echo.
echo This script will install and run both the backend and frontend components.
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Error: npm is not installed. Please install Node.js and npm first.
  echo Visit https://nodejs.org/en/download/ to download and install Node.js.
  goto :EOF
)

echo === Installing backend dependencies ===
cd quizzo-backend
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Error installing backend dependencies.
  goto :EOF
)
echo Backend dependencies installed successfully.
echo.

echo === Installing frontend dependencies ===
cd ..
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Error installing frontend dependencies.
  goto :EOF
)
echo Frontend dependencies installed successfully.
echo.

echo === Starting backend and frontend ===
echo.

REM Start backend in a new terminal window
start cmd /k "cd quizzo-backend && npm run dev"

REM Wait a moment for the backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start cmd /k "npm run dev"

echo Both backend and frontend should now be starting in separate terminal windows.
echo Backend will run on http://localhost:5000
echo Frontend will typically run on http://localhost:5173

echo.
echo Please wait for both services to start, and then you can access the application in your browser.
echo. 