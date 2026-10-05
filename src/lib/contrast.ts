// Choix de la couleur de texte d'une pastille dont le fond est une couleur de marque (langages, types de corrélation...).
// Le texte blanc fixe donnait 2:1 sur l'orange ou le jaune ; on retient la couleur au contraste le plus élevé (WCAG).

const LIGHT_TEXT = "#ffffff";
const DARK_TEXT = "#0f172a";

const parseHex = (color: string): [number, number, number] | null => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].split("").map((c) => c + c).join("") : match[1];
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
};

const luminance = ([r, g, b]: [number, number, number]): number => {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** Rapport de contraste WCAG entre deux couleurs hexadécimales ; `null` si l'une n'est pas lisible */
export const contrastRatio = (first: string, second: string): number | null => {
  const a = parseHex(first);
  const b = parseHex(second);
  if (!a || !b) return null;
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

/** Blanc ou bleu nuit, selon ce qui se lit le mieux sur `background` (hexadécimal) ; blanc si la couleur est illisible */
export const readableTextColor = (background: string): string => {
  const onLight = contrastRatio(background, LIGHT_TEXT);
  const onDark = contrastRatio(background, DARK_TEXT);
  if (onLight === null || onDark === null) return LIGHT_TEXT;
  return onDark > onLight ? DARK_TEXT : LIGHT_TEXT;
};
