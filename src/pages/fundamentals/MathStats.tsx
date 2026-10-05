
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { Brain, Calculator, ChartBar, Trophy, Target, TrendingUp, Lightbulb } from "lucide-react";
import MathVisualsSection from "@/components/fundamentals/MathVisualsSection";
import BackToTop from "@/components/ui/back-to-top";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Import des nouveaux composants modulaires
import MathLearningPaths from "@/components/fundamentals/math/MathLearningPaths";
import PracticalApplicationsEnriched from "@/components/fundamentals/math/PracticalApplicationsEnriched";
import MathResourcesTools from "@/components/fundamentals/math/MathResourcesTools";
import UnifiedMathCourses from "@/components/fundamentals/math/UnifiedMathCourses";

const MathStats = () => {

  const fundamentalConcepts = [
    {
      title: "Algèbre Linéaire",
      description: "Fondamental pour la manipulation et transformation des données",
      icon: <Calculator className="h-8 w-8 text-blue-600" />,
      examples: ["Vecteurs & Matrices", "Produit scalaire", "Décomposition SVD/PCA"],
      applications: ["Réduction de dimension", "Réseaux de neurones", "Traitement d'images", "Systèmes de recommandation"]
    },
    {
      title: "Statistiques & Probabilités",
      description: "Cœur de l'analyse prédictive et de la modélisation",
      icon: <ChartBar className="h-8 w-8 text-green-600" />,
      examples: ["Statistiques descriptives", "Distributions", "Inférence statistique", "Théorème de Bayes"],
      applications: ["A/B testing", "Analyse exploratoire", "Validation de modèles", "Tests d'hypothèses"]
    },
    {
      title: "Calcul Différentiel & Optimisation",
      description: "Clé pour l'entraînement et l'optimisation des modèles",
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      examples: ["Dérivées partielles", "Gradients", "Optimisation contrainte", "Algorithmes SGD"],
      applications: ["Régression", "Deep learning", "Réglage hyperparamètres", "Minimisation coût"]
    },
    {
      title: "Mathématiques Discrètes",
      description: "Bases logiques et combinatoires pour l'algorithmique",
      icon: <Brain className="h-8 w-8 text-orange-600" />,
      examples: ["Logique & ensembles", "Combinatoire", "Fonctions logarithmiques", "Algèbre de Boole"],
      applications: ["Algorithmique", "Feature engineering", "Complexité", "Données discrètes"]
    }
  ];

  const mathImportance = [
    {
      aspect: "Algorithmes de ML",
      description: "Les mathématiques sont au cœur de chaque algorithme d'apprentissage",
      example: "Régression linéaire = algèbre linéaire + calcul différentiel + statistiques"
    },
    {
      aspect: "Optimisation des modèles",
      description: "Comprendre comment les modèles apprennent et s'améliorent",
      example: "Descente de gradient, backpropagation, fonction de coût"
    },
    {
      aspect: "Interprétation des résultats",
      description: "Donner du sens aux métriques et aux prédictions",
      example: "P-value, intervalles de confiance, matrices de confusion"
    },
    {
      aspect: "Innovation et recherche",
      description: "Développer de nouvelles approches mathématiques",
      example: "Nouveaux algorithmes, méthodes hybrides, architectures réseau"
    }
  ];

  const complementaryTopics = [
    {
      title: "Calcul Intégral",
      description: "Probabilités continues et densités de probabilité",
      icon: "∫",
      importance: "Essentiel pour comprendre les distributions continues"
    },
    {
      title: "Algèbre de Boole",
      description: "Opérations logiques et feature engineering",
      icon: "∧∨",
      importance: "Utile pour les variables catégorielles et binaires"
    },
    {
      title: "Théorie des Graphes",
      description: "Réseaux, structures de données et algorithmes",
      icon: "⊙—⊙",
      importance: "Applications en réseaux sociaux et recommandations"
    },
    {
      title: "Analyse Numérique",
      description: "Méthodes computationnelles et approximations",
      icon: "≈",
      importance: "Implémentation pratique des algorithmes"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Mathématiques & Statistiques"
          description="Découvrez les fondements mathématiques essentiels pour acquérir de bonnes bases en Data Science"
          
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Introduction enrichie avec concepts fondamentaux */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Pourquoi les mathématiques sont-elles cruciales ?</h2>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Les mathématiques forment l'épine dorsale de la data science. Elles permettent de comprendre, 
            modéliser et prédire des phénomènes complexes à partir de données. Sans cette base solide, 
            il est difficile de bien comprendre les algorithmes de machine learning ou d'interpréter correctement les résultats.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {fundamentalConcepts.map((concept, index) => (
              <Card key={index} className="bg-white/80 hover:bg-white transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    {concept.icon}
                    <h3 className="font-semibold text-lg">{concept.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{concept.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Concepts</h4>
                      <div className="space-y-1">
                        {concept.examples.map((example, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full" />
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Applications</h4>
                      <div className="space-y-1">
                        {concept.applications.map((app, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-400 rounded-full" />
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Importance des mathématiques */}
          <div className="bg-white/60 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Impact des Mathématiques en Data Science
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mathImportance.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/80 rounded border">
                  <div className="bg-blue-100 text-blue-700 text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{item.aspect}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-blue-600 italic">Ex: {item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sujets complémentaires */}
          <div className="bg-white/60 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Bases Complémentaires Utiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complementaryTopics.map((topic, index) => (
                <div key={index} className="bg-white/80 p-4 rounded border">
                  <div className="text-2xl font-bold text-purple-600 mb-2 text-center">{topic.icon}</div>
                  <h4 className="font-semibold text-sm mb-2 text-center">{topic.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{topic.description}</p>
                  <p className="text-xs text-purple-600 italic">{topic.importance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parcours d'apprentissage */}
      <div id="learning-paths">
        <MathLearningPaths />
      </div>

      {/* Cours unifiés */}
      <div id="available-courses">
        <UnifiedMathCourses />
      </div>

      {/* Applications pratiques enrichies */}
      <div id="practical-applications">
        <PracticalApplicationsEnriched />
      </div>

      {/* Ressources et outils */}
      <div id="resources-tools">
        <MathResourcesTools />
      </div>

      {/* Visualisations mathématiques */}
      <div id="math-visuals" className="space-y-12">
        <MathVisualsSection />
      </div>

          <BackToTop />
        </div>
      </div>
    </Layout>
  );
};

export default MathStats;
