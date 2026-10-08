// Catalogue des cours : source unique de l'accueil (FeaturedCourses) et de la page /courses (CoursesIndex).
// Niveau, durée et nombre de modules reprennent ce qu'affiche la page de chaque cours ; ne rien inventer ici.
// Les champs absents (`level`, `duration`, `modules`) ne sont pas annoncés par la page du cours : la carte ne les affiche pas.

/** `redige` : leçons écrites. `plan` : gabarit avec la liste des modules annoncés, sans leçon pour l'instant. */
export type CourseStatus = "redige" | "plan";

export type CourseCategoryId = "programming" | "math-stats" | "databases" | "dataviz" | "machine-learning" | "ai";

export interface CatalogCourse {
  id: string;
  category: CourseCategoryId;
  title: string;
  description: string;
  level?: string;
  /** Durée indicative, à votre rythme (affichée avec la mention « indicatif ») */
  duration?: string;
  modules?: number;
  href: string;
  status: CourseStatus;
}

export const COURSE_CATEGORIES: { id: CourseCategoryId; title: string; description: string }[] = [
  { id: "programming", title: "Programmation", description: "Langages et outils de développement pour la Data Science" },
  { id: "math-stats", title: "Mathématiques et statistiques", description: "Concepts mathématiques et statistiques essentiels" },
  { id: "databases", title: "Bases de données", description: "SQL, NoSQL et gestion de données pour la Data Science" },
  { id: "dataviz", title: "Visualisation", description: "Créer des visualisations impactantes et interactives" },
  { id: "machine-learning", title: "Machine Learning", description: "Algorithmes et techniques d'apprentissage automatique" },
  { id: "ai", title: "Intelligence Artificielle", description: "NLP et techniques avancées d'IA" },
];

export const COURSE_CATALOG: CatalogCourse[] = [
  {
    id: "python-basics",
    category: "programming",
    title: "Python pour la data science",
    description: "De la première ligne de Python à NumPy, pandas et Matplotlib : exemples exécutés dans le navigateur, exercices vérifiés.",
    level: "Débutant",
    duration: "≈ 15 h 30",
    modules: 7,
    href: "/courses/programming/python-basics",
    status: "redige",
  },
  {
    id: "math-intro",
    category: "math-stats",
    title: "Introduction aux mathématiques",
    description: "Ensembles, fonctions, calcul différentiel et intégral : cinq modules avec exercices et quiz de fin de module.",
    level: "Débutant",
    duration: "≈ 3 heures",
    modules: 5,
    href: "/courses/math-stats/math-intro",
    status: "redige",
  },
  {
    id: "inferential-statistics",
    category: "math-stats",
    title: "Statistiques inférentielles",
    description: "Tests d'hypothèses, intervalles de confiance et approche bayésienne, avec graphiques et exercices résolus.",
    level: "Intermédiaire",
    href: "/courses/math-stats/inferential-statistics",
    status: "redige",
  },
  {
    id: "applied-statistics",
    category: "math-stats",
    title: "Statistiques appliquées",
    description: "Tests d'hypothèses, corrélation, ANOVA et tests non paramétriques, calculés pour de vrai avec scipy et pandas.",
    level: "Intermédiaire",
    duration: "≈ 11 h 30",
    modules: 6,
    href: "/courses/statistics/applied-statistics",
    status: "redige",
  },
  {
    id: "database-fundamentals",
    category: "databases",
    title: "Fondamentaux des bases de données",
    description: "SQL pas à pas, modélisation, JSON et index : exemples et exercices exécutés dans votre navigateur.",
    level: "Débutant",
    duration: "≈ 14 h 30",
    modules: 6,
    href: "/courses/databases/database-fundamentals",
    status: "redige",
  },
  {
    id: "data-visualization",
    category: "dataviz",
    title: "Visualisation de données",
    description: "Choisir le bon graphique et le réaliser avec Matplotlib, des distributions aux tableaux de bord.",
    level: "Intermédiaire",
    duration: "≈ 13 h 30",
    modules: 7,
    href: "/courses/dataviz/data-visualization",
    status: "redige",
  },
  {
    id: "supervised-learning",
    category: "machine-learning",
    title: "Machine Learning supervisé",
    description: "Régressions, arbres, forêts, SVM, évaluation et réglages : des modèles entraînés pour de vrai avec scikit-learn.",
    level: "Intermédiaire",
    duration: "≈ 18 h",
    modules: 8,
    href: "/courses/machine-learning/supervised-learning",
    status: "redige",
  },
  {
    id: "ml-models-guide",
    category: "machine-learning",
    title: "Guide des modèles de machine learning",
    description: "Arbres, forêts aléatoires, K-Means, Q-Learning et réseaux de neurones, avec analogies, limites et guide de choix.",
    level: "Intermédiaire",
    duration: "6 semaines",
    href: "/courses/machine-learning/ml-models-guide",
    status: "redige",
  },
  {
    id: "transformers",
    category: "machine-learning",
    title: "Transformers en machine learning",
    description: "Standardiser, normaliser et uniformiser les données avec scikit-learn, puis attention, BERT, GPT et Vision Transformers.",
    href: "/courses/machine-learning/transformers",
    status: "redige",
  },
  {
    id: "natural-language-processing",
    category: "ai",
    title: "Traitement du langage naturel",
    description: "Nettoyage, TF-IDF, sentiment, entités, attention et génération, exécutés pour de vrai avec scikit-learn et NumPy.",
    level: "Intermédiaire",
    duration: "≈ 17 h 30",
    modules: 8,
    href: "/courses/nlp/natural-language-processing",
    status: "redige",
  },
];

/** Cours mis en avant sur l'accueil : des cours dont les leçons sont rédigées */
export const FEATURED_COURSE_IDS = ["python-basics", "math-intro", "ml-models-guide"];
