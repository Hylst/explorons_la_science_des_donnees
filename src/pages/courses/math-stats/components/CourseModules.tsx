import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, PlayCircle, Clock, BookOpen, Calculator, Brain, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMinutes } from '@/lib/format-duration';

export interface CourseModuleInfo {
  id: number;
  title: string;
  description: string;
  /** Durée estimée, en minutes */
  duration: number;
  /** Nombre de questions d'auto-évaluation du module */
  exercises: number;
}

interface CourseModulesProps {
  modules: CourseModuleInfo[];
  activeModule: number;
  completedModules: number[];
  onModuleSelect: (moduleId: number) => void;
}

const moduleIcons = [Brain, Calculator, TrendingUp, Target, BookOpen];

const CourseModules = ({ modules, activeModule, completedModules, onModuleSelect }: CourseModulesProps) => {
  const completedCount = modules.filter((m) => completedModules.includes(m.id)).length;
  const percent = Math.round((completedCount / modules.length) * 100);
  const remainingMinutes = modules
    .filter((m) => !completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.duration, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Modules du cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {modules.map((module, index) => {
              const isActive = module.id === activeModule;
              const isDone = completedModules.includes(module.id);
              const Icon = moduleIcons[index % moduleIcons.length];
              return (
                <li key={module.id}>
                  <button
                    type="button"
                    onClick={() => onModuleSelect(module.id)}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'w-full rounded-lg border-2 p-4 text-left transition-all duration-200',
                      isActive ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-gray-600" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Module {module.id} : {module.title}
                          </h3>
                          {isDone ? (
                            <CheckCircle className="h-5 w-5 shrink-0 text-green-600" aria-label="Terminé" />
                          ) : isActive ? (
                            <PlayCircle className="h-5 w-5 shrink-0 text-blue-600" aria-label="En cours" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-gray-300" aria-label="À faire" />
                          )}
                        </div>
                        <p className="mb-2 text-xs text-gray-600">{module.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {formatMinutes(module.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" aria-hidden="true" />
                            {module.exercises} exercices
                          </span>
                        </div>
                        {isActive && <Badge className="mt-2 bg-blue-100 text-xs text-blue-800 hover:bg-blue-100">Affiché</Badge>}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Votre progression</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Modules terminés</span>
            <span className="font-semibold">
              {completedCount}/{modules.length}
            </span>
          </div>
          <Progress value={percent} className="h-2" aria-label="Progression du cours" />
          <p className="flex items-center gap-2 border-t pt-3 text-sm text-gray-600">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {remainingMinutes === 0 ? 'Cours terminé, bravo !' : `Temps restant estimé : ${formatMinutes(remainingMinutes)}`}
          </p>
          <p className="text-xs text-gray-500">Votre progression est enregistrée dans ce navigateur uniquement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseModules;
