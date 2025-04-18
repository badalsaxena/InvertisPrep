/**
 * Test Integration
 * 
 * This file contains functions to test the integration between the frontend
 * and the local backend server running on port 8080.
 */

/**
 * Test if the socket connection works
 */
export async function testSocketConnection(): Promise<boolean> {
  try {
    const { io } = await import('socket.io-client');
    
    return new Promise((resolve, reject) => {
      const socket = io('http://localhost:8080', {
        transports: ['websocket', 'polling'],
        timeout: 5000
      });
      
      // Set a timeout to prevent hanging if the server is unreachable
      const timeoutId = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Connection timeout'));
      }, 5000);
      
      socket.on('connect', () => {
        console.log('Socket connection successful');
        clearTimeout(timeoutId);
        socket.disconnect();
        resolve(true);
      });
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection failed:', error);
        clearTimeout(timeoutId);
        socket.disconnect();
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error testing socket connection:', error);
    return false;
  }
}

/**
 * Test if the API endpoints are accessible
 */
export async function testApiEndpoints(): Promise<{
  health: boolean;
  questions: boolean;
}> {
  const result = {
    health: false,
    questions: false
  };
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8080/');
    result.health = healthResponse.ok;
    
    // Test questions endpoint
    const questionsResponse = await fetch('http://localhost:8080/questions/c');
    result.questions = questionsResponse.ok;
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
  
  return result;
}

/**
 * Test the reward endpoint functionality
 */
export async function testRewardEndpoint(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8080/quiz-reward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: 'test-user-123',
        quizType: 'single',
        outcome: 'win',
        subject: 'c',
        score: 80
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reward endpoint error:', errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('Reward endpoint response:', result);
    return true;
  } catch (error) {
    console.error('Error testing reward endpoint:', error);
    return false;
  }
} 