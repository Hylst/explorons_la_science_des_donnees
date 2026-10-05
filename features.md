# Fonctionnalités de « Explorons la Data Science »

État du site au 1er octobre 2026, branche `audit/securite-pwa-routage`. Ce document décrit ce qui existe dans le code, pas ce qui est prévu. Chaque ligne s'appuie sur la lecture des fichiers cités et les nombres ont été comptés (méthode en fin de document). L'exactitude pédagogique du contenu des cours n'a pas été relue, et les pages longues n'ont pas été lues intégralement : une ligne décrit ce qui est établi par le code (composants, données, calculs), pas la qualité des explications.

Légende de la colonne **État** :

- **Disponible** : la fonction existe et fait ce qu'elle annonce.
- **Partiel** : la fonction existe mais une partie est une maquette, un plan sans contenu ou un exemple fixe ; la ligne dit laquelle.
- **À venir** : annoncé dans l'interface, pas encore réalisé.

Le site est une application 100 % statique : pas de serveur applicatif, pas de base de données, pas de compte. Tout ce qui est « mémorisé » (progression, notes, quiz, favoris, code) reste dans le `localStorage` du navigateur.

## Chiffres du site

| Élément | Nombre | Détail |
| --- | --- | --- |
| Routes canoniques (sitemap) | 56 | 1 accueil, 1 introduction, 11 Fondamentaux, 4 Machine Learning, 5 Outils, 11 Cours (catalogue + 10 cours), 9 Quiz (index + 8 catégories), 1 glossaire, 1 projets, 1 ressources, 1 communauté, 6 blog (index + 5 articles), 4 pages d'information (à propos, contact, confidentialité, conditions) |
| Anciennes URL redirigées | 28 | `LEGACY_REDIRECTS` dans `src/config/routes.ts` ; le build génère une page de redirection pour chacune |
| Pages HTML générées (build hylst) | 84 | 56 canoniques + 28 redirections, plus `404.html` et `sitemap.xml` |
| Cours sous `/courses/` | 10 | 5 avec contenu rédigé, 5 qui sont des plans de modules (voir « Cours ») |
| Questions de quiz | 165 | 8 catégories : Programmation 25, puis 20 pour chacune des 7 autres ; 10 questions tirées au hasard par tentative |
| Termes du glossaire | 179 | 7 catégories effectivement utilisées (fondamentaux 23, statistiques 20, machine learning 34, deep learning 31, NLP 3, MLOps 34, évaluation 34) ; aucun doublon de nom |
| Projets | 10 | 4 débutant, 3 intermédiaire, 3 avancé ; 9 catégories, 31 technologies distinctes |
| Articles de blog | 5 | tous signés Geoffroy Streit, datés de mars à mai 2024 |
| Articles d'actualité (Communauté) | 20 | instantané du 2 octobre 2026, 5 flux sur les 6 déclarés dans `rss-sources.json` ; articles publiés du 23 juin au 30 septembre 2026 |
| Modèles de code de l'éditeur | 6 | 3 Python, 2 JavaScript, 1 SQL |
| Défis de programmation | 4 | 3 Python, 1 JavaScript ; auto-évalués |
| Ressources externes (page Ressources) | 16 | 3 livres, 3 cours en ligne, 6 sites, 4 chaînes vidéo ; plus un parcours d'initiation fait de liens internes |
| Routes ayant titre et description propres | 42 | `PAGE_META` ; les articles de blog et les quiz tirent les leurs de leurs données |
| Fichiers de test Vitest | 12 | `src/**/*.test.ts(x)` ; non exécutés pour rédiger ce document |

## Fonctionnalités par section

