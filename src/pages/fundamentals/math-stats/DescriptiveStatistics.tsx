
import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
// Supprimer cette ligne : import { ChartBar, TrendingUp, Calculator, BarChart3, Target, Eye } from "lucide-react";

// Import des nouveaux composants modulaires
import DescriptiveStatsIntro from "./descriptive-statistics/components/DescriptiveStatsIntro";
import CentralTendencySection from "./descriptive-statistics/components/CentralTendencySection";
import DispersionSection from "./descriptive-statistics/components/DispersionSection";
import CorrelationSection from "./descriptive-statistics/components/CorrelationSection";
import PracticalApplicationsSection from "./descriptive-statistics/components/PracticalApplicationsSection";

const DescriptiveStatistics = () => {
  // Supprimer les lignes 13-22 qui définissent sidebarItems
  
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Statistiques Descriptives"
          description="Les outils statistiques fondamentaux pour décrire des données et en tirer des conclusions prudentes"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <DescriptiveStatsIntro />
          <CentralTendencySection />
          <DispersionSection />
          <CorrelationSection />
          <PracticalApplicationsSection />
        </div>
      </div>
    </Layout>
  );
};

export default DescriptiveStatistics;
