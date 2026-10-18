import type { LessonSection } from "@/lib/lessons/types";
import { lines } from "@/data/lessons/lines";

/**
 * Exemples exécutables et exercices vérifiés de la page « Calcul intégral » (/fundamentals/math-stats/integral-calculus).
 * Chaque nombre cité dans une légende de la page est calculé par ce code et vérifié par integral-demos.test.ts
 * (moteur du site : Pyodide, NumPy et SciPy, sans réseau).
 */

type ExerciseSection = Extract<LessonSection, { kind: "exercise" }>;

/** Vérifier une primitive : F(b) − F(a) comparé à une intégration numérique */
export const VERIFIER_PRIMITIVES = lines(
  "import numpy as np",
  "from scipy import integrate",
  "",
  "# Chaque technique donne une primitive F : on la vérifie en comparant F(b) - F(a) à un calcul numérique",
  "cas = [",
  "    (\"substitution\", lambda x: 2 * x * (x ** 2 + 1) ** 3, lambda x: (x ** 2 + 1) ** 4 / 4, 0, 1),",
  "    (\"par parties\", lambda x: x * np.exp(x), lambda x: (x - 1) * np.exp(x), 0, 1),",
  "    (\"fractions partielles\", lambda x: 1 / (x ** 2 - 1), lambda x: 0.5 * np.log(abs((x - 1) / (x + 1))), 2, 3),",
  "]",
  "for nom, f, F, a, b in cas:",
  "    numerique, erreur = integrate.quad(f, a, b)",
  "    print(f\"{nom} : F(b) - F(a) = {F(b) - F(a):.6f}, quad = {numerique:.6f}\")",
  "",
  "# Une primitive fausse se voit tout de suite : oublier le terme - eˣ de l'intégration par parties",
  "faux = lambda x: x * np.exp(x)",
  "print(f\"primitive fausse x·eˣ : {faux(1) - faux(0):.6f} au lieu de {integrate.quad(cas[1][1], 0, 1)[0]:.6f}\")",
);

/** Point milieu, trapèzes et Simpson : erreur selon le nombre de tranches */
export const METHODES_NUMERIQUES = lines(
  "import numpy as np",
  "from scipy import integrate",
  "",
  "f, a, b, exact = np.sin, 0.0, np.pi, 2.0",
  "print(\"  n   point milieu     trapèzes      Simpson\")",
  "for n in [4, 8, 16, 32]:",
  "    x = np.linspace(a, b, n + 1)",
  "    h = (b - a) / n",
  "    milieu = h * np.sum(f(x[:-1] + h / 2))",
  "    trapezes = integrate.trapezoid(f(x), x)",
  "    simpson = integrate.simpson(f(x), x=x)",
  "    print(f\"{n:3d}   {abs(milieu - exact):.2e}     {abs(trapezes - exact):.2e}     {abs(simpson - exact):.2e}\")",
  "",
  "valeur, erreur = integrate.quad(f, a, b)",
  "print(f\"quad : {valeur:.12f} (erreur estimée {erreur:.1e})\")",
);

/** Intégrales impropres : loi exponentielle, intégrale de Gauss, 1/x contre 1/x² */
export const INTEGRALES_IMPROPRES = lines(
  "import numpy as np",
  "from scipy import integrate",
  "",
  "lam = 0.5",
  "densite = lambda x: lam * np.exp(-lam * x)",
  "print(\"aire totale :\", round(integrate.quad(densite, 0, np.inf)[0], 6))",
  "esperance = integrate.quad(lambda x: x * densite(x), 0, np.inf)[0]",
  "variance = integrate.quad(lambda x: (x - esperance) ** 2 * densite(x), 0, np.inf)[0]",
  "print(\"espérance :\", round(esperance, 6), \" variance :\", round(variance, 6))",
  "print(\"P(X > 3) :\", round(integrate.quad(densite, 3, np.inf)[0], 4), \" exp(-1,5) =\", round(np.exp(-1.5), 4))",
  "",
  "print(\"intégrale de Gauss :\", round(integrate.quad(lambda x: np.exp(-x ** 2), -np.inf, np.inf)[0], 6), \" racine de pi =\", round(np.sqrt(np.pi), 6))",
  "",
  "for N in [10, 100, 1000, 10000]:",
  "    un_sur_x = integrate.quad(lambda x: 1 / x, 1, N)[0]",
  "    un_sur_x2 = integrate.quad(lambda x: 1 / x ** 2, 1, N)[0]",
  "    print(f\"jusqu'à {N:>5} : 1/x -> {un_sur_x:.3f}   1/x² -> {un_sur_x2:.4f}\")",
);

