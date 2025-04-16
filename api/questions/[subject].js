const questions = require('../../quizzo-backend/questions');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the subject from the URL parameter
  const { subject } = req.query;

  // Check if the subject is valid
  if (!subject || !questions[subject]) {
    return res.status(404).json({
      error: 'Subject not found',
      availableSubjects: Object.keys(questions)
    });
  }

  // Select 10 random questions for the subject
  const subjectQuestions = questions[subject];
  const shuffled = [...subjectQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 10).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    // Don't expose the correct answer to the client
    correctAnswer: undefined 
  }));

  // Return the questions
  res.status(200).json({ 
    subject,
    questions: selectedQuestions
  });
}; 