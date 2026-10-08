import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import CourseHighlight from '@/components/courses/CourseHighlight';
import RunnableCode from '@/components/courses/lessons/RunnableCode';
import {
  HOPITAL_INDICATEURS,
  HOPITAL_INDICATEURS_PREAMBULE,
  HOPITAL_MESURER,
  HOPITAL_NETTOYER,
  HOPITAL_NETTOYER_PREAMBULE,
} from '@/data/data-quality-demos';
import { typedDataPreparationDefinitions as dataPreparationEnhancedDefinitions } from '@/data/data-preparation-enhanced-definitions';
import { 
  ChefHat, 
  Search, 
  Shield, 
  Clock, 
  CheckCircle, 
  Target,
  Code,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Database,
  Eye,
  TrendingUp,
  Users,
  Heart,
  Activity
} from 'lucide-react';

/**
 * Enhanced Data Quality Section Component
 * 
 * This component provides a comprehensive guide to data quality with:
 * - Pedagogical analogies (chef, detective)
 * - 6 detailed data quality dimensions
 * - Advanced cleaning techniques with pros/cons
 * - Complete practical case study (hospital patient data)
 * - SMART framework for data collection
 * - Automated audit tools
 * - Quality metrics and KPIs
 */
const EnhancedDataQualitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analogies');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  // Pedagogical analogies
  const analogies = [
    {
      title: "Le Chef Cuisinier",
      icon: <ChefHat className="h-8 w-8 text-orange-500" />,
      description: "Comme un chef étoilé, le data scientist doit sélectionner les meilleurs ingrédients (données) pour créer un plat exceptionnel (analyse).",
      parallels: [
        { cooking: "Sélection des ingrédients frais", data: "Collecte de données récentes et fiables" },
        { cooking: "Nettoyage et préparation", data: "Suppression des valeurs aberrantes et manquantes" },
        { cooking: "Assaisonnement équilibré", data: "Normalisation et standardisation" },
        { cooking: "Présentation soignée", data: "Visualisation claire des résultats" },
        { cooking: "Goûter avant de servir", data: "Validation et tests de qualité" }
      ],
      lesson: "Un plat raté avec de mauvais ingrédients = Une analyse faussée avec de mauvaises données"
    },
    {
      title: "Le Détective",
      icon: <Search className="h-8 w-8 text-blue-500" />,
      description: "Tel Sherlock Holmes, le data scientist mène l'enquête pour découvrir la vérité cachée dans les données.",
      parallels: [
        { investigation: "Collecte d'indices", data: "Rassemblement des sources de données" },
        { investigation: "Vérification des témoignages", data: "Validation croisée des informations" },
        { investigation: "Élimination des fausses pistes", data: "Suppression des données erronées" },
        { investigation: "Reconstitution des faits", data: "Reconstruction des données manquantes" },
        { investigation: "Présentation des preuves", data: "Rapport d'analyse avec conclusions" }
      ],
      lesson: "Une enquête bâclée = Des conclusions erronées qui peuvent avoir de lourdes conséquences"
    }
  ];

  // Enhanced 6 dimensions of data quality with ES6 destructuring and arrow functions
  const qualityDimensions = [
    {
      id: 'accuracy',
      name: "Exactitude",
      icon: <Target className="h-6 w-6 text-red-500" />,
      shortDesc: "Les données correspondent-elles à la réalité ?",
      detailedDesc: "L'exactitude mesure à quel point les données reflètent fidèlement la réalité qu'elles sont censées représenter. C'est la dimension la plus critique car des données inexactes conduisent inévitablement à des décisions erronées.",
      examples: [
        "❌ Âge de 150 ans pour un patient",
        "❌ Température corporelle de -10°C",
        "❌ Salaire négatif dans une base RH",
        "✅ Validation par sources externes",
        "✅ Contrôles de cohérence métier"
      ],
      impact: "Résultats d'analyse complètement faussés, décisions dangereuses",
      metrics: ["Taux d'erreur", "Validation croisée", "Audit manuel", "Feedback utilisateurs"],
      techniques: [
        "Validation par règles métier",
        "Comparaison avec sources de référence",
        "Contrôles de vraisemblance",
        "Audit par échantillonnage"
      ],
      color: "red"
    },
    {
      id: 'completeness',
      name: "Complétude",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      shortDesc: "Toutes les données nécessaires sont-elles présentes ?",
      detailedDesc: "La complétude évalue si toutes les données requises pour l'analyse sont disponibles. Des données incomplètes peuvent créer des biais d'échantillonnage et fausser les conclusions.",
      examples: [
        "❌ 30% des dates de naissance manquantes",
        "❌ Codes postaux vides pour l'analyse géographique",
        "❌ Revenus non renseignés pour l'étude socio-économique",
        "✅ Stratégies d'imputation intelligentes",
        "✅ Collecte de données complémentaires"
      ],
      impact: "Biais d'échantillonnage, conclusions non représentatives",
      metrics: ["% valeurs manquantes", "Couverture des champs", "Densité d'information"],
      techniques: [
        "Imputation par moyenne/médiane/mode",
        "Modèles prédictifs pour l'imputation",
        "Collecte de données supplémentaires",
        "Analyse de sensibilité"
      ],
      color: "green"
    },
    {
      id: 'consistency',
      name: "Cohérence",
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      shortDesc: "Les données sont-elles uniformes et logiques ?",
      detailedDesc: "La cohérence garantit que les données suivent des formats, des règles et des conventions uniformes à travers tout le système. L'incohérence rend l'analyse difficile et peut introduire des erreurs.",
      examples: [
        "❌ Dates : 01/02/2023 vs 2023-02-01 vs Feb 1, 2023",
        "❌ Noms : DUPONT vs Dupont vs dupont",
        "❌ Unités : km vs miles vs mètres",
        "✅ Standardisation des formats",
        "✅ Règles de nommage cohérentes"
      ],
      impact: "Erreurs de traitement, difficultés d'analyse, résultats incohérents",
      metrics: ["Violations de règles", "Écarts de format", "Incohérences référentielles"],
      techniques: [
        "Standardisation des formats",
        "Normalisation des valeurs",
        "Règles de validation",
        "Dictionnaires de données"
      ],
      color: "blue"
    },
    {
      id: 'timeliness',
      name: "Fraîcheur",
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      shortDesc: "Les données sont-elles à jour et disponibles en temps voulu ?",
      detailedDesc: "La fraîcheur évalue si les données sont suffisamment récentes pour l'usage prévu et si elles sont disponibles dans les délais requis. Des données obsolètes peuvent conduire à des décisions inadaptées.",
      examples: [
        "❌ Prix produits datant de 6 mois",
        "❌ Données météo de la semaine dernière pour prédiction",
        "❌ Informations client non mises à jour",
        "✅ Flux temps réel pour données critiques",
        "✅ Politiques de rafraîchissement définies"
      ],
      impact: "Décisions basées sur des informations obsolètes, opportunités manquées",
      metrics: ["Âge des données", "Fréquence de mise à jour", "Latence de disponibilité"],
      techniques: [
        "Pipelines de données temps réel",
        "Politiques de rétention",
        "Alertes de fraîcheur",
        "Horodatage systématique"
      ],
      color: "purple"
    },
    {
      id: 'validity',
      name: "Validité",
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      shortDesc: "Les données respectent-elles les contraintes et formats définis ?",
      detailedDesc: "La validité vérifie que les données respectent les règles de format, les contraintes de domaine et les standards définis. Des données invalides peuvent causer des erreurs système et des analyses incorrectes.",
      examples: [
        "❌ Code postal avec 6 chiffres au lieu de 5",
        "❌ Email sans @ ou domaine invalide",
        "❌ Numéro de téléphone avec lettres",
        "✅ Validation par expressions régulières",
        "✅ Contrôles de format automatisés"
      ],
      impact: "Erreurs système, échecs de traitement, analyses impossibles",
      metrics: ["Contraintes violées", "Formats invalides", "Erreurs de validation"],
      techniques: [
        "Expressions régulières",
        "Schémas de validation",
        "Listes de valeurs autorisées",
        "Contrôles de domaine"
      ],
      color: "yellow"
    },
    {
      id: 'uniqueness',
      name: "Unicité",
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      shortDesc: "Chaque entité est-elle représentée une seule fois ?",
      detailedDesc: "L'unicité garantit qu'il n'y a pas de doublons dans les données. Les duplicatas peuvent fausser les statistiques, surestimer les volumes et créer des biais dans les analyses.",
      examples: [
        "❌ Client présent 3 fois avec variantes de nom",
        "❌ Même transaction enregistrée plusieurs fois",
        "❌ Produits dupliqués avec codes différents",
        "✅ Clés primaires uniques",
        "✅ Algorithmes de déduplication"
      ],
      impact: "Surestimation des volumes, biais statistiques, coûts gonflés",
      metrics: ["Taux de doublons", "Clés en double", "Similarité d'entités"],
      techniques: [
        "Algorithmes de déduplication",
        "Fuzzy matching",
        "Record linkage",
        "Clés de hachage"
      ],
      color: "indigo"
    }
  ];

  // SMART Framework for data collection
  const smartFramework = {
    title: "Framework SMART pour la Collecte de Données",
    description: "Adaptez les critères SMART aux projets data pour une collecte efficace",
    criteria: [
      {
        letter: "S",
        word: "Spécifique",
        description: "Définir précisément quelles données collecter",
        questions: ["Quelles variables exactes ?", "Quel niveau de granularité ?", "Quelles dimensions ?"],
        example: "❌ 'Données clients' → ✅ 'Âge, genre, revenus, historique achats des clients actifs'"
      },
      {
        letter: "M",
        word: "Mesurable",
        description: "Établir des métriques de qualité quantifiables",
        questions: ["Comment mesurer la qualité ?", "Quels seuils acceptables ?", "Quels KPIs ?"],
        example: "❌ 'Données de qualité' → ✅ 'Complétude >95%, exactitude >90%, fraîcheur <24h'"
      },
      {
        letter: "A",
        word: "Accessible",
        description: "S'assurer que les données sont disponibles et récupérables",
        questions: ["Sources disponibles ?", "Autorisations nécessaires ?", "Coûts d'accès ?"],
        example: "❌ 'Données confidentielles inaccessibles' → ✅ 'API publique + données internes autorisées'"
      },
      {
        letter: "R",
        word: "Réaliste",
        description: "Fixer des objectifs de collecte atteignables",
        questions: ["Budget suffisant ?", "Délais réalistes ?", "Ressources disponibles ?"],
        example: "❌ '1M de records en 1 jour' → ✅ '100K records/semaine avec équipe actuelle'"
      },
      {
        letter: "T",
        word: "Temporel",
        description: "Définir des échéances claires et une fréquence de mise à jour",
        questions: ["Quand collecter ?", "Quelle fréquence ?", "Date limite ?"],
        example: "❌ 'Bientôt' → ✅ 'Collecte quotidienne à 2h du matin, livraison vendredi 15h'"
      }
    ]
  };

  // Advanced cleaning techniques with pros/cons
  const cleaningTechniques = [
    {
      category: "Données Manquantes",
      techniques: [
        {
          name: "Suppression Listwise",
          description: "Supprimer toutes les lignes avec des valeurs manquantes",
          pros: ["Simple à implémenter", "Pas de biais d'imputation", "Données restantes complètes"],
          cons: ["Perte importante d'information", "Réduction de la taille d'échantillon", "Biais si données non MCAR"],
          when: "< 5% de données manquantes, MCAR confirmé",
          code: "df.dropna()"
        },
        {
          name: "Imputation par Régression",
          description: "Prédire les valeurs manquantes avec un modèle de régression",
          pros: ["Utilise les relations entre variables", "Préserve la variance", "Statistiquement robuste"],
          cons: ["Complexe à implémenter", "Risque de surajustement", "Suppose linéarité"],
          when: "Relations fortes entre variables, MAR",
          code: "from sklearn.linear_model import LinearRegression\nimputer = IterativeImputer(estimator=LinearRegression())"
        },
        {
          name: "Imputation Multiple (MICE)",
          description: "Créer plusieurs jeux de données imputés et combiner les résultats",
          pros: ["Capture l'incertitude", "Statistiquement optimal", "Gère MAR et MNAR"],
          cons: ["Très complexe", "Coûteux en calcul", "Difficile à interpréter"],
          when: "Données critiques, budget temps/calcul suffisant",
          code: "from sklearn.experimental import enable_iterative_imputer\nfrom sklearn.impute import IterativeImputer"
        }
      ]
    },
    {
      category: "Valeurs Aberrantes",
      techniques: [
        {
          name: "Méthode IQR Modifiée",
          description: "IQR avec facteur ajustable selon la distribution",
          pros: ["Adaptable aux données", "Robuste aux distributions", "Paramétrable"],
          cons: ["Nécessite expertise", "Subjectif", "Peut manquer outliers légitimes"],
          when: "Distributions non-normales, expertise disponible",
          code: "factor = 1.5  # Ajustable\noutliers = (df < Q1 - factor*IQR) | (df > Q3 + factor*IQR)"
        },
        {
          name: "Isolation Forest",
          description: "Algorithme ML pour détection d'anomalies multivariées",
          pros: ["Multidimensionnel", "Pas d'hypothèse de distribution", "Efficace sur gros volumes"],
          cons: ["Boîte noire", "Paramètres à ajuster", "Peut être instable"],
          when: "Données multivariées, gros volumes, outliers complexes",
          code: "from sklearn.ensemble import IsolationForest\niso = IsolationForest(contamination=0.1, random_state=42)"
        },
        {
          name: "Winsorisation",
          description: "Remplacer les outliers par les valeurs aux percentiles extrêmes",
          pros: ["Préserve la taille d'échantillon", "Réduit l'impact", "Simple"],
          cons: ["Modifie la distribution", "Perte d'information", "Arbitraire"],
          when: "Outliers dus à erreurs de mesure, analyses robustes requises",
          code: "from scipy.stats.mstats import winsorize\nwinsorized = winsorize(data, limits=[0.05, 0.05])"
        }
      ]
    }
  ];

  return (
    <section id="enhanced-quality" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Database className="h-8 w-8 text-blue-500" />
          Qualité des Données : aller plus loin
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Découvrez comment préparer des données avec soin à travers des analogies,
          des techniques avancées et des cas pratiques concrets.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analogies">Analogies</TabsTrigger>
          <TabsTrigger value="dimensions">6 Dimensions</TabsTrigger>
          <TabsTrigger value="smart">Framework SMART</TabsTrigger>
          <TabsTrigger value="techniques">Techniques Avancées</TabsTrigger>
          <TabsTrigger value="case-study">Cas Pratique</TabsTrigger>
        </TabsList>

        {/* Pedagogical Analogies Tab */}
        <TabsContent value="analogies" className="space-y-8">
          <CourseHighlight type="info" title="Apprendre par l'Analogie">
            <p className="text-muted-foreground">
              Les meilleures leçons viennent souvent de comparaisons avec des domaines familiers. 
              Découvrez la data science à travers les yeux d'un chef cuisinier et d'un détective.
            </p>
          </CourseHighlight>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analogies.map((analogy, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">{analogy.icon}</div>
                  <CardTitle className="text-2xl">{analogy.title}</CardTitle>
                  <p className="text-muted-foreground">{analogy.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Parallèles :</h4>
                    {analogy.parallels.map((parallel, pIndex) => (
                      <div key={pIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium text-orange-600">
                            {analogy.title === "Le Chef Cuisinier" ? "🍳 " : "🔍 "}
                          </span>
                          {"cooking" in parallel ? parallel.cooking : parallel.investigation}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-blue-600">📊 </span>
                          {parallel.data}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Leçon clé :</strong> {analogy.lesson}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 6 Dimensions Tab */}
        <TabsContent value="dimensions" className="space-y-8">
          <CourseHighlight type="example" title="Les 6 Piliers de la Qualité">
            <p className="text-muted-foreground">
              Un framework complet pour évaluer et améliorer la qualité de vos données selon des critères objectifs et mesurables.
            </p>
          </CourseHighlight>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {qualityDimensions.map((dimension) => (
              <Card 
                key={dimension.id} 
                className={`border-l-4 border-l-${dimension.color}-500 hover:shadow-md transition-all duration-300 cursor-pointer`}
                onClick={() => setExpandedDimension(expandedDimension === dimension.id ? null : dimension.id)}
              >
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 text-${dimension.color}-700`}>
                    {dimension.icon}
                    <GlossaryTerm 
                      definition={dataPreparationEnhancedDefinitions[dimension.id === 'accuracy' ? 'exactitude' : dimension.id === 'completeness' ? 'complétude' : dimension.id === 'consistency' ? 'cohérence' : dimension.id === 'timeliness' ? 'fraîcheur' : dimension.id === 'validity' ? 'validité' : 'unicité']}
                      variant="hover"
                      highlightStyle="glow"
                    >
                      {dimension.name}
                    </GlossaryTerm>
                  </CardTitle>
                  <p className="text-muted-foreground">{dimension.shortDesc}</p>
                </CardHeader>
                
                {expandedDimension === dimension.id && (
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Description détaillée :</h5>
                      <p className="text-sm text-muted-foreground">{dimension.detailedDesc}</p>
                    </div>
                    
                    <div className={`bg-${dimension.color}-50 p-4 rounded-lg`}>
                      <h5 className={`font-semibold mb-2 text-${dimension.color}-700`}>Exemples concrets :</h5>
                      <ul className={`text-sm text-${dimension.color}-600 space-y-1`}>
                        {dimension.examples.map((example, eIndex) => (
                          <li key={eIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-red-700 mb-1">Impact si négligé :</h5>
                        <p className="text-sm text-red-600">{dimension.impact}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-700 mb-1">Métriques clés :</h5>
                        <div className="flex flex-wrap gap-1">
                          {dimension.metrics.map((metric, mIndex) => (
                            <Badge key={mIndex} variant="outline" className="text-xs text-green-600">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-blue-700 mb-2">Techniques d'amélioration :</h5>
                      <ul className="text-sm text-blue-600 space-y-1">
                        {dimension.techniques.map((technique, tIndex) => (
                          <li key={tIndex}>• {technique}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SMART Framework Tab */}
        <TabsContent value="smart" className="space-y-8">
          <CourseHighlight type="warning" title="Framework SMART pour la Data">
            <p className="text-muted-foreground">
              Adaptez la méthode SMART aux projets data pour une collecte de données efficace et structurée.
            </p>
          </CourseHighlight>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{smartFramework.title}</CardTitle>
              <p className="text-muted-foreground">{smartFramework.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {smartFramework.criteria.map((criterion, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {criterion.letter}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-blue-700">
                            <GlossaryTerm 
                              definition={dataPreparationEnhancedDefinitions['smartFramework']}
                              variant="hover"
                              highlightStyle="glow"
                            >
                              {criterion.word}
                            </GlossaryTerm>
                          </h3>
                          <p className="text-muted-foreground">{criterion.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-blue-700 mb-2">Questions à se poser :</h5>
                            <ul className="text-sm text-blue-600 space-y-1">
                              {criterion.questions.map((question, qIndex) => (
                                <li key={qIndex}>• {question}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-700 mb-2">Exemple d'application :</h5>
                            <p className="text-sm text-green-600">{criterion.example}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Techniques Tab */}
        <TabsContent value="techniques" className="space-y-8">
          <CourseHighlight type="info" title="Techniques Avancées de Nettoyage">
            <p className="text-muted-foreground">
              Explorez les techniques sophistiquées avec leurs avantages, inconvénients et cas d'usage optimaux.
            </p>
          </CourseHighlight>

          {cleaningTechniques.map((category, catIndex) => (
            <Card key={catIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {category.techniques.map((technique, techIndex) => (
                    <div key={techIndex} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">
                            <GlossaryTerm 
                              definition={dataPreparationEnhancedDefinitions[
                                technique.name.toLowerCase().includes('imputation') ? 'imputation' :
                                technique.name.toLowerCase().includes('iqr') ? 'iqr' :
                                technique.name.toLowerCase().includes('z-score') ? 'zscore' :
                                technique.name.toLowerCase().includes('isolation') ? 'isolationForest' :
                                technique.name.toLowerCase().includes('winsorisation') ? 'winsorisation' :
                                technique.name.toLowerCase().includes('record linkage') ? 'recordLinkage' :
                                technique.name.toLowerCase().includes('fuzzy') ? 'fuzzyMatching' :
                                'outliers'
                              ]!}
                              variant="hover"
                              highlightStyle="underline"
                            >
                              {technique.name}
                            </GlossaryTerm>
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCode(showCode === `${catIndex}-${techIndex}` ? null : `${catIndex}-${techIndex}`)}
                          >
                            <Code className="h-4 w-4 mr-2" />
                            Code
                          </Button>
                        </div>
                        
                        <p className="text-muted-foreground">{technique.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-700 mb-2">✅ Avantages :</h5>
                            <ul className="text-sm text-green-600 space-y-1">
                              {technique.pros.map((pro, pIndex) => (
                                <li key={pIndex}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-red-700 mb-2">❌ Inconvénients :</h5>
                            <ul className="text-sm text-red-600 space-y-1">
                              {technique.cons.map((con, cIndex) => (
                                <li key={cIndex}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-blue-700 mb-2">🎯 Quand utiliser :</h5>
                            <p className="text-sm text-blue-600">{technique.when}</p>
                          </div>
                        </div>
                        
                        {showCode === `${catIndex}-${techIndex}` && (
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                              <code>{technique.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Case Study Tab */}
        <TabsContent value="case-study" className="space-y-8">
          <CourseHighlight type="example" title="Cas pratique complet">
            <p className="text-muted-foreground">
              Suivez pas à pas la préparation d'un petit jeu de données fictif inspiré d'un hôpital, de la mesure des défauts
              jusqu'aux premiers indicateurs. Les séjours sont inventés et fabriqués par le code, dans votre navigateur :
              chaque nombre affiché est calculé par ce code, aucun n'est écrit à la main. Rien ne provient d'un hôpital réel.
            </p>
          </CourseHighlight>

          {/* Complete Hospital Case Study */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Cas pratique fictif : séjours d'un hôpital
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowCaseStudy(!showCaseStudy)}
                >
                  {showCaseStudy ? 'Masquer' : 'Voir'} le cas complet
                </Button>
              </div>
            </CardHeader>

            {showCaseStudy && (
              <CardContent className="space-y-8">
                {/* Context */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Contexte du projet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Situation</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Un hôpital fictif souhaite étudier les réadmissions pour mieux comprendre les parcours de soins.
                        Ses données proviennent de trois systèmes différents, que l'on ne peut pas utiliser telles quelles.
                      </p>
                      <h4 className="font-semibold mb-2">Objectifs du projet complet</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Identifier les facteurs de réadmission</li>
                        <li>• Repérer les patients à risque</li>
                        <li>• Comprendre les durées de séjour</li>
                        <li>• Analyser les coûts par service</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ces analyses viennent après la préparation. Ce cas s'arrête aux premiers indicateurs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sources de données (à titre de contexte)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>SIH</strong> : admissions et sorties</li>
                        <li>• <strong>LAB</strong> : résultats biologiques</li>
                        <li>• <strong>PMSI</strong> : codage médical des séjours</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        Les exemples ci-dessous ne manipulent qu'un petit extrait de type SIH, complété d'un diagnostic et d'un coût.
                      </p>
                      <h4 className="font-semibold mb-2 mt-4">Défauts glissés dans l'extrait</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Plusieurs formats de dates</li>
                        <li>• Doublons dont le nom s'écrit de plusieurs façons</li>
                        <li>• Âges impossibles et valeurs manquantes</li>
                        <li>• Diagnostics écrits avec une casse incohérente</li>
                        <li>• Coûts négatifs, en texte ou absents</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Runnable examples */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      Le cas en trois exemples exécutables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Le code s'exécute dans votre navigateur (Python et pandas), sans rien envoyer nulle part. Les exemples sont modifiables :
                      changez une valeur ou une règle, puis cliquez sur « Exécuter ». La première exécution est plus longue, le temps de charger le moteur.
                    </p>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">1. Fabriquer des données sales, puis mesurer les défauts</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Avant de corriger quoi que ce soit, on compte. Chaque ligne affichée est calculée sur les quatorze lignes inventées du tableau.
                      </p>
                      <RunnableCode
                        language="python"
                        code={HOPITAL_MESURER}
                        label="Exemple 1 du cas hospitalier : fabriquer des séjours inventés et mesurer leurs défauts, modifiable"
                        caption="Trois formats de date, un âge de 150 ans, un coût négatif et un coût en texte. Aucun doublon exact : les deux paires de doublons ne se verront qu'une fois les noms et les diagnostics normalisés."
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">2. Nettoyer étape par étape, puis comparer</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chaque étape est une ligne de code. Le tableau brut et la fonction de lecture des dates viennent de l'exemple précédent
                        (leur code est exécuté avant celui-ci, sans être affiché).
                      </p>
                      <RunnableCode
                        language="python"
                        setup={HOPITAL_NETTOYER_PREAMBULE}
                        code={HOPITAL_NETTOYER}
                        label="Exemple 2 du cas hospitalier : nettoyer les séjours et comparer la complétude avant et après, modifiable"
                        caption="Les quatorze lignes deviennent douze. La complétude de l'âge baisse (de 92,9 % à 83,3 %) : un âge impossible, devenu valeur manquante, rend la colonne moins complète mais plus fiable. Nettoyer n'augmente pas toujours la complétude."
                      />
                      <Alert className="mt-3">
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Pourquoi lire les dates format par format ?</strong> Avec la version de pandas utilisée par ce site, l'appel{" "}
                          <code className="rounded bg-muted px-1 text-xs">pd.to_datetime(..., format="mixed", dayfirst=True)</code>{" "}
                          lit « 2024-03-01 » comme le 3 janvier 2024. Le résultat est faux sans qu'aucune erreur ne soit signalée :
                          seul un contrôle du résultat, comme celui des exemples, permet de s'en apercevoir.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">3. Premiers indicateurs, avec et sans les doublons</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Une réadmission est ici une admission qui survient au plus 30 jours après la sortie précédente du même patient.
                        Les indicateurs sont calculés deux fois : sur le tableau avant la suppression des doublons, puis après.
                      </p>
                      <RunnableCode
                        language="python"
                        setup={HOPITAL_INDICATEURS_PREAMBULE}
                        code={HOPITAL_INDICATEURS}
                        label="Exemple 3 du cas hospitalier : taux de réadmission et durée moyenne de séjour avec et sans doublons, modifiable"
                        caption="Onze séjours seulement sont comptés (celui dont la date d'admission est illisible est écarté) : ces indicateurs montrent un calcul, ils ne sont pas une statistique. On voit en revanche que les doublons changent le résultat : treize séjours au lieu de onze, un taux de 15,4 % au lieu de 18,2 %."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Pipeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Les étapes d'une préparation, et ce que les exemples en font
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          step: "1. Audit initial",
                          description: "Évaluation de la qualité avant toute correction",
                          actions: [
                            "Profilage automatisé (fg-data-profiling, ex pandas-profiling)",
                            "Calcul des 6 dimensions de qualité",
                            "Repérage des motifs d'erreurs",
                            "Estimation de l'effort de nettoyage"
                          ],
                          inExample: "Premier exemple : nombre de lignes, doublons, formats de date, âges hors bornes, coûts invalides et valeurs manquantes.",
                          color: "red"
                        },
                        {
                          step: "2. Déduplication",
                          description: "Identification et fusion des doublons",
                          actions: [
                            "Rapprochement exact sur l'identifiant patient",
                            "Rapprochement approximatif sur nom et prénom, avec un seuil de similarité à choisir",
                            "Validation manuelle des cas ambigus",
                            "Fusion avec priorité aux données les plus récentes"
                          ],
                          inExample: "Deuxième exemple : normalisation des noms et des diagnostics, puis suppression des lignes devenues identiques. Pas de rapprochement approximatif.",
                          color: "orange"
                        },
                        {
                          step: "3. Validation métier",
                          description: "Application des règles de cohérence",
                          actions: [
                            "Âge entre 0 et 120 ans",
                            "Date de sortie postérieure ou égale à la date d'admission",
                            "Codes CIM-10 présents dans le référentiel officiel",
                            "Coûts positifs et dans des fourchettes réalistes"
                          ],
                          inExample: "Deuxième exemple : seules les règles sur l'âge et sur le signe du coût sont codées. Les deux autres ne sont pas vérifiées.",
                          color: "yellow"
                        },
                        {
                          step: "4. Traitement des valeurs manquantes",
                          description: "Décider quoi faire de ce qui manque",
                          actions: [
                            "Âge : régression à partir du diagnostic et du service",
                            "Coûts : médiane par service et durée de séjour",
                            "Codes postaux : géocodage inverse",
                            "Diagnostics secondaires : modèle prédictif"
                          ],
                          inExample: "Pas d'imputation dans les exemples : les valeurs impossibles deviennent manquantes et le restent. Imputer demande de savoir pourquoi elles manquent.",
                          color: "blue"
                        },
                        {
                          step: "5. Enrichissement",
                          description: "Ajout de variables utiles à l'analyse",
                          actions: [
                            "Correspondance entre codes CIM-10 et services hospitaliers",
                            "Calcul de la durée de séjour et du coût par jour",
                            "Géocodage des adresses vers des régions",
                            "Historique du patient vers un score de risque"
                          ],
                          inExample: "Troisième exemple : durée de séjour et délai depuis la sortie précédente. Pas de correspondance avec les services.",
                          color: "green"
                        },
                        {
                          step: "6. Validation finale",
                          description: "Contrôle de la qualité avant usage",
                          actions: [
                            "Tests automatisés (par exemple avec Great Expectations)",
                            "Comparaison avec un échantillon vérifié à la main",
                            "Production d'un rapport de qualité",
                            "Accord des personnes du métier avant usage"
                          ],
                          inExample: "Deuxième exemple : le bilan de complétude avant et après, calculé colonne par colonne.",
                          color: "green"
                        }
                      ].map((phase, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full bg-${phase.color}-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <h4 className="font-semibold text-lg">{phase.step}</h4>
                              <p className="text-muted-foreground">{phase.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={`bg-${phase.color}-50 p-3 rounded-lg`}>
                                <h5 className={`font-semibold text-${phase.color}-700 mb-2`}>Actions typiques :</h5>
                                <ul className={`text-sm text-${phase.color}-600 space-y-1`}>
                                  {phase.actions.map((action, aIndex) => (
                                    <li key={aIndex}>• {action}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h5 className="font-semibold text-gray-700 mb-2">Dans les exemples :</h5>
                                <p className="text-sm text-gray-600">{phase.inExample}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Why no business results, and method points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Pourquoi aucun résultat métier ici
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-blue-600">
                      <p>
                        Ce cas ne donne ni économies, ni retour sur investissement, ni score de modèle, ni nombre de réadmissions évitées.
                        Ces résultats demandent de vraies données, un indicateur défini avec précision et un échantillon assez grand.
                      </p>
                      <p>
                        Calculés sur quelques séjours inventés, ils ne voudraient rien dire : ils auraient seulement l'air sérieux.
                        Le taux de réadmission et la durée moyenne du troisième exemple servent à montrer un calcul, pas à conclure.
                      </p>
                      <p>
                        Ce que le cas montre vraiment : la préparation modifie les indicateurs, comme l'écart entre « avec doublons » et « sans doublons ».
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-700 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Points de méthode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-purple-600 space-y-2">
                        <li>• <strong>Mesurer avant et après</strong> : sans bilan, on ne sait pas ce que le nettoyage a changé</li>
                        <li>• <strong>Expertise métier</strong> : indispensable pour valider les règles (âge plausible, codes valides, délai de réadmission)</li>
                        <li>• <strong>Défaut devenu valeur manquante</strong> : il n'est pas réglé pour autant, il reste à décider quoi en faire</li>
                        <li>• <strong>Automatisation</strong> : utile surtout quand le traitement se répète</li>
                        <li>• <strong>Documentation</strong> : noter chaque règle et chaque seuil pour que quelqu'un d'autre puisse refaire et comprendre</li>
                        <li>• <strong>Remonter à la source</strong> : prévenir les équipes qui saisissent les données, c'est là que les défauts se corrigent le mieux</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default EnhancedDataQualitySection;