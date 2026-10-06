import { Brain } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { supervisedLearningCourse } from "@/data/lessons/supervised-learning";

/** Cours « Machine learning supervisé » : modules dans src/data/lessons/supervised-learning */
const SupervisedLearningCourse = () => (
  <LessonCoursePage
    course={supervisedLearningCourse}
    title="Machine learning supervisé"
    categoryName="Machine Learning"
    description="Régressions, arbres, forêts, SVM, évaluation et réglages : chaque modèle est entraîné pour de vrai avec scikit-learn, dans votre navigateur."
    level="Intermédiaire"
    icon={Brain}
    language="python"
    next={
      <p>
        Les jeux de données du cours sont petits et propres, choisis pour apprendre. Sur de vraies données, l'essentiel du travail se passe
        avant le modèle : la page Préparation des données y est consacrée. La page Machine Learning des fondamentaux présente aussi
        l'apprentissage non supervisé et par renforcement, et la page Projets propose des sujets pour mettre tout cela en pratique.
      </p>
    }
  />
);

export default SupervisedLearningCourse;
