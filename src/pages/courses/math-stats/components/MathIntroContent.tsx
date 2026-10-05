import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MathIntroHero from "./MathIntroHero";
import MathCourseModules from "./MathCourseModules";
import CourseHighlight from "@/components/courses/CourseHighlight";

// Les notions abordées plus en détail ailleurs sur le site : on y renvoie au lieu de les répéter ici
const nextCourses = [
  {
    label: "Algèbre linéaire",
    to: "/fundamentals/math-stats/linear-algebra",
    description: "Vecteurs, matrices, produit scalaire, décompositions (SVD) et leurs usages en apprentissage automatique.",
  },
  {
    label: "Statistiques descriptives",
    to: "/fundamentals/math-stats/descriptive-statistics",
    description: "Moyenne, médiane, dispersion, corrélation : résumer un jeu de données avant de le modéliser.",
  },
  {
    label: "Théorie des probabilités",
    to: "/fundamentals/math-stats/probability-theory",
    description: "Probabilités conditionnelles, lois usuelles, loi normale et théorème de Bayes.",
  },
  {
    label: "Statistiques inférentielles",
    to: "/courses/math-stats/inferential-statistics",
    description: "Passer d'un échantillon à une population : intervalles de confiance et tests.",
  },
  {
    label: "Calcul différentiel",
    to: "/fundamentals/math-stats/differential-calculus",
    description: "Dérivées, gradients et descente de gradient, avec un simulateur à manipuler.",
  },
  {
    label: "Calcul intégral",
    to: "/fundamentals/math-stats/integral-calculus",
    description: "Aires, primitives, densités de probabilité et aire sous la courbe ROC.",
  },
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
        <section id="pour-aller-plus-loin" className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Pour aller plus loin</h2>
          <p className="text-gray-700 mb-6">
            Ce cours pose les bases. Chaque thème a ensuite sa propre page, plus détaillée, avec des exemples et des exercices :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextCourses.map((course) => (
              <Link
                key={course.to}
                to={course.to}
                className="group block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <span className="flex items-center justify-between gap-2 font-semibold text-blue-700">
                  {course.label}
                  <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm text-gray-600">{course.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <CourseHighlight title="📚 Pour réviser autrement" type="info">
          <ul className="space-y-2 text-sm">
            <li>Khan Academy : cours et exercices de mathématiques, du collège à l'université</li>
            <li>3Blue1Brown : « Essence of Linear Algebra », des vidéos très visuelles (en anglais)</li>
            <li>MIT OpenCourseWare : cours universitaires complets</li>
            <li>Un notebook Jupyter, pour refaire les exercices soi-même</li>
          </ul>
        </CourseHighlight>
      </div>
    </div>
  );
};

export default MathIntroContent;
