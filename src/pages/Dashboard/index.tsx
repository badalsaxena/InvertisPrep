import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PenLine, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '@/services/userService';
import { getAcademicProgress, AcademicProgress, initAcademicProgress } from '@/services/academicProgressService';
import QuizHistoryDisplay from '@/components/QuizHistoryDisplay';

export default function Dashboard() {
  const { profile, loading, error, refreshProfile, clearError } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [course, setCourse] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  
  // Create a local mock profile from the user data if profile is not available
  const displayProfile = profile || (user ? {
    displayName: user.displayName || 'User',
    email: user.email || 'user@example.com',
    photoURL: user.photoURL || undefined,
    uid: user.uid,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    course: ''
  } : null);

  useEffect(() => {
    if (displayProfile) {
      setDisplayName(displayProfile.displayName || '');
      setCourse(displayProfile.course || '');
    }
  }, [displayProfile]);

  // Ensure user photo URL is updated in the database
  useEffect(() => {
    if (user?.photoURL && displayProfile && !displayProfile.photoURL) {
      updateProfile(user.uid, { photoURL: user.photoURL })
        .then(() => refreshProfile())
        .catch(err => console.error("Error updating photo URL:", err));
    }
  }, [user, displayProfile]);

  // Load academic progress data
  useEffect(() => {
    if (user?.uid) {
      const loadProgress = async () => {
        setLoadingProgress(true);
        try {
          // Initialize progress if it doesn't exist
          await initAcademicProgress(user.uid);
          
          // Get the progress data
          const progress = await getAcademicProgress(user.uid);
          if (progress) {
            setAcademicProgress(progress);
          }
        } catch (error) {
          console.error("Error loading academic progress:", error);
        } finally {
          setLoadingProgress(false);
        }
      };
      
      loadProgress();
    }
  }, [user]);

  const handleRefresh = async () => {
    clearError();
    await refreshProfile();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Update profile with new name and course
      const result = await updateProfile(user.uid, {
        displayName,
        course,
        photoURL: user.photoURL // Ensure photo URL is updated
      });
      
      if (result) {
        // Refresh the profile data
        await refreshProfile();
        setUpdateSuccess(true);
        
        // Reset edit mode
        setEditMode(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Reset to original values
    if (displayProfile) {
      setDisplayName(displayProfile.displayName || '');
      setCourse(displayProfile.course || '');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      {/* Display API errors if they exist */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-700 font-medium mb-1">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={clearError}
            variant="outline" 
            size="sm" 
            className="mt-2 text-red-600 border-red-200"
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {/* Success message */}
      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-green-700 font-medium mb-1">Profile Updated</h3>
          <p className="text-green-600">Your profile has been successfully updated.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
            <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
            {!editMode && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditMode(true)}
                className="h-8 w-8 p-0"
              >
                <PenLine className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {displayProfile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {displayProfile.photoURL || user?.photoURL ? (
                    <img 
                      src={displayProfile.photoURL || user?.photoURL || ''}
                      alt="Profile" 
                      className="h-16 w-16 rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        // Create a fallback element
                        const container = target.parentElement;
                        if (container) {
                          // Hide the img that failed to load
                          target.style.display = 'none';
                          
                          // Create the fallback
                          const fallback = document.createElement('div');
                          fallback.className = 'h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center';
                          fallback.innerHTML = `<span class="text-xl font-semibold text-gray-500">${displayProfile.displayName?.charAt(0).toUpperCase() || 'U'}</span>`;
                          
                          // Add the fallback to the container
                          container.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-500">
                        {displayProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    {editMode ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="course">Course</Label>
                          <Select value={course} onValueChange={setCourse}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your course" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="btech">B.Tech</SelectItem>
                              <SelectItem value="bba">BBA</SelectItem>
                              <SelectItem value="bca">BCA</SelectItem>
                              <SelectItem value="mca">MCA</SelectItem>
                              <SelectItem value="ba">BA</SelectItem>
                              <SelectItem value="ma">MA</SelectItem>
                              <SelectItem value="mba">MBA</SelectItem>
                              <SelectItem value="mtech">M.Tech</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-lg">{displayProfile.displayName}</h3>
                        <p className="text-sm text-gray-500">{displayProfile.email}</p>
                        {displayProfile.course && (
                          <p className="text-sm text-blue-600 mt-1">
                            Course: {displayProfile.course.toUpperCase()}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {!editMode && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Account created: {new Date(displayProfile.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last login: {new Date(displayProfile.lastLogin || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                )}
            </div>
            ) : (
              <p className="text-center text-gray-500">Profile information not available</p>
            )}
          </CardContent>
          {editMode && (
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelEdit}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveProfile}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Progress</CardTitle>
            <CardDescription>Your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Quick Stats</h3>
                {loadingProgress ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Quizzes Completed: {academicProgress?.quizzesCompleted || 0}</li>
                    <li>• Average Score: {academicProgress?.accuracy ? `${academicProgress.accuracy.toFixed(1)}%` : 'N/A'}</li>
                    <li>• Rank: {academicProgress?.rank || 'Beginner'}</li>
                    <li>• Study Streak: {academicProgress?.streak?.current || 0} days</li>
                  </ul>
                )}
              </div>
              
              {academicProgress?.quizzesCompleted ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Achievement</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl mr-3">
                      {academicProgress.rank === 'Beginner' && '🌱'}
                      {academicProgress.rank === 'Novice' && '🌿'}
                      {academicProgress.rank === 'Intermediate' && '🌲'}
                      {academicProgress.rank === 'Advanced' && '🏆'}
                      {academicProgress.rank === 'Expert' && '🏅'}
                      {academicProgress.rank === 'Master' && '👑'}
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">{academicProgress.rank}</p>
                      <p className="text-xs text-blue-600">
                        {academicProgress.quizzesWon} wins / {academicProgress.quizzesLost} losses
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/quizzo')}
              >
                Take a Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quiz History Section */}
      {user && (
        <div className="mb-6">
          <QuizHistoryDisplay userId={user.uid} />
        </div>
      )}
      
      <div className="mt-8 flex flex-wrap justify-center">
        <Button onClick={handleRefresh} variant="outline">
          Refresh Data
        </Button>
      </div>
    </div>
  );
} 