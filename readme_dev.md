# Guide du développeur

Ce guide s'adresse à toute personne qui travaille sur le code de « Explorons la Data Science » : installer le projet, lancer les contrôles, ajouter du contenu, livrer sur hylst.fr. Chaque chemin, commande et nombre ci-dessous a été relevé dans le dépôt (branche `audit/securite-pwa-routage`, octobre 2026).

Documents voisins :

- [structure.md](structure.md) : arborescence commentée et flux importants (routage, build statique, exécution de code, PWA, thème, stockage).
- `features.md` : état des fonctionnalités par section ; `docs/SOURCES.md` : registre des chiffres externes ; `docs/PERFORMANCE_GUIDE.md` : tailles du build et scores Lighthouse (avec leurs dates) ; `docs/COMPONENT_DOCUMENTATION.md` : composants d'interface partagés.
- `CHANGELOG.md` : historique.

## 1. Prérequis

| Outil | Version | Origine de l'information |
| --- | --- | --- |
| Node.js | 22.13 ou plus récent en 22.x, 24.x, ou 26 et plus. Version de référence de ce guide : 24.14.1 | Le champ `engines` de `package.json` déclare `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0`, l'intersection des contraintes de Vitest 5.0.3 (`^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`), jsdom 29.1.1 (`^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0`) et Vite 7.3.6 (`^20.19.0 \|\| >=22.12.0`). Node 22.12 satisfait Vitest et Vite mais pas jsdom |
| npm | Celui fourni avec Node (11.11.0 avec la version de référence) | `package-lock.json` est suivi par git |
| Git | Une version récente | Dépôt git |
| Réseau | Nécessaire au premier `npm run dev` ou `npm run build` | `scripts/sync-runtimes.mjs` télécharge les roues Python depuis `https://cdn.jsdelivr.net/pyodide/v<version>/full/` (empreintes SHA-256 vérifiées), puis les garde dans `.cache/pyodide-wheels` |
| Espace disque | Environ 56 Mo pour `public/vendor` (Pyodide 314.0.7 et sql.js 1.14.2) et 35 Mo pour `.cache` (mesurés le 9 octobre 2026) en plus de `node_modules` | `du -sh public/vendor .cache` |
| Navigateur | Récent (WebAssembly, Web Workers de type module) pour tester l'exécution de code | `src/lib/runner` |

Pas de variable d'environnement à définir : l'application n'appelle aucun serveur, et `scripts/verify-dist.mjs` refuse tout build qui contiendrait une référence Supabase ou une variable `VITE_*`.

## 2. Installation et premier lancement

Depuis la racine du dépôt :

```bash
npm install
npm run dev
```

- `npm run dev` exécute d'abord `scripts/sync-runtimes.mjs` (hook `predev`) : le script copie Pyodide et sql.js depuis `node_modules` vers `public/vendor/pyodide-<version>/` et `public/vendor/sql-js-<version>/`, télécharge les roues numpy, pandas, scikit-learn, matplotlib et leurs dépendances, puis écrit `public/vendor/NOTICE.txt`. Ces dossiers et `.cache/` sont ignorés par git. Les lancements suivants sont rapides et fonctionnent hors ligne tant que `.cache/` existe.
- Le serveur écoute sur le port 8080 (`vite.config.ts`, hôte `::`). Si le port est occupé, Vite en choisit un autre : lire l'adresse affichée dans le terminal.
- En développement, le service worker n'est pas enregistré (`src/main.tsx` désinscrit même les anciens) et la Content-Security-Policy n'est pas injectée : ces deux éléments n'existent que dans un build. Pour les tester, construire puis lancer `npm run preview`.
- `npm test` passe par `sync-runtimes` (hook `pretest`) parce que le test des cours Python charge le Pyodide et les roues de `public/vendor`, sans réseau ; `npm run lint` et `npm run typecheck` n'en ont pas besoin. Un `npx vitest run <fichier>` lancé directement ne passe pas par le hook : lancer d'abord `npm run runtimes:sync` si `public/vendor` manque. Les tests ont aussi besoin de `node_modules` : `vitest.config.ts` lit les versions de `pyodide` et `sql.js` dans leurs `package.json`.

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
| `npm test` | `vitest run` | Précédée de `sync-runtimes`. Une exécution, tous les tests de `src/` hors test de fumée, y compris l'exécution de chaque exemple et de chaque corrigé des cours sur les vrais moteurs |
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

**État mesuré** : 45 fichiers de test au 9 octobre 2026 (`git ls-files 'src/**/*.test.*'`), dont `src/routes.smoke.test.tsx`, lancé à part par `npm run test:smoke`. Le nombre de tests évolue avec le code : relever celui de `npm test` plutôt que de recopier un chiffre ; le résultat à retenir est zéro échec avant toute livraison. Le test des cours Python charge Pyodide (environ 7 s) puis exécute chaque exemple et chaque corrigé : c'est de loin le plus long de `npm test`.

**Inventaire** (45 fichiers, par famille) :

