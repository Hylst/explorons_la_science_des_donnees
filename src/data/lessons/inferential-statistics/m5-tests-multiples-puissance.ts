import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module5: LessonModule = {
  id: "tests-multiples-puissance",
  title: "Tests multiples, puissance et taille d'échantillon",
  duration: "2 h",
  summary:
    "Ce qui arrive aux faux positifs quand on multiplie les tests (et comment les corriger), la puissance d'un test mesurée par simulation, le calcul de la taille d'échantillon, et pourquoi regarder les données en cours de route fausse les conclusions.",
  objectives: [
    "Calculer et mesurer l'inflation des faux positifs quand on réalise plusieurs tests",
    "Appliquer les corrections de Bonferroni, de Holm et de Benjamini-Hochberg, et savoir ce que chacune contrôle",
    "Définir la puissance d'un test, la mesurer par simulation et la comparer à son calcul théorique",
    "Dimensionner un échantillon, et reconnaître l'arrêt optionnel et le p-hacking",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand on multiplie les tests

Au seuil de 5 %, un test dont l'hypothèse nulle est vraie se trompe une fois sur vingt. Mais une étude ne fait presque jamais un seul test : on compare plusieurs groupes, plusieurs variables, plusieurs sous-populations, plusieurs modèles sur le même jeu de test. Si l'on réalise m tests **indépendants** dont toutes les hypothèses nulles sont vraies, la probabilité d'obtenir **au moins un** faux positif est 1 − (1 − α)^m. Pour m = 20 et α = 0,05, c'est 0,6415.`,
    },
    {
      kind: "equation",
      latex: String.raw`\mathbb{P}\!\left(\text{au moins un faux positif}\right) \;=\; 1 - (1-\alpha)^m \qquad\text{soit}\qquad 1 - 0{,}95^{20} \approx 0{,}6415`,
      caption: "Inflation du risque d'erreur avec m tests indépendants (H0 vraie partout)",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(5)",
        "etudes, m, n = 5000, 20, 15",
        "a = rng.normal(0, 1, size=(etudes, m, n))  # 5 000 études de 20 comparaisons, sans aucun effet réel",
        "b = rng.normal(0, 1, size=(etudes, m, n))",
        "p = stats.ttest_ind(a, b, axis=2).pvalue  # forme (étude, comparaison)",
        "",
        "faux_positifs = (p < 0.05).sum(axis=1)",
        "print(f'faux positifs par étude, en moyenne           : {faux_positifs.mean():.3f}')",
        "print(f'études avec au moins un faux positif          : {(faux_positifs > 0).mean():.4f}')",
        "print(f'théorie, 1 - 0,95**20                         : {1 - 0.95 ** 20:.4f}')",
      ),
      caption:
        "En moyenne 1,0 faux positif par étude de 20 comparaisons (20 × 5 %), et 64,0 % des études en contiennent au moins un, conformément à la formule (64,2 %). Une étude qui teste vingt choses « trouvera » presque toujours quelque chose.",
    },
    {
      kind: "text",
      md: `### Corriger : deux philosophies

On peut contrôler deux risques différents :

- le **FWER** (*family-wise error rate*) : la probabilité d'avoir **au moins un** faux positif parmi les tests. C'est le critère strict, adapté aux études de confirmation où une seule fausse conclusion coûte cher ;
- le **FDR** (*false discovery rate*) : la **part moyenne de faux positifs parmi les résultats déclarés significatifs**. C'est le critère adapté à l'exploration (cribler des milliers de variables), où l'on accepte quelques fausses pistes à condition d'en connaître la proportion.

Trois corrections sont courantes. Soit p(1) ≤ … ≤ p(m) les p-values triées :

- **Bonferroni** (FWER) : on rejette H0 si p ≤ α/m. Très simple et très prudent.
- **Holm** (FWER) : on parcourt les p-values en ordre croissant, on rejette p(k) tant que p(k) ≤ α/(m − k + 1), et l'on s'arrête au premier échec. Même garantie que Bonferroni, jamais moins de rejets : il le remplace avantageusement.
- **Benjamini-Hochberg** (FDR) : on cherche le plus grand k tel que p(k) ≤ (k/m)·α et l'on rejette les k premières hypothèses. La garantie vaut pour des tests indépendants (ou positivement corrélés). \`stats.false_discovery_control(p)\` renvoie les p-values ajustées ; on rejette celles qui sont ≤ α.`,
    },
    {
      kind: "equation",
      latex: String.raw`\text{Bonferroni : } p \le \frac{\alpha}{m} \qquad \text{Holm : } p_{(k)} \le \frac{\alpha}{m-k+1} \qquad \text{Benjamini-Hochberg : } p_{(k)} \le \frac{k}{m}\,\alpha`,
      caption: "Seuils appliqués à la p-value de rang k (triées par ordre croissant)",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez la fonction `holm(pvaleurs, alpha=0.05)` qui renvoie une liste de booléens, **dans l'ordre d'origine des p-values** : `True` si l'hypothèse est rejetée. Principe : triez les p-values par ordre croissant (`np.argsort`), puis, pour le rang k = 0, 1, 2... (en commençant à 0), rejetez tant que `p <= alpha / (m - k)`, et arrêtez-vous au premier échec. Pour `[0.039, 0.001, 0.74, 0.012, 0.008, 0.2, 0.005, 0.020]`, Holm rejette trois hypothèses.",
      setup: lines("import numpy as np"),
      starter: lines(
        "def holm(pvaleurs, alpha=0.05):",
        "    # à compléter : une liste de booléens, True quand l'hypothèse nulle est rejetée",
        "    return [False] * len(pvaleurs)",
      ),
      solution: lines(
        "def holm(pvaleurs, alpha=0.05):",
        "    m = len(pvaleurs)",
        "    ordre = np.argsort(pvaleurs)  # indices des p-values, de la plus petite à la plus grande",
        "    rejets = [False] * m",
        "    for rang, i in enumerate(ordre):",
        "        if pvaleurs[i] <= alpha / (m - rang):",
        "            rejets[i] = True",
        "        else:",
        "            break  # dès le premier échec, on garde toutes les hypothèses suivantes",
        "    return rejets",
        "",
        "exemple = [0.039, 0.001, 0.74, 0.012, 0.008, 0.2, 0.005, 0.020]",
        "print(holm(exemple))",
        "print('Bonferroni :', [p <= 0.05 / len(exemple) for p in exemple].count(True), 'rejets ;  sans correction :', [p <= 0.05 for p in exemple].count(True), 'rejets')",
      ),
      test: lines(
        "import numpy as np",
        "_exemple = [0.039, 0.001, 0.74, 0.012, 0.008, 0.2, 0.005, 0.020]",
        "_obtenu = holm(_exemple)",
        "_attendu = [False, True, False, False, True, False, True, False]",
        "assert [bool(r) for r in _obtenu] == _attendu, f\"pour {_exemple}, Holm rejette les p-values 0,001, 0,005 et 0,008 (seuils 0,05/8, 0,05/7, 0,05/6) ; votre fonction renvoie {list(_obtenu)}\"",
        "",
        "def _reference(p, alpha):",
        "    p = np.asarray(p)",
        "    m = len(p)",
        "    ordre = np.argsort(p)",
        "    ajustees = np.minimum(1, np.maximum.accumulate((m - np.arange(m)) * p[ordre]))",
        "    rejets = np.empty(m, dtype=bool)",
        "    rejets[ordre] = ajustees <= alpha",
        "    return [bool(r) for r in rejets]",
        "",
        "_rng = np.random.default_rng(0)",
        "for _ in range(200):",
        "    _q = list(_rng.random(10) ** 3)",
        "    assert [bool(r) for r in holm(_q, 0.05)] == _reference(_q, 0.05), f\"résultat différent de la procédure de Holm pour {np.round(_q, 4)}\"",
      ),
      hint: "Une boucle for rang, i in enumerate(ordre) donne le rang (0, 1, 2...) et l'indice d'origine i. Si pvaleurs[i] <= alpha / (m - rang), notez rejets[i] = True ; sinon, break.",
    },
    {
      kind: "text",
      md: `Comparons les méthodes sur un cas où l'on connaît la vérité. Chaque « étude » compare 50 paires de groupes de 30 individus ; **5** de ces comparaisons ont un vrai effet (d = 0,8), les 45 autres n'en ont aucun. On répète l'étude 2 000 fois et l'on compte, pour chaque méthode : les **vrais** effets détectés (sur 5), les **faux** positifs par étude, le **FWER** (la part des études qui contiennent au moins un faux positif) et le **FDR** (la part moyenne de fausses découvertes parmi les résultats significatifs).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def holm(pvaleurs, alpha=0.05):",
        "    m = len(pvaleurs)",
        "    rejets = np.zeros(m, dtype=bool)",
        "    for rang, i in enumerate(np.argsort(pvaleurs)):",
        "        if pvaleurs[i] <= alpha / (m - rang):",
        "            rejets[i] = True",
        "        else:",
        "            break",
        "    return rejets",
        "",
        "rng = np.random.default_rng(6)",
        "etudes, m, n = 2000, 50, 30",
        "decalage = np.zeros(m)",
        "decalage[:5] = 0.8  # 5 comparaisons ont un vrai effet, les 45 autres aucun",
        "a = rng.normal(0, 1, size=(etudes, m, n))",
        "b = rng.normal(0, 1, size=(etudes, m, n)) + decalage[None, :, None]",
        "p = stats.ttest_ind(a, b, axis=2).pvalue",
        "reel = decalage > 0",
        "",
        "methodes = {",
        "    'sans correction': p < 0.05,",
        "    'Bonferroni': p < 0.05 / m,",
        "    'Holm': np.array([holm(ligne) for ligne in p]),",
        "    'Benjamini-Hochberg': np.array([stats.false_discovery_control(ligne) <= 0.05 for ligne in p]),",
        "}",
        "print('méthode' + ' ' * 17 + 'vrais     faux     FWER      FDR')",
        "for nom, rejets in methodes.items():",
        "    vrais = rejets[:, reel].sum(axis=1)",
        "    faux = rejets[:, ~reel].sum(axis=1)",
        "    part = (faux / np.maximum(vrais + faux, 1)).mean()",
        "    print(f'{nom:<24}{vrais.mean():>5.2f}{faux.mean():>9.3f}{(faux > 0).mean():>9.3f}{part:>9.3f}')",
      ),
      caption:
        "Sans correction, on détecte 4,31 des 5 vrais effets en moyenne, mais avec 2,28 faux positifs par étude : 90,8 % des études en contiennent au moins un et près d'un tiers des découvertes (31,9 %) sont fausses. Bonferroni et Holm ramènent le FWER à 5,6 % et 5,9 %, près des 5 % visés, mais ne détectent que 1,85 et 1,87 vrais effets sur 5. Benjamini-Hochberg en détecte davantage (2,55) en acceptant 0,205 faux positif par étude : sa part de fausses découvertes est de 5,1 %, près de la cible de 5 %.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Une correction se choisit **avant** de voir les résultats, d'après le coût d'une erreur : Bonferroni ou Holm quand une seule fausse conclusion est grave (confirmation), Benjamini-Hochberg pour explorer beaucoup d'hypothèses et trier des pistes à vérifier ensuite. En apprentissage automatique, comparer vingt modèles ou cinquante variables sur le même jeu de test est exactement le cas des tests multiples.",
    },
    {
      kind: "text",
      md: `### La puissance d'un test

Rappel : l'erreur de type II est de ne pas rejeter H0 alors qu'elle est fausse. La **puissance** 1 − β est la probabilité de rejeter H0 quand elle est fausse **pour un effet donné**. Elle n'est pas une propriété du test seul : elle dépend de quatre choses.

- la **taille de l'effet** : plus l'écart réel est grand (en unités d'écart-type, le d de Cohen), plus il est facile à détecter ;
- la **taille de l'échantillon** n ;
- la **dispersion** des données (contenue dans d) ;
- le **seuil α** : exiger plus de preuves (α plus petit) réduit la puissance.

On peut la mesurer par simulation : tirer de nombreux jeux de données dans lesquels l'effet existe vraiment, tester chacun, et compter la proportion de rejets. Pour un test t de deux groupes de n individus, il existe aussi un calcul exact, fondé sur la loi t **décentrée** (\`stats.nct\`), que la simulation doit retrouver.`,
    },
    {
      kind: "equation",
      latex: String.raw`1 - \beta \;=\; \mathbb{P}\!\left(\text{rejeter } H_0 \;\middle|\; \text{effet } d \text{ réel}\right) \qquad\text{avec}\qquad \lambda = d\sqrt{\frac{n}{2}} \;\;(\text{décentrage de la loi } t)`,
      caption: "Puissance d'un test t à deux groupes de n individus, effet d (décentrage λ)",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def puissance_theorique(n, d, alpha=0.05):",
        "    ddl = 2 * n - 2  # deux groupes de n individus, test de Student",
        "    decentrage = d * np.sqrt(n / 2)",
        "    t_crit = stats.t.ppf(1 - alpha / 2, ddl)",
        "    return 1 - stats.nct.cdf(t_crit, ddl, decentrage) + stats.nct.cdf(-t_crit, ddl, decentrage)",
        "",
        "rng = np.random.default_rng(7)",
        "print('effet d = 0,5 : puissance selon la taille de chaque groupe')",
        "print('   n    simulée   théorique')",
        "for n in [10, 20, 40, 80]:",
        "    x = rng.normal(0, 1, size=(10000, n))",
        "    y = rng.normal(0.5, 1, size=(10000, n))  # l'effet existe : écart de 0,5 écart-type",
        "    simulee = (stats.ttest_ind(x, y, axis=1).pvalue < 0.05).mean()",
        "    print(f'{n:>4}   {simulee:>7.3f}   {puissance_theorique(n, 0.5):>9.3f}')",
      ),
      caption:
        "La simulation et le calcul exact concordent à moins de 0,004 près. Avec 10 individus par groupe, un effet moyen (d = 0,5) n'est détecté que 18 fois sur 100 ; il en faut 80 par groupe pour atteindre 88 %.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Deux traitements ont des moyennes vraies de 100 et 107,5 avec un écart-type commun de 15 (soit d = 0,5). On compare deux groupes de **50** individus avec un test de Student à 5 %. Simulez **10 000** études (`rng.normal`, puis `stats.ttest_ind(..., axis=1)`) et rangez dans `puissance` la proportion d'études qui rejettent H0.",
      starter: lines("import numpy as np", "from scipy import stats", "", "rng = np.random.default_rng(31)", "puissance = None"),
      solution: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(31)",
        "a = rng.normal(100, 15, size=(10000, 50))",
        "b = rng.normal(107.5, 15, size=(10000, 50))",
        "p = stats.ttest_ind(a, b, axis=1).pvalue",
        "puissance = (p < 0.05).mean()",
        "print(round(puissance, 4))",
      ),
      test: lines(
        "assert puissance is not None, \"rangez la proportion d'études qui rejettent H0 dans puissance\"",
        "assert 0.67 < puissance < 0.73, f\"avec d = 0,5 et 50 individus par groupe, la puissance est d'environ 0,70 (vous avez {puissance:.3f}) : comptez les p-values < 0,05 sur 10 000 études\"",
      ),
      hint: "Deux tableaux de forme (10000, 50) : rng.normal(100, 15, size=(10000, 50)) et rng.normal(107.5, 15, size=(10000, 50)). stats.ttest_ind(a, b, axis=1).pvalue donne 10 000 p-values.",
    },
    {
      kind: "text",
      md: `### Dimensionner une étude

Avant de recueillir des données, on choisit n pour que la puissance atteigne un objectif, souvent 80 %, pour le plus petit effet qui aurait un intérêt pratique. L'approximation normale donne une formule directe ; la loi t décentrée donne la valeur exacte, qu'on trouve en augmentant n jusqu'à l'objectif. Le résultat est parlant : la taille nécessaire varie comme **1/d²**.`,
    },
    {
      kind: "equation",
      latex: String.raw`n \;\approx\; \frac{2\,\left(z_{1-\alpha/2} + z_{1-\beta}\right)^2}{d^2} \quad\text{individus par groupe}`,
      caption: "Taille de chaque groupe pour un test à deux groupes (approximation normale)",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def puissance_theorique(n, d, alpha=0.05):",
        "    ddl = 2 * n - 2",
        "    decentrage = d * np.sqrt(n / 2)",
        "    t_crit = stats.t.ppf(1 - alpha / 2, ddl)",
        "    return 1 - stats.nct.cdf(t_crit, ddl, decentrage) + stats.nct.cdf(-t_crit, ddl, decentrage)",
        "",
        "z_alpha = stats.norm.ppf(0.975)",
        "z_beta = stats.norm.ppf(0.80)",
        "print('effet d   n (loi t, exact)   n (formule normale)')",
        "for d in [0.8, 0.5, 0.3, 0.2]:",
        "    n = 2",
        "    while puissance_theorique(n, d) < 0.80:",
        "        n += 1",
        "    approx = 2 * (z_alpha + z_beta) ** 2 / d ** 2",
        "    print(f'{d:>7}   {n:>15}   {np.ceil(approx):>19.0f}')",
      ),
      caption:
        "Pour 80 % de puissance : 26 individus par groupe suffisent pour un effet de 0,8, mais il en faut 64 pour 0,5, 176 pour 0,3 et 394 pour 0,2. Diviser l'effet par 4 (de 0,8 à 0,2) multiplie la taille par 15, proche de 4² = 16. La formule normale sous-estime d'un individu environ.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "La fonction `puissance(n, d, alpha=0.05)` est déjà définie : elle renvoie la puissance d'un test de Student à deux groupes de n individus pour un effet d (comme `puissance_theorique` ci-dessus). Trouvez la **plus petite taille de groupe** `n_min` qui donne une puissance d'au moins **0,80** pour un effet **d = 0,3**.",
      setup: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def puissance(n, d, alpha=0.05):",
        "    ddl = 2 * n - 2",
        "    decentrage = d * np.sqrt(n / 2)",
        "    t_crit = stats.t.ppf(1 - alpha / 2, ddl)",
        "    return 1 - stats.nct.cdf(t_crit, ddl, decentrage) + stats.nct.cdf(-t_crit, ddl, decentrage)",
      ),
      starter: "n_min = None",
      solution: lines(
        "n_min = 2",
        "while puissance(n_min, 0.3) < 0.80:",
        "    n_min += 1",
        "print(n_min, round(puissance(n_min, 0.3), 4))",
      ),
      test: lines(
        "assert n_min is not None, \"rangez la plus petite taille de groupe dans n_min\"",
        "assert puissance(n_min, 0.3) >= 0.80, f\"avec {n_min} individus par groupe, la puissance n'est que de {puissance(n_min, 0.3):.3f}\"",
        "assert puissance(n_min - 1, 0.3) < 0.80, f\"{n_min - 1} individus suffisent déjà (puissance {puissance(n_min - 1, 0.3):.3f}) : cherchez le plus petit n\"",
      ),
      hint: "Partez de n_min = 2 et, tant que puissance(n_min, 0.3) est inférieure à 0,80, ajoutez 1 à n_min (boucle while).",
    },
    {
      kind: "text",
      md: `### Pourquoi un résultat significatif peut être faux

La puissance éclaire un point souvent mal compris. Imaginons un domaine où l'on teste beaucoup d'hypothèses et où, **en réalité, seules 10 % sont vraies** (c'est une hypothèse d'école, pas une estimation de la réalité). Avec α = 0,05 et une puissance de 80 %, sur 1 000 hypothèses : 100 sont vraies et 80 seront détectées ; 900 sont fausses et 45 seront déclarées significatives par erreur. Sur 125 résultats significatifs, 45, soit 36 %, sont faux, même si tous les tests ont été faits correctement.

C'est un calcul de probabilités conditionnelles, le même que celui d'un test de dépistage (module 6). Simulons-le avec 20 000 hypothèses, dont 10 % ont un effet d = 0,5, testées avec 64 individus par groupe.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(9)",
        "nb, n = 20000, 64",
        "reelle = rng.random(nb) < 0.10  # 10 % des hypothèses sont vraies",
        "x = rng.normal(0, 1, size=(nb, n))",
        "y = rng.normal(0, 1, size=(nb, n)) + np.where(reelle, 0.5, 0.0)[:, None]",
        "significatif = stats.ttest_ind(x, y, axis=1).pvalue < 0.05",
        "",
        "vrais = (significatif & reelle).sum()",
        "faux = (significatif & ~reelle).sum()",
        "print(f'hypothèses vraies : {reelle.sum()}   résultats significatifs : {significatif.sum()}')",
        "print(f'puissance observée : {vrais / reelle.sum():.3f}   taux de faux positifs : {faux / (~reelle).sum():.3f}')",
        "print(f'part de résultats significatifs qui sont faux : {faux / significatif.sum():.3f}   (calcul : {0.05 * 0.9 / (0.05 * 0.9 + 0.8 * 0.1):.3f})')",
      ),
      caption:
        "Environ un tiers des résultats significatifs (33,8 %) sont faux, alors que chaque test a une puissance de 80 % (0,799 mesurée) et un risque de 5 % (0,046 mesuré). Le calcul donne 36 % ; l'écart vient du hasard de la simulation (2 040 hypothèses vraies au lieu de 2 000, 4,6 % de faux positifs au lieu de 5 %).",
    },
    {
      kind: "text",
      md: `### Regarder les données en cours de route

Une autre façon d'augmenter les faux positifs est de **faire le test plusieurs fois au fur et à mesure que les données arrivent**, et de s'arrêter dès que p < 0,05. Chaque regard est un test de plus. Simulons 5 000 expériences où l'effet est nul, avec un regard tous les 10 individus jusqu'à 100 : on compare à un seul test fait à 100 individus.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(8)",
        "x = rng.normal(0, 1, size=(5000, 100))  # aucun effet : la vraie moyenne est 0",
        "arret = np.zeros(5000, dtype=bool)",
        "for n in range(10, 101, 10):  # dix regards",
        "    p = stats.ttest_1samp(x[:, :n], 0, axis=1).pvalue",
        "    arret |= p < 0.05  # on s’arrête, ravi, dès que p < 0,05",
        "",
        "un_seul = (stats.ttest_1samp(x, 0, axis=1).pvalue < 0.05).mean()",
        "print(f'un seul test, à n = 100        : {un_seul:.3f} de faux positifs')",
        "print(f'dix regards, arrêt dès p < 0,05 : {arret.mean():.3f} de faux positifs')",
      ),
      caption: "Dix regards font passer le taux de faux positifs de 5,1 % à 19,8 %, presque quatre fois plus, sans qu'aucun test pris isolément ne soit « mal fait ».",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le **p-hacking** désigne ces usages, souvent inconscients : essayer plusieurs variables, plusieurs sous-groupes, plusieurs méthodes, plusieurs règles d'arrêt, et ne rapporter que ce qui est significatif. Les remèdes sont connus : annoncer le plan d'analyse **avant** de voir les données (préenregistrement), fixer n d'avance par un calcul de puissance, rapporter **tous** les tests réalisés, corriger les tests multiples, et vérifier les résultats sur de nouvelles données. Quand on veut vraiment surveiller un essai en continu (test A/B), il existe des méthodes séquentielles conçues pour cela.",
    },
  ],
  quiz: [
    {
      question: "On fait 20 tests indépendants à 5 % sur des données où aucun effet n'existe. Quelle est la probabilité d'obtenir au moins un résultat significatif ?",
      options: ["5 %", "Environ 20 %", "Environ 64 %", "100 %"],
      correct: 2,
      explanation: "1 − 0,95^20 ≈ 0,64. La simulation du module donne 64,0 %, avec en moyenne 1,0 faux positif par étude.",
    },
    {
      question: "Quelle différence y a-t-il entre contrôler le FWER (Bonferroni, Holm) et le FDR (Benjamini-Hochberg) ?",
      options: [
        "Aucune, ce sont deux noms de la même chose",
        "Le FWER limite la probabilité d'au moins un faux positif ; le FDR limite la part de fausses découvertes parmi les résultats significatifs, ce qui laisse détecter plus de vrais effets",
        "Le FDR est plus strict que le FWER",
        "Le FWER ne s'applique qu'aux tests t",
      ],
      correct: 1,
      explanation:
        "Dans la simulation, Bonferroni détecte 1,85 des 5 vrais effets et Benjamini-Hochberg 2,55, au prix d'un peu plus de faux positifs (0,205 contre 0,057 par étude). Sans correction, on atteint 4,31 vrais effets, mais avec 2,28 faux positifs par étude.",
    },
    {
      question: "Parmi ces leviers, lequel n'augmente PAS la puissance d'un test t à deux groupes ?",
      options: [
        "Augmenter la taille des groupes",
        "Viser un effet plus grand ou réduire la dispersion des mesures",
        "Relâcher le seuil α (par exemple passer de 0,05 à 0,10), au prix de plus de faux positifs",
        "Remplacer la p-value par la valeur de t",
      ],
      correct: 3,
      explanation:
        "Remplacer une p-value par la statistique n'est qu'une réécriture : la décision est la même. Les trois autres leviers agissent vraiment sur la puissance, la taille de l'échantillon (de 18 % à 88 % pour d = 0,5 entre 10 et 80 par groupe) en premier.",
    },
    {
      question: "Pour détecter un effet 4 fois plus petit avec la même puissance, il faut environ :",
      options: ["4 fois plus de données", "16 fois plus de données", "2 fois plus de données", "La même quantité de données"],
      correct: 1,
      explanation: "La taille nécessaire varie comme 1/d². Dans le module, 26 individus par groupe suffisent pour d = 0,8 et 394 pour d = 0,2, soit environ 15 fois plus.",
    },
    {
      question: "On vérifie p < 0,05 tous les 10 individus et l'on s'arrête dès qu'il est atteint. L'effet est nul. Quel taux de faux positifs obtient-on ?",
      options: ["5 %, puisque chaque test est à 5 %", "Environ 20 % avec dix regards", "0 %, car on s'arrête dès le premier succès", "Cela dépend de la taille d'effet"],
      correct: 1,
      explanation: "Chaque regard est un test supplémentaire : avec dix regards, la simulation donne 19,8 % de faux positifs au lieu de 5,1 % pour un seul test à n = 100.",
    },
  ],
};
