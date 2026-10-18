// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { DIABETE } from "./data";
import { M7_COLINEARITE, M7_DIAGNOSTICS, M7_QUALITATIVES, M7_TABLEAU, M7_VARIABLES_OMISES, moduleOlsStatsmodels } from "./m7-ols-statsmodels";

/**
 * Module 7 du cours de statistiques appliquées : chaque nombre cité dans une légende ou dans le texte est vérifié sur
 * la sortie réelle de l'exemple (moteur du site). Si un résultat bouge, ce test échoue et le texte doit être corrigé.
 * (lessons-python.test.ts exécute aussi exemples et exercices, sans regarder les nombres.)
 */
const executer = async (code: string) => {
  const r = await runPythonNode(code);
  expect(r.error, r.error).toBeUndefined();
  return r.output;
};
const texte = (index: number) => {
  const s = moduleOlsStatsmodels.sections[index];
  return s.kind === "code" ? s.caption ?? "" : s.kind === "text" ? s.md : "";
};
const legendeDe = (code: string) => {
  const s = moduleOlsStatsmodels.sections.find((x) => x.kind === "code" && x.code === code);
  return s && s.kind === "code" ? s.caption ?? "" : "";
};
const TEMPS_MAX = 120_000;

describe("module 7 : régression multiple avec statsmodels", () => {
  it("tableau des coefficients : IMC 6,5 [5,13 ; 7,87], R² 0,480 et R² ajusté 0,477", async () => {
    const sortie = await executer(M7_TABLEAU);
    expect(sortie).toMatch(/imc\s+6\.5001\s+0\.697\s+9\.324\s+0\.000\s+5\.130\s+7\.870/);
    expect(sortie).toContain("R² = 0.480   R² ajusté = 0.477   n = 442");
    for (const n of ["6,5", "5,13", "7,87", "0,480", "0,477"]) expect(legendeDe(M7_TABLEAU)).toContain(n);
    // le texte rappelle la pente simple du module 4 (10,233) et cite 6,5
    expect(texte(4)).toContain("10,2");
  }, TEMPS_MAX);

  it("variable qualitative et interaction : -1,34 (p = 0,823), pentes 8,83 et 12,14, interaction p = 0,015", async () => {
    const sortie = await executer(M7_QUALITATIVES);
    expect(sortie).toContain("effet du groupe 2, à IMC égal : -1.34   p = 0.823");
    expect(sortie).toContain("pente de l'IMC : groupe 1 8.83, groupe 2 12.14");
    expect(sortie).toContain("interaction : p = 0.015");
    for (const n of ["-1,34", "0,823", "8,83", "12,14", "0,015"]) expect(legendeDe(M7_QUALITATIVES)).toContain(n);
  }, TEMPS_MAX);

  it("diagnostics : Jarque-Bera p = 0,032, Breusch-Pagan p = 0,059, erreurs standard 0,697 et 0,743, deux graphiques", async () => {
    const r = await runPythonNode(`${M7_DIAGNOSTICS}\nprint('axes', len(plt.gcf().axes))`);
    expect(r.error, r.error).toBeUndefined();
    expect(r.output).toContain("Jarque-Bera : p = 0.032 (asymétrie 0.18, aplatissement 2.51)");
    expect(r.output).toContain("Breusch-Pagan : p = 0.059");
    expect(r.output).toContain("erreur standard de l'IMC : 0.697 (classique), 0.743 (HC3)");
    for (const n of ["0,032", "0,18", "2,51", "0,059", "0,743", "0,697", "442"]) expect(legendeDe(M7_DIAGNOSTICS)).toContain(n);
  }, TEMPS_MAX);

  it("colinéarité et influence : VIF 59,2, 39,2, 15,4 et 10,1, corrélation 0,897, Cook 0,033 et 24 points", async () => {
    const sortie = await executer(M7_COLINEARITE);
    for (const ligne of ["VIF  s1 :  59.20", "VIF  s2 :  39.19", "VIF  s3 :  15.40", "VIF  s5 :  10.08", "VIF  s4 :   8.89"]) expect(sortie).toContain(ligne);
    expect(sortie).toContain("corrélation s1 et s2 : 0.897");
    expect(sortie).toContain("distance de Cook : maximum 0.033, 24 points au-dessus de 4/n = 0.009");
    for (const n of ["59,2", "39,2", "15,4", "10,1", "0,897", "0,033", "24 points", "0,009"]) expect(legendeDe(M7_COLINEARITE)).toContain(n);
  }, TEMPS_MAX);

  it("variables omises : s1 passe de +0,472 à -0,242, sex de +6,65 à -22,86", async () => {
    const sortie = await executer(M7_VARIABLES_OMISES);
    expect(sortie).toMatch(/progression ~ s1 +coefficient de s1 : \+0\.472 +p = 0\.000/);
    expect(sortie).toMatch(/progression ~ s1 \+ s5 +coefficient de s1 : -0\.242 +p = 0\.018/);
    expect(sortie).toContain("corrélation de s1 et s5 : 0.516");
    expect(sortie).toContain("coefficient de sex : +6.65   p = 0.3664   (1 variable(s))");
    expect(sortie).toContain("coefficient de sex : -22.86   p = 0.0001   (10 variable(s))");
    for (const n of ["+0,472", "-0,242", "0,018", "0,516", "+6,65", "0,366", "-22,86", "0,0001"]) expect(legendeDe(M7_VARIABLES_OMISES)).toContain(n);
  }, TEMPS_MAX);

  it("l'étendue de l'IMC citée (18 à 42,2) est celle des données", async () => {
    const sortie = await executer(`${DIABETE}\nprint(d['imc'].min(), d['imc'].max())`);
    expect(sortie.trim().split("\n").pop()).toBe("18.0 42.2");
    expect(moduleOlsStatsmodels.sections.some((s) => s.kind === "text" && s.md.includes("de 18 à 42,2"))).toBe(true);
  }, TEMPS_MAX);
});
