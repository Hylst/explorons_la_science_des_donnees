// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { MASTERCLASS_EXAMPLES } from "./python-masterclass-examples";

/**
 * Exemples de la masterclass Python : chaque exemple exécutable tourne sans erreur sur le moteur du site, avec son code
 * de préparation caché ; un exemple à lire dit pourquoi il ne s'exécute pas ici.
 */
const examples = Object.entries(MASTERCLASS_EXAMPLES);

describe("exemples de la masterclass Python", () => {
  it("sept exemples ; un seul à lire, parce qu'il importe seaborn", () => {
    expect(examples.map(([id]) => id)).toEqual(["variables", "structures", "dataframe", "salaires", "graphiques", "modele", "projet-final"]);
    const aLire = examples.filter(([, e]) => !e.runnable);
    expect(aLire.map(([id]) => id)).toEqual(["graphiques"]);
    expect(MASTERCLASS_EXAMPLES.graphiques.code).toMatch(/import seaborn/);
    expect(MASTERCLASS_EXAMPLES.graphiques.note).toMatch(/seaborn/);
  });

  for (const [id, example] of examples.filter(([, e]) => e.runnable)) {
    it(`${id} : s'exécute sans erreur et affiche quelque chose`, async () => {
      const code = "setup" in example && example.setup ? `${example.setup}\n${example.code}` : example.code;
      const r = await runPythonNode(code);
      expect(r.error, r.error).toBeUndefined();
      expect(r.output.trim().length).toBeGreaterThan(0);
      if (id === "variables") expect(r.output).toContain("Alice a 28 ans et mesure 1.65m");
      if (id === "structures") expect(r.output).toContain("Mois performants (>20k€): [22000, 25000, 28000]");
      // la préparation de « salaires » recrée le tableau sans rien afficher : la sortie commence par celle de l'exemple
      if (id === "salaires") expect(r.output).not.toContain("EXPLORATION COMPLÈTE DES DONNÉES");
    }, 120_000);
  }

  it("sans sa préparation, l'exemple « salaires » échoue (il continue l'exemple précédent)", async () => {
    const r = await runPythonNode(MASTERCLASS_EXAMPLES.salaires.code);
    expect(r.error).toMatch(/NameError: name 'df' is not defined/);
  }, 120_000);
});
