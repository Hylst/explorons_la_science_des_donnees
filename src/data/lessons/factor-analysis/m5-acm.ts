import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { ANES } from "./data";

/** L'enquête, avec une variable continue (l'âge) découpée en quatre classes, et le tableau disjonctif complet de quatre variables */
const TABLEAU_DISJONCTIF = lines(
  ANES,
  "anes['age_classe'] = pd.cut(anes['age'], [0, 34, 49, 64, 120],",
  "                            labels=['moins de 35 ans', '35 à 49 ans', '50 à 64 ans', '65 ans et plus'])",
  "variables = ['parti', 'position', 'vote', 'age_classe']",
  "Z = pd.get_dummies(anes[variables], prefix_sep=' : ').astype(float)     # une colonne 0/1 par modalité",
);

/** L'ACM comme une AFC du tableau disjonctif : renvoie les valeurs propres, les coordonnées des modalités, Q et J */
const FONCTION_ACM = lines(
  "def acm(Z):",
  "    Zn = Z.to_numpy(dtype=float)",
  "    n, J = Zn.shape                          # n individus, J modalités au total",
  "    Q = int(Zn.sum(axis=1)[0])               # nombre de variables : une modalité par variable et par individu",
  "    P = Zn / (n * Q)                         # proportions : la somme de P vaut 1",
  "    r = P.sum(axis=1)                        # poids des individus : tous égaux à 1 / n",
  "    c = P.sum(axis=0)                        # poids des modalités : effectif / (n Q)",
  "    S = (P - np.outer(r, c)) / np.sqrt(np.outer(r, c))",
  "    U, s, Vt = np.linalg.svd(S, full_matrices=False)",
  "    G = Vt.T / np.sqrt(c)[:, None] * s       # coordonnées des modalités",
  "    return s ** 2, G, Q, J",
);

/** Les quatre variables, l'ACM calculée, et les deux premiers axes orientés (« Dole » à droite, « indépendant » en haut) */
const ACM_CALCULEE = lines(
  TABLEAU_DISJONCTIF,
  FONCTION_ACM,
  "",
  "vp, G, Q, J = acm(Z)",
  "colonnes = list(Z.columns)",
  "for k, repere in enumerate(['vote : Dole', 'parti : indépendant']):     # le signe d'un axe est arbitraire : on l'oriente",
  "    if G[colonnes.index(repere), k] < 0:",
  "        G[:, k] *= -1",
);

