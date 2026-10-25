import { ScatterChart } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { factorAnalysisCourse } from "@/data/lessons/factor-analysis";

/** Cours « Analyse factorielle » : modules dans src/data/lessons/factor-analysis */
const FactorAnalysis = () => (
  <LessonCoursePage
    course={factorAnalysisCourse}
    title="Analyse factorielle : ACP, AFC, ACM"
    categoryName="Mathématiques et statistiques"
    description="Résumer un tableau de mesures, un tableau de contingence ou une enquête en quelques axes : l'ACP, l'AFC et l'ACM écrites pas à pas en NumPy, puis comparées à scikit-learn, sur des vins et une enquête réelle."
    level="Intermédiaire"
    icon={ScatterChart}
    language="python"
    next={
      <p>
        Le cours d'introduction aux mathématiques revient sur les vecteurs et les matrices utilisés ici, et le cours de statistiques
        appliquées sur le test du khi-deux. Les bibliothèques citées en code à lire (FactoMineR en R, prince en Python) s'installent sur
        votre machine et donnent les mêmes axes, avec plus d'aides à l'interprétation.
      </p>
    }
  />
);

export default FactorAnalysis;
