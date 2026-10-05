// Couleurs des classes construites à l'exécution (`bg-${couleur}-50`, `text-${couleur}-700`...).
// Tailwind ne les voit pas dans le code : elles sont déclarées ici pour être (1) conservées dans le CSS (safelist) et
// (2) adaptées au mode sombre (plugin dark-palette). Pour un nouveau gabarit dynamique, ajouter sa couleur ou sa nuance.
// Gabarits actuels : AutomationSection, EnhancedDataQualitySection, LearningPathSection, PythonBasics, GradientsSection.
export const DYNAMIC_HUES = ["blue", "green", "red", "gray", "purple", "yellow", "indigo", "orange"] as const;

export const DYNAMIC_SHADES = {
  bg: [50, 100, 500, 600],
  border: [200, 500],
  borderLeft: [200, 500],
  text: [600, 700, 800],
} as const;

const alt = DYNAMIC_HUES.join("|");

/** Motifs de safelist équivalents (voir tailwind.config.ts) */
export const DYNAMIC_SAFELIST = [
  { pattern: new RegExp(`^bg-(${alt})-(${DYNAMIC_SHADES.bg.join("|")})$`) },
  { pattern: new RegExp(`^border-(l-)?(${alt})-(${DYNAMIC_SHADES.border.join("|")})$`) },
  { pattern: new RegExp(`^text-(${alt})-(${DYNAMIC_SHADES.text.join("|")})$`) },
];

/** Jetons de classe correspondants, pour générer leurs règles sombres */
export const dynamicTokens = (): string[] => {
  const tokens: string[] = [];
  for (const hue of DYNAMIC_HUES) {
    DYNAMIC_SHADES.bg.forEach((s) => tokens.push(`bg-${hue}-${s}`));
    DYNAMIC_SHADES.border.forEach((s) => tokens.push(`border-${hue}-${s}`));
    DYNAMIC_SHADES.borderLeft.forEach((s) => tokens.push(`border-l-${hue}-${s}`));
    DYNAMIC_SHADES.text.forEach((s) => tokens.push(`text-${hue}-${s}`));
  }
  return tokens;
};
