/**
 * API Handler for Quiz Rewards
 * This endpoint receives requests from the Quizzo server to award QCoins
 */
import { addQuizReward } from '@/services/walletService';
import { updateQuizProgress } from '@/services/academicProgressService';

// This would be used in a server environment
const API_SECRET = import.meta.env.VITE_QUIZZO_API_SECRET || 'development-secret-key';

/**
 * Verify the API key from the request
 */
function verifyApiKey(apiKey: string): boolean {
  return apiKey === API_SECRET;
}

/**
 * Handler for quiz reward requests
 */
export async function handleQuizReward(request: Request): Promise<Response> {
  // Check if it's a POST request
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Verify the API key
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || !verifyApiKey(apiKey)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    // Parse the request body
    const body = await request.json();
    const { uid, amount, isWinner, quizType, subject, score } = body;
    
    // Validate required parameters
    if (!uid || amount === undefined || isWinner === undefined || !quizType || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Process the reward
    const rewardResult = await addQuizReward(uid, amount, isWinner, quizType, subject);
    
    // Update academic progress
    const correctAnswers = Math.floor(score / 10); // Assume 10 points per correct answer
    await updateQuizProgress(uid, {
      subject,
      score,
      correctAnswers,
      totalQuestions: 10, // Assuming 10 questions per quiz
      isWin: isWinner,
      timeSpent: 0 // This would ideally come from the request
    });
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `${amount} QCoins added for ${isWinner ? 'winning' : 'participating in'} a ${quizType} quiz`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing quiz reward:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Failed to process reward', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// If you're using a framework like Express, you would export it like this:
/*
export default function handler(req, res) {
  const { uid, amount, isWinner, quizType, subject, score } = req.body;
  
  // Verify API key
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Validate request
  if (!uid || amount === undefined || isWinner === undefined || !quizType || !subject) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  // Process reward
  try {
    // Add QCoins
    const rewardResult = await addQuizReward(uid, amount, isWinner, quizType, subject);
    
    // Update academic progress
    const correctAnswers = Math.floor(score / 10);
    await updateQuizProgress(uid, {
      subject,
      score,
      correctAnswers,
      totalQuestions: 10,
      isWin: isWinner,
      timeSpent: 0
    });
    
    return res.status(200).json({
      success: true,
      message: `${amount} QCoins added for ${isWinner ? 'winning' : 'participating in'} a ${quizType} quiz`
    });
  } catch (error) {
    console.error('Error processing quiz reward:', error);
    return res.status(500).json({ error: 'Failed to process reward' });
  }
}
*/ 