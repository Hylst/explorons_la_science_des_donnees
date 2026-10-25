import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { VINS_REDUITS } from "./data";

/** L'ACP du module précédent, déjà faite : n, p, colonnes, R, valeurs, vecteurs (signe fixé), F (coordonnées des 178 vins) */
const ACP_FAITE = lines(
  VINS_REDUITS,
  "",
  "n, p = Z.shape",
  "colonnes = list(Z.columns)",
  "R = Z.values.T @ Z.values / n",
  "valeurs, vecteurs = np.linalg.eigh(R)",
  "ordre = np.argsort(valeurs)[::-1]",
  "valeurs, vecteurs = valeurs[ordre], vecteurs[:, ordre]",
  "vecteurs = vecteurs * np.sign(vecteurs[np.abs(vecteurs).argmax(axis=0), np.arange(p)])",
  "F = Z.values @ vecteurs",
);

export const moduleInterpreterAcp: LessonModule = {
  id: "interpreter-acp",
  title: "Interpréter une ACP",
  duration: "2 h 30",
  summary: "Lire les résultats : cercle des corrélations, plan factoriel coloré par cultivar, qualité de représentation (cos²), contributions des vins et des mesures, éléments supplémentaires qui ne participent pas au calcul, et les pièges classiques (données non réduites, valeur extrême, proximités trompeuses).",
  objectives: [
    "Calculer et tracer le cercle des corrélations, et lire les axes à partir des variables qui leur sont corrélées",
    "Distinguer la qualité de représentation (cos²) de la contribution, pour les individus comme pour les variables",
    "Projeter un individu ou une variable supplémentaire (le cultivar) sans qu'il participe au calcul des axes",
    "Reconnaître trois pièges : données non réduites, valeur extrême, proximité entre individus mal représentés",
  ],
  sections: [
    {
      kind: "text",
      md: `### Que représente un axe ?

Les axes d'une ACP sont des combinaisons de mesures : ils n'ont pas de nom. Pour les interpréter, on regarde **avec quelles variables chaque axe est corrélé**. La corrélation entre la variable j et l'axe k se calcule directement, et vaut la composante j du vecteur propre multiplié par la racine de la valeur propre.

Ces corrélations, placées sur deux axes, donnent le **cercle des corrélations** : chaque variable est une flèche dont les coordonnées sont ses corrélations avec les axes 1 et 2. Comme les variables sont réduites, toutes les flèches restent dans un cercle de rayon 1. Une flèche proche du cercle est **bien représentée** dans le plan : on peut lire sa position. Une flèche courte est mal représentée : elle est surtout portée par d'autres axes, et sa position dans ce plan ne dit presque rien.

Pour deux variables bien représentées, le cosinus de l'angle entre leurs flèches approche leur corrélation : proches, elles sont corrélées positivement ; à angle droit, elles ne sont pas corrélées ; opposées, négativement. Cette lecture n'a de sens que pour des flèches qui touchent presque le cercle.`,
    },
    {
      kind: "equation",
      latex: "\\operatorname{corr}(z_j,\\, F_k) = v_{jk}\\,\\sqrt{\\lambda_k}",
      caption: "z_j : la variable j réduite ; F_k : les coordonnées des vins sur l'axe k ; v_jk : la composante j du vecteur propre k ; λ_k : sa valeur propre.",
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "C = vecteurs * np.sqrt(valeurs)                    # corrélation de chaque variable avec chaque axe",
        "direct = np.corrcoef(np.column_stack([Z.values, F[:, :2]]).T)[:p, p:]   # même chose, calculée directement",
        "print('formule = corrélation directe :', np.allclose(C[:, :2], direct))",
        "for k in range(2):",
        "    forts = np.argsort(-np.abs(C[:, k]))[:5]",
        "    print('axe', k + 1, ':', [(colonnes[i], round(float(C[i, k]), 3)) for i in forts])",
        "",
        "fig, (g, d) = plt.subplots(1, 2, figsize=(11, 5))",
        "t = np.linspace(0, 2 * np.pi, 200)",
        "g.plot(np.cos(t), np.sin(t), color='gray')",
        "for i, nom in enumerate(colonnes):",
        "    g.arrow(0, 0, C[i, 0], C[i, 1], head_width=0.02, color='steelblue', length_includes_head=True)",
        "    g.text(C[i, 0] * 1.08, C[i, 1] * 1.08, nom, fontsize=7, ha='center')",
        "g.axhline(0, color='lightgray')",
        "g.axvline(0, color='lightgray')",
        "g.set_aspect('equal')",
        "g.set_xlabel(f'axe 1 ({valeurs[0] / p:.1%})')",
        "g.set_ylabel(f'axe 2 ({valeurs[1] / p:.1%})')",
        "g.set_title('Cercle des corrélations')",
        "for k, couleur in enumerate(['tab:blue', 'tab:orange', 'tab:green']):",
        "    masque = cultivar.values == k",
        "    d.scatter(F[masque, 0], F[masque, 1], s=14, color=couleur, label=f'cultivar {k}')",
        "d.axhline(0, color='lightgray')",
        "d.axvline(0, color='lightgray')",
        "d.set_xlabel('axe 1')",
        "d.set_ylabel('axe 2')",
        "d.set_title('Plan factoriel des 178 vins')",
        "d.legend(fontsize=8)",
        "plt.tight_layout()",
      ),
      caption: "Sur l'axe 1, les variables les plus corrélées sont les flavanoïdes (0,917), les phénols totaux (0,856) et le rapport OD280/OD315 (0,816), puis les proanthocyanidines (0,680) ; les phénols non flavanoïdes sont corrélés négativement (-0,648). Sur l'axe 2 viennent l'intensité de la couleur (0,837), l'alcool (0,764) et la proline (0,577). Dans le plan factoriel de droite, chaque vin est coloré par son cultivar, que l'analyse n'a pas utilisé : regardez comment les couleurs se répartissent.",
    },
    {
      kind: "text",
      md: `### Qualité de représentation et contributions

Deux questions différentes se posent, pour les individus comme pour les variables.

- **Le cos² : cet élément est-il bien représenté ?** C'est le carré du cosinus de l'angle entre l'élément et l'axe : la part de sa distance à l'origine (au carré) qui se projette sur l'axe. Elle est comprise entre 0 et 1, et les cos² d'un élément sur tous les axes sommant à 1, on additionne ceux de deux axes pour juger la qualité sur le **plan**. Pour une variable, le cos² est simplement le carré de sa corrélation avec l'axe.
- **La contribution : qui construit l'axe ?** C'est la part de l'inertie de l'axe due à l'élément. Les contributions de tous les individus à un axe somment à 1, de même celles de toutes les variables. Un élément qui contribue beaucoup à un axe l'**explique** ; on le cite pour interpréter l'axe. Une contribution supérieure à la moyenne (1 / n pour un individu, 1 / p pour une variable) est un repère usuel, pas une règle.

Ne pas confondre : un vin peut être très bien représenté sur un axe (cos² proche de 1) tout en y contribuant peu, car sa coordonnée est modeste ; et un vin à la coordonnée très grande contribue beaucoup, alors que son cos² dit seulement s'il se lit bien dans le plan.`,
    },
    {
      kind: "equation",
      latex: "\\cos^2(i, k) = \\dfrac{F_{ik}^2}{\\sum_{k'} F_{ik'}^2} \\qquad \\operatorname{ctr}(i, k) = \\dfrac{F_{ik}^2}{n\\, \\lambda_k}",
      narrow: "\\cos^2(i, k) = \\dfrac{F_{ik}^2}{\\sum_{k'} F_{ik'}^2} \\\\ \\operatorname{ctr}(i, k) = \\dfrac{F_{ik}^2}{n\\, \\lambda_k}",
      caption: "Pour le vin i et l'axe k. Pour une variable j : cos² = (corrélation avec l'axe)² et contribution = v_jk².",
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "C = vecteurs * np.sqrt(valeurs)",
        "",
        "# Individus : cos² et contributions",
        "d2 = (F ** 2).sum(axis=1)                          # carré de la distance de chaque vin à l'origine",
        "cos2_ind = F ** 2 / d2[:, None]",
        "cos2_plan = cos2_ind[:, :2].sum(axis=1)            # qualité de représentation sur le plan 1-2",
        "print('cos² sur le plan : médiane', round(float(np.median(cos2_plan)), 3), ' moyenne', round(float(cos2_plan.mean()), 3))",
        "print('vins dont le cos² sur le plan est < 0,5 :', int((cos2_plan < 0.5).sum()), ' < 0,3 :', int((cos2_plan < 0.3).sum()), 'sur', n)",
        "ctr_ind = F ** 2 / (n * valeurs)",
        "print('contributions des vins à l\\'axe 1 : somme', round(ctr_ind[:, 0].sum(), 6), ' maximum', round(float(ctr_ind[:, 0].max()), 4),",
        "      '(vin', int(ctr_ind[:, 0].argmax()), ') contre une moyenne de', round(1 / n, 4))",
        "",
        "# Variables : cos² et contributions",
        "cos2_var = C[:, :2] ** 2                            # carré de la corrélation avec chaque axe",
        "plan = cos2_var.sum(axis=1)",
        "print('cos² sur le plan : flavanoids', round(plan[colonnes.index('flavanoids')], 3), ' ash', round(plan[colonnes.index('ash')], 3))",
        "ctr_var = vecteurs ** 2",
        "print('contributions des variables à l\\'axe 1 : somme', round(ctr_var[:, 0].sum(), 6))",
        "au_dessus = [colonnes[j] for j in np.argsort(-ctr_var[:, 0]) if ctr_var[j, 0] > 1 / p]",
        "print('au-dessus de 1/p =', round(1 / p, 3), ':', au_dessus)",
        "print('flavanoids :', round(100 * ctr_var[colonnes.index('flavanoids'), 0], 1), '% de l\\'axe 1')",
      ),
      caption: "Sur le plan 1-2, la médiane du cos² des vins est 0,599 (moyenne 0,561) : 58 vins sur 178 ont un cos² inférieur à 0,5 et 29 inférieur à 0,3, donc près d'un tiers des vins se lit mal dans ce plan. Le vin 14 contribue le plus à l'axe 1 (0,0222, pour une moyenne de 0,0056). Pour les variables, les flavanoïdes sont bien représentés sur le plan (cos² 0,842), la cendre (ash) mal (0,249). Sept variables dépassent 1/p = 0,077 en contribution à l'axe 1, les flavanoïdes en tête avec 17,9 %.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les corrélations variables-axes sont à calculer : `valeurs`, `vecteurs` et `colonnes` sont prêts. Rangez dans `plan` (13 valeurs) le cos² de chaque variable sur le **plan des axes 1 et 2** (somme des carrés de ses corrélations avec ces deux axes), et dans `moins_bien` le **nom** de la variable la moins bien représentée sur ce plan.",
      setup: ACP_FAITE,
      starter: lines(
        "plan = None",
        "moins_bien = ''",
      ),
      solution: lines(
        "corr = vecteurs[:, :2] * np.sqrt(valeurs[:2])",
        "plan = (corr ** 2).sum(axis=1)",
        "moins_bien = colonnes[int(plan.argmin())]",
        "print(moins_bien, round(float(plan.min()), 3))",
      ),
      test: lines(
        "assert np.shape(plan) == (13,), \"plan doit contenir un cos² par variable (13 valeurs)\"",
        "_c = vecteurs[:, :2] * np.sqrt(valeurs[:2])",
        "assert np.allclose(plan, (_c ** 2).sum(axis=1)), \"cos² sur le plan = somme, sur les axes 1 et 2, du carré de la corrélation (vecteur propre x racine de la valeur propre)\"",
        "assert np.all(plan <= 1 + 1e-9), \"un cos² ne dépasse pas 1\"",
        "assert moins_bien == colonnes[int(np.argmin((_c ** 2).sum(axis=1)))], \"moins_bien doit être le nom de la variable dont le cos² sur le plan est le plus petit\"",
      ),
      hint: "La corrélation avec l'axe k est vecteurs[:, k] * np.sqrt(valeurs[k]). Elevez au carré, sommez sur les deux axes, puis np.argmin donne la position de la plus faible.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `ctr1`, la contribution de chacun des 178 vins à l'**axe 1** (`F[:, 0] ** 2 / (n * valeurs[0])`), puis `top3`, la liste des positions des **trois vins qui contribuent le plus**, du plus fort au plus faible.",
      setup: ACP_FAITE,
      starter: lines(
        "ctr1 = None",
        "top3 = []",
      ),
      solution: lines(
        "ctr1 = F[:, 0] ** 2 / (n * valeurs[0])",
        "top3 = [int(i) for i in np.argsort(-ctr1)[:3]]",
        "print(top3, ctr1[top3].round(4))",
      ),
      test: lines(
        "assert np.shape(ctr1) == (178,), \"ctr1 doit contenir une contribution par vin (178 valeurs)\"",
        "assert abs(np.sum(ctr1) - 1) < 1e-9, \"les contributions à un axe somment à 1 : coordonnée² / (n x valeur propre)\"",
        "_c = F[:, 0] ** 2 / (n * valeurs[0])",
        "assert np.allclose(ctr1, _c), \"ctr1 = F[:, 0] ** 2 / (n * valeurs[0])\"",
        "_t = [int(i) for i in np.argsort(-_c)[:3]]",
        "assert list(top3) == _t, f\"les trois plus fortes contributions sont celles des vins {_t}, dans cet ordre\"",
      ),
      hint: "np.argsort(-ctr1) classe du plus grand au plus petit ; gardez les trois premières positions.",
    },
    {
      kind: "text",
      md: `### Éléments supplémentaires

Les cultivars sont connus, mais l'ACP ne les a pas utilisés. On peut pourtant les **placer** sur les résultats, sans qu'ils influencent les axes : ce sont des éléments **supplémentaires** (ou illustratifs). Les éléments **actifs** sont ceux qui servent à construire les axes ; les supplémentaires sont projetés après coup.

- **Une variable qualitative supplémentaire** (le cultivar) : on place le **barycentre** de chaque modalité, c'est-à-dire la moyenne des coordonnées des vins qui la portent. On mesure aussi à quel point un axe sépare les modalités avec le **rapport de corrélation** : la part de la variance de l'axe expliquée par le cultivar (0 : aucune ; 1 : tout).
- **Un individu supplémentaire** : on lui applique **le centrage, la réduction et les vecteurs propres de l'analyse**, puis on calcule ses coordonnées. C'est ainsi qu'on place un nouveau vin sans refaire l'analyse. Pour le montrer, retirons le vin 0 de l'analyse, puis projetons-le : on le compare à sa position quand il participait.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "# Variable qualitative supplémentaire : le cultivar",
        "bary = np.array([F[cultivar.values == k, :2].mean(axis=0) for k in range(3)])",
        "print('barycentres des cultivars (axes 1 et 2) :')",
        "print(bary.round(2))",
        "for a in range(3):",
        "    f = F[:, a]",
        "    entre = sum((cultivar.values == k).sum() * (f[cultivar.values == k].mean() - f.mean()) ** 2 for k in range(3))",
        "    print('rapport de corrélation du cultivar avec l\\'axe', a + 1, ':', round(entre / ((f - f.mean()) ** 2).sum(), 3))",
        "",
        "# Individu supplémentaire : le vin 0, retiré de l'analyse puis projeté",
        "Xm = X.drop(index=0)",
        "mu, sd = Xm.mean(), Xm.std(ddof=0)",
        "Zm = ((Xm - mu) / sd).values",
        "w, V = np.linalg.eigh(Zm.T @ Zm / len(Zm))",
        "o = np.argsort(w)[::-1]",
        "V = V[:, o]",
        "V = V * np.sign(V[np.abs(V).argmax(axis=0), np.arange(p)])",
        "z0 = ((X.iloc[[0]] - mu) / sd).values              # le vin 0 avec la moyenne et l'écart type des 177 autres",
        "print('vin 0 projeté sans participer :', (z0 @ V)[0, :2].round(3), ' participant :', F[0, :2].round(3))",
      ),
      caption: "Les barycentres des cultivars 0, 1 et 2 sont (2,28 ; 0,97), (-0,04 ; -1,64) et (-2,75 ; 1,24) : l'axe 1 oppose les cultivars 0 et 2, et l'axe 2 isole le cultivar 1. Le rapport de corrélation vaut 0,800 sur l'axe 1, 0,722 sur l'axe 2 et 0,032 sur l'axe 3 : le cultivar explique l'essentiel de la variance des deux premiers axes, presque rien du troisième. Le vin 0, projeté sans avoir participé, tombe en (3,319 ; 1,484), tout près de sa position quand il participait (3,317 ; 1,443).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le cultivar est dans `cultivar` (0, 1 ou 2) et les coordonnées des vins dans `F`. Calculez `bary`, un tableau de 3 lignes (une par cultivar) et 2 colonnes : la moyenne des coordonnées sur les **axes 1 et 2** des vins de chaque cultivar. Rangez dans `plus_proche` le cultivar dont le barycentre est le plus proche de l'origine.",
      setup: ACP_FAITE,
      starter: lines(
        "bary = None",
        "plus_proche = -1",
      ),
      solution: lines(
        "bary = np.array([F[cultivar.values == k, :2].mean(axis=0) for k in range(3)])",
        "plus_proche = int(np.linalg.norm(bary, axis=1).argmin())",
        "print(bary.round(2), plus_proche)",
      ),
      test: lines(
        "assert np.shape(bary) == (3, 2), \"bary doit avoir 3 lignes (cultivars) et 2 colonnes (axes 1 et 2)\"",
        "_b = np.array([F[cultivar.values == k, :2].mean(axis=0) for k in range(3)])",
        "assert np.allclose(bary, _b), \"bary[k] est la moyenne de F[:, :2] sur les vins du cultivar k : F[cultivar.values == k, :2].mean(axis=0)\"",
        "assert plus_proche == int(np.linalg.norm(_b, axis=1).argmin()), \"plus_proche est le cultivar dont la ligne de bary a la plus petite norme\"",
      ),
      hint: "cultivar.values == k donne un masque des vins du cultivar k. np.linalg.norm(bary, axis=1) donne la distance de chaque barycentre à l'origine.",
    },
    {
      kind: "text",
      md: `### Trois pièges

**Données non réduites.** Sans centrage et réduction de l'échelle, l'axe 1 suit la variable de plus grande variance, quelle que soit sa signification. C'est le piège du module 1, vu cette fois dans les résultats.

**Valeur extrême.** Un individu très éloigné des autres tire un axe vers lui. Il se repère à une **contribution** anormalement forte à un axe, et il vaut mieux se demander s'il s'agit d'une erreur de saisie avant de décider de le garder, de le corriger ou de le passer en élément supplémentaire.

**Proximité trompeuse.** Sur un plan factoriel, deux points voisins ne sont des vins semblables que s'ils sont **bien représentés** (cos² élevé). Un vin qui se projette près de l'origine a souvent un cos² faible : il est loin de l'origine dans les dimensions que le plan ne montre pas.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "from sklearn.decomposition import PCA",
        "",
        "# 1. Données non réduites",
        "brut = PCA(n_components=2).fit(X)",
        "print('sans réduction, part de l\\'axe 1 :', round(brut.explained_variance_ratio_[0], 4),",
        "      ' poids de la proline dans l\\'axe :', round(float(brut.components_[0][colonnes.index('proline')]), 3))",
        "",
        "# 2. Une valeur extrême : on met 400 de magnésium au vin 0 (une erreur de saisie, par exemple)",
        "def acp(M):",
        "    Zc = (M - M.mean()) / M.std(ddof=0)",
        "    w, V = np.linalg.eigh(Zc.values.T @ Zc.values / len(Zc))",
        "    o = np.argsort(w)[::-1]",
        "    w, V = w[o], V[:, o]",
        "    return Zc.values, w, V * np.sign(V[np.abs(V).argmax(axis=0), np.arange(V.shape[1])])",
        "X2 = X.copy()",
        "X2.loc[0, 'magnesium'] = 400.0",
        "Z2, w2, V2 = acp(X2)",
        "F2 = Z2 @ V2",
        "ctr2 = F2 ** 2 / (n * w2)",
        "print('magnésium réduit du vin 0 :', round(float(Z2[0, colonnes.index('magnesium')]), 2), 'au lieu de', round(float(Z.loc[0, 'magnesium']), 2))",
        "print('parts des 3 premiers axes :', (w2 / p)[:3].round(3), 'au lieu de', (valeurs / p)[:3].round(3))",
        "k = int(ctr2[0].argmax())",
        "print('contribution maximale du vin 0 :', round(float(ctr2[0, k]), 3), 'à l\\'axe', k + 1, 'au lieu de', round(float((F[0, k] ** 2) / (n * valeurs[k])), 3))",
        "",
        "# 3. Deux vins proches sur le plan, mais mal représentés",
        "i, j = 78, 121",
        "cos2_plan = (F[:, :2] ** 2).sum(axis=1) / (F ** 2).sum(axis=1)",
        "print('cos² sur le plan des vins', i, 'et', j, ':', cos2_plan[[i, j]].round(3))",
        "print('distance sur le plan :', round(float(np.linalg.norm(F[i, :2] - F[j, :2])), 2),",
        "      ' distance réelle (13 dimensions) :', round(float(np.linalg.norm(Z.values[i] - Z.values[j])), 2))",
      ),
      caption: "1. Sans réduction, l'axe 1 conserve 0,9981 de l'inertie et la proline y pèse 1,0 : l'analyse ne voit que la proline. 2. Avec 400 de magnésium, le vin 0 a une valeur réduite de 11,27 (au lieu de 1,91). Les parts des trois premiers axes changent à peine (0,361, 0,186, 0,110 au lieu de 0,362, 0,192, 0,111), mais ce seul vin contribue pour 0,522 à l'axe 5 (0,003 avant) : il fabrique à lui seul la moitié de cet axe. 3. Les vins 78 et 121 ont des cos² sur le plan de 0,119 et 0,049 : ils sont à 1,03 l'un de l'autre sur le plan, mais à 8,15 dans l'espace réel à 13 dimensions.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Pour le vin d'indice 100, rangez dans `cos2_axes` ses 13 cos² (un par axe, `F[100] ** 2` divisé par sa somme) et dans `qualite_plan` la part de son inertie qui se projette sur le plan des axes 1 et 2 (la somme de ses deux premiers cos²).",
      setup: ACP_FAITE,
      starter: lines(
        "cos2_axes = None",
        "qualite_plan = 0.0",
      ),
      solution: lines(
        "cos2_axes = F[100] ** 2 / (F[100] ** 2).sum()",
        "qualite_plan = cos2_axes[:2].sum()",
        "print(round(float(qualite_plan), 3))",
      ),
      test: lines(
        "assert np.shape(cos2_axes) == (13,), \"cos2_axes doit contenir un cos² par axe (13 valeurs)\"",
        "assert abs(np.sum(cos2_axes) - 1) < 1e-9, \"les cos² d'un individu sur tous les axes somment à 1 : divisez F[100] ** 2 par sa somme\"",
        "_c = F[100] ** 2 / (F[100] ** 2).sum()",
        "assert np.allclose(cos2_axes, _c), \"cos2_axes = F[100] ** 2 / (F[100] ** 2).sum()\"",
        "assert abs(qualite_plan - _c[:2].sum()) < 1e-9, \"qualite_plan est la somme des cos² des axes 1 et 2\"",
      ),
      hint: "Le cos² du vin sur l'axe k est sa coordonnée au carré divisée par la somme des carrés de ses coordonnées sur les 13 axes.",
    },
    {
      kind: "note",
      tone: "tip",
      md: `**Une marche à suivre pour lire une ACP.** (1) Regardez les valeurs propres et décidez du nombre d'axes. (2) Pour chaque axe, repérez les variables qui contribuent le plus et leur signe, en vérifiant leur cos². (3) Placez les individus, en ne commentant que ceux qui sont bien représentés. (4) Ajoutez les éléments supplémentaires pour relier les axes à ce qui vous intéresse. (5) Revenez aux données brutes pour confirmer chaque lecture : un graphique suggère, il ne démontre pas.`,
    },
  ],
  quiz: [
    {
      question: "Sur le cercle des corrélations, une variable est représentée par une flèche très courte. Que peut-on en dire ?",
      options: [
        "Elle est peu variable",
        "Elle est mal représentée dans ce plan : sa position n'est pas lisible, elle est surtout portée par d'autres axes",
        "Elle est indépendante de toutes les autres variables",
        "Elle doit être supprimée de l'analyse",
      ],
      correct: 1,
      explanation: "Les variables sont réduites, donc toutes de variance 1. La longueur de la flèche mesure la part de la variable portée par le plan (la racine du cos²). Une flèche courte appelle à regarder d'autres axes.",
    },
    {
      question: "Quelle est la différence entre le cos² et la contribution d'un vin à un axe ?",
      options: [
        "Aucune, ce sont deux noms de la même quantité",
        "Le cos² dit si le vin est bien représenté sur l'axe ; la contribution dit quelle part de l'inertie de l'axe il apporte",
        "Le cos² concerne les variables, la contribution les individus",
        "La contribution est toujours inférieure au cos²",
      ],
      correct: 1,
      explanation: "Le cos² compare l'écart du vin sur l'axe à sa distance totale à l'origine ; la contribution compare le carré de sa coordonnée à l'inertie de l'axe. Un vin peut avoir l'un élevé et l'autre faible.",
    },
    {
      question: "Pourquoi le cultivar est-il traité comme variable supplémentaire dans cette analyse ?",
      options: [
        "Parce qu'il est qualitatif et que l'ACP ne peut pas le lire",
        "Pour le placer sur les résultats sans qu'il influence les axes, et vérifier ensuite si les axes le retrouvent",
        "Parce qu'il contient des valeurs manquantes",
        "Parce qu'il est identique à l'axe 1",
      ],
      correct: 1,
      explanation: "Les axes sont calculés sur les 13 mesures chimiques seulement. Le cultivar est projeté ensuite par ses barycentres : s'ils sont bien séparés, c'est un résultat, et non une conséquence du calcul.",
    },
    {
      question: "Sur le plan factoriel, deux vins apparaissent côte à côte, tous deux avec un cos² de 0,05 sur le plan. Que peut-on conclure ?",
      options: [
        "Qu'ils ont des compositions chimiques très proches",
        "Rien de fiable sur leur ressemblance : ils sont mal représentés, et ils peuvent être très éloignés dans les dimensions que le plan ne montre pas",
        "Qu'ils appartiennent au même cultivar",
        "Qu'ils sont des valeurs extrêmes",
      ],
      correct: 1,
      explanation: "Un cos² faible signifie que presque toute la distance du vin à l'origine se trouve hors du plan. Deux vins peuvent se projeter près l'un de l'autre et différer fortement sur les autres axes.",
    },
  ],
};
