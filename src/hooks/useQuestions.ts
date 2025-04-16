import { useState, useEffect } from 'react';
import { QuizQuestion, QuizzoApiService } from '../services/quizzoApi';

const apiService = new QuizzoApiService();

interface UseQuestionsResult {
  questions: QuizQuestion[];
  loading: boolean;
  error: Error | null;
  fetchQuestions: (subject: string) => Promise<void>;
}

/**
 * Hook for fetching and managing quiz questions
 */
export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = async (subject: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await apiService.getQuestions(subject);
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
  };
} 