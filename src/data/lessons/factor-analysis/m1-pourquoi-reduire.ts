import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { VINS, VINS_REDUITS } from "./data";

export const modulePourquoiReduire: LessonModule = {
  id: "pourquoi-reduire",
  title: "Pourquoi réduire les dimensions",
  duration: "2 h",
  summary: "Le jeu des 178 vins et ses 13 mesures : lire une matrice de corrélation, comprendre pourquoi on centre et on réduit les données, définir l'inertie et voir qu'une projection garde plus ou moins d'inertie selon l'axe choisi.",
  objectives: [
    "Décrire un nuage de 178 points dans un espace à 13 dimensions et lire sa matrice de corrélation",
    "Expliquer par le calcul pourquoi des mesures en unités différentes imposent de centrer et de réduire",
    "Définir l'inertie d'un nuage et vérifier qu'elle vaut le nombre de variables quand les données sont réduites",
    "Projeter un nuage sur un axe et mesurer l'inertie conservée, pour comprendre ce que cherche l'analyse en composantes principales",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un tableau de 178 lignes, 13 colonnes

Le jeu de ce cours vient de scikit-learn : **178 vins** italiens, décrits par **13 mesures chimiques** (alcool, acide malique, flavanoïdes, proline, intensité de la couleur...). Les vins viennent de **trois cultivars** (variétés de vigne), de 59, 71 et 48 vins. Le cultivar est connu, mais il ne servira pas à construire l'analyse : nous le garderons de côté pour vérifier ensuite ce que l'analyse révèle.

Chaque vin est un **point** de coordonnées (mesure 1, mesure 2, ..., mesure 13) : un nuage de 178 points dans un espace à 13 dimensions. On ne sait pas dessiner un tel espace. Les questions de ce cours sont donc : comment **résumer** ce nuage en deux ou trois dimensions sans trop le déformer, et que nous apprend ce résumé ?

Premier réflexe : regarder comment les mesures se **ressemblent**. La **corrélation** entre deux mesures vaut 1 si elles croissent ensemble de façon parfaitement linéaire, -1 si l'une croît quand l'autre décroît, 0 s'il n'y a aucun lien linéaire. La **matrice de corrélation** réunit les 13 fois 13 corrélations. Quand beaucoup de mesures sont corrélées, elles se répètent en partie : 13 colonnes contiennent alors moins de 13 informations indépendantes, et c'est ce qui rend la réduction possible.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        VINS,
        "import matplotlib.pyplot as plt",
        "",
        "print('forme de X :', X.shape)",
        "print('vins par cultivar :', cultivar.value_counts().sort_index().to_dict())",
        "",
        "R = X.corr()                                  # matrice de corrélation, 13 sur 13",
        "A = R.abs().values.copy()",
        "np.fill_diagonal(A, 0)                        # on ignore la corrélation d'une mesure avec elle-même",
        "i, j = np.unravel_index(A.argmax(), A.shape)",
        "print('paire la plus corrélée :', R.columns[i], 'et', R.columns[j], ':', round(R.iloc[i, j], 3))",
        "print('paires avec |r| > 0,5 :', int((np.triu(A, 1) > 0.5).sum()), 'sur', 13 * 12 // 2)",
        "",
        "fig, ax = plt.subplots(figsize=(6.5, 5.5))",
        "im = ax.imshow(R, cmap='RdBu_r', vmin=-1, vmax=1)",
        "ax.set_xticks(range(13))",
        "ax.set_xticklabels(R.columns, rotation=90, fontsize=7)",
        "ax.set_yticks(range(13))",
        "ax.set_yticklabels(R.columns, fontsize=7)",
        "fig.colorbar(im, label='corrélation')",
        "ax.set_title('Corrélations entre les 13 mesures')",
        "plt.tight_layout()",
      ),
      caption: "Les 178 vins se répartissent en 59, 71 et 48 vins selon le cultivar. Les deux mesures les plus corrélées sont les phénols totaux et les flavanoïdes (r = 0,865). Sur les 78 paires de mesures, 14 ont une corrélation supérieure à 0,5 en valeur absolue : une partie des mesures se répète, d'autres sont indépendantes.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau `X` des 13 mesures est prêt. Calculez la matrice de corrélation dans `R` (`X.corr()`), puis rangez dans `paire` un tuple des **noms** des deux mesures distinctes les plus corrélées, en valeur absolue (l'ordre des deux noms n'a pas d'importance).",
      setup: VINS,
      starter: lines(
        "R = None",
        "paire = ('alcohol', 'alcohol')",
      ),
      solution: lines(
        "R = X.corr()",
        "A = R.abs().values.copy()",
        "np.fill_diagonal(A, 0)",
        "i, j = np.unravel_index(A.argmax(), A.shape)",
        "paire = (R.columns[i], R.columns[j])",
        "print(paire)",
      ),
      test: lines(
        "_R = X.corr()",
        "assert np.shape(R) == (13, 13), \"R doit être la matrice de corrélation 13 sur 13 : X.corr()\"",
        "assert np.allclose(np.asarray(R, dtype=float), _R.values), \"R doit contenir les corrélations de X, calculées avec X.corr()\"",
        "assert len(set(paire)) == 2, \"paire doit contenir deux mesures différentes : la diagonale vaut 1 et doit être écartée\"",
        "_A = _R.abs().values.copy()",
        "np.fill_diagonal(_A, 0)",
        "_i, _j = np.unravel_index(_A.argmax(), _A.shape)",
        "assert set(paire) == {_R.columns[_i], _R.columns[_j]}, f\"la paire la plus corrélée est {_R.columns[_i]} et {_R.columns[_j]}\"",
      ),
      hint: "Prenez la valeur absolue de R, mettez la diagonale à zéro avec np.fill_diagonal, puis np.unravel_index(A.argmax(), A.shape) donne la ligne et la colonne du maximum.",
    },
    {
      kind: "text",
      md: `### Pourquoi centrer et réduire

Les 13 mesures n'ont ni les mêmes **unités** ni les mêmes **ordres de grandeur** : la proline se compte en centaines de milligrammes par litre, la teinte (*hue*) en fractions d'unité. Or l'analyse va additionner des **variances**, c'est-à-dire des carrés d'écarts. Une variable qui prend de grandes valeurs numériques pèse alors beaucoup, uniquement à cause de son unité. Changer la proline de mg/L en g/L diviserait sa variance par un million sans rien changer aux vins.

Deux opérations préparent le tableau.

- **Centrer** : retrancher à chaque colonne sa moyenne. Le nuage est déplacé pour que son **centre de gravité** soit à l'origine.
- **Réduire** : diviser chaque colonne centrée par son écart type. Toutes les colonnes ont alors une variance de 1 et n'ont plus d'unité.

Dans ce cours, l'écart type est celui de la **population** (\`ddof=0\`, on divise par n), comme l'écrivent les manuels d'analyse factorielle ; pandas utilise par défaut \`ddof=1\` (on divise par n - 1). L'écart est minime avec 178 vins, mais il explique des différences que nous rencontrerons au module suivant.`,
    },
    {
      kind: "equation",
      latex: "z_{ij} = \\dfrac{x_{ij} - \\bar{x}_j}{\\sigma_j}",
      caption: "x_ij est la mesure j du vin i, x̄_j la moyenne de la mesure j et σ_j son écart type : z_ij est la mesure « centrée et réduite ».",
    },
    {
      kind: "code",
      language: "python",
      setup: VINS,
      code: lines(
        "# Sans réduction : qui domine la variance totale ?",
        "v = X.var(ddof=0)",
        "print(v.sort_values(ascending=False).head(3).round(3))",
        "print('variance totale :', round(v.sum(), 1), ' part de la proline :', round(v['proline'] / v.sum(), 4))",
        "",
        "# Avec centrage et réduction",
        "Z = (X - X.mean()) / X.std(ddof=0)",
        "print('moyenne la plus éloignée de 0 :', round(float(Z.mean().abs().max()), 12))",
        "print('variances de Z (valeurs distinctes) :', Z.var(ddof=0).round(6).unique())",
        "print('variance totale de Z :', round(Z.var(ddof=0).sum(), 6))",
      ),
      caption: "Sans réduction, la proline (variance 98 609,6) fait à elle seule 0,9977 de la variance totale (98 833,1) : le magnésium vient loin derrière (202,8). Après centrage et réduction, toutes les variances valent 1 et leur somme est 13.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `Z`, le tableau `X` centré et réduit (écart type de population, `ddof=0`). Rangez dans `inertie` la somme des variances (`ddof=0`) des colonnes de `Z`, et dans `part_proline` la part de la proline dans la variance totale du tableau `X` **non réduit**.",
      setup: VINS,
      starter: lines(
        "Z = X",
        "inertie = 0.0",
        "part_proline = 0.0",
      ),
      solution: lines(
        "Z = (X - X.mean()) / X.std(ddof=0)",
        "inertie = Z.var(ddof=0).sum()",
        "v = X.var(ddof=0)",
        "part_proline = v['proline'] / v.sum()",
        "print(round(inertie, 6), round(part_proline, 4))",
      ),
      test: lines(
        "assert float(np.abs(Z.mean()).max()) < 1e-9, \"Z doit être centré : retranchez à chaque colonne sa moyenne\"",
        "assert np.allclose(Z.std(ddof=0), 1), \"Z doit être réduit : divisez chaque colonne centrée par son écart type (ddof=0)\"",
        "assert abs(inertie - 13) < 1e-9, f\"la somme des variances de Z doit valoir 13, une par mesure ; vous avez {inertie}\"",
        "_v = X.var(ddof=0)",
        "assert abs(part_proline - _v['proline'] / _v.sum()) < 1e-9, \"part_proline = variance de la proline / somme des variances de X (non réduit)\"",
      ),
      hint: "Z = (X - X.mean()) / X.std(ddof=0). La somme des variances de Z est Z.var(ddof=0).sum().",
    },
    {
      kind: "note",
      tone: "info",
      md: `**À retenir.** Quand on réduit les données, chaque variable a une variance de 1 et la somme des variances vaut donc exactement le nombre de variables (ici 13). Cela revient à travailler sur la **matrice de corrélation** au lieu de la matrice de covariance. C'est le choix usuel quand les mesures n'ont pas la même unité ; on ne s'en dispense que lorsque toutes les variables sont dans la même unité et que leurs écarts de variance ont un sens.`,
    },
    {
      kind: "text",
      md: `### L'inertie et la projection

Une fois le nuage centré, la distance d'un vin à l'origine (le vin « moyen ») mesure à quel point il s'écarte de la moyenne. L'**inertie** du nuage est la moyenne des carrés de ces distances : elle mesure la **dispersion totale** du nuage. Elle est aussi la somme des variances des variables, ce qui donne, pour des données réduites, exactement le nombre de variables p.`,
    },
    {
      kind: "equation",
      latex: "I = \\dfrac{1}{n}\\sum_{i=1}^{n} \\lVert z_i \\rVert^2 = \\sum_{j=1}^{p} \\operatorname{Var}(z_j) = p",
      narrow: "I = \\dfrac{1}{n}\\sum_{i=1}^{n} \\lVert z_i \\rVert^2 \\\\ = \\sum_{j=1}^{p} \\operatorname{Var}(z_j) = p",
      caption: "Pour des données réduites : n vins, p variables, z_i le vin i (un vecteur de p composantes).",
    },
    {
      kind: "text",
      md: `Résumer le nuage, c'est le **projeter** sur un axe (une droite passant par l'origine) ou sur un plan. Projeter écrase des différences : deux vins qui se distinguent surtout dans la direction écrasée deviennent voisins. On cherche donc l'axe sur lequel la projection **garde le plus d'inertie**, c'est-à-dire celui où les points restent le plus étalés. Pour un axe de direction \`u\` (un vecteur de longueur 1), l'inertie conservée est la **variance des coordonnées projetées**.

Exemple à deux mesures seulement, les flavanoïdes et les phénols totaux, réduites. Leur corrélation r fait qu'elles s'étalent le long d'une diagonale. La variance de la projection sur la direction d'angle t vaut 1 + r sin 2t : elle est maximale à 45 degrés, où elle vaut 1 + r. L'inertie totale étant 2, un seul axe en conserve la part (1 + r) / 2.`,
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "a = Z['flavanoids'].values",
        "b = Z['total_phenols'].values",
        "r = np.corrcoef(a, b)[0, 1]",
        "angles = np.linspace(0, 180, 181)                       # directions, en degrés",
        "t = np.radians(angles)",
        "variances = [np.var(np.cos(x) * a + np.sin(x) * b) for x in t]",
        "meilleur = angles[int(np.argmax(variances))]",
        "print('corrélation r :', round(r, 3), ' 1 + r :', round(1 + r, 3))",
        "print('variance maximale :', round(max(variances), 3), 'pour un axe à', meilleur, 'degrés')",
        "print('part d\\'inertie conservée :', round(max(variances) / 2, 3))",
        "",
        "fig, (g, d) = plt.subplots(1, 2, figsize=(9, 3.6))",
        "g.scatter(a, b, s=10, alpha=0.6)",
        "g.plot([-3, 3], [-3, 3], color='crimson', label='axe à 45 degrés')",
        "g.set_xlabel('flavanoïdes (réduits)')",
        "g.set_ylabel('phénols totaux (réduits)')",
        "g.legend(fontsize=8)",
        "d.plot(angles, variances)",
        "d.set_xlabel('direction de l\\'axe (degrés)')",
        "d.set_ylabel('variance de la projection')",
        "plt.tight_layout()",
      ),
      caption: "La corrélation est 0,865 : la variance de la projection est maximale pour un axe à 45 degrés et vaut 1,865, soit 1 + r. Cet axe conserve 0,932 de l'inertie totale (2). Le graphique de droite montre la variance en fonction de la direction.",
    },
    {
      kind: "text",
      md: `### En 13 dimensions

Avec 13 mesures, on ne peut plus balayer les directions une à une. Mais le même calcul s'écrit avec la matrice de corrélation R des données réduites : la variance de la projection sur la direction \`u\` vaut \`u' R u\`. Chercher l'axe qui garde le plus d'inertie, c'est maximiser cette quantité sous la contrainte que \`u\` soit de longueur 1. La réponse porte un nom : c'est le **vecteur propre** de R associé à sa plus grande **valeur propre**, et cette valeur propre est la variance conservée. Le module suivant le calcule pas à pas. Ici, comparons seulement trois choix de direction : la direction de la proline seule, celle du premier vecteur propre, et mille directions tirées au hasard.`,
    },
    {
      kind: "equation",
      latex: "\\operatorname{Var}(Z u) = u^{\\top} R\\, u \\qquad \\text{avec} \\qquad \\lVert u \\rVert = 1",
      caption: "Z est le tableau réduit (n lignes, p colonnes) et R = Z'Z / n sa matrice de corrélation.",
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "Zv = Z.values",
        "R = Zv.T @ Zv / len(Zv)                       # corrélation des données réduites",
        "valeurs, vecteurs = np.linalg.eigh(R)         # valeurs propres en ordre croissant",
        "u1 = vecteurs[:, -1]                          # direction de la plus grande valeur propre",
        "",
        "u_proline = np.zeros(13)",
        "u_proline[list(Z.columns).index('proline')] = 1",
        "print('variance sur l\\'axe de la proline seule :', round(np.var(Zv @ u_proline), 3))",
        "print('variance sur le premier vecteur propre  :', round(np.var(Zv @ u1), 3))",
        "",
        "rng = np.random.default_rng(0)",
        "hasard = []",
        "for _ in range(1000):",
        "    u = rng.normal(size=13)",
        "    u = u / np.linalg.norm(u)                 # direction de longueur 1",
        "    hasard.append(np.var(Zv @ u))",
        "print('1000 directions au hasard : min', round(min(hasard), 3), ' moyenne', round(np.mean(hasard), 3), ' max', round(max(hasard), 3))",
        "print('part d\\'inertie du premier vecteur propre :', round(np.var(Zv @ u1) / 13, 3))",
      ),
      caption: "Sur la seule proline, la variance vaut 1 (une variable réduite). Sur le premier vecteur propre, elle vaut 4,706, soit 0,362 de l'inertie totale 13. Parmi 1000 directions tirées au hasard, la variance va de 0,268 à 3,207, avec une moyenne de 1,007 : aucune n'atteint 4,706.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau réduit `Z` est prêt. Construisez le vecteur `u` de 13 composantes égales et de longueur 1 (chaque composante vaut 1 / racine de 13). Rangez dans `proj` les coordonnées des 178 vins sur cet axe (`Z.values @ u`) et dans `var_proj` leur variance (`ddof=0`, comme `np.var`).",
      setup: VINS_REDUITS,
      starter: lines(
        "u = None",
        "proj = None",
        "var_proj = 0.0",
      ),
      solution: lines(
        "u = np.ones(13) / np.sqrt(13)",
        "proj = Z.values @ u",
        "var_proj = np.var(proj)",
        "print(round(var_proj, 3))",
      ),
      test: lines(
        "assert np.shape(u) == (13,), \"u doit être un vecteur de 13 composantes\"",
        "assert abs(np.linalg.norm(u) - 1) < 1e-9, \"u doit être de longueur 1 : divisez le vecteur de uns par racine de 13\"",
        "assert np.allclose(u, 1 / np.sqrt(13)), \"les 13 composantes de u doivent être égales à 1 / racine de 13\"",
        "assert np.shape(proj) == (178,), \"proj doit contenir une coordonnée par vin (178) : Z.values @ u\"",
        "_Zv = Z.values",
        "_R = _Zv.T @ _Zv / len(_Zv)",
        "assert abs(var_proj - np.var(_Zv @ u)) < 1e-9, \"var_proj est la variance de proj (np.var, ddof=0)\"",
        "assert abs(var_proj - u @ _R @ u) < 1e-9, \"la variance de la projection doit aussi valoir u' R u\"",
      ),
      hint: "u = np.ones(13) / np.sqrt(13). Les coordonnées sur l'axe sont Z.values @ u, et leur variance np.var(proj).",
    },
    {
      kind: "note",
      tone: "warning",
      md: `**Ce que la projection cache.** Garder les axes d'inertie maximale conserve le plus possible les **distances d'ensemble**, pas toutes les distances : deux vins éloignés dans l'espace à 13 dimensions peuvent paraître voisins sur le plan retenu. Le module 3 apprend à repérer ces cas avec la qualité de représentation.`,
    },
  ],
  quiz: [
    {
      question: "Dans les données brutes des vins, la proline (en mg/L) représente plus de 99 % de la variance totale. Que se passerait-il en lançant l'ACP sans réduire ?",
      options: [
        "Rien de particulier : l'ACP corrige seule les unités",
        "Le premier axe serait presque uniquement la proline, uniquement à cause de son unité",
        "Les 13 mesures auraient le même poids",
        "L'ACP refuserait de s'exécuter",
      ],
      correct: 1,
      explanation: "L'analyse additionne des variances : une variable aux valeurs numériques grandes domine, quelle que soit son importance réelle. Réduire donne à chaque mesure une variance de 1 et un poids comparable.",
    },
    {
      question: "Les données sont centrées et réduites, avec 13 variables. Quelle est l'inertie totale du nuage ?",
      options: [
        "1, comme la variance de chaque variable",
        "178, comme le nombre de vins",
        "13, la somme des 13 variances égales à 1",
        "Elle dépend des unités d'origine",
      ],
      correct: 2,
      explanation: "L'inertie est la somme des variances des variables. Réduites, elles valent toutes 1 : l'inertie est égale au nombre de variables.",
    },
    {
      question: "Quel axe l'ACP cherche-t-elle en premier ?",
      options: [
        "Celui qui sépare le mieux les trois cultivars",
        "Celui qui passe par la variable la plus variable",
        "Celui sur lequel la projection du nuage a la plus grande variance",
        "Celui sur lequel la projection a la plus petite variance",
      ],
      correct: 2,
      explanation: "L'ACP ne connaît pas le cultivar : elle cherche la direction qui conserve le plus d'inertie, donc où les points restent le plus étalés. Il se peut que cette direction sépare des groupes, mais ce n'est pas son critère.",
    },
    {
      question: "Deux mesures très corrélées (r proche de 0,9) apparaissent dans le tableau. Que peut-on en conclure pour la réduction ?",
      options: [
        "Elles se répètent en grande partie, donc un seul axe peut résumer l'essentiel des deux",
        "L'une des deux est fausse et doit être supprimée",
        "Il faut absolument les ajouter pour former une nouvelle mesure",
        "La corrélation prouve que l'une cause l'autre",
      ],
      correct: 0,
      explanation: "Une forte corrélation signifie que les points s'alignent : une seule direction capte presque toute la dispersion des deux mesures. Une corrélation ne dit rien sur la causalité ni sur une erreur de mesure.",
    },
  ],
};
