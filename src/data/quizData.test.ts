import { describe, expect, it } from "vitest";
import { hasPositionalOption } from "@/lib/quiz-shuffle";
import { quizCategories } from "./quizData";

const questions = quizCategories.flatMap((category) => category.questions.map((question) => ({ category: category.id, question })));
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9àâçéèêëîïôûùüÿœ]+/g, " ").trim();

describe("banque de questions", () => {
  it("les identifiants sont uniques", () => {
    const ids = questions.map(({ question }) => question.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  it("aucune question n'est posée deux fois (même énoncé) : elle pourrait tomber deux fois dans un même quiz", () => {
    const seen = new Map<string, string>();
    const doublons: string[] = [];
    for (const { question } of questions) {
      const key = normalize(question.question);
      if (seen.has(key)) doublons.push(`${seen.get(key)} / ${question.id}`);
      else seen.set(key, question.id);
    }
    expect(doublons).toEqual([]);
  });

  // Les options sont mélangées à chaque quiz (lib/quiz-shuffle), sauf pour une question dont une option renvoie aux autres
  // (« Les deux réponses », « Toutes les réponses ») : celle-là garde son ordre. Pour toutes les autres, tout renvoi à une position
  // ou à une lettre (« la troisième option », « réponse B ») devient faux après le mélange.
  it("aucune question mélangée ne renvoie à une position ou à une lettre dans son énoncé, ses options ou son explication", () => {
    const POSITION =
      /\b(option|réponse|choix|proposition)s?\s*(n°\s*)?[1-9]\b|\b(option|réponse|choix|proposition)s?\s+[a-d]\b|\b(première|deuxième|seconde|troisième|quatrième|dernière)s?\s+(option|réponse|proposition|choix)|\bci-(dessus|dessous)\b/i;
    const fautifs: string[] = [];
    for (const { question } of questions) {
      if (hasPositionalOption(question)) continue;
      for (const [champ, texte] of [["énoncé", question.question], ["explication", question.explanation], ...question.options.map((o, i) => [`option ${i}`, o])]) {
        const m = texte.match(POSITION);
        if (m) fautifs.push(`${question.id} (${champ}) : « ${m[0]} »`);
      }
    }
    expect(fautifs).toEqual([]);
  });

  it("chaque question a une explication, au moins 3 options et des points", () => {
    for (const { question } of questions) {
      expect(question.explanation.trim().length, `${question.id} : explication trop courte`).toBeGreaterThanOrEqual(20);
      expect(question.options.length, question.id).toBeGreaterThanOrEqual(3);
      expect(Number.isInteger(question.correctAnswer), `${question.id} : correctAnswer doit être un entier`).toBe(true);
      expect(question.points, question.id).toBeGreaterThan(0);
    }
  });

  it("chaque question a une bonne réponse valide et des options distinctes", () => {
    for (const { question } of questions) {
      expect(question.correctAnswer, question.id).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswer, question.id).toBeLessThan(question.options.length);
      expect(new Set(question.options.map((option) => option.trim().toLowerCase())).size, question.id).toBe(question.options.length);
    }
  });
});
