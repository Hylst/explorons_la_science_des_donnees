import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module6: LessonModule = {
  id: "approche-bayesienne",
  title: "L'approche bayésienne",
  duration: "2 h",
  summary:
    "Le théorème de Bayes appliqué à un test diagnostique, puis à l'estimation d'une proportion avec une loi a priori Beta : loi a posteriori, intervalle crédible, effet de l'a priori, comparaison avec l'intervalle de confiance et test A/B bayésien.",
  objectives: [
    "Appliquer le théorème de Bayes et comprendre le rôle de la prévalence (taux de base) dans un test diagnostique",
    "Mettre à jour une loi a priori Beta avec des données binomiales (conjugaison) et lire la loi a posteriori",
    "Calculer un intervalle crédible et une probabilité a posteriori avec scipy.stats.beta",
    "Distinguer intervalle crédible et intervalle de confiance, mesurer l'effet de l'a priori, comparer deux taux par simulation",
  ],
  sections: [
    {
      kind: "text",
      md: `### Deux façons de raisonner

Jusqu'ici, le paramètre (μ, p) était une valeur **fixe** et inconnue, et c'étaient les données qui variaient d'un échantillon à l'autre. Les intervalles de confiance et les p-values sont des énoncés sur ce qui se passerait **si l'on répétait l'échantillonnage**.

L'approche **bayésienne** garde le même modèle des données, mais décrit l'**incertitude sur le paramètre lui-même** par une loi de probabilité. On part d'une loi **a priori** (ce que l'on pensait avant), on la met à jour avec les données (la **vraisemblance**) et l'on obtient une loi **a posteriori** (ce que l'on pense après). Le résultat est un énoncé direct comme « compte tenu des données et de l'a priori, la proportion est entre 0,72 et 0,83 avec une probabilité de 95 % ».

Les deux approches sont rigoureuses, et répondent à des questions différentes. Elles s'accordent souvent en pratique quand les données sont abondantes. Le moteur de la mise à jour est le théorème de Bayes.`,
    },
    {
      kind: "equation",
      latex: String.raw`\underbrace{P(H \mid D)}_{\text{a posteriori}} \;=\; \frac{\overbrace{P(D \mid H)}^{\text{vraisemblance}}\;\;\overbrace{P(H)}^{\text{a priori}}}{\underbrace{P(D)}_{\text{probabilité des données}}}`,
      caption: "Théorème de Bayes : H est une hypothèse (ou un paramètre), D les données observées",
    },
    {
      kind: "text",
      md: `### Un test diagnostique : l'importance du taux de base

Une maladie touche 1 % d'une population (la **prévalence**). Un test la détecte chez 95 % des malades (**sensibilité**) et donne un résultat négatif chez 95 % des personnes saines (**spécificité**). Un patient est testé positif : quelle est la probabilité qu'il soit malade ? Beaucoup répondent « environ 95 % », parce qu'ils confondent P(positif | malade) et P(malade | positif). Le raisonnement en effectifs (« fréquences naturelles ») rend la réponse presque évidente.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "prevalence, sensibilite, specificite = 0.01, 0.95, 0.95",
        "",
        "# en fréquences naturelles : 10 000 personnes",
        "population = 10000",
        "malades = population * prevalence",
        "sains = population - malades",
        "vrais_positifs = malades * sensibilite",
        "faux_positifs = sains * (1 - specificite)",
        "print(f'{malades:.0f} malades, dont {vrais_positifs:.0f} testés positifs')",
        "print(f'{sains:.0f} personnes saines, dont {faux_positifs:.0f} testées positives à tort')",
        "print(f'parmi les {vrais_positifs + faux_positifs:.0f} positifs, la part de malades est {vrais_positifs / (vrais_positifs + faux_positifs):.3f}')",
        "",
        "# même calcul avec la formule de Bayes",
        "p_positif = sensibilite * prevalence + (1 - specificite) * (1 - prevalence)",
        "print(f'P(positif) = {p_positif:.3f}   P(malade | positif) = {sensibilite * prevalence / p_positif:.3f}')",
      ),
      caption:
        "Malgré un test à 95 % dans les deux sens, un positif n'est malade que dans 16,1 % des cas : les 495 faux positifs des personnes saines (très nombreuses) dépassent largement les 95 vrais positifs. L'a priori (la prévalence) pèse autant que la précision du test.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez la fonction `proba_malade(prevalence, sensibilite, specificite)` qui renvoie P(malade | test positif) avec le théorème de Bayes. Utilisez-la pour un test dont la sensibilité est de 90 % et la spécificité de 95 %, dans une population où la prévalence est de 2 %, et rangez le résultat dans `p_malade`.",
      starter: lines(
        "def proba_malade(prevalence, sensibilite, specificite):",
        "    # à compléter : P(malade | positif)",
        "    return None",
        "",
        "p_malade = None",
      ),
      solution: lines(
        "def proba_malade(prevalence, sensibilite, specificite):",
        "    p_positif = sensibilite * prevalence + (1 - specificite) * (1 - prevalence)",
        "    return sensibilite * prevalence / p_positif",
        "",
        "p_malade = proba_malade(0.02, 0.90, 0.95)",
        "print(round(p_malade, 4))",
      ),
      test: lines(
        "_valeur = proba_malade(0.02, 0.90, 0.95)",
        "assert _valeur is not None, \"la fonction proba_malade doit renvoyer un nombre\"",
        "assert abs(_valeur - 0.268657) < 1e-5, f\"P(positif) = 0,90 × 0,02 + 0,05 × 0,98 = 0,067 et P(malade | positif) = 0,018 / 0,067 ≈ 0,269 (la fonction renvoie {_valeur:.4f})\"",
        "assert abs(proba_malade(0.5, 0.9, 0.9) - 0.9) < 1e-9, \"quand la moitié de la population est malade, un test à 90 % dans les deux sens donne 0,9\"",
        "assert p_malade is not None and abs(p_malade - 0.268657) < 1e-5, \"rangez dans p_malade le résultat pour une prévalence de 2 %\"",
      ),
      hint: "P(positif) = sensibilité × prévalence + (1 − spécificité) × (1 − prévalence). Le résultat est sensibilité × prévalence / P(positif).",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le résultat est le même raisonnement que celui du module 5 : une « découverte » significative est un test positif, et la part de vraies découvertes dépend de la proportion d'hypothèses vraies avant le test (le taux de base), pas seulement de α et de la puissance.",
    },
    {
      kind: "text",
      md: `### Estimer une proportion : le modèle Beta-Binomiale

Reprenons une proportion p inconnue (taux de conversion, part d'avis favorables) estimée à partir de k succès sur n essais. Le nombre de succès suit une loi binomiale (n ; p). Comme loi a priori de p, qui vit entre 0 et 1, la loi **Beta(a ; b)** est un choix naturel : elle prend des formes très variées sur [0 ; 1]. Et surtout, mettre à jour une Beta avec des données binomiales donne **encore une Beta**, dont les paramètres s'additionnent : on dit que la loi Beta est **conjuguée** de la loi binomiale.`,
    },
    {
      kind: "equation",
      latex: String.raw`p \sim \mathrm{Beta}(a,\,b) \;\;\xrightarrow{\;\;k \text{ succès, } n-k \text{ échecs}\;\;}\;\; p \mid \text{données} \sim \mathrm{Beta}(a + k,\; b + n - k) \qquad \mathbb{E}[p \mid \text{données}] = \frac{a + k}{a + b + n}`,
      caption: "Mise à jour d'une loi Beta par des données binomiales",
    },
    {
      kind: "text",
      md: `On peut lire a et b comme des **observations fictives** : Beta(a ; b) revient à avoir déjà vu a succès et b échecs. Beta(1 ; 1) est la loi **uniforme** : toutes les valeurs de p sont également plausibles avant les données. Beta(2 ; 8) traduit l'idée que p vaut plutôt 20 % (a/(a + b)), avec le poids de 10 observations.

Reprenons le sondage du module 2 : 156 favorables sur 200, avec un a priori uniforme. Les méthodes de \`scipy.stats.beta\` donnent tout : la moyenne, les quantiles (\`ppf\`), et la probabilité qu'une hypothèse soit vraie (\`sf\`).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "k, n = 156, 200  # 156 favorables sur 200",
        "a0, b0 = 1, 1    # a priori uniforme : Beta(1, 1)",
        "posterieure = stats.beta(a0 + k, b0 + n - k)",
        "print(f'a posteriori : Beta({a0 + k}, {b0 + n - k})   moyenne {posterieure.mean():.4f}   écart-type {posterieure.std():.4f}')",
        "",
        "bas, haut = posterieure.ppf([0.025, 0.975])  # quantiles 2,5 % et 97,5 %",
        "print(f'intervalle crédible à 95 % : [{bas:.4f} ; {haut:.4f}]')",
        "wilson = stats.binomtest(k, n).proportion_ci(0.95, method='wilson')",
        "print(f'(rappel, intervalle de Wilson : [{wilson.low:.4f} ; {wilson.high:.4f}])')",
        "print(f'P(p > 0,75 | données) = {posterieure.sf(0.75):.4f}')",
      ),
      caption:
        "La loi a posteriori est une Beta(157 ; 45), de moyenne 0,7772. Son intervalle crédible, [0,7175 ; 0,8318], est presque confondu avec l'intervalle de Wilson, [0,7176 ; 0,8318]. Mais on peut dire ici ce que l'approche fréquentiste ne dit pas : la probabilité que la proportion dépasse 75 % est de 82,5 %.",
    },
    {
      kind: "text",
      md: `### Intervalle crédible ou intervalle de confiance ?

Les deux fourchettes ont presque les mêmes bornes ici, mais ne disent pas la même chose.

- L'**intervalle crédible à 95 %** est un énoncé sur le paramètre, **sachant les données et l'a priori** : la probabilité que p soit dans l'intervalle est de 95 %. Il dépend de l'a priori choisi.
- L'**intervalle de confiance à 95 %** est un énoncé sur la **méthode** : sur des échantillons répétés, 95 % des intervalles construits ainsi contiennent la vraie valeur. Il ne dépend d'aucun a priori.

Le calcul ci-dessus est un intervalle à queues égales (2,5 % de chaque côté). Il existe aussi l'intervalle de plus forte densité (HPD), le plus court possible pour un niveau donné, qui diffère peu quand la loi est à peu près symétrique.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Une équipe a contacté 40 clients : 9 ont acheté. Elle part d'un a priori **Beta(2 ; 8)** (une conviction d'un taux autour de 20 %, pesant 10 observations). Calculez les paramètres a posteriori `a_post` et `b_post`, la moyenne `moyenne_post`, les bornes `bas` et `haut` de l'intervalle crédible à 95 % (quantiles 2,5 % et 97,5 %), et `proba_sup_30` : la probabilité que le taux dépasse 30 %.",
      setup: lines("import numpy as np", "from scipy import stats", "", "k, n = 9, 40", "a0, b0 = 2, 8"),
      starter: lines("a_post = None", "b_post = None", "moyenne_post = None", "bas = None", "haut = None", "proba_sup_30 = None"),
      solution: lines(
        "a_post = a0 + k",
        "b_post = b0 + n - k",
        "posterieure = stats.beta(a_post, b_post)",
        "moyenne_post = posterieure.mean()",
        "bas, haut = posterieure.ppf([0.025, 0.975])",
        "proba_sup_30 = posterieure.sf(0.3)",
        "print(a_post, b_post, round(moyenne_post, 4), round(bas, 4), round(haut, 4), round(proba_sup_30, 4))",
      ),
      test: lines(
        "assert None not in (a_post, b_post, moyenne_post, bas, haut, proba_sup_30), \"rangez les six résultats demandés\"",
        "assert (a_post, b_post) == (11, 39), f\"a posteriori : Beta(a + k, b + n - k) = Beta(2 + 9, 8 + 31) ; vous avez Beta({a_post}, {b_post})\"",
        "assert abs(moyenne_post - 0.22) < 1e-9, f\"la moyenne a posteriori est 11 / 50 = 0,22 (vous avez {moyenne_post:.4f})\"",
        "assert abs(bas - 0.11774) < 1e-4 and abs(haut - 0.34343) < 1e-4, f\"l'intervalle crédible est [0,1177 ; 0,3434] (vous avez [{bas:.4f} ; {haut:.4f}]) : posterieure.ppf([0.025, 0.975])\"",
        "assert abs(proba_sup_30 - 0.09209) < 1e-4, f\"P(p > 0,3) = posterieure.sf(0.3) ≈ 0,0921 (vous avez {proba_sup_30:.4f})\"",
      ),
      hint: "Beta(a0 + k, b0 + n - k), puis stats.beta(a_post, b_post) : .mean(), .ppf([0.025, 0.975]) et .sf(0.3).",
    },
    {
      kind: "text",
      md: `### L'a priori pèse peu quand les données sont nombreuses

L'objection la plus courante à l'approche bayésienne est : « le choix de l'a priori est subjectif ». C'est vrai, et il faut le dire, mais son effet s'efface avec les données. Comparons trois a priori sur deux jeux de données de même proportion (30 %) : 3 succès sur 10, puis 300 sur 1 000. Beta(1 ; 1) est uniforme, Beta(10 ; 10) croit fortement que p est proche de 0,5, Beta(2 ; 8) croit à 20 %.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from scipy import stats",
        "",
        "print('a priori        données      moyenne a posteriori   intervalle crédible à 95 %')",
        "for nom, (a0, b0) in [('Beta(1, 1)', (1, 1)), ('Beta(10, 10)', (10, 10)), ('Beta(2, 8)', (2, 8))]:",
        "    for k, n in [(3, 10), (300, 1000)]:",
        "        posterieure = stats.beta(a0 + k, b0 + n - k)",
        "        bas, haut = posterieure.ppf([0.025, 0.975])",
        "        print(f'{nom:<14}{k:>4} sur {n:<6}{posterieure.mean():>16.3f}{bas:>18.3f} ;{haut:>6.3f}')",
      ),
      caption:
        "Avec 10 observations, l'a priori décide : la moyenne a posteriori va de 0,25 à 0,43 selon le choix. Avec 1 000 observations, les trois a priori donnent presque le même résultat (de 0,299 à 0,304). On peut donc, et c'est une bonne pratique, refaire l'analyse avec plusieurs a priori raisonnables : si la conclusion change, c'est que les données ne suffisent pas.",
    },
    {
      kind: "text",
      md: `### Le bayésien est-il « calibré » au sens fréquentiste ?

On peut poser à un intervalle crédible la question que l'on pose à un intervalle de confiance : si la vraie proportion est p, quelle part des échantillons donne un intervalle qui la contient ? C'est un calcul exact : pour chaque nombre de succès possible k (de 0 à n), on construit l'intervalle et l'on additionne la probabilité binomiale des k dont l'intervalle contient p. On compare ici à l'intervalle de Wilson pour n = 30.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def couverture(p, n, intervalle):",
        "    total = 0.0",
        "    for k in range(n + 1):",
        "        bas, haut = intervalle(k, n)",
        "        if bas <= p <= haut:",
        "            total += stats.binom.pmf(k, n, p)",
        "    return total",
        "",
        "def credible(k, n):",
        "    return stats.beta(1 + k, 1 + n - k).ppf([0.025, 0.975])  # a priori uniforme",
        "",
        "def wilson(k, n):",
        "    ic = stats.binomtest(k, n).proportion_ci(0.95, method='wilson')",
        "    return ic.low, ic.high",
        "",
        "print('couverture exacte pour n = 30 (cible : 0,95)')",
        "print('     p   crédible   Wilson')",
        "for p in [0.02, 0.05, 0.1, 0.3, 0.5]:",
        "    print(f'{p:>6}   {couverture(p, 30, credible):>8.3f}   {couverture(p, 30, wilson):>6.3f}')",
      ),
      caption:
        "Pour p de 0,05 à 0,5, la couverture de l'intervalle crédible est identique à celle de Wilson et oscille entre 0,930 et 0,974. Pour p = 0,02, elle tombe à 0,879, alors que Wilson reste à 0,978. L'intervalle crédible n'a jamais promis une couverture de 95 % pour chaque valeur de p : sa garantie vaut en moyenne sur les valeurs de p que l'a priori juge plausibles. C'est une autre notion, pas un défaut.",
    },
    {
      kind: "text",
      md: `### Un test A/B bayésien

La loi a posteriori permet des questions que les tests de significativité n'abordent pas : « quelle est la probabilité que la version B soit meilleure que la version A ? » ou « de combien ? ». Il suffit de **tirer** beaucoup de valeurs dans chaque loi a posteriori (\`rng.beta\`) et de comparer.

Exemple : la page A a converti 48 visiteurs sur 400, la page B 66 sur 420. On prend un a priori uniforme pour chaque taux.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(11)",
        "k_a, n_a, k_b, n_b = 48, 400, 66, 420",
        "p_a = rng.beta(1 + k_a, 1 + n_a - k_a, 200000)  # 200 000 valeurs plausibles du taux de A",
        "p_b = rng.beta(1 + k_b, 1 + n_b - k_b, 200000)",
        "ecart = p_b - p_a",
        "",
        "print(f'taux observés : A {k_a / n_a:.3f}   B {k_b / n_b:.3f}')",
        "print(f'P(B meilleure que A | données) = {(p_b > p_a).mean():.4f}')",
        "print(f'écart p_B - p_A : médiane {np.median(ecart):.4f}, intervalle crédible à 95 % [{np.percentile(ecart, 2.5):.4f} ; {np.percentile(ecart, 97.5):.4f}]')",
        "print(f'P(écart > 0,02) = {(ecart > 0.02).mean():.4f}')",
        "test = stats.fisher_exact([[k_a, n_a - k_a], [k_b, n_b - k_b]])",
        "print(f'pour comparaison, test exact de Fisher bilatéral : p = {test.pvalue:.4f}')",
      ),
      caption:
        "Taux observés : 12,0 % et 15,7 %. La probabilité a posteriori que B dépasse A est de 0,9375. L'écart médian est de 3,7 points, avec un intervalle crédible à 95 % de −1,0 à 8,4 points, qui contient donc 0 ; la probabilité que l'écart dépasse 2 points est de 0,76. Le test exact de Fisher donne p = 0,1308 : non significatif à 5 %. Les deux énoncés ne se contredisent pas, ils répondent à deux questions différentes.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Deux versions d'une lettre d'information : A a obtenu 30 clics sur 250 envois, B 41 clics sur 260. Avec un a priori uniforme Beta(1 ; 1) pour chaque taux, tirez 200 000 valeurs de chaque loi a posteriori (`rng.beta`) et rangez dans `proba_b_meilleur` la probabilité estimée que le taux de B dépasse celui de A.",
      starter: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(5)",
        "k_a, n_a, k_b, n_b = 30, 250, 41, 260",
        "proba_b_meilleur = None",
      ),
      solution: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(5)",
        "k_a, n_a, k_b, n_b = 30, 250, 41, 260",
        "p_a = rng.beta(1 + k_a, 1 + n_a - k_a, 200000)",
        "p_b = rng.beta(1 + k_b, 1 + n_b - k_b, 200000)",
        "proba_b_meilleur = (p_b > p_a).mean()",
        "print(round(proba_b_meilleur, 4))",
      ),
      test: lines(
        "from scipy import integrate, stats",
        "_a = stats.beta(31, 221)",
        "_b = stats.beta(42, 220)",
        "_exacte = integrate.quad(lambda x: _b.pdf(x) * _a.cdf(x), 0, 1)[0]",
        "assert proba_b_meilleur is not None, \"rangez la probabilité estimée dans proba_b_meilleur\"",
        "assert abs(proba_b_meilleur - _exacte) < 0.01, f\"A a posteriori : Beta(31, 221), B : Beta(42, 220) ; la probabilité que B dépasse A vaut environ {_exacte:.3f} (vous avez {proba_b_meilleur:.3f})\"",
      ),
      hint: "p_a = rng.beta(1 + k_a, 1 + n_a - k_a, 200000), de même pour p_b. La probabilité estimée est la moyenne du tableau de booléens (p_b > p_a).",
    },
    {
      kind: "note",
      tone: "warning",
      md: "« Probabilité que B soit meilleure » n'est pas « B est meilleure » : une probabilité de 0,89 laisse 11 % de chances que A soit au moins aussi bon. Et elle dépend de l'a priori, du modèle (ici des visiteurs indépendants, au taux constant) et de ce que l'on a vraiment mesuré. Décider demande en plus le coût d'une erreur et l'ampleur de l'écart, d'où l'intérêt de regarder aussi la loi de l'écart.",
    },
    {
      kind: "text",
      md: `### Limites et suites

- Le **choix de l'a priori** est une décision à justifier et à tester (analyse de sensibilité, comme ci-dessus). Un a priori peu informatif est un choix prudent, un a priori informatif doit s'appuyer sur des connaissances réelles (études antérieures).
- Le cas Beta-Binomial est exceptionnel : la loi a posteriori s'écrit à la main. Pour des modèles plus riches (régression, modèles hiérarchiques), on obtient la loi a posteriori par simulation (**MCMC**), avec des bibliothèques comme PyMC ou Stan. Elles ne tournent pas dans le moteur de ce site : ce sont des outils à installer sur votre machine.
- Quand les données sont abondantes et l'a priori peu informatif, les conclusions bayésiennes et fréquentistes sont en pratique les mêmes. Elles diffèrent surtout avec peu de données, avec des a priori informatifs, ou quand on veut des énoncés de probabilité sur des hypothèses.

Les deux approches se complètent : savoir ce que chacune affirme, et ce qu'elle suppose, vaut mieux que de choisir un camp.`,
    },
  ],
  quiz: [
    {
      question: "Un test à 95 % de sensibilité et 95 % de spécificité est positif, la maladie touche 1 % de la population. Quelle est la probabilité d'être malade ?",
      options: ["95 %", "Environ 50 %", "Environ 16 %", "1 %"],
      correct: 2,
      explanation:
        "Sur 10 000 personnes, 95 malades sont détectés mais aussi 495 personnes saines, soit 590 positifs dont 95 malades : 16,1 %. La faible prévalence (l'a priori) domine.",
    },
    {
      question: "On part d'un a priori Beta(1 ; 1) sur une proportion et l'on observe 7 succès et 3 échecs. Quelle est la loi a posteriori ?",
      options: ["Beta(7 ; 3)", "Beta(8 ; 4)", "Beta(1 ; 1)", "Beta(10 ; 1)"],
      correct: 1,
      explanation: "La loi Beta est conjuguée de la binomiale : Beta(a + k ; b + n − k) = Beta(1 + 7 ; 1 + 3) = Beta(8 ; 4).",
    },
    {
      question: "Quelle phrase décrit correctement un intervalle crédible à 95 % ?",
      options: [
        "Sur des échantillons répétés, 95 % de ces intervalles contiennent le paramètre",
        "Sachant les données et l'a priori, la probabilité que le paramètre soit dans l'intervalle est de 95 %",
        "95 % des observations sont dans l'intervalle",
        "L'intervalle ne dépend pas de l'a priori",
      ],
      correct: 1,
      explanation:
        "L'intervalle crédible est un énoncé de probabilité sur le paramètre, conditionnellement aux données et à l'a priori. La première phrase définit l'intervalle de confiance, une propriété de la méthode.",
    },
    {
      question: "Que devient l'influence de l'a priori quand le nombre d'observations augmente ?",
      options: [
        "Elle augmente",
        "Elle diminue : avec 1 000 observations, des a priori différents donnent presque la même loi a posteriori",
        "Elle reste identique",
        "L'a priori n'a jamais d'influence",
      ],
      correct: 1,
      explanation:
        "Dans la simulation, avec 10 observations, la moyenne a posteriori varie de 0,25 à 0,43 selon l'a priori ; avec 1 000, elle reste entre 0,299 et 0,304.",
    },
    {
      question: "Dans un test A/B bayésien, qu'indique « P(B meilleure que A | données) = 0,89 » ?",
      options: [
        "Que B est meilleure avec une certitude de 89 %, quoi qu'il arrive",
        "Que, compte tenu des données, du modèle et de l'a priori, la probabilité que le taux de B dépasse celui de A est de 89 %",
        "Que la p-value du test vaut 0,89",
        "Que B a converti 89 % des visiteurs",
      ],
      correct: 1,
      explanation:
        "C'est une probabilité a posteriori, conditionnelle au modèle et à l'a priori. Elle n'est pas une p-value et ne dit rien de l'ampleur de l'écart, qu'il faut regarder séparément.",
    },
  ],
};
