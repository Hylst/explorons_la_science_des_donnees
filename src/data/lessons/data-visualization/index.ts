import type { LessonCourse } from "@/lib/lessons/types";
import { modulePrinciples } from "./m1-principles";
import { moduleMatplotlib } from "./m2-matplotlib";
import { moduleStatistical } from "./m3-statistical";
import { moduleInteractive } from "./m4-interactive";
import { moduleGrammar } from "./m5-grammar";
import { moduleWeb } from "./m6-web";
import { moduleDashboard } from "./m7-dashboard";

/** Cours « Visualisation de données » : modules rédigés, graphiques produits par Matplotlib (Pyodide) */
export const dataVisualizationCourse: LessonCourse = {
  id: "data-visualization",
  modules: [modulePrinciples, moduleMatplotlib, moduleStatistical, moduleInteractive, moduleGrammar, moduleWeb, moduleDashboard],
};
