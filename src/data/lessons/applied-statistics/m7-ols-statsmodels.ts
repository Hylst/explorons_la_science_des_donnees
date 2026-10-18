import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DIABETE } from "./data";

/** Le jeu du diabète (data.ts) et statsmodels, avec ses formules à la R */
const DIABETE_SM = lines(DIABETE, "import statsmodels.formula.api as smf");

/**
 * Exemples du module, exportés pour src/data/lessons/applied-statistics/m7-ols-statsmodels.test.ts, qui vérifie chaque
 * nombre cité dans les légendes et le texte (mesurés sur le moteur du site le 18 octobre 2026).
 */
export const M7_TABLEAU = lines(
  DIABETE_SM,
  "",
  "res = smf.ols('progression ~ imc + bp + s5', data=d).fit()",
  "print(res.summary().tables[1])",
  "print(f'R² = {res.rsquared:.3f}   R² ajusté = {res.rsquared_adj:.3f}   n = {int(res.nobs)}')",
);

export const M7_QUALITATIVES = lines(
  DIABETE_SM,
  "",
  "# C(sex) : sex est une catégorie (codes 1 et 2), pas un nombre",
  "r1 = smf.ols('progression ~ imc + C(sex)', data=d).fit()",
  "print('effet du groupe 2, à IMC égal :', round(r1.params['C(sex)[T.2.0]'], 2), '  p =', round(r1.pvalues['C(sex)[T.2.0]'], 3))",
  "",
  "# imc * C(sex) : les deux effets et leur interaction imc:C(sex)",
  "r2 = smf.ols('progression ~ imc * C(sex)', data=d).fit()",
  "pente_1 = r2.params['imc']",
  "pente_2 = pente_1 + r2.params['imc:C(sex)[T.2.0]']",
  "print(f'pente de l\\'IMC : groupe 1 {pente_1:.2f}, groupe 2 {pente_2:.2f}')",
  "print('interaction : p =', round(r2.pvalues['imc:C(sex)[T.2.0]'], 3))",
);

export const M7_DIAGNOSTICS = lines(
  DIABETE_SM,
  "import matplotlib.pyplot as plt",
  "import statsmodels.api as sm",
  "from statsmodels.stats.stattools import jarque_bera",
  "from statsmodels.stats.diagnostic import het_breuschpagan",
  "",
  "res = smf.ols('progression ~ imc + bp + s5', data=d).fit()",
  "",
  "fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))",
  "ax1.scatter(res.fittedvalues, res.resid, s=10, alpha=0.5)",
  "ax1.axhline(0, color='black', linewidth=1)",
  "ax1.set_xlabel('valeurs ajustées')",
  "ax1.set_ylabel('résidus')",
  "ax1.set_title('Résidus contre valeurs ajustées')",
  "sm.qqplot(res.resid, line='s', ax=ax2)",
  "ax2.set_title('Quantiles des résidus (QQ-plot)')",
  "plt.tight_layout()",
  "plt.show()",
  "",
  "jb, p_jb, asymetrie, aplatissement = jarque_bera(res.resid)",
  "print(f'Jarque-Bera : p = {p_jb:.3f} (asymétrie {asymetrie:.2f}, aplatissement {aplatissement:.2f})')",
  "lm, p_bp, f, p_f = het_breuschpagan(res.resid, res.model.exog)",
  "print(f'Breusch-Pagan : p = {p_bp:.3f}')",
  "robuste = smf.ols('progression ~ imc + bp + s5', data=d).fit(cov_type='HC3')",
  "print(f\"erreur standard de l'IMC : {res.bse['imc']:.3f} (classique), {robuste.bse['imc']:.3f} (HC3)\")",
);

