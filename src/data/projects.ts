export type ProjectLevel = "beginner" | "intermediate" | "advanced";

export interface Project {
  id: string;
  title: string;
  description: string;
  level: ProjectLevel;
  technologies: string[];
  /** Identifiant de catégorie, voir CATEGORY_LABELS */
  category: string;
  /** Durée indicative, sous la forme « 3-5 heures » */
  duration: string;
  /** Difficulté de 1 à 5 */
  difficulty: number;
  prerequisites?: string[];
  learningObjectives?: string[];
}

/**
 * Les projets proposés : des sujets à réaliser soi-même. Aucun jeu de données ni corrigé n'est fourni ici, et aucune
 * statistique de fréquentation n'est affichée : le site est statique, il ne compte ni participants ni notes.
 */
export const projects: Project[] = [
  // PROJETS DÉBUTANTS
  {
    id: "beginner-1",
    title: "Analyse exploratoire de données - Ventes",
    description: "Découvrez les bases de l'analyse de données en explorant un jeu de données de ventes (à choisir, par exemple sur data.gouv.fr ou Kaggle). Apprenez à nettoyer, visualiser et extraire des insights.",
    level: "beginner",
    technologies: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    category: "analyse",
    duration: "3-5 heures",
    difficulty: 2,
    prerequisites: ["Bases de Python"],
    learningObjectives: [
      "Manipulation de DataFrames",
      "Statistiques descriptives",
      "Visualisations basiques",
      "Détection de valeurs aberrantes"
    ]
  },
  {
    id: "beginner-2",
    title: "Classification des fleurs d'Iris",
    description: "Votre premier modèle de machine learning ! Classifiez les variétés de fleurs d'Iris avec des algorithmes simples.",
    level: "beginner",
    technologies: ["Python", "scikit-learn", "Matplotlib", "NumPy"],
    category: "machine learning",
    duration: "4-6 heures",
    difficulty: 2,
    prerequisites: ["Python de base", "Statistiques de base"],
    learningObjectives: [
      "Algorithmes de classification",
      "Préparation des données",
      "Évaluation de modèles",
      "Validation croisée"
    ]
  },
  {
    id: "beginner-3",
    title: "Dashboard COVID-19 avec Streamlit",
    description: "Créez un tableau de bord interactif pour visualiser l'évolution des données COVID-19 mondiales.",
    level: "beginner",
    technologies: ["Python", "Streamlit", "Plotly", "Pandas"],
    category: "visualisation",
    duration: "5-7 heures",
    difficulty: 3,
    prerequisites: ["Python", "Pandas"],
    learningObjectives: [
      "Applications web avec Streamlit",
      "Visualisations interactives",
      "APIs de données",
      "Déploiement d'applications"
    ]
  },
  {
    id: "beginner-4",
    title: "Analyse de Sentiments sur des Messages Courts",
    description: "Analysez les sentiments de messages courts (avis clients, publications de réseaux sociaux) avec des techniques de NLP simples.",
    level: "beginner",
    technologies: ["Python", "NLTK", "TextBlob", "Pandas"],
    category: "nlp",
    duration: "4-6 heures",
    difficulty: 2,
    prerequisites: ["Python de base"],
    learningObjectives: [
      "Constitution d'un jeu de textes",
      "Préprocessing de texte",
      "Analyse de sentiments",
      "Visualisation de résultats"
    ]
  },
  
  // PROJETS INTERMÉDIAIRES
  {
    id: "intermediate-1",
    title: "Système de Recommandation E-commerce",
    description: "Développez un système de recommandation complet pour un site e-commerce avec filtrage collaboratif et basé sur le contenu.",
    level: "intermediate",
    technologies: ["Python", "scikit-learn", "Surprise", "Flask", "PostgreSQL"],
    category: "recommandation",
    duration: "12-15 heures",
    difficulty: 4,
    prerequisites: ["Machine Learning de base", "Algèbre linéaire", "SQL"],
    learningObjectives: [
      "Filtrage collaboratif",
      "Recommandations basées sur le contenu",
      "Évaluation des systèmes de recommandation",
      "API REST avec Flask"
    ]
  },
  {
    id: "intermediate-2",
    title: "Prédiction des Prix Immobiliers",
    description: "Créez un modèle de régression avancé pour prédire les prix immobiliers en utilisant des données géographiques et économiques.",
    level: "intermediate",
    technologies: ["Python", "XGBoost", "GeoPandas", "Folium", "Docker"],
    category: "regression",
    duration: "10-14 heures",
    difficulty: 4,
    prerequisites: ["Statistiques avancées", "Python intermédiaire"],
    learningObjectives: [
      "Régression avec XGBoost",
      "Données géographiques",
      "Feature engineering avancé",
      "Validation et optimisation"
    ]
  },
  {
    id: "intermediate-3",
    title: "Détection de Fraudes Bancaires",
    description: "Implémentez des algorithmes de détection d'anomalies pour identifier les transactions frauduleuses en temps réel.",
    level: "intermediate",
    technologies: ["Python", "scikit-learn", "Kafka", "Redis", "Elasticsearch"],
    category: "anomaly-detection",
    duration: "15-18 heures",
    difficulty: 4,
    prerequisites: ["Machine Learning", "Statistiques", "Bases de données"],
    learningObjectives: [
      "Détection d'anomalies",
      "Données déséquilibrées",
      "Streaming de données",
      "Systèmes temps réel"
    ]
  },

  // PROJETS AVANCÉS
  {
    id: "advanced-1",
    title: "Classification d'Images Médicales avec CNN",
    description: "Développez, à but pédagogique, un classifieur d'images médicales à base de réseaux de neurones convolutifs. Cet exercice ne constitue pas un dispositif médical.",
    level: "advanced",
    technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "pydicom"],
    category: "computer-vision",
    duration: "20-25 heures",
    difficulty: 5,
    prerequisites: ["Deep Learning", "Computer Vision", "Python avancé"],
    learningObjectives: [
      "CNNs pour l'imagerie médicale",
      "Transfer Learning",
      "Gestion des données DICOM",
      "Éthique en IA médicale"
    ]
  },
  {
    id: "advanced-2",
    title: "Traduction Automatique avec Transformers",
    description: "Construisez un système de traduction automatique fondé sur l'architecture Transformer (Vaswani et al., 2017).",
    level: "advanced",
    technologies: ["Python", "PyTorch", "Transformers", "CUDA", "Weights&Biases"],
    category: "nlp",
    duration: "25-30 heures",
    difficulty: 5,
    prerequisites: ["NLP avancé", "Deep Learning", "Attention mechanisms"],
    learningObjectives: [
      "Architecture Transformer",
      "Attention multi-têtes",
      "Fine-tuning de modèles pré-entraînés",
      "Évaluation BLEU/chrF"
    ]
  },
  {
    id: "advanced-3",
    title: "Système de Trading Algorithmique",
    description: "Développez une stratégie de trading automatisée utilisant le machine learning et l'analyse technique avancée.",
    level: "advanced",
    technologies: ["Python", "backtrader", "QuantLib", "Apache Airflow", "Docker"],
    category: "finance",
    duration: "30-35 heures",
    difficulty: 5,
    prerequisites: ["Finance quantitative", "Séries temporelles", "ML avancé"],
    learningObjectives: [
      "Stratégies quantitatives",
      "Backtesting rigoureux",
      "Gestion des risques",
      "Déploiement en production"
    ]
  }

];

