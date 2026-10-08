# Guide d'Optimisation des Performances - Explorons la Data Science

## Vue d'ensemble

Ce guide décrit les mesures de performance réellement présentes dans « Explorons la Data Science » (anciennement « Data Science Explorer »), et comment les vérifier. Chaque affirmation a été contrôlée dans le code ; les tailles proviennent d'un `npm run build:hylst` réel du 2 octobre 2026 (Vite 7.3). Des scores Lighthouse ont été mesurés en local les 6 et 7 octobre 2026 (section « Mesures Lighthouse ») ; aucune mesure de terrain (Core Web Vitals de vrais visiteurs) n'existe.

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

## Mesures Lighthouse (6 et 7 octobre 2026)

Méthode : `npx lighthouse@12`, catégorie performance, profil mobile (ralentissement simulé du réseau et du processeur), sur le build `npm run build:hylst` servi en local avec compression gzip (comme Nginx), profil Chrome vierge à chaque passe. Une passe par route : l'écart d'une passe à l'autre est de l'ordre de 1 à 3 points. Ces chiffres ne sont pas ceux de hylst.fr (réseau et serveur réels).

La colonne « avant » est la mesure des 56 routes du 6 octobre au soir, déjà après l'affichage par morceaux des pages de mathématiques ; la colonne « après » ne concerne que les pages retouchées ensuite (score, puis LCP et temps de blocage). Avant tout ce travail, les probabilités étaient à 46, les statistiques descriptives à 58, le calcul différentiel à 67 et l'algèbre linéaire à 72.

