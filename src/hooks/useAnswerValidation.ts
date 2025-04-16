import { useState } from 'react';
import { QuizzoApiService } from '../services/quizzoApi';

const apiService = new QuizzoApiService();

interface UseAnswerValidationResult {
  isCorrect: boolean | null;
  correctAnswer: number | null;
  loading: boolean;
  error: Error | null;
  validateAnswer: (subject: string, questionId: string, answerIndex: number) => Promise<boolean>;
}

/**
 * Hook for validating quiz answers
 */
export function useAnswerValidation(): UseAnswerValidationResult {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const validateAnswer = async (subject: string, questionId: string, answerIndex: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.validateAnswer(subject, questionId, answerIndex);
      setIsCorrect(response.correct);
      if (!response.correct && response.correctAnswer !== undefined) {
        setCorrectAnswer(response.correctAnswer);
      }
      return response.correct;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to validate answer'));
      console.error('Error validating answer:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isCorrect,
    correctAnswer,
    loading,
    error,
    validateAnswer,
  };
} 