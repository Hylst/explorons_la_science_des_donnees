import { lines } from "../lines";

/**
 * Données du cours d'analyse factorielle, toutes livrées avec les paquets du moteur (rien n'est téléchargé).
 * Vérifié le 25 octobre 2026 avec Pyodide 314.0.7 (scikit-learn, statsmodels 0.14.6).
 *
 * - Vins : `load_wine` de scikit-learn, 178 vins italiens de trois cultivars (59, 71 et 48), 13 mesures chimiques
 *   (d'après la description jointe : copie du jeu « Wine » de l'UCI, analyses de M. Forina et coll.).
 * - Enquête électorale américaine de 1996 (ANES) : `statsmodels.datasets.anes96`, 944 personnes, domaine public d'après
 *   statsmodels. Identification partisane `PID` (0 à 6), positionnement politique déclaré `selfLR` (1 à 7), vote envisagé
 *   (Clinton ou Dole). Le niveau d'études `educ` (1 à 7) n'est pas utilisé avec ses libellés : ceux de la documentation
 *   de statsmodels (6 « master », 7 « doctorat », soit 354 personnes sur 944) ne sont pas vraisemblables.
 *   Sources dans docs/SOURCES.md, section 18.
 */

/** `vins` (le jeu complet), `X` (DataFrame des 13 mesures), `cultivar` (0, 1 ou 2) */
export const VINS = lines(
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_wine",
  "",
  "vins = load_wine(as_frame=True)",
  "X = vins.data",
  "cultivar = vins.target",
);

/** `VINS`, plus `Z` : les 13 mesures centrées et réduites (écart type de population, ddof=0), en DataFrame */
export const VINS_REDUITS = lines(
  VINS,
  "",
  "Z = (X - X.mean()) / X.std(ddof=0)",
);

/**
 * `anes` : l'enquête, avec en clair `parti` (7 modalités, de « démocrate convaincu » à « républicain convaincu »),
 * `position` (7 modalités, de « très libéral » à « très conservateur ») et `vote` (« Clinton » ou « Dole »).
 */
export const ANES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import statsmodels.api as sm",
  "",
  "anes = sm.datasets.anes96.load_pandas().data",
  "PARTIS = ['démocrate convaincu', 'démocrate modéré', 'indépendant proche démocrate', 'indépendant',",
  "          'indépendant proche républicain', 'républicain modéré', 'républicain convaincu']",
  "POSITIONS = ['très libéral', 'libéral', 'plutôt libéral', 'modéré', 'plutôt conservateur', 'conservateur', 'très conservateur']",
  "anes['parti'] = pd.Categorical([PARTIS[int(v)] for v in anes['PID']], categories=PARTIS, ordered=True)",
  "anes['position'] = pd.Categorical([POSITIONS[int(v) - 1] for v in anes['selfLR']], categories=POSITIONS, ordered=True)",
  "anes['vote'] = np.where(anes['vote'] == 1, 'Dole', 'Clinton')",
);

/** `ANES`, plus `table` : le tableau de contingence parti × position (7 x 7, 944 personnes) */
export const TABLE_PARTI_POSITION = lines(
  ANES,
  "",
  "table = pd.crosstab(anes['parti'], anes['position'])",
);
