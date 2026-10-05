// Liste des routes du site, lue dans le code source : partagée par vite.config.ts (une page HTML par route, sitemap)
// et par les tests. Fichier exécuté par Node : imports de Node uniquement, aucune API propre à Vite.
import fs from "node:fs";
import path from "node:path";

export interface LegacyRedirect {
  from: string;
  to: string;
}

export interface RouteSet {
  /** Toutes les routes qui doivent exister sous forme de page HTML, anciennes URL comprises */
  all: string[];
  /** Routes canoniques : celles du sitemap (sans les anciennes URL) */
  canonical: string[];
  /** Anciennes URL et leur destination (src/config/routes.ts) */
  legacy: LegacyRedirect[];
}

/** Routes statiques déclarées dans le code, plus les pages dynamiques (articles du blog, catégories de quiz) */
export const collectRoutes = (root: string = process.cwd()): RouteSet => {
  const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8").replace(/\r\n/g, "\n");

  const legacy: LegacyRedirect[] = [...read("src/config/routes.ts").matchAll(/\{\s*from:\s*'(\/[^']*)',\s*to:\s*'(\/[^']*)'\s*\}/g)].map((m) => ({
    from: m[1].replace(/#.*$/, ""),
    to: m[2],
  }));
  const legacyFrom = new Set(legacy.map((entry) => entry.from));

  const routes = new Set<string>(["/"]);
  for (const m of read("src/App.tsx").matchAll(/path="(\/[^"*:]*)"/g)) routes.add(m[1]);
  for (const m of read("src/components/routing/CourseRouter.tsx").matchAll(/path="([a-z][^"*:]*)"/g)) routes.add(`/courses/${m[1]}`);
  legacyFrom.forEach((from) => routes.add(from));

  const blogIds: string[] = JSON.parse(read("src/data/blog-posts.json")).map((post: { id: string }) => post.id);
  blogIds.forEach((id) => routes.add(`/blog/${id}`));

  const quizSource = read("src/data/quizData.ts");
  const categories = quizSource.slice(quizSource.indexOf("export const quizCategories"));
  for (const m of categories.matchAll(/^ {4}id: '([a-z0-9-]+)',/gm)) routes.add(`/quiz/${m[1]}`);

  return {
    all: [...routes].sort(),
    canonical: [...routes].filter((route) => !legacyFrom.has(route)).sort(),
    legacy,
  };
};

export interface DynamicMeta {
  title: string;
  description: string;
}

const unescapeQuote = (value: string) => value.replace(/\\'/g, "'");

/** Titre et description des routes dynamiques : articles du blog (blog-posts.json) et catégories de quiz (quizData.ts) */
export const collectDynamicMeta = (root: string = process.cwd()): Record<string, DynamicMeta> => {
  const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8").replace(/\r\n/g, "\n");
  const meta: Record<string, DynamicMeta> = {};

  const posts: { id: string; title: string; excerpt: string }[] = JSON.parse(read("src/data/blog-posts.json"));
  for (const post of posts) meta[`/blog/${post.id}`] = { title: post.title, description: post.excerpt };

  const quizSource = read("src/data/quizData.ts");
  const categories = quizSource.slice(quizSource.indexOf("export const quizCategories"));
  const pattern = /^ {4}id: '([a-z0-9-]+)',\n {4}title: '((?:[^'\\]|\\.)*)',\n {4}description: '((?:[^'\\]|\\.)*)',/gm;
  for (const m of categories.matchAll(pattern)) {
    meta[`/quiz/${m[1]}`] = { title: `Quiz : ${unescapeQuote(m[2])}`, description: `Quiz de data science : ${unescapeQuote(m[3])}.` };
  }
  return meta;
};
