/**
 * TypeScript interfaces and types for the Quiz system
 */

/**
 * Quiz difficulty levels
 */
export type QuizDifficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';

/**
 * Quiz question interface
 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: QuizDifficulty;
  topic: string;
  points: number;
}

/**
 * Quiz category interface
 */
export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: QuizDifficulty;
  estimatedTime: number; // in minutes
  topics: string[];
  questions: QuizQuestion[];
}

/**
 * User's answer to a quiz question
 */
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  timestamp: Date;
}

/**
 * Alternative interface for user answers (used in components)
 * @deprecated Use QuizAnswer instead for consistency
 */
export interface UserAnswer {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  timestamp: Date;
}

/**
 * Quiz attempt/session interface
 */
export interface QuizAttempt {
  id: string;
  categoryId: string;
  categoryTitle: string;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  startTime: Date;
  endTime?: Date;
  totalTime: number; // in seconds
  score: number; // percentage
  correctAnswers: number;
  totalQuestions: number;
  pointsEarned: number;
  maxPoints: number;
  isCompleted: boolean;
}

/**
 * Quiz results interface
 */
export interface QuizResults {
  attempt: QuizAttempt;
  performance: {
    scorePercentage: number;
    correctCount: number;
    incorrectCount: number;
    totalTime: number;
    averageTimePerQuestion: number;
    pointsEarned: number;
    maxPoints: number;
  };
  insights: {
    strongAreas: string[];
    weakAreas: string[];
    difficultyBreakdown: {
      [key in QuizDifficulty]: {
        correct: number;
        total: number;
        percentage: number;
      };
    };
    topicBreakdown: {
      [topic: string]: {
        correct: number;
        total: number;
        percentage: number;
      };
    };
  };
  recommendations: string[];
}

/**
 * Résultat simplifié d'un quiz, échangé entre QuizTaking, QuizResults et la page d'une catégorie
 */
export interface SimpleQuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  answers: QuizAnswer[];
  weakAreas: string[];
  strongAreas: string[];
}

/**
 * Quiz statistics for a user
 */
export interface QuizStats {
  totalAttempts: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  categoriesCompleted: number;
  totalCategories: number;
  recentActivity: QuizAttempt[];
  categoryStats: {
    [categoryId: string]: {
      attempts: number;
      bestScore: number;
      averageScore: number;
      lastAttempt: Date;
      isCompleted: boolean;
    };
  };
  achievements: Achievement[];
}

/**
 * Achievement interface
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'score' | 'streak' | 'completion' | 'time' | 'special';
}

/**
 * Quiz session state for taking a quiz
 */
export interface QuizSession {
  categoryId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: Date;
  timeRemaining?: number; // in seconds, if timed
  isCompleted: boolean;
  showExplanations: boolean;
}

/**
 * Quiz settings/preferences
 */
export interface QuizSettings {
  showExplanationsImmediately: boolean;
  enableTimer: boolean;
  timePerQuestion: number; // in seconds
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  enableHints: boolean;
  difficulty: QuizDifficulty | 'all';
}

/**
 * Quiz filter options
 */
export interface QuizFilters {
  difficulty?: QuizDifficulty | 'all';
  category?: string | 'all';
  topic?: string | 'all';
  completed?: boolean | 'all';
  sortBy: 'title' | 'difficulty' | 'time' | 'score' | 'date';
  sortOrder: 'asc' | 'desc';
}

/**
 * Quiz history entry
 */
export interface QuizHistoryEntry {
  id: string;
  categoryId: string;
  categoryTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
  difficulty: QuizDifficulty;
}

/**
 * Quiz progress tracking
 */
export interface QuizProgress {
  categoryId: string;
  questionsAnswered: number;
  totalQuestions: number;
  correctAnswers: number;
  bestScore: number;
  lastAttempt?: Date;
  isCompleted: boolean;
  averageScore: number;
  attempts: number;
}

/**
 * Quiz leaderboard entry
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalScore: number;
  averageScore: number;
  completedQuizzes: number;
  rank: number;
  achievements: number;
}

/**
 * Quiz notification
 */
export interface QuizNotification {
  id: string;
  type: 'achievement' | 'reminder' | 'challenge' | 'update';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

/**
 * Quiz challenge
 */
export interface QuizChallenge {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  targetScore: number;
  timeLimit?: number; // in minutes
  startDate: Date;
  endDate: Date;
  participants: number;
  reward: string;
  isActive: boolean;
}
