import { Link } from 'react-router-dom';
import CourseHighlight from '@/components/courses/CourseHighlight';
import CourseEquation from '@/components/courses/CourseEquation';
import { RiemannSum } from '@/components/courses/CourseFigures';
import CourseQuizBlock from '@/components/courses/CourseQuizBlock';
import { calculIntegralQuiz } from './quizzes';
import { Card } from '@/components/ui/card';

const ModuleCalculIntegral = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Introduction au calcul intégral</h2>

      <p className="mb-4">
        Le calcul intégral est l'opération inverse de la dérivation. Il permet de calculer des aires sous des courbes, des volumes, et il est essentiel en statistiques pour calculer des probabilités.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">Qu'est-ce qu'une intégrale ?</h3>

      <CourseHighlight title="Définition de l'intégrale définie" type="concept">
        <p>
          L'intégrale définie de f sur l'intervalle [a, b] représente l'aire (algébrique) sous la courbe de f entre a et b :
        </p>
        <CourseEquation latex="\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i)\,\Delta x" />
        <p className="mt-2">
          C'est la limite d'une somme de Riemann, qui découpe l'intervalle en n sous-intervalles de largeur Δx.
        </p>
      </CourseHighlight>

      <RiemannSum />

      <h3 className="text-xl font-medium mt-6 mb-3">Théorème fondamental du calcul</h3>

      <p className="mb-4">
        Le théorème fondamental du calcul établit le lien entre dérivation et intégration :
      </p>

      <CourseEquation latex="\int_a^b f(x)\,dx = F(b) - F(a)" />

      <p className="mb-4">
        où F est une primitive de f, c'est-à-dire F′(x) = f(x). Ici, F(x) = x³/3 donne bien ∫₀³ x² dx = 27/3 = 9.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">Applications en statistiques et probabilités</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Calcul de probabilités</h4>
          <p className="text-sm text-gray-700">
            Pour une variable aléatoire continue X de densité f, la probabilité que X se trouve entre a et b est :
          </p>
          <CourseEquation latex="P(a \leq X \leq b) = \int_a^b f(x)\,dx" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Espérance</h4>
          <p className="text-sm text-gray-700">
            La moyenne « théorique » d'une variable aléatoire continue :
          </p>
          <CourseEquation latex="E[X] = \int_{-\infty}^{+\infty} x\,f(x)\,dx" />
        </Card>

        <Card className="p-4 md:col-span-2">
          <h4 className="font-medium mb-2">Variance</h4>
          <p className="text-sm text-gray-700">
            L'écart quadratique moyen autour de l'espérance μ = E[X] :
          </p>
          <CourseEquation latex="\operatorname{Var}(X) = \int_{-\infty}^{+\infty} (x - \mu)^2\,f(x)\,dx" />
        </Card>
      </div>

      <CourseHighlight title="Application en machine learning" type="example">
        <p>
          En apprentissage bayésien, l'intégrale intervient au dénominateur du théorème de Bayes, pour normaliser la probabilité a posteriori :
        </p>
        <CourseEquation latex="p(\theta \mid D) = \frac{p(D \mid \theta)\,p(\theta)}{\int p(D \mid \theta')\,p(\theta')\,d\theta'}" />
        <p className="mt-2">
          Ce calcul met à jour nos croyances sur les paramètres θ après avoir observé les données D. Il est souvent trop coûteux à calculer exactement, d'où les méthodes d'approximation (MCMC, inférence variationnelle).
        </p>
      </CourseHighlight>

      <CourseHighlight title="À retenir" type="info">
        <ul className="list-disc pl-5 space-y-1">
          <li>Le calcul intégral est fondamental pour comprendre les distributions de probabilités</li>
          <li>Il permet de calculer des aires, des volumes et d'autres quantités cumulatives</li>
          <li>Il est l'opération inverse de la dérivation, comme le montre le théorème fondamental</li>
          <li>En data science, il est particulièrement important en statistiques et en apprentissage bayésien</li>
        </ul>
      </CourseHighlight>

      <p className="mt-4 text-sm text-gray-700">
        Pour aller plus loin : le cours complet{' '}
        <Link to="/fundamentals/math-stats/integral-calculus" className="font-medium text-blue-700 underline">
          Calcul intégral
        </Link>{' '}
        aborde les techniques d'intégration et les applications.
      </p>

      <CourseQuizBlock questions={calculIntegralQuiz} />
    </>
  );
};

export default ModuleCalculIntegral;
