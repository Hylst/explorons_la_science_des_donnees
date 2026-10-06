/**
 * Positions de défilement mémorisées, partagées entre `ScrollManager` (qui les écrit et les restaure)
 * et les pages affichées par morceaux (`ProgressiveSections`), qui doivent tout afficher d'emblée
 * quand une position va être restaurée : sinon la page serait trop courte pour l'atteindre.
 */
const STORAGE_KEY = "scroll-positions";
const MAX_SAVED_POSITIONS = 50;

const loadPositions = (): Record<string, number> => {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    // Seules les positions numériques valides sont conservées
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] >= 0
      )
    );
  } catch {
    return {};
  }
};

let positions: Record<string, number> | null = null;

/** Positions en mémoire (lues une fois dans la session de l'onglet) */
const store = () => (positions ??= loadPositions());

export const getSavedPosition = (key: string): number | undefined => store()[key];

export const setSavedPosition = (key: string, value: number): void => {
  store()[key] = value;
};

export const persistPositions = (): void => {
  try {
    // Seules les entrées d'historique récentes sont utiles
    const recent = Object.entries(store()).slice(-MAX_SAVED_POSITIONS);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recent)));
  } catch {
    // Stockage indisponible : les positions restent en mémoire
  }
};

/** Pour les tests : oublie les positions en mémoire (elles seront relues dans sessionStorage) */
export const resetSavedPositionsForTests = (): void => {
  positions = null;
};
