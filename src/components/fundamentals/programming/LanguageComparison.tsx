
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, Area, AreaChart } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Code, BarChart3, Zap, Award, Target, Lightbulb, Scale, CheckCircle } from "lucide-react";
import { SourceNote } from "@/components/ui/source-note";
import { readableTextColor } from "@/lib/contrast";

/**
 * TypeScript interfaces for type safety
 */
interface LanguageData {
  name: string;
  popularity: number;
  learningCurve: number;
  jobMarket: number;
  performance: number;
  ecosystem: number;
  color: string;
  icon: string;
  category: string;
  yearCreated: number;
  creator: string;
  paradigms: string[];
  strengths: string[];
  weaknesses: string[];
  useCases: string[];
  marketTrend: string;
  difficulty: string;
  timeToLearn: string;
}

interface ComparisonData {
  language: string;
  icon: string;
  pros: string[];
  cons: string[];
}

type TopicKey = 'Analyse de Données' | 'Visualisation' | 'Machine Learning' | 'Base de Données';

interface UseCaseData {
  useCase: string;
  Python: number;
  R: number;
  SQL: number;
  Julia: number;
  icon: string;
  [key: string]: string | number;
}

// Défini hors du composant principal : sinon il est recréé à chaque rendu (le composant se redessine toutes les 3 s
// pour l'animation des cartes) et l'onglet choisi par le visiteur reviendrait à Python.
const CodeComparison = ({ title, pythonCode, rCode, sqlCode }: { title: string, pythonCode: string, rCode: string, sqlCode: string }) => (
  <div className="my-6">
    <h4 className="font-semibold mb-4">{title}</h4>
    <Tabs defaultValue="python" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="python">🐍 Python</TabsTrigger>
        <TabsTrigger value="r">📊 R</TabsTrigger>
        <TabsTrigger value="sql">🗃️ SQL</TabsTrigger>
      </TabsList>
      <TabsContent value="python">
        <div className="bg-gray-900 rounded-md overflow-hidden">
          <div className="px-4 py-2 bg-blue-800 text-white text-sm">Python</div>
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{pythonCode}</code></pre>
        </div>
      </TabsContent>
      <TabsContent value="r">
        <div className="bg-gray-900 rounded-md overflow-hidden">
          <div className="px-4 py-2 bg-blue-600 text-white text-sm">R</div>
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{rCode}</code></pre>
        </div>
      </TabsContent>
      <TabsContent value="sql">
        <div className="bg-gray-900 rounded-md overflow-hidden">
          <div className="px-4 py-2 bg-amber-600 text-white text-sm">SQL</div>
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{sqlCode}</code></pre>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

/**
 * Enhanced Language Comparison Component with modern ES6 features
 * Provides comprehensive analysis of programming languages for data science
 */
const LanguageComparison = () => {
  const [selectedComparison, setSelectedComparison] = useState("overview");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCodeTopic, setSelectedCodeTopic] = useState<TopicKey>('Analyse de Données');

  /**
   * Comprehensive language data with enhanced metrics and details
   * Using modern ES6 object destructuring and enhanced object literals
   */
  const languageData = useMemo(() => [
    { 
      name: "Python", 
      popularity: 63, 
      learningCurve: 85, 
      jobMarket: 92, 
      performance: 68,
      ecosystem: 96,
      color: "#3776ab",
      icon: "🐍",
      category: "Généraliste",
      yearCreated: 1991,
      creator: "Guido van Rossum",
      paradigms: ["Orienté objet", "Fonctionnel", "Procédural"],
      strengths: ["Syntaxe claire", "Vaste écosystème", "Communauté active", "Polyvalence"],
      weaknesses: ["Vitesse d'exécution du code Python pur", "GIL (verrou global ; version sans GIL optionnelle depuis Python 3.13)", "Consommation mémoire"],
      useCases: ["Machine Learning", "Web Development", "Automatisation", "Data Analysis"],
      marketTrend: "📈 En croissance",
      difficulty: "Facile",
      timeToLearn: "3-6 mois"
    },
    { 
      name: "R", 
      popularity: 27, 
      learningCurve: 65, 
      jobMarket: 75, 
      performance: 58,
      ecosystem: 88,
      color: "#276dc3",
      icon: "📊",
      category: "Statistiques",
      yearCreated: 1993,
      creator: "Ross Ihaka & Robert Gentleman",
      paradigms: ["Fonctionnel", "Orienté objet", "Procédural"],
      strengths: ["Analyses statistiques", "Visualisations", "Packages spécialisés", "Recherche"],
      weaknesses: ["Courbe d'apprentissage", "Performance", "Syntaxe parfois complexe"],
      useCases: ["Analyses statistiques", "Bioinformatique", "Recherche", "Visualisation"],
      marketTrend: "📊 Stable",
      difficulty: "Modéré",
      timeToLearn: "4-8 mois"
    },
    { 
      name: "SQL", 
      popularity: 35, 
      learningCurve: 88, 
      jobMarket: 98, 
      performance: 85,
      ecosystem: 75,
      color: "#f29111",
      icon: "🗃️",
      category: "Base de données",
      yearCreated: 1974,
      creator: "Donald Chamberlin & Raymond Boyce",
      paradigms: ["Déclaratif", "Relationnel"],
      strengths: ["Standard universel", "Performance", "Simplicité", "Omniprésent"],
      weaknesses: ["Limité aux données", "Pas de logique complexe", "Variations entre SGBD"],
      useCases: ["Gestion de données", "Reporting", "ETL", "Analytics"],
      marketTrend: "🔄 Essentiel",
      difficulty: "Facile",
      timeToLearn: "2-4 mois"
    },
    { 
      name: "Julia", 
      popularity: 11, 
      learningCurve: 50, 
      jobMarket: 28, 
      performance: 98,
      ecosystem: 45,
      color: "#9558b2",
      icon: "⚡",
      category: "Performance",
      yearCreated: 2012,
      creator: "Jeff Bezanson, Stefan Karpinski, Viral Shah, Alan Edelman",
      paradigms: ["Fonctionnel", "Orienté objet", "Procédural"],
      strengths: ["Performance native", "Syntaxe mathématique", "Parallélisme", "Interopérabilité"],
      weaknesses: ["Écosystème jeune", "Communauté réduite", "Temps de compilation"],
      useCases: ["Calcul scientifique", "HPC", "Finance quantitative", "Recherche"],
      marketTrend: "🔬 Niche (calcul scientifique)",
      difficulty: "Modéré-Difficile",
      timeToLearn: "6-12 mois"
    }
  ], []);

  /**
   * Enhanced use case data with more comprehensive scenarios
   * Using modern ES6 array methods and object destructuring
   */
  const useCaseData = useMemo((): UseCaseData[] => [
    { useCase: "Débutant complet", Python: 9, R: 6, SQL: 8, Julia: 4, icon: "🎓" },
    { useCase: "Analyse statistique", Python: 8, R: 10, SQL: 5, Julia: 8, icon: "📊" },
    { useCase: "Big Data", Python: 8, R: 6, SQL: 9, Julia: 7, icon: "🗄️" },
    { useCase: "Machine Learning", Python: 10, R: 7, SQL: 3, Julia: 8, icon: "🤖" },
    { useCase: "Visualisation", Python: 8, R: 10, SQL: 2, Julia: 6, icon: "📈" },
    { useCase: "Performance", Python: 6, R: 4, SQL: 8, Julia: 10, icon: "⚡" },
    { useCase: "Web Development", Python: 9, R: 2, SQL: 6, Julia: 3, icon: "🌐" },
    { useCase: "Recherche académique", Python: 8, R: 10, SQL: 4, Julia: 9, icon: "🔬" },
    { useCase: "Finance quantitative", Python: 9, R: 8, SQL: 7, Julia: 10, icon: "💰" },
    { useCase: "IoT et capteurs", Python: 8, R: 3, SQL: 5, Julia: 6, icon: "📡" }
  ], []);

  /**
   * Market trend data for visualization
   */
  const trendData = useMemo(() => [
    { year: '2021', Python: 48.24, R: 5.07, SQL: 47.08, Julia: 1.29 },
    { year: '2022', Python: 48.07, R: 4.66, SQL: 49.43, Julia: 1.53 },
    { year: '2023', Python: 49.28, R: 4.23, SQL: 48.66, Julia: 1.15 },
    { year: '2024', Python: 51, R: 4.3, SQL: 51, Julia: 1.1 },
    { year: '2025', Python: 57.9, R: 4.9, SQL: 58.6, Julia: null }
  ], []);

  /**
   * Interactive callback functions using modern ES6 features
   */
  const handleLanguageSelect = useCallback((language: LanguageData) => {
    setSelectedLanguage(language);
  }, []);

  const toggleAdvancedView = useCallback(() => {
    setShowAdvanced(prev => !prev);
  }, []);

  /**
   * Animation effect for interactive elements
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to get code examples based on topic and language
  const getCodeExample = useCallback((language: string, topic: string): string => {
    const examples: Record<string, Record<string, string>> = {
      'Analyse de Données': {
        Python: `import pandas as pd
import numpy as np

# Chargement et analyse des données
df = pd.read_csv('data.csv')
print(f"Shape: {df.shape}")
print(df.describe())

# Analyse groupée
result = df.groupby('category').agg({
    'value': ['mean', 'std', 'count']
}).round(2)`,
        R: `library(dplyr)
library(readr)

# Chargement et analyse
df <- read_csv('data.csv')
glimpse(df)
summary(df)

# Analyse groupée
result <- df %>%
  group_by(category) %>%
  summarise(
    mean_value = mean(value),
    sd_value = sd(value),
    count = n()
  )`,
        SQL: `-- Analyse descriptive (STDDEV existe dans PostgreSQL, MySQL et Oracle ; SQLite n'a pas de fonction d'écart-type)
SELECT
  category,
  COUNT(*) as count,
  AVG(value) as mean_value,
  STDDEV(value) as std_value,
  MIN(value) as min_value,
  MAX(value) as max_value
FROM data_table
GROUP BY category
ORDER BY mean_value DESC;`,
        Julia: `using DataFrames, CSV, Statistics

# Chargement et analyse
df = CSV.read("data.csv", DataFrame)
describe(df)

# Analyse groupée
result = combine(groupby(df, :category),
    :value => mean => :mean_value,
    :value => std => :std_value,
    :value => length => :count
)`
      },
      'Visualisation': {
        Python: `import matplotlib.pyplot as plt
import seaborn as sns

# Configuration du style
sns.set_style("whitegrid")
plt.figure(figsize=(10, 6))

# Graphique en boîtes
sns.boxplot(data=df, x='category', y='value')
plt.title('Distribution par Catégorie')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`,
        R: `library(ggplot2)
library(dplyr)

# Graphique avec ggplot2
df %>%
  ggplot(aes(x = category, y = value, fill = category)) +
  geom_boxplot() +
  theme_minimal() +
  labs(
    title = "Distribution par Catégorie",
    x = "Catégorie",
    y = "Valeur"
  ) +
  theme(axis.text.x = element_text(angle = 45))`,
        SQL: `-- Données pour visualisation
SELECT 
  category,
  value,
  NTILE(4) OVER (ORDER BY value) as quartile
FROM data_table
WHERE value IS NOT NULL
ORDER BY category, value;`,
        Julia: `using Plots, StatsPlots

# Graphique en boîtes
boxplot(df.category, df.value,
    title="Distribution par Catégorie",
    xlabel="Catégorie",
    ylabel="Valeur",
    legend=false
)`
      },
      'Machine Learning': {
        Python: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Préparation des données
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Modèle
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Prédiction
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.3f}")`,
        R: `library(randomForest)
library(caret)

# Préparation
set.seed(42)
trainIndex <- createDataPartition(
  df$target, p = 0.8, list = FALSE
)
train_data <- df[trainIndex, ]
test_data <- df[-trainIndex, ]

# Modèle Random Forest
model <- randomForest(
  target ~ ., 
  data = train_data,
  ntree = 100
)

# Prédiction
predictions <- predict(model, test_data)
confusionMatrix(predictions, test_data$target)`,
        SQL: `-- Feature engineering pour ML
WITH features AS (
  SELECT 
    id,
    feature1,
    feature2,
    LAG(feature1) OVER (ORDER BY date) as prev_feature1,
    AVG(feature2) OVER (
      ORDER BY date
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as rolling_avg_feature2,
    target
  FROM ml_data
)
SELECT * FROM features
WHERE prev_feature1 IS NOT NULL;`,
        Julia: `using MLJ, DataFrames, Statistics

# Chargement du modèle
RandomForestClassifier = @load RandomForestClassifier pkg=DecisionTree

# Préparation
train, test = partition(eachindex(y), 0.8, shuffle=true)

# Modèle
model = RandomForestClassifier(n_trees=100)
mach = machine(model, X, y)

# Entraînement
fit!(mach, rows=train)

# Prédiction
y_pred = predict_mode(mach, rows=test)
accuracy = mean(y_pred .== y[test])`
      },
      'Base de Données': {
        Python: `import sqlite3
import pandas as pd

# Connexion à la base
conn = sqlite3.connect('database.db')

# Requête complexe
query = """
SELECT 
    c.name as customer_name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
"""

result = pd.read_sql_query(query, conn)
print(result.head())`,
        R: `library(DBI)
library(RSQLite)

# Connexion
con <- dbConnect(SQLite(), "database.db")

# Requête
query <- "
  SELECT 
    c.name as customer_name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
  FROM customers c
  LEFT JOIN orders o ON c.id = o.customer_id
  GROUP BY c.id, c.name
  HAVING COUNT(o.id) > 5
  ORDER BY total_spent DESC
"

result <- dbGetQuery(con, query)
head(result)`,
        SQL: `-- Analyse avancée des ventes
WITH customer_metrics AS (
  SELECT 
    customer_id,
    COUNT(*) as order_count,
    SUM(total) as total_spent,
    AVG(total) as avg_order_value,
    MAX(order_date) as last_order_date
  FROM orders
  GROUP BY customer_id
),
customer_segments AS (
  SELECT 
    *,
    CASE 
      WHEN total_spent > 1000 THEN 'VIP'
      WHEN total_spent > 500 THEN 'Regular'
      ELSE 'Occasional'
    END as segment
  FROM customer_metrics
)
SELECT 
  segment,
  COUNT(*) as customer_count,
  AVG(total_spent) as avg_spent
FROM customer_segments
GROUP BY segment;`,
        Julia: `using SQLite, DataFrames, DBInterface

# Connexion
db = SQLite.DB("database.db")

# Requête
query = """
  SELECT 
    c.name as customer_name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
  FROM customers c
  LEFT JOIN orders o ON c.id = o.customer_id
  GROUP BY c.id, c.name
  HAVING COUNT(o.id) > 5
  ORDER BY total_spent DESC
"""

result = DBInterface.execute(db, query) |> DataFrame
first(result, 10)`
      }
    };
    return examples[topic]?.[language] || `# Exemple non disponible pour ${language} - ${topic}`;
  }, []);

  // Helper function to get language comparison data
  const getLanguageComparison = useCallback((topic: string) => {
    const comparisons: Record<string, ComparisonData[]> = {
      'Analyse de Données': [
        {
          language: 'Python',
          icon: '🐍',
          pros: ['Syntaxe claire', 'pandas et NumPy très complets', 'Grande communauté', 'Intégration facile'],
          cons: ['Code Python pur plus lent que Julia', 'GIL pour le parallélisme par threads', 'Gestion mémoire']
        },
        {
          language: 'R',
          icon: '📊',
          pros: ['Conçu pour les stats', 'Visualisations natives', 'Packages spécialisés'],
          cons: ['Syntaxe parfois complexe', 'Performance limitée', 'Courbe d\'apprentissage']
        },
        {
          language: 'SQL',
          icon: '🗃️',
          pros: ['Conçu pour interroger les données', 'Standard très répandu', 'Le moteur de la base optimise les requêtes'],
          cons: ['Limité aux requêtes', 'Pas d\'algorithmes de ML dans le standard', 'Logique procédurale limitée']
        },
        {
          language: 'Julia',
          icon: '⚡',
          pros: ['Performance native', 'Syntaxe mathématique', 'Parallélisme intégré'],
          cons: ['Écosystème plus petit', 'Courbe d\'apprentissage', 'Moins de ressources']
        }
      ],
      'Visualisation': [
        {
          language: 'Python',
          icon: '🐍',
          pros: ['Matplotlib et seaborn', 'Plotly interactif', 'Intégration web'],
          cons: ['Configuration verbeuse', 'Syntaxe parfois lourde']
        },
        {
          language: 'R',
          icon: '📊',
          pros: ['ggplot2 et sa grammaire des graphiques', 'Graphiques prêts pour la publication'],
          cons: ['Courbe d\'apprentissage ggplot', 'Performance sur gros datasets']
        },
        {
          language: 'SQL',
          icon: '🗃️',
          pros: ['Agrégations efficaces', 'Données préparées près de la source'],
          cons: ['Pas de visualisation native', 'Dépendant d\'outils externes']
        },
        {
          language: 'Julia',
          icon: '⚡',
          pros: ['Plots.jl unifié', 'Performance', 'Backends multiples'],
          cons: ['Écosystème en développement', 'Moins d\'exemples']
        }
      ],
      'Machine Learning': [
        {
          language: 'Python',
          icon: '🐍',
          pros: ['Scikit-learn', 'TensorFlow/PyTorch', 'Écosystème riche'],
          cons: ['Performance pure', 'Complexité des dépendances']
        },
        {
          language: 'R',
          icon: '📊',
          pros: ['Packages statistiques', 'caret et tidymodels', 'Validation croisée'],
          cons: ['Performance limitée', 'Deep learning moins développé']
        },
        {
          language: 'SQL',
          icon: '🗃️',
          pros: ['Variables dérivées (feature engineering)', 'Données à grande échelle'],
          cons: ['Pas d\'algorithmes de ML dans le standard (quelques SGBD en ajoutent)', 'Surtout utile pour préparer les données']
        },
        {
          language: 'Julia',
          icon: '⚡',
          pros: ['MLJ.jl moderne', 'Performance native', 'Calcul scientifique'],
          cons: ['Écosystème plus petit', 'Moins de modèles pré-entraînés']
        }
      ],
      'Base de Données': [
        {
          language: 'Python',
          icon: '🐍',
          pros: ['SQLAlchemy (ORM)', 'Intégration avec pandas', 'Nombreux connecteurs'],
          cons: ['Overhead ORM', 'Performance sur gros volumes']
        },
        {
          language: 'R',
          icon: '📊',
          pros: ['DBI standard', 'dbplyr pour dplyr', 'Intégration tidyverse'],
          cons: ['Performance limitée', 'Gestion mémoire']
        },
        {
          language: 'SQL',
          icon: '🗃️',
          pros: ['Langage natif de la base', 'Le traitement se fait là où sont les données', 'Fonctions avancées (fenêtres, CTE)'],
          cons: ['Variations entre SGBD (portabilité limitée)', 'Logique métier complexe']
        },
        {
          language: 'Julia',
          icon: '⚡',
          pros: ['Paquets SQLite.jl, LibPQ.jl (PostgreSQL) et MySQL.jl', 'Résultats lisibles en DataFrame'],
          cons: ['Moins de connecteurs que Python', 'Écosystème en développement']
        }
      ]
    };
    return comparisons[topic] || [];
  }, []);

  // Helper function to get best practices
  const getBestPractices = useCallback((topic: string): string[] => {
    const practices: Record<string, string[]> = {
      'Analyse de Données': [
        'Toujours explorer les données avant l\'analyse (shape, types, valeurs manquantes)',
        'Utiliser des noms de variables explicites et cohérents',
        'Documenter les transformations et hypothèses',
        'Valider les résultats avec des méthodes alternatives',
        'Sauvegarder les données intermédiaires importantes'
      ],
      'Visualisation': [
        'Choisir le type de graphique adapté au message',
        'Utiliser des couleurs accessibles et cohérentes',
        'Ajouter des titres et légendes explicites',
        'Éviter la surcharge d\'informations (principe KISS)',
        'Tester la lisibilité sur différents supports'
      ],
      'Machine Learning': [
        'Diviser les données (train/validation/test) avant toute analyse',
        'Standardiser les variables numériques quand le modèle le demande (régression, k plus proches voisins, SVM), en ajustant la transformation sur l\'entraînement seulement',
        'Gérer les valeurs manquantes de manière cohérente',
        'Utiliser la validation croisée pour évaluer les modèles',
        'Surveiller l\'overfitting avec des métriques appropriées'
      ],
      'Base de Données': [
        'Utiliser des index sur les colonnes de jointure et filtrage',
        'Éviter SELECT * en production',
        'Choisir la forme la plus lisible (jointure ou sous-requête) : les optimiseurs les réécrivent souvent l\'une en l\'autre, EXPLAIN le confirme',
        'Utiliser EXPLAIN pour analyser les plans d\'exécution',
        'Limiter les résultats avec LIMIT/TOP pour les tests'
      ]
    };
    return practices[topic] || [];
  }, []);

  return (
    <section id="language-comparison" className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Comparer les langages : lequel choisir ?</h2>

      <CourseHighlight title="Quatre langages, quatre rôles" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2">
              <strong>Python :</strong> généraliste et lisible, très présent en analyse de données et en machine learning.
              Un bon premier langage pour débuter.
            </p>
            <p className="mb-2">
              <strong>R :</strong> conçu pour les statistiques et la visualisation, répandu dans la recherche
              et la biostatistique.
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong>SQL :</strong> langage d'interrogation des bases de données relationnelles. Presque toute chaîne
              de traitement de données le rencontre à un moment.
            </p>
            <p>
              <strong>Julia :</strong> conçu pour le calcul scientifique rapide. Sa communauté et son écosystème
              sont plus petits que ceux de Python ou de R.
            </p>
          </div>
        </div>
      </CourseHighlight>

      <div className="my-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Comment lire les notes de cette page.</strong> Les notes (de 0 à 10 ou de 0 à 100) sont des appréciations de l'auteur,
        destinées à situer les langages les uns par rapport aux autres : elles ne sont pas mesurées. Les seuls chiffres issus
        d'enquêtes sont indiqués avec leur source : l'usage fréquent chez les praticiens de la data (Anaconda, State of Data Science 2021,
        3 104 réponses) et l'usage chez les développeurs (Stack Overflow, 2021 à 2025).
      </div>
      <SourceNote
        className="-mt-3 mb-6"
        consulted="1er octobre 2026"
        sources={[
          {
            label: "Anaconda, State of Data Science 2021 (usage « souvent » ou « toujours »)",
            href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-2021-SODS-Report-Final.pdf",
          },
        ]}
      />

      <Tabs value={selectedComparison} onValueChange={setSelectedComparison} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">📊 Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="code-comparison">💻 Comparaison code</TabsTrigger>
          <TabsTrigger value="use-cases">🎯 Cas d'usage</TabsTrigger>
          <TabsTrigger value="decision-guide">🧭 Guide de choix</TabsTrigger>
          <TabsTrigger value="advanced-examples">🚀 Exemples avancés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Market Trends Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                📈 Usage des langages, de 2021 à 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <DeferredResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 70]} unit=" %" />
                    <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString('fr-FR')} %`, name]} />
                    <Line type="monotone" dataKey="Python" stroke="#3776ab" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="SQL" stroke="#f29111" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="R" stroke="#276dc3" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Julia" stroke="#9558b2" strokeWidth={3} dot={{ r: 6 }} />
                    <Legend />
                  </LineChart>
                </DeferredResponsiveContainer>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Part des répondants de l'enquête Stack Overflow qui déclarent utiliser le langage. L'échantillon réunit tous les développeurs,
                pas seulement les data scientists : R et Julia y sont donc bien moins présents que chez les praticiens de la data. Julia ne
                figure pas dans la liste de 2025.
              </p>
              <SourceNote
                consulted="1er octobre 2026"
                sources={[
                  { label: "Stack Overflow Developer Survey 2021", href: "https://survey.stackoverflow.co/2021/" },
                  { label: "2022", href: "https://survey.stackoverflow.co/2022/" },
                  { label: "2023", href: "https://survey.stackoverflow.co/2023/" },
                  { label: "2024", href: "https://survey.stackoverflow.co/2024/technology" },
                  { label: "2025", href: "https://survey.stackoverflow.co/2025/technology" },
                ]}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  📊 Usage mesuré et appréciations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value, name) => [`${value} sur 100`, name]} />
                      <Bar dataKey="popularity" name="Usage fréquent (mesuré)" fill="#3B82F6" />
                      <Bar dataKey="ecosystem" name="Écosystème (appréciation)" fill="#10B981" />
                      <Bar dataKey="jobMarket" name="Emploi (appréciation)" fill="#F59E0B" />
                    </BarChart>
                  </DeferredResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  🎯 Profils radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <RadarChart data={languageData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={0} domain={[0, 100]} tick={false} />
                      <Radar name="Usage fréquent (mesuré)" dataKey="popularity" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                      <Radar name="Facilité (appréciation)" dataKey="learningCurve" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                      <Radar name="Performance (appréciation)" dataKey="performance" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                      <Radar name="Emploi (appréciation)" dataKey="jobMarket" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                      <Legend />
                    </RadarChart>
                  </DeferredResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Language Cards with Enhanced Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {languageData.map((lang, index) => (
              <Card 
                key={lang.name} 
                className={`border-l-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  selectedLanguage?.name === lang.name ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${animationStep === index ? 'animate-pulse' : ''}`}
                style={{ borderLeftColor: lang.color }}
                onClick={() => handleLanguageSelect(lang)}
              >
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.icon}</span>
                      <div>
                        <div className="font-bold">{lang.name}</div>
                        <div className="text-xs text-gray-500">{lang.category}</div>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: lang.color, color: readableTextColor(lang.color) }} title="Part des praticiens qui l'utilisent souvent ou toujours (Anaconda 2021)">
                      {lang.popularity} % d'usage fréquent
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Progress Bars for Metrics */}
                    <p className="text-[11px] text-gray-500">Appréciations de l'auteur sur 100, non mesurées :</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Facilité d'apprentissage</span>
                        <span className="font-semibold">{lang.learningCurve}%</span>
                      </div>
                      <Progress value={lang.learningCurve} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Marché de l'emploi</span>
                        <span className="font-semibold">{lang.jobMarket}%</span>
                      </div>
                      <Progress value={lang.jobMarket} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Performance</span>
                        <span className="font-semibold">{lang.performance}%</span>
                      </div>
                      <Progress value={lang.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Écosystème</span>
                        <span className="font-semibold">{lang.ecosystem}%</span>
                      </div>
                      <Progress value={lang.ecosystem} className="h-2" />
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Temps d'apprentissage (estimation de l'auteur) :</span>
                        <span className="font-medium">{lang.timeToLearn}</span>
                      </div>
                      <div className="text-xs mt-1 text-center">
                        <span className="text-gray-600">{lang.marketTrend}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Language Information Panel */}
          {selectedLanguage && (
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedLanguage.icon}</span>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: selectedLanguage.color }}>
                      {selectedLanguage.name} : analyse détaillée
                    </div>
                    <div className="text-sm text-gray-600">
                      Créé en {selectedLanguage.yearCreated} par {selectedLanguage.creator}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedLanguage(null)}
                    className="ml-auto"
                  >
                    ✕ Fermer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Paradigms */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Paradigmes de programmation
                    </h4>
                    <div className="space-y-1">
                      {selectedLanguage.paradigms.map((paradigm, idx) => (
                        <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                          {paradigm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                      <Award className="h-4 w-4" />
                      Points forts
                    </h4>
                    <ul className="text-sm space-y-1">
                      {selectedLanguage.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-700">
                      <Lightbulb className="h-4 w-4" />
                      Points d'attention
                    </h4>
                    <ul className="text-sm space-y-1">
                      {selectedLanguage.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-red-500">⚠</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Use Cases */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Cas d'usage principaux
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedLanguage.useCases.map((useCase, idx) => (
                        <Badge 
                          key={idx} 
                          style={{ backgroundColor: selectedLanguage.color, color: readableTextColor(selectedLanguage.color) }}
                          className="justify-center py-2"
                        >
                          {useCase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="code-comparison" className="space-y-6">
          {/* Enhanced Code Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                💻 Comparaison de code, thème par thème
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Analyse de Données', 'Visualisation', 'Machine Learning', 'Base de Données'].map((topic) => (
                  <Button 
                    key={topic}
                    variant={selectedCodeTopic === topic ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSelectedCodeTopic(topic as TopicKey)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Examples */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Exemples de code : {selectedCodeTopic}</h4>
                  
                  {/* Python Example */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🐍</span>
                      <span className="font-semibold text-blue-800">Python</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Polyvalent
                      </Badge>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      <code>{getCodeExample('Python', selectedCodeTopic)}</code>
                    </pre>
                  </div>

                  {/* R Example */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">📊</span>
                      <span className="font-semibold text-purple-800">R</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Statistiques
                      </Badge>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      <code>{getCodeExample('R', selectedCodeTopic)}</code>
                    </pre>
                  </div>

                  {/* SQL Example */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🗃️</span>
                      <span className="font-semibold text-orange-800">SQL</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Données
                      </Badge>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      <code>{getCodeExample('SQL', selectedCodeTopic)}</code>
                    </pre>
                  </div>

                  {/* Julia Example */}
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">⚡</span>
                      <span className="font-semibold text-violet-800">Julia</span>
                      <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                        Performance
                      </Badge>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      <code>{getCodeExample('Julia', selectedCodeTopic)}</code>
                    </pre>
                  </div>
                </div>

                {/* Comparison Analysis */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Analyse comparative</h4>
                  
                  {/* Performance Metrics */}
                  <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Appréciations comparatives (de 0 à 10)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { lang: 'Python', speed: 7, readability: 9, ecosystem: 10, learning: 9 },
                          { lang: 'R', speed: 6, readability: 7, ecosystem: 8, learning: 7 },
                          { lang: 'SQL', speed: 9, readability: 8, ecosystem: 6, learning: 8 },
                          { lang: 'Julia', speed: 10, readability: 6, ecosystem: 5, learning: 6 }
                        ].map((metrics) => (
                          <div key={metrics.lang} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold w-16">{metrics.lang}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span>Vitesse:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={metrics.speed * 10} className="w-12 h-1" />
                                  <span>{metrics.speed}/10</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Lisibilité:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={metrics.readability * 10} className="w-12 h-1" />
                                  <span>{metrics.readability}/10</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Écosystème:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={metrics.ecosystem * 10} className="w-12 h-1" />
                                  <span>{metrics.ecosystem}/10</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Apprentissage:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={metrics.learning * 10} className="w-12 h-1" />
                                  <span>{metrics.learning}/10</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pros and Cons */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Avantages & Inconvénients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getLanguageComparison(selectedCodeTopic).map((comparison, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{comparison.icon}</span>
                              <span className="font-semibold">{comparison.language}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <div className="text-green-700 font-semibold mb-1">✅ Avantages:</div>
                                <ul className="list-disc list-inside space-y-1 text-green-600">
                                  {comparison.pros.map((pro, proIdx) => (
                                    <li key={proIdx}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-red-700 font-semibold mb-1">❌ Inconvénients:</div>
                                <ul className="list-disc list-inside space-y-1 text-red-600">
                                  {comparison.cons.map((con, conIdx) => (
                                    <li key={conIdx}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Practices */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        💡 Bonnes Pratiques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {getBestPractices(selectedCodeTopic).map((practice, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{practice}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced-examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                ⚡ Exemples avancés : pipeline de machine learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeComparison 
                  title="Machine learning : classification avec une forêt aléatoire"
                  pythonCode={`# Python : chargement, nettoyage, découpage, modèle, évaluation
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pandas as pd

# Chargement et nettoyage (suppression des lignes incomplètes)
df = pd.read_csv('data.csv').dropna()

# Découpage entraînement / test
X_train, X_test, y_train, y_test = train_test_split(
    df.drop(columns='target'), df['target'], test_size=0.2, random_state=42
)

# Modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Prédictions et évaluation
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))`}
                  rCode={`# R : les mêmes étapes
library(randomForest)
library(caret)  # fournit confusionMatrix()

# Chargement et nettoyage
df <- na.omit(read.csv("data.csv"))
df$target <- as.factor(df$target)  # classification : la cible doit être un facteur

# Découpage entraînement / test
set.seed(42)
sample_idx <- sample(nrow(df), 0.8 * nrow(df))
train <- df[sample_idx, ]
test <- df[-sample_idx, ]

# Modèle Random Forest
model <- randomForest(
  target ~ .,
  data = train,
  ntree = 100
)

# Prédictions et évaluation
predictions <- predict(model, test)
confusionMatrix(predictions, test$target)`}
                  sqlCode={`-- SQL : préparation des variables avec des CTE et des fonctions de fenêtre (le SQL prépare les données, il n'entraîne pas de modèle)
WITH data_preparation AS (
  SELECT
    *,
    -- Variable dérivée
    CASE
      WHEN age < 30 THEN 'young'
      WHEN age < 50 THEN 'middle'
      ELSE 'senior'
    END as age_group,

    -- Standardisation (moyenne et écart-type calculés sur toute la table, jeu de test compris :
    -- en vrai projet, on les calculerait sur l'entraînement seulement)
    (salary - AVG(salary) OVER()) / STDDEV(salary) OVER() as salary_normalized,
    
    -- Fenêtrage pour features temporelles
    LAG(performance, 1) OVER (PARTITION BY employee_id ORDER BY date) as prev_performance
  FROM employees
  WHERE salary IS NOT NULL
),

feature_matrix AS (
  SELECT 
    employee_id,
    age_group,
    salary_normalized,
    prev_performance,
    target,
    -- Split train/test déterministe (HASH() : Snowflake, Spark SQL ; hashtext() sous PostgreSQL, FARM_FINGERPRINT() sous BigQuery)
    CASE WHEN MOD(ABS(HASH(employee_id)), 10) < 8 
         THEN 'train' 
         ELSE 'test' 
    END as dataset_split
  FROM data_preparation
)

-- Statistiques pour validation
SELECT 
  dataset_split,
  COUNT(*) as count,
  AVG(CASE WHEN target = 1 THEN 1.0 ELSE 0.0 END) as target_rate
FROM feature_matrix
GROUP BY dataset_split;`}
                />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600" />
                🚀 Autres exemples, langage par langage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Python Advanced Examples */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-blue-700 mb-4">🐍 Python : pipeline et validation croisée</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`# Pipeline scikit-learn avec validation croisée
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd

# Un Pipeline enchaîne les étapes et les réajuste à chaque pli de la validation croisée
# (la standardisation est inutile pour une forêt aléatoire : elle sert ici à montrer le principe)
ml_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Validation croisée à 5 plis (X_train et y_train : voir l'exemple précédent)
scores = cross_val_score(ml_pipeline, X_train, y_train,
                        cv=5, scoring='accuracy')
print(f"Exactitude moyenne: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")`}</pre>
                </div>
              </div>

              {/* R Advanced Examples */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-purple-700 mb-4">📊 R : un modèle mixte avec lme4</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`# Modèle mixte avec effets aléatoires
library(lme4)
library(ggplot2)
library(dplyr)

# Modèle hiérarchique pour données longitudinales
model <- lmer(response ~ time * treatment + (1|subject), 
              data = longitudinal_data)

# Visualisation des effets
longitudinal_data %>%
  ggplot(aes(x = time, y = response, color = treatment)) +
  geom_smooth(method = "lm", se = TRUE) +
  facet_wrap(~subject) +
  theme_minimal() +
  labs(title = "Évolution par sujet et traitement")`}</pre>
                </div>
              </div>

              {/* SQL Advanced Examples */}
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-green-700 mb-4">🗄️ SQL : une analyse de cohortes</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`-- Analyse de cohorte avec fonctions de fenêtre (syntaxe PostgreSQL : DATE_TRUNC, AGE)
WITH user_cohorts AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', first_purchase_date) as cohort_month,
    DATE_TRUNC('month', purchase_date) as purchase_month
  FROM purchases p
  JOIN users u ON p.user_id = u.id
),
cohort_data AS (
  SELECT 
    cohort_month,
    purchase_month,
    COUNT(DISTINCT user_id) as users,
    EXTRACT(YEAR FROM AGE(purchase_month, cohort_month)) * 12
      + EXTRACT(MONTH FROM AGE(purchase_month, cohort_month)) as period_number
  FROM user_cohorts
  GROUP BY cohort_month, purchase_month
)
SELECT 
  cohort_month,
  period_number,
  users,
  ROUND(100.0 * users / FIRST_VALUE(users) OVER (
    PARTITION BY cohort_month ORDER BY period_number
  ), 2) as retention_rate
FROM cohort_data
ORDER BY cohort_month, period_number;`}</pre>
                </div>
              </div>

              {/* JavaScript Advanced Examples */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <h4 className="font-semibold text-yellow-700 mb-4">⚡ JavaScript : squelette d'un tableau de bord interactif</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`// Squelette avec D3.js et RxJS (chargés par des balises script) ;
// applyFilters() et updateCharts() restent à écrire
class DataDashboard {
  constructor(containerId) {
    this.container = d3.select(containerId);
    this.data$ = new rxjs.BehaviorSubject([]);
    this.filters$ = new rxjs.BehaviorSubject({});
    
    // Pipeline réactif pour les données
    this.filteredData$ = rxjs.combineLatest([
      this.data$, this.filters$
    ]).pipe(
      rxjs.operators.map(([data, filters]) => 
        this.applyFilters(data, filters)
      ),
      rxjs.operators.debounceTime(300)
    );
    
    this.setupVisualization();
  }
  
  async loadData(url) {
    const data = await d3.json(url);
    this.data$.next(data);
  }
  
  setupVisualization() {
    this.filteredData$.subscribe(data => {
      this.updateCharts(data);
    });
  }
}`}</pre>
                </div>
              </div>

              {/* Performance */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">⚡ Et les performances ?</h4>
                <p className="text-sm text-gray-700">
                  Les temps d&apos;exécution dépendent de la taille des données, du matériel, de l&apos;implémentation et des bibliothèques utilisées :
                  aucun classement général n&apos;a de sens. Mesurez vos propres cas (par exemple avec <code>timeit</code> en Python) avant de choisir.
                </p>
              </div>

              {/* Best Practices */}
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-3">💡 Bonnes pratiques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">🔧 Optimisation</h5>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Vectorisation des opérations</li>
                      <li>• Mise en cache des résultats coûteux</li>
                      <li>• Parallélisation des tâches</li>
                      <li>• Profilage avant d'optimiser</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">🛡️ Robustesse</h5>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Gestion des erreurs</li>
                      <li>• Tests unitaires et d'intégration</li>
                      <li>• Validation des données</li>
                      <li>• Documentation du code</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-6">
          {/* Enhanced Use Cases Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                🎯 Appréciations par cas d'usage (de 0 à 10, avis de l'auteur)
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={showAdvanced ? "default" : "outline"} 
                  size="sm" 
                  onClick={toggleAdvancedView}
                >
                  {showAdvanced ? "Vue Simple" : "Vue Avancée"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <DeferredResponsiveContainer width="100%" height="100%">
                  <BarChart data={useCaseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="useCase" type="category" width={140} />
                    <Tooltip 
                      formatter={(value, name) => [`${value}/10`, name]}
                      labelFormatter={(label) => {
                        const useCase = useCaseData.find(item => item.useCase === label);
                        return `${useCase?.icon} ${label}`;
                      }}
                    />
                    <Bar dataKey="Python" fill="#3776ab" name="Python 🐍" />
                    <Bar dataKey="R" fill="#276dc3" name="R 📊" />
                    <Bar dataKey="SQL" fill="#f29111" name="SQL 🗃️" />
                    <Bar dataKey="Julia" fill="#9558b2" name="Julia ⚡" />
                    <Legend />
                  </BarChart>
                </DeferredResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Use Case Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCaseData.map((useCase, index) => {
              const scores = [useCase.Python, useCase.R, useCase.SQL, useCase.Julia];
              const maxScore = Math.max(...scores);
              const bestLanguages = [
                { name: 'Python', score: useCase.Python, color: '#3776ab', icon: '🐍' },
                { name: 'R', score: useCase.R, color: '#276dc3', icon: '📊' },
                { name: 'SQL', score: useCase.SQL, color: '#f29111', icon: '🗃️' },
                { name: 'Julia', score: useCase.Julia, color: '#9558b2', icon: '⚡' }
              ].filter(lang => lang.score === maxScore);

              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{useCase.icon}</span>
                      {useCase.useCase}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Best Language(s) Recommendation */}
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-sm font-semibold text-green-800 mb-2">
                          🏆 Mieux noté (avis de l'auteur) :
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bestLanguages.map((lang, idx) => (
                            <Badge 
                              key={idx}
                              style={{ backgroundColor: lang.color, color: readableTextColor(lang.color) }}
                              className="text-xs"
                            >
                              {lang.icon} {lang.name} ({lang.score}/10)
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Scores */}
                      <div className="space-y-2">
                        {[
                          { name: 'Python', score: useCase.Python, color: '#3776ab', icon: '🐍' },
                          { name: 'R', score: useCase.R, color: '#276dc3', icon: '📊' },
                          { name: 'SQL', score: useCase.SQL, color: '#f29111', icon: '🗃️' },
                          { name: 'Julia', score: useCase.Julia, color: '#9558b2', icon: '⚡' }
                        ].map((lang, langIdx) => (
                          <div key={langIdx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span>{lang.icon}</span>
                              <span>{lang.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={lang.score * 10} 
                                className="w-16 h-2" 
                              />
                              <span className="text-sm font-semibold w-8">{lang.score}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showAdvanced && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  📊 Analyse avancée des appréciations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Area Chart for Use Case Trends */}
                  <div>
                    <h4 className="font-semibold mb-3">Appréciations de l'auteur par domaine (sur 10)</h4>
                    <div className="h-64">
                      <DeferredResponsiveContainer width="100%" height="100%">
                        <AreaChart data={useCaseData.slice(0, 6)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="useCase" angle={-45} textAnchor="end" height={80} />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Python" stroke="#3776ab" fill="#3776ab" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="R" stroke="#276dc3" fill="#276dc3" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="SQL" stroke="#f29111" fill="#f29111" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="Julia" stroke="#9558b2" fill="#9558b2" fillOpacity={0.6} />
                        </AreaChart>
                      </DeferredResponsiveContainer>
                    </div>
                  </div>

                  {/* Statistics Summary */}
                  <div>
                    <h4 className="font-semibold mb-3">Synthèse des appréciations ci-contre</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Python', color: '#3776ab', icon: '🐍' },
                        { name: 'R', color: '#276dc3', icon: '📊' },
                        { name: 'SQL', color: '#f29111', icon: '🗃️' },
                        { name: 'Julia', color: '#9558b2', icon: '⚡' }
                      ].map((lang) => {
                        const scores = useCaseData.map(useCase => Number(useCase[lang.name]));
                        const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
                        const maxScore = Math.max(...scores);
                        const minScore = Math.min(...scores);
                        const dominantCases = useCaseData.filter(useCase => 
                          useCase[lang.name] === Math.max(useCase.Python, useCase.R, useCase.SQL, useCase.Julia)
                        ).length;

                        return (
                          <div key={lang.name} className="bg-white p-3 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{lang.icon}</span>
                              <span className="font-semibold" style={{ color: lang.color }}>{lang.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Score moyen: <span className="font-semibold">{avgScore}/10</span></div>
                              <div>Domaines où le mieux noté: <span className="font-semibold">{dominantCases}</span></div>
                              <div>Score max: <span className="font-semibold">{maxScore}/10</span></div>
                              <div>Score min: <span className="font-semibold">{minScore}/10</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decision-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🧭 Guide de choix</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="Trois questions pour s'orienter (repères de l'auteur)" type="question">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">1. Quel est votre niveau en programmation ?</h5>
                    <div className="text-sm space-y-1">
                      <p>• <strong>Débutant complet :</strong> Python 🐍</p>
                      <p>• <strong>Quelques bases :</strong> Python ou R selon votre domaine 📊</p>
                      <p>• <strong>Expérimenté :</strong> un deuxième langage selon le besoin (Julia pour le calcul intensif, par exemple) ⚡</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">2. Dans quel secteur travaillez-vous ?</h5>
                    <div className="text-sm space-y-1">
                      <p>• <strong>Tech et start-up :</strong> Python + SQL 🚀</p>
                      <p>• <strong>Recherche académique :</strong> R ou Python, plus SQL 🎓</p>
                      <p>• <strong>Finance et banque :</strong> Python + SQL, parfois R 💰</p>
                      <p>• <strong>Sciences et ingénierie :</strong> Python, et Julia pour le calcul scientifique intensif 🔬</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">3. Quel type de projets vous intéresse ?</h5>
                    <div className="text-sm space-y-1">
                      <p>• <strong>Applications web :</strong> Python (avec un framework comme Django ou Flask) 🌐</p>
                      <p>• <strong>Analyses statistiques :</strong> R 📈</p>
                      <p>• <strong>Machine learning :</strong> Python 🤖</p>
                      <p>• <strong>Données volumineuses :</strong> SQL + Python 🗄️</p>
                      <p>• <strong>Calcul scientifique :</strong> Julia ou Python (NumPy, SciPy) ⚡</p>
                    </div>
                  </div>
                </div>
              </CourseHighlight>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">🛤️ Deux parcours d'apprentissage possibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-blue-700">🎯 Parcours Débutant (6 mois, indicatif)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Mois 1-2</Badge>
                          <span>Python basics + pandas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Mois 3-4</Badge>
                          <span>SQL + matplotlib/seaborn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Mois 5-6</Badge>
                          <span>scikit-learn + projet complet</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-purple-700">🚀 Parcours Avancé (3 mois, indicatif)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800">Mois 1</Badge>
                          <span>Spécialisation (R pour stats, Julia pour perf)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800">Mois 2</Badge>
                          <span>Frameworks avancés + optimisation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800">Mois 3</Badge>
                          <span>Déploiement + bonnes pratiques</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-3">💡 Un conseil</h4>
                <p className="text-sm mb-3">
                  <strong>Il n'existe pas de langage parfait.</strong>{" "}
                  Commencez par un langage, prenez-le bien en main, puis ajoutez les autres selon vos besoins.
                </p>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="text-xs">
                    <strong>Repère indicatif (avis de l'auteur) :</strong> la plus grande part de votre temps ira à un langage principal,
                    le reste aux langages complémentaires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default LanguageComparison;
