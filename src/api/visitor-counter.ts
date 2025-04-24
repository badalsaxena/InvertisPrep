// Simple API for managing visitor count
// This is a server-side rendered file that handles the visitor counter

import fs from 'fs';
import path from 'path';

// Define the path to the counter file
const counterFilePath = path.join(process.cwd(), 'data', 'visitor-count.json');

// Ensure the data directory exists
const ensureDataDirectory = (): void => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Get the current visitor count
export const getVisitorCount = (): number => {
  try {
    ensureDataDirectory();
    
    // If the file doesn't exist, create it with initial count
    if (!fs.existsSync(counterFilePath)) {
      const initialData = { count: 953 };
      fs.writeFileSync(counterFilePath, JSON.stringify(initialData, null, 2));
      return initialData.count;
    }
    
    // Read and parse the counter file
    const counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf8'));
    return counterData.count || 953;
  } catch (error) {
    console.error('Error reading visitor count:', error);
    return 953; // Default fallback value
  }
};

// Increment the visitor count
export const incrementVisitorCount = (): number => {
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