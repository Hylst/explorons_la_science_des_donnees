// @vitest-environment node
import { describeLessonCourse } from "@/lib/lessons/course-checks";
import { databaseFundamentalsCourse } from "./database-fundamentals";

// Cours rédigés contrôlés par le vrai moteur SQL (voir lib/lessons/course-checks.ts). Les cours Python sont contrôlés à part (Pyodide).
for (const course of [databaseFundamentalsCourse]) describeLessonCourse(course);
