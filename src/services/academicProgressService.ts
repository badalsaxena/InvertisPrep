/**
 * Academic Progress Service
 * Handles tracking and updating quiz/academic progress in Firestore
 */
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  runTransaction,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit as limitQuery,
  getDocs
} from 'firebase/firestore';

/**
 * Data structure for quiz result
 */
export interface QuizResultData {
  subject: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  isWin: boolean;
  timeSpent: number;
  opponent?: {
    uid: string;
    name: string;
    score: number;
  };
}

/**
 * Quiz history record structure
 */
export interface QuizHistoryItem {
  id: string;
  type: "single" | "multiplayer";
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  result: "win" | "lose";
  timestamp: Date;
  timeSpent: number;
  opponent?: {
    uid: string;
    name: string;
    score: number;
  } | null;
}

/**
 * Academic progress data structure
 */
export interface AcademicProgress {
  quizzesCompleted: number;
  quizzesWon: number;
  quizzesLost: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  accuracy: number;
  lastQuizDate: Date;
  subjects: Record<string, {
    completed: number;
    correct: number;
    total: number;
    accuracy: number;
  }>;
  streak: {
    current: number;
    max: number;
    lastPlayed: Date;
  };
  rank: string;
}

/**
 * Initialize academic progress for a new user
 */
export const initAcademicProgress = async (uid: string): Promise<AcademicProgress | null> => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    const defaultProgress: AcademicProgress = {
      quizzesCompleted: 0,
      quizzesWon: 0,
      quizzesLost: 0,
      totalQuestionsAnswered: 0,
      correctAnswersCount: 0,
      accuracy: 0,
      lastQuizDate: new Date(),
      subjects: {},
      streak: {
        current: 0,
        max: 0,
        lastPlayed: new Date()
      },
      rank: 'Beginner'
    };
    
    if (userDoc.exists() && !userDoc.data().academicProgress) {
      await updateDoc(userRef, {
        academicProgress: defaultProgress
      });
      console.log('Academic progress initialized for user:', uid);
    }
    
    return defaultProgress;
  } catch (error) {
    console.error('Error initializing academic progress:', error);
    return null;
  }
};

/**
 * Get academic progress for a user
 */
export const getAcademicProgress = async (uid: string): Promise<AcademicProgress | null> => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.academicProgress || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting academic progress:', error);
    return null;
  }
};

/**
 * Update academic progress after completing a quiz
 */
export const updateQuizProgress = async (uid: string, quizData: QuizResultData): Promise<boolean> => {
  if (!uid) return false;
  
  try {
    const userRef = doc(db, 'users', uid);
    
    // Use transaction for safe updates
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
      
      const userData = userDoc.data();
      const progress = userData.academicProgress || {
        quizzesCompleted: 0,
        quizzesWon: 0,
        quizzesLost: 0,
        totalQuestionsAnswered: 0,
        correctAnswersCount: 0,
        accuracy: 0,
        lastQuizDate: new Date(),
        subjects: {},
        streak: {
          current: 0,
          max: 0,
          lastPlayed: new Date()
        },
        rank: 'Beginner'
      };
      
      // Update general stats
      progress.quizzesCompleted += 1;
      if (quizData.isWin) {
        progress.quizzesWon += 1;
      } else {
        progress.quizzesLost += 1;
      }
      
      // Update question stats
      progress.totalQuestionsAnswered += quizData.totalQuestions;
      progress.correctAnswersCount += quizData.correctAnswers;
      
      // Calculate accuracy
      if (progress.totalQuestionsAnswered > 0) {
        progress.accuracy = Math.round(
          (progress.correctAnswersCount / progress.totalQuestionsAnswered) * 100
        );
      }
      
      // Update last quiz date
      progress.lastQuizDate = new Date();
      
      // Update subject-specific stats
      if (!progress.subjects) {
        progress.subjects = {};
      }
      
      const subjectStats = progress.subjects[quizData.subject] || {
        completed: 0,
        correct: 0,
        total: 0,
        accuracy: 0
      };
      
      subjectStats.completed += 1;
      subjectStats.correct += quizData.correctAnswers;
      subjectStats.total += quizData.totalQuestions;
      
      if (subjectStats.total > 0) {
        subjectStats.accuracy = Math.round(
          (subjectStats.correct / subjectStats.total) * 100
        );
      }
      
      progress.subjects[quizData.subject] = subjectStats;
      
      // Update streak
      const now = new Date();
      const lastPlayed = progress.streak.lastPlayed instanceof Date 
        ? progress.streak.lastPlayed 
        : new Date(progress.streak.lastPlayed);
      
      if (lastPlayed) {
        // Check if last played was yesterday or today
        const dayDiff = Math.floor(
          (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDiff <= 1) {
          // Streak continues
          progress.streak.current += 1;
          if (progress.streak.current > progress.streak.max) {
            progress.streak.max = progress.streak.current;
          }
        } else {
          // Streak resets
          progress.streak.current = 1;
        }
      } else {
        // First streak day
        progress.streak.current = 1;
        progress.streak.max = 1;
      }
      
      progress.streak.lastPlayed = now;
      
      // Update rank based on criteria
      progress.rank = calculateRank(progress);
      
      // Save quiz history in subcollection
      const historyRef = doc(db, `quizHistory/${uid}/history`, `quiz_${Date.now()}`);
      await setDoc(historyRef, {
        id: historyRef.id,
        type: quizData.opponent ? "multiplayer" : "single",
        subject: quizData.subject,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        correctAnswers: quizData.correctAnswers,
        result: quizData.isWin ? "win" : "lose",
        timestamp: now,
        timeSpent: quizData.timeSpent,
        opponent: quizData.opponent || null
      });
      
      // Update the document
      transaction.update(userRef, { 
        academicProgress: progress,
        lastActive: now
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return false;
  }
};

/**
 * Calculate the user's rank based on performance
 */
function calculateRank(progress: AcademicProgress): string {
  const { quizzesCompleted, accuracy } = progress;
  
  if (quizzesCompleted >= 200 && accuracy >= 90) return 'Master';
  if (quizzesCompleted >= 100 && accuracy >= 85) return 'Expert';
  if (quizzesCompleted >= 51 && accuracy >= 75) return 'Advanced';
  if (quizzesCompleted >= 26 && accuracy >= 60) return 'Intermediate';
  if (quizzesCompleted >= 11 && accuracy >= 40) return 'Novice';
  return 'Beginner';
}

/**
 * Get a detailed quiz history for a user
 */
export const getQuizHistory = async (uid: string, limit = 10): Promise<QuizHistoryItem[]> => {
  if (!uid) return [];
  
  try {
    // Create a reference to the user's quiz history subcollection
    const historyRef = collection(db, `quizHistory/${uid}/history`);
    
    // Create a query ordered by timestamp with a limit
    const q = query(
      historyRef,
      orderBy('timestamp', 'desc'),
      limitQuery(limit)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Map the results to the QuizHistoryItem interface
    const historyItems: QuizHistoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      historyItems.push({
        id: doc.id,
        type: data.type,
        subject: data.subject,
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        result: data.result,
        timestamp: data.timestamp.toDate(),
        timeSpent: data.timeSpent,
        opponent: data.opponent
      });
    });
    
    return historyItems;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }
}; 