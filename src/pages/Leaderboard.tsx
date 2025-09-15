import React, { useState, useEffect } from 'react';
import { 
  Medal, 
  Trophy, 
  Flag,
  Crown,
  Star,
  User,
  Clock,
  ArrowUpRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { getLeaderboard, getUserLeaderboardData, resetPeriodicLeaderboards, LeaderboardEntry, LeaderboardPeriod } from '@/services/leaderboardService';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardPeriod>('daily');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { profile } = useUser();

  useEffect(() => {
    // Reset periodic leaderboards if needed (daily/weekly)
    resetPeriodicLeaderboards().catch(err => 
      console.error("Error resetting periodic leaderboards:", err)
    );
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard data for the active tab
        const data = await getLeaderboard(activeTab, 20);
        setLeaderboardData(data);
        
        // Fetch user's own rank if logged in
        if (user) {
          const userRankData = await getUserLeaderboardData(user.uid, activeTab);
          setUserRank(userRankData);
        } else {
          setUserRank(null);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} leaderboard data:`, error);
        // Set empty array in case of error
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeTab, user]);

  // Helper function to get rank badge
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="font-bold text-gray-500">{rank}</span>;
  };

  // Helper function to get first letter for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header with special styling */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 inline-block p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Quizzo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Leaderboard</span>
          </h1>
          <div className="max-w-lg">
            <p className="text-gray-600 mb-4">
              Compete, rank up, and show off your academic prowess! The more you play and win, the higher you climb.
            </p>
          </div>
        </div>

        {/* User's current rank card (if logged in) */}
        {user && userRank && (
          <Card className="mb-8 border-none shadow-md bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-indigo-200">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      {user.displayName ? getInitials(user.displayName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{user.displayName || 'You'}</h3>
                    <p className="text-sm text-gray-500">{profile?.course || 'Invertis University'}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Your Rank</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    #{userRank.rank || '-'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Total Score</div>
                  <div className="text-3xl font-bold">{userRank.score}</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-medium text-gray-500">Current Streak</div>
                  <div className="text-xl font-bold text-orange-500 flex items-center justify-center gap-1">
                    {userRank.streak} <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different leaderboard periods */}
        <Tabs 
          defaultValue="daily" 
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as LeaderboardPeriod)}
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="m-0">
            <LeaderboardTable 
              data={leaderboardData} 
              loading={loading} 
              period="daily"
              currentUserId={user?.uid}
            />
          </TabsContent>

          <TabsContent value="weekly" className="m-0">
            <LeaderboardTable 
              data={leaderboardData} 
              loading={loading} 
              period="weekly"
              currentUserId={user?.uid}
            />
          </TabsContent>

          <TabsContent value="allTime" className="m-0">
            <LeaderboardTable 
              data={leaderboardData} 
              loading={loading} 
              period="allTime"
              currentUserId={user?.uid}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  loading: boolean;
  period: LeaderboardPeriod;
  currentUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  data, 
  loading, 
  period,
  currentUserId 
}) => {
  // Show skeleton loader if loading
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-500 mb-2">No data yet</h3>
          <p className="text-gray-400 mb-6">
            {period === 'daily' 
              ? "Be the first to play today and claim the top spot!" 
              : period === 'weekly'
              ? "No quizzes played this week yet. Start playing now!" 
              : "Leaderboard data will appear once players take quizzes."}
          </p>
          <Button>Play Quizzo Now</Button>
        </CardContent>
      </Card>
    );
  }

  // Populated leaderboard
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {data.map((entry, index) => (
            <div 
              key={entry.uid} 
              className={`flex items-center p-3 rounded-lg 
                ${currentUserId === entry.uid ? 'bg-indigo-50' : 
                  index < 3 ? 'bg-gray-50' : ''}
              `}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 mr-4">
                {getRankBadge(entry.rank || index + 1)}
              </div>
              
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={entry.photoURL || undefined} />
                <AvatarFallback className={`
                  ${index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-700' : 'bg-gray-200'}
                  text-white
                `}>
                  {getInitials(entry.displayName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-semibold flex items-center">
                  {entry.displayName}
                  {currentUserId === entry.uid && (
                    <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {entry.program || 'Invertis University'} · {entry.quizzes} quiz{entry.quizzes !== 1 ? 'zes' : ''}
                </div>
              </div>
              
              <div className="flex items-center ml-auto">
                <div className="mr-6 text-sm text-gray-600 hidden md:block">
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-green-500 mr-1" />
                    {Math.round((entry.correctAnswers / (entry.quizzes * 5)) * 100)}% accuracy
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {entry.score} <span className="text-xs text-gray-500 font-normal">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length < 3 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            More players needed to fill the leaderboard!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard; 