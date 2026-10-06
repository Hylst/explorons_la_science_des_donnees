/**
 * Sections affichées avant le premier rendu (l'introduction) ; les suivantes arrivent une à une quand le navigateur est libre.
 * Une seule : avec deux, la deuxième (formules, graphiques) se chargeait assez vite pour être dessinée dans la même
 * tâche que l'introduction et en retardait l'affichage (mesuré le 6 octobre 2026 : tâche de 1,2 s, processeur ralenti 4 fois).
 */
export const INITIAL_SECTIONS = 1;

/**
 * Nombre de sections à afficher d'emblée. Tout est affiché quand l'adresse vise une ancre
 * (la section visée peut être loin) ou quand une position de lecture va être restaurée
 * (précédent, suivant, rechargement) : la page doit alors être complète pour l'atteindre.
 */
export const initialSectionCount = (
  total: number,
  { isPop, hasSavedPosition, hasHash }: { isPop: boolean; hasSavedPosition: boolean; hasHash: boolean }
): number => (hasHash || (isPop && hasSavedPosition) ? total : Math.min(total, INITIAL_SECTIONS));
