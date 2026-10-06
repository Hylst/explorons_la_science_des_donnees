import { describe, expect, it } from "vitest";
import { frenchSpacing } from "./typography";

const NBSP = " ";

describe("typographie française des leçons", () => {
  it("rend insécable l'espace avant : ; ? ! % et à l'intérieur des guillemets", () => {
    expect(frenchSpacing("environ 12 %")).toBe(`environ 12${NBSP}%`);
    expect(frenchSpacing("Attention : le WHERE")).toBe(`Attention${NBSP}: le WHERE`);
    expect(frenchSpacing("« bonjour »")).toBe(`«${NBSP}bonjour${NBSP}»`);
    expect(frenchSpacing("Vraiment ? Oui !")).toBe(`Vraiment${NBSP}? Oui${NBSP}!`);
  });

  it("ne touche jamais au code, en ligne ou en bloc", () => {
    expect(frenchSpacing("le code `x = {a : 1}` reste tel quel")).toBe("le code `x = {a : 1}` reste tel quel");
    const bloc = "Texte :\n```\nprint('a : b')\n```\nFin !";
    expect(frenchSpacing(bloc)).toBe(`Texte${NBSP}:\n\`\`\`\nprint('a : b')\n\`\`\`\nFin${NBSP}!`);
  });
});
