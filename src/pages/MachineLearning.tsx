
import ContentLayout from "@/components/layout/ContentLayout";
import { lazy } from "react";
import LazyBlock from "@/components/layout/LazyBlock";
import { MachineLearningContextProvider } from "@/components/machinelearning/MachineLearningContext";
import { BrainCircuit, Network, GitBranch, BarChart3, Cpu, Code, GraduationCap } from "lucide-react";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

// Contenu (graphiques Recharts) chargé après le bandeau, qui s'affiche sans l'attendre
const MachineLearningContentRefactored = lazy(() => import("@/components/machinelearning/MachineLearningContentRefactored"));

type MLSectionType = "introduction" | "advanced-courses" | "supervised" | "unsupervised" | "evaluation" | "deep-learning" | "practical-exercises";

const MachineLearning = () => {
  const sections: MLSectionType[] = ["introduction", "advanced-courses", "supervised", "unsupervised", "evaluation", "deep-learning", "practical-exercises"];
  const { currentSection } = useSectionTracker<MLSectionType>(sections);
  
  // Utilise le hook de smooth scrolling
  useSmoothScroll();

  const sidebarItems = [
    {
      title: "Introduction au ML",
      href: "#introduction",
      isActive: currentSection === "introduction",
      icon: <BrainCircuit className="h-4 w-4" />,
    },
    {
      title: "Cours Approfondis",
      href: "#advanced-courses",
      isActive: currentSection === "advanced-courses",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      title: "Apprentissage supervisé",
      href: "#supervised",
      isActive: currentSection === "supervised",
      icon: <Network className="h-4 w-4" />,
    },
    {
      title: "Apprentissage non supervisé",
      href: "#unsupervised",
      isActive: currentSection === "unsupervised",
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      title: "Évaluation des modèles",
      href: "#evaluation",
      isActive: currentSection === "evaluation",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Deep Learning",
      href: "#deep-learning",
      isActive: currentSection === "deep-learning",
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      title: "Exercices pratiques",
      href: "#practical-exercises",
      isActive: currentSection === "practical-exercises",
      icon: <Code className="h-4 w-4" />,
    },
  ];

  return (
    <MachineLearningContextProvider>
      <ContentLayout 
        title="Machine Learning" 
        backLink={{ href: "/tools", label: "Retour aux outils" }}
        sidebar={{ items: sidebarItems }}
      >
        <section className="py-8">
          <UnifiedHeroSection
            variant="page"
            title="Machine Learning"
            description="Explorez l'art de l'apprentissage automatique avec des cours interactifs, des exercices pratiques et des projets concrets."
            icon={BrainCircuit}
          />
          <LazyBlock>
            <MachineLearningContentRefactored />
          </LazyBlock>
        </section>
      </ContentLayout>
    </MachineLearningContextProvider>
  );
};

export default MachineLearning;
