/**
 * Authentication Service
 * Handles Firebase token management and user authentication
 */

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import apiClient from './apiClient';

/**
 * User profile interface
 */
export interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  uid: string;
  wallet?: {
    balance: number;
  };
  createdAt?: string;
  lastLogin?: string;
  course?: string;
  bio?: string;
  eduLevel?: string;
}

/**
 * Set up authentication token interceptor
 * This will automatically attach auth tokens to all API requests
 */
export const setupAuthTokenInterceptor = () => {
  const auth = getAuth();
  
  try {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log('Auth state changed: User authenticated, getting token');
          
          // Get token when user is authenticated
          const token = await user.getIdToken();
          
          // Set token in API client
          apiClient.setAuthToken(token);
          
          // Also sync user profile with backend
          syncUserProfile(user)
            .then(profile => {
              console.log('User profile synced successfully');
            })
            .catch(error => {
              // Non-fatal error, just log it
              console.error('Failed to sync user profile, but continuing:', error);
            });
        } else {
          console.log('Auth state changed: User signed out');
          // Clear token when user signs out
          apiClient.clearAuthToken();
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        // Don't rethrow to prevent breaking the app
      }
    }, (error) => {
      console.error('Auth state observer error:', error);
    });
    
    // Clean up function for testing
    return unsubscribe;
  } catch (error) {
    console.error('Failed to set up auth state observer:', error);
    // Don't rethrow - this initialization should not block the app
  }
};

/**
 * Synchronize user profile with backend
 */
export const syncUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    console.log(`Syncing profile for user ${user.uid}`);
    
    // First check if profile exists
    let profileExists = false;
    let profile = null;
    
    try {
      console.log('Checking if profile exists...');
      const response = await apiClient.get<UserProfile>(`/api/users/${user.uid}`);
      
      if (response.status === 200 && response.data) {
        console.log('Profile found on the backend');
        profileExists = true;
        profile = response.data;
      }
    } catch (err) {
      console.log('Profile not found or error occurred:', err);
      // Continue to profile creation if needed
    }
    
    // If profile doesn't exist or couldn't be retrieved, create it
    if (!profileExists) {
      console.log('Profile does not exist, creating new profile...');
      profile = await createUserProfile(user);
      
      if (profile) {
        console.log('Successfully created user profile');
      } else {
        console.error('Failed to create user profile');
      }
    }
    
    return profile;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    
    // As a fallback for testing, create a mock profile
    console.log('Creating fallback mock profile');
    return {
      displayName: user.displayName || 'User',
      email: user.email || 'user@example.com',
      photoURL: user.photoURL || undefined,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      bio: '',
      eduLevel: '',
      wallet: { balance: 100 }
    };
  }
};

/**
 * Create a new user profile on the backend
 */
export const createUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    console.log('Attempting to create user profile for:', user.uid);
    const profileData = {
      displayName: user.displayName || 'User',
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid
    };
    
    try {
      const response = await apiClient.post<UserProfile>('/api/users', profileData);
      
      if (response.data) {
        console.log('Created user profile:', response.data);
        return response.data;
      }
    } catch (err) {
      console.log('Failed to create profile via POST, trying PUT...');
      
      // Try PUT if POST failed
      try {
        const putResponse = await apiClient.put<UserProfile>(`/api/users/${user.uid}`, profileData);
        
        if (putResponse.data) {
          console.log('Created user profile via PUT:', putResponse.data);
          return putResponse.data;
        }
      } catch (putErr) {
        console.log('PUT request also failed');
      }
    }
    
    // If backend endpoints failed, use local mock data for testing
    console.log('Creating mock profile data for testing');
    const mockProfile: UserProfile = {
      displayName: profileData.displayName,
      email: profileData.email || 'user@example.com',
      photoURL: profileData.photoURL || undefined,
      uid: profileData.uid,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      bio: '',
      eduLevel: '',
      wallet: { balance: 100 }
    };
    
    return mockProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    // Return mock data as fallback
    return {
      displayName: user.displayName || 'User',
      email: user.email || 'user@example.com',
      photoURL: user.photoURL || undefined,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      bio: '',
      eduLevel: '',
      wallet: { balance: 100 }
    };
  }
};

/**
 * Get the current user's profile from the backend
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log(`Attempting to fetch profile for user ${uid}`);
    
    // First try the /api/users/:uid endpoint
    try {
      const response = await apiClient.get<UserProfile>(`/api/users/${uid}`);
      
      if (response.data) {
        console.log('Profile fetched successfully from /api/users/:uid');
        return response.data;
      }
    } catch (err) {
      console.log('First endpoint attempt failed, trying alternatives...');
    }
    
    // Try alternative endpoints if your backend uses a different structure
    const alternativeEndpoints = [
      `/api/users/profile/${uid}`,     // Common alternative
      `/api/profile/${uid}`,           // Another common pattern
      `/api/user-profiles/${uid}`      // Another possibility
    ];
    
    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`Trying alternative endpoint: ${endpoint}`);
        const response = await apiClient.get<UserProfile>(endpoint);
        
        if (response.data) {
          console.log(`Profile fetched successfully from ${endpoint}`);
          return response.data;
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} failed`);
        // Continue to next endpoint
      }
    }
    
    // If we got here, all endpoints failed
    console.error('All profile endpoints failed');
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Get user wallet information
 */
export const getUserWallet = async (uid: string): Promise<{ balance: number } | null> => {
  try {
    console.log(`Fetching wallet for user ${uid} directly from Firestore`);
    
    // Import Firestore functions
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    // Get user document from Firestore
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User exists, get wallet data
      const userData = userDoc.data();
      const wallet = userData.wallet || { balance: 0 };
      console.log('Wallet data retrieved from Firestore:', wallet);
      return wallet;
    } else {
      // User document doesn't exist, create it with a new wallet
      console.log('User document not found, creating new wallet');
      const newUserData = {
        wallet: { balance: 0 },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Create the user document with wallet
      try {
        await setDoc(userDocRef, newUserData);
        console.log('Created new user document with wallet');
        return newUserData.wallet;
      } catch (error) {
        console.error('Error creating user document:', error);
        return { balance: 0 };
      }
    }
  } catch (error) {
    console.error('Error accessing Firestore for wallet data:', error);
    // Return a default wallet as fallback
    return { balance: 0 };
  }
};

/**
 * Get user transaction history
 */
export const getUserTransactions = async (
  uid: string,
  page = 1,
  limit = 10
): Promise<{ transactions: any[]; total: number } | null> => {
  try {
    const response = await apiClient.get<{ transactions: any[]; total: number }>(
      `/api/users/${uid}/wallet/transactions?page=${page}&limit=${limit}`
    );
    
    if (response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return null;
  }
}; 