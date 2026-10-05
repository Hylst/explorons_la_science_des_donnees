// Applique le thème enregistré avant le premier affichage : sans cela, un visiteur en mode sombre verrait un éclair clair
// le temps que l'application démarre. Script externe (la CSP du site interdit les scripts en ligne).
// DEFAULT_THEME doit rester égal à defaultTheme de <ThemeProvider> dans src/App.tsx, et la clé à THEME_STORAGE_KEY
// de src/hooks/use-theme.ts (un test automatique le vérifie).
(function () {
  var DEFAULT_THEME = 'light';
  var theme = DEFAULT_THEME;
  try {
    var stored = localStorage.getItem('ds-explorer-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') theme = stored;
  } catch (e) {
    // Stockage indisponible : thème par défaut
  }
  var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var root = document.documentElement;
  root.classList.add(dark ? 'dark' : 'light');
  root.style.colorScheme = dark ? 'dark' : 'light';
})();
