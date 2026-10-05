
import Layout from "@/components/layout/Layout";
import IntegralCalculusContent from "./integral-calculus/IntegralCalculusContent";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const IntegralCalculus = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Calcul Intégral"
          description="Découvrez les intégrales et leurs applications en statistiques et probabilités"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <IntegralCalculusContent />
        </div>
      </div>
    </Layout>
  );
};

export default IntegralCalculus;
