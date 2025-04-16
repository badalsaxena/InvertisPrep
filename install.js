#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}
=======================================
 Quizzo - Multiplayer Quiz Game Setup
=======================================
${colors.reset}`);

// Function to execute commands and handle errors
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.dim}> ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}Error: ${errorMessage || error.message}${colors.reset}`);
    return false;
  }
}

// Check if .env files exist, create them if they don't
function setupEnvFiles() {
  console.log(`\n${colors.bright}${colors.cyan}Setting up environment files...${colors.reset}`);
  
  // Main .env file
  const mainEnvPath = path.join(__dirname, '.env');
  if (!fs.existsSync(mainEnvPath)) {
    console.log(`${colors.yellow}Creating main .env file${colors.reset}`);
    fs.writeFileSync(mainEnvPath, 
      'VITE_API_URL=/api\n' +
      'VITE_QUIZZO_REALTIME_URL=http://localhost:8080\n'
    );
    console.log(`${colors.green}Created .env file${colors.reset}`);
  } else {
    console.log(`${colors.green}Main .env file already exists${colors.reset}`);
  }
  
  // Realtime server .env file
  const realtimeDir = path.join(__dirname, 'quizzo-realtime');
  if (!fs.existsSync(realtimeDir)) {
    console.log(`${colors.yellow}Creating quizzo-realtime directory${colors.reset}`);
    fs.mkdirSync(realtimeDir, { recursive: true });
  }
  
  const realtimeEnvPath = path.join(realtimeDir, '.env');
  if (!fs.existsSync(realtimeEnvPath)) {
    console.log(`${colors.yellow}Creating realtime server .env file${colors.reset}`);
    fs.writeFileSync(realtimeEnvPath, 
      'PORT=8080\n' +
      'API_URL=http://localhost:5173/api\n'
    );
    console.log(`${colors.green}Created realtime server .env file${colors.reset}`);
  } else {
    console.log(`${colors.green}Realtime server .env file already exists${colors.reset}`);
  }
}

// Install dependencies for the main project
function installMainDependencies() {
  console.log(`\n${colors.bright}${colors.cyan}Installing main project dependencies...${colors.reset}`);
  return runCommand('npm install', 'Failed to install main project dependencies');
}

// Install dependencies for the realtime server
function installRealtimeDependencies() {
  console.log(`\n${colors.bright}${colors.cyan}Installing realtime server dependencies...${colors.reset}`);
  const realtimeDir = path.join(__dirname, 'quizzo-realtime');
  
  if (!fs.existsSync(path.join(realtimeDir, 'package.json'))) {
    console.log(`${colors.yellow}Realtime server package.json not found. Skipping dependency installation.${colors.reset}`);
    console.log(`${colors.yellow}Please set up the quizzo-realtime directory first.${colors.reset}`);
    return false;
  }
  
  process.chdir(realtimeDir);
  const success = runCommand('npm install', 'Failed to install realtime server dependencies');
  process.chdir(__dirname);
  return success;
}

// Build the project
function buildProject() {
  console.log(`\n${colors.bright}${colors.cyan}Building the project...${colors.reset}`);
  return runCommand('npm run build', 'Failed to build the project');
}

// Main installation function
async function install() {
  try {
    setupEnvFiles();
    
    // Install dependencies
    const mainInstalled = installMainDependencies();
    if (!mainInstalled) {
      throw new Error('Failed to install main dependencies');
    }
    
    const realtimeInstalled = installRealtimeDependencies();
    // Continue even if realtime dependencies fail - it might not be set up yet
    
    // Build project
    const built = buildProject();
    if (!built) {
      throw new Error('Failed to build the project');
    }
    
    // Print success message
    console.log(`\n${colors.bright}${colors.green}
=======================================
 Installation Completed Successfully!
=======================================
${colors.reset}

${colors.cyan}To start the development server:${colors.reset}
1. In one terminal: ${colors.yellow}npm run dev${colors.reset}
2. In another terminal: ${colors.yellow}cd quizzo-realtime && npm run dev${colors.reset}

${colors.cyan}For deployment:${colors.reset}
- Frontend/API: Deploy to Vercel using the Vercel Dashboard or CLI
- Realtime server: Deploy to Render, Heroku, or Railway

${colors.cyan}Need help?${colors.reset}
Refer to the README.md for more information.
`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}Installation failed:${colors.reset} ${colors.red}${error.message}${colors.reset}

Please check the error messages above and try again.
If you continue to have issues, please open an issue on GitHub.
`);
    process.exit(1);
  }
}

// Run the installation
install(); 