### Accueil (`/`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Bandeau d'accueil et appels à l'action | Disponible | `Hero.tsx` : présente le site comme un projet personnel d'apprentissage ; boutons vers `/introduction` et `/courses` |
| Parcours d'apprentissage illustré | Disponible | `DataScienceMap.tsx` : carte de 7 étapes (fondamentaux, collecte, programmation, traitement, analyse, visualisation, machine learning) avec liens vers les pages du site ; une animation fait défiler la phase mise en avant toutes les 4 secondes |
| Catégories à la une | Disponible | `FeaturedCategories.tsx` : 7 cartes (Introduction, Maths et stats, Programmation, Machine Learning, Bases de données, Projets, Communauté) |
| Cours à la une | Disponible | `FeaturedCourses.tsx`, section « Pour commencer » : 3 cartes (Python, introduction aux mathématiques, guide des modèles de ML) lues dans `src/data/course-catalog.ts`, donc avec les mêmes niveaux, durées indicatives et nombres de modules que le catalogue |
| Progression et quiz du visiteur | Disponible | `FeatureHighlights.tsx` : modules terminés et en cours (`useProgressSummary`) et meilleur score de quiz, lus dans le navigateur ; message vide tant que rien n'est fait |
| Exemple de code exécutable | Disponible | `FeatureHighlights.tsx` : extrait Python (scikit-learn) avec lien vers l'éditeur (`/fundamentals/programming#code-editor`) |
| Derniers articles du blog | Disponible | `LatestArticles.tsx` : lit `blog-posts.json`, n'affiche que des articles existants |

### Introduction (`/introduction`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Page à 7 sections et une conclusion | Disponible | Définition, histoire, piliers, cycle de vie d'un projet, applications, métiers, ressources pour débuter, puis `IntroConclusionSection` (`components/introduction/sections/`) |
| Navigation latérale et barre de progression de lecture | Disponible | `ContentLayout` + `IntroProgressBar` : la section courante suit le défilement (`useSectionTracker`) ; ce repère n'est pas enregistré |
| Chiffres sourcés | Disponible | `CareersSection` utilise `SourceNote` (« Source : ..., consulté le ... ») ; le composant sert dans 8 fichiers au total ; le détail est dans `docs/SOURCES.md` |

### Fondamentaux (`/fundamentals`, 11 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Page d'orientation | Disponible | `/fundamentals` : 4 cartes vers les sous-sections, 5 blocs défilants (statistiques, visualisations mathématiques, programmation, visualisation de données, traitement des données), banque de termes repliable |
| Maths et statistiques (`/fundamentals/math-stats`) | Disponible | Page de synthèse : `UnifiedMathCourses` (12 cartes : 8 disponibles et 4 « Bientôt disponible »), `MathLearningPaths` (3 parcours cochables ; 2 modules du parcours avancé sont marqués « À venir » car sans page), applications |
| Cours de maths annoncés | À venir | Analyse numérique, statistiques multivariées, séries temporelles, optimisation mathématique (cartes désactivées) ; analyse de Fourier et théorie de l'information (modules « À venir » du parcours avancé) |
| Six cours de maths et statistiques | Disponible | Probabilités, statistiques descriptives, algèbre linéaire, calcul différentiel, calcul intégral, statistiques avancées : contenus rédigés avec formules KaTeX (`CourseEquation`) et graphiques Recharts ; démonstrations interactives dans le calcul différentiel (tangente animée, descente de gradient à taux d'apprentissage réglable) et exercices interactifs en algèbre linéaire |
| Programmation (`/fundamentals/programming`) | Partiel | 8 sections (introduction, masterclass Python, comparaison des langages, exercices pratiques, concepts avancés, défis interactifs, éditeur de code, ressources). L'éditeur et les exemples Python des concepts avancés s'exécutent réellement (un exemple de structure de projet est marqué « non exécutable en un seul script ») ; les exercices pratiques (`PracticalExercises`) sont des énoncés avec indices et solution, dont la case « terminé » n'est pas enregistrée |
| Éditeur de code exécutable | Disponible | `CodeEditor.tsx` : voir « Fonctions transversales » |
| Défis interactifs | Partiel | `InteractiveChallenges.tsx` : 4 défis (3 Python, 1 JavaScript) dont l'issue est déclarée par le visiteur lui-même (auto-évaluation, clé `challenge-progress-v2`) ; aucun test automatique ne vérifie la réponse |
| Préparation des données (`/fundamentals/data-preparation`) | Partiel | 10 sections (introduction, cycle de vie, collecte, audit qualité, qualité avancée, nettoyage, transformation, exploration visuelle, validation, automatisation). L'exploration visuelle et la matrice de corrélation sont calculées pour de vrai sur 2 jeux d'exemple à graine fixe (`sample-datasets.ts`). La validation est un « rapport d'exemple » dont les chiffres sont fixes (le texte le dit : « aucune donnée n'est analysée ici »), l'automatisation montre un tableau de bord « illustratif » |
| Bases de données (`/fundamentals/databases`) | Partiel | 9 sections rédigées (introduction, SQL, NoSQL, modélisation, performance, sécurité, exercices, tendances, big data). Les requêtes SQL y sont affichées, pas exécutées sur place ; elles peuvent être collées dans l'éditeur de la page Programmation (modèle SQL fourni) |