export const M7_COLINEARITE = lines(
  DIABETE_SM,
  "from statsmodels.stats.outliers_influence import variance_inflation_factor",
  "",
  "complet = smf.ols('progression ~ age + sex + imc + bp + s1 + s2 + s3 + s4 + s5 + s6', data=d).fit()",
  "X = complet.model.exog",
  "for i, nom in enumerate(complet.model.exog_names):",
  "    if nom != 'Intercept':",
  "        print(f'VIF {nom:>3} : {variance_inflation_factor(X, i):6.2f}')",
  "print('corrélation s1 et s2 :', round(d['s1'].corr(d['s2']), 3))",
  "",
  "res = smf.ols('progression ~ imc + bp + s5', data=d).fit()",
  "cook = res.get_influence().cooks_distance[0]",
  "print(f'distance de Cook : maximum {cook.max():.3f}, {(cook > 4 / len(d)).sum()} points au-dessus de 4/n = {4 / len(d):.3f}')",
);

export const M7_VARIABLES_OMISES = lines(
  DIABETE_SM,
  "",
  "for formule in ['progression ~ s1', 'progression ~ s1 + s5']:",
  "    r = smf.ols(formule, data=d).fit()",
  "    print(f\"{formule:<24} coefficient de s1 : {r.params['s1']:+.3f}   p = {r.pvalues['s1']:.3f}\")",
  "print('corrélation de s1 et s5 :', round(d['s1'].corr(d['s5']), 3))",
  "",
  "for formule in ['progression ~ sex', 'progression ~ age + sex + imc + bp + s1 + s2 + s3 + s4 + s5 + s6']:",
  "    r = smf.ols(formule, data=d).fit()",
  "    print(f\"coefficient de sex : {r.params['sex']:+.2f}   p = {r.pvalues['sex']:.4f}   ({len(r.params) - 1} variable(s))\")",
);

