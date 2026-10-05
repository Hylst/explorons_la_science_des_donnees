import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, Code, Calculator } from 'lucide-react';
import CourseItemActions from '@/components/courses/CourseItemActions';
import { useCourseProgress } from '@/hooks/use-course-progress';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'theory' | 'practice' | 'project';
}

interface CourseModuleTemplateProps {
  /** Identifiant du cours : sépare les données de suivi et de notes de chaque cours */
  courseId: string;
  modules: CourseModule[];
  primaryColor: string;
}

// Classes complètes (et non construites avec la couleur) : sinon Tailwind ne les génère pas au build
const START_BUTTON_STYLES: Record<string, string> = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700',
  indigo: 'bg-indigo-600 text-white hover:bg-indigo-700',
  emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
  green: 'bg-green-600 text-white hover:bg-green-700',
  purple: 'bg-purple-600 text-white hover:bg-purple-700',
  rose: 'bg-rose-600 text-white hover:bg-rose-700',
  orange: 'bg-orange-600 text-white hover:bg-orange-700'
};

const BADGE_STYLES: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  rose: 'bg-rose-100 text-rose-600',
  orange: 'bg-orange-100 text-orange-600'
};

const iconForType = (type?: string) => {
  switch (type) {
    case 'practice':
      return <Code className="h-4 w-4" aria-hidden="true" />;
    case 'project':
      return <Calculator className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Play className="h-4 w-4" aria-hidden="true" />;
  }
};

const CourseModuleTemplate: React.FC<CourseModuleTemplateProps> = ({ courseId, modules, primaryColor }) => {
  const { statusOf, countDone } = useCourseProgress(courseId);
  const doneCount = countDone(modules.map((m) => m.id));
  const percent = modules.length > 0 ? Math.round((doneCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {doneCount} module{doneCount > 1 ? 's' : ''} terminé{doneCount > 1 ? 's' : ''} sur {modules.length}
          </span>
          <span className="text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="h-2" aria-label="Avancement dans le programme" />
        <p className="mt-2 text-xs text-muted-foreground">
          Suivez votre avancement et prenez des notes : elles sont enregistrées dans ce navigateur, sur cet appareil uniquement.
        </p>
      </div>

      {modules.map((module, index) => {
        const done = statusOf(module.id) === 'done';
        return (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${BADGE_STYLES[primaryColor] ?? BADGE_STYLES.blue}`}>
                    {done ? (
                      <CheckCircle className="h-5 w-5 text-green-600" aria-label="Terminé" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                    {module.level && (
                      <Badge variant="outline" className="mt-1">
                        {module.level}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline">{module.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CourseItemActions
                courseId={courseId}
                itemId={module.id}
                itemTitle={module.title}
                startLabel="Commencer"
                startIcon={iconForType(module.type)}
                startClassName={START_BUTTON_STYLES[primaryColor] ?? START_BUTTON_STYLES.blue}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CourseModuleTemplate;
