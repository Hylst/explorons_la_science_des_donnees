/** Sommes de Riemann et méthode des trapèzes, pour la figure interactive de la page « Calcul intégral » */

export type RiemannMethod = "gauche" | "droite" | "milieu" | "trapezes";

export interface RiemannFunction {
  id: string;
  /** Libellé du bouton */
  label: string;
  f: (x: number) => number;
  a: number;
  b: number;
  /** Valeur exacte de l'intégrale sur [a, b] (vérifiée par riemann.test.ts) */
  exact: number;
  /** Haut de l'axe vertical de la figure */
  yMax: number;
}

const densiteNormale = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);

export const RIEMANN_FUNCTIONS: RiemannFunction[] = [
  { id: "carre", label: "x² sur [0, 3]", f: (x) => x * x, a: 0, b: 3, exact: 9, yMax: 9.5 },
  { id: "sinus", label: "sin x sur [0, π]", f: Math.sin, a: 0, b: Math.PI, exact: 2, yMax: 1.1 },
  // P(−2 ≤ Z ≤ 2) pour la loi normale centrée réduite : norm.cdf(2) − norm.cdf(−2) (SciPy)
  { id: "normale", label: "densité normale sur [−2, 2]", f: densiteNormale, a: -2, b: 2, exact: 0.9544997361036416, yMax: 0.45 },
];

/** Point où l'on évalue f dans la tranche i (rectangles) */
const samplePoint = (method: Exclude<RiemannMethod, "trapezes">, left: number, h: number) =>
  method === "gauche" ? left : method === "droite" ? left + h : left + h / 2;

/** Approximation de l'intégrale de f sur [a, b] avec n tranches */
export const approximate = (f: (x: number) => number, a: number, b: number, n: number, method: RiemannMethod): number => {
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const left = a + i * h;
    sum += method === "trapezes" ? (f(left) + f(left + h)) / 2 : f(samplePoint(method, left, h));
  }
  return sum * h;
};

/** Formes à dessiner : pour chaque tranche, les quatre coins (x, y) du rectangle ou du trapèze */
export const shapes = (f: (x: number) => number, a: number, b: number, n: number, method: RiemannMethod): [number, number][][] => {
  const h = (b - a) / n;
  return Array.from({ length: n }, (_, i) => {
    const left = a + i * h;
    const right = left + h;
    if (method === "trapezes") return [[left, 0], [left, f(left)], [right, f(right)], [right, 0]];
    const y = f(samplePoint(method, left, h));
    return [[left, 0], [left, y], [right, y], [right, 0]];
  });
};
