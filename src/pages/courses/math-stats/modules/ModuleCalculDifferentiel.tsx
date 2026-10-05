import { Link } from 'react-router-dom';
import CourseHighlight from '@/components/courses/CourseHighlight';
import CourseEquation from '@/components/courses/CourseEquation';
import { TangentLine } from '@/components/courses/CourseFigures';
import CourseQuizBlock from '@/components/courses/CourseQuizBlock';
import { calculDifferentielQuiz } from './quizzes';
import { Card } from '@/components/ui/card';

const ModuleCalculDifferentiel = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Introduction au calcul différentiel</h2>

      <p className="mb-4">
        Le calcul différentiel étudie comment les fonctions changent lorsque leurs entrées changent. C'est un outil essentiel pour l'optimisation des modèles en machine learning.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">La notion de dérivée</h3>

      <p className="mb-4">
        La dérivée d'une fonction en un point mesure son taux de variation instantané à ce point.
      </p>

      <CourseHighlight title="Définition de la dérivée" type="concept">
        <p>
          La dérivée de f en x₀ est définie comme la limite :
        </p>
        <CourseEquation latex="f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}" />
        <p className="mt-2">
          Géométriquement, c'est la pente de la tangente à la courbe de f au point x₀.
        </p>
      </CourseHighlight>

      <TangentLine />

      <h3 className="text-xl font-medium mt-6 mb-3">Règles de dérivation</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Règle de la somme</h4>
          <CourseEquation latex="(f + g)' = f' + g'" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Règle du produit</h4>
          <CourseEquation latex="(f \cdot g)' = f' \cdot g + f \cdot g'" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Règle de la chaîne</h4>
          <CourseEquation latex="(f \circ g)' = (f' \circ g) \cdot g'" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Dérivée de l'exponentielle</h4>
          <CourseEquation latex="\frac{d}{dx}\left(e^x\right) = e^x" />
        </Card>
      </div>

      <CourseHighlight title="Application en optimisation" type="example">
        <p>
          Dans l'algorithme de descente de gradient, on utilise les dérivées pour minimiser une fonction de coût J(θ) :
        </p>
        <CourseEquation latex="\theta_{\text{nouveau}} = \theta_{\text{ancien}} - \alpha \, \frac{\partial J(\theta)}{\partial \theta}" />
        <p className="mt-2">
          où α est le taux d'apprentissage et ∂J/∂θ le gradient de la fonction de coût par rapport aux paramètres θ.
        </p>
      </CourseHighlight>

      <h3 className="text-xl font-medium mt-6 mb-3">Dérivées partielles et gradient</h3>

      <p className="mb-4">
        Pour une fonction de plusieurs variables, on calcule une dérivée partielle par variable, en gardant les autres constantes. Le gradient est le vecteur de toutes ces dérivées partielles : il pointe dans la direction de plus forte croissance.
      </p>

      <CourseHighlight title="Exemple : f(x, y) = x² + y²" type="example">
        <CourseEquation latex="\nabla f(x, y) = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right) = (2x, \, 2y)" />
        <p className="mt-2">
          Au point (1, 2), le gradient vaut (2, 4). Descendre vers le minimum revient à avancer dans la direction opposée, −∇f, ce qui conduit à l'origine (0, 0).
        </p>
      </CourseHighlight>

      <CourseHighlight title="Pourquoi est-ce important en data science ?" type="info">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Optimisation</strong> : les dérivées indiquent la direction de plus forte pente, utilisée dans la descente de gradient</li>
          <li><strong>Rétropropagation</strong> : l'entraînement des réseaux de neurones repose sur la règle de la chaîne</li>
          <li><strong>Sensibilité</strong> : les dérivées montrent comment les prédictions changent quand les entrées varient légèrement</li>
        </ul>
      </CourseHighlight>

      <p className="mt-4 text-sm text-gray-700">
        Pour aller plus loin : le cours complet{' '}
        <Link to="/fundamentals/math-stats/differential-calculus" className="font-medium text-blue-700 underline">
          Calcul différentiel
        </Link>{' '}
        détaille les règles de dérivation et l'optimisation.
      </p>

      <CourseQuizBlock questions={calculDifferentielQuiz} />
    </>
  );
};

export default ModuleCalculDifferentiel;