| Route | Score avant | LCP | Blocage | Après |
|---|---|---|---|---|
| `/fundamentals` | 53 | 6,8 s | 932 ms | **75** (3,3 s, 606 ms) |
| `/fundamentals/programming` | 60 | 5,7 s | 660 ms | **77** (3,5 s, 489 ms) |
| `/machine-learning` | 70 | 4,5 s | 519 ms | **77** (3,4 s, 508 ms) |
| `/courses/math-stats/inferential-statistics` | 74 | 4,3 s | 366 ms | **82** (3,8 s, 226 ms) |
| `/fundamentals/math-stats` | 74 | 4,6 s | 381 ms | **75** (3,9 s, 396 ms) |
| `/fundamentals/data-preparation` | 75 | 3,9 s | 503 ms | **79** (3,7 s, 316 ms) |
| `/tools/programming` | 78 | 4,6 s | 249 ms | **90** (3,0 s, 152 ms) |
| `/tools/data-processing` | 79 | 4,5 s | 114 ms | **95** (2,7 s, 61 ms) |
| `/tools/ml-frameworks` | 79 | 4,6 s | 175 ms | **92** (3,0 s, 110 ms) |
| `/courses/machine-learning/transformers` | 81 | 3,0 s | 508 ms | **88** (2,8 s, 272 ms) |
| `/tools/visualization` | 81 | 4,0 s | 227 ms | **92** (3,0 s, 113 ms) |
| `/projects` | 82 | 4,2 s | 128 ms | **81** (4,2 s, 157 ms) |
| `/tools` | 83 | 4,5 s | 103 ms | **93** (2,8 s, 66 ms) |
| `/courses/math-stats/math-intro` | 85 | 3,6 s | 143 ms | **84** (3,6 s, 161 ms) |
| `/courses/dataviz/data-visualization` | 87 | 3,6 s | 26 ms | = |
| `/courses/nlp/natural-language-processing` | 87 | 3,6 s | 35 ms | = |
| `/courses/programming/python-basics` | 87 | 3,6 s | 48 ms | = |
| `/fundamentals/databases` | 89 | 3,0 s | 202 ms | = |
| `/machine-learning/supervised` | 89 | 3,3 s | 181 ms | = |
| `/courses/databases/database-fundamentals` | 90 | 3,6 s | 46 ms | = |
| `/fundamentals/math-stats/integral-calculus` | 90 | 3,3 s | 19 ms | = |
| `/glossary` | 90 | 3,5 s | 35 ms | = |
| `/machine-learning/unsupervised` | 90 | 3,1 s | 108 ms | = |
| `/quiz` | 90 | 3,3 s | 71 ms | = |
| `/quiz/math-stats` | 90 | 3,2 s | 35 ms | = |
| `/quiz/programming` | 90 | 3,2 s | 34 ms | = |
| `/community` | 91 | 3,2 s | 121 ms | = |
| `/courses/machine-learning/supervised-learning` | 91 | 3,4 s | 48 ms | = |
| `/courses/statistics/applied-statistics` | 91 | 3,4 s | 48 ms | = |
| `/machine-learning/reinforcement` | 91 | 3,1 s | 93 ms | = |
| `/quiz/business-intelligence` | 91 | 3,2 s | 25 ms | = |
| `/quiz/data-preparation` | 91 | 3,1 s | 22 ms | = |
| `/quiz/deep-learning` | 91 | 3,2 s | 25 ms | = |
| `/quiz/machine-learning` | 91 | 3,2 s | 25 ms | = |
| `/resources` | 91 | 3,0 s | 123 ms | = |
| `/blog/data-analysis-journey` | 92 | 3,0 s | 73 ms | = |
| `/fundamentals/math-stats/differential-calculus` | 92 | 3,0 s | 123 ms | = |
| `/quiz/data-visualization` | 92 | 3,0 s | 18 ms | = |
| `/blog/correlation-causation` | 93 | 2,9 s | 49 ms | = |
| `/blog/data-cleaning-nightmare` | 93 | 2,8 s | 72 ms | = |
| `/blog/data-visualization-story` | 93 | 2,9 s | 52 ms | = |
| `/courses/machine-learning/ml-models-guide` | 93 | 2,8 s | 98 ms | = |
| `/fundamentals/math-stats/probability-theory` | 93 | 2,8 s | 71 ms | = |
| `/introduction` | 93 | 2,9 s | 142 ms | = |
| `/quiz/big-data` | 93 | 3,2 s | 55 ms | = |
| `/` | 94 | 2,8 s | 31 ms | = |
| `/about` | 94 | 2,7 s | 40 ms | = |
| `/blog` | 94 | 2,9 s | 73 ms | = |
| `/blog/data-science-jobs` | 94 | 2,8 s | 49 ms | = |
| `/contact` | 95 | 2,6 s | 20 ms | = |
| `/fundamentals/math-stats/descriptive-statistics` | 95 | 2,8 s | 27 ms | = |
| `/fundamentals/math-stats/linear-algebra` | 95 | 2,7 s | 39 ms | = |
| `/courses` | 96 | 2,7 s | 40 ms | = |
| `/fundamentals/math-stats/advanced-statistics` | 96 | 2,7 s | 44 ms | = |
| `/privacy` | 96 | 2,7 s | 28 ms | = |
| `/terms` | 96 | 2,4 s | 30 ms | = |

Ce qui a compté, dans l'ordre des gains : afficher le titre et la description des bandeaux sans animation retardée ; ne charger le contenu lourd (graphiques Recharts, formules KaTeX, définitions du glossaire) qu'après le bandeau (`LazyBlock`, `ProgressiveSections`) ; dessiner les graphiques à l'approche de l'écran (`DeferredResponsiveContainer`). `content-visibility: auto` a été écarté : il casse la restauration de la position au retour.

Pour un audit réel (Lighthouse, Core Web Vitals), utiliser les outils de Chrome DevTools sur `npm run preview` ; le service worker n'est actif qu'avec un build de production.

## Pistes non réalisées

- Analyse du contenu du point d'entrée (358 kB) et éventuel `manualChunks` pour Recharts / KaTeX
- Chargement différé des images restantes (`loading="lazy"`)
- Suivi automatisé (Lighthouse CI, tests de performance) : aucun outil n'est configuré ; les tests Vitest (`npm test`) couvrent la logique, pas les performances

---

*Guide maintenu avec le dépôt. Dernière révision : 2 octobre 2026 (tailles issues d'un build réel). Le respect de `prefers-reduced-motion` est en place depuis cette date (`src/index.css`).*
