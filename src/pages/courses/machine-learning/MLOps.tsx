import { Workflow } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { mlopsCourse } from "@/data/lessons/mlops";

/** Cours « MLOps » : modules dans src/data/lessons/mlops */
const MLOps = () => (
  <LessonCoursePage
    course={mlopsCourse}
    title="MLOps : du modèle au service"
    categoryName="Machine Learning"
    description="Pipelines reproductibles, suivi d'expériences, empaquetage, tests, mise en service et surveillance de la dérive : ce qui sépare un bon score dans un carnet de notes d'un modèle sur lequel on peut compter, exécuté dans votre navigateur."
    level="Intermédiaire"
    icon={Workflow}
    language="python"
    next={
      <p>
        Les outils cités en code à lire (MLflow, FastAPI, Docker, ONNX, pytest) s'installent sur votre machine ; les fonctions écrites dans
        les modules en donnent le principe. Le cours de machine learning supervisé revient sur l'évaluation des modèles, et le module 7 du
        cours de statistiques appliquées sur la lecture d'une régression.
      </p>
    }
  />
);

export default MLOps;