export const moduleOlsStatsmodels: LessonModule = {
  id: "ols-statsmodels",
  title: "Régression multiple avec statsmodels",
  duration: "2 h 30",
  summary: "Ajuster une régression à plusieurs variables, lire son tableau de coefficients, vérifier ses hypothèses et savoir ce qu'elle ne dit pas.",
  objectives: [
    "Ajuster une régression multiple avec une formule (smf.ols) et lire le tableau des coefficients",
    "Interpréter un coefficient « toutes choses égales par ailleurs », une variable qualitative et une interaction",
    "Vérifier les hypothèses : résidus, normalité, variance constante, colinéarité, points influents",
    "Reconnaître ce qu'une régression ne dit pas : causalité, extrapolation, variables omises",
  ],
  sections: [
    {
      kind: "text",
      md: `### statsmodels à côté de scikit-learn

Le module 4 ajustait une droite avec une seule variable. Avec plusieurs variables, deux bibliothèques font le même calcul (les moindres carrés) pour deux usages différents :

- **scikit-learn** sert la **prédiction** : on mesure l'erreur sur des données nouvelles (le cours de machine learning supervisé) ;
- **statsmodels** sert l'**inférence** : pour chaque coefficient, une erreur standard, un intervalle de confiance et un test, pour juger ce que les données disent vraiment.

statsmodels accepte des **formules** à la manière du langage R : \`"progression ~ imc + bp + s5"\` se lit « la progression expliquée par l'IMC, la pression artérielle et s5 ». On reprend le jeu du diabète du module 4 (442 patients, mesures d'origine, fourni avec scikit-learn) : s1 à s6 sont six mesures sanguines (cholestérol total, LDL, HDL, rapport cholestérol sur HDL, s5 que la documentation du jeu décrit comme « probablement » le logarithme des triglycérides, glycémie).`,
    },
    {
      kind: "equation",
      latex: String.raw`y_i = \beta_0 + \beta_1\,x_{i1} + \beta_2\,x_{i2} + \dots + \beta_p\,x_{ip} + \varepsilon_i`,
      caption: "Le modèle : chaque coefficient βⱼ est l'effet moyen de la variable xⱼ quand les autres variables du modèle restent fixes ; ε est l'erreur.",
    },
    {
      kind: "equation",
      latex: String.raw`R^2 = 1 - \frac{\sum_i \left(y_i - \hat{y}_i\right)^2}{\sum_i \left(y_i - \bar{y}\right)^2} \qquad R^2_{\text{ajusté}} = 1 - \left(1 - R^2\right)\frac{n - 1}{n - p - 1}`,
      caption: "Le R² ne baisse jamais quand on ajoute une variable, même inutile ; le R² ajusté retire une pénalité pour chacune des p variables (n observations).",
    },
    {
      kind: "code",
      language: "python",
      code: M7_TABLEAU,
      caption: "Chaque point d'IMC de plus est associé, en moyenne, à 6,5 points de progression de plus, à pression artérielle (bp) et s5 égales, avec un intervalle de confiance à 95 % de 5,13 à 7,87. Les trois variables expliquent environ la moitié de la variance : R² = 0,480, R² ajusté = 0,477.",
    },
    {
      kind: "text",
      md: `### Lire le tableau des coefficients

- **coef** : le coefficient estimé.
- **std err** : son erreur standard, l'incertitude due à l'échantillon.
- **t** : le coefficient divisé par son erreur standard.
- **P>|t|** : la p-value du test « ce coefficient est nul, **les autres variables étant dans le modèle** ».
- **[0.025, 0.975]** : l'intervalle de confiance à 95 %.

Au module 4, l'IMC seul donnait une pente d'environ 10,2 ; ici, à pression artérielle et s5 égales, elle tombe à 6,5. L'IMC est lié à ces deux variables : une partie de ce que la droite simple lui attribuait passe par elles. Un coefficient n'a de sens qu'avec la liste des variables du modèle : c'est le « toutes choses égales par ailleurs ».`,
    },
    {
      kind: "text",
      md: `### Variables qualitatives et interactions

Une variable qualitative s'écrit \`C(...)\` dans la formule : statsmodels crée une indicatrice par modalité, sauf une, prise comme référence. Le coefficient \`C(sex)[T.2.0]\` est l'écart moyen du groupe codé 2 par rapport au groupe codé 1, à valeurs égales des autres variables. La documentation du jeu ne dit pas quel code correspond à quel sexe : on parle donc des groupes 1 et 2.

Une **interaction** \`imc:C(sex)\` permet à la pente de l'IMC de différer entre les groupes ; \`imc * C(sex)\` est le raccourci de \`imc + C(sex) + imc:C(sex)\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: M7_QUALITATIVES,
      caption: "À IMC égal, les deux groupes ne se distinguent pas (écart de -1,34, p = 0,823). Avec l'interaction, la pente de l'IMC vaut 8,83 dans le groupe 1 et 12,14 dans le groupe 2 (interaction : p = 0,015). Un résultat à confirmer avant d'en tirer une conclusion : on a fait ici plusieurs tests sur les mêmes données.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajustez la régression de la **progression** sur l'**IMC** et la **pression artérielle** (`bp`) avec `smf.ols`. Rangez le coefficient de l'IMC dans `coef_imc` et son intervalle de confiance à 95 % dans `ic_imc`, sous la forme d'un couple `(borne_basse, borne_haute)`.",
      setup: DIABETE_SM,
      starter: lines("res = None", "coef_imc = None", "ic_imc = None"),
      solution: lines(
        "res = smf.ols('progression ~ imc + bp', data=d).fit()",
        "coef_imc = res.params['imc']",
        "ic_imc = tuple(res.conf_int().loc['imc'])",
        "print(round(coef_imc, 3), [round(x, 3) for x in ic_imc])",
      ),
      test: lines(
        "attendu = smf.ols('progression ~ imc + bp', data=d).fit()",
        "assert coef_imc is not None, \"rangez le coefficient de l'IMC dans coef_imc\"",
        "assert abs(float(coef_imc) - attendu.params['imc']) < 1e-9, f\"avec imc et bp dans le modèle, le coefficient de l'IMC vaut environ {attendu.params['imc']:.3f}\"",
        "assert ic_imc is not None and len(ic_imc) == 2, \"ic_imc doit être un couple (borne basse, borne haute)\"",
        "bas, haut = attendu.conf_int().loc['imc']",
        "assert abs(float(ic_imc[0]) - bas) < 1e-9 and abs(float(ic_imc[1]) - haut) < 1e-9, f\"l'intervalle à 95 % de l'IMC va d'environ {bas:.3f} à {haut:.3f}\"",
      ),
      hint: "`res.params['imc']` donne le coefficient ; `res.conf_int()` renvoie un tableau des intervalles à 95 %, une ligne par variable : `res.conf_int().loc['imc']` contient les deux bornes.",
    },
    {
      kind: "text",
      md: `### Vérifier les hypothèses

Les erreurs standard et les p-values du tableau supposent que le modèle est correct. On vérifie :

- **la forme du lien et la variance** : le graphique des **résidus contre les valeurs ajustées** ne doit montrer ni courbe (lien non linéaire oublié) ni entonnoir (variance qui grandit) ;
- **la normalité des résidus** : un **QQ-plot** (les points suivent la droite) et le test de **Jarque-Bera** ;
- **la variance constante** (homoscédasticité) : le test de **Breusch-Pagan** ; en cas de doute, des **erreurs standard robustes** (\`cov_type="HC3"\`) restent valables même si la variance n'est pas constante ;
- **la colinéarité** : des variables explicatives très liées entre elles rendent leurs coefficients instables ; le **VIF** (facteur d'inflation de la variance) le mesure, et un VIF au-delà de 10 est un seuil d'alerte usuel ;
- **les points influents** : la **distance de Cook** mesure combien les coefficients bougent si l'on retire un point ; 4/n est un repère usuel pour regarder un point de plus près, pas une règle pour le supprimer.`,
    },
    {
      kind: "code",
      language: "python",
      code: M7_DIAGNOSTICS,
      caption: "Les résidus ne montrent ni courbe ni entonnoir marqués. Jarque-Bera : p = 0,032, la normalité est rejetée au seuil de 5 %, mais l'écart est modeste (asymétrie 0,18, aplatissement 2,51 pour 3 sous une loi normale) ; avec 442 observations, les tests sur les coefficients y sont peu sensibles. Breusch-Pagan : p = 0,059, pas de preuve nette d'une variance qui change ; l'erreur standard robuste de l'IMC (0,743) reste proche de la classique (0,697).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le modèle `res` (progression expliquée par l'IMC, `bp` et `s5`) est déjà ajusté. Tracez le graphique des **résidus contre les valeurs ajustées** : un nuage de points (`ax.scatter`), une ligne horizontale à 0 (`ax.axhline(0)`) et un titre qui contient le mot « Résidus ». Calculez ensuite la p-value du test de **Breusch-Pagan** avec `het_breuschpagan(res.resid, res.model.exog)` et rangez-la dans `p_bp`.",
      setup: lines(
        DIABETE_SM,
        "import matplotlib.pyplot as plt",
        "from statsmodels.stats.diagnostic import het_breuschpagan",
        "res = smf.ols('progression ~ imc + bp + s5', data=d).fit()",
      ),
      starter: lines("fig, ax = plt.subplots()", "# votre graphique ici", "", "p_bp = None"),
      solution: lines(
        "fig, ax = plt.subplots()",
        "ax.scatter(res.fittedvalues, res.resid, s=10)",
        "ax.axhline(0, color='black')",
        "ax.set_title('Résidus contre valeurs ajustées')",
        "plt.show()",
        "",
        "lm, p_bp, f, p_f = het_breuschpagan(res.resid, res.model.exog)",
        "print(round(p_bp, 3))",
      ),
      test: lines(
        "ax = plt.gcf().axes[0] if plt.gcf().axes else None",
        "assert ax is not None, \"tracez le graphique dans une figure (fig, ax = plt.subplots())\"",
        "points = sum(len(c.get_offsets()) for c in ax.collections)",
        "assert points == len(d), f\"le nuage doit avoir un point par patient, soit {len(d)} (vous en avez {points})\"",
        "assert any(len(l.get_ydata()) and all(float(y) == 0 for y in l.get_ydata()) for l in ax.lines), \"ajoutez la ligne horizontale à 0 avec ax.axhline(0)\"",
        "assert 'sidus' in ax.get_title(), \"donnez au graphique un titre qui contient « Résidus »\"",
        "attendu = het_breuschpagan(res.resid, res.model.exog)[1]",
        "assert p_bp is not None and abs(float(p_bp) - attendu) < 1e-9, f\"la p-value de Breusch-Pagan est le deuxième élément renvoyé, environ {attendu:.3f}\"",
      ),
      hint: "`res.fittedvalues` donne les valeurs ajustées et `res.resid` les résidus. `het_breuschpagan` renvoie quatre nombres : la statistique du test, sa p-value, puis une version F du même test et sa p-value.",
    },
    {
      kind: "code",
      language: "python",
      code: M7_COLINEARITE,
      caption: "Avec les dix variables, quatre VIF dépassent 10 : s1 (59,2), s2 (39,2), s3 (15,4) et s5 (10,1). Le cholestérol total (s1) et le LDL (s2) sont corrélés à 0,897 : le modèle peine à séparer leurs effets. La distance de Cook la plus grande vaut 0,033 : 24 points dépassent le repère 4/n = 0,009, sans qu'aucun ne domine les autres.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le modèle `complet` contient les dix variables du jeu. Calculez le VIF de chaque variable (sans l'ordonnée à l'origine `Intercept`) avec `variance_inflation_factor(X, i)` et rangez dans `colineaires` la **liste triée** des noms des variables dont le VIF dépasse 10.",
      setup: lines(
        DIABETE_SM,
        "from statsmodels.stats.outliers_influence import variance_inflation_factor",
        "complet = smf.ols('progression ~ age + sex + imc + bp + s1 + s2 + s3 + s4 + s5 + s6', data=d).fit()",
        "X = complet.model.exog",
        "noms = complet.model.exog_names",
      ),
      starter: "colineaires = []",
      solution: lines(
        "colineaires = sorted(nom for i, nom in enumerate(noms) if nom != 'Intercept' and variance_inflation_factor(X, i) > 10)",
        "print(colineaires)",
      ),
      test: lines(
        "assert colineaires == ['s1', 's2', 's3', 's5'], f\"quatre variables ont un VIF au-dessus de 10 : s1, s2, s3 et s5 (vous avez {colineaires})\"",
      ),
      hint: "`noms[i]` est le nom de la colonne `i` de `X` ; la colonne 0 est `Intercept`, à laisser de côté. Parcourez `enumerate(noms)` et gardez les noms dont le VIF dépasse 10, puis triez.",
    },
    {
      kind: "text",
      md: `### Ce qu'une régression ne dit pas

- **Pas de causalité** : un coefficient décrit une association à variables égales, pas l'effet d'une intervention. Le module 4 l'a dit pour une corrélation ; ajouter des variables ne change pas cette limite.
- **Pas d'extrapolation** : dans ce jeu, l'IMC va de 18 à 42,2. Le modèle ne dit rien d'un IMC en dehors de cette plage.
- **Les variables omises** : un coefficient dépend des autres variables du modèle, au point de pouvoir changer de signe, comme le montre l'exemple ci-dessous.`,
    },
    {
      kind: "code",
      language: "python",
      code: M7_VARIABLES_OMISES,
      caption: "Seul, le cholestérol total (s1) est associé à une progression plus forte (+0,472, p < 0,001) ; à s5 égal, son coefficient devient négatif (-0,242, p = 0,018). s1 et s5 sont corrélés (0,516) : sans s5, s1 portait une partie de ce que s5 explique. De même, la variable sex passe de +6,65 (p = 0,366) seule à -22,86 (p = 0,0001) avec les neuf autres. Aucun de ces coefficients n'est « le vrai effet » : chacun répond à une question différente.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une p-value de coefficient répond à une question précise : « ce coefficient est-il nul, les autres variables étant dans le modèle ? ». Choisir les variables d'après les p-values obtenues sur les mêmes données, puis rapporter ces p-values, les rend trop optimistes : c'est le même problème que les tests multiples du cours de statistiques inférentielles.",
    },
  ],
  quiz: [
    {
      question: "Dans le modèle progression ~ imc + bp + s5, le coefficient de l'IMC vaut 6,5. Il signifie :",
      options: [
        "Que l'IMC cause 6,5 points de progression",
        "Qu'un point d'IMC de plus est associé en moyenne à 6,5 points de progression, à bp et s5 égales",
        "Que 6,5 % de la variance est expliquée par l'IMC",
        "Que la corrélation entre l'IMC et la progression vaut 6,5",
      ],
      correct: 1,
      explanation: "Un coefficient de régression multiple est une association moyenne, les autres variables du modèle étant fixées. Il ne dit rien de la causalité.",
    },
    {
      question: "Pourquoi regarder le R² ajusté plutôt que le R² pour comparer des modèles qui n'ont pas le même nombre de variables ?",
      options: [
        "Le R² ajusté est toujours plus grand",
        "Le R² ne baisse jamais quand on ajoute une variable, même inutile ; le R² ajusté retire une pénalité par variable",
        "Le R² ajusté ne dépend pas des données",
        "Le R² n'existe pas avec statsmodels",
      ],
      correct: 1,
      explanation: "Ajouter une variable fait au pire stagner le R². Le R² ajusté tient compte du nombre de variables p et du nombre d'observations n.",
    },
    {
      question: "Le test de Breusch-Pagan donne p = 0,059. Que faire des erreurs standard ?",
      options: [
        "Les jeter : le modèle est faux",
        "Rien ne prouve nettement une variance non constante ; les erreurs standard robustes HC3, proches des classiques, le confirment",
        "Supprimer les points aux plus grands résidus",
        "Remplacer la régression par une corrélation",
      ],
      correct: 1,
      explanation: "Au seuil de 5 %, on ne rejette pas la variance constante. Les erreurs HC3 restent valables dans les deux cas : ici, 0,743 contre 0,697 pour l'IMC.",
    },
    {
      question: "Le VIF du cholestérol total (s1) vaut 59,2 dans le modèle complet. Qu'est-ce que cela signale ?",
      options: [
        "Que s1 est la variable la plus importante",
        "Que s1 est très liée aux autres variables explicatives : son coefficient est instable et difficile à interpréter",
        "Que s1 contient des valeurs manquantes",
        "Que le modèle explique 59,2 % de la variance",
      ],
      correct: 1,
      explanation: "Le VIF mesure combien la variance du coefficient est gonflée par la colinéarité. s1 et s2 (LDL) sont corrélés à 0,897 : le modèle peine à séparer leurs effets.",
    },
    {
      question: "Seul, s1 a un coefficient positif ; avec s5 dans le modèle, il devient négatif. Quelle est la bonne lecture ?",
      options: [
        "Le premier modèle est faux, le second est le bon",
        "Les deux coefficients répondent à des questions différentes : l'association de s1 seule, ou à s5 égal",
        "Le changement de signe prouve un effet causal de s5",
        "Il s'agit d'une erreur de calcul de statsmodels",
      ],
      correct: 1,
      explanation: "Un coefficient dépend des variables présentes dans le modèle. s1 et s5 étant corrélés, ajouter s5 change ce que mesure le coefficient de s1.",
    },
  ],
};
