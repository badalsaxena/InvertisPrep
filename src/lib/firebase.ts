import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBdcXEr2ifYK_fwEYNqDmB4QJ9Rn-RLUvw",
  authDomain: "invertisprep.firebaseapp.com",
  projectId: "invertisprep",
  storageBucket: "invertisprep.firebasestorage.app",
  messagingSenderId: "1015044440637",
  appId: "1:1015044440637:web:a5228a130bd6746fd46054",
  measurementId: "G-96C13WC076"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };
export default app; 

