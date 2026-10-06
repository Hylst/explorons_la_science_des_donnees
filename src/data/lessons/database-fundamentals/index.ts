import type { LessonCourse } from "@/lib/lessons/types";
import { moduleIntroduction } from "./m1-introduction";
import { moduleSqlBasics } from "./m2-sql-basics";
import { moduleDataModeling } from "./m3-data-modeling";
import { moduleAdvancedSql } from "./m4-advanced-sql";
import { moduleNosql } from "./m5-nosql";
import { modulePerformance } from "./m6-performance";

/** Cours « Fondamentaux des bases de données » : modules rédigés, exemples et exercices exécutés par SQLite */
export const databaseFundamentalsCourse: LessonCourse = {
  id: "database-fundamentals",
  modules: [moduleIntroduction, moduleSqlBasics, moduleDataModeling, moduleAdvancedSql, moduleNosql, modulePerformance],
};
