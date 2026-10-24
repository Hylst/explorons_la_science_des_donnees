import type { LessonCourse } from "@/lib/lessons/types";
import { moduleNotebookPipeline } from "./m1-du-notebook-au-pipeline";
import { moduleSuiviExperiences } from "./m2-suivi-experiences";
import { moduleEmpaqueterVersionner } from "./m3-empaqueter-versionner";
import { moduleTesterModele } from "./m4-tester-un-modele";
import { moduleServirModele } from "./m5-servir-un-modele";
import { moduleSurveillerDerive } from "./m6-surveiller-derive";

/** Cours « MLOps » : du pipeline reproductible à la surveillance de la dérive, sur les jeux fournis avec scikit-learn et des simulations */
export const mlopsCourse: LessonCourse = {
  id: "mlops",
  modules: [
    moduleNotebookPipeline,
    moduleSuiviExperiences,
    moduleEmpaqueterVersionner,
    moduleTesterModele,
    moduleServirModele,
    moduleSurveillerDerive,
  ],
};
