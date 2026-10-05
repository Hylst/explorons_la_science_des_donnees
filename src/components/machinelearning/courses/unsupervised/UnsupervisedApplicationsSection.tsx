
import ApplicationsSection from "../shared/ApplicationsSection";
import { BarChart3, Network, Eye, Shield, TrendingUp, Factory, Heart, Brain, Zap } from "lucide-react";

const applications = [
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    title: "Segmentation Client",
    description: "Identification automatique de groupes de clients avec des comportements similaires pour optimiser les stratégies marketing.",
    examples: [
      "Clustering RFM (Récence, Fréquence, Montant)",
      "Segmentation comportementale e-commerce",
      "Groupes de préférences produits",
      "Personnalisation de campagnes marketing"
    ],
    industry: "E-commerce",
    difficulty: "Débutant" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Network className="h-6 w-6 text-green-600" />,
    title: "Analyse de Réseaux Sociaux",
    description: "Détection de communautés et d'influenceurs dans les réseaux sociaux complexes.",
    examples: [
      "Détection de communautés Twitter",
      "Identification d'influenceurs",
      "Analyse de propagation d'information",
      "Détection de bots et faux comptes"
    ],
    industry: "Social Media",
    difficulty: "Intermédiaire" as const,
    impact: "Moyen" as const
  },
  {
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    title: "Computer Vision",
    description: "Segmentation d'images et détection d'objets sans supervision préalable.",
    examples: [
      "Segmentation automatique d'images médicales",
      "Clustering de caractéristiques visuelles",
      "Segmentation non supervisée d'images satellites (occupation du sol)",
      "Compression intelligente d'images"
    ],
    industry: "Vision",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Shield className="h-6 w-6 text-red-600" />,
    title: "Détection de Fraude",
    description: "Identification automatique de transactions ou comportements anormaux sans exemples préalables.",
    examples: [
      "Détection de fraudes bancaires",
      "Transactions suspectes en temps réel",
      "Comportements utilisateurs anormaux",
      "Détection d'intrusions réseau"
    ],
    industry: "Sécurité",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Heart className="h-6 w-6 text-pink-600" />,
    title: "Recherche Médicale",
    description: "Découverte de nouveaux sous-types de maladies et patterns dans les données biomédicales.",
    examples: [
      "Classification de sous-types de cancer",
      "Analyse de données génomiques",
      "Découverte de biomarqueurs",
      "Clustering de symptômes patients"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
    title: "Analyse Financière",
    description: "Identification de patterns de marché et groupes d'actifs avec comportements similaires.",
    examples: [
      "Clustering d'actions par secteur",
      "Détection de régimes de marché",
      "Analyse de corrélations cachées",
      "Optimisation de portefeuilles"
    ],
    industry: "Finance",
    difficulty: "Intermédiaire" as const,
    impact: "Moyen" as const
  },
  {
    icon: <Factory className="h-6 w-6 text-gray-600" />,
    title: "Maintenance Prédictive",
    description: "Détection d'anomalies dans le fonctionnement des machines industrielles.",
    examples: [
      "Surveillance d'équipements industriels",
      "Détection de pannes imminentes",
      "Optimisation de maintenance",
      "Analyse vibrationnelle machines"
    ],
    industry: "Industrie",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Brain className="h-6 w-6 text-indigo-600" />,
    title: "Recommandation de Contenu",
    description: "Création de systèmes de recommandation basés sur les similarités entre utilisateurs ou contenus.",
    examples: [
      "Recommandations de type plateformes de streaming",
      "Suggestions produits e-commerce",
      "Filtrage collaboratif (souvent combiné à des modèles supervisés)",
      "Découverte de contenus similaires"
    ],
    industry: "Streaming",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    title: "Optimisation Énergétique",
    description: "Analyse des patterns de consommation énergétique pour optimiser la distribution.",
    examples: [
      "Clustering de profils de consommation",
      "Détection de gaspillages énergétiques",
      "Optimisation de smart grids",
      "Détection de pics de demande atypiques"
    ],
    industry: "Énergie",
    difficulty: "Intermédiaire" as const,
    impact: "Moyen" as const
  }
];

const UnsupervisedApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="Applications Concrètes de l'Apprentissage Non Supervisé"
      applications={applications}
      description="L'apprentissage non supervisé cherche des structures dans des données sans étiquettes. Ces techniques aident à explorer des données brutes pour en tirer des pistes d'analyse."
    />
  );
};

export default UnsupervisedApplicationsSection;
