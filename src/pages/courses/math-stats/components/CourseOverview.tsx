import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Target, Gauge, Brain } from 'lucide-react';
import { type CourseModuleInfo } from './CourseModules';
import { formatMinutes } from '@/lib/format-duration';

interface CourseOverviewProps {
  modules: CourseModuleInfo[];
  completedModules: number[];
}

const skills = [
  "Théorie des ensembles",
  "Fonctions et modélisation",
  "Dérivation et gradient",
  "Intégration et probabilités continues",
  "Lecture de formules",
  "Préparation au machine learning"
];

const prerequisites = [
  "Mathématiques de niveau lycée",
  "Curiosité pour les sciences des données",
  "Aucune expérience préalable en programmation requise"
];

const learningOutcomes = [
  "Comprendre l'importance des mathématiques en data science",
  "Manipuler les ensembles, les nombres et les fonctions",
  "Interpréter une dérivée et un gradient, et suivre une descente de gradient",
  "Interpréter une intégrale comme une aire et une probabilité",
  "Être prêt pour l'algèbre linéaire, les probabilités et le machine learning"
];

const CourseOverview = ({ modules, completedModules }: CourseOverviewProps) => {
  // Chiffres calculés à partir du contenu réel du cours
  const totalMinutes = modules.reduce((sum, m) => sum + m.duration, 0);
  const totalExercises = modules.reduce((sum, m) => sum + m.exercises, 0);
  const completedCount = modules.filter((m) => completedModules.includes(m.id)).length;
  const percent = Math.round((completedCount / modules.length) * 100);

  const stats = [
    { icon: BookOpen, color: 'text-blue-600', value: String(modules.length), label: 'Modules' },
    { icon: Target, color: 'text-green-600', value: String(totalExercises), label: 'Exercices corrigés' },
    { icon: Clock, color: 'text-purple-600', value: formatMinutes(totalMinutes), label: 'de lecture' },
    { icon: Gauge, color: 'text-orange-600', value: 'Débutant', label: 'Niveau' }
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="mb-2 text-2xl font-bold sm:text-3xl">Introduction aux mathématiques pour la data science</CardTitle>
          <p className="text-lg text-blue-100">Construisez des fondations solides pour la suite de votre parcours</p>
          <div className="flex flex-wrap gap-3 pt-3">
            <Badge className="bg-white px-3 py-1 text-blue-700 hover:bg-white">Débutant</Badge>
            <Badge className="bg-white px-3 py-1 text-blue-700 hover:bg-white">≈ {formatMinutes(totalMinutes)} de lecture</Badge>
            <Badge className="bg-white px-3 py-1 text-blue-700 hover:bg-white">Rythme conseillé : 4 semaines</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, color, value, label }) => (
          <Card key={label}>
            <CardContent className="p-6 text-center">
              <Icon className={`mx-auto mb-3 h-8 w-8 ${color}`} aria-hidden="true" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-gray-600">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Compétences travaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prérequis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prerequisites.map((req) => (
                <li key={req} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">À l'issue du cours</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {learningOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {completedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Votre progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {completedCount} module{completedCount > 1 ? 's' : ''} sur {modules.length}
              </span>
              <span>{percent}%</span>
            </div>
            <Progress value={percent} className="h-3" aria-label="Progression du cours" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseOverview;
