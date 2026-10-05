import type { Achievement, QuizDifficulty, QuizProgress, QuizStats } from '@/types/quiz';
import { readJSON, writeJSON } from './storage';

/**
 * Persistance des tentatives de quiz (localStorage) et statistiques calculées à partir d'elles.
 * Aucune donnée n'est simulée : sans tentative, tout vaut zéro.
 */

/** Une tentative terminée, sous la forme affichée par l'historique */
export interface StoredQuizAttempt {
  id: string;
  categoryId: string;
  /** Titre de la catégorie de quiz */
  category: string;
  title: string;
  /** Date de fin, au format ISO */
  date: string;
  /** Durée en minutes (arrondie au-dessus, au moins 1) */
  duration: number;
  /** Score en pourcentage, de 0 à 100 */
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  difficulty: QuizDifficulty;
  status: 'completed';
  topics: string[];
  weakAreas: string[];
  strongAreas: string[];
}

const STORAGE_KEY = 'quiz-attempts-v1';
const MAX_ATTEMPTS = 100;
/** Score à partir duquel une catégorie est considérée comme réussie */
export const COMPLETION_THRESHOLD = 80;

const DIFFICULTIES: QuizDifficulty[] = ['Débutant', 'Intermédiaire', 'Avancé'];
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const isStoredAttempt = (v: unknown): v is StoredQuizAttempt => {
  if (typeof v !== 'object' || v === null) return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.categoryId === 'string' &&
    typeof a.category === 'string' &&
    typeof a.title === 'string' &&
    typeof a.date === 'string' &&
    !Number.isNaN(Date.parse(a.date)) &&
    isFiniteNumber(a.duration) &&
    isFiniteNumber(a.score) &&
    isFiniteNumber(a.totalQuestions) &&
    isFiniteNumber(a.correctAnswers) &&
    typeof a.difficulty === 'string' &&
    DIFFICULTIES.includes(a.difficulty as QuizDifficulty) &&
    a.status === 'completed' &&
    isStringArray(a.topics) &&
    isStringArray(a.weakAreas) &&
    isStringArray(a.strongAreas)
  );
};

/** Ne garde que les tentatives valides : un stockage corrompu ne casse jamais la page */
const readAttempts = (): StoredQuizAttempt[] => {
  const raw = readJSON<unknown>(STORAGE_KEY, []);
  return Array.isArray(raw) ? raw.filter(isStoredAttempt) : [];
};

// --- Petit store partagé : toutes les sections d'une page voient la même liste ---

let cache: StoredQuizAttempt[] | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

if (typeof window !== 'undefined') {
  // Modification faite dans un autre onglet
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = null;
      emit();
    }
  });
}

export const getQuizAttempts = (): StoredQuizAttempt[] => (cache ??= readAttempts());

export const subscribeQuizAttempts = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const saveQuizAttempt = (attempt: StoredQuizAttempt) => {
  const next = [attempt, ...getQuizAttempts()].slice(0, MAX_ATTEMPTS);
  cache = next;
  writeJSON(STORAGE_KEY, next);
  emit();
};

export const clearQuizAttempts = () => {
  cache = [];
  writeJSON(STORAGE_KEY, []);
  emit();
};

// --- Calculs ---

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Nombre de jours consécutifs avec au moins un quiz, et série en cours (aujourd'hui ou hier compris) */
const computeStreaks = (attempts: StoredQuizAttempt[], now: Date) => {
  const days = [...new Set(attempts.map((a) => dayKey(new Date(a.date))))].sort();
  if (days.length === 0) return { current: 0, longest: 0, thirdDayOfLongRun: null as string | null };

  const toMidnight = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  };

  let longest = 1;
  let run = 1;
  let thirdDay: string | null = null;
  for (let i = 1; i < days.length; i++) {
    const gap = Math.round((toMidnight(days[i]) - toMidnight(days[i - 1])) / DAY_MS);
    run = gap === 1 ? run + 1 : 1;
    if (run === 3 && thirdDay === null) thirdDay = days[i];
    longest = Math.max(longest, run);
  }

  // Série en cours : la dernière journée active doit être aujourd'hui ou hier
  const last = days[days.length - 1];
  const daysSinceLast = Math.round((toMidnight(dayKey(now)) - toMidnight(last)) / DAY_MS);
  let current = 0;
  if (daysSinceLast <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const gap = Math.round((toMidnight(days[i]) - toMidnight(days[i - 1])) / DAY_MS);
      if (gap !== 1) break;
      current++;
    }
  }
  return { current, longest, thirdDayOfLongRun: thirdDay };
};

