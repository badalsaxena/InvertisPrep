export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number; // Only available on server-side or after validation
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer?: number;
  points?: number;
} 