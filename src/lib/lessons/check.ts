/**
 * Vérification des exercices SQL : le moteur du site (sql.worker.ts) renvoie chaque résultat sous forme de tableau texte
 * (en-tête, ligne de tirets, lignes, « (n lignes) »). On compare le DERNIER tableau produit par la réponse
 * et celui du corrigé, exécutés sur les mêmes données.
 */

export interface SqlTable {
  header: string;
  rows: string[];
}

/** Découpe une sortie du moteur SQL en tableaux (un par requête qui renvoie des lignes) */
export const parseSqlTables = (output: string): SqlTable[] => {
  const lines = output.split("\n");
  const tables: SqlTable[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^-+(-\+-+)*$/.test(lines[i + 1].trim())) continue;
    const header = lines[i];
    const rows: string[] = [];
    let j = i + 2;
    while (j < lines.length && !/^\(\d+ lignes?\)$/.test(lines[j].trim())) {
      rows.push(lines[j]);
      j++;
    }
    tables.push({ header, rows });
    i = j;
  }
  return tables;
};

const cells = (line: string) => line.split("|").map((cell) => cell.trim());
const normalize = (line: string) => cells(line).join("|");

/** Ne garde que les colonnes demandées (par nom d'en-tête), dans l'ordre demandé ; null si l'une manque */
const project = (table: SqlTable, columns?: string[]): SqlTable | null => {
  if (!columns) return table;
  const names = cells(table.header).map((name) => name.toLowerCase());
  const indexes = columns.map((name) => names.indexOf(name.toLowerCase()));
  if (indexes.some((i) => i < 0)) return null;
  const pick = (line: string) => indexes.map((i) => cells(line)[i] ?? "").join(" | ");
  return { header: pick(table.header), rows: table.rows.map(pick) };
};

export type SqlVerdict = { ok: true } | { ok: false; reason: string };

/** Compare le dernier tableau de la réponse à celui du corrigé */
export const compareSqlOutputs = (expected: string, actual: string, ordered = false, columns?: string[]): SqlVerdict => {
  const lastWant = parseSqlTables(expected).at(-1);
  const lastGot = parseSqlTables(actual).at(-1);
  if (!lastWant) return { ok: false, reason: "Le corrigé ne renvoie aucun tableau (erreur dans l'exercice)." };
  if (!lastGot) return { ok: false, reason: "Votre requête ne renvoie aucun résultat : écrivez un SELECT." };
  const want = project(lastWant, columns);
  const got = project(lastGot, columns);
  if (!want) return { ok: false, reason: "Le corrigé n'a pas les colonnes à comparer (erreur dans l'exercice)." };
  if (!got) return { ok: false, reason: `Colonnes attendues dans votre résultat : ${(columns ?? []).join(", ")}.` };
  if (normalize(got.header).toLowerCase() !== normalize(want.header).toLowerCase()) {
    return { ok: false, reason: `Colonnes attendues : ${normalize(want.header).split("|").join(", ")}.` };
  }
  if (got.rows.length !== want.rows.length) {
    return { ok: false, reason: `Votre requête renvoie ${got.rows.length} ligne(s), on en attend ${want.rows.length}.` };
  }
  const a = got.rows.map(normalize);
  const b = want.rows.map(normalize);
  if (!ordered) {
    a.sort();
    b.sort();
  }
  const same = a.every((row, i) => row === b[i]);
  if (same) return { ok: true };
  return {
    ok: false,
    reason: ordered && [...a].sort().join("\n") === [...b].sort().join("\n")
      ? "Les bonnes lignes, mais pas dans l'ordre demandé (pensez à ORDER BY)."
      : "Le nombre de lignes est bon, mais certaines valeurs diffèrent.",
  };
};
