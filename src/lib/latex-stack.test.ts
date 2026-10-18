import katex from "katex";
import { describe, expect, it } from "vitest";
import { stackLatex } from "./latex-stack";

const G = (...lines: string[]) => `\\begin{gathered}${lines.join(" \\\\[0.6em] ")}\\end{gathered}`;

describe("stackLatex", () => {
  it("met chaque partie séparée par \\qquad sur sa ligne", () => {
    expect(stackLatex(String.raw`Q = X\,W^{Q} \qquad K = X\,W^{K} \qquad V = X\,W^{V}`)).toBe(G(String.raw`Q = X\,W^{Q}`, String.raw`K = X\,W^{K}`, String.raw`V = X\,W^{V}`));
  });

  it("compte plusieurs \\qquad à la suite comme une seule séparation", () => {
    expect(stackLatex(String.raw`y_t = T_t + S_t \qquad\qquad  \qquad y_t = T_t \times S_t`)).toBe(G("y_t = T_t + S_t", String.raw`y_t = T_t \times S_t`));
  });

  it("colle un mot de liaison au début de la partie suivante", () => {
    expect(stackLatex(String.raw`d = \frac{a}{s_p} \qquad\text{avec}\qquad s_p = \sqrt{v}`)).toBe(G(String.raw`d = \frac{a}{s_p}`, String.raw`\text{avec}\; s_p = \sqrt{v}`));
    expect(stackLatex(String.raw`a = b \qquad\Longrightarrow\qquad c = d`)).toBe(G("a = b", String.raw`\Longrightarrow\; c = d`));
  });

  it("met un texte final sur sa propre ligne", () => {
    expect(stackLatex(String.raw`a = b \qquad c = d \qquad \text{(exemple)}`)).toBe(G("a = b", "c = d", String.raw`\text{(exemple)}`));
    expect(stackLatex(String.raw`n \approx \frac{2}{d^2} \qquad\text{individus par groupe}`)).toBe(G(String.raw`n \approx \frac{2}{d^2}`, String.raw`\text{individus par groupe}`));
  });

  it("ne coupe pas à l'intérieur d'accolades, d'un environnement ou de \\left ... \\right", () => {
    expect(stackLatex(String.raw`\text{a \qquad b} = 1`)).toBeNull();
    expect(stackLatex(String.raw`\begin{cases} 1 \qquad x \end{cases}`)).toBeNull();
    expect(stackLatex(String.raw`\left( a \qquad b \right) = 1`)).toBeNull();
    expect(stackLatex(String.raw`x^{(\lambda)} = \begin{cases} a & b \\ c & d \end{cases} \qquad (x>0)`)).toBe(G(String.raw`x^{(\lambda)} = \begin{cases} a & b \\ c & d \end{cases}`, "(x>0)"));
  });

  it("ne confond pas \\leftarrow avec \\left, ni \\qquadx avec \\qquad", () => {
    expect(stackLatex(String.raw`w \leftarrow w - 1, \qquad b \leftarrow b`)).toBe(G(String.raw`w \leftarrow w - 1,`, String.raw`b \leftarrow b`));
    expect(stackLatex(String.raw`a \qquadx b`)).toBeNull();
  });

  it("renvoie null quand il n'y a qu'une partie", () => {
    expect(stackLatex(String.raw`\int_a^b f(x)\,dx = F(b) - F(a)`)).toBeNull();
    expect(stackLatex(String.raw`\qquad a = b \qquad`)).toBeNull();
    expect(stackLatex(String.raw`a \quad b`)).toBeNull();
  });

  it("produit une formule que KaTeX compile", () => {
    const s = stackLatex(String.raw`\mathbb{P}\!\left(\text{rejeter } H_0 \;\middle|\; d\right) \qquad\text{avec}\qquad \lambda = d\sqrt{\frac{n}{2}}`);
    expect(s).not.toBeNull();
    expect(() => katex.renderToString(s as string, { throwOnError: true, displayMode: true })).not.toThrow();
  });
});
