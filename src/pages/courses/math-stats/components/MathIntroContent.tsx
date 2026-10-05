import { Link } from "react-router-dom";
import MathIntroHero from "./MathIntroHero";
import MathCourseModules from "./MathCourseModules";
import LinearAlgebraFoundations from "./LinearAlgebraFoundations";
import StatisticsProbabilityFoundations from "./StatisticsProbabilityFoundations";
import PracticalExamplesSection from "./PracticalExamplesSection";
import LearningPathSection from "./LearningPathSection";
import CourseHighlight from "@/components/courses/CourseHighlight";

const nextCourses = [
  { label: "Algèbre linéaire", to: "/fundamentals/math-stats/linear-algebra" },
  { label: "Statistiques descriptives", to: "/fundamentals/math-stats/descriptive-statistics" },
  { label: "Théorie des probabilités", to: "/fundamentals/math-stats/probability-theory" },
  { label: "Statistiques inférentielles", to: "/courses/math-stats/inferential-statistics" },
  { label: "Calcul différentiel", to: "/fundamentals/math-stats/differential-calculus" },
  { label: "Calcul intégral", to: "/fundamentals/math-stats/integral-calculus" }
];

const MathIntroContent = () => {
  return (
    <div className="max-w-4xl mx-auto lg:max-w-none">
      {/* Introduction */}
      <div className="max-w-4xl mx-auto">
        <MathIntroHero />
      </div>

      {/* Les 5 modules du cours : contenu, exercices et progression */}
      <MathCourseModules />

      <div className="max-w-4xl mx-auto">
        {/* Algèbre Linéaire */}
        <LinearAlgebraFoundations />

        {/* Statistiques & Probabilités */}
        <StatisticsProbabilityFoundations />

        {/* Applications pratiques */}
        <PracticalExamplesSection />

        {/* Parcours d'apprentissage */}
        <LearningPathSection />

        {/* Conclusion et prochaines étapes */}
        <CourseHighlight title="🎯 Prochaines étapes" type="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Après ce cours, vous serez prêt pour :</h4>
              <ul className="space-y-2 text-sm">
                {nextCourses.map((course) => (
                  <li key={course.to}>
                    ✓{" "}
                    <Link to={course.to} className="font-medium text-blue-700 underline">
                      {course.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Ressources recommandées :</h4>
              <ul className="space-y-2 text-sm">
                <li>📚 Khan Academy - Mathématiques</li>
                <li>📊 3Blue1Brown - Essence of Linear Algebra</li>
                <li>🎓 MIT OpenCourseWare</li>
                <li>💻 Un notebook Jupyter pour refaire les exercices soi-même</li>
              </ul>
            </div>
          </div>
        </CourseHighlight>
      </div>
    </div>
  );
};

export default MathIntroContent;
