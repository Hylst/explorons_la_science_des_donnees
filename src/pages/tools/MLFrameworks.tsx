import ContentLayout from "@/components/layout/ContentLayout";
import ToolsContent from "@/components/tools/ToolsContent";
import { useToolsSidebar } from "@/components/tools/ToolsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { BrainCircuit } from "lucide-react";

const MLFrameworksPage = () => {
  const sidebar = useToolsSidebar();

  return (
    <ContentLayout
      title="Frameworks de Machine Learning"
      backLink={{ href: "/tools", label: "Retour aux outils" }}
      sidebar={sidebar}
    >
      <section className="w-full">
        <UnifiedHeroSection
          variant="page"
          title="Frameworks de Machine Learning"
          description="scikit-learn, TensorFlow, PyTorch, XGBoost et les autres bibliothèques de machine learning : usage, forces et exemples de code."
          icon={BrainCircuit}
        />
        <div className="container mx-auto px-4 py-8">
          <ToolsContent section="ml" />
        </div>
      </section>
    </ContentLayout>
  );
};

export default MLFrameworksPage;
