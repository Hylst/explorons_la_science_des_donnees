import { Dices, Grid3x3 } from "lucide-react";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { KL_ENTROPIE, MONTE_CARLO } from "@/data/integral-demos";

const MultipleSection = () => (
  <div className="max-w-4xl mx-auto space-y-12">
    <section id="multiples" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Grid3x3 className="h-6 w-6 text-teal-600" />
        Intégrales multiples et méthode de Monte-Carlo
      </h2>
      <p className="text-gray-700 mb-4">
        Avec deux variables continues X et Y de densité jointe f(x, y), la probabilité que le couple tombe dans une région D est le
        volume sous la surface f au-dessus de D : une intégrale double. Le théorème de Fubini permet de la calculer comme deux intégrales
        simples emboîtées (d'abord en y, à x fixé, puis en x), quand f est intégrable.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-x-auto space-y-1">
        <CourseEquation latex="P\big((X, Y) \in D\big) = \iint_D f(x, y)\,dx\,dy" />
        <CourseEquation latex="\iint_D f(x, y)\,dx\,dy = \int_a^b F(x)\,dx" />
        <CourseEquation latex="\text{avec } F(x) = \int_{c(x)}^{d(x)} f(x, y)\,dy" />
      </div>
      <p className="text-gray-700 mb-4">
        La <strong>méthode de Monte-Carlo</strong> remplace l'intégrale par une moyenne sur des tirages aléatoires : si U₁, …, Uₙ sont tirés
        uniformément dans un domaine de volume V, la moyenne de g(Uᵢ) multipliée par V estime l'intégrale de g. Son erreur décroît comme
        1/√n, quelle que soit la dimension : c'est lent (100 fois plus de points pour un chiffre de plus), mais c'est la seule méthode
        praticable en grande dimension, et c'est elle qui est au cœur de l'inférence bayésienne par simulation (MCMC).
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto space-y-1">
        <CourseEquation latex="\int_D g(u)\,du \approx \frac{V}{n} \sum_{i=1}^{n} g(U_i)" />
        <CourseEquation latex="\text{écart type de l'estimation} \approx \frac{V\sigma_g}{\sqrt{n}}" />
      </div>
      <p className="text-gray-700 mb-4">
        L'exemple estime l'aire du quart de disque de rayon 1 (π/4) : c'est l'intégrale double de la fonction 1 sur ce domaine, et aussi
        la probabilité qu'un point tiré au hasard dans le carré [0, 1]² tombe dedans.
      </p>
      <RunnableCode
        language="python"
        code={MONTE_CARLO}
        label="Intégrale double avec dblquad et estimation de Monte-Carlo, modifiable"
        caption="dblquad donne 0,785398, soit π/4. Avec la graine 0, Monte-Carlo donne 0,68 avec 100 points, 0,7862 avec 10 000 et 0,78535 avec un million ; les écarts types attendus sont 0,041, 0,0041 et 0,00041 (divisés par 10 quand n est multiplié par 100). L'erreur d'un tirage particulier fluctue autour de cet écart type : ici 2,6 fois plus grande que lui avec 100 points, bien plus petite avec 10 000 et un million. Changez la graine pour le voir."
      />
    </section>

    <section id="entropie" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Dices className="h-6 w-6 text-rose-600" />
        Entropie et divergence de Kullback-Leibler
      </h2>
      <p className="text-gray-700 mb-4">
        Deux quantités de la théorie de l'information, très présentes en apprentissage automatique, sont des intégrales pour des lois
        continues. L'<strong>entropie différentielle</strong> mesure la dispersion d'une loi ; la <strong>divergence de Kullback-Leibler</strong>{" "}
        mesure l'écart entre une loi p et une loi q. Elle est toujours positive ou nulle, nulle seulement si p = q, et
        <strong> elle n'est pas symétrique</strong> : ce n'est pas une distance.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-x-auto space-y-1">
        <CourseEquation latex="H(p) = -\int p(x) \ln p(x)\,dx" />
        <CourseEquation latex="\mathrm{KL}(p \,\|\, q) = \int p(x) \ln \frac{p(x)}{q(x)}\,dx \;\ge\; 0" />
      </div>
      <RunnableCode
        language="python"
        code={KL_ENTROPIE}
        label="Divergence de Kullback-Leibler et entropie calculées par intégration, modifiable"
        caption="Entre deux lois normales d'écart type 1 dont les moyennes diffèrent de 1, la divergence vaut 0,5. Entre N(0, 1) et N(0, 2²), elle vaut 0,318147 dans un sens et 0,806853 dans l'autre : l'ordre des lois compte. L'entropie de la loi normale centrée réduite vaut 1,418939, comme la formule ½ ln(2πe)."
      />
      <CourseHighlight title="Où les retrouve-t-on" type="info">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Entropie croisée</strong> : la perte des classifieurs probabilistes (régression logistique, réseaux de neurones) est
            l'entropie croisée entre les étiquettes et les probabilités prédites ; la minimiser revient à minimiser une divergence de
            Kullback-Leibler.
          </li>
          <li>
            <strong>Autoencodeurs variationnels</strong> : leur fonction de perte contient un terme de Kullback-Leibler entre la loi
            apprise et une loi normale de référence.
          </li>
          <li>
            <strong>t-SNE</strong> : la projection est choisie pour minimiser une divergence de Kullback-Leibler entre les voisinages
            dans l'espace d'origine et dans le plan.
          </li>
        </ul>
      </CourseHighlight>
    </section>
  </div>
);

export default MultipleSection;
