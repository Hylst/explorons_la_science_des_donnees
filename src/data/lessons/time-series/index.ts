import type { LessonCourse } from "@/lib/lessons/types";
import { moduleDonneesDatees } from "./m1-donnees-datees";
import { moduleDecomposition } from "./m2-decomposition";
import { modulePrevoirEvaluer } from "./m3-prevoir-evaluer";
import { moduleAutocorrelation } from "./m4-autocorrelation";
import { moduleArima } from "./m5-arima";
import { moduleSaisonnalite } from "./m6-saisonnalite";

/** Cours « Séries temporelles » : séries réelles fournies avec statsmodels (CO2, Nil, taches solaires, El Niño), calculs par statsmodels */
export const timeSeriesCourse: LessonCourse = {
  id: "time-series",
  modules: [moduleDonneesDatees, moduleDecomposition, modulePrevoirEvaluer, moduleAutocorrelation, moduleArima, moduleSaisonnalite],
};
