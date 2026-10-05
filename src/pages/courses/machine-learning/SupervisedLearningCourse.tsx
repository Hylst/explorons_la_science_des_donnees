
import { useState, useMemo, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import CourseLayout from "@/components/layout/CourseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourseHeroTemplate from "@/components/courses/CourseHeroTemplate";
import CourseModuleTemplate from "@/components/courses/CourseModuleTemplate";
import CourseItemActions from "@/components/courses/CourseItemActions";
import { Brain, Play, CheckCircle, Circle } from "lucide-react";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { COMPLETION_THRESHOLD, getQuizAttempts, subscribeQuizAttempts } from "@/lib/quiz-storage";

const QUIZ_CATEGORY_ID = "machine-learning";

/**
 * Repères d'auto-évaluation calculés à partir de la progression réelle du visiteur (stockée dans son navigateur).
 * Le site est gratuit et sans compte : il ne délivre aucun certificat.
 */
const SelfAssessment = ({ moduleIds, projectIds }: { moduleIds: string[]; projectIds: string[] }) => {
  const { countDone } = useCourseProgress("supervised-learning");
  const attempts = useSyncExternalStore(subscribeQuizAttempts, getQuizAttempts);
  const modulesDone = countDone(moduleIds);
  const projectsDone = countDone(projectIds);
  const quizAttempts = attempts.filter((attempt) => attempt.categoryId === QUIZ_CATEGORY_ID);
  const bestQuiz = quizAttempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);

  const criteria = [
    { label: "Modules terminés", detail: `${modulesDone} sur ${moduleIds.length}`, met: modulesDone === moduleIds.length },
    { label: "Projets terminés", detail: `${projectsDone} sur ${projectIds.length}`, met: projectsDone === projectIds.length },
    {
      label: `Quiz Machine Learning : au moins ${COMPLETION_THRESHOLD} % au meilleur essai`,
      detail: quizAttempts.length > 0 ? `meilleur score ${bestQuiz} %` : "aucune tentative",
      met: bestQuiz >= COMPLETION_THRESHOLD,
    },
  ];
  const allMet = criteria.every((criterion) => criterion.met);

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold">Où en êtes-vous ?</h3>
      <p className="text-gray-700">
        Voici trois repères pour juger de vos acquis, calculés d'après vos modules et projets terminés et vos résultats de quiz.
        Ils sont enregistrés dans votre navigateur uniquement. Le site ne délivre pas de certificat : il est gratuit, sans compte,
        et ne peut donc pas attester de votre identité.
      </p>
      <ul className="space-y-2">
        {criteria.map((criterion) => (
          <li key={criterion.label} className="flex items-start gap-3 bg-white/70 p-3 rounded">
            {criterion.met ? <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-600" /> : <Circle className="h-5 w-5 mt-0.5 shrink-0 text-gray-400" />}
            <div className="min-w-0">
              <p className="font-medium">{criterion.label}</p>
              <p className="text-sm text-gray-600">{criterion.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="font-medium">
        {allMet ? "Les trois repères sont atteints : vous avez de bonnes bases sur le contenu de ce cours." : "Les repères non atteints indiquent les prochaines étapes."}
      </p>
      <Link to={`/quiz/${QUIZ_CATEGORY_ID}`} className="inline-block text-sm text-purple-700 underline">
        Faire le quiz Machine Learning
      </Link>
    </div>
  );
};

const SupervisedLearningCourse = () => {
  const [activeTab, setActiveTab] = useState("modules");

  // Configuration du cours avec ES6
  const courseConfig = useMemo(() => ({
    info: {
      title: "Machine Learning Supervisé",
      description: "Explorez les algorithmes de classification et de régression sur des problèmes concrets",
      level: "Intermédiaire",
      duration: "8 semaines",
      modules: 8,
      totalHours: "~35h"
    },
    features: [
      {
        title: "Compétences acquises",
        items: [
          "Algorithmes de classification",
          "Modèles de régression",
          "Évaluation de performance",
          "Optimisation d'hyperparamètres"
        ]
      },
      {
        title: "Prérequis",
        items: [
          "Python intermédiaire",
          "Statistiques de base",
          "Algèbre linéaire",
          "Pandas et NumPy"
        ]
      },
      {
        title: "Projets pratiques",
        items: [
          "Prédiction de prix immobiliers",
          "Classification d'emails spam",
          "Détection de fraude",
          "Recommandation de produits"
        ]
      }
    ]
  }), []);

  // Modules avec ES6 features
  const modules = [
    {
      id: "ml-intro",
      title: "Introduction au ML supervisé",
      description: "Concepts fondamentaux et types d'apprentissage",
      duration: "2.5h",
      completed: false,
      level: "beginner" as const,
      type: "theory" as const
    },
    {
      id: "linear-regression",
      title: "Régression linéaire",
      description: "Modèles de régression simple et multiple",
      duration: "4h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "logistic-regression",
      title: "Régression logistique",
      description: "Classification binaire et multinomiale",
      duration: "3.5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "decision-trees",
      title: "Arbres de décision",
      description: "Algorithmes d'arbre pour classification et régression",
      duration: "4h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "random-forests",
      title: "Forêts aléatoires",
      description: "Méthodes d'ensemble et bagging",
      duration: "3h",
      completed: false,
      level: "advanced" as const,
      type: "practice" as const
    },
    {
      id: "svm",
      title: "SVM et méthodes kernel",
      description: "Support Vector Machines",
      duration: "4h",
      completed: false,
      level: "advanced" as const,
      type: "practice" as const
    },
    {
      id: "evaluation",
      title: "Évaluation et validation",
      description: "Métriques et techniques de validation croisée",
      duration: "3h",
      completed: false,
      level: "intermediate" as const,
      type: "theory" as const
    },
    {
      id: "hyperparameters",
      title: "Optimisation des hyperparamètres",
      description: "Grid search et optimisation bayésienne",
      duration: "2.5h",
      completed: false,
      level: "advanced" as const,
      type: "project" as const
    }
  ];

  // Projets pratiques avec ES6 
  const practicalProjects = [
    {
      title: "Prédiction immobilière",
      description: "Modèle de régression pour prédire les prix de l'immobilier",
      dataset: "Boston Housing Dataset",
      techniques: ["Régression linéaire", "Feature engineering", "Validation croisée"],
      difficulty: "Intermédiaire",
      estimatedTime: "6h"
    },
    {
      title: "Classification de spam",
      description: "Détection automatique d'emails indésirables",
      dataset: "SpamAssassin Dataset",
      techniques: ["NLP", "Régression logistique", "Naive Bayes"],
      difficulty: "Intermédiaire", 
      estimatedTime: "4h"
    },
    {
      title: "Détection de fraude",
      description: "Identification de transactions frauduleuses",
      dataset: "Credit Card Fraud Dataset",
      techniques: ["SVM", "Random Forest", "Techniques de déséquilibrage"],
      difficulty: "Avancé",
      estimatedTime: "8h"
    }
  ];


  return (
    <CourseLayout
      title="Machine Learning Supervisé"
      categoryName="Machine Learning"
      courseName="Machine Learning supervisé"
    >
      <div className="space-y-8">
        <CourseHeroTemplate
          courseInfo={courseConfig.info}
          features={courseConfig.features}
          icon={Brain}
          gradientFrom="from-purple-50"
          gradientTo="to-pink-50"
          iconColor="text-purple-600"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="certification" className="whitespace-normal h-auto">Validation des acquis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Parcours d'apprentissage</h2>
            <CourseModuleTemplate
              courseId="supervised-learning"
              modules={modules}
              primaryColor="purple"
            />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Projets pratiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practicalProjects.map((project, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dataset :</p>
                        <p className="text-sm text-gray-600">{project.dataset}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Techniques :</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.techniques.map((technique, techIndex) => (
                            <span key={techIndex} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {technique}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{project.difficulty}</span>
                        <span className="text-gray-600">{project.estimatedTime}</span>
                      </div>
                      <CourseItemActions
                        courseId="supervised-learning"
                        itemId={project.title}
                        itemTitle={project.title}
                        startLabel="Commencer le projet"
                        startIcon={<Play className="h-4 w-4" />}
                        startClassName="bg-purple-600 text-white hover:bg-purple-700"
                        className="mt-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="certification" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Validation des acquis</h2>
            <SelfAssessment moduleIds={modules.map((module) => module.id)} projectIds={practicalProjects.map((project) => project.title)} />
          </TabsContent>
        </Tabs>
      </div>
    </CourseLayout>
  );
};

export default SupervisedLearningCourse;
