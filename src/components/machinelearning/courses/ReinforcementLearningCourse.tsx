
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Zap, Code, Trophy, Gamepad2 } from "lucide-react";

// Import des composants modulaires
import ReinforcementIntroSection from "./reinforcement/ReinforcementIntroSection";
import ConceptsSection from "./reinforcement/ConceptsSection";
import AlgorithmsSection from "./reinforcement/AlgorithmsSection";
import ReinforcementApplicationsSection from "./reinforcement/ReinforcementApplicationsSection";
import ReinforcementProjectsSection from "./reinforcement/ReinforcementProjectsSection";
import ReinforcementResourcesSection from "./reinforcement/ReinforcementResourcesSection";

const ReinforcementLearningCourse = () => {
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête du cours */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="h-12 w-12" />
            Apprentissage par Renforcement
          </CardTitle>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Découvrez comment les machines apprennent à prendre des décisions optimales 
            dans des environnements complexes, de la même façon qu'un enfant apprend à marcher !
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Badge className="bg-white text-purple-600 text-sm px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Prise de Décision
            </Badge>
            <Badge className="bg-white text-purple-600 text-sm px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Apprentissage Adaptatif
            </Badge>
            <Badge className="bg-white text-purple-600 text-sm px-4 py-2">
              <Gamepad2 className="h-4 w-4 mr-2" />
              IA de Jeux
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
          <TabsTrigger value="concepts" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Target className="h-5 w-5 mb-1" />
            Concepts
          </TabsTrigger>
          <TabsTrigger value="algorithms" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Zap className="h-5 w-5 mb-1" />
            Algorithmes
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Gamepad2 className="h-5 w-5 mb-1" />
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
          <ReinforcementIntroSection />
        </TabsContent>

        <TabsContent value="concepts" className="mt-8">
          <ConceptsSection />
        </TabsContent>

        <TabsContent value="algorithms" className="mt-8">
          <AlgorithmsSection />
        </TabsContent>

        <TabsContent value="applications" className="mt-8">
          <ReinforcementApplicationsSection />
        </TabsContent>

        <TabsContent value="projects" className="mt-8">
          <ReinforcementProjectsSection />
        </TabsContent>

        <TabsContent value="resources" className="mt-8">
          <ReinforcementResourcesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReinforcementLearningCourse;
