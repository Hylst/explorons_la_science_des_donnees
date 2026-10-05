import ContentLayout from "@/components/layout/ContentLayout";
import ToolsContent from "@/components/tools/ToolsContent";
import { useToolsSidebar } from "@/components/tools/ToolsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { Database } from "lucide-react";

const DataProcessingToolsPage = () => {
  const sidebar = useToolsSidebar();

  return (
    <ContentLayout
      title="Outils de traitement des données"
      backLink={{ href: "/tools", label: "Retour aux outils" }}
      sidebar={sidebar}
    >
      <section className="w-full">
        <UnifiedHeroSection
          variant="page"
          title="Outils de traitement des données"
          description="Bibliothèques et moteurs pour charger, transformer et analyser des données : pandas, Spark et les autres outils du traitement de données."
          icon={Database}
        />
        <div className="container mx-auto px-4 py-8">
          <ToolsContent section="data" />
        </div>
      </section>
    </ContentLayout>
  );
};

export default DataProcessingToolsPage;
