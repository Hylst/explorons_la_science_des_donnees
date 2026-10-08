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
