import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { CircleDashed, CircleCheck, CircleAlert, Timer } from "lucide-react";
import { updateQuizProgress } from '@/services/academicProgressService';
import { addQuizReward } from '@/services/walletService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Confetti from 'react-confetti';
import { useToast } from "@/components/ui/use-toast";

// Define a type for quiz questions
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Available subjects matching backend
const SUBJECTS = [
  { id: "computerScience", name: "Computer Science" },
  { id: "mathematics", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "general", name: "General Knowledge" },
];

const QUIZ_TYPES = [
  { value: "general", label: "General Knowledge" },
  { value: "technical", label: "Technical" },
  { value: "aptitude", label: "Aptitude" },
  { value: "reasoning", label: "Reasoning" }
];

// Demo questions based on categories
const DEMO_QUESTIONS = {
  general: {
    computerScience: [
      {
        id: "q1",
        text: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unlimited", "Central Protocol Unit"],
        correctAnswer: 0
      },
      {
        id: "q2",
        text: "Which of these is not a programming language?",
        options: ["Python", "Java", "HTML", "Banana"],
        correctAnswer: 3
      },
      {
        id: "q3",
        text: "What does HTTP stand for?",
        options: ["Hypertext Transfer Protocol", "High Transfer Text Protocol", "Hypertext Technical Protocol", "Highway Transfer Transit Protocol"],
        correctAnswer: 0
      },
      {
        id: "q4",
        text: "What is the main function of an operating system?",
        options: ["Run applications", "Manage hardware resources", "Perform calculations", "Store data"],
        correctAnswer: 1
      },
      {
        id: "q5",
        text: "Which data structure works on the principle of Last-In-First-Out (LIFO)?",
        options: ["Queue", "Stack", "Tree", "Graph"],
        correctAnswer: 1
      }
    ],
    mathematics: [
      {
        id: "q1",
        text: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.16", "3.12", "3.18"],
        correctAnswer: 0
      },
      {
        id: "q2",
        text: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: 1
      },
      {
        id: "q3",
        text: "If x + 3 = 8, what is the value of x?",
        options: ["3", "4", "5", "11"],
        correctAnswer: 2
      },
      {
        id: "q4",
        text: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1
      },
      {
        id: "q5",
        text: "What is the formula for the area of a circle?",
        options: ["πr", "2πr", "πr²", "2πr²"],
        correctAnswer: 2
      }
    ],
    general: [
      {
        id: "q1",
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      },
      {
        id: "q2",
        text: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
      },
      {
        id: "q3",
        text: "What is the capital of Japan?",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        correctAnswer: 2
      },
      {
        id: "q4",
        text: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Origami"],
        correctAnswer: 1
      },
      {
        id: "q5",
        text: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        correctAnswer: 2
      }
    ]
  },
  technical: {
    computerScience: [
      {
        id: "q1",
        text: "What is the time complexity of a binary search algorithm?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        correctAnswer: 2
      },
      {
        id: "q2",
        text: "Which protocol is used for secure communication over the internet?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: 2
      },
      {
        id: "q3",
        text: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Layer"],
        correctAnswer: 0
      },
      {
        id: "q4",
        text: "Which of these is not a JavaScript framework?",
        options: ["React", "Angular", "Django", "Vue"],
        correctAnswer: 2
      },
      {
        id: "q5",
        text: "What is the purpose of a constructor in object-oriented programming?",
        options: ["To destroy objects", "To initialize objects", "To copy objects", "To compare objects"],
        correctAnswer: 1
      }
    ]
  }
};

