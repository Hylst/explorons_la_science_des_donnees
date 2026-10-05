import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// Fichier exécuté par Node au build : import relatif, sans alias
import { collectRoutes } from "../../scripts/collect-routes";

const root = process.cwd();
const routes = collectRoutes(root);
const canonical = new Set(routes.canonical);

/** Fichiers publics et ressources servies telles quelles : ce ne sont pas des routes de l'application */
const STATIC_PREFIX = /^\/(img|icons|vendor|sandbox|assets|favicon|logo|manifest|offline|sw|robots|sitemap|theme-init|LICENSE|404)/;
/** Chemins qui apparaissent dans des exemples de code affichés aux apprenants (API Flask de démonstration) */
const CODE_SAMPLES = new Set(["/predict"]);

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return walk(path.join(dir, entry.name));
    return /\.(tsx?|json)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [path.join(dir, entry.name)] : [];
  });

// Lien interne écrit en toutes lettres : to="/x", href="/x", path: "/x", navigate("/x")...
// Les liens construits à l'exécution (gabarits avec ${...}) échappent volontairement à ce contrôle.
const LINK = /(?:\bto|\bhref|\bpath|\blink|\burl|\broute|\bnavigate\()\s*[:=(]?\s*\{?\s*["'`](\/[A-Za-z0-9_\-/#?=&.%]*)["'`]/g;

const internalLinks = () => {
  const found: { target: string; where: string }[] = [];
  for (const file of walk(path.join(root, "src"))) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(LINK)) {
      const target = match[1].replace(/[#?].*$/, "").replace(/\/$/, "") || "/";
      if (STATIC_PREFIX.test(target) || CODE_SAMPLES.has(target)) continue;
      const line = source.slice(0, match.index).split("\n").length;
      found.push({ target, where: `${path.relative(root, file).split(path.sep).join("/")}:${line}` });
    }
  }
  return found;
};

describe("liens internes (garde-fou)", () => {
  const links = internalLinks();

  it("en trouve beaucoup : le motif de recherche fonctionne", () => {
    expect(links.length).toBeGreaterThan(150);
  });

  it("chaque lien interne écrit dans le code mène à une route canonique, jamais à une redirection ni à une page absente", () => {
    const broken = links.filter((link) => !canonical.has(link.target));
    expect(broken.map((link) => `${link.target} (${link.where})`)).toEqual([]);
  });
});
