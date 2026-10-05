import type { QuizQuestion } from "@/types/quiz";

/** Mélange uniforme de Fisher-Yates (le tri avec Math.random() n'est pas uniforme) */
export const shuffle = <T>(items: readonly T[], random: () => number = Math.random): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Options qui renvoient aux autres (« Toutes les réponses », « Aucune de ces réponses ») : leur place compte */
const POSITIONAL_OPTION = /toutes les|tous les|aucune|les deux|ci-dessus/i;

/** Vrai si la question n'est jamais mélangée parce qu'une de ses options renvoie aux autres */
export const hasPositionalOption = (question: QuizQuestion): boolean => question.options.some((option) => POSITIONAL_OPTION.test(option));

/**
 * Mélange les options d'une question et recalcule l'indice de la bonne réponse.
 * Sans cela, la bonne réponse se trouve presque toujours à la même place (environ 70 % en position B dans la banque de questions).
 * Une question dont une option dépend de la position des autres reste telle quelle.
 */
export const shuffleOptions = (question: QuizQuestion, random: () => number = Math.random): QuizQuestion => {
  if (hasPositionalOption(question)) return question;
  const order = shuffle(
    question.options.map((_, index) => index),
    random,
  );
  return {
    ...question,
    options: order.map((index) => question.options[index]),
    correctAnswer: order.indexOf(question.correctAnswer),
  };
};
