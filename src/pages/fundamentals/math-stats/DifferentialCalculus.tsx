import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// L'introduction est chargée avec la page ; les sections suivantes sont chargées à la demande (ProgressiveSections)
import DifferentialCalculusIntro from "./differential-calculus/DifferentialCalculusIntro";
const DerivativeConceptSection = lazy(() => import("./differential-calculus/DerivativeConceptSection"));
const DerivationRulesSection = lazy(() => import("./differential-calculus/DerivationRulesSection"));
const OptimizationSection = lazy(() => import("./differential-calculus/OptimizationSection"));
const GradientsSection = lazy(() => import("./differential-calculus/GradientsSection"));
const ExercisesSection = lazy(() => import("./differential-calculus/ExercisesSection"));

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
            <ProgressiveSections>
              <DifferentialCalculusIntro />
              <DerivativeConceptSection />
              <DerivationRulesSection />
              <OptimizationSection />
              <GradientsSection />
              <ExercisesSection />
            </ProgressiveSections>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DifferentialCalculus;
