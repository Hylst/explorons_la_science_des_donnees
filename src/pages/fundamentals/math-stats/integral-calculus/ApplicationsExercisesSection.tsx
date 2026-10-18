import { Link } from "react-router-dom";
import { BookOpen, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseHighlight from "@/components/courses/CourseHighlight";
import CourseEquation from "@/components/courses/CourseEquation";
import LessonExercise from "@/components/courses/lessons/LessonExercise";
import { INTEGRAL_EXERCISES } from "@/data/integral-demos";

const applications = [
  {
    domain: "Statistiques",
    description: "Calcul de probabilités avec des densités continues",
    example: "∫_a^b f(x)dx = P(a ≤ X ≤ b)",
    use_cases: ["Loi normale", "Fonctions de densité et de répartition", "Espérance et variance"],
  },
  {
    domain: "Machine learning",
    description: "Perte moyenne attendue d'un modèle, ou risque espéré : R(θ) = E[L(θ, X)]",
    example: "R(\\theta) = \\int L(\\theta, x)\\, p(x)\\, dx",
    use_cases: ["Risque espéré (perte moyenne)", "Entropie croisée et divergence de Kullback-Leibler", "Inférence bayésienne : la loi a posteriori se normalise par une intégrale"],
  },
  {
    domain: "Analyse de données",
    description: "Aire sous la courbe ROC (u = taux de faux positifs, TPR = taux de vrais positifs)",
    example: "\\mathrm{AUC} = \\int_0^1 \\mathrm{TPR}(u)\\, du",
    use_cases: ["Métriques de performance", "Intégration numérique (méthode des trapèzes)"],
  },
];

const nextSteps = [
  { to: "/courses/math-stats/math-intro#module-module-5", label: "Module 5 du cours d'introduction aux mathématiques", detail: "intégrales et probabilités, pas à pas, avec exercices vérifiés" },
  { to: "/fundamentals/math-stats/probability-theory", label: "Théorie des probabilités", detail: "lois continues, densités, loi normale" },
  { to: "/fundamentals/math-stats/differential-calculus", label: "Calcul différentiel", detail: "la dérivée, opération inverse de l'intégrale, et l'optimisation" },
  { to: "/courses/math-stats/inferential-statistics", label: "Cours de statistiques inférentielles", detail: "intervalles de confiance, tests, approche bayésienne" },
];

const ApplicationsExercisesSection = () => (
  <div className="max-w-4xl mx-auto space-y-12">
    <section id="applications" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Target className="h-6 w-6 text-green-600" />
        Applications en science des données
      </h2>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-8 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold mb-6">Domaines d'application</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app.domain} className="bg-white p-6 rounded-lg shadow-sm min-w-0">
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {app.domain}
              </h4>
              <p className="text-sm mb-3">{app.description}</p>
              <div className="bg-gray-50 p-3 rounded mb-3 overflow-x-auto">
                <CourseEquation latex={app.example} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Cas d'usage</h5>
                <ul className="text-xs space-y-1">
                  {app.use_cases.map((use_case) => (
                    <li key={use_case} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-green-400 rounded-full" />
                      {use_case}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="exercices" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-orange-600" />
        Exercices pratiques
      </h2>
      <p className="text-gray-700 mb-6">
        Les deux premiers exercices se font à la main (solution à déplier). Les trois suivants se programment : votre réponse est
        exécutée par le moteur Python du site et vérifiée par des tests.
      </p>

      <div className="space-y-6">
        <Card className="border-l-4 border-orange-400">
          <CardHeader>
            <CardTitle className="text-lg">Exercice 1 : calcul d'aires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Calculez l'aire sous la courbe f(x) = x² entre x = 0 et x = 2</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <CourseEquation latex="A = \int_0^2 x^2 dx" />
            </div>
            <details className="bg-blue-50 p-4 rounded border">
              <summary className="cursor-pointer font-medium text-blue-800">Voir la solution</summary>
              <div className="mt-3 space-y-2">
                <CourseEquation latex="A = \left[\frac{x^3}{3}\right]_0^2 = \frac{8}{3} - 0 = \frac{8}{3}" />
                <p className="text-sm text-blue-700">L'aire vaut 8/3 unités d'aire (environ 2,67).</p>
              </div>
            </details>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-400">
          <CardHeader>
            <CardTitle className="text-lg">Exercice 2 : probabilité continue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Pour une loi uniforme sur [0,1], calculez P(0,2 ≤ X ≤ 0,7)</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <CourseEquation latex="P(0{,}2 \leq X \leq 0{,}7) = \int_{0{,}2}^{0{,}7} 1\, dx" />
            </div>
            <details className="bg-blue-50 p-4 rounded border">
              <summary className="cursor-pointer font-medium text-blue-800">Voir la solution</summary>
              <div className="mt-3 space-y-2">
                <CourseEquation latex="P = [x]_{0{,}2}^{0{,}7} = 0{,}7 - 0{,}2 = 0{,}5" />
                <p className="text-sm text-blue-700">La probabilité vaut 0,5, soit 50 %.</p>
              </div>
            </details>
          </CardContent>
        </Card>

        {INTEGRAL_EXERCISES.map((exercise, i) => (
          <LessonExercise key={i} exercise={exercise} number={i + 3} />
        ))}
      </div>
    </section>

    <CourseHighlight title="Pour aller plus loin sur le site" type="info">
      <ul className="space-y-3 text-sm">
        {nextSteps.map((step) => (
          <li key={step.to}>
            <Link to={step.to} className="font-medium underline">
              {step.label}
            </Link>{" "}
            : {step.detail}
          </li>
        ))}
      </ul>
    </CourseHighlight>
  </div>
);

export default ApplicationsExercisesSection;
