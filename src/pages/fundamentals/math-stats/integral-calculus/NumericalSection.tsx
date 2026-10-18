import { Sigma } from "lucide-react";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { METHODES_NUMERIQUES } from "@/data/integral-demos";
import RiemannExplorer from "./RiemannExplorer";

const NumericalSection = () => (
  <div className="max-w-4xl mx-auto">
    <section id="numerique" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sigma className="h-6 w-6 text-blue-600" />
        Intégration numérique
      </h2>
      <p className="text-gray-700 mb-6">
        La plupart des intégrales rencontrées en data science n'ont pas de primitive simple (la densité de la loi normale, par exemple) :
        on les calcule numériquement, en remplaçant l'aire par une somme de formes simples. Tout l'enjeu est la vitesse à laquelle
        l'erreur diminue quand on affine le découpage.
      </p>

      <RiemannExplorer />

      <h3 className="text-xl font-semibold mt-10 mb-3">Trapèzes et Simpson</h3>
      <p className="text-gray-700 mb-4">
        Avec n tranches de largeur h = (b − a)/n et les points x₀ = a, x₁, …, xₙ = b, la méthode des trapèzes relie les points par des segments ;
        la méthode de Simpson (n pair) les relie deux à deux par des arcs de parabole, ce qui la rend exacte pour les polynômes de degré 3.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-3 overflow-x-auto">
        <CourseEquation latex="T_n = h\left(\frac{f(x_0) + f(x_n)}{2} + \sum_{i=1}^{n-1} f(x_i)\right)" />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto space-y-1">
        <CourseEquation latex="S_n = \frac{h}{3}\big(f(x_0) + 4\,I + 2\,P + f(x_n)\big)" />
        <CourseEquation latex="I = \sum_{i\ \text{impair}} f(x_i), \quad P = \sum_{\substack{i\ \text{pair} \\ 0 < i < n}} f(x_i)" />
      </div>
      <p className="text-gray-700 mb-4">
        Pour une fonction assez régulière, l'erreur des trapèzes est proportionnelle à h² (méthode d'ordre 2) et celle de Simpson à h⁴ (ordre 4) :
        doubler n divise la première par 4 et la seconde par 16. L'exemple le mesure sur l'intégrale de sin x entre 0 et π, qui vaut exactement 2.
      </p>
      <RunnableCode
        language="python"
        code={METHODES_NUMERIQUES}
        label="Comparaison du point milieu, des trapèzes et de Simpson, modifiable"
        caption="Avec 4 tranches, les erreurs sont de 5,23 × 10⁻² (point milieu), 1,04 × 10⁻¹ (trapèzes) et 4,56 × 10⁻³ (Simpson) ; avec 32 tranches, 8,03 × 10⁻⁴, 1,61 × 10⁻³ et 1,03 × 10⁻⁶. Chaque doublement divise l'erreur par 4 environ pour les deux premières méthodes et par 16 environ pour Simpson. scipy.integrate.quad, qui choisit lui-même ses points, donne 2 avec une erreur estimée de 2,2 × 10⁻¹⁴."
      />

      <CourseHighlight title="En pratique" type="info">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Une fonction que l'on peut évaluer partout</strong> : <code>scipy.integrate.quad</code> (une dimension),{" "}
            <code>dblquad</code> et <code>tplquad</code> (deux et trois dimensions). Les bornes peuvent être infinies (<code>np.inf</code>).
          </li>
          <li>
            <strong>Des valeurs mesurées en quelques points</strong> (une courbe ROC, une série échantillonnée) :{" "}
            <code>scipy.integrate.trapezoid</code> ou <code>simpson</code> sur les points disponibles.
          </li>
          <li>
            <strong>Beaucoup de dimensions</strong> : les méthodes à grille deviennent impraticables (10 points par axe en 10 dimensions font
            10¹⁰ évaluations) ; on passe à Monte-Carlo, présenté plus bas.
          </li>
        </ul>
      </CourseHighlight>
    </section>
  </div>
);

export default NumericalSection;
