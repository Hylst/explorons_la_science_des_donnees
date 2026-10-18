/**
 * Hooks des quiz : catégories (données du site), statistiques et historique (tentatives enregistrées dans le navigateur)
 */

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import { QuizCategory, QuizStats, QuizProgress } from '../types/quiz';
import { quizCategories, getQuizCategoryById } from '../data/quizData';
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
      totalTime
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
