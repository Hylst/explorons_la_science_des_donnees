// @vitest-environment node
import { describeLessonCourse } from "@/lib/lessons/course-checks";
import { supervisedLearningCourse } from "./supervised-learning";

// Cours rédigés en Python : chaque exemple et chaque corrigé est exécuté par Pyodide (mêmes paquets que le site, sans réseau).
for (const course of [supervisedLearningCourse]) describeLessonCourse(course);
