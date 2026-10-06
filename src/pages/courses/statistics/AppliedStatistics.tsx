import { Sigma } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { appliedStatisticsCourse } from "@/data/lessons/applied-statistics";

/** Cours « Statistiques appliquées » : modules dans src/data/lessons/applied-statistics */
const AppliedStatistics = () => (
  <LessonCoursePage
    course={appliedStatisticsCourse}
    title="Statistiques appliquées"
    categoryName="Mathématiques et statistiques"
    description="Décrire, simuler, tester, corréler, comparer des groupes : les statistiques de tous les jours, calculées pour de vrai avec scipy et pandas."
    level="Intermédiaire"
    icon={Sigma}
    language="python"
    next={
      <p>
        Pour les définitions et les démonstrations, les pages Statistiques descriptives, Théorie des probabilités et Statistiques avancées
        des fondamentaux, et le cours Statistiques inférentielles, complètent ce cours pratique. Le cours de machine learning supervisé
        reprend la régression avec plusieurs variables et la validation des modèles.
      </p>
    }
  />
);

export default AppliedStatistics;
