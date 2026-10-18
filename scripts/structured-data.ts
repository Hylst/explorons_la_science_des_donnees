// Données structurées (JSON-LD, schema.org) des pages générées au build hylst : le site (accueil), chaque cours
// rédigé du catalogue et chaque article du blog. Tout vient des données du site (catalogue, blog-posts.json, site.ts) :
// aucune note, aucun nombre d'élèves, aucun prix (le site n'a pas de partie commerciale).
import fs from "node:fs";
import path from "node:path";
import { COURSE_CATALOG } from "../src/data/course-catalog";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../src/config/site";

type JsonLd = Record<string, unknown>;

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 2 octobre 2026 » -> « 2026-10-02 » ; null si la date n'a pas cette forme */
export const isoFromFrenchDate = (date: string): string | null => {
  const m = /^(\d{1,2})(?:er)? ([a-zéû]+) (\d{4})$/.exec(date.trim());
  if (!m) return null;
  const mois = MOIS.indexOf(m[2]);
  if (mois < 0) return null;
  return `${m[3]}-${String(mois + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
};

const urlOf = (route: string) => (route === "/" ? SITE_URL : `${SITE_URL}${route.slice(1)}`);
const author = { "@type": "Person", name: AUTHOR_NAME };

/** JSON-LD de chaque route qui en a ; les autres pages n'en ont pas */
export const structuredData = (root: string): Map<string, JsonLd> => {
  const out = new Map<string, JsonLd>();
  out.set("/", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "fr",
    author,
  });
  for (const course of COURSE_CATALOG) {
    if (course.status !== "redige") continue;
    out.set(course.href, {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.description,
      url: urlOf(course.href),
      inLanguage: "fr",
      isAccessibleForFree: true,
      ...(course.level ? { educationalLevel: course.level } : {}),
      provider: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    });
  }
  const posts: { id: string; title: string; excerpt: string; author: string; date: string }[] = JSON.parse(
    fs.readFileSync(path.resolve(root, "src/data/blog-posts.json"), "utf8"),
  );
  for (const post of posts) {
    const date = isoFromFrenchDate(post.date);
    out.set(`/blog/${post.id}`, {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: urlOf(`/blog/${post.id}`),
      inLanguage: "fr",
      author: { "@type": "Person", name: post.author },
      ...(date ? { datePublished: date } : {}),
      image: `${SITE_URL}img/blog/${post.id}.webp`,
      publisher: { "@type": "Person", name: AUTHOR_NAME },
    });
  }
  return out;
};

/** Balise à insérer dans <head> : « < » échappé pour qu'aucun texte ne puisse fermer la balise */
export const jsonLdTag = (data: JsonLd) =>
  `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;
