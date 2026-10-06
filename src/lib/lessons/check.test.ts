// @vitest-environment node
import { describe, expect, it } from "vitest";
import { compareSqlOutputs, parseSqlTables } from "./check";
import { runSqlNode } from "./sql-node";

const SETUP = `
CREATE TABLE ventes (id INTEGER, ville TEXT, montant REAL);
INSERT INTO ventes VALUES (1, 'Lyon', 120), (2, 'Paris', 80), (3, 'Lyon', 40), (4, 'Nantes', 200);
`;
const run = async (query: string) => (await runSqlNode(SETUP + query)).output;

describe("vérification des exercices SQL (moteur réel sql.js, même mise en forme que le site)", () => {
  it("découpe la sortie en tableaux", async () => {
    const tables = parseSqlTables(await run("SELECT ville FROM ventes; SELECT COUNT(*) AS n FROM ventes;"));
    expect(tables).toHaveLength(2);
    expect(tables[1].rows.map((r) => r.trim())).toEqual(["4"]);
  });

  it("accepte une requête différente qui donne le même résultat", async () => {
    const expected = await run("SELECT ville, SUM(montant) AS total FROM ventes GROUP BY ville;");
    const actual = await run("select ville, sum(montant) as total from ventes group by 1");
    expect(compareSqlOutputs(expected, actual)).toEqual({ ok: true });
  });

  it("ignore l'ordre des lignes sauf si l'exercice le demande", async () => {
    const expected = await run("SELECT ville FROM ventes ORDER BY montant DESC;");
    const actual = await run("SELECT ville FROM ventes ORDER BY montant ASC;");
    expect(compareSqlOutputs(expected, actual).ok).toBe(true);
    const verdict = compareSqlOutputs(expected, actual, true);
    expect(verdict.ok).toBe(false);
    expect(verdict.ok ? "" : verdict.reason).toContain("ORDER BY");
  });

  it("option columns : ne compare que les colonnes demandées (plan d'exécution aux colonnes internes variables)", async () => {
    const expected = await run("CREATE INDEX i ON ventes(ville); EXPLAIN QUERY PLAN SELECT * FROM ventes WHERE ville = 'Lyon';");
    const composite = await run("CREATE INDEX i ON ventes(ville, montant); EXPLAIN QUERY PLAN SELECT * FROM ventes WHERE ville = 'Lyon';");
    const scan = await run("EXPLAIN QUERY PLAN SELECT * FROM ventes WHERE ville = 'Lyon';");
    expect(compareSqlOutputs(expected, scan, false, ["detail"]).ok).toBe(false);
    // même index utilisé : accepté sur la colonne detail, même si une colonne interne diffère
    expect(compareSqlOutputs(expected, composite, false, ["detail"]).ok).toBe(true);
    // une colonne inconnue ne valide jamais
    expect(compareSqlOutputs(expected, expected, false, ["inexistante"]).ok).toBe(false);
  });

  it("refuse un mauvais résultat, de mauvaises colonnes ou l'absence de résultat", async () => {
    const expected = await run("SELECT ville, SUM(montant) AS total FROM ventes GROUP BY ville;");
    expect(compareSqlOutputs(expected, await run("SELECT ville, MAX(montant) AS total FROM ventes GROUP BY ville;")).ok).toBe(false);
    expect(compareSqlOutputs(expected, await run("SELECT ville, SUM(montant) FROM ventes GROUP BY ville;")).ok).toBe(false);
    expect(compareSqlOutputs(expected, await run("SELECT ville, SUM(montant) AS total FROM ventes GROUP BY ville HAVING total > 100;")).ok).toBe(false);
    expect(compareSqlOutputs(expected, await run("UPDATE ventes SET montant = 0 WHERE id = 99;")).ok).toBe(false);
  });
});
