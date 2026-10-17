import { LineChart } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { timeSeriesCourse } from "@/data/lessons/time-series";

/** Cours « Séries temporelles » : modules dans src/data/lessons/time-series */
const TimeSeries = () => (
  <LessonCoursePage
    course={timeSeriesCourse}
    title="Séries temporelles"
    categoryName="Mathématiques et statistiques"
    description="Décrire, décomposer et prévoir des séries réelles (CO2 de Mauna Loa, débit du Nil, taches solaires), en évaluant honnêtement chaque prévision : statsmodels dans le navigateur."
    level="Intermédiaire"
    icon={LineChart}
    language="python"
    next={
      <p>
        Le projet guidé « prévoir une fréquentation » de la page Projets applique ces méthodes de bout en bout sur une série inventée. Les
        cours Statistiques appliquées et Statistiques inférentielles reprennent les tests et les intervalles utilisés ici, et le cours de
        machine learning supervisé la validation croisée.
      </p>
    }
  />
);

export default TimeSeries;
