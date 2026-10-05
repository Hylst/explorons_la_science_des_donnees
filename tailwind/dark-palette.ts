// Mode sombre des couleurs fixes : le code des cours est écrit avec des classes claires (`bg-white`, `bg-blue-50`,
// `text-gray-700`, `from-blue-50`...) qui resteraient claires sous la classe `dark`. Ce plugin lit les classes réellement
// utilisées dans src/ et émet, pour chacune, la règle sombre équivalente (échelle de la même teinte inversée :
// 50 -> 950, 100 -> 900, texte 700 -> 300...). Aucun fichier de cours n'est modifié ; toute nouvelle classe est prise
// en compte au prochain build. Les couleurs saisies en dur (style={{ ... }}, hexadécimal dans un graphique) ne le sont pas.
import plugin from "tailwindcss/plugin";
import fs from "node:fs";
import path from "node:path";
import { dynamicTokens } from "./dynamic-colors";

type Shades = Record<string, string>;
type Rules = Record<string, Record<string, string>>;

const NEUTRALS = new Set(["slate", "gray", "zinc", "neutral", "stone"]);

// Nuance claire -> nuance utilisée en mode sombre
const MAPS = {
  bg: { color: { 50: 950, 100: 900, 200: 800, 300: 700 }, neutral: { 50: 900, 100: 800, 200: 700, 300: 600 } },
  border: { color: { 100: 900, 200: 800, 300: 700 }, neutral: { 100: 800, 200: 700, 300: 600 } },
  text: {
    color: { 500: 400, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 },
    neutral: { 500: 400, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 },
  },
} as const;

// Jeu de couleurs propre au site (ds-blue, ds-purple) : sa nuance 400 est trop sombre sur fond sombre (4:1), le texte passe à 300
const DS_TEXT: Record<number, number> = { 400: 300, 500: 300, 600: 300, 700: 200, 800: 100, 900: 50 };

