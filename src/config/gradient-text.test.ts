import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.resolve(process.cwd(), "src/index.css"), "utf8").replace(/\r\n/g, "\n");

describe("textes à dégradé (background-clip: text)", () => {
  // Le dégradé est peint dans la boîte de ligne : avec un interligne serré (text-4xl = 1,11 ; text-5xl = 1) les lettres basses
  // (g, p, q, y) sont rognées. Constaté le 5 octobre 2026 sur « Introduction au Machine Learning » (text-5xl).
  // jsdom ne calcule pas la mise en page : on garde donc la règle globale qui impose un interligne minimal.
  const rule = css.match(/\.bg-clip-text\.text-transparent[^{]*\{([^}]*)\}/);

  it("une règle globale impose un interligne d'au moins 1,2 aux textes à dégradé", () => {
    expect(rule, "règle .bg-clip-text.text-transparent absente de src/index.css").not.toBeNull();
    const lineHeight = Number(rule?.[1].match(/line-height:\s*([\d.]+)\s*;/)?.[1]);
    expect(lineHeight).toBeGreaterThanOrEqual(1.2);
  });

  it("la règle couvre aussi les classes de composant qui appliquent le dégradé par @apply", () => {
    const selectors = css.match(/(\.bg-clip-text\.text-transparent[^{]*)\{/)?.[1] ?? "";
    const applied = [...css.matchAll(/\.([a-z-]+)\s*\{[^}]*@apply[^;]*bg-clip-text[^;]*;/g)].map((m) => m[1]);
    expect(applied.length).toBeGreaterThan(0);
    for (const name of applied) expect(selectors, `.${name} n'a pas l'interligne minimal`).toContain(`.${name}`);
  });
});
