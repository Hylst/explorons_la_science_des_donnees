/**
 * Version empilée d'une formule faite de plusieurs parties posées côte à côte avec `\qquad`
 * (« a = b \qquad c = d »), pour les écrans étroits : chaque partie va sur sa ligne.
 *
 * Seuls les `\qquad` du niveau supérieur comptent : pas ceux qui sont entre accolades,
 * dans un environnement (`\begin{cases}`...) ou entre `\left` et `\right`. Une partie qui n'est
 * qu'un mot de liaison (`\text{avec}`, `\Longrightarrow`...) est collée au début de la suivante.
 * Renvoie `null` quand il n'y a rien à empiler.
 */
export function stackLatex(latex: string): string | null {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  while (i < latex.length) {
    const c = latex[i];
    if (c === "\\") {
      const name = /^\\([A-Za-z]+)/.exec(latex.slice(i))?.[1];
      if (!name) {
        i += 2; // \{ \} \, \; \\ ... : le caractère suivant n'ouvre ni ne ferme rien
        continue;
      }
      if (name === "begin" || name === "left") depth += 1;
      else if (name === "end" || name === "right") depth -= 1;
      else if (name === "qquad" && depth === 0) {
        parts.push(latex.slice(start, i));
        i += name.length + 1;
        // plusieurs \qquad à la suite ne font qu'une séparation
        for (let m = /^\s*\\qquad(?![A-Za-z])/.exec(latex.slice(i)); m; m = /^\s*\\qquad(?![A-Za-z])/.exec(latex.slice(i))) i += m[0].length;
        start = i;
        continue;
      }
      i += name.length + 1;
      continue;
    }
    if (c === "{") depth += 1;
    else if (c === "}") depth -= 1;
    i += 1;
  }
  parts.push(latex.slice(start));
  const lines: string[] = [];
  let pending = "";
  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    if (isConnector(part)) {
      pending = pending ? `${pending}\\; ${part}` : part;
      continue;
    }
    lines.push(pending ? `${pending}\\; ${part}` : part);
    pending = "";
  }
  // un texte final (« individus par groupe », « (niveau de confiance) ») prend sa propre ligne
  if (pending) lines.push(pending);
  if (lines.length < 2) return null;
  return `\\begin{gathered}${lines.join(" \\\\[0.6em] ")}\\end{gathered}`;
}

/** Une partie qui ne contient que du texte ou une flèche : « avec », « soit », « ⟹ »... */
function isConnector(part: string): boolean {
  const rest = part.replace(/\\text\{[^{}]*\}/g, "").replace(/\\(?:Longrightarrow|Rightarrow|iff|implies)(?![A-Za-z])/g, "");
  return rest.trim() === "";
}
