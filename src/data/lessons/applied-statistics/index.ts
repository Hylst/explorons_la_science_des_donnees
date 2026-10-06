import type { LessonCourse } from "@/lib/lessons/types";
import { moduleDescriptive } from "./m1-descriptive";
import { moduleProbability } from "./m2-probability";
import { moduleHypothesisTesting } from "./m3-hypothesis-testing";
import { moduleCorrelationRegression } from "./m4-correlation-regression";
import { moduleAnova } from "./m5-anova";
import { moduleNonParametric } from "./m6-non-parametric";

/** Cours « Statistiques appliquées » : modules rédigés, calculs faits par scipy.stats et pandas (Pyodide) */
export const appliedStatisticsCourse: LessonCourse = {
  id: "applied-statistics",
  modules: [moduleDescriptive, moduleProbability, moduleHypothesisTesting, moduleCorrelationRegression, moduleAnova, moduleNonParametric],
};
