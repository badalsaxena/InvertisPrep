/**
 * Wallet Service
 * Handles QCoin wallet operations directly with Firestore
 */

import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  Timestamp, 
  runTransaction,
  setDoc
} from 'firebase/firestore';

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'REWARD' | 'SPENT';
  description: string;
  timestamp: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

/**
 * Wallet interface
 */
export interface Wallet {
  balance: number;
  transactions?: Transaction[];
  lastUpdated?: Date;
}

/**
 * Get user wallet from Firestore
 */
export const getWallet = async (uid: string): Promise<Wallet> => {
  try {
    console.log(`Getting wallet for user ${uid}`);
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.wallet || { balance: 0 };
    } else {
      // Create user document with wallet if it doesn't exist
      const newWallet = { balance: 0, lastUpdated: new Date() };
      await setDoc(userDocRef, { 
        wallet: newWallet,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      return newWallet;
    }
  } catch (error) {
    console.error('Error getting wallet:', error);
    // Return default wallet on error
    return { balance: 0 };
  }
};

/**
 * Add QCoins to user's wallet
 */
export const addQCoins = async (
  uid: string, 
  amount: number, 
  type: 'DEPOSIT' | 'REWARD', 
  description: string
): Promise<boolean> => {
  if (amount <= 0) {
    console.error('Amount must be positive');
    return false;
  }
  
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Use transaction for safe updates
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user with initial wallet if doesn't exist
        const newWallet = { 
          balance: amount,
          transactions: [{
            id: crypto.randomUUID(),
            amount,
            type,
            description,
            timestamp: new Date(),
            status: 'COMPLETED'
          }],
          lastUpdated: new Date()
        };
        
        transaction.set(userDocRef, {
          wallet: newWallet,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Update existing wallet
        const userData = userDoc.data();
        const currentWallet = userData.wallet || { balance: 0 };
        
        // Create a new transaction
        const newTransaction = {
          id: crypto.randomUUID(),
          amount,
          type,
          description,
          timestamp: new Date(),
          status: 'COMPLETED'
        };
        
        // Update wallet with new balance and transaction
        transaction.update(userDocRef, {
          'wallet.balance': (currentWallet.balance || 0) + amount,
          'wallet.lastUpdated': new Date(),
          'wallet.transactions': arrayUnion(newTransaction)
        });
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error adding QCoins:', error);
    return false;
  }
};

/**
 * Spend QCoins from user's wallet
 */
export const spendQCoins = async (
  uid: string,
  amount: number,
  description: string
): Promise<boolean> => {
  if (amount <= 0) {
    console.error('Amount must be positive');
    return false;
  }
  
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Use transaction to ensure balance doesn't go negative
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      
      if (!userDoc.exists()) {
        console.error('User does not exist');
        return false;
      }
      
      const userData = userDoc.data();
      const currentWallet = userData.wallet || { balance: 0 };
      
      // Check if user has enough QCoins
      if ((currentWallet.balance || 0) < amount) {
        console.error('Insufficient balance');
        return false;
      }
      
      // Create a spend transaction
      const spendTransaction = {
        id: crypto.randomUUID(),
        amount: -amount, // Negative to indicate spending
        type: 'SPENT',
        description,
        timestamp: new Date(),
        status: 'COMPLETED'
      };
      
      // Update wallet
      transaction.update(userDocRef, {
        'wallet.balance': (currentWallet.balance || 0) - amount,
        'wallet.lastUpdated': new Date(),
        'wallet.transactions': arrayUnion(spendTransaction)
      });
      
      return true;
    });
  } catch (error) {
    console.error('Error spending QCoins:', error);
    return false;
  }
};

/**
 * Get transaction history for a user
 */
export const getTransactionHistory = async (uid: string): Promise<Transaction[]> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const wallet = userData.wallet || { transactions: [] };
      
      // Sort transactions by timestamp (newest first)
      const transactions = wallet.transactions || [];
      return transactions.sort((a: Transaction, b: Transaction) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
}; 