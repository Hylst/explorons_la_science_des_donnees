# Fonctionnalités de « Explorons la Data Science »

État du site au 9 octobre 2026, branche `audit/securite-pwa-routage` (HEAD `cb19b9f`, dernier build livré `mv1dm3v3`). Ce document décrit ce qui existe dans le code, pas ce qui est prévu. Chaque ligne s'appuie sur la lecture des fichiers cités et les nombres ont été recomptés le 9 octobre (méthode en fin de document). Le contenu a été relu par des sous-agents entre le 3 et le 9 octobre, chaque lot vérifié avant intégration (voir `CHANGELOG.md`) ; une ligne décrit toutefois ce qui est établi par le code (composants, données, calculs), pas la qualité des explications.

Légende de la colonne **État** :

- **Disponible** : la fonction existe et fait ce qu'elle annonce.
- **Partiel** : la fonction existe mais une partie est une maquette, un plan sans contenu ou un exemple fixe ; la ligne dit laquelle.
- **À venir** : annoncé dans l'interface, pas encore réalisé. Aucune ligne n'a cet état au 9 octobre 2026 : le site n'annonce plus de cours ni de module sans contenu.

Le site est une application 100 % statique : pas de serveur applicatif, pas de base de données, pas de compte. Tout ce qui est « mémorisé » (progression, notes, quiz, favoris, code) reste dans le `localStorage` du navigateur.

## Chiffres du site

Recomptés le 9 octobre 2026 (méthode en fin de document).

| Élément | Nombre | Détail |
| --- | --- | --- |
| Routes canoniques (sitemap) | 56 | 1 accueil, 1 introduction, 11 Fondamentaux, 4 Machine Learning, 5 Outils, 11 Cours (catalogue + 10 cours), 9 Quiz (index + 8 catégories), 1 glossaire, 1 projets, 1 ressources, 1 communauté, 6 blog (index + 5 articles), 4 pages d'information (à propos, contact, confidentialité, conditions) |
| Anciennes URL redirigées | 28 | `LEGACY_REDIRECTS` dans `src/config/routes.ts` ; le build génère une page de redirection pour chacune |
| Pages HTML générées (build hylst) | 84 | 56 canoniques + 28 redirections, plus `404.html` et `sitemap.xml` |
| Cours sous `/courses/` | 10 | tous rédigés au format des cours en données (`src/data/lessons/`) ; voir « Cours » |
| Modules des cours | 65 | Python 7, introduction aux mathématiques 5, statistiques inférentielles 6, statistiques appliquées 6, bases de données 6, visualisation 7, ML supervisé 8, guide des modèles 6, Transformers 6, traitement du langage 8 |
| Exercices vérifiés des cours | 162 | 19 Python, 15 maths, 18 inférentielles, 12 appliquées, 19 bases de données, 13 visualisation, 16 ML supervisé, 17 guide des modèles, 17 Transformers, 16 langage |
| Exemples exécutables des cours | 247 | sections « code » des leçons, exécutées par les tests avec le moteur du site |
| Questions des quiz de module (dans les cours) | 276 | fin de chaque module, distinctes des 165 questions de la section Quiz |
| Formules des cours (sections « équation ») | 77 | 33 en introduction aux mathématiques, 18 en statistiques inférentielles, 14 dans le guide des modèles, 12 dans Transformers ; chacune est compilée par les tests |
| Questions de quiz (section Quiz) | 165 | 8 catégories : Programmation 25, puis 20 pour chacune des 7 autres ; 10 questions tirées au hasard par tentative |
| Termes du glossaire | 229 | 190 écrits à la main (8 fichiers) et 39 issus des dictionnaires de survol des cours ; 9 catégories utilisées (fondamentaux 23, statistiques 22, machine learning 32, deep learning 31, NLP 16, MLOps 34, évaluation 34, préparation 32, ingénierie des données 5) ; 52 ont une définition longue ; aucun doublon de nom |
| Projets | 12 | 4 débutant, 5 intermédiaire, 3 avancé ; 11 catégories, 30 technologies distinctes ; 5 guidés pas à pas (16 exercices vérifiés) |
| Articles de blog | 5 | tous signés Geoffroy Streit, datés du 2 octobre 2026, 3 à 4 minutes de lecture annoncées |
| Articles d'actualité (Communauté) | 20 | instantané du 2 octobre 2026, 5 flux sur les 6 déclarés dans `rss-sources.json` (4 articles chacun) ; articles publiés du 23 juin au 2 octobre 2026 |
| Modèles de code de l'éditeur | 6 | 3 Python, 2 JavaScript, 1 SQL |
| Défis de programmation | 4 | 3 Python, 1 JavaScript ; auto-évalués |
| Ressources externes (page Ressources) | 14 | 3 livres, 2 cours en ligne, 5 sites, 4 chaînes vidéo ; plus la liste des cours du site, lue dans le catalogue |
| Routes ayant titre et description propres | 56 | 42 entrées de `PAGE_META`, l'accueil (`HOME_TITLE`) et 13 pages dynamiques (5 articles de blog, 8 catégories de quiz) qui tirent les leurs de leurs données |
| Fichiers de test Vitest | 45 | `src/**/*.test.ts(x)`, dont le test de fumée des 56 routes (`npm run test:smoke`, hors de `npm test`) ; 1 538 tests au dernier passage complet de `npm test` (9 octobre 2026) |
| Moteurs d'exécution (`public/vendor`) | 48 Mo | Pyodide 314.0.7 : 48 Mo ; sql.js : 0,6 Mo ; non versionnés, recréés par `npm run runtimes:sync` |

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
| Chiffres sourcés | Disponible | `CareersSection` utilise `SourceNote` (« Source : ..., consulté le ... ») ; le composant sert dans 11 fichiers au total ; le détail est dans `docs/SOURCES.md` |

