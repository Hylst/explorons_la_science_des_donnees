import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import ProgressiveSections from "@/components/layout/ProgressiveSections";

// L'introduction est chargée avec la page ; les sections suivantes (formules KaTeX, graphiques Recharts)
// sont chargées à la demande, pour que le haut de la page s'affiche sans les attendre
import ProbabilityIntro from "./probability/components/ProbabilityIntro";
const ProbabilityBasics = lazy(() => import("./probability/components/ProbabilityBasics"));
const ConditionalProbabilitySection = lazy(() => import("./probability/components/ConditionalProbabilitySection"));
const BayesTheoremSection = lazy(() => import("./probability/components/BayesTheoremSection"));
const ProbabilityDistributionsSection = lazy(() => import("./probability/components/ProbabilityDistributionsSection"));
const RandomVariables = lazy(() => import("./probability/components/RandomVariables"));
const GaussianDistributionSection = lazy(() => import("./probability/components/GaussianDistributionSection"));
const PracticalApplicationsSection = lazy(() => import("./probability/components/PracticalApplicationsSection"));
const InteractiveQuizSection = lazy(() => import("./probability/components/InteractiveQuizSection"));

/**
 * Composant principal de la page Théorie des Probabilités
 * Présente les concepts fondamentaux des probabilités avec des exemples interactifs
 */
const ProbabilityTheory = () => {
  
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Théorie des Probabilités"
          description="Quantifier l'incertitude : les bases des probabilités pour la data science"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ProgressiveSections>
            {/* Section d'introduction aux probabilités */}
            <ProbabilityIntro />

            {/* Concepts de base et règles fondamentales */}
            <ProbabilityBasics />

            {/* Probabilité conditionnelle avec exemples interactifs */}
            <ConditionalProbabilitySection />

            {/* Variables aléatoires et distributions */}
            <RandomVariables />

            {/* Distributions de probabilité principales */}
            <ProbabilityDistributionsSection />

            {/* Distribution gaussienne et applications */}
            <GaussianDistributionSection />

            {/* Théorème de Bayes et applications */}
            <BayesTheoremSection />

            {/* Applications pratiques */}
            <PracticalApplicationsSection />

            {/* Quiz interactif */}
            <InteractiveQuizSection />
          </ProgressiveSections>
        </div>
      </div>
    </Layout>
  );
};

export default ProbabilityTheory;
