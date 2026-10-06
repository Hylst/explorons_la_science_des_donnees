import type { CourseQuizQuestion } from "@/components/courses/CourseQuizBlock";

/**
 * Format des cours rédigés (bases de données, ML supervisé, visualisation, statistiques appliquées).
 * Le contenu est de la donnée : chaque exemple et chaque exercice s'exécute réellement dans le navigateur
 * (SQL : SQLite via sql.js ; Python : Pyodide), et src/data/lessons/*.test.ts exécute exemples et corrigés.
 */
export type LessonLanguage = "sql" | "python";

export type LessonSection =
  /** Texte en markdown (titres ###, listes, **gras**, `code`, tableaux simples) */
  | { kind: "text"; md: string }
  /** Exemple exécutable et modifiable ; `setup` est exécuté avant, sans être affiché (création des tables...) */
  | { kind: "code"; language: LessonLanguage; code: string; setup?: string; caption?: string }
  /**
   * Exercice vérifié. SQL : on compare le résultat de la réponse et celui du corrigé sur les mêmes données
   * (`ordered` : l'ordre des lignes compte). Python : la réponse est suivie de `test` (des assert), qui doit passer.
   */
  | {
      kind: "exercise";
      language: LessonLanguage;
      prompt: string;
      setup?: string;
      starter: string;
      solution: string;
      ordered?: boolean;
      /** Colonnes à comparer, si toutes ne doivent pas l'être (ex. « detail » pour EXPLAIN QUERY PLAN) */
      columns?: string[];
      test?: string;
      hint?: string;
    }
  /** Encadré : à retenir, attention, astuce */
  | { kind: "note"; tone: "info" | "warning" | "tip"; md: string };

export interface LessonModule {
  /** Identifiant stable (sert à mémoriser la progression : ne pas le changer) */
  id: string;
  title: string;
  /** Durée indicative, par exemple « 2 h » */
  duration: string;
  summary: string;
  objectives: string[];
  sections: LessonSection[];
  quiz: CourseQuizQuestion[];
}

export interface LessonCourse {
  id: string;
  modules: LessonModule[];
}
