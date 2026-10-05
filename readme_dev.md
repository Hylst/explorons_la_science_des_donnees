# Guide du développeur

Ce guide s'adresse à toute personne qui travaille sur le code de « Explorons la Data Science » : installer le projet, lancer les contrôles, ajouter du contenu, livrer sur hylst.fr. Chaque chemin, commande et nombre ci-dessous a été relevé dans le dépôt (branche `audit/securite-pwa-routage`, octobre 2026).

Documents voisins :

- [structure.md](structure.md) : arborescence commentée et flux importants (routage, build statique, exécution de code, PWA, thème, stockage).
- `features.md` : état des fonctionnalités par section ; `docs/SOURCES.md` : registre des chiffres externes.
- `CHANGELOG.md` : historique.

## 1. Prérequis

| Outil | Version | Origine de l'information |
| --- | --- | --- |
| Node.js | 22.13 ou plus récent en 22.x, 24.x, ou 26 et plus. Version de référence de ce guide : 24.14.1 | Le champ `engines` de `package.json` déclare `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0`, l'intersection des contraintes de Vitest 5.0.3 (`^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`), jsdom 29.1.1 (`^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0`) et Vite 7.3.6 (`^20.19.0 \|\| >=22.12.0`). Node 22.12 satisfait Vitest et Vite mais pas jsdom |
| npm | Celui fourni avec Node (11.11.0 avec la version de référence) | `package-lock.json` est suivi par git |
| Git | Une version récente | Dépôt git |
| Réseau | Nécessaire au premier `npm run dev` ou `npm run build` | `scripts/sync-runtimes.mjs` télécharge les roues Python depuis `https://cdn.jsdelivr.net/pyodide/v<version>/full/` (empreintes SHA-256 vérifiées), puis les garde dans `.cache/pyodide-wheels` |
| Espace disque | Environ 39 Mo pour `public/vendor` et 26 Mo pour `.cache` (mesurés) en plus de `node_modules` | `du -sh public/vendor .cache` |
| Navigateur | Récent (WebAssembly, Web Workers de type module) pour tester l'exécution de code | `src/lib/runner` |

Pas de variable d'environnement à définir : l'application n'appelle aucun serveur, et `scripts/verify-dist.mjs` refuse tout build qui contiendrait une référence Supabase ou une variable `VITE_*`.

## 2. Installation et premier lancement

Depuis la racine du dépôt :

```bash
npm install
npm run dev
```

- `npm run dev` exécute d'abord `scripts/sync-runtimes.mjs` (hook `predev`) : le script copie Pyodide et sql.js depuis `node_modules` vers `public/vendor/pyodide-<version>/` et `public/vendor/sql-js-<version>/`, télécharge les roues numpy, pandas, scikit-learn et leurs dépendances, puis écrit `public/vendor/NOTICE.txt`. Ces dossiers et `.cache/` sont ignorés par git. Les lancements suivants sont rapides et fonctionnent hors ligne tant que `.cache/` existe.
- Le serveur écoute sur le port 8080 (`vite.config.ts`, hôte `::`). Si le port est occupé, Vite en choisit un autre : lire l'adresse affichée dans le terminal.
- En développement, le service worker n'est pas enregistré (`src/main.tsx` désinscrit même les anciens) et la Content-Security-Policy n'est pas injectée : ces deux éléments n'existent que dans un build. Pour les tester, construire puis lancer `npm run preview`.
- `npm test`, `npm run lint` et `npm run typecheck` ne passent pas par `sync-runtimes`. Les tests ont tout de même besoin de `node_modules` : `vitest.config.ts` lit les versions de `pyodide` et `sql.js` dans leurs `package.json`.

## 3. Commandes npm

Source : champ `scripts` de `package.json`.

| Commande | Ce qu'elle lance | Remarques |
| --- | --- | --- |
| `npm run dev` | `vite` | Précédée de `sync-runtimes`. Port 8080 |
| `npm run build` | `vite build` | Précédée de `sync-runtimes`. Sortie dans `dist/`, base `/`. **Ne vérifie pas les types** |
| `npm run build:dev` | `vite build --mode development` | Précédée de `sync-runtimes`. Même sortie que `build`, en mode `development` |
| `npm run build:hylst` | `vite build --mode hylst --outDir dist-hylst` | Précédée de `sync-runtimes`, suivie de `verify-dist` sur `dist-hylst`. Base `/data_science_explorer/`, une page HTML par route, `sitemap.xml`, `404.html` |
| `npm run preview` | `vite preview` | Sert le dernier build (dossier `dist/` par défaut) |
| `npm run lint` | `eslint .` | Zéro erreur attendue : `no-unused-vars` est une erreur. Ignore `dist` et `dist-hylst` |
| `npm run typecheck` | `tsc -p tsconfig.app.json --noEmit` | Mode strict. Ne couvre que `src/` |
| `npm test` | `vitest run` | Une exécution, tous les tests de `src/` |
| `npm run test:smoke` | `vitest run --config vitest.smoke.config.ts` | Test de fumée : affiche chacune des 56 routes canoniques et active chaque onglet dans jsdom (environ 20 s). Il échoue si une page déclenche l'ErrorBoundary. Exclu de `npm test` parce qu'il est lent |
| `npm run test:watch` | `vitest` | Mode interactif. Pour un seul fichier : `npx vitest run src/config/page-meta.test.ts` |
| `npm run runtimes:sync` | `node scripts/sync-runtimes.mjs` | Recrée `public/vendor`. Réseau requis la première fois |
| `npm run news:refresh` | `node scripts/refresh-news.mjs` | Réseau requis. Réécrit `src/data/rss-articles.json` depuis `src/data/rss-sources.json` ; un flux en échec est ignoré, et si aucun ne répond le fichier reste intact |
| `npm run verify:hylst` | `node scripts/verify-dist.mjs dist-hylst` | Contrôle d'un build hylst déjà fait (aussi lancé automatiquement par `build:hylst`) |
| `npm run verify:dist` | `node scripts/verify-dist.mjs dist` | Écrit pour le build hylst : sur un `dist/` ordinaire il échoue (chemins absolus hors base, canonical et `sitemap.xml` absents). Ce n'est pas une anomalie du code |

