
import Layout from "@/components/layout/Layout";
import ReinforcementLearningCourse from "@/components/machinelearning/courses/ReinforcementLearningCourse";
import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const ReinforcementLearning = () => {
  const breadcrumbItems = [
    { name: "Machine Learning", href: "/machine-learning" },
    { name: "Apprentissage par renforcement", href: "/machine-learning/reinforcement" }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="course"
          title="Apprentissage par Renforcement"
          description="L'apprentissage par renforcement : agents, récompenses et stratégies"
          
          courseInfo={{
            level: "Avancé",
            duration: "5-7 heures",
            modules: 7
          }}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <CourseBreadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="max-w-6xl mx-auto">
            <ReinforcementLearningCourse />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReinforcementLearning;
