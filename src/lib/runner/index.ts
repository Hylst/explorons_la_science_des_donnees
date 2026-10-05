import { createWorkerRunner } from './worker-client';
import { runJavaScript } from './javascript';
import type { RunnableLanguage, RunResult, StatusListener } from './types';

export type { RunnableLanguage, RunResult, StatusListener } from './types';

const runPython = createWorkerRunner(
  () => new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' }),
  30000,
  'Exécution interrompue : plus de 30 secondes (boucle infinie ?). Le moteur Python est relancé à la prochaine exécution.',
);
const runSql = createWorkerRunner(
  () => new Worker(new URL('./sql.worker.ts', import.meta.url), { type: 'module' }),
  15000,
  'Requête interrompue : plus de 15 secondes.',
);

export const isRunnable = (language: string): language is RunnableLanguage =>
  language === 'python' || language === 'javascript' || language === 'sql';

/** Exécute réellement le code dans le navigateur (Python : Pyodide, SQL : SQLite, JavaScript : iframe isolé) */
export const runCode = (language: RunnableLanguage, code: string, onStatus?: StatusListener): Promise<RunResult> => {
  if (language === 'python') return runPython(code, onStatus);
  if (language === 'sql') return runSql(code, onStatus);
  return runJavaScript(code);
};