Avant de livrer, dans cet ordre : `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`, puis `npm run build:hylst` (voir la section 5.11).

## 4. Organisation des tests

**Outil.** Vitest 5 avec jsdom, configuré dans `vitest.config.ts` : fichiers `src/**/*.test.{ts,tsx}`, environnement `jsdom`, `restoreMocks: true`, alias `@` vers `src/` et constantes `__PYODIDE_VERSION__` et `__SQLJS_VERSION__` définies comme dans `vite.config.ts`. Aucune bibliothèque de test de composants n'est installée : les composants se rendent avec `react-dom/client` et `act` (exemple : `CorrelationHeatmap.test.tsx`).

**Emplacement.** Un test se place à côté du code testé, avec le suffixe `.test.ts` ou `.test.tsx`. Il n'y a pas de dossier `__tests__`. Les tests ne sont pas livrés : le build ne les inclut pas, et `brand.test.ts` les exclut de son balayage.

**État mesuré** : `npm test` exécute 22 fichiers et 404 tests, tous réussis, en environ 4 secondes (Vitest 5.0.3, Node 24.14.1). Ces nombres évoluent avec le code : le résultat à retenir est zéro échec avant toute livraison.

**Inventaire** (13 fichiers) :

| Fichier | Ce qu'il garantit |
| --- | --- |
| `src/config/page-meta.test.ts` | Lit le code source (`scripts/collect-routes.ts`) : chaque route canonique a un titre et une description ; longueurs (titre 20 à 38 caractères sans le nom du site, description 110 à 160) ; unicité ; absence de tiret cadratin ou demi-cadratin ; `PAGE_META` sans route orpheline ; cohérence de `LEGACY_REDIRECTS` (cible existante, pas de chaîne, pas de doublon, pas de page réelle masquée) |
| `src/config/brand.test.ts` | L'ancien nom « Data Science Explorer » n'apparaît plus (exceptions listées dans le test) ; `index.html`, `public/manifest.json` et `public/offline.html` portent `SITE_NAME` ; les modèles de page 404 et de redirection de `vite.config.ts` utilisent `SITE_NAME` ; licence identique dans `package.json`, `site.ts` et `LICENSE` ; sous-chemin `/data_science_explorer/` inchangé |
| `src/config/illustrations.test.ts` | Les six SVG animés de `public/svg/cards/` existent, sont bien formés, n'exécutent aucun script, n'appellent aucun tiers, coupent leurs animations sous `prefers-reduced-motion`, sont tous utilisés par l'accueil (images décoratives avec dimensions) ; plus aucune photographie livrée |
| `src/config/theme.test.ts` | `DEFAULT_THEME` de `public/theme-init.js` égal à `defaultTheme` de `<ThemeProvider>` dans `App.tsx` ; même clé de stockage (`THEME_STORAGE_KEY`) ; mêmes valeurs acceptées, mêmes classes `light` et `dark`, même requête média ; `theme-init.js` chargé avant `src/main.tsx` dans `index.html` |
| `src/lib/storage.test.ts` | Le module ne lève jamais d'exception (stockage bloqué, JSON corrompu), validateurs, et deux modules n'utilisent jamais la même clé de stockage (lecture des constantes `const XXX_KEY = '...'`) |
| `src/lib/quiz-storage.test.ts` | Enregistrement des tentatives, données corrompues, statistiques, séries de jours, succès, progression |
| `src/lib/runner/worker-client.test.ts` | File d'exécution, délai (décompte à partir du message `started`), arrêt du worker, échec de chargement, avec un faux `Worker` |
| `src/lib/runner/index.test.ts` | `isRunnable` et délais par langage |
| `src/lib/sanitize.test.ts` | `sanitizeHtml` retire les scripts et conserve le contenu sûr ; liens externes |
| `src/lib/sample-datasets.test.ts` | Générateurs à graine fixe, jeux « ventes » et « patients », statistiques calculées |
| `src/lib/format-duration.test.ts` | `formatMinutes` |
| `src/lib/contrast.test.ts` | `contrastRatio` (rapport WCAG) et `readableTextColor` (texte lisible sur une pastille colorée) |
| `src/data/projects.test.ts` | Données des projets et filtres |
| `src/components/fundamentals/data-preparation/CorrelationHeatmap.test.tsx` | La matrice de corrélation affichée est calculée (coefficient de Pearson) |

**Tests garde-fous qui lisent le code source.** `page-meta.test.ts`, `brand.test.ts`, `theme.test.ts` et `storage.test.ts` analysent des fichiers avec des expressions régulières. Si l'un d'eux échoue après une modification qui semble anodine, le message nomme la route, le fichier ou la ligne en cause (`brand.test.ts` donne `fichier:ligne`). Ne pas contourner le test : soit corriger le code, soit, si le format du code a vraiment changé, adapter l'expression régulière du test et celle de `scripts/collect-routes.ts` ensemble. Ces fichiers normalisent les fins de ligne (`\r\n` en `\n`) avant l'analyse, donc un dépôt en CRLF sous Windows ne pose pas de problème.

**Ce qui n'est pas testé automatiquement** : le rendu visuel, les débordements horizontaux (à vérifier à la main à 390, 768, 1024 et 1280 px), l'exécution réelle de Pyodide et de SQLite (les tests du runner utilisent un faux `Worker`), le service worker et les logos et icônes binaires.

## 5. Procédures pas à pas

### 5.1 Ajouter une page (route statique)

