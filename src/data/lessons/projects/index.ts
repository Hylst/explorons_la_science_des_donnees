import type { LessonCourse } from "@/lib/lessons/types";
import { projectSalesEda } from "./sales-eda";
import { projectIris } from "./iris-classification";
import { projectSentiment } from "./sentiment-analysis";
import { projectSegmentation } from "./customer-segmentation";
import { projectTimeSeries } from "./time-series";
import { projectFraud } from "./fraud-detection";
import { projectHousePrices } from "./house-prices";
import { projectRecommendation } from "./recommendation";

/**
 * Projets guidés de la page Projets : chaque projet est un module (même format que les cours) dont l'identifiant
 * est celui du projet dans src/data/projects.ts, pour partager la progression et les notes (courseId « projects »).
 */
export const guidedProjects: LessonCourse = {
  id: "projects",
  // Dans l'ordre des identifiants de src/data/projects.ts (débutant, puis intermédiaire 1 à 5)
  modules: [
    projectSalesEda,
    projectIris,
    projectSentiment,
    projectRecommendation,
    projectHousePrices,
    projectFraud,
    projectSegmentation,
    projectTimeSeries,
  ],
};
