
import { useMachineLearning } from "./machine-learning-context";
import IntroSectionRefactored from "./sections/IntroSectionRefactored";
import CourseAccessSection from "./sections/CourseAccessSection";
import SupervisedSection from "./sections/SupervisedSection";
import UnsupervisedSection from "./sections/UnsupervisedSection";
import EvaluationSection from "./sections/EvaluationSection";
import DeepLearningSection from "./sections/DeepLearningSection";
import PracticalExercisesSection from "./sections/PracticalExercisesSection";

const MachineLearningContentRefactored = () => {
  const { activeSection } = useMachineLearning();

  return (
    <div className="space-y-16">
      {/* Introduction Section */}
      <div className={activeSection === "introduction" ? "block" : "block"}>
        <IntroSectionRefactored />
      </div>

      {/* Course Access Section - Nouvelle section pour les cours approfondis */}
      <div className="block">
        <CourseAccessSection />
      </div>

      {/* Supervised Learning Section */}
      <div className={activeSection === "supervised" ? "block" : "block"}>
        <SupervisedSection />
      </div>

      {/* Unsupervised Learning Section */}
      <div className={activeSection === "unsupervised" ? "block" : "block"}>
        <UnsupervisedSection />
      </div>

      {/* Model Evaluation Section */}
      <div className={activeSection === "evaluation" ? "block" : "block"}>
        <EvaluationSection />
      </div>

      {/* Deep Learning Section */}
      <div className={activeSection === "deep-learning" ? "block" : "block"}>
        <DeepLearningSection />
      </div>

      {/* Practical Exercises Section */}
      <div className={activeSection === "exercises" ? "block" : "block"}>
        <PracticalExercisesSection />
      </div>
    </div>
  );
};

export default MachineLearningContentRefactored;