### Fondamentaux (`/fundamentals`, 11 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Page d'orientation | Disponible | `/fundamentals` : 4 cartes vers les sous-sections, 5 blocs défilants (statistiques, visualisations mathématiques, programmation, visualisation de données, traitement des données), banque de termes repliable |
| Maths et statistiques (`/fundamentals/math-stats`) | Disponible | Page de synthèse : `UnifiedMathCourses` (13 cartes : 9 disponibles, et 4 sujets présentés comme « pas encore traités », sans date ni promesse), `MathLearningPaths` (3 parcours cochables ; 2 modules du parcours avancé affichent « Pas encore de cours »), applications |
| Sujets de maths sans cours | Non traité | Analyse numérique, statistiques multivariées, séries temporelles, optimisation mathématique (cartes « Pas encore écrit », sans lien) ; analyse de Fourier et théorie de l'information (modules « Pas encore de cours » du parcours avancé). La page le dit sans date : ce n'est pas une annonce |
| Six cours de maths et statistiques | Disponible | Probabilités, statistiques descriptives, algèbre linéaire, calcul différentiel, calcul intégral, statistiques avancées : contenus rédigés avec formules KaTeX (`CourseEquation`) et graphiques Recharts ; démonstrations interactives dans le calcul différentiel (tangente animée, descente de gradient à taux d'apprentissage réglable) et exercices interactifs en algèbre linéaire |
| Programmation (`/fundamentals/programming`) | Partiel | 9 sections (introduction, masterclass Python, comparaison des langages, exercices pratiques, concepts avancés, défis interactifs, éditeur de code, outils du quotidien : Git, environnements virtuels, Docker, ressources). L'éditeur et les exemples Python des concepts avancés s'exécutent réellement (un exemple de structure de projet est marqué « non exécutable en un seul script ») ; les exercices pratiques (`PracticalExercises`) sont des énoncés avec indices et solution, dont la case « terminé » n'est pas enregistrée |
| Éditeur de code exécutable | Disponible | `CodeEditor.tsx` : voir « Fonctions transversales » |
| Défis interactifs | Partiel | `InteractiveChallenges.tsx` : 4 défis (3 Python, 1 JavaScript) dont l'issue est déclarée par le visiteur lui-même (auto-évaluation, clé `challenge-progress-v2`) ; aucun test automatique ne vérifie la réponse |
| Préparation des données (`/fundamentals/data-preparation`) | Disponible | 10 sections (introduction, cycle de vie, collecte, audit qualité, qualité avancée, nettoyage, transformation, exploration visuelle, validation, automatisation). L'exploration visuelle et la matrice de corrélation sont calculées pour de vrai sur 2 jeux d'exemple à graine fixe (`sample-datasets.ts`). Depuis le 8 octobre, le cas hospitalier, le rapport de validation et le tableau de bord de monitoring sont aussi calculés dans le navigateur (`src/data/data-quality-demos.ts`, testé) sur des données inventées et annoncées comme telles ; depuis le 9 octobre, les onglets de validation et d'automatisation sont des guides de méthode sans score ni durée inventés |
| Bases de données (`/fundamentals/databases`) | Partiel | 9 sections rédigées (introduction, SQL, NoSQL, modélisation, performance, sécurité, exercices, tendances, big data). Les requêtes SQL y sont affichées, pas exécutées sur place (aucun `runCode` ni éditeur dans `src/pages/fundamentals/databases`) ; elles peuvent être collées dans l'éditeur de la page Programmation (modèle SQL fourni), et le cours « Fondamentaux des bases de données » exécute tout |

### Machine Learning (`/machine-learning`, 4 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Page d'ensemble | Disponible | 7 sections : introduction, accès aux cours, supervisé, non supervisé, évaluation des modèles, deep learning, exercices pratiques |
| Apprentissage supervisé (`/machine-learning/supervised`) | Disponible | Cours en sections (introduction, classification, régression, applications, projets, ressources) ; en-tête annonçant 8 modules et 4 à 6 heures |
| Apprentissage non supervisé (`/machine-learning/unsupervised`) | Disponible | Clustering, réduction de dimension, applications, projets, ressources |
| Apprentissage par renforcement (`/machine-learning/reinforcement`) | Disponible | Introduction, concepts, algorithmes, applications, projets, ressources |
| Exercices pratiques de la page d'ensemble | Partiel | `PracticalExercisesSection.tsx` : exemples de code à copier ou télécharger ; ils ne s'exécutent pas sur la page, alors que le moteur fournit désormais Matplotlib (`PracticalExercisesSection.tsx`, environ 1 700 lignes) |

### Outils (`/tools`, 5 routes)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Vue d'ensemble et 4 pages thématiques | Disponible | Langages de programmation, traitement des données, frameworks de ML, visualisation ; contenu de référence rédigé (fiches, comparatifs), navigation latérale |
| Chiffres de marché | Disponible | `ProgrammingTools`, `MLFrameworks` utilisent `SourceNote` avec source et date de consultation ; les chiffres externes sont datés, donc périssables |

### Cours (`/courses`, 11 routes)

Catalogue (`CoursesIndex.tsx`) : 6 catégories et 10 cours, lus dans `src/data/course-catalog.ts` (source unique, partagée avec l'accueil). Depuis le 6 octobre 2026, les 10 cours ont des leçons rédigées et se présentent avec « Commencer le cours » ; le statut `plan` (badge « Plan du cours ») reste prévu dans le code mais n'est plus utilisé. Niveau, durée « indicative » et nombre de modules ne sont affichés que s'ils figurent sur la page du cours. Les 10 cours sont routés dans `CourseRouter.tsx` ; tout autre chemin affiche la page 404.

| Cours | Route | État | Détail vérifié |
| --- | --- | --- | --- |
| Python pour la data science | `/courses/programming/python-basics` | Disponible | 7 modules rédigés au format des cours en données (`src/data/lessons/python`, 8 octobre 2026) : bases, contrôle, fonctions, NumPy, pandas, Matplotlib, Jupyter ; exemples exécutés par Pyodide, 19 exercices vérifiés, banc d'essai NumPy et schémas animés insérés comme sections `widget` ; environ 15 h 30. Identifiants `module-1` à `module-7` conservés (progression des visiteurs gardée) |
| Introduction aux mathématiques | `/courses/math-stats/math-intro` | Disponible | 5 modules au format des cours en données (`src/data/lessons/math-intro`, 9 octobre 2026) : pourquoi les maths, nombres et ensembles, fonctions, dérivées et descente de gradient, intégrales et probabilités ; 15 exercices vérifiés numériquement, 33 formules (KaTeX), figures SVG en widgets ; environ 9 h. Progression de l'ancien format reprise une fois (`lib/progress-migration.ts`) |
| Statistiques inférentielles | `/courses/math-stats/inferential-statistics` | Disponible | 6 modules (`src/data/lessons/inferential-statistics`) : échantillonnage et estimateurs, intervalles de confiance, logique des tests, tests t et khi-deux, tests multiples et puissance, approche bayésienne ; montrés par simulation à graine fixe, 18 exercices vérifiés ; environ 12 h |
| Guide des modèles de ML | `/courses/machine-learning/ml-models-guide` | Disponible | 6 modules (`src/data/lessons/ml-models-guide`) : choisir une famille de modèles, descente de gradient stochastique, boosting, clustering, Q-learning, réseaux de neurones ; scores mesurés dans le navigateur, 17 exercices vérifiés ; environ 14 h. Complète le cours de ML supervisé sans le répéter |
| Transformers | `/courses/machine-learning/transformers` | Disponible | 6 modules (`src/data/lessons/transformers`) : les deux sens du mot, mise à l'échelle, transformations avancées et pipelines, attention multi-têtes et positions, BERT / GPT / ViT, workflow et production ; NumPy et scikit-learn, 17 exercices vérifiés ; environ 12 h 30 |
| Statistiques appliquées | `/courses/statistics/applied-statistics` | Disponible | 6 modules rédigés (`src/data/lessons/applied-statistics`), 12 exercices Python vérifiés (scipy, pandas) sur des données réelles de scikit-learn ; environ 11 h 30 |
| Fondamentaux des bases de données | `/courses/databases/database-fundamentals` | Disponible | 6 modules rédigés (`src/data/lessons/database-fundamentals`), 19 exercices SQL exécutés par SQLite dans le navigateur et comparés au corrigé ; environ 14 h 30 |
| Visualisation de données | `/courses/dataviz/data-visualization` | Disponible | 7 modules rédigés (`src/data/lessons/data-visualization`), 13 exercices Matplotlib vérifiés en inspectant la figure ; Seaborn, Plotly, Altair et D3.js en lecture seulement ; environ 13 h 30 |
| Machine learning supervisé | `/courses/machine-learning/supervised-learning` | Disponible | 8 modules rédigés (`src/data/lessons/supervised-learning`), 16 exercices scikit-learn vérifiés ; environ 18 h |
| Traitement du langage naturel | `/courses/nlp/natural-language-processing` | Disponible | 8 modules rédigés (`src/data/lessons/nlp`), 16 exercices Python vérifiés (re, NumPy, scikit-learn) ; spaCy et transformers en lecture seulement (absents de Pyodide) ; environ 17 h 30 |

Les dix cours partagent `LessonCoursePage` (`src/components/courses/lessons/`) : modules repliables avec objectifs, texte, exemples exécutables, exercices vérifiés (la réponse de départ est refusée avec un message en français), quiz de module, et boutons **Commencer**, **Terminé** et **Notes** (`CourseItemActions`, clé `course-progress-<cours>`). Le contenu est en données (`src/data/lessons/`) et chaque exemple et corrigé est exécuté par les tests (`lessons.test.ts`, `lessons-python.test.ts`).

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
| 229 termes | Disponible | `src/data/glossary/` : 8 fichiers de termes écrits à la main (190 termes) plus 39 termes tirés des dictionnaires de survol des cours (`dictionaries.ts`) ; 52 ont une définition longue (`longDefinition`). Réécrit sobrement le 8 octobre (sans pictogramme ni formule publicitaire, gardé par un test) ; la catégorie NLP passe de 3 à 16 termes. Une seule catégorie prévue par le type (vision par ordinateur) n'a aucun terme et n'apparaît donc pas dans les filtres |
| Termes survolables dans les cours | Disponible | `GlossaryTerm` : survol pour la définition courte, clic pour le détail ; utilisé dans 23 fichiers de cours et de pages ; les dictionnaires de `components/fundamentals/definitions/` alimentent aussi la page Glossaire |

### Projets (`/projects`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| 12 projets | Partiel | `src/data/projects.ts` : fiches avec description, niveau, technologies, durée, difficulté de 1 à 5, prérequis, objectifs. 5 sont guidés pas à pas dans la section « Projets guidés » (`src/data/lessons/projects/`, format des cours : données fournies, exercices vérifiés par le moteur Python, corrigés) : ventes, iris, sentiment, segmentation de clients (KMeans), prévision de fréquentation (série temporelle). Les 7 autres restent des sujets sans jeu de données ni corrigé, ce que la page dit |
| Recherche et filtres | Disponible | Texte, niveau, durée, catégorie, technologies, progression ; tous les compteurs de la page sont calculés sur les données |
| Suivi par projet | Disponible | Commencé ou terminé, notes (`useCourseProgress("projects")`), enregistrés dans le navigateur |

### Ressources (`/resources`)

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Sélection de ressources externes | Disponible | 3 livres, 2 cours en ligne, 5 sites, 4 chaînes vidéo, avec lien ; les liens sortants ne sont pas vérifiés à chaque build |
| Cours du site par thème | Disponible | `InitiationCoursesSection` : les 10 cours du catalogue, rangés par thème, lus dans `src/data/course-catalog.ts` (niveau, durée indicative et modules viennent du catalogue). Les entrées sans cours (logique formelle, data warehousing, computer vision...) ont été retirées le 8 octobre |

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
| Actualités (flux RSS) | Partiel | **Instantané daté**, pas un flux en direct : `rss-articles.json` contient 20 articles pris le 2 octobre 2026 (4 par source, 5 sources). Le site ne peut pas lire les flux (aucun serveur ; la plupart refusent les requêtes depuis un navigateur). La liste est renouvelée seulement par `npm run news:refresh` puis un nouveau déploiement. La date de l'instantané est affichée sur la page |
| Recherche et filtres des actualités | Disponible | Texte (sans casse ni accents), source, catégorie, bouton de réinitialisation |
| Sources RSS | Disponible | 6 sources déclarées avec adresse du flux copiable (`navigator.clipboard`) pour un lecteur RSS personnel ; « Proposer un flux » ouvre un `mailto:` |
| Source « Le Big Data » | Partiel | Déclarée dans `rss-sources.json`, absente de l'instantané actuel : le flux répond 403 (protection Cloudflare, non contournée) et `news:refresh` l'ignore |

### À propos, Contact, Confidentialité, Conditions

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| À propos | Disponible | Mission, philosophie, public visé, présentation de l'auteur, contenu éducatif, technologies, valeurs, paternité et licence AGPL-3.0-or-later |
| Contact | Disponible | Le formulaire **prépare** un e-mail (`mailto:`, `buildMailDraft`) ; il n'envoie rien lui-même et ne prétend pas l'avoir fait ; si le lien est trop long (plus de 1 800 caractères), le texte est à copier-coller |
| Politique de confidentialité | Disponible | Décrit ce qui est réellement stocké (`localStorage`, `sessionStorage` vidé à la fermeture de l'onglet, cache du service worker), l'absence de cookie, de compte et de mesure d'audience, et les journaux du serveur d'hébergement ; mise à jour au 9 octobre 2026 (`LEGAL_UPDATED`) |
| Conditions d'utilisation | Disponible | Licence du code et des contenus (AGPL-3.0-or-later), exceptions pour les images et les moteurs tiers |
| Pied de page | Disponible | Liens vers les rubriques, les pages légales et le fichier `LICENSE.txt` publié ; lien « Code source sur demande » vers la page Contact ; aucun lien vers le dépôt (`SOURCE_URL` vaut `null`, décision de l'auteur du 5 octobre 2026) |

## Fonctions transversales

| Fonctionnalité | État | Détail vérifié |
| --- | --- | --- |
| Éditeur de code exécutable | Disponible | `CodeEditor.tsx` + `src/lib/runner`. **Python** : Pyodide (CPython en WebAssembly) avec NumPy, pandas, scikit-learn, Matplotlib (rendu Agg : les figures reviennent en PNG sous la sortie) et leurs dépendances (SciPy comprise), délai de 30 s. **SQL** : SQLite via sql.js, base vide en mémoire recréée à chaque exécution, délai de 15 s. **JavaScript** : iframe `sandbox="allow-scripts"` à la politique de sécurité sans réseau, délai de 12 s. Python et SQL tournent dans des Web Workers arrêtés en cas de dépassement. Fichiers multiples, 6 modèles, import, export, copie, plein écran, taille de police, sauvegarde automatique (clé `code-editor-workspace-v1`), raccourcis Ctrl+S et Ctrl+Entrée |
| Autres utilisateurs du moteur | Disponible | Exemples Python des « Concepts avancés » (`AdvancedConcepts.tsx`) et banc d'essai NumPy contre Python pur (`NumpyBenchmark.tsx`) |
| Progression locale | Partiel | Réelle et enregistrée dans le navigateur pour : modules, projets et études de cas (`course-progress-<id>`), cours d'introduction aux maths, parcours de maths, quiz, défis, favoris du blog, ressources de programmation, onglets mémorisés, espace de l'éditeur. **Non enregistrée** : exercices pratiques, concepts avancés et masterclass de la page Programmation (état perdu au rechargement, le texte le dit). La progression du cours Python, convertie au format des leçons, est réelle. En `sessionStorage` (vidé à la fermeture de l'onglet) : positions de lecture et fiches du glossaire déjà affichées. Pas de synchronisation entre appareils |
| Favoris | Disponible | Articles de blog (`blog-favorites-v1`) et ressources de programmation (`ds-bookmarks`) ; pas de favoris pour les cours, termes ou projets |
| Mode clair, sombre, système | Disponible | `ThemeProvider` + `ThemeToggle` : trois choix, suivi en direct de `prefers-color-scheme`, mémorisation (`ds-explorer-theme`), script `theme-init.js` qui pose la classe avant le premier affichage. Les classes de couleur fixes des cours sont converties en mode sombre au build (`tailwind/dark-palette.ts`) ; les couleurs écrites en dur dans un `style` ou un graphique ne le sont pas |
| Hors ligne | Disponible | `public/sw.js` : réseau d'abord pour les pages (repli sur la page d'application mise en cache, puis `offline.html`), cache d'abord pour `assets/` et pour `vendor/` (moteurs, cache distinct qui survit aux déploiements), réponse du cache puis mise à jour en arrière-plan pour le reste. Hors ligne, seules les pages et moteurs déjà chargés sont disponibles ; les liens externes et les actualités exigent le réseau |
| Installation (PWA) | Disponible | `manifest.json` (mode autonome, icônes 192 et 512 px, 3 raccourcis), bouton d'installation capturé dès le démarrage, instructions pour iOS, bandeau fermable. Enregistré en production seulement ; mise à jour proposée par un message « Actualiser » |
| SEO statique | Disponible | Mode `hylst` : une page HTML par route avec titre, description, Open Graph, `canonical` et `og:url` propres (84 pages), pages de redirection pour les 28 anciennes URL, `sitemap.xml` (56 URL), ligne `Sitemap:` dans `robots.txt`, `404.html` autonome ; le build échoue si une route n'a pas de métadonnées. En navigation dans l'application, `RouteMeta` pose les mêmes titre et description |
| Sécurité du build | Disponible | Content-Security-Policy injectée en `<meta>` (`default-src 'self'`, `script-src 'self'`, `connect-src 'self'`, `worker-src 'self'`, `object-src 'none'`) ; les corps d'articles de blog, seul HTML de contenu injecté, passent par DOMPurify (le composant de graphiques injecte du CSS tiré de sa configuration) ; aucune police, aucun script ni image tiers chargés ; `verify-dist.mjs` contrôle la sortie |
| Licence et mentions | Disponible | `NOTICE.md` (avis et exceptions) suivi de `LICENSE` (texte de l'AGPL v3) réunis en `LICENSE.txt` dans la sortie ; inventaire des composants tiers embarqués généré en `vendor/NOTICE.txt` par `sync-runtimes.mjs` |
| Accessibilité | Partiel | Prouvé dans le code : `lang="fr"`, repère `<main>` dans `Layout`, `<nav>` pour la barre de navigation, bouton du menu mobile avec `aria-label` et `aria-expanded`, sélecteur de thème avec `aria-label`, anneau de focus visible sur les boutons, primitives Radix (menus, boîtes de dialogue, onglets, infobulles) qui gèrent le clavier et le focus, 63 lignes contenant `aria-label` dans `src/`, régions `aria-live` ou `role="status"` dans quelques composants (éditeur, filtres d'actualités et de projets, quiz de cours, matrice de corrélation), attribut `alt` sur les images de l'accueil. Depuis le 2 octobre 2026 : lien d'évitement « Aller au contenu » (`Layout`), règle `prefers-reduced-motion` dans `src/index.css` (animations et transitions quasi instantanées, défilement sans lissage), logos décoratifs avec `alt=""`, contrastes WCAG AA repris (audit automatique sur 56 routes : 25 échecs en clair et 30 en sombre contre 1634 et 384 au départ, relevé du 2 octobre). Lighthouse (2 octobre, mobile simulé) : accessibilité 100, 100 et 98 sur les trois pages mesurées. **Non prouvé ou absent** : pas d'audit avec un lecteur d'écran, rendu des équations KaTeX non contrôlé, composants de leçons (`aria-live`, `aria-label`) jamais audités, contrastes non refaits sur le contenu récent ; une douzaine de pastilles colorées dynamiquement restent sous 4,5:1 |
| Mise en page adaptative | Disponible | Pas de défilement horizontal de la page constaté sur les 56 routes à 390, 768, 1024 et 1280 px dans un vrai Chrome le 5 octobre, puis sur les pages modifiées ensuite (contrôle consigné dans `CHANGELOG.md`, non rejoué pour ce document ; les builds du 9 octobre n'ont pas été reparcourus) |
| Tests automatiques | Partiel | Vitest (`npm test`), 45 fichiers et 1 538 tests au dernier passage complet (9 octobre) : stockage, sanitisation, quiz, exécuteur de code, métadonnées de page, identité du site, thème, projets, jeux d'exemple, glossaire, liens internes, formules LaTeX, exemples de code, illustrations, et exemples et corrigés de chaque leçon exécutés par le vrai moteur (`lessons.test.ts`, `lessons-python.test.ts`). Test de fumée des 56 routes et de leurs onglets (`npm run test:smoke`). Pas de test des hooks de progression (`use-course-progress`, `useQuiz`, `use-blog-favorites`, `use-persisted-tab`), pas de test de bout en bout, pas d'intégration continue |

## Limites connues

- **Pas de compte ni de serveur.** Aucune donnée n'est partagée entre appareils ou navigateurs ; vider les données du site efface progression, notes, quiz et code. Aucun certificat n'est délivré (le texte du cours supervisé le dit).
- **Bibliothèques du moteur.** NumPy, pandas, scikit-learn (SciPy comprise) et Matplotlib (rendu Agg, figures affichées sous la sortie) sont fournis. `statsmodels`, `xgboost`, `lightgbm` et `beautifulsoup4` existent dans la distribution Pyodide du site mais ne sont pas livrés (question de poids) ; seaborn, plotly, spacy, TensorFlow et PyTorch n'existent pas dans Pyodide. Un `import` de l'un d'eux échoue avec un `ModuleNotFoundError` explicite.
- **Worker Python (et SQL) de même origine, donc non isolé.** Contrairement à l'iframe JavaScript (origine opaque, sans réseau), les workers Python et SQL sont chargés depuis l'origine du site, sans `sandbox` ni politique propre : la CSP du site est une balise `<meta>` qui ne s'applique pas à un worker. Le code s'exécute sur la machine du visiteur, mais rien dans le dépôt n'empêche ce code d'utiliser les API de l'origine, `fetch` compris (non testé).
- **Moteurs lourds.** 48 Mo dans `public/vendor` (non versionné, recréé par `npm run runtimes:sync`, qui a besoin du réseau la première fois). Ils ne se téléchargent qu'à la première exécution, puis restent en cache.
- **Données externes datées.** Les actualités sont un instantané du 2 octobre 2026. Les chiffres de marché des pages Outils, Introduction et Programmation portent une date de consultation (1er octobre 2026) et vieillissent. Quelques chiffres de la page Bases de données (IDC, Google, McKinsey, Amazon, IBM) et les 13 millisecondes de la masterclass Python restent non vérifiés à la source (`docs/SOURCES.md`). Les liens externes (ressources, forums, vidéos) ne sont pas vérifiés automatiquement.
- **Cours en plan.** Plus aucun depuis le 6 octobre 2026 : les cinq plans de modules ont été rédigés (bases de données, ML supervisé, visualisation, statistiques appliquées, traitement du langage).
- **Contenu illustratif.** Plusieurs encadrés de la préparation des données (validation, automatisation, qualité avancée) montrent des chiffres d'exemple fixes, signalés comme tels dans leur texte.
- **Projets sans corrigé.** 7 projets sur 12 restent des fiches : aucun jeu de données ni solution n'est fourni, et certains sujets (tableau de bord COVID-19, imagerie médicale) demandent des données publiques à récupérer soi-même. Les 5 projets guidés fournissent leurs données (simulées ou intégrées à scikit-learn) et leurs corrigés.
- **Blog limité.** 5 articles, sans recherche ni filtre sur la page `/blog`.
- **Langue.** Interface et contenus uniquement en français ; certaines ressources externes sont en anglais.
- **Code source.** Aucun lien vers le dépôt n'est affiché : `SOURCE_URL` vaut `null` par décision de l'auteur (5 octobre 2026). Le code est proposé sur demande, par la page Contact, ce que l'AGPL permet (offrir l'accès au code source correspondant).

## Écarts constatés dans le contenu

Relevés du 1er octobre 2026 par relecture du code, mis à jour le 9 octobre 2026. Corrigés depuis : « les plus suivis par notre communauté » et les nombres de modules écrits à la main sur l'accueil, l'en-tête « 24 modules » du plan de ML supervisé, la progression fixe du cours Python, l'adresse de contact écrite en dur, le message des défis sur l'exécution du code, la carte « Statistiques inférentielles » en double, le catalogue incomplet, les cours « Bientôt disponible » de la page de maths, les exercices de ML qui importaient un Matplotlib absent, les chiffres écrits à la main de la préparation des données, les estimations de salaires par niveau.

Restent à corriger ou à confirmer :

- Les exercices pratiques et les concepts avancés de la page Programmation tiennent leur état « terminé » en mémoire seulement : il est perdu au rechargement.
- Les exercices de la page Machine learning (`PracticalExercisesSection.tsx`) ne s'exécutent pas, et le défi interactif n'utilise pas le moteur d'exécution de l'éditeur : l'issue reste déclarée par le visiteur.
- `/blog/<identifiant inconnu>` affiche son propre message au lieu de la page 404 (`BlogPost.tsx`, l. 27).
- Pictogrammes décoratifs et points d'exclamation dans les pages et composants (hors glossaire, nettoyé) : l'audit du 9 octobre en relevait environ 1 200 et une centaine ; un retrait des pictogrammes est en cours dans l'arbre de travail (119 restants dans 27 fichiers à la dernière mesure), à recompter avant de s'y fier.
- Six chiffres externes de la page Bases de données et de la masterclass Python ne sont pas relus à la source (`docs/SOURCES.md`).
- Aucun parcours des builds du 9 octobre dans un vrai navigateur (débordement, mode sombre, exécution des cours).

## Méthode de comptage

- **Routes** : `collectRoutes()` de `scripts/collect-routes.ts`, exécuté avec Node 24 ; il lit `App.tsx`, `CourseRouter.tsx`, `config/routes.ts`, `blog-posts.json` et les identifiants de `quizData.ts`. Résultat du 9 octobre : 84 au total, 56 canoniques, 28 anciennes.
- **Cours, modules, exercices, exemples, quiz de module, formules, projets guidés** : les données de `src/data/lessons/` sont importées dans un script jetable (empaqueté avec esbuild, alias `@` vers `src/`) qui compte les sections par type (`exercise`, `code`, `equation`, `widget`) et les questions de chaque module.
- **Quiz, glossaire, projets, catalogue, `PAGE_META`** : mêmes données importées par un script jetable ; totaux par catégorie recoupés avec les fichiers.
- **Blog, actualités** : lecture de `blog-posts.json`, `rss-articles.json` et `rss-sources.json`.
- **Défis, modèles de l'éditeur, ressources** : recherche des déclarations (`id:`, `title:`) dans `InteractiveChallenges.tsx`, `CodeEditor.tsx` et `components/resources/`.
- **Fichiers de test** : `find` sur `src` et `scripts` (fichiers `*.test.ts` et `*.test.tsx`). Le nombre de tests (1 538) vient du dernier passage complet de `npm test` le 9 octobre, non rejoué pour ce document.
- **Moteurs** : taille du dossier `public/vendor` (`du -sh`).
- **Accessibilité, pictogrammes** : recherche de `aria-label`, `aria-live`, `role="status"` dans `src/` ; pictogrammes comptés par propriété Unicode `Extended_Pictographic` dans les fichiers `.ts` et `.tsx` hors tests.
- Rien n'a été exécuté dans le navigateur ni par `npm run build`, `npm test` ou `npm run lint` pour ce document.
