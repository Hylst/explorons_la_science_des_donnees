import { describe, expect, it } from "vitest";
import { approximate, RIEMANN_FUNCTIONS, shapes, type RiemannMethod } from "./riemann";

const fn = (id: string) => {
  const found = RIEMANN_FUNCTIONS.find((r) => r.id === id);
  if (!found) throw new Error(id);
  return found;
};
const err = (id: string, n: number, method: RiemannMethod) => {
  const { f, a, b, exact } = fn(id);
  return Math.abs(approximate(f, a, b, n, method) - exact);
};

describe("sommes de Riemann", () => {
  it("x² sur [0, 3] avec 6 tranches : valeurs calculées à la main", () => {
    const { f, a, b } = fn("carre");
    expect(approximate(f, a, b, 6, "gauche")).toBeCloseTo(6.875, 12);
    expect(approximate(f, a, b, 6, "droite")).toBeCloseTo(11.375, 12);
    expect(approximate(f, a, b, 6, "milieu")).toBeCloseTo(8.9375, 12);
    expect(approximate(f, a, b, 6, "trapezes")).toBeCloseTo(9.125, 12);
  });

  it("valeurs exactes déclarées : confirmées par une méthode de Simpson très fine", () => {
    for (const { f, a, b, exact } of RIEMANN_FUNCTIONS) {
      const n = 2000;
      const h = (b - a) / n;
      let s = f(a) + f(b);
      for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
      expect((s * h) / 3).toBeCloseTo(exact, 10);
    }
  });

  it("ordre des méthodes affiché par la figure : erreur divisée par 2 (gauche) et par 4 (milieu, trapèzes) quand n double", () => {
    expect(err("carre", 10, "gauche") / err("carre", 20, "gauche")).toBeCloseTo(2, 1);
    for (const id of ["carre", "sinus", "normale"]) {
      expect(err(id, 10, "milieu") / err(id, 20, "milieu")).toBeCloseTo(4, 1);
      expect(err(id, 10, "trapezes") / err(id, 20, "trapezes")).toBeCloseTo(4, 1);
    }
    // le point milieu fait environ deux fois mieux que les trapèzes, en sens opposé
    expect(err("sinus", 20, "trapezes") / err("sinus", 20, "milieu")).toBeCloseTo(2, 1);
  });

  it("quand f(a) = f(b), rectangles à gauche, à droite et trapèzes donnent le même résultat (texte de la figure)", () => {
    for (const id of ["sinus", "normale"]) {
      const { f, a, b } = fn(id);
      expect(approximate(f, a, b, 7, "gauche")).toBeCloseTo(approximate(f, a, b, 7, "trapezes"), 12);
      expect(approximate(f, a, b, 7, "droite")).toBeCloseTo(approximate(f, a, b, 7, "trapezes"), 12);
    }
  });

  it("formes : une par tranche, de l'axe à la hauteur de la méthode", () => {
    const { f, a, b } = fn("carre");
    const rects = shapes(f, a, b, 3, "droite");
    expect(rects).toHaveLength(3);
    expect(rects[0]).toEqual([[0, 0], [0, 1], [1, 1], [1, 0]]);
    expect(shapes(f, a, b, 3, "trapezes")[2]).toEqual([[2, 0], [2, 4], [3, 9], [3, 0]]);
  });
});
