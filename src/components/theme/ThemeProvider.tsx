import { ReactNode, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';
import { THEMES, THEME_STORAGE_KEY, Theme, ThemeProviderContext } from '@/hooks/use-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const systemTheme = (): 'dark' | 'light' =>
  typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

interface ThemeProviderProps {
  children: ReactNode;
  /** Thème sans choix enregistré. Doit rester égal à DEFAULT_THEME de public/theme-init.js. */
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = THEME_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = readStorage(storageKey);
    return stored && THEMES.includes(stored as Theme) ? (stored as Theme) : defaultTheme;
  });
  const [system, setSystem] = useState<'dark' | 'light'>(systemTheme);
  const resolvedTheme = theme === 'system' ? system : theme;

  // Suit le réglage de l'appareil en direct (utile pour le mode « system »)
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystem(media.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    window.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#0b1220' : '#3b82f6');
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next: Theme) => {
        writeStorage(storageKey, next);
        setThemeState(next);
      },
    }),
    [theme, resolvedTheme, storageKey]
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export default ThemeProvider;