/** Intégrale double et méthode de Monte-Carlo sur le quart de disque */
export const MONTE_CARLO = lines(
  "import numpy as np",
  "from scipy import integrate",
  "",
  "# aire du quart de disque de rayon 1 : intégrale double sur {x² + y² <= 1, x >= 0, y >= 0}",
  "exact = integrate.dblquad(lambda y, x: 1.0, 0, 1, lambda x: 0, lambda x: np.sqrt(1 - x ** 2))[0]",
  "print(f\"double intégrale (quart de disque) : {exact:.6f}, pi/4 = {np.pi / 4:.6f}\")",
  "",
  "# Monte-Carlo : proportion de points tirés au hasard dans le carré [0, 1]² qui tombent dans le quart de disque",
  "rng = np.random.default_rng(0)",
  "for n in [100, 10_000, 1_000_000]:",
  "    x, y = rng.random(n), rng.random(n)",
  "    estimation = np.mean(x ** 2 + y ** 2 <= 1)",
  "    ecart_type = np.sqrt(exact * (1 - exact) / n)  # écart type attendu de l'estimation",
  "    print(f\"n = {n:>9} : estimation {estimation:.5f}, erreur {abs(estimation - exact):.5f}, écart type attendu {ecart_type:.5f}\")",
);

/** Divergence de Kullback-Leibler et entropie différentielle, calculées par intégration */
export const KL_ENTROPIE = lines(
  "import numpy as np",
  "from scipy import integrate, stats",
  "",
  "def kl(p, q, borne=30):",
  "    \"\"\"Divergence de Kullback-Leibler KL(p || q) = ∫ p(x) ln(p(x) / q(x)) dx, bornée à [-30, 30]\"\"\"",
  "    return integrate.quad(lambda x: p.pdf(x) * np.log(p.pdf(x) / q.pdf(x)), -borne, borne)[0]",
  "",
  "p, q = stats.norm(0, 1), stats.norm(1, 1)",
  "print(\"KL(N(0,1) || N(1,1)) :\", round(kl(p, q), 6))",
  "large = stats.norm(0, 2)",
  "print(\"KL(N(0,1) || N(0,2²)) :\", round(kl(p, large), 6))",
  "print(\"KL(N(0,2²) || N(0,1)) :\", round(kl(large, p), 6))",
  "entropie = integrate.quad(lambda x: -p.pdf(x) * np.log(p.pdf(x)), -30, 30)[0]",
  "print(\"entropie de N(0,1) :\", round(entropie, 6), \" formule ½·ln(2πe) =\", round(0.5 * np.log(2 * np.pi * np.e), 6))",
);

