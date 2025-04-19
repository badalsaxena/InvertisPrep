/**
 * User Service
 * Handles user profile operations directly with Firestore
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from './authService';

/**
 * Update user profile information
 */
export const updateProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<boolean> => {
  try {
    console.log(`Updating profile for user ${uid}`);
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing user document
      console.log('Updating existing user document:', updates);
      await updateDoc(userDocRef, {
        ...Object.entries(updates).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>),
        lastUpdated: new Date()
      });
      
      return true;
    } else {
      // Create new user document with profile data
      console.log('User document not found, creating new document with profile data:', updates);
      await setDoc(userDocRef, {
        ...updates,
        createdAt: new Date(),
        lastLogin: new Date(),
        lastUpdated: new Date()
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log(`Getting profile for user ${uid}`);
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        displayName: userData.displayName || 'User',
        email: userData.email || '',
        photoURL: userData.photoURL,
        uid: userData.uid || uid,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLogin: userData.lastLogin?.toDate?.()?.toISOString() || new Date().toISOString(),
        course: userData.course || '',
        bio: userData.bio || '',
        eduLevel: userData.eduLevel || '',
        wallet: userData.wallet || { balance: 0 }
      };
    } else {
      // Create a default profile if it doesn't exist
      console.log('User document not found, creating default profile');
      
      // Create a default profile
      const defaultProfile: UserProfile = {
        displayName: 'User',
        email: '',
        uid: uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        course: '',
        bio: '',
        eduLevel: '',
        wallet: { balance: 0 }
      };
      
      try {
        // Save the default profile to Firestore
        await setDoc(userDocRef, {
          ...defaultProfile,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        
        console.log('Created default profile for user');
        return defaultProfile;
      } catch (createError) {
        console.error('Error creating default profile:', createError);
        // Return the default profile anyway
        return defaultProfile;
      }
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return a default profile as fallback instead of null
    return {
      displayName: 'User',
      email: '',
      uid: uid,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      course: '',
      bio: '',
      eduLevel: '',
      wallet: { balance: 0 }
    };
  }
}; 