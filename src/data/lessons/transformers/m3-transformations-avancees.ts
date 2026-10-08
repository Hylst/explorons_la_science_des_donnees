import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module3: LessonModule = {
  id: "transformations-avancees",
  title: "Transformations avancées : quantiles, puissances, catégories et pipelines",
  duration: "2 h 30",
  summary:
    "Redresser une distribution asymétrique (QuantileTransformer, PowerTransformer), encoder des catégories sans inventer d'ordre, puis assembler le tout avec ColumnTransformer et Pipeline sur un tableau mixte aux valeurs manquantes. Avec, pour chaque outil, ce qu'il conserve et ce qu'il perd.",
  objectives: [
    "Redresser une distribution asymétrique avec le QuantileTransformer et le PowerTransformer, et dire ce que chacun conserve et perd",
    "Encoder des variables catégorielles (OneHotEncoder, OrdinalEncoder) sans créer d'ordre artificiel, et gérer les catégories inconnues",
    "Assembler ColumnTransformer et Pipeline sur un tableau mixte avec des valeurs manquantes",
    "Connaître les transformeurs spécialisés (Normalizer, MaxAbsScaler, FunctionTransformer) et la dépendance de l'ACP à l'échelle",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand une mise à l'échelle ne suffit pas

Le module précédent l'a vu : centrer et réduire, ou ramener dans [0, 1], sont des transformations **affines**. Elles changent l'échelle et le point de départ, jamais la **forme** de la distribution. Une variable très asymétrique, comme un revenu ou un temps d'attente, reste asymétrique, avec quelques valeurs énormes loin de toutes les autres.

Pour la redresser, il faut une transformation **non linéaire**. Trois outils reviennent : le logarithme, le \`PowerTransformer\` et le \`QuantileTransformer\`. Voyons leur effet sur des revenus simulés, très asymétriques, auxquels on ajoute trois valeurs extrêmes.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "from scipy import stats",
        "from sklearn.preprocessing import PowerTransformer, QuantileTransformer",
        "",
        "rng = np.random.default_rng(42)",
        "revenus = rng.lognormal(mean=10, sigma=1, size=1000)  # revenus simulés, très asymétriques",
        "revenus = np.append(revenus, [1_000_000, 2_000_000, 5_000_000])  # trois valeurs extrêmes",
        "colonne = revenus.reshape(-1, 1)",
        "",
        "power = PowerTransformer(method='yeo-johnson')",
        "quant_u = QuantileTransformer(n_quantiles=1000, output_distribution='uniform')",
        "quant_n = QuantileTransformer(n_quantiles=1000, output_distribution='normal')",
        "versions = {",
        "    'valeurs brutes': revenus,",
        "    'logarithme': np.log(revenus),",
        "    'quantile, sortie uniforme': quant_u.fit_transform(colonne).ravel(),",
        "    'quantile, sortie normale': quant_n.fit_transform(colonne).ravel(),",
        "    'Yeo-Johnson': power.fit_transform(colonne).ravel(),",
        "}",
        "print('lambda appris par Yeo-Johnson :', power.lambdas_.round(3))",
        "for nom, valeurs in versions.items():",
        "    print(f'{nom:<26} asymétrie {round(stats.skew(valeurs), 3) + 0.0:>7.3f}   de {valeurs.min():.2f} à {valeurs.max():.2f}')",
        "",
        "extremes = np.array([[1_000_000], [2_000_000], [5_000_000]])",
        "print('trois valeurs extrêmes, logarithme        :', np.log(extremes).ravel().round(2))",
        "print('trois valeurs extrêmes, Yeo-Johnson       :', power.transform(extremes).ravel().round(2))",
        "print('trois valeurs extrêmes, quantile uniforme :', quant_u.transform(extremes).ravel().round(3))",
        "",
        "fig, axes = plt.subplots(2, 3, figsize=(10, 5))",
        "for ax, (nom, valeurs) in zip(axes.ravel(), versions.items()):",
        "    ax.hist(valeurs, bins=40, color='tab:blue')",
        "    ax.set_title(nom, fontsize=9)",
        "axes.ravel()[-1].axis('off')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption:
        "Asymétrie (skewness) de 23,641 pour les valeurs brutes, ramenée à 0,214 par le logarithme, à -0,014 par Yeo-Johnson (lambda appris : -0,051, très proche de 0, valeur qui correspond au logarithme) et à 0,000 par les deux sorties du QuantileTransformer. Ici les revenus ont été simulés log-normaux : le logarithme marche presque parfaitement, ce qui est rare sur des données réelles. Regardez les trois valeurs extrêmes : le logarithme et Yeo-Johnson gardent leur écart relatif (13,82, 14,51 et 15,42 pour le logarithme), tandis que le quantile les écrase à 0,998, 0,999 et 1,000. Une asymétrie nulle n'est donc pas un gage de qualité en soi.",
    },
    {
      kind: "text",
      md: `### Le QuantileTransformer : remplacer chaque valeur par son rang

Le \`QuantileTransformer\` remplace chaque valeur par sa **position dans la distribution** apprise : le minimum devient 0, la médiane 0,5, le maximum 1, et une valeur au 90e centile devient 0,9. La sortie est donc **uniforme** sur [0, 1], quelle que soit la forme de départ. Avec \`output_distribution="normal"\`, on applique ensuite la fonction réciproque de la loi normale pour obtenir une sortie en forme de cloche.

Ce que l'on **garde** : l'ordre des valeurs (la transformation est croissante), et une grande robustesse aux valeurs extrêmes, qui ne sont plus qu'un rang. Ce que l'on **perd** : les distances. Deux valeurs voisines dans une zone dense s'écartent, deux valeurs éloignées dans une zone clairsemée se rapprochent, et la transformation ne se lit plus dans l'unité d'origine. Une valeur de test plus grande que tout l'entraînement est ramenée à 1 (ou à 0 pour la plus petite).`,
    },
    {
      kind: "equation",
      latex: String.raw`u \;=\; \hat F(x) \qquad\text{puis, pour une sortie normale :}\qquad z \;=\; \Phi^{-1}(u)`,
      caption: "F̂ est la fonction de répartition empirique des données d'entraînement (scikit-learn interpole entre n_quantiles quantiles), Φ⁻¹ la réciproque de la fonction de répartition de la loi normale",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Sans utiliser scikit-learn, écrivez `uniformiser(x)` : elle remplace chaque valeur de `x` (toutes distinctes) par son **rang** divisé par `n - 1`, de sorte que le plus petit devienne 0 et le plus grand 1. Indice : appliquer `argsort()` deux fois de suite donne le rang de chaque élément. Le test compare votre résultat à `QuantileTransformer(n_quantiles=len(x))`.",
      setup: "import numpy as np",
      starter: lines("def uniformiser(x):", "    x = np.asarray(x, dtype=float)", "    # à compléter : remplacer chaque valeur par son rang divisé par n - 1", "    return x"),
      solution: lines(
        "def uniformiser(x):",
        "    x = np.asarray(x, dtype=float)",
        "    rangs = x.argsort().argsort()",
        "    return rangs / (len(x) - 1)",
        "",
        "print(uniformiser([12.5, 3.0, 7.7, 100.0, 4.2]))",
      ),
      test: lines(
        "from sklearn.preprocessing import QuantileTransformer as _QT",
        "_x = np.array([12.5, 3.0, 7.7, 100.0, 4.2, 9.9, 0.5])",
        "_r = np.asarray(uniformiser(_x), dtype=float)",
        "assert _r.shape == _x.shape, f\"le résultat doit avoir la même forme que x ({_x.shape}), il a la forme {_r.shape}\"",
        "assert _r.min() == 0 and _r.max() == 1, f\"la plus petite valeur doit devenir 0 et la plus grande 1 (vous avez de {_r.min():.2f} à {_r.max():.2f})\"",
        "_ref = _QT(n_quantiles=len(_x)).fit_transform(_x.reshape(-1, 1)).ravel()",
        "assert np.allclose(_r, _ref), f\"attendu {np.round(_ref, 3)} (rang divisé par n - 1), vous avez {np.round(_r, 3)}\"",
      ),
      hint: "x.argsort().argsort() renvoie le rang de chaque valeur (0 pour la plus petite). Divisez-le par len(x) - 1.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.preprocessing import QuantileTransformer",
        "",
        "temps = np.array([[1.0], [2.0], [3.0], [4.0], [1000.0]])",
        "q = QuantileTransformer(n_quantiles=5).fit(temps)",
        "print('valeurs apprises :', temps.ravel())",
        "print('rangs en sortie  :', q.transform(temps).ravel())",
        "print('écart 3 -> 4     :', float(q.transform([[4.0]])[0, 0] - q.transform([[3.0]])[0, 0]))",
        "print('écart 4 -> 1000  :', float(q.transform([[1000.0]])[0, 0] - q.transform([[4.0]])[0, 0]))",
        "print('nouvelles valeurs -5, 3.5 et 5000 :', q.transform([[-5.0], [3.5], [5000.0]]).ravel())",
      ),
      caption:
        "Les cinq valeurs deviennent 0, 0,25, 0,5, 0,75 et 1 : l'écart entre 3 et 4 est identique à l'écart entre 4 et 1000, ce qui montre la perte des distances. Les valeurs nouvelles hors de la plage apprise sont ramenées à 0 et à 1 (-5 et 5000), et 3,5 tombe entre 3 et 4 (0,625).",
    },
    {
      kind: "text",
      md: `### Le PowerTransformer : une puissance pour se rapprocher d'une cloche

Le \`PowerTransformer\` applique à chaque colonne une transformation par **puissance** dont le paramètre λ est estimé par maximum de vraisemblance, de façon à rapprocher la distribution d'une loi normale. Deux familles existent. **Box-Cox** exige des valeurs **strictement positives**. **Yeo-Johnson** est son extension, qui accepte aussi les zéros et les valeurs négatives. Par défaut, le résultat est ensuite standardisé.

Contrairement au quantile, la transformation est **lisse, inversible et décrite par un seul nombre par colonne** : les écarts relatifs sont déformés de façon contrôlée, pas aplatis. Mais elle ne fait pas de miracle : une distribution à plusieurs bosses ou à queue très lourde reste ce qu'elle est.`,
    },
    {
      kind: "equation",
      latex: String.raw`x^{(\lambda)} \;=\; \begin{cases} \dfrac{x^{\lambda}-1}{\lambda} & \text{si } \lambda \neq 0 \\[2mm] \ln x & \text{si } \lambda = 0 \end{cases} \qquad (x>0)`,
      caption: "Transformation de Box-Cox. Le logarithme en est le cas particulier λ = 0 : c'est pourquoi un lambda proche de 0 signale une variable log-normale",
    },
    {
      kind: "note",
      tone: "info",
      md: "**Que choisir ?** Le logarithme, quand il convient, est le plus simple à expliquer : il ne dépend pas des données. Le PowerTransformer généralise cette idée avec un exposant appris. Le QuantileTransformer est le plus radical : il convient quand on se moque des distances (certains modèles d'arbres, de voisinage par rang) ou que la forme est irrégulière, mais il apprend la distribution d'entraînement et ramène toute nouvelle valeur qui en sort aux bornes. Redresser les variables explicatives aide surtout les modèles linéaires, les SVM et les réseaux ; un arbre n'y gagne rien, puisqu'il ne dépend que de l'ordre des valeurs. Pour redresser la **cible** d'une régression, c'est une autre démarche (`TransformedTargetRegressor`).",
    },
    {
      kind: "text",
      md: `### Encoder des catégories

Un modèle calcule sur des nombres, pas sur des mots. Coder « Nantes = 0, Lyon = 1, Rennes = 2 » est une erreur pour une variable **nominale** (sans ordre naturel) : un modèle linéaire en conclurait que Rennes vaut deux fois Lyon. Le \`OneHotEncoder\` crée à la place **une colonne par catégorie**, valant 1 pour la catégorie de la ligne et 0 ailleurs.

Pour une variable **ordinale** (avec un ordre : petite < moyenne < grande), le \`OrdinalEncoder\` donne un entier par catégorie, mais **à condition de lui fournir l'ordre** avec \`categories=\` : par défaut il trie les catégories par ordre alphabétique.

Trois réglages de \`OneHotEncoder\` à connaître :

- \`handle_unknown="ignore"\` : une catégorie vue seulement après l'apprentissage donne une ligne de 0, au lieu d'une erreur ;
- \`drop="first"\` : supprime une colonne, ce qui évite la redondance (les colonnes somment toujours à 1) gênante pour une régression linéaire sans pénalité, et inutile pour un arbre ;
- \`sparse_output=False\` : renvoie un tableau ordinaire plutôt qu'une matrice creuse.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import warnings",
        "import numpy as np",
        "from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder",
        "",
        "villes = np.array([['Nantes'], ['Lyon'], ['Nantes'], ['Rennes']])",
        "enc = OneHotEncoder(sparse_output=False, handle_unknown='ignore').fit(villes)",
        "print(enc.get_feature_names_out())",
        "print(enc.transform(villes))",
        "print('une ville jamais vue (Brest) :', enc.transform([['Brest']]))",
        "",
        "avec_drop = OneHotEncoder(sparse_output=False, drop='first', handle_unknown='ignore').fit(villes)",
        "print(avec_drop.get_feature_names_out())",
        "with warnings.catch_warnings(record=True) as avertissements:",
        "    warnings.simplefilter('always')",
        "    inconnue = avec_drop.transform([['Brest']])",
        "    premiere = avec_drop.transform([['Lyon']])",
        "print('Brest avec drop :', inconnue, ' Lyon (catégorie supprimée) :', premiere, ' avertissements :', len(avertissements))",
        "",
        "tailles = np.array([['M'], ['S'], ['L'], ['M']])",
        "print('ordre alphabétique par défaut :', OrdinalEncoder().fit_transform(tailles).ravel())",
        "print('avec l’ordre S < M < L         :', OrdinalEncoder(categories=[['S', 'M', 'L']]).fit_transform(tailles).ravel())",
      ),
      caption:
        "Chaque ville devient une ligne de 0 et de 1, et Brest, inconnue, une ligne de 0. Avec drop='first', la colonne Lyon disparaît : Brest et Lyon sont alors codées de la même façon, [0. 0.], et scikit-learn émet un avertissement. Enfin, sans l'ordre explicite, les tailles M, S, L, M reçoivent 1, 2, 0, 1 (L = 0, M = 1, S = 2, ordre alphabétique), ce qui est faux ; avec l'ordre, elles reçoivent 1, 0, 2, 1.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez à la main `one_hot(valeurs, categories)` : elle renvoie un tableau NumPy de 0 et de 1 à une ligne par élément de `valeurs` et une colonne par élément de `categories` (dans cet ordre). Une valeur absente de `categories` donne une ligne de 0, comme `handle_unknown=\"ignore\"`.",
      setup: "import numpy as np",
      starter: lines("def one_hot(valeurs, categories):", "    # à compléter : une ligne par valeur, une colonne par catégorie", "    return np.zeros((len(valeurs), len(categories)))"),
      solution: lines(
        "def one_hot(valeurs, categories):",
        "    sortie = np.zeros((len(valeurs), len(categories)))",
        "    for i, valeur in enumerate(valeurs):",
        "        if valeur in categories:",
        "            sortie[i, categories.index(valeur)] = 1.0",
        "    return sortie",
        "",
        "print(one_hot(['Nantes', 'Lyon', 'Brest'], ['Lyon', 'Nantes', 'Rennes']))",
      ),
      test: lines(
        "from sklearn.preprocessing import OneHotEncoder as _OHE",
        "_cats = ['Lyon', 'Nantes', 'Rennes']",
        "_r = np.asarray(one_hot(['Nantes', 'Lyon', 'Brest', 'Rennes'], _cats), dtype=float)",
        "assert _r.shape == (4, 3), f\"attendu une ligne par valeur et une colonne par catégorie, soit la forme (4, 3), vous avez {_r.shape}\"",
        "assert np.allclose(_r[0], [0, 1, 0]), f\"« Nantes » est la deuxième catégorie : attendu [0, 1, 0], vous avez {_r[0]}\"",
        "assert np.allclose(_r[2], [0, 0, 0]), f\"« Brest » est inconnue : attendu une ligne de 0, vous avez {_r[2]}\"",
        "_enc = _OHE(categories=[_cats], handle_unknown='ignore', sparse_output=False).fit(np.array(_cats).reshape(-1, 1))",
        "_ref = _enc.transform(np.array(['Nantes', 'Lyon', 'Brest', 'Rennes']).reshape(-1, 1))",
        "assert np.allclose(_r, _ref), f\"le résultat doit être celui de OneHotEncoder : {_ref.tolist()} (vous avez {_r.tolist()})\"",
      ),
      hint: "Créez np.zeros((len(valeurs), len(categories))), puis, pour chaque valeur connue, mettez 1 à la colonne categories.index(valeur).",
    },
    {
      kind: "text",
      md: `### Assembler : ColumnTransformer et Pipeline

Un vrai tableau mélange des types : des nombres à mettre à l'échelle, des catégories nominales à encoder en colonnes, une catégorie ordinale à coder avec son ordre, et des valeurs manquantes un peu partout. Deux objets de scikit-learn assemblent les traitements :

- le \`Pipeline\` **enchaîne** des étapes : la sortie de chacune est l'entrée de la suivante, et la dernière peut être un modèle ;
- le \`ColumnTransformer\` **aiguille** chaque groupe de colonnes vers son propre traitement, puis rassemble les résultats côte à côte.

Le tout reste un seul objet : un \`fit\` apprend toutes les statistiques sur l'entraînement, un \`predict\` ou un \`transform\` les réutilise. Et si on le passe à la validation croisée, tout est réappris sur chaque partie d'entraînement : il n'y a pas de fuite possible (le module 6 le vérifie).

L'exemple ci-dessous utilise un tableau de logements **simulé**, avec des valeurs manquantes volontaires et une ville qui n'apparaît qu'au moment de la prédiction.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "from sklearn.compose import ColumnTransformer",
        "from sklearn.impute import SimpleImputer",
        "from sklearn.linear_model import Ridge",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.pipeline import Pipeline",
        "from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler",
        "",
        "# Données simulées : 150 logements, prix construit à partir de la surface, de l'année, de la ville et de l'état",
        "rng = np.random.default_rng(0)",
        "n = 150",
        "villes = rng.choice(['Nantes', 'Lyon', 'Rennes', 'Lille'], size=n)",
        "etats = rng.choice(['à rénover', 'correct', 'neuf'], size=n, p=[0.3, 0.5, 0.2])",
        "surface = rng.normal(70, 25, size=n).clip(20, 200).round()",
        "annee = rng.integers(1950, 2021, size=n).astype(float)",
        "prime_ville = {'Nantes': 20000, 'Lyon': 60000, 'Rennes': 10000, 'Lille': 0}",
        "prime_etat = {'à rénover': -30000, 'correct': 0, 'neuf': 40000}",
        "prix = (2500 * surface + 150 * (annee - 1950) + np.array([prime_ville[v] for v in villes])",
        "        + np.array([prime_etat[e] for e in etats]) + rng.normal(0, 15000, size=n))",
        "df = pd.DataFrame({'surface_m2': surface, 'annee': annee, 'ville': villes, 'etat': etats})",
        "df.loc[rng.choice(n, 12, replace=False), 'surface_m2'] = np.nan",
        "df.loc[rng.choice(n, 9, replace=False), 'ville'] = np.nan",
        "df.loc[rng.choice(n, 6, replace=False), 'etat'] = np.nan",
        "print('valeurs manquantes par colonne :', df.isna().sum().to_dict())",
        "",
        "preprocesseur = ColumnTransformer([",
        "    ('num', Pipeline([('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())]), ['surface_m2', 'annee']),",
        "    ('nom', Pipeline([('imputer', SimpleImputer(strategy='constant', fill_value='inconnue')),",
        "                      ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))]), ['ville']),",
        "    ('ord', Pipeline([('imputer', SimpleImputer(strategy='constant', fill_value='correct')),",
        "                      ('ordinal', OrdinalEncoder(categories=[['à rénover', 'correct', 'neuf']]))]), ['etat']),",
        "])",
        "modele = Pipeline([('prep', preprocesseur), ('ridge', Ridge(alpha=1.0))])",
        "",
        "X_train, X_test, y_train, y_test = train_test_split(df, prix, test_size=0.25, random_state=0)",
        "modele.fit(X_train, y_train)",
        "print('R² sur le test :', round(modele.score(X_test, y_test), 3))",
        "print('colonnes produites :', list(preprocesseur.get_feature_names_out()))",
        "sortie = preprocesseur.transform(X_test)",
        "print('forme de la sortie :', sortie.shape, ' valeurs manquantes restantes :', int(np.isnan(sortie).sum()))",
        "",
        "nouveau = pd.DataFrame({'surface_m2': [60.0], 'annee': [1990.0], 'ville': ['Brest'], 'etat': ['correct']})",
        "print('prédiction pour une ville jamais vue (Brest) :', modele.predict(nouveau).round(-2))",
      ),
      caption:
        "Les 150 logements comptent 12 surfaces, 9 villes et 6 états manquants, tous imputés dans le pipeline. Il produit 8 colonnes (2 numériques, 5 colonnes de ville dont « inconnue », 1 ordinale) et plus aucune valeur manquante. Le R² de 0,886 sur le test est mesuré sur des données simulées avec un prix construit pour être prévisible : il montre que la chaîne fonctionne, pas ce que donnerait un vrai marché. La ville inconnue (Brest) passe sans erreur, encodée par des 0.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Construisez le `ColumnTransformer` `preprocesseur` pour le tableau `abonnes` d'une médiathèque (valeurs inventées) : (1) `age` et `visites_par_an` : valeurs manquantes remplacées par la **médiane**, puis standardisation ; (2) `quartier` : valeurs manquantes remplacées par `\"inconnu\"`, puis encodage one-hot (`handle_unknown=\"ignore\"`, `sparse_output=False`) ; (3) `frequence` : `OrdinalEncoder` avec l'ordre `rare` < `mensuelle` < `hebdomadaire`. Les imports sont fournis.",
      setup: lines(
        "import numpy as np",
        "import pandas as pd",
        "from sklearn.compose import ColumnTransformer",
        "from sklearn.impute import SimpleImputer",
        "from sklearn.pipeline import Pipeline",
        "from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler",
        "",
        "abonnes = pd.DataFrame({",
        "    'age': [34, 52, np.nan, 27, 61, 45, np.nan, 38],",
        "    'visites_par_an': [12, 40, 3, 25, 60, 8, 18, 30],",
        "    'quartier': ['Centre', 'Nord', 'Centre', np.nan, 'Sud', 'Nord', 'Sud', 'Centre'],",
        "    'frequence': ['mensuelle', 'hebdomadaire', 'rare', 'mensuelle', 'hebdomadaire', 'rare', 'mensuelle', 'hebdomadaire'],",
        "})",
        "nouveaux = pd.DataFrame({'age': [41, np.nan], 'visites_par_an': [10, 200], 'quartier': ['Est', 'Nord'], 'frequence': ['rare', 'hebdomadaire']})",
      ),
      starter: lines("preprocesseur = None  # à remplacer par un ColumnTransformer"),
      solution: lines(
        "preprocesseur = ColumnTransformer([",
        "    ('num', Pipeline([('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())]), ['age', 'visites_par_an']),",
        "    ('nom', Pipeline([('imputer', SimpleImputer(strategy='constant', fill_value='inconnu')),",
        "                      ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))]), ['quartier']),",
        "    ('ord', OrdinalEncoder(categories=[['rare', 'mensuelle', 'hebdomadaire']]), ['frequence']),",
        "])",
        "sortie = preprocesseur.fit_transform(abonnes)",
        "print(sortie.shape)",
        "print(preprocesseur.get_feature_names_out())",
      ),
      test: lines(
        "assert hasattr(preprocesseur, 'fit_transform'), \"preprocesseur doit être un ColumnTransformer (ou un autre transformeur) et non None\"",
        "_X = np.asarray(preprocesseur.fit_transform(abonnes), dtype=float)",
        "assert _X.shape[0] == len(abonnes), f\"la sortie doit garder une ligne par abonné ({len(abonnes)}), elle en a {_X.shape[0]}\"",
        "assert not np.isnan(_X).any(), \"il reste des valeurs manquantes en sortie : imputez age, visites_par_an et quartier\"",
        "assert 6 <= _X.shape[1] <= 7, f\"attendu 2 colonnes numériques, une colonne par quartier (3 ou 4 selon l'imputation) et 1 ordinale, soit 6 ou 7 colonnes ; vous en avez {_X.shape[1]}\"",
        "assert np.abs(_X).max() < 5, f\"les colonnes numériques doivent être standardisées (plus grande valeur absolue obtenue : {np.abs(_X).max():.1f})\"",
        "_ordre = np.array([1.0, 2.0, 0.0, 1.0, 2.0, 0.0, 1.0, 2.0])",
        "assert any(np.allclose(_X[:, j], _ordre) for j in range(_X.shape[1])), \"la colonne de fréquence doit valoir 0 pour rare, 1 pour mensuelle et 2 pour hebdomadaire (donnez l'ordre avec categories=)\"",
        "_N = np.asarray(preprocesseur.transform(nouveaux), dtype=float)",
        "assert _N.shape == (2, _X.shape[1]) and not np.isnan(_N).any(), \"le préprocesseur doit accepter un quartier jamais vu (« Est ») et un âge manquant, sans erreur ni valeur manquante en sortie\"",
      ),
      hint: "Trois branches, ('num', Pipeline([...]), [...]), ('nom', ...) et ('ord', ...). Pour l'ordinal : OrdinalEncoder(categories=[['rare', 'mensuelle', 'hebdomadaire']]).",
    },
    {
      kind: "text",
      md: `### D'autres transformeurs, et un cas où l'échelle décide de tout

Quelques transformeurs répondent à des situations particulières :

- \`Normalizer\` agit **ligne par ligne** et non colonne par colonne : il divise chaque ligne par sa norme, de sorte que chaque observation devienne un vecteur de longueur 1. Utile quand seule la **direction** compte (comparaison de textes par similarité cosinus, par exemple) ;
- \`MaxAbsScaler\` divise chaque colonne par sa plus grande valeur absolue. Comme il ne soustrait rien, **les zéros restent des zéros** : une matrice creuse reste creuse, alors qu'un centrage la remplirait ;
- \`FunctionTransformer\` enveloppe une fonction de votre choix (\`np.log1p\`, une racine carrée, un calcul métier) pour qu'elle se glisse dans un \`Pipeline\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import sparse",
        "from sklearn.preprocessing import FunctionTransformer, MaxAbsScaler, Normalizer, StandardScaler",
        "",
        "A = np.array([[3.0, 4.0], [1.0, 0.0], [0.0, 2.0]])",
        "N = Normalizer().fit_transform(A)",
        "print(N.round(3))",
        "print('longueur de chaque ligne :', np.linalg.norm(N, axis=1))",
        "",
        "rng = np.random.default_rng(0)",
        "dense = rng.poisson(0.3, size=(200, 50)).astype(float) * rng.integers(1, 6, size=(200, 50))",
        "creuse = sparse.csr_matrix(dense)",
        "print('valeurs non nulles avant :', creuse.nnz, 'sur', dense.size)",
        "sortie = MaxAbsScaler().fit_transform(creuse)",
        "print('MaxAbsScaler : reste creuse =', sparse.issparse(sortie), ', valeurs non nulles :', sortie.nnz)",
        "try:",
        "    StandardScaler().fit_transform(creuse)",
        "except ValueError as erreur:",
        "    print('StandardScaler refuse de centrer une matrice creuse :', type(erreur).__name__)",
        "print('après centrage d’un tableau ordinaire, valeurs non nulles :', np.count_nonzero(StandardScaler().fit_transform(dense)))",
        "",
        "log = FunctionTransformer(np.log1p, inverse_func=np.expm1)",
        "print('log1p de 0, 9 et 99 :', log.fit_transform(np.array([[0.0], [9.0], [99.0]])).round(3).ravel())",
      ),
      caption:
        "Après Normalizer, chaque ligne a une longueur de 1 (la première, [3, 4], devient [0,6 ; 0,8]). Sur une matrice de 200 lignes et 50 colonnes dont 2 656 valeurs sont non nulles, MaxAbsScaler garde exactement les mêmes 2 656 valeurs non nulles ; StandardScaler refuse de centrer une matrice creuse, et centrer un tableau ordinaire remplit presque tout (9 990 valeurs non nulles sur 10 000).",
    },
    {
      kind: "text",
      md: `### L'ACP : un transformeur qui dépend de l'échelle

L'**analyse en composantes principales** (ACP, \`PCA\`) est aussi un transformeur au sens de scikit-learn : \`fit\` cherche les directions qui portent le plus de variance, \`transform\` projette les données dessus. Comme elle compte la variance, une variable aux grandes valeurs peut en capter presque tout, simplement à cause de son unité. Mesurons-le sur le jeu wine, avant et après standardisation, puis regardons combien de composantes gardent 95 % de l'information dans un jeu d'images.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.datasets import load_digits, load_wine",
        "from sklearn.decomposition import PCA",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, _ = load_wine(return_X_y=True)",
        "brut = PCA().fit(X)",
        "standardise = PCA().fit(StandardScaler().fit_transform(X))",
        "print('part de variance de la 1re composante, sans mise à l’échelle :', brut.explained_variance_ratio_[0].round(4))",
        "print('part de variance de la 1re composante, après standardisation :', standardise.explained_variance_ratio_[0].round(4))",
        "print('variable la plus pesante de la 1re composante (sans échelle) : colonne', np.abs(brut.components_[0]).argmax(), ', poids', brut.components_[0][12].round(3))",
        "",
        "chiffres = load_digits().data",
        "acp = PCA(n_components=0.95).fit(chiffres)",
        "print('images de chiffres :', chiffres.shape[1], 'pixels ->', acp.n_components_, 'composantes pour 95 % de la variance')",
      ),
      caption:
        "Sans mise à l'échelle, la première composante porte 99,81 % de la variance : c'est la colonne 12, la proline (poids 1,000), qui s'étale sur 1 402 unités. Après standardisation, elle n'en porte plus que 36,2 % et les autres variables comptent. Sur les images de chiffres (64 pixels par image, tous sur la même échelle), 29 composantes suffisent pour garder 95 % de la variance : une réduction réelle, mesurée ici et non supposée.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une transformation n'est jamais gratuite : elle déplace de l'information. L'encodage one-hot multiplie les colonnes (pour un code postal, des milliers ; une alternative est l'encodage par la cible, `TargetEncoder`, disponible dans scikit-learn depuis la version 1.3, à manier avec la même prudence sur les fuites). Le quantile efface les distances, le logarithme exige des valeurs positives, l'ACP rend les colonnes difficiles à interpréter. Choisissez une transformation pour une raison que vous pouvez nommer, et vérifiez qu'elle améliore une mesure sur des données de validation : le module 6 s'y exerce.",
    },
  ],
  quiz: [
    {
      question: "Un QuantileTransformer appris sur l'entraînement reçoit en test une valeur plus grande que toutes celles de l'entraînement. Que devient-elle, en sortie uniforme ?",
      options: ["Un nombre supérieur à 1", "Exactement 1, la borne", "Une erreur", "0,5, la médiane"],
      correct: 1,
      explanation: "Les quantiles appris s'arrêtent au maximum d'entraînement : toute valeur au-delà est ramenée à la borne 1 (et celles en dessous du minimum à 0). C'est une des raisons de ne pas appliquer ce transformeur sans vérifier que les données futures ressemblent à celles d'entraînement.",
    },
    {
      question: "Pourquoi encoder une ville avec OneHotEncoder plutôt que Nantes = 0, Lyon = 1, Rennes = 2 ?",
      options: [
        "Pour économiser de la mémoire",
        "Parce que les entiers créent un ordre et des distances qui n'existent pas entre les villes",
        "Parce que scikit-learn refuse les entiers",
        "Pour que les colonnes sommées donnent 0",
      ],
      correct: 1,
      explanation: "Avec des entiers, un modèle linéaire traiterait Rennes comme deux fois Lyon. Une colonne par ville évite cet ordre arbitraire, au prix de plus de colonnes.",
    },
    {
      question: "OrdinalEncoder() reçoit les tailles S, M, L sans réglage. Quels codes donne-t-il ?",
      options: ["S = 0, M = 1, L = 2", "L = 0, M = 1, S = 2, ordre alphabétique", "Au hasard", "Il refuse des lettres"],
      correct: 1,
      explanation: "Par défaut, les catégories sont triées par ordre alphabétique : L, M, S. Pour imposer l'ordre voulu, on passe categories=[['S', 'M', 'L']].",
    },
    {
      question: "À quoi sert un ColumnTransformer ?",
      options: [
        "À appliquer un traitement différent à chaque groupe de colonnes, puis à rassembler les résultats",
        "À transformer les lignes en colonnes",
        "À remplacer le modèle final d'un pipeline",
        "À choisir automatiquement le meilleur scaler",
      ],
      correct: 0,
      explanation: "On y déclare par exemple : standardiser les colonnes numériques, encoder en one-hot les nominales, coder les ordinales. Il ne choisit rien tout seul : c'est vous qui répartissez les colonnes.",
    },
    {
      question: "Pourquoi standardise-t-on les variables avant une ACP sur des mesures d'unités différentes ?",
      options: [
        "Parce que l'ACP ne fonctionne pas sur des nombres décimaux",
        "Parce que l'ACP cherche la variance : une variable à grandes valeurs peut la capter presque seule, à cause de son unité",
        "Pour que l'ACP produise plus de composantes",
        "Il ne faut jamais le faire",
      ],
      correct: 1,
      explanation: "Sur wine, sans mise à l'échelle, la première composante portait 99,81 % de la variance totale et se confondait presque avec la proline ; après standardisation, elle n'en porte plus que 36,2 %. Si toutes les variables ont la même unité (des pixels), la standardisation n'est pas toujours nécessaire.",
    },
  ],
};
