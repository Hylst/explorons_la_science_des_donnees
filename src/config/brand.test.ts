import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_TITLE } from "./page-meta";
import { LICENSE_SPDX, SITE_BASE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.resolve(root, file), "utf8").replace(/\r\n/g, "\n");
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------------------------------------------------------
// Parcours des fichiers : src/, public/ (sans public/vendor : moteurs tiers) et index.html. Les binaires (images, polices,
// wasm) ne sont pas lus : logo.png et les icônes PWA ne peuvent donc pas être vérifiés par ce test.
// ---------------------------------------------------------------------------------------------------------------------

const BINARY_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".eot", ".wasm", ".zip", ".gz", ".pdf", ".mp4", ".webm"]);
const SKIPPED_DIRECTORIES = new Set(["public/vendor", "node_modules"]);

const listFiles = (relativeDir: string): string[] => {
  if (SKIPPED_DIRECTORIES.has(relativeDir)) return [];
  const absolute = path.resolve(root, relativeDir);
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${relativeDir}/${entry.name}`;
    return entry.isDirectory() ? listFiles(relative) : [relative];
  });
};

let textFilesCache: { file: string; content: string }[] | undefined;
const textFiles = (): { file: string; content: string }[] =>
  (textFilesCache ??= [...listFiles("src"), ...listFiles("public"), "index.html"]
    .filter((file) => !BINARY_EXTENSIONS.has(path.extname(file).toLowerCase()))
    // Les fichiers de test ne sont pas livrés et citent l'ancien nom pour le chercher : ils sont hors du balayage
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .flatMap((file) => {
      const buffer = fs.readFileSync(path.resolve(root, file));
      if (buffer.includes(0)) return []; // binaire sans extension connue
      return [{ file, content: buffer.toString("utf8") }];
    }));

interface Occurrence {
  file: string;
  line: number;
  text: string;
  match: string;
}

const occurrencesOf = (pattern: RegExp): Occurrence[] =>
  textFiles().flatMap(({ file, content }) =>
    [...content.matchAll(pattern)].map((m) => {
      const index = m.index ?? 0;
      const line = content.slice(0, index).split("\n").length;
      return { file, line, text: content.split("\n")[line - 1].trim(), match: m[0] };
    })
  );

interface Exception {
  /** Fichier concerné, chemin relatif à la racine du dépôt */
  file: string;
  /** La ligne doit correspondre : l'exception ne couvre que cet usage, pas le reste du fichier */
  line: RegExp;
  reason: string;
}

// Anciens noms : seul le slug technique `data_science_explorer` (minuscules, tirets bas) peut subsister.
const OLD_NAME = /\bdata[\s_-]*science[\s_-]*explorer/gi;
const OLD_NAME_EXCEPTIONS: Exception[] = [
  {
    file: "src/config/site.ts",
    line: /\/data_science_explorer\//,
    reason: "Sous-chemin de déploiement sur hylst.fr (SITE_BASE et son commentaire) : l'URL publique et le sitemap soumis en dépendent.",
  },
  {
    file: "src/lib/asset.ts",
    line: /https:\/\/hylst\.fr\/data_science_explorer\//,
    reason: "Commentaire de documentation qui cite l'URL de déploiement réelle en exemple.",
  },
  {
    file: "src/components/home/FeatureHighlights.tsx",
    line: /svg\/data_science_explorer_apprentissage\.svg/,
    reason: "Nom de fichier de l'illustration dans public/svg : identifiant technique, jamais affiché.",
  },
  {
    file: "public/sw.js",
    line: /"\/data_science_explorer\/"/,
    reason: "Commentaire qui cite le sous-chemin de déploiement (portée du service worker).",
  },
];

// Préfixe `ds-explorer-` : clés de localStorage et caches existants chez les visiteurs ; les renommer ferait perdre leurs données.
const OLD_PREFIX = /\bds[\s_-]?explorer/gi;
const OLD_PREFIX_EXCEPTIONS: Exception[] = [
  { file: "src/hooks/use-theme.ts", line: /ds-explorer-theme/, reason: "Clé de localStorage de la préférence de thème (THEME_STORAGE_KEY)." },
  { file: "public/theme-init.js", line: /ds-explorer-theme/, reason: "Même clé de thème, lue avant le premier affichage." },
  { file: "public/sw.js", line: /ds-explorer-/, reason: "Préfixe des caches du service worker (CACHE_PREFIX) et son commentaire." },
  { file: "src/config/site.ts", line: /ds-explorer-/, reason: "Commentaire qui explique pourquoi ces identifiants ne sont pas renommés." },
];

/** Une occurrence est tolérée si elle est écrite sous la forme technique exacte ET couverte par une exception de sa ligne */
const unexplained = (occurrences: Occurrence[], exceptions: Exception[], technicalForm: RegExp) =>
  occurrences.filter(
    (o) => !(technicalForm.test(o.match) && exceptions.some((e) => e.file === o.file && e.line.test(o.text)))
  );

describe("ancien nom « Data Science Explorer »", () => {
  it("le parcours lit bien les fichiers du site (garde-fou contre un balayage vide)", () => {
    const files = textFiles().map((f) => f.file);
    expect(files.length).toBeGreaterThan(200);
    expect(files).toContain("index.html");
    expect(files).toContain("src/config/site.ts");
    expect(files).toContain("public/manifest.json");
    expect(files.some((f) => f.startsWith("public/vendor/"))).toBe(false);
  });

  it("n'apparaît plus dans le texte visible : seul le slug technique data_science_explorer subsiste, aux endroits listés", () => {
    const offenders = unexplained(occurrencesOf(OLD_NAME), OLD_NAME_EXCEPTIONS, /^data_science_explorer$/);
    expect(offenders.map((o) => `${o.file}:${o.line} « ${o.text} »`)).toEqual([]);
  });

  it("chaque exception autorisée est encore utilisée (sinon la supprimer de la liste)", () => {
    const found = occurrencesOf(OLD_NAME);
    const unused = OLD_NAME_EXCEPTIONS.filter((e) => !found.some((o) => o.file === e.file && e.line.test(o.text)));
    expect(unused.map((e) => e.file)).toEqual([]);
  });

  it("le préfixe technique ds-explorer- n'est présent que dans les clés et caches existants", () => {
    const offenders = unexplained(occurrencesOf(OLD_PREFIX), OLD_PREFIX_EXCEPTIONS, /^ds-explorer$/);
    expect(offenders.map((o) => `${o.file}:${o.line} « ${o.text} »`)).toEqual([]);
  });

  it("chaque exception de préfixe est encore utilisée", () => {
    const found = occurrencesOf(OLD_PREFIX);
    const unused = OLD_PREFIX_EXCEPTIONS.filter((e) => !found.some((o) => o.file === e.file && e.line.test(o.text)));
    expect(unused.map((e) => e.file)).toEqual([]);
  });

  it("chaque exception est justifiée", () => {
    for (const exception of [...OLD_NAME_EXCEPTIONS, ...OLD_PREFIX_EXCEPTIONS]) {
      expect(exception.reason.length, exception.file).toBeGreaterThan(20);
    }
  });

  it("aucun nom de fichier de src/ ou public/ ne porte l'ancien nom, hors l'illustration listée", () => {
    const names = [...listFiles("src"), ...listFiles("public")].filter((file) => /data[\s_-]*science[\s_-]*explorer/i.test(path.basename(file)));
    expect(names).toEqual(["public/svg/data_science_explorer_apprentissage.svg"]);
  });

  it("l'illustration à l'ancien nom de fichier existe bien là où le composant la cherche", () => {
    expect(fs.existsSync(path.resolve(root, "public/svg/data_science_explorer_apprentissage.svg"))).toBe(true);
  });

  it("le sous-chemin de déploiement reste /data_science_explorer/ (changer ce slug casserait les URL publiques)", () => {
    expect(SITE_BASE).toBe("/data_science_explorer/");
    expect(SITE_URL.endsWith(SITE_BASE)).toBe(true);
  });
});

describe("cohérence de la marque", () => {
  it("SITE_NAME est « Explorons la Data Science »", () => {
    expect(SITE_NAME).toBe("Explorons la Data Science");
  });

  describe("index.html", () => {
    const html = read("index.html");
    const attribute = (pattern: RegExp) => html.match(pattern)?.[1];

    it("le titre de la page commence par le nom du site et reprend HOME_TITLE", () => {
      const title = attribute(/<title>([^<]*)<\/title>/);
      expect(title).toBeDefined();
      expect(title?.startsWith(SITE_NAME)).toBe(true);
      expect(title).toBe(HOME_TITLE);
    });

    it("og:site_name et le titre de l'application iOS valent SITE_NAME", () => {
      expect(attribute(/<meta property="og:site_name" content="([^"]*)"/)).toBe(SITE_NAME);
      expect(attribute(/<meta name="apple-mobile-web-app-title" content="([^"]*)"/)).toBe(SITE_NAME);
    });

    it("og:title contient le nom du site", () => {
      expect(attribute(/<meta property="og:title" content="([^"]*)"/)).toContain(SITE_NAME);
    });

    it("la description est celle de SITE_DESCRIPTION", () => {
      expect(attribute(/<meta name="description" content="([^"]*)"/)).toBe(SITE_DESCRIPTION);
    });
  });

  describe("manifeste PWA", () => {
    const manifests = fs.readdirSync(path.resolve(root, "public")).filter((name) => /^manifest.*\.json$/.test(name));

    it("trouve au moins un manifeste", () => {
      expect(manifests.length).toBeGreaterThan(0);
    });

    it.each(manifests)("%s : name et short_name portent le nom du site", (name) => {
      const manifest = JSON.parse(read(`public/${name}`)) as { name?: string; short_name?: string };
      expect(manifest.name).toContain(SITE_NAME);
      expect(manifest.short_name).toBeTruthy();
      expect(manifest.short_name).toContain(SITE_NAME);
    });
  });

  it("offline.html porte le nom du site dans son titre", () => {
    const title = read("public/offline.html").match(/<title>([^<]*)<\/title>/)?.[1];
    expect(title).toContain(SITE_NAME);
  });

  describe("pages générées au build par vite.config.ts", () => {
    // public/404.html n'existe pas : la page est écrite par le plugin staticHosting à partir de SITE_NAME.
    // On vérifie donc le gabarit lui-même, faute de fichier à lire avant le build.
    const config = read("vite.config.ts");

    it("importe SITE_NAME depuis src/config/site.ts au lieu de le recopier", () => {
      expect(config).toMatch(/import\s*\{[^}]*\bSITE_NAME\b[^}]*\}\s*from\s*["']\.\/src\/config\/site["']/);
    });

    it("la page 404 utilise SITE_NAME dans son titre", () => {
      expect(config).toContain("<title>Page introuvable - ${SITE_NAME}</title>");
    });

    it("la page de redirection des anciennes URL utilise SITE_NAME dans son titre", () => {
      expect(config).toContain("<title>Page déplacée - ${SITE_NAME}</title>");
    });
  });
});

describe("licence", () => {
  const packageJson = JSON.parse(read("package.json")) as { license?: string };

  it("package.json annonce la même licence que src/config/site.ts", () => {
    expect(packageJson.license).toBe(LICENSE_SPDX);
  });

  it("la licence annoncée est AGPL-3.0-or-later", () => {
    expect(LICENSE_SPDX).toBe("AGPL-3.0-or-later");
  });

  it("NOTICE.md déclare le même identifiant SPDX et cite le nom actuel du site", () => {
    const notice = read("NOTICE.md");
    expect(notice.split("\n")[0]).toBe(`SPDX-License-Identifier: ${LICENSE_SPDX}`);
    expect(notice).toMatch(new RegExp(`^${escapeRegExp(SITE_NAME)}`, "m"));
    expect(notice).toContain("GNU Affero General Public License");
  });

  // GitHub ne reconnaît la licence (et n'affiche « AGPL-3.0 » plutôt que « Other ») que si le fichier est le texte officiel seul :
  // l'avis du projet et les exceptions vivent dans NOTICE.md.
  it("LICENSE est le texte officiel de la GNU AGPL v3, sans préambule du projet", () => {
    const license = read("LICENSE");
    expect(license.trimStart().startsWith("GNU AFFERO GENERAL PUBLIC LICENSE\n")).toBe(true);
    expect(license).toContain("Version 3, 19 November 2007");
    expect(license).not.toContain("SPDX-License-Identifier");
    expect(license).not.toContain(SITE_NAME);
    expect(license.split("\n").length).toBeGreaterThan(640);
  });
});
