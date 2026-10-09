
import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

export const statisticsDefinitions: Record<string, GlossaryTermDefinition> = {
  "statistiques": {
    term: "Statistiques",
    shortDefinition: "Science de la collecte, l'analyse, l'interprétation et la présentation des données.",
    longDefinition: "Les statistiques constituent une branche des mathématiques appliquées qui se consacre à la collecte, l'organisation, l'analyse, l'interprétation et la présentation des données. Elles fournissent des méthodes pour quantifier l'incertitude et prendre des décisions en présence d'incertitude. En Data Science, les statistiques sont fondamentales car elles permettent d'extraire des connaissances à partir de données brutes et de formuler des conclusions assorties d'une mesure de leur incertitude.",
    examples: [
      "Calculer la moyenne d'âge d'une population pour déterminer des tendances démographiques",
      "Utiliser des tests statistiques pour vérifier si un nouveau médicament est significativement plus efficace qu'un placebo",
      "Établir des intervalles de confiance pour estimer les marges d'erreur dans un sondage d'opinion"
    ],
    relatedTerms: ["Probabilités", "Analyse de données", "Inférence statistique", "Test d'hypothèse"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Statistics",
    synonyms: ["Analyse statistique"]
  },
  
  "statistiques-descriptives": {
    term: "Statistiques descriptives",
    shortDefinition: "Méthodes pour résumer et décrire les caractéristiques principales d'un ensemble de données.",
    longDefinition: "Les statistiques descriptives regroupent l'ensemble des méthodes utilisées pour condenser et résumer les caractéristiques essentielles d'un jeu de données. Contrairement aux statistiques inférentielles qui cherchent à tirer des conclusions au-delà des données observées, les statistiques descriptives se concentrent uniquement sur la description et la synthèse des données disponibles, sans chercher à généraliser à une population plus large.",
    examples: [
      "Calculer la moyenne, la médiane et le mode des salaires dans une entreprise pour comprendre la distribution des rémunérations",
      "Déterminer l'écart-type des notes d'un examen pour évaluer la dispersion des résultats",
      "Créer un histogramme pour visualiser la distribution des âges dans une population"
    ],
    relatedTerms: ["Moyenne", "Médiane", "Écart-type", "Distribution", "Visualisation de données"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Descriptive Statistics"
  },
  
  "statistiques-inférentielles": {
    term: "Statistiques inférentielles",
    shortDefinition: "Méthodes permettant de tirer des conclusions sur une population à partir d'un échantillon.",
    longDefinition: "Les statistiques inférentielles constituent un ensemble de méthodes permettant de généraliser les résultats obtenus à partir d'un échantillon à l'ensemble d'une population. Elles reposent sur la théorie des probabilités et permettent d'estimer des paramètres, de tester des hypothèses et de quantifier l'incertitude associée aux conclusions. C'est grâce aux statistiques inférentielles que l'on peut prendre des décisions à partir de données incomplètes, à condition que l'échantillon soit représentatif.",
    examples: [
      "Estimer la moyenne de la taille d'une population à partir d'un échantillon aléatoire",
      "Tester si deux groupes de traitement présentent des différences significatives dans leurs résultats",
      "Construire des intervalles de confiance pour déterminer la marge d'erreur d'un sondage électoral"
    ],
    relatedTerms: ["Test d'hypothèse", "Estimation", "Intervalle de confiance", "Valeur-p", "Inférence bayésienne"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Inferential Statistics"
  },
  
  "moyenne": {
    term: "Moyenne",
    shortDefinition: "Mesure de tendance centrale calculée en additionnant toutes les valeurs et en divisant par le nombre total de valeurs.",
    longDefinition: "La moyenne arithmétique est la mesure de tendance centrale la plus couramment utilisée. Elle représente la somme de toutes les valeurs divisée par le nombre total de valeurs dans l'ensemble de données. Bien qu'elle soit simple à calculer et intuitive à comprendre, la moyenne est sensible aux valeurs extrêmes (outliers), ce qui peut parfois en faire une mesure moins représentative que la médiane pour des distributions asymétriques.",
    examples: [
      "La moyenne des salaires d'une entreprise peut être biaisée par quelques salaires très élevés de la direction",
      "La température moyenne d'une région sur une année donne une indication du climat général",
      "La moyenne des notes d'un examen permet d'évaluer le niveau général de la classe"
    ],
    relatedTerms: ["Médiane", "Mode", "Mesures de tendance centrale", "Moyenne pondérée", "Moyenne géométrique"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Mean",
    synonyms: ["Moyenne arithmétique"]
  },
  
  "médiane": {
    term: "Médiane",
    shortDefinition: "Valeur qui divise un ensemble de données en deux parties égales, après avoir trié les valeurs par ordre croissant.",
    longDefinition: "La médiane est la valeur centrale d'un ensemble de données ordonné, qui sépare l'échantillon en deux moitiés de taille égale. Contrairement à la moyenne, la médiane est peu sensible aux valeurs extrêmes, ce qui en fait une mesure de tendance centrale plus robuste pour les distributions asymétriques ou contenant des valeurs aberrantes. Pour calculer la médiane, on ordonne toutes les observations et on sélectionne la valeur du milieu (ou la moyenne des deux valeurs du milieu si le nombre d'observations est pair).",
    examples: [
      "Le revenu médian est souvent utilisé pour décrire le niveau de vie typique dans un pays, car il n'est pas biaisé par les revenus extrêmement élevés",
      "Le temps médian de réponse à un service client donne une meilleure idée de l'expérience typique des clients que la moyenne",
      "La taille médiane des logements dans une ville représente mieux la taille typique qu'une moyenne qui pourrait être influencée par quelques très grands manoirs"
    ],
    relatedTerms: ["Moyenne", "Quartile", "Percentile", "Mesures de tendance centrale", "Boîte à moustaches"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Median"
  },
  
  "écart-type": {
    term: "Écart-type",
    shortDefinition: "Mesure de dispersion qui quantifie la variation ou l'étalement des valeurs d'un ensemble de données par rapport à la moyenne.",
    longDefinition: "L'écart-type est une mesure fondamentale de la dispersion statistique qui indique dans quelle mesure les valeurs individuelles d'un ensemble de données s'écartent de la moyenne. Mathématiquement, il s'agit de la racine carrée de la variance. Un écart-type faible signifie que les valeurs tendent à être proches de la moyenne, tandis qu'un écart-type élevé indique que les valeurs sont réparties sur une plus grande plage. Dans une distribution normale, environ 68% des observations se situent à un écart-type de la moyenne, 95% à deux écarts-types et 99,7% à trois écarts-types.",
    examples: [
      "Mesurer la volatilité d'un actif financier pour évaluer son risque",
      "Déterminer l'homogénéité des notes dans une classe d'étudiants",
      "Évaluer la précision d'un instrument de mesure en sciences expérimentales"
    ],
    relatedTerms: ["Variance", "Dispersion", "Distribution normale", "Erreur type", "Intervalle de confiance"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Standard Deviation",
    synonyms: ["Déviation standard", "Sigma"]
  },
  
  "distribution-normale": {
    term: "Distribution normale",
    shortDefinition: "Distribution de probabilité symétrique en forme de cloche, définie par sa moyenne et son écart-type.",
    longDefinition: "La distribution normale, également appelée distribution gaussienne, est une distribution de probabilité continue qui suit une courbe en forme de cloche parfaitement symétrique. Elle est entièrement caractérisée par deux paramètres : sa moyenne (μ), qui définit le centre de la distribution, et son écart-type (σ), qui définit sa largeur. La distribution normale est omniprésente en statistiques en raison du théorème central limite, qui stipule que la somme (centrée et réduite) d'un grand nombre de variables aléatoires indépendantes, de même loi et de variance finie, tend vers une distribution normale, quelle que soit la loi des variables individuelles (sous ces conditions).",
    examples: [
      "Les scores de QI sont construits pour suivre une distribution normale (moyenne 100, écart-type 15)",
      "Les erreurs de mesure en sciences physiques sont souvent modélisées par une distribution normale",
      "La taille des adultes d'une population donnée (par sexe) est souvent approximée par une distribution normale"
    ],
    relatedTerms: ["Loi gaussienne", "Théorème central limite", "Écart-type", "Distribution de probabilité", "Test z"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Normal Distribution",
    synonyms: ["Distribution gaussienne", "Loi normale", "Courbe en cloche"]
  },
  
  "test-d'hypothèse": {
    term: "Test d'hypothèse",
    shortDefinition: "Procédure statistique permettant de déterminer si une affirmation sur une population est supportée par les données d'un échantillon.",
    longDefinition: "Un test d'hypothèse est une méthode d'inférence statistique utilisée pour prendre des décisions basées sur des données. Il implique de formuler deux hypothèses concurrentes : l'hypothèse nulle (H₀), qui représente généralement le statu quo ou l'absence d'effet, et l'hypothèse alternative (H₁), qui représente ce que le chercheur tente de démontrer. Le test calcule la valeur p : la probabilité, si l'hypothèse nulle est vraie, d'obtenir un résultat au moins aussi extrême que celui observé. Si cette probabilité est suffisamment faible, on rejette l'hypothèse nulle en faveur de l'hypothèse alternative.",
    examples: [
      "Tester si un nouveau médicament est plus efficace qu'un placebo",
      "Déterminer si la moyenne des salaires diffère significativement entre deux entreprises",
      "Vérifier si une pièce de monnaie est équilibrée en analysant les résultats d'une série de lancers"
    ],
    relatedTerms: ["Valeur p", "Niveau de signification", "Hypothèse nulle", "Hypothèse alternative", "Erreur de type I et II"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Hypothesis Testing"
  },
  
  "régression-linéaire": {
    term: "Régression linéaire",
    shortDefinition: "Modèle statistique qui analyse la relation linéaire entre une variable dépendante et une ou plusieurs variables indépendantes.",
    longDefinition: "La régression linéaire est une approche fondamentale en statistiques et en apprentissage automatique qui modélise la relation entre une variable dépendante (cible) et une ou plusieurs variables indépendantes (prédicteurs) en ajustant une équation linéaire aux données observées. Dans sa forme la plus simple (régression linéaire simple), elle cherche à trouver la droite qui minimise la somme des carrés des écarts entre les valeurs observées et les valeurs prédites par le modèle. La régression linéaire multiple étend ce concept à plusieurs variables indépendantes. Malgré sa simplicité, la régression linéaire est un outil puissant qui sert de fondement à de nombreuses techniques d'analyse plus complexes.",
    examples: [
      "Prédire le prix d'une maison en fonction de sa superficie, du nombre de chambres et de son emplacement",
      "Analyser la relation entre les dépenses publicitaires et les ventes d'un produit",
      "Estimer l'impact de différents facteurs sur le rendement des cultures agricoles"
    ],
    relatedTerms: ["Moindres carrés ordinaires", "Coefficient de détermination (R²)", "Multicolinéarité", "Régression multiple", "Analyse résiduelle"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Linear Regression"
  },
  
  "corrélation": {
    term: "Corrélation",
    shortDefinition: "Mesure statistique qui exprime le degré de relation linéaire entre deux variables quantitatives.",
    longDefinition: "La corrélation est une mesure statistique qui quantifie la force et la direction de la relation entre deux variables continues. Le coefficient de corrélation de Pearson (r) est la mesure la plus couramment utilisée, variant de -1 (corrélation négative parfaite) à +1 (corrélation positive parfaite), 0 indiquant l'absence de corrélation linéaire. Il est crucial de noter que la corrélation ne démontre pas la causalité : deux variables peuvent être fortement corrélées sans qu'une variable cause directement les changements dans l'autre. D'autres types de corrélation existent pour mesurer des relations monotones (pas nécessairement linéaires) ou pour des données ordinales, comme le coefficient de Spearman ou de Kendall.",
    examples: [
      "La forte corrélation positive entre la taille et le poids chez les humains",
      "La corrélation négative entre le prix d'un produit et sa quantité demandée",
      "L'absence de corrélation attendue entre le jour du mois de naissance et la taille d'un adulte"
    ],
    relatedTerms: ["Coefficient de Pearson", "Covariance", "Causalité", "Régression", "Multicolinéarité"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Correlation"
  },
  
  "probabilité": {
    term: "Probabilité",
    shortDefinition: "Mesure de la vraisemblance qu'un événement se produise, exprimée par un nombre entre 0 et 1.",
    longDefinition: "La probabilité est un concept fondamental en mathématiques qui quantifie la possibilité qu'un événement se produise. Une probabilité de 0 indique un événement impossible, tandis qu'une probabilité de 1 représente un événement certain. En statistiques et en data science, les probabilités constituent le fondement théorique de nombreuses méthodes d'analyse et de prédiction. Les trois principales approches pour définir les probabilités sont : la probabilité classique (basée sur des résultats équiprobables), la probabilité fréquentiste (basée sur la fréquence relative à long terme) et la probabilité bayésienne (qui intègre des croyances a priori).",
    examples: [
      "La probabilité d'obtenir un 6 en lançant un dé équitable est de 1/6",
      "La probabilité qu'un client achète un produit après avoir vu une publicité",
      "Les probabilités de précipitations dans les prévisions météorologiques"
    ],
    relatedTerms: ["Distribution de probabilité", "Variable aléatoire", "Théorème de Bayes", "Indépendance", "Espérance mathématique"],
    domain: "statistics",
    level: "beginner",
    englishTerm: "Probability"
  }
};
