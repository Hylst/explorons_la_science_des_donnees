import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

/**
 * Enhanced Data Preparation Definitions
 * 
 * Comprehensive glossary of technical terms used in data preparation sections
 * with detailed explanations, examples, and related concepts.
 */
export const dataPreparationEnhancedDefinitions: Record<string, GlossaryTermDefinition> = {
  // Data Quality Dimensions
  "exactitude": {
    term: "Exactitude",
    shortDefinition: "Mesure à quel point les données correspondent à la réalité qu'elles représentent.",
    longDefinition: "L'exactitude est la dimension la plus critique de la qualité des données. Elle évalue si les valeurs stockées reflètent fidèlement les phénomènes du monde réel. Des données inexactes conduisent inévitablement à des analyses erronées et des décisions dangereuses.",
    examples: [
      "Un âge de 150 ans indique une erreur d'exactitude",
      "Une température corporelle de -10°C est physiquement impossible",
      "Validation croisée avec des sources externes fiables"
    ],
    relatedTerms: ["Qualité des données", "Validation", "Contrôle de cohérence"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Accuracy"
  },

  "complétude": {
    term: "Complétude",
    shortDefinition: "Évalue si toutes les données nécessaires pour l'analyse sont présentes.",
    longDefinition: "La complétude mesure le pourcentage de données disponibles par rapport aux données attendues. Des données incomplètes peuvent créer des biais d'échantillonnage et fausser les conclusions statistiques.",
    examples: [
      "30% des dates de naissance manquantes dans une base patients",
      "Codes postaux vides empêchant l'analyse géographique",
      "Stratégies d'imputation pour combler les lacunes"
    ],
    relatedTerms: ["Données manquantes", "Imputation", "Biais d'échantillonnage"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Completeness"
  },

  "cohérence": {
    term: "Cohérence",
    shortDefinition: "Garantit que les données suivent des formats et conventions uniformes.",
    longDefinition: "La cohérence assure l'uniformité des données à travers tout le système. Elle vérifie que les mêmes informations sont représentées de manière identique partout, facilitant ainsi le traitement et l'analyse.",
    examples: [
      "Dates au format 01/02/2023 vs 2023-02-01 vs Feb 1, 2023",
      "Noms en MAJUSCULES vs Première Lettre vs minuscules",
      "Unités de mesure : km vs miles vs mètres"
    ],
    relatedTerms: ["Standardisation", "Normalisation", "Format de données"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Consistency"
  },

  "fraîcheur": {
    term: "Fraîcheur",
    shortDefinition: "Évalue si les données sont suffisamment récentes pour l'usage prévu.",
    longDefinition: "La fraîcheur (ou actualité) mesure l'âge des données et leur disponibilité dans les délais requis. Des données obsolètes peuvent conduire à des décisions inadaptées au contexte actuel.",
    examples: [
      "Prix de produits datant de 6 mois pour une analyse concurrentielle",
      "Données météo de la semaine dernière pour une prédiction",
      "Flux temps réel pour les données critiques"
    ],
    relatedTerms: ["Temps réel", "Latence", "Mise à jour"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Timeliness"
  },

  "validité": {
    term: "Validité",
    shortDefinition: "Vérifie que les données respectent les contraintes et formats définis.",
    longDefinition: "La validité contrôle que les données respectent les règles de format, les contraintes de domaine et les standards établis. Des données invalides peuvent causer des erreurs système et empêcher l'analyse.",
    examples: [
      "Code postal avec 6 chiffres au lieu de 5",
      "Adresse email sans @ ou domaine invalide",
      "Expressions régulières pour validation automatique"
    ],
    relatedTerms: ["Validation", "Contraintes", "Format", "Regex"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Validity"
  },

  "unicité": {
    term: "Unicité",
    shortDefinition: "Garantit qu'chaque entité est représentée une seule fois dans les données.",
    longDefinition: "L'unicité assure l'absence de doublons dans les données. Les duplicatas peuvent fausser les statistiques, surestimer les volumes et créer des biais dans les analyses et modèles prédictifs.",
    examples: [
      "Client présent 3 fois avec des variantes de nom",
      "Même transaction enregistrée plusieurs fois",
      "Algorithmes de déduplication et record linkage"
    ],
    relatedTerms: ["Doublons", "Déduplication", "Record linkage"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "Uniqueness"
  },

  // Data Cleaning Techniques
  "imputation": {
    term: "Imputation",
    shortDefinition: "Technique de remplacement des valeurs manquantes par des valeurs estimées.",
    longDefinition: "L'imputation est un ensemble de méthodes statistiques pour remplacer les données manquantes par des valeurs plausibles. Elle permet de conserver la taille de l'échantillon tout en limitant, selon la méthode et le mécanisme de données manquantes, les biais qu'elles introduisent (l'imputation par la moyenne, par exemple, réduit la variance).",
    examples: [
      "Imputation par la moyenne pour les variables numériques",
      "Imputation par le mode pour les variables catégorielles",
      "Imputation multiple avec des modèles prédictifs"
    ],
    relatedTerms: ["Données manquantes", "MICE", "KNN imputation"],
    domain: "dataprocessing",
    level: "intermediate",
    englishTerm: "Imputation"
  },

  "outliers": {
    term: "Outliers",
    shortDefinition: "Valeurs aberrantes qui s'écartent significativement du reste des données.",
    longDefinition: "Les outliers sont des observations qui diffèrent de manière significative des autres points de données. Ils peuvent représenter des erreurs de mesure, des cas exceptionnels réels, ou des phénomènes intéressants à étudier séparément.",
    examples: [
      "Salaire de 1 million d'euros dans une enquête sur les revenus moyens",
      "Température de 50°C en hiver à Paris",
      "Détection par méthode IQR, Z-score ou Isolation Forest"
    ],
    relatedTerms: ["Valeurs aberrantes", "IQR", "Z-score", "Isolation Forest"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Outliers",
    synonyms: ["Valeurs aberrantes", "Anomalies"]
  },

  "iqr": {
    term: "IQR",
    shortDefinition: "Interquartile Range - mesure de dispersion basée sur les quartiles.",
    longDefinition: "L'IQR (Interquartile Range) est la différence entre le troisième quartile (Q3) et le premier quartile (Q1). Il représente l'étendue des 50% centraux des données et est utilisé pour détecter les outliers de manière robuste.",
    examples: [
      "IQR = Q3 - Q1",
      "Outliers : valeurs < Q1 - 1.5×IQR ou > Q3 + 1.5×IQR",
      "Méthode robuste, peu sensible aux valeurs extrêmes"
    ],
    relatedTerms: ["Quartiles", "Boxplot", "Outliers", "Médiane"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Interquartile Range"
  },

  "z-score": {
    term: "Z-Score",
    shortDefinition: "Mesure standardisée indiquant à combien d'écarts-types une valeur se situe de la moyenne.",
    longDefinition: "Le Z-score (ou score standardisé) indique le nombre d'écarts-types qu'une observation se trouve au-dessus ou en-dessous de la moyenne. Il est calculé comme (valeur - moyenne) / écart-type et est utilisé pour détecter les outliers.",
    examples: [
      "Z = (x - μ) / σ",
      "Outliers généralement définis comme |Z| > 3",
      "Assume une distribution normale des données"
    ],
    relatedTerms: ["Standardisation", "Distribution normale", "Écart-type"],
    domain: "statistics",
    level: "intermediate",
    englishTerm: "Z-Score",
    synonyms: ["Score standardisé"]
  },

  "isolation-forest": {
    term: "Isolation Forest",
    shortDefinition: "Algorithme de machine learning pour la détection d'anomalies multidimensionnelles.",
    longDefinition: "Isolation Forest est un algorithme non supervisé qui détecte les anomalies en isolant les observations. Il fonctionne sur le principe que les anomalies sont plus faciles à isoler que les points normaux, car elles sont rares et différentes.",
    examples: [
      "Détection d'anomalies dans des données multidimensionnelles",
      "Ne nécessite pas d'hypothèses sur la distribution des données",
      "Efficace sur de gros volumes de données"
    ],
    relatedTerms: ["Détection d'anomalies", "Machine learning", "Algorithme non supervisé"],
    domain: "machinelearning",
    level: "advanced",
    englishTerm: "Isolation Forest"
  },

  // Data Collection Framework
  "smart-framework": {
    term: "Framework SMART",
    shortDefinition: "Méthodologie pour définir des objectifs de collecte de données Spécifiques, Mesurables, Atteignables, Réalistes et Temporels.",
    longDefinition: "Le framework SMART appliqué à la collecte de données garantit que les objectifs de collecte sont bien définis et réalisables. Il aide à structurer la démarche de collecte pour maximiser la qualité et l'utilité des données obtenues.",
    examples: [
      "Spécifique : Collecter les données de vente par produit et région",
      "Mesurable : Obtenir 95% de complétude sur les champs critiques",
      "Temporel : Collecte quotidienne avec latence < 2h"
    ],
    relatedTerms: ["Collecte de données", "Objectifs", "Méthodologie"],
    domain: "dataprocessing",
    level: "beginner",
    englishTerm: "SMART Framework"
  },

  // Advanced Techniques
  "record-linkage": {
    term: "Record Linkage",
    shortDefinition: "Technique d'identification et de liaison d'enregistrements se référant à la même entité.",
    longDefinition: "Le record linkage (ou appariement d'enregistrements) est le processus d'identification des enregistrements dans différentes sources de données qui se réfèrent à la même entité du monde réel, même en présence de variations dans la représentation des données.",
    examples: [
      "Lier 'Jean Dupont' et 'J. DUPONT' comme la même personne",
      "Appariement probabiliste basé sur la similarité",
      "Déduplication de bases de données clients"
    ],
    relatedTerms: ["Déduplication", "Fuzzy matching", "Similarité"],
    domain: "dataprocessing",
    level: "advanced",
    englishTerm: "Record Linkage"
  },

  "fuzzy-matching": {
    term: "Fuzzy Matching",
    shortDefinition: "Technique de correspondance approximative permettant de trouver des similitudes malgré les variations.",
    longDefinition: "Le fuzzy matching utilise des algorithmes de similarité pour identifier des correspondances approximatives entre des chaînes de caractères ou des enregistrements, même en présence d'erreurs de frappe, de variations d'orthographe ou de formats différents.",
    examples: [
      "'Société Générale' correspond à 'Societe Generale' (accent manquant)",
      "Distance de Levenshtein pour mesurer la similarité",
      "Seuil de similarité configurable (ex: 85%)"
    ],
    relatedTerms: ["Distance de Levenshtein", "Similarité", "Record linkage"],
    domain: "dataprocessing",
    level: "advanced",
    englishTerm: "Fuzzy Matching"
  },

  // Quality Metrics
  "kpi-qualité": {
    term: "KPI Qualité",
    shortDefinition: "Indicateurs clés de performance pour mesurer et suivre la qualité des données.",
    longDefinition: "Les KPI (Key Performance Indicators) de qualité sont des métriques quantifiables qui permettent de mesurer, surveiller et améliorer la qualité des données au fil du temps. Ils fournissent une vision objective de l'état de santé des données.",
    examples: [
      "Taux de complétude : 95% des champs obligatoires remplis",
      "Taux d'exactitude : 99.5% de données validées",
      "Temps de détection d'anomalies : < 1 heure"
    ],
    relatedTerms: ["Métriques", "Qualité des données", "Monitoring"],
    domain: "dataprocessing",
    level: "intermediate",
    englishTerm: "Data Quality KPI"
  },

  // Tools and Technologies
  "pandas-profiling": {
    term: "fg-data-profiling (ex ydata-profiling, ex pandas-profiling)",
    shortDefinition: "Outil Python pour générer automatiquement des rapports d'analyse exploratoire de données.",
    longDefinition: "fg-data-profiling (anciennement ydata-profiling, lui-même ex pandas-profiling ; le paquet ydata-profiling n'est plus mis à jour, sa dernière version date d'avril 2026) est une bibliothèque Python qui génère des rapports HTML détaillés sur la qualité et les caractéristiques d'un dataset : statistiques descriptives, valeurs manquantes, corrélations et alertes sur les problèmes de qualité.",
    examples: [
      "Génération automatique de rapports de qualité",
      "Détection des valeurs manquantes et aberrantes",
      "Analyse des corrélations et distributions"
    ],
    relatedTerms: ["EDA", "Python", "Analyse exploratoire"],
    domain: "programming",
    level: "intermediate",
    englishTerm: "fg-data-profiling (ydata-profiling, pandas-profiling)"
  },

  "great-expectations": {
    term: "Great Expectations",
    shortDefinition: "Framework Python pour la validation, documentation et profilage des données.",
    longDefinition: "Great Expectations est un framework open-source qui aide les équipes à maintenir la qualité des données en définissant des 'expectations' (attentes) sur les données, en les validant automatiquement et en générant de la documentation.",
    examples: [
      "Définition d'attentes sur la structure des données",
      "Validation automatique dans les pipelines",
      "Documentation auto-générée des règles de qualité"
    ],
    relatedTerms: ["Validation de données", "Pipeline", "Documentation"],
    domain: "programming",
    level: "advanced",
    englishTerm: "Great Expectations"
  },

  "deequ": {
    term: "Deequ",
    shortDefinition: "Bibliothèque Scala/Spark d'Amazon pour la validation de qualité des données à grande échelle.",
    longDefinition: "Deequ est une bibliothèque développée par Amazon pour définir des contraintes de qualité sur les données et les valider de manière scalable avec Apache Spark. Elle est particulièrement adaptée aux gros volumes de données.",
    examples: [
      "Validation de qualité sur des téraoctets de données",
      "Intégration native avec Apache Spark",
      "Métriques de qualité en temps réel"
    ],
    relatedTerms: ["Apache Spark", "Big Data", "Scala"],
    domain: "programming",
    level: "advanced",
    englishTerm: "Deequ"
  }
};