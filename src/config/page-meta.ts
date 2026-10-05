// Titres et descriptions des pages statiques (SEO et onglet du navigateur).
// Source unique : lue par le composant RouteMeta (navigation dans l'app) et par vite.config.ts (une page HTML par route).
// `title` s'écrit sans le nom du site : il est ajouté par fullTitle(). Longueurs visées : titre 20-38, description 110-160.
// Un test automatique (page-meta.test.ts) vérifie la couverture de toutes les routes, les longueurs et l'unicité.
import { SITE_DESCRIPTION, SITE_NAME } from "./site";

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  "/about": { title: "À propos du projet et de son auteur", description: "Présentation du projet : mission, public visé, auteur Geoffroy Streit, technologies employées, paternité et licence AGPL du site éducatif." },
  "/blog": { title: "Blog data science : guides et cas", description: "Blog data science : articles sur les métiers de la data, le nettoyage des données, corrélation et causalité, visualisation, avec des études de cas." },
  "/community": { title: "Communauté data science", description: "Communauté data science : forums, événements, comptes et chaînes à suivre, projets où contribuer et instantané daté d'actualités issues de flux RSS." },
  "/contact": { title: "Contact : écrire à l'auteur du site", description: "Contact avec Geoffroy Streit : questions, suggestions, collaborations ou erreurs à signaler. Le formulaire prépare un e-mail que vous envoyez vous-même." },
  "/courses": { title: "Catalogue des cours de data science", description: "Catalogue des cours : Python, statistiques, bases de données, visualisation, machine learning supervisé et traitement du langage, avec niveau et durée." },
  "/courses/databases/database-fundamentals": { title: "Fondamentaux des bases de données", description: "Plan du cours de bases de données : modules annoncés (SQL, modélisation, NoSQL, indexation), idées de projets, outils cités et suivi dans le navigateur." },
  "/courses/dataviz/data-visualization": { title: "Visualisation de données avancée", description: "Plan du cours de visualisation : modules annoncés sur Matplotlib, Seaborn, Plotly, Altair et D3.js, idées de projets et galerie d'inspiration." },
  "/courses/machine-learning/ml-models-guide": { title: "Modèles de machine learning", description: "Fiches sur les modèles de machine learning : arbres, forêts aléatoires, K-Means, Q-Learning, réseaux de neurones, avec analogies, limites et guide de choix." },
  "/courses/machine-learning/supervised-learning": { title: "Machine learning supervisé : cours", description: "Plan du cours de machine learning supervisé : modules annoncés (régressions, arbres, forêts, SVM, validation), projets proposés et auto-évaluation." },
  "/courses/machine-learning/transformers": { title: "Transformers en machine learning", description: "Transformers en machine learning : standardiser, normaliser et uniformiser les données avec scikit-learn, puis attention, BERT, GPT et Vision Transformers." },
  "/courses/math-stats/inferential-statistics": { title: "Statistiques inférentielles", description: "Statistiques inférentielles : tests d'hypothèses (t, Z, khi-deux), intervalles de confiance et approche bayésienne, avec graphiques et exercices résolus." },
  "/courses/math-stats/math-intro": { title: "Introduction aux mathématiques", description: "Introduction aux mathématiques pour la data science : ensembles, fonctions, calcul différentiel et intégral, avec exercices et suivi de progression." },
  "/courses/nlp/natural-language-processing": { title: "Traitement du langage naturel", description: "Plan du cours de traitement du langage naturel : modules annoncés (prétraitement, TF-IDF, sentiment, BERT, GPT), projets proposés et bibliothèques citées." },
  "/courses/programming/python-basics": { title: "Python pour la data science", description: "Cours de Python pour la data science : syntaxe, structures de contrôle, fonctions, NumPy, pandas, Matplotlib et Jupyter, avec exemples de code et exercices." },
  "/courses/statistics/applied-statistics": { title: "Statistiques appliquées", description: "Plan du cours de statistiques appliquées : modules annoncés (tests d'hypothèses, régression, ANOVA), cas d'étude à réaliser et outils Python et R cités." },
  "/fundamentals": { title: "Fondamentaux de la data science", description: "Fondamentaux de la data science : accès aux parcours de mathématiques et statistiques, programmation, préparation des données et bases de données." },
  "/fundamentals/data-preparation": { title: "Préparation des données", description: "Préparation des données : cycle de vie, collecte, audit de qualité, nettoyage, transformation, exploration visuelle, validation et automatisation." },
  "/fundamentals/databases": { title: "Bases de données : SQL et NoSQL", description: "Bases de données pour la data science : SQL, NoSQL, modélisation, index et performance, sécurité, big data et exercices corrigés." },
  "/fundamentals/math-stats": { title: "Mathématiques et statistiques", description: "Mathématiques et statistiques pour la data science : concepts clés, parcours du débutant à l'avancé, cours disponibles, applications et visualisations." },
  "/fundamentals/math-stats/advanced-statistics": { title: "Statistiques avancées", description: "Statistiques avancées : tests d'hypothèses, intervalles de confiance, ANOVA, régression avancée et statistiques bayésiennes, avec applications par domaine." },
  "/fundamentals/math-stats/descriptive-statistics": { title: "Statistiques descriptives", description: "Statistiques descriptives : moyenne, médiane, dispersion, covariance et corrélation, avec laboratoires interactifs sur des jeux d'exemple et applications." },
  "/fundamentals/math-stats/differential-calculus": { title: "Calcul différentiel et optimisation", description: "Calcul différentiel : concept de dérivée, règles de dérivation, optimisation, gradients et dérivées partielles, avec exercices interactifs." },
  "/fundamentals/math-stats/integral-calculus": { title: "Calcul intégral et applications", description: "Calcul intégral : intégrales définie et indéfinie, techniques d'intégration, applications aux probabilités continues et à l'AUC, avec exercices résolus." },
  "/fundamentals/math-stats/linear-algebra": { title: "Algèbre linéaire et machine learning", description: "Algèbre linéaire : vecteurs, matrices, opérations matricielles, décompositions (valeurs propres, SVD, LU, QR), applications au deep learning et exercices." },
  "/fundamentals/math-stats/probability-theory": { title: "Théorie des probabilités", description: "Théorie des probabilités : bases, probabilité conditionnelle, variables aléatoires, lois usuelles, loi normale, théorème de Bayes, applications et quiz." },
  "/fundamentals/programming": { title: "Programmation pour la data science", description: "Programmation pour la data science : Python, comparaison avec R, SQL et Julia, exercices, défis et éditeur exécutant Python, SQL et JavaScript." },
  "/glossary": { title: "Glossaire de data science", description: "Glossaire de data science : recherche d'un terme, filtre par catégorie (machine learning, statistiques, NLP, MLOps) et définition de chaque notion." },
  "/introduction": { title: "Introduction à la data science", description: "Introduction à la data science : définition, histoire, piliers, cycle de vie d'un projet, applications, métiers du domaine et ressources pour débuter." },
  "/machine-learning": { title: "Machine learning : vue d'ensemble", description: "Machine learning : introduction, cours sur l'apprentissage supervisé, non supervisé et par renforcement, évaluation des modèles, deep learning et exercices." },
  "/machine-learning/reinforcement": { title: "Apprentissage par renforcement", description: "Apprentissage par renforcement : agent, environnement et récompense, Q-Learning, SARSA, DQN et PPO, applications, projets et ressources." },
  "/machine-learning/supervised": { title: "Apprentissage supervisé", description: "Apprentissage supervisé : classification, régressions linéaire, polynomiale et logistique, forêts aléatoires, SVM, applications, projets et ressources." },
  "/machine-learning/unsupervised": { title: "Apprentissage non supervisé", description: "Apprentissage non supervisé : clustering (K-means, hiérarchique), réduction de dimension (PCA, t-SNE, UMAP), détection d'anomalies, applications et projets." },
  "/privacy": { title: "Politique de confidentialité", description: "Politique de confidentialité : ni compte, ni cookie, ni mesure d'audience. Progression, quiz et code restent dans votre navigateur, sans être transmis." },
  "/projects": { title: "Projets de data science à réaliser", description: "Projets de data science classés par niveau, avec durée, prérequis, objectifs et technologies. Ce sont des sujets à réaliser vous-même, sans corrigé fourni." },
  "/quiz": { title: "Quiz de data science par thème", description: "Quiz de data science, de la programmation à la business intelligence, avec explications des réponses ; scores et historique gardés dans votre navigateur." },
  "/resources": { title: "Ressources d'apprentissage", description: "Ressources d'apprentissage : parcours d'initiation par domaine, livres, cours en ligne, sites web et chaînes vidéo pour apprendre la data science." },
  "/terms": { title: "Conditions d'utilisation", description: "Conditions d'utilisation : usage du contenu éducatif, licence AGPL-3.0-or-later, composants tiers, utilisation responsable et limitation de responsabilité." },
  "/tools": { title: "Outils de data science", description: "Outils de data science : langages, traitement et stockage des données, frameworks de machine learning, visualisation, documentation et aide au choix." },
  "/tools/programming": { title: "Langages pour la data science", description: "Langages pour la data science : usage selon les enquêtes Stack Overflow, taille des registres de paquets, forces et limites de Python, R, Julia et d'autres." },
  "/tools/data-processing": { title: "Outils de traitement des données", description: "Outils de traitement des données : bases SQL et NoSQL, entrepôts de données, ETL et pipelines (Airflow, dbt), moteurs Big Data comme Spark, aide au choix." },
  "/tools/ml-frameworks": { title: "Frameworks de machine learning", description: "Frameworks de machine learning : scikit-learn, TensorFlow, PyTorch, XGBoost, usage selon l'enquête Stack Overflow 2024, exemples de code et outils de MLOps." },
  "/tools/visualization": { title: "Outils de visualisation de données", description: "Outils de visualisation : exemples de graphiques, bibliothèques (Matplotlib, Seaborn, ggplot2, D3.js), outils BI (Tableau, Power BI) et aide au choix." },
};

/** Titre de la page d'accueil (le seul qui n'a pas la forme « <page> - <site> ») */
export const HOME_TITLE = `${SITE_NAME} - Cours, quiz et code exécuté dans le navigateur`;

/** Titre complet d'une page : « <titre> - Explorons la Data Science » */
export const fullTitle = (title: string) => `${title} - ${SITE_NAME}`;

/** Titre et description d'une route statique (l'accueil compris) ; `undefined` pour les routes dynamiques (articles, quiz) */
export const pageMetaFor = (route: string): { title: string; description: string } | undefined => {
  const normalized = route.length > 1 ? route.replace(/\/+$/, "") : route;
  if (normalized === "/") return { title: HOME_TITLE, description: SITE_DESCRIPTION };
  const meta = PAGE_META[normalized];
  return meta ? { title: fullTitle(meta.title), description: meta.description } : undefined;
};
