/**
 * Exécution SQL pour les tests (Node, pas de Worker) : même moteur (sql.js) et même mise en forme que le site.
 * À n'importer que depuis des fichiers *.test.ts dotés de `// @vitest-environment node`.
 */
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { formatResults } from "@/lib/runner/sql-format";

let engine: Promise<SqlJsStatic> | null = null;

export const runSqlNode = async (code: string): Promise<{ output: string; error?: string }> => {
  const SQL = await (engine ??= initSqlJs());
  const db = new SQL.Database();
  try {
    const results = db.exec(code);
    return { output: formatResults(results, db.getRowsModified()) };
  } catch (error) {
    return { output: "", error: error instanceof Error ? error.message : String(error) };
  } finally {
    db.close();
  }
};