/** Exercices vérifiés par le moteur (même format que les leçons : la réponse est suivie de `test`) */
export const INTEGRAL_EXERCISES: ExerciseSection[] = [
  {
    kind: "exercise",
    language: "python",
    prompt:
      "Écrivez `esperance_variance(densite, a, b)` qui renvoie le couple (espérance, variance) d'une variable de densité `densite` sur [a, b], en calculant les deux intégrales avec `integrate.quad` (les bornes peuvent être `np.inf`). Les tests l'appliquent à la densité 2·exp(−2x) sur [0, +∞[ (loi exponentielle de paramètre 2) et à la loi uniforme sur [1, 5], de densité 1/4.",
    setup: lines("import numpy as np", "from scipy import integrate"),
    starter: lines("def esperance_variance(densite, a, b):", "    return 0.0, 0.0"),
    solution: lines(
      "def esperance_variance(densite, a, b):",
      "    esperance = integrate.quad(lambda x: x * densite(x), a, b)[0]",
      "    variance = integrate.quad(lambda x: (x - esperance) ** 2 * densite(x), a, b)[0]",
      "    return esperance, variance",
    ),
    test: lines(
      "e, v = esperance_variance(lambda x: 2 * np.exp(-2 * x), 0, np.inf)",
      "assert abs(e - 0.5) < 1e-6, f\"Pour la densité 2·exp(-2x) sur [0, +∞[, l'espérance vaut 0,5 (vous obtenez {e})\"",
      "assert abs(v - 0.25) < 1e-6, f\"Pour la densité 2·exp(-2x) sur [0, +∞[, la variance vaut 0,25 (vous obtenez {v})\"",
      "e, v = esperance_variance(lambda x: 0.25, 1, 5)",
      "assert abs(e - 3) < 1e-6, f\"Pour la loi uniforme sur [1, 5], l'espérance vaut 3 (vous obtenez {e})\"",
      "assert abs(v - 16 / 12) < 1e-6, f\"Pour la loi uniforme sur [1, 5], la variance vaut 16/12, environ 1,333 (vous obtenez {v})\"",
    ),
    hint: "L'espérance est ∫ x·f(x) dx ; la variance est ∫ (x − μ)²·f(x) dx, avec μ l'espérance calculée juste avant. `integrate.quad` renvoie un couple (valeur, erreur estimée) : gardez l'élément [0].",
  },
  {
    kind: "exercise",
    language: "python",
    prompt:
      "Programmez la **méthode de Simpson** sans SciPy : `simpson(f, a, b, n)` découpe [a, b] en n tranches de largeur h (n pair) et renvoie h/3 × (f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + … + 4f(xₙ₋₁) + f(xₙ)). Si n est impair, la fonction lève `ValueError`. Les tests vérifient la précision sur ∫ sin x dx entre 0 et π (qui vaut 2) et l'exactitude pour un polynôme de degré 3.",
    setup: "import numpy as np",
    starter: lines("def simpson(f, a, b, n):", "    return 0.0"),
    solution: lines(
      "def simpson(f, a, b, n):",
      "    if n % 2 == 1:",
      "        raise ValueError(\"n doit être pair\")",
      "    x = np.linspace(a, b, n + 1)",
      "    y = f(x)",
      "    h = (b - a) / n",
      "    return h / 3 * (y[0] + 4 * y[1:-1:2].sum() + 2 * y[2:-1:2].sum() + y[-1])",
    ),
    test: lines(
      "r = simpson(np.sin, 0, np.pi, 10)",
      "assert abs(r - 2) < 2e-4, f\"Avec n = 10, l'intégrale de sin x sur [0, π] doit être à moins de 0,0002 de 2 (vous obtenez {r})\"",
      "r = simpson(lambda x: x ** 3, 0, 2, 2)",
      "assert abs(r - 4) < 1e-12, f\"La méthode de Simpson est exacte pour un polynôme de degré 3 : l'intégrale de x³ sur [0, 2] vaut 4 (vous obtenez {r})\"",
      "try:",
      "    simpson(np.sin, 0, np.pi, 5)",
      "    impair_refuse = False",
      "except ValueError:",
      "    impair_refuse = True",
      "assert impair_refuse, \"Avec un nombre impair de tranches, la fonction doit lever ValueError\"",
    ),
    hint: "Avec x = np.linspace(a, b, n + 1) et y = f(x), les points d'indice impair sont y[1:-1:2] (coefficient 4) et ceux d'indice pair intérieurs sont y[2:-1:2] (coefficient 2).",
  },
  {
    kind: "exercise",
    language: "python",
    prompt:
      "Estimez π par la **méthode de Monte-Carlo** : `estimer_pi(n, graine)` tire n points au hasard dans le carré [0, 1]² avec `np.random.default_rng(graine)`, compte la proportion qui tombe dans le quart de disque x² + y² ≤ 1 (son aire vaut π/4) et renvoie 4 fois cette proportion. Les tests demandent une estimation à moins de 0,03 de π avec 100 000 points, et un résultat reproductible avec la même graine.",
    setup: "import numpy as np",
    starter: lines("def estimer_pi(n, graine):", "    return 3.0"),
    solution: lines(
      "def estimer_pi(n, graine):",
      "    rng = np.random.default_rng(graine)",
      "    x, y = rng.random(n), rng.random(n)",
      "    return 4 * np.mean(x ** 2 + y ** 2 <= 1)",
    ),
    test: lines(
      "a = estimer_pi(100_000, 1)",
      "assert abs(a - np.pi) < 0.03, f\"Avec 100 000 points, l'estimation doit être à moins de 0,03 de π (vous obtenez {a})\"",
      "assert estimer_pi(1000, 7) == estimer_pi(1000, 7), \"Avec la même graine, l'estimation doit être la même\"",
      "assert estimer_pi(1000, 7) != estimer_pi(1000, 8), \"Avec des graines différentes, les tirages doivent changer\"",
    ),
    hint: "rng.random(n) donne n nombres uniformes dans [0, 1[. La moyenne d'un tableau de booléens, np.mean(condition), est la proportion de True.",
  },
];
