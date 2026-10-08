import type { CourseQuizQuestion } from "@/components/courses/CourseQuizBlock";

/**
 * Format des cours rédigés (bases de données, ML supervisé, visualisation, statistiques appliquées).
 * Le contenu est de la donnée : chaque exemple et chaque exercice s'exécute réellement dans le navigateur
 * (SQL : SQLite via sql.js ; Python : Pyodide), et src/data/lessons/*.test.ts exécute exemples et corrigés.
 */
export type LessonLanguage = "sql" | "python";

/**
 * Composants interactifs qu'un module peut insérer entre ses sections (cours Python) : banc d'essai NumPy mesuré
 * dans le navigateur et schémas animés de components/courses/python. Chargés à la demande (LessonWidget).
 */
export type LessonWidget =
  | "numpy-benchmark"
  | "numpy-array-structure"
  | "numpy-broadcasting"
  | "pandas-dataframe"
  | "data-types-comparison"
  | "python-vs-numpy-performance"
  | "matplotlib-workflow"
  | "jupyter-workflow"
  /* figures SVG du cours d'introduction aux mathématiques (components/courses/CourseFigures) */
  | "venn-diagram"
  | "activation-functions"
  | "tangent-line"
  | "riemann-sum";

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
  | { kind: "note"; tone: "info" | "warning" | "tip"; md: string }
  /** Composant interactif (schéma, banc d'essai), sans code à vérifier */
  | { kind: "widget"; widget: LessonWidget }
  /** Formule mathématique en LaTeX (rendue par KaTeX ; les tests vérifient qu'elle se compile) */
  | { kind: "equation"; latex: string; caption?: string };

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
