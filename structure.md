# Structure du dépôt

Ce document décrit l'organisation du code de « Explorons la Data Science » et les principaux flux (routage, métadonnées, build statique, exécution de code, cours rédigés, affichage par morceaux, PWA, thème, stockage local, tests). Il est dérivé du code : chaque chemin et chaque nombre cités ont été vérifiés dans le dépôt. Les chiffres sont ceux constatés au moment de la rédaction (9 octobre 2026, branche `audit/securite-pwa-routage`) : les recalculer avec les commandes indiquées avant de les citer ailleurs.

Pour les commandes et les procédures d'ajout de contenu (dont « Écrire ou modifier un cours au format des leçons »), voir [readme_dev.md](readme_dev.md). Pour l'état des fonctionnalités, voir [features.md](features.md). Pour la vérification des chiffres externes affichés, voir [docs/SOURCES.md](docs/SOURCES.md).

## Vue d'ensemble

- Application monopage (SPA) 100 % statique : React 18, TypeScript, Vite 7 (plugin SWC), Tailwind CSS 3, shadcn/ui (Radix), React Router 7, KaTeX, Recharts. Aucun serveur, aucune base de données, aucun appel réseau dans `src/` (recherche de `fetch(`, `XMLHttpRequest`, `WebSocket` et `sendBeacon` : aucune occurrence hors tests).
- Contenu entièrement en français. Auteur : Geoffroy Streit « avec assistance IA ». Licence : AGPL-3.0-or-later (fichier `LICENSE`).
- Fichiers suivis par git : 609, dont 520 sous `src/` (314 `.tsx`, 202 `.ts`, 3 `.json`, 1 `.css`), tests compris. Compter avec `git ls-files | wc -l`.
- Routes : 56 routes canoniques (celles du `sitemap.xml`) et 28 anciennes URL redirigées, soit 84 pages HTML générées par `npm run build:hylst`. Compter avec `scripts/collect-routes.ts` (voir plus bas).
- Pages chargées à la demande : 35 `React.lazy` dans `src/App.tsx`, 11 dans `src/components/routing/CourseRouter.tsx`.
- Cours : 10 cours rédigés, tous au même format de données (`src/data/lessons/<cours>/`, 65 modules) affiché par un seul jeu de composants (`src/components/courses/lessons/`), plus 8 projets guidés dans le même format. Aucun cours n'est plus un simple plan.
- Pages longues affichées par morceaux (`ProgressiveSections`, `LazyBlock`, `DeferredResponsiveContainer`) : voir « Affichage par morceaux et chargement différé ».

## Arborescence commentée

### Racine

```text
.
├── index.html               Gabarit HTML unique (méta SEO par défaut, charge public/theme-init.js puis src/main.tsx)
├── package.json             Scripts, dépendances, licence SPDX (voir readme_dev.md)
├── vite.config.ts           Config Vite + plugins productionHardening (CSP, LICENSE.txt, sw.js) et staticHosting (mode hylst)
├── vitest.config.ts         Config des tests (jsdom, src/**/*.test.{ts,tsx} sauf le test de fumée, alias @ -> src, constantes de version des moteurs)
├── vitest.smoke.config.ts   Config du test de fumée des routes (npm run test:smoke)
├── tailwind.config.ts       Thème, mode sombre par classe, plugin typographie « rich-text », plugin dark-palette
├── tsconfig.json            Références + alias @/* (options plus souples que tsconfig.app.json)
├── tsconfig.app.json        Config stricte utilisée par `npm run typecheck` (inclut uniquement src/)
├── tsconfig.node.json       Config de vite.config.ts (seul fichier inclus)
├── eslint.config.js         ESLint 9 (typescript-eslint, react-hooks, react-refresh) ; ignore dist et dist-hylst
├── postcss.config.js        tailwindcss + autoprefixer
├── components.json          Réglages de la CLI shadcn/ui (alias @/components, @/lib, @/hooks)
├── LICENSE                  Texte officiel de la GNU AGPL v3, seul (GitHub le reconnaît)
├── NOTICE.md                En-tête SPDX, droits d'auteur, exceptions (logos, moteurs tiers) ; publié avec LICENSE sous LICENSE.txt
├── README.md                Présentation, démarrage rapide, index de la documentation
├── features.md              État des fonctionnalités par section
├── structure.md             Ce document
├── readme_dev.md            Guide du développeur (commandes, procédures, livraison)
├── CHANGELOG.md             Historique des changements
├── about.md                 Texte de la page À propos (notes de travail)
├── ml_models_guide.html     HTML autonome, source d'un cours ; non référencé par le code ni par le build
├── transformer_ml.html      Idem
├── src/                     Code de l'application (voir plus bas)
├── public/                  Fichiers servis tels quels (voir plus bas)
├── scripts/                 Scripts Node (routes, moteurs d'exécution, actualités, contrôle du build, export du dépôt public)
├── tailwind/                Plugins Tailwind (mode sombre)
├── docs/                    Documentation de composants, performances, sources des chiffres
├── dist/, dist-hylst/       Sorties de build (ignorées par git)
└── .cache/                  Roues Python téléchargées par runtimes:sync (ignoré par git)
```

Les dossiers `node_modules/`, `dist/`, `dist-hylst/`, `.cache/` et `public/vendor/` sont dans `.gitignore`.

### src/ (niveaux 2 et 3)

