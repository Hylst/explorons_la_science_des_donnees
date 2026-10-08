import type { LessonCourse } from "@/lib/lessons/types";
import { module1 } from "./m1-deux-sens-du-mot";
import { module2 } from "./m2-mise-a-l-echelle";
import { module3 } from "./m3-transformations-avancees";
import { module4 } from "./m4-attention-multi-tetes";
import { module5 } from "./m5-bert-gpt-vit";
import { module6 } from "./m6-workflow-et-production";

/** Cours « Transformers » : transformeurs de données de scikit-learn et architecture Transformer, exemples et exercices exécutés par Python (Pyodide) */
export const transformersCourse: LessonCourse = {
  id: "transformers",
  modules: [module1, module2, module3, module4, module5, module6],
};
