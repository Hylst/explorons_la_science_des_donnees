import { describe, expect, it, vi } from "vitest";
import {
  categoryShares,
  describe as describeStats,
  makeGauss,
  makeUniform,
  numericValues,
  profile,
  quantile,
  SAMPLE_DATASETS,
  type Row,
  type SampleDataset,
} from "./sample-datasets";

/** Petit jeu de données à la main, pour des résultats connus à l'avance */
const tiny = (rows: Row[]): SampleDataset => ({
  id: "sales",
  name: "Test",
  columns: ["groupe", "valeur"],
  numeric: "valeur",
  numericLabel: "Valeur",
  unit: "u",
  categorical: "groupe",
  categoricalLabel: "Groupes",
  rows,
});

const allFinite = (object: Record<string, unknown>) =>
  Object.entries(object).every(([, v]) => (typeof v === "number" ? Number.isFinite(v) : true));

const datasets = Object.values(SAMPLE_DATASETS);

describe("générateurs pseudo-aléatoires", () => {
  it("makeUniform est déterministe : même graine, même suite", () => {
    const a = makeUniform(42);
    const b = makeUniform(42);
    const suiteA = Array.from({ length: 50 }, a);
    const suiteB = Array.from({ length: 50 }, b);
    expect(suiteA).toEqual(suiteB);
  });

  it("makeUniform donne des suites différentes pour des graines différentes", () => {
    expect(Array.from({ length: 10 }, makeUniform(1))).not.toEqual(Array.from({ length: 10 }, makeUniform(2)));
  });

  it("makeUniform reste dans [0, 1[ et couvre l'intervalle", () => {
    const u = makeUniform(7);
    const draws = Array.from({ length: 20000 }, u);
    expect(draws.every((x) => x >= 0 && x < 1)).toBe(true);
    const mean = draws.reduce((s, x) => s + x, 0) / draws.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
    expect(Math.min(...draws)).toBeLessThan(0.01);
    expect(Math.max(...draws)).toBeGreaterThan(0.99);
  });

  it("makeGauss est déterministe", () => {
    expect(Array.from({ length: 20 }, makeGauss(5))).toEqual(Array.from({ length: 20 }, makeGauss(5)));
  });

  it("makeGauss ne produit ni NaN ni infini et suit une loi centrée réduite", () => {
    const g = makeGauss(11);
    const draws = Array.from({ length: 50000 }, g);
    expect(draws.every(Number.isFinite)).toBe(true);
    const mean = draws.reduce((s, x) => s + x, 0) / draws.length;
    const variance = draws.reduce((s, x) => s + (x - mean) ** 2, 0) / (draws.length - 1);
    expect(Math.abs(mean)).toBeLessThan(0.03);
    expect(Math.sqrt(variance)).toBeGreaterThan(0.97);
    expect(Math.sqrt(variance)).toBeLessThan(1.03);
    // environ 68 % des tirages à moins d'un écart type
    const within = draws.filter((x) => Math.abs(x) < 1).length / draws.length;
    expect(within).toBeGreaterThan(0.66);
    expect(within).toBeLessThan(0.7);
  });
});

