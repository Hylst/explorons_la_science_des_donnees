
import ContentLayout from "@/components/layout/ContentLayout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import ProgrammingSection from "@/components/fundamentals/ProgrammingSection";
import { createStandardSidebar } from "@/components/layout/StandardSidebar";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Code, BookOpen, Cpu, Zap, Users, Rocket, Trophy, Terminal } from "lucide-react";

// Identifiants présents dans ProgrammingSection et ses composants : le suivi de section les observe au défilement
const SECTIONS = [
  "programming-intro",
  "python-masterclass",
  "language-comparison",
  "practical-exercises",
  "advanced-concepts",
  "interactive-challenges",
  "code-editor",
  "resources"
];

const standardSidebar = createStandardSidebar({
  currentPage: "programming",
  sections: [
    { title: "Introduction à la programmation", href: "#programming-intro", icon: <BookOpen className="h-4 w-4" /> },
    { title: "Python pour la Data Science", href: "#python-masterclass", icon: <Code className="h-4 w-4" /> },
    { title: "Comparaison des langages", href: "#language-comparison", icon: <Cpu className="h-4 w-4" /> },
    { title: "Exercices pratiques", href: "#practical-exercises", icon: <Zap className="h-4 w-4" /> },
    { title: "Concepts avancés", href: "#advanced-concepts", icon: <Rocket className="h-4 w-4" /> },
    { title: "Défis interactifs", href: "#interactive-challenges", icon: <Trophy className="h-4 w-4" /> },
    { title: "Éditeur de code", href: "#code-editor", icon: <Terminal className="h-4 w-4" /> },
    { title: "Ressources et communautés", href: "#resources", icon: <Users className="h-4 w-4" /> }
  ]
});

const Programming = () => {
  const { currentSection } = useSectionTracker(SECTIONS);
  useSmoothScroll();

  const sidebar = {
    items: standardSidebar.items.map((item) => ({ ...item, isActive: item.href === `#${currentSection}` }))
  };

  return (
    <ContentLayout
      title="Programmation"
      backLink={{ href: "/fundamentals", label: "Retour aux fondamentaux" }}
      sidebar={sidebar}
    >
      <UnifiedHeroSection
        variant="page"
        title="La programmation en Data Science"
        description="Les langages et outils qui forment le socle technique de la data science, de l'analyse exploratoire au déploiement de modèles."
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ProgrammingSection />
      </div>
    </ContentLayout>
  );
};

export default Programming;
