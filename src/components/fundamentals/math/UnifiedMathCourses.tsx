import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator, ChartBar, Brain, Target, Clock, BookOpen, Play } from "lucide-react";
import { COURSE_CATALOG } from "@/data/course-catalog";

/**
 * Titre, description, niveau, durée et nombre de modules d'un cours du catalogue : lus dans `COURSE_CATALOG`
 * (source unique de la page /courses et de l'accueil), jamais recopiés ici.
 */
const fromCatalog = (id: string) => {
  const course = COURSE_CATALOG.find((c) => c.id === id);
  if (!course) throw new Error(`Cours absent du catalogue : ${id}`);
  return course;
};

const mathIntro = fromCatalog("math-intro");
const inferential = fromCatalog("inferential-statistics");
const applied = fromCatalog("applied-statistics");

interface MathCourse {
  id: string;
  title: string;
  description: string;
  /** Niveau annoncé par le catalogue ou par la page elle-même ; absent quand aucune des deux n'en annonce un */
  level?: string;
  /** Durée indicative du catalogue ; absente pour les pages de la section Fondamentaux */
  duration?: string;
  modules?: number;
  icon: JSX.Element;
  color: string;
  topics: string[];
  link: string;
  nextModule: string;
}

/**
 * Cours et pages de cours existants, dans l'ordre de lecture suggéré. Chaque lien mène à une route réelle
 * (App.tsx, CourseRouter.tsx). Les pages de /fundamentals/math-stats ne figurent pas au catalogue : pas de durée annoncée.
 */
const courses: MathCourse[] = [
  {
    id: "math-intro",
    title: mathIntro.title,
    description: mathIntro.description,
    level: mathIntro.level,
    duration: mathIntro.duration,
    modules: mathIntro.modules,
    icon: <Calculator className="h-6 w-6 text-blue-600" />,
    color: "blue",
    topics: ["Pourquoi les mathématiques ?", "Nombres et ensembles", "Fonctions", "Dérivées et descente de gradient", "Intégrales et probabilités"],
    link: mathIntro.href,
    nextModule: "Pourquoi les mathématiques ?",
  },
  {
    id: "descriptive-stats",
    title: "Statistiques descriptives",
    description: "Résumer et décrire des données avec les outils statistiques fondamentaux",
    icon: <ChartBar className="h-6 w-6 text-green-600" />,
    color: "green",
    topics: ["Tendance centrale", "Dispersion", "Corrélation", "Applications pratiques"],
    link: "/fundamentals/math-stats/descriptive-statistics",
    nextModule: "Mesures de tendance centrale",
  },
  {
    id: "probability-theory",
    title: "Théorie des probabilités",
    description: "Quantifier l'incertitude avec les concepts fondamentaux des probabilités",
    icon: <Target className="h-6 w-6 text-purple-600" />,
    color: "purple",
    topics: ["Probabilités de base", "Probabilité conditionnelle", "Variables aléatoires", "Distributions", "Théorème de Bayes"],
    link: "/fundamentals/math-stats/probability-theory",
    nextModule: "Introduction : le langage de l'incertitude",
  },
  {
    id: "inferential-statistics",
    title: inferential.title,
    description: inferential.description,
    level: inferential.level,
    duration: inferential.duration,
    modules: inferential.modules,
    icon: <ChartBar className="h-6 w-6 text-teal-600" />,
    color: "teal",
    topics: [
      "Échantillons et estimateurs",
      "Intervalles de confiance",
      "Logique d'un test d'hypothèse",
      "Tests t et khi-deux",
      "Tests multiples et puissance",
      "Approche bayésienne",
    ],
    link: inferential.href,
    nextModule: "Échantillons et estimateurs",
  },
  {
    id: "applied-statistics",
    title: applied.title,
    description: applied.description,
    level: applied.level,
    duration: applied.duration,
    modules: applied.modules,
    icon: <ChartBar className="h-6 w-6 text-emerald-600" />,
    color: "emerald",
    topics: ["Décrire des données réelles", "Probabilités en pratique", "Tests d'hypothèses", "Corrélation et régression", "ANOVA", "Tests non paramétriques"],
    link: applied.href,
    nextModule: "Décrire des données réelles",
  },
  {
    id: "linear-algebra",
    title: "Algèbre linéaire",
    description: "Vecteurs, matrices et transformations, pour comprendre le machine learning",
    icon: <Brain className="h-6 w-6 text-indigo-600" />,
    color: "indigo",
    topics: ["Vecteurs", "Matrices", "Opérations", "Décompositions", "Applications"],
    link: "/fundamentals/math-stats/linear-algebra",
    nextModule: "Introduction à l'algèbre linéaire",
  },
  {
    id: "differential-calculus",
    title: "Calcul différentiel",
    description: "Dérivées, gradients et optimisation, au cœur de l'apprentissage des modèles",
    icon: <Target className="h-6 w-6 text-orange-600" />,
    color: "orange",
    topics: ["Concept de dérivée", "Règles de dérivation", "Optimisation", "Gradients et dérivées partielles", "Exercices"],
    link: "/fundamentals/math-stats/differential-calculus",
    nextModule: "Le concept de dérivée",
  },
  {
    id: "integral-calculus",
    title: "Calcul intégral",
    description: "Intégrales et applications aux données continues et aux probabilités",
    icon: <Calculator className="h-6 w-6 text-cyan-600" />,
    color: "cyan",
    topics: ["Concepts fondamentaux", "Techniques d'intégration", "Applications en science des données", "Exercices"],
    link: "/fundamentals/math-stats/integral-calculus",
    nextModule: "Le calcul intégral : mesurer une accumulation",
  },
  {
    id: "advanced-stats",
    title: "Statistiques avancées",
    description: "Tests d'hypothèses, intervalles de confiance, ANOVA, régression et statistiques bayésiennes",
    level: "Avancé",
    icon: <ChartBar className="h-6 w-6 text-red-600" />,
    color: "red",
    topics: ["Tests d'hypothèses", "Intervalles de confiance", "ANOVA", "Régression avancée", "Statistiques bayésiennes"],
    link: "/fundamentals/math-stats/advanced-statistics",
    nextModule: "Tests d'hypothèses",
  },
];

