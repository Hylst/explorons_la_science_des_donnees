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
 * Les projets proposés. Certains sont guidés pas à pas (src/data/lessons/projects : données, exercices vérifiés, corrigés) ;
 * les autres sont des sujets à réaliser soi-même, sans jeu de données ni corrigé fournis. Aucune
 * statistique de fréquentation n'est affichée : le site est statique, il ne compte ni participants ni notes.
 */
export const projects: Project[] = [
  // PROJETS DÉBUTANTS
  {
    id: "beginner-1",
    title: "Analyse exploratoire de données : ventes",
    description: "Découvrez les bases de l'analyse de données sur un jeu de ventes fictif fourni (projet guidé), puis refaites-la sur de vraies données, par exemple de data.gouv.fr. Nettoyer, calculer, visualiser, conclure.",
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
    description: "Votre premier modèle de machine learning ! Classifiez les trois espèces de fleurs d'Iris avec des algorithmes simples.",
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
    title: "Tableau de bord COVID-19 avec Streamlit",
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
    title: "Analyse de sentiments sur des messages courts",
    description: "Analysez le sentiment d'avis courts (projet guidé sur un corpus fictif fourni) : une méthode à base de lexique, puis un modèle TF-IDF, et leurs limites. TextBlob et VADER, conçus pour l'anglais, ne conviennent pas au français.",
    level: "beginner",
    technologies: ["Python", "scikit-learn", "NumPy"],
    category: "nlp",
    duration: "4-6 heures",
    difficulty: 2,
    prerequisites: ["Python de base"],
    learningObjectives: [
      "Constitution d'un jeu de textes",
      "Prétraitement de texte",
      "Analyse de sentiments",
      "Visualisation de résultats"
    ]
  },
  
  // PROJETS INTERMÉDIAIRES
  {
    id: "intermediate-1",
    title: "Système de recommandation pour le commerce en ligne",
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
    title: "Prédiction des prix immobiliers",
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
      "Construction de variables avancée (feature engineering)",
      "Validation et optimisation"
    ]
  },
  {
    id: "intermediate-3",
    title: "Détection de fraudes bancaires",
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
  {
    id: "intermediate-4",
    title: "Segmenter les clients d'un café-médiathèque",
    description: "300 clients fictifs décrits par leur dernière visite, leur fréquence et leur panier : mise à l'échelle, KMeans, choix du nombre de groupes, lecture prudente des groupes, puis limites (initialisation, autre méthode, forme, stabilité).",
    level: "intermediate",
    technologies: ["Python", "scikit-learn", "pandas", "Matplotlib"],
    category: "clustering",
    duration: "3-4 heures",
    difficulty: 3,
    prerequisites: ["pandas de base", "Notions de distance et d'écart-type"],
    learningObjectives: [
      "Comprendre l'effet de la mise à l'échelle sur KMeans",
      "Choisir un nombre de groupes avec l'inertie et la silhouette",
      "Décrire des groupes en unités d'origine",
      "Éprouver la stabilité d'une segmentation"
    ]
  },
  {
    id: "intermediate-5",
    title: "Prévoir la fréquentation d'une médiathèque",
    description: "Deux ans de visites quotidiennes (données fictives) : saisonnalités de la semaine et de l'année, découpage dans le temps, prévision de référence puis régression sur le calendrier, comparées au même horizon.",
    level: "intermediate",
    technologies: ["Python", "pandas", "scikit-learn", "Matplotlib"],
    category: "series-temporelles",
    duration: "3-4 heures",
    difficulty: 3,
    prerequisites: ["pandas de base", "Régression linéaire"],
    learningObjectives: [
      "Manipuler une série temporelle avec pandas",
      "Découper les données dans le temps",
      "Comparer un modèle à une prévision de référence",
      "Raisonner sur l'horizon de prévision"
    ]
  },

  // PROJETS AVANCÉS
  {
    id: "advanced-1",
    title: "Classification d'images médicales avec un CNN",
    description: "Développez, à but pédagogique, un classifieur d'images médicales à base de réseaux de neurones convolutifs. Cet exercice ne constitue pas un dispositif médical.",
    level: "advanced",
    technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "pydicom"],
    category: "computer-vision",
    duration: "20-25 heures",
    difficulty: 5,
    prerequisites: ["Deep Learning", "Vision par ordinateur", "Python avancé"],
    learningObjectives: [
      "CNNs pour l'imagerie médicale",
      "Apprentissage par transfert",
      "Gestion des données DICOM",
      "Éthique en IA médicale"
    ]
  },
  {
    id: "advanced-2",
    title: "Traduction automatique avec des Transformers",
    description: "Construisez un système de traduction automatique fondé sur l'architecture Transformer (Vaswani et al., 2017).",
    level: "advanced",
    technologies: ["Python", "PyTorch", "Transformers", "CUDA", "Weights & Biases"],
    category: "nlp",
    duration: "25-30 heures",
    difficulty: 5,
    prerequisites: ["NLP avancé", "Deep Learning", "Mécanismes d'attention"],
    learningObjectives: [
      "Architecture Transformer",
      "Attention multi-têtes",
      "Ajustement fin de modèles préentraînés",
      "Évaluation BLEU/chrF"
    ]
  },
  {
    id: "advanced-3",
    title: "Système de trading algorithmique",
    description: "Développez, à but pédagogique, une stratégie de trading automatisée testée sur données historiques (backtesting). Cet exercice n'est pas un conseil en investissement : les performances passées ne préjugent pas des résultats futurs.",
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
  "finance": "Finance quantitative",
  "series-temporelles": "Séries temporelles",
  "clustering": "Segmentation (clustering)"
};

export const categoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category;

/** Durée minimale et maximale d'un projet, en heures (d'après « 3-5 heures ») */
export const hoursOf = (project: Project): [number, number] => {
  const match = project.duration.match(/(\d+)\s*-\s*(\d+)/);
  return match ? [Number(match[1]), Number(match[2])] : [0, 0];
};

export type DurationFilter = "all" | "short" | "medium" | "long";
export const DURATION_LABELS: Record<Exclude<DurationFilter, "all">, string> = {
  short: "Court : démarre à 4 h ou moins",
  medium: "Moyen : démarre entre 5 et 12 h",
  long: "Long : démarre à 13 h ou plus"
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
