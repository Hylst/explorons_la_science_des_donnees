import { createWorkerRunner } from './worker-client';
import { SandboxedEngine } from './sandbox';
import pythonWorkerUrl from './python.worker.ts?worker&url';
import sqlWorkerUrl from './sql.worker.ts?worker&url';
import { runJavaScript } from './javascript';
import type { RunnableLanguage, RunResult, StatusListener } from './types';

export type { RunnableLanguage, RunResult, StatusListener } from './types';

/**
 * En production, chaque moteur tourne dans le bac à sable (src/lib/runner/sandbox.ts), avec repli sur un worker de même
 * origine. En développement, Vite sert les workers comme des modules à imports, qu'un blob ne peut pas charger : worker direct.
 */
const engine = (scriptUrl: string, needsBlobImport: boolean, direct: () => Worker) => (): Worker => {
  if (!import.meta.env.PROD) return direct();
  const base = new URL(import.meta.env.BASE_URL, self.location.origin).href;
  return new SandboxedEngine({
    scriptUrl: new URL(scriptUrl, self.location.origin).href,
    hostUrl: `${base}sandbox/engine-host.html`,
    vendorBase: `${base}vendor/`,
    needsBlobImport,
    fallback: direct,
  }) as unknown as Worker;
};

const runPython = createWorkerRunner(
  engine(pythonWorkerUrl, true, () => new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' })),
  30000,
  'Exécution interrompue : plus de 30 secondes (boucle infinie ?). Le moteur Python est relancé à la prochaine exécution.',
);
const runSql = createWorkerRunner(
  engine(sqlWorkerUrl, false, () => new Worker(new URL('./sql.worker.ts', import.meta.url), { type: 'module' })),
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
