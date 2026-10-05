import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import CourseHighlight from '@/components/courses/CourseHighlight';
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
          <CourseHighlight type="example" title="Cas Pratique Complet">
            <p className="text-muted-foreground">
              Suivez pas à pas la transformation complète d'un jeu de données fictif inspiré d'un hôpital, 
              de l'audit initial à l'analyse finale. L'établissement, les données et tous les chiffres de ce cas sont inventés 
              pour illustrer la démarche : ils ne proviennent d'aucun hôpital réel.
            </p>
          </CourseHighlight>

          {/* Complete Hospital Case Study */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Cas pratique fictif : données patients d'un hôpital
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
                    Contexte du Projet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">🏥 Situation :</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Un hôpital fictif souhaite analyser les réadmissions pour réduire les coûts 
                        et améliorer la qualité des soins. Les données proviennent de 3 systèmes différents.
                      </p>
                      <h4 className="font-semibold mb-2">🎯 Objectifs :</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Identifier les facteurs de réadmission</li>
                        <li>• Prédire les patients à risque</li>
                        <li>• Optimiser la durée de séjour</li>
                        <li>• Analyser les coûts par service</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">📊 Sources de données :</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>SIH</strong> : Admissions/sorties (15,000 lignes)</li>
                        <li>• <strong>LAB</strong> : Résultats biologiques (45,000 lignes)</li>
                        <li>• <strong>PMSI</strong> : Codage médical (12,000 lignes)</li>
                      </ul>
                      <h4 className="font-semibold mb-2 mt-4">⚠️ Défis identifiés :</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Formats de dates incohérents</li>
                        <li>• Doublons patients (variantes noms)</li>
                        <li>• 23% de données manquantes</li>
                        <li>• Codes diagnostics obsolètes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Avant Nettoyage - Données Brutes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 p-4 rounded-lg space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-red-200">
                                <th className="text-left p-1">ID</th>
                                <th className="text-left p-1">Nom</th>
                                <th className="text-left p-1">Âge</th>
                                <th className="text-left p-1">Admission</th>
                                <th className="text-left p-1">Diagnostic</th>
                                <th className="text-left p-1">Coût</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["P001", "Jean DUPONT", "45", "01/03/2024", "I21.9", "2500.50"],
                                ["P001", "J. Dupont", "45", "2024-03-01", "i21.9", "NULL"],
                                ["P002", "Marie Martin", "NULL", "03/01/24", "K59.0", "-150"],
                                ["P003", "Paul DURAND", "150", "01-MAR-24", "Z51.1", "abc"],
                                ["P004", "", "67", "", "", "3200"]
                              ].map((row, index) => (
                                <tr key={index} className="border-b border-red-100">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={`p-1 ${
                                      cell === "NULL" || cell === "" || cell === "150" || 
                                      cell === "-150" || cell === "abc" || cell === "i21.9"
                                        ? "text-red-600 font-semibold" : ""
                                    }`}>
                                      {cell || "(vide)"}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-semibold text-red-700">🚨 Problèmes critiques détectés :</h5>
                          <ul className="text-sm text-red-600 space-y-1">
                            <li>• <strong>Doublons</strong> : P001 présent 2 fois (formats différents)</li>
                            <li>• <strong>Âges aberrants</strong> : P003 (150 ans), P002 (manquant)</li>
                            <li>• <strong>Dates incohérentes</strong> : 4 formats différents</li>
                            <li>• <strong>Codes diagnostics</strong> : Casse incohérente</li>
                            <li>• <strong>Coûts invalides</strong> : Négatifs, texte, manquants</li>
                            <li>• <strong>Données manquantes</strong> : 23% des champs vides</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Après Nettoyage - Données Qualité
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-green-50 p-4 rounded-lg space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-green-200">
                                <th className="text-left p-1">ID</th>
                                <th className="text-left p-1">Nom Complet</th>
                                <th className="text-left p-1">Âge</th>
                                <th className="text-left p-1">Admission</th>
                                <th className="text-left p-1">Diagnostic</th>
                                <th className="text-left p-1">Coût €</th>
                                <th className="text-left p-1">Service</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["P001", "Jean Dupont", "45", "2024-03-01", "I21.9", "2500.50", "Cardiologie"],
                                ["P002", "Marie Martin", "52", "2024-03-01", "K59.0", "1850.00", "Gastro"],
                                ["P003", "Paul Durand", "67", "2024-03-01", "Z51.1", "3200.00", "Oncologie"]
                              ].map((row, index) => (
                                <tr key={index} className="border-b border-green-100">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-1 text-green-700">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-semibold text-green-700">✅ Améliorations apportées :</h5>
                          <ul className="text-sm text-green-600 space-y-1">
                            <li>• <strong>Déduplication</strong> : Fusion intelligente des doublons</li>
                            <li>• <strong>Validation âges</strong> : Correction P003, imputation P002</li>
                            <li>• <strong>Standardisation dates</strong> : Format ISO uniforme</li>
                            <li>• <strong>Normalisation codes</strong> : CIM-10 validés</li>
                            <li>• <strong>Enrichissement</strong> : Service ajouté via mapping</li>
                            <li>• <strong>Qualité</strong> : 97% de complétude atteinte</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Pipeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Pipeline de Nettoyage Détaillé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          step: "1. Audit Initial",
                          description: "Évaluation complète de la qualité",
                          actions: [
                            "Profiling automatisé (fg-data-profiling, ex pandas-profiling)",
                            "Calcul des 6 dimensions de qualité",
                            "Identification des patterns d'erreurs",
                            "Estimation de l'effort de nettoyage"
                          ],
                          metrics: "Complétude: 77%, Exactitude: 65%, Cohérence: 45%",
                          color: "red"
                        },
                        {
                          step: "2. Déduplication",
                          description: "Identification et fusion des doublons",
                          actions: [
                            "Matching exact sur ID patient",
                            "Fuzzy matching sur nom/prénom (ratio >90%)",
                            "Validation manuelle des cas ambigus",
                            "Fusion avec priorité aux données les plus récentes"
                          ],
                          metrics: "2,150 doublons détectés, 1,987 fusionnés automatiquement",
                          color: "orange"
                        },
                        {
                          step: "3. Validation Métier",
                          description: "Application des règles de cohérence",
                          actions: [
                            "Âge entre 0 et 120 ans",
                            "Date sortie ≥ date admission",
                            "Codes CIM-10 dans référentiel officiel",
                            "Coûts positifs et dans fourchettes réalistes"
                          ],
                          metrics: "347 violations corrigées, 89 escaladées",
                          color: "yellow"
                        },
                        {
                          step: "4. Imputation Intelligente",
                          description: "Traitement des valeurs manquantes",
                          actions: [
                            "Âge : Régression basée sur diagnostic + service",
                            "Coûts : Médiane par service + durée séjour",
                            "Codes postaux : Géocodage inverse",
                            "Diagnostics secondaires : Modèle prédictif"
                          ],
                          metrics: "3,456 valeurs imputées, précision estimée 87%",
                          color: "blue"
                        },
                        {
                          step: "5. Enrichissement",
                          description: "Ajout de données de valeur",
                          actions: [
                            "Mapping codes CIM-10 → services hospitaliers",
                            "Calcul durée séjour et coût/jour",
                            "Géocodage adresses → régions",
                            "Historique patient → score de risque"
                          ],
                          metrics: "12 nouvelles variables créées, 100% de couverture",
                          color: "green"
                        },
                        {
                          step: "6. Validation Finale",
                          description: "Contrôle qualité et certification",
                          actions: [
                            "Tests automatisés Great Expectations",
                            "Validation croisée avec échantillon manuel",
                            "Génération rapport qualité",
                            "Certification pour usage analytique"
                          ],
                          metrics: "Qualité finale: 97% complétude, 94% exactitude",
                          color: "green"
                        }
                      ].map((phase, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full bg-${phase.color}-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <h4 className="font-semibold text-lg">{phase.step}</h4>
                              <p className="text-muted-foreground">{phase.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={`bg-${phase.color}-50 p-3 rounded-lg`}>
                                <h5 className={`font-semibold text-${phase.color}-700 mb-2`}>Actions réalisées :</h5>
                                <ul className={`text-sm text-${phase.color}-600 space-y-1`}>
                                  {phase.actions.map((action, aIndex) => (
                                    <li key={aIndex}>• {action}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h5 className="font-semibold text-gray-700 mb-2">Résultats (fictifs) :</h5>
                                <p className="text-sm text-gray-600">{phase.metrics}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Results and Impact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Résultats analytiques (fictifs)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-blue-600 space-y-2">
                        <li>• <strong>Taux de réadmission</strong> : 12.3% (valeur fictive)</li>
                        <li>• <strong>Durée séjour moyenne</strong> : 4.2 jours</li>
                        <li>• <strong>Coût moyen</strong> : 2,847€ par séjour</li>
                        <li>• <strong>Prédiction risque</strong> : AUC = 0.84</li>
                        <li>• <strong>Facteurs clés</strong> : Âge, comorbidités, service</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Impact (fictif)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-green-600 space-y-2">
                        <li>• <strong>Économies</strong> : 1.2M€/an (réduction réadmissions)</li>
                        <li>• <strong>Efficacité</strong> : -15% durée séjour évitable</li>
                        <li>• <strong>Qualité soins</strong> : +23% satisfaction patients</li>
                        <li>• <strong>Prévention</strong> : 340 réadmissions évitées</li>
                        <li>• <strong>ROI projet</strong> : 450% sur 2 ans</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-700 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Leçons apprises (cas fictif)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-purple-600 space-y-2">
                        <li>• <strong>Temps investi</strong> : 60% nettoyage, 40% analyse</li>
                        <li>• <strong>Expertise métier</strong> : Cruciale pour validation</li>
                        <li>• <strong>Automatisation</strong> : ROI élevé sur répétabilité</li>
                        <li>• <strong>Documentation</strong> : Essentielle pour maintenance</li>
                        <li>• <strong>Formation équipes</strong> : Clé du succès long terme</li>
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