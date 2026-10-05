// Controle du build statique avant depot (meme philosophie que
// explorons_l_ia/scripts/verify-dist.mjs et a_votre_service/scripts/verify-dist.mjs).
// 100 % statique : aucun secret, aucun service tiers, aucun chemin absolu
// hors base (sous-chemin Nginx /data_science_explorer/).
// Usage : node scripts/verify-dist.mjs [dossier-dist]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = process.argv[2] || path.join(ROOT, 'dist-hylst');
const BASE = '/data_science_explorer/';
const CANONICAL = 'https://hylst.fr/data_science_explorer';
const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

// secret : true = l'extrait n'est pas affiche, pour ne jamais recopier une cle dans un journal.
const RULES = [
  { name: 'Supabase (client, URL ou cle)', re: /supabase/i },
  { name: "variable d'environnement Vite (VITE_*)", re: /VITE_[A-Z0-9_]+/ },
  { name: "jeton JWT (cle d'API)", re: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}/, secret: true },
  { name: "cle d'API de type sk-", re: /\bsk-[A-Za-z0-9_-]{20,}/, secret: true },
  { name: "cle d'API Google (AIza)", re: /AIza[0-9A-Za-z_-]{35}/, secret: true },
];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const fails = [];
const fail = (m) => { fails.push(m); console.error('ECHEC : ' + m); };
const ok = (m) => console.log('OK : ' + m);

if (!fs.existsSync(DIST)) { console.error('ECHEC : dossier introuvable : ' + DIST); process.exit(1); }

let scanned = 0;
for (const file of walk(DIST)) {
  if (!TEXT_EXT.has(path.extname(file).toLowerCase())) continue;
  scanned += 1;
  const content = fs.readFileSync(file, 'utf8');
  for (const rule of RULES) {
    const match = rule.re.exec(content);
    if (!match) continue;
    const excerpt = rule.secret ? '(extrait masque)' : JSON.stringify(content.slice(Math.max(0, match.index - 40), match.index + 60));
    fail(path.relative(DIST, file) + ' : ' + rule.name + ' ' + excerpt);
  }
}
ok('zero secret/backend dans ' + scanned + ' fichiers texte');

const index = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const abs = [...index.matchAll(/(src|href)="\/(?!data_science_explorer\/)/g)];
if (abs.length) fail(abs.length + ' chemin(s) absolu(s) hors base dans index.html');
else ok('zero chemin absolu hors base dans index.html');

if (!index.includes(CANONICAL)) fail('canonical/absolus hylst.fr absents');
else ok('canonical hylst.fr present');

if (!fs.existsSync(path.join(DIST, 'sitemap.xml'))) fail('sitemap.xml absent');
else ok('sitemap.xml present');

// Pages HTML : une par route, avec titre et description propres, canonical sans fragment, redirections valides
const SKIPPED_DIRS = new Set(['assets', 'vendor', 'img', 'icons', 'svg', 'sandbox']);
const pageFiles = [];
const collectPages = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!SKIPPED_DIRS.has(entry.name)) collectPages(full); }
    else if (entry.name === 'index.html') pageFiles.push(full);
  }
};
collectPages(DIST);
const routeOf = (file) => {
  const dir = path.relative(DIST, path.dirname(file)).split(path.sep).join('/');
  return dir === '' ? '/' : '/' + dir;
};
const isRedirect = (html) => /http-equiv="refresh"/.test(html);
const failsBeforePages = fails.length;
const titles = new Map();
const descriptions = new Map();
let pageCount = 0;
let redirectCount = 0;
for (const file of pageFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const route = routeOf(file);
  const canonical = (/<link rel="canonical" href="([^"]+)"/.exec(html) || [])[1];
  if (!canonical) { fail(route + ' : canonical absent'); continue; }
  if (canonical.includes('#')) fail(route + ' : canonical avec fragment (' + canonical + ')');
  if (isRedirect(html)) {
    redirectCount += 1;
    const target = (/url=([^"]+)"/.exec(html) || [])[1] || '';
    if (!target.startsWith(BASE)) { fail(route + ' : redirection hors de la base (' + target + ')'); continue; }
    const destination = path.join(DIST, target.slice(BASE.length).replace(/#.*$/, ''), 'index.html');
    if (!fs.existsSync(destination)) fail(route + ' : cible de redirection absente (' + target + ')');
    else if (isRedirect(fs.readFileSync(destination, 'utf8'))) fail(route + ' : chaine de redirections (' + target + ')');
    continue;
  }
  pageCount += 1;
  const title = (/<title>([^<]*)<\/title>/.exec(html) || [])[1];
  const description = (/<meta name="description" content="([^"]*)"/.exec(html) || [])[1];
  if (!title) fail(route + ' : titre absent'); else titles.set(title, [...(titles.get(title) || []), route]);
  if (!description) fail(route + ' : description absente'); else descriptions.set(description, [...(descriptions.get(description) || []), route]);
  const expected = route === '/' ? CANONICAL + '/' : CANONICAL + route;
  if (canonical !== expected) fail(route + ' : canonical ' + canonical + ' (attendu ' + expected + ')');
}
for (const [title, routes] of titles) if (routes.length > 1) fail('titre en double (' + title + ') : ' + routes.join(', '));
for (const [description, routes] of descriptions) if (routes.length > 1) fail('description en double : ' + routes.join(', '));
if (fails.length === failsBeforePages) ok(pageCount + ' pages et ' + redirectCount + ' redirections controlees (titres et descriptions uniques, canonical sans fragment)');

const sitemapFile = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  const locations = [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const missing = locations.filter((loc) => {
    const route = loc.slice(CANONICAL.length) || '/';
    const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
    return !fs.existsSync(file) || isRedirect(fs.readFileSync(file, 'utf8'));
  });
  if (missing.length) fail('sitemap : URL sans page ou menant a une redirection : ' + missing.join(', '));
  else if (new Set(locations).size !== locations.length) fail('sitemap : URL en double');
  else ok('sitemap : ' + locations.length + ' URL, toutes servies par une vraie page');
}

console.log(fails.length === 0 ? 'VERIFY-DIST : SUCCES' : 'VERIFY-DIST : ' + fails.length + ' ECHEC(S)');
process.exit(fails.length === 0 ? 0 : 1);
