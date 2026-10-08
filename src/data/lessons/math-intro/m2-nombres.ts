import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module2: LessonModule = {
  id: "module-2",
  title: "Nombres et ensembles",
  duration: "1 h 30",
  summary: "Les ensembles de nombres, ce que l'ordinateur en fait (les flottants ont des limites), et les opérations sur les ensembles avec les set de Python.",
  objectives: [
    "Distinguer les ensembles de nombres ℕ, ℤ, ℚ, ℝ et ℂ, et leurs équivalents en Python",
    "Expliquer pourquoi 0,1 + 0,2 n'est pas égal à 0,3 en machine et comparer des flottants avec une tolérance",
    "Calculer l'union, l'intersection, la différence et le complémentaire de deux ensembles avec les set",
    "Vérifier qu'un découpage entraînement et test ne laisse fuir aucune donnée",
  ],
  sections: [
    {
      kind: "text",
      md: `### Les ensembles de nombres

Les nombres se rangent dans des ensembles emboîtés, du plus simple au plus riche :

- **ℕ**, les entiers naturels : 0, 1, 2, 3, ... (en France, 0 en fait partie). Ils servent à compter et à numéroter ;
- **ℤ**, les entiers relatifs : ..., −2, −1, 0, 1, 2, ... On y ajoute les opposés ;
- **ℚ**, les rationnels : les fractions p / q avec p et q entiers et q non nul, comme 1/3 ou −7/4 ;
- **ℝ**, les réels : tous les nombres de la droite numérique, y compris les **irrationnels** qui ne s'écrivent pas comme une fraction (√2, π, e) ;
- **ℂ**, les complexes : les nombres a + b i avec i² = −1. Ils servent surtout en traitement du signal (transformée de Fourier).

Chacun contient le précédent.`,
    },
    {
      kind: "equation",
      latex: String.raw`\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}`,
      caption: "Le symbole ⊂ se lit « est inclus dans » : tout entier naturel est un entier relatif, tout entier relatif est un rationnel, et ainsi de suite.",
    },
    {
      kind: "equation",
      latex: String.raw`\mathbb{Q} = \left\{ \frac{p}{q} \;:\; p \in \mathbb{Z},\ q \in \mathbb{Z},\ q \neq 0 \right\}`,
      caption: "Un rationnel est le quotient de deux entiers, le second étant non nul.",
    },
    {
      kind: "text",
      md: "Python a un type pour chacun de ces ensembles, ou presque. `int` pour les entiers, avec une précision illimitée : un entier peut avoir autant de chiffres que la mémoire le permet. `fractions.Fraction` pour les rationnels, calculés exactement. `float` pour les réels, mais attention : c'est une approximation, comme la suite va le montrer. `complex` pour les complexes.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from fractions import Fraction",
        "",
        "print(type(3), type(3.0), type(Fraction(1, 3)), type(2 + 3j))",
        "print('un tiers plus un sixième :', Fraction(1, 3) + Fraction(1, 6))",
        "print('2 puissance 100 :', 2 ** 100)",
        "print('7 / 2 =', 7 / 2, ' ; 7 // 2 =', 7 // 2, ' ; 7 % 2 =', 7 % 2)",
        "print('(2 + 3j) * (2 - 3j) =', (2 + 3j) * (2 - 3j))",
      ),
      caption: "Les entiers de Python n'ont pas de limite de taille (2 puissance 100 a 31 chiffres), et Fraction additionne des fractions exactement. Pour les réels, voici le piège.",
    },
    {
      kind: "text",
      md: `### Les flottants : des réels approchés

Un ordinateur ne peut pas stocker un nombre réel quelconque : il n'a qu'un nombre fini de bits. Un **flottant** (type \`float\`, norme IEEE 754 en double précision) est stocké sur 64 bits : un signe, un exposant et une partie fractionnaire de 52 bits. Un nombre normalisé s'écrit :`,
    },
    {
      kind: "equation",
      latex: String.raw`x = (-1)^{s} \times \left( 1 + \frac{k}{2^{52}} \right) \times 2^{e}, \qquad k \in \{0, 1, \dots, 2^{52} - 1\}`,
      caption: "s est le signe (0 ou 1), e l'exposant, k un entier : seuls les nombres de cette forme existent en machine.",
    },
    {
      kind: "text",
      md: "Deux conséquences. D'abord, tout flottant fini est un **rationnel** (un entier divisé par une puissance de 2) : le « réel » 0,1 ne s'y trouve pas, il est remplacé par le flottant le plus proche. Ensuite, les flottants sont plus serrés près de 0 et plus espacés quand les nombres grandissent : l'erreur relative d'arrondi reste bornée par ε/2, où ε est l'écart entre 1 et le flottant suivant.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import sys",
        "from fractions import Fraction",
        "",
        "print(0.1 + 0.2)",
        "print(0.1 + 0.2 == 0.3)",
        "print('valeur exacte stockée pour 0.1 :', Fraction(0.1))",
        "print('chiffres binaires de précision :', sys.float_info.mant_dig)",
        "print('chiffres décimaux fiables :', sys.float_info.dig)",
        "print('epsilon :', sys.float_info.epsilon, ' = 2 ** -52 :', sys.float_info.epsilon == 2 ** -52)",
        "print('1 + 1e-16 == 1 :', 1 + 1e-16 == 1)",
        "print('1e16 + 1 == 1e16 :', 1e16 + 1 == 1e16)",
        "print((1e16 + 1) - 1e16, (1e16 - 1e16) + 1)",
      ),
      caption: "0,1 est stocké comme la fraction 3602879701896397 / 36028797018963968 (le dénominateur est 2 puissance 55), un peu plus grande que 0,1. D'où 0,30000000000000004. La précision est de 53 chiffres binaires (52 stockés plus un implicite), soit 15 chiffres décimaux fiables. Quand deux nombres sont trop différents en taille, le plus petit disparaît (1e16 + 1 = 1e16), et l'addition n'est plus associative : les deux dernières expressions, mathématiquement égales, donnent 0,0 et 1,0.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Ne comparez jamais deux flottants avec `==` quand ils viennent d'un calcul. Comparez-les avec une tolérance : `abs(a - b) < 1e-9`, ou `math.isclose(a, b)`, ou `np.isclose(a, b)` pour des tableaux.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import math",
        "import numpy as np",
        "",
        "total = 0.0",
        "for _ in range(10):",
        "    total += 0.1",
        "print('dix fois 0.1 :', total, total == 1.0, math.isclose(total, 1.0))",
        "print('np.isclose sur un tableau :', np.isclose(np.array([0.1 + 0.2, 0.5]), 0.3))",
        "",
        "# valeurs particulières",
        "nan = float('nan')",
        "print('nan == nan :', nan == nan, ' ; math.isnan(nan) :', math.isnan(nan))",
        "print('1e308 * 10 =', 1e308 * 10, ' ; inf - inf =', (1e308 * 10) - (1e308 * 10))",
      ),
      caption: "Dix additions de 0,1 ne donnent pas exactement 1, mais math.isclose juge le résultat égal à 1. Le « nan » (not a number) est la valeur des données manquantes dans pandas : il n'est égal à aucun nombre, pas même à lui-même, d'où math.isnan. Un calcul qui dépasse la capacité des flottants donne l'infini (inf).",
    },
    {
      kind: "text",
      md: "En apprentissage automatique, on utilise souvent des flottants sur 32 bits (`float32`) pour gagner en mémoire et en vitesse : la précision est alors bien moindre (ε vaut environ 1,2 × 10⁻⁷ au lieu de 2,2 × 10⁻¹⁶). Quant aux entiers de NumPy, ils ont une taille fixe : dans un tableau, un résultat qui la dépasse reboucle sans prévenir.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "print('epsilon float32 :', np.finfo(np.float32).eps)",
        "print('epsilon float64 :', np.finfo(np.float64).eps)",
        "print('float32(0.1) vaut en réalité :', float(np.float32(0.1)))",
        "",
        "# 2 puissance 24 : au-delà, float32 ne représente plus tous les entiers",
        "print(int(np.float32(2 ** 24) + np.float32(1)))",
        "",
        "# entiers de taille fixe (NumPy) contre entiers de Python",
        "x = np.array([2 ** 62], dtype=np.int64)",
        "print('int64 :', x * 2)",
        "print('int Python :', 2 ** 62 * 2)",
      ),
      caption: "En float32, 16777216 + 1 vaut encore 16777216 : on ne peut plus compter de un en un. Un entier int64 qui dépasse 9223372036854775807 reboucle vers un nombre négatif, alors que l'entier Python grandit sans limite. Ces dépassements ne produisent aucune erreur : c'est à vous d'y penser.",
    },
    {
      kind: "text",
      md: `### Ensembles et opérations

Un **ensemble** est une collection d'objets distincts, sans ordre : {1, 2, 3} et {3, 1, 2} sont le même ensemble, et écrire un élément deux fois ne change rien. On écrit x ∈ A pour « x appartient à A », et |A| pour le nombre d'éléments (le **cardinal**). On peut définir un ensemble en listant ses éléments, ou par une propriété : {x ∈ ℕ : x < 10 et x pair}.

À partir de deux ensembles A et B, pris dans un univers Ω (l'ensemble de tous les éléments considérés), on définit quatre opérations.`,
    },
    {
      kind: "equation",
      latex: String.raw`\begin{aligned} A \cup B &= \{ x : x \in A \text{ ou } x \in B \} && \text{(union)} \\ A \cap B &= \{ x : x \in A \text{ et } x \in B \} && \text{(intersection)} \\ A \setminus B &= \{ x : x \in A \text{ et } x \notin B \} && \text{(différence)} \\ A^{c} &= \Omega \setminus A && \text{(complémentaire)} \end{aligned}`,
      caption: "Le « ou » est inclusif : un élément qui est dans A et dans B appartient à l'union.",
    },
    {
      kind: "widget",
      widget: "venn-diagram",
    },
    {
      kind: "text",
      md: "En Python, ces opérations existent telles quelles avec les `set` : `|` pour l'union, `&` pour l'intersection, `-` pour la différence. Le complémentaire demande de donner l'univers, puisqu'un `set` Python ne connaît pas l'ensemble Ω : on écrit `omega - A`. La notation par propriété s'écrit comme une liste en compréhension, avec des accolades.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "A = {1, 2, 3, 4}",
        "B = {3, 4, 5}",
        "omega = {1, 2, 3, 4, 5, 6}",
        "",
        "print('union          A | B :', sorted(A | B))",
        "print('intersection   A & B :', sorted(A & B))",
        "print('différence     A - B :', sorted(A - B))",
        "print('complémentaire Ω - A :', sorted(omega - A))",
        "print('différence symétrique A ^ B :', sorted(A ^ B))",
        "print('A est inclus dans Ω :', A <= omega, ' ; A et B disjoints :', A.isdisjoint(B))",
        "",
        "# un set ignore les répétitions et n'a pas d'ordre",
        "print(set([3, 1, 3, 2, 1]), len(set([3, 1, 3, 2, 1])))",
        "",
        "# {x dans N : x < 10 et x pair}",
        "print({x for x in range(10) if x % 2 == 0})",
      ),
      caption: "La différence symétrique A ^ B contient les éléments qui sont dans l'un des deux ensembles seulement. Deux ensembles sont disjoints quand leur intersection est vide.",
    },
    {
      kind: "text",
      md: "Une relation à connaître : pour compter les éléments d'une union, on additionne les cardinaux et on retire une fois les éléments comptés deux fois, ceux de l'intersection.",
    },
    {
      kind: "equation",
      latex: String.raw`|A \cup B| = |A| + |B| - |A \cap B|`,
      caption: "Principe d'inclusion-exclusion pour deux ensembles.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "# lecteurs qui ont emprunté un livre en janvier et en février (noms inventés)",
        "janvier = {'Alice', 'Bruno', 'Chloé', 'David', 'Emma'}",
        "fevrier = {'Bruno', 'Emma', 'Farid', 'Gaëlle'}",
        "",
        "print('lecteurs sur les deux mois :', sorted(janvier & fevrier))",
        "print('nouveaux lecteurs en février :', sorted(fevrier - janvier))",
        "print('lecteurs de janvier pas revenus :', sorted(janvier - fevrier))",
        "print('lecteurs distincts sur les deux mois :', len(janvier | fevrier))",
        "",
        "# vérification du principe d'inclusion-exclusion",
        "print(len(janvier) + len(fevrier) - len(janvier & fevrier))",
      ),
      caption: "Les opérations sur les ensembles répondent à des questions concrètes sur des données : qui est resté, qui est nouveau, combien de personnes différentes. Le décompte 5 + 4 − 2 donne bien 7, comme la taille de l'union.",
    },
    {
      kind: "note",
      tone: "info",
      md: `**Ensembles et science des données.** Retenir les variables que plusieurs méthodes de sélection jugent importantes revient à prendre une intersection ; trouver les identifiants présents dans une table mais pas dans l'autre est une différence ; séparer les données en un ensemble d'entraînement et un ensemble de test, c'est les choisir **disjoints**. Si un même exemple se trouve dans les deux, le modèle est évalué sur ce qu'il a déjà vu : le score est trop optimiste, on parle de **fuite de données**.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Voici les livres empruntés pendant deux semaines. Calculez, avec les opérations sur les ensembles : `fideles`, les livres empruntés les deux semaines ; `nouveautes`, ceux empruntés la semaine 2 mais pas la semaine 1 ; et `total_distinct`, le nombre de livres différents empruntés sur les deux semaines.",
      setup: lines(
        "semaine_1 = {'Candide', 'Germinal', 'Bel-Ami', 'Madame Bovary'}",
        "semaine_2 = {'Germinal', 'Le Horla', 'Madame Bovary', 'Nana'}",
      ),
      starter: lines("fideles = set()", "nouveautes = set()", "total_distinct = 0"),
      solution: lines(
        "fideles = semaine_1 & semaine_2",
        "nouveautes = semaine_2 - semaine_1",
        "total_distinct = len(semaine_1 | semaine_2)",
        "print(fideles, nouveautes, total_distinct)",
      ),
      test: lines(
        `assert fideles == {'Germinal', 'Madame Bovary'}, f"les livres empruntés les deux semaines forment l'intersection : {{'Germinal', 'Madame Bovary'}} (vous avez {fideles})"`,
        `assert nouveautes == {'Le Horla', 'Nana'}, f"les nouveautés sont dans la semaine 2 sans être dans la semaine 1 : {{'Le Horla', 'Nana'}} (vous avez {nouveautes})"`,
        `assert total_distinct == 6, f"il y a 4 + 4 − 2 = 6 livres différents (vous avez {total_distinct})"`,
      ),
      hint: "Intersection : semaine_1 & semaine_2. Différence : semaine_2 - semaine_1. Union : semaine_1 | semaine_2, puis len(...) pour compter.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `presque_egaux(a, b)` qui renvoie `True` quand les deux nombres diffèrent de **moins de 1e-9**, et `False` sinon. Elle doit juger que `0.1 + 0.2` et `0.3` sont presque égaux, ce que `==` ne fait pas.",
      starter: lines("def presque_egaux(a, b):", "    return a == b"),
      solution: lines(
        "def presque_egaux(a, b):",
        "    return abs(a - b) < 1e-9",
        "",
        "print(presque_egaux(0.1 + 0.2, 0.3), presque_egaux(1.0, 1.001))",
      ),
      test: lines(
        "_r = presque_egaux(0.1 + 0.2, 0.3)",
        `assert bool(_r), f"0.1 + 0.2 et 0.3 diffèrent d'environ 5.6e-17 : ils doivent être jugés presque égaux (vous avez {_r})"`,
        "_r = presque_egaux(1.0, 1.001)",
        `assert not _r, f"1.0 et 1.001 diffèrent de 1e-3, ce qui dépasse la tolérance de 1e-9 (vous avez {_r})"`,
        "_r = presque_egaux(5.0, 5.0000000001)",
        `assert bool(_r), f"5.0 et 5.0000000001 diffèrent de 1e-10, ils doivent être jugés presque égaux (vous avez {_r})"`,
        "_r = presque_egaux(5.0, 5.00000001)",
        `assert not _r, f"5.0 et 5.00000001 diffèrent de 1e-8, ce qui dépasse la tolérance (vous avez {_r})"`,
      ),
      hint: "Prenez la valeur absolue de la différence avec abs(a - b) et comparez-la à 1e-9 avec <.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un découpage entraînement et test est correct quand aucun identifiant n'apparaît dans les deux listes. Écrivez `fuite(ids_train, ids_test)` qui renvoie **l'ensemble** (un `set`) des identifiants présents à la fois dans l'entraînement et dans le test. S'il est vide, il n'y a pas de fuite.",
      starter: lines("def fuite(ids_train, ids_test):", "    return None"),
      solution: lines(
        "def fuite(ids_train, ids_test):",
        "    return set(ids_train) & set(ids_test)",
        "",
        "print(fuite([1, 2, 3, 4], [4, 5, 6]), fuite([1, 2], [3, 4]))",
      ),
      test: lines(
        "_r = fuite([1, 2, 3, 4], [4, 5, 6])",
        `assert isinstance(_r, set), f"la fonction doit renvoyer un ensemble (set), pas {type(_r).__name__}"`,
        `assert _r == {4}, f"seul l'identifiant 4 est dans les deux listes (vous avez {_r})"`,
        "_r = fuite([1, 2], [3, 4])",
        `assert _r == set(), f"aucun identifiant n'est commun : on attend l'ensemble vide set() (vous avez {_r})"`,
        "_r = fuite([7, 7, 8], [8, 8, 9])",
        `assert _r == {8}, f"les doublons ne comptent qu'une fois : on attend {{8}} (vous avez {_r})"`,
      ),
      hint: "Convertissez chaque liste en ensemble avec set(...), puis prenez l'intersection avec &.",
    },
  ],
  quiz: [
    {
      question: "Soit A = {1, 2, 3, 4} et B = {3, 4, 5}. Que vaut A ∩ B ?",
      options: ["{3, 4}", "{1, 2, 3, 4, 5}", "{1, 2}", "{5}"],
      correct: 0,
      explanation: "L'intersection contient les éléments présents à la fois dans A et dans B : 3 et 4. L'union serait {1, 2, 3, 4, 5} et la différence A \\ B serait {1, 2}.",
    },
    {
      question: "Quel est le plus petit de ces ensembles de nombres qui contienne √2 ?",
      options: ["ℤ (entiers relatifs)", "ℚ (rationnels)", "ℝ (réels)", "ℂ (complexes)"],
      correct: 2,
      explanation: "√2 est irrationnel : il n'appartient ni à ℤ ni à ℚ. ℝ le contient, ℂ aussi, mais ℝ est le plus petit des deux.",
    },
    {
      question: "Pourquoi 0.1 + 0.2 == 0.3 vaut-il False en Python ?",
      options: [
        "Parce que Python se trompe dans l'addition",
        "Parce que 0,1, 0,2 et 0,3 ne sont pas représentables exactement en binaire : chacun est remplacé par un flottant proche et les erreurs s'accumulent",
        "Parce que le résultat est un entier",
        "Parce que == compare seulement les types",
      ],
      correct: 1,
      explanation: "Les flottants sont des fractions de dénominateur puissance de 2. 0,1 devient la fraction 3602879701896397 / 36028797018963968, légèrement plus grande, et la somme diffère de 0,3 d'environ 5,6 × 10⁻¹⁷. On compare donc avec une tolérance.",
    },
    {
      question: "Si |A| = 4, |B| = 3 et |A ∩ B| = 2, que vaut |A ∪ B| ?",
      options: ["7", "5", "9", "1"],
      correct: 1,
      explanation: "On applique |A ∪ B| = |A| + |B| − |A ∩ B| = 4 + 3 − 2 = 5. Additionner seulement 4 et 3 compterait deux fois les éléments de l'intersection.",
    },
    {
      question: "Pourquoi les ensembles d'entraînement et de test d'un modèle doivent-ils être disjoints ?",
      options: [
        "Pour que le modèle s'entraîne plus vite",
        "Pour que l'évaluation porte sur des données jamais vues, sans fuite de données",
        "Pour avoir exactement autant de lignes dans chaque ensemble",
        "Pour éviter d'utiliser des nombres réels",
      ],
      correct: 1,
      explanation: "Si leur intersection n'est pas vide, le modèle est évalué sur des exemples qu'il a déjà vus : le score est alors trop optimiste (fuite de données).",
    },
  ],
};
