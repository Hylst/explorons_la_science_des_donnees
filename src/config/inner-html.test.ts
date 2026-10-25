// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

const sources = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    return /\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name) ? [full] : [];
  });

// HTML injecté sans passer par sanitizeHtml : le CSS du composant shadcn et le rendu KaTeX de formules écrites dans le code
const EXCEPTIONS = ["components/ui/chart.tsx", "components/courses/katex-math.tsx"];

describe("HTML injecté (dangerouslySetInnerHTML)", () => {
  it("passe par sanitizeHtml, sauf les exceptions listées", () => {
    const found: string[] = [];
    const wrong: string[] = [];
    for (const file of sources(SRC)) {
      const rel = path.relative(SRC, file).split(path.sep).join("/");
      for (const match of fs.readFileSync(file, "utf8").matchAll(/dangerouslySetInnerHTML=\{\{\s*__html:\s*([^}]*)\}\}/g)) {
        found.push(rel);
        if (!EXCEPTIONS.includes(rel) && !match[1].trim().startsWith("sanitizeHtml(")) wrong.push(`${rel} : ${match[1].trim().slice(0, 60)}`);
      }
    }
    expect(found.length).toBeGreaterThan(1);
    expect(wrong).toEqual([]);
  });
});
