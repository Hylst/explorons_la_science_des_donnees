import type { LessonCourse } from "@/lib/lessons/types";
import { moduleIntroduction } from "./m1-introduction";
import { moduleLinearRegression } from "./m2-linear-regression";
import { moduleLogisticRegression } from "./m3-logistic-regression";
import { moduleDecisionTrees } from "./m4-decision-trees";
import { moduleRandomForests } from "./m5-random-forests";
import { moduleSvm } from "./m6-svm";
import { moduleEvaluation } from "./m7-evaluation";
import { moduleHyperparameters } from "./m8-hyperparameters";

/** Cours « Machine learning supervisé » : modules rédigés, exemples et exercices exécutés par Python (Pyodide) */
export const supervisedLearningCourse: LessonCourse = {
  id: "supervised-learning",
  modules: [moduleIntroduction, moduleLinearRegression, moduleLogisticRegression, moduleDecisionTrees, moduleRandomForests, moduleSvm, moduleEvaluation, moduleHyperparameters],
};
