import Layout from "@/components/layout/Layout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import InferentialStatisticsCourse from "./components/InferentialStatisticsCourse";

const InferentialStatisticsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="course"
          title="Statistiques inférentielles"
          description="Tirez des conclusions sur une population à partir d'un échantillon : tests d'hypothèses, intervalles de confiance et approche bayésienne"
          courseInfo={{
            level: "Intermédiaire",
            duration: "≈ 1 heure",
            modules: 6
          }}
        />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <InferentialStatisticsCourse />
        </div>
      </div>
    </Layout>
  );
};

export default InferentialStatisticsPage;
