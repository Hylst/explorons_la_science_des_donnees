
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";

interface MLWorkflowProps {
  activeStep?: number;
}

export const MLWorkflowSchema = ({ activeStep = 0 }: MLWorkflowProps) => {
  const [currentStep, setCurrentStep] = React.useState(activeStep);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);

  const steps = [
    {
      id: 1,
      title: "Collecte des données",
      description: "Acquisition et rassemblement des données brutes",
      color: "bg-blue-500",
      details: "Sources variées : bases de données, APIs, fichiers, capteurs, web scraping...",
      examples: ["CSV/Excel", "APIs REST", "Bases de données", "Capteurs IoT"],
      challenges: ["Qualité des données", "Volume", "Variété", "Vélocité"]
    },
    {
      id: 2,
      title: "Préparation des données",
      description: "Nettoyage, transformation et préparation",
      color: "bg-green-500",
      details: "Entre 38 % et 45 % du temps déclaré par les praticiens (enquêtes Anaconda 2022 et 2020) est consacré à cette étape cruciale",
      examples: ["Nettoyage", "Normalisation", "Feature engineering", "Encoding"],
      challenges: ["Valeurs manquantes", "Outliers", "Formats incohérents", "Biais"]
    },
    {
      id: 3,
      title: "Exploration des données",
      description: "Analyse exploratoire et visualisation",
      color: "bg-yellow-500",
      details: "Comprendre les patterns et relations dans les données",
      examples: ["Statistiques descriptives", "Corrélations", "Visualisations", "Distribution"],
      challenges: ["Dimensionnalité", "Interprétation", "Choix des métriques", "Biais cognitifs"]
    },
    {
      id: 4,
      title: "Sélection du modèle",
      description: "Choix de l'algorithme approprié",
      color: "bg-purple-500",
      details: "Le choix dépend du type de problème et des données disponibles",
      examples: ["Régression", "Classification", "Clustering", "Deep Learning"],
      challenges: ["Complexité", "Interprétabilité", "Performance", "Overfitting"]
    },
    {
      id: 5,
      title: "Entraînement",
      description: "Formation du modèle sur les données",
      color: "bg-red-500",
      details: "Optimisation des paramètres pour minimiser l'erreur",
      examples: ["Gradient descent", "Cross-validation", "Hyperparameters", "Regularization"],
      challenges: ["Temps de calcul", "Mémoire", "Convergence", "Local minima"]
    },
    {
      id: 6,
      title: "Évaluation",
      description: "Test et validation des performances",
      color: "bg-indigo-500",
      details: "Mesurer objectivement la qualité du modèle",
      examples: ["Accuracy", "Precision/Recall", "F1-Score", "ROC-AUC"],
      challenges: ["Métriques appropriées", "Overfitting", "Généralisation", "Biais"]
    },
    {
      id: 7,
      title: "Déploiement",
      description: "Mise en production du modèle",
      color: "bg-pink-500",
      details: "Intégration dans l'environnement de production",
      examples: ["APIs", "Services web", "Batch processing", "Edge computing"],
      challenges: ["Scalabilité", "Monitoring", "Maintenance", "Drift"]
    }
  ];

  React.useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [autoPlay, steps.length]);

  const animateToStep = (stepIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-center">Workflow du Machine Learning</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoPlay ? "Pause" : "Auto"}
            </button>
            <button
              onClick={() => setCurrentStep(0)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => animateToStep(index)}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
                  currentStep === index 
                    ? `${step.color} scale-125 shadow-2xl ring-4 ring-white` 
                    : currentStep < index 
                    ? "bg-gray-300 scale-100" 
                    : `${step.color} opacity-70 scale-110`
                } group-hover:scale-110 ${isAnimating ? 'animate-pulse' : ''}`}
              >
                {step.id}
              </div>
              <p className="text-xs text-center mt-3 max-w-24 group-hover:font-medium transition-all duration-300">
                {step.title}
              </p>
              {index < steps.length - 1 && (
                <ChevronRight className="absolute top-10 left-20 w-6 h-6 text-gray-400 hidden lg:block" />
              )}
            </div>
          ))}
        </div>

        <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl transition-all duration-700 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-8 rounded-full ${steps[currentStep].color}`}></div>
            <h4 className="text-2xl font-bold">{steps[currentStep].title}</h4>
            <Badge variant="outline">Étape {currentStep + 1}/7</Badge>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{steps[currentStep].description}</p>
          <p className="text-gray-500 mb-6">{steps[currentStep].details}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">Exemples et outils</h5>
              <ul className="list-disc pl-5 space-y-1">
                {steps[currentStep].examples.map((example, index) => (
                  <li key={index} className="text-sm text-green-700">{example}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">Défis</h5>
              <ul className="list-disc pl-5 space-y-1">
                {steps[currentStep].challenges.map((challenge, index) => (
                  <li key={index} className="text-sm text-red-700">{challenge}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AlgorithmComparisonProps {
  algorithms: {
    name: string;
    type: string;
    pros: string[];
    cons: string[];
    useCases: string[];
    complexity: "Faible" | "Moyenne" | "Élevée";
    interpretability: "Faible" | "Moyenne" | "Élevée";
    performance: number; // 1-5
  }[];
}

export const AlgorithmComparison = ({ algorithms }: AlgorithmComparisonProps) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(0);
  const [compareMode, setCompareMode] = React.useState(false);
  const [comparedAlgorithms, setComparedAlgorithms] = React.useState<number[]>([]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Faible": return "bg-green-100 text-green-800";
      case "Moyenne": return "bg-yellow-100 text-yellow-800";
      case "Élevée": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const toggleCompare = (index: number) => {
    if (comparedAlgorithms.includes(index)) {
      setComparedAlgorithms(comparedAlgorithms.filter(i => i !== index));
    } else if (comparedAlgorithms.length < 3) {
      setComparedAlgorithms([...comparedAlgorithms, index]);
    }
  };

  return (
    <Card className="w-full border-2 hover:shadow-2xl transition-all duration-500">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Comparaison des Algorithmes</h3>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              compareMode ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {compareMode ? "Mode normal" : "Mode comparaison"}
          </button>
        </div>

        {!compareMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {algorithms.map((algo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAlgorithm(index)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                    selectedAlgorithm === index
                      ? "border-blue-500 bg-blue-50 shadow-xl"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                  }`}
                >
                  <h4 className="font-bold text-lg mb-2">{algo.name}</h4>
                  <Badge variant="outline" className="mb-3">{algo.type}</Badge>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complexité:</span>
                      <Badge className={getComplexityColor(algo.complexity)}>{algo.complexity}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance (avis de l'auteur) :</span>
                      <span className="text-sm">{renderStars(algo.performance)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-blue-200">
              <h4 className="text-2xl font-bold mb-6">{algorithms[selectedAlgorithm].name}</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h5 className="font-semibold text-green-600 mb-4 text-lg">Avantages</h5>
                  <ul className="space-y-2">
                    {algorithms[selectedAlgorithm].pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h5 className="font-semibold text-red-600 mb-4 text-lg">Inconvénients</h5>
                  <ul className="space-y-2">
                    {algorithms[selectedAlgorithm].cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h5 className="font-semibold text-blue-600 mb-4 text-lg">Cas d'usage</h5>
                  <ul className="space-y-2">
                    {algorithms[selectedAlgorithm].useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Complexité: </span>
                  <Badge className={getComplexityColor(algorithms[selectedAlgorithm].complexity)}>
                    {algorithms[selectedAlgorithm].complexity}
                  </Badge>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Interprétabilité: </span>
                  <Badge className={getComplexityColor(algorithms[selectedAlgorithm].interpretability)}>
                    {algorithms[selectedAlgorithm].interpretability}
                  </Badge>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Sélectionnez jusqu'à 3 algorithmes à comparer:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {algorithms.map((algo, index) => (
                  <button
                    key={index}
                    onClick={() => toggleCompare(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      comparedAlgorithms.includes(index)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={!comparedAlgorithms.includes(index) && comparedAlgorithms.length >= 3}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>

            {comparedAlgorithms.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">Critère</th>
                      {comparedAlgorithms.map(index => (
                        <th key={index} className="p-4 text-center">{algorithms[index].name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-medium">Type</td>
                      {comparedAlgorithms.map(index => (
                        <td key={index} className="p-4 text-center">
                          <Badge variant="outline">{algorithms[index].type}</Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 font-medium">Complexité</td>
                      {comparedAlgorithms.map(index => (
                        <td key={index} className="p-4 text-center">
                          <Badge className={getComplexityColor(algorithms[index].complexity)}>
                            {algorithms[index].complexity}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 font-medium">Performance (avis de l'auteur)</td>
                      {comparedAlgorithms.map(index => (
                        <td key={index} className="p-4 text-center">
                          {renderStars(algorithms[index].performance)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 font-medium">Interprétabilité</td>
                      {comparedAlgorithms.map(index => (
                        <td key={index} className="p-4 text-center">
                          <Badge className={getComplexityColor(algorithms[index].interpretability)}>
                            {algorithms[index].interpretability}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ConceptVisualizationProps {
  title: string;
  concept: {
    definition: string;
    visualElements: {
      type: "input" | "process" | "output";
      label: string;
      description: string;
    }[];
    examples: string[];
  };
}

export const ConceptVisualization = ({ title, concept }: ConceptVisualizationProps) => {
  const [activeElement, setActiveElement] = React.useState<number | null>(null);

  const getElementColor = (type: string) => {
    switch (type) {
      case "input": return "bg-blue-500";
      case "process": return "bg-purple-500";
      case "output": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full border-2 hover:shadow-xl transition-all duration-500">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
        
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">{concept.definition}</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
          {concept.visualElements.map((element, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-24 h-24 rounded-xl ${getElementColor(element.type)} text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg ${
                  activeElement === index ? 'scale-125 ring-4 ring-blue-300' : ''
                }`}
                onClick={() => setActiveElement(activeElement === index ? null : index)}
              >
                <span className="font-bold text-lg">{element.label}</span>
              </div>
              <p className="text-sm text-center mt-2 max-w-20">{element.type}</p>
              {index < concept.visualElements.length - 1 && (
                <ChevronRight className="w-6 h-6 text-gray-400 mt-12 absolute" style={{left: `${index * 200 + 120}px`}} />
              )}
            </div>
          ))}
        </div>

        {activeElement !== null && (
          <div className="bg-white p-6 rounded-xl border-2 shadow-lg transition-all duration-500">
            <h4 className="font-bold text-lg mb-3">{concept.visualElements[activeElement].label}</h4>
            <p className="text-gray-700">{concept.visualElements[activeElement].description}</p>
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="font-bold text-blue-800 mb-3">Exemples concrets :</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {concept.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-sm">{example}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
