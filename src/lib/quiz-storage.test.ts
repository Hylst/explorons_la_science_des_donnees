import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StoredQuizAttempt } from "./quiz-storage";

const STORAGE_KEY = "quiz-attempts-v1";

/** Le module garde un cache et des abonnés au niveau du module : on le recharge pour chaque test */
const loadModule = async () => {
  vi.resetModules();
  return import("./quiz-storage");
};

let counter = 0;

/** Date locale à midi, `daysAgo` jours avant le 1er octobre 2026 (indépendant du fuseau horaire) */
const dayAt = (daysAgo: number, hour = 12) => new Date(2026, 9, 1 - daysAgo, hour, 0, 0).toISOString();
const NOW = new Date(2026, 9, 1, 15, 0, 0);

const attempt = (overrides: Partial<StoredQuizAttempt> = {}): StoredQuizAttempt => {
  counter++;
  return {
    id: `a${counter}`,
    categoryId: "python",
    category: "Python",
    title: "Quiz Python",
    date: dayAt(0),
    duration: 5,
    score: 70,
    totalQuestions: 10,
    correctAnswers: 7,
    difficulty: "Débutant",
    status: "completed",
    topics: ["bases"],
    weakAreas: [],
    strongAreas: ["bases"],
    ...overrides,
  };
};

beforeEach(() => {
  localStorage.clear();
  counter = 0;
});

afterEach(() => {
  localStorage.clear();
});

describe("enregistrement des tentatives", () => {
  it("part d'une liste vide", async () => {
    const quiz = await loadModule();
    expect(quiz.getQuizAttempts()).toEqual([]);
  });

  it("garde la tentative en mémoire et dans le localStorage", async () => {
    const quiz = await loadModule();
    const saved = attempt({ score: 80 });
    quiz.saveQuizAttempt(saved);
    expect(quiz.getQuizAttempts()).toEqual([saved]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual([saved]);
  });

  it("place la tentative la plus récente en tête", async () => {
    const quiz = await loadModule();
    const first = attempt();
    const second = attempt();
    quiz.saveQuizAttempt(first);
    quiz.saveQuizAttempt(second);
    expect(quiz.getQuizAttempts().map((a) => a.id)).toEqual([second.id, first.id]);
  });

  it("relit les tentatives enregistrées lors d'une visite précédente", async () => {
    const saved = attempt({ score: 90 });
    localStorage.setItem(STORAGE_KEY, JSON.stringify([saved]));
    const quiz = await loadModule();
    expect(quiz.getQuizAttempts()).toEqual([saved]);
  });

  it("limite l'historique aux 100 dernières tentatives", async () => {
    const quiz = await loadModule();
    for (let i = 0; i < 105; i++) quiz.saveQuizAttempt(attempt({ id: `t${i}` }));
    const ids = quiz.getQuizAttempts().map((a) => a.id);
    expect(ids).toHaveLength(100);
    expect(ids[0]).toBe("t104");
    expect(ids[99]).toBe("t5");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")).toHaveLength(100);
  });

  it("prévient les abonnés à chaque enregistrement, puis cesse après le désabonnement", async () => {
    const quiz = await loadModule();
    const listener = vi.fn();
    const unsubscribe = quiz.subscribeQuizAttempts(listener);
    quiz.saveQuizAttempt(attempt());
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    quiz.saveQuizAttempt(attempt());
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("clearQuizAttempts vide la liste, le stockage, et prévient les abonnés", async () => {
    const quiz = await loadModule();
    quiz.saveQuizAttempt(attempt());
    const listener = vi.fn();
    quiz.subscribeQuizAttempts(listener);
    quiz.clearQuizAttempts();
    expect(quiz.getQuizAttempts()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("ne lève pas d'exception si le stockage refuse l'écriture, et garde la tentative en mémoire", async () => {
    const quiz = await loadModule();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota dépassé", "QuotaExceededError");
    });
    const saved = attempt();
    expect(() => quiz.saveQuizAttempt(saved)).not.toThrow();
    expect(quiz.getQuizAttempts()).toEqual([saved]);
  });

  it("relit le stockage quand un autre onglet le modifie", async () => {
    const quiz = await loadModule();
    expect(quiz.getQuizAttempts()).toEqual([]);
    const listener = vi.fn();
    quiz.subscribeQuizAttempts(listener);
    const other = attempt({ id: "autre-onglet" });
    localStorage.setItem(STORAGE_KEY, JSON.stringify([other]));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(quiz.getQuizAttempts().map((a) => a.id)).toEqual(["autre-onglet"]);
  });

  it("ignore la modification d'une clé sans rapport", async () => {
    const quiz = await loadModule();
    const saved = attempt();
    quiz.saveQuizAttempt(saved);
    const listener = vi.fn();
    quiz.subscribeQuizAttempts(listener);
    localStorage.setItem(STORAGE_KEY, "[]");
    window.dispatchEvent(new StorageEvent("storage", { key: "autre-cle" }));
    expect(listener).not.toHaveBeenCalled();
    expect(quiz.getQuizAttempts()).toEqual([saved]);
  });

  it("relit aussi le stockage quand il est entièrement vidé (clé nulle)", async () => {
    const quiz = await loadModule();
    quiz.saveQuizAttempt(attempt());
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    expect(quiz.getQuizAttempts()).toEqual([]);
  });
});

describe("données corrompues dans le localStorage", () => {
  it("un JSON invalide donne une liste vide, sans exception", async () => {
    localStorage.setItem(STORAGE_KEY, "{pas du json");
    const quiz = await loadModule();
    expect(() => quiz.getQuizAttempts()).not.toThrow();
    expect(quiz.getQuizAttempts()).toEqual([]);
  });

  it("une valeur qui n'est pas un tableau donne une liste vide", async () => {
    for (const raw of ['{"a":1}', "42", '"texte"', "null", "true"]) {
      localStorage.setItem(STORAGE_KEY, raw);
      const quiz = await loadModule();
      expect(quiz.getQuizAttempts(), raw).toEqual([]);
    }
  });

  it("un stockage bloqué donne une liste vide", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Accès refusé", "SecurityError");
    });
    const quiz = await loadModule();
    expect(quiz.getQuizAttempts()).toEqual([]);
  });

  it("ne garde que les tentatives valides d'un tableau mélangé", async () => {
    const valid = attempt({ id: "valide" });
    const broken: unknown[] = [
      null,
      "texte",
      42,
      [],
      {},
      { ...attempt(), id: 12 },
      { ...attempt(), date: "pas une date" },
      { ...attempt(), score: "80" },
      { ...attempt(), score: null },
      { ...attempt(), difficulty: "Expert" },
      { ...attempt(), status: "abandoned" },
      { ...attempt(), topics: "bases" },
      { ...attempt(), weakAreas: [1, 2] },
      { ...attempt(), strongAreas: undefined },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...broken.slice(0, 7), valid, ...broken.slice(7)]));
    const quiz = await loadModule();
    expect(quiz.getQuizAttempts().map((a) => a.id)).toEqual(["valide"]);
  });

  it("des tentatives corrompues ne faussent pas les statistiques", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: "x", score: 100 }, attempt({ score: 60 })]));
    const quiz = await loadModule();
    const stats = quiz.computeQuizStats(quiz.getQuizAttempts(), 5, NOW);
    expect(stats.totalAttempts).toBe(1);
    expect(stats.bestScore).toBe(60);
  });

  it("repart de zéro après une écriture sur un stockage corrompu", async () => {
    localStorage.setItem(STORAGE_KEY, "n'importe quoi");
    const quiz = await loadModule();
    const saved = attempt();
    quiz.saveQuizAttempt(saved);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual([saved]);
  });
});

