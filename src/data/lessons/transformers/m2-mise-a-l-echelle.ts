import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module2: LessonModule = {
  id: "mise-a-l-echelle",
  title: "Mettre les variables à la même échelle",
  duration: "2 h",
  summary:
    "StandardScaler, MinMaxScaler et RobustScaler : leurs formules, leur écriture à la main, leur comportement face à une valeur extrême (mesuré), et la règle qui compte le plus, n'apprendre la transformation que sur le jeu d'entraînement.",
  objectives: [
    "Expliquer pourquoi l'échelle des variables compte pour certains modèles et pas pour d'autres",
    "Écrire à la main la standardisation, la normalisation min-max et la mise à l'échelle robuste, et les comparer à scikit-learn",
    "Mesurer l'effet d'une valeur extrême sur chaque méthode",
    "Apprendre la transformation sur l'entraînement seul et mesurer ce que change une fuite de données",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi mettre à l'échelle

Un jeu de données mélange souvent des unités sans rapport : une surface en mètres carrés (quelques dizaines), un prix en euros (des centaines de milliers), un nombre de pièces (quelques unités). Pour certains modèles, ces échelles ne sont pas neutres :

- les modèles fondés sur des **distances** (k plus proches voisins, k-moyennes, SVM à noyau gaussien) additionnent des écarts : la variable aux plus grandes valeurs domine le calcul ;
- les modèles entraînés par **descente de gradient** (régression logistique, réseaux de neurones) convergent plus facilement quand les variables ont des ordres de grandeur voisins ;
- les modèles **régularisés** (ridge, lasso) pénalisent les coefficients : un coefficient dépend de l'unité de sa variable, donc la pénalité aussi ;
- l'**ACP** cherche les directions de plus grande variance, que les variables à grande échelle captent à elles seules.

À l'inverse, un **arbre de décision** ou une forêt ne comparent chaque variable qu'à un seuil : changer l'unité d'une variable, ou la remplacer par une fonction croissante d'elle-même, ne change pas les découpes possibles. Pour eux, la mise à l'échelle est inutile.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.datasets import load_wine",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler",
        "",
        "vins = load_wine()",
        "X, y = vins.data, vins.target",
        "etendues = X.max(axis=0) - X.min(axis=0)",
        "grande, petite = etendues.argmax(), etendues.argmin()",
        "print(f'étendue de {vins.feature_names[grande]} : {etendues[grande]:.2f}')",
        "print(f'étendue de {vins.feature_names[petite]} : {etendues[petite]:.2f}')",
        "",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
        "modeles = {'aucune': KNeighborsClassifier(n_neighbors=5)}",
        "for scaler in (StandardScaler(), MinMaxScaler(), RobustScaler()):",
        "    modeles[type(scaler).__name__] = make_pipeline(scaler, KNeighborsClassifier(n_neighbors=5))",
        "for nom, modele in modeles.items():",
        "    modele.fit(X_train, y_train)",
        "    print(f'{nom:<15} exactitude sur le test : {modele.score(X_test, y_test):.3f}')",
      ),
      caption:
        "Dans le jeu wine (178 vins, 13 mesures chimiques), la proline s'étale sur 1 402 unités et les phénols non flavonoïdes sur 0,53 : pour les voisins, la proline fait presque toute la distance. Sans mise à l'échelle, 30 des 45 vins de test sont bien classés (0,667) ; avec n'importe lequel des trois scalers, 42 ou 43 (0,933 ou 0,956). L'écart entre scalers est d'un seul vin sur 45 : il ne permet aucune conclusion, contrairement à l'écart avec « aucune ».",
    },
    {
      kind: "text",
      md: `### La standardisation (StandardScaler)

La **standardisation** retire la moyenne de chaque colonne puis divise par son écart-type. Le résultat a une moyenne nulle et un écart-type égal à 1 : on lit chaque valeur comme un nombre d'écarts-types au-dessus (positif) ou au-dessous (négatif) de la moyenne, ce que l'on appelle aussi un **score z**.`,
    },
    {
      kind: "equation",
      latex: String.raw`z \;=\; \frac{x-\mu}{\sigma} \qquad\text{avec}\qquad \mu=\frac{1}{n}\sum_{i=1}^{n}x_i \quad\text{et}\quad \sigma=\sqrt{\frac{1}{n}\sum_{i=1}^{n}\left(x_i-\mu\right)^2}`,
      caption: "Standardisation. Attention : StandardScaler calcule σ avec n au dénominateur, alors que pandas divise par n − 1 par défaut",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "logements = pd.DataFrame({",
        "    'surface_m2': [45, 120, 80, 200, 65, 150],",
        "    'prix_euros': [150000, 450000, 280000, 800000, 200000, 600000],",
        "    'nb_pieces': [2, 5, 3, 8, 3, 6],",
        "})",
        "scaler = StandardScaler()",
        "Z = pd.DataFrame(scaler.fit_transform(logements), columns=logements.columns)",
        "print(Z.round(2))",
        "print('moyennes :', Z.mean().round(6).tolist())",
        "print('écarts-types avec n (StandardScaler) :', Z.std(ddof=0).round(6).tolist())",
        "print('écarts-types avec n - 1 (pandas)     :', Z.std().round(3).tolist())",
        "print('transformation inverse exacte :', bool((scaler.inverse_transform(Z) - logements).abs().max().max() < 1e-6))",
      ),
      caption:
        "Six logements aux valeurs inventées. Après standardisation, les trois colonnes ont une moyenne nulle et un écart-type de 1 au sens de scikit-learn. Pandas, qui divise par n − 1, annonce 1,095 (la racine de 6/5) : ce n'est pas une erreur, ce sont deux définitions de l'écart-type. La transformation est réversible : inverse_transform retrouve les valeurs d'origine.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `standardiser(x)` qui renvoie le tableau NumPy `x` centré-réduit : `(x - moyenne) / écart-type`, avec l'écart-type calculé avec **n** au dénominateur (le comportement par défaut de `np.std`). Le test compare votre résultat à celui de `StandardScaler`.",
      setup: "import numpy as np",
      starter: lines("def standardiser(x):", "    x = np.asarray(x, dtype=float)", "    # à compléter", "    return x"),
      solution: lines(
        "def standardiser(x):",
        "    x = np.asarray(x, dtype=float)",
        "    return (x - x.mean()) / x.std()",
        "",
        "z = standardiser([8, 12, 14, 16])",
        "print(z.round(2), z.mean().round(6), z.std().round(6))",
      ),
      test: lines(
        "from sklearn.preprocessing import StandardScaler as _SS",
        "_x = np.array([3.0, 10.0, 4.0, 25.0, 8.0, 12.0])",
        "_r = np.asarray(standardiser(_x), dtype=float)",
        "_ref = _SS().fit_transform(_x.reshape(-1, 1)).ravel()",
        "assert _r.shape == _x.shape, f\"le résultat doit avoir la même forme que x ({_x.shape}), il a la forme {_r.shape}\"",
        "assert abs(_r.mean()) < 1e-9, f\"la moyenne du résultat doit être 0 (vous avez {_r.mean():.3f})\"",
        "assert abs(_r.std() - 1) < 1e-9, f\"l'écart-type du résultat (avec n au dénominateur) doit être 1 (vous avez {_r.std():.3f})\"",
        "assert np.allclose(_r, _ref), f\"le résultat doit être celui de StandardScaler : {np.round(_ref, 3)} (vous avez {np.round(_r, 3)})\"",
      ),
      hint: "x.mean() donne la moyenne et x.std() l'écart-type avec n au dénominateur : (x - x.mean()) / x.std().",
    },
    {
      kind: "text",
      md: `### La normalisation min-max (MinMaxScaler)

La **normalisation min-max** ramène chaque colonne dans l'intervalle [0, 1] : le minimum devient 0 et le maximum devient 1, les autres valeurs se placent proportionnellement entre les deux. Elle conserve le rapport entre les écarts (une valeur située aux trois quarts de la plage reste aux trois quarts) mais pas le rapport entre les valeurs elles-mêmes. Avec \`feature_range=(a, b)\`, on obtient un autre intervalle.

Le mot « normalisation » prête à confusion : il désigne ici une mise à l'échelle sur un intervalle, pas le fait de rendre les données normales (gaussiennes), et scikit-learn l'emploie aussi pour la classe \`Normalizer\`, qui fait autre chose (module 3).`,
    },
    {
      kind: "equation",
      latex: String.raw`x' \;=\; \frac{x-x_{\min}}{x_{\max}-x_{\min}} \qquad\text{puis, pour l'intervalle } [a,b] :\quad x'' \;=\; a + x'\,(b-a)`,
      caption: "Normalisation min-max. Si x_max = x_min (colonne constante), le dénominateur est nul : scikit-learn renvoie alors 0",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "from sklearn.preprocessing import MinMaxScaler",
        "",
        "equipe = pd.DataFrame({",
        "    'ventes_mensuelles': [5000, 12000, 8000, 25000, 15000, 3000],",
        "    'heures_travaillees': [35, 45, 40, 55, 48, 30],",
        "})",
        "scaler = MinMaxScaler()",
        "N = pd.DataFrame(scaler.fit_transform(equipe), columns=equipe.columns)",
        "print(N.round(3))",
        "print('minimum appris :', scaler.data_min_, ' maximum appris :', scaler.data_max_)",
        "",
        "nouveaux = pd.DataFrame({'ventes_mensuelles': [30000, 1000], 'heures_travaillees': [40, 20]})",
        "print('nouvelles données :')",
        "print(scaler.transform(nouveaux).round(3))",
        "print('avec clip=True :')",
        "print(MinMaxScaler(clip=True).fit(equipe).transform(nouveaux).round(3))",
      ),
      caption:
        "Le minimum et le maximum appris sur les six lignes servent aussi aux nouvelles : 30 000 de ventes (au-dessus du maximum appris, 25 000) donne 1,227, et 20 heures (sous le minimum appris, 30) donne -0,4. Une valeur nouvelle peut donc sortir de [0, 1]. clip=True la ramène aux bornes, mais efface alors la différence entre « un peu au-dessus » et « très au-dessus ».",
    },
    {
      kind: "text",
      md: `### La mise à l'échelle robuste (RobustScaler)

La moyenne et l'écart-type sont très sensibles aux valeurs extrêmes, tout comme le minimum et le maximum. Le \`RobustScaler\` les remplace par des statistiques qui y résistent : la **médiane** pour centrer, et l'**écart interquartile** (Q3 − Q1, la largeur de la plage qui contient la moitié centrale des données) pour réduire. Une valeur extrême ne déplace presque pas ces deux-là.`,
    },
    {
      kind: "equation",
      latex: String.raw`x' \;=\; \frac{x-\text{médiane}}{Q_3-Q_1} \qquad (Q_1 \text{ et } Q_3 : \text{quartiles à } 25\,\% \text{ et } 75\,\%)`,
      caption: "Mise à l'échelle robuste. Le résultat n'a pas d'écart-type égal à 1 : seule la moitié centrale des données a une largeur de 1",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `robuste(x)` qui renvoie `x` centré sur sa médiane et divisé par son écart interquartile (le 75e centile moins le 25e, calculés avec `np.percentile`). Le test compare votre résultat à `RobustScaler`, sur des données qui contiennent une valeur extrême.",
      setup: "import numpy as np",
      starter: lines("def robuste(x):", "    x = np.asarray(x, dtype=float)", "    # à compléter", "    return x"),
      solution: lines(
        "def robuste(x):",
        "    x = np.asarray(x, dtype=float)",
        "    q1, mediane, q3 = np.percentile(x, [25, 50, 75])",
        "    return (x - mediane) / (q3 - q1)",
        "",
        "print(robuste([28, 31, 33, 34, 36, 38, 39, 41, 43, 45, 47, 52, 400]).round(2))",
      ),
      test: lines(
        "from sklearn.preprocessing import RobustScaler as _RS",
        "_x = np.array([28.0, 31.0, 33.0, 34.0, 36.0, 38.0, 39.0, 41.0, 43.0, 45.0, 47.0, 52.0, 400.0])",
        "_r = np.asarray(robuste(_x), dtype=float)",
        "_ref = _RS().fit_transform(_x.reshape(-1, 1)).ravel()",
        "assert _r.shape == _x.shape, f\"le résultat doit avoir la même forme que x ({_x.shape}), il a la forme {_r.shape}\"",
        "assert abs(np.median(_r)) < 1e-9, f\"la médiane du résultat doit être 0 (vous avez {np.median(_r):.3f})\"",
        "assert np.allclose(_r, _ref), f\"le résultat doit être celui de RobustScaler : {np.round(_ref[:4], 3)}... (vous avez {np.round(_r[:4], 3)}...)\"",
      ),
      hint: "q1, mediane, q3 = np.percentile(x, [25, 50, 75]) donne les trois statistiques d'un coup ; il reste à calculer (x - mediane) / (q3 - q1).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "from scipy import stats",
        "from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler",
        "",
        "salaires = np.array([28, 31, 33, 34, 36, 38, 39, 41, 43, 45, 47, 52], dtype=float)  # en k€, inventés",
        "avec = np.append(salaires, 400.0)",
        "print(f'sans la valeur extrême : moyenne {salaires.mean():.1f}, écart-type {salaires.std():.1f}, médiane {np.median(salaires)}')",
        "print(f'avec la valeur extrême : moyenne {avec.mean():.1f}, écart-type {avec.std():.1f}, médiane {np.median(avec)}')",
        "",
        "noms = ['StandardScaler', 'MinMaxScaler', 'RobustScaler']",
        "etendues = {'sans valeur extrême': [], 'avec valeur extrême': []}",
        "for scaler in (StandardScaler(), MinMaxScaler(), RobustScaler()):",
        "    for libelle, valeurs in (('sans valeur extrême', salaires), ('avec valeur extrême', avec)):",
        "        z = scaler.fit_transform(valeurs.reshape(-1, 1)).ravel()[:12]",
        "        etendues[libelle].append(z.max() - z.min())",
        "for i, nom in enumerate(noms):",
        "    print(f'{nom:<15} étendue des 12 salaires ordinaires : {etendues[\"sans valeur extrême\"][i]:.3f} sans, {etendues[\"avec valeur extrême\"][i]:.3f} avec')",
        "",
        "z_std = StandardScaler().fit_transform(avec.reshape(-1, 1)).ravel()",
        "print(f'asymétrie avant : {stats.skew(avec):.3f}   après StandardScaler : {stats.skew(z_std):.3f}')",
        "",
        "x = np.arange(len(noms))",
        "fig, ax = plt.subplots(figsize=(7, 3.5))",
        "ax.bar(x - 0.2, etendues['sans valeur extrême'], width=0.4, label='sans valeur extrême')",
        "ax.bar(x + 0.2, etendues['avec valeur extrême'], width=0.4, label='avec valeur extrême')",
        "ax.set_xticks(x)",
        "ax.set_xticklabels(noms)",
        "ax.set_ylabel('étendue des 12 salaires ordinaires')",
        "ax.legend()",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption:
        "Une seule valeur extrême (400 au milieu de salaires entre 28 et 52) fait passer la moyenne de 38,9 à 66,7 et l'écart-type de 6,7 à 96,4, alors que la médiane ne passe que de 38,5 à 39,0. Conséquence sur les 12 salaires ordinaires, qui occupaient 3,562 unités après StandardScaler et 1,000 après MinMaxScaler : ils n'en occupent plus que 0,249 et 0,065, entassés les uns sur les autres. Avec RobustScaler, 2,462 devient 2,182. Dernière ligne : standardiser ne change pas l'asymétrie (3,150 avant et après), car c'est une transformation affine.",
    },
    {
      kind: "note",
      tone: "info",
      md: "**Quel scaler choisir ?** Il n'existe pas de classement universel. La standardisation est le choix par défaut pour des variables sans valeurs extrêmes marquantes. Le min-max convient quand une borne fixe est nécessaire (certains réseaux de neurones, des pixels) à condition de n'avoir pas de valeurs extrêmes. Le scaler robuste est préférable quand des valeurs extrêmes sont **réelles** et que l'on ne veut pas qu'elles dictent l'échelle. Et une valeur extrême peut aussi être une erreur de saisie : la première question est de savoir ce qu'elle est, la seconde de choisir l'outil. Le module 6 compare plusieurs scalers par validation croisée, seule façon honnête de trancher pour un jeu de données donné.",
    },
    {
      kind: "text",
      md: `### N'apprendre que sur l'entraînement

Un scaler **apprend** des statistiques (moyenne, écart-type, minimum, médiane...). Si on les calcule sur le jeu de données complet avant de le découper, les exemples de test contribuent à l'apprentissage de la transformation : c'est une **fuite de données** (*data leakage*). Le jeu de test ne joue plus son rôle, qui est de représenter des données jamais vues.

La règle tient en deux lignes : \`fit\` ou \`fit_transform\` sur l'**entraînement** seulement, puis \`transform\` sur le test (et sur toute donnée future). L'erreur inverse, appeler \`fit_transform\` sur le test, est tout aussi fautive : le test est alors transformé avec ses propres statistiques et non avec celles que le modèle a connues.

Pour voir l'effet, prenons une série qui monte au fil du temps, comme des ventes ou une température de capteur : on entraîne sur le début, on teste sur la fin, ce qui est la situation réelle d'une prévision.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "rng = np.random.default_rng(0)",
        "temps = np.arange(100)",
        "serie = (50 + 0.3 * temps + rng.normal(0, 3, size=100)).reshape(-1, 1)  # simulée, avec une tendance",
        "X_train, X_test = serie[:80], serie[80:]",
        "",
        "correct = StandardScaler().fit(X_train)",
        "fuite = StandardScaler().fit(serie)  # fit sur tout : le test a servi à apprendre",
        "print('moyenne du train :', X_train.mean().round(2), ' moyenne du test :', X_test.mean().round(2))",
        "print('sans fuite : moyenne apprise', correct.mean_.round(2), ' écart-type appris', correct.scale_.round(2))",
        "print('avec fuite : moyenne apprise', fuite.mean_.round(2), ' écart-type appris', fuite.scale_.round(2))",
        "zc, zf = correct.transform(X_test), fuite.transform(X_test)",
        "print('test transformé sans fuite : moyenne', zc.mean().round(2), ' maximum', zc.max().round(2))",
        "print('test transformé avec fuite : moyenne', zf.mean().round(2), ' maximum', zf.max().round(2))",
        "",
        "stable = rng.normal(50, 3, size=(100, 1))  # même expérience sans tendance",
        "a, b = StandardScaler().fit(stable[:80]), StandardScaler().fit(stable)",
        "print('série stable : moyenne apprise', a.mean_.round(2), 'contre', b.mean_.round(2), ' écart-type', a.scale_.round(2), 'contre', b.scale_.round(2))",
      ),
      caption:
        "Le test (moyenne 76,62) est bien plus haut que l'entraînement (62,21) : c'est la tendance. Appris sur l'entraînement seul, le scaler place le test en moyenne à 1,82 écart-type au-dessus (maximum 2,50), ce que le modèle rencontrerait vraiment. Appris avec le test, il l'y place à 1,25 (maximum 1,83) : la fuite a rapproché le test de ce que le modèle a vu, et l'évaluation sera flatteuse. Sur la série sans tendance, la fuite change à peine les statistiques apprises (49,91 contre 49,85 pour la moyenne).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Voici le code classique et fautif : le test est transformé avec **ses propres** statistiques (`fit_transform` sur `X_test`). Corrigez-le pour que `X_test_z` utilise la moyenne et l'écart-type de `X_train`, sans toucher aux données.",
      setup: lines(
        "import numpy as np",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "rng = np.random.default_rng(0)",
        "serie = (50 + 0.3 * np.arange(100) + rng.normal(0, 3, size=100)).reshape(-1, 1)",
        "X_train, X_test = serie[:80], serie[80:]",
      ),
      starter: lines(
        "scaler = StandardScaler()",
        "X_train_z = scaler.fit_transform(X_train)",
        "X_test_z = scaler.fit_transform(X_test)  # erreur à corriger",
      ),
      solution: lines(
        "scaler = StandardScaler()",
        "X_train_z = scaler.fit_transform(X_train)",
        "X_test_z = scaler.transform(X_test)",
        "print(X_test_z.mean().round(2), X_test_z.max().round(2))",
      ),
      test: lines(
        "_mu, _sigma = X_train.mean(axis=0), X_train.std(axis=0)",
        "assert np.allclose(X_train_z, (X_train - _mu) / _sigma), \"X_train_z doit être l'entraînement centré-réduit\"",
        "assert np.allclose(X_test_z, (X_test - _mu) / _sigma), f\"X_test_z doit utiliser la moyenne et l'écart-type de l'entraînement : sa moyenne devrait être {((X_test - _mu) / _sigma).mean():.2f} (vous avez {X_test_z.mean():.2f})\"",
      ),
      hint: "fit_transform apprend et transforme ; transform seul applique ce qui a déjà été appris. Sur le test, on ne veut pas apprendre.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour ne jamais faire cette erreur, rangez le scaler **dans un Pipeline** avec le modèle : `fit` du pipeline n'apprend que sur les données qu'on lui donne, et la validation croisée refait l'apprentissage du scaler sur chaque partie d'entraînement. Le module 3 construit ce pipeline, et le module 6 mesure une fuite beaucoup plus grave que celle d'un simple scaler.",
    },
  ],
  quiz: [
    {
      question: "Pour quel modèle la mise à l'échelle des variables est-elle inutile ?",
      options: ["Les k plus proches voisins", "La régression logistique régularisée", "Un arbre de décision", "L'analyse en composantes principales"],
      correct: 2,
      explanation: "Un arbre compare chaque variable à un seuil, une à la fois : une fonction croissante appliquée à une variable (changement d'unité, standardisation) ne change pas les découpes possibles. Les trois autres modèles dépendent de distances, de pénalités ou de variances.",
    },
    {
      question: "Après StandardScaler, que valent la moyenne et l'écart-type d'une colonne d'entraînement ?",
      options: ["0 et 1", "0,5 et 0,5", "1 et 0", "La médiane et l'écart interquartile"],
      correct: 0,
      explanation: "La colonne est centrée (moyenne 0) et réduite (écart-type 1, calculé avec n au dénominateur). La médiane et l'écart interquartile sont ceux du RobustScaler, dont le résultat n'a pas un écart-type de 1.",
    },
    {
      question: "Une seule valeur extrême est ajoutée à une colonne. Quel scaler change le moins l'échelle des autres valeurs ?",
      options: ["MinMaxScaler", "StandardScaler", "RobustScaler", "Aucun : ils réagissent tous pareil"],
      correct: 2,
      explanation: "Le RobustScaler s'appuie sur la médiane et les quartiles, qui bougent à peine. Le min-max est le plus sensible, puisque le maximum devient la valeur extrême elle-même, et la moyenne et l'écart-type de la standardisation sont aussi tirés par elle.",
    },
    {
      question: "Un MinMaxScaler appris sur l'entraînement reçoit une valeur de test supérieure au maximum d'entraînement. Que renvoie-t-il, par défaut ?",
      options: [
        "Exactement 1",
        "Une erreur",
        "Une valeur supérieure à 1",
        "Zéro",
      ],
      correct: 2,
      explanation: "Le minimum et le maximum appris sont figés : une valeur plus grande que le maximum d'entraînement dépasse 1. Avec clip=True, elle serait ramenée à 1.",
    },
    {
      question: "Pourquoi faut-il appeler fit sur l'entraînement seul, puis transform sur le test ?",
      options: [
        "Parce que fit_transform est plus lent",
        "Pour que le test ne contribue pas à l'apprentissage de la transformation, sans quoi l'évaluation est trop optimiste",
        "Parce que le test n'a pas de colonnes",
        "Pour obtenir une moyenne exactement nulle sur le test",
      ],
      correct: 1,
      explanation: "Le test représente des données jamais vues. Si ses valeurs entrent dans la moyenne ou l'écart-type appris, il influence la transformation (fuite de données). Et sa moyenne n'a aucune raison d'être nulle : c'est justement ce qui le distingue de l'entraînement.",
    },
  ],
};
