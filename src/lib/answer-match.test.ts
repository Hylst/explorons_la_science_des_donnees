import { describe, expect, it } from "vitest";
import { normalizeAnswer, parseExpression, sameAnswer } from "./answer-match";

describe("sameAnswer", () => {
  it("accepte l'expression seule comme la réponse complète", () => {
    expect(sameAnswer("6x+2", "f'(x) = 6x + 2")).toBe(true);
    expect(sameAnswer("f'(x)=6x+2", "f'(x) = 6x + 2")).toBe(true);
    expect(sameAnswer("6 x + 2", "f'(x) = 6x + 2")).toBe(true);
  });

  it("accepte ^2 pour ², et la multiplication explicite", () => {
    expect(sameAnswer("3x^2-6x+1", "g'(x) = 3x² - 6x + 1")).toBe(true);
    expect(sameAnswer("2*x*cos(x^2)", "h'(x) = 2x cos(x²)")).toBe(true);
  });

  it("refuse une mauvaise réponse et une réponse vide", () => {
    expect(sameAnswer("6x+3", "f'(x) = 6x + 2")).toBe(false);
    expect(sameAnswer("3x^2-6x-1", "g'(x) = 3x² - 6x + 1")).toBe(false);
    expect(sameAnswer("", "f'(x) = 6x + 2")).toBe(false);
    expect(sameAnswer("f'(x) =", "f'(x) = 6x + 2")).toBe(false);
  });

  it("n'accepte jamais une réponse vide, même si la réponse attendue se réduit aussi à rien", () => {
    // sans la garde « given !== "" », deux chaînes vides seraient égales et une case laissée vide serait notée juste
    expect(sameAnswer("", "f'(x) =")).toBe(false);
    expect(sameAnswer("   ", "")).toBe(false);
    expect(sameAnswer("g(x) =", "f'(x) =")).toBe(false);
  });

  it("accepte une forme équivalente (ordre des facteurs, forme non développée)", () => {
    expect(sameAnswer("cos(x²)·2x", "h'(x) = 2x cos(x²)")).toBe(true);
    expect(sameAnswer("2x(x-3)+(x²+1)", "g'(x) = 3x² - 6x + 1")).toBe(true);
    expect(sameAnswer("-6x+3x²+1", "g'(x) = 3x² - 6x + 1")).toBe(true);
    expect(sameAnswer("2+6x", "f'(x) = 6x + 2")).toBe(true);
    expect(sameAnswer("2(3x+1)", "f'(x) = 6x + 2")).toBe(true);
  });

  it("refuse une forme proche mais fausse", () => {
    expect(sameAnswer("2x sin(x²)", "h'(x) = 2x cos(x²)")).toBe(false);
    expect(sameAnswer("cos(x²)", "h'(x) = 2x cos(x²)")).toBe(false);
    expect(sameAnswer("2x(x-3)+(x²-1)", "g'(x) = 3x² - 6x + 1")).toBe(false);
    expect(sameAnswer("-6x^2+2", "f'(x) = 6x + 2")).toBe(false);
  });

  it("lit les puissances, le moins unaire et les fonctions comme on les écrit", () => {
    expect(parseExpression("-x^2")?.(3)).toBe(-9);
    expect(parseExpression("2^3^2")?.(0)).toBe(512);
    expect(parseExpression("x/2x")?.(4)).toBe(8);
    expect(parseExpression("exp(0)+ln(e)")?.(0)).toBe(2);
    expect(parseExpression("2x cos(x^2)")?.(0)).toBe(0);
    expect(parseExpression("2x cos(")).toBeNull();
    expect(parseExpression("y+1")).toBeNull();
  });

  it("ne garde que le membre de droite", () => {
    expect(normalizeAnswer("a = b = 4x")).toBe("4x");
  });
});