describe("computeQuizStats", () => {
  it("vaut zéro partout sans tentative", async () => {
    const quiz = await loadModule();
    const stats = quiz.computeQuizStats([], 7, NOW);
    expect(stats).toMatchObject({
      totalAttempts: 0,
      totalQuestionsAnswered: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      categoriesCompleted: 0,
      totalCategories: 7,
    });
    expect(stats.achievements).toEqual([]);
    expect(stats.categoryStats).toEqual({});
    expect(Number.isNaN(stats.averageScore)).toBe(false);
  });

  it("calcule total, moyenne, meilleur score, questions et temps à partir des tentatives", async () => {
    const quiz = await loadModule();
    const stats = quiz.computeQuizStats(
      [
        attempt({ score: 60, totalQuestions: 10, duration: 4 }),
        attempt({ score: 85, totalQuestions: 20, duration: 12 }),
        attempt({ score: 100, totalQuestions: 5, duration: 3 }),
      ],
      9,
      NOW
    );
    expect(stats.totalAttempts).toBe(3);
    expect(stats.averageScore).toBe(82); // (60 + 85 + 100) / 3 = 81,67
    expect(stats.bestScore).toBe(100);
    expect(stats.totalQuestionsAnswered).toBe(35);
    expect(stats.totalTimeSpent).toBe(19);
    expect(stats.totalCategories).toBe(9);
  });

  it("regroupe les statistiques par catégorie", async () => {
    const quiz = await loadModule();
    const stats = quiz.computeQuizStats(
      [
        attempt({ categoryId: "python", score: 50, date: dayAt(3) }),
        attempt({ categoryId: "python", score: 90, date: dayAt(1) }),
        attempt({ categoryId: "sql", score: 40, date: dayAt(2) }),
      ],
      4,
      NOW
    );
    expect(Object.keys(stats.categoryStats).sort()).toEqual(["python", "sql"]);
    expect(stats.categoryStats.python).toMatchObject({ attempts: 2, bestScore: 90, averageScore: 70, isCompleted: true });
    expect(stats.categoryStats.sql).toMatchObject({ attempts: 1, bestScore: 40, averageScore: 40, isCompleted: false });
    expect(stats.categoryStats.python.lastAttempt.toISOString()).toBe(dayAt(1));
    expect(stats.categoriesCompleted).toBe(1);
  });

  it("considère une catégorie comme réussie à partir de 80 % exactement", async () => {
    const quiz = await loadModule();
    expect(quiz.COMPLETION_THRESHOLD).toBe(80);
    const at79 = quiz.computeQuizStats([attempt({ score: 79 })], 1, NOW);
    const at80 = quiz.computeQuizStats([attempt({ score: 80 })], 1, NOW);
    expect(at79.categoryStats.python.isCompleted).toBe(false);
    expect(at80.categoryStats.python.isCompleted).toBe(true);
    expect(at79.categoriesCompleted).toBe(0);
    expect(at80.categoriesCompleted).toBe(1);
  });

  it("la réussite d'une catégorie est conservée si une tentative ultérieure est plus faible", async () => {
    const quiz = await loadModule();
    const stats = quiz.computeQuizStats(
      [attempt({ score: 95, date: dayAt(2) }), attempt({ score: 30, date: dayAt(1) })],
      1,
      NOW
    );
    expect(stats.categoryStats.python.bestScore).toBe(95);
    expect(stats.categoryStats.python.isCompleted).toBe(true);
  });

  it("ne dépend pas de l'ordre dans lequel les tentatives sont fournies", async () => {
    const quiz = await loadModule();
    const list = [
      attempt({ score: 50, date: dayAt(4) }),
      attempt({ score: 70, date: dayAt(3) }),
      attempt({ score: 90, date: dayAt(2) }),
    ];
    const forward = quiz.computeQuizStats(list, 3, NOW);
    const backward = quiz.computeQuizStats([...list].reverse(), 3, NOW);
    expect(backward).toEqual(forward);
  });

  it("la moyenne par catégorie est la moyenne arrondie des scores", async () => {
    // Scores 0, 25, 0 : moyenne réelle 8,33, donc 8 une fois arrondie.
    const quiz = await loadModule();
    const list = [
      attempt({ score: 0, date: dayAt(3) }),
      attempt({ score: 25, date: dayAt(2) }),
      attempt({ score: 0, date: dayAt(1) }),
    ];
    const stats = quiz.computeQuizStats(list, 1, NOW);
    expect(stats.categoryStats.python.averageScore).toBe(8);
  });

  describe("séries de jours consécutifs", () => {
    it("compte la série en cours quand le dernier quiz date d'aujourd'hui", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(2) }), attempt({ date: dayAt(1) }), attempt({ date: dayAt(0) })], 1, NOW);
      expect(stats.currentStreak).toBe(3);
      expect(stats.longestStreak).toBe(3);
    });

    it("garde la série en cours quand le dernier quiz date d'hier", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(2) }), attempt({ date: dayAt(1) })], 1, NOW);
      expect(stats.currentStreak).toBe(2);
    });

    it("remet la série en cours à zéro après un jour sans quiz, sans toucher à la plus longue", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(4) }), attempt({ date: dayAt(3) }), attempt({ date: dayAt(2) })], 1, NOW);
      expect(stats.currentStreak).toBe(0);
      expect(stats.longestStreak).toBe(3);
    });

    it("compte une seule fois plusieurs quiz le même jour", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(0, 9) }), attempt({ date: dayAt(0, 14) })], 1, NOW);
      expect(stats.currentStreak).toBe(1);
      expect(stats.longestStreak).toBe(1);
    });

    it("une journée manquante coupe la série", async () => {
      const quiz = await loadModule();
      // Jours : 5, 4 puis 2, 1, 0 (le 3 manque)
      const days = [5, 4, 2, 1, 0];
      const stats = quiz.computeQuizStats(days.map((d) => attempt({ date: dayAt(d) })), 1, NOW);
      expect(stats.longestStreak).toBe(3);
      expect(stats.currentStreak).toBe(3);
    });

    it("la plus longue série peut être antérieure à la série en cours", async () => {
      const quiz = await loadModule();
      const days = [9, 8, 7, 6, 0];
      const stats = quiz.computeQuizStats(days.map((d) => attempt({ date: dayAt(d) })), 1, NOW);
      expect(stats.longestStreak).toBe(4);
      expect(stats.currentStreak).toBe(1);
    });
  });

  describe("succès", () => {
    const ids = (list: { id: string }[]) => list.map((a) => a.id);

    it("n'en débloque aucun sans tentative", async () => {
      const quiz = await loadModule();
      expect(quiz.computeQuizStats([], 1, NOW).achievements).toEqual([]);
    });

    it("débloque seulement « premier quiz » après une tentative moyenne", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ score: 50 })], 1, NOW);
      expect(ids(stats.achievements)).toEqual(["first-quiz"]);
    });

    it("débloque l'excellence à 90 % mais pas à 89 %", async () => {
      const quiz = await loadModule();
      expect(ids(quiz.computeQuizStats([attempt({ score: 89 })], 1, NOW).achievements)).not.toContain("high-score");
      const at90 = quiz.computeQuizStats([attempt({ score: 90 })], 1, NOW);
      expect(ids(at90.achievements)).toContain("high-score");
      expect(ids(at90.achievements)).not.toContain("perfect-score");
    });

    it("débloque le score parfait à 100 % seulement", async () => {
      const quiz = await loadModule();
      expect(ids(quiz.computeQuizStats([attempt({ score: 99 })], 1, NOW).achievements)).not.toContain("perfect-score");
      expect(ids(quiz.computeQuizStats([attempt({ score: 100 })], 1, NOW).achievements)).toEqual(
        expect.arrayContaining(["first-quiz", "high-score", "perfect-score"])
      );
    });

    it("date le succès « Régulier » de la cinquième tentative, dans l'ordre chronologique", async () => {
      const quiz = await loadModule();
      const list = [6, 5, 4, 3, 2].map((d) => attempt({ date: dayAt(d), score: 50 }));
      const stats = quiz.computeQuizStats(list, 1, NOW);
      const five = stats.achievements.find((a) => a.id === "five-quizzes");
      expect(five?.unlockedAt.toISOString()).toBe(dayAt(2));
      const four = quiz.computeQuizStats(list.slice(0, 4), 1, NOW);
      expect(ids(four.achievements)).not.toContain("five-quizzes");
    });

    it("débloque la série de trois jours à la date du troisième jour", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(3) }), attempt({ date: dayAt(2) }), attempt({ date: dayAt(1) })], 1, NOW);
      const streak = stats.achievements.find((a) => a.id === "streak-3");
      expect(streak).toBeDefined();
      expect(streak?.unlockedAt.getFullYear()).toBe(2026);
      expect(streak?.unlockedAt.getMonth()).toBe(8);
      expect(streak?.unlockedAt.getDate()).toBe(30);
    });

    it("ne débloque pas la série quand deux jours seulement se suivent", async () => {
      const quiz = await loadModule();
      const stats = quiz.computeQuizStats([attempt({ date: dayAt(3) }), attempt({ date: dayAt(2) }), attempt({ date: dayAt(0) })], 1, NOW);
      expect(ids(stats.achievements)).not.toContain("streak-3");
    });
  });
});

