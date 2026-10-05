
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { QuizCard } from "@/components/ui/educational-cards";
import {
  GitBranch,
  Search,
  Sparkles,
  Eye,
  Code,
  BookOpen
} from "lucide-react";

// Import des composants modulaires
import UnsupervisedIntroSection from "./unsupervised/UnsupervisedIntroSection";
import ClusteringSection from "./unsupervised/ClusteringSection";
import ReductionSection from "./unsupervised/ReductionSection";
import UnsupervisedApplicationsSection from "./unsupervised/UnsupervisedApplicationsSection";
import UnsupervisedProjectsSection from "./unsupervised/UnsupervisedProjectsSection";
import UnsupervisedResourcesSection from "./unsupervised/UnsupervisedResourcesSection";

const UnsupervisedLearningCourse = () => {
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête du cours */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Search className="h-12 w-12" />
            Apprentissage Non Supervisé
          </CardTitle>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Explorez l'art de découvrir des motifs cachés dans les données, 
            comme un archéologue qui révèle les secrets d'une civilisation perdue !
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Badge className="bg-white text-green-600 text-sm px-4 py-2">
              <GitBranch className="h-4 w-4 mr-2" />
              Clustering
            </Badge>
            <Badge className="bg-white text-green-600 text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Réduction de Dimension
            </Badge>
            <Badge className="bg-white text-green-600 text-sm px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              Détection d'Anomalies
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="introduction" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Search className="h-5 w-5 mb-1" />
            Introduction
          </TabsTrigger>
          <TabsTrigger value="clustering" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <GitBranch className="h-5 w-5 mb-1" />
            Clustering
          </TabsTrigger>
          <TabsTrigger value="reduction" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Sparkles className="h-5 w-5 mb-1" />
            Réduction
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Eye className="h-5 w-5 mb-1" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <Code className="h-5 w-5 mb-1" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex flex-col items-center p-3 text-xs lg:text-sm">
            <BookOpen className="h-5 w-5 mb-1" />
            Ressources
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        <TabsContent value="introduction" className="mt-8">
          <UnsupervisedIntroSection />
        </TabsContent>

        <TabsContent value="clustering" className="mt-8">
          <ClusteringSection />
        </TabsContent>

        <TabsContent value="reduction" className="mt-8">
          <ReductionSection />
        </TabsContent>

        <TabsContent value="applications" className="mt-8">
          <UnsupervisedApplicationsSection />
        </TabsContent>

        <TabsContent value="projects" className="mt-8">
          <UnsupervisedProjectsSection />
        </TabsContent>

        <TabsContent value="resources" className="mt-8">
          <UnsupervisedResourcesSection />
          
          {/* Quiz bonus à la fin */}
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Quiz Final : Testez vos connaissances !</h3>
            
            <QuizCard
              question="Votre équipe doit analyser 1 million de tweets pour identifier les sujets tendances. Quelle approche recommanderiez-vous ?"
              options={[
                "K-means directement sur le texte brut",
                "TF-IDF + réduction (SVD tronquée) + clustering + analyse des termes dominants de chaque cluster",
                "Classification supervisée avec labels manuels",
                "Analyse de fréquence des mots uniquement"
              ]}
              correctAnswer={1}
              explanation="Une approche classique combine : 1) TF-IDF pour vectoriser le texte, 2) une réduction de dimension adaptée aux matrices creuses (TruncatedSVD, ou LSA ; la PCA exige de centrer les données, ce qui rendrait la matrice dense et trop lourde pour un million de messages), 3) un clustering pour grouper les sujets similaires, 4) l'analyse des termes les plus pondérés de chaque centroïde pour nommer les sujets. Des plongements de phrases (embeddings) suivis d'un clustering sont une alternative plus récente. Cette chaîne n'utilise aucune étiquette : c'est de l'apprentissage non supervisé."
              difficulty="difficile"
            />

            <QuizCard
              question="Dans quels cas l'apprentissage non supervisé est-il préférable au supervisé ?"
              options={[
                "Quand on a beaucoup de données étiquetées",
                "Quand on veut découvrir des structures inconnues ou quand l'étiquetage est coûteux/impossible",
                "Uniquement pour la visualisation de données",
                "Jamais, le supervisé est toujours meilleur"
              ]}
              correctAnswer={1}
              explanation="L'apprentissage non supervisé excelle quand : 1) On veut découvrir des patterns inconnus, 2) L'étiquetage est trop coûteux ou subjectif, 3) On explore des données pour comprendre leur structure, 4) On fait du preprocessing pour le supervisé. Il révèle des insights que l'humain n'aurait pas pensé à chercher !"
              difficulty="moyen"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnsupervisedLearningCourse;
