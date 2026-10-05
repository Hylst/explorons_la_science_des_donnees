import { useCallback, useSyncExternalStore } from 'react';
import { isStringArray, readJSON, writeJSON } from '@/lib/storage';

/**
 * Articles du blog mis en favoris par le visiteur. Les favoris restent dans son navigateur (localStorage) :
 * le site n'a pas de serveur, il ne peut donc afficher aucun compteur de « j'aime » partagé entre visiteurs.
 */
const KEY = 'blog-favorites-v1';
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const load = (): string[] => (cache ??= readJSON<string[]>(KEY, EMPTY, isStringArray));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (typeof window !== 'undefined') {
  // Modification faite depuis un autre onglet
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key === KEY) {
      cache = null;
      emit();
    }
  });
}

export const useBlogFavorites = () => {
  const favorites = useSyncExternalStore(subscribe, load);

  const isFavorite = useCallback((postId: string) => favorites.includes(postId), [favorites]);

  const toggleFavorite = useCallback((postId: string) => {
    const current = load();
    cache = current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId];
    writeJSON(KEY, cache);
    emit();
  }, []);

  return { favorites, isFavorite, toggleFavorite };
};
