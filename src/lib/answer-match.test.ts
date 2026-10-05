import { describe, expect, it } from "vitest";
import { normalizeAnswer, sameAnswer } from "./answer-match";

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

  it("ne garde que le membre de droite", () => {
    expect(normalizeAnswer("a = b = 4x")).toBe("4x");
  });
});
