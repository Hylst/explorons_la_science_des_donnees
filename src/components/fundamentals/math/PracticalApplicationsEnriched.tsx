
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseEquation from "@/components/courses/CourseEquation";
import { Code, Database, Brain, TrendingUp, Target, Zap } from "lucide-react";

const PracticalApplicationsEnriched = () => {
  const applications = [
    {
      category: "Machine Learning",
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      color: "purple",
      applications: [
        {
          title: "Régression Linéaire",
          math: "y = X\\beta + \\epsilon",
          description: "Prédiction de valeurs continues basée sur des relations linéaires",
          realWorldUse: "Prédiction des prix immobiliers, estimation des ventes",
          complexity: "Débutant",
          tools: ["Python", "scikit-learn", "R"],
          dataset: "California Housing (le jeu Boston Housing a été retiré de scikit-learn 1.2 pour des raisons éthiques)"
        },
        {
          title: "Réseaux de Neurones",
          math: "f(x) = \\sigma(W \\cdot x + b)",
          description: "Modélisation de fonctions complexes par composition de fonctions simples (la formule décrit une seule couche)",
          realWorldUse: "Reconnaissance d'images, traitement du langage naturel",
          complexity: "Avancé",
          tools: ["TensorFlow", "PyTorch", "Keras"],
          dataset: "MNIST, CIFAR-10, ImageNet"
        }
      ]
    },
    {
      category: "Statistiques Bayésiennes",
      icon: <Target className="h-6 w-6 text-blue-600" />,
      color: "blue",
      applications: [
        {
          title: "Théorème de Bayes",
          math: "P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}",
          description: "Mise à jour des croyances avec de nouvelles informations",
          realWorldUse: "Diagnostic médical, filtrage de spam, recommandations",
          complexity: "Intermédiaire",
          tools: ["PyMC", "Stan", "R"],
          dataset: "Données médicales, emails, comportement utilisateur"
        },
        {
          title: "Classification Naïve de Bayes",
          math: "P(C|F_1,...,F_n) = \\frac{P(C)\\prod_{i=1}^{n}P(F_i|C)}{P(F_1,...,F_n)}",
          description: "Classification basée sur l'indépendance conditionnelle des caractéristiques",
          realWorldUse: "Analyse de sentiment, classification de textes",
          complexity: "Intermédiaire",
          tools: ["scikit-learn", "NLTK", "spaCy"],
          dataset: "Reviews Amazon, tweets, articles"
        }
      ]
    },
    {
      category: "Optimisation",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      color: "green",
      applications: [
        {
          title: "Descente de Gradient",
          math: "\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)",
          description: "Algorithme d'optimisation pour minimiser une fonction de coût",
          realWorldUse: "Entraînement de modèles de machine learning (minimisation d'une fonction de coût)",
          complexity: "Intermédiaire",
          tools: ["NumPy", "TensorFlow", "PyTorch"],
          dataset: "Tous types de données pour ML"
        },
        {
          title: "Programmation Linéaire",
          math: "\\min c^T x \\text{ s.t. } Ax \\leq b, x \\geq 0",
          description: "Optimisation de fonctions linéaires sous contraintes linéaires",
          realWorldUse: "Planification de production, allocation de ressources",
          complexity: "Avancé",
          tools: ["SciPy (linprog)", "PuLP", "OR-Tools"],
          dataset: "Données de production, inventaires"
        }
      ]
    },
    {
      category: "Algèbre Linéaire",
      icon: <Code className="h-6 w-6 text-orange-600" />,
      color: "orange",
      applications: [
        {
          title: "Analyse en Composantes Principales (PCA)",
          math: "X_c = U\\Sigma V^T",
          description: "Réduction de dimensionnalité par décomposition en valeurs singulières de la matrice des données centrées X_c",
          realWorldUse: "Compression d'images, visualisation de données haute dimension",
          complexity: "Intermédiaire",
          tools: ["scikit-learn", "NumPy", "Pandas"],
          dataset: "Images, données génomiques, données financières"
        },
        {
          title: "Recommandation par Factorisation Matricielle",
          math: "R \\approx UV^T",
          description: "Prédiction de préférences par décomposition de matrices",
          realWorldUse: "Systèmes de recommandation (popularisée par le Netflix Prize ; aussi utilisée par des services de streaming musical)",
          complexity: "Avancé",
          tools: ["Surprise", "TensorFlow", "Implicit"],
          dataset: "MovieLens, Amazon Reviews, Last.fm"
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-50 border-purple-200",
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      orange: "bg-orange-50 border-orange-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="h-8 w-8 text-orange-600" />
        <h2 className="text-3xl font-bold">Applications pratiques</h2>
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Où retrouve-t-on les concepts mathématiques de cette page ? Quelques exemples d'applications, avec la formule, les outils et les jeux de données qu'on utilise couramment.
      </p>

      <div className="space-y-8">
        {applications.map((category, categoryIndex) => (
          <div key={categoryIndex} className={`p-6 rounded-lg border-2 ${getColorClasses(category.color)}`}>
            <div className="flex items-center gap-3 mb-6">
              {category.icon}
              <h3 className="text-2xl font-bold">{category.category}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.applications.map((app, appIndex) => (
                <Card key={appIndex} className="hover:shadow-lg transition-all duration-300 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{app.title}</CardTitle>
                      <Badge className={getComplexityColor(app.complexity)}>
                        {app.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <CourseEquation latex={app.math} displayMode={true} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Description :</h4>
                      <p className="text-sm text-gray-700">{app.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Applications réelles :</h4>
                      <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                        {app.realWorldUse}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-xs mb-2">Outils courants :</h4>
                        <div className="flex flex-wrap gap-1">
                          {app.tools.map((tool, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs mb-2">Jeux de données courants :</h4>
                        <p className="text-xs text-gray-600">{app.dataset}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-6 w-6 text-indigo-600" />
          Une méthode pour apprendre
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
            <h4 className="font-semibold text-sm">Théorie</h4>
            <p className="text-xs text-gray-600">Comprendre les concepts mathématiques</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
            <h4 className="font-semibold text-sm">Implémentation</h4>
            <p className="text-xs text-gray-600">Coder l'algorithme soi-même, sans bibliothèque</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
            <h4 className="font-semibold text-sm">Application</h4>
            <p className="text-xs text-gray-600">Appliquer à un jeu de données réel</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">4</div>
            <h4 className="font-semibold text-sm">Optimisation</h4>
            <p className="text-xs text-gray-600">Améliorer les performances</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticalApplicationsEnriched;
