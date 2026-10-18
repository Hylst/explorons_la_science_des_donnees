// @vitest-environment node
import { describe, expect, it } from "vitest";
import { compareSqlOutputs, parseSqlTables } from "@/lib/lessons/check";
import { runSqlNode } from "@/lib/lessons/sql-node";
import { DATABASE_EXERCISES } from "./database-exercises";

/**
 * Exercices SQL de la page Bases de données, sur sql.js comme le site : chaque corrigé renvoie des lignes, chaque
 * réponse de départ est refusée par la même comparaison que la page, et les résultats attendus sont ceux qu'on a
 * calculés à la main à partir des données inventées (pour s'assurer que les données produisent bien ces cas).
 */
const avec = (setup: string, code: string) => `${setup}\n${code}`;
const lignes = (sortie: string) => {
  const table = parseSqlTables(sortie).at(-1);
  return table ? table.rows.map((r) => r.split("|").map((c) => c.trim()).join(" | ")) : [];
};

const ATTENDU: Record<string, string[]> = {
  "ecommerce-q1": ["2026 | 03 | 387.7", "2026 | 02 | 177.8", "2026 | 01 | 258.8", "2025 | 11 | 59.7"],
  "ecommerce-q2": ["Souris | 7", "Clavier | 3", "Casque | 2"],
  "ecommerce-q3": ["Chloé Roux | 2 | 168.85", "Bruno Petit | 2 | 158.95", "David Leroy | 1 | 59.7", "Alice Martin | 3 | 56.23"],
  "ecommerce-q4": ["David Leroy | 2025-11-20", "Emma Faure | NULL"],
  "reseau-q1": ["Chloé", "David"],
  "reseau-q2": ["Bob | 2", "Farid | 2", "Gaël | 1"],
  "reseau-q3": ["David | 3", "Bob | 2", "Farid | 2"],
  "usine-q1": ["Fraiseuse C | 92 | 85 | 7", "Tour B | 77.5 | 75 | 2.5", "Presse A | 82 | 80 | 2", "Fraiseuse C | 86 | 85 | 1"],
  "usine-q2": [
    "Presse A | 2026-09-28 | 2 | 2", "Presse A | 2026-09-29 | 2.2 | 2.1", "Presse A | 2026-09-30 | 2.5 | 2.23", "Presse A | 2026-10-01 | 3.1 | 2.6",
    "Tour B | 2026-09-28 | 1.5 | 1.5", "Tour B | 2026-09-29 | 1.4 | 1.45", "Tour B | 2026-09-30 | 1.6 | 1.5", "Tour B | 2026-10-01 | 1.5 | 1.5",
  ],
  "usine-q3": ["Presse A | panne | 3", "Tour B | panne | 2"],
};

describe("exercices SQL de la page Bases de données", () => {
  it("trois scénarios ; dix exercices vérifiés, deux questions laissées à la solution de référence", () => {
    expect(DATABASE_EXERCISES.map((s) => s.id)).toEqual(["ecommerce", "reseau", "usine"]);
    expect(DATABASE_EXERCISES.map((s) => s.exercises.map((e) => (e ? 1 : 0)).join(""))).toEqual(["1111", "1110", "1110"]);
  });

  for (const scenario of DATABASE_EXERCISES) {
    it(`${scenario.id} : la requête d'exploration s'exécute`, async () => {
      const r = await runSqlNode(avec(scenario.setup, scenario.exploration));
      expect(r.error, r.error).toBeUndefined();
      expect(parseSqlTables(r.output).length).toBe(2);
    });

    for (const [n, ex] of scenario.exercises.entries()) {
      if (!ex) continue;
      const id = `${scenario.id}-q${n + 1}`;
      it(`${id} : résultat attendu, réponse de départ refusée`, async () => {
        const corrige = await runSqlNode(avec(ex.setup ?? "", ex.solution));
        expect(corrige.error, corrige.error).toBeUndefined();
        expect(lignes(corrige.output)).toEqual(ATTENDU[id]);
        const depart = await runSqlNode(avec(ex.setup ?? "", ex.starter));
        expect(depart.error, "la réponse de départ doit s'exécuter (et donner un mauvais résultat)").toBeUndefined();
        expect(compareSqlOutputs(corrige.output, depart.output, ex.ordered, ex.columns).ok, "la réponse de départ ne doit pas passer").toBe(false);
        // le corrigé passe sa propre comparaison (même mise en forme que la page)
        expect(compareSqlOutputs(corrige.output, corrige.output, ex.ordered, ex.columns).ok).toBe(true);
      });
    }
  }
});
