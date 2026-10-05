import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export const THEMES: Theme[] = ['light', 'dark', 'system'];

/**
 * Clé de localStorage de la préférence. Identifiant technique conservé tel quel : la renommer ferait perdre leur choix
 * aux visiteurs. Le script public/theme-init.js lit la même clé avant l'affichage ; garder les deux alignés.
 */
export const THEME_STORAGE_KEY = 'ds-explorer-theme';

export interface ThemeProviderState {
  /** Choix du visiteur (« system » = suivre le réglage de son appareil) */
  theme: Theme;
  /** Thème réellement appliqué à la page */
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
});

export const useTheme = () => useContext(ThemeProviderContext);
