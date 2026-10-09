
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, BarChart3, TrendingUp, Code, Trophy, Users } from "lucide-react";
import { usePersistedTab } from "@/hooks/use-persisted-tab";

// Import des composants modulaires
import SupervisedIntroSection from "./supervised/SupervisedIntroSection";
import ClassificationSection from "./supervised/ClassificationSection";
import RegressionSection from "./supervised/RegressionSection";
import SupervisedApplicationsSection from "./supervised/SupervisedApplicationsSection";
import SupervisedProjectsSection from "./supervised/SupervisedProjectsSection";
import SupervisedResourcesSection from "./supervised/SupervisedResourcesSection";

const SupervisedLearningCourse = () => {
  const [activeTab, setActiveTab] = usePersistedTab("supervised-learning-tab", "introduction");

  // Le fil d'Ariane est affiché une seule fois, par la page (pages/machine-learning/SupervisedLearning.tsx)
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête du cours */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Target className="h-12 w-12" />
            Apprentissage Supervisé
          </CardTitle>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Apprendre à prédire à partir d'exemples étiquetés : de la classification de courriels
            à l'estimation de prix.
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Badge className="bg-white text-blue-600 text-sm px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Classification
            </Badge>
            <Badge className="bg-white text-blue-600 text-sm px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Régression
            </Badge>
            <Badge className="bg-white text-blue-600 text-sm px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Données Étiquetées
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="introduction" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Brain className="h-5 w-5 mb-1" />
            Introduction
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Target className="h-5 w-5 mb-1" />
            Classification
          </TabsTrigger>
          <TabsTrigger value="regression" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <TrendingUp className="h-5 w-5 mb-1" />
            Régression
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <BarChart3 className="h-5 w-5 mb-1" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Code className="h-5 w-5 mb-1" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Trophy className="h-5 w-5 mb-1" />
            Ressources
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        <TabsContent value="introduction" className="mt-8">
          <SupervisedIntroSection />
        </TabsContent>

        <TabsContent value="classification" className="mt-8">
          <ClassificationSection />
        </TabsContent>

        <TabsContent value="regression" className="mt-8">
          <RegressionSection />
        </TabsContent>

        <TabsContent value="applications" className="mt-8">
          <SupervisedApplicationsSection />
        </TabsContent>

        <TabsContent value="projects" className="mt-8">
          <SupervisedProjectsSection />
        </TabsContent>

        <TabsContent value="resources" className="mt-8">
          <SupervisedResourcesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisedLearningCourse;
