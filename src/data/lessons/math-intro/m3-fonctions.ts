import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module3: LessonModule = {
  id: "module-3",
  title: "Fonctions",
  duration: "2 h",
  summary: "Domaine et image, fonctions affines, polynômes, exponentielle et logarithme, composition, et les fonctions d'activation des réseaux de neurones.",
  objectives: [
    "Distinguer l'ensemble de définition, l'ensemble d'arrivée et l'image d'une fonction",
    "Reconnaître et tracer avec Matplotlib les fonctions affines, polynomiales, exponentielle et logarithme",
    "Composer des fonctions et expliquer pourquoi un empilement de fonctions affines reste affine",
    "Calculer et comparer la sigmoïde, tanh et la ReLU, puis écrire un neurone artificiel",
  ],
  sections: [
    {
      kind: "text",
      md: `### Qu'est-ce qu'une fonction ?

Une **fonction** f associe à chaque élément x d'un ensemble de départ un **unique** élément f(x) d'un ensemble d'arrivée. On écrit f : X → Y. Trois mots à bien distinguer :

- l'**ensemble de définition** (ou domaine) : les x pour lesquels f(x) existe. Il peut être plus petit que X ;
- l'**ensemble d'arrivée** Y : l'ensemble dans lequel les valeurs sont rangées ;
- l'**image** de f : l'ensemble des valeurs effectivement atteintes, qui peut être plus petit que Y.

Un exemple : f(x) = x² + 1, vue comme fonction de ℝ vers ℝ. Son ensemble de définition est ℝ tout entier, mais son image est seulement [1, +∞[ : f ne prend jamais de valeur inférieure à 1. De plus, deux entrées différentes peuvent avoir la même image : f(2) = f(−2).`,
    },
    {
      kind: "equation",
      latex: String.raw`f : X \to Y, \quad x \mapsto f(x) \qquad\qquad \operatorname{Im}(f) = \{\, f(x) : x \in D \,\}`,
      caption: "À gauche, une fonction de X vers Y. À droite, son image : l'ensemble des valeurs f(x) quand x parcourt l'ensemble de définition D.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import math",
        "import numpy as np",
        "",
        "def f(x):",
        "    return x ** 2 + 1",
        "",
        "x = np.linspace(-3, 3, 601)",
        "print('f(2) =', f(2), ' et f(-2) =', f(-2))",
        "print('sur [-3, 3], f va de', f(x).min(), 'à', f(x).max())",
        "",
        "# hors de l'ensemble de définition, le calcul échoue",
        "for essai in (lambda: math.log(0), lambda: math.sqrt(-1), lambda: 1 / 0):",
        "    try:",
        "        essai()",
        "    except (ValueError, ZeroDivisionError) as erreur:",
        "        print(type(erreur).__name__, ':', erreur)",
      ),
      caption: "Sur [-3, 3], les valeurs de f vont de 1 (atteint en 0) à 10 (atteint aux deux bouts). Le logarithme n'est défini que pour x > 0, la racine carrée pour x ≥ 0, et 1/x pour x ≠ 0 : en dehors, Python lève une erreur. NumPy, lui, renvoie un nan ou un infini avec un avertissement, ce qui est plus discret et plus dangereux.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Une variable qui contient des zéros ne peut pas passer directement dans un logarithme. On utilise alors `np.log1p(x)`, qui calcule ln(1 + x) et reste défini en 0.",
    },
    {
      kind: "text",
      md: `### Les fonctions usuelles

Quatre familles reviennent sans cesse en science des données.

- **Affine** : f(x) = a x + b. La courbe est une droite de **pente** a (de combien f varie quand x augmente de 1) et d'ordonnée à l'origine b. Quand b = 0, on dit « linéaire ». C'est le modèle de la régression linéaire.
- **Polynôme** de degré n : une somme de puissances de x. Plus le degré est élevé, plus la courbe peut changer de direction, et plus le modèle risque de coller au bruit (surapprentissage).
- **Exponentielle** : e^x, avec e ≈ 2,718. Toujours positive, elle croît de plus en plus vite. Elle intervient dans la sigmoïde, le softmax et les lois de probabilité.
- **Logarithme népérien** : ln x, la fonction réciproque de l'exponentielle (ln(e^x) = x). Définie pour x > 0, elle croît lentement.`,
    },
    {
      kind: "equation",
      latex: String.raw`f(x) = a\,x + b \qquad\qquad f(x) = a_0 + a_1 x + a_2 x^2 + \dots + a_n x^n`,
      caption: "Une fonction affine, puis un polynôme de degré n.",
    },
    {
      kind: "equation",
      latex: String.raw`e^{x+y} = e^{x}\,e^{y} \qquad\qquad \ln(x\,y) = \ln x + \ln y \quad (x > 0,\ y > 0)`,
      caption: "L'exponentielle transforme les sommes en produits ; le logarithme fait l'inverse.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "x = np.linspace(-3, 3, 200)",
        "x_pos = np.linspace(0.05, 5, 200)  # le logarithme n'existe que pour x > 0",
        "",
        "fig, axes = plt.subplots(2, 2, figsize=(8, 6))",
        "axes[0, 0].plot(x, 2 * x + 1)",
        "axes[0, 0].set_title('Affine : f(x) = 2x + 1')",
        "axes[0, 1].plot(x, x ** 3 - 3 * x)",
        "axes[0, 1].set_title('Polynôme : f(x) = x³ − 3x')",
        "axes[1, 0].plot(x, np.exp(x))",
        "axes[1, 0].set_title('Exponentielle : f(x) = eˣ')",
        "axes[1, 1].plot(x_pos, np.log(x_pos))",
        "axes[1, 1].set_title('Logarithme : f(x) = ln x')",
        "for ax in axes.flat:",
        "    ax.axhline(0, color='gray', linewidth=0.8)",
        "    ax.axvline(0, color='gray', linewidth=0.8)",
        "    ax.grid(alpha=0.3)",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "La droite monte de 2 à chaque pas de 1. Le polynôme de degré 3 monte, redescend, puis remonte (sa dérivée s'annule en −1 et en 1, voir le module 4). L'exponentielle reste au-dessus de 0. Le logarithme plonge vers −∞ quand x s'approche de 0.",
    },
    {
      kind: "text",
      md: "Pourquoi le logarithme est-il si présent ? Parce qu'il transforme un produit en somme, ce qui évite un problème d'ordinateur vu au module 2. Un modèle probabiliste multiplie souvent beaucoup de petites probabilités : le produit devient plus petit que le plus petit flottant positif et vaut alors 0. En passant aux logarithmes, on additionne des nombres modérés. La log-vraisemblance, que l'on maximise pour entraîner de nombreux modèles, repose sur cette astuce.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "print(np.isclose(np.exp(2 + 3), np.exp(2) * np.exp(3)))",
        "print(np.isclose(np.log(6), np.log(2) + np.log(3)))",
        "print(np.log(np.exp(1.5)), np.exp(np.log(4.0)))",
        "",
        "# 400 probabilités égales à 0.01 : leur produit vaut 10 puissance -800",
        "probas = np.full(400, 0.01)",
        "print('produit :', np.prod(probas))",
        "print('somme des logarithmes :', np.sum(np.log(probas)))",
        "print('plus petit flottant positif :', np.nextafter(0, 1))",
      ),
      caption: "Le produit exact serait 10 puissance −800, bien au-dessous du plus petit flottant positif (5e-324) : l'ordinateur renvoie 0.0. La somme des logarithmes, elle, vaut −1842,07, un nombre tout à fait ordinaire.",
    },
    {
      kind: "text",
      md: `### Composer des fonctions

Si on applique g puis f, on obtient la fonction **composée** f ∘ g, qui à x associe f(g(x)). L'ordre compte : en général, f ∘ g et g ∘ f sont différentes.`,
    },
    {
      kind: "equation",
      latex: String.raw`(f \circ g)(x) = f\bigl(g(x)\bigr)`,
      caption: "On calcule d'abord g(x), puis on applique f au résultat.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "def f(x):",
        "    return 2 * x + 1",
        "",
        "def g(x):",
        "    return x ** 2",
        "",
        "print('(f o g)(3) = f(g(3)) =', f(g(3)))",
        "print('(g o f)(3) = g(f(3)) =', g(f(3)))",
      ),
      caption: "g(3) = 9 puis f(9) = 19, alors que f(3) = 7 puis g(7) = 49. L'ordre change le résultat.",
    },
    {
      kind: "text",
      md: `Un réseau de neurones est une composition de nombreuses fonctions simples, les **couches**. Voici la difficulté : composer deux fonctions affines donne encore une fonction affine. Avec f(x) = a₁ x + b₁ et g(x) = a₂ x + b₂, on obtient f(g(x)) = a₁ a₂ x + (a₁ b₂ + b₁). Empiler des couches purement affines n'apporte donc rien de plus qu'une seule couche, quelle que soit la profondeur. Pour représenter autre chose que des droites, il faut intercaler entre les couches une fonction **non linéaire** : c'est le rôle des fonctions d'activation.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "def relu(x):",
        "    return np.maximum(0, x)",
        "",
        "x = np.linspace(-3, 3, 300)",
        "# trois neurones cachés dont les poids sont choisis à la main",
        "h1, h2, h3 = x + 1, x, x - 1  # avant activation",
        "sans_activation = h1 - 2 * h2 + 2 * h3",
        "avec_relu = relu(h1) - 2 * relu(h2) + 2 * relu(h3)",
        "print('sans activation, on obtient la droite x - 1 :', np.allclose(sans_activation, x - 1))",
        "print('en x = -3 :', sans_activation[0], 'contre', avec_relu[0])",
        "",
        "fig, ax = plt.subplots(figsize=(7, 3.5))",
        "ax.plot(x, sans_activation, label='sans activation (une droite)')",
        "ax.plot(x, avec_relu, label='avec ReLU (une courbe brisée)')",
        "ax.set_title('Trois neurones : la non-linéarité change tout')",
        "ax.legend()",
        "ax.grid(alpha=0.3)",
        "plt.show()",
      ),
      caption: "Sans activation, trois neurones donnent la droite x − 1. Avec la ReLU, la même combinaison devient une courbe brisée qui s'annule en x = −1 et en x = 1 (valeur 1 en x = 0). Les poids sont fixés à la main, pour l'illustration : un vrai réseau les apprend.",
    },
    {
      kind: "text",
      md: `### Les fonctions d'activation

Trois fonctions d'activation sont classiques. Elles sont toutes non linéaires.

- la **sigmoïde** σ(x) = 1 / (1 + e^(−x)) ramène tout réel dans l'intervalle ]0, 1[, avec σ(0) = 0,5 : on peut en interpréter la sortie comme une probabilité, par exemple en régression logistique ;
- la **tangente hyperbolique** tanh ramène tout réel dans ]−1, 1[, avec tanh(0) = 0 ;
- la **ReLU** (Rectified Linear Unit) vaut 0 pour x négatif et x pour x positif.`,
    },
    {
      kind: "equation",
      latex: String.raw`\sigma(x) = \frac{1}{1 + e^{-x}} \qquad \tanh(x) = \frac{e^{x} - e^{-x}}{e^{x} + e^{-x}} \qquad \operatorname{ReLU}(x) = \max(0,\, x)`,
      caption: "Les trois fonctions d'activation courantes.",
    },
    {
      kind: "widget",
      widget: "activation-functions",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "def sigmoide(x):",
        "    return 1 / (1 + np.exp(-x))",
        "",
        "def relu(x):",
        "    return np.maximum(0, x)",
        "",
        "x = np.array([-5.0, -1.0, 0.0, 1.0, 5.0])",
        "print('x         :', x)",
        "print('sigmoïde  :', np.round(sigmoide(x), 4))",
        "print('tanh      :', np.round(np.tanh(x), 4))",
        "print('ReLU      :', relu(x))",
        "",
        "# deux identités vérifiées numériquement",
        "print('sigma(-x) = 1 - sigma(x) :', np.allclose(sigmoide(-x), 1 - sigmoide(x)))",
        "print('tanh(x) = 2 sigma(2x) - 1 :', np.allclose(np.tanh(x), 2 * sigmoide(2 * x) - 1))",
        "print('sigma(10) =', sigmoide(10), ' sigma(-10) =', sigmoide(-10))",
      ),
      caption: "La sigmoïde et tanh s'écartent peu de leurs limites dès que |x| est grand : σ(10) vaut 0,99995. Leur courbe devient presque plate, donc leur dérivée presque nulle, ce qui ralentit l'apprentissage (on le verra au module 4). La ReLU ne sature pas pour les x positifs.",
    },
    {
      kind: "text",
      md: "Quand il y a plus de deux classes, la sortie du modèle est un vecteur de scores z, et la fonction **softmax** les transforme en probabilités : des nombres positifs dont la somme vaut 1. C'est la généralisation de la sigmoïde à plusieurs classes.",
    },
    {
      kind: "equation",
      latex: String.raw`\operatorname{softmax}(z)_i = \frac{e^{z_i}}{\sum_{j} e^{z_j}}`,
      caption: "Softmax : chaque score est exponentialisé, puis divisé par la somme.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "def softmax(z):",
        "    e = np.exp(z - np.max(z))  # on soustrait le maximum : même résultat, sans dépassement",
        "    return e / e.sum()",
        "",
        "scores = np.array([2.0, 1.0, 0.1])",
        "p = softmax(scores)",
        "print('probabilités :', np.round(p, 3), ' somme :', p.sum())",
        "",
        "# scores très grands : la formule brute dépasse la capacité des flottants",
        "grands = np.array([1000.0, 1001.0])",
        "with np.errstate(all='ignore'):",
        "    brut = np.exp(grands) / np.exp(grands).sum()",
        "print('formule brute :', brut)",
        "print('version stable :', softmax(grands))",
      ),
      caption: "Les scores 2, 1 et 0,1 deviennent les probabilités 0,659, 0,242 et 0,099, de somme 1. Retrancher le maximum ne change pas le résultat (le numérateur et le dénominateur sont multipliés par le même facteur) mais évite que e à la puissance 1000 ne vaille l'infini, ce qui donne un nan.",
    },
    {
      kind: "text",
      md: "Pour finir, un **neurone artificiel** est la brique de base d'un réseau : il calcule une combinaison linéaire de ses entrées, ajoute un biais, et applique une fonction d'activation.",
    },
    {
      kind: "equation",
      latex: String.raw`\text{sortie} = \sigma\!\left( \sum_{i=1}^{n} w_i\, x_i + b \right)`,
      caption: "Les w_i sont les poids, b le biais, σ la fonction d'activation (ici la sigmoïde).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `composer(f, g)` qui reçoit deux fonctions et **renvoie une nouvelle fonction** h telle que h(x) = f(g(x)). Par exemple, avec f(x) = 2x + 1 et g(x) = x², `composer(f, g)(3)` doit valoir 19.",
      starter: lines("def composer(f, g):", "    return f"),
      solution: lines(
        "def composer(f, g):",
        "    return lambda x: f(g(x))",
        "",
        "f = lambda x: 2 * x + 1",
        "g = lambda x: x ** 2",
        "print(composer(f, g)(3), composer(g, f)(3))",
      ),
      test: lines(
        "_f = lambda x: 2 * x + 1",
        "_g = lambda x: x ** 2",
        "_h = composer(_f, _g)",
        `assert callable(_h), "composer doit renvoyer une fonction"`,
        "_r = _h(3)",
        `assert _r == 19, f"(f∘g)(3) = f(g(3)) = f(9) = 19 (vous avez {_r})"`,
        "_r = composer(_g, _f)(3)",
        `assert _r == 49, f"(g∘f)(3) = g(f(3)) = g(7) = 49 : l'ordre compte (vous avez {_r})"`,
      ),
      hint: "Définissez la fonction à renvoyer : return lambda x: f(g(x)), ou une fonction interne def h(x): return f(g(x)) suivie de return h.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `sigmoide(x)`, qui calcule σ(x) = 1 / (1 + e^(−x)) et fonctionne aussi bien sur un nombre que sur un tableau NumPy (utilisez `np.exp`).",
      setup: "import numpy as np",
      starter: lines("def sigmoide(x):", "    return x"),
      solution: lines(
        "def sigmoide(x):",
        "    return 1 / (1 + np.exp(-x))",
        "",
        "print(sigmoide(0), sigmoide(np.array([-2.0, 0.0, 2.0])))",
      ),
      test: lines(
        "_r = sigmoide(0)",
        `assert abs(_r - 0.5) < 1e-9, f"σ(0) = 1 / (1 + e^0) = 0.5 (vous avez {_r})"`,
        "_r = sigmoide(3.0)",
        `assert abs(_r - 0.9525741268) < 1e-9, f"σ(3) vaut environ 0.95257 (vous avez {_r})"`,
        "_t = sigmoide(np.array([-2.0, 0.0, 2.0]))",
        `assert np.allclose(_t + _t[::-1], 1), f"σ(−x) doit valoir 1 − σ(x) : la fonction doit accepter un tableau (vous avez {_t})"`,
        `assert np.all((_t > 0) & (_t < 1)), "les valeurs de la sigmoïde restent strictement entre 0 et 1"`,
      ),
      hint: "1 / (1 + np.exp(-x)) : np.exp s'applique à chaque élément d'un tableau, donc la même expression marche pour un nombre et pour un tableau.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La fonction `sigmoide` est déjà définie. Écrivez `neurone(x, w, b)` qui renvoie la sortie d'un neurone : la sigmoïde de la somme des produits `w_i * x_i`, plus le biais `b` (`x` et `w` sont des listes ou des tableaux de même longueur). Par exemple, `neurone([1, 2], [0.5, -0.25], 0.25)` vaut σ(0,25).",
      setup: lines(
        "import numpy as np",
        "",
        "def sigmoide(x):",
        "    return 1 / (1 + np.exp(-x))",
      ),
      starter: lines("def neurone(x, w, b):", "    return 0.0"),
      solution: lines(
        "def neurone(x, w, b):",
        "    z = np.dot(np.array(w), np.array(x)) + b",
        "    return sigmoide(z)",
        "",
        "print(neurone([1, 2], [0.5, -0.25], 0.25))",
      ),
      test: lines(
        "_r = neurone([1, 2], [0.5, -0.25], 0.25)",
        `assert abs(_r - 0.5621765) < 1e-6, f"z = 0.5 × 1 − 0.25 × 2 + 0.25 = 0.25 et σ(0.25) ≈ 0.56218 (vous avez {_r})"`,
        "_r = neurone([0, 0], [3, 4], 0)",
        `assert abs(_r - 0.5) < 1e-9, f"avec des entrées nulles et un biais nul, z = 0 et la sortie vaut 0.5 (vous avez {_r})"`,
        "_r = neurone([10, 10], [1, 1], 0)",
        `assert _r > 0.999999, f"z = 20 : la sortie doit être presque égale à 1 (vous avez {_r})"`,
      ),
      hint: "Calculez z = np.dot(w, x) + b (np.dot additionne les produits terme à terme), puis appliquez sigmoide(z).",
    },
  ],
  quiz: [
    {
      question: "Quelle fonction transforme n'importe quel réel en une valeur strictement comprise entre 0 et 1, que l'on peut interpréter comme une probabilité ?",
      options: ["La ReLU", "La sigmoïde", "La fonction affine f(x) = ax + b", "tanh"],
      correct: 1,
      explanation: "La sigmoïde σ(x) = 1 / (1 + e⁻ˣ) reste dans ]0, 1[. tanh varie dans ]−1, 1[ et la ReLU n'est pas bornée.",
    },
    {
      question: "Que vaut σ(0), avec σ(x) = 1 / (1 + e⁻ˣ) ?",
      options: ["0", "0,5", "1", "e"],
      correct: 1,
      explanation: "σ(0) = 1 / (1 + e⁰) = 1 / 2 : c'est le point où le modèle est parfaitement indécis entre les deux classes.",
    },
    {
      question: "Soit f(x) = 2x + 1 et g(x) = x². Que vaut (f ∘ g)(3) = f(g(3)) ?",
      options: ["19", "49", "16", "7"],
      correct: 0,
      explanation: "On calcule d'abord g(3) = 9, puis f(9) = 2 × 9 + 1 = 19. L'ordre compte : g(f(3)) = g(7) = 49.",
    },
    {
      question: "Pourquoi un réseau de neurones intercale-t-il des fonctions d'activation non linéaires entre ses couches ?",
      options: [
        "Pour que le réseau s'entraîne plus vite",
        "Parce que composer des fonctions affines donne encore une fonction affine : sans non-linéarité, la profondeur n'apporterait rien",
        "Pour que toutes les sorties soient positives",
        "Pour réduire le nombre de paramètres",
      ],
      correct: 1,
      explanation: "Si f et g sont affines, f ∘ g l'est aussi. Un empilement de couches affines équivaut donc à une seule couche affine ; la non-linéarité permet de représenter des courbes.",
    },
    {
      question: "Quel est l'ensemble de définition de la fonction ln (logarithme népérien) ?",
      options: ["ℝ tout entier", "[0, +∞[", "]0, +∞[", "ℝ privé de 0"],
      correct: 2,
      explanation: "ln n'est défini que pour x strictement positif. ln(0) n'existe pas (la fonction tend vers −∞ quand x s'approche de 0) et ln d'un nombre négatif n'existe pas dans les réels.",
    },
  ],
};