type Kind = "bg" | "text" | "border" | "border-l" | "border-r" | "border-t" | "border-b" | "divide" | "from" | "via" | "to";
const MAP_KIND: Record<Kind, keyof typeof MAPS> = {
  bg: "bg", from: "bg", via: "bg", to: "bg", text: "text",
  border: "border", "border-l": "border", "border-r": "border", "border-t": "border", "border-b": "border", divide: "border",
};
const BORDER_PROPERTY: Partial<Record<Kind, string>> = {
  border: "border-color", divide: "border-color",
  "border-l": "border-left-color", "border-r": "border-right-color", "border-t": "border-top-color", "border-b": "border-bottom-color",
};

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const escapeClass = (name: string) => name.replace(/[:/.[\]#%]/g, (c) => "\\" + c);

const TOKEN =
  /(?<![\w:-])((?:hover:|focus:|group-hover:)?)(bg|text|border-l|border-r|border-t|border-b|border|divide|from|via|to)-([a-z]+(?:-[a-z]+)*)-(\d{2,3})(?:\/(\d{1,3}))?(?![\w-])/g;
const WHITE = /(?<![\w:-])((?:hover:|focus:|group-hover:)?)(bg|from|via|to)-white(?:\/(\d{1,3}))?(?![\w-])/g;
const BLACK_TEXT = /(?<![\w:-])((?:hover:|focus:|group-hover:)?)text-black(?![\w-])/g;

export default plugin(({ addBase, theme }) => {
  const palettes = (theme("colors") ?? {}) as Record<string, unknown>;
  const used = new Set<string>(dynamicTokens());
  const whiteTokens = new Set<string>();
  const blackTokens = new Set<string>();

  for (const file of walk(path.resolve(__dirname, "../src"))) {
    const source = fs.readFileSync(file, "utf8");
    for (const m of source.matchAll(TOKEN)) used.add(m[0]);
    for (const m of source.matchAll(WHITE)) whiteTokens.add(m[0]);
    for (const m of source.matchAll(BLACK_TEXT)) blackTokens.add(m[0]);
  }

  const rules: Rules = {};
  const gradientOrder: Record<string, number> = { from: 0, via: 1, to: 2 };
  const selectorOf = (variant: string, token: string, extra = "") => {
    const cls = `.${escapeClass(token)}`;
    if (variant === "hover:") return `.dark ${cls}:hover${extra}`;
    if (variant === "focus:") return `.dark ${cls}:focus${extra}`;
    if (variant === "group-hover:") return `.dark .group:hover ${cls}${extra}`;
    return `.dark ${cls}${extra}`;
  };

  const colorValue = (rgb: [number, number, number], alpha: number | null) =>
    alpha === null ? `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})` : `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / ${alpha})`;

  const declarations = (kind: Kind, value: string, transparent: string): Record<string, string> => {
    if (kind === "bg") return { "background-color": value };
    if (kind === "text") return { color: value };
    if (kind === "from")
      return { "--tw-gradient-from": `${value} var(--tw-gradient-from-position)`, "--tw-gradient-to": `${transparent} var(--tw-gradient-to-position)`, "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)" };
    if (kind === "via")
      return { "--tw-gradient-to": `${transparent} var(--tw-gradient-to-position)`, "--tw-gradient-stops": `var(--tw-gradient-from), ${value} var(--tw-gradient-via-position), var(--tw-gradient-to)` };
    if (kind === "to") return { "--tw-gradient-to": `${value} var(--tw-gradient-to-position)` };
    return { [BORDER_PROPERTY[kind] ?? "border-color"]: value };
  };

  const ordered: { order: number; selector: string; decl: Record<string, string> }[] = [];
  const emit = (order: number, selector: string, decl: Record<string, string>) => ordered.push({ order, selector, decl });

  for (const token of used) {
    const match = new RegExp(TOKEN.source).exec(token);
    if (!match) continue;
    const [, variant, kindRaw, hue, shadeRaw, opacityRaw] = match;
    const kind = kindRaw as Kind;
    const palette = palettes[hue] as Shades | undefined;
    if (!palette || typeof palette !== "object") continue;
    const shade = Number(shadeRaw);
    const mapSet = MAPS[MAP_KIND[kind]];
    const table = (hue.startsWith("ds-") && kind === "text" ? DS_TEXT : NEUTRALS.has(hue) ? mapSet.neutral : mapSet.color) as Record<number, number>;
    const target = table[shade];
    if (target === undefined) continue;
    // Nuance absente d'une palette personnalisée : on prend la plus proche, du côté sombre
    const available = Object.keys(palette).map(Number).filter((n) => !Number.isNaN(n));
    const chosen = available.includes(target) ? target : available.reduce((best, n) => (Math.abs(n - target) < Math.abs(best - target) ? n : best), available[0]);
    const rgb = hexToRgb(String(palette[String(chosen)] ?? ""));
    if (!rgb) continue;
    const alpha = opacityRaw ? Number(opacityRaw) / 100 : null;
    // selectorOf reçoit le nom de classe complet, préfixe de variante compris
    const selector = selectorOf(variant, token, kind === "divide" ? " > :not([hidden]) ~ :not([hidden])" : "");
    emit(gradientOrder[kind] ?? -1, selector, declarations(kind, colorValue(rgb, alpha), colorValue(rgb, 0)));
  }

  const card = (alpha: number | null) => (alpha === null ? "hsl(var(--card))" : `hsl(var(--card) / ${alpha})`);
  for (const token of whiteTokens) {
    const m = /^((?:hover:|focus:|group-hover:)?)(bg|from|via|to)-white(?:\/(\d{1,3}))?$/.exec(token);
    if (!m) continue;
    const [, variant, kind, opacityRaw] = m;
    const alpha = opacityRaw ? Number(opacityRaw) / 100 : null;
    emit(gradientOrder[kind] ?? -1, selectorOf(variant, token), declarations(kind as Kind, card(alpha), "hsl(var(--card) / 0)"));
  }
  for (const token of blackTokens) {
    const m = /^((?:hover:|focus:|group-hover:)?)text-black$/.exec(token);
    if (m) emit(-1, selectorOf(m[1], token), { color: "hsl(var(--foreground))" });
  }

  // Dégradés : from, puis via, puis to (même spécificité, c'est l'ordre dans le fichier qui départage)
  ordered.sort((a, b) => a.order - b.order);
  for (const { selector, decl } of ordered) rules[selector] = { ...(rules[selector] ?? {}), ...decl };

  // Graphiques Recharts : texte, grille et infobulle (styles en ligne, d'où !important)
  rules[".dark .recharts-text, .dark .recharts-cartesian-axis-tick-value"] = { fill: "hsl(var(--muted-foreground))" };
  rules[".dark .recharts-cartesian-grid line, .dark .recharts-polar-grid-concentric-polygon"] = { stroke: "hsl(var(--border))" };
  rules[".dark .recharts-tooltip-wrapper .recharts-default-tooltip"] = {
    "background-color": "hsl(var(--popover)) !important",
    "border-color": "hsl(var(--border)) !important",
    color: "hsl(var(--popover-foreground))",
  };
  rules[".dark .recharts-default-tooltip .recharts-tooltip-label, .dark .recharts-default-tooltip .recharts-tooltip-item"] = {
    color: "hsl(var(--popover-foreground)) !important",
  };

  addBase(rules);
});
