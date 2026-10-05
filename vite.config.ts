import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { LICENSE_FILE, SITE_BASE, SITE_NAME, SITE_URL } from "./src/config/site";
import { pageMetaFor } from "./src/config/page-meta";
import { collectDynamicMeta, collectRoutes } from "./scripts/collect-routes";

// Content-Security-Policy injectée uniquement au build : en dev, Vite
// a besoin de scripts inline (React refresh) qu'elle bloquerait.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const productionHardening = (): Plugin => {
  let outDir = "dist";
  return {
    name: "production-hardening",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // Juste après <meta charset>, et avant toute ressource que la politique doit couvrir
    transformIndexHtml: (html) => {
      const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`;
      const charsetMeta = /<meta charset="[^"]*"\s*\/?>/i;
      if (!charsetMeta.test(html)) {
        throw new Error("index.html : <meta charset> introuvable, impossible de placer la CSP");
      }
      return html.replace(charsetMeta, (match) => `${match}\n    ${cspMeta}`);
    },
    // Publie le texte de la licence (lien du pied de page) et versionne le cache du service worker à chaque build
    writeBundle() {
      const licensePath = path.resolve(__dirname, "LICENSE");
      if (!fs.existsSync(licensePath)) throw new Error("Fichier LICENSE introuvable à la racine du dépôt (publié sous " + LICENSE_FILE + ")");
      fs.copyFileSync(licensePath, path.join(outDir, LICENSE_FILE));
      const swPath = path.join(outDir, "sw.js");
      if (!fs.existsSync(swPath)) return;
      const buildId = Date.now().toString(36);
      const source = fs.readFileSync(swPath, "utf8");
      fs.writeFileSync(swPath, source.replace(/__BUILD_ID__/g, buildId));
    },
  };
};

// --- Déploiement statique sur hylst.fr (build avec : vite build --mode hylst) ---
// Nginx sert des fichiers statiques sans repli vers index.html (try_files $uri $uri.html $uri/index.html) :
// chaque route de l'app doit donc exister sous forme de <route>/index.html.
const HYLST_BASE = SITE_BASE;
const HYLST_SITE_URL = SITE_URL;

const staticHosting = (): Plugin => {
  let outDir = "dist";
  return {
    name: "static-hosting-hylst",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // Métadonnées sociales et SEO en URL absolue (une URL relative n'est pas résolue par les réseaux sociaux)
    transformIndexHtml: (html) =>
      html
        .replace(/content="\/logo\.png"/g, `content="${HYLST_SITE_URL}logo.png"`)
        .replace("</head>", `    <meta property="og:locale" content="fr_FR" />\n    <meta name="robots" content="index, follow" />\n  </head>`),
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, "utf8");
      const { all, canonical, legacy } = collectRoutes(__dirname);
      const dynamicMeta = collectDynamicMeta(__dirname);
      const urlOf = (route: string) => (route === "/" ? HYLST_SITE_URL : `${HYLST_SITE_URL}${route.slice(1)}`);
      const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      const legacyTarget = new Map(legacy.map((entry) => [entry.from, entry.to]));

      /** Remplace titre et description (balises de index.html) par ceux de la route ; échoue si une balise manque */
      const withMeta = (html: string, meta: { title: string; description: string }) => {
        const swap = (source: string, pattern: RegExp, replacement: string) => {
          if (!pattern.test(source)) throw new Error(`static-hosting : balise introuvable dans index.html : ${pattern}`);
          return source.replace(pattern, replacement);
        };
        let out = swap(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
        out = swap(out, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
        out = swap(out, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
        out = swap(out, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
        return out;
      };

      const missingMeta: string[] = [];
      for (const route of all) {
        const target = route === "/" ? indexPath : path.join(outDir, route.slice(1), "index.html");
        let page: string;
        if (legacyTarget.has(route)) {
          // Ancienne URL : page de redirection (le navigateur et les robots suivent l'adresse canonique sans attendre le JavaScript)
          // Le canonical est absolu (référencement) ; le lien et la redirection restent relatifs à la base du site pour fonctionner
          // aussi sur un autre hôte (préproduction, test local)
          const to = legacyTarget.get(route) as string;
          // Le canonical n'a jamais de fragment (#ancre) ; la redirection, elle, le conserve
          const destination = urlOf(to.replace(/#.*$/, ""));
          const local = `${HYLST_BASE}${to.slice(1)}`;
          page = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>Page déplacée - ${SITE_NAME}</title>\n<link rel="canonical" href="${destination}" />\n<meta http-equiv="refresh" content="0; url=${local}" />\n</head>\n<body>\n<p>Cette page a été déplacée : <a href="${local}">${destination}</a></p>\n</body>\n</html>\n`;
        } else {
          const staticMeta = pageMetaFor(route);
          const dynamic = dynamicMeta[route];
          const meta = staticMeta ?? (dynamic ? { title: `${dynamic.title} - ${SITE_NAME}`, description: dynamic.description } : undefined);
          if (!meta) missingMeta.push(route);
          const base = meta && route !== "/" ? withMeta(template, meta) : template;
          page = base.replace(
            "</head>",
            `    <link rel="canonical" href="${urlOf(route)}" />\n    <meta property="og:url" content="${urlOf(route)}" />\n  </head>`
          );
        }
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, page);
      }
      if (missingMeta.length > 0) throw new Error(`static-hosting : routes sans titre ni description (à ajouter dans src/config/page-meta.ts) : ${missingMeta.join(", ")}`);

      const escapeXml = (value: string) => value.replace(/&/g, "&amp;");
      const today = new Date().toISOString().slice(0, 10);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonical
        .map((route) => `  <url><loc>${escapeXml(urlOf(route))}</loc><lastmod>${today}</lastmod></url>`)
        .join("\n")}\n</urlset>\n`;
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);

      // 404.html : page autonome (CSS en ligne, liens absolus car servie à n'importe quelle profondeur), à brancher
      // sur `error_page 404 /data_science_explorer/404.html;` côté Nginx. noindex : jamais référencée.
      const link = (route: string, label: string) => `<li><a href="${urlOf(route)}">${label}</a></li>`;
      fs.writeFileSync(
        path.join(outDir, "404.html"),
        `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<meta name="robots" content="noindex" />\n<link rel="icon" type="image/svg+xml" href="${SITE_URL}favicon.svg" />\n<title>Page introuvable - ${SITE_NAME}</title>\n<style>\n*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.25rem;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#0f172a}\nmain{max-width:32rem;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:2rem}\nh1{margin:0 0 .5rem;font-size:1.75rem}p{line-height:1.6;color:#475569}\nul{padding-left:1.25rem;line-height:1.9}a{color:#2563eb}\n.code{font-size:.85rem;font-weight:600;color:#64748b;letter-spacing:.08em}\n@media (prefers-color-scheme:dark){body{background:#0f172a;color:#f1f5f9}main{background:#1e293b;border-color:#334155}p{color:#cbd5e1}a{color:#93c5fd}.code{color:#94a3b8}}\n</style>\n</head>\n<body>\n<main>\n<div class="code">ERREUR 404</div>\n<h1>Page introuvable</h1>\n<p>L'adresse demandée n'existe pas ou a été déplacée. Voici quelques points d'entrée :</p>\n<ul>\n${[
          link("/", "Accueil"),
          link("/courses", "Catalogue des cours"),
          link("/glossary", "Glossaire"),
          link("/quiz", "Quiz"),
          link("/blog", "Blog"),
        ].join("\n")}\n</ul>\n</main>\n</body>\n</html>\n`
      );

      const robotsPath = path.join(outDir, "robots.txt");
      const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8").trimEnd() : "User-agent: *\nAllow: /";
      fs.writeFileSync(robotsPath, `${robots}\n\nSitemap: ${HYLST_SITE_URL}sitemap.xml\n`);
      console.log(`[hylst] ${all.length} pages HTML générées, ${canonical.length} URL dans sitemap.xml`);
    },
  };
};

// Versions des moteurs d'exécution : elles nomment les dossiers de public/vendor (scripts/sync-runtimes.mjs),
// ce qui permet de les mettre en cache sans risque de version périmée (voir public/sw.js)
const packageVersion = (name: string): string =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "node_modules", name, "package.json"), "utf8")).version;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "hylst" ? HYLST_BASE : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    productionHardening(),
    ...(mode === "hylst" ? [staticHosting()] : []),
  ],
  define: {
    __PYODIDE_VERSION__: JSON.stringify(packageVersion("pyodide")),
    __SQLJS_VERSION__: JSON.stringify(packageVersion("sql.js")),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
