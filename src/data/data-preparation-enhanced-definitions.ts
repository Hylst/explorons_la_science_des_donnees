/**
 * Enhanced definitions for data preparation technical terms
 * Used for tooltips in data preparation components
 */

export const dataPreparationEnhancedDefinitions = {
  // Data Quality Dimensions
  exactitude: {
    term: "Exactitude",
    shortDefinition: "Conformité des données à la réalité",
    definition: "Mesure de la conformité des données à la réalité. Une donnée exacte reflète fidèlement l'information qu'elle est censée représenter.",
    examples: ["Une adresse correctement orthographiée", "Un âge correspondant à la date de naissance"]
  },
  
  complétude: {
    term: "Complétude",
    shortDefinition: "Proportion de données présentes vs attendues",
    definition: "Proportion de données présentes par rapport aux données attendues. Mesure l'absence de valeurs manquantes.",
    examples: ["Tous les champs obligatoires remplis", "Aucune valeur NULL dans les colonnes critiques"]
  },
  
  cohérence: {
    term: "Cohérence",
    shortDefinition: "Absence de contradictions entre les données",
    definition: "Absence de contradictions entre les données. Les informations doivent être logiquement compatibles entre elles.",
    examples: ["Date de naissance antérieure à la date d'embauche", "Montant total égal à la somme des composants"]
  },
  
  fraîcheur: {
    term: "Fraîcheur",
    shortDefinition: "Actualité des données",
    definition: "Actualité des données par rapport au moment de leur utilisation. Mesure le délai entre la collecte et l'usage.",
    examples: ["Cours de bourse en temps réel", "Inventaire mis à jour quotidiennement"]
  },
  
  validité: {
    term: "Validité",
    shortDefinition: "Conformité aux règles métier et formats",
    definition: "Conformité des données aux règles métier et formats attendus. Respect des contraintes de domaine.",
    examples: ["Email avec format valide", "Code postal respectant le format national"]
  },
  
  unicité: {
    term: "Unicité",
    shortDefinition: "Absence de doublons",
    definition: "Absence de doublons dans les données. Chaque entité ne doit être représentée qu'une seule fois.",
    examples: ["Un seul enregistrement par client", "Identifiants uniques dans la base"]
  },
  
  // Data Cleaning Techniques
  donneesManquantes: {
    term: "Données Manquantes",
    shortDefinition: "Valeurs absentes dans un dataset",
    definition: "Valeurs absentes ou nulles dans un dataset qui peuvent affecter la qualité de l'analyse et nécessitent un traitement approprié.",
    examples: ["Valeurs NULL dans une base de données", "Champs vides dans un formulaire", "Mesures non collectées"]
  },



  suppression: {
    term: "Suppression",
    shortDefinition: "Élimination des données problématiques",
    definition: "Technique consistant à supprimer les enregistrements ou valeurs problématiques du dataset.",
    examples: ["Suppression des lignes avec valeurs manquantes", "Élimination des outliers", "Retrait des doublons"]
  },

  modelisation: {
    term: "Modélisation",
    shortDefinition: "Utilisation de modèles pour traiter les données",
    definition: "Approche utilisant des modèles statistiques ou d'apprentissage automatique pour traiter les problèmes de qualité des données.",
    examples: ["Modèles prédictifs pour l'imputation", "Algorithmes de détection d'anomalies", "Modèles de déduplication"]
  },

  isolationForest: {
    term: "Isolation Forest",
    shortDefinition: "Algorithme de détection d'anomalies basé sur l'isolement",
    definition: "Algorithme d'apprentissage automatique non supervisé qui détecte les anomalies en isolant les observations. Il construit un ensemble d'arbres de décision où les anomalies sont isolées plus rapidement que les points normaux.",
    examples: [
      "Détection de fraudes dans les transactions financières",
      "Identification d'anomalies dans les données de capteurs IoT",
      "Détection d'intrusions dans les systèmes de sécurité"
    ]
  },

  imputation: {
    term: "Imputation",
    shortDefinition: "Remplacement des valeurs manquantes",
    definition: "Technique de remplacement des valeurs manquantes par des valeurs estimées basées sur les données disponibles.",
    examples: ["Moyenne pour les variables numériques", "Mode pour les variables catégorielles", "Régression pour l'imputation prédictive"]
  },
  
  outliers: {
    term: "Valeurs Aberrantes",
    shortDefinition: "Observations s'écartant du pattern général",
    definition: "Observations qui s'écartent significativement du pattern général des données, pouvant indiquer des erreurs ou des cas exceptionnels.",
    examples: ["Salaire de 1M€ dans une base d'employés", "Âge de 200 ans", "Température de 100°C en hiver"]
  },
  
  iqr: {
    term: "IQR Method",
    shortDefinition: "Méthode de détection d'outliers basée sur l'écart interquartile",
    definition: "Méthode statistique qui utilise l'écart interquartile (Q3-Q1) pour identifier les valeurs aberrantes. Les outliers sont définis comme les valeurs inférieures à Q1-1.5×IQR ou supérieures à Q3+1.5×IQR.",
    examples: [
      "Détection d'âges aberrants dans une base de données patients",
      "Identification de salaires anormalement élevés ou bas",
      "Repérage de températures extrêmes dans des données météo"
    ]
  },
  
  zscore: {
    term: "Z-Score",
    shortDefinition: "Score standardisé pour la détection d'anomalies",
    definition: "Mesure statistique qui indique combien d'écarts-types une valeur s'écarte de la moyenne. Les valeurs avec |z-score| > 3 sont généralement considérées comme des outliers.",
    examples: [
      "Détection de performances anormales d'étudiants",
      "Identification de mesures biologiques atypiques",
      "Repérage de variations inhabituelles dans les ventes"
    ]
  },
  

  
  recordLinkage: {
    term: "Record Linkage",
    shortDefinition: "Liaison d'enregistrements provenant de sources multiples",
    definition: "Processus d'identification et de liaison d'enregistrements qui se réfèrent à la même entité réelle à travers différentes sources de données, même sans identifiant commun.",
    examples: [
      "Liaison de dossiers patients entre hôpitaux différents",
      "Matching de profils clients entre bases de données CRM",
      "Consolidation d'informations employés multi-systèmes"
    ]
  },
  
  fuzzyMatching: {
    term: "Fuzzy Matching",
    shortDefinition: "Correspondance approximative de chaînes de caractères",
    definition: "Technique qui permet de trouver des correspondances approximatives entre des chaînes de caractères, même en présence de fautes de frappe, d'abréviations ou de variations mineures.",
    examples: [
      "Déduplication de noms de clients (Jean Dupont vs J. Dupont)",
      "Correspondance d'adresses avec variations orthographiques",
      "Matching de produits avec descriptions similaires"
    ]
  },
  
  doublons: {
    term: "Doublons",
    shortDefinition: "Enregistrements identiques ou similaires dans un dataset",
    definition: "Enregistrements qui apparaissent plusieurs fois dans un dataset, soit de manière exacte soit avec des variations mineures, pouvant affecter la qualité des analyses.",
    examples: [
      "Clients enregistrés plusieurs fois avec des variantes de nom",
      "Transactions dupliquées par erreur système",
      "Produits avec références légèrement différentes"
    ]
  },
  
  // SMART Framework
  smartFramework: {
    term: "Framework SMART",
    shortDefinition: "Méthodologie d'objectifs : Spécifique, Mesurable, Atteignable, Réaliste, Temporel",
    definition: "Méthodologie de définition d'objectifs : Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini.",
    examples: ["Objectifs de qualité des données", "Critères de collecte de données", "KPIs de performance"]
  },
  
  // Quality KPIs
  qualityKPIs: {
    term: "KPIs Qualité",
    shortDefinition: "Indicateurs de performance pour la qualité des données",
    definition: "Indicateurs clés de performance pour mesurer et surveiller la qualité des données en continu.",
    examples: ["Taux de complétude", "Pourcentage d'erreurs", "Temps de détection des anomalies"]
  },
  
  // Tools
  pandasProfiling: {
    term: "fg-data-profiling (ex ydata-profiling, ex pandas-profiling)",
    shortDefinition: "Outil Python d'analyse exploratoire automatique",
    definition: "Bibliothèque Python générant automatiquement des rapports détaillés d'analyse exploratoire des données. Elle s'appelait pandas-profiling, puis ydata-profiling (version 4, 2023), et se nomme désormais fg-data-profiling (le paquet ydata-profiling n'est plus mis à jour ; import : data_profiling).",
    examples: ["Statistiques descriptives", "Détection de corrélations", "Identification des valeurs manquantes"]
  },
  
  greatExpectations: {
    term: "Great Expectations",
    shortDefinition: "Framework Python de validation de données",
    definition: "Framework Python pour la validation, documentation et profilage des données avec des tests automatisés.",
    examples: ["Tests de qualité automatisés", "Documentation des attentes", "Monitoring continu"]
  },
  
  deequ: {
    term: "Deequ",
    shortDefinition: "Bibliothèque Scala/Spark de validation big data",
    definition: "Bibliothèque Scala/Spark pour la validation et le profilage de données à grande échelle développée par Amazon.",
    examples: ["Validation de big data", "Métriques de qualité distribuées", "Intégration avec Spark"]
  },
  
  // Lifecycle phases
  collecte: {
    term: "Collecte de Données",
    shortDefinition: "Acquisition de données depuis diverses sources",
    definition: "Phase d'acquisition et de rassemblement des données depuis diverses sources internes et externes.",
    examples: ["Extraction de bases de données", "APIs et web scraping", "Capteurs IoT"]
  },
  
  nettoyage: {
    term: "Nettoyage de Données",
    shortDefinition: "Correction des erreurs et incohérences",
    definition: "Processus d'identification et de correction des erreurs, incohérences et valeurs manquantes dans les données.",
    examples: ["Suppression des doublons", "Correction des erreurs de saisie", "Traitement des valeurs manquantes"]
  },
  
  transformation: {
    term: "Transformation de Données",
    shortDefinition: "Modification de structure et format des données",
    definition: "Modification de la structure, du format ou du contenu des données pour les adapter aux besoins d'analyse.",
    examples: ["Normalisation", "Agrégation", "Création de variables dérivées", "Changement de format"]
  },
  
  validation: {
    term: "Validation de Données",
    shortDefinition: "Vérification de conformité aux règles métier",
    definition: "Vérification de la conformité des données aux règles métier et critères de qualité définis.",
    examples: ["Tests de cohérence", "Validation des formats", "Contrôles de plausibilité"]
  },
  
  exploitation: {
    term: "Exploitation de Données",
    shortDefinition: "Utilisation des données pour l'analyse",
    definition: "Utilisation des données préparées pour l'analyse, la modélisation ou la prise de décision.",
    examples: ["Analyses statistiques", "Machine learning", "Tableaux de bord", "Rapports métier"]
  },
  
  // Automation
  etl: {
    term: "ETL (Extract, Transform, Load)",
    shortDefinition: "Processus automatisé d'extraction, transformation et chargement",
    definition: "Processus automatisé d'extraction, transformation et chargement des données depuis les sources vers les systèmes cibles.",
    examples: ["Pipelines de données", "Intégration de données", "Data warehousing"]
  },
  
  orchestration: {
    term: "Orchestration",
    shortDefinition: "Coordination automatisée des workflows",
    definition: "Coordination et gestion automatisée des workflows et tâches de traitement des données.",
    examples: ["Planification des tâches", "Gestion des dépendances", "Monitoring des pipelines"]
  },
  
  monitoring: {
    term: "Monitoring",
    shortDefinition: "Surveillance continue des données et processus",
    definition: "Surveillance continue de la qualité, performance et disponibilité des données et processus.",
    examples: ["Alertes qualité", "Métriques de performance", "Détection d'anomalies"]
  },
  
  deployment: {
    term: "Déploiement",
    shortDefinition: "Mise en production des pipelines",
    definition: "Mise en production des pipelines et processus de données dans l'environnement opérationnel.",
    examples: ["CI/CD pour les données", "Déploiement automatisé", "Gestion des versions"]
  }
};

export type DataPreparationDefinition = {
  term: string;
  shortDefinition: string;
  definition: string;
  examples: string[];
};

// Create a type that allows string indexing
export type DataPreparationDefinitions = {
  [K in keyof typeof dataPreparationEnhancedDefinitions]: typeof dataPreparationEnhancedDefinitions[K];
} & {
  [key: string]: DataPreparationDefinition | undefined;
};

// Cast the definitions object to the proper type
export const typedDataPreparationDefinitions = dataPreparationEnhancedDefinitions as DataPreparationDefinitions;