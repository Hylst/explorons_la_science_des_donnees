import { lazy, Suspense, useState } from "react";
import LessonWidgetView from "./LessonWidget";
import { ChevronDown, Clock, Target, Info, AlertTriangle, Lightbulb, Play } from "lucide-react";
import CourseQuizBlock from "@/components/courses/CourseQuizBlock";
import CourseItemActions from "@/components/courses/CourseItemActions";
import LessonMarkdown from "./LessonMarkdown";
import RunnableCode from "./RunnableCode";
import LessonExercise from "./LessonExercise";
import { frenchSpacing } from "@/lib/lessons/typography";
import type { LessonModule } from "@/lib/lessons/types";

// KaTeX (environ 77 Ko) n'est chargé que si le module contient une formule
const CourseEquation = lazy(() => import("@/components/courses/CourseEquation"));

interface LessonModuleViewProps {
  courseId: string;
  module: LessonModule;
  number: number;
  defaultOpen?: boolean;
}

const NOTE_STYLE = {
  info: { icon: Info, className: "border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100", label: "À retenir" },
  warning: { icon: AlertTriangle, className: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100", label: "Attention" },
  tip: { icon: Lightbulb, className: "border-green-300 bg-green-50 text-green-950 dark:border-green-800 dark:bg-green-950/40 dark:text-green-100", label: "Astuce" },
} as const;

/** Un module de cours rédigé : objectifs, texte, exemples exécutables, exercices vérifiés, quiz, progression */
const LessonModuleView = ({ courseId, module, number, defaultOpen = false }: LessonModuleViewProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `module-${module.id}-contenu`;
  let exerciseCount = 0;
  let exampleCount = 0;

  return (
    <section id={`module-${module.id}`} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start gap-4 rounded-xl p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">{number}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-semibold text-slate-900 dark:text-slate-100">{module.title}</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{frenchSpacing(module.summary)}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {module.duration} (indicatif)
            </span>
          </span>
          <ChevronDown className={`mt-2 h-5 w-5 flex-shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      {open && (
        <div id={panelId} className="border-t border-slate-200 p-5 dark:border-slate-700">
          <div className="mb-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Target className="h-4 w-4" aria-hidden="true" />
              Objectifs
            </p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {module.objectives.map((objective) => (
                <li key={objective}>{frenchSpacing(objective)}</li>
              ))}
            </ul>
          </div>
          {module.sections.map((section, index) => {
            if (section.kind === "text") return <LessonMarkdown key={index} md={section.md} />;
            if (section.kind === "note") {
              const style = NOTE_STYLE[section.tone];
              const Icon = style.icon;
              return (
                <aside key={index} className={`mb-4 rounded-lg border-l-4 p-4 text-sm ${style.className}`}>
                  <p className="mb-1 flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {style.label}
                  </p>
                  <LessonMarkdown md={section.md} />
                </aside>
              );
            }
            if (section.kind === "widget") return <LessonWidgetView key={index} widget={section.widget} />;
            if (section.kind === "equation") {
              return (
                <figure key={index} className="mb-4">
                  <Suspense fallback={<div className="h-12" aria-hidden="true" />}>
                    <CourseEquation latex={section.latex} />
                  </Suspense>
                  {section.caption && <figcaption className="mt-1 text-center text-sm text-muted-foreground">{frenchSpacing(section.caption)}</figcaption>}
                </figure>
              );
            }
            if (section.kind === "code") {
              exampleCount += 1;
              return (
                <RunnableCode
                  key={index}
                  language={section.language}
                  code={section.code}
                  setup={section.setup}
                  caption={section.caption}
                  label={`Exemple ${exampleCount} du module ${number}, modifiable`}
                />
              );
            }
            exerciseCount += 1;
            return <LessonExercise key={index} exercise={section} number={exerciseCount} />;
          })}
          {module.quiz.length > 0 && <CourseQuizBlock title={`Quiz du module ${number}`} questions={module.quiz} />}
          <CourseItemActions
            courseId={courseId}
            itemId={module.id}
            itemTitle={`Module ${number} : ${module.title}`}
            startLabel="Commencer le module"
            startIcon={<Play className="h-4 w-4" />}
            startClassName="bg-blue-600 text-white hover:bg-blue-700"
            className="mt-6 border-t pt-4"
          />
        </div>
      )}
    </section>
  );
};

export default LessonModuleView;
