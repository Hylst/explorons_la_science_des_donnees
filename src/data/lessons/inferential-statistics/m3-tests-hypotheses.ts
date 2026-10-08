import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module3: LessonModule = {
  id: "tests-hypotheses",
  title: "La logique d'un test d'hypothèse",
  duration: "2 h",
  summary:
    "Hypothèse nulle, statistique de test, p-value et seuil α : retrouver la p-value par simulation, mesurer l'erreur de type I, comprendre le lien avec l'intervalle de confiance et la différence entre significatif et important.",
  objectives: [
    "Formuler H0 et H1 et dérouler les étapes d'un test (statistique, loi sous H0, p-value, décision)",
    "Définir la p-value et la retrouver par simulation sous H0",
    "Mesurer l'erreur de type I et constater que les p-values sont uniformes quand H0 est vraie",
    "Relier test et intervalle de confiance, choisir un test bilatéral ou unilatéral, distinguer significatif et important",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une question posée à des données

Un test d'hypothèse répond à une question du genre : « cet écart observé peut-il s'expliquer par le seul hasard de l'échantillonnage ? ». La démarche est toujours la même :

1. poser l'**hypothèse nulle H0** (« rien de spécial » : la pièce est équilibrée, le nouveau bouton ne change rien, la moyenne vaut la valeur de référence) et l'**hypothèse alternative H1** (ce que l'on cherche à mettre en évidence) ;
2. fixer à l'avance le **seuil α** (souvent 0,05), c'est-à-dire le risque de fausse alerte que l'on accepte ;
3. choisir une **statistique de test** qui résume l'écart entre les données et H0 ;
4. déterminer la **loi de cette statistique si H0 est vraie** ;
5. calculer la **p-value** : dans le monde où H0 est vraie, quelle est la probabilité d'obtenir un résultat au moins aussi extrême que celui observé ;
6. décider : si la p-value est inférieure à α, on **rejette H0** ; sinon, on **ne la rejette pas**.

La mise en pratique de ces tests avec scipy sur des jeux de données réels est l'objet du module « Tests d'hypothèses » du cours *Statistiques appliquées* ; ce module-ci explique ce que les nombres signifient et ce qu'ils ne disent pas.

On compare parfois cela à un procès : on part de la présomption d'innocence, et l'on ne condamne que si les preuves sont très peu compatibles avec elle. L'image a un défaut utile à retenir : un acquittement ne prouve pas l'innocence, et de même ne pas rejeter H0 ne prouve pas qu'elle est vraie.`,
    },
    {
      kind: "equation",
      latex: String.raw`p \;=\; \mathbb{P}\!\left(\,\text{résultat au moins aussi extrême que celui observé} \;\middle|\; H_0 \text{ vraie}\,\right)`,
      caption: "La p-value : une probabilité calculée en supposant H0 vraie",
    },
    {
      kind: "text",
      md: `La p-value n'est **pas** la probabilité que H0 soit vraie, ni celle que le résultat soit dû au hasard, ni la taille de l'effet. Elle mesure à quel point les données seraient surprenantes dans un monde où H0 serait vraie.

### La p-value, retrouvée par simulation

Une pièce donne 61 faces sur 100 lancers. Est-elle équilibrée ? Ici H0 : « la probabilité de face est 0,5 », H1 : « elle est différente de 0,5 » (test **bilatéral** : un écart dans un sens ou dans l'autre est une anomalie). La statistique de test est le nombre de faces ; sous H0 elle suit une loi binomiale (100 ; 0,5). Un résultat « au moins aussi extrême » que 61 est un écart d'au moins 11 avec la valeur attendue 50, dans un sens ou dans l'autre.

On peut calculer cette probabilité avec \`stats.binomtest\`, ou la **simuler** : tirer 200 000 séries de 100 lancers d'une pièce équilibrée, et compter la fraction de séries qui s'écartent autant de 50.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "exact = stats.binomtest(61, 100, 0.5).pvalue",
        "print(f'p-value exacte (binomtest)              : {exact:.4f}')",
        "",
        "rng = np.random.default_rng(10)",
        "tirages = rng.binomial(100, 0.5, size=200000)  # 200 000 séries de 100 lancers, pièce équilibrée",
        "print(f'part des séries avec 61 faces ou plus  : {(tirages >= 61).mean():.4f}')",
        "print(f'part des séries avec 39 faces ou moins : {(tirages <= 39).mean():.4f}')",
        "print(f'p-value simulée (écart d’au moins 11)  : {(np.abs(tirages - 50) >= 11).mean():.4f}')",
      ),
      caption:
        "La simulation retrouve la valeur exacte (0,0352) à quelques dix-millièmes près. La p-value est la somme des deux queues, environ 1,7 % de chaque côté. Au seuil de 5 %, on rejetterait l'hypothèse d'une pièce équilibrée ; au seuil de 1 %, non.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Un bouton a historiquement un taux de clic de 30 %. Après une refonte, **72 visiteurs sur 200** ont cliqué (36 %). H0 : le taux est resté à 0,30 ; H1 : il a augmenté (test **unilatéral**). Simulez 200 000 séries de 200 visiteurs avec un taux de 0,30 (`rng.binomial`), et rangez dans `p_valeur` la proportion de séries où l'on compte **72 clics ou plus**.",
      starter: lines("import numpy as np", "from scipy import stats", "", "rng = np.random.default_rng(12)", "p_valeur = None"),
      solution: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(12)",
        "tirages = rng.binomial(200, 0.3, size=200000)",
        "p_valeur = (tirages >= 72).mean()",
        "print(round(p_valeur, 4), round(stats.binom.sf(71, 200, 0.3), 4))",
      ),
      test: lines(
        "assert p_valeur is not None, \"rangez la proportion de séries à 72 clics ou plus dans p_valeur\"",
        "_exacte = stats.binom.sf(71, 200, 0.3)",
        "assert abs(p_valeur - _exacte) < 0.003, f\"la probabilité exacte de 72 clics ou plus sous H0 est {_exacte:.4f} ; votre simulation donne {p_valeur:.4f} (200 000 séries, comparez avec >= 72)\"",
      ),
      hint: "tirages = rng.binomial(200, 0.3, size=200000) donne le nombre de clics de chaque série. (tirages >= 72).mean() est la fraction de séries à 72 clics ou plus.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Avec p ≈ 0,04, le résultat est surprenant sous H0 : on rejette au seuil de 5 %. Mais la p-value est proche du seuil, et elle ne dit pas que la refonte « marche » de façon importante : le taux a peut-être augmenté de 6 points, ou de 2. Un intervalle de confiance sur le taux apporte cette information (module 2).",
    },
    {
      kind: "text",
      md: `### Le seuil α et l'erreur de type I

Le seuil α est fixé **avant** de regarder les données. Il est le risque que l'on accepte de rejeter H0 alors qu'elle est vraie : c'est l'**erreur de type I** (un faux positif).`,
    },
    {
      kind: "equation",
      latex: String.raw`\alpha \;=\; \mathbb{P}\!\left(\text{rejeter } H_0 \mid H_0 \text{ vraie}\right) \qquad\qquad \beta \;=\; \mathbb{P}\!\left(\text{ne pas rejeter } H_0 \mid H_0 \text{ fausse}\right)`,
      caption: "Erreurs de type I (α) et de type II (β) ; la puissance du test vaut 1 − β",
    },
    {
      kind: "text",
      md: `Ce risque est une propriété **du test**, pas des données : si l'on faisait un grand nombre de tests dont l'hypothèse nulle est toujours vraie, α d'entre eux seraient rejetés. Vérifions-le. On tire 10 000 échantillons de 20 valeurs dans une loi normale de moyenne 50 (donc H0 : μ = 50 est **vraie**) et on teste chacun. Puis on recommence avec une moyenne vraie de 55 (H0 est fausse) pour comparer. On regarde la répartition des p-values en dix tranches de largeur 0,1.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(13)",
        "h0_vraie = rng.normal(50, 10, size=(10000, 20))  # vraie moyenne 50 : H0 (mu = 50) est vraie",
        "h0_fausse = rng.normal(55, 10, size=(10000, 20))  # vraie moyenne 55 : H0 est fausse",
        "p0 = stats.ttest_1samp(h0_vraie, 50, axis=1).pvalue  # un test t par ligne",
        "p1 = stats.ttest_1samp(h0_fausse, 50, axis=1).pvalue",
        "",
        "tranches = np.linspace(0, 1, 11)",
        "print('p-values par tranche de 0,1 (de 0-0,1 à 0,9-1)')",
        "print('H0 vraie  :', np.histogram(p0, tranches)[0])",
        "print('H0 fausse :', np.histogram(p1, tranches)[0])",
        "print()",
        "print(f'rejets à 5 % quand H0 est vraie  : {(p0 < 0.05).mean():.4f}')",
        "print(f'rejets à 5 % quand H0 est fausse : {(p1 < 0.05).mean():.4f}')",
      ),
      caption:
        "Quand H0 est vraie, la p-value est répartie uniformément : chaque tranche reçoit environ 1 000 des 10 000 p-values (de 962 à 1 047), et 4,8 % des tests sont rejetés à 5 %, très près de α. Quand H0 est fausse, les p-values se concentrent près de 0 (6 995 dans la première tranche), mais 43,6 % des tests passent encore à côté : c'est l'erreur de type II, qui dépend de l'effet et de n (module 5).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Mesurez vous-même l'erreur de type I. `echantillons` contient 10 000 échantillons de 20 valeurs tirées d'une loi normale de moyenne 50 et d'écart-type 10 : l'hypothèse nulle μ = 50 est vraie. Faites un test t à un échantillon sur chaque ligne (`stats.ttest_1samp(..., axis=1)`) et rangez dans `taux_rejet` la proportion de tests dont la p-value est **inférieure à 0,05**.",
      starter: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(21)",
        "echantillons = rng.normal(50, 10, size=(10000, 20))",
        "taux_rejet = None",
      ),
      solution: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(21)",
        "echantillons = rng.normal(50, 10, size=(10000, 20))",
        "p_valeurs = stats.ttest_1samp(echantillons, 50, axis=1).pvalue",
        "taux_rejet = (p_valeurs < 0.05).mean()",
        "print(round(taux_rejet, 4))",
      ),
      test: lines(
        "assert taux_rejet is not None, \"rangez la proportion de p-values inférieures à 0,05 dans taux_rejet\"",
        "assert 0.04 < taux_rejet < 0.06, f\"quand H0 est vraie, un test à 5 % se trompe dans environ 5 % des cas (vous avez {taux_rejet:.4f}) : testez la moyenne 50 avec axis=1 et comptez les p-values < 0,05\"",
      ),
      hint: "stats.ttest_1samp(echantillons, 50, axis=1).pvalue renvoie un vecteur de 10 000 p-values. (p_valeurs < 0.05).mean() donne la proportion de rejets.",
    },
    {
      kind: "text",
      md: `### Quand σ est connu : le test z

Si l'écart-type σ de la population est connu (par un étalonnage, une norme de fabrication), la statistique de test d'une moyenne est la distance entre x̄ et la valeur de référence μ0, exprimée en erreurs standard. Sous H0, avec des données normales (ou n grand), elle suit la loi normale centrée réduite : c'est le **test z**. La p-value d'un test bilatéral est \`2 * stats.norm.sf(abs(z))\`.

Ce cas est surtout pédagogique : σ est rarement connu, et l'on utilise alors le test t (module suivant), qui est le même test avec s à la place de σ. On retrouve le test z, comme approximation, pour comparer des proportions ou quand n est très grand.`,
    },
    {
      kind: "equation",
      latex: String.raw`z \;=\; \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}`,
      caption: "Statistique du test z : l'écart à H0 mesuré en erreurs standard",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Une machine remplit des bouteilles de 500 mL ; son étalonnage donne un écart-type connu de **σ = 4 mL**. Un contrôle (valeurs fictives) sur **36 bouteilles** donne une moyenne de **498,6 mL**. H0 : μ = 500, H1 : μ ≠ 500. Calculez `z`, la `p_valeur` bilatérale, et `rejet` (`True` si l'on rejette H0 au seuil de 5 %).",
      setup: lines("import numpy as np", "from scipy import stats", "", "mu0, sigma, n, moyenne_obs = 500, 4, 36, 498.6"),
      starter: lines("z = None", "p_valeur = None", "rejet = None"),
      solution: lines(
        "z = (moyenne_obs - mu0) / (sigma / np.sqrt(n))",
        "p_valeur = 2 * stats.norm.sf(abs(z))",
        "rejet = p_valeur < 0.05",
        "print(round(z, 3), round(p_valeur, 4), rejet)",
      ),
      test: lines(
        "assert z is not None and p_valeur is not None and rejet is not None, \"rangez z, p_valeur et rejet\"",
        "assert abs(z + 2.1) < 1e-6, f\"z = (498,6 - 500) / (4 / racine(36)) = -2,1 (vous avez {z:.3f})\"",
        "assert abs(p_valeur - 0.035729) < 1e-5, f\"la p-value bilatérale vaut 2 × P(Z > 2,1) ≈ 0,0357 (vous avez {p_valeur:.4f})\"",
        "assert bool(rejet) is True, \"0,0357 est inférieur à 0,05 : on rejette H0\"",
      ),
      hint: "z = (moyenne_obs - mu0) / (sigma / np.sqrt(n)). Pour un test bilatéral, doublez la probabilité d'une seule queue : 2 * stats.norm.sf(abs(z)).",
    },
    {
      kind: "text",
      md: `### Test et intervalle de confiance : deux regards sur la même chose

Un test t bilatéral au seuil α rejette H0 : μ = μ0 exactement quand μ0 **sort** de l'intervalle de confiance à 1 − α. L'intervalle contient toutes les valeurs de référence que l'on ne rejetterait pas. Il en dit plus que la p-value, car il montre quelles valeurs sont plausibles et de combien.

On reprend les quinze temps de chargement du module 2 (intervalle à 95 % : [406,41 ; 434,65]) et l'on teste plusieurs valeurs de référence. On regarde aussi les tests unilatéraux : \`alternative='greater'\` teste « la moyenne est plus grande que μ0 », \`'less'\` « plus petite ».`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "temps = np.array([412, 388, 455, 401, 437, 392, 468, 420, 399, 431, 445, 409, 427, 384, 440])  # mesures inventées du module 2",
        "ic = stats.ttest_1samp(temps, 410).confidence_interval(0.95)",
        "print(f'intervalle de confiance à 95 % : [{ic.low:.2f} ; {ic.high:.2f}]')",
        "print()",
        "print('valeur de référence   p-value bilatérale')",
        "for mu0 in [400, 405, ic.low, 410, ic.high, 440]:",
        "    print(f'{mu0:>17.2f}   {stats.ttest_1samp(temps, mu0).pvalue:>18.4f}')",
        "print()",
        "print('H1 : mu > 410  p =', round(stats.ttest_1samp(temps, 410, alternative='greater').pvalue, 4))",
        "print('H1 : mu < 410  p =', round(stats.ttest_1samp(temps, 410, alternative='less').pvalue, 4))",
      ),
      caption:
        "La p-value vaut 0,05 pile aux bornes de l'intervalle, plus grande à l'intérieur (0,1319 pour 410), plus petite à l'extérieur (0,0333 pour 405, 0,0104 pour 440). Pour μ0 = 410, la p-value unilatérale « plus grand » (0,0659) est la moitié de la bilatérale (0,1319), car la moyenne observée est au-dessus de 410.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le choix entre bilatéral et unilatéral se fait **avant** de voir les données, d'après la question posée. Choisir « unilatéral » après avoir vu le signe de l'écart, uniquement pour diviser la p-value par deux, fausse le seuil : le risque réel de type I double.",
    },
    {
      kind: "text",
      md: `### Significatif ne veut pas dire important

La p-value dépend de la taille de l'effet **et** de n. Avec assez de données, un écart minuscule devient « statistiquement significatif » ; avec trop peu, un écart important passe inaperçu. Illustration : durées de session (en minutes, simulées) dans deux versions d'un site, d'écart-type 5 dans les deux cas.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(14)",
        "",
        "# énorme échantillon, petit écart vrai (0,2 minute)",
        "a = rng.normal(30.0, 5, 50000)",
        "b = rng.normal(30.2, 5, 50000)",
        "r = stats.ttest_ind(a, b, equal_var=False)",
        "print(f'n = 50 000 par groupe : écart observé {b.mean() - a.mean():.2f} min   p = {r.pvalue:.1e}')",
        "",
        "# petit échantillon, écart vrai plus grand (1 minute)",
        "a = rng.normal(30.0, 5, 20)",
        "b = rng.normal(31.0, 5, 20)",
        "r = stats.ttest_ind(a, b, equal_var=False)",
        "print(f'n = 20 par groupe     : écart observé {b.mean() - a.mean():.2f} min   p = {r.pvalue:.2f}')",
      ),
      caption:
        "Un écart de 0,22 minute (13 secondes) est hautement significatif (p ≈ 1,3 × 10⁻¹²) avec 50 000 sessions par groupe, alors qu'un écart de 0,39 minute avec 20 sessions ne l'est pas du tout (p ≈ 0,81), alors que l'écart vrai y était plus grand. Ce qui compte pour décider, c'est la taille de l'effet, avec son intervalle de confiance.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Ne pas rejeter H0 n'est pas une preuve que H0 est vraie : la p-value de 0,81 ci-dessus appartient à un cas où l'effet existe. Un test non significatif dit « les données ne permettent pas de trancher », pas « il n'y a pas de différence ». Le module 5 montre comment prévoir, avant l'étude, la taille d'échantillon qui permet de trancher.",
    },
  ],
  quiz: [
    {
      question: "Une p-value de 0,03 signifie :",
      options: [
        "Il y a 3 % de chances que H0 soit vraie",
        "Si H0 était vraie, on observerait un écart au moins aussi extrême dans environ 3 % des échantillons",
        "L'effet est de 3 %",
        "L'hypothèse alternative a 97 % de chances d'être vraie",
      ],
      correct: 1,
      explanation:
        "La p-value se calcule dans le monde où H0 est vraie. Elle mesure la surprise des données sous H0, pas la probabilité de H0 elle-même, qui nécessiterait une probabilité a priori (approche bayésienne, module 6).",
    },
    {
      question: "Quand H0 est vraie et que le test est exact, comment sont réparties les p-values ?",
      options: [
        "Concentrées près de 0",
        "Concentrées près de 1",
        "Uniformément entre 0 et 1 : une p-value sur vingt est inférieure à 0,05",
        "En cloche autour de 0,5",
      ],
      correct: 2,
      explanation:
        "C'est la raison pour laquelle le seuil α est le taux de faux positifs. Dans la simulation, 4,8 % des p-values étaient inférieures à 0,05 pour 10 000 tests où H0 était vraie, et chaque tranche de 0,1 en contenait environ 1 000.",
    },
    {
      question: "Un intervalle de confiance à 95 % de la moyenne est [406 ; 435]. Que dit un test t bilatéral à 5 % de H0 : μ = 440 ?",
      options: [
        "On ne rejette pas H0, car 440 est proche",
        "On rejette H0, car 440 est en dehors de l'intervalle",
        "On ne peut rien dire sans refaire le calcul",
        "On rejette H0 uniquement si n est grand",
      ],
      correct: 1,
      explanation:
        "Un test bilatéral au seuil α rejette μ0 exactement quand μ0 sort de l'intervalle de confiance à 1 − α. Ici la p-value pour 440 est de 0,0104.",
    },
    {
      question: "Pourquoi choisir « unilatéral » ou « bilatéral » avant de regarder les données ?",
      options: [
        "Parce que c'est la loi",
        "Parce que choisir après avoir vu le sens de l'écart pour diviser la p-value par deux double le risque réel de faux positif",
        "Parce que le test unilatéral est toujours plus puissant",
        "Parce que scipy l'exige",
      ],
      correct: 1,
      explanation:
        "Le seuil α n'a de sens que si la règle de décision est fixée avant les données. Un choix opportuniste du sens de l'alternative donne un risque réel de 2 α au lieu de α.",
    },
    {
      question: "Un essai avec 20 personnes donne p = 0,81. Que peut-on conclure ?",
      options: [
        "Qu'il n'y a pas de différence entre les groupes",
        "Que H0 est vraie à 81 %",
        "Que les données ne permettent pas de rejeter H0, sans prouver qu'elle est vraie : l'étude manque peut-être de puissance",
        "Que le test est invalide",
      ],
      correct: 2,
      explanation:
        "Une p-value élevée dit que les données sont compatibles avec H0, pas qu'elles la démontrent. Dans l'exemple du module, p = 0,81 provenait d'un cas où un écart vrai de 1 minute existait.",
    },
  ],
};