```text
src/
├── main.tsx                 Point d'entrée : service worker (production seulement), capture de l'invite d'installation, rendu de <App />
├── App.tsx                  Fournisseurs (ErrorBoundary, ThemeProvider, HelmetProvider, TooltipProvider), BrowserRouter et toutes les routes
├── index.css                Variables de thème (:root et .dark), styles de base, utilitaires
├── routes.smoke.test.tsx    Test de fumée : affiche chaque route canonique et chaque onglet (npm run test:smoke)
├── vite-env.d.ts            Types Vite et constantes injectées (__PYODIDE_VERSION__, __SQLJS_VERSION__)
│
├── config/                  Configuration lue aussi par le build (imports relatifs uniquement)
│   ├── site.ts              Identité du site (nom, URL, base, auteur, licence) : source unique
│   ├── page-meta.ts         Titre et description (SEO) de chaque route statique
│   ├── routes.ts            LEGACY_REDIRECTS : anciennes URL -> URL canoniques
│   ├── contact.ts           Coordonnées publiques et préparation des liens mailto:
│   └── *.test.ts            Tests garde-fous : brand, page-meta, theme, illustrations, gradient-text, internal-links, jsx-spacing, source-link
│
├── pages/                   Pages de route (92 fichiers suivis)
│   ├── (17 pages directes)  Index, Introduction, Fundamentals, MachineLearning, Tools, Projects, Resources,
│   │                        Quiz, QuizCategory, Community, Blog, Glossary, About, Contact, PrivacyPolicy, TermsOfService, NotFound
│   ├── fundamentals/        57 fichiers : MathStats, Programming, Databases, DataPreparationRefactored ;
│   │   │                    math-stats/ (6 pages : probability, descriptive-statistics, linear-algebra, differential-calculus,
│   │   │                    advanced-statistics, integral-calculus ; chacune avec son sous-dossier de composants) ;
│   │   └── databases/components/
│   ├── machine-learning/    SupervisedLearning, UnsupervisedLearning, ReinforcementLearning
│   ├── tools/               4 pages d'outils (ProgrammingTools, DataProcessingTools, MLFrameworks, DataVisualization)
│   └── courses/             11 fichiers : CoursesIndex (catalogue, lu dans data/course-catalog.ts) et une page mince par cours
│                            (25 à 33 lignes) : databases/, dataviz/, machine-learning/, math-stats/ (math-intro, inferential-statistics),
│                            nlp/, programming/, statistics/, MLModelsGuide, TransformersGuide. Chaque page passe son cours de
│                            src/data/lessons/ à LessonCoursePage ; aucun contenu n'y est écrit
│
├── components/              Composants par fonctionnalité
│   ├── ui/                  45 fichiers : shadcn/ui (Radix) et composants partagés (SourceNote, GlossaryTerm, deferred-chart,
│   │                        figure-output (figures Matplotlib), PWAInstallButton, états de chargement, ErrorBoundary,
│   │                        back-to-top, tableaux adaptatifs)
│   ├── layout/              Layout, ContentLayout (barre latérale), CourseLayout, Navbar, Footer, PageHeader, StandardSidebar,
│   │                        FloatingSidebarToggle, ProgressiveSections, LazyBlock
│   ├── routing/             CourseRouter, ScrollManager, RouteMeta
│   ├── theme/               ThemeProvider, ThemeToggle
│   ├── courses/             Briques de cours : CourseEquation (KaTeX), CourseHighlight, CourseBreadcrumb, CourseQuizBlock,
│   │   │                    CourseFigures (SVG), CourseItemActions (progression et notes), CourseHeroTemplate et CourseModuleTemplate
│   │   │                    (gabarits des anciens cours à plan : aucune page ne les utilise depuis le 9 octobre)
│   │   ├── lessons/         Affichage des cours rédigés : LessonCoursePage (page d'un cours), LessonModuleView (un module),
│   │   │                    LessonMarkdown, RunnableCode (exemple exécutable), LessonExercise (exercice vérifié),
│   │   │                    LessonWidget (composant interactif chargé à la demande)
│   │   └── python/          NumpyBenchmark et PythonInteractiveSchemas, les deux composants que LessonWidget insère dans le cours Python
│   ├── fundamentals/        48 fichiers : sections des pages Fondamentaux ; sous-dossiers data-preparation/, math/, programming/
│   │                        (éditeur de code, défis, ressources, outils de développement), statistics/ et definitions/
│   │                        (dictionnaires de définitions survolables)
│   ├── machinelearning/     34 fichiers : sections de la page ML (sections/) et cours supervisé, non supervisé, renforcement (courses/)
│   ├── glossary/            Page Glossaire : explorateur, fiches, rendu markdown des définitions
│   ├── introduction/ (sections/), tools/ (sections/), community/, home/, projects/, resources/, quiz/, blog/
│   └── (un dossier par fonctionnalité ; pas de dossier partagé « common »)
│
├── data/                    Contenu
│   ├── lessons/             Les cours rédigés comme données (voir « Cours rédigés comme données »)
│   ├── glossary/            8 fichiers de termes écrits à la main, dictionaries.ts (termes des dictionnaires de survol absents des
│   │                        fichiers à la main), from-definition.ts, index.ts (agrégation), types.ts, ml-definitions.ts
│   │                        (définitions survolables du ML)
│   ├── glossary-terms.ts    Réexport de glossary/ (ancien chemin)
│   ├── quizData.ts          8 catégories de quiz et leurs questions
│   ├── projects.ts          12 projets et fonctions de filtre
│   ├── course-catalog.ts    Catalogue des 10 cours (niveau, durée, modules, statut) : source unique de l'accueil et de /courses
│   ├── tooling.ts           Contenu de la section Git, environnements virtuels et Docker de /fundamentals/programming
│   ├── data-quality-demos.ts  Démonstrations de la qualité des données, calculées (cas pratique, validation, monitoring)
│   ├── blog-posts.json      Métadonnées des articles ; blog-contents.ts : corps HTML ; blog-articles.ts : jointure des deux
│   ├── rss-sources.json, rss-articles.json    Flux suivis et instantané daté des actualités (npm run news:refresh)
│   └── data-preparation-enhanced-definitions.ts    Définitions survolables de la préparation des données (version courte)
│
├── hooks/                   use-theme, use-course-progress, use-blog-favorites, useQuiz, use-persisted-tab, use-section-tracker,
│                            use-smooth-scroll, use-text-truncation, use-error-handling, use-mobile, use-toast, use-sidebar-bounds
├── lib/                     storage.ts, asset.ts, sanitize.ts, quiz-storage.ts, quiz-shuffle.ts, pwa-install.ts, sample-datasets.ts,
│                            format-duration.ts, contrast.ts, scroll.ts, scroll-key.ts, scroll-positions.ts, progressive-sections.ts,
│                            progress-migration.ts, answer-match.ts, glossary-batches.ts, glossary-markdown.ts, blog-image.ts,
│                            course-image.ts, utils.ts ; lessons/ (outils des cours rédigés) ; runner/ (exécution de code) ;
│                            les tests sont à côté des modules testés
└── types/                   quiz.ts et déclarations de types (react-katex, sql.js)
```

### public/

```text
public/
├── sw.js                    Service worker (versionné au build via __BUILD_ID__)
├── manifest.json            Manifeste PWA (chemins relatifs, scope ./)
├── offline.html, offline.js Page hors ligne pré-mise en cache (script externe à cause de la CSP)
├── theme-init.js            Applique le thème enregistré avant le premier affichage (script externe à cause de la CSP)
├── robots.txt               Règles pour les robots ; la ligne Sitemap: est ajoutée au build hylst
├── favicon.svg, logo.png    Icône et image de partage (og:image)
├── icons/                   Icônes PWA (192, 512, apple-touch-icon)
├── img/                     Logos (devicon et marques), blog/ (une image WebP par article, générée en local), courses/ (une image WebP par cours, 7 fichiers), CREDITS.md
├── svg/                     Trois schémas (5 V du Big Data, parcours d'apprentissage, aperçu du ML) et cards/ : trois illustrations animées des cours de l'accueil (CSS, sans script, qui respectent prefers-reduced-motion)
├── sandbox/                 Bac à sable JavaScript : js-runner.html, js-runner.js, js-core.js
└── vendor/                  Moteurs Python et SQL, NOTICE.txt (généré, non suivi par git, 56 Mo mesurés)
```

