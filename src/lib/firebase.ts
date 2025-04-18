import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from '@/utils/environment';

// Fallback config for development
const fallbackConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Get Firebase config from environment or use fallback
let firebaseConfig;
try {
  firebaseConfig = getFirebaseConfig() || fallbackConfig;
  
  // Validate that we have the minimum required config
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('Missing required Firebase configuration. Using hardcoded values for development.');
    // Use hardcoded values as a last resort for development
    firebaseConfig = {
      apiKey: "AIzaSyBdcXEr2ifYK_fwEYNqDmB4QJ9Rn-RLUvw",
      authDomain: "invertisprep.firebaseapp.com",
      projectId: "invertisprep",
      storageBucket: "invertisprep.appspot.com",
      messagingSenderId: "1015044440637",
      appId: "1:1015044440637:web:a5228a130bd6746fd46054"
    };
  }
} catch (error) {
  console.error('Error loading Firebase config:', error);
  
  // Use hardcoded values as a fallback
  firebaseConfig = {
    apiKey: "AIzaSyBdcXEr2ifYK_fwEYNqDmB4QJ9Rn-RLUvw",
    authDomain: "invertisprep.firebaseapp.com",
    projectId: "invertisprep",
    storageBucket: "invertisprep.appspot.com",
    messagingSenderId: "1015044440637",
    appId: "1:1015044440637:web:a5228a130bd6746fd46054"
  };
}

// Log the config we're using (without sensitive values)
console.log('Using Firebase config with project:', firebaseConfig.projectId);

// Initialize Firebase with error handling
let app;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. See console for details.');
}

export { auth, db };
export default app; 

