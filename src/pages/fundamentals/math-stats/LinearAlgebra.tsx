
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

import LinearAlgebraIntro from "./linear-algebra/LinearAlgebraIntro";
import VectorsSection from "./linear-algebra/VectorsSection";
import MatricesSection from "./linear-algebra/MatricesSection";
import OperationsSection from "./linear-algebra/OperationsSection";
import DecompositionsSection from "./linear-algebra/DecompositionsSection";
import ApplicationsSection from "./linear-algebra/ApplicationsSection";
import InteractiveExercises from "./linear-algebra/InteractiveExercises";

const LinearAlgebra = () => {

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Algèbre Linéaire"
          description="Le langage universel du machine learning : vecteurs, matrices et transformations expliqués simplement"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-16">
            <LinearAlgebraIntro />
            <VectorsSection />
            <MatricesSection />
            <OperationsSection />
            <DecompositionsSection />
            <ApplicationsSection />
            <InteractiveExercises />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LinearAlgebra;