describe("computeQuizProgress", () => {
  it("renvoie un objet vide sans tentative", async () => {
    const quiz = await loadModule();
    expect(quiz.computeQuizProgress([])).toEqual({});
  });

  it("résume chaque catégorie : nombre de tentatives, meilleur score, réussite, dernière date", async () => {
    const quiz = await loadModule();
    const progress = quiz.computeQuizProgress([
      attempt({ categoryId: "python", score: 60, date: dayAt(3) }),
      attempt({ categoryId: "python", score: 85, date: dayAt(1) }),
      attempt({ categoryId: "sql", score: 20, date: dayAt(2) }),
    ]);
    expect(progress.python).toMatchObject({ categoryId: "python", attempts: 2, bestScore: 85, isCompleted: true });
    expect(progress.python.lastAttempt?.toISOString()).toBe(dayAt(1));
    expect(progress.sql).toMatchObject({ attempts: 1, bestScore: 20, isCompleted: false });
  });

  it("reprend les réponses de la dernière tentative chronologique", async () => {
    const quiz = await loadModule();
    const progress = quiz.computeQuizProgress([
      attempt({ score: 90, correctAnswers: 9, totalQuestions: 10, date: dayAt(1) }),
      attempt({ score: 40, correctAnswers: 4, totalQuestions: 10, date: dayAt(2) }),
    ]);
    expect(progress.python.correctAnswers).toBe(9);
    expect(progress.python.questionsAnswered).toBe(10);
  });

  it("la moyenne par catégorie est la moyenne arrondie des scores", async () => {
    // Même cas que pour computeQuizStats : 0, 25, 0 donne 8 en moyenne arrondie, pas 9.
    const quiz = await loadModule();
    const progress = quiz.computeQuizProgress([
      attempt({ score: 0, date: dayAt(3) }),
      attempt({ score: 25, date: dayAt(2) }),
      attempt({ score: 0, date: dayAt(1) }),
    ]);
    expect(progress.python.averageScore).toBe(8);
  });
});
