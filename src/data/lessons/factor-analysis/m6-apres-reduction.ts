import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { VINS, VINS_REDUITS } from "./data";

/** Les vins, découpés une fois pour toutes : 124 pour apprendre, 54 pour évaluer (mêmes proportions de cultivars) */
const VINS_DECOUPES = lines(
  VINS,
  "from sklearn.model_selection import train_test_split",
  "X_train, X_test, y_train, y_test = train_test_split(X, cultivar, test_size=0.3, stratify=cultivar, random_state=0)",
);

export const moduleApresReduction: LessonModule = {
  id: "apres-reduction",
  title: "Après la réduction : classer, prédire, choisir",
  duration: "2 h 30",
  summary: "Que faire des coordonnées factorielles : classification de type KMeans sur les premiers axes, ACP dans un Pipeline ajustée sur l'apprentissage seulement, effet sur un modèle, différence avec FactorAnalysis, méthodes non linéaires (t-SNE, UMAP) et choix entre ACP, AFC et ACM.",
  objectives: [
    "Classer des individus avec KMeans sur leurs premiers axes factoriels et comparer le résultat à une partition connue avec adjusted_rand_score",
    "Placer une ACP dans un Pipeline scikit-learn et l'ajuster sur l'apprentissage seulement, pour éviter la fuite de données",
    "Mesurer, plutôt que supposer, ce qu'apporte une ACP placée avant un modèle",
    "Distinguer l'ACP de sklearn.decomposition.FactorAnalysis (modèle à facteurs latents) et situer t-SNE et UMAP",
    "Choisir entre ACP, AFC et ACM selon la nature des données",
  ],
  sections: [
    {
      kind: "text",
      md: `### Les axes ne sont pas une fin en soi

Les modules précédents ont fabriqué des **coordonnées factorielles** : pour chaque individu, quelques nombres qui résument sa position sur les premiers axes. Ces nombres servent à regarder (les figures), mais aussi à **calculer** : on peut les donner à un algorithme de classification, ou à un modèle de prédiction. Ce module regarde ces usages, avec leurs pièges, sur les 178 vins italiens de trois cultivars du module 2 (13 mesures chimiques). Le cultivar n'est jamais donné aux méthodes non supervisées : il sert seulement, à la fin, à vérifier ce qu'elles ont trouvé.

### Classer sur les coordonnées factorielles

L'idée est ancienne en analyse des données : au lieu de classer les individus dans l'espace des 13 mesures, on les classe dans l'espace des **premiers axes** de l'ACP. Deux raisons. Les axes de rang élevé portent souvent surtout du bruit, et les ignorer **stabilise** la classification. Et une classification en 2 ou 3 dimensions se dessine.

Ici, l'algorithme est **KMeans** : il cherche \`k\` groupes en minimisant la distance de chaque point au centre de son groupe. Pour comparer la partition trouvée au cultivar connu, on utilise l'**indice de Rand ajusté** (\`adjusted_rand_score\`) : il vaut 1 si les deux partitions sont identiques, et il est proche de 0 pour deux partitions sans rapport, quels que soient les numéros donnés aux groupes. Un point d'attention : les mesures sont d'abord **centrées et réduites** (module 2), sinon la mesure aux plus grandes valeurs, la proline, écrase toutes les autres.`,
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.decomposition import PCA",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "acp = PCA().fit(Z)                                       # Z : les 13 mesures centrées et réduites",
        "scores = acp.transform(Z)                                # coordonnées des 178 vins sur les 13 axes",
        "print('parts de variance :', (100 * acp.explained_variance_ratio_[:5]).round(1), ' cumul des 2 premiers :', round(100 * acp.explained_variance_ratio_[:2].sum(), 1))",
        "",
        "for k in [2, 3, 5, 13]:",
        "    groupes = KMeans(n_clusters=3, n_init=10, random_state=0).fit(scores[:, :k]).labels_",
        "    print(f'{k:2d} axes : indice de Rand ajusté', round(adjusted_rand_score(cultivar, groupes), 3), ' tailles des groupes', np.bincount(groupes))",
        "",
        "brut = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X).labels_      # sans réduire les mesures",
        "print('mesures brutes, non réduites :', round(adjusted_rand_score(cultivar, brut), 3))",
        "",
        "deux_axes = KMeans(n_clusters=3, n_init=10, random_state=0).fit(scores[:, :2]).labels_",
        "print(pd.crosstab(cultivar, deux_axes, rownames=['cultivar'], colnames=['groupe']).to_string())",
      ),
      caption: "Les deux premiers axes retiennent 36,2 % et 19,2 % de la variance (55,4 % ensemble). KMeans sur ces deux axes retrouve les cultivars avec un indice de Rand ajusté de 0,895 ; il passe à 0,897 avec 3 axes, avec 5 axes et avec les 13 axes : ajouter des axes n'améliore presque rien. Sans centrer ni réduire les mesures (la proline domine), l'indice tombe à 0,371. Le tableau croisé avec 2 axes montre 6 vins sur 178 hors de leur groupe principal : 5 vins du cultivar 1 rangés avec le cultivar 0, et 1 rangé avec le cultivar 2.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un indice de 0,895 ne dit pas que KMeans a « compris » les cultivars. Il dit que, sur ces 178 vins, les trois groupes de la classification sont très proches de la répartition connue. Ici les cultivars se séparent bien par la chimie ; avec d'autres données, une partition connue peut n'avoir aucun lien avec la géométrie du nuage, et le même algorithme ne la retrouvera pas. Le nombre de groupes (3) a été fixé à l'avance parce que l'on connaît les cultivars : en pratique, on le choisit avec d'autres critères, et il est discutable.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau `Z` des mesures centrées et réduites et le vecteur `cultivar` sont prêts. Calculez l'ACP complète de `Z` (`PCA()`), puis appliquez `KMeans(n_clusters=3, n_init=10, random_state=0)` aux **3 premiers axes** seulement. Rangez dans `groupes` les numéros de groupe et dans `ari` l'indice de Rand ajusté entre `cultivar` et `groupes`.",
      setup: VINS_REDUITS,
      starter: lines(
        "groupes = np.zeros(len(Z), dtype=int)",
        "ari = 0.0",
      ),
      solution: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.decomposition import PCA",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "scores = PCA().fit_transform(Z)",
        "groupes = KMeans(n_clusters=3, n_init=10, random_state=0).fit(scores[:, :3]).labels_",
        "ari = adjusted_rand_score(cultivar, groupes)",
        "print(round(ari, 3), np.bincount(groupes))",
      ),
      test: lines(
        "from sklearn.cluster import KMeans as _KM",
        "from sklearn.decomposition import PCA as _PCA",
        "from sklearn.metrics import adjusted_rand_score as _ari",
        "_s = _PCA().fit_transform(Z)",
        "_g = _KM(n_clusters=3, n_init=10, random_state=0).fit(_s[:, :3]).labels_",
        "assert len(groupes) == 178, \"groupes doit contenir un numéro de groupe par vin (178)\"",
        "assert len(set(np.asarray(groupes).tolist())) == 3, \"il doit y avoir 3 groupes\"",
        "assert abs(ari - _ari(cultivar, _g)) < 1e-9, f\"l'indice attendu est {_ari(cultivar, _g):.3f} : KMeans sur les 3 premiers axes de l'ACP de Z (scores[:, :3]), avec random_state=0 et n_init=10\"",
        "assert abs(ari - _ari(cultivar, groupes)) < 1e-9, \"ari doit être adjusted_rand_score(cultivar, groupes)\"",
      ),
      hint: "scores = PCA().fit_transform(Z) donne les coordonnées ; scores[:, :3] garde les 3 premiers axes. adjusted_rand_score(vrais, trouvés) compare deux partitions.",
    },
    {
      kind: "text",
      md: `### L'ACP dans un Pipeline : l'ajuster sur l'apprentissage seulement

Quand l'ACP précède un **modèle de prédiction**, un piège guette : la **fuite de données** (*data leakage*). L'ACP calcule une moyenne et des axes à partir des données. Si on l'ajuste sur **toutes** les données, avant de les séparer en apprentissage et test, les axes ont été calculés avec les individus de test : l'information de ces individus a traversé la frontière. Le score mesuré sur le test devient trop flatteur, d'une quantité qu'on ne sait pas chiffrer à l'avance.

La bonne pratique tient en une règle : **tout ce qui s'ajuste sur les données (la standardisation, l'ACP, le modèle) s'ajuste sur l'apprentissage seulement**, puis s'applique tel quel au test. Un \`Pipeline\` de scikit-learn l'assure sans effort : \`fit\` ajuste chaque étape sur l'apprentissage, \`predict\` et \`score\` appliquent aux nouvelles données les transformations apprises. Et dans la validation croisée, le Pipeline est réajusté à chaque découpage.`,
    },
    {
      kind: "code",
      language: "python",
      setup: VINS,
      code: lines(
        "from sklearn.decomposition import PCA",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "",
        "def pipeline(axes):",
        "    etapes = [StandardScaler()] + ([PCA(n_components=axes)] if axes else []) + [LogisticRegression(max_iter=1000)]",
        "    return make_pipeline(*etapes)",
        "",
        "for axes in [None, 2, 3, 5, 8]:",
        "    notes = cross_val_score(pipeline(axes), X, cultivar, cv=cv)      # standardisation et ACP réajustées à chaque découpage",
        "    nom = 'les 13 mesures' if axes is None else f'ACP à {axes} axes'",
        "    print(f'{nom:15s} réussite moyenne', round(notes.mean(), 3))",
        "",
        "# à ne pas faire : ajuster la standardisation et l'ACP sur tous les vins avant la validation croisée",
        "for axes in [2, 5]:",
        "    tout = PCA(n_components=axes).fit_transform(StandardScaler().fit_transform(X))",
        "    notes = cross_val_score(LogisticRegression(max_iter=1000), tout, cultivar, cv=cv)",
        "    print(f'avec fuite, {axes} axes :', round(notes.mean(), 3))",
      ),
      caption: "Sur les 178 vins, la régression logistique réussit en moyenne 0,983 avec les 13 mesures standardisées, 0,961 après une ACP à 2 axes, 0,966 à 3 axes, 0,978 à 5 axes et 0,972 à 8 axes (validation croisée à 5 découpages, un seul tirage). L'ACP ne **gagne** donc rien ici : la logistique gère déjà bien 13 mesures, et réduire ne fait que perdre un peu d'information. Avec la fuite, on obtient 0,961 (2 axes) et 0,983 (5 axes), à comparer à 0,961 et 0,978 sans fuite : l'écart est de 0 à 0,5 point, noyé dans le bruit d'un seul tirage. Ce n'est pas une raison de négliger la règle : l'ACP est ici non supervisée et le jeu petit, la fuite est donc faible, mais le pipeline coûte une ligne.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Une ACP placée avant un modèle **n'améliore pas** la prédiction par principe. Elle est utile quand il y a beaucoup de variables très corrélées, quand le modèle supporte mal la colinéarité ou la grande dimension, quand on veut accélérer le calcul ou dessiner les données. Elle n'est pas utile quand le modèle gère bien les variables d'origine, comme ici. Le seul moyen de le savoir est de **mesurer**, avec une validation croisée, comme ci-dessus, et sur plusieurs tirages si l'on veut juger de petits écarts.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les vins sont découpés en `X_train`, `X_test`, `y_train`, `y_test` (124 vins pour apprendre, 54 pour évaluer). Construisez dans `pipeline` un `make_pipeline` à trois étapes dans l'ordre : `StandardScaler()`, `PCA(n_components=3)`, `LogisticRegression(max_iter=1000)`, **ajusté sur l'apprentissage seulement**. Rangez dans `precision` sa réussite sur `X_test`.",
      setup: VINS_DECOUPES,
      starter: lines(
        "pipeline = None",
        "precision = 0.0",
      ),
      solution: lines(
        "from sklearn.decomposition import PCA",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "pipeline = make_pipeline(StandardScaler(), PCA(n_components=3), LogisticRegression(max_iter=1000))",
        "pipeline.fit(X_train, y_train)",
        "precision = pipeline.score(X_test, y_test)",
        "print(round(precision, 3), pipeline.named_steps['pca'].explained_variance_ratio_.round(3))",
      ),
      test: lines(
        "from sklearn.pipeline import Pipeline as _Pipe",
        "assert isinstance(pipeline, _Pipe), \"pipeline doit être un Pipeline (make_pipeline)\"",
        "assert [type(e).__name__ for _, e in pipeline.steps] == ['StandardScaler', 'PCA', 'LogisticRegression'], \"les étapes, dans l'ordre : StandardScaler, PCA, LogisticRegression\"",
        "assert pipeline.named_steps['pca'].n_components == 3, \"l'ACP doit garder 3 axes\"",
        "assert np.allclose(pipeline[0].mean_, X_train.mean(axis=0)), \"fuite de données : la standardisation doit être ajustée sur X_train seulement (pipeline.fit(X_train, y_train)), pas sur tous les vins\"",
        "assert abs(precision - pipeline.score(X_test, y_test)) < 1e-9, \"precision doit être pipeline.score(X_test, y_test)\"",
        "assert precision > 0.85, \"la réussite attendue est bien supérieure à 0,85 : le pipeline est-il ajusté ?\"",
      ),
      hint: "make_pipeline(StandardScaler(), PCA(n_components=3), LogisticRegression(max_iter=1000)) ; puis .fit(X_train, y_train) et .score(X_test, y_test).",
    },
    {
      kind: "text",
      md: `### ACP et FactorAnalysis : deux idées différentes

Un piège de vocabulaire. En français, l'**analyse factorielle** désigne toute la famille des méthodes de ce cours (ACP, AFC, ACM) : des méthodes **géométriques**, qui cherchent les meilleurs axes de projection d'un nuage de points. En anglais, la *factor analysis* est autre chose : un **modèle statistique**. Elle suppose que les variables observées sont produites par un petit nombre de **facteurs latents** (non observés), plus un **bruit propre à chaque variable**. C'est la classe \`sklearn.decomposition.FactorAnalysis\`, à ne pas confondre avec l'analyse factorielle au sens français.

La différence se lit dans l'équation. L'ACP décompose la variance **totale** des variables. La *factor analysis* modélise la partie **commune** aux variables (portée par les facteurs) et sépare une variance **spécifique** à chacune, le bruit, qu'elle estime : \`noise_variance_\`. C'est un modèle avec une hypothèse à discuter, utilisé en psychométrie et en sciences sociales (par exemple pour des questionnaires), là où l'on veut interpréter les facteurs comme des causes communes cachées.`,
    },
    {
      kind: "equation",
      latex: String.raw`x = \mu + \Lambda f + \varepsilon \qquad \operatorname{Cov}(\varepsilon) = \Psi \ \text{(diagonale)}`,
      narrow: String.raw`\begin{aligned} x &= \mu + \Lambda f + \varepsilon \\ \operatorname{Cov}(\varepsilon) &= \Psi \ \text{(diagonale)} \end{aligned}`,
      caption: "Modèle à facteurs latents : x est le vecteur des variables observées, f les quelques facteurs latents, Λ la matrice des charges, ε le bruit propre à chaque variable, de variances Ψ (une par variable). L'ACP n'a pas de terme Ψ : elle ne sépare pas de variance spécifique.",
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "from sklearn.decomposition import PCA, FactorAnalysis",
        "",
        "fa = FactorAnalysis(n_components=2, random_state=0).fit(Z)",
        "bruit = pd.Series(fa.noise_variance_, index=Z.columns)      # variance spécifique de chaque mesure",
        "print('variance spécifique estimée (0 : toute la variance est commune ; 1 : aucune) :')",
        "print(bruit.round(2).sort_values().to_string())",
        "",
        "acp = PCA(n_components=2).fit(Z)",
        "for k in range(2):",
        "    corr = abs(np.corrcoef(fa.transform(Z)[:, k], acp.transform(Z)[:, k])[0, 1])",
        "    print('facteur', k + 1, ': corrélation absolue avec l\\'axe', k + 1, 'de l\\'ACP :', round(corr, 2))",
      ),
      caption: "Les variances spécifiques vont de 0,08 (flavonoïdes, presque entièrement expliqués par les facteurs communs) à 0,89 (cendres) : la factor analysis juge que les mesures ne sont pas toutes aussi liées au reste (les cendres, le magnésium et l'alcalinité des cendres le sont peu). L'ACP, qui ne sépare pas de bruit, n'a pas ce diagnostic. Sur ces données très structurées, les deux premiers facteurs ressemblent beaucoup aux deux premiers axes (corrélations absolues de 0,97 et 0,95) : les deux méthodes ne donnent pas toujours des résultats proches, et le modèle à facteurs a des rotations (varimax, par exemple) que l'ACP n'a pas.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajustez un `FactorAnalysis(n_components=2, random_state=0)` sur `Z`. Rangez dans `bruit` ses variances spécifiques (`noise_variance_`, 13 valeurs) et dans `variable_la_plus_bruitee` le **nom** de la mesure dont la variance spécifique est la plus grande (un nom de colonne de `Z`).",
      setup: VINS_REDUITS,
      starter: lines(
        "bruit = np.zeros(13)",
        "variable_la_plus_bruitee = ''",
      ),
      solution: lines(
        "from sklearn.decomposition import FactorAnalysis",
        "",
        "fa = FactorAnalysis(n_components=2, random_state=0).fit(Z)",
        "bruit = fa.noise_variance_",
        "variable_la_plus_bruitee = Z.columns[int(np.argmax(bruit))]",
        "print(variable_la_plus_bruitee, round(float(bruit.max()), 2))",
      ),
      test: lines(
        "from sklearn.decomposition import FactorAnalysis as _FA",
        "_b = _FA(n_components=2, random_state=0).fit(Z).noise_variance_",
        "assert np.shape(bruit) == (13,), \"bruit doit avoir 13 valeurs, une par mesure : fa.noise_variance_\"",
        "assert np.allclose(bruit, _b, atol=1e-6), \"bruit doit être noise_variance_ d'un FactorAnalysis à 2 facteurs ajusté sur Z (random_state=0)\"",
        "assert variable_la_plus_bruitee == Z.columns[int(np.argmax(_b))], \"cherchez le nom de la colonne dont la variance spécifique est maximale : Z.columns[np.argmax(bruit)]\"",
      ),
      hint: "fa.noise_variance_ est un tableau dans l'ordre des colonnes de Z : Z.columns[np.argmax(bruit)] donne le nom de la plus grande.",
    },
    {
      kind: "text",
      md: `### Au-delà du linéaire : t-SNE et UMAP

L'ACP, l'AFC et l'ACM sont des projections **linéaires** : elles cherchent un plan dans l'espace des données. Si les données sont posées sur une forme courbe ou repliée, une projection linéaire l'écrase. Des méthodes **non linéaires** de plongement en deux dimensions cherchent à conserver les **voisinages**.

- **t-SNE** (\`sklearn.manifold.TSNE\`) place les points de façon que les voisins proches le restent. Il dépend d'un hasard (\`random_state\`) et d'un réglage, la **perplexité**, qui fixe la taille du voisinage. Ses distances globales et la taille des amas ne se lisent pas : seule la proximité locale compte, et les axes n'ont aucune signification. Un nuage t-SNE se regarde, il ne se mesure pas.
- **UMAP** poursuit le même but plus vite sur de grands jeux, avec d'autres hypothèses. Sa bibliothèque (\`umap-learn\`) n'est pas dans le moteur de ce site : le code est à lire.

Pour juger ce qu'un plan conserve des voisinages, scikit-learn fournit \`trustworthiness\` : une valeur entre 0 et 1, d'autant plus haute que les voisins du plan étaient déjà voisins dans l'espace d'origine.`,
    },
    {
      kind: "code",
      language: "python",
      setup: VINS_REDUITS,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.cluster import KMeans",
        "from sklearn.decomposition import PCA",
        "from sklearn.manifold import TSNE, trustworthiness",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "plan_acp = PCA(n_components=2).fit_transform(Z)",
        "plan_tsne = TSNE(n_components=2, perplexity=30, init='pca', random_state=0).fit_transform(Z.to_numpy())",
        "",
        "for nom, plan in [('ACP', plan_acp), ('t-SNE', plan_tsne)]:",
        "    groupes = KMeans(n_clusters=3, n_init=10, random_state=0).fit(plan).labels_",
        "    fidelite = trustworthiness(Z.to_numpy(), plan, n_neighbors=10)",
        "    print(f'{nom:6s} fidélité des voisinages {fidelite:.3f}   indice de Rand ajusté des 3 groupes {adjusted_rand_score(cultivar, groupes):.3f}')",
        "",
        "for perplexite in [5, 60]:                      # le réglage change-t-il le plan ?",
        "    autre = TSNE(n_components=2, perplexity=perplexite, init='pca', random_state=0).fit_transform(Z.to_numpy())",
        "    print('perplexité', perplexite, ': fidélité', round(trustworthiness(Z.to_numpy(), autre, n_neighbors=10), 3))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(8, 3.6))",
        "for ax, (nom, plan) in zip(axes, [('ACP', plan_acp), ('t-SNE', plan_tsne)]):",
        "    ax.scatter(plan[:, 0], plan[:, 1], c=cultivar, cmap='viridis', s=14)",
        "    ax.set_title(nom)",
        "plt.tight_layout()",
      ),
      caption: "Sur les 178 vins, la fidélité des 10 plus proches voisins est de 0,956 pour t-SNE (perplexité 30) contre 0,888 pour le plan de l'ACP : t-SNE respecte mieux les voisinages. Mais KMeans sur le plan t-SNE retrouve un peu moins bien les cultivars (0,835 contre 0,895), car les amas de t-SNE ont des tailles et des distances qui ne veulent rien dire pour KMeans. Avec d'autres perplexités (5, 30, 60), la fidélité reste entre 0,942 et 0,956 : le résultat est stable ici, ce qui n'est pas garanti sur d'autres données.",
    },
    {
      kind: "text",
      md: `Le code UMAP, à lire, ne s'exécute pas ici :

\`\`\`python
# Code Python à lire : umap-learn n'est pas disponible dans le moteur de ce site
import umap

plan = umap.UMAP(n_components=2, n_neighbors=15, random_state=0).fit_transform(Z)
\`\`\`

Comme t-SNE, UMAP sert surtout à **explorer** et à **dessiner**. Pour classer ou prédire, on préfère garder des axes interprétables ou travailler dans l'espace d'origine, et l'on évite de tirer des conclusions de la forme d'un amas ou de l'écart entre deux amas.`,
    },
    {
      kind: "text",
      md: `### Choisir entre ACP, AFC et ACM

Le choix se fait d'abord sur la **nature des données**, et le tableau de départ dit presque toujours quelle méthode utiliser.

- Des **variables quantitatives** (mesures, montants, notes) sur des individus : **ACP**. On centre, on réduit si les unités diffèrent, et l'on lit le cercle des corrélations et le nuage des individus (modules 2 et 3).
- Un **tableau de contingence**, croisement de **deux** variables qualitatives (parti et position, métier et région) : **AFC**. On compare des profils, et l'on se méfie de la lecture des distances entre lignes et colonnes (module 4).
- **Plusieurs variables qualitatives** décrivant les mêmes individus (un questionnaire) : **ACM**, avec la correction de Benzécri pour lire les parts d'inertie (module 5).
- Un **mélange** de variables quantitatives et qualitatives : on peut découper les quantitatives en classes pour passer en ACM (comme l'âge du module 5), ou utiliser des variantes dédiées, qui ne sont pas vues ici.
- Un **modèle à facteurs latents** que l'on veut estimer : *factor analysis*, avec ses hypothèses.
- Un **dessin** de voisinages sans interprétation des axes : t-SNE ou UMAP.

Et quelques réflexes valables pour toutes : regarder les valeurs propres avant les nuages, regarder les contributions et les cos² avant de nommer un axe, signaler qu'une partie de l'inertie n'est pas représentée, et garder en tête que ces méthodes **décrivent** les données, elles ne démontrent aucun lien causal.

### Les mêmes méthodes avec des bibliothèques (code à lire)

Le moteur de ce site n'a ni **prince** ni **FactoMineR** : les blocs suivants sont à lire, **non exécutés**, et leurs sorties n'ont pas été comparées aux nôtres.

\`\`\`python
# Code Python à lire : prince n'est pas disponible dans le moteur de ce site
import prince

acp = prince.PCA(n_components=2).fit(X)       # X : les mesures (DataFrame)
acp.eigenvalues_summary                       # valeurs propres, parts de variance
acp.row_coordinates(X)                        # coordonnées des individus

ca = prince.CA(n_components=2).fit(table)     # table : tableau de contingence
ca.row_coordinates(table)
ca.column_coordinates(table)
\`\`\`

\`\`\`r
# Code R à lire : FactoMineR n'est pas disponible dans le moteur de ce site
library(FactoMineR)

res_acp <- PCA(vins[, 1:13], scale.unit = TRUE, graph = FALSE)   # réduit les variables
res_acp$eig                    # valeurs propres
res_acp$ind$coord              # coordonnées des individus
res_acp$var$cor                # corrélations des variables avec les axes

res_afc <- CA(table, graph = FALSE)
res_afc$row$coord
\`\`\`

Ces fonctions renvoient, sous d'autres noms, les objets calculés dans ce cours : valeurs propres, coordonnées, contributions. Savoir les retrouver à la main est ce qui permet de lire leurs sorties sans les croire sur parole.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi centre-t-on et réduit-on les 13 mesures chimiques avant de faire un KMeans ou une ACP ?",
      options: [
        "Parce que KMeans refuse les nombres positifs",
        "Parce que les mesures ont des unités et des ordres de grandeur très différents : sans cela, celle aux plus grandes valeurs domine la distance",
        "Parce que cela augmente toujours l'indice de Rand ajusté",
        "Parce que cela supprime les valeurs aberrantes",
      ],
      correct: 1,
      explanation: "KMeans et l'ACP reposent sur des distances et des variances. Sur les vins, sans réduire les mesures, l'indice de Rand ajusté tombe à 0,371 (la proline écrase les autres) contre 0,897 avec des mesures réduites.",
    },
    {
      question: "À quoi sert l'indice de Rand ajusté (adjusted_rand_score) ?",
      options: [
        "À mesurer la part de variance conservée par les axes",
        "À comparer deux partitions : il vaut 1 si elles sont identiques et vaut environ 0 si elles n'ont aucun rapport, quels que soient les numéros des groupes",
        "À choisir le nombre de groupes de KMeans",
        "À calculer l'inertie d'un groupe",
      ],
      correct: 1,
      explanation: "On l'utilise ici pour comparer les groupes trouvés par KMeans aux cultivars. Les numéros de groupes n'ont pas de sens (0, 1, 2 peuvent être permutés) et l'indice n'en dépend pas.",
    },
    {
      question: "Pourquoi une ACP placée avant un modèle doit-elle être ajustée sur l'apprentissage seulement ?",
      options: [
        "Parce que l'ACP est plus rapide sur peu de données",
        "Parce que l'ajuster sur toutes les données ferait entrer l'information du test dans les axes (fuite de données), et rendrait le score sur le test trop favorable",
        "Parce que le test ne contient pas assez de variables",
        "Parce que scikit-learn l'impose, sans explication",
      ],
      correct: 1,
      explanation: "Les axes et la moyenne se calculent sur des données : s'ils sont calculés avec les individus du test, ceux-ci ne sont plus vraiment nouveaux. Un Pipeline évite l'erreur : fit n'utilise que l'apprentissage, et le test traverse seulement les transformations apprises.",
    },
    {
      question: "Sur les 178 vins, une ACP à 2 axes avant une régression logistique donne 0,961 de réussite moyenne, contre 0,983 avec les 13 mesures. Que peut-on en conclure ?",
      options: [
        "Que l'ACP améliore toujours les modèles",
        "Que l'ACP à 2 axes fait perdre un peu d'information ici : la logistique gère déjà bien 13 mesures, et seule une mesure comparée permet de savoir si réduire aide",
        "Que la logistique est un mauvais modèle",
        "Que l'ACP est une erreur de méthode",
      ],
      correct: 1,
      explanation: "Réduire est utile dans certains cas (beaucoup de variables corrélées, calcul plus rapide, dessin), pas dans tous. Ici les 13 mesures suffisent et l'ACP à 2 axes en perd un peu (l'écart reste petit et mesuré sur un seul tirage).",
    },
    {
      question: "Quelle est la différence essentielle entre l'ACP et sklearn.decomposition.FactorAnalysis ?",
      options: [
        "Aucune : ce sont deux noms de la même méthode",
        "L'ACP cherche des axes de projection maximisant la variance totale ; FactorAnalysis est un modèle à facteurs latents qui estime en plus une variance spécifique (un bruit) pour chaque variable",
        "FactorAnalysis ne fonctionne que sur des variables qualitatives",
        "L'ACP suppose un bruit propre à chaque variable, pas FactorAnalysis",
      ],
      correct: 1,
      explanation: "L'ACP est géométrique et décompose la variance totale ; la factor analysis est un modèle statistique qui sépare la partie commune (les facteurs) de la partie propre à chaque variable (noise_variance_). Le français « analyse factorielle » est plus large et désigne ACP, AFC et ACM.",
    },
    {
      question: "Vous avez les réponses de 800 personnes à un questionnaire de 12 questions à choix (variables qualitatives). Quelle méthode de ce cours est adaptée ?",
      options: [
        "L'ACP, directement sur les numéros de réponse",
        "L'AFC, parce qu'il y a des profils",
        "L'ACM, qui travaille sur le tableau disjonctif des modalités, avec la correction de Benzécri pour les parts d'inertie",
        "Aucune : ces méthodes exigent des variables numériques",
      ],
      correct: 2,
      explanation: "Plusieurs variables qualitatives décrivant les mêmes individus relèvent de l'ACM. L'ACP sur des numéros de réponse traiterait comme des nombres des catégories qui n'en sont pas, et l'AFC suppose un tableau de contingence croisant deux variables.",
    },
  ],
};
