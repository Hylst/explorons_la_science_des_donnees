import { lines } from "../lines";

/**
 * Séries du cours de séries temporelles : celles fournies avec statsmodels (rien n'est téléchargé, vérifié le
 * 11 octobre 2026 avec statsmodels 0.14.6 dans Pyodide). Données réelles du domaine public, sources dans docs/SOURCES.md :
 * - co2 : concentration de CO2 à Mauna Loa (ppm, prélèvements du réseau Scripps, Keeling et Whorf), hebdomadaire de mars
 *   1958 à décembre 2001 (59 semaines manquantes), ramenée ici à une moyenne mensuelle (526 mois, 5 mois vides interpolés) ;
 * - nil : débit annuel du Nil à Assouan (10^8 m³), 1871-1970 (100 ans), série étudiée par Cobb (1978) pour sa rupture ;
 * - taches : nombre annuel de taches solaires, 1700-2008 (309 ans, National Geophysical Data Center) ;
 * - elnino : température de surface de la mer, région Niño 1+2 (Pacifique est, au large de l'Équateur et du Pérou, NOAA),
 *   moyenne mensuelle en °C, 1950-2010 (732 mois).
 */

const IMPORTS = lines("import numpy as np", "import pandas as pd", "import statsmodels.api as sm");

/** `co2_hebdo` (brut, avec trous) et `co2` (moyenne mensuelle, index MS, sans trou) */
export const CO2 = lines(
  IMPORTS,
  "",
  "co2_hebdo = sm.datasets.co2.load_pandas().data['co2']",
  "co2 = co2_hebdo.resample('MS').mean().interpolate()",
  "co2.name = 'co2'",
);

/** `nil` : débit annuel, index au 1er janvier de chaque année */
export const NIL = lines(
  IMPORTS,
  "",
  "_nil = sm.datasets.nile.load_pandas().data",
  "nil = pd.Series(_nil['volume'].values, index=pd.date_range('1871', periods=len(_nil), freq='YS'), name='debit')",
);

/** `taches` : nombre annuel de taches solaires */
export const TACHES = lines(
  IMPORTS,
  "",
  "_t = sm.datasets.sunspots.load_pandas().data",
  "taches = pd.Series(_t['SUNACTIVITY'].values, index=pd.date_range('1700', periods=len(_t), freq='YS'), name='taches')",
);

/** `elnino` : température mensuelle (index MS) */
export const ELNINO = lines(
  IMPORTS,
  "",
  "_e = sm.datasets.elnino.load_pandas().data.melt(id_vars='YEAR', var_name='mois', value_name='temp')",
  "_mois = {m: i + 1 for i, m in enumerate(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])}",
  "_e['date'] = pd.to_datetime(dict(year=_e['YEAR'].astype(int), month=_e['mois'].map(_mois), day=1))",
  "elnino = _e.set_index('date')['temp'].sort_index().asfreq('MS')",
  "elnino.name = 'temp'",
);
