import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, Brain, Calculator, TrendingUp, BookOpen, Users } from 'lucide-react';

interface CourseLearningObjectivesProps {
  /** Modules terminés : l'objectif n° N est atteint quand le module n° N est terminé */
  completedModules: number[];
  onOpenModule: (moduleId: number) => void;
}

const objectives = [
  {
    id: 1,
    title: "Comprendre l'importance des mathématiques",
    description: "Saisir pourquoi les mathématiques sont le fondement de la data science",
    skills: ["Pensée analytique", "Vision d'ensemble", "Motivation"],
    icon: <Brain className="h-6 w-6 text-purple-600" aria-hidden="true" />
  },
  {
    id: 2,
    title: "Se familiariser avec les ensembles et les nombres",
    description: "Manipuler les concepts fondamentaux de la théorie des ensembles",
    skills: ["Logique mathématique", "Opérations d'ensembles", "Types de nombres"],
    icon: <Calculator className="h-6 w-6 text-blue-600" aria-hidden="true" />
  },
  {
    id: 3,
    title: "Appliquer les fonctions mathématiques",
    description: "Utiliser les fonctions pour modéliser des phénomènes réels",
    skills: ["Modélisation", "Représentation graphique", "Fonctions d'activation"],
    icon: <TrendingUp className="h-6 w-6 text-green-600" aria-hidden="true" />
  },
  {
    id: 4,
    title: "Comprendre le calcul différentiel",
    description: "Appliquer les dérivées pour l'optimisation et l'analyse",
    skills: ["Dérivation", "Gradient", "Descente de gradient"],
    icon: <Target className="h-6 w-6 text-orange-600" aria-hidden="true" />
  },
  {
    id: 5,
    title: "Utiliser le calcul intégral",
    description: "Appliquer les intégrales en probabilités et en statistiques",
    skills: ["Intégration", "Probabilités continues", "Espérance et variance"],
    icon: <BookOpen className="h-6 w-6 text-red-600" aria-hidden="true" />
  }
];

const careerPaths = [
  {
    title: "Data Scientist",
    description: "Analyser et interpréter des données complexes pour les entreprises",
    requirements: ["Statistiques avancées", "Machine Learning", "Programmation"],
    icon: <Brain className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Machine Learning Engineer",
    description: "Développer et déployer des modèles d'apprentissage automatique",
    requirements: ["Algèbre linéaire", "Optimisation", "Déploiement"],
    icon: <Target className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Statisticien",
    description: "Appliquer des méthodes statistiques pour résoudre des problèmes",
    requirements: ["Statistiques", "Probabilités", "Tests d'hypothèses"],
    icon: <TrendingUp className="h-5 w-5" aria-hidden="true" />
  }
];

const readings = [
  '« The Art of Statistics », David Spiegelhalter',
  '« Mathematics for Machine Learning », Deisenroth, Faisal et Ong',
  '« Think Stats », Allen B. Downey'
];

const tools = ['Python (NumPy, SciPy, Matplotlib)', "R pour l'analyse statistique", 'Wolfram Alpha pour vérifier vos calculs'];

const CourseLearningObjectives = ({ completedModules, onOpenModule }: CourseLearningObjectivesProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Objectifs d'apprentissage détaillés
          </CardTitle>
          <p className="text-gray-600">À la fin de ce cours, vous serez capable de :</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {objectives.map((objective) => {
              const done = completedModules.includes(objective.id);
              return (
                <li key={objective.id} className="border-l-4 border-blue-500 py-2 pl-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">{objective.icon}</div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{objective.title}</h3>
                        {done && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" aria-hidden="true" />
                            Atteint
                          </Badge>
                        )}
                      </div>
                      <p className="mb-3 text-gray-700">{objective.description}</p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {objective.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onOpenModule(objective.id)}>
                        {done ? 'Revoir' : 'Ouvrir'} le module {objective.id}
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Débouchés professionnels
          </CardTitle>
          <p className="text-gray-600">Ces compétences préparent à des métiers comme :</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {careerPaths.map((career) => (
              <div key={career.title} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  {career.icon}
                  <h3 className="font-semibold">{career.title}</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">{career.description}</p>
                <p className="mb-1 text-xs font-medium text-gray-700">Compétences clés :</p>
                <ul className="space-y-1">
                  {career.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="h-1 w-1 rounded-full bg-blue-500" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            Ressources complémentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold">Lectures recommandées</h3>
              <ul className="space-y-2 text-sm">
                {readings.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Outils pratiques</h3>
              <ul className="space-y-2 text-sm">
                {tools.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLearningObjectives;