| Famille | Fichiers | Ce qu'ils garantissent |
| --- | --- | --- |
| Routes, métadonnées, identité | `src/config/page-meta.test.ts` | Lit le code source (`scripts/collect-routes.ts`) : chaque route canonique a un titre et une description ; longueurs (titre 20 à 38 caractères sans le nom du site, description 110 à 160) ; unicité ; absence de tiret cadratin ou demi-cadratin ; `PAGE_META` sans route orpheline ; cohérence de `LEGACY_REDIRECTS` (cible existante, pas de chaîne, pas de doublon, pas de page réelle masquée) |
| | `src/config/brand.test.ts` | L'ancien nom « Data Science Explorer » n'apparaît plus (exceptions listées dans le test) ; `index.html`, `public/manifest.json` et `public/offline.html` portent `SITE_NAME` ; les modèles de page 404 et de redirection de `vite.config.ts` utilisent `SITE_NAME` ; licence identique dans `package.json`, `site.ts` et `LICENSE` ; sous-chemin `/data_science_explorer/` inchangé |
| | `src/config/internal-links.test.ts`, `source-link.test.ts` | Chaque lien interne écrit dans le code mène à une route canonique (jamais à une redirection) ; le site n'affiche aucune adresse du dépôt de code (`SOURCE_URL` reste `null`) |
| | `src/config/theme.test.ts` | `DEFAULT_THEME` de `public/theme-init.js` égal à `defaultTheme` de `<ThemeProvider>` dans `App.tsx` ; même clé de stockage (`THEME_STORAGE_KEY`) ; mêmes valeurs acceptées, mêmes classes `light` et `dark`, même requête média ; `theme-init.js` chargé avant `src/main.tsx` dans `index.html` |
| Présentation | `src/config/illustrations.test.ts` | Les trois SVG animés de `public/svg/cards/` existent, sont bien formés, n'exécutent aucun script, n'appellent aucun tiers, coupent leurs animations sous `prefers-reduced-motion`, sont tous utilisés par l'accueil ; chaque article du blog a son image WebP (vrai fichier, ni vide ni lourd) affichée comme décorative avec dimensions ; plus aucune photographie livrée |
| | `src/config/gradient-text.test.ts`, `jsx-spacing.test.ts` | La règle globale d'interligne des textes à dégradé est en place ; aucun espace ne disparaît entre du texte et une balise en ligne en fin de ligne JSX |
| Cours rédigés | `src/data/lessons/lessons.test.ts`, `lessons-python.test.ts` | Pour chaque cours : structure des modules, quiz, markdown sans tableau ni lien, formules KaTeX ; chaque exemple s'exécute sur sql.js ou Pyodide ; chaque corrigé réussit ; chaque point de départ d'exercice échoue (voir 5.13) |
| | `src/lib/lessons/check.test.ts`, `duration.test.ts`, `typography.test.ts` | Comparaison des résultats SQL, somme des durées de modules, espaces insécables français hors du code |
| | `src/lib/progress-migration.test.ts`, `src/components/courses/lessons/LessonWidget.test.tsx` | Reprise unique de l'ancienne progression du cours de mathématiques ; affichage des composants interactifs des leçons |
| | `src/lib/code-snippets.test.ts`, `src/lib/latex-sources.test.ts`, `src/lib/answer-match.test.ts` | Pas de `\n` simple dans un gabarit d'extrait Python, pas d'alias pandas supprimé de pandas 3 ; pas de commande LaTeX mal échappée ; normalisation des réponses libres de mathématiques |
| Stockage, quiz, projets | `src/lib/storage.test.ts` | Le module ne lève jamais d'exception (stockage bloqué, JSON corrompu), validateurs, et deux modules n'utilisent jamais la même clé de stockage (lecture des constantes `const XXX_KEY = '...'`) |
| | `src/lib/quiz-storage.test.ts`, `quiz-shuffle.test.ts`, `src/data/quizData.test.ts` | Enregistrement des tentatives, données corrompues, statistiques, séries, succès ; mélange uniforme ; banque de questions (identifiants uniques, bonnes réponses) |
| | `src/data/projects.test.ts`, `blog.test.ts`, `data-quality-demos.test.ts` | Données des projets et filtres ; articles du blog (corps, fiches, pas de faux témoignage) ; démonstrations de qualité des données calculées |
| Moteurs d'exécution | `src/lib/runner/worker-client.test.ts`, `index.test.ts`, `python-setup.test.ts` | File d'exécution, délai (décompte à partir du message `started`), arrêt du worker, échec de chargement, avec un faux `Worker` ; `isRunnable` et délais par langage ; réglage du moteur Python |
| Sécurité, calculs | `src/lib/sanitize.test.ts`, `sample-datasets.test.ts`, `format-duration.test.ts`, `contrast.test.ts` | `sanitizeHtml` retire les scripts ; générateurs à graine fixe ; formatage des durées ; rapport de contraste WCAG |
| Défilement et affichage par morceaux | `src/lib/scroll-key.test.ts`, `src/components/layout/ProgressiveSections.test.tsx`, `src/components/ui/deferred-chart.test.tsx`, `src/hooks/use-sidebar-bounds.test.ts`, `src/lib/glossary-batches.test.ts` | Clé de position de défilement ; nombre de sections affichées d'emblée ; boîte réservée puis graphique dessiné à l'approche de l'écran ; bornes de la barre latérale ; lots du glossaire |
| Glossaire | `src/data/glossary/claims.test.ts`, `dictionaries.test.ts`, `src/lib/glossary-markdown.test.ts`, `src/components/glossary/GlossaryText.test.tsx` | Aucun chiffre inventé attribué à une organisation ; un terme survolé dans un cours est retrouvable dans le glossaire ; rendu du markdown des définitions |
| Composants | `src/components/fundamentals/data-preparation/CorrelationHeatmap.test.tsx`, `src/components/community/NewsArticleCard.test.tsx`, `src/pages/fundamentals/math-stats/probability/components/ConditionalProbabilitySection.test.tsx` | La matrice de corrélation est calculée (coefficient de Pearson) ; mots longs et lien externe d'une actualité ; calcul détaillé de chaque issue de l'arbre de probabilités |
| Test de fumée | `src/routes.smoke.test.tsx` (`npm run test:smoke`) | Chaque route canonique et chaque onglet s'affichent sans erreur ; un seul fil d'Ariane par page ; chaque `href="#x"` a sa cible ; pas d'`id` en double ; le test attend la fin des sections en attente (`data-sections-pending`) |

