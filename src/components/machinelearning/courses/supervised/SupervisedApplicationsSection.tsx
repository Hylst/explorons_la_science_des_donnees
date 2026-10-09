
import ApplicationsSection from "../shared/ApplicationsSection";

const applications = [
  {
    icon: <span className="text-2xl">🏥</span>,
    title: "Aide au diagnostic médical",
    description: "Systèmes d'aide au diagnostic qui analysent symptômes, analyses biologiques et imagerie pour assister les médecins, qui gardent la décision.",
    examples: [
      "Aide à la détection de lésions suspectes sur des images (mammographie, radiographie)",
      "Diagnostic de maladies rares par analyse génétique",
      "Prédiction des risques cardiovasculaires",
      "Classification de lésions cutanées sur photographies"
    ],
    industry: "Santé",
    difficulty: "Avancé" as const
  },
  {
    icon: <span className="text-2xl">🚗</span>,
    title: "Véhicules autonomes",
    description: "Briques de perception des véhicules autonomes : reconnaissance d'objets, prédiction de trajectoires.",
    examples: [
      "Détection de piétons et cyclistes en temps réel",
      "Classification des panneaux de signalisation",
      "Prédiction du comportement des autres véhicules",
      "Compréhension de scènes urbaines (segmentation sémantique)"
    ],
    industry: "Transport",
    difficulty: "Avancé" as const
  },
  {
    icon: <span className="text-2xl">💰</span>,
    title: "Finance",
    description: "Détection de fraudes, évaluation des risques de crédit, estimation de valeurs ; la prévision des marchés financiers reste un domaine où les gains sont très incertains.",
    examples: [
      "Détection de transactions frauduleuses en temps réel",
      "Prédiction de défauts de paiement (credit scoring)",
      "Prévision de volatilité ou de séries financières (avec beaucoup de prudence)",
      "Évaluation automatique de biens immobiliers"
    ],
    industry: "Finance",
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <span className="text-2xl">🛒</span>,
    title: "Commerce en ligne et recommandations",
    description: "Recommandations personnalisées, prévision de la demande, optimisation des prix et analyse du comportement des clients.",
    examples: [
      "Recommandations de produits ou de contenus selon l'historique",
      "Prédiction de la demande pour optimiser les stocks",
      "Tarification dynamique selon la demande",
      "Classement automatique des demandes du service client"
    ],
    industry: "Commerce",
    difficulty: "Intermédiaire" as const
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
    difficulty: "Intermédiaire" as const
  },
  {
    icon: <span className="text-2xl">🎯</span>,
    title: "Marketing digital",
    description: "Ciblage publicitaire, analyse de sentiment sur les réseaux sociaux, optimisation des campagnes et prévision de leur retour.",
    examples: [
      "Score de propension à répondre à une offre",
      "Prédiction du taux de conversion publicitaire",
      "Analyse de sentiment sur réseaux sociaux",
      "Optimisation du budget publicitaire multi-canal"
    ],
    industry: "Marketing",
    difficulty: "Débutant" as const
  },
  {
    icon: <span className="text-2xl">🌾</span>,
    title: "Agriculture de précision",
    description: "Optimisation des rendements agricoles par analyse satellite, prédiction météo, gestion précise des ressources et détection précoce de maladies.",
    examples: [
      "Prédiction des rendements par analyse satellite",
      "Détection précoce de maladies des cultures",
      "Optimisation de l'irrigation selon les besoins",
      "Planification des semis selon prévisions météo"
    ],
    industry: "Agriculture",
    difficulty: "Intermédiaire" as const
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
    difficulty: "Débutant" as const
  },
  {
    icon: <span className="text-2xl">🏘️</span>,
    title: "Villes intelligentes (smart cities)",
    description: "Gestion du trafic, optimisation de l'éclairage public et de la collecte des déchets. La prédiction de la criminalité est controversée, car elle peut reproduire des biais des données.",
    examples: [
      "Optimisation des feux de circulation en temps réel",
      "Prévision de la fréquentation des transports en commun",
      "Gestion intelligente de la collecte des déchets",
      "Planification urbaine basée sur les flux de population"
    ],
    industry: "Urbain",
    difficulty: "Avancé" as const
  }
];

const SupervisedApplicationsSection = () => {
  return (
    <ApplicationsSection
      title="🌍 Applications de l'apprentissage supervisé"
      applications={applications}
      description="L'apprentissage supervisé sert dans de nombreux secteurs, de la santé à la finance en passant par l'industrie : des modèles apprennent à partir d'exemples étiquetés pour prédire ou classer."
    />
  );
};

export default SupervisedApplicationsSection;
