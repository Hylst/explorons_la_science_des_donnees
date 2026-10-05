import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, THEMES } from "@/hooks/use-theme";

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8").replace(/\r\n/g, "\n");

/** Première valeur capturée par `pattern`, ou échec explicite si le motif n'est plus présent dans le fichier */
const extract = (file: string, source: string, pattern: RegExp, what: string): string => {
  const value = source.match(pattern)?.[1];
  if (value === undefined) {
    throw new Error(`${what} introuvable dans ${file} : le format du code a changé, adapter l'expression régulière de ce test`);
  }
  return value;
};

const themeInit = read("public/theme-init.js");
const app = read("src/App.tsx");
const useThemeSource = read("src/hooks/use-theme.ts");
const providerSource = read("src/components/theme/ThemeProvider.tsx");

// Guillemets simples ou doubles, espaces libres
const QUOTED = `["']([^"']+)["']`;

const initDefaultTheme = () => extract("public/theme-init.js", themeInit, new RegExp(`\\bDEFAULT_THEME\\s*=\\s*${QUOTED}`), "DEFAULT_THEME");
const initStorageKey = () =>
  extract("public/theme-init.js", themeInit, new RegExp(`localStorage\\.getItem\\(\\s*${QUOTED}\\s*\\)`), "la clé lue par localStorage.getItem");
const appDefaultTheme = () =>
  extract(
    "src/App.tsx",
    app,
    new RegExp(`<ThemeProvider\\b[^>]*?\\bdefaultTheme\\s*=\\s*(?:\\{\\s*)?${QUOTED}`),
    "defaultTheme de <ThemeProvider>"
  );

describe("extraction des valeurs (garde-fou)", () => {
  it("retrouve DEFAULT_THEME dans public/theme-init.js", () => {
    expect(initDefaultTheme()).not.toBe("");
  });

  it("retrouve la clé de stockage dans public/theme-init.js", () => {
    expect(initStorageKey()).not.toBe("");
  });

  it("retrouve defaultTheme du ThemeProvider dans src/App.tsx", () => {
    expect(appDefaultTheme()).not.toBe("");
  });

  it("retrouve THEME_STORAGE_KEY dans src/hooks/use-theme.ts", () => {
    expect(extract("src/hooks/use-theme.ts", useThemeSource, new RegExp(`THEME_STORAGE_KEY\\s*=\\s*${QUOTED}`), "THEME_STORAGE_KEY")).not.toBe("");
  });

  it("l'extraction échoue explicitement quand le motif est absent", () => {
    expect(() => extract("fichier.js", "var autre = 1;", /DEFAULT_THEME\s*=\s*'([^']+)'/, "DEFAULT_THEME")).toThrow(/introuvable dans fichier\.js/);
  });
});

describe("thème par défaut", () => {
  it("DEFAULT_THEME de public/theme-init.js est égal au defaultTheme passé au ThemeProvider dans App.tsx", () => {
    expect(initDefaultTheme()).toBe(appDefaultTheme());
  });

  it("le thème par défaut est l'un des thèmes proposés", () => {
    expect(THEMES).toContain(initDefaultTheme());
    expect(THEMES).toContain(appDefaultTheme());
  });

  it("le fichier theme-init.js n'a qu'une seule définition de DEFAULT_THEME", () => {
    expect(themeInit.match(/\bDEFAULT_THEME\s*=/g)).toHaveLength(1);
  });

  it("App.tsx ne monte qu'un seul ThemeProvider", () => {
    expect(app.match(/<ThemeProvider\b/g)).toHaveLength(1);
  });
});

describe("clé de stockage du thème", () => {
  it("la clé de public/theme-init.js est THEME_STORAGE_KEY de src/hooks/use-theme.ts", () => {
    expect(initStorageKey()).toBe(THEME_STORAGE_KEY);
  });

  it("la valeur lue dans le fichier source de use-theme.ts est celle exportée à l'exécution", () => {
    const fromSource = extract("src/hooks/use-theme.ts", useThemeSource, new RegExp(`THEME_STORAGE_KEY\\s*=\\s*${QUOTED}`), "THEME_STORAGE_KEY");
    expect(fromSource).toBe(THEME_STORAGE_KEY);
  });

  it("App.tsx ne passe pas de storageKey différente au ThemeProvider", () => {
    expect(app).not.toMatch(/<ThemeProvider\b[^>]*\bstorageKey\s*=/);
  });

  it("ThemeProvider prend THEME_STORAGE_KEY comme clé par défaut", () => {
    expect(providerSource).toMatch(/storageKey\s*=\s*THEME_STORAGE_KEY/);
  });
});

describe("valeurs de thème acceptées", () => {
  it("theme-init.js accepte exactement les thèmes de THEMES", () => {
    const accepted = [...themeInit.matchAll(/stored\s*===\s*["']([^"']+)["']/g)].map((m) => m[1]);
    expect(accepted.length).toBeGreaterThan(0);
    expect([...new Set(accepted)].sort()).toEqual([...THEMES].sort());
  });

  it("theme-init.js pose la classe « dark » ou « light » sur <html>, comme ThemeProvider", () => {
    const added = extract("public/theme-init.js", themeInit, /classList\.add\(([^)]*)\)/, "classList.add");
    expect(added).toMatch(/['"]dark['"]/);
    expect(added).toMatch(/['"]light['"]/);
    expect(providerSource).toMatch(/classList\.remove\(\s*['"]light['"]\s*,\s*['"]dark['"]\s*\)/);
    expect(providerSource).toMatch(/classList\.add\(\s*resolvedTheme\s*\)/);
  });

  it("theme-init.js suit la préférence système avec la même requête média que ThemeProvider", () => {
    const query = extract("public/theme-init.js", themeInit, /matchMedia\(\s*["']([^"']+)["']\s*\)/, "la requête matchMedia");
    const providerQuery = extract("src/components/theme/ThemeProvider.tsx", providerSource, /DARK_QUERY\s*=\s*["']([^"']+)["']/, "DARK_QUERY");
    expect(query).toBe(providerQuery);
  });

  it("index.html charge theme-init.js avant le script de l'application", () => {
    const html = read("index.html");
    const init = html.indexOf("theme-init.js");
    const main = html.indexOf("/src/main.tsx");
    expect(init).toBeGreaterThan(-1);
    expect(main).toBeGreaterThan(-1);
    expect(init).toBeLessThan(main);
  });
});
