/**
 * Custom hook for managing quiz state and operations
 */

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { 
  QuizCategory, 
  QuizAnswer, 
  QuizAttempt, 
  QuizResults, 
  QuizSession,
  QuizStats,
  QuizProgress
} from '../types/quiz';
import { quizCategories, getQuizCategoryById, getRandomQuestions } from '../data/quizData';
import {
  clearQuizAttempts,
  computeQuizProgress,
  computeQuizStats,
  getQuizAttempts,
  saveQuizAttempt,
  subscribeQuizAttempts
} from '../lib/quiz-storage';

/**
 * Hook for managing quiz categories and general quiz data
 */
export const useQuizCategories = () => {
  const [categories] = useState<QuizCategory[]>(quizCategories);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getCategoryById = useCallback((id: string) => {
    return getQuizCategoryById(id);
  }, []);

  const getQuizStats = useCallback(() => {
    const totalCategories = categories.length;
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const totalTime = categories.reduce((sum, cat) => sum + cat.estimatedTime, 0);
    
    return {
      totalCategories,
      totalQuestions,
      totalTime,
      avgProgress: 0 // This would come from user progress data
    };
  }, [categories]);

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getQuizStats
  };
};

/**
 * Hook for managing quiz session state
 */
export const useQuizSession = (categoryId: string, questionCount: number = 5) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize quiz session
  const startQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const category = getQuizCategoryById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      const questions = getRandomQuestions(categoryId, questionCount);
      if (questions.length === 0) {
        throw new Error('No questions available for this category');
      }

      const newSession: QuizSession = {
        categoryId,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: new Date(),
        isCompleted: false,
        showExplanations: false
      };

      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  }, [categoryId, questionCount]);

  // Submit answer for current question
  const submitAnswer = useCallback((selectedAnswer: number) => {
    if (!session || session.isCompleted) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - session.startTime.getTime()) / 1000);

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    const updatedAnswers = [...session.answers, newAnswer];
    const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

    setSession(prev => prev ? {
      ...prev,
      answers: updatedAnswers,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
      isCompleted: isLastQuestion
    } : null);

    return { isCorrect, isLastQuestion };
  }, [session]);

  // Navigate to specific question
  const goToQuestion = useCallback((index: number) => {
    if (!session || index < 0 || index >= session.questions.length) return;
    
    setSession(prev => prev ? {
      ...prev,
      currentQuestionIndex: index
    } : null);
  }, [session]);

  // Toggle explanations visibility
  const toggleExplanations = useCallback(() => {
    setSession(prev => prev ? {
      ...prev,
      showExplanations: !prev.showExplanations
    } : null);
  }, []);

  // Reset quiz session
  const resetQuiz = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    if (!session) return null;
    return session.questions[session.currentQuestionIndex];
  }, [session]);

  // Get quiz progress
  const getProgress = useCallback(() => {
    if (!session) return { current: 0, total: 0, percentage: 0 };
    
    const current = session.answers.length;
    const total = session.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    
    return { current, total, percentage };
  }, [session]);

  return {
    session,
    loading,
    error,
    startQuiz,
    submitAnswer,
    goToQuestion,
    toggleExplanations,
    resetQuiz,
    getCurrentQuestion,
    getProgress
  };
};

/**
 * Hook for calculating quiz results
 */
