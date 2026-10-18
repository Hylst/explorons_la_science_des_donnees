// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { INTEGRAL_EXERCISES, INTEGRALES_IMPROPRES, KL_ENTROPIE, METHODES_NUMERIQUES, MONTE_CARLO, VERIFIER_PRIMITIVES } from "./integral-demos";

/**
 * Les exemples de la page « Calcul intégral » sont exécutés par le moteur du site (Pyodide, NumPy, SciPy, sans réseau).
 * Chaque nombre cité dans une légende de la page est vérifié ici : si le code change et que le résultat bouge,
 * ce test échoue et la légende doit être corrigée.
 */

const executer = async (code: string) => {
  const resultat = await runPythonNode(code);
  expect(resultat.error, resultat.error).toBeUndefined();
  return resultat.output;
};

const TEMPS_MAX = 120_000;

describe("exemples de la page Calcul intégral", () => {
  it("les trois primitives sont confirmées par quad, la primitive fausse est démasquée", async () => {
    const sortie = await executer(VERIFIER_PRIMITIVES);
    expect(sortie).toContain("substitution : F(b) - F(a) = 3.750000, quad = 3.750000");
    expect(sortie).toContain("par parties : F(b) - F(a) = 1.000000, quad = 1.000000");
    expect(sortie).toContain("fractions partielles : F(b) - F(a) = 0.202733, quad = 0.202733");
    expect(sortie).toContain("primitive fausse x·eˣ : 2.718282 au lieu de 1.000000");
  }, TEMPS_MAX);

  it("point milieu et trapèzes d'ordre 2, Simpson d'ordre 4 (erreurs citées dans la légende)", async () => {
    const sortie = await executer(METHODES_NUMERIQUES);
    expect(sortie).toMatch(/ {2}4 {3}5\.23e-02 {5}1\.04e-01 {5}4\.56e-03/);
    expect(sortie).toMatch(/ 32 {3}8\.03e-04 {5}1\.61e-03 {5}1\.03e-06/);
    expect(sortie).toContain("quad : 2.000000000000 (erreur estimée 2.2e-14)");
  }, TEMPS_MAX);

  it("intégrales impropres : loi exponentielle, Gauss, 1/x diverge et 1/x² converge", async () => {
    const sortie = await executer(INTEGRALES_IMPROPRES);
    expect(sortie).toContain("aire totale : 1.0");
    expect(sortie).toContain("espérance : 2.0  variance : 4.0");
    expect(sortie).toContain("P(X > 3) : 0.2231");
    expect(sortie).toContain("intégrale de Gauss : 1.772454  racine de pi = 1.772454");
    expect(sortie).toContain("jusqu'à 10000 : 1/x -> 9.210   1/x² -> 0.9999");
  }, TEMPS_MAX);

  it("Monte-Carlo : estimations et écarts types cités", async () => {
    const sortie = await executer(MONTE_CARLO);
    expect(sortie).toContain("double intégrale (quart de disque) : 0.785398, pi/4 = 0.785398");
    expect(sortie).toContain("n =       100 : estimation 0.68000, erreur 0.10540, écart type attendu 0.04105");
    expect(sortie).toContain("n =     10000 : estimation 0.78620, erreur 0.00080, écart type attendu 0.00411");
    expect(sortie).toContain("n =   1000000 : estimation 0.78535, erreur 0.00005, écart type attendu 0.00041");
  }, TEMPS_MAX);

  it("divergence de Kullback-Leibler asymétrique, entropie de la loi normale", async () => {
    const sortie = await executer(KL_ENTROPIE);
    expect(sortie).toContain("KL(N(0,1) || N(1,1)) : 0.5");
    expect(sortie).toContain("KL(N(0,1) || N(0,2²)) : 0.318147");
    expect(sortie).toContain("KL(N(0,2²) || N(0,1)) : 0.806853");
    expect(sortie).toContain("entropie de N(0,1) : 1.418939  formule ½·ln(2πe) = 1.418939");
  }, TEMPS_MAX);
});

describe("exercices vérifiés de la page Calcul intégral", () => {
  for (const [n, ex] of INTEGRAL_EXERCISES.entries()) {
    it(`exercice ${n + 3} : le corrigé passe, la réponse de départ échoue sur un assert lisible`, async () => {
      const avec = (code: string) => `${ex.setup ? `${ex.setup}\n` : ""}${code}\n${ex.test}`;
      const corrige = await runPythonNode(avec(ex.solution));
      expect(corrige.error, ex.solution).toBeUndefined();
      const depart = await runPythonNode(avec(ex.starter));
      expect(depart.error, "la réponse de départ doit échouer sur un assert lisible").toMatch(/AssertionError: \S/);
    }, TEMPS_MAX);
  }
});
