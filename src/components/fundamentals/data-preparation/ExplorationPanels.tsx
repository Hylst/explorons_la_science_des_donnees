import React, { useMemo } from "react";
import {
  SampleDataset, categoryShares, describe, numericValues, profile,
} from "@/lib/sample-datasets";

const fmt = (v: number, digits = 1) => v.toLocaleString("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
const pct = (v: number) => `${(v * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`;

const Note: React.FC<{ ds: SampleDataset }> = ({ ds }) => (
  <p className="text-xs text-muted-foreground">
    Jeu d'exemple « {ds.name} » généré ({ds.rows.length} lignes, graine fixe) : tous les chiffres sont calculés dans votre navigateur.
  </p>
);

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-2">
    <span>{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);

export const DistributionPanel: React.FC<{ ds: SampleDataset }> = ({ ds }) => {
  const data = useMemo(() => {
    const values = numericValues(ds);
    const d = describe(values);
    const inside = values.filter((v) => v >= d.lowFence && v <= d.highFence);
    const bins = 12;
    const lo = Math.min(...inside);
    const hi = Math.max(...inside);
    const width = (hi - lo) / bins || 1;
    const counts = new Array(bins).fill(0);
    inside.forEach((v) => { counts[Math.min(bins - 1, Math.floor((v - lo) / width))]++; });
    return { d, lo, width, counts, excluded: values.length - inside.length, shares: categoryShares(ds) };
  }, [ds]);
  const max = Math.max(...data.counts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3 min-w-0">
        <h5 className="font-medium">{ds.numericLabel} (variable numérique)</h5>
        <svg viewBox="0 0 240 120" className="w-full h-32 bg-gray-50 rounded" role="img" aria-label={`Histogramme : ${ds.numericLabel}`}>
          {data.counts.map((c, i) => {
            const h = (c / max) * 95;
            return <rect key={i} x={6 + i * 19.5} y={105 - h} width={18} height={h} className="fill-blue-500"><title>{`${fmt(data.lo + i * data.width, 0)} à ${fmt(data.lo + (i + 1) * data.width, 0)} ${ds.unit} : ${c}`}</title></rect>;
          })}
          <line x1="4" y1="105" x2="238" y2="105" stroke="#9ca3af" />
          <text x="4" y="117" fontSize="8" fill="#6b7280">{fmt(data.lo, 0)}</text>
          <text x="238" y="117" fontSize="8" fill="#6b7280" textAnchor="end">{fmt(data.lo + data.width * 12, 0)} {ds.unit}</text>
        </svg>
        <div className="text-sm space-y-1">
          <StatRow label="Moyenne :" value={`${fmt(data.d.mean)} ${ds.unit}`} />
          <StatRow label="Médiane :" value={`${fmt(data.d.median)} ${ds.unit}`} />
          <StatRow label="Écart-type :" value={`${fmt(data.d.std)} ${ds.unit}`} />
        </div>
        {data.excluded > 0 && (
          <p className="text-xs text-muted-foreground">
            {data.excluded} valeur(s) aberrante(s) (hors de 1,5 × l'écart interquartile) ne sont pas tracées ; elles tirent la moyenne vers le haut ou le bas, pas la médiane.
          </p>
        )}
      </div>
      <div className="space-y-3 min-w-0">
        <h5 className="font-medium">{ds.categoricalLabel} (variable catégorielle)</h5>
        <div className="space-y-2" role="img" aria-label={`Répartition : ${ds.categoricalLabel}`}>
          {data.shares.map((s) => (
            <div key={s.label} className="text-sm">
              <div className="flex justify-between gap-2"><span className="truncate">{s.label}</span><span className="font-mono">{pct(s.share)}</span></div>
              <div className="h-2 bg-gray-200 rounded-full"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${s.share * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2"><Note ds={ds} /></div>
    </div>
  );
};

export const OutliersPanel: React.FC<{ ds: SampleDataset }> = ({ ds }) => {
  const values = useMemo(() => numericValues(ds), [ds]);
  const d = useMemo(() => describe(values), [values]);
  const lo = Math.min(d.min, d.lowFence);
  const hi = Math.max(d.max, d.highFence);
  const x = (v: number) => 10 + ((v - lo) / (hi - lo || 1)) * 220;
  const zOf = (v: number) => (v - d.mean) / d.std;
  const zMax = Math.max(4, ...values.map((v) => Math.abs(zOf(v)))) + 0.3;
  const zy = (z: number) => 60 - (z / zMax) * 52;
  const listed = (arr: number[]) => (arr.length ? [...new Set(arr)].sort((a, b) => a - b).map((v) => fmt(v, 0)).join(" ; ") + ` ${ds.unit}` : "aucune");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <h5 className="font-medium text-center">Boîte à moustaches (IQR)</h5>
          <svg viewBox="0 0 240 70" className="w-full h-32 bg-gray-50 rounded" role="img" aria-label="Boîte à moustaches">
            <line x1={x(d.whiskerLow)} x2={x(d.whiskerHigh)} y1="30" y2="30" stroke="#374151" />
            <rect x={x(d.q1)} y="16" width={Math.max(1, x(d.q3) - x(d.q1))} height="28" className="fill-blue-200 stroke-blue-600" />
            <line x1={x(d.median)} x2={x(d.median)} y1="16" y2="44" stroke="#1d4ed8" strokeWidth="2" />
            {[d.whiskerLow, d.whiskerHigh].map((v, i) => <line key={i} x1={x(v)} x2={x(v)} y1="23" y2="37" stroke="#374151" />)}
            {d.outliersIqr.map((v, i) => <circle key={i} cx={x(v)} cy="30" r="3" className="fill-red-500"><title>{`${fmt(v, 0)} ${ds.unit}`}</title></circle>)}
            <text x="10" y="64" fontSize="8" fill="#6b7280">{fmt(lo, 0)}</text>
            <text x="230" y="64" fontSize="8" fill="#6b7280" textAnchor="end">{fmt(hi, 0)} {ds.unit}</text>
          </svg>
          <p className="text-xs text-center text-muted-foreground">Q1 {fmt(d.q1, 0)} · médiane {fmt(d.median, 0)} · Q3 {fmt(d.q3, 0)} · bornes [{fmt(d.lowFence, 0)} ; {fmt(d.highFence, 0)}]</p>
        </div>
        <div className="space-y-2 min-w-0">
          <h5 className="font-medium text-center">Score Z de chaque valeur</h5>
          <svg viewBox="0 0 240 70" className="w-full h-32 bg-gray-50 rounded" role="img" aria-label="Scores Z">
            {[3, -3].map((t) => <line key={t} x1="0" x2="240" y1={zy(t)} y2={zy(t)} stroke="#ef4444" strokeDasharray="3 3" />)}
            <line x1="0" x2="240" y1={zy(0)} y2={zy(0)} stroke="#9ca3af" />
            {values.map((v, i) => {
              const z = zOf(v);
              return <circle key={i} cx={4 + (i / values.length) * 232} cy={zy(z)} r={Math.abs(z) > 3 ? 2.5 : 1.2} className={Math.abs(z) > 3 ? "fill-red-500" : "fill-blue-500"} />;
            })}
            <text x="238" y={zy(3) - 2} fontSize="7" fill="#ef4444" textAnchor="end">z = +3</text>
            <text x="238" y={zy(-3) + 8} fontSize="7" fill="#ef4444" textAnchor="end">z = −3</text>
          </svg>
          <p className="text-xs text-center text-muted-foreground">Un point par ligne ; en rouge, |z| &gt; 3.</p>
        </div>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h6 className="font-medium text-yellow-800 mb-2">⚠️ Valeurs aberrantes détectées sur « {ds.numeric} »</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-900">
          <div><span className="font-medium">Méthode IQR :</span> {d.outliersIqr.length} valeur(s) : {listed(d.outliersIqr)}</div>
          <div><span className="font-medium">Méthode Z (|z| &gt; 3) :</span> {d.outliersZ.length} valeur(s) : {listed(d.outliersZ)}</div>
        </div>
        {d.lowFence < 0 && d.min >= 0 && (
          <p className="text-xs text-yellow-800 mt-2">La borne basse ({fmt(d.lowFence, 0)}) est négative : sur une distribution asymétrique, cette méthode ne peut détecter aucune petite valeur, même très éloignée du reste (ici {fmt(d.min, 0)} {ds.unit}).</p>
        )}
        <p className="text-xs text-yellow-800 mt-2">Les deux méthodes ne détectent pas les mêmes points : le score Z dépend de la moyenne et de l'écart-type, eux-mêmes tirés par les valeurs extrêmes.</p>
      </div>
      <Note ds={ds} />
    </div>
  );
};

export const ProfilingPanel: React.FC<{ ds: SampleDataset }> = ({ ds }) => {
  const p = useMemo(() => profile(ds), [ds]);
  const d = useMemo(() => describe(numericValues(ds)), [ds]);
  const cards = [
    { label: "Variables", value: String(p.variables), cls: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: "Observations", value: p.n.toLocaleString("fr-FR"), cls: "bg-green-50 border-green-200 text-green-700" },
    { label: "Valeurs manquantes", value: pct(p.missingShare), cls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { label: "Doublons", value: `${p.duplicates} (${pct(p.duplicatesShare)})`, cls: "bg-red-50 border-red-200 text-red-700" },
  ];
  const withMissing = p.perColumn.filter((c) => c.missing > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-lg border p-4 text-center ${c.cls}`}>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="font-medium mb-3">📋 Complétude par variable</h5>
          <div className="space-y-2">
            {p.perColumn.map((c) => (
              <div key={c.column} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono truncate">{c.column}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${c.completeness >= 0.99 ? "bg-green-500" : c.completeness >= 0.95 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${c.completeness * 100}%` }} />
                  </div>
                  <span className="text-sm font-mono w-16 text-right">{pct(c.completeness)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-medium mb-3">🔍 Recommandations (déduites des chiffres)</h5>
          <div className="space-y-2 text-sm">
            {withMissing.length > 0 && (
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <strong>Nettoyage :</strong> valeurs manquantes à traiter dans {withMissing.map((c) => `'${c.column}' (${c.missing})`).join(", ")}.
              </div>
            )}
            {p.duplicates > 0 && (
              <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <strong>Déduplication :</strong> {p.duplicates} ligne(s) identique(s) à une ligne précédente.
              </div>
            )}
            {d.outliersIqr.length > 0 && (
              <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                <strong>Validation :</strong> {d.outliersIqr.length} valeur(s) aberrante(s) sur « {ds.numeric} » à vérifier (erreur de saisie ou cas réel ?).
              </div>
            )}
          </div>
        </div>
      </div>
      <Note ds={ds} />
    </div>
  );
};
