
import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

export const dataProcessingDefinitions: Record<string, GlossaryTermDefinition> = {
  "traitement-données": {
    term: "Traitement des données",
    shortDefinition: "Ensemble des opérations permettant de transformer des données brutes en informations exploitables.",
    longDefinition: "Le traitement des données comprend toutes les étapes nécessaires pour convertir des données brutes en informations utiles et exploitables. Cela inclut la collecte, le nettoyage, la transformation et l'organisation des données pour l'analyse et la modélisation.",
    examples: [
      "Nettoyage d'un jeu de données contenant des valeurs manquantes et aberrantes",
      "Conversion de données textuelles en format numérique pour l'analyse"
    ],
    relatedTerms: ["Data cleaning", "ETL", "Data munging", "Data wrangling"],
    source: "Principes de la Data Science"
  },
  
  "etl": {
    term: "ETL",
    shortDefinition: "Extract, Transform, Load - processus d'extraction, transformation et chargement des données.",
    longDefinition: "ETL (Extract, Transform, Load) est un processus en trois étapes utilisé pour intégrer des données provenant de multiples sources dans un entrepôt de données ou une autre base de données cible. Il comprend l'extraction des données de diverses sources, leur transformation pour répondre aux besoins analytiques, et leur chargement dans la destination finale.",
    examples: [
      "Extraction de données d'un CRM et d'un ERP pour les combiner dans un entrepôt de données",
      "Transformation de données brutes pour homogénéiser les formats et corriger les incohérences"
    ],
    relatedTerms: ["Data warehouse", "Data pipeline", "Data integration", "Batch processing"],
    source: "Principes de l'intégration de données"
  },
  
  "data-cleaning": {
    term: "Data Cleaning",
    shortDefinition: "Processus de détection et de correction des erreurs, incohérences et imprécisions dans les données.",
    longDefinition: "Le data cleaning (ou nettoyage de données) est le processus d'identification et de correction des erreurs, des incohérences, des valeurs manquantes et des anomalies dans les données. C'est une étape cruciale pour garantir la qualité des données avant l'analyse ou la modélisation.",
    examples: [
      "Imputation des valeurs manquantes dans un dataset",
      "Détection et traitement des valeurs aberrantes (outliers)"
    ],
    relatedTerms: ["Data quality", "Outliers", "Missing values", "Data validation"],
    source: "Méthodologies de préparation des données"
  },
  
  "feature-engineering": {
    term: "Feature Engineering",
    shortDefinition: "Processus de création de nouvelles variables (features) à partir des données existantes pour améliorer les modèles prédictifs.",
    longDefinition: "Le feature engineering est l'art et la science de transformer des données brutes en caractéristiques (features) qui représentent mieux le problème sous-jacent pour les algorithmes d'apprentissage automatique. C'est souvent l'un des aspects les plus créatifs et les plus influents sur la performance des modèles de machine learning.",
    examples: [
      "Création de variables cycliques pour représenter l'heure de la journée ou le jour de la semaine",
      "Extraction de caractéristiques textuelles comme la fréquence des mots ou la longueur des phrases"
    ],
    relatedTerms: ["Feature selection", "Dimensionality reduction", "Feature extraction", "One-hot encoding"],
    source: "Applied Predictive Modeling"
  },
  
  "normalisation": {
    term: "Normalisation",
    shortDefinition: "Processus de mise à l'échelle des valeurs numériques pour les ramener dans un intervalle spécifique, généralement [0,1].",
    longDefinition: "La normalisation est une technique de prétraitement des données qui ajuste les valeurs mesurées à différentes échelles à une échelle commune, généralement entre 0 et 1. Elle est particulièrement importante pour les algorithmes sensibles à l'échelle des données, comme les k-plus proches voisins ou les réseaux de neurones.",
    examples: [
      "Normaliser les prix des logements pour qu'ils se situent entre 0 et 1",
      "Mise à l'échelle min-max des caractéristiques d'un dataset avant l'entraînement d'un modèle"
    ],
    relatedTerms: ["Standardisation", "Min-max scaling", "Feature scaling", "Z-score normalization"],
    source: "Data Preprocessing Techniques"
  },
  
  "standardisation": {
    term: "Standardisation",
    shortDefinition: "Processus de transformation des données pour obtenir une moyenne de zéro et un écart-type de un.",
    longDefinition: "La standardisation (ou z-score normalization) est une méthode de mise à l'échelle des données qui centre les valeurs autour de zéro et leur donne un écart-type de un. Elle consiste à soustraire la moyenne et à diviser par l'écart-type pour chaque caractéristique. Cette technique est particulièrement utile lorsque les données suivent approximativement une distribution normale.",
    examples: [
      "Standardisation des données de taille et de poids avant une analyse en composantes principales",
      "Préparation des données pour un modèle de régression régularisée"
    ],
    relatedTerms: ["Z-score", "Normalisation", "Feature scaling", "Preprocessing"],
    source: "Statistical Learning Theory"
  },
  
  "encodage-catégoriel": {
    term: "Encodage catégoriel",
    shortDefinition: "Conversion de variables catégorielles en format numérique pour l'analyse ou la modélisation.",
    longDefinition: "L'encodage catégoriel est le processus de conversion des variables catégorielles (non numériques) en représentations numériques compréhensibles par les algorithmes d'apprentissage automatique. Différentes techniques d'encodage existent, comme l'encodage ordinal, le one-hot encoding ou l'encodage target, chacune ayant ses avantages selon le contexte.",
    examples: [
      "Transformer les valeurs 'Rouge', 'Vert', 'Bleu' en [1, 0, 0], [0, 1, 0], [0, 0, 1] (one-hot encoding)",
      "Convertir les niveaux d'éducation 'Primaire', 'Secondaire', 'Supérieur' en 1, 2, 3 (encodage ordinal)"
    ],
    relatedTerms: ["One-hot encoding", "Label encoding", "Dummy variables", "Target encoding"],
    source: "Feature Engineering for Machine Learning"
  },
  
  "data-warehouse": {
    term: "Data Warehouse",
    shortDefinition: "Système conçu pour l'analyse et le reporting intégrant des données provenant de diverses sources.",
    longDefinition: "Un entrepôt de données (data warehouse) est un système de stockage centralisé qui permet l'analyse de données intégrées provenant de sources diverses. Contrairement aux bases de données opérationnelles optimisées pour les transactions, les entrepôts de données sont conçus pour supporter des requêtes analytiques complexes et le traitement de grandes quantités de données historiques.",
    examples: [
      "Entrepôt de données d'entreprise centralisant des informations clients, produits et ventes",
      "Système d'aide à la décision basé sur un data warehouse pour l'analyse des tendances"
    ],
    relatedTerms: ["OLAP", "ETL", "Data mart", "Business intelligence"],
    source: "Data Warehousing Architecture"
  }
};
