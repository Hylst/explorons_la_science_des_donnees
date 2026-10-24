import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** iris (colonnes à la R) et deux jeux livrés avec statsmodels : stackloss (aussi dans R) et spector (note de cours de Greene). */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import statsmodels.api as sm",
  "import statsmodels.formula.api as smf",
  "from scipy import stats",
  "from sklearn.datasets import load_iris",
  "_brut = load_iris(as_frame=True)",
  "iris = _brut.data.copy()",
  "iris.columns = ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']",
  "iris['Species'] = pd.Categorical.from_codes(_brut.target, _brut.target_names)",
  "stackloss = sm.datasets.stackloss.load_pandas().data",
  "spector = sm.datasets.spector.load_pandas().data",
);

export const moduleRStatistiques: LessonModule = {
  id: "statistiques",
  title: "Tests et régression : R et statsmodels",
  duration: "2 h 30",
  summary: "Les tests classiques de R (t.test, chisq.test, cor.test), la régression lm avec sa formule y ~ x1 + x2 et la régression logistique glm, lus en R et calculés en Python avec SciPy et statsmodels, dont la syntaxe de formule est la même.",
  objectives: [
    "Lire t.test, chisq.test et cor.test et les reproduire avec scipy.stats, en sachant quelles options par défaut diffèrent ou coïncident",
    "Écrire une régression linéaire avec une formule, identique en R (lm) et en Python (statsmodels.formula.api)",
    "Interpréter un tableau de coefficients : estimation, erreur standard, statistique, p-valeur, R² et R² ajusté",
    "Passer de glm(family = binomial) à smf.logit ou smf.glm et lire un coefficient comme un rapport de cotes",
  ],
  sections: [
    {
      kind: "text",
      md: `### Des tests prêts à l'emploi

R a été pensé pour les statisticiens : chaque test classique est une fonction, et son résultat s'affiche sous forme d'un petit rapport (statistique, degrés de liberté, p-valeur, intervalle de confiance). En Python, la même matière se répartit entre **SciPy** (\`scipy.stats\`, les tests) et **statsmodels** (les modèles, avec des rapports proches de ceux de R).

Rappel d'honnêteté : le moteur de ce site **ne contient pas R**. Le code R est à lire (blocs « R »), et tous les nombres affichés viennent de Python. Quand on écrit qu'une fonction de R calcule la même grandeur, c'est que la définition mathématique est la même (un test de Welch reste un test de Welch), pas que l'on a comparé des sorties.

Un test de plus ne remplace pas la question posée : une p-valeur de 0,03 ne dit pas que l'effet est important, seulement qu'il serait peu probable sous l'hypothèse de départ. On la lit avec la taille de l'effet et un intervalle de confiance.`,
    },
    {
      kind: "text",
      md: `### Comparer deux moyennes : t.test

\`\`\`r
# Code R à lire
versicolor <- subset(iris, Species == "versicolor")$Sepal.Length
virginica  <- subset(iris, Species == "virginica")$Sepal.Length

t.test(versicolor, virginica)    # test t de Welch (variances non supposées égales)
t.test(versicolor, virginica, var.equal = TRUE)   # test t de Student classique
\`\`\`

Point clé : **\`t.test\` utilise par défaut le test de Welch**, qui ne suppose pas que les deux groupes ont la même variance. \`scipy.stats.ttest_ind\` fait l'inverse : son défaut est le test de Student classique (\`equal_var=True\`), et il faut écrire \`equal_var=False\` pour obtenir le test de Welch. Un piège typique du passage d'un langage à l'autre : la même ligne, deux tests différents.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "versicolor = iris.loc[iris['Species'] == 'versicolor', 'Sepal.Length']",
        "virginica = iris.loc[iris['Species'] == 'virginica', 'Sepal.Length']",
        "",
        "# t.test(versicolor, virginica) : Welch, d'où equal_var=False",
        "welch = stats.ttest_ind(versicolor, virginica, equal_var=False)",
        "ic = welch.confidence_interval()",
        "print('moyennes :', round(versicolor.mean(), 3), round(virginica.mean(), 3))",
        "print('Welch : t =', round(welch.statistic, 3), ' ddl =', round(welch.df, 2), ' p =', f'{welch.pvalue:.2e}')",
        "print('IC à 95 % de la différence :', round(ic.low, 3), 'à', round(ic.high, 3))",
        "",
        "# t.test(..., var.equal = TRUE)",
        "student = stats.ttest_ind(versicolor, virginica)",
        "print('Student : t =', round(student.statistic, 3), ' ddl =', student.df, ' p =', f'{student.pvalue:.2e}')",
      ),
      caption: "Les moyennes sont 5,936 cm (versicolor) et 6,588 cm (virginica) : t = -5,629, 94,03 degrés de liberté pour Welch (98 pour Student), p = 1,87e-07. L'intervalle de confiance à 95 % de la différence va de -0,882 à -0,422 cm. Les deux tests concluent pareil ici parce que les groupes ont des tailles égales (50) et des variances proches ; ce n'est pas toujours le cas. Le test dit si la différence est nette dans cet échantillon de 50 fleurs par espèce, pas si elle vaut pour toutes les populations d'iris.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `t.test(versicolor, virginica)` sur la **largeur** du sépale (`Sepal.Width`). Le tableau `iris` est prêt. Rangez dans `t` la statistique du test de **Welch** (versicolor moins virginica) et dans `p` sa p-valeur.",
      setup: DONNEES,
      starter: lines(
        "versicolor = iris.loc[iris['Species'] == 'versicolor', 'Sepal.Width']",
        "virginica = iris.loc[iris['Species'] == 'virginica', 'Sepal.Width']",
        "resultat = stats.ttest_ind(versicolor, virginica)",
        "t, p = resultat.statistic, resultat.pvalue",
      ),
      solution: lines(
        "versicolor = iris.loc[iris['Species'] == 'versicolor', 'Sepal.Width']",
        "virginica = iris.loc[iris['Species'] == 'virginica', 'Sepal.Width']",
        "resultat = stats.ttest_ind(versicolor, virginica, equal_var=False)",
        "t, p = resultat.statistic, resultat.pvalue",
        "print(round(t, 3), round(p, 4))",
      ),
      test: lines(
        "_a = iris.loc[iris['Species'] == 'versicolor', 'Sepal.Width'].to_numpy()",
        "_b = iris.loc[iris['Species'] == 'virginica', 'Sepal.Width'].to_numpy()",
        "_va, _vb = _a.var(ddof=1) / len(_a), _b.var(ddof=1) / len(_b)",
        "_t = (_a.mean() - _b.mean()) / np.sqrt(_va + _vb)",
        "_ddl = (_va + _vb) ** 2 / (_va ** 2 / (len(_a) - 1) + _vb ** 2 / (len(_b) - 1))",
        "_p = 2 * stats.t.sf(abs(_t), _ddl)",
        "assert abs(t - _t) < 1e-9, f\"la statistique de Welch attendue est {_t:.3f} ; scipy utilise Student par défaut, il faut equal_var=False (vous avez {t:.3f})\"",
        "assert abs(p - _p) < 1e-9, \"la p-valeur doit être celle du test de Welch (equal_var=False)\"",
      ),
      hint: "stats.ttest_ind(a, b, equal_var=False) est le test de Welch, comme t.test() en R.",
    },
    {
      kind: "text",
      md: `### Deux variables catégorielles : chisq.test

Le test du khi-deux d'indépendance compare les effectifs observés d'un tableau croisé à ceux que l'on attendrait si les deux variables étaient indépendantes.

\`\`\`r
# Code R à lire (tab : tableau croisé 2 x 2 construit avec table())
tab <- table(donnees$PSI, donnees$GRADE)
chisq.test(tab)                    # avec correction de continuité de Yates (2 x 2)
chisq.test(tab, correct = FALSE)   # sans correction
fisher.test(tab)                   # test exact de Fisher, pour de petits effectifs
\`\`\`

Pour un tableau 2 sur 2, \`chisq.test\` de R applique par défaut la **correction de continuité de Yates**, et \`scipy.stats.chi2_contingency\` aussi (\`correction=True\`). Le jeu utilisé ici est \`spector\`, livré avec statsmodels : 32 étudiants, avec \`PSI\` (1 s'ils ont suivi une méthode d'enseignement expérimentale) et \`GRADE\` (1 si leur note s'est améliorée). Selon la documentation de statsmodels, il provient d'une étude de Spector et Mazzeo (1980) reprise dans un manuel d'économétrie ; il n'est pas livré avec R, il faudrait le charger depuis un fichier.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "tab = pd.crosstab(spector['PSI'], spector['GRADE'])        # table(PSI, GRADE)",
        "print(tab)",
        "",
        "avec = stats.chi2_contingency(tab)                        # chisq.test(tab)",
        "sans = stats.chi2_contingency(tab, correction=False)      # chisq.test(tab, correct = FALSE)",
        "print('avec Yates : khi2 =', round(avec.statistic, 3), ' p =', round(avec.pvalue, 4), ' ddl =', avec.dof)",
        "print('sans correction : khi2 =', round(sans.statistic, 3), ' p =', round(sans.pvalue, 4))",
        "print('plus petit effectif attendu :', avec.expected_freq.min())",
        "print('Fisher exact : p =', round(stats.fisher_exact(tab).pvalue, 4))",
      ),
      caption: "Sur 32 étudiants, 8 des 14 qui ont suivi la méthode ont progressé, contre 3 des 18 autres. Le khi-deux vaut 4,066 avec la correction de Yates (p = 0,0438) et 5,719 sans (p = 0,0168) : la correction rend le test plus prudent. Le plus petit effectif attendu est 4,8125, sous le seuil usuel de 5, où R prévient que l'approximation peut être mauvaise ; on regarde alors le test exact de Fisher.",
    },
    {
      kind: "text",
      md: `### Deux variables numériques : cor.test

\`\`\`r
# Code R à lire
cor.test(iris$Petal.Length, iris$Petal.Width)   # corrélation de Pearson, test et intervalle de confiance
cor.test(iris$Petal.Length, iris$Petal.Width, method = "spearman")   # corrélation de rang
\`\`\`

\`cor.test\` calcule le coefficient de corrélation de Pearson, un test de sa nullité et un intervalle de confiance à 95 %. Côté Python, \`scipy.stats.pearsonr\` donne le coefficient et la p-valeur, et sa méthode \`confidence_interval()\` l'intervalle ; \`spearmanr\` pour la corrélation de rang. Sur 150 fleurs, la p-valeur sera minuscule pour presque tout coefficient non nul : mieux vaut regarder **l'intervalle** que l'étoile.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "x, y = iris['Petal.Length'], iris['Petal.Width']",
        "pearson = stats.pearsonr(x, y)                  # cor.test(x, y)",
        "ic = pearson.confidence_interval()",
        "print('r =', round(pearson.statistic, 4), ' p =', f'{pearson.pvalue:.2e}')",
        "print('IC à 95 % :', round(ic.low, 4), 'à', round(ic.high, 4))",
        "",
        "# cor.test(x, y, method = \"spearman\")",
        "rang = stats.spearmanr(x, y)",
        "print('Spearman : rho =', round(rang.statistic, 4))",
      ),
      caption: "Entre longueur et largeur des pétales, r = 0,9629, avec un intervalle à 95 % de 0,9491 à 0,9730 : une relation très forte sur ces 150 fleurs. Espèce par espèce, elle tombe à 0,332 (setosa), 0,787 (versicolor) et 0,322 (virginica) : la corrélation globale doit beaucoup à la différence entre les espèces.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `cor.test(iris$Sepal.Length, iris$Sepal.Width)`. Rangez dans `r` le coefficient de corrélation de Pearson, dans `p` sa p-valeur, et dans `significatif` un booléen (`True` ou `False`) : la p-valeur est-elle **inférieure à 0,05** ?",
      setup: DONNEES,
      starter: lines(
        "r = 0.0",
        "p = 1.0",
        "significatif = None",
      ),
      solution: lines(
        "resultat = stats.pearsonr(iris['Sepal.Length'], iris['Sepal.Width'])",
        "r, p = resultat.statistic, resultat.pvalue",
        "significatif = bool(p < 0.05)",
        "print(round(r, 4), round(p, 4), significatif)",
      ),
      test: lines(
        "_r = np.corrcoef(iris['Sepal.Length'], iris['Sepal.Width'])[0, 1]",
        "_n = len(iris)",
        "_t = _r * np.sqrt((_n - 2) / (1 - _r ** 2))",
        "_p = 2 * stats.t.sf(abs(_t), _n - 2)",
        "assert abs(r - _r) < 1e-9, f\"r doit être le coefficient de Pearson ({_r:.4f}) : stats.pearsonr(x, y).statistic\"",
        "assert abs(p - _p) < 1e-9, \"p doit être la p-valeur du test de nullité de la corrélation : stats.pearsonr(x, y).pvalue\"",
        "assert significatif == bool(_p < 0.05), \"significatif doit valoir True si p < 0,05 et False sinon\"",
      ),
      hint: "stats.pearsonr(x, y) renvoie un objet avec .statistic et .pvalue.",
    },
    {
      kind: "text",
      md: `### Régression linéaire : lm et sa formule

C'est l'outil central de R. On décrit le modèle par une **formule** : \`y ~ x1 + x2\` se lit « y expliqué par x1 et x2 ».

\`\`\`r
# Code R à lire (stackloss est un jeu livré avec R : 21 jours d'une usine d'oxydation de l'ammoniac)
modele <- lm(stack.loss ~ Air.Flow + Water.Temp + Acid.Conc., data = stackloss)
summary(modele)     # coefficients, erreurs standard, t, p, R², F
coef(modele)        # les coefficients seuls
confint(modele)     # intervalles de confiance à 95 %
\`\`\`

La bonne nouvelle : **statsmodels reprend la syntaxe de formule de R** (par la bibliothèque patsy). Écrite avec \`smf.ols(formule, data=...)\`, la formule est la même, au nom des colonnes près (statsmodels les nomme \`STACKLOSS\`, \`AIRFLOW\`, \`WATERTEMP\`, \`ACIDCONC\`). Les deux logiciels cherchent les coefficients qui minimisent la somme des carrés des résidus : ce sont les **moindres carrés ordinaires**, donc les coefficients, erreurs standard et p-valeurs de \`lm()\` et de \`smf.ols\` coïncident pour le même modèle et les mêmes données.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "# lm(stack.loss ~ Air.Flow + Water.Temp + Acid.Conc., data = stackloss)",
        "modele = smf.ols('STACKLOSS ~ AIRFLOW + WATERTEMP + ACIDCONC', data=stackloss).fit()",
        "print(modele.summary().tables[1])                 # le tableau des coefficients, comme summary(lm)",
        "print('R² :', round(modele.rsquared, 4), ' R² ajusté :', round(modele.rsquared_adj, 4))",
        "print('erreur standard résiduelle :', round(modele.scale ** 0.5, 3), 'sur', int(modele.df_resid), 'ddl')",
        "print('F :', round(modele.fvalue, 2), ' p =', f'{modele.f_pvalue:.2e}')",
      ),
      caption: "Sur les 21 jours : STACKLOSS = -39,92 + 0,7156 AIRFLOW + 1,2953 WATERTEMP - 0,1521 ACIDCONC. Le débit d'air (p < 0,001) et la température de l'eau (p = 0,003) ressortent ; la concentration d'acide non (p = 0,344). R² = 0,9136, R² ajusté = 0,8983, erreur standard résiduelle 3,243 sur 17 degrés de liberté. Seulement 21 observations et des variables liées entre elles : on lit ces coefficients avec prudence.",
    },
    {
      kind: "text",
      md: `### Les formules, de R à Python

Les symboles de formule se ressemblent, avec une différence à retenir pour les puissances :

- \`y ~ a + b\` : effets de \`a\` et de \`b\` (identique) ;
- \`y ~ a * b\` : \`a\`, \`b\` **et** leur interaction \`a:b\` (identique) ;
- \`y ~ a + b - 1\` ou \`y ~ 0 + a\` : sans ordonnée à l'origine (identique) ;
- \`y ~ a + I(a^2)\` en **R**, \`y ~ a + I(a**2)\` en **Python** : le carré s'écrit \`^\` en R mais \`**\` en Python, car la formule Python est évaluée comme du code Python ;
- \`y ~ x + species\` en R : si \`species\` est un facteur, R crée seul les variables indicatrices ; en Python, on écrit \`C(species)\` pour traiter une colonne comme catégorielle (surtout si elle contient des nombres) ;
- un nom de colonne contenant un point (\`Sepal.Length\`) se protège en Python par \`Q("Sepal.Length")\`, car le point y a un autre sens.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "# interaction : y ~ a * b",
        "print(smf.ols('STACKLOSS ~ AIRFLOW * WATERTEMP', data=stackloss).fit().params.round(3).to_dict())",
        "",
        "# terme quadratique : I(a^2) en R devient I(a**2) en Python ; - 1 retire l'ordonnée",
        "print(smf.ols('STACKLOSS ~ AIRFLOW + I(AIRFLOW**2) - 1', data=stackloss).fit().params.round(3).to_dict())",
        "",
        "# facteur : C(Species), et Q() pour un nom de colonne avec un point",
        "m = smf.ols(\"Q('Petal.Width') ~ Q('Petal.Length') + C(Species)\", data=iris).fit()",
        "print(m.params.round(4).to_dict())",
      ),
      caption: "La première formule produit quatre coefficients (dont AIRFLOW:WATERTEMP = 0,052), la deuxième deux, sans ordonnée. La troisième ajoute deux variables indicatrices : par rapport à setosa (la référence, choisie par ordre alphabétique comme le fait R), versicolor a des pétales plus larges de 0,4354 cm et virginica de 0,8377 cm, à longueur égale. Le coefficient de la longueur chute à 0,2304 : la pente globale de 0,4158 mélangeait les espèces.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `lm(stack.loss ~ Air.Flow + Water.Temp, data = stackloss)`. Rangez dans `modele` le modèle ajusté avec `smf.ols` (colonnes `STACKLOSS`, `AIRFLOW`, `WATERTEMP`) et dans `coef_air` le coefficient du débit d'air.",
      setup: DONNEES,
      starter: lines(
        "modele = smf.ols('STACKLOSS ~ AIRFLOW', data=stackloss).fit()",
        "coef_air = 0.0",
      ),
      solution: lines(
        "modele = smf.ols('STACKLOSS ~ AIRFLOW + WATERTEMP', data=stackloss).fit()",
        "coef_air = modele.params['AIRFLOW']",
        "print(round(coef_air, 4), round(modele.rsquared, 4))",
      ),
      test: lines(
        "assert set(modele.params.index) == {'Intercept', 'AIRFLOW', 'WATERTEMP'}, f\"le modèle doit contenir AIRFLOW et WATERTEMP (et l'ordonnée), pas {list(modele.params.index)}\"",
        "_X = np.column_stack([np.ones(len(stackloss)), stackloss['AIRFLOW'], stackloss['WATERTEMP']])",
        "_b = np.linalg.lstsq(_X, stackloss['STACKLOSS'], rcond=None)[0]",
        "assert abs(coef_air - _b[1]) < 1e-9, f\"coef_air doit être le coefficient de AIRFLOW dans le modèle à deux variables ({_b[1]:.4f}) : modele.params['AIRFLOW']\"",
        "assert abs(modele.params['WATERTEMP'] - _b[2]) < 1e-9, \"les coefficients doivent être ceux des moindres carrés\"",
      ),
      hint: "smf.ols('y ~ a + b', data=tableau).fit() ; modele.params est une série indexée par le nom des termes.",
    },
    {
      kind: "text",
      md: `### Régression logistique : glm(family = binomial)

Quand la variable à expliquer vaut 0 ou 1 (réussite ou échec), la régression linéaire ne convient plus : on modélise la **probabilité** que \`y = 1\` à l'aide de la fonction logistique. Les coefficients s'expriment alors en **log des cotes** (*log-odds*), et leur exponentielle est un **rapport de cotes**.

\`\`\`r
# Code R à lire
modele <- glm(GRADE ~ GPA + TUCE + PSI, data = spector, family = binomial)
summary(modele)
exp(coef(modele))     # rapports de cotes
\`\`\`

En Python, deux écritures donnent le même modèle : \`smf.logit(formule, data)\` (propre à la régression logistique) ou \`smf.glm(formule, data, family=sm.families.Binomial())\`, qui reprend la structure de \`glm\`. Les deux cherchent les coefficients de **maximum de vraisemblance**, donc les mêmes valeurs. Le jeu \`spector\` a 32 étudiants : c'est un exemple d'école, pas une base pour des conclusions.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "formule = 'GRADE ~ GPA + TUCE + PSI'",
        "m_logit = smf.logit(formule, data=spector).fit(disp=0)",
        "m_glm = smf.glm(formule, data=spector, family=sm.families.Binomial()).fit()   # glm(..., family = binomial)",
        "print('mêmes coefficients ?', np.allclose(m_logit.params, m_glm.params, atol=1e-5))",
        "print(m_glm.summary().tables[1])",
        "print('rapports de cotes :', np.exp(m_glm.params).round(3).to_dict())",
        "print('déviance résiduelle :', round(m_glm.deviance, 3), ' déviance nulle :', round(m_glm.null_deviance, 3))",
      ),
      caption: "Les deux écritures donnent les mêmes coefficients : -13,0213 (ordonnée), 2,8261 (GPA), 0,0952 (TUCE) et 2,3787 (PSI). Le rapport de cotes de PSI est de 10,79 : à moyenne générale (GPA) et test d'entrée (TUCE) égaux, la méthode expérimentale multiplie par environ 10,8 les cotes de progresser, avec un intervalle très large (de 0,29 à 4,47 en log-cotes, soit environ 1,3 à 87 en rapport) vu les 32 étudiants. La déviance passe de 41,183 (modèle nul) à 25,779.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `glm(GRADE ~ GPA + PSI, data = spector, family = binomial)`. Rangez dans `modele` le modèle ajusté (avec `smf.glm` et la famille binomiale, ou `smf.logit`), et dans `rc_psi` le **rapport de cotes** de `PSI` (l'exponentielle de son coefficient).",
      setup: DONNEES,
      starter: lines(
        "modele = smf.ols('GRADE ~ GPA + PSI', data=spector).fit()",
        "rc_psi = 1.0",
      ),
      solution: lines(
        "modele = smf.glm('GRADE ~ GPA + PSI', data=spector, family=sm.families.Binomial()).fit()",
        "rc_psi = float(np.exp(modele.params['PSI']))",
        "print(round(rc_psi, 3))",
      ),
      test: lines(
        "_ref = smf.logit('GRADE ~ GPA + PSI', data=spector).fit(disp=0)",
        "assert np.allclose(modele.params, _ref.params, atol=1e-4), \"le modèle doit être logistique (famille binomiale ou smf.logit) ; une régression linéaire donne d'autres coefficients\"",
        "assert abs(rc_psi - np.exp(_ref.params['PSI'])) < 1e-3, f\"rc_psi est l'exponentielle du coefficient de PSI : np.exp(modele.params['PSI']) = {np.exp(_ref.params['PSI']):.3f}\"",
      ),
      hint: "smf.glm(formule, data=..., family=sm.families.Binomial()).fit() ; np.exp(modele.params['PSI']).",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Les logiciels n'ont pas toujours les mêmes réglages par défaut : test de Welch dans `t.test`, Student dans `ttest_ind` ; correction de Yates dans les deux pour un tableau 2 x 2 ; référence alphabétique pour un facteur en R comme dans `C()`. Avant de comparer deux sorties, vérifiez ces options. Et gardez en tête qu'un test ne dit rien de la qualité du protocole : des données bien choisies et un petit échantillon pèsent plus que la précision de la p-valeur.",
    },
  ],
  quiz: [
    {
      question: "Quel appel SciPy correspond à t.test(a, b) de R, qui est par défaut un test de Welch ?",
      options: [
        "stats.ttest_ind(a, b)",
        "stats.ttest_ind(a, b, equal_var=False)",
        "stats.ttest_rel(a, b)",
        "stats.pearsonr(a, b)",
      ],
      correct: 1,
      explanation: "ttest_ind suppose par défaut des variances égales (test de Student). Pour reproduire le test de Welch de t.test, on ajoute equal_var=False.",
    },
    {
      question: "La formule 'STACKLOSS ~ AIRFLOW + WATERTEMP' passée à smf.ols ressemble à lm(y ~ x1 + x2). Que minimisent les deux méthodes ?",
      options: [
        "La somme des écarts en valeur absolue",
        "La somme des carrés des résidus (moindres carrés ordinaires)",
        "Le nombre de variables",
        "La valeur de la p-valeur",
      ],
      correct: 1,
      explanation: "lm et smf.ols ajustent par les moindres carrés ordinaires : pour les mêmes données et le même modèle, les coefficients sont les mêmes.",
    },
    {
      question: "Comment écrit-on un carré dans une formule, en R puis en Python (statsmodels) ?",
      options: [
        "I(a^2) en R, I(a**2) en Python",
        "I(a**2) dans les deux",
        "a^2 sans I() dans les deux",
        "square(a) dans les deux",
      ],
      correct: 0,
      explanation: "Dans une formule, I() protège l'opération arithmétique. R utilise ^ pour les puissances ; la formule de statsmodels est évaluée en Python, qui utilise **.",
    },
    {
      question: "Dans une régression logistique, que représente exp(coefficient) ?",
      options: [
        "Une probabilité entre 0 et 1",
        "Le nombre d'observations",
        "Le coefficient de détermination R²",
        "Un rapport de cotes (odds ratio) : le facteur par lequel les cotes sont multipliées quand la variable augmente d'une unité",
      ],
      correct: 3,
      explanation: "Les coefficients sont des log-cotes. Leur exponentielle donne un rapport de cotes, à ne pas confondre avec un rapport de probabilités.",
    },
    {
      question: "Sur le tableau croisé 2 x 2 de spector, le plus petit effectif attendu est 4,81. Qu'est-ce que cela invite à faire ?",
      options: [
        "Ignorer le test, puisque la p-valeur est calculée",
        "Retirer la correction de Yates pour gagner en puissance",
        "Se méfier de l'approximation du khi-deux et regarder le test exact de Fisher",
        "Doubler l'échantillon sans rien vérifier",
      ],
      correct: 2,
      explanation: "L'approximation du khi-deux suppose des effectifs attendus assez grands (la règle usuelle : au moins 5). En dessous, on préfère le test exact de Fisher, que fournissent fisher.test en R et stats.fisher_exact en Python.",
    },
  ],
};
