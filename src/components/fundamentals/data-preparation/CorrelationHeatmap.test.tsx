import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CorrelationHeatmap from "./CorrelationHeatmap";

// Le coefficient de Pearson n'est pas exporté : on le teste à travers la matrice affichée par le composant.
const VARIABLES = ["Montant", "Quantité", "Âge", "Durée séjour", "Prix", "Volume"];

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(createElement(CorrelationHeatmap)));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

/** Matrice 6 x 6 lue dans les cellules affichées (texte à deux décimales, comme le visiteur la voit) */
const readMatrix = (): number[][] => {
  const cells = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label*=" et "]')];
  expect(cells).toHaveLength(VARIABLES.length ** 2);
  const values = cells.map((cell) => Number(cell.textContent));
  return VARIABLES.map((_, i) => values.slice(i * VARIABLES.length, (i + 1) * VARIABLES.length));
};

describe("CorrelationHeatmap : matrice de corrélation calculée", () => {
  it("affiche une cellule par couple de variables, avec un nombre fini", () => {
    const matrix = readMatrix();
    for (const row of matrix) for (const value of row) expect(Number.isFinite(value)).toBe(true);
  });

  it("la diagonale vaut exactement 1 : une variable est parfaitement corrélée à elle-même", () => {
    const matrix = readMatrix();
    VARIABLES.forEach((_, i) => expect(matrix[i][i]).toBe(1));
  });

  it("la matrice est symétrique", () => {
    const matrix = readMatrix();
    for (let i = 0; i < VARIABLES.length; i++) {
      for (let j = 0; j < VARIABLES.length; j++) expect(matrix[i][j]).toBe(matrix[j][i]);
    }
  });

  it("tous les coefficients sont compris entre -1 et 1", () => {
    for (const row of readMatrix()) for (const value of row) expect(Math.abs(value)).toBeLessThanOrEqual(1);
  });

  it("retrouve les liens construits dans le jeu d'exemple : montant et quantité fortement positifs", () => {
    expect(readMatrix()[0][1]).toBeGreaterThan(0.8);
  });

  it("retrouve les liens construits dans le jeu d'exemple : prix et volume négatifs", () => {
    expect(readMatrix()[4][5]).toBeLessThan(-0.5);
  });

  it("retrouve les liens construits dans le jeu d'exemple : âge et durée de séjour modérément positifs", () => {
    const r = readMatrix()[2][3];
    expect(r).toBeGreaterThan(0.3);
    expect(r).toBeLessThan(0.85);
  });

  it("des variables générées indépendamment restent faiblement corrélées", () => {
    const matrix = readMatrix();
    expect(Math.abs(matrix[0][2])).toBeLessThan(0.3); // montant et âge
    expect(Math.abs(matrix[1][4])).toBeLessThan(0.3); // quantité et prix
  });

  it("annonce le signe dans le libellé accessible, avec le vrai signe moins pour les valeurs négatives", () => {
    const negative = container.querySelector<HTMLButtonElement>('button[aria-label^="Prix et Volume"]');
    const positive = container.querySelector<HTMLButtonElement>('button[aria-label^="Montant et Quantité"]');
    expect(negative?.getAttribute("aria-label")).toMatch(/^Prix et Volume : −0\.\d\d$/);
    expect(positive?.getAttribute("aria-label")).toMatch(/^Montant et Quantité : \+0\.\d\d$/);
  });

  it("liste les trois corrélations les plus fortes, par valeur absolue décroissante, hors diagonale", () => {
    const items = [...container.querySelectorAll("ul li")].map((li) => li.textContent ?? "");
    expect(items).toHaveLength(3);
    const parsed = items.map((text) => {
      const [pair, value] = [text.match(/^(.*?)\s*[+−]\d/)?.[1] ?? "", text.match(/([+−])(\d\.\d\d)$/)];
      const [a, b] = pair.split(" ↔ ");
      return { a, b, abs: Number(value?.[2]) };
    });
    for (const { a, b } of parsed) {
      expect(VARIABLES).toContain(a);
      expect(VARIABLES).toContain(b);
      expect(a).not.toBe(b);
    }
    expect(parsed[0].abs).toBeGreaterThanOrEqual(parsed[1].abs);
    expect(parsed[1].abs).toBeGreaterThanOrEqual(parsed[2].abs);
    // Le plus fort écart à zéro de toute la matrice hors diagonale est bien en tête
    const matrix = readMatrix();
    const offDiagonal = matrix.flatMap((row, i) => row.filter((_, j) => j > i)).map(Math.abs);
    expect(parsed[0].abs).toBeCloseTo(Math.max(...offDiagonal), 2);
  });

  it("un clic sur une cellule met à jour la sélection avec la valeur de cette cellule", () => {
    const cell = container.querySelector<HTMLButtonElement>('button[aria-label^="Prix et Volume"]');
    expect(cell).not.toBeNull();
    act(() => cell?.click());
    const summary = container.querySelector("[aria-live]")?.textContent ?? "";
    expect(summary).toContain("Prix");
    expect(summary).toContain("Volume");
    expect(summary).toContain(`r = −${Math.abs(readMatrix()[4][5]).toFixed(2)}`);
    expect(cell?.getAttribute("aria-pressed")).toBe("true");
  });

  it("la sélection d'une case diagonale rappelle qu'une variable est toujours parfaitement corrélée à elle-même", () => {
    const cell = container.querySelector<HTMLButtonElement>('button[aria-label^="Âge et Âge"]');
    act(() => cell?.click());
    expect(container.querySelector("[aria-live]")?.textContent).toContain("r = +1.00");
    expect(container.querySelector("[aria-live]")?.textContent).toContain("parfaitement corrélée à elle-même");
  });
});
