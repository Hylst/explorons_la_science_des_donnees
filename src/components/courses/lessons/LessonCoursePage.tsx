import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Play, CheckCircle2, BookOpen } from "lucide-react";
import CourseLayout from "@/components/layout/CourseLayout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import LessonModuleView from "./LessonModuleView";
import { totalDuration } from "@/lib/lessons/duration";
import type { LessonCourse, LessonLanguage } from "@/lib/lessons/types";

interface LessonCoursePageProps {
  course: LessonCourse;
  title: string;
  categoryName: string;
  description: string;
  level: string;
  icon: LucideIcon;
  language: LessonLanguage;
  /** Section finale « Et ensuite ? » */
  next: ReactNode;
}

const ENGINE: Record<LessonLanguage, { name: string; loading: string; reset: string }> = {
  sql: {
    name: "le vrai moteur SQLite",
    loading: "",
    reset: "La base d'exemple est recréée à chaque exécution : vous ne pouvez rien casser.",
  },
  python: {
    name: "un vrai Python (Pyodide) avec NumPy, pandas, scikit-learn, statsmodels et Matplotlib",
    loading: " Le premier lancement charge Python dans votre navigateur (quelques secondes).",
    reset: "Chaque exécution repart de zéro : les variables d'un exemple ne passent pas au suivant.",
  },
};

/** Page d'un cours rédigé : présentation, mode d'emploi, modules, suite (données dans src/data/lessons) */
const LessonCoursePage = ({ course, title, categoryName, description, level, icon, language, next }: LessonCoursePageProps) => {
  const engine = ENGINE[language];
  return (
    <CourseLayout title={title} categoryName={categoryName} courseName={title}>
      <div className="space-y-8">
        <UnifiedHeroSection
          variant="course"
          titleAs="h2"
          title={title}
          description={description}
          icon={icon}
          courseInfo={{
            level,
            duration: `${totalDuration(course.modules.map((m) => m.duration))} (indicatif)`,
            modules: course.modules.length,
          }}
        />

        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
          <h2 className="mb-3 text-xl font-semibold text-blue-950 dark:text-blue-100">Comment ça marche</h2>
          <ul className="grid grid-cols-1 gap-3 text-sm text-blue-950 md:grid-cols-3 dark:text-blue-100">
            <li className="flex gap-2">
              <Play className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>
                Les exemples sont modifiables : changez le code, cliquez sur « Exécuter », {engine.name} répond.{engine.loading}
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>
                Les exercices sont vérifiés par le moteur lui-même : plusieurs solutions différentes peuvent être justes. Le corrigé n'en est qu'une.
              </span>
            </li>
            <li className="flex gap-2">
              <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Votre progression et vos notes restent dans ce navigateur. {engine.reset}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="modules-titre" className="space-y-4">
          <h2 id="modules-titre" className="text-2xl font-bold">
            Les modules
          </h2>
          {course.modules.map((module, index) => (
            <LessonModuleView key={module.id} courseId={course.id} module={module} number={index + 1} defaultOpen={index === 0} />
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
          <h2 className="mb-2 text-xl font-semibold">Et ensuite ?</h2>
          <div className="text-sm text-slate-700 dark:text-slate-300">{next}</div>
        </section>
      </div>
    </CourseLayout>
  );
};

export default LessonCoursePage;
