import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const CARDS_DIR = "public/svg/cards";
const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8");
const cards = fs.readdirSync(path.resolve(root, CARDS_DIR)).filter((name) => name.endsWith(".svg"));

describe("illustrations animées de l'accueil (public/svg/cards)", () => {
  it("le dossier contient bien les six illustrations (garde-fou contre un balayage vide)", () => {
    expect(cards.sort()).toEqual([
      "maths-descente.svg",
      "ml-frontiere.svg",
      "pipeline-donnees.svg",
      "python-code.svg",
      "reseau-neurones.svg",
      "tableau-de-bord.svg",
    ]);
  });

  it.each(cards)("%s est un SVG bien formé, avec titre et description", (name) => {
    const doc = new DOMParser().parseFromString(read(`${CARDS_DIR}/${name}`), "image/svg+xml");
    expect(doc.querySelector("parsererror"), "XML mal formé").toBeNull();
    expect(doc.documentElement.tagName).toBe("svg");
    expect(doc.documentElement.getAttribute("viewBox")).toBe("0 0 800 450");
    expect(doc.querySelector("title")?.textContent?.length ?? 0).toBeGreaterThan(10);
    expect(doc.querySelector("desc")?.textContent?.length ?? 0).toBeGreaterThan(20);
  });

  it.each(cards)("%s n'exécute aucun script et n'appelle aucun tiers", (name) => {
    const svg = read(`${CARDS_DIR}/${name}`);
    expect(svg).not.toMatch(/<script|<foreignObject|javascript:|\son[a-z]+\s*=/i);
    expect(svg).not.toMatch(/https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
    expect(svg).not.toMatch(/@import|<image|xlink:href|\bhref=/i);
  });

  it.each(cards)("%s coupe ses animations quand le visiteur demande moins de mouvement", (name) => {
    const svg = read(`${CARDS_DIR}/${name}`);
    expect(svg).toMatch(/@media \(prefers-reduced-motion:reduce\)\{\*\{animation:none!important\}\}/);
    // l'état de repos (sans animation) doit rester lisible : aucun élément n'est masqué par défaut dans le style de base
    expect(svg).not.toMatch(/\.[a-z0-9]+\{[^}]*opacity:0[;}]/);
  });

  it.each(cards)("%s reste léger (moins de 12 Ko)", (name) => {
    expect(fs.statSync(path.resolve(root, CARDS_DIR, name)).size).toBeLessThan(12 * 1024);
  });

  it("chaque illustration est utilisée par l'accueil, et chaque référence pointe vers un fichier existant", () => {
    const used = new Set<string>();
    for (const file of ["src/components/home/FeaturedCourses.tsx", "src/components/home/LatestArticles.tsx"]) {
      for (const m of read(file).matchAll(/svg\/cards\/([a-z-]+\.svg)/g)) used.add(m[1]);
    }
    expect([...used].sort()).toEqual([...cards].sort());
  });

  it("les images décoratives de l'accueil ont un texte alternatif vide et des dimensions (pas de décalage de mise en page)", () => {
    for (const file of ["src/components/home/FeaturedCourses.tsx", "src/components/home/LatestArticles.tsx"]) {
      const tsx = read(file);
      const img = tsx.slice(tsx.indexOf("<img"), tsx.indexOf("/>", tsx.indexOf("<img")));
      expect(img, file).toMatch(/alt=""/);
      expect(img, file).toMatch(/width=\{800\}/);
      expect(img, file).toMatch(/height=\{450\}/);
    }
  });

  it("plus aucune photographie ni image distante n'est livrée (la licence du site ne doit rien exclure d'autre que les logos)", () => {
    expect(fs.existsSync(path.resolve(root, "public/img/photos"))).toBe(false);
    for (const file of ["src/components/home/FeaturedCourses.tsx", "src/components/home/LatestArticles.tsx"]) {
      expect(read(file)).not.toMatch(/img\/photos|unsplash|https?:\/\//i);
    }
  });
});
