// Service worker de « Explorons la Data Science » (le préfixe de cache « ds-explorer- » est un identifiant technique, à ne pas renommer)
// __BUILD_ID__ est remplacé à chaque build (voir vite.config.ts), ce qui
// crée un nouveau cache par déploiement et purge les anciens.

const VERSION = '__BUILD_ID__';
const CACHE_PREFIX = 'ds-explorer-';
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const LEGACY_CACHE = `${CACHE_PREFIX}static-v1`;
// Moteurs d'exécution de code (Python, SQLite : plusieurs dizaines de Mo). Leurs dossiers portent le numéro de version
// (public/vendor/pyodide-<version>/), donc ce cache survit aux déploiements : on ne retélécharge pas 48 Mo à chaque mise à jour du site.
const VENDOR_CACHE = `${CACHE_PREFIX}vendor-v2`;

// L'app est une SPA : toutes les routes renvoient index.html, mis en cache sous '/'.
// Le worker est servi à la racine de l'app : son dossier est le sous-chemin de déploiement
// ("/" en local, "/data_science_explorer/" sur hylst.fr).
const BASE = new URL('./', self.location).pathname;
const APP_SHELL = BASE;
const OFFLINE_PAGE = `${BASE}offline.html`;

const PRECACHE_URLS = [APP_SHELL, OFFLINE_PAGE, `${BASE}offline.js`, `${BASE}manifest.json`, `${BASE}favicon.svg`, `${BASE}icons/icon-192x192.png`];

self.addEventListener('install', (event) => {
  // Chaque ressource est ajoutée séparément : une ressource manquante
  // ne doit pas faire échouer tout le pré-cache.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      // L'ancien worker (caches « -v1 ») ne sait pas proposer la mise à jour :
      // on le remplace directement, sinon il resterait actif jusqu'à la fermeture de tous les onglets.
      .then(() => caches.has(LEGACY_CACHE))
      .then((hasLegacyWorker) => hasLegacyWorker && self.skipWaiting())
  );
  // Sinon, pas de skipWaiting : la page propose la mise à jour et envoie SKIP_WAITING.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name !== CACHE_NAME && name !== VENDOR_CACHE)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
  } else if (url.pathname.startsWith(`${BASE}vendor/`)) {
    event.respondWith(cacheFirst(request, VENDOR_CACHE));
  } else if (url.pathname.startsWith(`${BASE}assets/`)) {
    // Fichiers générés par Vite : nom haché, donc immuables
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

const isHtml = (response) =>
  (response.headers.get('Content-Type') || '').includes('text/html');

// Réseau d'abord pour le HTML, pour toujours servir la dernière version déployée
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    // Seules les routes de la SPA (sans extension) renvoient l'app shell ;
    // une navigation directe vers /offline.html ou /logo.png ne doit pas le remplacer.
    const pathname = new URL(request.url).pathname;
    const isSpaRoute = !/\.[a-z0-9]+$/i.test(pathname);
    if (response.ok && isSpaRoute && isHtml(response)) {
      cache.put(APP_SHELL, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(APP_SHELL))
      || (await cache.match(OFFLINE_PAGE))
      || offlineResponse();
  }
}

async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Un hébergeur SPA peut renvoyer index.html (200) pour un asset supprimé :
    // ne jamais le mettre en cache sous l'URL d'un script ou d'une feuille de style.
    if (response.ok && !isHtml(response)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineResponse();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok && !isHtml(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached || offlineResponse());

  return cached || network;
}

function offlineResponse() {
  return new Response('Ressource indisponible hors ligne', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
