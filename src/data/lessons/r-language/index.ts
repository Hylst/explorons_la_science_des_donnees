import type { LessonCourse } from "@/lib/lessons/types";
import { moduleRPremiersPas } from "./m1-premiers-pas";
import { moduleRDplyr } from "./m2-manipuler-dplyr";
import { moduleRGgplot } from "./m3-graphiques-ggplot2";
import { moduleRStatistiques } from "./m4-statistiques";
import { moduleRChoisir } from "./m5-choisir-et-passer";

/**
 * Cours « R pour la data science » (décision de l'auteur du 24 octobre 2026) : le code R est à lire, le moteur du site n'a pas R ;
 * chaque notion est exécutée dans son équivalent Python (pandas, Matplotlib, statsmodels), et les sorties montrées sont celles de Python.
 */
export const rLanguageCourse: LessonCourse = {
  id: "r-language",
  modules: [moduleRPremiersPas, moduleRDplyr, moduleRGgplot, moduleRStatistiques, moduleRChoisir],
};
