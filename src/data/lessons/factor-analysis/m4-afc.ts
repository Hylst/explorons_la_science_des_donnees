import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { TABLE_PARTI_POSITION } from "./data";

/** Les étapes de l'AFC déjà vues dans l'exemple de décomposition, pour les exemples et exercices qui s'appuient dessus */
const AFC_DECOMPOSEE = lines(
  TABLE_PARTI_POSITION,
  "n = table.to_numpy().sum()",
  "P = table.to_numpy() / n",
  "r = P.sum(axis=1)",
  "c = P.sum(axis=0)",
  "S = (P - np.outer(r, c)) / np.sqrt(np.outer(r, c))",
  "U, s, Vt = np.linalg.svd(S)",
  "F = U / np.sqrt(r)[:, None] * s",
  "G = Vt.T / np.sqrt(c)[:, None] * s",
  "for k in range(2):                 # le signe d'un axe est arbitraire : on l'oriente (dernier parti vers la droite)",
  "    if F[-1, k] < 0:",
  "        F[:, k] *= -1",
  "        G[:, k] *= -1",
);

export const moduleAfc: LessonModule = {
  id: "afc",
  title: "L'analyse factorielle des correspondances (AFC)",
  duration: "2 h 30",
  summary: "Étudier le lien entre deux variables qualitatives à partir de leur tableau croisé : profils, indépendance et khi-deux, inertie, décomposition en valeurs singulières en NumPy, représentation simultanée, pièges de lecture et effet Guttman.",
  objectives: [
    "Construire les profils lignes et les profils colonnes d'un tableau de contingence et dire ce que signifie l'indépendance",
    "Calculer le khi-deux avec scipy et retrouver l'inertie totale comme khi-deux divisé par l'effectif",
    "Obtenir les valeurs propres et les coordonnées des lignes et des colonnes par une décomposition en valeurs singulières en NumPy",
    "Lire une représentation simultanée sans se tromper sur ce que veulent dire les distances entre points de variables différentes",
    "Reconnaître un effet Guttman (fer à cheval) et le mesurer sur les coordonnées",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand les données sont deux variables qualitatives

L'ACP du module précédent travaille sur des mesures numériques. Mais beaucoup de données sont des **catégories** : le parti dont on se sent proche, une position politique déclarée, un métier, une région. Quand on croise deux telles variables, on obtient un **tableau de contingence** : une ligne par modalité de la première, une colonne par modalité de la seconde, et dans chaque case le nombre de personnes concernées.

L'**analyse factorielle des correspondances** (AFC) est la méthode qui fait, pour un tableau de contingence, ce que l'ACP fait pour un tableau de mesures : elle en donne une vue plane où l'on peut lire les ressemblances et les oppositions. On parle aussi d'analyse des correspondances. Elle a été développée en France dans les années 1960 et 1970, autour de Jean-Paul Benzécri, et c'est une des raisons pour lesquelles on parle d'« école française » de l'analyse des données.

Notre exemple : l'enquête électorale américaine de 1996 (ANES), 944 personnes, livrée avec la bibliothèque statsmodels. Chaque personne a indiqué le **parti** dont elle se sent proche (7 modalités, de « démocrate convaincu » à « républicain convaincu ») et sa **position** politique déclarée (7 modalités, de « très libéral » à « très conservateur »). Au sens américain, « libéral » désigne la gauche. Nous restons strictement descriptifs : l'AFC dit comment les réponses se répartissent, pas ce qu'il faut en penser.

### Les profils

Dans un tableau de contingence, comparer des effectifs bruts n'a pas de sens : il y a plus de personnes « modérées » que « très libérales » parce que le groupe est plus gros, pas parce qu'un parti l'attire davantage. On passe donc aux **proportions**.

- Le **profil ligne** d'un parti est la répartition de ses membres entre les positions : chaque ligne est divisée par son total, et somme 1.
- Le **profil colonne** d'une position est la répartition de ses personnes entre les partis.
- Le **profil moyen** est la répartition de l'ensemble de la population, c'est-à-dire les marges du tableau.

Les profils sont les objets que l'AFC compare. Deux lignes sont proches si leurs profils se ressemblent.`,
    },
    {
      kind: "code",
      language: "python",
      setup: TABLE_PARTI_POSITION,
      code: lines(
        "print(table.to_string())                       # effectifs bruts",
        "n = table.to_numpy().sum()",
        "print('personnes :', n)",
        "",
        "profils_lignes = table.div(table.sum(axis=1), axis=0)     # chaque ligne divisée par son total",
        "print((profils_lignes * 100).round(1).to_string())",
        "",
        "profil_moyen = table.sum(axis=0) / n                      # la population entière",
        "print((profil_moyen * 100).round(1).to_string())",
      ),
      caption: "Le tableau compte 944 personnes. Parmi les « démocrates convaincus », 30,5 % se disent « libéraux » et 7,0 % « conservateurs » ; parmi les « républicains convaincus », 1,1 % se disent « libéraux » et 65,7 % « conservateurs ». Dans l'ensemble de la population, 27,1 % se placent à « modéré », 23,1 % à « conservateur » et 10,9 % à « libéral ». Les profils des partis s'écartent nettement du profil moyen, chacun dans une direction : c'est ce que l'AFC va résumer.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau `table` (partis en lignes, positions en colonnes) est prêt. Rangez dans `profils_lignes` le tableau des profils lignes (chaque ligne divisée par son total, donc de somme 1) et dans `profil_moyen` la proportion de chaque position dans l'ensemble des 944 personnes (7 valeurs de somme 1).",
      setup: TABLE_PARTI_POSITION,
      starter: lines(
        "profils_lignes = table",
        "profil_moyen = table.sum(axis=0)",
      ),
      solution: lines(
        "profils_lignes = table.div(table.sum(axis=1), axis=0)",
        "profil_moyen = table.sum(axis=0) / table.to_numpy().sum()",
        "print(profils_lignes.sum(axis=1).round(3).tolist(), round(float(profil_moyen.sum()), 3))",
      ),
      test: lines(
        "_t = table.to_numpy()",
        "_pl = np.asarray(profils_lignes, dtype=float)",
        "assert _pl.shape == (7, 7), \"profils_lignes doit garder la forme 7 sur 7 du tableau\"",
        "assert np.allclose(_pl.sum(axis=1), 1), \"chaque ligne de profils_lignes doit sommer 1 : divisez chaque ligne par son total (table.div(..., axis=0))\"",
        "assert np.allclose(_pl, _t / _t.sum(axis=1, keepdims=True)), \"profils_lignes[i, j] = effectif[i, j] / total de la ligne i\"",
        "_pm = np.asarray(profil_moyen, dtype=float)",
        "assert _pm.shape == (7,), \"profil_moyen doit avoir une valeur par position (7 valeurs)\"",
        "assert np.isclose(_pm.sum(), 1), \"profil_moyen doit sommer 1 : divisez les totaux des colonnes par l'effectif total\"",
        "assert np.allclose(_pm, _t.sum(axis=0) / _t.sum()), \"profil_moyen[j] = total de la colonne j / effectif total\"",
      ),
      hint: "table.sum(axis=1) donne le total de chaque ligne ; table.div(totaux, axis=0) divise chaque ligne par le sien. Le profil moyen est table.sum(axis=0) divisé par le total général.",
    },
    {
      kind: "text",
      md: `### L'indépendance et le khi-deux

Si le parti et la position n'avaient aucun lien, tous les partis auraient le même profil ligne, égal au profil moyen. L'effectif attendu dans la case (i, j) serait alors le produit du total de la ligne i et du total de la colonne j, divisé par l'effectif total. C'est la définition de l'**indépendance**.

Le **khi-deux** mesure l'écart entre le tableau observé et ce tableau attendu : pour chaque case, on prend le carré de l'écart divisé par l'effectif attendu, puis on additionne. \`scipy.stats.chi2_contingency\` calcule la statistique, ses degrés de liberté (ici (7 - 1) fois (7 - 1), soit 36), une p-valeur et les effectifs attendus.

En divisant le khi-deux par l'effectif total n, on obtient l'**inertie totale** du nuage des profils. Elle ne dépend plus de la taille de l'échantillon : c'est une mesure de l'intensité du lien, alors que le khi-deux et sa p-valeur grandissent avec n. Elle est écrite en proportions (p_ij, r_i et c_j sont les proportions de la case, de la ligne et de la colonne) :`,
    },
    {
      kind: "equation",
      latex: String.raw`\Phi^2 = \sum_{i,j} \frac{(p_{ij} - r_i c_j)^2}{r_i c_j} = \frac{\chi^2}{n}`,
      narrow: String.raw`\begin{aligned} \Phi^2 &= \sum_{i,j} \frac{(p_{ij} - r_i c_j)^2}{r_i c_j} \\ &= \frac{\chi^2}{n} \end{aligned}`,
      caption: "Inertie totale Φ² : p_ij est la proportion de la case (i, j), r_i celle de la ligne i et c_j celle de la colonne j. Le produit r_i c_j est la proportion attendue sous l'indépendance.",
    },
    {
      kind: "code",
      language: "python",
      setup: TABLE_PARTI_POSITION,
      code: lines(
        "from scipy.stats import chi2_contingency",
        "",
        "n = table.to_numpy().sum()",
        "res = chi2_contingency(table)",
        "print('khi-deux :', round(res.statistic, 3), ' ddl :', res.dof, ' p :', f'{res.pvalue:.2e}')",
        "",
        "attendus = pd.DataFrame(res.expected_freq, index=table.index, columns=table.columns)",
        "print('plus petit effectif attendu :', round(attendus.to_numpy().min(), 2),",
        "      ' cases attendues sous 5 :', int((res.expected_freq < 5).sum()), 'sur', res.expected_freq.size)",
        "",
        "inertie = res.statistic / n                      # inertie totale = khi-deux / n",
        "print('inertie totale :', round(inertie, 4))",
        "print('V de Cramér :', round((inertie / (min(table.shape) - 1)) ** 0.5, 3))",
        "",
        "residus = (table - attendus) / np.sqrt(attendus)  # écarts standardisés : (observé - attendu) / racine(attendu)",
        "print('somme des carrés des résidus :', round(float((residus ** 2).sum().sum()), 3))",
        "plus_grand = residus.stack().idxmax()",
        "print('plus grand écart :', plus_grand, round(float(residus.stack().max()), 2))",
      ),
      caption: "Le khi-deux vaut 528,194 pour 36 degrés de liberté ; la p-valeur (8,95e-89) est si petite qu'elle ne dit qu'une chose : le lien n'est pas dû au hasard de l'échantillon. L'inertie totale est 0,5595 (528,194 divisé par 944) et le V de Cramér, qui la ramène entre 0 et 1, vaut 0,305. Le plus grand écart standardisé est celui des « républicains convaincus » qui se disent « conservateurs » (11,73, soit bien plus de personnes que ne l'aurait donné l'indépendance). La somme des carrés des résidus redonne le khi-deux : c'est la même quantité, case par case.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "La p-valeur du khi-deux suppose que les effectifs attendus ne sont pas trop petits (on cite souvent le seuil de 5). Ici, 11 cases sur 49 sont sous ce seuil, la plus petite attendant 0,63 personne, parce que les modalités extrêmes sont rares. Avec une statistique aussi éloignée de ses 36 degrés de liberté, la conclusion ne change pas, mais la p-valeur exacte n'est pas à prendre au pied de la lettre. L'AFC elle-même est une méthode descriptive : elle ne demande pas ce seuil, mais les modalités très rares y pèsent peu et leurs positions sont fragiles.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec `scipy.stats.chi2_contingency`, calculez le khi-deux du tableau `table` et rangez-le dans `khi2`. Puis rangez dans `inertie` l'inertie totale (le khi-deux divisé par l'effectif total).",
      setup: TABLE_PARTI_POSITION,
      starter: lines(
        "khi2 = 0.0",
        "inertie = 0.0",
      ),
      solution: lines(
        "from scipy.stats import chi2_contingency",
        "khi2 = chi2_contingency(table).statistic",
        "inertie = khi2 / table.to_numpy().sum()",
        "print(round(khi2, 3), round(inertie, 4))",
      ),
      test: lines(
        "from scipy.stats import chi2_contingency as _chi",
        "_k = _chi(table).statistic",
        "assert abs(khi2 - _k) < 1e-6, f\"le khi-deux attendu est {_k:.3f} : chi2_contingency(table).statistic\"",
        "assert abs(inertie - _k / 944) < 1e-9, \"l'inertie totale est le khi-deux divisé par l'effectif total (944 personnes)\"",
      ),
      hint: "chi2_contingency(table) renvoie un objet dont l'attribut .statistic est le khi-deux. L'effectif total est table.to_numpy().sum().",
    },
    {
      kind: "text",
      md: `### De l'inertie aux axes : une décomposition en valeurs singulières

L'inertie totale 0,5595 est un seul nombre ; l'AFC la **répartit sur des axes**, comme l'ACP répartit la variance. Le calcul tient en quatre lignes de NumPy.

- On forme la matrice des **résidus standardisés** S : pour chaque case, la proportion observée moins la proportion attendue, divisée par la racine de la proportion attendue. La somme des carrés des éléments de S est l'inertie totale.
- On la décompose en **valeurs singulières** : S = U Σ V^T (module 2). Le carré de chaque valeur singulière est une **valeur propre** : l'inertie portée par l'axe. Leur somme est l'inertie totale.
- Les **coordonnées des lignes** sont les vecteurs de U, remis à l'échelle des profils (divisés par la racine de r_i) et multipliés par les valeurs singulières. Celles des colonnes se calculent de la même façon à partir de V.`,
    },
    {
      kind: "equation",
      latex: String.raw`s_{ij} = \frac{p_{ij} - r_i c_j}{\sqrt{r_i c_j}} \qquad S = U \Sigma V^{\top} \qquad \lambda_k = \sigma_k^2 \qquad \sum_k \lambda_k = \Phi^2`,
      narrow: String.raw`\begin{aligned} s_{ij} &= \frac{p_{ij} - r_i c_j}{\sqrt{r_i c_j}} \\ S &= U \Sigma V^{\top} \\ \lambda_k &= \sigma_k^2 \qquad \sum_k \lambda_k = \Phi^2 \end{aligned}`,
      caption: "Les valeurs propres λ_k sont les carrés des valeurs singulières σ_k de la matrice S des résidus standardisés ; leur somme est l'inertie totale.",
    },
    {
      kind: "equation",
      latex: String.raw`F_{ik} = \frac{u_{ik}\,\sigma_k}{\sqrt{r_i}} \qquad G_{jk} = \frac{v_{jk}\,\sigma_k}{\sqrt{c_j}}`,
      caption: "Coordonnée F_ik de la ligne i sur l'axe k, et G_jk de la colonne j : u_ik et v_jk sont les éléments des matrices U et V. Chaque ligne est pesée par sa proportion r_i, chaque colonne par c_j : une modalité rare pèse peu dans l'inertie.",
    },
    {
      kind: "code",
      language: "python",
      setup: TABLE_PARTI_POSITION,
      code: lines(
        "n = table.to_numpy().sum()",
        "P = table.to_numpy() / n                  # proportions p_ij",
        "r = P.sum(axis=1)                         # poids des lignes",
        "c = P.sum(axis=0)                         # poids des colonnes",
        "",
        "S = (P - np.outer(r, c)) / np.sqrt(np.outer(r, c))   # résidus standardisés",
        "print('somme des carrés de S :', round(float((S ** 2).sum()), 4), '(= l\\'inertie totale)')",
        "",
        "U, s, Vt = np.linalg.svd(S)",
        "valeurs_propres = s ** 2",
        "print('valeurs propres :', valeurs_propres.round(4))",
        "print('parts d\\'inertie (%) :', (100 * valeurs_propres / valeurs_propres.sum()).round(1))",
        "",
        "F = U / np.sqrt(r)[:, None] * s           # coordonnées des lignes (une colonne par axe)",
        "G = Vt.T / np.sqrt(c)[:, None] * s        # coordonnées des colonnes",
        "for k in range(2):                        # le signe d'un axe est arbitraire : on l'oriente",
        "    if F[-1, k] < 0:",
        "        F[:, k] *= -1",
        "        G[:, k] *= -1",
        "print(pd.DataFrame(F[:, :2], index=table.index, columns=['axe 1', 'axe 2']).round(3).to_string())",
        "print(pd.DataFrame(G[:, :2], index=table.columns, columns=['axe 1', 'axe 2']).round(3).to_string())",
      ),
      caption: "Les valeurs propres sont 0,4288, 0,0942, 0,0278, 0,0080 et 0,0008, les deux dernières étant nulles à l'arrondi ; elles somment 0,5595. L'axe 1 porte 76,6 % de l'inertie, l'axe 2 16,8 %, l'axe 3 5,0 % : les deux premiers axes en conservent 93,5 %. Un tableau 7 sur 7 a au plus 6 axes utiles, car les totaux fixés des lignes et des colonnes enlèvent une dimension. Sur l'axe 1, les partis vont de -0,627 (« démocrate convaincu ») à 1,056 (« républicain convaincu ») dans l'ordre naturel ; les positions vont de -0,855 (« très libéral ») à 0,955 (« conservateur »).",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le signe d'un axe n'a pas de sens : la décomposition fournit une orientation au hasard, et une autre version de NumPy ou une autre bibliothèque peut retourner l'axe. L'exemple oriente donc chaque axe pour que le dernier parti soit à droite ou en haut. Les distances, elles, ne changent pas. Les valeurs propres, par ailleurs, se lisent comme celles de l'ACP du module 2 (une part d'inertie se lit comme une part de variance) ; en AFC, elles peuvent aller jusqu'à 1, et une valeur propre proche de 1 signale un bloc de modalités presque isolé.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les proportions `P`, les poids `r` et `c` et la matrice des résidus standardisés `S` sont prêts. Décomposez `S` avec `np.linalg.svd`. Rangez dans `valeurs_propres` les carrés des valeurs singulières (7 valeurs) et dans `coord_axe1` les coordonnées des 7 lignes sur le premier axe (u divisé par la racine de r, multiplié par la première valeur singulière), orientées pour que la dernière ligne (« républicain convaincu ») soit positive.",
      setup: lines(
        TABLE_PARTI_POSITION,
        "n = table.to_numpy().sum()",
        "P = table.to_numpy() / n",
        "r = P.sum(axis=1)",
        "c = P.sum(axis=0)",
        "S = (P - np.outer(r, c)) / np.sqrt(np.outer(r, c))",
      ),
      starter: lines(
        "valeurs_propres = np.zeros(7)",
        "coord_axe1 = np.zeros(7)",
      ),
      solution: lines(
        "U, s, Vt = np.linalg.svd(S)",
        "valeurs_propres = s ** 2",
        "coord_axe1 = U[:, 0] / np.sqrt(r) * s[0]",
        "if coord_axe1[-1] < 0:",
        "    coord_axe1 = -coord_axe1",
        "print(valeurs_propres.round(4), coord_axe1.round(3))",
      ),
      test: lines(
        "_s = np.linalg.svd(S)[1]",
        "_inertie = (S ** 2).sum()",
        "assert np.shape(valeurs_propres) == (7,), \"valeurs_propres doit avoir 7 valeurs, une par axe\"",
        "assert abs(np.sum(valeurs_propres) - _inertie) < 1e-9, \"la somme des valeurs propres doit être l'inertie totale (0,5595) : ce sont les carrés des valeurs singulières\"",
        "assert np.allclose(valeurs_propres, _s ** 2), \"valeurs_propres = s ** 2, où s sont les valeurs singulières de S\"",
        "_u = np.linalg.svd(S)[0][:, 0]",
        "_f = _u / np.sqrt(r) * _s[0]",
        "_f = _f if _f[-1] > 0 else -_f",
        "assert np.shape(coord_axe1) == (7,), \"coord_axe1 doit avoir 7 valeurs, une par parti\"",
        "assert coord_axe1[-1] > 0, \"orientez l'axe : la coordonnée de la dernière ligne doit être positive\"",
        "assert np.allclose(coord_axe1, _f), \"coord_axe1 = u[:, 0] / racine(r) * s[0] : divisez par la racine des poids des lignes, puis multipliez par la valeur singulière\"",
      ),
      hint: "U, s, Vt = np.linalg.svd(S) ; la première colonne de U est U[:, 0]. Divisez-la par np.sqrt(r) et multipliez par s[0].",
    },
    {
      kind: "text",
      md: `### La représentation simultanée

Les coordonnées des lignes et celles des colonnes sont exprimées dans les **mêmes axes** (avec la même échelle, les valeurs propres) : on peut donc dessiner les deux nuages sur un même plan. C'est la **représentation simultanée**, la figure typique de l'AFC. Les partis y sont des points ronds, les positions des triangles.`,
    },
    {
      kind: "code",
      language: "python",
      setup: AFC_DECOMPOSEE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "vp = s ** 2",
        "fig, ax = plt.subplots(figsize=(7.5, 5.5))",
        "ax.axhline(0, color='grey', lw=0.6)",
        "ax.axvline(0, color='grey', lw=0.6)",
        "ax.scatter(F[:, 0], F[:, 1], color='tab:blue', s=40, label='lignes : partis')",
        "ax.scatter(G[:, 0], G[:, 1], color='tab:orange', marker='^', s=50, label='colonnes : positions')",
        "for i, nom in enumerate(table.index):",
        "    bas = i == 4          # deux points voisins : on décale une étiquette",
        "    ax.annotate(str(nom), (F[i, 0], F[i, 1]), fontsize=7, color='tab:blue',",
        "                xytext=(4, -12) if bas else (4, 4), textcoords='offset points')",
        "for j, nom in enumerate(table.columns):",
        "    ax.annotate(str(nom), (G[j, 0], G[j, 1]), fontsize=7, color='darkorange', xytext=(4, -9), textcoords='offset points')",
        "ax.set_xlabel(f'axe 1 ({100 * vp[0] / vp.sum():.1f} %)')",
        "ax.set_ylabel(f'axe 2 ({100 * vp[1] / vp.sum():.1f} %)')",
        "ax.set_xlim(-1.0, 1.45)",
        "ax.legend(fontsize=8, loc='upper center')",
        "plt.tight_layout()",
      ),
      caption: "Le plan des axes 1 et 2 conserve 93,5 % de l'inertie (76,6 % et 16,8 %). L'axe 1 range les partis et les positions dans le même ordre, de « démocrate convaincu » et « très libéral » à gauche jusqu'à « républicain convaincu » et « conservateur » à droite. L'axe 2 oppose les extrémités (en haut) au centre (en bas). Les partis proches de « modéré » sont en bas.",
    },
    {
      kind: "text",
      md: `### Comment lire (et mal lire) le plan

La lecture se fait en deux temps, et le second est celui où l'on se trompe.

- **Deux points de la même variable** (deux partis, ou deux positions) : leur distance est interprétable. Deux partis proches ont des profils ligne semblables. La distance utilisée est celle du khi-deux, qui pondère chaque colonne par l'inverse de sa proportion : les écarts sur des modalités rares comptent davantage. Ici, « indépendant proche républicain » et « républicain modéré » sont voisins sur l'axe 1.
- **Un point d'une variable et un point de l'autre** (un parti et une position) : leur distance ne se lit **pas** comme une distance. Les lignes et les colonnes sont tracées dans le même plan, mais elles ne sont pas des points du même nuage. Ce qu'on peut dire se lit en **direction** : un parti et une position placés du même côté de l'origine, loin de l'origine, sont associés plus souvent que sous l'indépendance. Plus ils sont écartés de l'origine, plus l'association est marquée, mais on ne mesure pas le lien à la longueur du segment qui les relie.

La formule de transition donne la raison exacte : la coordonnée d'un parti est, à un facteur près (l'inverse de σ_k), le **barycentre** des coordonnées des positions, pondéré par son profil ligne. Un parti est attiré vers les positions où il compte beaucoup de personnes. Les coordonnées de la figure l'illustrent, et l'on peut le vérifier numériquement.`,
    },
    {
      kind: "equation",
      latex: String.raw`F_{ik} = \frac{1}{\sigma_k} \sum_j \frac{p_{ij}}{r_i}\, G_{jk}`,
      caption: "Formule de transition : la ligne i est placée au barycentre des colonnes, avec pour poids son profil ligne p_ij / r_i, puis réduite par le facteur 1 / σ_k. Comme σ_k est inférieur à 1, la ligne est « tirée » vers le centre : c'est l'une des raisons pour lesquelles distance ligne-colonne et association ne coïncident pas.",
    },
    {
      kind: "code",
      language: "python",
      setup: AFC_DECOMPOSEE,
      code: lines(
        "profils = P / r[:, None]                       # profils lignes, en proportions",
        "bary = (profils @ G[:, 0]) / s[0]              # barycentre des colonnes sur l'axe 1",
        "print('coordonnées des lignes :', F[:, 0].round(3))",
        "print('barycentres des colonnes :', bary.round(3))",
        "print('identiques :', bool(np.allclose(bary, F[:, 0])))",
        "",
        "# contributions des lignes à l'inertie de l'axe 1 (part de la valeur propre apportée par chaque ligne)",
        "contrib = r * F[:, 0] ** 2 / s[0] ** 2",
        "print(pd.Series((100 * contrib).round(1), index=table.index).to_string())",
      ),
      caption: "Les deux lignes de nombres sont identiques : la coordonnée d'un parti sur l'axe 1 est bien le barycentre des positions, pondéré par son profil. Les contributions à l'axe 1 sont de 48,2 % pour « républicain convaincu » et de 19,4 % pour « démocrate convaincu » : ces deux partis construisent surtout l'axe. Comme pour l'ACP (module 3), une ligne contribue d'autant plus qu'elle est pesante (r_i grand) et éloigné de l'origine.",
    },
    {
      kind: "text",
      md: `### Un arc de cercle : l'effet Guttman

Regardez à nouveau la figure. Les points ne sont pas dispersés au hasard : de gauche à droite, ils montent, descendent, puis remontent, comme dans un **arc** ou un **fer à cheval**. C'est l'**effet Guttman**, bien connu quand les modalités sont **ordonnées** (de « très libéral » à « très conservateur », de « démocrate convaincu » à « républicain convaincu »). L'axe 1 capte l'ordre. L'axe 2 est alors, pour l'essentiel, une fonction de l'axe 1 : les extrémités sont du même côté, le centre de l'autre. Ce n'est pas une information nouvelle, c'est le même gradient, lu une seconde fois.

Plutôt que de l'affirmer à l'œil, on le mesure : on cherche quelle part de la variance de l'axe 2 (pesée par les proportions des modalités) est expliquée par l'axe 1 lui-même, d'abord par une droite, puis par une parabole.`,
    },
    {
      kind: "code",
      language: "python",
      setup: AFC_DECOMPOSEE,
      code: lines(
        "def part_expliquee(a, b, poids, degre):",
        "    \"\"\"Part de la variance pondérée de b expliquée par un polynôme de a.\"\"\"",
        "    A = np.vander(a, degre + 1)",
        "    w = np.sqrt(poids)",
        "    coef = np.linalg.lstsq(A * w[:, None], b * w, rcond=None)[0]",
        "    reste = b - A @ coef",
        "    ecart = b - np.average(b, weights=poids)",
        "    return 1 - np.sum(poids * reste ** 2) / np.sum(poids * ecart ** 2)",
        "",
        "for nom, a, b, poids in [('lignes', F[:, 0], F[:, 1], r), ('colonnes', G[:, 0], G[:, 1], c)]:",
        "    print(nom, ': droite', round(part_expliquee(a, b, poids, 1), 3), ' parabole', round(part_expliquee(a, b, poids, 2), 3))",
      ),
      caption: "Pour les 7 partis, la droite n'explique rien de l'axe 2 (0,000 à l'arrondi) alors qu'une parabole en explique 0,799 ; pour les 7 positions, 0,907 avec la parabole. L'arc est donc bien là, et plus net pour les positions. Avec seulement 7 points et 3 paramètres, une parabole ajuste facilement : la valeur n'est pas un test, mais elle s'ajoute à ce que l'on voit sur la figure.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Quand l'effet Guttman apparaît sur des modalités ordonnées, **lisez l'axe 1 comme le gradient** et ne cherchez pas de sens propre à l'axe 2 sans autre indice. Il apparaît d'autant plus souvent qu'une seule dimension domine les données. Il n'est pas systématique : un tableau dont les modalités n'ont pas d'ordre (des régions, des métiers) n'a aucune raison de le produire, et si on le voit, il faut se demander pourquoi.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les coordonnées des lignes `F` et des colonnes `G`, les poids `r` et `c` et les valeurs singulières `s` sont prêts. Rangez dans `inertie_lignes` l'inertie de chaque ligne (un tableau de 7 valeurs : le poids `r[i]` fois le carré de la distance à l'origine, qui est la somme des carrés de ses coordonnées sur tous les axes, `F[i] ** 2`), puis dans `ligne_la_plus_lourde` le nom du parti qui porte la plus grande inertie (un élément de `table.index`).",
      setup: AFC_DECOMPOSEE,
      starter: lines(
        "inertie_lignes = r",
        "ligne_la_plus_lourde = table.index[0]",
      ),
      solution: lines(
        "inertie_lignes = r * (F ** 2).sum(axis=1)",
        "ligne_la_plus_lourde = table.index[int(np.argmax(inertie_lignes))]",
        "print(inertie_lignes.round(4), round(float(inertie_lignes.sum()), 4), ligne_la_plus_lourde)",
      ),
      test: lines(
        "_i = r * (F ** 2).sum(axis=1)",
        "assert np.shape(inertie_lignes) == (7,), \"inertie_lignes doit avoir 7 valeurs, une par parti\"",
        "assert abs(np.sum(inertie_lignes) - 0.5595271179161) < 1e-6, \"la somme des inerties des lignes doit redonner l'inertie totale 0,5595 : poids de la ligne fois somme des carrés de ses coordonnées\"",
        "assert np.allclose(inertie_lignes, _i), \"inertie de la ligne i = r[i] * somme des carrés de F[i] (sur tous les axes)\"",
        "assert ligne_la_plus_lourde == table.index[int(np.argmax(_i))], \"cherchez la ligne dont l'inertie est la plus grande (np.argmax)\"",
      ),
      hint: "(F ** 2).sum(axis=1) additionne les carrés des coordonnées de chaque ligne ; multipliez par r. L'indice du maximum se trouve avec np.argmax.",
    },
    {
      kind: "text",
      md: `### Le même calcul avec des bibliothèques (code à lire)

Les bibliothèques dédiées font ce calcul en une ligne, et ajoutent les contributions, les cos² et le tracé. Le moteur de ce site ne contient ni la bibliothèque Python **prince** ni le paquet R **FactoMineR** : les blocs ci-dessous sont à lire, **non exécutés ici**, et leurs sorties n'ont pas été comparées aux nôtres. On s'attend à retrouver les mêmes valeurs propres et les mêmes coordonnées, à l'orientation et à la présentation près.

\`\`\`python
# Code Python à lire : prince n'est pas disponible dans le moteur de ce site
import prince

ca = prince.CA(n_components=2).fit(table)    # table : le tableau de contingence (DataFrame)
ca.eigenvalues_summary                       # valeurs propres et parts d'inertie
ca.row_coordinates(table)                    # coordonnées des lignes
ca.column_coordinates(table)                 # coordonnées des colonnes
\`\`\`

\`\`\`r
# Code R à lire : FactoMineR n'est pas disponible dans le moteur de ce site
library(FactoMineR)

res <- CA(table, graph = FALSE)   # table : data.frame ou matrice des effectifs
res$eig                           # valeurs propres, parts d'inertie en pourcentage
res$row$coord                     # coordonnées des lignes
res$col$coord                     # coordonnées des colonnes
plot(res)                         # représentation simultanée
\`\`\`

Savoir faire le calcul à la main, comme dans ce module, sert à comprendre ce que ces fonctions renvoient, et à repérer ce qu'elles ne disent pas : elles ne signalent pas un effet Guttman ni les effectifs attendus trop faibles.`,
    },
  ],
  quiz: [
    {
      question: "Que mesure l'inertie totale d'un tableau de contingence, égale au khi-deux divisé par l'effectif total ?",
      options: [
        "Le nombre de personnes qui ne répondent pas",
        "L'intensité de l'écart à l'indépendance, indépendamment de la taille de l'échantillon",
        "La probabilité que les deux variables soient indépendantes",
        "La part de variance conservée par le premier axe",
      ],
      correct: 1,
      explanation: "Le khi-deux grandit avec l'effectif, alors que l'inertie, qui en est le rapport à n, mesure à quel point les profils s'écartent du profil moyen. Ici elle vaut 0,5595, répartie ensuite sur les axes. La part conservée par le premier axe est un rapport de valeurs propres, pas l'inertie totale.",
    },
    {
      question: "Dans l'exemple, les valeurs propres de l'AFC somment 0,5595. Comment obtient-on cette somme ?",
      options: [
        "En additionnant les effectifs de la diagonale du tableau",
        "En additionnant les carrés des valeurs singulières de la matrice des résidus standardisés",
        "En divisant le khi-deux par le nombre de degrés de liberté",
        "En prenant le plus grand écart standardisé",
      ],
      correct: 1,
      explanation: "La somme des carrés des valeurs singulières de S est la somme des carrés de ses éléments, donc l'inertie totale. Diviser le khi-deux par les degrés de liberté (528,194 / 36) donnerait un tout autre nombre, sans lien avec cette décomposition.",
    },
    {
      question: "Sur la représentation simultanée, un parti et une position sont à une courte distance l'un de l'autre. Que peut-on en conclure sans se tromper ?",
      options: [
        "Qu'ils ont exactement le même profil",
        "Que la distance mesurée est la distance du khi-deux entre eux",
        "Rien de précis sur leur distance : on lit leur direction par rapport à l'origine, et leur association, qui est plus marquée que sous l'indépendance quand ils sont du même côté et loin du centre",
        "Que la position est la plus choisie par ce parti, à l'exclusion de toute autre",
      ],
      correct: 2,
      explanation: "Les deux nuages sont dessinés sur les mêmes axes, mais la distance ligne-colonne n'est pas définie : seule la distance entre deux points de la même variable l'est. Le plus prudent est de lire la direction et d'aller vérifier les profils dans le tableau.",
    },
    {
      question: "À quoi reconnaît-on un effet Guttman sur un plan d'AFC ?",
      options: [
        "Les points forment un arc ou un fer à cheval : l'axe 2 est en grande partie une fonction de l'axe 1",
        "Tous les points sont alignés sur l'axe 1",
        "Les points se répartissent en deux groupes bien séparés",
        "Les valeurs propres sont toutes égales",
      ],
      correct: 0,
      explanation: "Avec des modalités ordonnées, l'axe 1 porte l'ordre, et l'axe 2 en reprend une version courbe : extrémités d'un côté, centre de l'autre. Dans l'exemple, une parabole explique 0,799 de la variance de l'axe 2 pour les partis, contre 0,000 pour une droite.",
    },
    {
      question: "Pourquoi le signe d'un axe n'a-t-il pas de sens ?",
      options: [
        "Parce que les coordonnées négatives indiquent des erreurs de calcul",
        "Parce que la décomposition en valeurs singulières définit chaque axe à son signe près : l'inverser ne change aucune distance",
        "Parce que seuls les axes dont la valeur propre est négative sont à retourner",
        "Parce que les valeurs propres changent de signe d'une exécution à l'autre",
      ],
      correct: 1,
      explanation: "Si (u, v) convient, (-u, -v) donne les mêmes résidus reconstitués. Une bibliothèque peut donc renvoyer l'axe dans un sens ou dans l'autre. On oriente à sa convenance (ici, le dernier parti à droite) sans rien changer au contenu de la figure.",
    },
  ],
};
