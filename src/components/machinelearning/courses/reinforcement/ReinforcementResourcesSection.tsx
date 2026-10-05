
import ResourcesSection from "../shared/ResourcesSection";

const resources = [
  {
    title: "Reinforcement Learning: An Introduction",
    description: "Le livre de référence par Sutton et Barto, couvrant tous les fondamentaux théoriques et pratiques de l'apprentissage par renforcement.",
    type: "book" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "http://incompleteideas.net/book/the-book-2nd.html",
    free: true
  },
  {
    title: "Deep Reinforcement Learning Hands-On",
    description: "Guide pratique pour implémenter des algorithmes de RL moderne avec PyTorch, incluant DQN, A3C, et PPO.",
    type: "book" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    free: false
  },
  {
    title: "CS285: Deep Reinforcement Learning",
    description: "Cours complet de Berkeley couvrant la théorie et la pratique du deep RL, avec des devoirs et projets.",
    type: "video" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "http://rail.eecs.berkeley.edu/deeprlcourse/",
    free: true
  },
  {
    title: "OpenAI Spinning Up",
    description: "Ressource éducative d'OpenAI avec des implémentations d'algorithmes RL et des explications détaillées.",
    type: "website" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "https://spinningup.openai.com/en/latest/",
    free: true
  },
  {
    title: "Stable Baselines3",
    description: "Bibliothèque Python fiable d'algorithmes RL avec documentation excellente et exemples pratiques.",
    type: "code" as const,
    difficulty: "Débutant" as const,
    language: "Python",
    url: "https://stable-baselines3.readthedocs.io/en/master/",
    free: true
  },
  {
    title: "Andrew Ng - Unsupervised Learning, Recommenders, Reinforcement Learning",
    description: "Troisième cours de la spécialisation Machine Learning (DeepLearning.AI et Stanford Online) : clustering, recommandation et introduction à l'apprentissage par renforcement.",
    type: "video" as const,
    difficulty: "Débutant" as const,
    language: "Anglais",
    url: "https://www.coursera.org/learn/unsupervised-learning-recommenders-reinforcement-learning",
    free: false
  },
  {
    title: "Deep RL Bootcamp",
    description: "Série de conférences intensives couvrant les dernières avancées en deep reinforcement learning.",
    type: "video" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "https://sites.google.com/view/deep-rl-bootcamp/",
    free: true
  },
  {
    title: "Gymnasium (OpenAI Gym)",
    description: "Environnements standardisés pour tester et comparer des algorithmes d'apprentissage par renforcement.",
    type: "code" as const,
    difficulty: "Débutant" as const,
    language: "Python",
    url: "https://gymnasium.farama.org/",
    free: true
  },
  {
    title: "Ray RLlib",
    description: "Framework distribué pour l'apprentissage par renforcement à grande échelle avec support multi-GPU.",
    type: "code" as const,
    difficulty: "Avancé" as const,
    language: "Python",
    url: "https://docs.ray.io/en/latest/rllib/index.html",
    free: true
  },
  {
    title: "r/MachineLearning",
    description: "Communauté Reddit active discutant des dernières recherches et applications en ML et RL.",
    type: "community" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "https://reddit.com/r/MachineLearning",
    free: true
  },
  {
    title: "Spinning Up in Deep RL (OpenAI)",
    description: "Introduction pédagogique à l'apprentissage par renforcement profond : notions clés, liste d'articles fondateurs et implémentations de référence.",
    type: "website" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "https://spinningup.openai.com/en/latest/",
    free: true
  },
];

const tips = [
  "Commencez par comprendre la théorie avant de vous lancer dans les implémentations complexes",
  "Pratiquez avec des environnements simples (CartPole, FrozenLake) avant d'attaquer des problèmes complexes",
  "Utilisez TensorBoard pour visualiser l'apprentissage et déboguer vos agents",
  "Rejoignez des communautés en ligne pour rester à jour sur les dernières avancées",
  "Expérimentez avec différents hyperparamètres - ils sont cruciaux en RL"
];

const warnings = [
  "Le RL peut être très instable - attendez-vous à des résultats variables",
  "L'entraînement peut prendre beaucoup de temps - préparez-vous à des heures d'attente",
  "Beaucoup de papers ne sont pas reproductibles - vérifiez les implémentations",
  "Les environnements réels sont beaucoup plus complexes que les simulations",
  "Ne négligez pas l'importance du preprocessing et de la conception des récompenses"
];

const bestPractices = [
  "Toujours établir une baseline simple avant d'essayer des algorithmes complexes",
  "Utilisez des graines aléatoires fixes pour la reproductibilité",
  "Loggez tout : récompenses, loss, exploration rate, etc.",
  "Testez vos agents sur plusieurs environnements pour éviter l'overfitting",
  "Documentez vos expériences et gardez trace de ce qui fonctionne"
];

const ReinforcementResourcesSection = () => {
  return (
    <ResourcesSection
      title="Ressources pour Approfondir l'Apprentissage par Renforcement"
      resources={resources}
      tips={tips}
      warnings={warnings}
      bestPractices={bestPractices}
    />
  );
};

export default ReinforcementResourcesSection;
