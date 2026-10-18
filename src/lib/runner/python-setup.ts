/**
 * Code Python exécuté une fois, au chargement du moteur (site : python.worker.ts ; tests : lessons/python-node.ts).
 *
 * Pyodide émet « JsProxy.as_object_map() is deprecated » quand scikit-learn interroge ses fils d'exécution
 * (threadpoolctl, par exemple pendant une validation croisée). Le message vient du moteur, pas du code de
 * l'apprenant, et s'affichait dans la sortie des exemples : on le masque, lui seul. Les autres avertissements
 * restent visibles, ils sont souvent instructifs.
 */
export const ENGINE_SETUP = `
import warnings
warnings.filterwarnings('ignore', message=r'.*as_object_map.*')
`;

/**
 * `asyncio.run(f())` devient `await (f())` : le code s'exécute avec runPythonAsync, qui accepte un await au niveau
 * du module, alors qu'asyncio.run demande à Pyodide le « stack switching » de WebAssembly (JSPI), absent de Node 24
 * et que tous les navigateurs ne proposent peut-être pas (présent dans Chrome, vérifié le 18 octobre 2026). Partagé par le worker du site et par lib/lessons/python-node.ts (tests).
 */
export const adaptAsyncio = (code: string) => code.replace(/\basyncio\.run\(/g, 'await (');
