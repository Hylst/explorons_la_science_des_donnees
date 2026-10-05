import { asset } from '@/lib/asset';
import type { RunResult } from './types';

const TIMEOUT_MS = 12000;

/**
 * Exécute du JavaScript dans un iframe isolé (sandbox="allow-scripts" : origine opaque, aucun accès au site,
 * à ses cookies ni à son stockage ; la politique de sécurité de public/sandbox/js-runner.html coupe le réseau).
 * Un iframe neuf par exécution : aucun état ne fuit d'une exécution à l'autre.
 */
export const runJavaScript = (code: string): Promise<RunResult> =>
  new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none';
    frame.src = asset('sandbox/js-runner.html');

    const startedAt = performance.now();
    const finish = (result: Omit<RunResult, 'durationMs'>) => {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      frame.remove();
      resolve({ ...result, durationMs: performance.now() - startedAt });
    };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || !event.data) return;
      if (event.data.type === 'ready') frame.contentWindow?.postMessage({ type: 'run', id: 1, code }, '*');
      else if (event.data.type === 'done') finish({ output: event.data.output ?? '', error: event.data.error });
    };
    const timer = setTimeout(
      () => finish({ output: '', error: `Exécution interrompue : plus de ${TIMEOUT_MS / 1000} secondes.` }),
      TIMEOUT_MS,
    );
    window.addEventListener('message', onMessage);
    document.body.appendChild(frame);
  });
