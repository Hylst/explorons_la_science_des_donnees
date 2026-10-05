
import ResourcesSection from "../shared/ResourcesSection";

const resources = [
  {
    title: "The Elements of Statistical Learning",
    description: "Référence académique couvrant en profondeur le clustering, PCA, et autres techniques non supervisées avec une approche mathématique rigoureuse.",
    type: "book" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "https://hastie.su.domains/ElemStatLearn/",
    free: true
  },
  {
    title: "Hands-On Unsupervised Learning Using Python (Ankur A. Patel, O'Reilly, 2019)",
    description: "Guide pratique avec implémentations Python pour clustering, réduction de dimensionnalité, et détection d'anomalies.",
    type: "book" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    free: false
  },
  {
    title: "CS229: Machine Learning - Unsupervised Learning",
    description: "Cours de Stanford couvrant K-means, PCA, ICA avec notes détaillées et exercices pratiques.",
    type: "video" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "http://cs229.stanford.edu/",
    free: true
  },
  {
    title: "Scikit-learn Clustering Guide",
    description: "Documentation complète avec exemples pratiques pour tous les algorithmes de clustering disponibles.",
    type: "website" as const,
    difficulty: "Débutant" as const,
    language: "Anglais",
    url: "https://scikit-learn.org/stable/modules/clustering.html",
    free: true
  },
  {
    title: "UMAP: Uniform Manifold Approximation",
    description: "Implémentation Python de UMAP pour la réduction de dimensionnalité non-linéaire avec documentation excellente.",
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
    description: "Survey académique complet des techniques de détection d'anomalies avec comparaisons détaillées.",
    type: "website" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    free: true
  },
  {
    title: "PyOD: Python Outlier Detection",
    description: "Bibliothèque Python complète pour la détection d'anomalies avec de nombreux détecteurs implémentés (voir la documentation pour la liste à jour).",
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
    description: "Cours pratique et interactif sur Kaggle ; une leçon utilise K-means pour créer des variables.",
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
  "Commencez toujours par explorer vos données avec des visualisations",
  "La standardisation des données est cruciale pour la plupart des algorithmes",
  "Utilisez plusieurs métriques d'évaluation (silhouette, inertie, ARI) pour comparer les résultats",
  "Expérimentez avec différents hyperparamètres - ils ont un impact majeur",
  "Validez vos clusters avec l'expertise métier, pas seulement les métriques"
];

const warnings = [
  "Les résultats peuvent varier selon l'initialisation - testez plusieurs runs",
  "Attention à la malédiction de la dimensionnalité avec trop de features",
  "t-SNE peut créer des clusters artificiels - ne sur-interprétez pas",
  "DBSCAN est très sensible aux paramètres eps et min_samples",
  "Les algorithmes de clustering assument souvent des formes sphériques"
];

const bestPractices = [
  "Toujours visualiser vos données avant et après clustering",
  "Documentez vos choix d'hyperparamètres et leurs justifications",
  "Évaluez les clusters par leur stabilité (sous-échantillonnage, graines différentes) plutôt que par une validation croisée classique",
  "Combinez plusieurs techniques (PCA + clustering) pour de meilleurs résultats",
  "Créez des métriques métier pour évaluer la qualité pratique de vos clusters"
];

const UnsupervisedResourcesSection = () => {
  return (
    <ResourcesSection
      title="Ressources pour Découvrir l'Apprentissage Non Supervisé"
      resources={resources}
      tips={tips}
      warnings={warnings}
      bestPractices={bestPractices}
    />
  );
};

export default UnsupervisedResourcesSection;
