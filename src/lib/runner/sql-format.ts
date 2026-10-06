import type { QueryExecResult } from "sql.js";

/**
 * Mise en forme des résultats SQL, partagée par le moteur du site (sql.worker.ts) et par les tests
 * des cours (src/data/lessons), pour que les exercices soient vérifiés sur exactement ce que voit l'apprenant.
 */
const formatValue = (value: unknown) => (value === null ? "NULL" : String(value));

/** Tableau texte aligné, à la façon d'un client SQL en ligne de commande */
export const formatTable = ({ columns, values }: QueryExecResult): string => {
  const rows = values.map((row) => row.map(formatValue));
  const widths = columns.map((name, i) => Math.max(name.length, ...rows.map((row) => row[i].length)));
  const line = (cells: string[]) => cells.map((cell, i) => cell.padEnd(widths[i])).join(" | ").trimEnd();
  return [line(columns), widths.map((w) => "-".repeat(w)).join("-+-"), ...rows.map(line), `(${rows.length} ligne${rows.length > 1 ? "s" : ""})`].join("\n");
};

/** Sortie complète d'un script : un tableau par requête qui renvoie des lignes, ou un message s'il n'y en a aucun */
export const formatResults = (results: QueryExecResult[], modified: number): string =>
  results.length
    ? results.map(formatTable).join("\n\n")
    : `Requête exécutée, aucun résultat à afficher${modified ? ` (${modified} ligne${modified > 1 ? "s" : ""} modifiée${modified > 1 ? "s" : ""})` : ""}.`;