`public/vendor/` contient `pyodide-<version>/` (noyau, bibliothèque standard, roues numpy, pandas, scipy, scikit-learn, matplotlib, statsmodels et leurs dépendances), `sql-js-<version>/` (binaire WebAssembly de SQLite) et `NOTICE.txt`. Il est recréé par `scripts/sync-runtimes.mjs`. Mesure du 10 octobre 2026, après l'ajout de statsmodels (`du -sk public/vendor` : 57 172 ko) : 56 Mo, dont Pyodide 314.0.7 pour presque tout et sql.js 1.14.2 pour 0,6 Mo.

### scripts/, tailwind/, docs/

| Fichier | Rôle |
| --- | --- |
| `scripts/collect-routes.ts` | Lit le code source pour établir la liste des routes (`collectRoutes`) et les métadonnées des routes dynamiques (`collectDynamicMeta`). Importé par `vite.config.ts` et par `page-meta.test.ts` ; exécutable seul par un Node récent qui retire les types TypeScript de lui-même (essayé avec Node 24.14) |
| `scripts/sync-runtimes.mjs` | Prépare `public/vendor` (Pyodide, sql.js, roues Python vérifiées par SHA-256) et génère `NOTICE.txt` |
| `scripts/refresh-news.mjs` | Récupère les flux de `src/data/rss-sources.json` et réécrit `src/data/rss-articles.json` |
| `scripts/verify-dist.mjs` | Contrôle d'un build statique : aucun secret ni référence Supabase ou `VITE_*`, aucun chemin absolu hors base dans `index.html`, canonical hylst.fr et `sitemap.xml` présents |
| `scripts/export-public-repo.mjs` | Prépare un dépôt neuf à un seul commit à partir de `HEAD` pour la publication du code (voir `readme_dev.md`, section 5.12) |
| `tailwind/dark-palette.ts` | Plugin Tailwind : génère les règles `.dark` des classes de couleur fixes utilisées dans `src/` |
| `tailwind/dynamic-colors.ts` | Couleurs des classes construites à l'exécution (safelist et règles sombres) |
| `docs/COMPONENT_DOCUMENTATION.md` | Composants d'interface partagés et système de design |
| `docs/PERFORMANCE_GUIDE.md` | Mesures de performance : tailles du build et scores Lighthouse (6 et 7 octobre 2026) |
| `docs/SOURCES.md` | Vérification des chiffres externes affichés sur le site |

## Fichiers clés

