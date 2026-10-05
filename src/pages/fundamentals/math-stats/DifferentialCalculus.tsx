
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

import DifferentialCalculusIntro from "./differential-calculus/DifferentialCalculusIntro";
import DerivativeConceptSection from "./differential-calculus/DerivativeConceptSection";
import DerivationRulesSection from "./differential-calculus/DerivationRulesSection";
import OptimizationSection from "./differential-calculus/OptimizationSection";
import GradientsSection from "./differential-calculus/GradientsSection";
import ExercisesSection from "./differential-calculus/ExercisesSection";

const DifferentialCalculus = () => {

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Calcul Différentiel"
          description="Les dérivées au service de l'optimisation et de l'apprentissage automatique"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-16">
            <DifferentialCalculusIntro />
            <DerivativeConceptSection />
            <DerivationRulesSection />
            <OptimizationSection />
            <GradientsSection />
            <ExercisesSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DifferentialCalculus;
