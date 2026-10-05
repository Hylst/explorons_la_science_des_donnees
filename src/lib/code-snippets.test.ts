import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (/\.(tsx|ts)$/.test(full) && !full.endsWith(".test.ts") && !full.endsWith(".test.tsx")) out.push(full);
  }
  return out;
};

/**
 * Dans un gabarit TypeScript (`...`), un \n simple devient un vrai saut de ligne : l'exemple Python affiché
 * contient alors print("<saut de ligne>texte"), qui est une erreur de syntaxe pour qui le copie.
 * Il faut écrire \\n dans les sources.
 */
describe("exemples Python affichés dans les cours", () => {
  it("aucune ligne print(...) ne contient un \\n ou \\t simple dans un gabarit", () => {
    const fautifs: string[] = [];
    for (const file of sourceFiles(SRC)) {
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (/\bprint\(/.test(line) && /(?<!\\)\\[nt]/.test(line)) fautifs.push(`${path.relative(SRC, file)}:${index + 1}`);
        });
    }
    expect(fautifs).toEqual([]);
  });

  it("aucune ligne ne se termine par une barre oblique inverse seule (dans un gabarit, elle fusionne la ligne suivante avec celle-ci)", () => {
    const fautifs: string[] = [];
    for (const file of sourceFiles(SRC)) {
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (/(?<!\\)\\\r?$/.test(line)) fautifs.push(`${path.relative(SRC, file)}:${index + 1}`);
        });
    }
    expect(fautifs).toEqual([]);
  });

  it("aucun exemple pandas n'utilise un alias ou un argument supprimé de pandas 3 (le moteur du site exécute pandas 3)", () => {
    const fautifs: string[] = [];
    const supprime = /freq ?= ?['"][0-9]*(M|Q|Y|A|H|T|S|BM|BQ)['"]|resample\(['"][0-9]*(M|Q|Y|A|H|T|S)['"]\)|fillna\(method/;
    for (const file of sourceFiles(SRC)) {
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (supprime.test(line)) fautifs.push(`${path.relative(SRC, file)}:${index + 1}`);
        });
    }
    expect(fautifs).toEqual([]);
  });
});
