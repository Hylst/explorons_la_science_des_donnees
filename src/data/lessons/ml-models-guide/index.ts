import type { LessonCourse } from "@/lib/lessons/types";
import { module1 } from "./m1-choisir-un-modele";
import { module2 } from "./m2-descente-gradient-stochastique";
import { module3 } from "./m3-boosting";
import { module4 } from "./m4-clustering";
import { module5 } from "./m5-apprentissage-par-renforcement";
import { module6 } from "./m6-reseaux-de-neurones";

/** Guide des modèles de machine learning : panorama pour choisir une famille, avec un module pratique par famille non traitée ailleurs */
export const mlModelsGuideCourse: LessonCourse = {
  id: "ml-models-guide",
  modules: [module1, module2, module3, module4, module5, module6],
};