### Machine Learning (`/machine-learning`, 4 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Page d'ensemble | Disponible | 7 sections : introduction, accès aux cours, supervisé, non supervisé, évaluation des modèles, deep learning, exercices pratiques |
| Apprentissage supervisé (`/machine-learning/supervised`) | Disponible | Cours en sections (introduction, classification, régression, applications, projets, ressources) ; en-tête annonçant 8 modules et 4 à 6 heures |
| Apprentissage non supervisé (`/machine-learning/unsupervised`) | Disponible | Clustering, réduction de dimension, applications, projets, ressources |
| Apprentissage par renforcement (`/machine-learning/reinforcement`) | Disponible | Introduction, concepts, algorithmes, applications, projets, ressources |
| Exercices pratiques de la page d'ensemble | Partiel | `PracticalExercisesSection.tsx` : exemples de code à copier ou télécharger ; ils ne s'exécutent pas sur la page (plusieurs importent Matplotlib, que le moteur Python ne fournit pas) |

### Outils (`/tools`, 5 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Vue d'ensemble et 4 pages thématiques | Disponible | Langages de programmation, traitement des données, frameworks de ML, visualisation ; contenu de référence rédigé (fiches, comparatifs), navigation latérale |
| Chiffres de marché | Disponible | `ProgrammingTools`, `MLFrameworks` utilisent `SourceNote` avec source et date de consultation ; les chiffres externes sont datés, donc périssables |

### Cours (`/courses`, 11 routes)

