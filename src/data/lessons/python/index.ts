import type { LessonCourse } from "@/lib/lessons/types";
import { module1 } from "./m1-basics";
import { module2 } from "./m2-control";
import { module3 } from "./m3-functions";
import { module4 } from "./m4-numpy";
import { module5 } from "./m5-pandas";
import { module6 } from "./m6-matplotlib";
import { module7 } from "./m7-jupyter";

/**
 * Cours « Python pour la data science » : 7 modules exécutés avec Pyodide. Les identifiants (python-basics, module-1 à module-7)
 * sont ceux de l'ancien cours écrit en composants : la progression enregistrée par les visiteurs est conservée.
 */
export const pythonCourse: LessonCourse = {
  id: "python-basics",
  modules: [module1, module2, module3, module4, module5, module6, module7],
};
