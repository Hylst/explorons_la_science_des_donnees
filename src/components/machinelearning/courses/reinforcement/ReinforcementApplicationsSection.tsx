
import ApplicationsSection from "../shared/ApplicationsSection";
import { Car, Gamepad2, Shield, TrendingUp, Factory, Heart, Zap, Target, Globe } from "lucide-react";

const applications = [
  {
    icon: <Gamepad2 className="h-6 w-6 text-purple-600" />,
    title: "Jeux",
    description: "Programmes qui apprennent à jouer à des jeux complexes par l'expérience, souvent en jouant contre eux-mêmes.",
    examples: [
      "AlphaGo bat Lee Sedol au jeu de Go (2016)",
      "OpenAI Five bat l'équipe championne du monde OG à Dota 2 (2019)",
      "AlphaStar atteint le niveau Grandmaster à StarCraft II (2019)",
      "Des IA de poker (Libratus, Pluribus) battent des professionnels, avec des méthodes proches mais distinctes du RL classique"
    ],
    industry: "Gaming",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Car className="h-6 w-6 text-blue-600" />,
    title: "Véhicules autonomes",
    description: "Recherche sur l'apprentissage de politiques de conduite, surtout testée en simulation.",
    examples: [
      "Planification de trajectoire dans des simulateurs de conduite",
      "Apprentissage de politiques de conduite (domaine de recherche actif)",
      "Optimisation des trajectoires",
      "Gestion d'intersections en simulation"
    ],
    industry: "Transport",
    difficulty: "Avancé" as const
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    title: "Finance (recherche)",
    description: "Recherche sur des agents qui exécutent des ordres ou gèrent un portefeuille. Un bon résultat sur l'historique ne garantit aucun gain réel.",
    examples: [
      "Exécution optimale d'ordres de grande taille",
      "Gestion de portefeuille dynamique",
      "Simulation d'environnements de marché pour tester des stratégies",
      "Arbitrage entre rendement attendu et risque"
    ],
    industry: "Finance",
    difficulty: "Avancé" as const
  },
  {
    icon: <Factory className="h-6 w-6 text-orange-600" />,
    title: "Robotique",
    description: "Robots qui apprennent des tâches complexes par renforcement et adaptation.",
    examples: [
      "Assemblage adaptatif de pièces",
      "Apprentissage de préhension d'objets variés",
      "Optimisation de trajectoires",
      "Collaboration homme-robot"
    ],
    industry: "Industrie",
    difficulty: "Avancé" as const
  },
  {
    icon: <Heart className="h-6 w-6 text-red-600" />,
    title: "Santé (recherche)",
    description: "Recherche sur l'adaptation de traitements à chaque patient, à partir de dossiers ou de simulations ; pas de substitut au suivi médical.",
    examples: [
      "Dosage optimal de médicaments",
      "Plans de rééducation adaptatifs",
      "Prothèses intelligentes",
      "Politiques de traitement apprises sur des dossiers médicaux (recherche)"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    title: "Gestion de l'énergie",
    description: "Pilotage de la consommation et de la distribution d'énergie.",
    examples: [
      "Smart grids adaptatifs",
      "Optimisation de data centers",
      "Gestion de batteries",
      "Pilotage du stockage et de la demande"
    ],
    industry: "Énergie",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Target className="h-6 w-6 text-indigo-600" />,
    title: "Publicité en ligne",
    description: "Systèmes qui apprennent à choisir quelle annonce afficher ou combien miser aux enchères.",
    examples: [
      "Enchères automatiques RTB",
      "Personnalisation de contenu",
      "Bandits manchots pour choisir une annonce",
      "Bandits contextuels"
    ],
    industry: "Marketing",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Shield className="h-6 w-6 text-gray-600" />,
    title: "Cybersécurité",
    description: "Recherche sur des agents qui apprennent à détecter ou contrer des menaces.",
    examples: [
      "Détection d'intrusions adaptative",
      "Réponse automatique aux incidents",
      "Analyse comportementale",
      "Pièges à attaquants (honeypots) adaptatifs"
    ],
    industry: "Sécurité",
    difficulty: "Avancé" as const
  },
  {
    icon: <Globe className="h-6 w-6 text-teal-600" />,
    title: "Optimisation de ressources",
    description: "Gestion des ressources dans des systèmes complexes.",
    examples: [
      "Routage réseau adaptatif",
      "Allocation de serveurs cloud",
      "Planning logistique dynamique",
      "Gestion de stocks"
    ],
    industry: "Logistique",
    difficulty: "Intermédiaire" as const
  }
];

const ReinforcementApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="Applications de l'apprentissage par renforcement"
      applications={applications}
      description="L'apprentissage par renforcement permet à des machines d'apprendre par l'expérience, par essais et erreurs. On le rencontre des jeux stratégiques à la robotique."
    />
  );
};

export default ReinforcementApplicationsSection;
