// @vitest-environment node
import { describeLessonCourse } from "@/lib/lessons/course-checks";
import { supervisedLearningCourse } from "./supervised-learning";
import { dataVisualizationCourse } from "./data-visualization";
import { appliedStatisticsCourse } from "./applied-statistics";
import { guidedProjects } from "./projects";
import { nlpCourse } from "./nlp";
import { pythonCourse } from "./python";

// Cours rédigés en Python : chaque exemple et chaque corrigé est exécuté par Pyodide (mêmes paquets que le site, sans réseau).
for (const course of [supervisedLearningCourse, dataVisualizationCourse, appliedStatisticsCourse, guidedProjects, nlpCourse, pythonCourse]) describeLessonCourse(course);
