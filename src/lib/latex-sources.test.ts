import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import katex from "katex";

const SRC = path.resolve(__dirname, "..");

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
};

/**
 * Dans un attribut JSX entre guillemets, la barre oblique inverse n'est pas un échappement :
 * latex="\\frac{1}{2}" donne deux barres à KaTeX, qui affiche un saut de ligne suivi du mot « frac ».
 */
describe("formules KaTeX des cours", () => {
  const formulas: { file: string; latex: string }[] = [];
  for (const file of sourceFiles(SRC)) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/latex="([^"]*)"/g)) formulas.push({ file: path.relative(SRC, file), latex: match[1] });
  }

  it("en trouve beaucoup (le test regarde bien les sources)", () => {
    expect(formulas.length).toBeGreaterThan(100);
  });

  it("aucune formule ne commence une commande par une double barre oblique inverse", () => {
    const wrong = formulas.filter(({ latex }) => /\\\\[a-zA-Z]/.test(latex));
    expect(wrong.map((f) => `${f.file} : ${f.latex.slice(0, 60)}`)).toEqual([]);
  });

  it("aucune formule ne contient deux séparateurs de ligne collés (quatre barres obliques inverses), qui créent une ligne vide dans une matrice", () => {
    const wrong = formulas.filter(({ latex }) => latex.includes(String.fromCharCode(92).repeat(4)));
    expect(wrong.map((f) => `${f.file} : ${f.latex.slice(0, 60)}`)).toEqual([]);
  });

  it("toutes les formules se compilent, sans saut de ligne parasite en mode affichage", () => {
    const failures: string[] = [];
    for (const { file, latex } of formulas) {
      try {
        katex.renderToString(latex, {
          displayMode: true,
          throwOnError: true,
          strict: (code: string) => (code === "newLineInDisplayMode" ? "error" : "ignore"),
        });
      } catch (error) {
        failures.push(`${file} : ${latex.slice(0, 60)} -> ${error instanceof Error ? error.message.slice(0, 80) : error}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
