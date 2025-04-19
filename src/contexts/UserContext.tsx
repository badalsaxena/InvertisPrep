import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, getUserWallet, UserProfile } from '@/services/authService';

/**
 * User context interface
 */
interface UserContextType {
  profile: UserProfile | null;
  wallet: { balance: number } | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  clearError: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | null>(null);

/**
 * UserProvider component
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          // Load profile and wallet in parallel
          // Use Promise.allSettled instead of Promise.all to continue even if one fails
          const results = await Promise.allSettled([
            refreshProfile(),
            refreshWallet()
          ]);
          
          // Log results for debugging
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Promise ${index} failed:`, result.reason);
            }
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          // Errors are already handled in the individual refresh functions
          // No need to set an error message here
        } finally {
          setLoading(false);
        }
      } else {
        // Clear data when not authenticated
        setProfile(null);
        setWallet(null);
        setLoading(false);
        setError(null);
      }
    };

    loadUserData();
  }, [user]);

  /**
   * Refresh user profile data
   */
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Fetching user profile for', user.uid);
      // Import directly from userService to avoid potential circular imports
      const { getUserProfile } = await import('@/services/userService');
      const profileData = await getUserProfile(user.uid);
      
      if (profileData) {
        console.log('Profile data loaded:', profileData);
        setProfile(profileData);
      } else {
        // Use fallback data instead of showing error
        console.log('No profile data returned, using fallback');
        const fallbackProfile: UserProfile = {
          displayName: user.displayName || 'User',
          email: user.email || 'user@example.com',
          photoURL: user.photoURL || undefined,
          uid: user.uid,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          course: '',
          bio: '',
          eduLevel: '',
          wallet: { balance: 0 }
        };
        setProfile(fallbackProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      
      // Set fallback profile data instead of showing error
      const fallbackProfile: UserProfile = {
        displayName: user.displayName || 'User',
        email: user.email || 'user@example.com',
        photoURL: user.photoURL || undefined,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        course: '',
        bio: '',
        eduLevel: '',
        wallet: { balance: 0 }
      };
      
      setProfile(fallbackProfile);
      console.log('Using fallback profile due to error:', fallbackProfile);
    }
  };

  /**
   * Refresh user wallet data
   */
  const refreshWallet = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Fetching wallet for', user.uid);
      const walletData = await getUserWallet(user.uid);
      
      if (walletData) {
        setWallet(walletData);
        console.log('Wallet data loaded:', walletData);
      } else {
        // Use fallback wallet data instead of showing error
        console.log('No wallet data returned, using fallback');
        const fallbackWallet = { balance: 0 };
        setWallet(fallbackWallet);
      }
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      
      // Set fallback wallet data
      const fallbackWallet = { balance: 0 };
      setWallet(fallbackWallet);
      console.log('Using fallback wallet due to error');
    }
  };

  /**
   * Clear any current error
   */
  const clearError = () => setError(null);

  // Provide the context value
  const contextValue: UserContextType = {
    profile,
    wallet,
    loading,
    error,
    refreshProfile,
    refreshWallet,
    clearError
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to use the user context
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 