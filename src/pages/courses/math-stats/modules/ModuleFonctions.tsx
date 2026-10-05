import CourseHighlight from '@/components/courses/CourseHighlight';
import CourseEquation from '@/components/courses/CourseEquation';
import { ActivationFunctions } from '@/components/courses/CourseFigures';
import CourseQuizBlock from '@/components/courses/CourseQuizBlock';
import { fonctionsQuiz } from './quizzes';
import { Card } from '@/components/ui/card';

const ModuleFonctions = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Fonctions et leurs représentations</h2>

      <p className="mb-4">
        Les fonctions sont des relations qui associent à chaque élément d'un ensemble un unique élément d'un autre ensemble. Elles sont essentielles pour modéliser les relations entre variables en data science.
      </p>

      <CourseHighlight title="Qu'est-ce qu'une fonction ?" type="concept">
        <p>
          Une fonction f : X → Y associe à chaque élément x de l'ensemble X (domaine) exactement un élément y de l'ensemble Y (codomaine), noté y = f(x).
        </p>
        <CourseEquation latex="f: X \rightarrow Y, \quad x \mapsto f(x)" />
      </CourseHighlight>

      <h3 className="text-xl font-medium mt-6 mb-3">Types de fonctions importantes en data science</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Fonctions linéaires</h4>
          <p className="text-sm text-gray-700">
            De la forme f(x) = ax + b, elles sont les plus simples et servent de base à de nombreux modèles.
          </p>
          <CourseEquation latex="f(x) = ax + b" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Fonctions polynomiales</h4>
          <p className="text-sm text-gray-700">
            Utilisées pour modéliser des relations non linéaires plus complexes.
          </p>
          <CourseEquation latex="f(x) = a_0 + a_1x + a_2x^2 + \ldots + a_nx^n" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Fonction exponentielle</h4>
          <p className="text-sm text-gray-700">
            Modélise la croissance ou la décroissance rapide ; elle intervient dans la sigmoïde et le softmax.
          </p>
          <CourseEquation latex="f(x) = e^x" />
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Fonctions logistiques (sigmoïdes)</h4>
          <p className="text-sm text-gray-700">
            Convertissent une valeur quelconque en probabilité : cruciales en classification binaire.
          </p>
          <CourseEquation latex="\sigma(x) = \frac{1}{1 + e^{-x}}" />
        </Card>
      </div>

      <ActivationFunctions />

      <CourseHighlight title="Application en machine learning" type="example">
        <p>
          Dans un réseau de neurones, chaque neurone applique une fonction d'activation à une combinaison linéaire de ses entrées :
        </p>
        <CourseEquation latex="\text{sortie} = \sigma\left(\sum_{i=1}^{n} w_i \, x_i + b\right)" />
        <p className="mt-2">
          Les fonctions d'activation courantes sont la sigmoïde, la tangente hyperbolique (tanh) et la ReLU (Rectified Linear Unit), comparées sur la figure ci-dessus.
        </p>
      </CourseHighlight>

      <h3 className="text-xl font-medium mt-6 mb-3">Composition de fonctions</h3>

      <p className="mb-4">
        La composition de fonctions (f ∘ g)(x) = f(g(x)) est fondamentale pour comprendre les réseaux de neurones, qui sont essentiellement des compositions de nombreuses fonctions.
      </p>

      <CourseHighlight title="À retenir" type="info">
        <ul className="list-disc pl-5 space-y-1">
          <li>Les fonctions sont au cœur de la modélisation en data science</li>
          <li>Chaque type de fonction capture différents types de relations dans les données</li>
          <li>Les algorithmes de machine learning apprennent essentiellement les paramètres optimaux de diverses fonctions</li>
          <li>La composition de fonctions permet de créer des modèles complexes à partir de briques simples</li>
        </ul>
      </CourseHighlight>

      <CourseQuizBlock questions={fonctionsQuiz} />
    </>
  );
};

export default ModuleFonctions;
