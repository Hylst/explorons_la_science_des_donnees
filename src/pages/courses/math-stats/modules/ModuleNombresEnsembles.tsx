import CourseHighlight from '@/components/courses/CourseHighlight';
import { VennDiagram } from '@/components/courses/CourseFigures';
import CourseQuizBlock from '@/components/courses/CourseQuizBlock';
import { nombresEnsemblesQuiz } from './quizzes';
import { Card } from '@/components/ui/card';

const ModuleNombresEnsembles = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Nombres et ensembles : les briques élémentaires</h2>

      <p className="mb-4">
        Les ensembles et les différents types de nombres forment la base de toute la structure mathématique utilisée en data science.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">Ensembles et opérations</h3>

      <p className="mb-4">
        Un ensemble est une collection d'objets distincts. En data science, les ensembles nous permettent de structurer les données et d'effectuer des opérations logiques sur celles-ci.
      </p>

      <CourseHighlight title="Opérations sur les ensembles" type="concept">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Union (A ∪ B)</strong> : tous les éléments qui sont dans A OU dans B</li>
          <li><strong>Intersection (A ∩ B)</strong> : les éléments qui sont à la fois dans A ET dans B</li>
          <li><strong>Différence (A \ B)</strong> : les éléments qui sont dans A mais PAS dans B</li>
          <li><strong>Complémentaire (Aᶜ)</strong> : tous les éléments de l'univers Ω qui ne sont PAS dans A</li>
        </ul>
      </CourseHighlight>

      <VennDiagram />

      <p className="mb-2">Ces opérations existent telles quelles dans la plupart des langages. En Python :</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100"><code>{`A = {1, 2, 3, 4}
B = {3, 4, 5}

A | B   # union         -> {1, 2, 3, 4, 5}
A & B   # intersection  -> {3, 4}
A - B   # différence    -> {1, 2}`}</code></pre>

      <h3 className="text-xl font-medium mt-6 mb-3">Types de nombres</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Nombres entiers (ℤ)</h4>
          <p className="text-sm text-gray-700">
            {"…, -2, -1, 0, 1, 2, …"} : utilisés pour compter et indexer.
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Nombres rationnels (ℚ)</h4>
          <p className="text-sm text-gray-700">
            Nombres qui s'écrivent comme des fractions (p/q avec p, q ∈ ℤ et q ≠ 0).
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Nombres réels (ℝ)</h4>
          <p className="text-sm text-gray-700">
            Incluent les rationnels et les irrationnels (π, e, √2) : utilisés pour les mesures continues.
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Nombres complexes (ℂ)</h4>
          <p className="text-sm text-gray-700">
            De la forme a + bi avec i² = −1 : utilisés en traitement du signal (transformée de Fourier) et dans certains algorithmes avancés.
          </p>
        </Card>
      </div>

      <CourseHighlight title="Application en data science" type="example">
        <p>
          En préparation des données (data preprocessing), on utilise souvent des opérations ensemblistes :
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Sélection de caractéristiques</strong> : l'intersection des variables jugées importantes par plusieurs modèles donne les caractéristiques les plus robustes.</li>
          <li><strong>Détection d'anomalies</strong> : on repère les valeurs qui n'appartiennent pas à l'ensemble des valeurs « normales ».</li>
          <li><strong>Division des données</strong> : on partitionne le jeu de données en ensembles d'entraînement et de test disjoints.</li>
        </ul>
      </CourseHighlight>

      <CourseQuizBlock questions={nombresEnsemblesQuiz} />
    </>
  );
};

export default ModuleNombresEnsembles;
