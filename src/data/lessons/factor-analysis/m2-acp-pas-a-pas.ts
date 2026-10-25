import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { VINS_REDUITS } from "./data";

/** Les étapes du premier exemple, rejouées en coulisses pour les exemples et exercices suivants (n, p, R, valeurs, vecteurs, F) */
const ACP_FAITE = lines(
  VINS_REDUITS,
  "",
  "n, p = Z.shape",
  "R = Z.values.T @ Z.values / n",
  "valeurs, vecteurs = np.linalg.eigh(R)",
  "ordre = np.argsort(valeurs)[::-1]",
  "valeurs, vecteurs = valeurs[ordre], vecteurs[:, ordre]",
  "vecteurs = vecteurs * np.sign(vecteurs[np.abs(vecteurs).argmax(axis=0), np.arange(p)])",
  "F = Z.values @ vecteurs",
);

export const moduleAcpPasAPas: LessonModule = {
  id: "acp-pas-a-pas",
  title: "L'ACP pas à pas en NumPy",
  duration: "2 h",
  summary: "Construire l'analyse en composantes principales avec NumPy seulement : matrice de corrélation, valeurs et vecteurs propres, parts d'inertie, coordonnées des vins. Puis comparer avec scikit-learn, comprendre le facteur n / (n - 1), le signe arbitraire des axes et le choix du nombre d'axes.",
  objectives: [
    "Calculer la matrice de corrélation, ses valeurs propres et ses vecteurs propres avec np.linalg.eigh, triés par ordre décroissant",
    "Calculer la part d'inertie de chaque axe et les coordonnées des individus, et vérifier que la variance d'une coordonnée est la valeur propre",
    "Retrouver les résultats de sklearn.decomposition.PCA, en expliquant le facteur n / (n - 1) et le signe arbitraire des axes",
    "Choisir le nombre d'axes avec l'éboulis, la part cumulée et la règle de Kaiser, en connaissant ses limites",
  ],
  sections: [
    {
      kind: "text",
      md: `### Les quatre étapes

Le module précédent a posé le problème : trouver l'axe sur lequel le nuage réduit garde la plus grande variance, puis, parmi les axes perpendiculaires au premier, celui qui en garde le plus, et ainsi de suite. Ces axes forment une nouvelle base de l'espace. L'analyse en composantes principales (ACP) le fait en quatre étapes.

1. **Centrer et réduire** le tableau : on obtient \`Z\`, de n lignes (les vins) et p colonnes (les mesures).
2. **Calculer la matrice de corrélation** \`R = Z'Z / n\`, symétrique, de taille p sur p.
3. **La diagonaliser** : chercher ses **valeurs propres** λ et ses **vecteurs propres** v, c'est-à-dire les directions v telles que \`R v = λ v\`. Une matrice symétrique a des vecteurs propres perpendiculaires entre eux, et des valeurs propres positives ou nulles. Chaque valeur propre est la variance du nuage projeté sur son vecteur propre.
4. **Projeter** les individus sur ces axes : les **coordonnées** (ou composantes principales) valent \`F = Z V\`, où les colonnes de V sont les vecteurs propres.

Comme les valeurs propres de R ont pour somme la trace de R, c'est-à-dire p, la **part d'inertie** de l'axe k est λ_k / p.`,
    },
    {
      kind: "equation",
      latex: "R = \\dfrac{1}{n} Z^{\\top} Z \\qquad R\\, v_k = \\lambda_k\\, v_k \\qquad F = Z V \\qquad \\text{part}_k = \\dfrac{\\lambda_k}{p}",
      narrow: "R = \\dfrac{1}{n} Z^{\\top} Z \\qquad R\\, v_k = \\lambda_k\\, v_k \\\\ F = Z V \\qquad \\text{part}_k = \\dfrac{\\lambda_k}{p}",
      caption: "Z : données réduites (n vins, p mesures) ; v_k : vecteur propre de longueur 1 ; λ_k : valeur propre ; F : coordonnées des vins sur les axes.",
    },
    {
      kind: "text",
      md: `Pour une matrice symétrique, on utilise \`np.linalg.eigh\` (et non \`eig\`) : elle est faite pour ce cas, renvoie des valeurs propres **réelles** et des vecteurs perpendiculaires. Elle les range par ordre **croissant**, alors que l'ACP les veut par ordre décroissant : il faut donc les retourner. Enfin, un vecteur propre n'est défini qu'au **signe** près (si \`v\` convient, \`-v\` aussi). Pour que les résultats soient reproductibles, on fixe une convention : la composante de plus grande valeur absolue de chaque vecteur est rendue positive.`,
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "n, p = Z.shape",
        "R = Z.values.T @ Z.values / n                     # matrice de corrélation, 13 sur 13",
        "print('R égale la corrélation de pandas :', np.allclose(R, Z.corr()))",
        "",
        "valeurs, vecteurs = np.linalg.eigh(R)             # ordre croissant",
        "print('3 premières valeurs de eigh (croissant) :', valeurs[:3].round(3))",
        "ordre = np.argsort(valeurs)[::-1]                 # on retourne : ordre décroissant",
        "valeurs, vecteurs = valeurs[ordre], vecteurs[:, ordre]",
        "vecteurs = vecteurs * np.sign(vecteurs[np.abs(vecteurs).argmax(axis=0), np.arange(p)])   # convention de signe",
        "",
        "print('R v = lambda v pour les 13 axes :', np.allclose(R @ vecteurs, vecteurs * valeurs))",
        "print('vecteurs perpendiculaires, de longueur 1 :', np.allclose(vecteurs.T @ vecteurs, np.eye(p)))",
        "print('valeurs propres :', valeurs.round(3))",
        "print('somme des valeurs propres :', round(valeurs.sum(), 6))",
        "",
        "parts = valeurs / p",
        "cumul = parts.cumsum()",
        "print('parts d\\'inertie :', parts.round(3))",
        "print('part cumulée sur 2 axes :', round(cumul[1], 3), ' sur 3 axes :', round(cumul[2], 3))",
        "",
        "F = Z.values @ vecteurs                           # coordonnées des 178 vins sur les 13 axes",
        "print('variance des coordonnées (3 premiers axes) :', F.var(axis=0)[:3].round(3))",
        "print('coordonnées non corrélées entre elles :', np.allclose(F.T @ F / n, np.diag(valeurs)))",
      ),
      caption: "Les valeurs propres, en ordre décroissant, commencent par 4,706, 2,497 et 1,446 et finissent à 0,103 ; leur somme vaut 13. Le premier axe conserve donc 0,362 de l'inertie, deux axes 0,554 et trois axes 0,665. La variance des coordonnées sur chaque axe est bien la valeur propre, et les coordonnées sur des axes différents ne sont pas corrélées.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau réduit `Z` est prêt. Calculez la matrice `R = Z'Z / n`, puis ses valeurs propres dans `valeurs` (13 valeurs en ordre **décroissant**) et ses vecteurs propres dans `vecteurs` (une **colonne** par axe, dans le même ordre que les valeurs). Utilisez `np.linalg.eigh`.",
      setup: VINS_REDUITS,
      starter: lines(
        "valeurs = None",
        "vecteurs = None",
      ),
      solution: lines(
        "n = len(Z)",
        "R = Z.values.T @ Z.values / n",
        "valeurs, vecteurs = np.linalg.eigh(R)",
        "ordre = np.argsort(valeurs)[::-1]",
        "valeurs, vecteurs = valeurs[ordre], vecteurs[:, ordre]",
        "print(valeurs[:3].round(3))",
      ),
      test: lines(
        "_R = Z.values.T @ Z.values / len(Z)",
        "assert np.shape(valeurs) == (13,), \"valeurs doit contenir 13 valeurs propres\"",
        "assert np.shape(vecteurs) == (13, 13), \"vecteurs doit être une matrice 13 sur 13, un vecteur propre par colonne\"",
        "assert np.all(np.diff(valeurs) <= 1e-12), \"les valeurs propres doivent être en ordre décroissant : eigh les renvoie en ordre croissant, retournez-les\"",
        "assert abs(np.sum(valeurs) - 13) < 1e-9, \"la somme des valeurs propres d'une matrice de corrélation 13 sur 13 vaut 13\"",
        "assert np.allclose(_R @ vecteurs, vecteurs * valeurs), \"la colonne k de vecteurs doit vérifier R v = valeur_k v : réordonnez aussi les colonnes, pas seulement les valeurs\"",
      ),
      hint: "np.linalg.eigh(R) renvoie (valeurs, vecteurs) en ordre croissant. Avec ordre = np.argsort(valeurs)[::-1], appliquez l'ordre aux valeurs et aux colonnes des vecteurs (vecteurs[:, ordre]).",
    },
    {
      kind: "text",
      md: `### Comparer avec scikit-learn

\`sklearn.decomposition.PCA\` fait ce travail en une ligne. Elle **centre** les données, mais ne les **réduit pas** : on lui donne donc le tableau \`Z\` déjà réduit. Trois différences entre ses résultats et les nôtres méritent d'être comprises.

- **Le facteur n / (n - 1).** \`PCA.explained_variance_\` est calculée avec une variance **non biaisée**, qui divise par n - 1. Nos valeurs propres viennent d'une variance de population, divisée par n. Chaque valeur de scikit-learn vaut donc la nôtre multipliée par n / (n - 1). Les **parts d'inertie** (\`explained_variance_ratio_\`), elles, sont identiques, car le facteur se simplifie.
- **Le signe des axes.** Un vecteur et son opposé sont tous deux des vecteurs propres, avec la même valeur propre. Deux programmes peuvent donc renvoyer des signes opposés pour un même axe, sans que l'un se trompe : retourner un axe revient à regarder le nuage dans un miroir. Il faut vérifier la concordance **au signe près**.
- **L'ordre des axes.** scikit-learn les renvoie directement en ordre décroissant.`,
    },
    {
      kind: "equation",
      latex: "\\lambda_k^{\\text{sklearn}} = \\dfrac{n}{n-1}\\, \\lambda_k",
      caption: "Les valeurs propres de PCA.explained_variance_ sont celles de la corrélation (diviseur n) multipliées par n / (n - 1).",
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "from sklearn.decomposition import PCA",
        "",
        "pca = PCA(n_components=13).fit(Z)                  # Z est déjà réduit : PCA le centre, sans le réduire",
        "print('nos valeurs propres      :', valeurs[:3].round(3))",
        "print('explained_variance_      :', pca.explained_variance_[:3].round(3))",
        "print('rapport entre les deux    :', (pca.explained_variance_ / valeurs)[:3].round(5), ' n/(n-1) =', round(n / (n - 1), 5))",
        "print('parts identiques :', np.allclose(pca.explained_variance_ratio_, valeurs / p))",
        "",
        "G = pca.transform(Z)                                # coordonnées calculées par scikit-learn",
        "print('mêmes coordonnées au signe près :', np.allclose(np.abs(G), np.abs(F)))",
        "print('signe relatif de chacun des 4 premiers axes :', [int(np.sign(G[:, k] @ F[:, k])) for k in range(4)])",
        "",
        "k = 0",
        "print('-v est aussi un vecteur propre :', np.allclose(R @ (-vecteurs[:, k]), valeurs[k] * (-vecteurs[:, k])))",
      ),
      caption: "scikit-learn annonce 4,732, 2,511 et 1,454 pour les trois premiers axes : le rapport avec nos valeurs est 1,00565, soit 178 / 177. Les parts d'inertie et les coordonnées sont identiques. Ici les signes concordent aussi pour les quatre premiers axes, mais rien ne le garantit d'une version de la bibliothèque à l'autre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les variables `n` (nombre de vins), `p`, `R`, `valeurs` et `vecteurs` sont prêtes, `PCA` est importée. Ajustez `pca = PCA(n_components=13).fit(Z)`, rangez dans `facteur` le rapport `pca.explained_variance_[0] / valeurs[0]`, puis dans `corrigees` nos valeurs propres converties à la convention de scikit-learn, de façon que `corrigees` soit égal à `pca.explained_variance_`.",
      setup: lines(ACP_FAITE, "from sklearn.decomposition import PCA"),
      starter: lines(
        "pca = None",
        "facteur = 1.0",
        "corrigees = valeurs",
      ),
      solution: lines(
        "pca = PCA(n_components=13).fit(Z)",
        "facteur = pca.explained_variance_[0] / valeurs[0]",
        "corrigees = valeurs * n / (n - 1)",
        "print(round(facteur, 5))",
      ),
      test: lines(
        "assert isinstance(pca, PCA), \"pca doit être un PCA ajusté avec .fit(Z)\"",
        "assert abs(facteur - n / (n - 1)) < 1e-9, f\"le rapport doit valoir n / (n - 1) = {n / (n - 1):.5f}\"",
        "assert np.allclose(corrigees, pca.explained_variance_), \"corrigees = valeurs * n / (n - 1) doit égaler pca.explained_variance_\"",
      ),
      hint: "scikit-learn divise par n - 1 et nous par n : il suffit de multiplier nos valeurs propres par n / (n - 1).",
    },
    {
      kind: "text",
      md: `### Combien d'axes garder ?

L'ACP produit autant d'axes que de variables (13 ici), mais on n'en garde que quelques-uns. Il n'y a pas de réponse unique ; trois outils éclairent le choix, et c'est leur accord (ou leur désaccord) qui compte.

- **L'éboulis** : un graphique des valeurs propres dans l'ordre. On cherche un **coude**, après lequel les valeurs décroissent lentement, comme les éboulis au pied d'une falaise. Le coude est souvent ambigu.
- **La part cumulée** : on garde assez d'axes pour conserver une part d'inertie jugée suffisante (par exemple 80 %). Le seuil est un choix, pas une loi.
- **La règle de Kaiser** : sur des données réduites, une variable apporte une inertie de 1 ; on garde donc les axes dont la valeur propre dépasse 1, c'est-à-dire ceux qui résument plus qu'une variable seule. Cette règle est commode mais **fragile** : le seuil de 1 est arbitraire, un axe de valeur propre 0,99 est écarté alors qu'il ne diffère presque pas d'un axe de 1,01, et le nombre d'axes retenus dépend du nombre de variables. On l'utilise comme première indication, pas comme décision.

Enfin, l'**interprétabilité** compte autant que les chiffres : un axe qui ne s'explique par aucune variable n'est pas forcément à garder, même si sa valeur propre est grande, et deux axes proches ne se départagent pas toujours par le calcul.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ACP_FAITE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "parts = valeurs / p",
        "cumul = parts.cumsum()",
        "print('axes dont la valeur propre dépasse 1 (Kaiser) :', int((valeurs > 1).sum()))",
        "print('4e et 5e valeurs propres :', valeurs[3:5].round(3))",
        "print('part cumulée sur 2, 3, 5, 6 axes :', cumul[[1, 2, 4, 5]].round(3))",
        "print('axes pour atteindre 80 % :', int(np.argmax(cumul >= 0.8)) + 1)",
        "",
        "axes = np.arange(1, p + 1)",
        "fig, (g, d) = plt.subplots(1, 2, figsize=(9, 3.6))",
        "g.bar(axes, valeurs, color='steelblue')",
        "g.axhline(1, color='crimson', linestyle='--', label='seuil de Kaiser (1)')",
        "g.set_xlabel('axe')",
        "g.set_ylabel('valeur propre')",
        "g.set_title('Éboulis des valeurs propres')",
        "g.legend(fontsize=8)",
        "d.plot(axes, cumul * 100, marker='o')",
        "d.axhline(80, color='gray', linestyle=':')",
        "d.set_xlabel('nombre d\\'axes')",
        "d.set_ylabel('inertie cumulée (%)')",
        "d.set_title('Part cumulée')",
        "plt.tight_layout()",
      ),
      caption: "Trois valeurs propres dépassent 1, donc la règle de Kaiser garde 3 axes ; mais les quatrième et cinquième (0,919 et 0,853) sont juste en dessous du seuil. Les parts cumulées sont 0,554 sur 2 axes, 0,665 sur 3, 0,802 sur 5 et 0,851 sur 6 : atteindre 80 % demande 5 axes. Les deux critères ne s'accordent pas, ce qui est courant : le choix reste un jugement.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les valeurs propres `valeurs` (ordre décroissant) et le nombre de variables `p` sont prêts. Calculez `parts` (la part d'inertie de chaque axe, 13 valeurs), `cumul` (leur somme cumulée) et `k80`, le **plus petit nombre d'axes** dont la part cumulée atteint ou dépasse 0,8.",
      setup: ACP_FAITE,
      starter: lines(
        "parts = None",
        "cumul = None",
        "k80 = 0",
      ),
      solution: lines(
        "parts = valeurs / p",
        "cumul = parts.cumsum()",
        "k80 = int(np.argmax(cumul >= 0.8)) + 1",
        "print(k80, cumul[k80 - 1].round(3))",
      ),
      test: lines(
        "assert np.shape(parts) == (13,), \"parts doit contenir une part d'inertie par axe (13 valeurs)\"",
        "assert abs(np.sum(parts) - 1) < 1e-9, \"les parts d'inertie doivent sommer à 1 : valeurs / p\"",
        "assert np.allclose(parts, valeurs / 13), \"la part de l'axe k est valeurs[k] / p\"",
        "assert np.allclose(cumul, np.cumsum(valeurs / 13)), \"cumul est la somme cumulée des parts : parts.cumsum()\"",
        "_k = int(np.argmax(np.cumsum(valeurs / 13) >= 0.8)) + 1",
        "assert k80 == _k, f\"il faut {_k} axes pour atteindre 80 % ; vous avez {k80} (comptez le nombre d'axes, pas leur position à partir de 0)\"",
      ),
      hint: "np.argmax(cumul >= 0.8) donne la position (à partir de 0) du premier axe qui atteint 0,8 : ajoutez 1 pour obtenir un nombre d'axes.",
    },
    {
      kind: "note",
      tone: "info",
      md: `**D'où vient l'ACP.** La méthode est ancienne : Karl Pearson a décrit en 1901 les droites et plans qui s'ajustent au plus près d'un nuage de points, et Harold Hotelling a formalisé en 1933 les « composantes principales » d'un ensemble de variables. On la rencontre sous des noms variés selon les disciplines. Ce que le calcul a de moderne tient surtout à la facilité d'obtenir les valeurs propres d'une grande matrice.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: `**Ce que l'ACP ne dit pas.** Une part d'inertie élevée ne prouve pas qu'un axe est « important » pour un autre critère que la dispersion : l'ACP ignore le cultivar, elle ne cherche pas à le prédire. Et une valeur propre petite ne signifie pas un axe inutile : il peut contenir un détail qui vous intéresse. Le module suivant apprend à lire les axes un par un.`,
    },
  ],
  quiz: [
    {
      question: "np.linalg.eigh renvoie les valeurs propres de la matrice de corrélation en ordre croissant. Que faut-il faire pour une ACP ?",
      options: [
        "Rien : l'ordre croissant convient",
        "Les trier en ordre décroissant, et réordonner de la même façon les colonnes des vecteurs propres",
        "Trier les valeurs mais laisser les vecteurs dans leur ordre d'origine",
        "Prendre leur valeur absolue",
      ],
      correct: 1,
      explanation: "Le premier axe est celui de la plus grande valeur propre. Valeurs et vecteurs forment des couples : réordonner l'un sans l'autre fausserait l'analyse. Les valeurs sont déjà positives ou nulles pour une matrice de corrélation.",
    },
    {
      question: "PCA(n_components=13).fit(Z).explained_variance_[0] est 1,0057 fois plus grand que la plus grande valeur propre de R = Z'Z / n. Pourquoi ?",
      options: [
        "scikit-learn se trompe",
        "scikit-learn divise par n - 1 au lieu de n, ce qui multiplie les valeurs par n / (n - 1)",
        "scikit-learn ne centre pas les données",
        "scikit-learn trie les axes différemment",
      ],
      correct: 1,
      explanation: "Avec 178 vins, n / (n - 1) vaut 178 / 177, soit environ 1,0057. Les parts d'inertie sont identiques, car le facteur disparaît dans le rapport.",
    },
    {
      question: "Votre premier axe est de signe opposé à celui de scikit-learn, mais les valeurs propres sont identiques. Que conclure ?",
      options: [
        "L'un des deux calculs est faux",
        "Les deux sont valides : un vecteur propre est défini au signe près, et les deux axes décrivent la même direction",
        "Les données ont changé entre les deux calculs",
        "Il faut recommencer avec un autre jeu",
      ],
      correct: 1,
      explanation: "Si v est vecteur propre pour λ, alors -v aussi. Le signe n'a pas de sens propre : on lit les opposés et les proximités, et on s'assure de la cohérence entre les graphiques d'une même analyse.",
    },
    {
      question: "La règle de Kaiser conserve les axes de valeur propre supérieure à 1 sur des données réduites. Quelle est sa principale faiblesse ?",
      options: [
        "Elle est impossible à calculer",
        "Son seuil est arbitraire : un axe de valeur propre 0,99 est écarté alors qu'un axe de 1,01 est gardé",
        "Elle garde toujours un seul axe",
        "Elle ne s'applique qu'aux données non réduites",
      ],
      correct: 1,
      explanation: "Le seuil de 1 est une convention commode (un axe qui résume au moins une variable), pas un test statistique. Il faut la croiser avec l'éboulis, la part cumulée et l'interprétabilité des axes.",
    },
  ],
};
