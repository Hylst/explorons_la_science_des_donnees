
import ContentLayout from "@/components/layout/ContentLayout";
import PageHeader from "@/components/layout/PageHeader";
import { createStandardSidebar } from "@/components/layout/StandardSidebar";
import {
  Server,
  Cloud,
  BarChart3,
  Shield,
  Zap,
  Code,
  BookOpen,
  Brain,
  TrendingUp
} from "lucide-react";

// Composants des sections
import DatabasesIntroSection from "./components/DatabasesIntroSection";
import SQLFundamentalsSection from "./components/SQLFundamentalsSection";
import NoSQLSection from "./components/NoSQLSection";
import DataModelingSection from "./components/DataModelingSection";
import PerformanceOptimizationSection from "./components/PerformanceOptimizationSection";
import SecuritySection from "./components/SecuritySection";
import PracticalExercisesSection from "./components/PracticalExercisesSection";
import TrendsSection from "./components/TrendsSection";
import BigDataSection from "./components/BigDataSection";

const DatabasesRefactored = () => {
  const sidebar = createStandardSidebar({
    currentPage: "databases",
    sections: [
      {
        title: "Introduction aux bases de données",
        href: "#databases-intro",
        icon: <BookOpen className="h-4 w-4" />
      },
      {
        title: "Fondamentaux SQL",
        href: "#sql-fundamentals",
        icon: <Server className="h-4 w-4" />
      },
      {
        title: "Bases NoSQL",
        href: "#nosql",
        icon: <Cloud className="h-4 w-4" />
      },
      {
        title: "Modélisation des données",
        href: "#data-modeling",
        icon: <Brain className="h-4 w-4" />
      },
      {
        title: "Optimisation et performance",
        href: "#performance",
        icon: <Zap className="h-4 w-4" />
      },
      {
        title: "Sécurité et gouvernance",
        href: "#security",
        icon: <Shield className="h-4 w-4" />
      },
      {
        title: "Big Data et écosystème",
        href: "#big-data",
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        title: "Exercices pratiques",
        href: "#exercises",
        icon: <Code className="h-4 w-4" />
      },
      {
        title: "Tendances et évolutions",
        href: "#trends",
        icon: <TrendingUp className="h-4 w-4" />
      }
    ]
  });

  return (
    <ContentLayout 
      title="Bases de Données" 
      backLink={{ href: "/fundamentals", label: "Retour aux fondamentaux" }}
      sidebar={sidebar}
    >
      <section className="py-8 space-y-16">
        <PageHeader
          title="Bases de Données en Data Science"
          description="Explorez l'art de stocker, gérer et exploiter les données. Des concepts fondamentaux aux architectures distribuées modernes, découvrez tout l'écosystème des bases de données."
        />

        <DatabasesIntroSection />
        <SQLFundamentalsSection />
        <NoSQLSection />
        <DataModelingSection />
        <PerformanceOptimizationSection />
        <SecuritySection />
        <BigDataSection />
        <PracticalExercisesSection />
        <TrendsSection />
      </section>
    </ContentLayout>
  );
};

export default DatabasesRefactored;
