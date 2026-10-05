import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isNumberArray, readJSON, readStorage, writeJSON, writeStorage } from '@/lib/storage';
import CourseModules, { type CourseModuleInfo } from './CourseModules';
import CourseOverview from './CourseOverview';
import CourseLearningObjectives from './CourseLearningObjectives';
import ModuleIntroduction from '../modules/ModuleIntroduction';
import ModuleNombresEnsembles from '../modules/ModuleNombresEnsembles';
import ModuleFonctions from '../modules/ModuleFonctions';
import ModuleCalculDifferentiel from '../modules/ModuleCalculDifferentiel';
import ModuleCalculIntegral from '../modules/ModuleCalculIntegral';
import {
  introductionQuiz,
  nombresEnsemblesQuiz,
  fonctionsQuiz,
  calculDifferentielQuiz,
  calculIntegralQuiz
} from '../modules/quizzes';

const COMPLETED_KEY = 'math-intro-completed';
const ACTIVE_KEY = 'math-intro-active-module';
const TAB_KEY = 'math-intro-tab';

type TabValue = 'modules' | 'overview' | 'objectives';
const TAB_VALUES: TabValue[] = ['modules', 'overview', 'objectives'];

interface ModuleEntry extends CourseModuleInfo {
  Component: () => JSX.Element;
}

/** Les 5 modules du cours, dans l'ordre pédagogique : durées et nombre d'exercices reflètent le contenu réel. */
const MODULES: ModuleEntry[] = [
  {
    id: 1,
    title: 'Pourquoi les maths ?',
    description: "Le rôle des mathématiques en data science : piliers, applications et exemple concret",
    duration: 30,
    exercises: introductionQuiz.length,
    Component: ModuleIntroduction
  },
  {
    id: 2,
    title: 'Nombres et ensembles',
    description: 'Union, intersection, différence, types de nombres et applications aux données',
    duration: 30,
    exercises: nombresEnsemblesQuiz.length,
    Component: ModuleNombresEnsembles
  },
  {
    id: 3,
    title: 'Fonctions',
    description: 'Représentations, fonctions usuelles, fonctions d\'activation et composition',
    duration: 35,
    exercises: fonctionsQuiz.length,
    Component: ModuleFonctions
  },
  {
    id: 4,
    title: 'Calcul différentiel',
    description: 'Dérivée, règles de dérivation, gradient et descente de gradient',
    duration: 40,
    exercises: calculDifferentielQuiz.length,
    Component: ModuleCalculDifferentiel
  },
  {
    id: 5,
    title: 'Calcul intégral',
    description: 'Intégrale, théorème fondamental, probabilités continues, espérance et variance',
    duration: 40,
    exercises: calculIntegralQuiz.length,
    Component: ModuleCalculIntegral
  }
];

const moduleIds = MODULES.map((m) => m.id);

const loadCompleted = () => readJSON<number[]>(COMPLETED_KEY, [], isNumberArray).filter((id) => moduleIds.includes(id));

const loadActive = () => {
  const stored = Number(readStorage(ACTIVE_KEY));
  return moduleIds.includes(stored) ? stored : moduleIds[0];
};

const loadTab = (): TabValue => {
  const stored = readStorage(TAB_KEY);
  return TAB_VALUES.includes(stored as TabValue) ? (stored as TabValue) : 'modules';
};

const MathCourseModules = () => {
  const [completed, setCompleted] = useState<number[]>(loadCompleted);
  const [active, setActive] = useState<number>(loadActive);
  const [tab, setTab] = useState<TabValue>(loadTab);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => writeJSON(COMPLETED_KEY, completed), [completed]);
  useEffect(() => writeStorage(ACTIVE_KEY, String(active)), [active]);
  useEffect(() => writeStorage(TAB_KEY, tab), [tab]);

  const activeModule = useMemo(() => MODULES.find((m) => m.id === active) ?? MODULES[0], [active]);
  const position = moduleIds.indexOf(activeModule.id);
  const isDone = completed.includes(activeModule.id);

  // Ramène le haut du module à l'écran après un choix de l'utilisateur (jamais au premier affichage)
  const showModuleTop = useCallback(() => {
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }, []);

  const selectModule = useCallback(
    (id: number) => {
      setActive(id);
      showModuleTop();
    },
    [showModuleTop]
  );

  const openModuleFromObjectives = useCallback((id: number) => {
    setActive(id);
    setTab('modules');
    window.setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, []);

  const toggleDone = () =>
    setCompleted((prev) => (prev.includes(activeModule.id) ? prev.filter((id) => id !== activeModule.id) : [...prev, activeModule.id]));

  const ActiveComponent = activeModule.Component;
  const previous = MODULES[position - 1];
  const next = MODULES[position + 1];

  return (
    <section id="modules" ref={sectionRef} className="mb-16 scroll-mt-24">
      <h2 className="mb-6 text-3xl font-bold">Programme du cours</h2>
      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <CourseModules modules={MODULES} activeModule={activeModule.id} completedModules={completed} onModuleSelect={selectModule} />
            </aside>

            <div ref={contentRef} className="min-w-0 scroll-mt-24">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <p className="mb-4 text-sm font-medium uppercase tracking-wide text-blue-700">
                    Module {activeModule.id} sur {MODULES.length}
                  </p>
                  <ActiveComponent />

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
                    <Button variant="outline" disabled={!previous} onClick={() => previous && selectModule(previous.id)}>
                      <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                      {previous ? `Module ${previous.id}` : 'Début'}
                    </Button>

                    <Button variant={isDone ? 'secondary' : 'default'} onClick={toggleDone} aria-pressed={isDone}>
                      {isDone ? <CheckCircle className="mr-2 h-4 w-4 text-green-600" aria-hidden="true" /> : <Circle className="mr-2 h-4 w-4" aria-hidden="true" />}
                      {isDone ? 'Module terminé' : 'Marquer comme terminé'}
                    </Button>

                    <Button variant="outline" disabled={!next} onClick={() => next && selectModule(next.id)}>
                      {next ? `Module ${next.id}` : 'Fin'}
                      <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <CourseOverview modules={MODULES} completedModules={completed} />
        </TabsContent>

        <TabsContent value="objectives" className="mt-6">
          <CourseLearningObjectives completedModules={completed} onOpenModule={openModuleFromObjectives} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MathCourseModules;
