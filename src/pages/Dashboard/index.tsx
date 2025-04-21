import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PenLine, Save, X, GraduationCap, Wallet, History, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '@/services/userService';
import { getAcademicProgress, AcademicProgress, initAcademicProgress } from '@/services/academicProgressService';
import { getWallet, Wallet as WalletType } from '@/services/walletService';
import QuizHistoryDisplay from '@/components/QuizHistoryDisplay';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const { profile, loading, error, refreshProfile, clearError, refreshWallet } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    eduLevel: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  // State for refreshing
  const [refreshing, setRefreshing] = useState(false);

  // Load academic progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return null;
      
      try {
        setLoadingProgress(true);
        console.log('Loading academic progress for user:', user.uid);
        let progress = await getAcademicProgress(user.uid);
        
        // If no progress exists, initialize it
        if (!progress) {
          console.log('No academic progress found, initializing...');
          progress = await initAcademicProgress(user.uid);
        }
        
        console.log('Academic progress loaded:', progress);
        setAcademicProgress(progress);
        return progress;
      } catch (error) {
        console.error('Error loading academic progress:', error);
        return null;
      } finally {
        setLoadingProgress(false);
      }
    };
    
    loadProgress();
  }, [user]);

  // Load wallet data
  useEffect(() => {
    const loadWallet = async () => {
      if (!user) return;
      
      try {
        setLoadingWallet(true);
        const userWallet = await getWallet(user.uid);
        setWallet(userWallet);
      } catch (error) {
        console.error('Error loading wallet:', error);
      } finally {
        setLoadingWallet(false);
      }
    };
    
    loadWallet();
  }, [user]);

  // Pre-populate form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        eduLevel: profile.eduLevel || '',
      });
    }
  }, [profile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    
    console.log('Refreshing all user data...');
    
    // First refresh basic profile data
    await refreshProfile();
    
    // Then refresh wallet data
    await refreshWallet();
    
    // Finally refresh academic progress
    if (user) {
      try {
        console.log('Refreshing academic progress...');
        const progress = await getAcademicProgress(user.uid);
        if (progress) {
          console.log('Updated academic progress:', progress);
          setAcademicProgress(progress);
        } else {
          console.log('No academic progress found during refresh');
        }
        
        // Also refresh wallet
        console.log('Refreshing wallet...');
        const userWallet = await getWallet(user.uid);
        if (userWallet) {
          console.log('Updated wallet:', userWallet);
          setWallet(userWallet);
        }
        
        toast({
          title: 'Refresh Complete',
          description: 'Your dashboard data has been refreshed',
          duration: 3000
        });
      } catch (err) {
        console.error('Failed to refresh data', err);
        toast({
          title: 'Refresh Failed',
          description: 'Could not refresh some dashboard data',
          variant: 'destructive',
          duration: 3000
        });
      }
    }
    
    setRefreshing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      setFormError(null);
      
      await updateProfile(user.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
        eduLevel: formData.eduLevel,
      });
      
      // Refresh profile data
      await refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data to current profile
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        eduLevel: profile.eduLevel || '',
      });
    }
    setIsEditing(false);
    setFormError(null);
  };

  // Function to format date
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    
    try {
      // Convert Firebase timestamp to JS Date if needed
      const jsDate = date.toDate ? date.toDate() : new Date(date);
      return jsDate.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{formError}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile</CardTitle>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  <PenLine className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={cancelEdit}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{profile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500">Member since {formatDate(profile?.createdAt)}</p>
              </div>
              
              <div className="flex-grow space-y-4">
                {isEditing ? (
                  // Edit form
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eduLevel">Education Level</Label>
                      <Select 
                        value={formData.eduLevel} 
                        onValueChange={(value) => setFormData({...formData, eduLevel: value})}
                      >
                        <SelectTrigger id="eduLevel">
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Post-graduate</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <h3 className="text-xl font-semibold">{profile?.displayName || 'No name set'}</h3>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p>{user?.email || 'No email'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                      <p className="text-gray-700">{profile?.bio || 'No bio provided'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Education Level</h4>
                      <p className="text-gray-700">
                        {profile?.eduLevel === 'high_school' && 'High School'}
                        {profile?.eduLevel === 'undergraduate' && 'Undergraduate'}
                        {profile?.eduLevel === 'graduate' && 'Graduate'}
                        {profile?.eduLevel === 'postgraduate' && 'Post-graduate'}
                        {profile?.eduLevel === 'professional' && 'Professional'}
                        {!profile?.eduLevel && 'Not specified'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QCoins Wallet Card */}
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" /> QCoins Wallet
              </CardTitle>
              <CardDescription>Earn and spend QCoins for quiz activities</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loadingWallet ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">Your Balance</p>
                  <p className="text-4xl font-bold text-primary">{wallet?.balance || 0} QCoins</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">About QCoins</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Earn QCoins by participating in quizzes and winning matches. Use them to unlock premium content and features.
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Earn 5-10 QCoins for participating in quizzes</li>
                    <li>Earn bonus QCoins for winning multiplayer matches</li>
                    <li>Spend QCoins on premium resources and features</li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate('/qcoins/history')}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View Transaction History
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic Progress Card */}
      {!loadingProgress && academicProgress && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Academic Progress
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <CardDescription>
                Your learning journey stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Quizzes Taken</p>
                    <p className="text-2xl font-bold">{academicProgress?.quizzesCompleted || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                    <p className="text-2xl font-bold">{academicProgress?.accuracy ? `${academicProgress.accuracy.toFixed(1)}%` : 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Streak</p>
                    <p className="text-2xl font-bold">{academicProgress?.streak?.current || 0} days</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Subject Mastery</h3>
                  <div className="space-y-3">
                    {Object.entries(academicProgress?.subjects || {})
                      .sort(([, aData], [, bData]) => (bData as any).accuracy - (aData as any).accuracy)
                      .slice(0, 3)
                      .map(([subject, data]) => (
                        <div key={subject}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">{subject}</p>
                            <p className="text-xs">{(data as any).accuracy}%</p>
                          </div>
                          <Progress value={(data as any).accuracy} className="h-2" />
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate('/quizzo')}
                  >
                    Take a Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz History Section */}
      <div className="mb-6">
        {user && <QuizHistoryDisplay userId={user.uid} />}
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center">
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Refresh Data
        </Button>
      </div>
    </div>
  );
} 