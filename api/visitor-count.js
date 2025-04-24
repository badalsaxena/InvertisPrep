import fs from 'fs';
import path from 'path';

// Define the path to the counter file
const counterFilePath = path.join(process.cwd(), 'data', 'visitor-count.json');

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Get the current visitor count
const getVisitorCount = () => {
  try {
    ensureDataDirectory();
    
    // If the file doesn't exist, create it with initial count
    if (!fs.existsSync(counterFilePath)) {
      const initialData = { count: 0 };
      fs.writeFileSync(counterFilePath, JSON.stringify(initialData, null, 2));
      return initialData.count;
    }
    
    // Read and parse the counter file
    const counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf8'));
    return counterData.count || 0;
  } catch (error) {
    console.error('Error reading visitor count:', error);
    return 0; // Default fallback value
  }
};

// Increment the visitor count
const incrementVisitorCount = () => {
  try {
    ensureDataDirectory();
    
    // Get current count
    const currentCount = getVisitorCount();
    
    // Increment and save
    const newCount = currentCount + 1;
    fs.writeFileSync(counterFilePath, JSON.stringify({ count: newCount }, null, 2));
    
    return newCount;
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return getVisitorCount(); // Return current count if increment fails
  }
};

export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Just get the current count
      const count = getVisitorCount();
      return res.status(200).json({ count });
    } else if (req.method === 'POST') {
      // Increment the count
      const newCount = incrementVisitorCount();
      return res.status(200).json({ count: newCount });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling visitor count request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 