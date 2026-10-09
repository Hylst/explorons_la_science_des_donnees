
import ResourcesSection from "../shared/ResourcesSection";

const resources = [
  {
    title: "The Elements of Statistical Learning",
    description: "Référence académique dont un chapitre traite en profondeur le clustering, l'ACP et d'autres techniques non supervisées, avec une approche mathématique rigoureuse.",
    type: "book" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "https://hastie.su.domains/ElemStatLearn/",
    free: true
  },
  {
    title: "Hands-On Unsupervised Learning Using Python (Ankur A. Patel, O'Reilly, 2019)",
    description: "Guide pratique avec implémentations Python du clustering, de la réduction de dimensionnalité et de la détection d'anomalies.",
    type: "book" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    free: false
  },
  {
    title: "CS229: Machine Learning - Unsupervised Learning",
    description: "Cours de Stanford dont les notes couvrent notamment K-means, l'algorithme EM, l'ACP et l'ICA.",
    type: "video" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "http://cs229.stanford.edu/",
    free: true
  },
  {
    title: "Scikit-learn Clustering Guide",
    description: "Documentation de scikit-learn sur les algorithmes de clustering, avec une comparaison et des exemples.",
    type: "website" as const,
    difficulty: "Débutant" as const,
    language: "Anglais",
    url: "https://scikit-learn.org/stable/modules/clustering.html",
    free: true
  },
  {
    title: "UMAP: Uniform Manifold Approximation",
    description: "Implémentation Python de UMAP pour la réduction de dimensionnalité non linéaire, avec une documentation détaillée.",
    type: "code" as const,
    difficulty: "Intermédiaire" as const,
    language: "Python",
    url: "https://umap-learn.readthedocs.io/en/latest/",
    free: true
  },
  {
    title: "Andrew Ng - Unsupervised Learning, Recommenders, Reinforcement Learning",
    description: "Cours de la spécialisation Machine Learning (DeepLearning.AI et Stanford Online) : clustering, détection d'anomalies, systèmes de recommandation et apprentissage par renforcement.",
    type: "video" as const,
    difficulty: "Débutant" as const,
    language: "Anglais",
    url: "https://www.coursera.org/learn/unsupervised-learning-recommenders-reinforcement-learning",
    free: false
  },
  {
    title: "Anomaly Detection: A Survey",
    description: "Article de synthèse sur les techniques de détection d'anomalies (Chandola, Banerjee et Kumar, ACM Computing Surveys, 2009).",
    type: "website" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    free: true
  },
  {
    title: "PyOD: Python Outlier Detection",
    description: "Bibliothèque Python pour la détection d'anomalies, qui regroupe de nombreux détecteurs (voir la documentation pour la liste à jour).",
    type: "code" as const,
    difficulty: "Intermédiaire" as const,
    language: "Python",
    url: "https://pyod.readthedocs.io/en/latest/",
    free: true
  },
  {
    title: "t-SNE : page des implémentations de van der Maaten",
    description: "Implémentations et ressources autour de t-SNE (article original : van der Maaten et Hinton, « Visualizing Data using t-SNE », JMLR, 2008).",
    type: "website" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "https://lvdmaaten.github.io/tsne/",
    free: true
  },
  {
    title: "Kaggle Learn : Feature Engineering (leçon sur K-means)",
    description: "Cours pratique sur Kaggle ; une leçon utilise K-means pour créer des variables.",
    type: "website" as const,
    difficulty: "Débutant" as const,
    language: "Anglais",
    url: "https://www.kaggle.com/learn/feature-engineering",
    free: true
  },
  {
    title: "r/MachineLearning",
    description: "Communauté Reddit généraliste sur le machine learning (recherche, actualités, discussions).",
    type: "community" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "https://reddit.com/r/MachineLearning",
    free: true
  }
];

const tips = [
  "Commencez par explorer vos données avec des visualisations",
  "Standardisez les variables pour les algorithmes fondés sur des distances (K-means, clustering hiérarchique, DBSCAN)",
  "Utilisez plusieurs mesures (silhouette, inertie, et l'indice de Rand ajusté quand on dispose d'une référence) pour comparer les résultats",
  "Essayez plusieurs valeurs des hyperparamètres : elles changent beaucoup les résultats",
  "Validez vos clusters avec l'expertise métier, pas seulement les métriques"
];

const warnings = [
  "Les résultats peuvent varier selon l'initialisation : testez plusieurs exécutions",
  "Attention à la malédiction de la dimensionnalité quand il y a beaucoup de variables",
  "t-SNE peut faire apparaître des groupes artificiels : n'interprétez pas les distances entre groupes",
  "DBSCAN est très sensible aux paramètres eps et min_samples",
  "K-means suppose des groupes à peu près sphériques"
];

const bestPractices = [
  "Toujours visualiser vos données avant et après clustering",
  "Documentez vos choix d'hyperparamètres et leurs justifications",
  "Évaluez les clusters par leur stabilité (sous-échantillonnage, graines différentes) plutôt que par une validation croisée classique",
  "Combiner plusieurs techniques est courant (ACP avant un clustering, ou avant t-SNE) ; vérifiez que cela aide vraiment",
  "Créez des métriques métier pour évaluer la qualité pratique de vos clusters"
];

const UnsupervisedResourcesSection = () => {
  return (
    <ResourcesSection
      title="Ressources pour découvrir l'apprentissage non supervisé"
      resources={resources}
      tips={tips}
      warnings={warnings}
      bestPractices={bestPractices}
    />
  );
};

export default UnsupervisedResourcesSection;
