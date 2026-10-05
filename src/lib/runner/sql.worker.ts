/// <reference lib="webworker" />
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import type { SqlJsStatic, QueryExecResult } from 'sql.js';
import type { WorkerRequest, WorkerResponse } from './types';
import { wasmBlocked } from './csp-guard';

// SQLite (sql.js) en WebAssembly ; le binaire est servi par le site : public/vendor/sql-js-<version>
let sqlPromise: Promise<SqlJsStatic> | null = null;

const post = (message: WorkerResponse) => self.postMessage(message);

const formatValue = (value: unknown) => (value === null ? 'NULL' : String(value));

/** Tableau texte aligné, à la façon d'un client SQL en ligne de commande */
const formatTable = ({ columns, values }: QueryExecResult): string => {
  const rows = values.map((row) => row.map(formatValue));
  const widths = columns.map((name, i) => Math.max(name.length, ...rows.map((row) => row[i].length)));
  const line = (cells: string[]) => cells.map((cell, i) => cell.padEnd(widths[i])).join(' | ').trimEnd();
  return [line(columns), widths.map((w) => '-'.repeat(w)).join('-+-'), ...rows.map(line), `(${rows.length} ligne${rows.length > 1 ? 's' : ''})`].join('\n');
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, code, baseUrl } = event.data;
  let SQL: SqlJsStatic;
  try {
    post({ type: 'status', id, message: 'Chargement de SQLite…' });
    SQL = await Promise.race([(sqlPromise ??= initSqlJs({ locateFile: () => `${baseUrl}vendor/sql-js-${__SQLJS_VERSION__}/sql-wasm.wasm` })), wasmBlocked]);
  } catch (error) {
    sqlPromise = null;
    post({ type: 'done', id, output: '', error: `Impossible de charger SQLite : ${error instanceof Error ? error.message : String(error)}` });
    return;
  }
  // Base vide en mémoire, recréée à chaque exécution : le script doit créer ses propres tables
  const db = new SQL.Database();
  post({ type: 'started', id });
  try {
    const results = db.exec(code);
    const modified = db.getRowsModified();
    const output = results.length
      ? results.map(formatTable).join('\n\n')
      : `Requête exécutée, aucun résultat à afficher${modified ? ` (${modified} ligne${modified > 1 ? 's' : ''} modifiée${modified > 1 ? 's' : ''})` : ''}.`;
    post({ type: 'done', id, output });
  } catch (error) {
    post({ type: 'done', id, output: '', error: error instanceof Error ? error.message : String(error) });
  } finally {
    db.close();
  }
};
