import { lines } from "../lines";

/**
 * Jeux de données du cours de statistiques appliquées : ceux fournis avec scikit-learn (rien n'est téléchargé).
 * diabetes en unités d'origine (scaled=False) : âge, sexe (codé 1 ou 2), IMC, pression... et la progression
 * de la maladie un an plus tard ; wine : 178 vins de trois cultivars, avec leur teneur en alcool.
 */
export const DIABETE = lines(
  "import numpy as np",
  "import pandas as pd",
  "from scipy import stats",
  "from sklearn.datasets import load_diabetes",
  "",
  "d = load_diabetes(as_frame=True, scaled=False).frame",
  "d = d.rename(columns={'bmi': 'imc', 'target': 'progression'})",
);

export const VINS = lines(
  "import numpy as np",
  "import pandas as pd",
  "from scipy import stats",
  "from sklearn.datasets import load_wine",
  "",
  "vins = load_wine(as_frame=True).frame",
  "alcool = [vins.loc[vins['target'] == k, 'alcohol'] for k in range(3)]",
);
