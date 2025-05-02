import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Clock, BookOpen, Medal, Crown, ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserLeaderboardData } from '@/services/leaderboardService';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Quizzo() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Get user's leaderboard data from Firestore
        const leaderboardData = await getUserLeaderboardData(user.uid, 'allTime');
        setUserStats(leaderboardData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quizzo Battle
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge in quiz battles. Play solo or compete with peers in real-time matches.
          </p>
        </div>

        

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Multiplayer Mode Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold">Multiplayer Mode</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Compete in real-time with other players in head-to-head quiz battles. Test your knowledge and speed!
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                  </span>
                  1v1 matchmaking with other players
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2">
                    <Trophy className="h-4 w-4 text-indigo-600" />
                  </span>
                  Win to earn 5 QCoins, participation earns 1
                </li>
              </ul>
              <Link to="/quizzo/multiplayer">
                <Button className="w-full justify-center">
                  Play Multiplayer
                </Button>
              </Link>
            </div>
          </div>

          {/* Solo Mode Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold">Solo Mode</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Practice at your own pace with subject-specific quizzes. Track your progress and improve your knowledge.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </span>
                  10 questions in various subjects
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2">
                    <Trophy className="h-4 w-4 text-indigo-600" />
                  </span>
                  Challenge yourself to improve your score
                </li>
              </ul>
              <Link to="/quizzo/solo">
                <Button className="w-full justify-center">
                  Start Solo Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 