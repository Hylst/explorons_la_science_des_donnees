// Données structurées (JSON-LD, schema.org) des pages générées au build hylst : le site (accueil), chaque cours
// rédigé du catalogue, chaque article du blog et le fil d'Ariane de chaque page ; dates connues pour le sitemap. Tout vient des données du site (catalogue, blog-posts.json, site.ts) :
// aucune note, aucun nombre d'élèves, aucun prix (le site n'a pas de partie commerciale).
import fs from "node:fs";
import path from "node:path";
import { COURSE_CATALOG } from "../src/data/course-catalog";
import { PAGE_META } from "../src/config/page-meta";
import { collectDynamicMeta, collectRoutes } from "./collect-routes";
import { AUTHOR_NAME, LEGAL_UPDATED, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../src/config/site";

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

/** Taille des illustrations du blog (public/img/blog), annoncée dans og:image:width et og:image:height ; vérifiée par le test */
export const BLOG_IMAGE_SIZE = { width: 800, height: 450 };

// `updated` : date de la dernière modification du texte de l'article, à changer quand on le retouche
interface Post { id: string; title: string; excerpt: string; author: string; date: string; updated: string }
const readPosts = (root: string): Post[] => JSON.parse(fs.readFileSync(path.resolve(root, "src/data/blog-posts.json"), "utf8"));

/** Articles du blog : route, image absolue, dates de publication et de modification (ISO), pour l'en-tête Open Graph,
 *  le JSON-LD et le sitemap ; échoue sur une date illisible ou une modification antérieure à la publication */
export const blogArticles = (root: string) =>
  readPosts(root).map((post) => {
    const datePublished = isoFromFrenchDate(post.date);
    const dateModified = isoFromFrenchDate(post.updated ?? "");
    if (!datePublished || !dateModified || dateModified < datePublished) throw new Error(`article ${post.id} : dates illisibles ou incohérentes (${post.date}, ${post.updated})`);
    return { post, route: `/blog/${post.id}`, image: `${SITE_URL}img/blog/${post.id}.webp`, datePublished, dateModified };
  });

/** Dates réellement connues, pour le lastmod du sitemap : dernière modification des articles, révision des pages légales.
 *  Les autres pages n'en ont pas (la date du build, la même partout, n'apprenait rien aux moteurs). */
export const knownDates = (root: string): Map<string, string> => {
  const out = new Map<string, string>();
  for (const { route, dateModified } of blogArticles(root)) out.set(route, dateModified);
  const legal = isoFromFrenchDate(LEGAL_UPDATED);
  if (!legal) throw new Error(`LEGAL_UPDATED illisible : ${LEGAL_UPDATED}`);
  for (const route of ["/privacy", "/terms"]) out.set(route, legal);
  return out;
};

/** Nom court de chaque page (titre sans le nom du site, comme dans page-meta.ts ; titre de l'article ou du quiz) ;
 *  undefined pour une adresse qui n'est pas une page canonique */
export const pageNames = (root: string) => {
  const pages = new Set(collectRoutes(root).canonical);
  const dynamic = collectDynamicMeta(root);
  return (route: string): string | undefined => (pages.has(route) ? PAGE_META[route]?.title ?? dynamic[route]?.title : undefined);
};

/** Fil d'Ariane d'une page : l'accueil, chaque niveau de l'URL qui est lui-même une page, puis la page.
 *  `nameOf` donne le nom court d'une page, `undefined` si ce n'est pas une page */
export const breadcrumbChain = (route: string, nameOf: (route: string) => string | undefined): string[] => {
  if (route === "/") return ["/"];
  const parts = route.split("/").filter(Boolean);
  const chain = ["/"];
  for (let i = 1; i < parts.length; i += 1) {
    const parent = `/${parts.slice(0, i).join("/")}`;
    if (nameOf(parent)) chain.push(parent);
  }
  chain.push(route);
  return chain;
};

/** BreadcrumbList JSON-LD de la chaîne ci-dessus ; null pour l'accueil */
export const breadcrumbList = (route: string, nameOf: (route: string) => string | undefined): JsonLd | null => {
  if (route === "/") return null;
  const chain = breadcrumbChain(route, nameOf);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: chain.map((r, i) => {
      const name = r === "/" ? "Accueil" : nameOf(r);
      if (!name) throw new Error(`fil d'Ariane : page sans nom : ${r}`);
      return { "@type": "ListItem", position: i + 1, name, item: urlOf(r) };
    }),
  };
};

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
  for (const { post, route, image, datePublished, dateModified } of blogArticles(root)) {
    out.set(route, {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: urlOf(route),
      inLanguage: "fr",
      author: { "@type": "Person", name: post.author },
      datePublished,
      dateModified,
      image,
      publisher: { "@type": "Person", name: AUTHOR_NAME },
    });
  }
  return out;
};

/** Balise à insérer dans <head> : « < » échappé pour qu'aucun texte ne puisse fermer la balise */
export const jsonLdTag = (data: JsonLd) =>
  `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;