export default function SoloQuizzo() {
  const { user } = useAuth();
  const { refreshWallet } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [quizType, setQuizType] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [results, setResults] = useState<{
    correct: number;
    incorrect: number;
    total: number;
    accuracy: number;
    isWinner: boolean;
  }>({
    correct: 0,
    incorrect: 0,
    total: 0,
    accuracy: 0,
    isWinner: false
  });
  
  const handleStartQuiz = () => {
    if (!quizType || !subject) {
      toast({
        title: "Selection Required",
        description: "Please select both quiz type and subject",
        variant: "destructive"
      });
      return;
    }
    
    // Load questions based on selected type and subject
    const availableQuestions = DEMO_QUESTIONS[quizType as keyof typeof DEMO_QUESTIONS]?.[subject as keyof typeof DEMO_QUESTIONS[keyof typeof DEMO_QUESTIONS]];
    
    if (!availableQuestions || availableQuestions.length === 0) {
      toast({
        title: "No Questions Available",
        description: "No questions available for this combination. Try another category.",
        variant: "destructive"
      });
      return;
    }
    
    setQuestions(availableQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
  };
  
  const handleSelectAnswer = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(30);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = async () => {
    const correctAnswers = score;
    const totalQuestions = questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const isWinner = accuracy >= 60; // Winner if accuracy is 60% or higher
    
    setResults({
      correct: correctAnswers,
      incorrect: totalQuestions - correctAnswers,
      total: totalQuestions,
      accuracy,
      isWinner
    });
    
    setGameState('finished');
    
    if (isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    // Save results if user is logged in
    if (user) {
      try {
        // Calculate QCoin reward - 3 for winners, 1 for participation
        const coinsEarned = isWinner ? 3 : 1;
        setRewardMessage(`You earned ${coinsEarned} QCoins!`);
        
        // Update academic progress
        const quizData = {
          subject,
          score: correctAnswers * 10, // 10 points per correct answer
          correctAnswers,
          totalQuestions,
          isWin: isWinner,
          timeSpent: 0
        };
        
        // 1. Add QCoins to wallet
        await addQuizReward(user.uid, coinsEarned, isWinner, 'single', subject);
        
        // 2. Update academic progress
        await updateQuizProgress(user.uid, quizData);
        
        // 3. Refresh wallet to show updated balance
        setTimeout(() => {
          refreshWallet();
        }, 1500);
        
        toast({
          title: "Progress Saved",
          description: "Your quiz results have been saved to your profile.",
          variant: "default"
        });
      } catch (error) {
        console.error("Error saving quiz results:", error);
        toast({
          title: "Error",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!answered) {
            setAnswered(true);
            setSelectedAnswer(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, currentQuestionIndex, answered]);
  
  // Display different components based on game state
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Solo Quizzo</h1>
        <p className="text-gray-600 mt-2">Practice at your own pace</p>
      </div>
      
      {gameState === 'setup' && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quiz Type</label>
                <Select value={quizType} onValueChange={setQuizType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Quiz Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUIZ_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {gameState === 'playing' && questions.length > 0 && (
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{timeLeft}s</span>
            </div>
          </div>
          
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2 mb-6" />
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {questions[currentQuestionIndex].text}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option: string, idx: number) => (
                  <Button 
                    key={idx}
                    className="w-full justify-start mb-2"
                    variant={
                      answered && idx === questions[currentQuestionIndex].correctAnswer
                        ? "default"
                        : answered && selectedAnswer === idx
                          ? "secondary"
                          : "outline"
                    }
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={answered}
                  >
                    <div className="flex items-center">
                      {answered && idx === questions[currentQuestionIndex].correctAnswer && (
                        <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
                      )}
                      {answered && selectedAnswer === idx && idx !== questions[currentQuestionIndex].correctAnswer && (
                        <CircleAlert className="h-5 w-5 mr-2 text-red-500" />
                      )}
                      {(!answered || (idx !== selectedAnswer && idx !== questions[currentQuestionIndex].correctAnswer)) && (
                        <CircleDashed className="h-5 w-5 mr-2 text-gray-400" />
                      )}
                      {option}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={!answered}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === 'finished' && (
        <div className="max-w-md mx-auto">
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">
                  {results.isWinner ? "Great Job! 🎉" : "Quiz Complete"}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold">{results.correct}/{results.total}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Accuracy</p>
                    <p className="text-xl font-bold">{results.accuracy}%</p>
                  </div>
                </div>
                
                {/* Show reward message if user is logged in */}
                {rewardMessage && user && (
                  <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                    {rewardMessage}
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setGameState('setup')}>
                    Try Another Quiz
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/quizzo")}>
                    Back to Quizzo Hub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 