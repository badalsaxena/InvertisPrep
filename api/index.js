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

  // Return API status
  res.status(200).json({
    status: 'Quizzo API is running',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api',
        method: 'GET',
        description: 'Health check and API info'
      },
      {
        path: '/api/questions/:subject',
        method: 'GET',
        description: 'Get random questions for a subject'
      },
      {
        path: '/api/validate-answer',
        method: 'POST',
        description: 'Validate an answer for a question'
      }
    ]
  });
}; 