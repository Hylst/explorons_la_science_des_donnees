/**
 * Met une réponse libre (expression mathématique) sous une forme comparable :
 * membre de droite seulement, sans espaces, « ² » écrit « ^2 », multiplication implicite.
 * « 6x+2 », « f'(x) = 6x + 2 » et « 6 x + 2 » donnent la même forme.
 */
export const normalizeAnswer = (text: string): string => {
  const right = text.includes("=") ? text.slice(text.lastIndexOf("=") + 1) : text;
  return right
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/[×·*]/g, "");
};

export const sameAnswer = (answer: string, expected: string): boolean => {
  const given = normalizeAnswer(answer);
  return given !== "" && given === normalizeAnswer(expected);
};
