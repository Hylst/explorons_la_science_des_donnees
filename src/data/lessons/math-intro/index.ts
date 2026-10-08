import type { LessonCourse } from "@/lib/lessons/types";
import { module1 } from "./m1-introduction";
import { module2 } from "./m2-nombres";
import { module3 } from "./m3-fonctions";
import { module4 } from "./m4-derivees";
import { module5 } from "./m5-integrales";

/** Cours « Introduction aux mathématiques » : 5 modules rédigés, exécutés avec Python, NumPy, SciPy et Matplotlib (Pyodide) */
export const mathIntroCourse: LessonCourse = {
  id: "math-intro",
  modules: [module1, module2, module3, module4, module5],
};
