
import ResourcesSection from "../shared/ResourcesSection";

const resources = [
  {
    title: "Reinforcement Learning: An Introduction",
    description: "Le livre de référence de Sutton et Barto (2e édition, 2018) sur les fondamentaux de l'apprentissage par renforcement.",
    type: "book" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "http://incompleteideas.net/book/the-book-2nd.html",
    free: true
  },
  {
    title: "Deep Reinforcement Learning Hands-On (Maxim Lapan, Packt)",
    description: "Guide pratique pour implémenter des algorithmes de RL avec PyTorch, dont DQN, A3C et PPO.",
    type: "book" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    free: false
  },
  {
    title: "CS285: Deep Reinforcement Learning",
    description: "Cours de Berkeley (Sergey Levine) sur la théorie et la pratique du RL profond, avec des devoirs.",
    type: "video" as const,
    difficulty: "Avancé" as const,
    language: "Anglais",
    url: "http://rail.eecs.berkeley.edu/deeprlcourse/",
    free: true
  },
  {
    title: "OpenAI Spinning Up",
    description: "Ressource pédagogique d'OpenAI sur le RL profond : notions clés, liste d'articles fondateurs et implémentations de référence.",
    type: "website" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "https://spinningup.openai.com/en/latest/",
    free: true
  },
  {
    title: "Stable Baselines3",
    description: "Bibliothèque Python d'algorithmes de RL (PPO, DQN, A2C, SAC...), avec une documentation fournie et des exemples.",
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
    description: "Conférences intensives de 2017 sur le RL profond, utiles pour les bases même si des méthodes plus récentes existent.",
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
    description: "Bibliothèque distribuée pour l'apprentissage par renforcement à grande échelle, avec prise en charge de plusieurs GPU.",
    type: "code" as const,
    difficulty: "Avancé" as const,
    language: "Python",
    url: "https://docs.ray.io/en/latest/rllib/index.html",
    free: true
  },
  {
    title: "r/MachineLearning",
    description: "Communauté Reddit où se discutent des recherches et applications en ML, dont le RL.",
    type: "community" as const,
    difficulty: "Intermédiaire" as const,
    language: "Anglais",
    url: "https://reddit.com/r/MachineLearning",
    free: true
  },
];

const tips = [
  "Commencez par comprendre les bases avant de vous lancer dans les implémentations complexes",
  "Pratiquez avec des environnements simples (CartPole, FrozenLake) avant d'attaquer des problèmes complexes",
  "Utilisez TensorBoard pour visualiser l'apprentissage et déboguer vos agents",
  "Rejoignez des communautés en ligne pour rester à jour sur les dernières avancées",
  "Essayez plusieurs hyperparamètres : le RL y est très sensible"
];

const warnings = [
  "Le RL peut être très instable : attendez-vous à des résultats variables d'une exécution à l'autre",
  "L'entraînement peut prendre beaucoup de temps, parfois des heures",
  "Des résultats de RL profond sont difficiles à reproduire (voir Henderson et al., « Deep Reinforcement Learning that Matters », AAAI 2018) : vérifiez les implémentations",
  "Les environnements réels sont en général plus complexes que les simulations",
  "Soignez le prétraitement des observations et la conception des récompenses"
];

const bestPractices = [
  "Établissez d'abord une référence simple avant d'essayer des algorithmes complexes",
  "Utilisez des graines aléatoires fixes pour la reproductibilité",
  "Enregistrez tout : récompenses, perte, taux d'exploration, etc.",
  "Testez vos agents sur plusieurs graines et plusieurs variantes de l'environnement pour éviter le surapprentissage",
  "Documentez vos expériences et gardez trace de ce qui fonctionne"
];

const ReinforcementResourcesSection = () => {
  return (
    <ResourcesSection
      title="Ressources pour approfondir l'apprentissage par renforcement"
      resources={resources}
      tips={tips}
      warnings={warnings}
      bestPractices={bestPractices}
    />
  );
};

export default ReinforcementResourcesSection;
