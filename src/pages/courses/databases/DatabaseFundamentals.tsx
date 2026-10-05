import { useState, useMemo } from "react";
import CourseLayout from "@/components/layout/CourseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import CourseModuleTemplate from "@/components/courses/CourseModuleTemplate";
import CourseItemActions from "@/components/courses/CourseItemActions";
import { Database, Server, Shield } from "lucide-react";

const DatabaseFundamentals = () => {
  const [activeTab, setActiveTab] = useState("modules");

  // Configuration du cours avec ES6
  const courseConfig = useMemo(() => ({
    info: {
      title: "Fondamentaux des bases de données",
      description: "Découvrez SQL, NoSQL et la gestion de données pour la Data Science",
      level: "Débutant",
      duration: "5 semaines",
      modules: 6,
      totalHours: "~22h"
    },
    features: [
      {
        title: "Compétences techniques",
        items: [
          "SQL avancé et optimisation",
          "Modélisation de données",
          "NoSQL (MongoDB, Redis)",
          "Performance et indexation"
        ]
      },
      {
        title: "Prérequis",
        items: [
          "Notions de base en informatique",
          "Logique et raisonnement",
          "Curiosité pour les données"
        ]
      },
      {
        title: "Applications pratiques",
        items: [
          "Conception de schémas",
          "Requêtes complexes",
          "Migration de données",
          "Sécurité et sauvegarde"
        ]
      }
    ]
  }), []);

  // Modules avec ES6 features
  const modules = [
    {
      id: "db-intro",
      title: "Introduction aux bases de données",
      description: "Concepts fondamentaux et types de bases de données",
      duration: "2h",
      completed: false,
      level: "beginner" as const,
      type: "theory" as const
    },
    {
      id: "sql-basics",
      title: "SQL - Les fondamentaux",
      description: "SELECT, INSERT, UPDATE, DELETE et jointures",
      duration: "4h",
      completed: false,
      level: "beginner" as const,
      type: "practice" as const
    },
    {
      id: "data-modeling",
      title: "Modélisation de données",
      description: "Conception de schémas et normalisation",
      duration: "3h",
      completed: false,
      level: "intermediate" as const,
      type: "theory" as const
    },
    {
      id: "advanced-sql",
      title: "SQL avancé",
      description: "Fonctions analytiques, CTE et optimisation",
      duration: "5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "nosql-intro",
      title: "Introduction au NoSQL",
      description: "MongoDB, Redis et bases orientées document",
      duration: "3.5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "performance",
      title: "Performance et indexation",
      description: "Optimisation des requêtes et stratégies d'indexation",
      duration: "4h",
      completed: false,
      level: "advanced" as const,
      type: "practice" as const
    }
  ];

  // Projets pratiques avec ES6 
  const practicalProjects = [
    {
      title: "E-commerce Database",
      description: "Conception complète d'une base de données e-commerce",
      schema: "Produits, Commandes, Clients",
      techniques: ["Modélisation", "SQL avancé", "Indexation"],
      difficulty: "Intermédiaire",
      estimatedTime: "8h"
    },
    {
      title: "Analytics Dashboard Data",
      description: "Structure de données pour tableau de bord analytique",
      schema: "Événements, Métriques, Utilisateurs",
      techniques: ["NoSQL", "Agrégations", "Time-series"],
      difficulty: "Avancé",
      estimatedTime: "6h"
    },
    {
      title: "Migration SQL vers NoSQL",
      description: "Migration d'une base relationnelle vers MongoDB",
      schema: "Blog, Articles, Commentaires",
      techniques: ["Migration", "Document design", "Performances"],
      difficulty: "Avancé",
      estimatedTime: "10h"
    }
  ];


  return (
    <CourseLayout
      title="Fondamentaux des bases de données"
      categoryName="Bases de données"
      courseName="Fondamentaux des bases de données"
    >
      <div className="space-y-8">
        <UnifiedHeroSection
          variant="course"
          titleAs="h2"
          title={courseConfig.info.title}
          description={courseConfig.info.description}
          icon={Database}
          courseInfo={{
            level: courseConfig.info.level,
            duration: courseConfig.info.duration,
            modules: courseConfig.info.modules,
            totalHours: courseConfig.info.totalHours
          }}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="tools">Outils</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Programme d'apprentissage</h2>
            <CourseModuleTemplate
              courseId="database-fundamentals"
              modules={modules}
              primaryColor="indigo"
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
                        <p className="text-sm font-medium text-gray-700">Schéma :</p>
                        <p className="text-sm text-gray-600">{project.schema}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Techniques :</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.techniques.map((technique, techIndex) => (
                            <span key={techIndex} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
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
                        courseId="database-fundamentals"
                        itemId={project.title}
                        itemTitle={project.title}
                        startLabel="Commencer le projet"
                        startIcon={<Database className="h-4 w-4" />}
                        startClassName="bg-indigo-600 text-white hover:bg-indigo-700"
                        className="mt-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Outils et environnements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Server className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>Bases relationnelles</CardTitle>
                      <CardDescription>PostgreSQL, MySQL, SQLite</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Apprenez avec les SGBD les plus utilisés en production.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">PostgreSQL (principal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">MySQL (comparaison)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">SQLite (développement)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <CardTitle>Bases NoSQL</CardTitle>
                      <CardDescription>MongoDB, Redis, Elasticsearch</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Découvrez les alternatives NoSQL pour des cas d'usage spécifiques.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">• MongoDB (documents)</div>
                    <div className="text-sm">• Redis (cache/sessions)</div>
                    <div className="text-sm">• Elasticsearch (recherche)</div>
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

export default DatabaseFundamentals;