1. Créer la page dans `src/pages/` (ou un sous-dossier) avec un export par défaut. Prendre une page existante comme modèle (par exemple `src/pages/About.tsx`, qui utilise `Layout`) ; `ContentLayout` ajoute une barre latérale.
2. Dans `src/App.tsx`, ajouter l'import différé avec les autres :

   ```tsx
   const MaPage = lazy(() => import("./pages/MaPage"));
   ```

   puis la route, avant `<Route path="*" ...>` :

   ```tsx
   <Route path="/ma-page" element={<MaPage />} />
   ```

   Le chemin doit être une chaîne littérale entre guillemets doubles, commencer par `/`, et ne contenir ni `*` ni `:`. La raison : `scripts/collect-routes.ts` lit `App.tsx` par expression régulière (`path="(\/[^"*:]*)"`) pour établir la liste des pages à générer et le sitemap. Un chemin construit dynamiquement ou entre apostrophes serait ignoré.
3. Dans `src/config/page-meta.ts`, ajouter l'entrée de la route. **Sans elle, le test et le build échouent** :

   ```ts
   "/ma-page": { title: "Titre de 20 à 38 caractères", description: "Description unique de 110 à 160 caractères ..." },
   ```

   Règles vérifiées par `page-meta.test.ts` : le titre s'écrit sans le nom du site (`fullTitle()` ajoute « - Explorons la Data Science ») et ne le contient pas ; titre et description sont uniques parmi toutes les routes ; ni tiret cadratin ni demi-cadratin ; pas d'espace en début ou en fin, pas d'espaces doublés. Les entrées existantes sont rangées par ordre alphabétique des routes.
4. Rendre la page atteignable : lien dans `src/components/layout/Navbar.tsx` (tableau `navItems`), dans `Footer.tsx` ou dans une page parente. Toujours viser l'URL canonique.
5. Vérifier : `npm test` (le test « chaque route canonique a un titre et une description non vides » doit passer), `npm run typecheck`, `npm run lint`, puis la page dans `npm run dev` à 390, 768, 1024 et 1280 px. Une page ne doit pas appeler `window.scrollTo` au montage : `ScrollManager` s'en charge.

Sans l'étape 3, `npm run build:hylst` s'arrête avec : `static-hosting : routes sans titre ni description (à ajouter dans src/config/page-meta.ts) : /ma-page`.

Une route à paramètre (`/exemple/:id`) n'est pas détectée par la regex : pour en faire une famille de pages statiques, il faut aussi étendre `collectRoutes` et `collectDynamicMeta` dans `scripts/collect-routes.ts` (c'est ce que font déjà le blog et les quiz) et adapter `page-meta.test.ts`.

### 5.2 Ajouter un cours (`/courses/<catégorie>/<cours>`)

1. Créer la page dans `src/pages/courses/<catégorie>/<NomDuCours>.tsx`. Modèles : `statistics/AppliedStatistics.tsx` (cours à plan de modules : `CourseLayout`, `CourseHeroTemplate`, `CourseModuleTemplate`, `CourseItemActions`) ou `programming/PythonBasics.tsx` (modules détaillés). Les briques communes sont dans `src/components/courses/`.
2. Dans `src/components/routing/CourseRouter.tsx`, ajouter l'import différé et la route, avant `path="*"` :

   ```tsx
   const MonCours = React.lazy(() => import('../../pages/courses/ma-categorie/MonCours'));
   // ...
   <Route path="ma-categorie/mon-cours" element={<MonCours />} />
   ```

   Le chemin est relatif (sans `/courses/`), entre guillemets doubles, commence par une lettre minuscule et ne contient ni `*` ni `:` : `collect-routes.ts` lit `CourseRouter.tsx` avec `path="([a-z][^"*:]*)"` et préfixe `/courses/`. Un cours inconnu affiche `NotFound`.
