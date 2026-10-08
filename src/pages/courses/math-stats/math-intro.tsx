import { Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { mathIntroCourse } from "@/data/lessons/math-intro";
import { migrateMathIntroProgress } from "@/lib/progress-migration";

// L'ancien cours enregistrait les modules terminés sous une autre clé : on les reprend une fois, avant le premier affichage
migrateMathIntroProgress();

/** Cours « Introduction aux mathématiques » : modules dans src/data/lessons/math-intro */
const MathIntroCourse = () => (
  <LessonCoursePage
    course={mathIntroCourse}
    title="Introduction aux mathématiques"
    categoryName="Mathématiques et statistiques"
    description="Nombres, ensembles, fonctions, dérivées et intégrales, avec à chaque fois leur usage en data science : formules, figures, et calculs exécutés dans votre navigateur."
    level="Débutant"
    icon={Sigma}
    language="python"
    next={
      <p>
        Pour approfondir : les pages des fondamentaux sur le{" "}
        <Link to="/fundamentals/math-stats/differential-calculus" className="text-primary underline">calcul différentiel</Link>, le{" "}
        <Link to="/fundamentals/math-stats/integral-calculus" className="text-primary underline">calcul intégral</Link>, l'
        <Link to="/fundamentals/math-stats/linear-algebra" className="text-primary underline">algèbre linéaire</Link> et les{" "}
        <Link to="/fundamentals/math-stats/probability-theory" className="text-primary underline">probabilités</Link>, puis le cours de{" "}
        <Link to="/courses/math-stats/inferential-statistics" className="text-primary underline">statistiques inférentielles</Link>.
      </p>
    }
  />
);

export default MathIntroCourse;