describe("jeux de données d'exemple", () => {
  it("expose les jeux « sales » et « patients », rangés sous leur identifiant", () => {
    expect(Object.keys(SAMPLE_DATASETS).sort()).toEqual(["patients", "sales"]);
    for (const [key, ds] of Object.entries(SAMPLE_DATASETS)) expect(ds.id).toBe(key);
  });

  it("annonce 400 ventes et 300 patients", () => {
    expect(SAMPLE_DATASETS.sales.rows).toHaveLength(400);
    expect(SAMPLE_DATASETS.patients.rows).toHaveLength(300);
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : la variable numérique et la variable catégorielle sont des colonnes", (_id, ds) => {
    expect(ds.columns).toContain(ds.numeric);
    expect(ds.columns).toContain(ds.categorical);
    expect(new Set(ds.columns).size).toBe(ds.columns.length);
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : chaque ligne a exactement les colonnes annoncées (colonnes de même longueur)", (_id, ds) => {
    const expected = [...ds.columns].sort();
    for (const [index, row] of ds.rows.entries()) {
      expect(Object.keys(row).sort(), `ligne ${index}`).toEqual(expected);
    }
    for (const column of ds.columns) {
      expect(ds.rows.map((r) => r[column])).toHaveLength(ds.rows.length);
    }
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : aucune cellule NaN, infinie ou indéfinie", (_id, ds) => {
    for (const [index, row] of ds.rows.entries()) {
      for (const column of ds.columns) {
        const cell = row[column];
        expect(cell !== undefined, `ligne ${index}, ${column}`).toBe(true);
        if (typeof cell === "number") expect(Number.isFinite(cell), `ligne ${index}, ${column}`).toBe(true);
        else expect(cell === null || typeof cell === "string", `ligne ${index}, ${column}`).toBe(true);
      }
    }
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : le type de chaque colonne est homogène (nombres ou textes, avec des manques)", (_id, ds) => {
    for (const column of ds.columns) {
      const types = new Set(ds.rows.map((r) => r[column]).filter((c) => c !== null).map((c) => typeof c));
      expect(types.size, column).toBe(1);
    }
  });

  it("est reproductible : un rechargement du module redonne exactement les mêmes lignes", async () => {
    vi.resetModules();
    const again = await import("./sample-datasets");
    expect(again.SAMPLE_DATASETS.sales.rows).toEqual(SAMPLE_DATASETS.sales.rows);
    expect(again.SAMPLE_DATASETS.patients.rows).toEqual(SAMPLE_DATASETS.patients.rows);
  });

  describe("ventes", () => {
    const { rows } = SAMPLE_DATASETS.sales;

    it("quantités entières d'au moins 1", () => {
      for (const r of rows) {
        expect(Number.isInteger(r.quantite)).toBe(true);
        expect(r.quantite as number).toBeGreaterThanOrEqual(1);
      }
    });

    it("produits parmi Logiciel, Matériel, Service, sans valeur manquante", () => {
      expect(new Set(rows.map((r) => r.produit))).toEqual(new Set(["Logiciel", "Matériel", "Service"]));
    });

    it("contient les valeurs aberrantes volontaires annoncées", () => {
      const amounts = numericValues(SAMPLE_DATASETS.sales);
      for (const outlier of [9800, 11500, 10400, 4, 6]) expect(amounts).toContain(outlier);
    });

    it("les gros montants volontaires sont bien détectés par la règle de l'IQR", () => {
      const stats = describeStats(numericValues(SAMPLE_DATASETS.sales));
      for (const big of [9800, 11500, 10400]) expect(stats.outliersIqr).toContain(big);
      expect(stats.highFence).toBeLessThan(9800);
    });

    it("présente des manques dans la région et le montant", () => {
      const p = profile(SAMPLE_DATASETS.sales);
      expect(p.perColumn.find((c) => c.column === "region")?.missing).toBeGreaterThan(0);
      expect(p.perColumn.find((c) => c.column === "montant")?.missing).toBeGreaterThan(0);
      expect(p.perColumn.find((c) => c.column === "client_id")?.missing).toBe(0);
    });

    it("contient au moins les 3 doublons exacts volontaires", () => {
      expect(profile(SAMPLE_DATASETS.sales).duplicates).toBeGreaterThanOrEqual(3);
    });
  });

  describe("patients", () => {
    const ds = SAMPLE_DATASETS.patients;

    it("seuls les 3 âges aberrants volontaires sortent de l'intervalle 18-95", () => {
      const outside = ds.rows.map((r) => r.age).filter((a): a is number => typeof a === "number" && (a < 18 || a > 95));
      expect(outside.sort((a, b) => a - b)).toEqual([-1, 127, 131]);
    });

    it("durées de séjour entières d'au moins 1 jour, poids positifs", () => {
      for (const r of ds.rows) {
        expect(Number.isInteger(r.duree_sejour)).toBe(true);
        expect(r.duree_sejour as number).toBeGreaterThanOrEqual(1);
        expect(r.poids as number).toBeGreaterThan(0);
      }
    });

    it("sexe limité à F et M (ou manquant), diagnostics parmi les 5 catégories annoncées", () => {
      const sexes = new Set(ds.rows.map((r) => r.sexe).filter((s) => s !== null));
      expect(sexes).toEqual(new Set(["F", "M"]));
      const diagnostics = new Set(ds.rows.map((r) => r.diagnostic).filter((s) => s !== null));
      expect(diagnostics).toEqual(new Set(["Cardiologie", "Diabète", "Respiratoire", "Orthopédie", "Autre"]));
    });

    it("les âges aberrants sont signalés par la règle de l'IQR", () => {
      const stats = describeStats(numericValues(ds));
      expect(stats.outliersIqr).toEqual(expect.arrayContaining([131, 127, -1]));
    });
  });
});

