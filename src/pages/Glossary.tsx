import { lazy } from "react";
import LazyBlock from "@/components/layout/LazyBlock";
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// Les définitions (le plus gros du poids de la page) arrivent avec l'explorateur, chargé à part :
// le titre s'affiche sans les attendre. La marque data-sections-pending fait attendre ScrollManager
// (restauration de la position au retour) jusqu'à ce que les fiches soient là.
const GlossaryExplorer = lazy(() => import("@/components/glossary/GlossaryExplorer"));

const Glossary = () => (
  <Layout>
    <div className="min-h-screen">
      <UnifiedHeroSection
        variant="page"
        title="Glossaire Data Science"
        description="Un glossaire interactif des concepts de la data science"
      />
      <LazyBlock>
        <GlossaryExplorer />
      </LazyBlock>
    </div>
  </Layout>
);

export default Glossary;
