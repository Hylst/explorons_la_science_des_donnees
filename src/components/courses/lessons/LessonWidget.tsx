import { lazy, Suspense } from "react";
import type { LessonWidget } from "@/lib/lessons/types";

// Chargés à la demande : les schémas du cours Python pèsent plusieurs dizaines de kilo-octets
const NumpyBenchmark = lazy(() => import("@/components/courses/python/NumpyBenchmark"));
const PythonInteractiveSchemas = lazy(() => import("@/components/courses/python/PythonInteractiveSchemas"));
const VennDiagram = lazy(() => import("@/components/courses/CourseFigures").then((m) => ({ default: m.VennDiagram })));
const ActivationFunctions = lazy(() => import("@/components/courses/CourseFigures").then((m) => ({ default: m.ActivationFunctions })));
const TangentLine = lazy(() => import("@/components/courses/CourseFigures").then((m) => ({ default: m.TangentLine })));
const RiemannSum = lazy(() => import("@/components/courses/CourseFigures").then((m) => ({ default: m.RiemannSum })));

const MATH_FIGURES = {
  "venn-diagram": VennDiagram,
  "activation-functions": ActivationFunctions,
  "tangent-line": TangentLine,
  "riemann-sum": RiemannSum,
} as const;

const isMathFigure = (widget: LessonWidget): widget is keyof typeof MATH_FIGURES => widget in MATH_FIGURES;

/** Composant interactif d'un module (section « widget ») : banc d'essai NumPy ou schéma animé */
const LessonWidgetView = ({ widget }: { widget: LessonWidget }) => (
  <div className="mb-4 min-w-0 max-w-full overflow-x-auto">
    <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-muted" aria-hidden="true" />}>
      {widget === "numpy-benchmark" ? (
        <NumpyBenchmark />
      ) : isMathFigure(widget) ? (
        (() => {
          const Figure = MATH_FIGURES[widget];
          return <Figure />;
        })()
      ) : (
        <PythonInteractiveSchemas type={widget} />
      )}
    </Suspense>
  </div>
);

export default LessonWidgetView;
