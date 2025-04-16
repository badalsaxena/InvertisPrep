import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Users, XCircle, Loader, CheckCircle } from "lucide-react";
import quizzoSocketService from "@/services/quizzoSocket";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ServerInfoDialog from "@/components/quizzo/ServerInfoDialog";

// Available subjects
const SUBJECTS = [
  { id: "c", name: "C Programming" },
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "web", name: "Web Development" },
];

export default function MultiplayerQuizzo() {
  const [username, setUsername] = useState<string>("");
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
  const [gameResults, setGameResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchingTime, setMatchingTime] = useState<number>(0);
  const [opponent, setOpponent] = useState<string>("");
  
  // Timer refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const matchingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Time taken to answer
  const startTimeRef = useRef<number>(0);
  
  // Connect to socket when component mounts
  useEffect(() => {
    const connectToSocket = async () => {
      try {
        console.log("Attempting to connect to Socket server...");
        await quizzoSocketService.connect();
        console.log("Successfully connected to Socket server");
      } catch (error) {
        console.error("Failed to connect to Quizzo server:", error);
        setError("Failed to connect to the Quizzo server. Please try again later or check server status.");
      }
    };
    
    connectToSocket();
    
    // Clean up socket connection when component unmounts
    return () => {
      clearTimeout(timerRef.current as NodeJS.Timeout);
      clearInterval(matchingTimerRef.current as NodeJS.Timeout);
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
    quizzoSocketService.onQuizEnd((results) => {
      console.log("Quiz ended:", results);
      setGameResults(results);
      setGameState('finished');
      setOpponentScore(results.opponentResult.score);
    });
    
    // Clean up event listeners
    return () => {
      quizzoSocketService.removeAllListeners();
    };
  }, []);
  
  // Start matchmaking
  const startMatchmaking = () => {
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    
    if (!subject) {
      setError("Please select a subject.");
      return;
    }
    
    try {
      quizzoSocketService.joinMatchmaking(subject, username);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Quizzo Battle
            </h1>
            <ServerInfoDialog />
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge in real-time 1v1 quiz battles with your peers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Setup state - Select subject and username */}
          {gameState === 'setup' && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex justify-center mb-6">
                <Trophy className="h-16 w-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Ready for a Challenge?
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Your Username
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Select Subject
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={startMatchmaking}
                  className="px-6"
                >
                  Find Opponent
                </Button>
              </div>
            </div>
          )}
          
          {/* Matchmaking state */}
          {gameState === 'matching' && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <Loader className="h-16 w-16 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Finding an Opponent
              </h2>
              <p className="text-gray-600 mb-2">
                Looking for a challenger in {SUBJECTS.find(s => s.id === subject)?.name || subject}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Time elapsed: {formatTime(matchingTime)}
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={cancelMatchmaking}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Playing state */}
          {gameState === 'playing' && currentQuestion && (
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Header with players and timer */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">
                    {username} vs. {opponent || "Opponent"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{timeLeft}s</span>
                </div>
              </div>
              
              {/* Scores */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-indigo-700">You</div>
                  <div className="text-xl font-bold text-indigo-900">{myScore}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-700">Opponent</div>
                  <div className="text-xl font-bold text-gray-900">{opponentScore}</div>
                </div>
              </div>
              
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {currentQuestion.question}
                </h3>
                
                {/* Answer options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      className={`w-full p-4 text-left rounded-lg border ${
                        selectedOption === index 
                          ? isCorrect === true
                            ? 'bg-green-100 border-green-500'
                            : isCorrect === false
                              ? 'bg-red-100 border-red-500'
                              : 'bg-indigo-100 border-indigo-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedOption !== null || timeLeft === 0}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {selectedOption === index && isCorrect === true && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {selectedOption === index && isCorrect === false && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question counter */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Question {questionCount} of {totalQuestions}
                </div>
                {opponentAnswered && (
                  <div className="text-sm text-indigo-700 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Opponent answered
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Finished state */}
          {gameState === 'finished' && gameResults && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex justify-center mb-6">
                <Trophy className="h-16 w-16 text-indigo-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-center">
                {gameResults.myResult.score > gameResults.opponentResult.score
                  ? "Victory!"
                  : gameResults.myResult.score < gameResults.opponentResult.score
                    ? "Defeat!"
                    : "Draw!"}
              </h2>
              
              {/* Final scores */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-lg text-center ${
                  gameResults.myResult.score >= gameResults.opponentResult.score 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="text-lg font-medium mb-1">You</div>
                  <div className="text-3xl font-bold mb-2">
                    {gameResults.myResult.score}
                  </div>
                  <div className="text-sm text-gray-600">
                    Time: {(gameResults.myResult.totalTime / 1000).toFixed(1)}s
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${
                  gameResults.opponentResult.score > gameResults.myResult.score 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="text-lg font-medium mb-1">Opponent</div>
                  <div className="text-3xl font-bold mb-2">
                    {gameResults.opponentResult.score}
                  </div>
                  <div className="text-sm text-gray-600">
                    Time: {(gameResults.opponentResult.totalTime / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={playAgain}
                  className="px-6"
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 