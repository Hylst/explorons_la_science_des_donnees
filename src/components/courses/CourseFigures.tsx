import { useId, type ReactNode } from "react";

/**
 * Figures pédagogiques en SVG, dessinées dans le code : aucune image distante,
 * lisibles hors ligne, nettes à toutes les tailles et décrites pour les lecteurs d'écran.
 */

const W = 400;
const H = 240;
const BLUE = "#3b82f6";
const ORANGE = "#f97316";
const GREEN = "#16a34a";
const GRID = "#e2e8f0";

interface FigureFrameProps {
  title: string;
  caption: string;
  children: ReactNode;
}

const FigureFrame = ({ title, caption, children }: FigureFrameProps) => {
  const titleId = useId();
  return (
    <figure className="my-6 rounded-lg border border-gray-200 bg-white p-4 text-slate-700">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={titleId}
        className="mx-auto h-auto w-full max-w-xl"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
      >
        <title id={titleId}>{title}</title>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-gray-500">{caption}</figcaption>
    </figure>
  );
};

interface PlotArea {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

const MARGIN = { left: 36, right: 14, top: 14, bottom: 26 };

const makeScales = ({ xMin, xMax, yMin, yMax }: PlotArea) => {
  const width = W - MARGIN.left - MARGIN.right;
  const height = H - MARGIN.top - MARGIN.bottom;
  return {
    sx: (x: number) => MARGIN.left + ((x - xMin) / (xMax - xMin)) * width,
    sy: (y: number) => MARGIN.top + (1 - (y - yMin) / (yMax - yMin)) * height,
  };
};

const linePath = (f: (x: number) => number, x0: number, x1: number, sx: (x: number) => number, sy: (y: number) => number, steps = 80) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / steps;
    return `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`;
  }).join(" ");

interface AxesProps extends PlotArea {
  xTicks: number[];
  yTicks: number[];
}

const Axes = ({ xTicks, yTicks, ...area }: AxesProps) => {
  const { sx, sy } = makeScales(area);
  const fmt = (n: number) => String(n).replace("-", "−");
  return (
    <g>
      {yTicks.map((y) => (
        <g key={`y${y}`}>
          <line x1={MARGIN.left} x2={W - MARGIN.right} y1={sy(y)} y2={sy(y)} stroke={GRID} />
          <text x={MARGIN.left - 6} y={sy(y) + 4} textAnchor="end" fill="currentColor">{fmt(y)}</text>
        </g>
      ))}
      {xTicks.map((x) => (
        <g key={`x${x}`}>
          <line x1={sx(x)} x2={sx(x)} y1={MARGIN.top} y2={H - MARGIN.bottom} stroke={GRID} />
          <text x={sx(x)} y={H - MARGIN.bottom + 15} textAnchor="middle" fill="currentColor">{fmt(x)}</text>
        </g>
      ))}
      {area.yMin <= 0 && area.yMax >= 0 && (
        <line x1={MARGIN.left} x2={W - MARGIN.right} y1={sy(0)} y2={sy(0)} stroke="currentColor" strokeWidth="1.2" />
      )}
      {area.xMin <= 0 && area.xMax >= 0 && (
        <line x1={sx(0)} x2={sx(0)} y1={MARGIN.top} y2={H - MARGIN.bottom} stroke="currentColor" strokeWidth="1.2" />
      )}
    </g>
  );
};

/** Diagramme de Venn : union, intersection, différence et complémentaire. */
export const VennDiagram = () => {
  const clipId = useId();
  return (
    <FigureFrame
      title="Diagramme de Venn de deux ensembles A et B"
      caption="Deux ensembles A et B dans l'univers Ω : leur intersection est colorée en orange."
    >
      <rect x="10" y="10" width="380" height="220" rx="8" fill="#f8fafc" stroke="currentColor" strokeWidth="1.2" />
      <text x="22" y="30" fontWeight="700" fontSize="14" fill="currentColor">Ω</text>
      <clipPath id={clipId}>
        <circle cx="155" cy="125" r="70" />
      </clipPath>
      <circle cx="155" cy="125" r="70" fill={BLUE} fillOpacity="0.25" stroke={BLUE} strokeWidth="2" />
      <circle cx="245" cy="125" r="70" fill={GREEN} fillOpacity="0.25" stroke={GREEN} strokeWidth="2" />
      <circle cx="245" cy="125" r="70" fill={ORANGE} fillOpacity="0.55" clipPath={`url(#${clipId})`} />
      <text x="112" y="120" textAnchor="middle" fontWeight="700" fontSize="14" fill={BLUE}>A</text>
      <text x="112" y="138" textAnchor="middle" fill="currentColor">A \ B</text>
      <text x="200" y="120" textAnchor="middle" fontWeight="700" fill="currentColor">A ∩ B</text>
      <text x="288" y="120" textAnchor="middle" fontWeight="700" fontSize="14" fill={GREEN}>B</text>
      <text x="288" y="138" textAnchor="middle" fill="currentColor">B \ A</text>
      <text x="22" y="220" fill="currentColor">Hors de A ∪ B : complémentaire de A ∪ B</text>
    </FigureFrame>
  );
};

