/** Nombre de fiches du glossaire affichées d'abord, puis ajoutées à chaque lot */
export const GLOSSARY_BATCH = 24;

const STORAGE_KEY = "glossary-visible-count";

/**
 * Nombre de fiches à afficher à l'arrivée sur la page. Au retour (précédent, suivant, rechargement),
 * on reprend le nombre mémorisé pour la session, sinon la page serait trop courte pour restaurer la position de lecture.
 */
export const initialVisibleCount = (isReturn: boolean): number => {
  if (!isReturn) return GLOSSARY_BATCH;
  try {
    const saved = Number(sessionStorage.getItem(STORAGE_KEY));
    return Number.isFinite(saved) && saved > GLOSSARY_BATCH ? saved : GLOSSARY_BATCH;
  } catch {
    return GLOSSARY_BATCH;
  }
};

export const rememberVisibleCount = (count: number): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // stockage indisponible : on repartira du premier lot
  }
};
