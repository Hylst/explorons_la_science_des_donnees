import { lazy, Suspense } from "react";
import type { LessonWidget } from "@/lib/lessons/types";

// Chargés à la demande : les schémas du cours Python pèsent plusieurs dizaines de kilo-octets
const NumpyBenchmark = lazy(() => import("@/components/courses/python/NumpyBenchmark"));
const PythonInteractiveSchemas = lazy(() => import("@/components/courses/python/PythonInteractiveSchemas"));

/** Composant interactif d'un module (section « widget ») : banc d'essai NumPy ou schéma animé */
const LessonWidgetView = ({ widget }: { widget: LessonWidget }) => (
  <div className="mb-4 min-w-0 max-w-full overflow-x-auto">
    <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-muted" aria-hidden="true" />}>
      {widget === "numpy-benchmark" ? <NumpyBenchmark /> : <PythonInteractiveSchemas type={widget} />}
    </Suspense>
  </div>
);

export default LessonWidgetView;
