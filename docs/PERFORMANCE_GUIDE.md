# Guide d'Optimisation des Performances - Explorons la Data Science

## Vue d'ensemble

Ce guide décrit les mesures de performance réellement présentes dans « Explorons la Data Science » (anciennement « Data Science Explorer »), et comment les vérifier. Chaque affirmation a été contrôlée dans le code ; les tailles proviennent d'un `npm run build:hylst` réel du 2 octobre 2026 (Vite 7.3). Aucun score Lighthouse ni Core Web Vitals n'a été mesuré : ne pas en déduire de chiffres.

## Mesures en place

### 1. Découpage par route (code splitting)

- `src/App.tsx` : les 35 pages sont chargées avec `React.lazy`, dans un seul `Suspense` dont le `fallback` est `PageLoading` (`components/ui/loading-states.tsx`)
- `src/components/routing/CourseRouter.tsx` : 11 pages de cours en `React.lazy`
- Vite crée un fichier JS par page ; il n'y a pas de `manualChunks` dans `vite.config.ts` (Rollup partage automatiquement le code commun, d'où des fichiers comme `CourseEquation-*.js` ou `useQuiz-*.js`)

```typescript
const MachineLearning = lazy(() => import("./pages/MachineLearning"));

<Suspense fallback={<PageLoadingFallback />}>
  <Routes>{/* ... */}</Routes>
</Suspense>
```

### 2. Taille du build (mesurée)

`npm run build:hylst` (SWC, minification par défaut de Vite) produit 182 fichiers JS dans `dist-hylst/assets/`.

| Élément | Taille | Gzip |
|---|---|---|
| Point d'entrée `index-*.js` (chargé sur toutes les pages) | 358 kB | 118 kB |
| CSS global `index-*.css` | 207 kB | 28,5 kB |
| Chargement initial (HTML exclu) | 565 kB | 146 kB |
| Plus gros chunks partagés | `generateCategoricalChart` (Recharts) 381 kB / 105 kB gzip ; un chunk `index` contenant les données du glossaire 384 kB / 120 kB gzip | |
| Plus grosses pages | `ProgrammingSection` 308 kB (86 kB gzip), `CourseEquation` 270 kB (78 kB gzip), `PythonBasics` 223 kB (41 kB gzip), `MachineLearning` 180 kB (46 kB gzip) | |
| `assets/` au complet (JS, CSS, polices, images) | 5,9 Mo bruts | non mesuré |
| Moteurs d'exécution `vendor/` (Pyodide, sql.js, roues Python) | 39 Mo, téléchargés seulement à la première exécution de code, puis en cache | |

Le chunk Recharts et le chunk `CourseEquation` (KaTeX) ne sont chargés qu'avec les pages qui les utilisent. Ces chiffres varient à chaque changement de code : relancer `npm run build:hylst` plutôt que de les recopier. Le gzip ci-dessus est calculé avec `zlib` sur les fichiers de `dist-hylst/assets/` ; Nginx peut compresser autrement (Brotli par exemple).

Aucune cible de « bundle < 250 KB » n'a de sens pour ce site : le point d'entrée seul dépasse déjà 100 kB gzip. Une piste d'amélioration serait d'analyser l'entrée (`index-*.js`), par exemple avec un visualiseur de bundle (non installé : il n'y a pas de script `build:analyze`).

### 3. Service worker (PWA)

`public/sw.js`, enregistré en production uniquement par `src/main.tsx` :

- **Navigations** : réseau d'abord ; le HTML de l'app est mis en cache et resservi hors ligne (repli sur `offline.html` puis sur une réponse 503)
- **`/assets/*`** (fichiers Vite à nom haché, donc immuables) : cache d'abord
- **Autres ressources de même origine** : stale-while-revalidate
- **Garde-fou** : un HTML n'est jamais mis en cache sous l'URL d'un script ou d'une feuille de style (un hébergeur SPA peut renvoyer `index.html` pour un asset supprimé)
- **Versionnage** : `__BUILD_ID__` est remplacé à chaque build par le plugin `productionHardening` de `vite.config.ts`, ce qui crée un nouveau cache par déploiement et purge les anciens
- **Mise à jour** : le nouveau worker attend `SKIP_WAITING` ; `main.tsx` propose la mise à jour via un toast
- Le sous-chemin de déploiement est déduit de l'emplacement du worker (`/` en local, `/data_science_explorer/` sur hylst.fr)

### 4. Chargement des ressources

- Polices : aucune police distante. Le site utilise les polices système ; la CSP de `vite.config.ts` n'autorise que `font-src 'self' data:`. Une police Inter demandée à Google, jamais utilisée, a été retirée le 1er octobre 2026 : le site n'émet plus aucune requête vers un tiers. Toute nouvelle origine externe doit être ajoutée à la CSP, et il faut d'abord s'interroger sur son utilité
- Images du site : balises `<img>` directes, avec `loading="lazy"` et dimensions sur l'accueil et dans `BigDataSection.tsx`. Le composant `OptimizedImage`, jamais utilisé, a été supprimé le 5 octobre 2026
- Chemins d'assets : toujours via `asset()` (`src/lib/asset.ts`) pour respecter le sous-chemin de déploiement

### 5. Rendu

- `React.memo` / `useMemo` sont utilisés ponctuellement (par exemple `components/blog/BlogList.tsx`, `BlogPostCard.tsx`, `community/ActuSection.tsx`), sans stratégie globale
- Animations d'entrée : `AnimatedEntrance` (`components/ui/animated-entrance.tsx`) ne déclenche l'animation qu'à l'entrée dans le viewport (`IntersectionObserver`)
- Les blocs volumineux des cours sont repliables (`Collapsible`, `CollapsibleSection`), ce qui limite le contenu affiché d'emblée
- Il n'y a ni liste virtualisée, ni composant de mesure de performance, ni `PerformanceObserver` dans le code

### 6. Données et stockage

- Les métadonnées du blog (`blog-posts.json`) sont séparées des corps HTML (`blog-contents.ts`) : les listes n'importent que les métadonnées
- État local via `src/lib/storage.ts` (ne lève jamais d'exception, y compris en navigation privée)
- Aucune requête réseau applicative : l'app n'a pas de backend (CSP `connect-src 'self'`)

## Hébergement statique (hylst.fr)

`npm run build:hylst` (sortie `dist-hylst/`, base `/data_science_explorer/`). Le plugin `staticHosting` écrit un `index.html` par route, un `sitemap.xml` et les liens canoniques, car Nginx n'a pas de repli SPA. Voir `readme_dev.md` (§ 5.11) pour les étapes de livraison.

## Vérifier les performances

```bash
npm run build:hylst   # tailles par fichier (brutes et gzip) affichées dans la console
npm run preview       # servir dist/ localement (après npm run build)
npm run lint
npm run typecheck
npm test
```

Pour un audit réel (Lighthouse, Core Web Vitals), utiliser les outils de Chrome DevTools sur `npm run preview` ; le service worker n'est actif qu'avec un build de production.

## Pistes non réalisées

- Analyse du contenu du point d'entrée (358 kB) et éventuel `manualChunks` pour Recharts / KaTeX
- Chargement différé des images restantes (`loading="lazy"`)
- Suivi automatisé (Lighthouse CI, tests de performance) : aucun outil n'est configuré ; les tests Vitest (`npm test`) couvrent la logique, pas les performances

---

*Guide maintenu avec le dépôt. Dernière révision : 2 octobre 2026 (tailles issues d'un build réel). Le respect de `prefers-reduced-motion` est en place depuis cette date (`src/index.css`).*