3. Ajouter `"/courses/ma-categorie/mon-cours"` dans `src/config/page-meta.ts` (mêmes règles qu'en 5.1).
4. Pour que le cours figure au catalogue et dans les cartes de l'accueil, ajouter une entrée dans `src/data/course-catalog.ts` (`COURSE_CATALOG`) : catégorie, titre, description, `href`, `status` (`"redige"` si les leçons sont écrites, `"plan"` si le cours n'est qu'une liste de modules : la carte porte alors le badge « Plan du cours »). Niveau, durée et nombre de modules ne se renseignent que s'ils figurent sur la page du cours, jamais d'après une estimation. Pour le mettre en avant sur l'accueil, ajouter son identifiant à `FEATURED_COURSE_IDS` et une photo dans `FeaturedCourses.tsx`.
5. Si le cours suit la progression de l'apprenant, donner à `CourseItemActions` un `courseId` unique (ex. `applied-statistics`) : les données sont enregistrées sous la clé `course-progress-<courseId>` par `src/hooks/use-course-progress.ts`.
6. Si une ancienne URL du cours doit continuer à fonctionner, voir 5.3.

### 5.3 Ajouter une redirection (ancienne URL vers URL canonique)

Dans `src/config/routes.ts`, ajouter une entrée à `LEGACY_REDIRECTS`, avec des apostrophes simples :

```ts
{ from: '/ancienne-url', to: '/url-canonique' },
```

- `App.tsx` rend chaque entrée en `<Navigate replace>` ; le build hylst écrit en plus une page HTML de redirection (`<meta http-equiv="refresh">` et `canonical`) et retire l'ancienne URL du sitemap.
- `to` peut porter une ancre (`'/community#events'`) ; `from` ne doit contenir ni `?` ni `#`, ni slash final.
- `page-meta.test.ts` refuse : une cible qui n'est pas une route canonique, une chaîne de redirections, un `from` en double, une ancienne URL qui est aussi une vraie page (elle la masquerait). Une route statique l'emporte sur `/courses/*`, donc une ancienne URL de cours peut être déclarée ici.
- Lorsqu'une page change d'adresse, ne pas laisser l'ancienne route dans `App.tsx` ou `CourseRouter.tsx` : la déplacer, puis déclarer la redirection.

### 5.4 Ajouter un article de blog

1. Dans `src/data/blog-posts.json`, ajouter un objet : `id` (identifiant en minuscules et tirets, il devient l'URL `/blog/<id>`), `title`, `excerpt`, `author`, `date` (texte affiché, par exemple `"12 avril 2024"`), `readTime` (par exemple `"15 min"`), `categories` (liste de textes) et, facultatif, `"featured": true` (mise en avant sur l'accueil et dans la section Communauté).
2. Dans `src/data/blog-contents.ts`, ajouter dans l'objet `blogContents` la clé du même `id` avec le corps HTML dans une chaîne à gabarit (les articles existants commencent par un `<h1>`). Sans corps, `blog-articles.ts` fournit une chaîne vide.
3. Rien d'autre à déclarer : la route `/blog/:id` existe déjà dans `App.tsx`, `collectRoutes` lit les `id` de `blog-posts.json` pour générer la page et le sitemap, et `collectDynamicMeta` prend `title` (suivi de « - Explorons la Data Science ») et `excerpt` comme titre et description. Ces deux textes doivent rester uniques et sans tiret cadratin ou demi-cadratin (testé).
4. Le HTML passe par `sanitizeHtml` (DOMPurify) et se met en forme avec la classe `rich-text`. Ne pas utiliser `prose`. Ne pas ajouter de script ni d'image distante.
5. Les composants qui ne font que lister (`LatestArticles` sur l'accueil, `BlogSection` dans Communauté) importent `src/data/blog-posts.json` (métadonnées seules). `BlogList`, `BlogPost` et la page `Blog` importent `blogPosts` depuis `@/data/blog-articles`, qui joint métadonnées et corps. L'ordre d'affichage de la liste du blog est celui du fichier JSON.
6. Les favoris sont locaux (`blog-favorites-v1`) : aucune donnée à prévoir.

### 5.5 Ajouter une catégorie de quiz (ou une question)

Tout se passe dans `src/data/quizData.ts`.

1. Écrire le tableau de questions avant `export const quizCategories` :

   ```ts
   const maCategorieQuestions: QuizQuestion[] = [
     {
       id: 'maCategorie_001',
       question: '...',
       options: ['...', '...', '...', '...'],
       correctAnswer: 1,            // indice, à partir de 0, dans options
       explanation: '...',
       difficulty: 'Débutant',      // 'Débutant' | 'Intermédiaire' | 'Avancé'
       topic: '...',
       points: 10
     },
   ];
   ```

   Une tentative tire 10 questions au hasard (`getRandomQuestions(categoryId, 10)` dans `src/pages/QuizCategory.tsx`) : prévoir au moins 10 questions.
2. Ajouter la catégorie dans `quizCategories`, **avec l'indentation et l'ordre des trois premières lignes d'origine**, car `scripts/collect-routes.ts` les lit par expression régulière :

   ```ts
     {
       id: 'ma-categorie',
       title: 'Titre',
       description: 'Description sans point final',
       icon: 'Code',
       color: 'green',
       difficulty: 'Débutant',
       estimatedTime: 15,
       topics: ['...', '...'],
       questions: maCategorieQuestions
     },
   ```

   `id`, `title` et `description` doivent être sur trois lignes consécutives, entre apostrophes simples (échapper une apostrophe par `\'`), `id` en minuscules, chiffres et tirets, avec 4 espaces d'indentation. La route `/quiz/ma-categorie`, la page HTML, l'entrée du sitemap et les métadonnées (titre « Quiz : <title> », description « Quiz de data science : <description>. ») sont alors générés seuls. Si le format n'est pas respecté, la catégorie n'a ni route ni métadonnées et les tests de `page-meta.test.ts` échouent.
3. Icône : les composants choisissent l'icône selon l'identifiant de la catégorie, et non d'après le champ `icon`. Ajouter l'identifiant à `iconMap` dans `src/components/quiz/QuizCategoriesSection.tsx` (repli : `Brain`) et, si besoin, à `getCategoryIcon` dans `src/components/quiz/QuizStatsSection.tsx` (repli : `Target`). Constat : `iconMap` est indexé par `mathematics` alors que l'identifiant réel est `math-stats`, donc cette catégorie reçoit l'icône de repli.
4. Les statistiques, l'historique et les séries sont calculés à partir des tentatives réelles (`src/lib/quiz-storage.ts`) : ne jamais afficher de score fictif.

### 5.6 Ajouter un terme de glossaire

La page `/glossary` lit `glossaryTerms`, agrégé par `src/data/glossary/index.ts` à partir de huit fichiers : `fundamentals.ts`, `tools.ts`, `statistics.ts`, `machine-learning.ts`, `deep-learning.ts`, `nlp.ts`, `mlops.ts`, `evaluation.ts` (179 entrées au moment de la rédaction, comptées en important `index.ts` ; un simple comptage de lignes `term:` donnerait un nombre plus bas). Particularité : `tools.ts` ne contient pas d'entrées écrites à la main, il les dérive des définitions de `src/components/fundamentals/definitions/` (`programming-definitions.ts` et `dataviz-definitions.ts`).

1. Choisir le fichier du domaine et ajouter un objet `GlossaryEntry` (type dans `src/data/glossary/types.ts`) :

   ```ts
   {
     term: "Nom du terme",
     description: "Explication ...",
     category: "statistiques",
     icon: "BarChart3"
   },
   ```

   `category` appartient à l'union `GlossaryCategory` de `types.ts`. `icon` est un nom d'icône lucide-react connu de `src/components/glossary/GlossaryCard.tsx` (sinon l'icône `BookOpen` s'affiche). Champs facultatifs : `shortDefinition`, `longDefinition`, `examples`, `relatedTerms`, `source`, `sourceUrl`, `domain`, `level`, `synonyms`, `englishTerm`.
2. Un nouveau fichier de domaine doit être importé, ajouté au tableau `glossaryTerms` et à la liste d'exports de `index.ts`. Une nouvelle catégorie s'ajoute à `GlossaryCategory`, à `CATEGORY_INFO` (`types.ts`) et à `getCategoryDisplayName` dans `src/pages/Glossary.tsx` (la catégorie `evaluation` n'y figure pas : son identifiant brut s'affiche).
3. Ne rien inventer : toute définition chiffrée ou datée cite sa source.
4. Pour un terme survolable dans le texte d'un cours, c'est un autre mécanisme : le composant `GlossaryTerm` (`src/components/ui/glossary-term.tsx`) reçoit un objet `GlossaryTermDefinition` (`term`, `shortDefinition`, `longDefinition`, ...). Les définitions vivent dans `src/data/glossary/ml-definitions.ts` (28 entrées indexées par identifiant, utilisées par les sections de Machine Learning), `src/data/data-preparation-enhanced-definitions.ts` (préparation des données) et `src/components/fundamentals/definitions/` (programmation, dataviz, statistiques, traitement des données). Ajouter l'objet au fichier qui correspond au cours, puis le passer à `GlossaryTerm`. Attention : `src/components/fundamentals/definitions/data-preparation-enhanced-definitions.ts` porte le même nom que celui de `src/data/` mais n'est importé nulle part ; c'est celui de `src/data/` qui est utilisé.

### 5.7 Citer une source pour un chiffre

Tout chiffre qui décrit le monde réel (enquête, prix, statistique de marché, salaire) cite son origine sous le chiffre, avec `src/components/ui/source-note.tsx` :

```tsx
import { SourceNote } from "@/components/ui/source-note";

<SourceNote
  consulted="1er octobre 2026"
  sources={[{ label: "Stack Overflow Developer Survey 2024", href: "https://survey.stackoverflow.co/2024/" }]}
/>
```

- `sources` : liste de `{ label, href? }`. Sans `href`, la source est citée sans lien. Le pluriel « Sources » est automatique. Les liens s'ouvrent dans un nouvel onglet avec `rel="noopener noreferrer"`.
- `consulted` : date déjà mise en forme en français, qui doit être celle d'une vérification réelle de la page citée.
- Ouvrir la page citée et y retrouver le chiffre exact avant de l'écrire. Un chiffre qu'on ne peut pas sourcer est supprimé ou remplacé par une formulation qualitative.
- `SourceNote` est utilisé aujourd'hui dans 8 composants (liste dans `structure.md`). Le registre `docs/SOURCES.md` recense chaque chiffre externe, sa source, la date de consultation et son niveau de vérification (« page lue », « extrait de recherche » ou « non vérifié ») : y ajouter une ligne pour tout nouveau chiffre, avec le niveau réellement atteint.
- Pour les chiffres calculés par le site lui-même (statistiques sur les jeux d'exemple, quiz, progression), aucune citation : ils viennent de `src/lib/sample-datasets.ts` ou du stockage local et sont réellement calculés.

### 5.8 Ajouter un paquet Python au runner

L'éditeur exécute Python avec Pyodide ; seuls les paquets embarqués sont disponibles (numpy, pandas, scikit-learn et leurs dépendances). Matplotlib n'est pas fourni.

1. Vérifier que le paquet existe dans `node_modules/pyodide/pyodide-lock.json` : sinon `sync-runtimes.mjs` s'arrête avec `Paquet inconnu dans pyodide-lock.json`.
2. Ajouter son nom au tableau `PYTHON_PACKAGES` de `scripts/sync-runtimes.mjs`. Les dépendances déclarées dans le verrou sont ajoutées automatiquement.
3. Relever la licence de chaque nouvelle roue (fichier `METADATA`) et l'ajouter à `PACKAGE_LICENSES` dans le même script, sous la forme `nom: ["licence", "adresse du projet"]`, **pour le paquet et pour chacune de ses nouvelles dépendances**. Le script refuse un paquet absent de la liste (`Licence à vérifier ... puis à ajouter à PACKAGE_LICENSES`). Vérifier la compatibilité avec la licence du site (AGPL-3.0-or-later) ; les composants tiers gardent leur licence et sont recensés dans `public/vendor/NOTICE.txt`, régénéré par le script (ne pas l'éditer).
4. Ajouter le même nom à `PROVIDED_PACKAGES` dans `src/lib/runner/python.worker.ts` (liste chargée quand le code utilise `importlib.import_module` ou `__import__`).
5. Lancer `npm run runtimes:sync`, puis mesurer le poids : `du -sh public/vendor` (39 Mo avec les paquets actuels). Chaque Mo ajouté est téléchargé par les visiteurs qui exécutent du code.
6. Mettre à jour les textes qui énumèrent les paquets : `src/components/fundamentals/programming/CodeEditor.tsx` (texte d'aide), `src/pages/TermsOfService.tsx` (composants tiers), `README.md`.
7. Tester dans l'éditeur de `/fundamentals/programming` : `import <module>` puis un calcul réel.
8. Point d'attention, non testé : `public/sw.js` sert `vendor/` en « cache d'abord » dans un cache nommé `ds-explorer-vendor-v1`, dont le nom ne change pas quand on ajoute un paquet sans changer la version de Pyodide (les dossiers portent le numéro de version de Pyodide, pas la liste des paquets). Un visiteur qui a déjà téléchargé les moteurs risque de garder l'ancien `pyodide-lock.json`. Dans ce cas, incrémenter `VENDOR_CACHE` dans `public/sw.js` (le worker supprime les autres caches à l'activation).

Pour alléger au contraire le site, retirer un nom de `PYTHON_PACKAGES` et de `PROVIDED_PACKAGES` : le module retiré lèvera `ModuleNotFoundError` dans l'éditeur.

### 5.9 Changer l'identité du site

`src/config/site.ts` est la source unique pour le code de l'application et du build : `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_ORIGIN`, `SITE_BASE`, `SITE_URL`, `AUTHOR_NAME`, `AUTHOR_CREDIT`, `PLATFORM_URL`, `PLATFORM_LEGAL_URL`, `LEGAL_UPDATED`, `LICENSE_SPDX`, `LICENSE_NAME`, `LICENSE_FILE`, `NOTICE_FILE`, `SOURCE_URL`. Le fichier ne doit contenir que des imports relatifs et aucune API propre à Vite (il est exécuté par Node au build). Titres de pages, page 404, pages de redirection, sitemap, pied de page et pages légales en dérivent.

Quelques fichiers ne peuvent pas importer `site.ts` et répètent des valeurs ; `src/config/brand.test.ts` échoue s'ils divergent :

- `index.html` : `<title>` (égal à `HOME_TITLE`), `og:site_name`, `og:title`, `apple-mobile-web-app-title`, `description` (égale à `SITE_DESCRIPTION`) ;
- `public/manifest.json` : `name` et `short_name` ;
- `public/offline.html` : `<title>` ;
- `package.json` (champ `license`) et première ligne de `LICENSE` (`SPDX-License-Identifier: ...`).

Autres endroits qui citent le nom ou le sous-chemin sans être testés : le commentaire de `public/sw.js`, `scripts/verify-dist.mjs` (constantes `BASE` et `CANONICAL`), le nom du fichier `public/svg/data_science_explorer_apprentissage.svg`, le champ `name` de `package.json` et les documents du dépôt.

Identifiants volontairement **non renommés**, car les changer casserait des liens ou ferait perdre des données aux visiteurs : le sous-chemin `/data_science_explorer/` (épinglé par `brand.test.ts`), le préfixe de cache `ds-explorer-` du service worker et les clés `localStorage`, dont `ds-explorer-theme`.

Après un changement : `npm test` (il liste chaque occurrence fautive), puis `npm run build:hylst`.

### 5.10 Modifier le thème (clair, sombre, système)

- Le thème par défaut est écrit à deux endroits qui doivent rester égaux : `DEFAULT_THEME` dans `public/theme-init.js` et `defaultTheme` de `<ThemeProvider>` dans `src/App.tsx` (actuellement `light`). `theme.test.ts` le vérifie.
- La clé de stockage `ds-explorer-theme` est définie dans `src/hooks/use-theme.ts` (`THEME_STORAGE_KEY`) et relue par `theme-init.js`.
- Les classes de couleur fixes des cours (`bg-white`, `bg-blue-50`, `text-gray-700`, ...) sont adaptées au mode sombre automatiquement par `tailwind/dark-palette.ts` ; les classes construites à l'exécution (`bg-${couleur}-50`) doivent figurer dans `tailwind/dynamic-colors.ts` ; les couleurs écrites en dur (`style={{ ... }}`, hexadécimal dans un graphique) ne sont pas adaptées.

### 5.11 Livrer sur hylst.fr

La plateforme sert des fichiers statiques derrière Nginx, sans repli vers `index.html`. Lire d'abord `<notes de deploiement de la plateforme>` (protocole de la plateforme de l'auteur, non publié) ; les étapes ci-dessous valent pour tout hébergeur de fichiers statiques.

1. Contrôles : `npm run lint`, `npm run typecheck`, `npm test`. Facultatif : `npm run news:refresh` (instantané daté des actualités de la page Communauté, réseau requis).
2. `npm run build:hylst`. Le build lance `sync-runtimes`, construit dans `dist-hylst/` (ignoré par git), puis `verify-dist.mjs` contrôle le résultat et fait échouer la commande s'il trouve un secret, une référence Supabase ou `VITE_*`, un chemin absolu hors base dans `index.html`, ou s'il manque le canonical ou `sitemap.xml`. À la date de rédaction, la sortie compte 84 pages HTML (56 routes canoniques et 28 anciennes URL). Dans `vite.config.ts`, le plugin `staticHosting` écrit ces pages, `sitemap.xml`, `404.html` et la ligne `Sitemap:` de `robots.txt` ; le plugin `productionHardening` (tous les builds) injecte la CSP, copie `LICENSE` vers `LICENSE.txt` et versionne le cache de `sw.js`.
3. Copier le **contenu** de `dist-hylst/` dans le dossier de la plateforme `<dossier de la plateforme>`, après avoir vidé les anciens fichiers hachés de son dossier `assets\` : remplacer l'ensemble d'un coup, sinon des fichiers orphelins subsistent. Ne jamais copier `node_modules`, `.env*` ni `*.zip`.
4. Ne rien faire d'autre dans le dépôt cible : ni `git` (pas même `git status`, qui réécrit l'index et peut gêner l'agent de la plateforme), ni édition d'un autre fichier, ni accès au serveur VPS ou à l'hébergeur (consigne de l'auteur du 4 octobre 2026). La carte du hub, le contenu de la plateforme, le `robots.txt` racine et son `changelog.md` sont mis à jour par l'auteur et l'agent de la plateforme. Vérifier la copie par comparaison SHA-256 entre `dist-hylst/` et le dossier de destination.
5. **Ne pas pousser sans accord explicite** : un `git push` sur `main` du dépôt cible redéploie tout le site.
6. Pas de tiret cadratin ni demi-cadratin dans les ajouts au dépôt cible. Dans Git Bash, `git diff | grep "^+" | grep -P "\x{2014}|\x{2013}"` ne doit rien renvoyer (les deux caractères sont désignés par leur code, le motif lui-même n'en contient aucun).
7. Côté Nginx : `error_page 404 /data_science_explorer/404.html;` (la page doit être servie avec le statut 404, pas 200) ; fichiers `.wasm` servis en `application/wasm` ; fichiers `.js` de `vendor/` servis comme JavaScript (les modules Pyodide sont déjà renommés en `.js` pour cela). Si le serveur envoie une Content-Security-Policy en en-tête, elle s'applique aussi aux workers : prévoir `script-src 'self' 'wasm-unsafe-eval'`, `worker-src 'self' blob:`, `connect-src 'self'` et `img-src 'self' data: blob:` (l'application affiche un message explicite quand WebAssembly est bloqué). `X-Frame-Options: DENY` casserait l'exécution JavaScript ; `SAMEORIGIN` convient.
8. Après mise en ligne : vérifier qu'une route profonde répond 200 et qu'une URL inventée répond 404 avec `404.html`. Le sitemap `https://hylst.fr/data_science_explorer/sitemap.xml` est à suivre dans Search Console.

La Content-Security-Policy que l'application pose elle-même (balise `<meta>`, ajoutée au build uniquement) est la constante `CONTENT_SECURITY_POLICY` de `vite.config.ts` : toute nouvelle origine externe (script, police, API) doit y être ajoutée, en se demandant d'abord si elle est nécessaire : l'application n'utilise aujourd'hui aucun service tiers à l'exécution.

### 5.12 Publier le code dans un dépôt neuf

Ce dépôt local garde un historique que l'on ne publie pas (anciens récits du blog, ancienne licence, ancien nom, notes de travail). La publication se fait donc dans un dépôt neuf à un seul commit, qui ne reprend que l'état actuel.

1. Tout commiter ici d'abord : l'export lit le commit `HEAD`, pas le dossier de travail (le script avertit si des fichiers suivis sont modifiés).
2. Compte rendu seul : `node scripts/export-public-repo.mjs --out <dossier>` (le dossier doit être absent ou vide, et hors de ce dépôt). Le script liste les fichiers exportés et exclus, les chemins locaux retirés de la documentation, les adresses e-mail à confirmer, et **échoue** s'il reste un chemin local, un hébergeur interne, un secret probable (clés `sk-`, jeton GitHub, clé AWS, clé privée) ou un nom de fichier interdit (`.env`, `.pem`, `.zip`...).
3. Création : le même appel avec `--commit` (et `--message "..."` pour le texte du commit). Le dépôt obtenu a un seul commit, la branche `main` et aucun remote.
4. Vérifier le dépôt neuf comme un visiteur : `npm ci`, puis `npm run lint && npm run typecheck && npm test` et `npm run build:hylst` doivent passer sans rien venir de ce dépôt-ci.
5. Choisir le nom du dépôt distant, renseigner `SOURCE_URL` dans `src/config/site.ts` (le pied de page et les conditions d'utilisation affichent alors le lien : l'AGPL demande d'offrir le code source aux utilisateurs d'un service en ligne), refaire le build et la livraison. Le premier envoi est une décision de l'auteur : le script ne pousse jamais.

La liste `EXCLUDE` et les remplacements de chemins sont en tête du script : les modifier pour changer ce qui est publié. Le script s'exclut lui-même de l'export, puisqu'il cite par construction les chemins qu'il retire.

## 6. Pièges Windows

Environnement constaté : Windows 11, Git Bash et PowerShell 5.1.

**Git Bash**

- Les chemins s'écrivent avec des barres obliques : `cd <racine du projet>`. Depuis PowerShell : `<racine du projet>`.
- Git Bash convertit tout argument qui commence par `/` en chemin Windows : `/quiz` devient `C:/Program Files/Git/quiz`. Pour passer une route à un script, préfixer la commande par `MSYS_NO_PATHCONV=1`, ou passer la route sans barre initiale et l'ajouter dans le script.
- Les heredocs (`cat <<EOF`) ont altéré les antislashs des expressions régulières lors de précédents travaux sur ce dépôt (notes de l'équipe) : écrire les scripts et fichiers qui en contiennent avec un éditeur, pas avec un heredoc.
- Un chemin Windows à antislashs (`C:\chemin\vers\...`) doit être entre guillemets dans Git Bash, sinon les antislashs sont interprétés ; la forme `/c/chemin/vers/...` évite le problème.

**PowerShell 5.1**

- `&&` et `||` n'existent pas : enchaîner avec `;` ou `commande1; if ($?) { commande2 }`.
- La redirection `>` écrit en UTF-8 avec BOM : le premier caractère du fichier est U+FEFF. À retirer avant de comparer des sorties (par exemple de `tsc`). `Set-Content` écrit en ANSI par défaut : passer `-Encoding utf8` pour tout fichier destiné au dépôt.
- `Get-Content` affiche mal l'UTF-8 sans `-Encoding utf8` (`MathÃ©matiques`) : ce n'est qu'un affichage, le fichier est correct. Vérifier avec un outil de recherche plutôt qu'à l'œil.
- `git commit -m` avec un message multiligne ou contenant des guillemets doubles échoue (les arguments sont éclatés). Écrire le message dans un fichier, puis `git commit -F fichier`.
- Fins de ligne : `core.autocrlf` vaut `true` sur cette machine et il n'y a pas de `.gitattributes`. Le dossier de travail mélange donc LF et CRLF (par exemple `src/data/quizData.ts` est en CRLF, `src/App.tsx` en LF). Les scripts et tests qui analysent le code source normalisent `\r\n` en `\n` avant d'appliquer leurs expressions régulières : ne pas s'en inquiéter, mais ne pas convertir un fichier entier pour rien (diff illisible).

**Général**

- Les fichiers texte du dépôt sont en UTF-8 avec des accents : ne pas les enregistrer dans un autre encodage.

## 7. Conventions

Ces règles viennent des commentaires du code et des tests.

**Contenu et honnêteté des données**

- Aucune donnée inventée : pas d'étudiants, de notes, d'avis, de témoignages, de salaires ni de chiffres sans source. Les statistiques affichées sont soit calculées (quiz, progression, jeux d'exemple à graine fixe), soit citées avec `SourceNote`.
- Tout texte visible est en français correct, avec accents. Pas de tiret cadratin ni demi-cadratin dans les titres et descriptions (testé) ni dans les ajouts au dépôt de la plateforme.
- Le nom du site s'importe de `src/config/site.ts` (`SITE_NAME`), il ne se recopie pas. L'ancien nom « Data Science Explorer » ne doit plus apparaître (testé).
- Le formulaire de contact prépare un `mailto:` et ne prétend jamais avoir envoyé un message (`src/config/contact.ts`).
- Les extraits de code exécutés dans l'éditeur doivent être réels. Dans un gabarit de chaîne TypeScript, écrire les échappements Python `\n` (un saut de ligne réel casserait le code).

**Code**

- Stockage : `readStorage`, `writeStorage`, `readJSON`, `writeJSON` de `src/lib/storage.ts` plutôt que `localStorage` (ils ne lèvent jamais d'exception). Déclarer une clé sous la forme `const MA_CLE_KEY = '...'` (le test d'unicité lit ce motif). Ne jamais renommer une clé existante.
- Chemins vers `public/` : `asset('img/x.jpg')` (`src/lib/asset.ts`) et `import.meta.env.BASE_URL`. Jamais `/img/...` ni `/sw.js` en dur : le site vit sous `/data_science_explorer/` sur hylst.fr.
- Liens internes : toujours l'URL canonique, jamais une URL redirigée.
- Défilement : aucune page ni aucun layout n'appelle `window.scrollTo` au montage (`ContentLayout` compris) ; `ScrollManager` remet en haut, gère l'ancre `#id` et restaure la position au retour arrière. Les `scrollTo` déclenchés par un clic sont permis.
- HTML injecté par `dangerouslySetInnerHTML` : toujours `sanitizeHtml` (`src/lib/sanitize.ts`). Seule exception actuelle : le CSS construit par `src/components/ui/chart.tsx` (shadcn) à partir de la configuration du graphique, qui n'est pas du contenu externe. Typographie du HTML brut : classe `rich-text`, pas `prose`.
- Imports : alias `@/` pour `src/`. Les fichiers lus par Node au build (`src/config/site.ts`, `src/config/page-meta.ts`, `src/config/routes.ts`) n'utilisent que des imports relatifs et aucune API Vite.
- TypeScript strict dans `tsconfig.app.json` (le `tsconfig.json` racine est plus souple). `npm run build` ne vérifie pas les types : lancer `npm run typecheck`.
- Éviter d'ajouter des `any` et du code mort .

**Mise en page** (chacune de ces règles corrige un vrai débordement)

- Un bouton à libellé long porte `whitespace-normal h-auto` (le `Button` de base est `whitespace-nowrap`).
- Les barres d'actions utilisent `flex-wrap`.
- Une grille s'écrit `grid grid-cols-1 md:grid-cols-N` : un `grid` seul a une colonne automatique qui grandit avec son contenu.
- La zone principale de `ContentLayout` garde `min-w-0`.
- Contrôler 390, 768, 1024 et 1280 px : aucun défilement horizontal de la page.

**Sécurité et PWA**

- Nouvelle origine externe (script, police, API) : l'ajouter à `CONTENT_SECURITY_POLICY` dans `vite.config.ts`, et s'interroger d'abord : l'application n'a aucun appel réseau dans `src/`, et `verify-dist` refuse toute référence à Supabase, aux variables `VITE_*` et aux formats usuels de clés d'API.
- Le service worker (`public/sw.js`) n'existe qu'en production ; ne jamais y mettre en cache une réponse HTML sous l'URL d'une ressource.
- Les fichiers `ml_models_guide.html` et `transformer_ml.html` à la racine sont des sources autonomes : le code et le build ne les référencent pas.

## 8. Dépannage : message, cause, remède

| Symptôme | Cause probable | Remède |
| --- | --- | --- |
| Test « chaque route canonique a un titre et une description non vides » ou build : `routes sans titre ni description` | Route ajoutée sans entrée dans `PAGE_META` (ou quiz au mauvais format) | Section 5.1 étape 3 ; pour un quiz, section 5.5 étape 2 |
| Test « PAGE_META ne contient aucune route disparue ou redirigée » | Entrée de `PAGE_META` pour une route supprimée ou déplacée | Supprimer l'entrée |
| Tests de longueur ou d'unicité de `page-meta.test.ts` | Titre hors de 20 à 38 caractères, description hors de 110 à 160, texte déjà utilisé | Reformuler |
| `theme.test.ts` échoue | `DEFAULT_THEME` et `defaultTheme` différents, ou clé de thème modifiée | Section 5.10 |
| `brand.test.ts` signale `src/...:ligne` | Ancien nom du site, ou `index.html`, manifeste, `offline.html` désalignés de `site.ts` | Section 5.9 |
| `storage.test.ts` : deux modules utilisent la même clé | Même valeur de `const XXX_KEY` dans deux fichiers | Choisir une valeur unique |
| `sync-runtimes` : `Licence à vérifier` ou `Paquet inconnu` | Paquet Python sans licence relevée ou absent du verrou Pyodide | Section 5.8 |
| `sync-runtimes` échoue au téléchargement | Pas de réseau au premier lancement, ou HTTP en erreur | Relancer avec réseau ; les roues déjà reçues restent dans `.cache/` |
| `npm run verify:dist` échoue sur `dist/` | Le contrôle est écrit pour le build hylst | Utiliser `npm run verify:hylst` après `npm run build:hylst` |
| Python ou SQL ne démarrent pas en production : « WebAssembly est bloqué par la politique de sécurité du serveur » | En-tête CSP du serveur sans `'wasm-unsafe-eval'` | Point 7 de la section 5.11 |
| Un visiteur voit une ancienne version | Service worker : la mise à jour est proposée par un toast « Actualiser » et activée au message `SKIP_WAITING` | Normal ; le cache est recréé à chaque build (`__BUILD_ID__`) |
