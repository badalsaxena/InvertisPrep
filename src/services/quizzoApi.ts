/**
 * API Service for Quizzo application
 */
import { Question, AnswerResult } from '../types/question';

/**
 * Interface for a quiz question
 */
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  subject: string;
}

/**
 * Interface for answer validation response
 */
export interface AnswerResponse {
  correct: boolean;
  correctAnswer?: number;
}

/**
 * Class for handling API calls to the Quizzo backend
 */
export class QuizzoApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    // Default to deployed Vercel URL, but allow override from environment
    return process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Fetches random questions for a given subject
   * @param subject The subject to fetch questions for
   * @returns Array of questions
   */
  async getQuestions(subject: string): Promise<Question[]> {
    try {
      const response = await fetch(`${this.baseUrl}/questions/${subject}`);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch questions: ${response.status} - ${error}`);
      }
      
      const data = await response.json();
      return data.questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Validates a user's answer to a question
   * @param subject The subject of the question
   * @param questionId The ID of the question
   * @param answerIndex The index of the selected answer
   * @returns Object containing whether the answer is correct and optionally the correct answer
   */
  async validateAnswer(subject: string, questionId: string, answerIndex: number): Promise<AnswerResult> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          questionId,
          answerIndex,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to validate answer: ${response.status} - ${error}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error validating answer:', error);
      throw error;
    }
  }

  /**
   * Check the health of the API
   * @returns API health status
   */
  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
} 