describe("quantile", () => {
  const sorted = [1, 2, 3, 4, 5];

  it("renvoie le minimum, la médiane et le maximum", () => {
    expect(quantile(sorted, 0)).toBe(1);
    expect(quantile(sorted, 0.5)).toBe(3);
    expect(quantile(sorted, 1)).toBe(5);
  });

  it("renvoie les quartiles par interpolation linéaire", () => {
    expect(quantile(sorted, 0.25)).toBe(2);
    expect(quantile(sorted, 0.75)).toBe(4);
    expect(quantile([1, 2], 0.5)).toBe(1.5);
    expect(quantile([10, 20, 30, 40], 0.5)).toBe(25);
    expect(quantile([10, 20, 30, 40], 0.25)).toBeCloseTo(17.5, 10);
  });

  it("gère un seul élément", () => {
    expect(quantile([7], 0)).toBe(7);
    expect(quantile([7], 0.5)).toBe(7);
    expect(quantile([7], 1)).toBe(7);
  });
});

describe("describe (statistiques descriptives)", () => {
  it("donne des valeurs connues sur 1, 2, 3, 4, 5", () => {
    const s = describeStats([1, 2, 3, 4, 5]);
    expect(s.n).toBe(5);
    expect(s.mean).toBe(3);
    expect(s.std).toBeCloseTo(Math.sqrt(2.5), 10); // écart type d'échantillon (n - 1)
    expect(s.median).toBe(3);
    expect(s.q1).toBe(2);
    expect(s.q3).toBe(4);
    expect(s.lowFence).toBe(-1);
    expect(s.highFence).toBe(7);
    expect(s.min).toBe(1);
    expect(s.max).toBe(5);
    expect(s.whiskerLow).toBe(1);
    expect(s.whiskerHigh).toBe(5);
    expect(s.outliersIqr).toEqual([]);
    expect(s.outliersZ).toEqual([]);
  });

  it("ne dépend pas de l'ordre des valeurs et ne modifie pas le tableau fourni", () => {
    const input = [5, 1, 4, 2, 3];
    const copy = [...input];
    const s = describeStats(input);
    expect(input).toEqual(copy);
    expect(s).toEqual(describeStats([1, 2, 3, 4, 5]));
  });

  it("détecte une valeur extrême par l'IQR et ramène les moustaches aux valeurs non extrêmes", () => {
    const s = describeStats([1, 2, 3, 4, 100]);
    expect(s.outliersIqr).toEqual([100]);
    expect(s.whiskerHigh).toBe(4);
    expect(s.whiskerLow).toBe(1);
    expect(s.max).toBe(100);
  });

  it("une valeur extrême sur un petit échantillon n'atteint pas le seuil de 3 écarts types (effet de masque)", () => {
    // n = 5 : le score z d'une valeur ne peut dépasser (n - 1) / racine(n) = 1,79
    expect(describeStats([1, 2, 3, 4, 100]).outliersZ).toEqual([]);
  });

  it("détecte par le score z une valeur lointaine sur un échantillon assez grand", () => {
    const values = [...Array.from({ length: 15 }, () => 10), ...Array.from({ length: 15 }, () => 12), 100];
    const s = describeStats(values);
    expect(s.outliersZ).toEqual([100]);
    expect(s.outliersIqr).toEqual([100]);
  });

  it("une valeur constante ne produit aucun NaN et aucune valeur aberrante", () => {
    const s = describeStats([5, 5, 5, 5, 5]);
    expect(allFinite(s as unknown as Record<string, unknown>)).toBe(true);
    expect(s.mean).toBe(5);
    expect(s.std).toBe(0);
    expect(s.median).toBe(5);
    expect(s.q1).toBe(5);
    expect(s.q3).toBe(5);
    expect(s.whiskerLow).toBe(5);
    expect(s.whiskerHigh).toBe(5);
    expect(s.outliersIqr).toEqual([]);
    expect(s.outliersZ).toEqual([]);
  });

  it("deux valeurs : moyenne, médiane et écart type connus", () => {
    const s = describeStats([2, 4]);
    expect(s.mean).toBe(3);
    expect(s.median).toBe(3);
    expect(s.std).toBeCloseTo(Math.SQRT2, 10);
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : les statistiques de la variable numérique sont finies et ordonnées", (_id, ds) => {
    const values = numericValues(ds);
    const s = describeStats(values);
    expect(allFinite(s as unknown as Record<string, unknown>)).toBe(true);
    expect(s.n).toBe(values.length);
    expect(s.std).toBeGreaterThan(0);
    expect(s.min).toBeLessThanOrEqual(s.q1);
    expect(s.q1).toBeLessThanOrEqual(s.median);
    expect(s.median).toBeLessThanOrEqual(s.q3);
    expect(s.q3).toBeLessThanOrEqual(s.max);
    expect(s.whiskerLow).toBeGreaterThanOrEqual(s.lowFence);
    expect(s.whiskerHigh).toBeLessThanOrEqual(s.highFence);
    expect(s.outliersIqr.every((v) => v < s.lowFence || v > s.highFence)).toBe(true);
    expect(s.outliersIqr.length + values.filter((v) => v >= s.lowFence && v <= s.highFence).length).toBe(s.n);
  });
});

