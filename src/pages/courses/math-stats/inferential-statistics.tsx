import { Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { inferentialStatisticsCourse } from "@/data/lessons/inferential-statistics";

/** Cours « Statistiques inférentielles » : modules dans src/data/lessons/inferential-statistics */
const InferentialStatisticsPage = () => (
  <LessonCoursePage
    course={inferentialStatisticsCourse}
    title="Statistiques inférentielles"
    categoryName="Mathématiques et statistiques"
    description="Conclure sur une population à partir d'un échantillon : estimateurs, intervalles de confiance, logique des tests, puissance et approche bayésienne, montrés par simulation."
    level="Intermédiaire"
    icon={Sigma}
    language="python"
    next={
      <p>
        Le cours de{" "}
        <Link to="/courses/statistics/applied-statistics" className="text-primary underline">statistiques appliquées</Link> met ces outils en pratique
        sur des jeux de données réels (corrélation, ANOVA, tests non paramétriques) ; la page des{" "}
        <Link to="/fundamentals/math-stats/probability-theory" className="text-primary underline">probabilités</Link> revient sur les lois utilisées ici.
      </p>
    }
  />
);

export default InferentialStatisticsPage;
