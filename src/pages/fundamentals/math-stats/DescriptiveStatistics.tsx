import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// L'introduction est chargée avec la page ; les sections suivantes sont chargées à la demande (ProgressiveSections)
import DescriptiveStatsIntro from "./descriptive-statistics/components/DescriptiveStatsIntro";
const CentralTendencySection = lazy(() => import("./descriptive-statistics/components/CentralTendencySection"));
const DispersionSection = lazy(() => import("./descriptive-statistics/components/DispersionSection"));
const CorrelationSection = lazy(() => import("./descriptive-statistics/components/CorrelationSection"));
const PracticalApplicationsSection = lazy(() => import("./descriptive-statistics/components/PracticalApplicationsSection"));

const DescriptiveStatistics = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Statistiques Descriptives"
          description="Les outils statistiques fondamentaux pour décrire des données et en tirer des conclusions prudentes"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ProgressiveSections>
            <DescriptiveStatsIntro />
            <CentralTendencySection />
            <DispersionSection />
            <CorrelationSection />
            <PracticalApplicationsSection />
          </ProgressiveSections>
        </div>
      </div>
    </Layout>
  );
};

export default DescriptiveStatistics;
