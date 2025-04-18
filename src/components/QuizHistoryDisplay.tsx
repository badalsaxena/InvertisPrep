import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizHistory, QuizHistoryItem } from '@/services/academicProgressService';
import { Loader2, Trophy, BookOpen, Trophy as TrophyIcon, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QuizHistoryDisplayProps {
  userId: string;
}

export default function QuizHistoryDisplay({ userId }: QuizHistoryDisplayProps) {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const historyData = await getQuizHistory(userId, expanded ? 10 : 5);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching quiz history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchHistory();
    }
  }, [userId, expanded]);
  
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
      <CardHeader>
        <CardTitle>Quiz History</CardTitle>
        <CardDescription>Your recent quiz activities</CardDescription>
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