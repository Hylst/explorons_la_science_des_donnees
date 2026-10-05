import { useState, useMemo } from "react";
import CourseLayout from "@/components/layout/CourseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourseHeroTemplate from "@/components/courses/CourseHeroTemplate";
import CourseModuleTemplate from "@/components/courses/CourseModuleTemplate";
import CourseItemActions from "@/components/courses/CourseItemActions";
import { BarChart3, PieChart, TrendingUp, Palette } from "lucide-react";

const DataVisualization = () => {
  const [activeTab, setActiveTab] = useState("modules");

  // Configuration du cours avec ES6
  const courseConfig = useMemo(() => ({
    info: {
      title: "Visualisation de données avancée",
      description: "Créez des visualisations impactantes avec Python, D3.js et les outils modernes",
      level: "Intermédiaire",
      duration: "6 semaines", 
      modules: 7,
      totalHours: "~28h"
    },
    features: [
      {
        title: "Technologies abordées",
        items: [
          "Matplotlib & Seaborn avancés",
          "Plotly interactif",
          "Altair & Vega-Lite",
          "D3.js pour le web"
        ]
      },
      {
        title: "Prérequis",
        items: [
          "Python intermédiaire",
          "Pandas pour manipulation",
          "Notions de statistiques",
          "HTML/CSS de base (D3.js)"
        ]
      },
      {
        title: "Livrables projets",
        items: [
          "Dashboard interactif",
          "Visualisation web D3.js",
          "Rapport d'analyse visuel",
          "Portfolio de visualisations"
        ]
      }
    ]
  }), []);

  // Modules avec ES6 features
  const modules = [
    {
      id: "dataviz-principles",
      title: "Principes de visualisation",
      description: "Théorie de la perception visuelle et bonnes pratiques",
      duration: "2.5h",
      completed: false,
      level: "beginner" as const,
      type: "theory" as const
    },
    {
      id: "matplotlib-advanced",
      title: "Matplotlib avancé",
      description: "Personnalisation poussée et optimisation",
      duration: "4h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "seaborn-statistical",
      title: "Seaborn pour visualisations statistiques",
      description: "Graphiques statistiques élégants et informatifs",
      duration: "3.5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "plotly-interactive",
      title: "Plotly interactif",
      description: "Visualisations interactives et dashboards",
      duration: "5h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "altair-grammar",
      title: "Altair et Grammar of Graphics",
      description: "Approche déclarative de la visualisation",
      duration: "3h",
      completed: false,
      level: "intermediate" as const,
      type: "practice" as const
    },
    {
      id: "d3js-web",
      title: "D3.js pour le web",
      description: "Visualisations web customisées avec D3.js",
      duration: "6h",
      completed: false,
      level: "advanced" as const,
      type: "project" as const
    },
    {
      id: "dashboard-design",
      title: "Design de tableaux de bord",
      description: "UX/UI pour dashboards analytics",
      duration: "4h",
      completed: false,
      level: "advanced" as const,
      type: "project" as const
    }
  ];

  // Projets pratiques avec ES6 
  const practicalProjects = [
    {
      title: "Dashboard COVID-19",
      description: "Tableau de bord interactif sur des données COVID-19 archivées (Johns Hopkins CSSE jusqu'au 10 mars 2023, ou jeu OMS hebdomadaire)",
      tools: "Plotly Dash, Pandas",
      techniques: ["Time series", "Cartes choroplèthes", "Métriques KPI"],
      difficulty: "Intermédiaire",
      estimatedTime: "12h"
    },
    {
      title: "Visualisation D3.js Network",
      description: "Graphique de réseau social interactif",
      tools: "D3.js, JavaScript, HTML/CSS",
      techniques: ["Force layout", "Interactions", "Animations"],
      difficulty: "Avancé",
      estimatedTime: "15h"
    },
    {
      title: "Rapport d'analyse financière",
      description: "Analyse visuelle de données boursières",
      tools: "Matplotlib, mplfinance, Plotly",
      techniques: ["Candlestick charts", "Corrélations", "Analyse technique"],
      difficulty: "Intermédiaire",
      estimatedTime: "8h"
    }
  ];


  return (
    <CourseLayout
      title="Visualisation de données avancée"
      categoryName="Visualisation"
      courseName="Visualisation de données avancée"
    >
      <div className="space-y-8">
        <CourseHeroTemplate
          courseInfo={courseConfig.info}
          features={courseConfig.features}
          icon={BarChart3}
          gradientFrom="from-emerald-50"
          gradientTo="to-teal-50"
          iconColor="text-emerald-600"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Parcours de formation</h2>
            <CourseModuleTemplate
              courseId="data-visualization"
              modules={modules}
              primaryColor="emerald"
            />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Projets de portfolio</h2>
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
                        <p className="text-sm font-medium text-gray-700">Outils :</p>
                        <p className="text-sm text-gray-600">{project.tools}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Techniques :</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.techniques.map((technique, techIndex) => (
                            <span key={techIndex} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
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
                        courseId="data-visualization"
                        itemId={project.title}
                        itemTitle={project.title}
                        startLabel="Créer la visualisation"
                        startIcon={<Palette className="h-4 w-4" />}
                        startClassName="bg-emerald-600 text-white hover:bg-emerald-700"
                        className="mt-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Galerie d'inspiration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>Types de graphiques</CardTitle>
                      <CardDescription>Choisir la bonne visualisation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Guide des types de graphiques selon vos données et objectifs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Comparaisons (barres, colonnes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Évolutions (lignes, aires)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Compositions (secteurs, treemap)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ressources design</CardTitle>
                  <CardDescription>Palettes et inspirations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Ressources pour créer des visualisations esthétiques et efficaces.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">• ColorBrewer (palettes scientifiques)</div>
                    <div className="text-sm">• Observable notebooks (exemples D3)</div>
                    <div className="text-sm">• Matplotlib gallery</div>
                    <div className="text-sm">• The Pudding (storytelling visuel)</div>
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

export default DataVisualization;