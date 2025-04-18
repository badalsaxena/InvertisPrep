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

export default function Dashboard() {
  const { profile, wallet, loading, error, refreshProfile, refreshWallet, clearError } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [course, setCourse] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
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

  const handleRefresh = async () => {
    clearError();
    await Promise.all([refreshProfile(), refreshWallet()]);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Update profile with new name and course
      const result = await updateProfile(user.uid, {
        displayName,
        course
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {displayProfile.photoURL ? (
                    <img 
                      src={displayProfile.photoURL} 
                      alt="Profile" 
                      className="h-16 w-16 rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        // Create fallback element dynamically since we can't render conditionally here
                        const fallback = document.createElement('div');
                        fallback.className = 'h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-xl font-semibold text-gray-500">${displayProfile.displayName?.charAt(0).toUpperCase() || 'U'}</span>`;
                        e.currentTarget.parentNode?.appendChild(fallback);
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

        {/* Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle>QCoin Wallet</CardTitle>
            <CardDescription>Your virtual currency balance</CardDescription>
          </CardHeader>
          <CardContent>
            {wallet ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-700 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {wallet.balance} <span className="text-sm font-normal">QCoins</span>
                  </p>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      if (user) {
                        navigate('/qcoins/history');
                      }
                    }}
                  >
                    View Transaction History
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => {
                      if (user) {
                        navigate('/qcoins');
                      }
                    }}
                  >
                    Manage QCoins
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Wallet information not available</p>
            )}
          </CardContent>
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
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Quizzes Completed: 0</li>
                  <li>• Average Score: N/A</li>
                  <li>• Rank: Beginner</li>
                  <li>• Study Streak: 0 days</li>
            </ul>
              </div>
              
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
      
      <div className="mt-8 flex flex-wrap justify-center">
        <Button onClick={handleRefresh} variant="outline">
          Refresh Data
        </Button>
      </div>
    </div>
  );
} 