export const LEVELS: ProjectLevel[] = ["beginner", "intermediate", "advanced"];

export const LEVEL_LABELS: Record<ProjectLevel, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé"
};

export const CATEGORY_LABELS: Record<string, string> = {
  "analyse": "Analyse de données",
  "machine learning": "Machine Learning",
  "visualisation": "Visualisation",
  "nlp": "Traitement du langage naturel",
  "recommandation": "Systèmes de recommandation",
  "regression": "Régression",
  "anomaly-detection": "Détection d'anomalies",
  "computer-vision": "Vision par ordinateur",
  "finance": "Finance quantitative"
};

export const categoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category;

/** Durée minimale et maximale d'un projet, en heures (d'après « 3-5 heures ») */
export const hoursOf = (project: Project): [number, number] => {
  const match = project.duration.match(/(\d+)\s*-\s*(\d+)/);
  return match ? [Number(match[1]), Number(match[2])] : [0, 0];
};

export type DurationFilter = "all" | "short" | "medium" | "long";
export const DURATION_LABELS: Record<Exclude<DurationFilter, "all">, string> = {
  short: "Court : jusqu'à 4 h",
  medium: "Moyen : 5 à 12 h",
  long: "Long : 13 h et plus"
};

/** Rangement par durée minimale annoncée : court jusqu'à 4 h, moyen de 5 à 12 h, long à partir de 13 h */
export const durationBucket = (project: Project): Exclude<DurationFilter, "all"> => {
  const [min] = hoursOf(project);
  return min <= 4 ? "short" : min <= 12 ? "medium" : "long";
};

