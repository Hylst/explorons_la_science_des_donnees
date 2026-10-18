import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { approximate, RIEMANN_FUNCTIONS, shapes, type RiemannMethod } from "@/lib/riemann";

const METHODS: { id: RiemannMethod; label: string }[] = [
  { id: "gauche", label: "Rectangles à gauche" },
  { id: "droite", label: "Rectangles à droite" },
  { id: "milieu", label: "Point milieu" },
  { id: "trapezes", label: "Trapèzes" },
];

const W = 400;
const H = 220;
const PAD = 24;

const fr = (v: number, digits = 4) => v.toLocaleString("fr-FR", { maximumFractionDigits: digits });
const frErr = (v: number) => (v === 0 ? "0" : v < 1e-4 ? v.toExponential(1).replace(".", ",") : fr(v, 5));

/** Somme de Riemann interactive : fonction, méthode et nombre de tranches au choix, erreur calculée en direct */
const RiemannExplorer = () => {
  const [fnId, setFnId] = useState(RIEMANN_FUNCTIONS[0].id);
  const [method, setMethod] = useState<RiemannMethod>("gauche");
  const [n, setN] = useState(6);
  const sliderId = useId();
  const current = RIEMANN_FUNCTIONS.find((r) => r.id === fnId) ?? RIEMANN_FUNCTIONS[0];
  const { f, a, b, exact, yMax } = current;

  const sx = (x: number) => PAD + ((x - a) / (b - a)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - (y / yMax) * (H - 2 * PAD);
  const curve = Array.from({ length: 121 }, (_, i) => {
    const x = a + ((b - a) * i) / 120;
    return `${i === 0 ? "M" : "L"}${sx(x).toFixed(2)},${sy(f(x)).toFixed(2)}`;
  }).join(" ");

  const value = approximate(f, a, b, n, method);
  const error = Math.abs(value - exact);
  const errorDouble = Math.abs(approximate(f, a, b, 2 * n, method) - exact);
  const ratio = errorDouble > 0 ? error / errorDouble : null;

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-700">
      <figcaption className="mb-4">
        <span className="block text-lg font-semibold">Somme de Riemann interactive</span>
        <span className="block text-sm text-muted-foreground">
          Choisissez une fonction, une méthode et le nombre de tranches : l'aire colorée est l'approximation, calculée dans votre navigateur.
        </span>
      </figcaption>

      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Fonction à intégrer">
        {RIEMANN_FUNCTIONS.map((r) => (
          <Button key={r.id} size="sm" variant={r.id === fnId ? "default" : "outline"} aria-pressed={r.id === fnId} onClick={() => setFnId(r.id)}>
            {r.label}
          </Button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Méthode d'approximation">
        {METHODS.map((m) => (
          <Button key={m.id} size="sm" variant={m.id === method ? "default" : "outline"} aria-pressed={m.id === method} onClick={() => setMethod(m.id)}>
            {m.label}
          </Button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor={sliderId} className="text-sm font-medium">
          Nombre de tranches : n = {n}
        </label>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={40}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full max-w-xs accent-blue-600"
        />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-2xl text-slate-700 dark:text-slate-200" role="img" aria-label={`Aire sous ${current.label} approchée par ${n} tranches`}>
        <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="currentColor" strokeOpacity="0.5" />
        {shapes(f, a, b, n, method).map((pts, i) => (
          <polygon
            key={i}
            points={pts.map(([x, y]) => `${sx(x).toFixed(2)},${sy(y).toFixed(2)}`).join(" ")}
            className="fill-blue-500/25 stroke-blue-600 dark:stroke-blue-400"
            strokeWidth="1"
          />
        ))}
        <path d={curve} fill="none" className="stroke-orange-500" strokeWidth="2.5" />
        <text x={sx(a)} y={H - 6} fill="currentColor" fontSize="11" textAnchor="start">{fr(a, 2)}</text>
        <text x={sx(b)} y={H - 6} fill="currentColor" fontSize="11" textAnchor="end">{current.id === "sinus" ? "π" : fr(b, 2)}</text>
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3" aria-live="polite">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-muted-foreground">Approximation</dt>
          <dd className="font-mono text-base">{fr(value, 6)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-muted-foreground">Valeur exacte</dt>
          <dd className="font-mono text-base">{fr(exact, 6)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-muted-foreground">Erreur</dt>
          <dd className="font-mono text-base">{frErr(error)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-gray-700">
        Avec 2n = {2 * n} tranches, l'erreur devient {frErr(errorDouble)}
        {ratio !== null && ratio < 1e6 ? ` : elle est divisée par ${fr(ratio, 2)}.` : "."}
      </p>
      <p className="mt-2 text-sm text-gray-700">
        Pour une fonction régulière, doubler n divise l'erreur par 2 environ avec les rectangles à gauche ou à droite, et par 4 environ
        avec le point milieu ou les trapèzes ; le point milieu fait en général deux fois mieux que les trapèzes, dans l'autre sens.
        Avec le sinus et la densité normale, f prend la même valeur aux deux bornes : rectangles à gauche, à droite et trapèzes donnent
        alors exactement le même résultat.
      </p>
    </figure>
  );
};

export default RiemannExplorer;
