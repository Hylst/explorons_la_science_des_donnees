import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const moduleProbability: LessonModule = {
  id: "probability",
  title: "Probabilités en pratique",
  duration: "2 h",
  summary: "Simuler pour comprendre, calculer avec scipy.stats, et voir naître la loi normale du théorème central limite.",
  objectives: [
    "Simuler une expérience aléatoire avec NumPy et observer la loi des grands nombres",
    "Calculer des probabilités avec les lois binomiale et normale de scipy.stats",
    "Utiliser pmf, cdf, sf et ppf à bon escient",
    "Constater le théorème central limite par simulation",
  ],
  sections: [
    {
      kind: "text",
      md: `### Simuler pour comprendre

Quand un calcul de probabilité paraît abstrait, on peut **simuler** : faire tourner l'expérience des milliers de fois et compter. NumPy fournit un générateur de nombres aléatoires, que l'on initialise avec une graine (\`seed\`) pour obtenir les mêmes tirages à chaque exécution.

La **loi des grands nombres** dit que la fréquence observée se rapproche de la probabilité quand le nombre de répétitions augmente : sur 10 lancers de dé, la part de 6 peut être très loin de 1/6 ; sur 10 000, elle en est proche.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(0)",
        "for n in [10, 100, 10_000]:",
        "    lancers = rng.integers(1, 7, n)  # entiers de 1 à 6",
        "    print(f'{n:>6} lancers : part de 6 = {(lancers == 6).mean():.3f}   (théorie : {1/6:.3f})')",
      ),
      caption: "Plus on lance, plus la fréquence observée se rapproche de 1/6. Changez la graine pour voir d'autres tirages.",
    },
    {
      kind: "text",
      md: `### Calculer avec scipy.stats

Chaque loi de \`scipy.stats\` offre les mêmes méthodes :

- \`pmf(k)\` (lois discrètes) ou \`pdf(x)\` (lois continues) : la probabilité, ou la densité, en un point ;
- \`cdf(x)\` : la probabilité d'être **inférieur ou égal** à x ;
- \`sf(x)\` : la probabilité d'être **strictement supérieur** à x (c'est \`1 - cdf(x)\`, en plus précis) ;
- \`ppf(q)\` : l'inverse de la \`cdf\`, le quantile ; \`norm.ppf(0.975)\` donne le fameux 1,96.

La **loi binomiale** \`binom(n, p)\` compte les succès sur n essais indépendants de probabilité p. La **loi normale** \`norm(moyenne, écart-type)\` décrit de nombreuses mesures et, surtout, la distribution des moyennes d'échantillons.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "On lance une pièce équilibrée **10 fois**. Avec `stats.binom`, calculez la probabilité d'obtenir **au moins 8 faces** et rangez-la dans `p_au_moins_8`.",
      starter: lines("from scipy import stats", "", "p_au_moins_8 = stats.binom.pmf(8, 10, 0.5)"),
      solution: lines(
        "from scipy import stats",
        "",
        "# P(X >= 8) = P(X > 7)",
        "p_au_moins_8 = stats.binom.sf(7, 10, 0.5)",
        "print(round(p_au_moins_8, 4))",
      ),
      test: "assert abs(p_au_moins_8 - 0.0546875) < 1e-9, f\"P(X ≥ 8) vaut (45 + 10 + 1) / 1024, soit environ 0,0547 (vous avez {p_au_moins_8:.4f}) ; pmf(8) ne donne que P(X = 8)\"",
      hint: "« Au moins 8 », c'est 8, 9 ou 10 : P(X ≥ 8) = P(X > 7) = stats.binom.sf(7, 10, 0.5).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Des temps de trajet suivent (pour l'exercice) une loi normale de moyenne **30 minutes** et d'écart-type **5 minutes**. Calculez la probabilité qu'un trajet dure **plus de 40 minutes** (`p_plus_40`), puis la durée que **95 %** des trajets ne dépassent pas (`duree_95`).",
      starter: lines("from scipy import stats", "", "p_plus_40 = None", "duree_95 = None"),
      solution: lines(
        "from scipy import stats",
        "",
        "loi = stats.norm(30, 5)",
        "p_plus_40 = loi.sf(40)",
        "duree_95 = loi.ppf(0.95)",
        "print(round(p_plus_40, 4), round(duree_95, 2))",
      ),
      test: lines(
        "assert p_plus_40 is not None and abs(p_plus_40 - 0.022750131948179195) < 1e-9, \"40 minutes, c'est deux écarts-types au-dessus de la moyenne : environ 2,3 % des trajets (utilisez sf)\"",
        "assert duree_95 is not None and abs(duree_95 - 38.22426813475736) < 1e-6, \"95 % des trajets durent moins d'environ 38,2 minutes (utilisez ppf(0.95))\"",
      ),
      hint: "loi = stats.norm(30, 5) ; loi.sf(40) pour « plus de 40 », loi.ppf(0.95) pour le quantile à 95 %.",
    },
    {
      kind: "text",
      md: `### Le théorème central limite, en simulation

Prenez une variable **pas du tout normale**, par exemple des durées très asymétriques (loi exponentielle). Tirez un échantillon de 30 valeurs et calculez sa moyenne. Recommencez 2 000 fois : les 2 000 **moyennes** forment une distribution en cloche, centrée sur la vraie moyenne, d'écart-type égal à l'écart-type de départ divisé par la racine de la taille de l'échantillon.

C'est le **théorème central limite**, et c'est lui qui justifie la plupart des intervalles de confiance et des tests sur des moyennes, même quand les données elles-mêmes ne sont pas normales (à condition que l'échantillon ne soit pas trop petit).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "rng = np.random.default_rng(0)",
        "donnees = rng.exponential(1, 5000)",
        "moyennes = rng.exponential(1, (2000, 30)).mean(axis=1)",
        "",
        "fig, (a, b) = plt.subplots(1, 2, figsize=(9, 3))",
        "a.hist(donnees, bins=50)",
        "a.set_title('Les données : très asymétriques')",
        "b.hist(moyennes, bins=40)",
        "b.set_title('2 000 moyennes de 30 valeurs : une cloche')",
        "plt.tight_layout()",
        "plt.show()",
        "print('écart-type des moyennes :', round(moyennes.std(), 3), ' théorie : 1 / racine(30) =', round(1 / np.sqrt(30), 3))",
      ),
      caption: "Écart-type observé des moyennes : environ 0,185, pour 0,183 attendu par la théorie.",
    },
  ],
  quiz: [
    {
      question: "Que dit la loi des grands nombres ?",
      options: [
        "Que les grands nombres sont plus probables",
        "Que la fréquence observée se rapproche de la probabilité quand le nombre de répétitions augmente",
        "Qu'après plusieurs 6, un autre chiffre devient plus probable",
        "Que toute variable devient normale",
      ],
      correct: 1,
      explanation: "Sur beaucoup de répétitions, la fréquence converge vers la probabilité. Elle ne dit rien d'un « rattrapage » à court terme : le dé n'a pas de mémoire.",
    },
    {
      question: "Avec scipy.stats, comment obtenir P(X > x) ?",
      options: ["pmf(x)", "cdf(x)", "sf(x)", "ppf(x)"],
      correct: 2,
      explanation: "sf (survival function) donne P(X > x), c'est-à-dire 1 - cdf(x), calculé avec plus de précision pour les petites probabilités.",
    },
    {
      question: "Que renvoie stats.norm.ppf(0.975) ?",
      options: ["0,975", "Environ 1,96", "Environ 0,025", "Environ 2,58"],
      correct: 1,
      explanation: "ppf est l'inverse de la cdf : 97,5 % de la loi normale centrée réduite se trouve sous 1,96, d'où les intervalles de confiance à 95 %.",
    },
    {
      question: "Que dit le théorème central limite ?",
      options: [
        "Que toutes les données sont normales",
        "Que la moyenne d'un échantillon suit approximativement une loi normale, même si les données ne le sont pas, quand l'échantillon est assez grand",
        "Que la médiane vaut toujours la moyenne",
        "Que l'écart-type ne dépend pas de la taille de l'échantillon",
      ],
      correct: 1,
      explanation: "La distribution des moyennes d'échantillons tend vers une loi normale, d'écart-type sigma divisé par racine de n. C'est la base de nombreux tests sur des moyennes.",
    },
  ],
};
