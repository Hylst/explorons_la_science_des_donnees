import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module1: LessonModule = {
  id: "echantillonnage",
  title: "Échantillons et estimateurs",
  duration: "2 h",
  summary:
    "Pourquoi une estimation varie d'un échantillon à l'autre, comment mesurer cette variation (l'erreur standard), ce qu'est un biais, et ce que le théorème central limite garantit vraiment.",
  objectives: [
    "Distinguer population et échantillon, paramètre, statistique, estimateur et estimation",
    "Mesurer par simulation la variabilité d'une moyenne et la relier à l'erreur standard σ/√n",
    "Expliquer pourquoi la variance d'échantillon divise par n − 1 (biais d'un estimateur)",
    "Observer le théorème central limite, y compris ses limites, et reconnaître un échantillon biaisé",
  ],
  sections: [
    {
      kind: "text",
      md: `### De l'échantillon à la population

On voudrait connaître la durée moyenne des trajets de tous les clients d'un service, la proportion de tous les électeurs favorables à une mesure, l'efficacité d'un traitement sur tous les patients possibles. On n'observe jamais tout le monde : on observe un **échantillon**, et on en déduit quelque chose sur la **population**. Cette déduction s'appelle l'**inférence statistique**.

Le vocabulaire se précise ainsi :

- un **paramètre** décrit la population : la moyenne μ, l'écart-type σ, une proportion p. Il est fixe et inconnu ;
- une **statistique** se calcule sur l'échantillon : la moyenne x̄, l'écart-type s, une proportion p̂ ;
- un **estimateur** est la règle de calcul (« faire la moyenne des valeurs ») ; une **estimation** est la valeur qu'il donne sur un échantillon précis.

L'idée qui organise tout le cours tient en une phrase : **un autre échantillon aurait donné une autre estimation**. Une statistique est donc elle-même une quantité aléatoire, qui a sa propre distribution, la **distribution d'échantillonnage**. Faire de l'inférence, c'est mesurer à quel point l'estimation peut varier, pour ne pas lui faire dire plus que ce qu'elle sait.

Ce cours est le pendant conceptuel du cours *Statistiques appliquées*, qui montre comment lancer les tests avec scipy sur des données réelles. Ici, on cherche à comprendre pourquoi ces tests fonctionnent, surtout en **simulant** : tirer des milliers d'échantillons est la façon la plus honnête de voir ce que les formules promettent. Il suppose connues la moyenne, l'écart-type et la loi normale (voir *Probabilités en pratique*).`,
    },
    {
      kind: "text",
      md: `### Une population dont on connaît tout

Pour voir la variation d'échantillonnage, il faut une population dont on connaît le paramètre. Nous allons faire semblant : les 442 valeurs de « progression de la maladie » du jeu *diabetes* de scikit-learn seront **toute** la population. En pratique ce sont déjà des mesures d'un échantillon de patients ; l'exercice de pensée est volontairement artificiel, mais il permet de comparer chaque estimation à la vraie valeur de μ.

On tire ensuite des échantillons de 30 valeurs, **avec remise** : chaque tirage est alors indépendant des autres, ce qui est l'hypothèse de toutes les formules du cours.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "from sklearn.datasets import load_diabetes",
        "",
        "population = load_diabetes(as_frame=True, scaled=False).frame['target'].to_numpy()",
        "mu = population.mean()",
        "sigma = population.std()  # population entière : on divise par N, ddof=0",
        "print(f'population : {len(population)} valeurs, mu = {mu:.2f}, sigma = {sigma:.2f}')",
        "",
        "rng = np.random.default_rng(1)",
        "for i in range(5):",
        "    echantillon = rng.choice(population, size=30)",
        "    print(f'échantillon {i + 1} : moyenne = {echantillon.mean():6.1f}   écart-type = {echantillon.std(ddof=1):5.1f}')",
      ),
      caption:
        "Cinq échantillons de 30 valeurs, cinq moyennes différentes, toutes voisines de μ mais aucune égale. Changez la graine : vous obtiendrez d'autres moyennes.",
    },
    {
      kind: "text",
      md: `### L'erreur standard

La moyenne d'un échantillon de n valeurs a une distribution d'échantillonnage dont la **moyenne est μ** (la moyenne d'échantillon est un estimateur sans biais de μ) et dont l'**écart-type** est σ/√n. On l'appelle l'**erreur standard** de la moyenne.

Deux conséquences immédiates : plus les données sont dispersées (σ grand), moins la moyenne est précise ; plus l'échantillon est grand, plus elle l'est, mais lentement, à la vitesse de √n. En pratique σ est inconnu : on le remplace par s, et l'on parle d'erreur standard **estimée**.`,
    },
    { kind: "equation", latex: String.raw`\mathrm{ES}(\bar{X}) = \frac{\sigma}{\sqrt{n}} \qquad \text{estimée par} \qquad \frac{s}{\sqrt{n}}`, caption: "Erreur standard de la moyenne" },
    {
      kind: "text",
      md: `Vérifions-le sur la population précédente : pour chaque taille d'échantillon n, on tire 10 000 échantillons, on calcule leurs moyennes, puis l'écart-type de ces 10 000 moyennes, qu'on compare à σ/√n.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "from sklearn.datasets import load_diabetes",
        "",
        "population = load_diabetes(as_frame=True, scaled=False).frame['target'].to_numpy()",
        "sigma = population.std()",
        "",
        "rng = np.random.default_rng(2)",
        "print('   n   écart-type des moyennes   sigma / racine(n)')",
        "for n in [10, 40, 160, 640]:",
        "    moyennes = rng.choice(population, size=(10000, n)).mean(axis=1)",
        "    print(f'{n:>4}   {moyennes.std():>20.2f}   {sigma / np.sqrt(n):>17.2f}')",
      ),
      caption:
        "L'écart-type des moyennes suit σ/√n de très près. Chaque fois que n est multiplié par 4, il est divisé par 2 : pour gagner un chiffre de précision, il faut cent fois plus de données.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Ne confondez pas **écart-type** et **erreur standard**. L'écart-type s décrit la dispersion des *données* ; il ne diminue pas quand on en ajoute. L'erreur standard s/√n décrit la dispersion de l'*estimation* de la moyenne ; elle diminue avec n.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Un serveur a répondu à 12 requêtes en `mesures` (temps en millisecondes, valeurs inventées pour l'exercice). Calculez l'**erreur standard estimée** de leur moyenne, s/√n, et rangez-la dans `erreur_standard`. Attention à l'écart-type : celui de NumPy divise par n par défaut.",
      setup: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "mesures = np.array([12.1, 9.8, 11.4, 13.0, 10.2, 12.6, 11.1, 9.5, 12.9, 10.8, 11.7, 10.4])",
      ),
      starter: "erreur_standard = None",
      solution: lines(
        "n = len(mesures)",
        "s = mesures.std(ddof=1)  # écart-type d'échantillon : on divise par n - 1",
        "erreur_standard = s / np.sqrt(n)",
        "print(round(erreur_standard, 3))",
      ),
      test: lines(
        "assert erreur_standard is not None, \"rangez l'erreur standard dans erreur_standard\"",
        "_attendu = mesures.std(ddof=1) / np.sqrt(len(mesures))",
        "assert abs(erreur_standard - _attendu) < 1e-9, f\"s / racine(n) avec s calculé en divisant par n - 1 (ddof=1) : {_attendu:.4f} attendu, {erreur_standard:.4f} obtenu\"",
      ),
      hint: "mesures.std(ddof=1) donne s ; divisez par np.sqrt(len(mesures)). stats.sem(mesures) fait le même calcul.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Avec n = 64 valeurs, l'erreur standard d'une moyenne vaut 1,5. Combien de valeurs faut-il pour la ramener à 0,5 ? Déduisez d'abord σ de σ/√n = 1,5, puis rangez le nombre de valeurs dans `n_necessaire`.",
      starter: lines("import numpy as np", "", "n_necessaire = None"),
      solution: lines(
        "import numpy as np",
        "",
        "sigma = 1.5 * np.sqrt(64)  # 12",
        "n_necessaire = int(round((sigma / 0.5) ** 2))",
        "print(sigma, n_necessaire)",
      ),
      test: lines(
        "assert n_necessaire is not None, \"rangez le nombre de valeurs dans n_necessaire\"",
        "assert n_necessaire == 576, f\"σ vaut 1,5 × 8 = 12 ; il faut n = (σ / 0,5)² = 576 valeurs (vous avez {n_necessaire})\"",
      ),
      hint: "σ = ES × √n = 1,5 × 8. Puis n = (σ / ES souhaitée)². Diviser l'erreur standard par 3 coûte 9 fois plus de données.",
    },
    {
      kind: "text",
      md: `### Biais et variance d'un estimateur

Un bon estimateur se juge sur deux qualités :

- il est **sans biais** si, en moyenne sur tous les échantillons possibles, il tombe sur le paramètre visé ;
- il a une **variance** faible si ses valeurs d'un échantillon à l'autre restent groupées (l'erreur standard en est la mesure pour une moyenne).

Le cas classique est celui de la variance. Calculée sur un échantillon, \`np.var\` divise par n par défaut, mais les écarts sont mesurés autour de x̄, qui est justement la valeur la plus proche des données : les écarts sont donc un peu trop petits, et la variance **sous-estimée**. Diviser par n − 1 compense exactement ce défaut en moyenne. C'est le sens de \`ddof=1\` (« delta degrees of freedom »).`,
    },
    {
      kind: "equation",
      latex: String.raw`s^2 = \frac{1}{n-1}\sum_{i=1}^{n}\left(x_i - \bar{x}\right)^2 \qquad \text{avec} \qquad \mathbb{E}\!\left[s^2\right] = \sigma^2`,
      caption: "Variance d'échantillon : sans biais pour la variance de la population",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(3)",
        "# 20 000 échantillons de 5 valeurs, population normale d'écart-type 2 : variance vraie = 4",
        "echantillons = rng.normal(50, 2, size=(20000, 5))",
        "print('variance vraie                       : 4')",
        "print('moyenne des variances (divisé par n)   :', round(echantillons.var(axis=1, ddof=0).mean(), 3))",
        "print('moyenne des variances (divisé par n-1) :', round(echantillons.var(axis=1, ddof=1).mean(), 3))",
        "print('moyenne des écarts-types (n-1)         :', round(echantillons.std(axis=1, ddof=1).mean(), 3), ' (vrai : 2)')",
      ),
      caption:
        "Diviser par n sous-estime la variance de 20 % ici (le facteur théorique est (n − 1)/n = 0,8 pour n = 5). Diviser par n − 1 la rend juste en moyenne. Mais l'écart-type s, lui, reste un peu trop petit : la racine carrée d'une moyenne n'est pas la moyenne des racines.",
    },
    {
      kind: "text",
      md: `Le biais n'est pas tout. La moyenne et la médiane sont toutes deux des estimateurs sans biais du centre d'une loi normale, et pourtant la moyenne est plus précise. C'est ce que l'exercice suivant mesure.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "On a tiré 5 000 échantillons de 25 valeurs dans une loi normale centrée réduite (`echantillons`, une ligne par échantillon). Calculez l'écart-type, d'un échantillon à l'autre, de la **moyenne** (`sd_moyenne`) puis de la **médiane** (`sd_mediane`). Lequel des deux estimateurs varie le moins ?",
      starter: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(11)",
        "echantillons = rng.normal(0, 1, size=(5000, 25))",
        "sd_moyenne = None",
        "sd_mediane = None",
      ),
      solution: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(11)",
        "echantillons = rng.normal(0, 1, size=(5000, 25))",
        "moyennes = echantillons.mean(axis=1)",
        "medianes = np.median(echantillons, axis=1)",
        "sd_moyenne = moyennes.std()",
        "sd_mediane = medianes.std()",
        "print(round(sd_moyenne, 3), round(sd_mediane, 3))",
      ),
      test: lines(
        "assert sd_moyenne is not None and sd_mediane is not None, \"rangez les deux écarts-types dans sd_moyenne et sd_mediane\"",
        "assert 0.18 < sd_moyenne < 0.22, f\"l'écart-type des moyennes doit être proche de 1 / racine(25) = 0,2 (vous avez {sd_moyenne:.3f})\"",
        "assert 0.22 < sd_mediane < 0.28, f\"l'écart-type des médianes est autour de 0,25 (vous avez {sd_mediane:.3f}) : np.median(..., axis=1)\"",
        "assert sd_moyenne < sd_mediane, \"sur des données normales, la moyenne varie moins que la médiane\"",
      ),
      hint: "echantillons.mean(axis=1) donne une moyenne par ligne ; np.median(echantillons, axis=1) une médiane par ligne. Prenez ensuite .std() de chaque vecteur.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Sur des données normales, l'écart-type de la médiane (0,25 ici) dépasse d'environ 25 % celui de la moyenne (0,20). Cela ne veut pas dire « toujours la moyenne » : avec des valeurs atypiques ou des queues lourdes, la médiane devient l'estimateur le plus stable (voir *Statistiques appliquées*, module 1).",
    },
    {
      kind: "text",
      md: `### Le théorème central limite

Le théorème central limite (TCL) dit que, pour des valeurs indépendantes de même loi, de moyenne μ et d'écart-type σ finis, la moyenne standardisée tend vers une loi normale centrée réduite quand n grandit, **quelle que soit la loi des données**.`,
    },
    {
      kind: "equation",
      latex: String.raw`Z_n = \frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \;\xrightarrow[n\to\infty]{\text{loi}}\; \mathcal{N}(0,\,1)`,
      caption: "Théorème central limite",
    },
    {
      kind: "text",
      md: `Le théorème parle d'une limite, pas d'un seuil. Pour savoir à partir de quel n l'approximation normale est correcte, il faut regarder. Prenons des données volontairement très asymétriques (loi exponentielle, d'asymétrie 2) et regardons la distribution des moyennes pour n = 2, 5, 30 et 200. On mesure l'asymétrie de la distribution des moyennes et la part des moyennes standardisées qui dépassent 1,96 de chaque côté : pour une loi normale, 2,5 % de chaque côté.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(5)",
        "fig, axes = plt.subplots(1, 4, figsize=(11, 2.8))",
        "print('   n   asymétrie   (théorie 2/racine(n))   queue haute   queue basse')",
        "for ax, n in zip(axes, [2, 5, 30, 200]):",
        "    moyennes = rng.exponential(1, size=(20000, n)).mean(axis=1)  # vraie moyenne 1, vrai écart-type 1",
        "    z = (moyennes - 1) / (1 / np.sqrt(n))",
        "    print(f'{n:>4}   {stats.skew(moyennes):>9.2f}   {2 / np.sqrt(n):>20.2f}   {(z > 1.96).mean():>11.4f}   {(z < -1.96).mean():>11.4f}')",
        "    ax.hist(moyennes, bins=40)",
        "    ax.set_title(f'n = {n}')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption:
        "La distribution des moyennes devient symétrique et en cloche, mais lentement. À n = 30, l'asymétrie vaut encore 0,38 et la queue haute contient 3,6 % des moyennes contre 1,4 % pour la queue basse (2,5 % de chaque côté pour une loi normale). L'asymétrie de la moyenne décroît comme 2/√n.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "« n ≥ 30 » est une règle empirique, pas un théorème. Plus les données sont asymétriques ou ont des valeurs extrêmes, plus il faut de valeurs. Les modules suivants mesurent les conséquences sur les intervalles de confiance et sur les tests.",
    },
    {
      kind: "text",
      md: `### Un échantillon doit être représentatif

Toutes les formules précédentes supposent des tirages **aléatoires et indépendants**. Si l'échantillon est sélectionné d'une façon qui dépend de ce qu'on mesure, la précision (qui augmente avec n) n'arrange rien : on estime très précisément... la mauvaise quantité.

Simulons 100 000 durées de session (en minutes, valeurs fictives) et un sondage **volontaire** : plus une session est longue, plus l'utilisateur a de chances de répondre. Comparons-le à un petit échantillon aléatoire.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(6)",
        "duree = rng.exponential(10, 100000)  # minutes, population fictive",
        "print(f'vraie moyenne                    : {duree.mean():.2f}')",
        "",
        "aleatoire = rng.choice(duree, 50)",
        "es = aleatoire.std(ddof=1) / np.sqrt(len(aleatoire))",
        "print(f'échantillon aléatoire (n = 50)  : {aleatoire.mean():.2f}   erreur standard {es:.2f}')",
        "",
        "# sondage volontaire : la probabilité de répondre est proportionnelle à la durée",
        "repond = rng.random(duree.size) < duree / duree.max()",
        "volontaires = duree[repond]",
        "es = volontaires.std(ddof=1) / np.sqrt(len(volontaires))",
        "print(f'sondage volontaire (n = {len(volontaires)}) : {volontaires.mean():.2f}   erreur standard {es:.2f}')",
      ),
      caption:
        "Le sondage volontaire rassemble près de 190 fois plus de réponses et affiche une erreur standard minuscule, mais il surestime la durée moyenne d'un facteur deux (19,89 minutes au lieu de 10,03). L'erreur standard ne mesure que le hasard d'échantillonnage, jamais un biais de sélection.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Avant tout calcul, posez-vous la question : comment ces données sont-elles arrivées jusqu'à moi ? Un sondage où seuls les motivés répondent, des clients encore abonnés (ceux qui sont partis ont disparu), une période inhabituelle : aucune formule ne corrige un échantillon mal choisi.",
    },
  ],
  quiz: [
    {
      question: "Que mesure l'erreur standard de la moyenne, σ/√n ?",
      options: [
        "La dispersion des données autour de leur moyenne",
        "La dispersion de la moyenne d'échantillon d'un échantillon à l'autre",
        "L'erreur commise sur chaque observation",
        "La probabilité que la moyenne soit fausse",
      ],
      correct: 1,
      explanation:
        "L'écart-type décrit la dispersion des observations ; l'erreur standard décrit celle de l'estimation de la moyenne, c'est-à-dire l'écart-type de la distribution d'échantillonnage de x̄.",
    },
    {
      question: "Pour diviser l'erreur standard d'une moyenne par 2, il faut :",
      options: ["Doubler la taille de l'échantillon", "Multiplier la taille de l'échantillon par 4", "Multiplier la taille par 2,5 environ", "Ajouter 30 observations"],
      correct: 1,
      explanation: "L'erreur standard est proportionnelle à 1/√n : pour la diviser par 2, il faut √n deux fois plus grand, donc n quatre fois plus grand.",
    },
    {
      question: "Pourquoi la variance d'échantillon divise-t-elle par n − 1 plutôt que par n ?",
      options: [
        "Pour éviter une division par zéro",
        "Parce que les écarts sont mesurés autour de x̄, calculé sur les mêmes données : diviser par n sous-estimerait la variance en moyenne",
        "Parce qu'on perd une observation à chaque calcul",
        "Parce que la loi normale l'exige",
      ],
      correct: 1,
      explanation:
        "x̄ est plus proche des données que ne l'est μ, donc la somme des carrés des écarts est trop petite. Diviser par n − 1 corrige exactement ce biais pour la variance (la simulation donne 3,99 au lieu de 3,19 pour une variance vraie de 4).",
    },
    {
      question: "Que garantit le théorème central limite ?",
      options: [
        "Que les données elles-mêmes deviennent normales quand on en a beaucoup",
        "Que la distribution de la moyenne tend vers une loi normale quand n grandit, sans dire à quelle vitesse",
        "Qu'un échantillon de 30 valeurs suffit toujours",
        "Que la moyenne est toujours égale à la médiane",
      ],
      correct: 1,
      explanation:
        "Le TCL concerne la distribution de la moyenne, pas celle des données, et c'est un résultat limite : la vitesse de convergence dépend de la forme des données (asymétrie en 1/√n, par exemple).",
    },
    {
      question: "Un sondage volontaire réunit 10 000 réponses. Que peut-on dire de sa précision ?",
      options: [
        "Elle est excellente, car n est grand",
        "L'erreur standard sera petite, mais l'estimation peut rester fausse si les répondants ne représentent pas la population",
        "Elle est nulle, un sondage volontaire est toujours inutilisable",
        "Elle est identique à celle d'un échantillon aléatoire de 10 000 personnes",
      ],
      correct: 1,
      explanation:
        "L'erreur standard ne mesure que la variation due au hasard du tirage. Un biais de sélection déplace l'estimation sans changer l'erreur standard : un grand échantillon biaisé est précisément faux.",
    },
  ],
};
