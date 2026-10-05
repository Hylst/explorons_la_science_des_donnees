
import Layout from "@/components/layout/Layout";
import UnsupervisedLearningCourse from "@/components/machinelearning/courses/UnsupervisedLearningCourse";
import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const UnsupervisedLearning = () => {
  const breadcrumbItems = [
    { name: "Machine Learning", href: "/machine-learning" },
    { name: "Apprentissage non supervisé", href: "/machine-learning/unsupervised" }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="course"
          title="Apprentissage Non Supervisé"
          description="Explorez les techniques de clustering, réduction de dimensionnalité et détection d'anomalies"
          
          courseInfo={{
            level: "Intermédiaire",
            duration: "3-5 heures",
            modules: 6
          }}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <CourseBreadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="max-w-6xl mx-auto">
            <UnsupervisedLearningCourse />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnsupervisedLearning;
