import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// Fichier exécuté par Node au build : import relatif, sans alias
import { collectDynamicMeta, collectRoutes } from "../../scripts/collect-routes";
import { fullTitle, HOME_TITLE, PAGE_META, pageMetaFor } from "./page-meta";
import { LEGACY_REDIRECTS } from "./routes";
import { SITE_DESCRIPTION, SITE_NAME } from "./site";

const root = process.cwd();
const routes = collectRoutes(root);
const dynamicMeta = collectDynamicMeta(root);

/** Titre complet et description d'une route canonique, statique ou dynamique (même règle que vite.config.ts) */
const metaOf = (route: string): { title: string; description: string } | undefined => {
  const staticMeta = pageMetaFor(route);
  if (staticMeta) return staticMeta;
  const dynamic = dynamicMeta[route];
  return dynamic ? { title: fullTitle(dynamic.title), description: dynamic.description } : undefined;
};

/** Regroupe par valeur et renvoie celles qui reviennent plusieurs fois, avec les routes concernées */
const duplicates = (entries: [string, string][]) => {
  const byValue = new Map<string, string[]>();
  for (const [route, value] of entries) byValue.set(value, [...(byValue.get(value) ?? []), route]);
  return [...byValue.entries()].filter(([, owners]) => owners.length > 1);
};

describe("collecte des routes (garde-fou)", () => {
  it("trouve les routes du site : accueil, sections, cours, articles du blog, quiz", () => {
    expect(routes.canonical.length).toBeGreaterThan(40);
    expect(routes.canonical).toContain("/");
    expect(routes.canonical).toContain("/glossary");
    expect(routes.canonical).toContain("/fundamentals/math-stats");
    expect(routes.canonical.some((r) => r.startsWith("/courses/"))).toBe(true);
    expect(routes.canonical.some((r) => r.startsWith("/blog/"))).toBe(true);
    expect(routes.canonical.some((r) => r.startsWith("/quiz/"))).toBe(true);
  });

  it("n'inclut aucun doublon ni slash final, et reste trié", () => {
    expect(new Set(routes.all).size).toBe(routes.all.length);
    expect(routes.all.filter((r) => r.length > 1 && r.endsWith("/"))).toEqual([]);
    expect(routes.all.every((r) => r.startsWith("/"))).toBe(true);
    expect([...routes.all]).toEqual([...routes.all].sort());
  });

  it("collecte autant de métadonnées dynamiques que de routes d'articles et de quiz", () => {
    const dynamicRoutes = routes.canonical.filter((r) => r.startsWith("/blog/") || r.startsWith("/quiz/"));
    expect(Object.keys(dynamicMeta).sort()).toEqual(dynamicRoutes.sort());
  });
});

describe("couverture des routes par un titre et une description", () => {
  it("chaque route canonique a un titre et une description non vides", () => {
    const missing = routes.canonical.filter((route) => {
      const meta = metaOf(route);
      return !meta || meta.title.trim() === "" || meta.description.trim() === "";
    });
    expect(missing).toEqual([]);
  });

  it("PAGE_META ne contient aucune route disparue ou redirigée", () => {
    const canonical = new Set(routes.canonical);
    const orphans = Object.keys(PAGE_META).filter((route) => !canonical.has(route));
    expect(orphans).toEqual([]);
  });

  it("l'accueil utilise le titre et la description du site", () => {
    expect(pageMetaFor("/")).toEqual({ title: HOME_TITLE, description: SITE_DESCRIPTION });
    expect(HOME_TITLE).toContain(SITE_NAME);
  });

  it("pageMetaFor ignore un slash final et renvoie undefined pour une route inconnue", () => {
    expect(pageMetaFor("/glossary/")).toEqual(pageMetaFor("/glossary"));
    expect(pageMetaFor("/route-inexistante")).toBeUndefined();
    expect(pageMetaFor("/blog/un-article")).toBeUndefined();
  });

  it("fullTitle ajoute le nom du site après le titre", () => {
    expect(fullTitle("Glossaire")).toBe(`Glossaire - ${SITE_NAME}`);
  });
});

describe("longueurs des titres et descriptions de PAGE_META", () => {
  const entries = Object.entries(PAGE_META);

  it("contient des entrées (garde-fou contre un test vide)", () => {
    expect(entries.length).toBeGreaterThan(40);
  });

  it("chaque titre, sans le nom du site, fait de 20 à 38 caractères", () => {
    const outOfRange = entries
      .map(([route, meta]) => ({ route, length: meta.title.normalize("NFC").length }))
      .filter(({ length }) => length < 20 || length > 38);
    expect(outOfRange).toEqual([]);
  });

  it("chaque description fait de 110 à 160 caractères", () => {
    const outOfRange = entries
      .map(([route, meta]) => ({ route, length: meta.description.normalize("NFC").length }))
      .filter(({ length }) => length < 110 || length > 160);
    expect(outOfRange).toEqual([]);
  });

  it("aucun titre de PAGE_META ne contient déjà le nom du site (il est ajouté par fullTitle)", () => {
    expect(entries.filter(([, meta]) => meta.title.includes(SITE_NAME)).map(([route]) => route)).toEqual([]);
  });
});

