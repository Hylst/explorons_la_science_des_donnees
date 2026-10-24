// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

const sources = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });

describe("tranches Python lues par Tailwind", () => {
  // Tailwind lit `[-48:-24]` (une tranche Python d'une leçon) comme une propriété CSS arbitraire et émet la règle invalide
  // `-48: -24` (avertissement de minification). Chaque tranche à deux bornes qui commence par un nombre négatif doit être
  // bloquée ; `[-5:]` (sans seconde borne) ne produit aucune règle.
  // Ce fichier est lu par Tailwind lui aussi : ne pas écrire ici une tranche d'exemple non bloquée.
  it("chaque tranche négative à deux bornes du code source est dans le blocklist de tailwind.config.ts", () => {
    const config = fs.readFileSync(path.join(root, "tailwind.config.ts"), "utf8");
    const blocklist = config.match(/blocklist:\s*\[([^\]]*(?:\][^\]]*)*?)\],/)?.[1] ?? "";
    const slices = new Set<string>();
    for (const file of sources(path.join(root, "src"))) {
      for (const match of fs.readFileSync(file, "utf8").matchAll(/\[-\d+:-?\d+\]/g)) slices.add(match[0]);
    }
    expect(slices.size).toBeGreaterThan(0);
    const missing = [...slices].filter((slice) => !blocklist.includes(`"${slice}"`));
    expect(missing, "à ajouter au blocklist de tailwind.config.ts").toEqual([]);
  });
});
