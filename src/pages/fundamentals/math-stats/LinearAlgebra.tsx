import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// L'introduction est chargée avec la page ; les sections suivantes sont chargées à la demande (ProgressiveSections)
import LinearAlgebraIntro from "./linear-algebra/LinearAlgebraIntro";
const VectorsSection = lazy(() => import("./linear-algebra/VectorsSection"));
const MatricesSection = lazy(() => import("./linear-algebra/MatricesSection"));
const MatrixTypesSection = lazy(() => import("./linear-algebra/MatrixTypesSection"));
const OperationsSection = lazy(() => import("./linear-algebra/OperationsSection"));
const DecompositionsSection = lazy(() => import("./linear-algebra/DecompositionsSection"));
const ApplicationsSection = lazy(() => import("./linear-algebra/ApplicationsSection"));
const InteractiveExercises = lazy(() => import("./linear-algebra/InteractiveExercises"));

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
            <ProgressiveSections>
              <LinearAlgebraIntro />
              <VectorsSection />
              <MatricesSection />
              <MatrixTypesSection />
              <OperationsSection />
              <DecompositionsSection />
              <ApplicationsSection />
              <InteractiveExercises />
            </ProgressiveSections>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LinearAlgebra;
