import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * En JSX, un espace suivi d'un saut de ligne entre du texte et une balise disparaît :
 *   « ...fonctions de date par⏎<code>date()</code> » s'affiche « pardate() »,
 *   « <strong>Bayes :</strong>␣⏎Il nous dit » s'affiche « Bayes :Il nous dit ».
 * Il faut écrire {" "} en fin de ligne. Régression du 5 octobre 2026 (six passages touchés, vus dans le rendu).
 */
const SRC = path.resolve(process.cwd(), "src");
const INLINE_START = /^<(code|strong|em|b|i|a|Link|kbd|abbr)[\s>]/;

const files: string[] = [];
const walk = (dir: string) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith(".tsx") && !full.endsWith(".test.tsx")) files.push(full);
  }
};
walk(SRC);

export const findGluedWords = (source: string): string[] => {
  const lines = source.split(/\r?\n/);
  const found: string[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const raw = lines[i];
    const cur = raw.replace(/\s+$/, "");
    const next = lines[i + 1].trim();
    // « </strong>␣ » en fin de ligne (l'espace voulu) puis du texte : l'espace est perdu
    if (/<\/(code|strong|em|b|i|a|Link|kbd|abbr)>[ \t]+$/.test(raw) && /^[\p{L}\d(«]/u.test(next)) {
      found.push(`${i + 1}: ${cur.trim().slice(-40)} | ${next.slice(0, 40)}`);
      continue;
    }
    // du texte en fin de ligne puis une balise en ligne : les deux mots se collent
    if (!INLINE_START.test(next) || /^<\w+[^>]*>\s/.test(next)) continue;
    if (!/>[^<>{}]*[\p{L}\d,;:)»]$/u.test(cur) && !/^\s*[^<>{}=()[\];/*]+[\p{L}\d,;:)»]$/u.test(cur)) continue;
    if (/^\s*(\/\/|\*|import|const|let|return|if|case|export)\b/.test(cur)) continue;
    found.push(`${i + 1}: ${cur.trim().slice(-40)} | ${next.slice(0, 40)}`);
  }
  return found;
};

describe("espaces perdus en JSX", () => {
  it("le détecteur repère les deux formes du défaut", () => {
    expect(findGluedWords("        remplacez les fonctions de date par\n        <code>date()</code>")).toHaveLength(1);
    expect(findGluedWords("  <strong>Bayes :</strong> \n  Il nous dit")).toHaveLength(1);
    expect(findGluedWords('  <strong>Bayes :</strong>{" "}\n  Il nous dit')).toHaveLength(0);
    expect(findGluedWords('  par{" "}\n  <code>date()</code>')).toHaveLength(0);
  });

  it.each(files.map((f) => path.relative(SRC, f)))("%s", (rel) => {
    expect(findGluedWords(fs.readFileSync(path.join(SRC, rel), "utf8"))).toEqual([]);
  });
});
