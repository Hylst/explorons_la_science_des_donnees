/**
 * Écrit un extrait de code une ligne de source par ligne de code : plus lisible qu'une chaîne pleine de \n,
 * et sans le piège des gabarits (un \n voulu dans une chaîne Python devenant un vrai saut de ligne).
 */
export const lines = (...code: string[]): string => code.join("\n");