| Fichier | Rôle |
| --- | --- |
| `src/App.tsx` | Déclare toutes les routes, chaque page en `React.lazy`, sous un seul `Suspense`. `basename` du routeur dérivé de `import.meta.env.BASE_URL`. Rend aussi les `LEGACY_REDIRECTS` en `<Navigate replace>` |
| `src/components/routing/CourseRouter.tsx` | Sous-routeur de `/courses/*` : 10 cours, puis `NotFound` pour tout cours inconnu |
| `src/config/routes.ts` | `LEGACY_REDIRECTS` : 28 entrées au moment de la rédaction |
| `src/components/routing/ScrollManager.tsx` | Défilement : haut de page à la navigation, ancre `#id` décalée de la barre collante, restauration au retour arrière et au rechargement. Attend la fin des sections en attente (`data-sections-pending`, 3 s au plus) avant de restaurer ou de viser une ancre. Les positions sont dans `lib/scroll-positions.ts` |
| `src/components/routing/RouteMeta.tsx` | Applique titre et description de `PAGE_META` via Helmet ; ne fait rien pour les routes dynamiques |
| `src/config/site.ts` | Nom, accroche, description, origine, sous-chemin de déploiement, auteur, licence, fichiers de licence et de NOTICE, `SOURCE_URL` |
| `src/config/page-meta.ts` | `PAGE_META` : 42 routes statiques, plus `HOME_TITLE` pour l'accueil. Longueurs visées : titre 20 à 38 caractères, description 110 à 160 |
| `src/config/contact.ts` | `CONTACT_EMAIL`, liens GitHub, LinkedIn et hub, `mailtoLink`, `buildMailDraft` (le site n'envoie rien) |
| `src/components/layout/Layout.tsx` | Gabarit simple : Navbar, `<main>`, Footer |
| `src/components/layout/ContentLayout.tsx` | Layout avec barre latérale (Radix sidebar) ; ne doit jamais appeler `window.scrollTo` au montage. Utilisé par 17 pages |
| `src/components/layout/CourseLayout.tsx` | Gabarit des pages de cours (fil d'Ariane et titre), posé par `LessonCoursePage` pour les 10 cours |
| `src/components/layout/ProgressiveSections.tsx`, `LazyBlock.tsx` | Affichage par morceaux et blocs chargés à la demande (voir plus bas) |
| `src/components/layout/Navbar.tsx` | 11 rubriques (tableau `navItems`), menus déroulants Fondamentaux et Machine Learning, rubriques « secondaires » repliées sous 1536 px (`2xl`), menu hamburger sous 1280 px (`xl`), bascule de thème, bouton d'installation |
| `src/lib/storage.ts` | Accès `localStorage` qui ne lève jamais d'exception (`readStorage`, `writeStorage`, `removeStorage`, `readJSON`, `writeJSON`, `storageKeys`, validateurs) |
| `src/lib/asset.ts` | `asset(path)` : URL d'un fichier de `public/` quel que soit le sous-chemin |
| `src/lib/sanitize.ts` | `sanitizeHtml` (DOMPurify) pour tout HTML injecté |
| `src/lib/runner/` | Exécution réelle de code (voir plus bas) |
| `src/lib/lessons/` | Types et contrôles des cours rédigés (voir « Cours rédigés comme données ») |
| `src/lib/quiz-storage.ts` | Tentatives de quiz (100 au plus), séries, succès, seuil de réussite à 80 % |
| `src/lib/sample-datasets.ts` | Deux jeux d'exemple à graine fixe (ventes, patients) sur lesquels les statistiques affichées sont calculées |
| `src/lib/contrast.ts` | `contrastRatio` (rapport WCAG entre deux couleurs hexadécimales) et `readableTextColor` (blanc ou foncé selon le fond), utilisés pour le texte des pastilles colorées (`LanguageComparison`, `CorrelationSection`) |
| `src/lib/progress-migration.ts` | Reprise, une fois, de l'ancienne progression du cours de mathématiques dans `use-course-progress` (modèle d'une migration de progression) |
| `src/hooks/use-course-progress.ts` | Progression et notes par cours (clé `course-progress-<id>`), synthèse pour l'accueil |
| `src/hooks/use-theme.ts` | Contexte du thème (`THEMES`, `THEME_STORAGE_KEY`, `useTheme`), clé `ds-explorer-theme` |
| `src/data/quizData.ts` | 8 catégories, 165 questions ; une tentative tire 10 questions au hasard (`getRandomQuestions`, appelé par `QuizCategory.tsx`) |
| `src/data/glossary/` | 229 termes (comptés en important `index.ts`) : huit fichiers écrits à la main agrégés par `index.ts`, plus les termes des dictionnaires de survol des cours (`dictionaries.ts`) qui n'y figurent pas déjà. Types et catégories dans `types.ts`. `tools.ts` dérive ses entrées des définitions de `components/fundamentals/definitions/` |
| `src/data/projects.ts` | 12 projets et fonctions de filtre ; tous les compteurs de la page sont calculés dessus. Huit projets sont guidés (`src/data/lessons/projects/`) |
| `src/data/course-catalog.ts` | 10 cours avec catégorie, niveau, durée indicative, nombre de modules et statut (`redige` ou `plan`, tous `redige` aujourd'hui) ; lu par `FeaturedCourses.tsx` (accueil), `CoursesIndex.tsx` (`/courses`), `InitiationCoursesSection.tsx` (ressources) et `UnifiedMathCourses.tsx` (maths). Niveau, durée et nombre de modules y sont saisis à la main : ils ne sont pas vérifiés contre les données des leçons |
| `src/data/blog-posts.json`, `blog-contents.ts`, `blog-articles.ts` | Métadonnées (5 articles), corps HTML par identifiant, et jointure des deux pour les pages d'article |
| `src/components/ui/source-note.tsx` | Ligne « Source : ... » sous un chiffre du monde réel |
| `vite.config.ts` | Voir les flux ci-dessous |

## Flux importants

### Routage

`src/App.tsx` déclare les routes de section (`/fundamentals/*`, `/machine-learning/*`, `/tools/*`), les pages simples, `/quiz/:categoryId`, `/blog/:id` (rendu par `Blog`, qui affiche l'article via `components/blog/BlogPost.tsx`), le catalogue `/courses` et délègue `/courses/*` à `CourseRouter`. Les `LEGACY_REDIRECTS` de `src/config/routes.ts` sont rendus en `<Navigate replace>`. Toute autre URL affiche `NotFound`. Les liens internes doivent viser l'URL canonique, jamais une redirection.

Une route statique de `App.tsx` l'emporte sur `/courses/*` : c'est pourquoi des anciennes URL de cours peuvent être déclarées dans `routes.ts`.

`ScrollManager` (monté dans `App.tsx`) est le seul responsable du défilement lors des navigations. Les pages et les layouts n'appellent pas `window.scrollTo` au montage ; les `scrollTo` restants (par exemple dans `Fundamentals.tsx`, `Resources.tsx` ou `lib/scroll.ts`) sont dans des gestionnaires de clic.

### Affichage par morceaux et chargement différé

Les pages longues sont lourdes à afficher d'un seul tenant (formules KaTeX, graphiques Recharts, définitions du glossaire). Quatre mécanismes, mesurés les 6 et 7 octobre 2026 (`docs/PERFORMANCE_GUIDE.md`) :

- **`components/layout/ProgressiveSections.tsx`** : une page faite d'une liste de sections affiche la première, puis une de plus chaque fois que le navigateur est inactif (`requestIdleCallback`, repli sur `setTimeout`). Une seule section d'emblée (`INITIAL_SECTIONS` dans `lib/progressive-sections.ts`) : avec deux, la deuxième se chargeait assez vite pour être dessinée dans la même tâche que l'introduction et la retardait. Chaque section après l'introduction est un `React.lazy`. Tout s'affiche d'un coup quand une position de lecture va être restaurée (précédent, suivant, rechargement) ou quand l'adresse vise une ancre. Utilisé par les pages probabilités, statistiques descriptives, calcul différentiel et algèbre linéaire, par les 5 sections de `FundamentalsContent` (`/fundamentals`) et par les 8 sous-sections de `ProgrammingSection`.
- **`components/layout/LazyBlock.tsx`** : un seul bloc chargé à la demande (contenu sous le bandeau). Utilisé par l'explorateur du glossaire, le glossaire technique de `/fundamentals`, la programmation, le contenu de la page Machine Learning, les visuels de la page de mathématiques et chaque section de `ToolsContent`, ainsi que par `tools/DataVisualization`.
- **`components/ui/deferred-chart.tsx`** (`DeferredResponsiveContainer`) : mêmes propriétés que `ResponsiveContainer` de Recharts, mais le graphique n'est dessiné que lorsque sa boîte arrive à 400 px de l'écran. La boîte vide a la taille exacte du graphique, donc la hauteur de la page ne change pas et la restauration de la position reste juste. Tous les graphiques du site (hors `components/ui/chart.tsx`, 21 fichiers au 9 octobre 2026) l'utilisent.
- **Marque `data-sections-pending`** : portée par les attentes de `ProgressiveSections` et de `LazyBlock`. `ScrollManager` attend qu'il n'en reste aucune (3 s au plus) avant de restaurer une position ou de viser une ancre, et le test de fumée attend de même. `content-visibility: auto` a été écarté : il casse la restauration au pixel près.

Le titre et la description du bandeau (`UnifiedHeroSection`) sont affichés au premier rendu, sans animation retardée, ce qui avançait le LCP de chaque page.

### Cours rédigés comme données

Les 10 cours et les 8 projets guidés ne contiennent pas de JSX : un cours est une liste de modules (`LessonCourse` de `src/lib/lessons/types.ts`), chaque module une suite de sections typées.

| Dossier ou fichier | Rôle |
| --- | --- |
| `src/data/lessons/<cours>/` | `index.ts` (l'objet `LessonCourse`, `id` stable) et un fichier par module (`m1-...ts`) ; `data.ts` et `datasets/` pour les jeux de données partagés. Dossiers : `python`, `math-intro`, `inferential-statistics`, `applied-statistics`, `database-fundamentals`, `data-visualization`, `supervised-learning`, `ml-models-guide`, `transformers`, `nlp`, plus `projects/` (8 projets guidés en un seul `LessonCourse`, id `projects`) |
| `src/data/lessons/lines.ts` | `lines(...)` : écrit un extrait de code une ligne de source par ligne de code |
| `src/data/lessons/lessons.test.ts` | Contrôle du cours de bases de données sur sql.js sous Node |
| `src/data/lessons/lessons-python.test.ts` | Contrôle de tous les cours Python et des projets guidés sur Pyodide sous Node (environ 7 s de chargement, sans réseau) |
| `src/lib/lessons/types.ts` | `LessonCourse`, `LessonModule`, `LessonSection` (`text`, `code`, `exercise`, `note`, `widget`, `equation`), `LessonWidget` |
| `src/lib/lessons/course-checks.ts` | `describeLessonCourse` : les contrôles communs à tous les cours (structure, quiz, markdown, exemples, exercices) |
| `src/lib/lessons/check.ts` | Comparaison des résultats SQL d'un exercice (dernier tableau de la réponse contre celui du corrigé) |
| `src/lib/lessons/python-node.ts`, `sql-node.ts` | Exécution Python (Pyodide) et SQL (sql.js) sous Node pour les tests, avec les mêmes paquets et la même mise en forme que le site |
| `src/lib/lessons/typography.ts` | `frenchSpacing` : espaces insécables français ajoutés à l'affichage, jamais dans le code |
| `src/lib/lessons/duration.ts` | Somme des durées de modules (« 1 h 30 ») affichée en tête de cours |
| `src/components/courses/lessons/LessonCoursePage.tsx` | Page d'un cours : bandeau, mode d'emploi, liste des modules, section « Et ensuite ? » |
| `src/components/courses/lessons/LessonModuleView.tsx` | Un module repliable : objectifs, sections, quiz (`CourseQuizBlock`), progression (`CourseItemActions`) |
| `src/components/courses/lessons/RunnableCode.tsx`, `LessonExercise.tsx` | Exemple modifiable exécuté par `runCode` ; exercice vérifié par le moteur (SQL : comparaison avec le corrigé ; Python : la réponse suivie des `assert`) |
| `src/components/courses/lessons/LessonWidget.tsx` | Insère un composant interactif nommé par la section `widget` : banc d'essai NumPy, schémas animés du cours Python, figures SVG de `CourseFigures`. Chargé à la demande |
| `src/components/courses/lessons/LessonMarkdown.tsx` | Rendu markdown des textes (pas de tableau, pas de lien externe) |

Les identifiants de module (`id`) servent de clés de progression (`course-progress-<id du cours>`) : ne pas les changer. Pour une progression à reprendre d'un ancien format, voir `lib/progress-migration.ts`. La procédure d'écriture est dans `readme_dev.md` (section 5.13).

### Identité du site

`src/config/site.ts` est la source unique du nom, de l'URL (`SITE_ORIGIN`, `SITE_BASE`, `SITE_URL`), de l'auteur, de la licence et des noms de fichiers publiés (`LICENSE.txt`, `vendor/NOTICE.txt`). Il est importé par l'application (Footer, FeatureHighlights, pages À propos, Contact, Confidentialité, Conditions, logo animé, bouton d'installation, article de blog, page de quiz) et par `vite.config.ts` : le fichier ne doit contenir que des imports relatifs et aucune API propre à Vite. Trois identifiants techniques ne portent volontairement pas le nouveau nom : le sous-chemin `/data_science_explorer/`, le préfixe de cache `ds-explorer-` du service worker et les clés `localStorage` (les renommer casserait des liens et la progression des visiteurs).

Le nom ou le sous-chemin apparaît encore en dur dans quelques fichiers qui ne peuvent pas importer `site.ts` : `index.html` (titre, `og:*`, `apple-mobile-web-app-title`, description), `public/manifest.json`, `public/offline.html`, le commentaire de `public/sw.js`, `scripts/verify-dist.mjs` (sous-chemin et URL canonique), le champ `name` de `package.json`, le nom du fichier `public/svg/data_science_explorer_apprentissage.svg` et les fichiers de documentation. `src/config/brand.test.ts` compare `index.html`, `manifest.json` et `offline.html` à `SITE_NAME` et refuse l'ancien nom dans `src/`, `public/` et `index.html` (exceptions listées dans le test). Le nom de la plateforme « hylst.fr » est aussi écrit en clair dans `About.tsx`, `Contact.tsx`, `PrivacyPolicy.tsx` et `Footer.tsx`. Voir « Changer l'identité du site » dans `readme_dev.md`.

### Métadonnées SEO

`src/config/page-meta.ts` contient `PAGE_META` (titre sans le nom du site, description). `fullTitle()` ajoute « - Explorons la Data Science ». Deux consommateurs :

1. `RouteMeta` (navigation dans l'application) pose titre, description et balises Open Graph via Helmet.
2. `vite.config.ts` (build hylst) les écrit dans le HTML de chaque route.

Les routes dynamiques ne sont pas dans `PAGE_META` : les articles du blog (`BlogPost.tsx`) et les quiz (`QuizCategory.tsx`) posent leurs propres balises, et le build hylst tire leurs métadonnées de `blog-posts.json` (titre, extrait) et de `quizData.ts` (titre, description) par `collectDynamicMeta`.

`src/config/page-meta.test.ts` garantit que chaque route canonique a un titre et une description, dans les longueurs visées, uniques, sans tiret cadratin ni demi-cadratin.

### Liste des routes pour le build (scripts/collect-routes.ts)

`collectRoutes` ne démarre pas l'application : il lit le code source avec des expressions régulières.

- `src/App.tsx` : tout `path="/..."` sans `*` ni `:` (donc ni `/courses/*`, ni `/quiz/:categoryId`, ni `/blog/:id`).
- `src/components/routing/CourseRouter.tsx` : tout `path="..."` commençant par une lettre minuscule, préfixé de `/courses/`.
- `src/config/routes.ts` : les entrées de la forme `{ from: '/x', to: '/y' }` (guillemets simples). Une ancre `#...` est retirée du `from`.
- `src/data/blog-posts.json` : un `/blog/<id>` par article.
- `src/data/quizData.ts` : un `/quiz/<id>` par `id: '...'` indenté de 4 espaces après `export const quizCategories`.

Ces formats sont donc porteurs : un `path` construit dynamiquement ou une indentation différente fait disparaître la route du sitemap et des pages générées. Le résultat actuel (relevé en important le script) : 84 routes au total, 56 canoniques, 28 anciennes URL, dont 13 routes dynamiques (5 articles et 8 quiz).

### Build statique pour hylst.fr

`npm run build:hylst` lance `vite build --mode hylst --outDir dist-hylst` (précédé de `sync-runtimes`, suivi de `verify-dist` par les hooks `pre` et `post` de npm). En mode `hylst`, la base Vite est `SITE_BASE` (`/data_science_explorer/`) et le plugin `staticHosting` agit à la fin du build :

- une page `<route>/index.html` par route (Nginx n'a pas de repli vers `index.html`), avec titre, description, `og:*`, `canonical` et `og:url` propres à la route ;
- pour chaque ancienne URL, une page de redirection (`<meta http-equiv="refresh">` et `canonical` vers la destination), sans attendre le JavaScript ;
- `sitemap.xml` (routes canoniques, `lastmod` du jour du build) ;
- `404.html` autonome (CSS en ligne, liens absolus, `noindex`) à brancher sur `error_page 404` côté Nginx ;
- une ligne `Sitemap:` ajoutée à `robots.txt` ;
- échec du build si une route n'a ni métadonnée statique ni métadonnée dynamique (message : ajouter la route dans `src/config/page-meta.ts`).

Le plugin `productionHardening` agit sur tout build (pas en développement) : il injecte une Content-Security-Policy dans `index.html`, publie `NOTICE.md` suivi de `LICENSE` sous `LICENSE.txt` dans la sortie et remplace `__BUILD_ID__` dans `sw.js`.

`scripts/verify-dist.mjs` (appelé automatiquement après `build:hylst`) vérifie la sortie. Il est écrit pour le build hylst : lancé sur un `dist/` ordinaire (`npm run verify:dist`), il échoue sur les chemins absolus et l'absence de canonical et de sitemap (constaté sur le dossier `dist/` existant), alors qu'il réussit sur `dist-hylst/`.

Livraison : voir `readme_dev.md`.

### Content-Security-Policy

Définie dans `vite.config.ts` (constante `CONTENT_SECURITY_POLICY`) et injectée en `<meta>` : `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `font-src 'self' data:`, `img-src 'self' data: blob:` (plus aucune image distante : les graphiques de Python arrivent en data:), `connect-src 'self'`, `worker-src 'self'`, `manifest-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. Toute nouvelle origine externe (script, police, API) doit y être ajoutée. Aucune police ni aucun script tiers n'est chargé aujourd'hui (recherche de `googleapis`, `gstatic` et `cdn.` dans `src/`, `index.html` et `public/` hors `vendor/` : aucune occurrence). Le bac à sable JavaScript a sa propre politique, plus stricte, dans `public/sandbox/js-runner.html`.

Si le serveur envoie une CSP en en-tête, elle s'applique aussi aux workers : `src/lib/runner/csp-guard.ts` transforme alors le blocage de WebAssembly en erreur lisible. Les directives à prévoir côté serveur sont `script-src 'self' 'wasm-unsafe-eval'`, `worker-src 'self' blob:` et `connect-src 'self'` (voir `readme_dev.md`, § 5.11).

### Exécution de code (src/lib/runner)

```text
runCode(language, code, onStatus)             index.ts
 ├─ python     -> createWorkerRunner(python.worker.ts, délai 30 s)   worker-client.ts
 ├─ sql        -> createWorkerRunner(sql.worker.ts, délai 15 s)
 └─ javascript -> runJavaScript(code)                                 javascript.ts
```

- **Python** : Pyodide (CPython compilé en WebAssembly) dans un Web Worker module de même origine. Le worker charge `vendor/pyodide-<version>/pyodide.module.js`, exécute une fois `python-setup.ts` (il masque l'avertissement `as_object_map` de Pyodide, déclenché par threadpoolctl pendant une validation croisée de scikit-learn, et rien d'autre), puis charge les paquets déduits des `import` du code (`loadPackagesFromImports`) : un paquet n'est chargé que s'il apparaît dans un `import`, et reste chargé ensuite. Paquets fournis : numpy, pandas, scikit-learn, matplotlib (et leurs dépendances, scipy compris). `PROVIDED_PACKAGES` dans `python.worker.ts` doit rester aligné avec `PYTHON_PACKAGES` de `scripts/sync-runtimes.mjs`. Matplotlib tourne sans écran (rendu Agg) : `plt.show()` ne fait rien et les figures ouvertes reviennent en PNG encodé en base64 dans `RunResult.images`, affichées par `components/ui/figure-output.tsx`. Pas de threads, aucun paquet à télécharger (le verrou `pyodide-lock.json` livré est allégé aux seuls paquets fournis). `asyncio.run(` est réécrit en `await (` car la boucle d'événements de Pyodide est déjà lancée. Les traces sont nettoyées des images internes de Pyodide.
- **SQL** : SQLite via sql.js dans un Web Worker ; une base vide en mémoire est recréée à chaque exécution, le script doit créer ses tables. Résultats mis en forme en tableaux texte (`sql-format.ts`, partagé avec les tests des cours).
- **JavaScript** : iframe `sandbox="allow-scripts"` (origine opaque) chargeant `sandbox/js-runner.html`, dont la CSP (`default-src 'none'`, pas de `connect-src`) coupe le réseau. Une iframe neuve par exécution, délai de 12 s. Le code qui n'utilise pas le DOM (détection par une expression régulière sur `document`, `window`, `navigator`, etc.) part dans un Web Worker créé depuis un Blob ; celui qui l'utilise s'exécute dans la page du bac à sable.
- **Délais** : le décompte du délai ne démarre qu'au message `started` du worker (le chargement du moteur n'est pas compté). En cas de dépassement, le worker est arrêté (`terminate`) et recréé à la prochaine exécution. Les exécutions sont mises en file : une seule à la fois par langage.
- **Chargement** : `worker-client.ts` transmet `baseUrl` (`BASE_URL` résolu contre l'origine) au worker ; les moteurs sont servis par le site lui-même, sans CDN à l'exécution.
- **Utilisateurs de `runCode`** : `RunnableCode.tsx` et `LessonExercise.tsx` (exemples et exercices des cours), `CodeEditor.tsx`, `AdvancedConcepts.tsx` (exemples Python) et `courses/python/NumpyBenchmark.tsx` (mesure NumPy contre Python pur).
- **Mêmes moteurs sous Node pour les tests** : `lib/lessons/python-node.ts` charge le Pyodide et les roues de `public/vendor` sans Worker ni réseau, `sql-node.ts` fait de même avec sql.js. C'est ce qui permet d'exécuter chaque exemple et chaque corrigé des cours dans `npm test`.

Point de sécurité à connaître : les workers Python et SQL sont de même origine que le site et ne sont pas isolés comme l'iframe JavaScript (pas de `sandbox`, pas de politique propre). La Content-Security-Policy du site est une balise `<meta>` du document ; elle ne s'applique pas à un worker chargé par URL (le `CHANGELOG.md` consigne qu'une CSP envoyée en en-tête par le serveur bloquait Python et SQL, ce que la balise `<meta>` ne fait pas). Le code d'un visiteur s'exécute sur sa propre machine, mais rien dans le dépôt ne l'empêche d'utiliser les API disponibles dans un worker de cette origine, `fetch` compris (non testé).

### PWA et hors ligne

- `src/main.tsx` enregistre `sw.js` (portée `BASE_URL`) uniquement en production ; en développement, il désinscrit tout worker résiduel. Une mise à jour téléchargée est proposée par un toast « Actualiser » ; le worker n'est activé qu'après le message `SKIP_WAITING`, sauf pour remplacer l'ancien worker de caches `-v1`.
- `public/sw.js` : cache `ds-explorer-<BUILD_ID>` recréé à chaque build (les anciens sont supprimés à l'activation) et cache `ds-explorer-vendor-v3` (constante `VENDOR_CACHE`) qui survit aux déploiements (les dossiers de `vendor/` portent le numéro de version).
  - navigation : réseau d'abord, puis `index.html` mis en cache, puis `offline.html` ;
  - `vendor/` : cache d'abord, dans le cache dédié ;
  - `assets/` (fichiers hachés de Vite) : cache d'abord ;
  - autres ressources de même origine : réponse du cache puis mise à jour en arrière-plan ;
  - une réponse HTML n'est jamais mise en cache sous l'URL d'une ressource.
- Changer la liste des paquets Python sans changer la version de Pyodide ne change pas le nom des dossiers de `vendor/` : incrémenter le suffixe de `VENDOR_CACHE` pour que les visiteurs de retour ne gardent pas un ancien `pyodide-lock.json` (déduit du code, non testé).
- `src/lib/pwa-install.ts` capture `beforeinstallprompt` dès le démarrage (la Navbar est remontée à chaque page) ; `PWAInstallButton` l'affiche, avec des instructions pour iOS.
- Pré-cache à l'installation : le shell de l'application, `offline.html`, `offline.js`, `manifest.json`, `favicon.svg` et une icône. Hors ligne, l'application ne retrouve que ce qui a déjà été chargé : les fichiers des pages visitées (chargés à la demande) et les moteurs une fois téléchargés (le noyau à la première exécution de code, chaque bibliothèque quand un code l'importe ; 56 Mo en tout). Les liens externes exigent le réseau.

### Thème clair, sombre, système

1. `index.html` charge `public/theme-init.js` avant tout le reste : il lit `ds-explorer-theme` et pose la classe `light` ou `dark` sur `<html>` avant le premier affichage (pas d'éclair clair). Script externe, car la CSP interdit les scripts en ligne. Sa valeur par défaut (`DEFAULT_THEME`, `light`) doit rester égale à `defaultTheme` de `<ThemeProvider>` dans `App.tsx`.
2. `ThemeProvider` (`components/theme`) lit et écrit la préférence par `lib/storage`, suit `prefers-color-scheme` en direct pour le choix « system », met à jour `<html>` et `<meta name="theme-color">`.
3. `ThemeToggle` (dans la Navbar) propose Clair, Sombre, Comme l'appareil.
4. `tailwind.config.ts` : `darkMode: ["class"]`. Les variables CSS de `src/index.css` (`:root`, `.dark`) pilotent les composants shadcn.
5. `tailwind/dark-palette.ts` traite les classes de couleur fixes des cours (`bg-white`, `bg-blue-50`, `text-gray-700`, `from-blue-50`...) : il lit `src/` à chaque build et émet la règle `.dark` équivalente (échelle inversée de la même teinte), plus des règles pour les graphiques Recharts. Aucun fichier de cours n'est modifié. Les couleurs saisies en dur (`style={{ ... }}`, hexadécimal dans un graphique) ne sont pas adaptées.
6. `tailwind/dynamic-colors.ts` déclare les teintes et nuances des classes construites à l'exécution (`bg-${couleur}-50`), conservées par la safelist et adaptées au mode sombre. Pour un nouveau gabarit dynamique, ajouter sa couleur ou sa nuance.
7. `src/config/theme.test.ts` vérifie l'accord entre `theme-init.js`, `App.tsx`, `use-theme.ts` et `ThemeProvider.tsx` (thème par défaut, clé, valeurs acceptées, classes, requête média, ordre des scripts dans `index.html`).

### Stockage local

Tout passe par `src/lib/storage.ts` (ne lève jamais d'exception : stockage bloqué, quota dépassé, JSON corrompu), sauf deux modules qui lisent `sessionStorage` directement. Clés utilisées au moment de la rédaction :

| Clé | Contenu | Défini dans |
| --- | --- | --- |
| `ds-explorer-theme` | Thème choisi | `hooks/use-theme.ts` |
| `course-progress-<id du cours>` | Statut et notes par module, projet ou étude de cas. Les 10 cours rédigés utilisent l'`id` de leur `LessonCourse` (`python-basics`, `math-intro`...), les projets guidés `projects` | `hooks/use-course-progress.ts` |
| `quiz-attempts-v1` | Tentatives de quiz (100 au plus) | `lib/quiz-storage.ts` |
| `blog-favorites-v1` | Articles favoris | `hooks/use-blog-favorites.ts` |
| `code-editor-workspace-v1`, `code-editor-autosave` | Fichiers de l'éditeur et réglage de sauvegarde | `fundamentals/programming/CodeEditor.tsx` |
| `challenge-progress-v2` | Défis de programmation (auto-évaluation) ; l'ancienne clé `challenge-progress` est supprimée au chargement | `fundamentals/programming/InteractiveChallenges.tsx` |
| `ds-bookmarks`, `ds-completed`, `ds-user-level` | Ressources de la section programmation | `fundamentals/programming/ResourcesSection.tsx` |
| `math-intro-completed`, `math-intro-progress-migrated` | Ancienne progression du cours de mathématiques, lue une seule fois puis reprise dans `course-progress-math-intro` ; l'indicateur évite de recommencer | `lib/progress-migration.ts` |
| `supervised-learning-tab` | Onglet mémorisé (`usePersistedTab`) | `machinelearning/courses/SupervisedLearningCourse.tsx` |
| `pwa-banner-dismissed` | Bandeau d'installation fermé | `ui/pwa-install-button.tsx` |
| `scroll-positions` (sessionStorage) | Positions de défilement par entrée d'historique (50 au plus) | `lib/scroll-positions.ts`, utilisé par `ScrollManager` et `ProgressiveSections` |
| `glossary-visible-count` (sessionStorage) | Nombre de fiches du glossaire affichées, pour retrouver la position au retour | `lib/glossary-batches.ts` |

Les stores partagés (`use-course-progress`, `quiz-storage`, `use-blog-favorites`) utilisent `useSyncExternalStore` et se resynchronisent entre onglets par l'événement `storage`. Un test (`src/lib/storage.test.ts`) vérifie que deux modules n'utilisent jamais la même clé pour des données différentes en lisant les constantes `const XXX_KEY = '...'` du code : respecter ce motif de déclaration.

### Sources des chiffres affichés

`src/components/ui/source-note.tsx` affiche « Source : ... , consulté le ... » sous un chiffre du monde réel (enquête, statistique de marché). Il est utilisé dans 11 composants : `IntroductionSection` (préparation des données), `DataProcessingSection` (traitement des données, `/fundamentals`), `LanguageComparison`, `ProgrammingIntro` et `PythonMasterclass` (programmation), `CareersSection` et `HistorySection` (introduction), `DataProcessingTools`, `MLFrameworks` et `ProgrammingTools` (outils), `DatabasesIntroSection` (bases de données). Les détails de vérification sont dans `docs/SOURCES.md`. Dates de consultation utilisées dans le code : « 1er octobre 2026 » (13 fois) et « 5 octobre 2026 » (2 fois). Les chiffres calculés par le site lui-même (jeux d'exemple à graine fixe, quiz, progression, résultats des exemples de cours) ne portent pas de source : ils sont réellement calculés.

### Tests

- **Outil** : Vitest 5 (`npm test` = `vitest run`, `npm run test:watch` = `vitest`). Configuration dans `vitest.config.ts` : environnement `jsdom`, fichiers `src/**/*.test.{ts,tsx}`, `restoreMocks: true`, alias `@` vers `src/`, constantes `__PYODIDE_VERSION__` et `__SQLJS_VERSION__` définies comme dans `vite.config.ts`. Le test de fumée des routes (`src/routes.smoke.test.tsx`) est exclu de `npm test` et lancé par `npm run test:smoke` (`vitest.smoke.config.ts`). Aucune bibliothèque de test de composants : les composants se rendent avec `react-dom/client` et `act`.
- **Emplacement** : un test se place à côté du code testé (`src/lib/storage.ts` et `src/lib/storage.test.ts`). Les tests ne sont pas livrés. Au 9 octobre 2026 : 45 fichiers de test (44 pour `npm test`, plus le test de fumée), comptés avec `git ls-files 'src/**/*.test.*'` ; relever le nombre de tests avec `npm test`.
- **Trois familles** :
  - tests de logique : `src/lib/` (`storage`, `quiz-storage`, `quiz-shuffle`, `sanitize`, `sample-datasets`, `format-duration`, `contrast`, `answer-match`, `glossary-batches`, `glossary-markdown`, `scroll-key`, `progress-migration`, `runner/worker-client`, `runner/index`, `runner/python-setup`, `lessons/check`, `lessons/duration`, `lessons/typography`), `src/hooks/use-sidebar-bounds.test.ts`, `src/data/projects.test.ts`, `quizData.test.ts`, `blog.test.ts`, `data-quality-demos.test.ts`, et des tests de composants (`CorrelationHeatmap`, `NewsArticleCard`, `GlossaryText`, `ProgressiveSections`, `deferred-chart`, `LessonWidget`, `ConditionalProbabilitySection`) ;
  - tests garde-fous qui lisent le code source : `src/config/page-meta.test.ts` (routes, titres, descriptions, redirections, via `scripts/collect-routes.ts`), `brand.test.ts` (nom du site, licence, `index.html`, manifeste, modèles de pages de `vite.config.ts`), `theme.test.ts`, `illustrations.test.ts`, `gradient-text.test.ts`, `internal-links.test.ts`, `jsx-spacing.test.ts`, `source-link.test.ts`, `src/lib/code-snippets.test.ts`, `latex-sources.test.ts`, `src/data/glossary/claims.test.ts`, `dictionaries.test.ts`, et la partie « clés de stockage » de `storage.test.ts` ;
  - tests des cours sur les vrais moteurs : `src/data/lessons/lessons.test.ts` (SQL, sql.js sous Node) et `lessons-python.test.ts` (Python, Pyodide sous Node, avec les roues de `public/vendor`, d'où le `pretest` qui lance `runtimes:sync`). Chaque exemple s'exécute, chaque corrigé réussit, chaque point de départ d'exercice échoue.
- Les tests du client de worker (`worker-client.test.ts`) utilisent un faux `Worker` ; ce qui n'est pas couvert automatiquement : l'exécution dans un vrai navigateur (Web Workers, WebAssembly), les débordements horizontaux, le service worker et les images binaires.
- L'inventaire fichier par fichier et la manière de lancer un seul test sont dans `readme_dev.md` (section 4).

## Particularités et pièges de structure

- Deux composants portent le nom `SupervisedLearningCourse` : `src/components/machinelearning/courses/SupervisedLearningCourse.tsx` (contenu en sections, route `/machine-learning/supervised`) et `src/pages/courses/machine-learning/SupervisedLearningCourse.tsx` (cours rédigé en 8 modules, route `/courses/machine-learning/supervised-learning`).
- Le calcul intégral n'a qu'une page (`pages/fundamentals/math-stats/IntegralCalculus.tsx`) ; l'ancienne URL `/courses/math-stats/integral-calculus` redirige vers `/fundamentals/math-stats/integral-calculus`. Le cours rédigé `math-intro` (module 5) traite aussi des intégrales : ce sont deux contenus distincts.
- `src/data/data-preparation-enhanced-definitions.ts` et `src/components/fundamentals/definitions/data-preparation-enhanced-definitions.ts` sont deux fichiers différents de même nom ; `src/data/glossary/dictionaries.ts` importe les deux (la version riche remplace la version courte pour les termes communs).
- `src/types/quiz.ts` contient plus de types que le site n'en utilise (classement, notifications, défis) : ce sont des types seuls, sans fonctionnalité associée.
- Les icônes des catégories de quiz sont choisies par l'identifiant de la catégorie (`iconMap` de `components/quiz/QuizCategoriesSection.tsx`, repli `Brain`), pas par le champ `icon` de `quizData.ts`, que ces composants ne lisent pas. La table est indexée par `mathematics` alors que l'identifiant réel est `math-stats`.
- `src/components/ui/chart.tsx` (shadcn) injecte du CSS par `dangerouslySetInnerHTML` à partir de la configuration du graphique ; ce n'est pas du contenu externe et il ne passe pas par `sanitizeHtml`. Le seul autre usage est l'article de blog, qui passe bien par `sanitizeHtml`. C'est aussi le seul fichier qui utilise `ResponsiveContainer` sans passer par `DeferredResponsiveContainer`.
- `CourseHeroTemplate.tsx` et `CourseModuleTemplate.tsx` ne sont importés par aucune page depuis la conversion des cours en leçons (`LessonCoursePage` les a remplacés). Ils restent disponibles pour un futur cours qui ne serait qu'un plan de modules (`status: "plan"` dans le catalogue) ; les supprimer est une décision de l'auteur.
- `tsc` (`npm run typecheck`) ne couvre que `src/` (`tsconfig.app.json`) ; `vite.config.ts` a son propre `tsconfig.node.json`, mais `scripts/`, `tailwind/` et `vitest.config.ts` ne sont inclus dans aucun des deux. ESLint, lui, lint tous les `.ts` et `.tsx`.
