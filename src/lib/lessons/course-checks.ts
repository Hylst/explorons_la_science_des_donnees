// Contrôles partagés des cours rédigés : à n'appeler que depuis un fichier *.test.ts doté de « // @vitest-environment node »
import { describe, expect, it } from "vitest";
import { compareSqlOutputs, parseSqlTables } from "./check";
import { runSqlNode } from "./sql-node";
import { runPythonNode } from "./python-node";

const PYTHON_TIMEOUT = 120_000;
import type { LessonCourse, LessonSection } from "./types";

const withSetup = (setup: string | undefined, code: string) => (setup ? `${setup}\n${code}` : code);

/**
 * Chaque exemple SQL s'exécute sans erreur sur le vrai moteur (sql.js, comme le site), chaque corrigé renvoie un tableau
 * non vide et se valide lui-même, et la réponse de départ ne suffit pas (sinon l'exercice serait réussi sans rien faire).
 */
export const describeLessonCourse = (course: LessonCourse) => {
  describe(`cours ${course.id}`, () => {
    it("identifiants de modules uniques et stables (kebab-case)", () => {
      const ids = course.modules.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });

    for (const [index, module] of course.modules.entries()) {
      describe(`module ${index + 1} : ${module.title}`, () => {
        it("a des objectifs, du texte, au moins un exemple, un exercice et trois questions de quiz", () => {
          expect(module.objectives.length).toBeGreaterThanOrEqual(2);
          expect(module.sections.some((s) => s.kind === "text")).toBe(true);
          expect(module.sections.some((s) => s.kind === "code")).toBe(true);
          expect(module.sections.some((s) => s.kind === "exercise")).toBe(true);
          expect(module.quiz.length).toBeGreaterThanOrEqual(3);
        });

        it("quiz cohérent : bonne réponse existante, explication, pas de renvoi à une lettre", () => {
          for (const q of module.quiz) {
            expect(q.options.length).toBeGreaterThanOrEqual(2);
            expect(q.correct).toBeGreaterThanOrEqual(0);
            expect(q.correct).toBeLessThan(q.options.length);
            expect(q.explanation.length).toBeGreaterThan(20);
            expect(new Set(q.options).size).toBe(q.options.length);
          }
        });

        it("markdown sans tableau (non rendu sans extension GFM) ni lien externe", () => {
          const texts = module.sections.flatMap((s: LessonSection) =>
            s.kind === "text" || s.kind === "note" ? [s.md] : s.kind === "exercise" ? [s.prompt, s.hint ?? ""] : []
          );
          for (const md of texts) {
            expect(md).not.toMatch(/^\s*\|.*\|\s*$/m);
            expect(md).not.toMatch(/https?:\/\//);
          }
        });

        const sqlSections = module.sections.filter((s) => (s.kind === "code" || s.kind === "exercise") && s.language === "sql");
        for (const [n, section] of sqlSections.entries()) {
          if (section.kind === "code") {
            it(`exemple SQL ${n + 1} s'exécute sans erreur`, async () => {
              const result = await runSqlNode(withSetup(section.setup, section.code));
              expect(result.error, section.code).toBeUndefined();
            });
          } else if (section.kind === "exercise") {
            it(`exercice SQL ${n + 1} : corrigé valide, réponse de départ insuffisante`, async () => {
              const expected = await runSqlNode(withSetup(section.setup, section.solution));
              expect(expected.error, section.solution).toBeUndefined();
              const tables = parseSqlTables(expected.output);
              expect(tables.length, "le corrigé doit renvoyer un tableau (au moins une ligne)").toBeGreaterThan(0);
              expect(compareSqlOutputs(expected.output, expected.output, section.ordered, section.columns)).toEqual({ ok: true });
              const start = await runSqlNode(withSetup(section.setup, section.starter));
              const verdict = start.error ? { ok: false } : compareSqlOutputs(expected.output, start.output, section.ordered, section.columns);
              expect(verdict.ok, "la réponse de départ ne doit pas déjà être juste").toBe(false);
              if (section.ordered) expect(section.solution).toMatch(/ORDER BY/i);
            });
          }
        }

        // Python : exécuté par Pyodide sous Node (mêmes paquets que le site). Le premier chargement prend quelques secondes.
        const pySections = module.sections.filter((s) => (s.kind === "code" || s.kind === "exercise") && s.language === "python");

        // Le moteur ne charge que les paquets vus dans les imports, et garde ceux déjà chargés : un exemple qui a besoin
        // de pandas sans l'importer marche après un autre exemple, mais échoue s'il est lancé en premier.
        it("Python : pandas importé explicitement quand il est requis sans import (as_frame=True)", () => {
          for (const s of pySections) {
            const codes = s.kind === "code" ? [s.code] : s.kind === "exercise" ? [s.starter, s.solution] : [];
            for (const code of codes) if (/as_frame\s*=\s*True/.test(code)) expect(code, code).toMatch(/import pandas/);
          }
        });
        for (const [n, section] of pySections.entries()) {
          if (section.kind === "code") {
            it(`exemple Python ${n + 1} s'exécute sans erreur`, async () => {
              const result = await runPythonNode(withSetup(section.setup, section.code));
              expect(result.error, section.code).toBeUndefined();
            }, PYTHON_TIMEOUT);
          } else if (section.kind === "exercise") {
            it(`exercice Python ${n + 1} : le corrigé passe les tests, la réponse de départ non`, async () => {
              expect(section.test, "un exercice Python doit avoir des tests (assert)").toMatch(/assert\b/);
              const solved = await runPythonNode(`${withSetup(section.setup, section.solution)}\n${section.test}`);
              expect(solved.error, section.solution).toBeUndefined();
              const start = await runPythonNode(`${withSetup(section.setup, section.starter)}\n${section.test}`);
              expect(start.error, "la réponse de départ ne doit pas déjà passer les tests").toBeDefined();
              // l'apprenant doit lire un message en français (assert ..., "message"), pas une erreur technique
              expect(start.error, "la réponse de départ doit échouer sur un assert lisible, pas sur une autre erreur").toMatch(/AssertionError: \S/);
            }, PYTHON_TIMEOUT);
          }
        }
      });
    }
  });
};
