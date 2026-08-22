export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  options: string[];
  paperSet?: 'set1' | 'set2';
  level?: string;
}

export interface QuizResult {
  id: string;
  date: string;
  paperSet: 'set1' | 'set2';
  paperTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  categoryFilter: string;
}

export interface QuizState {
  currentIndex: number;
  selectedAnswers: { [questionId: string]: string };
  isSubmitted: boolean;
  score: number;
  timeRemainingSeconds: number;
}
