/**
 * Exécution Python pour les tests (Node, pas de Worker) : même Pyodide et mêmes paquets que le site
 * (public/vendor/pyodide-<version>, sans réseau), même comportement que python.worker.ts : variables neuves
 * à chaque exécution, paquets chargés d'après les imports, matplotlib sans écran.
 * À n'importer que depuis des fichiers *.test.ts dotés de `// @vitest-environment node`.
 */
import path from "node:path";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { ENGINE_SETUP } from "@/lib/runner/python-setup";

const ROOT = process.cwd();
const VENDOR = path.join(ROOT, "public", "vendor", `pyodide-${__PYODIDE_VERSION__}`) + path.sep;

const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as _plt
_plt.show = lambda *args, **kwargs: None
`;

let engine: Promise<PyodideInterface> | null = null;

const load = () =>
  (engine ??= loadPyodide({
    indexURL: path.join(ROOT, "node_modules", "pyodide") + path.sep,
    lockFileURL: VENDOR + "pyodide-lock.json",
    packageBaseUrl: VENDOR,
    packageCacheDir: VENDOR,
  }).then((py) => {
    py.runPython(ENGINE_SETUP);
    return py;
  }));

export const runPythonNode = async (code: string): Promise<{ output: string; error?: string }> => {
  const py = await load();
  const lines: string[] = [];
  py.setStdout({ batched: (line: string) => lines.push(line) });
  py.setStderr({ batched: (line: string) => lines.push(line) });
  const globals = py.globals.get("dict")();
  globals.set("__name__", "__main__");
  try {
    await py.loadPackagesFromImports(code, { messageCallback: () => {} });
    if (/matplotlib/.test(code)) py.runPython(MATPLOTLIB_SETUP);
    await py.runPythonAsync(code, { globals });
    py.runPython("import sys\nif 'matplotlib.pyplot' in sys.modules:\n    import matplotlib.pyplot as _p\n    _p.close('all')");
    return { output: lines.join("\n") };
  } catch (error) {
    return { output: lines.join("\n"), error: error instanceof Error ? error.message : String(error) };
  } finally {
    globals.destroy();
  }
};
