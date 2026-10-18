import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// L'introduction est chargée avec la page ; les sections suivantes sont chargées à la demande (ProgressiveSections)
import IntegralCalculusContent from "./integral-calculus/IntegralCalculusContent";
const TechniquesSection = lazy(() => import("./integral-calculus/TechniquesSection"));
const NumericalSection = lazy(() => import("./integral-calculus/NumericalSection"));
const ImproperSection = lazy(() => import("./integral-calculus/ImproperSection"));
const MultipleSection = lazy(() => import("./integral-calculus/MultipleSection"));
const ApplicationsExercisesSection = lazy(() => import("./integral-calculus/ApplicationsExercisesSection"));

const IntegralCalculus = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Calcul intégral"
          description="Découvrez les intégrales et leurs applications en statistiques et probabilités"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-12">
            <ProgressiveSections>
              <IntegralCalculusContent />
              <TechniquesSection />
              <NumericalSection />
              <ImproperSection />
              <MultipleSection />
              <ApplicationsExercisesSection />
            </ProgressiveSections>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IntegralCalculus;
