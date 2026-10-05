import ContentLayout from "@/components/layout/ContentLayout";
import ToolsContent from "@/components/tools/ToolsContent";
import { useToolsSidebar } from "@/components/tools/ToolsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { Code2 } from "lucide-react";

const ProgrammingToolsPage = () => {
  const sidebar = useToolsSidebar();

  return (
    <ContentLayout
      title="Langages de programmation"
      backLink={{ href: "/tools", label: "Retour aux outils" }}
      sidebar={sidebar}
    >
      <section className="w-full">
        <UnifiedHeroSection
          variant="page"
          title="Langages de programmation"
          description="Python, R, SQL, Julia et les autres : usage mesuré par les enquêtes, taille des écosystèmes de paquets et fiches de chaque langage pour la data science."
          icon={Code2}
        />
        <div className="container mx-auto px-4 py-8">
          <ToolsContent section="programming" />
        </div>
      </section>
    </ContentLayout>
  );
};

export default ProgrammingToolsPage;
