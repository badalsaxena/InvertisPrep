import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizHistory, QuizHistoryItem, updateQuizProgress } from '@/services/academicProgressService';
import { Loader2, Trophy, BookOpen, Trophy as TrophyIcon, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface QuizHistoryDisplayProps {
  userId: string;
}

export default function QuizHistoryDisplay({ userId }: QuizHistoryDisplayProps) {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchHistory = async () => {
    setLoading(true);
    try {
      console.log('Fetching quiz history for userId:', userId);
      const historyData = await getQuizHistory(userId, expanded ? 10 : 5);
      console.log('Quiz history data retrieved:', historyData.length, 'records');
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz history. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, expanded]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };
  
  // Add sample test data for testing purposes
  const addSampleData = async () => {
    try {
      setLoading(true);
      
      // Create a few sample quiz results
      const subjects = ['Mathematics', 'Science', 'ComputerScience', 'History'];
      const now = new Date();
      
      // Add first test quiz result
      await updateQuizProgress(userId, {
        subject: subjects[0],
        score: 85,
        correctAnswers: 17,
        totalQuestions: 20,
        isWin: true,
        timeSpent: 180,
      });
      
      // Add second test quiz result
      await updateQuizProgress(userId, {
        subject: subjects[1],
        score: 60,
        correctAnswers: 6,
        totalQuestions: 10,
        isWin: false,
        timeSpent: 120,
      });
      
      // Add multiplayer test result
      await updateQuizProgress(userId, {
        subject: subjects[2],
        score: 90,
        correctAnswers: 9,
        totalQuestions: 10,
        isWin: true,
        timeSpent: 150,
        opponent: {
          uid: 'test-user-123',
          name: 'Test Opponent',
          score: 70
        }
      });
      
      toast({
        title: 'Success',
        description: 'Sample quiz history data has been added.',
      });
      
      // Refresh history to show new data
      await fetchHistory();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast({
        title: 'Error',
        description: 'Failed to add sample data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatSubject = (subject: string) => {
    return subject.charAt(0).toUpperCase() + subject.slice(1).replace(/([A-Z])/g, ' $1');
  };
  
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>Your recent quiz activities</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No quizzes taken yet</p>
            <p className="text-sm">Start a quiz to begin tracking your progress</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={addSampleData}
            >
              Add Sample Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {item.result === 'win' ? (
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <TrophyIcon className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">
                          {formatSubject(item.subject)}
                        </h4>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.type === 'multiplayer' ? 'Multiplayer' : 'Solo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {item.correctAnswers} / {item.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-end">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(item.timeSpent)}
                    </div>
                  </div>
                </div>
                
                {item.type === 'multiplayer' && item.opponent && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                    <p className="text-gray-600">
                      {item.result === 'win' ? 'Won against' : 'Lost to'}{' '}
                      <span className="font-medium">{item.opponent.name}</span>
                      {item.opponent.score !== undefined && (
                        <span className="text-gray-500"> ({item.opponent.score} pts)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 