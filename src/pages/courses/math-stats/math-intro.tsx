
import Layout from "@/components/layout/Layout";
import MathIntroContent from "./components/MathIntroContent";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const MathIntroCourse = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="course"
          title="Introduction aux Mathématiques"
          description="Les fondements mathématiques utiles en data science"
          
          courseInfo={{
            level: "Débutant",
            duration: "≈ 3 heures",
            modules: 5
          }}
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <MathIntroContent />
        </div>
      </div>
    </Layout>
  );
};

export default MathIntroCourse;
