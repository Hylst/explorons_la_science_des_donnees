
import Layout from "@/components/layout/Layout";
import SupervisedLearningCourse from "@/components/machinelearning/courses/SupervisedLearningCourse";
import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const SupervisedLearning = () => {
  const breadcrumbItems = [
    { name: "Machine Learning", href: "/machine-learning" },
    { name: "Apprentissage supervisé", href: "/machine-learning/supervised" }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="course"
          title="Apprentissage Supervisé"
          description="Explorez les algorithmes d'apprentissage supervisé : classification, régression et techniques avancées"
          
          courseInfo={{
            level: "Intermédiaire",
            duration: "4-6 heures",
            modules: 8
          }}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <CourseBreadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="max-w-6xl mx-auto">
            <SupervisedLearningCourse />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupervisedLearning;
