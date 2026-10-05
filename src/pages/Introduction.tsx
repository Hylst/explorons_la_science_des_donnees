
import ContentLayout from "@/components/layout/ContentLayout";
import IntroductionContent from "@/components/introduction/IntroductionContent";
import { LightbulbIcon, History, PuzzleIcon, BookOpen, Brain, Briefcase, Book } from "lucide-react";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import IntroProgressBar from "@/components/introduction/IntroProgressBar";

export type IntroSectionType = "definition" | "history" | "pillars" | "lifecycle" | "applications" | "careers" | "resources";

const Introduction = () => {
  const sections: IntroSectionType[] = ["definition", "history", "pillars", "lifecycle", "applications", "careers", "resources"];
  const { currentSection } = useSectionTracker<IntroSectionType>(sections);
  
  // Utilise le hook de smooth scrolling
  useSmoothScroll();
  
  const sectionTitles = [
    { id: "definition", title: "Qu'est-ce que la Data Science ?", icon: <LightbulbIcon className="h-4 w-4" /> },
    { id: "history", title: "Histoire et évolution", icon: <History className="h-4 w-4" /> },
    { id: "pillars", title: "Piliers de la Data Science", icon: <PuzzleIcon className="h-4 w-4" /> },
    { id: "lifecycle", title: "Cycle de vie d'un projet", icon: <BookOpen className="h-4 w-4" /> },
    { id: "applications", title: "Applications et cas d'usage", icon: <Brain className="h-4 w-4" /> },
    { id: "careers", title: "Métiers de la Data Science", icon: <Briefcase className="h-4 w-4" /> },
    { id: "resources", title: "Ressources pour débuter", icon: <Book className="h-4 w-4" /> },
  ];

  const sidebarItems = sectionTitles.map(item => ({
    title: item.title,
    href: `#${item.id}`,
    isActive: currentSection === item.id,
    icon: item.icon,
  }));

  const handleProgressClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ContentLayout 
      title="Introduction à la Data Science" 
      backLink={{ href: "/", label: "Retour à l'accueil" }}
      sidebar={{ items: sidebarItems }}
    >
      <section className="py-6">
        <UnifiedHeroSection
          variant="page"
          title="Introduction à la Data Science"
          description="Les fondements de la data science : son histoire, ses applications et les compétences utiles pour s'y former."
        />
        <IntroductionContent />
      </section>
      
      <IntroProgressBar 
        currentSection={currentSection} 
        sections={sectionTitles}
        onClick={handleProgressClick}
      />
    </ContentLayout>
  );
};

export default Introduction;
