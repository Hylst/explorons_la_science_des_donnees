import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator, ChartBar, Brain, Target, Clock, BookOpen, Play, CheckCircle, Lock } from "lucide-react";

const UnifiedMathCourses = () => {
  const courses = [
    {
      id: "math-intro",
      title: "Introduction aux Mathématiques",
      description: "Fondements mathématiques essentiels pour débuter en Data Science",
      status: "available",
      level: "Débutant",
      progress: 0,
      icon: <Calculator className="h-6 w-6 text-blue-600" />,
      color: "blue",
      topics: ["Pourquoi les maths", "Ensembles et nombres", "Fonctions", "Dérivées et gradient", "Intégrales"],
      link: "/courses/math-stats/math-intro",
      nextModule: "Pourquoi les maths ?",
      order: 1
    },
    {
      id: "descriptive-stats",
      title: "Statistiques Descriptives",
      description: "Analyser et décrire les données avec les outils statistiques fondamentaux",
      status: "available",
      level: "Débutant",
      progress: 0,
      icon: <ChartBar className="h-6 w-6 text-green-600" />,
      color: "green",
      topics: ["Tendance centrale", "Dispersion", "Corrélation", "Visualisation"],
      link: "/fundamentals/math-stats/descriptive-statistics",
      nextModule: "Mesures de tendance centrale",
      order: 2
    },
    {
      id: "probability-theory",
      title: "Théorie des Probabilités",
      description: "Comprendre l'incertitude avec les concepts fondamentaux des probabilités",
      status: "available",
      level: "Intermédiaire",
      progress: 0,
      icon: <Target className="h-6 w-6 text-purple-600" />,
      color: "purple",
      topics: ["Probabilités de base", "Variables aléatoires", "Distributions", "Théorème de Bayes"],
      link: "/fundamentals/math-stats/probability-theory",
      nextModule: "Introduction intuitive aux probabilités",
      order: 3
    },
    {
      id: "inferential-statistics",
      title: "Statistiques Inférentielles",
      description: "De l'échantillon à la population : tests d'hypothèses, intervalles de confiance et approche bayésienne",
      status: "available",
      level: "Intermédiaire",
      progress: 0,
      icon: <ChartBar className="h-6 w-6 text-teal-600" />,
      color: "teal",
      topics: ["Échantillonnage", "Tests d'hypothèses", "Intervalles de confiance", "Approche bayésienne", "Exercices corrigés"],
      link: "/courses/math-stats/inferential-statistics",
      nextModule: "Le défi fondamental de l'inférence",
      order: 4
    },
    {
      id: "linear-algebra",
      title: "Algèbre Linéaire",
      description: "Vecteurs, matrices et transformations pour le Machine Learning",
      status: "available",
      level: "Intermédiaire",
      progress: 0,
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      color: "indigo",
      topics: ["Vecteurs", "Matrices", "Opérations", "Décompositions", "Applications ML"],
      link: "/fundamentals/math-stats/linear-algebra",
      nextModule: "Introduction à l'algèbre linéaire",
      order: 5
    },
    {
      id: "differential-calculus",
      title: "Calcul Différentiel",
      description: "Dérivées et optimisation pour l'apprentissage automatique",
      status: "available",
      level: "Avancé",
      progress: 0,
      icon: <Target className="h-6 w-6 text-orange-600" />,
      color: "orange",
      topics: ["Dérivées", "Règles de dérivation", "Optimisation", "Gradients", "Applications"],
      link: "/fundamentals/math-stats/differential-calculus",
      nextModule: "Concept de dérivée",
      order: 6
    },
    {
      id: "integral-calculus",
      title: "Calcul Intégral",
      description: "Intégrales et applications pour l'analyse de données continues",
      status: "available",
      level: "Avancé",
      progress: 0,
      icon: <Calculator className="h-6 w-6 text-cyan-600" />,
      color: "cyan",
      topics: ["Intégrales définies", "Intégrales indéfinies", "Applications", "Probabilités continues"],
      link: "/fundamentals/math-stats/integral-calculus",
      nextModule: "Concept d'intégrale",
      order: 7
    },
    {
      id: "advanced-stats",
      title: "Statistiques Avancées",
      description: "Tests d'hypothèses, intervalles de confiance, ANOVA et modèles avancés",
      status: "available",
      level: "Avancé",
      progress: 0,
      icon: <ChartBar className="h-6 w-6 text-red-600" />,
      color: "red",
      topics: ["Tests d'hypothèses", "ANOVA", "Régression avancée", "Statistiques bayésiennes"],
      link: "/fundamentals/math-stats/advanced-statistics",
      nextModule: "Introduction aux tests statistiques",
      order: 8
    },
    // Cours à venir
    {
      id: "numerical-analysis",
      title: "Analyse Numérique",
      description: "Méthodes numériques pour résoudre des problèmes mathématiques complexes",
      status: "coming-soon",
      level: "Avancé",
      progress: 0,
      icon: <Brain className="h-6 w-6 text-teal-600" />,
      color: "teal",
      topics: ["Interpolation", "Méthodes itératives", "Résolution d'équations", "Approximations"],
      link: "#",
      nextModule: "Introduction à l'analyse numérique",
      order: 9
    },
    {
      id: "multivariate-stats",
      title: "Statistiques Multivariées",
      description: "Analyse simultanée de plusieurs variables pour des insights complexes",
      status: "coming-soon",
      level: "Avancé",
      progress: 0,
      icon: <Target className="h-6 w-6 text-violet-600" />,
      color: "violet",
      topics: ["ACP", "Analyse factorielle", "Classification", "Analyse discriminante"],
      link: "#",
      nextModule: "Introduction aux statistiques multivariées",
      order: 10
    },
    {
      id: "time-series",
      title: "Séries Temporelles",
      description: "Analyser et prévoir les données temporelles avec des méthodes spécialisées",
      status: "coming-soon",
      level: "Avancé",
      progress: 0,
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      color: "amber",
      topics: ["Tendances", "Saisonnalité", "ARIMA", "Prévision"],
      link: "#",
      nextModule: "Introduction aux séries temporelles",
      order: 11
    },
    {
      id: "mathematical-optimization",
      title: "Optimisation Mathématique",
      description: "Techniques d'optimisation avancées pour le machine learning",
      status: "coming-soon",
      level: "Avancé",
      progress: 0,
      icon: <Target className="h-6 w-6 text-emerald-600" />,
      color: "emerald",
      topics: ["Optimisation convexe", "Algorithmes génétiques", "Programmation linéaire", "Méthodes de Newton"],
      link: "#",
      nextModule: "Fondements de l'optimisation",
      order: 12
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case "coming-soon":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Bientôt</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-blue-200 hover:border-blue-300",
      green: "border-green-200 hover:border-green-300",
      purple: "border-purple-200 hover:border-purple-300",
      indigo: "border-indigo-200 hover:border-indigo-300",
      orange: "border-orange-200 hover:border-orange-300",
      red: "border-red-200 hover:border-red-300",
      cyan: "border-cyan-200 hover:border-cyan-300",
      teal: "border-teal-200 hover:border-teal-300",
      pink: "border-pink-200 hover:border-pink-300",
      violet: "border-violet-200 hover:border-violet-300",
      amber: "border-amber-200 hover:border-amber-300",
      emerald: "border-emerald-200 hover:border-emerald-300",
      gray: "border-gray-200 hover:border-gray-300"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Trier les cours par ordre
  const sortedCourses = courses.sort((a, b) => a.order - b.order);
  const availableCourses = sortedCourses.filter(course => course.status === "available");
  const upcomingCourses = sortedCourses.filter(course => course.status === "coming-soon");

  return (
    <div className="space-y-12">
      {/* Cours disponibles */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold">Cours Disponibles</h2>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Commencez votre parcours mathématique avec ces cours structurés et progressifs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {availableCourses.map((course) => (
            <Card 
              key={course.id} 
              className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(course.color)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {course.icon}
                    <div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                      #{course.order}
                    </div>
                    {getStatusBadge(course.status)}
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{course.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.topics.length} thèmes</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Sujets abordés :</h4>
                  <div className="flex flex-wrap gap-1">
                    {course.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Play className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Prochain module :</span>
                    <span className="text-gray-700">{course.nextModule}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button asChild className="w-full">
                    <Link to={course.link}>
                      <Play className="h-4 w-4 mr-2" />
                      Commencer le cours
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cours à venir */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-8 w-8 text-orange-600" />
          <h2 className="text-3xl font-bold">Cours à Venir</h2>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Ces cours seront bientôt disponibles pour approfondir vos connaissances mathématiques.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingCourses.map((course) => (
            <Card 
              key={course.id} 
              className={`border-l-4 ${getColorClasses(course.color)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {course.icon}
                    <div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-medium">
                      #{course.order}
                    </div>
                    {getStatusBadge(course.status)}
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{course.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.topics.length} thèmes</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Sujets prévus :</h4>
                  <div className="flex flex-wrap gap-1">
                    {course.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-dashed text-muted-foreground">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-700">Premier module :</span>
                    <span className="text-orange-600">{course.nextModule}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button disabled className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Bientôt disponible
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Parcours recommandé */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-100">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          Parcours Recommandé pour Débutants
        </h3>
        <p className="text-gray-700 mb-6">
          Suivez cette progression logique pour construire vos bases mathématiques solides :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {availableCourses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg border border-blue-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {course.order}
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-2">{course.title}</h4>
              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UnifiedMathCourses;
