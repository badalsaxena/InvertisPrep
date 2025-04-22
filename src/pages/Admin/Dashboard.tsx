import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Bell
} from 'lucide-react';

interface DashboardMetrics {
  totalUsers: number;
  totalQuizzes: number;
  totalAttempts: number;
  newUsersToday: number;
  activeQuizzes: number;
  completionRate: number;
  pendingRewards: number;
  recentUsers: any[];
  userGrowth: number;
  quizGrowth: number;
}

const initialMetrics: DashboardMetrics = {
  totalUsers: 0,
  totalQuizzes: 0,
  totalAttempts: 0,
  newUsersToday: 0,
  activeQuizzes: 0,
  completionRate: 0,
  pendingRewards: 0,
  recentUsers: [],
  userGrowth: 0,
  quizGrowth: 0
};

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get total users count
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;
      
      // Get new users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(today);
      
      const newUsersQuery = query(
        collection(db, 'users'),
        where('createdAt', '>=', todayTimestamp)
      );
      const newUsersSnapshot = await getDocs(newUsersQuery);
      const newUsersToday = newUsersSnapshot.size;
      
      // Get recent users
      const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentUsersSnapshot = await getDocs(recentUsersQuery);
      const recentUsers = recentUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get quizzes data
      const quizzesQuery = query(collection(db, 'quizzes'));
      const quizzesSnapshot = await getDocs(quizzesQuery);
      const totalQuizzes = quizzesSnapshot.size;
      
      const activeQuizzesQuery = query(
        collection(db, 'quizzes'),
        where('isPublished', '==', true)
      );
      const activeQuizzesSnapshot = await getDocs(activeQuizzesQuery);
      const activeQuizzes = activeQuizzesSnapshot.size;
      
      // Get quiz attempts
      const attemptsQuery = query(collection(db, 'quiz_attempts'));
      const attemptsSnapshot = await getDocs(attemptsQuery);
      const totalAttempts = attemptsSnapshot.size;
      
      // Calculate completion rate (completed attempts / total attempts)
      const completedAttemptsQuery = query(
        collection(db, 'quiz_attempts'),
        where('completed', '==', true)
      );
      const completedAttemptsSnapshot = await getDocs(completedAttemptsQuery);
      const completionRate = totalAttempts > 0 
        ? Math.round((completedAttemptsSnapshot.size / totalAttempts) * 100) 
        : 0;
      
      // Get pending rewards
      const pendingRewardsQuery = query(
        collection(db, 'rewards'),
        where('claimed', '==', false)
      );
      const pendingRewardsSnapshot = await getDocs(pendingRewardsQuery);
      const pendingRewards = pendingRewardsSnapshot.size;
      
      // Calculate growth (dummy calculations - in real app would compare to previous period)
      const userGrowth = totalUsers > 0 ? Math.round((newUsersToday / totalUsers) * 100) : 0;
      const quizGrowth = Math.round(Math.random() * 20); // Dummy data
      
      setMetrics({
        totalUsers,
        totalQuizzes,
        totalAttempts,
        newUsersToday,
        activeQuizzes,
        completionRate,
        pendingRewards,
        recentUsers,
        userGrowth,
        quizGrowth
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchDashboardData()}>
            <Clock className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {metrics.userGrowth > 0 ? (
                    <>
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-green-500">{metrics.userGrowth}% growth</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-red-500">{Math.abs(metrics.userGrowth)}% decrease</span>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Link
                  to="/admin/users"
                  className="text-xs text-blue-500 hover:underline flex items-center"
                >
                  View all users
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
            
            {/* Quizzes Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Quizzes
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalQuizzes}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{metrics.activeQuizzes} active</span>
                  <span className="mx-1">•</span>
                  {metrics.quizGrowth > 0 ? (
                    <span className="text-green-500">{metrics.quizGrowth}% growth</span>
                  ) : (
                    <span className="text-red-500">{Math.abs(metrics.quizGrowth)}% decrease</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Link
                  to="/admin/quizzes"
                  className="text-xs text-blue-500 hover:underline flex items-center"
                >
                  Manage quizzes
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
            
            {/* Quiz Attempts Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Quiz Attempts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalAttempts}</div>
                <div className="text-xs text-muted-foreground">
                  {metrics.completionRate}% completion rate
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Link
                  to="/admin/statistics"
                  className="text-xs text-blue-500 hover:underline flex items-center"
                >
                  View statistics
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
            
            {/* Rewards Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Rewards
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingRewards}</div>
                <div className="text-xs text-muted-foreground">
                  Awaiting distribution
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Link
                  to="/admin/rewards"
                  className="text-xs text-blue-500 hover:underline flex items-center"
                >
                  Manage rewards
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recent Users */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  New users who joined recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.recentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-500 font-medium">
                              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {user.displayName || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    No recent users to display
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/admin/users')}>
                  View All Users
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quick Actions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used administrative functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => navigate('/admin/quizzes/new')}
                  >
                    <BookOpen className="h-5 w-5 mb-1" />
                    <span className="text-xs">Create Quiz</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => navigate('/admin/statistics')}
                  >
                    <TrendingUp className="h-5 w-5 mb-1" />
                    <span className="text-xs">View Statistics</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">Manage Users</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => navigate('/admin/rewards')}
                  >
                    <Award className="h-5 w-5 mb-1" />
                    <span className="text-xs">Distribute Rewards</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => navigate('/admin/settings')}
                  >
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-xs">System Settings</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col justify-center items-center"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">View User Portal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 