describe("numericValues", () => {
  it("ne garde que les nombres de la colonne numérique et ignore les manques", () => {
    const ds = tiny([
      { groupe: "A", valeur: 1 },
      { groupe: "A", valeur: null },
      { groupe: "B", valeur: 3 },
    ]);
    expect(numericValues(ds)).toEqual([1, 3]);
  });

  it("le nombre de valeurs numériques plus les manques égale le nombre de lignes", () => {
    for (const ds of datasets) {
      const missing = profile(ds).perColumn.find((c) => c.column === ds.numeric)?.missing ?? -1;
      expect(numericValues(ds).length + missing).toBe(ds.rows.length);
    }
  });
});

describe("categoryShares", () => {
  it("compte chaque modalité, calcule les parts et trie par effectif décroissant", () => {
    const ds = tiny([
      { groupe: "B", valeur: 1 },
      { groupe: "A", valeur: 2 },
      { groupe: "A", valeur: 3 },
      { groupe: "A", valeur: 4 },
      { groupe: "C", valeur: 5 },
      { groupe: "C", valeur: 6 },
    ]);
    expect(categoryShares(ds)).toEqual([
      { label: "A", count: 3, share: 0.5 },
      { label: "C", count: 2, share: 2 / 6 },
      { label: "B", count: 1, share: 1 / 6 },
    ]);
  });

  it("exclut les valeurs manquantes du dénominateur", () => {
    const ds = tiny([
      { groupe: "A", valeur: 1 },
      { groupe: null, valeur: 2 },
      { groupe: "B", valeur: 3 },
      { groupe: null, valeur: 4 },
    ]);
    const shares = categoryShares(ds);
    expect(shares).toHaveLength(2);
    expect(shares.every((s) => s.share === 0.5)).toBe(true);
  });

  it.each(datasets.map((ds) => [ds.id, ds] as const))("%s : les parts somment à 1 et les effectifs au nombre de valeurs renseignées", (_id, ds) => {
    const shares = categoryShares(ds);
    const missing = profile(ds).perColumn.find((c) => c.column === ds.categorical)?.missing ?? -1;
    expect(shares.reduce((s, c) => s + c.share, 0)).toBeCloseTo(1, 10);
    expect(shares.reduce((s, c) => s + c.count, 0)).toBe(ds.rows.length - missing);
    expect(shares.every((c) => Number.isFinite(c.share) && c.share > 0 && c.share <= 1)).toBe(true);
    for (let i = 1; i < shares.length; i++) expect(shares[i - 1].count).toBeGreaterThanOrEqual(shares[i].count);
  });
});

