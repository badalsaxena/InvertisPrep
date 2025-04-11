import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Users } from "lucide-react";

// Sample quiz questions
const sampleQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2, // Index of correct answer (0-based)
  },
  {
    id: 2,
    question: "Which of the following is not a JavaScript data type?",
    options: ["String", "Boolean", "Character", "Number"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "Who is the founder of Linux?",
    options: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"],
    correctAnswer: 1,
  },
];

export default function Quizzo() {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(10);
    setSelectedOption(null);
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    if (optionIndex === sampleQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(10);
        setSelectedOption(null);
      } else {
        setGameState('finished');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quizzo Battle
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge in real-time 1v1 quiz battles with your peers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {gameState === 'waiting' && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <Trophy className="h-16 w-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Ready for a Challenge?
              </h2>
              <p className="text-gray-600 mb-8">
                Compete in a 1v1 quiz battle with 10 seconds per question. Test your knowledge and climb the leaderboard!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={startGame}
                  className="px-6"
                >
                  Start Quizzo
                </Button>
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">You vs. Opponent</span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{timeLeft}s</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {sampleQuestions[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-4 text-left rounded-lg border ${
                        selectedOption === index 
                          ? index === sampleQuestions[currentQuestion].correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : 'bg-red-100 border-red-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedOption !== null}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </div>
                <div className="font-medium">
                  Score: {score}
                </div>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <Trophy className="h-16 w-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Quiz Completed!
              </h2>
              <p className="text-gray-600 mb-2">
                Your score:
              </p>
              <p className="text-3xl font-bold text-indigo-600 mb-8">
                {score} / {sampleQuestions.length}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={startGame}
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