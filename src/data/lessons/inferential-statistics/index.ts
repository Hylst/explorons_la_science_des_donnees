import type { LessonCourse } from "@/lib/lessons/types";
import { module1 } from "./m1-echantillonnage";
import { module2 } from "./m2-intervalles-confiance";
import { module3 } from "./m3-tests-hypotheses";
import { module4 } from "./m4-tests-t";
import { module5 } from "./m5-tests-multiples-puissance";
import { module6 } from "./m6-approche-bayesienne";

/** Cours « Statistiques inférentielles » : estimation, tests et approche bayésienne, compris par la simulation (Pyodide, numpy et scipy.stats) */
export const inferentialStatisticsCourse: LessonCourse = {
  id: "inferential-statistics",
  modules: [module1, module2, module3, module4, module5, module6],
};
