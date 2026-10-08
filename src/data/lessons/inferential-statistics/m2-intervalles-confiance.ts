import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module2: LessonModule = {
  id: "intervalles-confiance",
  title: "Intervalles de confiance",
  duration: "2 h",
  summary:
    "Passer d'une estimation à une fourchette : construire un intervalle avec la loi t, comprendre ce que « 95 % » promet vraiment (en le mesurant), dimensionner un échantillon, traiter une proportion et utiliser le bootstrap.",
  objectives: [
    "Construire un intervalle de confiance de la moyenne avec la loi t de Student, à la main et avec scipy",
    "Interpréter « confiance à 95 % » comme une propriété de la méthode, et la mesurer par simulation",
    "Prévoir l'effet de n, de la dispersion et du niveau sur la largeur, et dimensionner un échantillon",
    "Calculer un intervalle pour une proportion (Wald, Wilson) et un intervalle bootstrap",
  ],
  sections: [
    {
      kind: "text",
      md: `### D'une valeur à une fourchette

Le module précédent a montré qu'une moyenne d'échantillon varie, avec une erreur standard s/√n. Annoncer « la moyenne vaut 420,5 » sans rien dire de cette incertitude est trompeur. Un **intervalle de confiance** y remédie : c'est une fourchette construite à partir des données, de la forme **estimation ± marge d'erreur**.

Pour une moyenne, la marge est un multiple de l'erreur standard. Si σ était connu et les données normales, ce multiple serait 1,96 (le quantile 97,5 % de la loi normale) pour un niveau de 95 %. Mais on remplace σ par s, qui varie lui aussi d'un échantillon à l'autre : le rapport (x̄ − μ)/(s/√n) ne suit plus une loi normale mais, pour des données normales, une loi **t de Student** à n − 1 degrés de liberté, un peu plus étalée, aux queues plus lourdes. Le multiple à utiliser est donc le quantile de cette loi, plus grand que 1,96 pour de petits échantillons.`,
    },
    {
      kind: "equation",
      latex: String.raw`\bar{x} \;\pm\; t_{1-\alpha/2,\;n-1}\,\frac{s}{\sqrt{n}} \qquad \text{(niveau de confiance } 1-\alpha\text{)}`,
      caption: "Intervalle de confiance de la moyenne (loi t de Student)",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from scipy import stats",
        "",
        "print('degrés de liberté   quantile t (97,5 %)   quantile normal')",
        "for ddl in [2, 4, 9, 14, 29, 99, 999]:",
        "    print(f'{ddl:>17}   {stats.t.ppf(0.975, ddl):>19.3f}   {stats.norm.ppf(0.975):>15.3f}')",
      ),
      caption:
        "Avec 3 observations (2 degrés de liberté), il faut multiplier l'erreur standard par 4,3 et non par 1,96. Le quantile t rejoint le quantile normal quand n devient grand.",
    },
    {
      kind: "text",
      md: `### Un intervalle, à la main puis avec scipy

Quinze mesures du temps de chargement d'une page, en millisecondes (valeurs inventées pour l'exemple). On calcule la moyenne, l'erreur standard estimée, puis le quantile t à 14 degrés de liberté. \`stats.t.interval\` fait tout d'un coup. Pour comparer, on calcule aussi l'intervalle « avec 1,96 », trop étroit pour un si petit échantillon.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "temps = np.array([412, 388, 455, 401, 437, 392, 468, 420, 399, 431, 445, 409, 427, 384, 440])",
        "n = len(temps)",
        "moyenne = temps.mean()",
        "es = temps.std(ddof=1) / np.sqrt(n)",
        "t_crit = stats.t.ppf(0.975, n - 1)",
        "print(f'moyenne = {moyenne:.2f}   erreur standard = {es:.3f}   t critique = {t_crit:.4f}')",
        "print(f'à la main      : [{moyenne - t_crit * es:.2f} ; {moyenne + t_crit * es:.2f}]')",
        "bas, haut = stats.t.interval(0.95, n - 1, loc=moyenne, scale=es)",
        "print(f'stats.t.interval : [{bas:.2f} ; {haut:.2f}]')",
        "print(f'avec 1,96 (trop étroit) : [{moyenne - 1.96 * es:.2f} ; {moyenne + 1.96 * es:.2f}]')",
      ),
      caption: "Les deux méthodes donnent le même intervalle, [406,41 ; 434,65]. Utiliser 1,96 à la place du quantile t rétrécit l'intervalle de 2,4 ms au total.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Voici les délais de livraison, en jours, de 10 commandes (`delais`, valeurs inventées). Calculez l'**intervalle de confiance à 95 %** de la durée moyenne avec le quantile de la loi t, et rangez ses bornes dans `bas` et `haut`.",
      setup: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "delais = np.array([3.2, 2.8, 4.1, 3.6, 2.9, 3.8, 4.4, 3.1, 3.5, 3.9])",
      ),
      starter: lines("bas = None", "haut = None"),
      solution: lines(
        "n = len(delais)",
        "moyenne = delais.mean()",
        "es = delais.std(ddof=1) / np.sqrt(n)",
        "t_crit = stats.t.ppf(0.975, n - 1)",
        "bas = moyenne - t_crit * es",
        "haut = moyenne + t_crit * es",
        "print(round(bas, 3), round(haut, 3))",
      ),
      test: lines(
        "assert bas is not None and haut is not None, \"rangez les deux bornes dans bas et haut\"",
        "_bas, _haut = stats.t.interval(0.95, len(delais) - 1, loc=delais.mean(), scale=stats.sem(delais))",
        "assert abs(bas - _bas) < 1e-6 and abs(haut - _haut) < 1e-6, f\"attendu [{_bas:.3f} ; {_haut:.3f}] avec le quantile t à n - 1 = 9 degrés de liberté (stats.t.ppf(0.975, 9) vaut 2,262), vous avez [{bas:.3f} ; {haut:.3f}]\"",
      ),
      hint: "moyenne ± stats.t.ppf(0.975, n - 1) × delais.std(ddof=1) / np.sqrt(n). Le niveau 95 % laisse 2,5 % dans chaque queue, d'où 0,975.",
    },
    {
      kind: "text",
      md: `### Que veut dire « confiance à 95 % » ?

C'est la partie la plus mal comprise du cours. Le paramètre μ est une valeur **fixe**. C'est l'intervalle qui change d'un échantillon à l'autre. La méthode de construction est conçue pour que, **si l'on répétait l'échantillonnage un grand nombre de fois**, 95 % des intervalles obtenus contiennent μ. C'est une propriété de la **méthode**, appelée **couverture**.

Une fois l'intervalle calculé sur vos données, il contient μ ou il ne le contient pas : on ne sait pas lequel, et dire « il y a 95 % de chances que μ soit dans [406 ; 435] » n'est pas ce que l'on a démontré (l'approche bayésienne, au dernier module, donne un énoncé de ce genre, avec d'autres hypothèses).

Deux lectures erronées reviennent souvent, et une approximation courante mérite d'être mesurée. On simule une population normale de moyenne 100 et d'écart-type 20, des échantillons de 15 valeurs et 10 000 répétitions :

- « 95 % des **observations** sont dans l'intervalle » : non, il encadre la moyenne, pas les données ;
- « si je refais l'étude, 95 % des **nouvelles moyennes** tomberont dans l'intervalle » : non plus ;
- « avec 1,96 au lieu du quantile t, c'est pareil » (approximation) : pas pour de petits échantillons.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(7)",
        "mu, sigma, n, repetitions = 100, 20, 15, 10000",
        "x = rng.normal(mu, sigma, size=(repetitions, n))",
        "moyennes = x.mean(axis=1)",
        "es = x.std(axis=1, ddof=1) / np.sqrt(n)",
        "",
        "t_crit = stats.t.ppf(0.975, n - 1)",
        "bas, haut = moyennes - t_crit * es, moyennes + t_crit * es",
        "print(f'intervalles qui contiennent mu (quantile t) : {((bas <= mu) & (mu <= haut)).mean():.4f}')",
        "bas_z, haut_z = moyennes - 1.96 * es, moyennes + 1.96 * es",
        "print(f'intervalles qui contiennent mu (1,96)       : {((bas_z <= mu) & (mu <= haut_z)).mean():.4f}')",
        "",
        "dans = (x >= bas[:, None]) & (x <= haut[:, None])",
        "print(f'part des observations dans l’intervalle       : {dans.mean():.4f}')",
        "nouvelles = rng.normal(mu, sigma, size=(repetitions, n)).mean(axis=1)",
        "print(f'part des nouvelles moyennes dans l’intervalle : {((nouvelles >= bas) & (nouvelles <= haut)).mean():.4f}')",
      ),
      caption:
        "Le quantile t couvre μ dans 94,7 % des cas, très près des 95 % promis. Avec 1,96, la couverture tombe à 92,6 %. Les 95 % ne concernent pas les observations (41,5 % seulement tombent dans l'intervalle) ni les moyennes d'une étude de répétition (84,3 %).",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un intervalle de confiance de la moyenne n'est ni un intervalle de **prédiction** (où tombera la prochaine observation) ni un intervalle de **tolérance** (où se trouvent 95 % des valeurs). Ces deux-là sont bien plus larges, car ils contiennent la dispersion des données et pas seulement l'incertitude sur la moyenne.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "La méthode t suppose des données normales. Mesurez ce qui se passe avec des données **très asymétriques** : on a tiré 10 000 échantillons de 10 valeurs dans une loi exponentielle de vraie moyenne 1 (`echantillons`, une ligne par échantillon). Construisez pour chacun l'intervalle de confiance à 95 % avec le quantile t, et rangez dans `couverture` la **proportion d'intervalles qui contiennent la vraie moyenne 1**.",
      starter: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(8)",
        "n = 10",
        "echantillons = rng.exponential(1, size=(10000, n))  # vraie moyenne : 1",
        "couverture = None",
      ),
      solution: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(8)",
        "n = 10",
        "echantillons = rng.exponential(1, size=(10000, n))  # vraie moyenne : 1",
        "moyennes = echantillons.mean(axis=1)",
        "es = echantillons.std(axis=1, ddof=1) / np.sqrt(n)",
        "t_crit = stats.t.ppf(0.975, n - 1)",
        "contient = (moyennes - t_crit * es <= 1) & (1 <= moyennes + t_crit * es)",
        "couverture = contient.mean()",
        "print(round(couverture, 4))",
      ),
      test: lines(
        "assert couverture is not None, \"rangez la proportion d'intervalles qui contiennent 1 dans couverture\"",
        "assert 0.88 < couverture < 0.92, f\"avec des données exponentielles et n = 10, l'intervalle t couvre la vraie moyenne dans environ 90 % des cas, pas 95 % (vous avez {couverture:.3f})\"",
      ),
      hint: "Une moyenne et une erreur standard par ligne (axis=1, ddof=1). L'intervalle contient 1 si bas <= 1 et 1 <= haut ; la moyenne d'un tableau de booléens est une proportion.",
    },
    {
      kind: "note",
      tone: "info",
      md: "L'intervalle « à 95 % » ne couvre ici que 90 % des cas. Avec n = 30 et la même loi, on mesure 93,0 %, et avec n = 100, 94,4 % : la couverture s'améliore avec n, conformément au théorème central limite, sans jamais être garantie à n fixé quand les données sont fortement asymétriques.",
    },
    {
      kind: "text",
      md: `### De quoi dépend la largeur ?

La marge d'erreur vaut t × s/√n. Elle diminue avec n (en 1/√n), augmente avec la dispersion s, et augmente avec le niveau de confiance : on ne gagne pas de certitude gratuitement. Le tableau ci-dessous donne la marge pour s = 20.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from scipy import stats",
        "import numpy as np",
        "",
        "s = 20",
        "print('    n    niveau 90 %   niveau 95 %   niveau 99 %')",
        "for n in [10, 40, 160, 640]:",
        "    marges = [stats.t.ppf((1 + niveau) / 2, n - 1) * s / np.sqrt(n) for niveau in (0.90, 0.95, 0.99)]",
        "    print(f'{n:>5}   {marges[0]:>11.2f}   {marges[1]:>11.2f}   {marges[2]:>11.2f}')",
      ),
      caption:
        "Marge d'erreur (± ...) pour s = 20. Multiplier n par 4 divise la marge par un peu plus de 2. À n = 640, la marge à 99 % (2,04) est 1,3 fois celle à 95 % (1,55).",
    },
    {
      kind: "text",
      md: `### Choisir la taille de l'échantillon

On renverse la formule : pour obtenir une marge d'erreur m avec une confiance de 95 %, il faut environ n = (1,96 × σ / m)². Il faut un ordre de grandeur de σ, tiré d'une étude pilote ou de données antérieures. Par exemple, avec σ ≈ 10 et une marge souhaitée de 2 unités.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "sigma, marge = 10, 2",
        "n_normal = (stats.norm.ppf(0.975) * sigma / marge) ** 2",
        "print(f'approximation normale : n = {n_normal:.2f}, soit {int(np.ceil(n_normal))} observations')",
        "",
        "# avec le quantile t (qui dépend de n), on cherche le plus petit n qui convient",
        "n = 2",
        "while stats.t.ppf(0.975, n - 1) * sigma / np.sqrt(n) > marge:",
        "    n += 1",
        "print(f'avec la loi t : n = {n}')",
      ),
      caption: "L'approximation normale donne 97 observations ; la loi t en demande 99, parce que son quantile est un peu plus grand que 1,96.",
    },
    {
      kind: "text",
      md: `### Un intervalle pour une proportion

Pour une proportion p̂ = k/n (sondage, taux de conversion), l'erreur standard est √(p̂(1 − p̂)/n) et l'intervalle de **Wald** s'écrit comme pour la moyenne, avec 1,96. Il est simple, et fiable seulement quand n·p̂ et n·(1 − p̂) sont grands. Pour de petits effectifs ou des proportions proches de 0 ou 1, on préfère l'intervalle de **Wilson**, ou l'intervalle **exact** de Clopper-Pearson, tous deux disponibles dans \`stats.binomtest(k, n).proportion_ci(...)\`.`,
    },
    {
      kind: "equation",
      latex: String.raw`\hat{p} \;\pm\; z_{1-\alpha/2}\,\sqrt{\frac{\hat{p}\,(1-\hat{p})}{n}}`,
      caption: "Intervalle de Wald pour une proportion",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Dans un sondage fictif, 156 personnes sur 200 se déclarent favorables à une mesure. Calculez l'intervalle de **Wald à 95 %** de la proportion dans la population (z = `stats.norm.ppf(0.975)`) et rangez ses bornes dans `bas` et `haut`.",
      setup: lines("import numpy as np", "from scipy import stats"),
      starter: lines("bas = None", "haut = None"),
      solution: lines(
        "k, n = 156, 200",
        "p_chapeau = k / n",
        "es = np.sqrt(p_chapeau * (1 - p_chapeau) / n)",
        "z = stats.norm.ppf(0.975)",
        "bas = p_chapeau - z * es",
        "haut = p_chapeau + z * es",
        "print(round(es, 4), round(bas, 4), round(haut, 4))",
      ),
      test: lines(
        "assert bas is not None and haut is not None, \"rangez les deux bornes dans bas et haut\"",
        "assert abs(bas - 0.72259) < 1e-4 and abs(haut - 0.83741) < 1e-4, f\"p̂ = 0,78 ; erreur standard = racine(0,78 × 0,22 / 200) ≈ 0,0293 ; attendu [0,7226 ; 0,8374], vous avez [{bas:.4f} ; {haut:.4f}]\"",
      ),
      hint: "p̂ = 156/200. L'erreur standard est np.sqrt(p̂ × (1 - p̂) / n), et la marge vaut z fois cette erreur.",
    },
    {
      kind: "text",
      md: `Comparons les trois méthodes sur ce sondage, puis mesurons leur couverture réelle pour de petits échantillons. Comme le nombre de succès k est un entier, on peut calculer la couverture **exactement** sans simuler : on passe en revue chaque valeur possible de k, on construit l'intervalle correspondant, et on additionne la probabilité binomiale des k dont l'intervalle contient la vraie proportion p.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "k, n = 156, 200",
        "test = stats.binomtest(k, n)",
        "p_hat = k / n",
        "marge = 1.96 * np.sqrt(p_hat * (1 - p_hat) / n)",
        "print(f'Wald    : [{p_hat - marge:.4f} ; {p_hat + marge:.4f}]')",
        "for methode in ['wilson', 'exact']:",
        "    ic = test.proportion_ci(0.95, method=methode)",
        "    print(f'{methode:<8}: [{ic.low:.4f} ; {ic.high:.4f}]')",
        "",
        "def couverture(p, n, methode):",
        "    total = 0.0",
        "    for k in range(n + 1):",
        "        if methode == 'wald':",
        "            ph = k / n",
        "            marge = 1.96 * np.sqrt(ph * (1 - ph) / n)",
        "            bas, haut = ph - marge, ph + marge",
        "        else:",
        "            ic = stats.binomtest(k, n).proportion_ci(0.95, method=methode)",
        "            bas, haut = ic.low, ic.high",
        "        if bas <= p <= haut:",
        "            total += stats.binom.pmf(k, n, p)",
        "    return total",
        "",
        "print()",
        "print('couverture exacte pour n = 30 (cible : 0,95)')",
        "print('     p      Wald   Wilson    exact')",
        "for p in [0.02, 0.05, 0.1, 0.3, 0.5]:",
        "    c = [couverture(p, 30, m) for m in ('wald', 'wilson', 'exact')]",
        "    print(f'{p:>6}   {c[0]:.3f}    {c[1]:.3f}    {c[2]:.3f}')",
      ),
      caption:
        "Sur le sondage, les trois intervalles se ressemblent. Pour n = 30 et p = 0,02, l'intervalle de Wald ne couvre p que dans 45,4 % des cas, et 78,2 % pour p = 0,05, bien loin des 95 % annoncés. Wilson reste près de 95 % (entre 0,930 et 0,978 ici), et l'intervalle exact est prudent : il couvre toujours au moins 95 %.",
    },
    {
      kind: "text",
      md: `### Le bootstrap : un intervalle sans formule

Pour la médiane, l'écart interquartile ou un coefficient quelconque, il n'existe pas toujours de formule simple d'erreur standard. Le **bootstrap** en fournit une approximation : on traite l'échantillon comme s'il était la population, on en tire avec remise 5 000 échantillons de même taille, on calcule la statistique sur chacun, et l'on prend les quantiles 2,5 % et 97,5 % des 5 000 valeurs (méthode des percentiles).

Il n'est pas magique : il hérite des défauts de l'échantillon de départ et fonctionne mal avec de très petits échantillons ou pour des statistiques extrêmes (le maximum, par exemple). Mais il est précieux, car il ne suppose pas de loi normale.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "temps = np.array([412, 388, 455, 401, 437, 392, 468, 420, 399, 431, 445, 409, 427, 384, 440])  # mêmes mesures inventées qu'au-dessus",
        "rng = np.random.default_rng(9)",
        "reechantillons = rng.choice(temps, size=(5000, len(temps)))  # tirages avec remise",
        "",
        "medianes = np.median(reechantillons, axis=1)",
        "bas, haut = np.percentile(medianes, [2.5, 97.5])",
        "print(f'médiane observée : {np.median(temps):.0f}   intervalle bootstrap à 95 % : [{bas:.0f} ; {haut:.0f}]')",
        "",
        "moyennes = reechantillons.mean(axis=1)",
        "print(f'erreur standard de la moyenne : bootstrap {moyennes.std():.2f}, formule {temps.std(ddof=1) / np.sqrt(len(temps)):.2f}')",
      ),
      caption:
        "Médiane observée 420 ms, intervalle bootstrap [401 ; 440]. Pour la moyenne, où l'on dispose de la formule, le bootstrap donne une erreur standard de 6,28 contre 6,58 : proche, mais un peu plus petite, car le bootstrap s'appuie sur un écart-type qui divise par n et non par n − 1.",
    },
  ],
  quiz: [
    {
      question: "Un intervalle de confiance à 95 % de la moyenne vaut [406 ; 435]. Quelle phrase est exacte ?",
      options: [
        "95 % des observations sont comprises entre 406 et 435",
        "Il y a 95 % de chances que la vraie moyenne soit entre 406 et 435, quelles que soient les données",
        "La méthode utilisée produit un intervalle qui contient la vraie moyenne dans 95 % des échantillons possibles",
        "95 % des futures moyennes tomberont entre 406 et 435",
      ],
      correct: 2,
      explanation:
        "Le niveau de confiance est la couverture de la méthode sur des échantillons répétés. Dans la simulation du module, 41,5 % seulement des observations tombent dans l'intervalle de la moyenne, et 84,3 % des moyennes d'une étude de répétition.",
    },
    {
      question: "Pourquoi utilise-t-on le quantile de la loi t plutôt que 1,96 pour une moyenne ?",
      options: [
        "Parce que les données sont toujours normales",
        "Parce que σ est remplacé par s, qui varie d'un échantillon à l'autre, ce qui élargit les queues de la loi",
        "Parce que la loi t est plus simple à calculer",
        "Pour que l'intervalle soit plus étroit",
      ],
      correct: 1,
      explanation:
        "Remplacer σ par s ajoute de l'incertitude : la loi t, plus étalée, en tient compte. À 14 degrés de liberté le quantile vaut 2,145 contre 1,96, et la couverture de l'intervalle avec 1,96 tombe à 92,6 % (n = 15).",
    },
    {
      question: "Pour diviser par deux la marge d'erreur d'un intervalle de confiance, à niveau et dispersion fixés, il faut :",
      options: ["Doubler n", "Multiplier n par 4", "Passer de 95 % à 90 % de confiance", "Ajouter 2 observations"],
      correct: 1,
      explanation: "La marge est proportionnelle à 1/√n : la diviser par 2 demande un échantillon quatre fois plus grand.",
    },
    {
      question: "Passer d'un niveau de confiance de 95 % à 99 %, avec les mêmes données, donne :",
      options: ["Un intervalle plus étroit", "Un intervalle plus large", "Un intervalle identique", "Un intervalle décalé mais de même largeur"],
      correct: 1,
      explanation: "Pour être plus sûr de couvrir le paramètre, la méthode doit prendre un intervalle plus large : on ne gagne pas de confiance sans perdre en précision.",
    },
    {
      question: "Avec n = 30 et une proportion vraie p = 0,02, que dit la simulation exacte de la couverture de l'intervalle de Wald à 95 % ?",
      options: [
        "Il couvre p dans environ 95 % des cas",
        "Il couvre p dans environ 45 % des cas : à éviter pour de petits effectifs et des proportions extrêmes",
        "Il couvre toujours p",
        "Il est identique à l'intervalle de Wilson",
      ],
      correct: 1,
      explanation:
        "Pour n = 30 et p = 0,02, l'approximation normale est mauvaise (n·p = 0,6 succès attendu). La couverture exacte de Wald est de 0,454, celle de Wilson de 0,978.",
    },
  ],
};
