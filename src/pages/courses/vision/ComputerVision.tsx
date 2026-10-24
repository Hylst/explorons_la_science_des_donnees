import { ScanEye } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { computerVisionCourse } from "@/data/lessons/computer-vision";

/** Cours « Vision par ordinateur » : modules dans src/data/lessons/computer-vision */
const ComputerVision = () => (
  <LessonCoursePage
    course={computerVisionCourse}
    title="Vision par ordinateur"
    categoryName="Intelligence artificielle"
    description="Des pixels aux réseaux convolutifs sur de vrais chiffres manuscrits : filtres, caractéristiques, classifieurs, robustesse et transfert d'apprentissage, calculés avec NumPy et scikit-learn dans votre navigateur."
    level="Intermédiaire"
    icon={ScanEye}
    language="python"
    next={
      <p>
        Le cours de machine learning supervisé détaille l'évaluation des modèles utilisés ici (découpage, validation croisée, matrice de
        confusion), et le guide des modèles de ML les réseaux de neurones. Pour entraîner de vrais réseaux convolutifs sur des photos, les
        bibliothèques TensorFlow (Keras) et PyTorch s'installent sur votre machine ; le code des modules 4 et 6 en donne le point de départ.
      </p>
    }
  />
);

export default ComputerVision;
