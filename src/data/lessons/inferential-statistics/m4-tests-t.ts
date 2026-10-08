import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module4: LessonModule = {
  id: "tests-t",
  title: "Les tests t et le khi-deux",
  duration: "2 h",
  summary:
    "Le test t pour une moyenne, pour deux groupes (Student contre Welch, mesuré par simulation) et pour des mesures appariées, sa sensibilité à l'asymétrie des données, la taille d'effet, puis le test du khi-deux sur des effectifs.",
  objectives: [
    "Calculer à la main la statistique t, ses degrés de liberté et sa p-value, et les retrouver avec scipy",
    "Choisir entre test de Student et test de Welch, en connaissant le risque du premier quand les variances diffèrent",
    "Mesurer par simulation la sensibilité du test t à l'asymétrie des données",
    "Rapporter une taille d'effet et l'intervalle de la différence, et appliquer le test du khi-deux d'adéquation",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le test t à un échantillon

Le test z du module précédent suppose σ connu. En pratique, on le remplace par l'écart-type d'échantillon s, et la statistique devient la **statistique t** : l'écart entre x̄ et μ0, mesuré en erreurs standard **estimées**. Sous H0, avec des observations indépendantes et des données à peu près normales, elle suit une loi t de Student à n − 1 degrés de liberté (la même loi qui a servi aux intervalles de confiance).

La p-value bilatérale est la probabilité qu'une loi t soit, en valeur absolue, au moins aussi grande que le t observé. On peut aussi comparer |t| à la **valeur critique** t(0,975 ; n − 1) : au seuil de 5 %, on rejette H0 si |t| la dépasse.`,
    },
    {
      kind: "equation",
      latex: String.raw`t \;=\; \frac{\bar{x} - \mu_0}{s/\sqrt{n}} \;\sim\; t_{n-1} \quad \text{sous } H_0`,
      caption: "Statistique du test t à un échantillon",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "temps = np.array([412, 388, 455, 401, 437, 392, 468, 420, 399, 431, 445, 409, 427, 384, 440])  # temps de chargement (ms), valeurs inventées",
        "mu0 = 410  # H0 : le temps moyen de chargement vaut 410 ms",
        "n = len(temps)",
        "t_obs = (temps.mean() - mu0) / (temps.std(ddof=1) / np.sqrt(n))",
        "p_main = 2 * stats.t.sf(abs(t_obs), n - 1)",
        "print(f'à la main : t = {t_obs:.4f}   degrés de liberté = {n - 1}   p = {p_main:.4f}')",
        "",
        "resultat = stats.ttest_1samp(temps, mu0)",
        "print(f'scipy     : t = {resultat.statistic:.4f}   degrés de liberté = {resultat.df}   p = {resultat.pvalue:.4f}')",
        "print(f'valeur critique à 5 % : {stats.t.ppf(0.975, n - 1):.4f}')",
      ),
      caption:
        "Le calcul à la main et scipy donnent la même statistique (t = 1,6002) et la même p-value (0,1319). |t| reste inférieur à la valeur critique 2,1448 : on ne rejette pas H0 à 5 %.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Une entreprise affirme que ses employés travaillent 40 heures par semaine en moyenne. Un échantillon de 25 employés (valeurs fictives) donne une moyenne de 42 heures, avec un écart-type s = 5. Test bilatéral à 5 %. Calculez `t_obs`, la `p_valeur`, la valeur critique `t_critique` (positive) et `rejet` (`True` si l'on rejette H0).",
      setup: lines("import numpy as np", "from scipy import stats", "", "n, xbar, s, mu0 = 25, 42, 5, 40"),
      starter: lines("t_obs = None", "p_valeur = None", "t_critique = None", "rejet = None"),
      solution: lines(
        "erreur_standard = s / np.sqrt(n)",
        "t_obs = (xbar - mu0) / erreur_standard",
        "p_valeur = 2 * stats.t.sf(abs(t_obs), n - 1)",
        "t_critique = stats.t.ppf(0.975, n - 1)",
        "rejet = abs(t_obs) > t_critique",
        "print(round(t_obs, 3), round(p_valeur, 4), round(t_critique, 4), rejet)",
        "print(f'intervalle à 95 % : [{xbar - t_critique * erreur_standard:.2f} ; {xbar + t_critique * erreur_standard:.2f}]')",
      ),
      test: lines(
        "assert None not in (t_obs, p_valeur, t_critique, rejet), \"rangez t_obs, p_valeur, t_critique et rejet\"",
        "assert abs(t_obs - 2.0) < 1e-9, f\"t = (42 - 40) / (5 / racine(25)) = 2 (vous avez {t_obs:.3f})\"",
        "assert abs(p_valeur - 0.05694) < 1e-4, f\"avec 24 degrés de liberté, la p-value bilatérale vaut environ 0,0569 (vous avez {p_valeur:.4f})\"",
        "assert abs(t_critique - 2.0639) < 1e-3, f\"la valeur critique est stats.t.ppf(0.975, 24) ≈ 2,064 (vous avez {t_critique:.4f})\"",
        "assert bool(rejet) is False, \"|t| = 2 est inférieur à 2,064 : on ne rejette pas H0 à 5 %\"",
      ),
      hint: "p_valeur = 2 * stats.t.sf(abs(t_obs), n - 1) ; t_critique = stats.t.ppf(0.975, n - 1) ; on rejette si abs(t_obs) > t_critique.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le résultat est limite (p ≈ 0,057) : l'intervalle de confiance à 95 % de la moyenne, [39,94 ; 44,06], contient 40 de justesse. On ne conclut pas que la moyenne vaut 40 heures : on conclut que cet échantillon ne permet pas d'exclure 40, et un écart de 2 heures reste tout à fait plausible. Seul un échantillon plus grand permettrait de trancher.",
    },
    {
      kind: "text",
      md: `### Comparer deux groupes indépendants : Student ou Welch

Pour comparer les moyennes de deux groupes indépendants, la statistique t met au numérateur l'écart des moyennes, et au dénominateur son erreur standard estimée. Deux versions existent :

- le test de **Student** suppose que les deux groupes ont la **même variance**, qu'il estime en les regroupant ;
- le test de **Welch** n'a pas besoin de cette hypothèse : il estime chaque variance séparément, et corrige les degrés de liberté (formule de Welch-Satterthwaite).`,
    },
    {
      kind: "equation",
      latex: String.raw`t \;=\; \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}} \qquad\qquad \nu \;\approx\; \frac{\left(\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}\right)^{2}}{\dfrac{(s_1^2/n_1)^2}{n_1 - 1} + \dfrac{(s_2^2/n_2)^2}{n_2 - 1}}`,
      caption: "Statistique de Welch et ses degrés de liberté",
    },
    {
      kind: "text",
      md: `Quel est le risque d'utiliser Student quand les variances diffèrent ? Mesurons-le, avec deux groupes de **même moyenne** (H0 est donc vraie : un test à 5 % devrait se tromper dans 5 % des cas) mais de tailles et de dispersions différentes. On simule 20 000 comparaisons pour chaque configuration.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "def taux_de_rejet(n1, s1, n2, s2, repetitions=20000):",
        "    rng = np.random.default_rng(1)",
        "    a = rng.normal(0, s1, size=(repetitions, n1))  # les deux groupes ont la même moyenne : H0 est vraie",
        "    b = rng.normal(0, s2, size=(repetitions, n2))",
        "    student = stats.ttest_ind(a, b, axis=1, equal_var=True).pvalue",
        "    welch = stats.ttest_ind(a, b, axis=1, equal_var=False).pvalue",
        "    return (student < 0.05).mean(), (welch < 0.05).mean()",
        "",
        "print('situation' + ' ' * 38 + 'Student  Welch')",
        "cas = [",
        "    ('n = 20 et 20, écarts-types 2 et 2      ', (20, 2, 20, 2)),",
        "    ('n = 20 et 20, écarts-types 4 et 1      ', (20, 4, 20, 1)),",
        "    ('n = 10 et 40, écarts-types 4 et 1      ', (10, 4, 40, 1)),",
        "    ('n = 10 et 40, écarts-types 1 et 4      ', (10, 1, 40, 4)),",
        "]",
        "for nom, parametres in cas:",
        "    student, welch = taux_de_rejet(*parametres)",
        "    print(f'{nom}        {student:.4f}   {welch:.4f}')",
      ),
      caption:
        "Si les variances sont égales ou si les groupes ont la même taille, Student et Welch se valent (environ 5 %). Mais quand le petit groupe est le plus dispersé (deuxième ligne du bas), Student se trompe dans près de 29 % des cas au lieu de 5 %, alors que Welch reste à 5,0 %. Dans la configuration inverse, Student est trop prudent (moins de 0,1 % de rejets) et perd toute sa puissance. Welch ne coûte presque rien quand les variances sont égales : c'est un bon choix par défaut.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Deux versions d'une page ont été chargées par des visiteurs (valeurs fictives). Version A : 40 visiteurs, temps moyen 3,2 s, écart-type 1,1 s. Version B : 35 visiteurs, temps moyen 2,8 s, écart-type 0,9 s. Calculez à la main la statistique du test de **Welch** `t_welch`, ses degrés de liberté `ddl` (formule de Welch-Satterthwaite) et la `p_valeur` bilatérale.",
      setup: lines("import numpy as np", "from scipy import stats", "", "n1, m1, s1 = 40, 3.2, 1.1", "n2, m2, s2 = 35, 2.8, 0.9"),
      starter: lines("t_welch = None", "ddl = None", "p_valeur = None"),
      solution: lines(
        "v1 = s1 ** 2 / n1",
        "v2 = s2 ** 2 / n2",
        "t_welch = (m1 - m2) / np.sqrt(v1 + v2)",
        "ddl = (v1 + v2) ** 2 / (v1 ** 2 / (n1 - 1) + v2 ** 2 / (n2 - 1))",
        "p_valeur = 2 * stats.t.sf(abs(t_welch), ddl)",
        "print(round(t_welch, 4), round(ddl, 3), round(p_valeur, 4))",
        "print(stats.ttest_ind_from_stats(m1, s1, n1, m2, s2, n2, equal_var=False))",
      ),
      test: lines(
        "assert None not in (t_welch, ddl, p_valeur), \"rangez t_welch, ddl et p_valeur\"",
        "assert abs(t_welch - 1.73109) < 1e-4, f\"t = (3,2 - 2,8) / racine(1,1² / 40 + 0,9² / 35) ≈ 1,731 (vous avez {t_welch:.4f})\"",
        "assert abs(ddl - 72.695) < 1e-2, f\"les degrés de liberté de Welch valent environ 72,7 (vous avez {ddl:.3f}), et non n1 + n2 - 2 = 73\"",
        "assert abs(p_valeur - 0.08768) < 1e-4, f\"p ≈ 0,0877 (vous avez {p_valeur:.4f}) : doublez la queue, 2 * stats.t.sf(abs(t_welch), ddl)\"",
      ),
      hint: "Posez v1 = s1² / n1 et v2 = s2² / n2. Alors t = (m1 - m2) / racine(v1 + v2) et ddl = (v1 + v2)² / (v1² / (n1 - 1) + v2² / (n2 - 1)).",
    },
    {
      kind: "text",
      md: `### Mesures appariées

Quand on mesure les **mêmes unités** deux fois (avant et après, deux méthodes sur les mêmes objets), les deux séries ne sont pas indépendantes. Le test t **apparié** n'est alors rien d'autre qu'un test t à un échantillon sur les **différences** individuelles, avec H0 : « la différence moyenne vaut 0 ». Chaque unité sert de témoin à elle-même, ce qui élimine la variabilité d'une unité à l'autre. L'application pratique est détaillée dans le module « Tests d'hypothèses » du cours *Statistiques appliquées*.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "avant = np.array([412, 388, 455, 401, 437, 392, 468, 420, 399, 431, 445, 409, 427, 384, 440])  # temps de chargement (ms), valeurs inventées",
        "gain = np.array([5, -2, 9, 4, 7, 0, 12, 3, 6, 1, 8, -1, 10, 2, 5])  # gains inventés après une optimisation",
        "apres = avant - gain",
        "",
        "apparie = stats.ttest_rel(avant, apres)",
        "sur_differences = stats.ttest_1samp(avant - apres, 0)",
        "independant = stats.ttest_ind(avant, apres, equal_var=False)",
        "print(f'apparié             : t = {apparie.statistic:.3f}   p = {apparie.pvalue:.6f}')",
        "print(f'sur les différences : t = {sur_differences.statistic:.3f}   p = {sur_differences.pvalue:.6f}')",
        "print(f'à tort, indépendant : t = {independant.statistic:.3f}   p = {independant.pvalue:.6f}')",
      ),
      caption:
        "Le test apparié et le test à un échantillon sur les différences sont identiques. Traiter à tort les deux séries comme deux groupes indépendants fait perdre toute la sensibilité : la variabilité entre unités noie un gain pourtant régulier.",
    },
    {
      kind: "text",
      md: `### Et si les données ne sont pas normales ?

Les tests t supposent des données à peu près normales, ou un échantillon assez grand pour que le théorème central limite rende la moyenne approximativement normale. Combien de données faut-il ? Mesurons l'erreur de type I d'un test t à un échantillon, quand H0 est **vraie**, pour trois lois : normale, exponentielle (asymétrique) et log-normale (très asymétrique, avec de grandes valeurs rares). On teste la vraie moyenne de chaque loi, à 5 %, 10 000 fois par taille.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(2)",
        "lois = {",
        "    'normale': (lambda forme: rng.normal(0, 1, forme), 0.0),",
        "    'exponentielle': (lambda forme: rng.exponential(1, forme), 1.0),",
        "    'log-normale': (lambda forme: rng.lognormal(0, 1, forme), np.exp(0.5)),",
        "}",
        "tailles = [10, 30, 100, 300]",
        "print('taux de rejet à 5 % quand H0 est vraie (cible : 0,05)')",
        "print('loi' + ' ' * 15 + 'n = 10    n = 30   n = 100   n = 300')",
        "for nom, (tirer, vraie_moyenne) in lois.items():",
        "    taux = []",
        "    for n in tailles:",
        "        p = stats.ttest_1samp(tirer((10000, n)), vraie_moyenne, axis=1).pvalue",
        "        taux.append((p < 0.05).mean())",
        "    print(f'{nom:<14}' + ''.join(f'{t:>10.4f}' for t in taux))",
      ),
      caption:
        "Pour des données normales, le taux reste proche de 5 % à toutes les tailles. Pour la loi exponentielle, il vaut 9,6 % à n = 10, 7,1 % à n = 30 et ne revient à 5,1 % qu'à n = 300. Pour la loi log-normale, il est de 16,2 % à n = 10, encore de 11,5 % à n = 30 et de 6,3 % à n = 300.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "« n ≥ 30 suffit » est donc une règle approximative et optimiste : elle tient pour des données peu asymétriques, pas pour des données très asymétriques. Avant un test t, regardez la forme des données (histogramme, boîte à moustaches). Si elles sont très asymétriques, comparez les logarithmes (pour des durées ou des montants), utilisez un test fondé sur les rangs (Mann-Whitney, Wilcoxon, voir *Statistiques appliquées*) ou un bootstrap.",
    },
    {
      kind: "text",
      md: `### La taille de l'effet, pas seulement la p-value

Une p-value dit si l'écart est compatible avec le hasard ; elle ne dit pas s'il est grand. On rapporte donc :

- la **différence des moyennes** dans son unité (minutes, euros), avec son **intervalle de confiance** ;
- une taille d'effet **standardisée**, le **d de Cohen** : la différence des moyennes divisée par l'écart-type combiné des deux groupes. Les repères de 0,2 (petit), 0,5 (moyen) et 0,8 (grand) donnés par Cohen sont des conventions grossières, à manier avec prudence : un petit d peut compter beaucoup (ou rien) selon le contexte.

\`stats.ttest_ind(...)\` renvoie un objet dont la méthode \`confidence_interval()\` donne l'intervalle de la différence des moyennes. Exemple avec les temps de réalisation d'une tâche (en minutes, simulés) avec deux interfaces.`,
    },
    {
      kind: "equation",
      latex: String.raw`d \;=\; \frac{\bar{x}_1 - \bar{x}_2}{s_p} \qquad\text{avec}\qquad s_p \;=\; \sqrt{\frac{(n_1-1)\,s_1^2 + (n_2-1)\,s_2^2}{n_1 + n_2 - 2}}`,
      caption: "d de Cohen",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(3)",
        "a = rng.normal(34, 8, 30).round(1)  # interface A, 30 utilisateurs",
        "b = rng.normal(29, 8, 28).round(1)  # interface B, 28 utilisateurs",
        "",
        "resultat = stats.ttest_ind(a, b, equal_var=False)",
        "ic = resultat.confidence_interval(0.95)",
        "print(f'moyennes : {a.mean():.2f} et {b.mean():.2f} minutes, écart = {a.mean() - b.mean():.2f}')",
        "print(f'Welch : t = {resultat.statistic:.3f}, ddl = {resultat.df:.1f}, p = {resultat.pvalue:.4f}')",
        "print(f'intervalle de confiance à 95 % de l’écart : [{ic.low:.2f} ; {ic.high:.2f}]')",
        "",
        "s_combine = np.sqrt(((len(a) - 1) * a.var(ddof=1) + (len(b) - 1) * b.var(ddof=1)) / (len(a) + len(b) - 2))",
        "print(f'd de Cohen = {(a.mean() - b.mean()) / s_combine:.2f}')",
      ),
      caption:
        "L'écart de 6,5 minutes est significatif (p = 0,0063), mais l'intervalle est large : de 1,9 à 11,1 minutes. Une conclusion honnête dit « l'interface B est plus rapide, de 2 à 11 minutes environ » plutôt que « 6,5 minutes ». Le d vaut 0,74, un effet moyen à grand.",
    },
    {
      kind: "text",
      md: `### Le test du khi-deux sur des effectifs

Quand les données sont des **effectifs** répartis en catégories, la statistique du khi-deux compare, pour chaque catégorie, l'effectif observé O à l'effectif attendu E sous H0. Plus elle est grande, plus les données s'écartent de H0. Sous H0, et si les effectifs attendus sont assez grands (souvent au moins 5 par catégorie), elle suit approximativement une loi du khi-deux.

Deux usages principaux :

- le test d'**adéquation** : les effectifs observés suivent-ils une répartition donnée (un dé équilibré, des proportions annoncées) ? Il y a k − 1 degrés de liberté pour k catégories ;
- le test d'**indépendance** de deux variables qualitatives, sur un tableau de contingence : E = (total de la ligne × total de la colonne) / total général, avec (lignes − 1) × (colonnes − 1) degrés de liberté. Le module « Tests non paramétriques et khi-deux » du cours *Statistiques appliquées* le pratique avec \`chi2_contingency\`.`,
    },
    {
      kind: "equation",
      latex: String.raw`\chi^2 \;=\; \sum_{i=1}^{k} \frac{\left(O_i - E_i\right)^2}{E_i}`,
      caption: "Statistique du khi-deux",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "observes = np.array([25, 17, 15, 23, 24, 16])  # 120 lancers d'un dé (valeurs fictives), faces 1 à 6",
        "attendus = np.full(6, observes.sum() / 6)  # dé équilibré : 20 par face",
        "chi2 = ((observes - attendus) ** 2 / attendus).sum()",
        "print(f'à la main : khi-deux = {chi2:.3f}, 5 degrés de liberté, p = {stats.chi2.sf(chi2, 5):.4f}')",
        "",
        "resultat = stats.chisquare(observes, attendus)",
        "print(f'scipy     : khi-deux = {resultat.statistic:.3f}, p = {resultat.pvalue:.4f}')",
        "print(f'valeur critique à 5 % : {stats.chi2.ppf(0.95, 5):.3f}')",
      ),
      caption:
        "Le khi-deux vaut 5,0 pour un seuil critique de 11,07 : p = 0,4159, rien ne contredit l'hypothèse d'un dé équilibré. Les écarts d'une face à l'autre (de 15 à 25) sont ceux que le hasard produit couramment sur 120 lancers.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Une application de quiz annonce que ses questions se répartissent en quatre niveaux dans les proportions 40 %, 30 %, 20 % et 10 %. Sur 200 questions tirées au hasard (valeurs fictives), on en compte 104, 47, 31 et 18 par niveau. Calculez les effectifs attendus `attendus`, la statistique `chi2_obs`, la `p_valeur` et `rejet` (`True` si l'on rejette l'annonce au seuil de 5 %).",
      setup: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "observes = np.array([104, 47, 31, 18])",
        "proportions = np.array([0.4, 0.3, 0.2, 0.1])",
      ),
      starter: lines("attendus = None", "chi2_obs = None", "p_valeur = None", "rejet = None"),
      solution: lines(
        "attendus = observes.sum() * proportions",
        "chi2_obs = ((observes - attendus) ** 2 / attendus).sum()",
        "ddl = len(observes) - 1",
        "p_valeur = stats.chi2.sf(chi2_obs, ddl)",
        "rejet = p_valeur < 0.05",
        "print(attendus, round(chi2_obs, 3), round(p_valeur, 4), rejet)",
      ),
      test: lines(
        "assert attendus is not None and chi2_obs is not None and p_valeur is not None and rejet is not None, \"rangez attendus, chi2_obs, p_valeur et rejet\"",
        "assert list(np.round(attendus, 6)) == [80.0, 60.0, 40.0, 20.0], f\"les effectifs attendus sont 200 × 0,4, 200 × 0,3, 200 × 0,2 et 200 × 0,1 (vous avez {list(attendus)})\"",
        "assert abs(chi2_obs - 12.2417) < 1e-3, f\"khi-deux = somme de (O - E)² / E ≈ 12,24 (vous avez {chi2_obs:.3f})\"",
        "assert abs(p_valeur - stats.chisquare(observes, attendus).pvalue) < 1e-6, f\"la loi a k - 1 = 3 degrés de liberté : stats.chi2.sf(chi2_obs, 3) (vous avez p = {p_valeur:.4f})\"",
        "assert bool(rejet) is True, \"p est inférieure à 0,05 : on rejette la répartition annoncée\"",
      ),
      hint: "attendus = 200 × les proportions (observes.sum() * proportions). Il y a 4 catégories, donc 3 degrés de liberté. stats.chisquare(observes, attendus) permet de vérifier.",
    },
  ],
  quiz: [
    {
      question: "Pour comparer les moyennes de deux groupes indépendants, quel test t choisir par défaut ?",
      options: [
        "Student, plus simple",
        "Welch, qui ne suppose pas des variances égales et perd très peu quand elles le sont",
        "Le test apparié",
        "Le test z",
      ],
      correct: 1,
      explanation:
        "Dans la simulation, Student rejette à tort 29 % du temps (au lieu de 5 %) quand le petit groupe est le plus dispersé, alors que Welch reste à 5,0 %. Quand les variances sont égales, les deux se valent.",
    },
    {
      question: "On mesure les mêmes 15 pages avant et après une optimisation. Quel test ?",
      options: [
        "Un test t de Welch entre deux groupes indépendants",
        "Un test t apparié, c'est-à-dire un test à un échantillon sur les différences",
        "Un test du khi-deux",
        "Aucun, il faut plus de données",
      ],
      correct: 1,
      explanation:
        "Les deux séries portent sur les mêmes unités. Le test apparié compare la moyenne des différences à 0 ; dans l'exemple, le traiter à tort comme indépendant fait perdre toute la sensibilité.",
    },
    {
      question: "Pourquoi « n ≥ 30, donc le test t est valable » est-il une règle trop optimiste ?",
      options: [
        "Parce que 30 est trop petit pour tout test",
        "Parce que, pour des données très asymétriques (log-normales, par exemple), le taux de faux positifs d'un test à 5 % reste nettement supérieur à 5 % à n = 30",
        "Parce que le test t ne marche qu'avec des données exactement normales",
        "Parce que la valeur critique change à partir de 30",
      ],
      correct: 1,
      explanation:
        "La simulation donne un taux de rejet nettement supérieur à 5 % pour des données log-normales à n = 30, et il ne se rapproche de 5 % que lentement quand n augmente. Le théorème central limite est un résultat limite, sans seuil garanti.",
    },
    {
      question: "Que montre un d de Cohen que la p-value ne montre pas ?",
      options: [
        "La probabilité que H0 soit vraie",
        "La taille de l'écart, rapportée à la dispersion des données",
        "Si les données sont normales",
        "Le nombre de degrés de liberté",
      ],
      correct: 1,
      explanation:
        "La p-value mélange la taille de l'effet et celle de l'échantillon. Le d standardise l'écart par l'écart-type combiné, et s'interprète indépendamment de n ; l'intervalle de confiance de l'écart complète l'information.",
    },
    {
      question: "Combien de degrés de liberté a un test du khi-deux d'adéquation sur 6 catégories (les faces d'un dé) ?",
      options: ["6", "5", "1", "120"],
      correct: 1,
      explanation: "Les effectifs sont contraints par leur total : une fois cinq effectifs connus, le sixième s'en déduit. Il y a donc k − 1 = 5 degrés de liberté.",
    },
  ],
};
