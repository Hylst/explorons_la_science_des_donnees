import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SOURCE_URL } from "./site";

const root = path.resolve(process.cwd(), "src");
const listFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });

// Décision de l'auteur du 5 octobre 2026 : le code est publié, mais le site ne met aucun lien vers le dépôt ; il propose le code
// « sur demande » par la page Contact.
describe("lien vers le code source", () => {
  it("le site n'affiche aucune adresse de dépôt (SOURCE_URL reste vide)", () => {
    expect(SOURCE_URL).toBeNull();
  });

  it("aucune adresse du dépôt public n'est écrite dans le code du site", () => {
    const fautifs = listFiles(root)
      .filter((file) => /\.(ts|tsx|json)$/.test(file) && !/\.test\.(ts|tsx)$/.test(file))
      .filter((file) => /explorons_la_science_des_donnees/i.test(fs.readFileSync(file, "utf8")))
      .map((file) => path.relative(root, file));
    expect(fautifs).toEqual([]);
  });
});
