/**
 * Jeux de données d'exemple générés avec une graine fixe : toutes les statistiques affichées dans l'exploration
 * visuelle sont calculées sur ces lignes (reproductibles), pas saisies à la main.
 */
export type Cell = number | string | null;
export type Row = Record<string, Cell>;

export interface SampleDataset {
  id: "sales" | "patients";
  name: string;
  columns: string[];
  numeric: string;
  numericLabel: string;
  unit: string;
  categorical: string;
  categoricalLabel: string;
  rows: Row[];
}

export const makeUniform = (seed: number) => {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const makeGauss = (seed: number) => {
  const uniform = makeUniform(seed);
  return () => Math.sqrt(-2 * Math.log(1 - uniform())) * Math.cos(2 * Math.PI * uniform());
};

const pick = (u: () => number, options: [string, number][]): string => {
  const x = u();
  let acc = 0;
  for (const [value, weight] of options) {
    acc += weight;
    if (x < acc) return value;
  }
  return options[options.length - 1][0];
};

const buildSales = (): SampleDataset => {
  const gauss = makeGauss(1001);
  const u = makeUniform(1002);
  const rows: Row[] = [];
  for (let i = 0; i < 400; i++) {
    const quantite = Math.max(1, Math.round(3 + 1.5 * gauss()));
    rows.push({
      client_id: 1000 + Math.floor(u() * 250),
      produit: pick(u, [["Logiciel", 0.4], ["Matériel", 0.35], ["Service", 0.25]]),
      region: u() < 0.03 ? null : pick(u, [["Île-de-France", 0.35], ["PACA", 0.2], ["Auvergne-Rhône-Alpes", 0.25], ["Occitanie", 0.12], ["Bretagne", 0.08]]),
      quantite,
      montant: u() < 0.01 ? null : Math.round(Math.exp(6.6 + 0.45 * gauss()) * 100) / 100,
    });
  }
  // valeurs aberrantes volontaires (saisies erronées ou gros contrats), pour les illustrer
  [[13, 9800], [121, 11500], [260, 10400], [58, 4], [199, 6]].forEach(([i, montant]) => { rows[i].montant = montant; });
  // quelques doublons exacts
  [5, 50, 90].forEach((i, k) => { rows[300 + k * 10] = { ...rows[i] }; });
  return {
    id: "sales",
    name: "Ventes",
    columns: ["client_id", "produit", "region", "quantite", "montant"],
    numeric: "montant",
    numericLabel: "Montant des ventes",
    unit: "€",
    categorical: "region",
    categoricalLabel: "Régions",
    rows,
  };
};

const buildPatients = (): SampleDataset => {
  const gauss = makeGauss(2001);
  const u = makeUniform(2002);
  const rows: Row[] = [];
  for (let i = 0; i < 300; i++) {
    const age = Math.round(Math.min(95, Math.max(18, 55 + 16 * gauss())));
    rows.push({
      sexe: u() < 0.02 ? null : pick(u, [["F", 0.52], ["M", 0.48]]),
      age: u() < 0.015 ? null : age,
      poids: Math.round(72 + 13 * gauss()),
      diagnostic: u() < 0.04 ? null : pick(u, [["Cardiologie", 0.3], ["Diabète", 0.25], ["Respiratoire", 0.2], ["Orthopédie", 0.15], ["Autre", 0.1]]),
      duree_sejour: Math.max(1, Math.round(4 + 0.05 * age + 1.8 * gauss())),
    });
  }
  [[17, 131], [140, 127], [222, -1]].forEach(([i, age]) => { rows[i].age = age; });
  [8, 80].forEach((i, k) => { rows[250 + k * 12] = { ...rows[i] }; });
  return {
    id: "patients",
    name: "Patients",
    columns: ["sexe", "age", "poids", "diagnostic", "duree_sejour"],
    numeric: "age",
    numericLabel: "Âge des patients",
    unit: "ans",
    categorical: "diagnostic",
    categoricalLabel: "Diagnostics",
    rows,
  };
};

export const SAMPLE_DATASETS: Record<SampleDataset["id"], SampleDataset> = {
  sales: buildSales(),
  patients: buildPatients(),
};

// ---- statistiques ----

export const numericValues = (ds: SampleDataset): number[] =>
  ds.rows.map((r) => r[ds.numeric]).filter((v): v is number => typeof v === "number");

export const quantile = (sorted: number[], q: number): number => {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

export const describe = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  const std = Math.sqrt(sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1));
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inside = sorted.filter((v) => v >= lowFence && v <= highFence);
  return {
    n, mean, std, median, q1, q3, lowFence, highFence,
    min: sorted[0], max: sorted[n - 1],
    whiskerLow: inside[0], whiskerHigh: inside[inside.length - 1],
    outliersIqr: sorted.filter((v) => v < lowFence || v > highFence),
    outliersZ: values.filter((v) => Math.abs((v - mean) / std) > 3),
  };
};

export const categoryShares = (ds: SampleDataset) => {
  const counts = new Map<string, number>();
  let total = 0;
  for (const r of ds.rows) {
    const v = r[ds.categorical];
    if (typeof v === "string") { counts.set(v, (counts.get(v) ?? 0) + 1); total++; }
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count, share: count / total })).sort((a, b) => b.count - a.count);
};

export const profile = (ds: SampleDataset) => {
  const n = ds.rows.length;
  const perColumn = ds.columns.map((c) => {
    const missing = ds.rows.filter((r) => r[c] === null).length;
    return { column: c, missing, completeness: 1 - missing / n };
  });
  const missingCells = perColumn.reduce((s, c) => s + c.missing, 0);
  const seen = new Set<string>();
  let duplicates = 0;
  for (const r of ds.rows) {
    const key = JSON.stringify(ds.columns.map((c) => r[c]));
    if (seen.has(key)) duplicates++; else seen.add(key);
  }
  return { n, variables: ds.columns.length, perColumn, missingShare: missingCells / (n * ds.columns.length), duplicates, duplicatesShare: duplicates / n };
};
