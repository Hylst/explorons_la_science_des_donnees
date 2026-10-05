import ContentLayout from "@/components/layout/ContentLayout";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, ChartBar } from "lucide-react";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import QuizCategoriesSection from "@/components/quiz/QuizCategoriesSection";
import QuizStatsSection from "@/components/quiz/QuizStatsSection";
import QuizHistorySection from "@/components/quiz/QuizHistorySection";

type SectionType = "categories" | "stats" | "history";

const HERO_FEATURES = [
  "Quiz organisés par thèmes",
  "Explications détaillées",
  "Suivi de progression",
  "Scores et recommandations"
];

/**
 * Quiz page component - Main entry point for the quiz/evaluation section
 * Provides access to different quiz categories covering all data science topics
 */
const QuizPage = () => {
  const sections: SectionType[] = ["categories", "stats", "history"];
  const { currentSection } = useSectionTracker<SectionType>(sections);
  
  // Enable smooth scrolling for navigation
  useSmoothScroll();

  // Sidebar navigation items
  const sidebarItems = [
    { 
      title: "Catégories de Quiz", 
      href: "#categories", 
      isActive: currentSection === "categories",
      icon: <Brain className="h-4 w-4" /> 
    },
    { 
      title: "Mes Statistiques", 
      href: "#stats", 
      isActive: currentSection === "stats",
      icon: <BarChart3 className="h-4 w-4" /> 
    },
    { 
      title: "Historique", 
      href: "#history", 
      isActive: currentSection === "history",
      icon: <ChartBar className="h-4 w-4" /> 
    },
  ];

  return (
    <ContentLayout 
      title="Quiz & Évaluation" 
      backLink={{ href: "/", label: "Retour à l'accueil" }}
      sidebar={{ items: sidebarItems }}
    >
      {/* Hero Section */}
      <UnifiedHeroSection
        variant="page"
        title="Quiz & Évaluation"
        subtitle="Testez vos connaissances en data science"
        description="Évaluez votre niveau dans tous les domaines de la data science avec nos quiz interactifs. Obtenez des scores détaillés et des explications pour progresser efficacement."
        actions={[
          { label: "Commencer un Quiz", to: "#categories" },
          { label: "Voir mes Statistiques", to: "#stats", variant: "outline" }
        ]}
        className="mb-12"
      >
        <ul className="flex flex-wrap justify-center gap-3">
          {HERO_FEATURES.map((feature) => (
            <li key={feature}>
              <Badge variant="outline" className="text-sm px-4 py-2">{feature}</Badge>
            </li>
          ))}
        </ul>
      </UnifiedHeroSection>

      {/* Quiz Categories Section */}
      <section id="categories" className="py-8">
        <QuizCategoriesSection />
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-8">
        <QuizStatsSection />
      </section>

      {/* History Section */}
      <section id="history" className="py-8">
        <QuizHistorySection />
      </section>
    </ContentLayout>
  );
};

export default QuizPage;