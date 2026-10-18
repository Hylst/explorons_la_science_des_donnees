// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { ADVANCED_CONCEPTS } from "./advanced-concepts";

/**
 * Concepts avancés de la page Programmation : chaque exemple proposé à l'exécution (bouton « Exécuter ») tourne sans
 * erreur sur le moteur du site ; les identifiants (clés de progression) restent stables.
 * Les deux exemples asynchrones appellent asyncio.run, que le worker du site et runPythonNode remplacent tous deux par un
 * await (adaptAsyncio, lib/runner/python-setup.ts). Exécutés aussi dans Chrome sans interface le 18 octobre 2026.
 */
const concepts = Object.values(ADVANCED_CONCEPTS).flatMap((category) => category.concepts);

describe("concepts avancés de la page Programmation", () => {
  it("cinq concepts, identifiants stables", () => {
    expect(concepts.map((c) => c.id)).toEqual(["promises-basics", "async-patterns", "module-structure", "import-strategies", "advanced-oop"]);
  });

  for (const concept of concepts.filter((c) => c.runnable !== false)) {
    it(`${concept.id} : l'exemple s'exécute sans erreur et affiche quelque chose`, async () => {
      const r = await runPythonNode(concept.code);
      expect(r.error, r.error).toBeUndefined();
      expect(r.output.trim().length).toBeGreaterThan(0);
    }, 120_000);
  }
});