**Tests garde-fous qui lisent le code source.** `page-meta.test.ts`, `brand.test.ts`, `theme.test.ts`, `storage.test.ts`, `internal-links.test.ts`, `code-snippets.test.ts` et `latex-sources.test.ts` analysent des fichiers avec des expressions régulières. Si l'un d'eux échoue après une modification qui semble anodine, le message nomme la route, le fichier ou la ligne en cause (`brand.test.ts` donne `fichier:ligne`). Ne pas contourner le test : soit corriger le code, soit, si le format du code a vraiment changé, adapter l'expression régulière du test et celle de `scripts/collect-routes.ts` ensemble. Ces fichiers normalisent les fins de ligne (`\r\n` en `\n`) avant l'analyse, donc un dépôt en CRLF sous Windows ne pose pas de problème.

**Ce qui n'est pas testé automatiquement** : le rendu visuel, les débordements horizontaux (à vérifier à la main à 390, 768, 1024 et 1280 px), l'exécution dans un vrai navigateur (les tests du client de worker utilisent un faux `Worker`, mais les cours sont exécutés par le vrai Pyodide et le vrai sql.js sous Node), les hooks de progression (`use-course-progress`, `useQuiz`, `use-blog-favorites`, `use-persisted-tab`), le service worker et les logos et icônes binaires.

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

Un cours est un objet de données (`src/data/lessons/<cours>/`) affiché par une page générique ; écrire son contenu est décrit en 5.13. Mise en place dans le site :

1. Créer la page dans `src/pages/courses/<catégorie>/<NomDuCours>.tsx` : un export par défaut d'environ 25 lignes qui rend `LessonCoursePage` avec le cours. Modèle : `pages/courses/nlp/NaturalLanguageProcessing.tsx`.
2. Dans `src/components/routing/CourseRouter.tsx`, ajouter l'import différé et la route, avant `path="*"` :

   ```tsx
   const MonCours = React.lazy(() => import('../../pages/courses/ma-categorie/MonCours'));
   // ...
   <Route path="ma-categorie/mon-cours" element={<MonCours />} />
   ```

   Le chemin est relatif (sans `/courses/`), entre guillemets doubles, commence par une lettre minuscule et ne contient ni `*` ni `:` : `collect-routes.ts` lit `CourseRouter.tsx` avec `path="([a-z][^"*:]*)"` et préfixe `/courses/`. Un cours inconnu affiche `NotFound`.
