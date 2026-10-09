
import ApplicationsSection from "../shared/ApplicationsSection";
import { BarChart3, Network, Eye, Shield, TrendingUp, Factory, Heart, Brain, Zap } from "lucide-react";

const applications = [
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    title: "Segmentation de clientèle",
    description: "Identification automatique de groupes de clients avec des comportements similaires pour optimiser les stratégies marketing.",
    examples: [
      "Clustering RFM (Récence, Fréquence, Montant)",
      "Segmentation comportementale e-commerce",
      "Groupes de préférences produits",
      "Personnalisation de campagnes marketing"
    ],
    industry: "E-commerce",
    difficulty: "Débutant" as const
  },
  {
    icon: <Network className="h-6 w-6 text-green-600" />,
    title: "Analyse de réseaux sociaux",
    description: "Détection de communautés et d'influenceurs dans les réseaux sociaux complexes.",
    examples: [
      "Détection de communautés dans un réseau d'échanges",
      "Identification d'influenceurs",
      "Analyse de propagation d'information",
      "Détection de bots et faux comptes"
    ],
    industry: "Social Media",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    title: "Vision par ordinateur",
    description: "Segmentation d'images et regroupement de caractéristiques visuelles sans étiquettes.",
    examples: [
      "Segmentation automatique d'images médicales",
      "Clustering de caractéristiques visuelles",
      "Segmentation non supervisée d'images satellites (occupation du sol)",
      "Compression d'images par autoencodeur"
    ],
    industry: "Vision",
    difficulty: "Avancé" as const
  },
  {
    icon: <Shield className="h-6 w-6 text-red-600" />,
    title: "Détection de fraude et d'anomalies",
    description: "Identification automatique de transactions ou comportements anormaux sans exemples préalables.",
    examples: [
      "Détection de fraudes bancaires",
      "Transactions suspectes en temps réel",
      "Comportements utilisateurs anormaux",
      "Détection d'intrusions réseau"
    ],
    industry: "Sécurité",
    difficulty: "Avancé" as const
  },
  {
    icon: <Heart className="h-6 w-6 text-pink-600" />,
    title: "Recherche médicale",
    description: "Recherche de sous-groupes de patients ou de maladies et de régularités dans les données biomédicales.",
    examples: [
      "Regroupement de tumeurs en sous-types (d'après l'expression des gènes)",
      "Analyse de données génomiques",
      "Découverte de biomarqueurs",
      "Clustering de symptômes patients"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
    title: "Analyse financière",
    description: "Identification de groupes d'actifs au comportement similaire et de régimes de marché.",
    examples: [
      "Clustering d'actions par secteur",
      "Détection de régimes de marché",
      "Analyse de corrélations cachées",
      "Optimisation de portefeuilles"
    ],
    industry: "Finance",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Factory className="h-6 w-6 text-gray-600" />,
    title: "Maintenance prédictive",
    description: "Détection d'anomalies dans le fonctionnement des machines industrielles.",
    examples: [
      "Surveillance d'équipements industriels",
      "Repérage de comportements précurseurs de pannes",
      "Optimisation de maintenance",
      "Analyse vibrationnelle machines"
    ],
    industry: "Industrie",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Brain className="h-6 w-6 text-indigo-600" />,
    title: "Recommandation de contenu",
    description: "Création de systèmes de recommandation basés sur les similarités entre utilisateurs ou contenus.",
    examples: [
      "Recommandations de type plateformes de streaming",
      "Suggestions produits e-commerce",
      "Filtrage collaboratif (souvent combiné à des modèles supervisés)",
      "Découverte de contenus similaires"
    ],
    industry: "Streaming",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    title: "Analyse de la consommation d'énergie",
    description: "Regroupement des profils de consommation et repérage de consommations atypiques.",
    examples: [
      "Clustering de profils de consommation",
      "Détection de gaspillages énergétiques",
      "Segmentation de compteurs communicants par profil",
      "Détection de pics de demande atypiques"
    ],
    industry: "Énergie",
    difficulty: "Intermédiaire" as const
  }
];

const UnsupervisedApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="Applications de l'apprentissage non supervisé"
      applications={applications}
      description="L'apprentissage non supervisé cherche des structures dans des données sans étiquettes. Ces techniques aident à explorer des données brutes pour en tirer des pistes d'analyse."
    />
  );
};

export default UnsupervisedApplicationsSection;