export const moduleAcm: LessonModule = {
  id: "acm",
  title: "L'analyse des correspondances multiples (ACM)",
  duration: "2 h 30",
  summary: "Analyser plusieurs variables qualitatives à la fois : tableau disjonctif complet, ACM comme AFC de ce tableau en NumPy, valeurs propres, pourquoi les parts d'inertie brutes sont trop pessimistes et la correction de Benzécri, lecture des coordonnées des modalités.",
  objectives: [
    "Construire le tableau disjonctif complet de plusieurs variables qualitatives avec pd.get_dummies",
    "Obtenir une ACM comme AFC du tableau disjonctif, et retrouver l'inertie totale J / Q - 1",
    "Expliquer pourquoi les parts d'inertie brutes d'une ACM sont pessimistes, et appliquer la correction de Benzécri",
    "Lire les coordonnées des modalités, repérer l'effet des modalités rares et des variables sans lien avec les axes",
  ],
  sections: [
    {
      kind: "text",
      md: `### Plus de deux variables

L'AFC du module précédent croise **deux** variables. Mais une enquête en compte rarement deux : on a le parti, la position, le vote, l'âge, le niveau d'études, et l'on veut les étudier **ensemble**. L'**analyse des correspondances multiples** (ACM) étend l'AFC à \`Q\` variables qualitatives décrivant les mêmes individus. Elle est à l'ACP ce que les variables qualitatives sont aux variables numériques : l'outil pour résumer un questionnaire.

Nous prenons quatre variables de l'enquête ANES de 1996 (944 personnes) : le **parti** (7 modalités), la **position** politique déclarée (7), le **vote** envisagé (Clinton ou Dole, 2 modalités), et l'**âge** découpé en 4 classes (moins de 35 ans, 35 à 49 ans, 50 à 64 ans, 65 ans et plus). Il y a donc \`Q = 4\` variables et \`J = 7 + 7 + 2 + 4 = 20\` modalités. Les données restent décrites, sans jugement sur les partis ni sur les personnes.

### Le tableau disjonctif complet

Le point de départ est un tableau de **0 et de 1**. On crée une colonne par **modalité** (20 colonnes) et une ligne par individu (944 lignes) : la case vaut 1 si la personne présente la modalité, 0 sinon. C'est le **tableau disjonctif complet**, que l'on appelle aussi *one-hot encoding* en apprentissage automatique. Chaque ligne contient exactement \`Q\` uns, un par variable, et la somme d'une colonne est l'effectif de la modalité. En pandas, une seule fonction suffit : \`pd.get_dummies\`.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ANES,
      code: lines(
        "anes['age_classe'] = pd.cut(anes['age'], [0, 34, 49, 64, 120],",
        "                            labels=['moins de 35 ans', '35 à 49 ans', '50 à 64 ans', '65 ans et plus'])",
        "variables = ['parti', 'position', 'vote', 'age_classe']",
        "",
        "Z = pd.get_dummies(anes[variables], prefix_sep=' : ').astype(float)     # une colonne 0/1 par modalité",
        "print('forme de Z :', Z.shape, ' (individus, modalités)')",
        "print('somme de chaque ligne :', Z.sum(axis=1).unique(), ' (une modalité par variable)')",
        "effectifs = Z.sum(axis=0).astype(int)",
        "print('modalités les plus rares :')",
        "print(effectifs.sort_values().head(4).to_string())",
        "print('classes d\\'âge :', effectifs.filter(like='age_classe').to_dict())",
      ),
      caption: "Z a 944 lignes et 20 colonnes, et chaque ligne somme 4, le nombre de variables. Les quatre modalités les plus rares sont « position : très libéral » (16 personnes), « position : très conservateur » (34), « parti : indépendant » (37) et « parti : indépendant proche républicain » (94). Les classes d'âge comptent 237 (moins de 35 ans), 342 (35 à 49 ans), 195 (50 à 64 ans) et 170 personnes (65 ans et plus). Nous retrouverons ces modalités rares : elles posent un problème particulier à l'ACM.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau `anes` est prêt. Construisez dans `Z` le tableau disjonctif complet des trois variables `parti`, `position` et `vote` (`pd.get_dummies`, converti en nombres décimaux avec `.astype(float)`). Il doit avoir 944 lignes et 16 colonnes (7 + 7 + 2).",
      setup: ANES,
      starter: lines(
        "Z = anes[['parti', 'position', 'vote']]",
      ),
      solution: lines(
        "Z = pd.get_dummies(anes[['parti', 'position', 'vote']], prefix_sep=' : ').astype(float)",
        "print(Z.shape, Z.sum(axis=1).unique())",
      ),
      test: lines(
        "assert Z.shape == (944, 16), f\"Z doit avoir 944 lignes et 16 colonnes (7 + 7 + 2 modalités) ; elle a la forme {Z.shape} : utilisez pd.get_dummies\"",
        "_Zn = np.asarray(Z, dtype=float)",
        "assert set(np.unique(_Zn)) <= {0.0, 1.0}, \"Z ne doit contenir que des 0 et des 1\"",
        "assert np.all(_Zn.sum(axis=1) == 3), \"chaque ligne doit contenir exactement 3 uns : une modalité par variable\"",
        "assert _Zn.sum(axis=0).min() >= 16, \"la somme d'une colonne est l'effectif de la modalité : la plus rare, « très libéral », compte 16 personnes\"",
      ),
      hint: "pd.get_dummies(anes[[...]], prefix_sep=' : ') crée une colonne par modalité de chaque variable ; .astype(float) transforme les booléens en 0. et 1.",
    },
    {
      kind: "text",
      md: `### L'ACM est une AFC du tableau disjonctif

C'est le fait central de ce module. L'ACM n'est **pas** une nouvelle méthode : c'est l'AFC du module précédent, appliquée au tableau disjonctif Z comme s'il s'agissait d'un tableau de contingence. On peut donc réutiliser exactement le calcul fait en NumPy : proportions, poids des lignes et des colonnes, résidus standardisés, décomposition en valeurs singulières. Il y a seulement des particularités du tableau.

- Chaque individu pèse **1 / n**, et chaque modalité pèse son effectif divisé par n fois Q.
- L'inertie totale ne dépend que du nombre de modalités et de variables : elle vaut **J / Q - 1**. Ici 20 / 4 - 1 = 4. Aucune donnée n'y intervient.
- Le nombre d'axes non nuls est **J - Q**, soit 16, et la valeur propre **moyenne** vaut 1 / Q, soit 0,25.`,
    },
    {
      kind: "equation",
      latex: String.raw`\Phi^2 = \frac{J}{Q} - 1 \qquad \bar{\lambda} = \frac{1}{Q} \qquad \text{nombre d'axes non nuls} = J - Q`,
      narrow: String.raw`\begin{aligned} \Phi^2 &= \frac{J}{Q} - 1 \\ \bar{\lambda} &= \frac{1}{Q} \\ \text{axes non nuls} &= J - Q \end{aligned}`,
      caption: "Q est le nombre de variables, J le nombre total de modalités. L'inertie totale ne dépend que de J et Q, et la valeur propre moyenne, 1 / Q, sert de seuil dans la correction de Benzécri.",
    },
    {
      kind: "code",
      language: "python",
      setup: TABLEAU_DISJONCTIF,
      code: lines(
        FONCTION_ACM,
        "",
        "vp, G, Q, J = acm(Z)",
        "print('Q =', Q, ' J =', J)",
        "print('inertie totale :', round(vp.sum(), 4), ' J / Q - 1 =', J / Q - 1)",
        "print('axes non nuls :', int((vp > 1e-9).sum()), ' J - Q =', J - Q)",
        "print('valeur propre moyenne des axes non nuls :', round(vp[:J - Q].mean(), 4), ' 1 / Q =', 1 / Q)",
        "print('quatre premières valeurs propres :', vp[:4].round(4))",
        "print('parts d\\'inertie brutes (%) :', (100 * vp / vp.sum())[:4].round(1), ' cumul des 2 premières :', round(100 * vp[:2].sum() / vp.sum(), 1))",
      ),
      caption: "Les valeurs propres somment 4,0 (J / Q - 1) et il y a 16 axes non nuls, de moyenne 0,25. Les quatre premières valent 0,6006, 0,3291, 0,3060 et 0,2781. En parts d'inertie brutes, l'axe 1 ne porte que 15,0 % de l'inertie et l'axe 2 8,2 %, soit 23,2 % pour le plan : à première vue, le plan paraît très pauvre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau disjonctif `Z3` des trois variables `parti`, `position` et `vote` (944 lignes, 16 colonnes) est prêt. Calculez l'ACM comme une AFC de `Z3` : rangez dans `valeurs_propres` les carrés des valeurs singulières de la matrice des résidus standardisés (16 valeurs, de la plus grande à la plus petite), et dans `inertie_totale` leur somme. Elle doit valoir J / Q - 1 avec J = 16 et Q = 3.",
      setup: lines(
        ANES,
        "Z3 = pd.get_dummies(anes[['parti', 'position', 'vote']], prefix_sep=' : ').astype(float)",
      ),
      starter: lines(
        "valeurs_propres = np.zeros(16)",
        "inertie_totale = 0.0",
      ),
      solution: lines(
        "Zn = Z3.to_numpy()",
        "P = Zn / (Zn.shape[0] * 3)                      # 3 variables : chaque ligne de Z3 somme 3",
        "r = P.sum(axis=1)",
        "c = P.sum(axis=0)",
        "S = (P - np.outer(r, c)) / np.sqrt(np.outer(r, c))",
        "valeurs_propres = np.linalg.svd(S, compute_uv=False) ** 2",
        "inertie_totale = valeurs_propres.sum()",
        "print(round(inertie_totale, 4), int((valeurs_propres > 1e-9).sum()), valeurs_propres[:3].round(4))",
      ),
      test: lines(
        "assert np.shape(valeurs_propres) == (16,), \"valeurs_propres doit avoir 16 valeurs, une par modalité (svd renvoie min(n, J) valeurs singulières)\"",
        "assert abs(inertie_totale - (16 / 3 - 1)) < 1e-6, f\"l'inertie totale d'une ACM vaut J / Q - 1 = {16 / 3 - 1:.4f} ; vous avez {inertie_totale:.4f} : les proportions P valent Z3 / (n * Q)\"",
        "assert abs(np.sum(valeurs_propres) - inertie_totale) < 1e-9, \"inertie_totale doit être la somme des valeurs propres\"",
        "assert int((np.asarray(valeurs_propres) > 1e-9).sum()) == 13, \"il y a J - Q = 13 valeurs propres non nulles\"",
        "assert np.all(np.diff(valeurs_propres) <= 1e-12), \"les valeurs propres doivent être rangées de la plus grande à la plus petite : ce que renvoie np.linalg.svd\"",
      ),
      hint: "P = Z3 / (n * Q) ; r et c sont les sommes des lignes et des colonnes de P ; S = (P - r c^T) / sqrt(r c^T) ; les valeurs singulières viennent de np.linalg.svd(S, compute_uv=False).",
    },
    {
      kind: "text",
      md: `### Des parts d'inertie trop pessimistes

Ces 15,0 % et ces 23,2 % sont **décevants**, et ils ne disent pas ce qu'on croit. Dans une ACM, les pourcentages bruts sont presque toujours bas, **même quand les variables sont liées entre elles de façon très forte**. La raison est géométrique : le codage en 0 et 1 crée J - Q axes, dont beaucoup ne portent que de l'« inertie artificielle » due au seul codage, et l'inertie totale (J / Q - 1) croît avec le nombre de modalités, sans lien avec les réponses.

Une expérience le montre. Donnons à l'ACM **deux fois la même variable** : le parti, copié sous un autre nom. Les deux variables sont identiques, l'association est la plus forte possible. Que donnent les parts d'inertie ?`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(TABLEAU_DISJONCTIF, FONCTION_ACM),
      code: lines(
        "doublon = pd.concat([anes['parti'], anes['parti'].rename('parti_bis')], axis=1)",
        "Zd = pd.get_dummies(doublon, prefix_sep=' : ').astype(float)",
        "vd, _, Qd, Jd = acm(Zd)",
        "print('Q =', Qd, ' J =', Jd, ' inertie totale :', round(vd.sum(), 3))",
        "print('valeurs propres :', vd.round(3))",
        "print('part de l\\'axe 1 :', round(100 * vd[0] / vd.sum(), 1), '%')",
        "",
        "# avec deux variables différentes, les valeurs propres de l'ACM sont (1 + sigma) / 2, où sigma est celui de l'AFC",
        "Z2 = pd.get_dummies(anes[['parti', 'position']], prefix_sep=' : ').astype(float)",
        "v2, _, _, _ = acm(Z2)",
        "print('parti et position : première valeur propre de l\\'ACM', round(v2[0], 4), ' = (1 + sigma) / 2 avec sigma =', round(2 * v2[0] - 1, 4))",
      ),
      caption: "Avec deux copies du parti, les valeurs propres sont six valeurs égales à 1 puis des zéros : l'association est parfaite, et pourtant l'axe 1 ne porte que 16,7 % de l'inertie (un sixième). Les parts brutes sont donc un très mauvais thermomètre de la qualité d'une ACM. Dernière ligne : pour parti et position, la première valeur propre de l'ACM est 0,8274, soit (1 + 0,6548) / 2, où 0,6548 est la première valeur singulière de l'AFC du module précédent : les deux méthodes sont reliées.",
    },
    {
      kind: "text",
      md: `### La correction de Benzécri

On corrige ce défaut en ne gardant que les axes qui apportent **plus que la moyenne**, c'est-à-dire les valeurs propres λ supérieures à 1 / Q, puis en recalculant ce qu'elles valent une fois retranché le plancher 1 / Q, et en élevant au carré pour accentuer les écarts. C'est la **correction de Benzécri**. Les parts sont ensuite calculées sur ces valeurs corrigées, retenues seulement. (Greenacre en a proposé une variante qui modifie aussi le dénominateur ; nous nous en tenons à celle-ci.)`,
    },
    {
      kind: "equation",
      latex: String.raw`\lambda_k^{*} = \left[ \frac{Q}{Q-1} \left( \lambda_k - \frac{1}{Q} \right) \right]^2 \quad (\lambda_k > 1/Q) \qquad \tau_k = \frac{\lambda_k^{*}}{\sum_{m} \lambda_m^{*}}`,
      narrow: String.raw`\begin{aligned} \lambda_k^{*} &= \left[ \frac{Q}{Q-1} \left( \lambda_k - \frac{1}{Q} \right) \right]^2 \\ &\text{si } \lambda_k > 1/Q \\ \tau_k &= \frac{\lambda_k^{*}}{\sum_{m} \lambda_m^{*}} \end{aligned}`,
      caption: "λ_k est la k-ième valeur propre de l'ACM, λ_k* sa version corrigée (calculée seulement si λ_k > 1 / Q) et τ_k la part d'inertie corrigée de l'axe k, calculée sur les axes retenus.",
    },
    {
      kind: "code",
      language: "python",
      setup: ACM_CALCULEE,
      code: lines(
        "def benzecri(vp, Q):",
        "    \"\"\"Parts d'inertie corrigées (Benzécri) des axes dont la valeur propre dépasse 1 / Q.\"\"\"",
        "    gardees = vp[vp > 1 / Q]",
        "    corrigees = (Q / (Q - 1) * (gardees - 1 / Q)) ** 2",
        "    return corrigees / corrigees.sum()",
        "",
        "parts = benzecri(vp, Q)",
        "print('axes retenus :', len(parts), 'sur', J - Q)",
        "print('parts corrigées (%) :', (100 * parts).round(1))",
        "print('brutes (%)          :', (100 * vp / vp.sum())[:len(parts)].round(1))",
        "print('cumul des 2 premiers axes corrigés :', round(100 * parts[:2].sum(), 1), '%')",
      ),
      caption: "Huit axes dépassent le seuil 1 / Q = 0,25. Après correction, l'axe 1 porte 91,7 % de l'inertie retenue et l'axe 2 4,7 %, soit 96,3 % pour le plan, contre 15,0 % et 8,2 % en parts brutes. La correction ne change ni les axes ni les coordonnées, seulement la façon de lire leur importance. Elle donne ici un axe 1 écrasant : une dimension suffit à résumer l'essentiel du lien entre les quatre variables, comme on va le voir. Les parts corrigées restent des estimations, qui dépendent du seuil, pas des mesures exactes.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `benzecri(vp, Q)` : elle renvoie les parts d'inertie corrigées (un tableau NumPy de somme 1) des axes dont la valeur propre dépasse `1 / Q`, avec la valeur corrigée `(Q / (Q - 1) * (valeur - 1 / Q)) ** 2`. Puis rangez dans `parts_trois_variables` le résultat pour l'ACM des trois variables `parti`, `position` et `vote` (`vp3` et `Q3` sont prêts).",
      setup: lines(
        ANES,
        "Z3 = pd.get_dummies(anes[['parti', 'position', 'vote']], prefix_sep=' : ').astype(float)",
        "_Zn = Z3.to_numpy()",
        "_P = _Zn / (len(_Zn) * 3)",
        "_r = _P.sum(axis=1)",
        "_c = _P.sum(axis=0)",
        "_S = (_P - np.outer(_r, _c)) / np.sqrt(np.outer(_r, _c))",
        "vp3 = np.linalg.svd(_S, compute_uv=False) ** 2",
        "Q3 = 3",
      ),
      starter: lines(
        "def benzecri(vp, Q):",
        "    return vp / vp.sum()",
        "",
        "parts_trois_variables = benzecri(vp3, Q3)",
      ),
      solution: lines(
        "def benzecri(vp, Q):",
        "    gardees = vp[vp > 1 / Q]",
        "    corrigees = (Q / (Q - 1) * (gardees - 1 / Q)) ** 2",
        "    return corrigees / corrigees.sum()",
        "",
        "parts_trois_variables = benzecri(vp3, Q3)",
        "print(len(parts_trois_variables), (100 * parts_trois_variables).round(1))",
      ),
      test: lines(
        "_t = benzecri(np.array([0.6, 0.3, 0.2, 0.0]), 4)",
        "assert len(_t) == 2, f\"avec Q = 4, le seuil est 0,25 : seules 0,6 et 0,3 le dépassent, il faut 2 parts (vous en avez {len(_t)})\"",
        "_a = (4 / 3 * 0.35) ** 2",
        "_b = (4 / 3 * 0.05) ** 2",
        "assert np.allclose(_t, [_a / (_a + _b), _b / (_a + _b)]), \"valeur corrigée = (Q / (Q - 1) * (valeur - 1 / Q)) ** 2, puis division par la somme des valeurs corrigées\"",
        "_g = vp3[vp3 > 1 / 3]",
        "_c = (3 / 2 * (_g - 1 / 3)) ** 2",
        "assert np.allclose(parts_trois_variables, _c / _c.sum()), \"parts_trois_variables doit être benzecri(vp3, Q3)\"",
        "assert abs(parts_trois_variables.sum() - 1) < 1e-9, \"les parts corrigées somment 1\"",
      ),
      hint: "Gardez d'abord les valeurs propres supérieures à 1 / Q (vp[vp > 1 / Q]), appliquez la formule, puis divisez par la somme.",
    },
    {
      kind: "text",
      md: `### Lire les coordonnées des modalités

Comme en AFC, chaque modalité reçoit une coordonnée sur chaque axe. Deux modalités proches ont des **profils** proches : elles sont choisies par les mêmes personnes. Une modalité proche du **centre** (l'origine) est une modalité qui ne dépend pas de ce que résume l'axe. Une modalité éloignée du centre, du même côté qu'une autre, est souvent choisie avec elle. Les 944 individus sont dans le même espace, mais nous ne lisons ici que les modalités.

Quelques lectures à connaître :

- Deux modalités **d'une même variable** ne sont jamais choisies par la même personne. Leur proximité veut seulement dire que les personnes qui les choisissent répondent de façon semblable aux autres questions.
- Une modalité **rare** a souvent des coordonnées extrêmes, parce que son profil est mesuré sur peu de personnes. Sa **contribution** à l'axe tient compte à la fois de ce poids faible et de cette distance : elle est le bon indicateur de l'influence réelle. Une modalité très rare et très excentrée reste fragile à interpréter, et on la regroupe parfois avec une modalité voisine.
- Une variable dont toutes les modalités sont proches de l'origine **n'est pas liée** à l'axe.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ACM_CALCULEE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "parts = 100 * vp / vp.sum()",
        "styles = {'parti': ('tab:blue', 'o'), 'position': ('tab:orange', '^'), 'vote': ('tab:green', 's'), 'age_classe': ('tab:purple', 'D')}",
        "fig, ax = plt.subplots(figsize=(7.5, 5.8))",
        "ax.axhline(0, color='grey', lw=0.6)",
        "ax.axvline(0, color='grey', lw=0.6)",
        "for variable, (couleur, forme) in styles.items():",
        "    idx = [i for i, nom in enumerate(colonnes) if nom.startswith(variable + ' :')]",
        "    ax.scatter(G[idx, 0], G[idx, 1], color=couleur, marker=forme, s=45, label=variable)",
        "    for i in idx:",
        "        ax.annotate(colonnes[i].split(' : ')[1], (G[i, 0], G[i, 1]), fontsize=6.5, color=couleur, xytext=(3, 3), textcoords='offset points')",
        "ax.set_xlabel(f'axe 1 ({parts[0]:.1f} % brut)')",
        "ax.set_ylabel(f'axe 2 ({parts[1]:.1f} % brut)')",
        "ax.set_xlim(-1.25, 1.6)",
        "ax.legend(fontsize=7.5, loc='upper left')",
        "plt.tight_layout()",
        "",
        "poids = Z.sum(axis=0).to_numpy() / (len(Z) * Q)               # poids de chaque modalité",
        "ctr = pd.DataFrame(100 * poids[:, None] * G[:, :2] ** 2 / vp[:2], index=colonnes, columns=['axe 1', 'axe 2'])",
        "print('contributions (%) aux deux premiers axes, les plus fortes par axe :')",
        "print(ctr['axe 1'].sort_values(ascending=False).head(3).round(1).to_string())",
        "print(ctr['axe 2'].sort_values(ascending=False).head(3).round(1).to_string())",
        "print('par variable (%) :')",
        "print(ctr.groupby([c.split(' : ')[0] for c in ctr.index]).sum().round(1).to_string())",
        "print('très libéral :', ctr.loc['position : très libéral'].round(2).to_dict(), ' coordonnées :', G[colonnes.index('position : très libéral'), :2].round(3))",
      ),
      caption: "L'axe 1 (15,0 % en brut, mais l'essentiel de l'inertie retenue une fois corrigé) range les modalités dans l'ordre : « Clinton », « démocrate convaincu » et « très libéral » à gauche, « Dole », « républicain convaincu » et « conservateur » à droite. L'axe 2 est l'arc de l'effet Guttman vu au module 4 : les modalités extrêmes en bas, les modalités centrales (« modéré », « indépendant ») en haut. Les classes d'âge restent près de l'origine, et pèsent 0,8 % de l'axe 1 et 2,1 % de l'axe 2 : dans cette enquête, l'âge ainsi découpé n'est pas lié à ce que résument ces deux axes. Le vote compte pour 34,6 % de l'axe 1 mais seulement 0,1 % de l'axe 2 ; le parti pour 35,6 % et 47,3 % ; la position pour 29,0 % et 50,4 %. Parmi les modalités, « vote : Dole » (20,2 %), « vote : Clinton » (14,4 %) et « parti : républicain convaincu » (13,6 %) contribuent le plus à l'axe 1. La modalité rare « position : très libéral » (16 personnes) est assez excentrée (coordonnées -1,04 et -0,598), mais ne contribue que pour 0,76 % à l'axe 1 : son poids est faible.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "La figure est un **plan** : il n'en montre que deux dimensions, et la correction de Benzécri dit que la première contient l'essentiel de l'inertie retenue. Il ne faut pas lire à la lettre ce qui est près de l'origine : une modalité proche du centre peut être très bien représentée sur un autre axe. Les individus (les 944 lignes) peuvent eux aussi être projetés ; on les utilise pour repérer des groupes de personnes, le module suivant montre comment classer des individus à partir de leurs coordonnées factorielles (avec l'ACP).",
    },
    {
      kind: "text",
      md: `### Le même calcul avec des bibliothèques (code à lire)

Comme pour l'AFC, les bibliothèques dédiées font le calcul en quelques lignes. Le moteur de ce site n'a **ni prince ni FactoMineR** : ces blocs sont à lire, **non exécutés**, et leurs sorties n'ont pas été comparées aux nôtres. Selon la bibliothèque et la version, les valeurs propres affichées sont les valeurs brutes ou les valeurs corrigées : on vérifie dans la documentation de la version installée ce qui est renvoyé, et l'on applique soi-même la correction de Benzécri au besoin, avec la fonction \`benzecri\` ci-dessus.

\`\`\`python
# Code Python à lire : prince n'est pas disponible dans le moteur de ce site
import prince

qualitatives = anes[['parti', 'position', 'vote', 'age_classe']]
mca = prince.MCA(n_components=5).fit(qualitatives)
mca.eigenvalues_summary                      # valeurs propres et parts d'inertie
mca.column_coordinates(qualitatives)         # coordonnées des modalités
\`\`\`

\`\`\`r
# Code R à lire : FactoMineR n'est pas disponible dans le moteur de ce site
library(FactoMineR)

donnees <- anes[, c("parti", "position", "vote", "age_classe")]   # des facteurs (factor)
res <- MCA(donnees, graph = FALSE)
res$eig                  # valeurs propres, pourcentages
res$var$coord            # coordonnées des modalités
res$var$contrib          # contributions des modalités
plot(res, invisible = "ind")
\`\`\`

Ces fonctions prennent directement les variables d'origine et construisent elles-mêmes le tableau disjonctif. Le calcul fait dans ce module est celui qu'elles font : savoir le refaire à la main aide à lire leurs sorties, et à comprendre pourquoi un pourcentage d'inertie brut de 15 % n'est pas une mauvaise nouvelle.`,
    },
  ],
  quiz: [
    {
      question: "Quel est le lien entre l'ACM et l'AFC ?",
      options: [
        "L'ACM est une AFC appliquée au tableau disjonctif complet des variables qualitatives",
        "L'ACM est une ACP appliquée aux variables numériques centrées et réduites",
        "L'ACM est une AFC dont on a supprimé les valeurs propres inférieures à 1",
        "Il n'y a aucun lien : les deux méthodes ont des calculs différents",
      ],
      correct: 0,
      explanation: "On remplace les variables par leurs modalités en 0 et 1 (tableau disjonctif), puis on applique le calcul de l'AFC sur ce tableau comme s'il s'agissait d'un tableau de contingence. Avec deux variables, on retrouve d'ailleurs le lien (1 + σ) / 2 entre les valeurs propres de l'ACM et les valeurs singulières de l'AFC.",
    },
    {
      question: "Avec Q = 4 variables et J = 20 modalités, que valent l'inertie totale et le nombre d'axes non nuls ?",
      options: [
        "4 et 16",
        "20 et 4",
        "5 et 20",
        "1 et 16",
      ],
      correct: 0,
      explanation: "L'inertie totale vaut J / Q - 1 = 20 / 4 - 1 = 4 et il y a J - Q = 16 axes non nuls. La valeur propre moyenne est 1 / Q = 0,25. Ce sont les nombres obtenus dans l'exemple.",
    },
    {
      question: "L'ACM d'une variable copiée deux fois (association parfaite) donne 16,7 % d'inertie à l'axe 1. Qu'en conclure ?",
      options: [
        "Que la copie est mal faite",
        "Que les parts d'inertie brutes d'une ACM sont naturellement basses, même pour une association parfaite : on ne les lit pas comme celles d'une ACP",
        "Que l'axe 1 ne capte qu'un sixième de l'information réelle",
        "Que l'ACM ne fonctionne pas avec des variables qualitatives liées",
      ],
      correct: 1,
      explanation: "Avec deux copies de 7 modalités, il y a six valeurs propres égales à 1, donc un sixième de l'inertie pour chaque axe, alors que le lien est maximal. D'où la correction de Benzécri, qui ne compare que les axes au-dessus de la moyenne 1 / Q.",
    },
    {
      question: "Que fait la correction de Benzécri ?",
      options: [
        "Elle change les coordonnées des modalités pour les rapprocher du centre",
        "Elle ne garde que les valeurs propres supérieures à 1 / Q et recalcule des parts d'inertie sur des valeurs corrigées, sans modifier les axes ni les coordonnées",
        "Elle ajoute des individus supplémentaires",
        "Elle retire les modalités rares",
      ],
      correct: 1,
      explanation: "La correction ne change que la lecture de l'importance des axes : (Q / (Q - 1) × (λ - 1 / Q))² pour chaque valeur propre λ > 1 / Q. Dans l'exemple, l'axe 1 passe de 15,0 % à 91,7 %.",
    },
    {
      question: "Les quatre classes d'âge sont proches de l'origine sur le plan des axes 1 et 2. Comment le lire ?",
      options: [
        "L'âge est la variable la plus importante",
        "Ces modalités ne sont pas liées à ce que résument ces deux axes : leur contribution y est faible",
        "Les classes d'âge sont mal construites",
        "L'âge est lié au vote à 100 %",
      ],
      correct: 1,
      explanation: "Une modalité près de l'origine a un profil proche du profil moyen sur ces axes. Ici, l'âge pèse 0,8 % de l'axe 1 et 2,1 % de l'axe 2. Cela ne prouve pas l'absence de tout lien dans le reste des données, seulement sur ce plan.",
    },
  ],
};