3. Ajouter `"/courses/ma-categorie/mon-cours"` dans `src/config/page-meta.ts` (mêmes règles qu'en 5.1).
4. Pour que le cours figure au catalogue (`/courses`), dans les cartes de l'accueil, dans la liste des ressources et dans la page de mathématiques, ajouter une entrée dans `src/data/course-catalog.ts` (`COURSE_CATALOG`) : catégorie, titre, description, `href`, `status` (`"redige"` si les leçons sont écrites, `"plan"` si le cours n'est qu'une liste de modules : la carte porte alors le badge « Plan du cours »). Niveau, durée et nombre de modules se saisissent à la main et doivent reprendre ce qu'affiche la page du cours (le nombre de modules est celui de `LessonCourse.modules`), jamais une estimation. Pour le mettre en avant sur l'accueil, ajouter son identifiant à `FEATURED_COURSE_IDS`.
5. Ajouter l'illustration de la carte : `public/img/courses/<id du cours>.webp` (800 x 450, voir `public/img/CREDITS.md`) ; `lib/course-image.ts` la retrouve par l'identifiant (les trois cours mis en avant ont à la place un SVG animé de `public/svg/cards/`, déclaré dans `ANIMATED_COURSE_IMAGES`).
6. La progression de l'apprenant est enregistrée sous la clé `course-progress-<id du LessonCourse>` par `src/hooks/use-course-progress.ts` : rien à brancher, `LessonModuleView` le fait.
7. Si une ancienne URL du cours doit continuer à fonctionner, voir 5.3.

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
4. Le HTML passe par `sanitizeHtml` (DOMPurify) et se met en forme avec la classe `rich-text`. Ne pas utiliser `prose`. Ne pas ajouter de script ni d'image distante. L'illustration de l'article est le fichier `public/img/blog/<id>.webp` (800 x 450, style plat sans texte ni personne ; le test `illustrations.test.ts` échoue s'il manque ou s'il est vide) : voir `public/img/CREDITS.md` pour les consignes de génération en local.
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

La page `/glossary` lit `glossaryTerms`, agrégé par `src/data/glossary/index.ts` à partir de huit fichiers : `fundamentals.ts`, `tools.ts`, `statistics.ts`, `machine-learning.ts`, `deep-learning.ts`, `nlp.ts`, `mlops.ts`, `evaluation.ts`, puis des termes de `dictionaries.ts` qui ne figurent pas déjà dans ces fichiers (229 entrées au 10 octobre 2026, comptées en important `index.ts` : 190 des huit fichiers et 39 des dictionnaires ; un simple comptage de lignes `term:` donnerait un nombre plus bas). Deux particularités : `tools.ts` ne contient pas d'entrées écrites à la main, il les dérive des définitions de `src/components/fundamentals/definitions/` (`programming-definitions.ts` et `dataviz-definitions.ts`) ; `dictionaries.ts` fait de même avec les définitions de statistiques, de traitement des données et de préparation des données (`from-definition.ts` convertit une définition survolable en entrée), si bien qu'un terme survolé dans un cours est toujours retrouvable dans le glossaire (testé par `dictionaries.test.ts`).

1. Choisir le fichier du domaine et ajouter un objet `GlossaryEntry` (type dans `src/data/glossary/types.ts`) :

   ```ts
   {
     term: "Nom du terme",
     description: "Explication ...",
     category: "statistiques",
     icon: "BarChart3"
   },
   ```

   `category` appartient à l'union `GlossaryCategory` de `types.ts`. `icon` est un nom d'icône lucide-react connu de `src/components/glossary/GlossaryCard.tsx` (sinon l'icône `BookOpen` s'affiche). Champs facultatifs : `shortDefinition`, `longDefinition`, `examples`, `relatedTerms`, `source`, `sourceUrl`, `domain`, `level`, `synonyms`, `englishTerm`. Une définition longue s'écrit en markdown léger (titres en gras sur leur propre ligne, puces, listes numérotées, blocs de code) que `lib/glossary-markdown.ts` prépare ; `claims.test.ts` refuse un chiffre attribué à un cabinet d'étude sans source.
2. Un nouveau fichier de domaine doit être importé, ajouté au tableau `glossaryTerms` et à la liste d'exports de `index.ts`. Une nouvelle catégorie s'ajoute à `GlossaryCategory`, à `CATEGORY_INFO` (`types.ts`) et aux tables d'affichage `getCategoryDisplayName` de `src/components/glossary/GlossaryExplorer.tsx` (filtre) et de `GlossaryCard.tsx` (pastille de la fiche) ; sans cela, l'identifiant brut s'affiche.
3. Ne rien inventer : toute définition chiffrée ou datée cite sa source.
4. Pour un terme survolable dans le texte d'un cours, c'est un autre mécanisme : le composant `GlossaryTerm` (`src/components/ui/glossary-term.tsx`) reçoit un objet `GlossaryTermDefinition` (`term`, `shortDefinition`, `longDefinition`, ...). Les définitions vivent dans `src/data/glossary/ml-definitions.ts` (28 entrées indexées par identifiant, utilisées par les sections de Machine Learning), `src/data/data-preparation-enhanced-definitions.ts` (préparation des données, version courte) et `src/components/fundamentals/definitions/` (programmation, dataviz, statistiques, traitement des données, préparation des données en version riche). Ajouter l'objet au fichier qui correspond au cours, puis le passer à `GlossaryTerm`. Attention : `src/components/fundamentals/definitions/data-preparation-enhanced-definitions.ts` porte le même nom que celui de `src/data/` mais ce sont deux fichiers différents ; `dictionaries.ts` les importe tous les deux (la version riche remplace la version courte pour les 18 termes communs). Les cours rédigés (`src/data/lessons/`) n'emploient pas `GlossaryTerm` : leur texte est du markdown simple.

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
- `SourceNote` est utilisé aujourd'hui dans 11 composants (liste dans `structure.md`). Le registre `docs/SOURCES.md` recense chaque chiffre externe, sa source, la date de consultation et son niveau de vérification (« page lue », « extrait de recherche » ou « non vérifié ») : y ajouter une ligne pour tout nouveau chiffre, avec le niveau réellement atteint.
- Pour les chiffres calculés par le site lui-même (statistiques sur les jeux d'exemple, quiz, progression, résultats des exemples de cours), aucune citation : ils viennent de `src/lib/sample-datasets.ts`, du stockage local ou du moteur d'exécution et sont réellement calculés.
- Dans un cours rédigé, le markdown n'a pas de lien (testé) : une référence s'écrit « Auteur, année » dans le texte et se consigne dans `docs/SOURCES.md` (section « Références citées dans les autres cours rédigés ») avec son niveau de vérification.

### 5.8 Ajouter un paquet Python au runner

L'éditeur et les cours exécutent Python avec Pyodide ; seuls les paquets embarqués sont disponibles (numpy, pandas, scikit-learn, matplotlib, statsmodels et leurs dépendances). Le verrou de Pyodide 314.0.7 (`node_modules/pyodide/pyodide-lock.json`) propose d'autres paquets que le site ne livre pas, par exemple xgboost, lightgbm, beautifulsoup4, lxml, networkx, sympy, nltk et altair ; il n'a ni seaborn, ni plotly, ni spacy, ni tensorflow, ni torch. Le verrou ne donne pas les tailles : mesurer avec `du -sk public/vendor` avant et après.

1. Vérifier que le paquet existe dans `node_modules/pyodide/pyodide-lock.json` : sinon `sync-runtimes.mjs` s'arrête avec `Paquet inconnu dans pyodide-lock.json`.
2. Ajouter son nom au tableau `PYTHON_PACKAGES` de `scripts/sync-runtimes.mjs`. Les dépendances déclarées dans le verrou sont ajoutées automatiquement.
3. Relever la licence de chaque nouvelle roue (fichier `METADATA`) et l'ajouter à `PACKAGE_LICENSES` dans le même script, sous la forme `nom: ["licence", "adresse du projet"]`, **pour le paquet et pour chacune de ses nouvelles dépendances**. Le script refuse un paquet absent de la liste (`Licence à vérifier ... puis à ajouter à PACKAGE_LICENSES`). Vérifier la compatibilité avec la licence du site (AGPL-3.0-or-later) ; les composants tiers gardent leur licence et sont recensés dans `public/vendor/NOTICE.txt`, régénéré par le script (ne pas l'éditer).
4. Ajouter le même nom à `PROVIDED_PACKAGES` dans `src/lib/runner/python.worker.ts` (liste chargée quand le code utilise `importlib.import_module` ou `__import__`).
5. Lancer `npm run runtimes:sync`, puis mesurer le poids : `du -sh public/vendor` (56 Mo avec les paquets actuels ; statsmodels et patsy en ont ajouté 8). Chaque Mo ajouté est téléchargé par les visiteurs qui exécutent du code.
6. Mettre à jour les textes qui énumèrent les paquets : `src/components/fundamentals/programming/CodeEditor.tsx` (texte d'aide), `src/pages/TermsOfService.tsx` (composants tiers), `README.md`.
7. Tester dans l'éditeur de `/fundamentals/programming` : `import <module>` puis un calcul réel. Les tests des cours (`lessons-python.test.ts`) utilisent les mêmes roues par `public/vendor` : les relancer, car ils chargeront le nouveau paquet.
8. Point d'attention, non testé : `public/sw.js` sert `vendor/` en « cache d'abord » dans un cache nommé `ds-explorer-vendor-v3` (constante `VENDOR_CACHE`, passée de `v2` à `v3` à l'ajout de statsmodels), dont le nom ne change pas quand on ajoute un paquet sans changer la version de Pyodide (les dossiers portent le numéro de version de Pyodide, pas la liste des paquets). Un visiteur qui a déjà téléchargé les moteurs risque de garder l'ancien `pyodide-lock.json`. Dans ce cas, incrémenter `VENDOR_CACHE` dans `public/sw.js` (le worker supprime les autres caches à l'activation).

Pour alléger au contraire le site, retirer un nom de `PYTHON_PACKAGES` et de `PROVIDED_PACKAGES` : le module retiré lèvera `ModuleNotFoundError` dans l'éditeur et dans les cours qui l'importent (scikit-learn pèse environ 19 Mo mais la plupart des cours de machine learning en dépendent).

### 5.9 Changer l'identité du site

`src/config/site.ts` est la source unique pour le code de l'application et du build : `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_ORIGIN`, `SITE_BASE`, `SITE_URL`, `AUTHOR_NAME`, `AUTHOR_CREDIT`, `PLATFORM_URL`, `PLATFORM_LEGAL_URL`, `LEGAL_UPDATED`, `LICENSE_SPDX`, `LICENSE_NAME`, `LICENSE_FILE`, `NOTICE_FILE`, `SOURCE_URL`. Le fichier ne doit contenir que des imports relatifs et aucune API propre à Vite (il est exécuté par Node au build). Titres de pages, page 404, pages de redirection, sitemap, pied de page et pages légales en dérivent.

Quelques fichiers ne peuvent pas importer `site.ts` et répètent des valeurs ; `src/config/brand.test.ts` échoue s'ils divergent :

- `index.html` : `<title>` (égal à `HOME_TITLE`), `og:site_name`, `og:title`, `apple-mobile-web-app-title`, `description` (égale à `SITE_DESCRIPTION`) ;
- `public/manifest.json` : `name` et `short_name` ;
- `public/offline.html` : `<title>` ;
- `package.json` (champ `license`) et première ligne de `NOTICE.md` (`SPDX-License-Identifier: ...`) ; `LICENSE` reste le texte officiel de l'AGPL, sans modification.

Autres endroits qui citent le nom ou le sous-chemin sans être testés : le commentaire de `public/sw.js`, `scripts/verify-dist.mjs` (constantes `BASE` et `CANONICAL`), le nom du fichier `public/svg/data_science_explorer_apprentissage.svg`, le champ `name` de `package.json` et les documents du dépôt.

Identifiants volontairement **non renommés**, car les changer casserait des liens ou ferait perdre des données aux visiteurs : le sous-chemin `/data_science_explorer/` (épinglé par `brand.test.ts`), le préfixe de cache `ds-explorer-` du service worker et les clés `localStorage`, dont `ds-explorer-theme`.

Après un changement : `npm test` (il liste chaque occurrence fautive), puis `npm run build:hylst`.

### 5.10 Modifier le thème (clair, sombre, système)

- Le thème par défaut est écrit à deux endroits qui doivent rester égaux : `DEFAULT_THEME` dans `public/theme-init.js` et `defaultTheme` de `<ThemeProvider>` dans `src/App.tsx` (actuellement `light`). `theme.test.ts` le vérifie.
- La clé de stockage `ds-explorer-theme` est définie dans `src/hooks/use-theme.ts` (`THEME_STORAGE_KEY`) et relue par `theme-init.js`.
- Les classes de couleur fixes des cours (`bg-white`, `bg-blue-50`, `text-gray-700`, ...) sont adaptées au mode sombre automatiquement par `tailwind/dark-palette.ts` ; les classes construites à l'exécution (`bg-${couleur}-50`) doivent figurer dans `tailwind/dynamic-colors.ts` ; les couleurs écrites en dur (`style={{ ... }}`, hexadécimal dans un graphique) ne sont pas adaptées.

### 5.11 Livrer sur hylst.fr

La plateforme sert des fichiers statiques derrière Nginx, sans repli vers `index.html`. Lire d'abord `<notes de deploiement de la plateforme>` (protocole de la plateforme de l'auteur, non publié) ; les étapes ci-dessous valent pour tout hébergeur de fichiers statiques.

1. Contrôles : `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`. Facultatif : `npm run news:refresh` (instantané daté des actualités de la page Communauté, réseau requis).
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
5. Choisir le nom du dépôt distant. Le site n'affiche pas de lien vers le dépôt (`SOURCE_URL` vaut `null`, décision de l'auteur du 5 octobre 2026) : il propose le code « sur demande » par la page Contact. Renseigner `SOURCE_URL` dans `src/config/site.ts` afficherait de nouveau un lien dans le pied de page et les conditions d'utilisation. Chaque envoi est une décision de l'auteur : le script ne pousse jamais.

État au 5 octobre 2026 : le premier envoi est fait (https://github.com/Hylst/explorons_la_science_des_donnees, un commit, dossier local `explorons_la_science_des_donnees` à côté de ce dépôt). Pour publier une mise à jour : relancer l'export dans un nouveau dossier vide, copier son contenu sur le dossier du dépôt public en conservant son dossier `.git`, puis `git add -A`, un commit et `git push` depuis ce dossier (le script ne sait créer qu'un dépôt neuf).

La liste `EXCLUDE` et les remplacements de chemins sont en tête du script : les modifier pour changer ce qui est publié. Le script s'exclut lui-même de l'export, puisqu'il cite par construction les chemins qu'il retire.

### 5.13 Écrire ou modifier un cours au format des leçons

Les 10 cours du site et les 5 projets guidés ne sont pas des pages écrites en JSX : ce sont des **données** (`src/data/lessons/`), affichées par `src/components/courses/lessons/` et contrôlées par des tests qui exécutent chaque exemple et chaque corrigé sur les vrais moteurs (Pyodide pour Python, sql.js pour SQL). Pour qu'un cours reste exact, il suffit que ces tests passent.

**Les types** (`src/lib/lessons/types.ts`) :

```ts
export interface LessonCourse { id: string; modules: LessonModule[] }

export interface LessonModule {
  id: string;                 // stable : clé de la progression de l'apprenant
  title: string;
  duration: string;           // « 1 h 30 », « 3 h », « 45 min » ; affichée « (indicatif) »
  summary: string;
  objectives: string[];       // 2 au moins
  sections: LessonSection[];
  quiz: CourseQuizQuestion[]; // 3 au moins : { question, options, correct, explanation }
}
```

Une section (`LessonSection`) a un `kind` parmi :

| `kind` | Champs | Rôle |
| --- | --- | --- |
| `text` | `md` | Texte en markdown : intertitres `###`, listes, gras, `code`, blocs de code. Pas de tableau, pas de lien |
| `code` | `language` (`"sql"` ou `"python"`), `code`, `setup?`, `caption?` | Exemple modifiable et exécuté ; `setup` s'exécute avant, sans s'afficher (création des tables, chargement des données) |
| `exercise` | `language`, `prompt`, `starter`, `solution`, `setup?`, `hint?`, et selon le langage `test` (Python), `ordered?` et `columns?` (SQL) | Exercice vérifié par le moteur |
| `note` | `tone` (`"info"`, `"warning"`, `"tip"`), `md` | Encadré « À retenir », « Attention » ou « Astuce » |
| `widget` | `widget` (un nom du type `LessonWidget`) | Composant interactif chargé à la demande : banc d'essai NumPy, schémas animés du cours Python, figures SVG de `CourseFigures` |
| `equation` | `latex`, `caption?` | Formule rendue par KaTeX (chargé à la demande) |

**Créer un cours**

1. Créer le dossier `src/data/lessons/<cours>/` et, dedans, un fichier par module (`m1-<sujet>.ts`, `m2-...`). Chaque fichier exporte un `LessonModule`. Squelette :

   ```ts
   import type { LessonModule } from "@/lib/lessons/types";
   import { lines } from "../lines";

   export const moduleBases: LessonModule = {
     id: "bases",
     title: "Les bases",
     duration: "1 h 30",
     summary: "Une phrase qui dit ce que le module apprend.",
     objectives: ["Premier objectif", "Deuxième objectif"],
     sections: [
       { kind: "text", md: "### Un premier exemple\n\nTexte en markdown." },
       { kind: "code", language: "python", code: lines("total = 2 + 3", "print(total)") },
       {
         kind: "exercise",
         language: "python",
         prompt: "Calculez `total` et vérifiez qu'il vaut 5.",
         starter: lines("total = None"),
         solution: lines("total = 2 + 3"),
         test: lines("assert total == 5, \"total doit valoir 5\""),
         hint: "Une addition.",
       },
     ],
     quiz: [
       { question: "...", options: ["...", "..."], correct: 0, explanation: "Une explication de plus de vingt caractères." },
       // au moins trois questions
     ],
   };
   ```

2. Créer `src/data/lessons/<cours>/index.ts` qui exporte le `LessonCourse` (`export const monCours: LessonCourse = { id: "mon-cours", modules: [moduleBases, ...] }`). L'`id` du cours et ceux des modules sont des identifiants stables en minuscules séparées par des tirets (testé).
3. Les données partagées par plusieurs exemples (un jeu de données, des imports) vont dans un fichier du dossier (`data.ts`, voir `nlp/data.ts`) ou dans `src/data/lessons/datasets/`, écrites avec `lines(...)` et réutilisées dans les `code`, les `setup` et les exercices.
4. **Enregistrer le cours dans le test** : importer l'objet dans `src/data/lessons/lessons-python.test.ts` (cours Python) ou `lessons.test.ts` (cours SQL) et l'ajouter au tableau passé à `describeLessonCourse`. Sans cette étape, aucun exemple n'est exécuté et rien n'est contrôlé.
5. Créer la page et la déclarer : voir 5.2 (page `LessonCoursePage`, route, titre et description, catalogue, illustration).
6. Si le cours cite des faits externes (auteur et année, chiffre), les consigner dans `docs/SOURCES.md` (5.7).

**Règles d'écriture**

- **Identifiants stables.** Le `id` du cours et celui de chaque module servent de clés de progression (`course-progress-<id du cours>`, sous-clé = `id` du module). Ne jamais les changer. Python garde `python-basics` et `module-1` à `module-7` pour cette raison.
- **Code en lignes.** Écrire le code avec `lines("ligne 1", "ligne 2", ...)` (`src/data/lessons/lines.ts`) : une ligne de source par ligne de code. Un gabarit multiligne en backticks est un piège : un `\n` voulu dans une chaîne Python y devient un vrai saut de ligne et casse le code (en cas de gabarit, écrire la barre oblique inverse deux fois). `src/lib/code-snippets.test.ts` détecte les cas les plus courants.
- **Texte.** Markdown sans tableau (un tableau `| a | b |` n'est pas rendu) ni lien (`http://` est refusé) ; les intertitres `###` deviennent des `h4` (le titre du module est un `h3`). Écrire des espaces ordinaires : `lib/lessons/typography.ts` ajoute les espaces insécables français à l'affichage, jamais dans le code. Pas de tiret cadratin.
- **Formules.** `latex` d'une section `equation` s'écrit dans un gabarit étiqueté `String.raw` (voir `math-intro/m4-derivees.ts`) pour ne pas doubler les barres obliques inverses ; le test compile chaque formule avec KaTeX et échoue si elle est fausse.
- **Chaque exécution repart de zéro.** Les variables d'un exemple ne passent pas au suivant : un exemple qui réutilise des données les rappelle (constante `lines`) ou les met dans `setup`.
- **Exercice Python.** `test` est une suite d'`assert` avec un message en français que l'apprenant lira (`assert total == 5, "total doit valoir 5"`). Le corrigé doit passer ; le `starter` doit échouer **sur un de ces `assert`** (pas sur une `NameError` ou un `assert` sans message). Tester le résultat et non la méthode, pour que plusieurs solutions puissent réussir.
- **Exercice SQL.** Le moteur compare le **dernier** tableau produit par la réponse à celui du corrigé, sur le même `setup`. `ordered: true` quand l'ordre compte (le corrigé doit alors contenir `ORDER BY`) ; `columns: ["detail"]` pour ne comparer que certaines colonnes (par exemple `EXPLAIN QUERY PLAN`). Le corrigé doit renvoyer au moins une ligne (le moteur n'affiche rien pour 0 ligne) et le `starter` ne doit pas déjà réussir.
- **pandas.** Le moteur ne charge un paquet que s'il le voit dans un `import` : `load_*(as_frame=True)` s'accompagne d'un `import pandas` explicite (testé).
- **Tracés.** Seul Matplotlib s'exécute. Seaborn, Plotly, Altair et D3.js se montrent comme du code à lire, avec la mention qu'il ne tourne pas ici. Un exercice de tracé se vérifie en inspectant la figure (`ax.patches`, `ax.get_title()`, `ax.get_ylim()`...).
- **Données.** Jeux fournis avec scikit-learn (rien n'est téléchargé), ou données écrites dans le code avec une graine fixe et annoncées comme fictives. Pas de téléchargement : le réseau est coupé.
- **Widget.** Pour un nouveau composant interactif : ajouter son nom au type `LessonWidget` (`types.ts`), un `lazy(...)` et un cas dans `LessonWidget.tsx`, puis un cas dans `LessonWidget.test.tsx`.

**Lancer les contrôles**

```bash
npx vitest run src/data/lessons/lessons-python.test.ts -t "<id du cours>"   # un cours Python, sur Pyodide
npx vitest run src/data/lessons/lessons.test.ts                              # les cours SQL, sur sql.js
npm test                                                                     # tout, après sync-runtimes
npm run test:smoke                                                           # la page s'affiche, chaque module aussi
```

`-t` filtre sur le nom du bloc `describe`, qui est `cours <id du cours>` ; on peut le restreindre à un module (`-t "module 3"`). `npx vitest` ne passe pas par le hook `pretest` : si `public/vendor` manque, lancer `npm run runtimes:sync` d'abord. Chaque test Python a 120 s ; le premier charge Pyodide (environ 7 s). Pour s'assurer qu'un test peut échouer, abîmer une fois un corrigé (retirer une ligne) et vérifier que le test le signale.

| Message d'échec | Cause | Remède |
| --- | --- | --- |
| `la réponse de départ ne doit pas déjà passer les tests` / `ne doit pas déjà être juste` | Le `starter` satisfait déjà l'exercice | Le rendre incomplet |
| `la réponse de départ doit échouer sur un assert lisible` | Le `starter` plante autrement (`NameError`...) ou l'`assert` n'a pas de message | Faire échouer le `starter` sur un `assert ..., "message"` |
| `un exercice Python doit avoir des tests (assert)` | Champ `test` absent ou sans `assert` | Écrire les `assert` |
| `le corrigé doit renvoyer un tableau (au moins une ligne)` | Corrigé SQL sans résultat | Ajouter des lignes au jeu ou changer la question |
| `pandas importé explicitement ...` | `as_frame=True` sans `import pandas` | Ajouter l'import |
| Échec sur un `id` de module | Doublon ou caractères hors `a-z0-9-` | Renommer le nouveau module (jamais un module existant) |
| Échec sur « markdown sans tableau ni lien externe » | Tableau `\|...\|` ou `http(s)://` dans un texte, un énoncé ou un indice | Réécrire en liste ; citer « Auteur, année » sans lien |
| Échec sur une formule | LaTeX invalide pour KaTeX | Corriger la formule (le message nomme le LaTeX fautif) |
| `quiz cohérent ...` | Moins de 3 questions, `correct` hors des options, explication trop courte, options en double | Compléter le quiz |

**Modifier un cours existant**

- Ajouter, reformuler ou réordonner des sections ou des modules : sans risque pour la progression tant que les `id` ne changent pas. Ajouter un module à la fin d'un cours est le plus simple. Retirer un module laisse une clé orpheline sans effet dans le stockage de l'apprenant.
- Après un changement de durée ou de nombre de modules, mettre à jour l'entrée du cours dans `src/data/course-catalog.ts` (la durée totale affichée en tête de page est calculée, celle du catalogue est saisie).
- Un exemple modifié doit rester exécutable : relancer le test du cours. Une sortie affichée dans le texte ne s'écrit jamais à la main (elle viendrait à diverger du moteur) ; écrire une consigne qui renvoie l'apprenant à la sortie de l'exemple.
- **Reprendre une ancienne progression.** Quand un cours enregistrait sa progression sous une autre clé que `course-progress-<id>`, `src/lib/progress-migration.ts` est le modèle (`migrateMathIntroProgress`) : lire l'ancienne clé avec `readJSON` et un validateur, convertir chaque élément terminé en identifiant de module (`module-3`), les marquer avec `markDone(courseId, ids)` de `hooks/use-course-progress.ts`, puis écrire une clé-drapeau (`math-intro-progress-migrated`) pour ne le faire qu'une fois. La fonction est appelée au chargement de la page du cours (`pages/courses/math-stats/math-intro.tsx`, avant le premier affichage) et testée (`progress-migration.test.ts` : une seule reprise, aucune création sans ancienne progression).

**Projets guidés.** Même format : un module par projet dans `src/data/lessons/projects/<projet>.ts`, listé dans `projects/index.ts` (cours `projects`). L'`id` du module est celui du projet dans `src/data/projects.ts` : c'est ce qui rattache le guide à la fiche de la page Projets (`ProjectGrid`) et partage la progression. Le nombre de projets guidés affiché sur la page est calculé sur cette liste.

### 5.14 Ajouter du contenu lourd à une page longue

Une page longue (formules KaTeX, graphiques Recharts) ne doit pas bloquer son premier affichage. Trois outils, mesurés les 6 et 7 octobre 2026 (`docs/PERFORMANCE_GUIDE.md`) :

1. **Page faite d'une liste de sections** : les mettre comme enfants directs de `<ProgressiveSections>` (`components/layout/ProgressiveSections.tsx`). La première section est importée normalement, les suivantes avec `lazy(() => import(...))`. Modèle : `pages/fundamentals/math-stats/ProbabilityTheory.tsx`. La page affiche la première section, puis une de plus à chaque moment d'inactivité du navigateur ; elle s'affiche entièrement quand l'adresse a une ancre ou qu'une position de lecture doit être restaurée.
2. **Un seul bloc lourd sous le bandeau** : l'importer avec `lazy` et l'entourer de `<LazyBlock>` (`components/layout/LazyBlock.tsx`). Modèle : `pages/MachineLearning.tsx`.
3. **Graphique Recharts** : utiliser `DeferredResponsiveContainer` (`components/ui/deferred-chart.tsx`) à la place de `ResponsiveContainer`, avec la même `width` et la même `height` : une boîte de cette taille est réservée jusqu'à 400 px de l'écran, si bien que la hauteur de la page ne change pas.

Les attentes de `ProgressiveSections` et de `LazyBlock` portent l'attribut `data-sections-pending` : `ScrollManager` et le test de fumée s'en servent pour attendre la page complète. Ne pas le retirer, et ne jamais appeler `window.scrollTo` au montage. Ne pas utiliser `content-visibility: auto`, qui casse la restauration de la position. Après avoir ajouté une section, lancer `npm run test:smoke`.

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
- Les extraits de code exécutés dans l'éditeur doivent être réels. Dans un gabarit de chaîne TypeScript, écrire les échappements Python avec une double barre oblique inverse suivie de `n` (un simple `\n` deviendrait un vrai saut de ligne et casserait le code) ; dans les cours, `lines(...)` évite le piège.

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
| `npm test` : le test des cours Python échoue au chargement (`pyodide-lock.json` introuvable) | `public/vendor` absent (test lancé par `npx vitest` sans `pretest`) | `npm run runtimes:sync`, puis relancer |
| Un test de cours échoue (exemple, corrigé, point de départ d'un exercice) | Voir le tableau de messages en 5.13 | Section 5.13 |
| Python ou SQL ne démarrent pas en production : « WebAssembly est bloqué par la politique de sécurité du serveur » | En-tête CSP du serveur sans `'wasm-unsafe-eval'` | Point 7 de la section 5.11 |
| Un visiteur voit une ancienne version | Service worker : la mise à jour est proposée par un toast « Actualiser » et activée au message `SKIP_WAITING` | Normal ; le cache est recréé à chaque build (`__BUILD_ID__`) |