export type ProgressFilter = "all" | "todo" | "started" | "done";
export const PROGRESS_LABELS: Record<Exclude<ProgressFilter, "all">, string> = {
  todo: "À faire",
  started: "En cours",
  done: "Terminés"
};

export interface ProjectFilterState {
  query: string;
  level: "all" | ProjectLevel;
  category: string;
  duration: DurationFilter;
  technologies: string[];
  progress: ProgressFilter;
}

export const DEFAULT_FILTERS: ProjectFilterState = {
  query: "",
  level: "all",
  category: "all",
  duration: "all",
  technologies: [],
  progress: "all"
};

/** Comparaison sans casse ni accents */
const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Un projet doit satisfaire tous les filtres actifs. Avec plusieurs technologies cochées, il doit toutes les utiliser.
 * `statusOf` donne l'avancement du visiteur (enregistré dans son navigateur) pour le filtre « progression ».
 */
export const matchesFilters = (
  project: Project,
  filters: ProjectFilterState,
  statusOf: (projectId: string) => "todo" | "started" | "done"
): boolean => {
  const query = normalize(filters.query.trim());
  if (query) {
    const haystack = normalize(
      [project.title, project.description, categoryLabel(project.category), ...project.technologies, ...(project.learningObjectives ?? [])].join(" ")
    );
    if (!haystack.includes(query)) return false;
  }
  if (filters.level !== "all" && project.level !== filters.level) return false;
  if (filters.category !== "all" && project.category !== filters.category) return false;
  if (filters.duration !== "all" && durationBucket(project) !== filters.duration) return false;
  if (filters.technologies.length > 0 && !filters.technologies.every((tech) => project.technologies.includes(tech))) return false;
  if (filters.progress !== "all" && statusOf(project.id) !== filters.progress) return false;
  return true;
};

/** Valeurs distinctes présentes dans les données, triées : les filtres ne proposent que ce qui existe */
export const allTechnologies = [...new Set(projects.flatMap((project) => project.technologies))].sort((a, b) => a.localeCompare(b));
export const allCategories = [...new Set(projects.map((project) => project.category))].sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));

/** Résumé d'un niveau, calculé sur les données : nombre de projets et fourchette de durée */
export const levelSummary = (level: ProjectLevel) => {
  const ofLevel = projects.filter((project) => project.level === level);
  const hours = ofLevel.map(hoursOf);
  return {
    count: ofLevel.length,
    minHours: Math.min(...hours.map(([min]) => min)),
    maxHours: Math.max(...hours.map(([, max]) => max))
  };
};
