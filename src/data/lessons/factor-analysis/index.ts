import type { LessonCourse } from "@/lib/lessons/types";
import { modulePourquoiReduire } from "./m1-pourquoi-reduire";
import { moduleAcpPasAPas } from "./m2-acp-pas-a-pas";
import { moduleInterpreterAcp } from "./m3-interpreter-acp";
import { moduleAfc } from "./m4-afc";
import { moduleAcm } from "./m5-acm";
import { moduleApresReduction } from "./m6-apres-reduction";

/** Cours « Analyse factorielle » : ACP, AFC et ACM écrites en NumPy et comparées à scikit-learn, sur les vins de load_wine et l'enquête électorale américaine de 1996 (statsmodels) */
export const factorAnalysisCourse: LessonCourse = {
  id: "factor-analysis",
  modules: [
    modulePourquoiReduire,
    moduleAcpPasAPas,
    moduleInterpreterAcp,
    moduleAfc,
    moduleAcm,
    moduleApresReduction,
  ],
};
