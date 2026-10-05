
import ApplicationsSection from "../shared/ApplicationsSection";
import { Car, Gamepad2, Shield, TrendingUp, Factory, Heart, Zap, Target, Globe } from "lucide-react";

const applications = [
  {
    icon: <Gamepad2 className="h-6 w-6 text-purple-600" />,
    title: "Jeux et Divertissement",
    description: "IA capable de jouer et gagner à des jeux complexes en apprenant par expérience.",
    examples: [
      "AlphaGo bat Lee Sedol au jeu de Go (2016)",
      "OpenAI Five domine à Dota 2",
      "AlphaStar atteint le niveau Grandmaster à StarCraft II (2019)",
      "Des IA de poker (Libratus, Pluribus) battent des professionnels, avec des méthodes proches mais distinctes du RL classique"
    ],
    industry: "Gaming",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Car className="h-6 w-6 text-blue-600" />,
    title: "Véhicules Autonomes",
    description: "Systèmes de conduite qui apprennent à naviguer en toute sécurité dans le trafic réel.",
    examples: [
      "Planification de trajectoire dans des simulateurs de conduite",
      "Apprentissage de politiques de conduite (domaine de recherche actif)",
      "Optimisation des trajectoires",
      "Gestion des intersections complexes"
    ],
    industry: "Transport",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    title: "Trading Algorithmique",
    description: "Agents qui apprennent à trader sur les marchés financiers en maximisant les profits.",
    examples: [
      "Trading haute fréquence adaptatif",
      "Gestion de portefeuille dynamique",
      "Détection de patterns de marché",
      "Optimisation risk/reward"
    ],
    industry: "Finance",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Factory className="h-6 w-6 text-orange-600" />,
    title: "Robotique Industrielle",
    description: "Robots qui apprennent des tâches complexes par renforcement et adaptation.",
    examples: [
      "Assemblage adaptatif de pièces",
      "Choix du moment d'intervention en maintenance",
      "Optimisation de trajectoires",
      "Collaboration homme-robot"
    ],
    industry: "Industrie",
    difficulty: "Avancé" as const,
    impact: "Moyen" as const
  },
  {
    icon: <Heart className="h-6 w-6 text-red-600" />,
    title: "Santé Personnalisée",
    description: "Systèmes qui apprennent à optimiser les traitements pour chaque patient.",
    examples: [
      "Dosage optimal de médicaments",
      "Plans de rééducation adaptatifs",
      "Prothèses intelligentes",
      "Diagnostic assisté par IA"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    title: "Gestion Énergétique",
    description: "Optimisation intelligente de la consommation et distribution d'énergie.",
    examples: [
      "Smart grids adaptatifs",
      "Optimisation de data centers",
      "Gestion de batteries",
      "Prédiction de demande énergétique"
    ],
    industry: "Énergie",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Target className="h-6 w-6 text-indigo-600" />,
    title: "Publicité Ciblée",
    description: "Systèmes qui apprennent à optimiser le placement publicitaire en temps réel.",
    examples: [
      "Enchères automatiques RTB",
      "Personnalisation de contenu",
      "A/B testing intelligent",
      "Attribution multi-touch"
    ],
    industry: "Marketing",
    difficulty: "Intermédiaire" as const,
    impact: "Moyen" as const
  },
  {
    icon: <Shield className="h-6 w-6 text-gray-600" />,
    title: "Cybersécurité",
    description: "Agents qui apprennent à détecter et contrer les menaces en temps réel.",
    examples: [
      "Détection d'intrusions adaptative",
      "Réponse automatique aux incidents",
      "Analyse comportementale",
      "Honeypots intelligents"
    ],
    industry: "Sécurité",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Globe className="h-6 w-6 text-teal-600" />,
    title: "Optimisation de Ressources",
    description: "Gestion intelligente des ressources dans des systèmes complexes.",
    examples: [
      "Routage réseau adaptatif",
      "Allocation de serveurs cloud",
      "Planning logistique dynamique",
      "Gestion de stocks intelligente"
    ],
    industry: "Logistique",
    difficulty: "Intermédiaire" as const,
    impact: "Moyen" as const
  }
];

const ReinforcementApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="Applications Concrètes de l'Apprentissage par Renforcement"
      applications={applications}
      description="L'apprentissage par renforcement permet à des machines d'apprendre par l'expérience, par essais et erreurs. On le rencontre des jeux stratégiques à la robotique."
    />
  );
};

export default ReinforcementApplicationsSection;
