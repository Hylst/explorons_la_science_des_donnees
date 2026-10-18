import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StoredQuizAttempt } from "@/lib/quiz-storage";
import { act, cleanupHooks, renderHook } from "./render-hook";

/** Les tentatives sont gardées en cache par lib/quiz-storage : on recharge les modules pour chaque test */
const loadModules = async () => {
  vi.resetModules();
  const hooks = await import("./useQuiz");
  const data = await import("@/data/quizData");
  return { ...hooks, quizCategories: data.quizCategories };
};

const attempt = (id: string, categoryId: string, score: number, date: string): StoredQuizAttempt => ({
  id,
  categoryId,
  category: categoryId,
  title: `Quiz ${categoryId}`,
  date,
  duration: 4,
  score,
  totalQuestions: 10,
  correctAnswers: score / 10,
  difficulty: "Débutant",
  status: "completed",
  topics: [],
  weakAreas: [],
  strongAreas: [],
});

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanupHooks();
  localStorage.clear();
});

describe("useQuizCategories", () => {
  it("compte catégories, questions et durée à partir des données du site, sans chiffre inventé", async () => {
    const { useQuizCategories, quizCategories } = await loadModules();
    const h = renderHook(() => useQuizCategories());
    const stats = h.current.getQuizStats();
    expect(stats).toEqual({
      totalCategories: quizCategories.length,
      totalQuestions: quizCategories.reduce((n, c) => n + c.questions.length, 0),
      totalTime: quizCategories.reduce((n, c) => n + c.estimatedTime, 0),
    });
    expect(stats.totalQuestions).toBeGreaterThan(100);
    const first = quizCategories[0];
    expect(h.current.getCategoryById(first.id)).toBe(first);
    expect(h.current.getCategoryById("inconnue")).toBeUndefined();
  });
});

describe("useQuizStats et useQuizHistory", () => {
  it("valent zéro tant qu'aucun quiz n'est terminé", async () => {
    const { useQuizStats, useQuizHistory } = await loadModules();
    const stats = renderHook(() => useQuizStats());
    const history = renderHook(() => useQuizHistory());
    expect(stats.current.stats.totalAttempts).toBe(0);
    expect(stats.current.progress).toEqual({});
    expect(history.current.history).toEqual([]);
  });

  it("se mettent à jour quand une tentative est enregistrée, puis quand l'historique est effacé", async () => {
    const { useQuizStats, useQuizHistory } = await loadModules();
    const stats = renderHook(() => useQuizStats());
    const history = renderHook(() => useQuizHistory());
    act(() => stats.current.saveAttempt(attempt("a1", "python", 60, "2026-10-01T10:00:00.000Z")));
    act(() => history.current.addToHistory(attempt("a2", "python", 90, "2026-10-02T10:00:00.000Z")));
    expect(stats.current.stats.totalAttempts).toBe(2);
    expect(stats.current.progress.python.bestScore).toBe(90);
    expect(history.current.history.map((a) => a.id)).toEqual(["a2", "a1"]);
    act(() => history.current.clearHistory());
    expect(history.current.history).toEqual([]);
    expect(stats.current.stats.totalAttempts).toBe(0);
  });
});
