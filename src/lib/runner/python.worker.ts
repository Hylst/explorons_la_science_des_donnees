/// <reference lib="webworker" />
import type { PyodideInterface } from 'pyodide';
import type { WorkerRequest, WorkerResponse } from './types';
import { wasmBlocked } from './csp-guard';

// Pyodide (Python dans WebAssembly) est servi par le site lui-même : public/vendor/pyodide (voir scripts/sync-runtimes.mjs)
let pyodidePromise: Promise<PyodideInterface> | null = null;

const post = (message: WorkerResponse) => self.postMessage(message);

/** Paquets scientifiques fournis par le site (liste à garder alignée avec PYTHON_PACKAGES de scripts/sync-runtimes.mjs) */
const PROVIDED_PACKAGES = ['numpy', 'pandas', 'scikit-learn', 'matplotlib'];

/** Matplotlib sans écran : rendu Agg, plt.show() ne fait rien (les figures sont renvoyées à la fin de l'exécution) */
const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as _plt
_plt.show = lambda *args, **kwargs: None
`;

/** Figures ouvertes en PNG (base64), puis fermées ; liste vide si pyplot n'a pas été importé */
const COLLECT_FIGURES = `
import sys, io, base64
_images = []
if 'matplotlib.pyplot' in sys.modules:
    import matplotlib.pyplot as _plt
    for _number in _plt.get_fignums():
        _buffer = io.BytesIO()
        _plt.figure(_number).savefig(_buffer, format='png', dpi=100, bbox_inches='tight')
        _images.append(base64.b64encode(_buffer.getvalue()).decode('ascii'))
    _plt.close('all')
_images
`;

const collectFigures = (py: PyodideInterface): string[] => {
  const result = py.runPython(COLLECT_FIGURES, { globals: py.toPy({}) });
  const images = result.toJs() as string[];
  result.destroy();
  return images;
};

const loadPython = (baseUrl: string, status: (m: string) => void) =>
  (pyodidePromise ??= (async () => {
    status('Chargement de Python (une dizaine de Mo, une seule fois)…');
    const indexURL = `${baseUrl}vendor/pyodide-${__PYODIDE_VERSION__}/`;
    const module = await import(/* @vite-ignore */ `${indexURL}pyodide.module.js`);
    return (await module.loadPyodide({ indexURL })) as PyodideInterface;
  })().catch((error) => {
    pyodidePromise = null;
    throw error;
  }));

/** Retire de la trace les images internes de Pyodide et nomme le script */
const cleanTraceback = (message: string): string => {
  const lines = message.split('\n');
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s+File ".*(_pyodide|\/lib\/python[\d.]+\/(asyncio|site-packages\/pyodide))/.test(lines[i])) {
      while (i + 1 < lines.length && /^\s{4,}/.test(lines[i + 1])) i++;
      continue;
    }
    kept.push(lines[i].replace('File "<exec>"', 'File "script"'));
  }
  return kept.join('\n').trim();
};

// asyncio.run() échoue dans la boucle déjà lancée de Pyodide : le code est exécuté avec « await » au niveau supérieur
const adaptAsyncio = (code: string) => code.replace(/\basyncio\.run\(/g, 'await (');

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, code, baseUrl } = event.data;
  const status = (message: string) => post({ type: 'status', id, message });
  let py: PyodideInterface;
  try {
    py = await Promise.race([loadPython(baseUrl, status), wasmBlocked]);
  } catch (error) {
    post({ type: 'done', id, output: '', error: `Impossible de charger Python : ${error instanceof Error ? error.message : String(error)}` });
    return;
  }

  const lines: string[] = [];
  py.setStdout({ batched: (line: string) => lines.push(line) });
  py.setStderr({ batched: (line: string) => lines.push(line) });
  const globals = py.globals.get('dict')();
  globals.set('__name__', '__main__');
  try {
    await py.loadPackagesFromImports(code, { messageCallback: (message: string) => status(message) });
    // Imports dynamiques (importlib.import_module, __import__) : invisibles à l'analyse, on charge alors les paquets fournis
    if (/import_module|__import__/.test(code)) {
      await py.loadPackage(PROVIDED_PACKAGES, { messageCallback: (message: string) => status(message) });
    }
    if (/matplotlib/.test(code)) py.runPython(MATPLOTLIB_SETUP);
    post({ type: 'started', id });
    await py.runPythonAsync(adaptAsyncio(code), { globals });
    post({ type: 'done', id, output: lines.join('\n'), images: collectFigures(py) });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    let images: string[] = [];
    try {
      images = collectFigures(py);
    } catch {
      // aucune figure récupérable : l'erreur du code reste l'information utile
    }
    post({ type: 'done', id, output: lines.join('\n'), error: cleanTraceback(message), images });
  } finally {
    globals.destroy();
  }
};
