/**
 * Leaderboard Service
 * Handles leaderboard operations directly with Firestore
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

/**
 * Leaderboard entry interface
 */
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  score: number;
  quizzes: number;
  correctAnswers: number;
  streak: number;
  rank?: number;
  program?: string;
  lastActivity: Date;
}

/**
 * Leaderboard period type
 */
export type LeaderboardPeriod = 'daily' | 'weekly' | 'allTime';

/**
 * Get leaderboard data for a specific period
 */
export const getLeaderboard = async (
  period: LeaderboardPeriod = 'allTime',
  limitCount: number = 10
): Promise<LeaderboardEntry[]> => {
  try {
    console.log(`Getting ${period} leaderboard data`);
    
    const leaderboardRef = collection(db, 'leaderboards', period, 'users');
    const leaderboardQuery = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(leaderboardQuery);
    
    if (snapshot.empty) {
      console.log(`No ${period} leaderboard entries found`);
      return [];
    }
    
    // Format and return data with rank
    const entries: LeaderboardEntry[] = [];
    let currentRank = 1;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        uid: doc.id,
        displayName: data.displayName || 'Unknown Player',
        photoURL: data.photoURL,
        score: data.score || 0,
        quizzes: data.quizzes || 0,
        correctAnswers: data.correctAnswers || 0,
        streak: data.streak || 0,
        rank: currentRank++,
        program: data.program,
        lastActivity: data.lastActivity?.toDate() || new Date()
      });
    });
    
    return entries;
  } catch (error) {
    console.error(`Error getting ${period} leaderboard:`, error);
    return [];
  }
};

/**
 * Get a user's rank and data from the leaderboard
 */
export const getUserLeaderboardData = async (
  uid: string,
  period: LeaderboardPeriod = 'allTime'
): Promise<LeaderboardEntry | null> => {
  try {
    const userDocRef = doc(db, 'leaderboards', period, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      
      // Get user's rank (requires a query)
      const rankQuery = query(
        collection(db, 'leaderboards', period, 'users'),
        where('score', '>', data.score || 0)
      );
      const rankSnapshot = await getDocs(rankQuery);
      const rank = rankSnapshot.size + 1; // Rank is count of users with higher score + 1
      
      return {
        uid,
        displayName: data.displayName || 'Unknown Player',
        photoURL: data.photoURL,
        score: data.score || 0,
        quizzes: data.quizzes || 0,
        correctAnswers: data.correctAnswers || 0,
        streak: data.streak || 0,
        rank,
        program: data.program,
        lastActivity: data.lastActivity?.toDate() || new Date()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting user's ${period} leaderboard data:`, error);
    return null;
  }
};

/**
 * Update leaderboard with quiz results
 */
export const updateLeaderboard = async (
  uid: string, 
  displayName: string,
  photoURL: string | undefined,
  program: string | undefined,
  score: number, 
  correctAnswers: number,
  increaseStreak: boolean
): Promise<boolean> => {
  try {
    console.log(`🔥 DEBUG: Updating leaderboard for user ${uid} with score ${score}`);
    
    // Get current date to determine which leaderboards to update
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const currentWeek = getWeekStart(now).toISOString();
    
    // Update each leaderboard period
    const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'allTime'];
    
    for (const period of periods) {
      try {
        console.log(`🔥 DEBUG: Updating ${period} leaderboard`);
        const userDocRef = doc(db, 'leaderboards', period, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          let newStreak = data.streak || 0;
          
          // Handle streak logic
          if (increaseStreak) {
            // Increase streak if user got points
            newStreak += 1;
          } else if (period === 'allTime') {
            // Only reset streak on allTime if user didn't get points
            newStreak = 0;
          }
          
          // Update existing entry
          const updateData = {
            score: increment(score),
            quizzes: increment(1),
            correctAnswers: increment(correctAnswers),
            streak: newStreak,
            lastActivity: serverTimestamp()
          };
          
          console.log(`🔥 DEBUG: Updating existing document with data:`, updateData);
          await updateDoc(userDocRef, updateData);
          console.log(`🔥 DEBUG: Successfully updated ${period} leaderboard for existing user`);
        } else {
          // Create new entry
          const newData = {
            displayName,
            photoURL,
            program,
            score,
            quizzes: 1,
            correctAnswers,
            streak: increaseStreak ? 1 : 0,
            lastActivity: serverTimestamp()
          };
          
          console.log(`🔥 DEBUG: Creating new document with data:`, newData);
          await setDoc(userDocRef, newData);
          console.log(`🔥 DEBUG: Successfully created new ${period} leaderboard entry`);
        }
      } catch (error) {
        console.error(`🔥 DEBUG: Error updating ${period} leaderboard:`, error);
      }
    }
    
    console.log(`🔥 DEBUG: Successfully updated all leaderboards for user ${uid}`);
    return true;
  } catch (error) {
    console.error('🔥 DEBUG: Error updating leaderboard:', error);
    return false;
  }
};

/**
 * Reset daily and weekly leaderboards if needed
 * This should be called regularly (e.g., on app initialization)
 */
export const resetPeriodicLeaderboards = async (): Promise<void> => {
  try {
    // Get current date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const currentWeek = getWeekStart(now).toISOString();
    
    // Check if daily leaderboard needs reset
    const dailyInfoRef = doc(db, 'leaderboards', 'daily');
    const dailyInfoDoc = await getDoc(dailyInfoRef);
    
    if (!dailyInfoDoc.exists() || (dailyInfoDoc.data().lastReset && dailyInfoDoc.data().lastReset !== today)) {
      console.log('Resetting daily leaderboard');
      
      // Clear daily leaderboard entries
      const dailySnap = await getDocs(collection(db, 'leaderboards', 'daily', 'users'));
      const batch = db.batch();
      
      dailySnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Update last reset date
      batch.set(dailyInfoRef, { lastReset: today });
      await batch.commit();
    }
    
    // Check if weekly leaderboard needs reset
    const weeklyInfoRef = doc(db, 'leaderboards', 'weekly');
    const weeklyInfoDoc = await getDoc(weeklyInfoRef);
    
    if (!weeklyInfoDoc.exists() || (weeklyInfoDoc.data().lastReset && weeklyInfoDoc.data().lastReset !== currentWeek)) {
      console.log('Resetting weekly leaderboard');
      
      // Clear weekly leaderboard entries
      const weeklySnap = await getDocs(collection(db, 'leaderboards', 'weekly', 'users'));
      const batch = db.batch();
      
      weeklySnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Update last reset date
      batch.set(weeklyInfoRef, { lastReset: currentWeek });
      await batch.commit();
    }
  } catch (error) {
    console.error('Error resetting periodic leaderboards:', error);
  }
};

/**
 * Get the start date of the current week (Sunday)
 */
function getWeekStart(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay()); // Set to Sunday
  result.setHours(0, 0, 0, 0); // Set to start of day
  return result;
} 