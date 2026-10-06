/// <reference lib="webworker" />
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import type { SqlJsStatic } from 'sql.js';
import type { WorkerRequest, WorkerResponse } from './types';
import { wasmBlocked } from './csp-guard';
import { formatResults } from './sql-format';

// SQLite (sql.js) en WebAssembly ; le binaire est servi par le site : public/vendor/sql-js-<version>
let sqlPromise: Promise<SqlJsStatic> | null = null;

const post = (message: WorkerResponse) => self.postMessage(message);

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
    post({ type: 'done', id, output: formatResults(results, modified) });
  } catch (error) {
    post({ type: 'done', id, output: '', error: error instanceof Error ? error.message : String(error) });
  } finally {
    db.close();
  }
};
