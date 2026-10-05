import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// Import des composants de la section probabilité
import ProbabilityIntro from "./probability/components/ProbabilityIntro";
import ProbabilityBasics from "./probability/components/ProbabilityBasics";
import ConditionalProbabilitySection from "./probability/components/ConditionalProbabilitySection";
import BayesTheoremSection from "./probability/components/BayesTheoremSection";
import ProbabilityDistributionsSection from "./probability/components/ProbabilityDistributionsSection";
import RandomVariables from "./probability/components/RandomVariables";
import GaussianDistributionSection from "./probability/components/GaussianDistributionSection";
import PracticalApplicationsSection from "./probability/components/PracticalApplicationsSection";
import InteractiveQuizSection from "./probability/components/InteractiveQuizSection";

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
        </div>
      </div>
    </Layout>
  );
};

export default ProbabilityTheory;
