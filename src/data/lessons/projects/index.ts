import type { LessonCourse } from "@/lib/lessons/types";
import { projectSalesEda } from "./sales-eda";
import { projectIris } from "./iris-classification";
import { projectSentiment } from "./sentiment-analysis";
import { projectSegmentation } from "./customer-segmentation";
import { projectTimeSeries } from "./time-series";

/**
 * Projets guidés de la page Projets : chaque projet est un module (même format que les cours) dont l'identifiant
 * est celui du projet dans src/data/projects.ts, pour partager la progression et les notes (courseId « projects »).
 */
export const guidedProjects: LessonCourse = {
  id: "projects",
  modules: [projectSalesEda, projectIris, projectSentiment, projectSegmentation, projectTimeSeries],
};
