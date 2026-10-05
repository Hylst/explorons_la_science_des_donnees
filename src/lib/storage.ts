/**
 * Accès sûr au localStorage : ne lève jamais d'exception
 * (stockage bloqué, navigation privée, quota dépassé, JSON corrompu).
 */

export const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Stockage indisponible : la valeur reste en mémoire uniquement
  }
};

export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Stockage indisponible : rien à supprimer
  }
};

/** Clés du localStorage qui commencent par `prefix` (liste vide si le stockage est indisponible) */
export const storageKeys = (prefix: string): string[] => {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith(prefix)) keys.push(key);
    }
    return keys;
  } catch {
    return [];
  }
};

/**
 * Lit une valeur JSON. Renvoie `fallback` si la clé est absente,
 * si le JSON est invalide ou si `isValid` rejette la valeur.
 */
export const readJSON = <T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T = (_value: unknown): _value is T => true
): T => {
  const raw = readStorage(key);
  if (raw === null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key: string, value: unknown): void => {
  writeStorage(key, JSON.stringify(value));
};

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item));

export const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === "object" && value !== null && !Array.isArray(value) &&
  Object.values(value).every((item) => typeof item === "string");
