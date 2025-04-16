const questions = require('../quizzo-backend/questions');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subject, questionId, answerIndex } = req.body;

  // Validate request parameters
  if (!subject || !questionId || answerIndex === undefined) {
    return res.status(400).json({
      error: 'Missing required parameters',
      required: ['subject', 'questionId', 'answerIndex']
    });
  }

  // Find the subject question set
  const subjectQuestions = questions[subject];
  if (!subjectQuestions) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  // Find the specific question
  const question = subjectQuestions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Check if the answer is correct
  const isCorrect = question.correctAnswer === answerIndex;

  // Return the result
  res.status(200).json({
    correct: isCorrect,
    questionId
  });
}; 