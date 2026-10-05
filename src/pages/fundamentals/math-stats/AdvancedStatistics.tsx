
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
// Supprimer cette ligne : import { ChartBar, Target, Brain, TestTube, Zap, Calculator } from "lucide-react";
import AdvancedStatsIntro from "./advanced-statistics/AdvancedStatsIntro";
import HypothesisTestingSection from "./advanced-statistics/HypothesisTestingSection";
import ConfidenceIntervalsSection from "./advanced-statistics/ConfidenceIntervalsSection";
import ANOVASection from "./advanced-statistics/ANOVASection";
import RegressionSection from "./advanced-statistics/RegressionSection";
import BayesianStatisticsSection from "./advanced-statistics/BayesianStatisticsSection";
import PracticalApplicationsSection from "./advanced-statistics/PracticalApplicationsSection";

const AdvancedStatistics = () => {
  // Supprimer les lignes 13-22 qui définissent la variable sidebar
  
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Statistiques Avancées"
          description="Explorez les techniques statistiques avancées pour l'analyse de données complexes et la prise de décision éclairée"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-16">
            <AdvancedStatsIntro />
            <HypothesisTestingSection />
            <ConfidenceIntervalsSection />
            <ANOVASection />
            <RegressionSection />
            <BayesianStatisticsSection />
            <PracticalApplicationsSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedStatistics;
