// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { runJavaScriptNode } from "@/lib/lessons/javascript-node";
import { CHALLENGES } from "./challenges";

/**
 * Défis de programmation : chaque corrigé passe ses tests sur le vrai moteur (Pyodide sous Node pour Python,
 * le noyau du bac à sable du site pour JavaScript) et chaque réponse de départ échoue sur un message lisible.
 */
const TEMPS_MAX = 120_000;

const executer = (language: string, code: string) => (language === "javascript" ? runJavaScriptNode(code) : runPythonNode(code));

describe("défis de programmation", () => {
  it("quatre défis, identifiants uniques et stables (clés de progression)", () => {
    expect(CHALLENGES.map((c) => c.id)).toEqual(["python-basics-1", "python-data-1", "python-ml-1", "js-dom-1"]);
  });

  for (const defi of CHALLENGES) {
    it(`${defi.id} : le corrigé passe, la réponse de départ échoue sur un assert lisible`, async () => {
      const { exercise } = defi;
      const avec = (code: string) => `${exercise.setup ? `${exercise.setup}\n` : ""}${code}\n${exercise.test}`;
      const corrige = await executer(exercise.language, avec(exercise.solution));
      expect(corrige.error, exercise.solution).toBeUndefined();
      const depart = await executer(exercise.language, avec(exercise.starter));
      expect(depart.error, "la réponse de départ doit échouer sur un assert lisible").toMatch(/AssertionError: \S/);
      // le corrigé seul (sans les tests) s'exécute aussi et affiche quelque chose, comme dans la page
      const seul = await executer(exercise.language, exercise.solution);
      expect(seul.error).toBeUndefined();
      expect(seul.output.trim().length).toBeGreaterThan(0);
    }, TEMPS_MAX);
  }

  it("le noyau JavaScript sous Node se comporte comme le bac à sable : console.log capturé, erreur « Nom: message »", async () => {
    expect(await runJavaScriptNode("console.log(1 + 1, { a: 2 });")).toEqual({ output: '2 {\n  "a": 2\n}' });
    const echec = await runJavaScriptNode("const e = new Error('raté'); e.name = 'AssertionError'; throw e;");
    expect(echec.error).toBe("AssertionError: raté");
    // un contexte neuf à chaque exécution
    await runJavaScriptNode("globalThis.trace = 1;");
    expect((await runJavaScriptNode("console.log(typeof globalThis.trace);")).output).toBe("undefined");
  });
});
