/** Sections affichées avant le premier rendu ; les suivantes arrivent une à une quand le navigateur est libre */
export const INITIAL_SECTIONS = 2;

/**
 * Nombre de sections à afficher d'emblée. Tout est affiché quand l'adresse vise une ancre
 * (la section visée peut être loin) ou quand une position de lecture va être restaurée
 * (précédent, suivant, rechargement) : la page doit alors être complète pour l'atteindre.
 */
export const initialSectionCount = (
  total: number,
  { isPop, hasSavedPosition, hasHash }: { isPop: boolean; hasSavedPosition: boolean; hasHash: boolean }
): number => (hasHash || (isPop && hasSavedPosition) ? total : Math.min(total, INITIAL_SECTIONS));
