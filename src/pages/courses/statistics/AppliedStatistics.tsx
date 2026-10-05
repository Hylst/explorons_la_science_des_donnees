
import { useState, useMemo } from "react";
import CourseLayout from "@/components/layout/CourseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourseHeroTemplate from "@/components/courses/CourseHeroTemplate";
import CourseModuleTemplate from "@/components/courses/CourseModuleTemplate";
import CourseItemActions from "@/components/courses/CourseItemActions";
import { BarChart3, TrendingUp, Calculator, PieChart } from "lucide-react";

const AppliedStatistics = () => {
  const [activeTab, setActiveTab] = useState("modules");

  // Configuration du cours avec ES6
  const courseConfig = useMemo(() => ({
    info: {
      title: "Statistiques appliquées pour l'analyse de données",
      description: "Apprenez les concepts statistiques fondamentaux et leur application pratique",
      level: "Intermédiaire",
      duration: "6 semaines",
      modules: 6,
      totalHours: "~20h"
    },
    features: [
      {
        title: "Objectifs d'apprentissage",
        items: [
          "Comprendre les tests statistiques",
          "Interpréter les résultats d'analyses",
          "Choisir les bonnes méthodes",
          "Éviter les erreurs courantes"
        ]
      },
      {
        title: "Prérequis",
        items: [
          "Mathématiques de niveau lycée",
          "Notions de base en Python (optionnel)",
          "Curiosité pour l'analyse de données"
        ]
      },
      {
        title: "Applications",
        items: [
          "A/B Testing",
          "Études de marché",
          "Recherche scientifique",
          "Analyse business"
        ]
      }
    ]
  }), []);

  // Modules avec ES6 features
  const modules = [
    {
      id: "descriptive-stats",
      title: "Statistiques descriptives",
      description: "Mesures de tendance centrale et de dispersion",
      duration: "3h",
      completed: false,
      level: "beginner" as const,
      type: "theory" as const
    },
    {
      id: "probability",
      title: "Probabilités",
      description: "Concepts fondamentaux et distributions",
      duration: "4h",
      completed: false,
      level: "intermediate" as const,
      type: "theory" as const
    },
    {
      id: "hypothesis-testing",
      title: "Tests d'hypothèses",
      description: "Tests statistiques et p-values",
      duration: "3.5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "correlation-regression",
      title: "Corrélation et régression",
      description: "Relations entre variables",
      duration: "4h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "anova",
      title: "ANOVA",
      description: "Analyse de variance",
      duration: "3h",
      completed: false,
      level: "advanced" as const,
      type: "practice" as const
    },
    {
      id: "non-parametric",
      title: "Statistiques non-paramétriques",
      description: "Tests sans hypothèses de distribution",
      duration: "2.5h",
      completed: false,
      level: "advanced" as const,
      type: "project" as const
    }
  ];

  // Cas d'étude avec ES6 spread operator
  const caseStudies = [
    {
      title: "Analyse d'A/B Test",
      description: "Évaluez l'efficacité d'une nouvelle interface utilisateur",
      dataset: "E-commerce",
      techniques: ["Test t", "Chi-carré", "Analyse de variance"],
      difficulty: "Intermédiaire"
    },
    {
      title: "Étude de satisfaction client",
      description: "Analysez les facteurs influençant la satisfaction",
      dataset: "Enquête de satisfaction",
      techniques: ["Régression multiple", "Corrélation", "Tests non-paramétriques"],
      difficulty: "Avancé"
    },
    {
      title: "Prédiction de ventes",
      description: "Modélisez les ventes en fonction des variables marketing",
      dataset: "Données de ventes trimestrielles",
      techniques: ["Régression linéaire", "Analyse de tendance", "Prévision"],
      difficulty: "Intermédiaire"
    }
  ];


  return (
    <CourseLayout
      title="Statistiques appliquées pour l'analyse de données"
      categoryName="Statistiques"
      courseName="Statistiques appliquées"
    >
      <div className="space-y-8">
        <CourseHeroTemplate
          courseInfo={courseConfig.info}
          features={courseConfig.features}
          icon={BarChart3}
          gradientFrom="from-green-50"
          gradientTo="to-blue-50"
          iconColor="text-green-600"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="case-studies">Cas d'étude</TabsTrigger>
            <TabsTrigger value="tools">Outils</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Programme du cours</h2>
            <CourseModuleTemplate
              courseId="applied-statistics"
              modules={modules}
              primaryColor="green"
            />
          </TabsContent>
          
          <TabsContent value="case-studies" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Cas d'étude pratiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <CardDescription>{study.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dataset :</p>
                        <p className="text-sm text-gray-600">{study.dataset}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Techniques :</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {study.techniques.map((technique, techIndex) => (
                            <span key={techIndex} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {technique}
                            </span>
                          ))}
                        </div>
                      </div>
                      <CourseItemActions
                        courseId="applied-statistics"
                        itemId={study.title}
                        itemTitle={study.title}
                        startLabel="Commencer l'étude"
                        startIcon={<TrendingUp className="h-4 w-4" />}
                        startClassName="bg-green-600 text-white hover:bg-green-700"
                        className="mt-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Outils et logiciels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>Python & Scipy</CardTitle>
                      <CardDescription>Bibliothèques statistiques Python</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Utilisation de scipy.stats, pandas et matplotlib pour l'analyse statistique.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tests statistiques</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Visualisation de données</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Analyse de tendances</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>R (optionnel)</CardTitle>
                  <CardDescription>Environnement statistique</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Introduction aux analyses statistiques avec R pour ceux qui souhaitent découvrir.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">• Syntaxe spécialisée pour les statistiques</div>
                    <div className="text-sm">• Packages dédiés (ggplot2, dplyr)</div>
                    <div className="text-sm">• Intégration avec RStudio</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CourseLayout>
  );
};

export default AppliedStatistics;
