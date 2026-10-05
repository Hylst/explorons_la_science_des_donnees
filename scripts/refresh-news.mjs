#!/usr/bin/env node
/**
 * Rafraîchit src/data/rss-articles.json à partir des flux déclarés dans src/data/rss-sources.json.
 *
 *   npm run news:refresh
 *
 * Le site est 100 % statique : il ne peut pas lire un flux RSS en direct (aucun serveur, et la plupart des
 * flux n'autorisent pas les requêtes depuis un navigateur). Les actualités affichées sont donc un instantané
 * pris ici, daté (`fetchedAt`), puis publié avec le site. Relancer cette commande avant chaque publication.
 *
 * Un flux qui répond mal (403, délai dépassé, XML inattendu) est ignoré avec un message ; si aucun flux ne
 * répond, le fichier existant n'est pas modifié. Sans dépendance : Node 18 ou plus récent.
 */
import { readFile, writeFile } from "node:fs/promises";

const SOURCES_URL = new URL("../src/data/rss-sources.json", import.meta.url);
const ARTICLES_URL = new URL("../src/data/rss-articles.json", import.meta.url);
const PER_SOURCE = 4;
const EXCERPT_MAX = 220;
const TIMEOUT_MS = 20_000;
const USER_AGENT = "Mozilla/5.0 (compatible; ExploronsLaDataScienceNews/1.0; +https://hylst.fr/)";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decodeEntities = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, name) => {
    if (name[0] === "#") {
      const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[name.toLowerCase()] ?? match;
  });

const stripCdata = (text) => text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
const collapse = (text) => text.replace(/\s+/g, " ").trim();
/** Texte brut d'un fragment de flux : CDATA retiré, entités décodées, balises supprimées */
const toPlainText = (raw) => collapse(decodeEntities(stripCdata(decodeEntities(stripCdata(raw))).replace(/<[^>]*>/g, " ")));

/** Extrait lisible : retire la mention « The post X appeared first on Y » ajoutée par WordPress aux flux */
const cleanExcerpt = (text) => text.replace(/\s*The post\s.+?\sappeared first on\s.+$/i, "").trim();

const truncate = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 40))}…`;
};

const tagContent = (block, name) => {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1] : "";
};

/** Adresse de l'article : <link>texte</link> en RSS, <link href="..."/> en Atom */
const articleUrl = (block) => {
  const text = collapse(stripCdata(tagContent(block, "link")));
  if (/^https?:\/\//i.test(text)) return text;
  for (const tag of block.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = tag.match(/rel=["']([^"']+)["']/i)?.[1];
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (href && (!rel || rel === "alternate")) return decodeEntities(href);
  }
  return "";
};

const parseFeed = (xml) => {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
  return blocks
    .map((block) => {
      const dateText = collapse(stripCdata(tagContent(block, "pubDate") || tagContent(block, "published") || tagContent(block, "updated") || tagContent(block, "dc:date")));
      const date = new Date(dateText);
      const summary = tagContent(block, "description") || tagContent(block, "summary") || tagContent(block, "content:encoded") || tagContent(block, "content");
      return {
        title: toPlainText(tagContent(block, "title")),
        url: articleUrl(block),
        date,
        excerpt: truncate(cleanExcerpt(toPlainText(summary)), EXCERPT_MAX)
      };
    })
    // Adresses https uniquement (jamais javascript: ni data:), date valide et pas dans le futur
    .filter((item) => item.title && /^https:\/\//i.test(item.url) && !Number.isNaN(item.date.getTime()) && item.date.getTime() < Date.now() + 86_400_000)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

const fetchFeed = async (url) => {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5" },
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  if (!/<(rss|feed)[\s>]/i.test(xml)) throw new Error("réponse qui n'est pas un flux RSS ou Atom");
  return xml;
};

const sources = JSON.parse(await readFile(SOURCES_URL, "utf8"));
const articles = [];
const failed = [];
for (const source of sources) {
  try {
    const items = parseFeed(await fetchFeed(source.url)).slice(0, PER_SOURCE);
    if (!items.length) throw new Error("aucun article exploitable");
    items.forEach((item) =>
      articles.push({
        title: item.title,
        source: source.name,
        date: item.date.toISOString(),
        url: item.url,
        excerpt: item.excerpt,
        category: source.category,
        language: source.language
      })
    );
    console.log(`OK   ${source.name.padEnd(28)} ${items.length} article(s), le plus récent : ${items[0].date.toISOString().slice(0, 10)}`);
  } catch (error) {
    failed.push(source.name);
    console.log(`SKIP ${source.name.padEnd(28)} ${error.message}`);
  }
}

if (!articles.length) {
  console.error("Aucun flux n'a répondu : src/data/rss-articles.json n'a pas été modifié.");
  process.exit(1);
}

articles.sort((a, b) => b.date.localeCompare(a.date));
await writeFile(ARTICLES_URL, `${JSON.stringify({ fetchedAt: new Date().toISOString(), articles }, null, 2)}\n`, "utf8");
console.log(`\n${articles.length} article(s) écrits dans src/data/rss-articles.json${failed.length ? ` (ignoré : ${failed.join(", ")})` : ""}.`);
