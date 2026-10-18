// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { PRACTICAL_EXERCISES } from "./programming-exercises";

/**
 * Exercices pratiques de la page Programmation : chaque exercice vérifié passe avec son corrigé et échoue avec la
 * réponse de départ ; chaque script complet présenté comme exécutable s'exécute sans erreur sur le moteur du site.
 */
const TEMPS_MAX = 180_000;

describe("exercices pratiques de la page Programmation", () => {
  it("six exercices, identifiants stables (clés de progression)", () => {
    expect(PRACTICAL_EXERCISES.map((e) => e.id)).toEqual(["ex1", "ex2", "ex3", "ex4", "ex6", "ex5"]);
  });

  it("un script non exécutable dit pourquoi : lecture du clavier (ex1), durée au-delà de la limite de 30 s (ex5)", () => {
    expect(PRACTICAL_EXERCISES.filter((x) => !x.scriptRunnable).map((x) => x.id)).toEqual(["ex1", "ex5"]);
    const [ex1, ex5] = ["ex1", "ex5"].map((id) => PRACTICAL_EXERCISES.find((x) => x.id === id)!);
    expect(ex1.script).toMatch(/input\(/);
    expect(ex1.scriptNote).toMatch(/input\(\)/);
    expect(ex5.scriptNote).toMatch(/30 secondes/);
  });

  it("ex5 : le script complet, trop long pour la page, reste juste (exécuté sous Node)", async () => {
    const r = await runPythonNode(PRACTICAL_EXERCISES.find((x) => x.id === "ex5")!.script);
    expect(r.error, r.error).toBeUndefined();
    expect(r.output).toContain("Niveau de risque");
  }, TEMPS_MAX);

  for (const e of PRACTICAL_EXERCISES) {
    it(`${e.id} : le corrigé passe, la réponse de départ échoue sur un assert lisible`, async () => {
      const avec = (code: string) => `${e.exercise.setup ? `${e.exercise.setup}\n` : ""}${code}\n${e.exercise.test}`;
      const corrige = await runPythonNode(avec(e.exercise.solution));
      expect(corrige.error, e.exercise.solution).toBeUndefined();
      const depart = await runPythonNode(avec(e.exercise.starter));
      expect(depart.error, "la réponse de départ doit échouer sur un assert lisible").toMatch(/AssertionError: \S/);
    }, TEMPS_MAX);

    if (e.scriptRunnable) {
      it(`${e.id} : le script complet s'exécute sur le moteur du site`, async () => {
        const r = await runPythonNode(e.script);
        expect(r.error, r.error).toBeUndefined();
        expect(r.output.trim().length).toBeGreaterThan(100);
      }, TEMPS_MAX);
    }
  }
});
