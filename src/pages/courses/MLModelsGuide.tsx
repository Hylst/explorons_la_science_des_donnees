import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { mlModelsGuideCourse } from "@/data/lessons/ml-models-guide";

/** Cours « Guide des modèles de machine learning » : modules dans src/data/lessons/ml-models-guide */
const MLModelsGuide = () => (
  <LessonCoursePage
    course={mlModelsGuideCourse}
    title="Guide des modèles de machine learning"
    categoryName="Machine Learning"
    description="Choisir une famille de modèles, puis la prendre en main : descente de gradient stochastique, boosting, clustering, apprentissage par renforcement et réseaux de neurones, scores mesurés dans votre navigateur."
    level="Intermédiaire"
    icon={Brain}
    language="python"
    next={
      <p>
        Les arbres, forêts aléatoires, SVM et la validation sont traités en détail dans le cours de{" "}
        <Link to="/courses/machine-learning/supervised-learning" className="text-primary underline">machine learning supervisé</Link> ; le{" "}
        <Link to="/projects" className="text-primary underline">projet guidé de segmentation</Link> met KMeans en pratique, et le cours{" "}
        <Link to="/courses/machine-learning/transformers" className="text-primary underline">Transformers</Link> prolonge la partie sur les réseaux de neurones.
      </p>
    }
  />
);

export default MLModelsGuide;
