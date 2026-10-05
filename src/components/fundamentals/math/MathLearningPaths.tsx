
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Calculator, Brain, Target, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { useCourseProgress } from "@/hooks/use-course-progress";

/**
 * Parcours conseillés. Chaque module renvoie à une page réelle du site ; un module sans `link` n'existe pas encore
 * (affiché « À venir », exclu du calcul de progression). La progression est cochée par le visiteur et enregistrée
 * dans son navigateur (voir useCourseProgress) : aucune valeur n'est préremplie. Les durées sont des estimations
 * indicatives à raison de quelques heures par semaine, pas des mesures.
 */
interface PathModule {
  id: string;
  name: string;
  duration: string;
  link?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  color: "green" | "blue" | "purple";
  icon: JSX.Element;
  modules: PathModule[];
}

const learningPaths: LearningPath[] = [
  {
    id: "beginner",
    title: "Parcours Débutant",
    description: "Fondamentaux mathématiques pour débuter en Data Science",
    duration: "8-12 semaines",
    difficulty: "Débutant",
    color: "green",
    icon: <Target className="h-6 w-6" />,
    modules: [
      { id: "nombres-ensembles", name: "Nombres et ensembles", duration: "2 semaines", link: "/courses/math-stats/math-intro" },
      { id: "fonctions", name: "Fonctions et graphiques", duration: "2 semaines", link: "/courses/math-stats/math-intro" },
      { id: "stats-descriptives", name: "Statistiques descriptives", duration: "3 semaines", link: "/fundamentals/math-stats/descriptive-statistics" },
      { id: "probabilites", name: "Probabilités", duration: "3 semaines", link: "/fundamentals/math-stats/probability-theory" },
    ],
  },
  {
    id: "intermediate",
    title: "Parcours Intermédiaire",
    description: "Concepts avancés pour l'analyse de données",
    duration: "12-16 semaines",
    difficulty: "Intermédiaire",
    color: "blue",
    icon: <Calculator className="h-6 w-6" />,
    modules: [
      { id: "calcul-differentiel", name: "Calcul différentiel", duration: "3 semaines", link: "/fundamentals/math-stats/differential-calculus" },
      { id: "calcul-integral", name: "Calcul intégral", duration: "3 semaines", link: "/fundamentals/math-stats/integral-calculus" },
      { id: "algebre-lineaire", name: "Algèbre linéaire", duration: "4 semaines", link: "/fundamentals/math-stats/linear-algebra" },
      { id: "stats-inferentielles", name: "Statistiques inférentielles", duration: "4 semaines", link: "/courses/math-stats/inferential-statistics" },
    ],
  },
  {
    id: "advanced",
    title: "Parcours Avancé",
    description: "Mathématiques pour le Machine Learning et l'IA",
    duration: "16-20 semaines",
    difficulty: "Avancé",
    color: "purple",
    icon: <Brain className="h-6 w-6" />,
    modules: [
      { id: "optimisation", name: "Optimisation et descente de gradient", duration: "4 semaines", link: "/fundamentals/math-stats/differential-calculus#optimization" },
      { id: "stats-avancees", name: "Statistiques avancées (tests, ANOVA, régression)", duration: "5 semaines", link: "/fundamentals/math-stats/advanced-statistics" },
      { id: "fourier", name: "Analyse de Fourier et traitement du signal", duration: "4 semaines" },
      { id: "theorie-information", name: "Théorie de l'information", duration: "3 semaines" },
    ],
  },
];

const getColorClasses = (color: LearningPath["color"]) => {
  const colors = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return colors[color];
};

const getBadgeVariant = (difficulty: LearningPath["difficulty"]) => {
  switch (difficulty) {
    case "Débutant": return "default";
    case "Intermédiaire": return "secondary";
    case "Avancé": return "destructive";
  }
};

const MathLearningPaths = () => {
  const { statusOf, setStatus, countDone } = useCourseProgress("math-learning-paths");

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold">Parcours d'Apprentissage Mathématiques</h2>
      </div>
      <p className="text-lg text-gray-600 mb-2">
        Choisissez le parcours adapté à votre niveau et progressez étape par étape dans votre compréhension des mathématiques pour la Data Science.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Cochez un module quand vous l'avez terminé : votre progression est enregistrée dans ce navigateur uniquement.
        Les durées sont des estimations indicatives, à raison de quelques heures par semaine.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {learningPaths.map((path) => {
          const available = path.modules.filter((m) => m.link);
          const done = countDone(available.map((m) => m.id));
          const percent = available.length > 0 ? Math.round((done / available.length) * 100) : 0;
          const firstTodo = available.find((m) => statusOf(m.id) !== "done") ?? available[0];

          return (
            <Card key={path.id} className={`hover:shadow-lg transition-all duration-300 ${getColorClasses(path.color)}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {path.icon}
                    <CardTitle className="text-xl">{path.title}</CardTitle>
                  </div>
                  <Badge variant={getBadgeVariant(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm">{path.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.duration} (indicatif)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{available.length} module{available.length > 1 ? "s" : ""} disponible{available.length > 1 ? "s" : ""} sur {path.modules.length}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Votre progression</span>
                      <span>{done}/{available.length} ({percent} %)</span>
                    </div>
                    <Progress value={percent} className="h-2" aria-label={`Progression du ${path.title.toLowerCase()}`} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Modules :</h4>
                    <ul className="space-y-1">
                      {path.modules.map((module) => {
                        const isDone = statusOf(module.id) === "done";
                        return (
                          <li key={module.id} className="flex items-center justify-between gap-2 text-xs bg-white/50 p-2 rounded">
                            <div className="flex items-center gap-2 min-w-0">
                              {module.link ? (
                                <button
                                  type="button"
                                  aria-pressed={isDone}
                                  aria-label={`${isDone ? "Marquer comme non terminé" : "Marquer comme terminé"} : ${module.name}`}
                                  title={isDone ? "Terminé (cliquer pour annuler)" : "Marquer comme terminé"}
                                  onClick={() => setStatus(module.id, isDone ? "todo" : "done")}
                                  className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                  {isDone ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-gray-400" />}
                                </button>
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-gray-300" aria-hidden="true" />
                              )}
                              {module.link ? (
                                <Link to={module.link} className={`min-w-0 hover:underline ${isDone ? "line-through text-gray-500" : ""}`}>
                                  {module.name}
                                </Link>
                              ) : (
                                <span className="min-w-0 text-gray-500">{module.name}</span>
                              )}
                            </div>
                            <span className="shrink-0 text-gray-500">{module.link ? module.duration : "À venir"}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {firstTodo?.link && (
                    <div className="pt-4 border-t">
                      <Button asChild className="w-full whitespace-normal h-auto" size="sm">
                        <Link to={firstTodo.link}>
                          {done > 0 ? "Continuer" : "Commencer"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Progression Recommandée
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-700 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-green-700">Fondations Solides</h4>
            <p className="text-sm text-gray-600">Travaillez les bases avant de progresser</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-700 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-blue-700">Application Pratique</h4>
            <p className="text-sm text-gray-600">Appliquez immédiatement vos connaissances</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-700 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-purple-700">Spécialisation</h4>
            <p className="text-sm text-gray-600">Approfondissez vos connaissances</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MathLearningPaths;
