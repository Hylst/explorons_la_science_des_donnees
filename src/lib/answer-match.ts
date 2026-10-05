/**
 * Met une réponse libre (expression mathématique) sous une forme comparable :
 * membre de droite seulement, sans espaces, « ² » écrit « ^2 », multiplication implicite.
 * « 6x+2 », « f'(x) = 6x + 2 » et « 6 x + 2 » donnent la même forme.
 */
export const normalizeAnswer = (text: string): string => {
  const right = text.includes("=") ? text.slice(text.lastIndexOf("=") + 1) : text;
  return right
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/[×·*]/g, "");
};

type Fn = (x: number) => number;

const FUNCTIONS: Record<string, (v: number) => number> = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log,
};
const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };
// essayés du plus long au plus court : « exp » avant « e », « xcos » se lit x puis cos
const NAMES = [...Object.keys(FUNCTIONS), ...Object.keys(CONSTANTS), "x"].sort((a, b) => b.length - a.length);

type Token = { kind: "num"; value: number } | { kind: "name"; value: string } | { kind: "op"; value: string };

const tokenize = (text: string): Token[] | null => {
  const src = text
    .toLowerCase()
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/[×·]/g, "*")
    .replace(/[−–]/g, "-")
    .replace(/\s/g, "");
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/[0-9.,]/.test(ch)) {
      let j = i;
      while (j < src.length && /[0-9.,]/.test(src[j])) j++;
      const value = Number(src.slice(i, j).replace(",", "."));
      if (Number.isNaN(value)) return null;
      tokens.push({ kind: "num", value });
      i = j;
    } else if (/[a-z]/.test(ch)) {
      const name = NAMES.find((n) => src.startsWith(n, i));
      if (!name) return null;
      tokens.push({ kind: "name", value: name });
      i += name.length;
    } else if ("+-*/^()".includes(ch)) {
      tokens.push({ kind: "op", value: ch });
      i++;
    } else {
      return null;
    }
  }
  return tokens;
};

/**
 * Lit une expression d'une variable x (+, -, *, /, ^, parenthèses, produit implicite comme « 2x cos(x^2) »,
 * sqrt, sin, cos, tan, exp, ln, e, pi). Renvoie null si le texte n'est pas une expression lisible.
 */
export const parseExpression = (text: string): Fn | null => {
  const tokens = tokenize(text);
  if (!tokens || tokens.length === 0) return null;
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (value: string) => peek()?.kind === "op" && peek()?.value === value;
  const startsAtom = () => {
    const t = peek();
    return !!t && (t.kind === "num" || t.kind === "name" || (t.kind === "op" && t.value === "("));
  };

  const expr = (): Fn => {
    let left = term();
    while (isOp("+") || isOp("-")) {
      const op = tokens[pos++].value;
      const a = left;
      const b = term();
      left = op === "+" ? (x) => a(x) + b(x) : (x) => a(x) - b(x);
    }
    return left;
  };
  const term = (): Fn => {
    let left = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = tokens[pos++].value;
        const a = left;
        const b = unary();
        left = op === "*" ? (x) => a(x) * b(x) : (x) => a(x) / b(x);
      } else if (startsAtom()) {
        const a = left;
        const b = power();
        left = (x) => a(x) * b(x);
      } else {
        return left;
      }
    }
  };
  const unary = (): Fn => {
    if (isOp("-")) {
      pos++;
      const a = unary();
      return (x) => -a(x);
    }
    if (isOp("+")) {
      pos++;
      return unary();
    }
    return power();
  };
  const power = (): Fn => {
    const base = atom();
    if (isOp("^")) {
      pos++;
      const exponent = unary();
      return (x) => Math.pow(base(x), exponent(x));
    }
    return base;
  };
  const atom = (): Fn => {
    const t = tokens[pos++];
    if (!t) throw new Error("fin inattendue");
    if (t.kind === "num") return () => t.value;
    if (t.kind === "name") {
      if (t.value === "x") return (x) => x;
      if (t.value in CONSTANTS) return () => CONSTANTS[t.value];
      const f = FUNCTIONS[t.value];
      const arg = power();
      return (x) => f(arg(x));
    }
    if (t.value === "(") {
      const inner = expr();
      if (!isOp(")")) throw new Error("parenthèse non fermée");
      pos++;
      return inner;
    }
    throw new Error(`symbole inattendu ${t.value}`);
  };

  try {
    const fn = expr();
    return pos === tokens.length ? fn : null;
  } catch {
    return null;
  }
};

const SAMPLES = [0.3, 0.7, 1.1, 1.9, 2.6, -0.8];

/**
 * Deux expressions en x sont jugées égales si elles prennent la même valeur en plusieurs points :
 * « cos(x²)·2x » vaut « 2x cos(x²) », « 2x(x-3) + (x²+1) » vaut « 3x² - 6x + 1 ».
 */
const sameValues = (a: Fn, b: Fn): boolean => {
  let compared = 0;
  for (const x of SAMPLES) {
    const va = a(x);
    const vb = b(x);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    compared++;
    if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va), Math.abs(vb))) return false;
  }
  return compared >= 3;
};

const rightSide = (text: string) => (text.includes("=") ? text.slice(text.lastIndexOf("=") + 1) : text);

/**
 * Vrai si la réponse est juste. Les expressions en x sont comparées par leurs valeurs (une forme équivalente est acceptée) ;
 * sinon on compare le texte normalisé.
 */
export const sameAnswer = (answer: string, expected: string): boolean => {
  const given = normalizeAnswer(answer);
  if (given === "") return false;
  const a = parseExpression(rightSide(answer));
  const b = parseExpression(rightSide(expected));
  if (a && b) return sameValues(a, b);
  return given === normalizeAnswer(expected);
};
