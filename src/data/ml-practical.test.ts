// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import { ML_EXERCISES, ML_PROGRAMS } from "./ml-practical";

/**
 * Page Machine learning, exercices pratiques : chaque exercice vérifié passe avec son corrigé et échoue avec la
 * réponse de départ ; chaque code exécutable tourne sur le moteur du site ; chaque résultat cité par la page est
 * comparé à l'exécution réelle (mesurée le 18 octobre 2026).
 */
const TEMPS_MAX = 180_000;

/** seaborn n'existe pas dans le moteur : pour vérifier les nombres du premier programme, on le remplace par un module
 *  vide (il ne sert qu'aux graphiques). Le programme reste présenté comme code à lire sur la page. */
const SANS_SEABORN = [
  "import sys",
  "class _SansSeaborn:",
  "    def __getattr__(self, nom):",
  "        return lambda *a, **k: None",
  "sys.modules['seaborn'] = _SansSeaborn()",
].join("\n");

const executer = async (code: string) => {
  const r = await runPythonNode(code);
  expect(r.error, r.error).toBeUndefined();
  return r.output;
};
const programme = (id: string) => ML_PROGRAMS.find((p) => p.id === id)!;

describe("exercices pratiques de la page Machine learning", () => {
  it("trois programmes et deux exercices, identifiants stables ; un code non exécutable dit pourquoi", () => {
    expect(ML_PROGRAMS.map((p) => [p.id, p.runnable])).toEqual([["classification", false], ["regression", true], ["clustering", false]]);
    expect(ML_EXERCISES.map((e) => [e.id, e.solutionRunnable])).toEqual([["recommandation", true], ["fraude", false]]);
    expect(programme("classification").code).toMatch(/import seaborn/);
    expect(programme("classification").note).toMatch(/seaborn/);
    expect(programme("clustering").note).toMatch(/30 secondes/);
    expect(ML_EXERCISES[1].solution).toMatch(/imblearn/);
    expect(ML_EXERCISES[1].solutionNote).toMatch(/imblearn/);
  });

  for (const e of ML_EXERCISES) {
    it(`${e.id} : le corrigé passe, la réponse de départ échoue sur un assert lisible`, async () => {
      const avec = (code: string) => `${e.exercise.setup ? `${e.exercise.setup}\n` : ""}${code}\n${e.exercise.test}`;
      const corrige = await runPythonNode(avec(e.exercise.solution));
      expect(corrige.error, e.exercise.solution).toBeUndefined();
      const depart = await runPythonNode(avec(e.exercise.starter));
      expect(depart.error, "la réponse de départ doit échouer sur un assert lisible").toMatch(/AssertionError: \S/);
    }, TEMPS_MAX);
  }

  it("recommandation : la solution complète s'exécute", async () => {
    expect((await executer(ML_EXERCISES[0].solution)).length).toBeGreaterThan(100);
  }, TEMPS_MAX);

  it("classification (iris) : les résultats cités sont ceux de l'exécution", async () => {
    const sortie = await executer(`${SANS_SEABORN}\n${programme("classification").code}`);
    expect(sortie).toMatch(/SVM\n {2}Exactitude sur le test : 0\.967\n {2}Validation croisée \(5 plis\) : 0\.967/);
    expect(sortie).toContain("Validation croisée (5 plis) : 0.958");
    expect(sortie).toContain("Validation croisée (5 plis) : 0.950");
    expect(sortie).toContain("Modèle retenu : SVM");
    for (const [nom, v] of [["petal width", "0.437"], ["petal length", "0.431"], ["sepal length", "0.116"], ["sepal width", "0.015"]]) expect(sortie).toMatch(new RegExp(`${nom} \\(cm\\)\\s+${v.replace(".", "\\.")}`));
    expect(programme("classification").outputs.join(" ")).toContain("SVM 0,967, régression logistique 0,958, forêt aléatoire 0,950");
  }, TEMPS_MAX);

  it("régression (logements) : les résultats cités sont ceux de l'exécution", async () => {
    const sortie = await executer(programme("regression").code);
    expect(sortie).toMatch(/Régression linéaire\n {2}R² sur le test : 0\.951\n {2}RMSE : 26,272 €\n {2}MAE : 21,195 €/);
    expect(sortie).toMatch(/Forêt aléatoire\n {2}R² sur le test : 0\.936\n {2}RMSE : 30,159 €/);
    const cites = programme("regression").outputs.join(" ");
    for (const n of ["0,951", "26 272", "21 195", "0,936", "30 159"]) expect(cites).toContain(n);
  }, TEMPS_MAX);

  it("segmentation (clustering) : les résultats cités sont ceux de l'exécution", async () => {
    const sortie = await executer(programme("clustering").code);
    expect(sortie).toMatch(/^2\s+[\d.]+\s+0\.423\s/m);
    expect(sortie).toMatch(/^4\s+[\d.]+\s+0\.368\s+[\d.]+\s+[\d.]+\s+0\.765$/m);
    expect(sortie).toMatch(/DBSCAN\n {2}Clusters : 4 \(points de bruit : 58\)/);
    expect(sortie).toContain("Indice de Rand ajusté (segments réels) : 0.040");
    expect(sortie).toContain("Pureté moyenne : 0.92");
    const cites = programme("clustering").outputs.join(" ");
    for (const n of ["0,423", "0,765", "0,368", "0,92", "58 points de bruit", "0,040"]) expect(cites).toContain(n);
  }, TEMPS_MAX);
});