describe("profile (qualité des données)", () => {
  const ds = tiny([
    { groupe: "A", valeur: 1 },
    { groupe: "A", valeur: 1 }, // doublon exact de la ligne précédente
    { groupe: null, valeur: 2 },
    { groupe: "B", valeur: null },
  ]);

  it("compte lignes, variables, manques et complétude par colonne", () => {
    const p = profile(ds);
    expect(p.n).toBe(4);
    expect(p.variables).toBe(2);
    expect(p.perColumn).toEqual([
      { column: "groupe", missing: 1, completeness: 0.75 },
      { column: "valeur", missing: 1, completeness: 0.75 },
    ]);
  });

  it("calcule la part de cellules manquantes sur l'ensemble du tableau", () => {
    expect(profile(ds).missingShare).toBe(2 / 8);
  });

  it("compte les doublons exacts, la première occurrence n'en étant pas un", () => {
    const p = profile(ds);
    expect(p.duplicates).toBe(1);
    expect(p.duplicatesShare).toBe(1 / 4);
  });

  it("deux lignes avec des manques aux mêmes endroits comptent comme un doublon", () => {
    const withNulls = tiny([
      { groupe: null, valeur: null },
      { groupe: null, valeur: null },
      { groupe: null, valeur: null },
    ]);
    expect(profile(withNulls).duplicates).toBe(2);
  });

  it("un jeu sans doublon ni manque a des parts nulles et une complétude de 1", () => {
    const clean = tiny([
      { groupe: "A", valeur: 1 },
      { groupe: "B", valeur: 2 },
    ]);
    const p = profile(clean);
    expect(p.duplicates).toBe(0);
    expect(p.missingShare).toBe(0);
    expect(p.perColumn.every((c) => c.completeness === 1)).toBe(true);
  });

  it.each(datasets.map((d) => [d.id, d] as const))("%s : les proportions sont cohérentes entre elles", (_id, d) => {
    const p = profile(d);
    expect(p.n).toBe(d.rows.length);
    expect(p.variables).toBe(d.columns.length);
    expect(p.perColumn.map((c) => c.column)).toEqual(d.columns);
    const missingCells = p.perColumn.reduce((s, c) => s + c.missing, 0);
    expect(p.missingShare).toBeCloseTo(missingCells / (p.n * p.variables), 12);
    expect(p.duplicatesShare).toBeCloseTo(p.duplicates / p.n, 12);
    for (const c of p.perColumn) {
      expect(c.completeness).toBeGreaterThanOrEqual(0);
      expect(c.completeness).toBeLessThanOrEqual(1);
      expect(c.completeness).toBeCloseTo(1 - c.missing / p.n, 12);
    }
  });

  it("patients : au moins les 2 doublons exacts volontaires, et des âges manquants", () => {
    const p = profile(SAMPLE_DATASETS.patients);
    expect(p.duplicates).toBeGreaterThanOrEqual(2);
    expect(p.perColumn.find((c) => c.column === "age")?.missing).toBeGreaterThan(0);
  });
});
