import React, { useMemo, useState } from "react";

/**
 * Matrice de corrélation calculée pour de vrai (coefficient de Pearson) sur un jeu de données d'exemple
 * généré à l'ouverture avec une graine fixe : les chiffres affichés sont ceux de ce jeu, reproductibles,
 * et non des résultats d'une étude.
 */
const VARIABLES = ["Montant", "Quantité", "Âge", "Durée séjour", "Prix", "Volume"] as const;
const N = 200;

/** Générateur pseudo-aléatoire déterministe (mulberry32) et loi normale par Box-Muller */
const makeRandom = (seed: number) => {
  let a = seed;
  const uniform = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return () => Math.sqrt(-2 * Math.log(1 - uniform())) * Math.cos(2 * Math.PI * uniform());
};

const buildDataset = (): number[][] => {
  const gauss = makeRandom(20260930);
  const columns: number[][] = VARIABLES.map(() => []);
  for (let i = 0; i < N; i++) {
    const quantite = 10 + 3 * gauss();
    const montant = 12 * quantite + 15 * gauss(); // fortement liée à la quantité
    const age = 45 + 12 * gauss();
    const duree = 0.12 * age + 2 * gauss(); // modérément liée à l'âge
    const prix = 50 + 10 * gauss();
    const volume = 200 - 2.5 * prix + 25 * gauss(); // négativement liée au prix
    [montant, quantite, age, duree, prix, volume].forEach((value, j) => columns[j].push(value));
  }
  return columns;
};

const pearson = (x: number[], y: number[]): number => {
  const mean = (v: number[]) => v.reduce((s, e) => s + e, 0) / v.length;
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
};

/** Bleu (négatif) → blanc (0) → rouge (positif) */
const colorFor = (r: number) => {
  const strength = Math.min(1, Math.abs(r));
  const [red, green, blue] = r >= 0 ? [220, 60, 50] : [50, 100, 220];
  const mix = (channel: number) => Math.round(255 + (channel - 255) * strength);
  return `rgb(${mix(red)}, ${mix(green)}, ${mix(blue)})`;
};

export const CorrelationHeatmap: React.FC = () => {
  const matrix = useMemo(() => {
    const data = buildDataset();
    return data.map((a) => data.map((b) => pearson(a, b)));
  }, []);
  const [selected, setSelected] = useState<[number, number]>([0, 1]);

  const strongest = useMemo(() => {
    const pairs: { i: number; j: number; r: number }[] = [];
    for (let i = 0; i < VARIABLES.length; i++) for (let j = i + 1; j < VARIABLES.length; j++) pairs.push({ i, j, r: matrix[i][j] });
    return pairs.sort((p, q) => Math.abs(q.r) - Math.abs(p.r)).slice(0, 3);
  }, [matrix]);

  const [si, sj] = selected;
  const label = (r: number) => (r >= 0 ? "+" : "−") + Math.abs(r).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="overflow-x-auto">
        <div
          className="grid gap-px text-xs min-w-[20rem]"
          style={{ gridTemplateColumns: `5.5rem repeat(${VARIABLES.length}, minmax(2.5rem, 1fr))` }}
          role="grid"
          aria-label="Matrice de corrélation du jeu de données d'exemple"
        >
          <div />
          {VARIABLES.map((name) => (
            <div key={name} className="text-center font-medium text-gray-600 truncate px-0.5" title={name}>
              {name}
            </div>
          ))}
          {VARIABLES.map((rowName, i) => (
            <React.Fragment key={rowName}>
              <div className="font-medium text-gray-600 truncate pr-1 self-center" title={rowName}>
                {rowName}
              </div>
              {VARIABLES.map((colName, j) => {
                const active = i === si && j === sj;
                return (
                  <button
                    key={colName}
                    type="button"
                    onClick={() => setSelected([i, j])}
                    aria-label={`${rowName} et ${colName} : ${label(matrix[i][j])}`}
                    aria-pressed={active}
                    className={`h-10 text-[11px] font-medium text-gray-900 rounded-sm ${active ? "ring-2 ring-blue-600" : ""}`}
                    style={{ backgroundColor: colorFor(matrix[i][j]) }}
                  >
                    {matrix[i][j].toFixed(2)}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Jeu de données d'exemple généré ({N} lignes, graine fixe) : coefficients de Pearson calculés dans votre navigateur.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium">Corrélations les plus fortes</h5>
        <ul className="space-y-2">
          {strongest.map(({ i, j, r }) => (
            <li key={`${i}-${j}`} className={`flex items-center justify-between p-2 rounded ${r >= 0 ? "bg-red-50" : "bg-blue-50"}`}>
              <span className="text-sm">
                {VARIABLES[i]} ↔ {VARIABLES[j]}
              </span>
              <span className="text-sm font-semibold tabular-nums">{label(r)}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm" aria-live="polite">
          Sélection : <strong>{VARIABLES[si]}</strong> ↔ <strong>{VARIABLES[sj]}</strong>, r = <strong>{label(matrix[si][sj])}</strong>
          {si === sj ? " (une variable est toujours parfaitement corrélée à elle-même)" : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          Une corrélation mesure un lien linéaire, pas une causalité : elle vaut +1 ou −1 pour une droite parfaite et 0 en l'absence de lien linéaire.
        </p>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
