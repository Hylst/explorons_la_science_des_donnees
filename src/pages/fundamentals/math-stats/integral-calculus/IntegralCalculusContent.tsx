import { Link } from "react-router-dom";
import { Calculator, GraduationCap, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseHighlight from "@/components/courses/CourseHighlight";
import CourseEquation from "@/components/courses/CourseEquation";

/** Introduction et concepts fondamentaux (affichés avec la page ; les sections suivantes sont chargées ensuite) */
const IntegralCalculusContent = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Introduction */}
      <section id="introduction" className="scroll-mt-24">
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-8 rounded-xl border border-purple-100">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            Le calcul intégral : mesurer une accumulation
          </h2>

          <div className="max-w-none text-gray-700 mb-8">
            <p className="text-xl leading-relaxed mb-6">
              Le calcul intégral est l'art de mesurer l'accumulation. Là où les dérivées nous parlent
              de vitesse de changement, les intégrales nous parlent de quantités totales accumulées.
              En data science, on la retrouve surtout dans les probabilités continues (densités, espérance),
              dans la théorie de l'information (entropie, divergence de Kullback-Leibler) et dans certains
              indicateurs comme l'aire sous la courbe ROC (AUC).
            </p>

            <div className="bg-white p-4 sm:p-6 rounded-lg border-l-4 border-purple-500 my-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Intuition géométrique
              </h3>
              <p className="mb-4">
                Imaginez que vous voulez mesurer l'aire sous une courbe. Le calcul intégral vous permet
                de découper cette aire en rectangles de plus en plus fins et d'additionner leurs aires :
                la limite de ces sommes, quand la largeur des rectangles tend vers zéro, est l'intégrale.
              </p>
              <div className="bg-gray-50 p-2 sm:p-4 rounded-lg space-y-1">
                <CourseEquation latex="A = \int_a^b f(x)dx" />
                <CourseEquation latex="\int_a^b f(x)dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i)\Delta x" />
              </div>
            </div>

            <p className="leading-relaxed">
              Cette page est une référence : elle rassemble les définitions, les techniques et leurs usages en data science,
              avec des exemples que vous pouvez exécuter et modifier (Python, NumPy et SciPy tournent dans votre navigateur)
              et cinq exercices, dont trois vérifiés par le moteur du site.
            </p>
          </div>
        </div>
      </section>

      {/* Concepts fondamentaux */}
      <section id="concepts" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          Concepts fondamentaux
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="text-lg">Intégrale indéfinie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <CourseEquation latex="∫ f(x)dx = F(x) + C" />
              </div>
              <p className="text-sm text-gray-700">
                Famille de fonctions dont la dérivée est f(x).
                La constante C représente toutes les primitives possibles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-400">
            <CardHeader>
              <CardTitle className="text-lg">Intégrale définie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <CourseEquation latex="∫_a^b f(x)dx = F(b) - F(a)" />
              </div>
              <p className="text-sm text-gray-700">
                Valeur numérique représentant l'aire nette entre la courbe
                et l'axe x, entre les bornes a et b : les parties sous l'axe comptent négativement.
              </p>
            </CardContent>
          </Card>
        </div>

        <CourseHighlight title="Théorème fondamental du calcul" type="concept">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Première partie</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <CourseEquation latex="\frac{d}{dx}\int_a^x f(t)dt = f(x)" />
              </div>
              <p className="text-sm text-gray-600">
                La dérivée d'une intégrale par rapport à sa borne supérieure
                est égale à la fonction intégrée (pour f continue).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Seconde partie</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <CourseEquation latex="\int_a^b f'(x)dx = f(b) - f(a)" />
              </div>
              <p className="text-sm text-gray-600">
                L'intégrale d'une dérivée sur un intervalle est égale
                à la différence des valeurs aux bornes.
              </p>
            </div>
          </div>
        </CourseHighlight>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <p className="text-sm text-blue-900">
            Pour apprendre pas à pas (sommes de Riemann, théorème fondamental, densités, AUC) avec des exercices vérifiés, suivez le{" "}
            <Link to="/courses/math-stats/math-intro#module-module-5" className="font-medium underline">
              module 5 du cours d'introduction aux mathématiques
            </Link>
            . Cette page le complète : techniques d'intégration, méthodes numériques, intégrales impropres et multiples, entropie.
          </p>
        </div>
      </section>
    </div>
  );
};

export default IntegralCalculusContent;