/** Fonctions d'activation usuelles : sigmoïde, tanh et ReLU. */
export const ActivationFunctions = () => {
  const area: PlotArea = { xMin: -4, xMax: 4, yMin: -1.5, yMax: 4 };
  const { sx, sy } = makeScales(area);
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const relu = (x: number) => Math.max(0, x);
  return (
    <FigureFrame
      title="Courbes de la sigmoïde, de la tangente hyperbolique et de la ReLU"
      caption="Trois fonctions d'activation : la sigmoïde reste entre 0 et 1, tanh entre −1 et 1, la ReLU est nulle puis croît linéairement."
    >
      <Axes {...area} xTicks={[-4, -2, 0, 2, 4]} yTicks={[-1, 0, 1, 2, 3, 4]} />
      <path d={linePath(relu, -4, 4, sx, sy)} fill="none" stroke={ORANGE} strokeWidth="2.5" />
      <path d={linePath(Math.tanh, -4, 4, sx, sy)} fill="none" stroke={GREEN} strokeWidth="2.5" />
      <path d={linePath(sigmoid, -4, 4, sx, sy)} fill="none" stroke={BLUE} strokeWidth="2.5" />
      <circle cx={sx(0)} cy={sy(0.5)} r="3.5" fill={BLUE} />
      <text x={sx(0) + 7} y={sy(0.5) + 14} fill={BLUE} fontWeight="600">σ(0) = 0,5</text>
      <g transform={`translate(${MARGIN.left + 10}, ${MARGIN.top + 6})`}>
        <rect width="118" height="52" rx="4" fill="#ffffff" fillOpacity="0.9" stroke={GRID} />
        <line x1="8" x2="26" y1="14" y2="14" stroke={BLUE} strokeWidth="2.5" />
        <text x="32" y="18" fill="currentColor">sigmoïde σ(x)</text>
        <line x1="8" x2="26" y1="28" y2="28" stroke={GREEN} strokeWidth="2.5" />
        <text x="32" y="32" fill="currentColor">tanh(x)</text>
        <line x1="8" x2="26" y1="42" y2="42" stroke={ORANGE} strokeWidth="2.5" />
        <text x="32" y="46" fill="currentColor">ReLU(x) = max(0, x)</text>
      </g>
    </FigureFrame>
  );
};

/** Dérivée : la tangente est la limite des sécantes. */
export const TangentLine = () => {
  const area: PlotArea = { xMin: -1, xMax: 3, yMin: -2, yMax: 9 };
  const { sx, sy } = makeScales(area);
  const f = (x: number) => x * x;
  return (
    <FigureFrame
      title="Parabole, sécante et tangente au point d'abscisse 1"
      caption="Pour f(x) = x², la sécante entre x = 1 et x = 2 a pour pente 3 ; en rapprochant les deux points, elle tend vers la tangente de pente 2 = f′(1)."
    >
      <Axes {...area} xTicks={[-1, 0, 1, 2, 3]} yTicks={[0, 2, 4, 6, 8]} />
      <path d={linePath(f, -1, 3, sx, sy)} fill="none" stroke={BLUE} strokeWidth="2.5" />
      <path d={linePath((x) => 3 * x - 2, 0.2, 2.6, sx, sy, 2)} fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="6 4" />
      <path d={linePath((x) => 2 * x - 1, 0, 2.6, sx, sy, 2)} fill="none" stroke={ORANGE} strokeWidth="2.5" />
      <circle cx={sx(1)} cy={sy(1)} r="4" fill={ORANGE} />
      <circle cx={sx(2)} cy={sy(4)} r="4" fill={GREEN} />
      <text x={sx(1) + 8} y={sy(1) + 14} fill={ORANGE} fontWeight="600">tangente : pente 2</text>
      <text x={sx(2) - 6} y={sy(4) - 8} textAnchor="end" fill={GREEN} fontWeight="600">sécante : pente 3</text>
      <text x={sx(-0.85)} y={sy(8.2)} fill={BLUE} fontWeight="600">f(x) = x²</text>
    </FigureFrame>
  );
};

/** Intégrale : limite de sommes de Riemann. */
export const RiemannSum = () => {
  const area: PlotArea = { xMin: -0.3, xMax: 3.3, yMin: -1, yMax: 10 };
  const { sx, sy } = makeScales(area);
  const f = (x: number) => x * x;
  const n = 6;
  const a = 0;
  const b = 3;
  const dx = (b - a) / n;
  const bars = Array.from({ length: n }, (_, i) => ({ x: a + i * dx, h: f(a + i * dx) }));
  const riemann = bars.reduce((sum, bar) => sum + bar.h * dx, 0);
  const exact = (b ** 3 - a ** 3) / 3;
  const fr = (v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 3 });
  return (
    <FigureFrame
      title="Aire sous la parabole approchée par une somme de Riemann"
      caption={`Six rectangles (somme de Riemann à gauche) approchent l'aire sous f(x) = x² entre 0 et 3 : ${fr(riemann)} contre ${fr(exact)} pour l'intégrale exacte.`}
    >
      <Axes {...area} xTicks={[0, 1, 2, 3]} yTicks={[0, 3, 6, 9]} />
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={sx(bar.x)}
          y={sy(bar.h)}
          width={sx(bar.x + dx) - sx(bar.x)}
          height={sy(0) - sy(bar.h)}
          fill={BLUE}
          fillOpacity="0.3"
          stroke={BLUE}
        />
      ))}
      <path d={linePath(f, 0, 3, sx, sy)} fill="none" stroke={ORANGE} strokeWidth="2.5" />
      <text x={sx(0.1)} y={sy(8.6)} fill="currentColor" fontWeight="600">Somme de Riemann (n = 6) = {fr(riemann)}</text>
      <text x={sx(0.1)} y={sy(7.4)} fill={ORANGE} fontWeight="600">∫₀³ x² dx = {fr(exact)}</text>
    </FigureFrame>
  );
};