const computeAchievements = (chronological: StoredQuizAttempt[], streakThirdDay: string | null): Achievement[] => {
  const achievements: Achievement[] = [];
  const at = (a: StoredQuizAttempt) => new Date(a.date);

  if (chronological.length >= 1) {
    achievements.push({
      id: 'first-quiz',
      title: 'Premier Pas',
      description: 'Terminer votre premier quiz',
      icon: 'trophy',
      unlockedAt: at(chronological[0]),
      category: 'completion'
    });
  }
  const firstHigh = chronological.find((a) => a.score >= 90);
  if (firstHigh) {
    achievements.push({
      id: 'high-score',
      title: 'Excellence',
      description: 'Obtenir au moins 90 % à un quiz',
      icon: 'award',
      unlockedAt: at(firstHigh),
      category: 'score'
    });
  }
  const firstPerfect = chronological.find((a) => a.score === 100);
  if (firstPerfect) {
    achievements.push({
      id: 'perfect-score',
      title: 'Score Parfait',
      description: 'Obtenir 100 % à un quiz',
      icon: 'target',
      unlockedAt: at(firstPerfect),
      category: 'score'
    });
  }
  if (chronological.length >= 5) {
    achievements.push({
      id: 'five-quizzes',
      title: 'Régulier',
      description: 'Terminer 5 quiz',
      icon: 'check-circle',
      unlockedAt: at(chronological[4]),
      category: 'completion'
    });
  }
  if (streakThirdDay) {
    const [y, m, d] = streakThirdDay.split('-').map(Number);
    achievements.push({
      id: 'streak-3',
      title: 'En Série',
      description: 'Faire un quiz trois jours de suite',
      icon: 'flame',
      unlockedAt: new Date(y, m - 1, d),
      category: 'streak'
    });
  }
  return achievements;
};

/** Statistiques globales, calculées uniquement à partir des tentatives enregistrées */
export const computeQuizStats = (attempts: StoredQuizAttempt[], totalCategories: number, now = new Date()): QuizStats => {
  // Du plus ancien au plus récent
  const chronological = [...attempts].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const total = attempts.length;
  const scores = attempts.map((a) => a.score);
  const streaks = computeStreaks(attempts, now);

  const categoryStats: QuizStats['categoryStats'] = {};
  // Somme exacte des scores par catégorie : arrondir à chaque tentative cumulerait les erreurs d'arrondi
  const scoreSums: Record<string, number> = {};
  for (const attempt of chronological) {
    const previous = categoryStats[attempt.categoryId];
    const count = (previous?.attempts ?? 0) + 1;
    scoreSums[attempt.categoryId] = (scoreSums[attempt.categoryId] ?? 0) + attempt.score;
    categoryStats[attempt.categoryId] = {
      attempts: count,
      bestScore: Math.max(previous?.bestScore ?? 0, attempt.score),
      averageScore: Math.round(scoreSums[attempt.categoryId] / count),
      lastAttempt: new Date(attempt.date),
      isCompleted: Math.max(previous?.bestScore ?? 0, attempt.score) >= COMPLETION_THRESHOLD
    };
  }

  return {
    totalAttempts: total,
    totalQuestionsAnswered: attempts.reduce((sum, a) => sum + a.totalQuestions, 0),
    averageScore: total === 0 ? 0 : Math.round(scores.reduce((s, v) => s + v, 0) / total),
    bestScore: total === 0 ? 0 : Math.max(...scores),
    totalTimeSpent: attempts.reduce((sum, a) => sum + a.duration, 0),
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    categoriesCompleted: Object.values(categoryStats).filter((c) => c.isCompleted).length,
    totalCategories,
    recentActivity: [],
    categoryStats,
    achievements: computeAchievements(chronological, streaks.thirdDayOfLongRun)
  };
};

/** Progression par catégorie */
export const computeQuizProgress = (attempts: StoredQuizAttempt[]): Record<string, QuizProgress> => {
  const chronological = [...attempts].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const progress: Record<string, QuizProgress> = {};
  const scoreSums: Record<string, number> = {};
  for (const attempt of chronological) {
    const previous = progress[attempt.categoryId];
    const count = (previous?.attempts ?? 0) + 1;
    scoreSums[attempt.categoryId] = (scoreSums[attempt.categoryId] ?? 0) + attempt.score;
    const bestScore = Math.max(previous?.bestScore ?? 0, attempt.score);
    progress[attempt.categoryId] = {
      categoryId: attempt.categoryId,
      questionsAnswered: attempt.totalQuestions,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      bestScore,
      lastAttempt: new Date(attempt.date),
      isCompleted: bestScore >= COMPLETION_THRESHOLD,
      averageScore: Math.round(scoreSums[attempt.categoryId] / count),
      attempts: count
    };
  }
  return progress;
};