export const useQuizResults = (session: QuizSession | null) => {
  const [results, setResults] = useState<QuizResults | null>(null);

  const calculateResults = useCallback(() => {
    if (!session || !session.isCompleted) return null;

    const { questions, answers, startTime, categoryId } = session;
    const category = getQuizCategoryById(categoryId);
    
    if (!category) return null;

    const endTime = new Date();
    const totalTime = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    const pointsEarned = answers.reduce((sum, answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      return sum + (answer.isCorrect && question ? question.points : 0);
    }, 0);
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);

    // Create quiz attempt
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      categoryId,
      categoryTitle: category.title,
      questions,
      answers,
      startTime,
      endTime,
      totalTime,
      score: scorePercentage,
      correctAnswers,
      totalQuestions: questions.length,
      pointsEarned,
      maxPoints,
      isCompleted: true
    };

    // Calculate insights
    const topicBreakdown: { [topic: string]: { correct: number; total: number; percentage: number } } = {};
    const difficultyBreakdown: QuizResults['insights']['difficultyBreakdown'] = {
      'Débutant': { correct: 0, total: 0, percentage: 0 },
      'Intermédiaire': { correct: 0, total: 0, percentage: 0 },
      'Avancé': { correct: 0, total: 0, percentage: 0 }
    };

    questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      const isCorrect = answer?.isCorrect || false;

      // Topic breakdown
      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = { correct: 0, total: 0, percentage: 0 };
      }
      topicBreakdown[question.topic].total++;
      if (isCorrect) topicBreakdown[question.topic].correct++;
      topicBreakdown[question.topic].percentage = Math.round(
        (topicBreakdown[question.topic].correct / topicBreakdown[question.topic].total) * 100
      );

      // Difficulty breakdown
      difficultyBreakdown[question.difficulty].total++;
      if (isCorrect) difficultyBreakdown[question.difficulty].correct++;
      difficultyBreakdown[question.difficulty].percentage = Math.round(
        (difficultyBreakdown[question.difficulty].correct / difficultyBreakdown[question.difficulty].total) * 100
      );
    });

    // Identify strong and weak areas
    const strongAreas = Object.entries(topicBreakdown)
      .filter(([_, stats]) => stats.percentage >= 80)
      .map(([topic]) => topic);
    
    const weakAreas = Object.entries(topicBreakdown)
      .filter(([_, stats]) => stats.percentage < 60)
      .map(([topic]) => topic);

    // Generate recommendations
    const recommendations: string[] = [];
    if (scorePercentage < 60) {
      recommendations.push('Révisez les concepts de base avant de retenter le quiz.');
    }
    if (weakAreas.length > 0) {
      recommendations.push(`Concentrez-vous sur: ${weakAreas.join(', ')}.`);
    }
    if (totalTime > category.estimatedTime * 60 * 1.5) {
      recommendations.push('Travaillez sur la rapidité de réponse.');
    }
    if (scorePercentage >= 80) {
      recommendations.push('Excellent travail! Essayez un niveau plus difficile.');
    }

    const quizResults: QuizResults = {
      attempt,
      performance: {
        scorePercentage,
        correctCount: correctAnswers,
        incorrectCount: questions.length - correctAnswers,
        totalTime,
        averageTimePerQuestion: Math.round(totalTime / questions.length),
        pointsEarned,
        maxPoints
      },
      insights: {
        strongAreas,
        weakAreas,
        difficultyBreakdown,
        topicBreakdown
      },
      recommendations
    };

    setResults(quizResults);
    return quizResults;
  }, [session]);

  useEffect(() => {
    if (session?.isCompleted) {
      calculateResults();
    }
  }, [session, calculateResults]);

  return {
    results,
    calculateResults
  };
};

/**
 * Hook des statistiques et de la progression : calculées à partir des tentatives réellement enregistrées
 * (localStorage). Sans tentative, tous les compteurs valent zéro.
 */
export const useQuizStats = () => {
  const attempts = useSyncExternalStore(subscribeQuizAttempts, getQuizAttempts);
  const stats: QuizStats = useMemo(() => computeQuizStats(attempts, quizCategories.length), [attempts]);
  const progress: { [categoryId: string]: QuizProgress } = useMemo(() => computeQuizProgress(attempts), [attempts]);

  return {
    stats,
    progress,
    loading: false,
    error: null as string | null,
    saveAttempt: saveQuizAttempt
  };
};

/**
 * Hook de l'historique : les tentatives terminées, de la plus récente à la plus ancienne
 */
export const useQuizHistory = () => {
  const history = useSyncExternalStore(subscribeQuizAttempts, getQuizAttempts);

  return {
    history,
    loading: false,
    error: null as string | null,
    addToHistory: saveQuizAttempt,
    clearHistory: clearQuizAttempts
  };
};
