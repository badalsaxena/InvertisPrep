/**
 * Environment variables utility for Quizzo application
 */

/**
 * Get the API URL from environment variables or use a default
 */
export const getApiUrl = (): string => {
  // For local development with Vite
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For production
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check if we can detect the server in various ways
  // Some servers run on port 3000
  try {
    // Try to fetch from port 3000
    fetch('http://localhost:3000/api/health')
      .then(response => {
        console.log('Port 3000 responded with status:', response.status);
      })
      .catch(err => {
        console.log('Port 3000 check failed:', err);
      });
      
    // Try port 5000 as well
    fetch('http://localhost:5000/api/health')
      .then(response => {
        console.log('Port 5000 responded with status:', response.status);
      })
      .catch(err => {
        console.log('Port 5000 check failed:', err);
      });
  } catch (err) {
    console.log('Port checking failed:', err);
  }
  
  // Default to the local backend URL during development - make sure port is correct
  // Try port 3000 first (most common for Node.js/Express apps)
  return 'http://localhost:3000';
};

/**
 * Get the resources API URL
 */
export const getResourcesApiUrl = (): string => {
  // For local development with Vite
  if (import.meta.env?.VITE_RESOURCES_API_URL) {
    return import.meta.env.VITE_RESOURCES_API_URL;
  }
  
  // For production
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RESOURCES_API_URL) {
    return process.env.NEXT_PUBLIC_RESOURCES_API_URL;
  }
  
  // Default to the local resources backend URL during development - make sure port is correct
  return 'http://localhost:3000';
};

/**
 * Get the WebSocket server URL from environment variables with fallback
 */
export const getRealtimeServerUrl = (): string => {
  return import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.onrender.com';
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  if (import.meta.env?.MODE === 'development') {
    return true;
  }
  
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    return true;
  }
  
  return false;
};

/**
 * Get Firebase configuration
 */
export const getFirebaseConfig = () => {
  // Try to get from environment variables first
  const apiKey = import.meta.env?.VITE_FIREBASE_API_KEY || process.env?.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || process.env?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env?.VITE_FIREBASE_PROJECT_ID || process.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || process.env?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env?.VITE_FIREBASE_APP_ID || process.env?.NEXT_PUBLIC_FIREBASE_APP_ID;
  
  // If we have all the required values from env vars, use them
  if (apiKey && authDomain && projectId && storageBucket && messagingSenderId && appId) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    };
  }
  
  // Otherwise return null, the application should handle this case appropriately
  return null;
}; 