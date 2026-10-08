import ContentLayout from "@/components/layout/ContentLayout";
import { lazy } from "react";
import LazyBlock from "@/components/layout/LazyBlock";
import { useToolsSidebar } from "@/components/tools/ToolsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { LineChart } from "lucide-react";

// Section (graphiques Recharts) chargée après le bandeau, qui s'affiche sans l'attendre
const VisualizationTools = lazy(() => import("@/components/tools/sections/VisualizationTools"));

const DataVisualizationTools = () => {
  const sidebar = useToolsSidebar();

  return (
    <ContentLayout 
      title="Outils de Visualisation de Données" 
      backLink={{ href: "/tools", label: "Retour aux outils" }}
      sidebar={sidebar}
    >
      <section className="w-full">
        <UnifiedHeroSection
          variant="page"
          title="Outils de Visualisation"
          description="Bibliothèques, frameworks et plateformes pour créer des visualisations de données claires et interactives."
          icon={LineChart}
        />
        <div className="container mx-auto px-4 py-8">
          <LazyBlock>
            <VisualizationTools />
          </LazyBlock>
        </div>
      </section>
    </ContentLayout>
  );
};

export default DataVisualizationTools;