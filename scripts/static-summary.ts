// Résumé statique écrit dans <div id="root"> de chaque page générée au build hylst : titre, description, fil d'Ariane,
// pages filles, plan des cours (titres des modules) et texte complet des articles du blog. Les moteurs et les lecteurs
// sans JavaScript lisent la page ; React remplace ce bloc au montage (createRoot().render, sans hydratation).
import fs from "node:fs";
import path from "node:path";
import { COURSE_CATALOG } from "../src/data/course-catalog";
import { SITE_BASE } from "../src/config/site";

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const MODULE_DECLARATION = /export const (\w+): LessonModule = \{\s*id: "[^"]*",\s*title: "((?:[^"\\]|\\.)*)"/g;

/** Titres des modules de chaque cours rédigé et des projets guidés, dans l'ordre du cours, par route de page.
 *  Lu dans les sources (le config Vite ne résout pas l'alias @ des leçons) ; échoue si un module est introuvable. */
export const lessonOutlines = (root: string): Map<string, string[]> => {
  const dir = path.resolve(root, "src/data/lessons");
  const routeOf = new Map<string, string>(COURSE_CATALOG.map((course) => [course.id, course.href]));
  routeOf.set("projects", "/projects");
  const out = new Map<string, string[]>();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const index = path.join(dir, entry.name, "index.ts");
    if (!entry.isDirectory() || !fs.existsSync(index)) continue;
    const read = (file: string) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const indexSource = read(index);
    const id = /id: "([^"]+)"/.exec(indexSource)?.[1];
    const names = /modules: \[([^\]]*)\]/.exec(indexSource)?.[1].split(",").map((name) => name.trim()).filter(Boolean);
    const route = id ? routeOf.get(id) : undefined;
    if (!id || !names || !route) throw new Error(`plan des cours : ${entry.name}/index.ts illisible ou cours absent du catalogue`);
    const titles = new Map<string, string>();
    for (const file of fs.readdirSync(path.join(dir, entry.name))) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
      for (const m of read(path.join(dir, entry.name, file)).matchAll(MODULE_DECLARATION)) titles.set(m[1], m[2].replace(/\\"/g, '"'));
    }
    out.set(
      route,
      names.map((name) => {
        const title = titles.get(name);
        if (!title) throw new Error(`plan des cours : module ${name} introuvable dans ${entry.name}`);
        return title;
      }),
    );
  }
  return out;
};

export interface SummaryLink {
  route: string;
  name: string;
}

export interface SummaryInput {
  name: string;
  description: string;
  /** Fil d'Ariane sans la page elle-même (vide pour l'accueil) */
  crumbs: SummaryLink[];
  /** Pages dont celle-ci est le parent direct dans le fil d'Ariane */
  children: SummaryLink[];
  /** Titres des modules (cours rédigés, projets guidés) */
  outline?: string[];
  /** Corps HTML d'un article du blog (contenu du dépôt) */
  articleHtml?: string;
}

const href = (route: string) => (route === "/" ? SITE_BASE : `${SITE_BASE}${route.slice(1)}`);
const linkList = (links: SummaryLink[]) => links.map((l) => `<li><a href="${href(l.route)}">${escapeHtml(l.name)}</a></li>`).join("");

/** Bloc HTML du résumé statique (une ligne, à placer dans <div id="root">) */
export const staticSummary = (input: SummaryInput): string => {
  const parts = [`<div class="static-summary">`];
  if (input.crumbs.length > 0) parts.push(`<nav aria-label="Fil d'Ariane"><ol>${linkList(input.crumbs)}</ol></nav>`);
  parts.push(`<h1>${escapeHtml(input.name)}</h1>`, `<p>${escapeHtml(input.description)}</p>`);
  if (input.outline?.length) parts.push(`<h2>Modules</h2><ol>${input.outline.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ol>`);
  if (input.articleHtml) parts.push(`<article>${input.articleHtml.trim()}</article>`);
  if (input.children.length > 0) parts.push(`<h2>Dans cette partie</h2><ul>${linkList(input.children)}</ul>`);
  parts.push(`</div>`);
  return parts.join("");
};