describe("unicité des titres et descriptions", () => {
  const entries = routes.canonical.flatMap((route) => {
    const meta = metaOf(route);
    return meta ? [{ route, ...meta }] : [];
  });

  it("couvre toutes les routes canoniques", () => {
    expect(entries).toHaveLength(routes.canonical.length);
  });

  it("deux routes n'ont jamais le même titre complet", () => {
    expect(duplicates(entries.map((e) => [e.route, e.title]))).toEqual([]);
  });

  it("deux routes n'ont jamais la même description", () => {
    expect(duplicates(entries.map((e) => [e.route, e.description]))).toEqual([]);
  });

  it("le titre complet des pages autres que l'accueil se termine par le nom du site", () => {
    const wrong = entries.filter((e) => e.route !== "/" && !e.title.endsWith(` - ${SITE_NAME}`)).map((e) => e.route);
    expect(wrong).toEqual([]);
  });
});

describe("typographie des titres et descriptions", () => {
  it("aucun tiret cadratin ni demi-cadratin dans les titres et descriptions", () => {
    const offenders = routes.canonical.flatMap((route) => {
      const meta = metaOf(route);
      if (!meta) return [];
      return [meta.title, meta.description].some((text) => /[—–]/.test(text)) ? [route] : [];
    });
    expect(offenders).toEqual([]);
  });

  it("aucun titre ni description n'a d'espace en début ou en fin, ni d'espaces doublés", () => {
    const offenders = routes.canonical.filter((route) => {
      const meta = metaOf(route);
      return meta !== undefined && [meta.title, meta.description].some((text) => text !== text.trim() || /\s{2,}/.test(text));
    });
    expect(offenders).toEqual([]);
  });
});

describe("anciennes URL (LEGACY_REDIRECTS)", () => {
  const canonical = new Set(routes.canonical);
  const stripHash = (url: string) => url.replace(/#.*$/, "");

  it("l'analyse de routes.ts lit toutes les entrées (aucune ancienne URL oubliée du sitemap)", () => {
    expect(routes.legacy).toHaveLength(LEGACY_REDIRECTS.length);
    expect(routes.legacy.map((e) => e.from).sort()).toEqual(LEGACY_REDIRECTS.map((e) => stripHash(e.from)).sort());
  });

  it("aucune ancienne URL n'est déclarée deux fois", () => {
    expect(duplicates(LEGACY_REDIRECTS.map((e) => [e.to, e.from]))).toEqual([]);
  });

  it("chaque ancienne URL pointe vers une route canonique existante", () => {
    const broken = LEGACY_REDIRECTS.filter((e) => !canonical.has(stripHash(e.to))).map((e) => `${e.from} -> ${e.to}`);
    expect(broken).toEqual([]);
  });

  it("aucune redirection ne mène vers une autre ancienne URL (pas de chaîne) ni vers elle-même", () => {
    const froms = new Set(LEGACY_REDIRECTS.map((e) => stripHash(e.from)));
    const chained = LEGACY_REDIRECTS.filter((e) => froms.has(stripHash(e.to))).map((e) => `${e.from} -> ${e.to}`);
    expect(chained).toEqual([]);
    expect(LEGACY_REDIRECTS.filter((e) => stripHash(e.from) === stripHash(e.to))).toEqual([]);
  });

  it("aucune ancienne URL n'est aussi une page réelle (elle masquerait la page)", () => {
    const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8");
    const realRoutes = new Set<string>();
    for (const m of read("src/App.tsx").matchAll(/path="(\/[^"*:]*)"/g)) realRoutes.add(m[1]);
    for (const m of read("src/components/routing/CourseRouter.tsx").matchAll(/path="([a-z][^"*:]*)"/g)) realRoutes.add(`/courses/${m[1]}`);
    expect(realRoutes.size).toBeGreaterThan(20);
    const shadowed = LEGACY_REDIRECTS.map((e) => stripHash(e.from)).filter((from) => realRoutes.has(from));
    expect(shadowed).toEqual([]);
  });

  it("les anciennes URL sont absolues, sans slash final ni paramètre de recherche", () => {
    for (const { from, to } of LEGACY_REDIRECTS) {
      expect(from.startsWith("/"), from).toBe(true);
      expect(from.length > 1 && from.endsWith("/"), from).toBe(false);
      expect(from, from).not.toMatch(/[?#]/);
      expect(to.startsWith("/"), to).toBe(true);
      expect(to, to).not.toContain("?");
    }
  });

  it("les anciennes URL sont exclues des routes canoniques mais présentes dans la liste complète", () => {
    for (const { from } of routes.legacy) {
      expect(routes.canonical).not.toContain(from);
      expect(routes.all).toContain(from);
    }
  });
});