/**
 * Sujets qui n'ont pas de cours sur le site : aucune page, aucune date. Ils figurent pour être honnête sur ce qui manque,
 * pas comme une promesse.
 */
const missingTopics = [
  {
    id: "numerical-analysis",
    title: "Analyse numérique",
    description: "Méthodes numériques pour résoudre des problèmes mathématiques",
    icon: <Brain className="h-6 w-6 text-teal-600" />,
    color: "teal",
    topics: ["Interpolation", "Méthodes itératives", "Résolution d'équations", "Approximations"],
  },
  {
    id: "multivariate-stats",
    title: "Statistiques multivariées",
    description: "Analyse simultanée de plusieurs variables",
    icon: <Target className="h-6 w-6 text-violet-600" />,
    color: "violet",
    topics: ["ACP", "Analyse factorielle", "Classification", "Analyse discriminante"],
  },
  {
    id: "time-series",
    title: "Séries temporelles",
    description: "Analyser et prévoir des données ordonnées dans le temps",
    icon: <Clock className="h-6 w-6 text-amber-600" />,
    color: "amber",
    topics: ["Tendances", "Saisonnalité", "ARIMA", "Prévision"],
  },
  {
    id: "mathematical-optimization",
    title: "Optimisation mathématique",
    description: "Techniques d'optimisation au-delà de la descente de gradient",
    icon: <Target className="h-6 w-6 text-emerald-600" />,
    color: "emerald",
    topics: ["Optimisation convexe", "Programmation linéaire", "Méthodes de Newton", "Algorithmes génétiques"],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Débutant": return "bg-green-100 text-green-800";
    case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
    case "Avancé": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
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
    gray: "border-gray-200 hover:border-gray-300",
  };
  return colors[color] || colors.blue;
};

const UnifiedMathCourses = () => {
  return (
    <div className="space-y-12">
      {/* Cours disponibles */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold">Cours disponibles</h2>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          {courses.length} cours et pages de cours sur les mathématiques et les statistiques. Les durées, quand elles sont indiquées,
          sont celles du catalogue des cours rédigés et restent indicatives.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(course.color)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {course.icon}
                    <div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                      #{index + 1}
                    </div>
                    {course.level && (
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{course.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.modules ? `${course.modules} modules` : `${course.topics.length} thèmes`}</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} (indicatif)</span>
                    </div>
                  )}
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
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Play className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Premier module :</span>
                    <span className="text-gray-700">{course.nextModule}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button asChild className="w-full whitespace-normal h-auto">
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

      {/* Sujets sans cours */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-8 w-8 text-orange-600" />
          <h2 className="text-3xl font-bold">Sujets pas encore traités</h2>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Ces sujets n'ont pas encore de cours sur le site, et aucune date n'est annoncée. Ils sont listés pour indiquer ce qui manque :
          si l'un d'eux vous est utile, il faudra pour l'instant chercher ailleurs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {missingTopics.map((topic) => (
            <Card
              key={topic.id}
              className={`border-l-4 ${getColorClasses(topic.color)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {topic.icon}
                    <div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 shrink-0">Pas encore écrit</Badge>
                </div>
                <p className="text-gray-700 text-sm">{topic.description}</p>
              </CardHeader>

              <CardContent>
                <h4 className="font-semibold text-sm mb-2">Sujets typiques :</h4>
                <div className="flex flex-wrap gap-1">
                  {topic.topics.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-dashed text-muted-foreground">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ordre de lecture */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-100">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          Un ordre de lecture possible
        </h3>
        <p className="text-gray-700 mb-6">
          Du plus élémentaire au plus technique. Les cours s'appuient en partie les uns sur les autres, mais rien n'oblige à les suivre
          dans cet ordre : passez ce que vous connaissez déjà.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              to={course.link}
              className="bg-white p-4 rounded-lg border border-blue-200 text-center hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h4 className="font-semibold text-sm text-gray-900">{course.title}</h4>
              {course.level && <p className="text-xs text-gray-600 mt-1">{course.level}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UnifiedMathCourses;
