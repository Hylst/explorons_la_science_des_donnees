import type { RunResult, StatusListener, WorkerResponse } from './types';

/**
 * Pilote un Web Worker qui exécute du code, une exécution à la fois.
 * Le délai maximal ne court qu'à partir du démarrage réel du code (le chargement du moteur n'en fait pas partie) ;
 * s'il est dépassé, le worker est arrêté (boucle infinie) et recréé à la prochaine exécution.
 */
export const createWorkerRunner = (makeWorker: () => Worker, timeoutMs: number, timeoutMessage: string) => {
  let worker: Worker | null = null;
  let nextId = 1;
  let queue: Promise<unknown> = Promise.resolve();

  const runOnce = (code: string, onStatus?: StatusListener): Promise<RunResult> =>
    new Promise((resolve) => {
      const id = nextId++;
      const instance = (worker ??= makeWorker());
      let timer: ReturnType<typeof setTimeout> | undefined;
      let startedAt = performance.now();

      const finish = (result: RunResult) => {
        clearTimeout(timer);
        instance.removeEventListener('message', onMessage);
        instance.removeEventListener('error', onError);
        resolve(result);
      };
      const onMessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.id !== id) return;
        if (message.type === 'status') onStatus?.(message.message);
        else if (message.type === 'started') {
          startedAt = performance.now();
          timer = setTimeout(() => {
            instance.terminate();
            if (worker === instance) worker = null;
            finish({ output: '', error: timeoutMessage, durationMs: performance.now() - startedAt });
          }, timeoutMs);
        } else finish({ output: message.output, error: message.error, images: message.images, durationMs: performance.now() - startedAt });
      };
      const onError = (event: ErrorEvent) => {
        instance.terminate();
        if (worker === instance) worker = null;
        finish({ output: '', error: `Le moteur d'exécution n'a pas pu démarrer (${event.message || 'erreur de chargement'}).`, durationMs: 0 });
      };

      instance.addEventListener('message', onMessage);
      instance.addEventListener('error', onError);
      instance.postMessage({
        type: 'run',
        id,
        code,
        baseUrl: new URL(import.meta.env.BASE_URL, self.location.origin).href,
      });
    });

  return (code: string, onStatus?: StatusListener): Promise<RunResult> => {
    const result = queue.then(() => runOnce(code, onStatus));
    queue = result.catch(() => undefined);
    return result;
  };
};
