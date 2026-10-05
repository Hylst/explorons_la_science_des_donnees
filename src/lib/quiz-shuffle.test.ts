import { describe, expect, it } from "vitest";
import { shuffle, shuffleOptions } from "./quiz-shuffle";
import { quizCategories } from "@/data/quizData";
import type { QuizQuestion } from "@/types/quiz";

const question = (options: string[], correctAnswer: number): QuizQuestion => ({
  id: "q",
  question: "?",
  options,
  correctAnswer,
  explanation: "",
  difficulty: "Débutant",
  topic: "t",
  points: 10,
});

/** Générateur déterministe pour des tests reproductibles */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe("shuffle", () => {
  it("garde les mêmes éléments et ne modifie pas l'original", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original, seeded(1));
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("répartit les éléments de façon à peu près uniforme", () => {
    const random = seeded(7);
    const firstCounts = [0, 0, 0, 0];
    for (let i = 0; i < 4000; i++) firstCounts[shuffle([0, 1, 2, 3], random)[0]]++;
    for (const count of firstCounts) expect(Math.abs(count - 1000)).toBeLessThan(150);
  });
});

describe("shuffleOptions", () => {
  it("la bonne réponse reste la même option après mélange, pour toutes les graines", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const shuffled = shuffleOptions(question(["a", "b", "c", "d"], 1), seeded(seed));
      expect(shuffled.options[shuffled.correctAnswer]).toBe("b");
      expect([...shuffled.options].sort()).toEqual(["a", "b", "c", "d"]);
    }
  });

  it("ne déplace pas les options qui dépendent de la position (« Toutes les réponses »)", () => {
    const fixed = question(["x", "y", "z", "Toutes les réponses"], 3);
    expect(shuffleOptions(fixed, seeded(3))).toBe(fixed);
  });

  it("garde la bonne réponse sur toute la banque de questions", () => {
    for (const category of quizCategories) {
      for (const original of category.questions) {
        const shuffled = shuffleOptions(original, seeded(11));
        expect(shuffled.options[shuffled.correctAnswer], original.id).toBe(original.options[original.correctAnswer]);
      }
    }
  });

  it("répartit la bonne réponse sur les quatre positions", () => {
    const random = seeded(5);
    const positions = [0, 0, 0, 0];
    for (let i = 0; i < 2000; i++) positions[shuffleOptions(question(["a", "b", "c", "d"], 1), random).correctAnswer]++;
    for (const count of positions) expect(Math.abs(count - 500)).toBeLessThan(100);
  });
});
