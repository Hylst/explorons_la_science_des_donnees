import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import blogPosts from "@/data/blog-posts.json";
import { COURSE_CATALOG } from "@/data/course-catalog";

const root = process.cwd();
const CARDS_DIR = "public/svg/cards";
const BLOG_DIR = "public/img/blog";
const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8");
const cards = fs.readdirSync(path.resolve(root, CARDS_DIR)).filter((name) => name.endsWith(".svg"));

describe("illustrations animées des cours (public/svg/cards)", () => {
  it("le dossier contient bien les trois illustrations (garde-fou contre un balayage vide)", () => {
    expect(cards.sort()).toEqual(["maths-descente.svg", "ml-frontiere.svg", "python-code.svg"]);
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
    for (const m of read("src/lib/course-image.ts").matchAll(/svg\/cards\/([a-z-]+\.svg)/g)) used.add(m[1]);
    expect([...used].sort()).toEqual([...cards].sort());
  });
});

describe("illustrations des cours du catalogue", () => {
  it("chaque cours du catalogue a son image (SVG animé ou WebP), vraie et légère, et elles sont affichées avec dimensions", () => {
    const animated = read("src/lib/course-image.ts");
    for (const course of COURSE_CATALOG) {
      if (animated.includes(`"${course.id}":`)) continue;
      const file = path.resolve(root, `public/img/courses/${course.id}.webp`);
      expect(fs.existsSync(file), `image manquante pour ${course.id}`).toBe(true);
      const bytes = fs.readFileSync(file);
      expect(bytes.subarray(8, 12).toString("latin1"), course.id).toBe("WEBP");
      expect(bytes.length, `${course.id} : image vide ?`).toBeGreaterThan(4 * 1024);
      expect(bytes.length, `${course.id} : image trop lourde`).toBeLessThan(120 * 1024);
    }
    const files = fs.readdirSync(path.resolve(root, "public/img/courses")).map((f) => f.replace(/\.webp$/, ""));
    expect(files.filter((id) => !COURSE_CATALOG.some((c) => c.id === id)), "image sans cours").toEqual([]);
    const tsx = read("src/pages/courses/CoursesIndex.tsx");
    const img = tsx.slice(tsx.indexOf("<img"), tsx.indexOf("/>", tsx.indexOf("<img")));
    expect(img).toMatch(/alt=""/);
    expect(img).toMatch(/width=\{800\}/);
  });
});

describe("illustrations des articles du blog (public/img/blog)", () => {
  const ids = blogPosts.map((post) => post.id);
  const files = fs.readdirSync(path.resolve(root, BLOG_DIR));

  it("chaque article a son image .webp, et chaque image appartient à un article", () => {
    expect(ids.length).toBeGreaterThanOrEqual(5);
    expect(files.sort()).toEqual(ids.map((id) => `${id}.webp`).sort());
  });

  it.each(ids)("%s : vrai fichier WebP, léger", (id) => {
    const bytes = fs.readFileSync(path.resolve(root, BLOG_DIR, `${id}.webp`));
    expect(bytes.subarray(0, 4).toString("latin1"), "signature RIFF").toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("latin1"), "signature WEBP").toBe("WEBP");
    expect(bytes.length, "image vide ou presque (génération ratée ?)").toBeGreaterThan(4 * 1024);
    expect(bytes.length, "image trop lourde").toBeLessThan(120 * 1024);
  });

  it("les pages affichent ces images comme décoratives (alt vide), avec dimensions", () => {
    for (const file of ["src/components/home/LatestArticles.tsx", "src/components/blog/BlogPostCard.tsx", "src/components/blog/BlogPost.tsx"]) {
      const tsx = read(file);
      expect(tsx, file).toContain("blogImage(");
      const img = tsx.slice(tsx.indexOf("<img"), tsx.indexOf("/>", tsx.indexOf("<img")));
      expect(img, file).toMatch(/alt=""/);
      expect(img, file).toMatch(/width=\{800\}/);
      expect(img, file).toMatch(/height=\{450\}/);
    }
    for (const file of ["src/components/home/FeaturedCourses.tsx"]) {
      const tsx = read(file);
      const img = tsx.slice(tsx.indexOf("<img"), tsx.indexOf("/>", tsx.indexOf("<img")));
      expect(img, file).toMatch(/alt=""/);
    }
  });

  it("plus aucune photographie ni image distante n'est livrée (la licence du site ne doit rien exclure d'autre que les logos)", () => {
    expect(fs.existsSync(path.resolve(root, "public/img/photos"))).toBe(false);
    for (const file of ["src/components/home/FeaturedCourses.tsx", "src/components/home/LatestArticles.tsx", "src/lib/blog-image.ts"]) {
      expect(read(file)).not.toMatch(/img\/photos|unsplash|https?:\/\//i);
    }
  });
});
