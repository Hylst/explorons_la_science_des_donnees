import { Infinity as InfinityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseEquation from "@/components/courses/CourseEquation";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { INTEGRALES_IMPROPRES } from "@/data/integral-demos";

const ImproperSection = () => (
  <div className="max-w-4xl mx-auto">
    <section id="impropres" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <InfinityIcon className="h-6 w-6 text-indigo-600" />
        Intégrales impropres et lois continues
      </h2>
      <p className="text-gray-700 mb-4">
        Une densité de probabilité est souvent définie sur un intervalle infini (une durée d'attente sur [0, +∞[, une erreur de mesure sur ℝ).
        Son intégrale est alors <strong>impropre</strong> : on intègre jusqu'à une borne t, puis on fait tendre t vers l'infini. L'intégrale
        converge si cette limite existe et est finie.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-x-auto">
        <CourseEquation latex="\int_a^{+\infty} f(x)\,dx = \lim_{t \to +\infty} \int_a^t f(x)\,dx" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-l-4 border-indigo-400">
          <CardHeader>
            <CardTitle className="text-lg">Loi exponentielle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Modèle classique d'une durée sans mémoire (temps entre deux arrivées), de paramètre λ &gt; 0.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg overflow-x-auto space-y-1">
              <CourseEquation latex="f(x) = \lambda e^{-\lambda x} \quad (x \ge 0)" />
              <CourseEquation latex="E[X] = \frac{1}{\lambda}, \quad \operatorname{Var}(X) = \frac{1}{\lambda^2}" />
              <CourseEquation latex="P(X > t) = e^{-\lambda t}" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-indigo-400">
          <CardHeader>
            <CardTitle className="text-lg">Intégrale de Gauss</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Elle n'a pas de primitive exprimable avec les fonctions usuelles, mais sa valeur sur ℝ est connue. C'est elle qui explique
              le facteur 1/√(2π) de la densité de la loi normale.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg overflow-x-auto">
              <CourseEquation latex="\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}" />
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-gray-700 mb-4">
        Toutes les intégrales impropres ne convergent pas. 1/x et 1/x² tendent toutes les deux vers 0 à l'infini, mais pas assez vite
        pour la première : son intégrale entre 1 et N vaut ln N, qui grandit sans limite, alors que celle de 1/x² vaut 1 − 1/N et tend vers 1.
        C'est la raison pour laquelle certaines lois (la loi de Cauchy, par exemple) n'ont pas d'espérance : l'intégrale de x·f(x) diverge.
      </p>
      <RunnableCode
        language="python"
        code={INTEGRALES_IMPROPRES}
        label="Intégrales impropres calculées avec scipy.integrate.quad, modifiable"
        caption="Pour λ = 0,5, l'aire totale vaut 1, l'espérance 2 (= 1/λ) et la variance 4 (= 1/λ²) ; P(X > 3) = 0,2231 = e^(−1,5). L'intégrale de Gauss vaut 1,772454, soit √π. Entre 1 et N = 10, 100, 1 000 et 10 000, l'intégrale de 1/x vaut 2,303, 4,605, 6,908 puis 9,210 (ln N : elle diverge), celle de 1/x² vaut 0,9, 0,99, 0,999 puis 0,9999 (elle converge vers 1)."
      />
    </section>
  </div>
);

export default ImproperSection;