Catalogue (`CoursesIndex.tsx`) : 6 catégories et 10 cours, lus dans `src/data/course-catalog.ts` (source unique, partagée avec l'accueil). Les 5 cours dont les leçons sont rédigées (Python, introduction aux mathématiques, statistiques inférentielles, guide des modèles de ML, Transformers) se présentent avec « Commencer le cours » ; les 5 qui ne sont que des plans de modules portent le badge « Plan du cours » et le bouton « Voir le plan du cours ». Niveau, durée « indicative » et nombre de modules ne sont affichés que s'ils figurent sur la page du cours. Les 10 cours sont routés dans `CourseRouter.tsx` ; tout autre chemin affiche la page 404.

| Cours | Route | État | Détail vérifié |
| --- | --- | --- | --- |
| Python pour la data science | `/courses/programming/python-basics` | Partiel | 7 modules réellement rédigés (`PythonModule1` à `7`, environ 5 000 lignes avec les schémas interactifs et le banc d'essai), dont un banc d'essai NumPy exécuté dans le navigateur ; les extraits de code des modules sont affichés, pas exécutables sur place. Chaque module a ses boutons Commencer, Terminé et Notes (`CourseItemActions`) et le bloc « Votre progression » affiche la part de modules réellement marqués terminés (stockée dans le navigateur) ; les 6 « projets » sont des fiches sans jeu de données, leur bouton renvoie vers l'éditeur |
| Introduction aux mathématiques | `/courses/math-stats/math-intro` | Disponible | 5 modules (pourquoi les maths, nombres et ensembles, fonctions, calcul différentiel, calcul intégral), 15 questions d'auto-évaluation (`CourseQuizBlock`), figures SVG, progression et module actif mémorisés |
| Statistiques inférentielles | `/courses/math-stats/inferential-statistics` | Disponible | Échantillonnage, tests d'hypothèses, intervalles de confiance, approche bayésienne, 3 exercices résolus (test t, intervalle, Bayes) ; en-tête : 6 modules, environ 1 heure |
| Guide des modèles de ML | `/courses/machine-learning/ml-models-guide` | Disponible | Page unique de fiches de modèles (`MLModelsSection`), sans modules ni suivi |
| Transformers | `/courses/machine-learning/transformers` | Disponible | Page unique d'environ 1 900 lignes : transformateurs de données (standardisation, normalisation, uniformisation) puis architecture Transformer (attention, BERT et GPT, Vision Transformers) |
| Statistiques appliquées | `/courses/statistics/applied-statistics` | Partiel | Plan de 6 modules (statistiques descriptives, probabilités, tests, régression, ANOVA, non paramétrique) sans leçon ; « Commencer » change seulement un statut, des notes sont possibles ; onglet « Cas d'étude » = fiches à réaliser, onglet « Outils » = liste |
| Fondamentaux des bases de données | `/courses/databases/database-fundamentals` | Partiel | Plan de 6 modules sans leçon, même mécanique ; onglets Projets et Outils = fiches |
| Visualisation de données avancée | `/courses/dataviz/data-visualization` | Partiel | Plan de 7 modules sans leçon ; onglet Projets (3 fiches) et Galerie (liste de liens et de pistes) |
| Machine learning supervisé (plan) | `/courses/machine-learning/supervised-learning` | Partiel | Plan de 8 modules sans leçon, 3 fiches de projets, onglet « Validation des acquis » : trois repères calculés sur la progression réelle (modules, projets, meilleur quiz ML à 80 % ou plus) ; aucun certificat. Le contenu pédagogique est dans `/machine-learning/supervised` |
| Traitement du langage naturel | `/courses/nlp/natural-language-processing` | Partiel | Plan de 8 modules sans leçon, projets et onglet « Modèles » |

Les cinq plans partagent `CourseModuleTemplate` : chaque module affiche titre, description, durée, niveau, un bouton **Commencer** (statut « en cours », puis « Marquer comme terminé », puis « Rouvrir ») et une boîte de **notes** enregistrées dans le navigateur (`CourseItemActions`, clé `course-progress-<cours>`). Aucun de ces modules n'ouvre de leçon : le suivi est réel mais le contenu qu'il suit n'existe pas encore. Les pages d'accueil de ces cours le disent dans leurs métadonnées (« modules annoncés »).

### Quiz (`/quiz`, 9 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| 8 catégories de quiz | Disponible | Programmation, maths et statistiques, machine learning, visualisation, préparation des données, deep learning, big data, business intelligence ; 165 questions à choix unique avec explication, difficulté, thème et points |
| Passage d'un quiz | Disponible | 10 questions tirées au hasard par tentative (`getRandomQuestions`) ; validation de chaque réponse puis explication, navigation précédente et suivante, chronomètre, confirmation avant de quitter |
| Résultats | Disponible | Score en pourcentage, points forts et points à travailler par thème, « Refaire le quiz », partage par `navigator.share` quand le navigateur le propose |
| Statistiques, séries et succès | Disponible | `quiz-storage.ts` : calculées uniquement sur les tentatives enregistrées (100 au plus) ; seuil de réussite à 80 % ; 5 succès (Premier Pas, Excellence à 90 %, Score Parfait, Régulier à 5 quiz, En Série sur 3 jours) |
| Historique | Disponible | Liste des tentatives, effacement avec confirmation |

### Glossaire (`/glossary`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Recherche, filtre par catégorie, tri | Disponible | Recherche dans le terme et la description, filtre sur les catégories présentes, tri alphabétique ou par catégorie, compteurs (termes, catégories, résultats) ; bouton de réinitialisation |
| 179 termes | Disponible | `src/data/glossary/` (8 fichiers) ; seuls 13 termes ont une définition longue (`longDefinition`). La catégorie NLP n'en compte que 3 ; trois catégories prévues par le type (vision par ordinateur, préparation, ingénierie des données) n'ont aucun terme et n'apparaissent donc pas dans les filtres |
| Termes survolables dans les cours | Disponible | `GlossaryTerm` : survol pour la définition courte, clic pour le détail ; utilisé dans 21 fichiers de cours et de pages ; les dictionnaires de `components/fundamentals/definitions/` alimentent aussi la page Glossaire |

### Projets (`/projects`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| 10 projets à réaliser | Partiel | `src/data/projects.ts` : énoncés avec description, niveau, technologies, durée, difficulté de 1 à 5, prérequis, objectifs. La page précise elle-même qu'aucun jeu de données ni corrigé n'est fourni |
| Recherche et filtres | Disponible | Texte, niveau, durée, catégorie, technologies, progression ; tous les compteurs de la page sont calculés sur les données |
| Suivi par projet | Disponible | Commencé ou terminé, notes (`useCourseProgress("projects")`), enregistrés dans le navigateur |

### Ressources (`/resources`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Sélection de ressources externes | Disponible | 3 livres, 3 cours en ligne, 6 sites, 4 chaînes vidéo, avec lien ; les liens sortants ne sont pas vérifiés à chaque build |
| Parcours d'initiation | Disponible | `InitiationCoursesSection` : liste classée par thème de liens vers des pages du site |
| Entrées du parcours d'initiation sans cours dédié | Partiel | Plusieurs entrées (par exemple logique et raisonnement formel, algorithmes, data warehousing, data lakes, computer vision) renvoient vers une page de section générale, pas vers un cours qui porte leur nom |

### Blog (`/blog`, 6 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| 5 articles | Disponible | Un guide et quatre études de cas (notes « Cas d'école » en tête, références en fin d'article ; `blog-posts.json` pour les métadonnées, `blog-contents.ts` pour les corps HTML, nettoyés par DOMPurify) ; titre, extrait, balises Open Graph posés par article |
| Favoris | Disponible | `use-blog-favorites` : mémorisés dans le navigateur |
| Recherche et filtre par catégorie | Partiel | Disponibles dans la section « Blog Data » de `/community` (4 articles au plus affichés) ; la page `/blog` elle-même liste les articles sans recherche ni filtre |
| Article inexistant | Partiel | `/blog/<identifiant inconnu>` affiche « Article non trouvé » dans la page du blog, sans passer par la page 404 |

### Communauté (`/community`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Forums et groupes, événements, comptes et chaînes, contribuer, blog data | Disponible | 5 sections de liens externes (`ForumsSection`, `EventsSection`, `SocialSection`, `ContributeSection`, `BlogSection`) ; aucune activité n'est affichée en direct |
| Actualités (flux RSS) | Partiel | **Instantané daté**, pas un flux en direct : `rss-articles.json` contient 20 articles pris le 30 septembre 2026 (4 par source, 5 sources). Le site ne peut pas lire les flux (aucun serveur ; la plupart refusent les requêtes depuis un navigateur). La liste est renouvelée seulement par `npm run news:refresh` puis un nouveau déploiement. La date de l'instantané est affichée sur la page |
| Recherche et filtres des actualités | Disponible | Texte (sans casse ni accents), source, catégorie, bouton de réinitialisation |
| Sources RSS | Disponible | 6 sources déclarées avec adresse du flux copiable (`navigator.clipboard`) pour un lecteur RSS personnel ; « Proposer un flux » ouvre un `mailto:` |
| Source « Le Big Data » | Partiel | Déclarée dans `rss-sources.json`, absente de l'instantané actuel ; cause non établie (le script ignore un flux qui ne répond pas ou dont le XML est inattendu) |

### À propos, Contact, Confidentialité, Conditions

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| À propos | Disponible | Mission, philosophie, public visé, présentation de l'auteur, contenu éducatif, technologies, valeurs, paternité et licence AGPL-3.0-or-later |
| Contact | Disponible | Le formulaire **prépare** un e-mail (`mailto:`, `buildMailDraft`) ; il n'envoie rien lui-même et ne prétend pas l'avoir fait ; si le lien est trop long (plus de 1 800 caractères), le texte est à copier-coller |
| Politique de confidentialité | Disponible | Décrit ce qui est réellement stocké (`localStorage`, cache du service worker), l'absence de cookie, de compte et de mesure d'audience, et les journaux du serveur d'hébergement ; mise à jour au 30 septembre 2026 |
| Conditions d'utilisation | Disponible | Licence du code et des contenus (AGPL-3.0-or-later), exceptions pour les images et les moteurs tiers |
| Pied de page | Disponible | Liens vers les rubriques, les pages légales et le fichier `LICENSE.txt` publié ; aucun lien vers le code source tant que `SOURCE_URL` vaut `null` (dépôt privé) |

## Fonctions transversales

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Éditeur de code exécutable | Disponible | `CodeEditor.tsx` + `src/lib/runner`. **Python** : Pyodide (CPython en WebAssembly) avec NumPy, pandas, scikit-learn et leurs dépendances (SciPy comprise), délai de 30 s. **SQL** : SQLite via sql.js, base vide en mémoire recréée à chaque exécution, délai de 15 s. **JavaScript** : iframe `sandbox="allow-scripts"` à la politique de sécurité sans réseau, délai de 12 s. Python et SQL tournent dans des Web Workers arrêtés en cas de dépassement. Fichiers multiples, 6 modèles, import, export, copie, plein écran, taille de police, sauvegarde automatique (clé `code-editor-workspace-v1`), raccourcis Ctrl+S et Ctrl+Entrée |
| Autres utilisateurs du moteur | Disponible | Exemples Python des « Concepts avancés » (`AdvancedConcepts.tsx`) et banc d'essai NumPy contre Python pur (`NumpyBenchmark.tsx`) |
| Progression locale | Partiel | Réelle et enregistrée dans le navigateur pour : modules, projets et études de cas (`course-progress-<id>`), cours d'introduction aux maths, parcours de maths, quiz, défis, favoris du blog, ressources de programmation, onglets mémorisés, espace de l'éditeur. **Non enregistrée** : exercices pratiques et concepts avancés de la page Programmation (état perdu au rechargement) et bloc « Votre progression » du cours Python (« 0 % » en dur). Pas de synchronisation entre appareils |
| Favoris | Disponible | Articles de blog (`blog-favorites-v1`) et ressources de programmation (`ds-bookmarks`) ; pas de favoris pour les cours, termes ou projets |
| Mode clair, sombre, système | Disponible | `ThemeProvider` + `ThemeToggle` : trois choix, suivi en direct de `prefers-color-scheme`, mémorisation (`ds-explorer-theme`), script `theme-init.js` qui pose la classe avant le premier affichage. Les classes de couleur fixes des cours sont converties en mode sombre au build (`tailwind/dark-palette.ts`) ; les couleurs écrites en dur dans un `style` ou un graphique ne le sont pas |
| Hors ligne | Disponible | `public/sw.js` : réseau d'abord pour les pages (repli sur la page d'application mise en cache, puis `offline.html`), cache d'abord pour `assets/` et pour `vendor/` (moteurs, cache distinct qui survit aux déploiements), réponse du cache puis mise à jour en arrière-plan pour le reste. Hors ligne, seules les pages et moteurs déjà chargés sont disponibles ; les liens externes et les actualités exigent le réseau |
| Installation (PWA) | Disponible | `manifest.json` (mode autonome, icônes 192 et 512 px, 3 raccourcis), bouton d'installation capturé dès le démarrage, instructions pour iOS, bandeau fermable. Enregistré en production seulement ; mise à jour proposée par un message « Actualiser » |
| SEO statique | Disponible | Mode `hylst` : une page HTML par route avec titre, description, Open Graph, `canonical` et `og:url` propres (84 pages), pages de redirection pour les 28 anciennes URL, `sitemap.xml` (56 URL), ligne `Sitemap:` dans `robots.txt`, `404.html` autonome ; le build échoue si une route n'a pas de métadonnées. En navigation dans l'application, `RouteMeta` pose les mêmes titre et description |
| Sécurité du build | Disponible | Content-Security-Policy injectée en `<meta>` (`default-src 'self'`, `script-src 'self'`, `connect-src 'self'`, `worker-src 'self'`, `object-src 'none'`) ; les corps d'articles de blog, seul HTML de contenu injecté, passent par DOMPurify (le composant de graphiques injecte du CSS tiré de sa configuration) ; aucune police, aucun script ni image tiers chargés ; `verify-dist.mjs` contrôle la sortie |
| Licence et mentions | Disponible | `LICENSE` (AGPL-3.0-or-later) copié en `LICENSE.txt` dans la sortie ; inventaire des composants tiers embarqués généré en `vendor/NOTICE.txt` par `sync-runtimes.mjs` |
| Accessibilité | Partiel | Prouvé dans le code : `lang="fr"`, repère `<main>` dans `Layout`, `<nav>` pour la barre de navigation, bouton du menu mobile avec `aria-label` et `aria-expanded`, sélecteur de thème avec `aria-label`, anneau de focus visible sur les boutons, primitives Radix (menus, boîtes de dialogue, onglets, infobulles) qui gèrent le clavier et le focus, 55 lignes contenant `aria-label` dans `src/`, régions `aria-live` ou `role="status"` dans quelques composants (éditeur, filtres d'actualités et de projets, quiz de cours, matrice de corrélation), attribut `alt` sur les images de l'accueil. Depuis le 2 octobre 2026 : lien d'évitement « Aller au contenu » (`Layout`), règle `prefers-reduced-motion` dans `src/index.css` (animations et transitions quasi instantanées, défilement sans lissage), logos décoratifs avec `alt=""`, contrastes WCAG AA repris (audit automatique sur 56 routes : 25 échecs en clair et 30 en sombre contre 1634 et 384 au départ). **Non prouvé ou absent** : pas d'audit avec un lecteur d'écran, ni d'audit Lighthouse, rendu des équations KaTeX non contrôlé ; une douzaine de pastilles colorées dynamiquement restent sous 4,5:1 |
| Mise en page adaptative | Disponible | Pas de défilement horizontal de la page constaté sur les 54 routes à 390, 768, 1024 et 1280 px (contrôle consigné dans `CHANGELOG.md`, non rejoué pour ce document) |
| Tests automatiques | Partiel | Vitest configuré (`npm test`), 12 fichiers : stockage, sanitisation, quiz, exécuteur de code (client de worker), métadonnées de page, identité du site, thème, projets, jeux d'exemple, format de durée, matrice de corrélation. Pas de test des pages ni de bout en bout |

## Limites connues

- **Pas de compte ni de serveur.** Aucune donnée n'est partagée entre appareils ou navigateurs ; vider les données du site efface progression, notes, quiz et code. Aucun certificat n'est délivré (le texte du cours supervisé le dit).
- **Matplotlib est fourni** (rendu Agg, figures affichées sous la sortie) ; seaborn, TensorFlow, PyTorch et les autres bibliothèques des exemples affichés ne le sont pas : un `import` de l'une d'elles échoue avec un `ModuleNotFoundError` explicite.
- **Worker Python (et SQL) de même origine, donc non isolé.** Contrairement à l'iframe JavaScript (origine opaque, sans réseau), les workers Python et SQL sont chargés depuis l'origine du site, sans `sandbox` ni politique propre : la CSP du site est une balise `<meta>` qui ne s'applique pas à un worker. Le code s'exécute sur la machine du visiteur, mais rien dans le dépôt n'empêche ce code d'utiliser les API de l'origine, `fetch` compris (non testé).
- **Moteurs lourds.** Environ 39 Mo dans `public/vendor` (non versionné, recréé par `npm run runtimes:sync`, qui a besoin du réseau la première fois). Ils ne se téléchargent qu'à la première exécution, puis restent en cache.
- **Données externes datées.** Les actualités sont un instantané du 2 octobre 2026. Les chiffres de marché des pages Outils, Introduction et Programmation portent une date de consultation (1er octobre 2026) et vieillissent. Les liens externes (ressources, forums, vidéos) ne sont pas vérifiés automatiquement.
- **Cours en plan.** Cinq cours sur dix ne sont que des plans de modules : suivi et notes réels, aucune leçon derrière. Le catalogue `/courses` les signale par le badge « Plan du cours ».
- **Contenu illustratif.** Plusieurs encadrés de la préparation des données (validation, automatisation, qualité avancée) montrent des chiffres d'exemple fixes, signalés comme tels dans leur texte.
- **Projets sans corrigé.** Aucun jeu de données ni solution n'est fourni ; certains énoncés citent des jeux publics (Iris, Boston Housing, COVID-19) à récupérer soi-même.
- **Blog limité.** 5 articles de 2024, sans recherche ni filtre.
- **Langue.** Interface et contenus uniquement en français ; certaines ressources externes sont en anglais.
- **Code source.** Aucun lien vers le dépôt n'est affiché dans le pied de page : `SOURCE_URL` vaut `null` (le commentaire de `site.ts` dit « tant que le dépôt est privé »). À renseigner quand le dépôt sera public.

## Écarts constatés dans le contenu

Relevés du 1er octobre 2026 par relecture du code. Corrigés le 2 octobre 2026 : « les plus suivis par notre communauté » et les nombres de modules écrits à la main sur l'accueil, l'en-tête « 24 modules » du plan de ML supervisé, la progression fixe du cours Python, l'adresse de contact écrite en dur, le message des défis sur l'exécution du code, la carte « Statistiques inférentielles » en double et le catalogue incomplet.

Restent à corriger ou à confirmer :

- Les exercices pratiques et les concepts avancés de la page Programmation tiennent leur état « terminé » en mémoire seulement : il est perdu au rechargement.
- Le défi interactif n'utilise pas le moteur d'exécution de l'éditeur : l'issue reste déclarée par le visiteur.
- Le texte des pages longues (outils, ML, maths) n'a pas été relu pour l'exactitude pédagogique.

## Méthode de comptage

- **Routes** : `collectRoutes()` de `scripts/collect-routes.ts`, exécuté avec Node 24 ; il lit `App.tsx`, `CourseRouter.tsx`, `config/routes.ts`, `blog-posts.json` et les identifiants de `quizData.ts`. Résultat : 84 au total, 56 canoniques, 28 anciennes.
- **Quiz et glossaire** : modules TypeScript compilés dans un dossier temporaire puis exécutés ; totaux par catégorie recoupés avec un comptage des identifiants (`prog_`, `math_`, etc.).
- **Projets, blog, actualités** : lecture de `projects.ts`, `blog-posts.json`, `rss-articles.json` et `rss-sources.json`.
- **Cours, modules, défis, modèles de l'éditeur, ressources** : lecture des pages et recherche des déclarations (`id:`, `title:`) dans les fichiers cités.
- **Accessibilité** : recherche de `aria-label`, `sr-only`, `lang=`, `prefers-reduced-motion`, liens d'évitement dans `src/`, `index.html` et `public/`.
- Rien n'a été exécuté dans le navigateur ni par `npm run build`, `npm test` ou `npm run lint` pour ce document.
