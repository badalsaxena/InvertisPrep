import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import quizzoSocketService from '@/services/quizzoSocket';
import { Trophy, XCircle, Clock, Users, Check, Info } from 'lucide-react';
import { addQuizReward } from '@/services/walletService';
import { updateQuizProgress } from '@/services/academicProgressService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateLeaderboard } from '@/services/leaderboardService';
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Medal } from "lucide-react";

// Define a type for the quiz results with extended properties
interface QuizResult {
  userId: string;
  score: number;
  totalTime: number;
  correctAnswers?: number;
  totalQuestions?: number;
}

// Define the type for the game results
interface GameResults {
  myResult: QuizResult;
  opponentResult: QuizResult;
  subject?: string;
}

// Available subjects matching the ones shown in the screenshot
const SUBJECTS = [
  { id: "c", name: "C Programming" },
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "web", name: "Web Development" }
];

export default function MultiplayerQuizzo() {
  const [subject, setSubject] = useState<string>("");
  
  // Game state management
  const [gameState, setGameState] = useState<'setup' | 'matching' | 'playing' | 'finished'>('setup');
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [myScore, setMyScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentAnswered, setOpponentAnswered] = useState<boolean>(false);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchingTime, setMatchingTime] = useState<number>(0);
  const [opponent, setOpponent] = useState<string>("");
  const { user } = useAuth();
  const { profile, refreshWallet } = useUser();
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Timer refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const matchingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Time taken to answer
  const startTimeRef = useRef<number>(0);
  
  // Initialize and connect socket
  useEffect(() => {
    const connectToSocket = async () => {
      try {
        await quizzoSocketService.connect();
      } catch (error) {
        console.error("Failed to connect to socket server:", error);
        setError("Failed to connect to the game server. Please try again later.");
      }
    };
    
    connectToSocket();
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (matchingTimerRef.current) {
        clearInterval(matchingTimerRef.current);
      }
      
      quizzoSocketService.disconnect();
    };
  }, []);
  
  // Set up socket event listeners
  useEffect(() => {
    // Matchmaking status event
    quizzoSocketService.onMatchmakingStatus((data) => {
      console.log("Matchmaking status:", data);
    });
    
    // Match found event
    quizzoSocketService.onMatchFound((data) => {
      console.log("Match found:", data);
      setOpponent(data.opponent);
      setGameState('playing');
      clearInterval(matchingTimerRef.current as NodeJS.Timeout);
    });
    
    // Quiz start event
    quizzoSocketService.onQuizStart(() => {
      console.log("Quiz started");
      setQuestionCount(0);
      setMyScore(0);
      setOpponentScore(0);
    });
    
    // Quiz question event
    quizzoSocketService.onQuizQuestion((data) => {
      console.log("New question:", data);
      setCurrentQuestion(data.question);
      setSelectedOption(null);
      setIsCorrect(null);
      setOpponentAnswered(false);
      setTimeLeft(15);
      setQuestionCount(data.questionCount);
      setTotalQuestions(data.totalQuestions);
      startTimeRef.current = Date.now();
      
      // Start timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            // Auto-submit incorrect answer if time runs out
            if (selectedOption === null) {
              const timeElapsed = Date.now() - startTimeRef.current;
              quizzoSocketService.submitAnswer(data.question.id, -1, timeElapsed);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
    
    // Answer result event
    quizzoSocketService.onAnswerResult((result) => {
      console.log("Answer result:", result);
      setIsCorrect(result.correct);
      setMyScore(result.score);
    });
    
    // Opponent answered event
    quizzoSocketService.onOpponentAnswered(() => {
      console.log("Opponent answered");
      setOpponentAnswered(true);
    });
    
    // Opponent left event
    quizzoSocketService.onOpponentLeft(() => {
      console.log("Opponent left");
      setError("Your opponent has left the game.");
      setGameState('setup');
    });
    
    // Quiz end event
    quizzoSocketService.onQuizEnd((results: GameResults) => {
      console.log("Quiz ended:", results);
      setGameResults(results);
      setGameState('finished');
      setOpponentScore(results.opponentResult.score);
      
      // Process rewards directly if user is logged in
      if (user?.uid) {
        const isWinner = results.myResult.score > results.opponentResult.score;
        const coinsEarned = isWinner ? 5 : 1;
        
        // Set reward message for UI
        setRewardMessage(`You earned ${coinsEarned} QCoins!`);
        
        // Process the reward
        processQuizReward(
          user.uid, 
          coinsEarned, 
          isWinner, 
          'multiplayer' as const,
          results.subject || subject || 'general',
          results.myResult.score,
          results.myResult.correctAnswers || Math.floor(results.myResult.score / 10),
          results.myResult.totalQuestions || totalQuestions
        );
      }
    });
    
    // Clean up event listeners
    return () => {
      quizzoSocketService.removeAllListeners();
    };
  }, [user, refreshWallet, subject, totalQuestions]);
  
  // New function to process rewards
  const processQuizReward = async (
    uid: string,
    amount: number,
    isWinner: boolean,
    quizType: 'single' | 'multiplayer',
    subject: string,
    score: number,
    correctAnswers: number,
    totalQuestions: number
  ) => {
    try {
      console.log(`Processing reward: ${amount} QCoins for user ${uid}`);
      
      // 1. Add QCoins to wallet
      await addQuizReward(uid, amount, isWinner, quizType, subject);
      
      // 2. Update academic progress
      await updateQuizProgress(uid, {
        subject,
        score,
        correctAnswers,
        totalQuestions,
        isWin: isWinner,
        timeSpent: 0 // This would ideally come from the request
      });
      
      // 3. Update leaderboard with points earned
      await updateLeaderboard(
        uid,
        user?.displayName || 'Anonymous',
        user?.photoURL || undefined,
        profile?.course || 'Unknown',
        score,
        correctAnswers,
        isWinner
      );
      
      // 4. Refresh wallet to show updated balance
      setTimeout(() => {
        refreshWallet();
      }, 1500);
      
      console.log(`Successfully processed reward: ${amount} QCoins for user ${uid}`);
    } catch (error) {
      console.error("Failed to process quiz reward:", error);
    }
  };
  
  // Start matchmaking
  const startMatchmaking = () => {
    if (!user) {
      setError("Please log in to play multiplayer quizzes.");
      return;
    }
    
    if (!subject) {
      setError("Please select a subject.");
      return;
    }
    
    try {
      // Use the profile name or email as username
      const displayName = profile?.displayName || user.email || "User";
      
      // Include user UID for reward tracking
      quizzoSocketService.joinMatchmaking(subject, displayName, user.uid);
      
      setGameState('matching');
      setError(null);
      
      // Start matching timer
      setMatchingTime(0);
      matchingTimerRef.current = setInterval(() => {
        setMatchingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to join matchmaking:", error);
      setError("Failed to join matchmaking. Please ensure you're connected to the server.");
    }
  };
  
  // Cancel matchmaking
  const cancelMatchmaking = () => {
    try {
      quizzoSocketService.leaveMatchmaking();
      setGameState('setup');
      clearInterval(matchingTimerRef.current as NodeJS.Timeout);
    } catch (error) {
      console.error("Failed to leave matchmaking:", error);
    }
  };
  
  // Handle answer selection
  const handleAnswer = (answerIndex: number) => {
    if (selectedOption !== null || timeLeft === 0) {
      return; // Already answered or time's up
    }
    
    setSelectedOption(answerIndex);
    
    // Calculate time taken to answer
    const timeElapsed = Date.now() - startTimeRef.current;
    
    // Submit answer to server
    if (currentQuestion) {
      quizzoSocketService.submitAnswer(currentQuestion.id, answerIndex, timeElapsed);
    }
    
    // Clear the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  // Play again
  const playAgain = () => {
    setGameState('setup');
    setCurrentQuestion(null);
    setQuestionCount(0);
    setSelectedOption(null);
    setGameResults(null);
    setRewardMessage(null);
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render game based on state
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quizzo Battle
          </h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            Test your knowledge in real-time 1v1 quiz battles with your peers.
          </p>
          
          {/* Info Button for How it Works popup */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Info className="h-4 w-4 mr-1" /> How it works
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>How Quizzo Battle Works</DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-blue-50 rounded-md">
                <ol className="list-decimal pl-6 text-sm space-y-2 text-blue-800">
                  <li>Select a subject from the dropdown</li>
                  <li>Click 'Find Match' to find an opponent</li>
                  <li>Answer 10 multiple-choice questions</li>
                  <li>The player with the highest score wins</li>
                  <li>Win: Earn 5 QCoins. Lose: Earn 1 QCoin</li>
                </ol>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Setup state */}
          {gameState === 'setup' && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                  <Trophy className="h-20 w-20 text-indigo-600 mx-auto" />
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Ready for a Challenge?
                </h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md w-full max-w-md flex items-center">
                    <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {user && (
                  <div className="bg-blue-50 p-3 rounded-md mb-6 w-full max-w-md flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-3">
                      <span className="text-lg font-semibold">
                        {profile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{profile?.displayName || user.email}</p>
                      <p className="text-xs text-blue-600">Logged in and ready to play</p>
                    </div>
                  </div>
                )}
                
                {!user && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-md text-center w-full max-w-md">
                    <p className="text-sm text-yellow-700 mb-3">You need to log in to play multiplayer quizzes</p>
                    <Button 
                      onClick={() => navigate('/login', { state: { returnTo: '/quizzo/multiplayer' } })}
                      variant="default"
                      size="sm"
                      className="mr-2"
                    >
                      Log In
                    </Button>
                    <Button 
                      onClick={() => navigate('/signup', { state: { returnTo: '/quizzo/multiplayer' } })}
                      variant="outline"
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
                
                <div className="mb-6 w-full">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Select Subject
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subj) => (
                        <SelectItem key={subj.id} value={subj.id}>
                          {subj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={startMatchmaking}
                    className="bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-white font-medium rounded-md"
                    disabled={!user || !subject}
                  >
                    Find Match
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Matchmaking state */}
          {gameState === 'matching' && (
            <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <div className="flex justify-center mb-6">
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">
                Finding an Opponent
              </h2>
              
              <div className="mb-6">
                <p className="mb-2 text-gray-600">Subject: <span className="font-semibold">{SUBJECTS.find(s => s.id === subject)?.name || subject}</span></p>
                <p className="text-gray-600">Time elapsed: <span className="font-semibold">{formatTime(matchingTime)}</span></p>
              </div>
              
              <Button 
                onClick={cancelMatchmaking}
                variant="outline"
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          )}
          
          {/* Playing state - Show current question */}
          {gameState === 'playing' && currentQuestion && (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">
                    {profile?.displayName || user?.email || "You"} vs. {opponent || "Opponent"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span className={`font-medium ${timeLeft <= 5 ? "text-red-600" : ""}`}>{timeLeft}s</span>
                </div>
              </div>
              
              <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                <div className="h-1 bg-indigo-600 rounded-full" style={{ width: `${(questionCount / totalQuestions) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Question {questionCount} of {totalQuestions}</span>
                {opponentAnswered && <span className="text-green-600">Opponent answered</span>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 rounded-md bg-indigo-50">
                  <div className="text-sm text-indigo-700">You</div>
                  <div className="text-2xl font-bold text-indigo-900">{myScore}</div>
                </div>
                
                <div className="text-center p-3 rounded-md bg-gray-50">
                  <div className="text-sm text-gray-700">Opponent</div>
                  <div className="text-2xl font-bold text-gray-900">{opponentScore}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 p-4 bg-gray-50 rounded-md">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, index: number) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full justify-start mb-2"
                      variant={
                        selectedOption !== null && index === currentQuestion.correctAnswer
                          ? "default"
                          : selectedOption === index && isCorrect
                            ? "default"
                            : selectedOption === index
                              ? "secondary"
                              : "outline"
                      }
                      disabled={selectedOption !== null || timeLeft === 0}
                    >
                      <div className="flex items-center">
                        {selectedOption !== null && index === currentQuestion.correctAnswer && (
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                        )}
                        {selectedOption === index && isCorrect && (
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                        )}
                        {selectedOption === index && !isCorrect && index !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 mr-2 text-red-500" />
                        )}
                        {(selectedOption === null || (index !== selectedOption && index !== currentQuestion.correctAnswer)) && (
                          <div className="h-5 w-5 mr-2 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 text-xs">
                            {['A', 'B', 'C', 'D'][index]}
                          </div>
                        )}
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Finished state - Show results */}
          {gameState === 'finished' && gameResults && (
            <div className="max-w-md mx-auto">
              <Card className="mb-6">
                <CardContent className="p-8 text-center">
                  <div className="mb-4">
                    {gameResults.myResult.score > gameResults.opponentResult.score ? (
                      <Trophy className="h-14 w-14 text-yellow-500 mx-auto" />
                    ) : gameResults.myResult.score < gameResults.opponentResult.score ? (
                      <Award className="h-14 w-14 text-blue-500 mx-auto" />
                    ) : (
                      <Medal className="h-14 w-14 text-purple-500 mx-auto" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-1">
                    {gameResults.myResult.score > gameResults.opponentResult.score
                      ? "You Won! 🎉"
                      : gameResults.myResult.score < gameResults.opponentResult.score
                      ? "Good Try!"
                      : "It's a Draw!"}
                  </h2>
                  
                  <p className="text-gray-500 mb-6">
                    {gameResults.myResult.score > gameResults.opponentResult.score
                      ? "Congratulations on your victory!"
                      : gameResults.myResult.score < gameResults.opponentResult.score
                      ? "You'll get them next time."
                      : "Both players matched each other."}
                  </p>
                  
                  {/* Final scores */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${
                      gameResults.myResult.score >= gameResults.opponentResult.score
                        ? "bg-green-50 border border-green-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}>
                      <p className="text-sm text-gray-600 mb-1">Your Score</p>
                      <p className="text-xl font-bold text-indigo-600">{gameResults.myResult.score}</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      gameResults.opponentResult.score > gameResults.myResult.score
                        ? "bg-green-50 border border-green-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}>
                      <p className="text-sm text-gray-600 mb-1">Opponent's Score</p>
                      <p className="text-xl font-bold">{gameResults.opponentResult.score}</p>
                    </div>
                  </div>
                  
                  {/* Points earned */}
                  {user && gameResults.myResult.score > 0 && (
                    <div className="mb-6 p-3 bg-indigo-50 rounded-lg text-indigo-700 font-medium">
                      {gameResults.myResult.score > gameResults.opponentResult.score ? (
                        <div className="flex items-center justify-center gap-2">
                          <div>Victory bonus: +50 XP</div>
                        </div>
                      ) : null}
                      <div className="mt-2">
                        Total: {gameResults.myResult.score + (gameResults.myResult.score > gameResults.opponentResult.score ? 50 : 0)} XP
                      </div>
                    </div>
                  )}
                  
                  {/* Reward message */}
                  {rewardMessage && (
                    <Badge variant="outline" className="mx-auto mt-2">
                      <Coins className="h-3.5 w-3.5 mr-1" />
                      {rewardMessage}
                    </Badge>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex flex-col gap-3">
                <Button onClick={() => setGameState('setup')} className="w-full">
                  Play Again
                </Button>
                <Button variant="outline" onClick={() => navigate("/quizzo")} className="w-full">
                  Back to Quizzo Hub
                </Button>
                <Link
                  to="/leaderboard"
                  className="w-full mt-2 text-center text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                >
                  <Medal className="h-4 w-4 mr-1.5" />
                  View Leaderboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 