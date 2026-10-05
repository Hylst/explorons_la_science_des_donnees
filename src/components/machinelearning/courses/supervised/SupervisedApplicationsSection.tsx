
import ApplicationsSection from "../shared/ApplicationsSection";

const applications = [
  {
    icon: <span className="text-2xl">🏥</span>,
    title: "Diagnostic Médical Intelligent",
    description: "Systèmes d'aide au diagnostic qui analysent symptômes, analyses biologiques et imagerie pour assister les médecins dans leurs décisions.",
    examples: [
      "Détection précoce du cancer sur radiographies",
      "Diagnostic de maladies rares par analyse génétique", 
      "Prédiction des risques cardiovasculaires",
      "Classification de lésions cutanées (dermatologie IA)"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">🚗</span>,
    title: "Véhicules Autonomes",
    description: "Systèmes de vision et de décision pour véhicules autonomes : reconnaissance d'objets, prédiction de trajectoires, prise de décision en temps réel.",
    examples: [
      "Détection de piétons et cyclistes en temps réel",
      "Classification des panneaux de signalisation",
      "Prédiction du comportement des autres véhicules",
      "Navigation autonome en environnement urbain complexe"
    ],
    industry: "Transport",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">💰</span>,
    title: "Finance et Trading",
    description: "Analyse prédictive des marchés financiers, détection de fraudes, évaluation des risques de crédit et optimisation de portefeuilles.",
    examples: [
      "Détection de transactions frauduleuses en temps réel",
      "Prédiction de défauts de paiement (credit scoring)",
      "Trading algorithmique haute fréquence",
      "Évaluation automatique de biens immobiliers"
    ],
    industry: "Finance",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">🛒</span>,
    title: "E-commerce et Recommandations",
    description: "Systèmes de recommandation personnalisés, optimisation des prix, prédiction de la demande et analyse du comportement client.",
    examples: [
      "Recommandations produits sur mesure (Amazon, Netflix)",
      "Prédiction de la demande pour optimiser les stocks",
      "Tarification dynamique selon la demande",
      "Chatbots de service client intelligents"
    ],
    industry: "Commerce",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">🏭</span>,
    title: "Industrie 4.0 et IoT",
    description: "Maintenance prédictive, optimisation de la production, contrôle qualité automatisé et gestion intelligente de l'énergie.",
    examples: [
      "Prédiction de pannes machines avant qu'elles arrivent",
      "Contrôle qualité par vision industrielle",
      "Optimisation de la consommation énergétique",
      "Planification intelligente de la production"
    ],
    industry: "Industrie",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">🎯</span>,
    title: "Marketing Digital Intelligent",
    description: "Ciblage publicitaire précis, analyse de sentiment des réseaux sociaux, optimisation des campagnes et prédiction du ROI.",
    examples: [
      "Segmentation automatique de clientèle",
      "Prédiction du taux de conversion publicitaire",
      "Analyse de sentiment sur réseaux sociaux",
      "Optimisation du budget publicitaire multi-canal"
    ],
    industry: "Marketing",
    difficulty: "Débutant" as const,
    impact: "Moyen" as const
  },
  {
    icon: <span className="text-2xl">🌾</span>,
    title: "Agriculture de Précision",
    description: "Optimisation des rendements agricoles par analyse satellite, prédiction météo, gestion précise des ressources et détection précoce de maladies.",
    examples: [
      "Prédiction des rendements par analyse satellite",
      "Détection précoce de maladies des cultures",
      "Optimisation de l'irrigation selon les besoins",
      "Planification des semis selon prévisions météo"
    ],
    industry: "Agriculture",
    difficulty: "Intermédiaire" as const,
    impact: "Élevé" as const
  },
  {
    icon: <span className="text-2xl">🎓</span>,
    title: "EdTech et Formation",
    description: "Personnalisation de l'apprentissage, évaluation automatique, détection des difficultés d'apprentissage et recommandations pédagogiques.",
    examples: [
      "Parcours d'apprentissage adaptatifs personnalisés",
      "Correction automatique de devoirs et examens",
      "Détection précoce du décrochage scolaire",
      "Recommandations de contenus pédagogiques"
    ],
    industry: "Éducation",
    difficulty: "Débutant" as const,
    impact: "Moyen" as const
  },
  {
    icon: <span className="text-2xl">🏘️</span>,
    title: "Smart Cities",
    description: "Gestion intelligente du trafic, optimisation de l'éclairage public, prédiction de la criminalité et gestion des déchets.",
    examples: [
      "Optimisation des feux de circulation en temps réel",
      "Prédiction des zones de criminalité potentielle",
      "Gestion intelligente de la collecte des déchets",
      "Planification urbaine basée sur les flux de population"
    ],
    industry: "Urbain",
    difficulty: "Avancé" as const,
    impact: "Élevé" as const
  }
];

const SupervisedApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="🌍 Applications de l'Apprentissage Supervisé"
      applications={applications}
      description="L'apprentissage supervisé sert dans de nombreux secteurs, de la santé à la finance en passant par l'industrie : des modèles apprennent à partir d'exemples étiquetés pour prédire ou classer."
    />
  );
};

export default SupervisedApplicationsSection;
