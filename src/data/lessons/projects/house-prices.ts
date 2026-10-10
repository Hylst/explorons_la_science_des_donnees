import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * 1000 logements fictifs d'une ville inventée, fabriqués par une formule connue (graine fixe) :
 * le prix au m² baisse avec la distance au centre, six quartiers ont une prime, l'étage plafonne, l'époque de construction joue, plus un bruit de 7 %.
 * `prix_sans_bruit` garde le prix avant le bruit : il ne sert qu'à mesurer le plafond de ce qu'un modèle peut espérer, jamais à construire une variable.
 */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "",
  "def fabriquer_logements(n=1000, graine=2024):",
  "    # Ville inventée : centre en (0, 0), positions en km. Rien n'est mesuré, tout est fabriqué.",
  "    rng = np.random.default_rng(graine)",
  "    x_km = rng.normal(0, 3.5, n).round(2)",
  "    y_km = rng.normal(0, 3.5, n).round(2)",
  "    surface = np.clip(rng.lognormal(np.log(62), 0.38, n), 18, 200).round()",
  "    pieces = np.clip(np.round(surface / 24 + rng.normal(0, 0.6, n)), 1, 7).astype(int)",
  "    etage = rng.integers(0, 9, n)",
  "    annee = np.round(1900 + 124 * rng.beta(2.5, 1.8, n)).astype(int)",
  "",
  "    # six quartiers aux centres inventés (x, y, prime sur le prix) ; chaque logement va au centre le plus proche, frontière floue",
  "    quartiers = {",
  "        'Vieille Ville': (0.0, 0.5, 1.10), 'Les Berges': (3.0, -2.0, 1.18), 'Gare': (-2.5, 1.5, 0.95),",
  "        'Les Tilleuls': (-3.0, -4.0, 1.00), 'Faubourg Est': (5.0, 3.0, 0.88), 'Hauts-Prés': (-1.0, 6.0, 0.86),",
  "    }",
  "    noms = list(quartiers)",
  "    centres = np.array([quartiers[q][:2] for q in noms])",
  "    position = np.column_stack([x_km, y_km]) + rng.normal(0, 0.8, (n, 2))",
  "    proche = np.argmin(((position[:, None, :] - centres[None, :, :]) ** 2).sum(axis=2), axis=1)",
  "    quartier = np.array(noms)[proche]",
  "    prime = np.array([quartiers[q][2] for q in quartier])",
  "",
  "    # le prix : une formule connue, puis un bruit",
  "    distance = np.hypot(x_km, y_km)",
  "    base_m2 = 1700 + 2300 * np.exp(-distance / 4.0)  # le prix au m² baisse avec la distance au centre",
  "    effet_surface = (surface / 60) ** -0.10  # les grandes surfaces coûtent un peu moins cher au m²",
  "    par_etage = np.where(quartier == 'Les Berges', 0.06 * np.minimum(etage, 6), 0.025 * np.minimum(etage, 4))  # bonus d'étage qui plafonne, plus fort aux Berges (vue sur le fleuve)",
  "    epoque = np.select([annee < 1948, annee < 1990, annee < 2010], [1.04, 0.93, 1.00], default=1.10)",
  "    prix_sans_bruit = surface * base_m2 * prime * effet_surface * (1 + par_etage) * epoque",
  "    prix = np.round(prix_sans_bruit * rng.lognormal(0, 0.07, n), -3)  # bruit multiplicatif de 7 %, prix arrondi au millier d'euros",
  "",
  "    logements = pd.DataFrame({'surface': surface, 'pieces': pieces, 'etage': etage, 'annee_construction': annee,",
  "                              'x_km': x_km, 'y_km': y_km, 'quartier': quartier, 'prix': prix})",
  "    return logements, prix_sans_bruit",
  "",
  "logements, prix_sans_bruit = fabriquer_logements()",
);

/** Les caractéristiques (X) et le prix à estimer (y) */
const ENTREES = lines("X = logements.drop(columns='prix')", "y = logements['prix']");

/** Découpage entraînement / test (étape 2) : 750 logements pour apprendre, 250 pour tester */
const DECOUPAGE = lines(
  DONNEES,
  "from sklearn.model_selection import train_test_split",
  "from sklearn.metrics import mean_absolute_error",
  "",
  ENTREES,
  "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)",
);

/** Le modèle linéaire de l'étape 3 : préparation des colonnes (quartier en indicatrices, nombres mis à l'échelle) */
const PREPARATION = lines(
  "from sklearn.compose import ColumnTransformer",
  "from sklearn.pipeline import Pipeline",
  "from sklearn.preprocessing import OneHotEncoder, StandardScaler",
  "from sklearn.linear_model import LinearRegression",
  "",
  "nombres = ['surface', 'pieces', 'etage', 'annee_construction', 'x_km', 'y_km']",
  "preparation = ColumnTransformer([",
  "    ('quartier', OneHotEncoder(handle_unknown='ignore'), ['quartier']),",
  "    ('nombres', StandardScaler(), nombres),",
  "])",
);

/** Variables construites à partir des seules colonnes décrivant le logement (étape 4) */
const VARIABLES = lines(
  "def ajouter_variables(df):",
  "    # n'utilise que les colonnes qui décrivent le logement, jamais le prix",
  "    out = df.copy()",
  "    out['distance_centre'] = np.hypot(out['x_km'], out['y_km'])",
  "    out['log_surface'] = np.log(out['surface'])",
  "    out['epoque'] = pd.cut(out['annee_construction'], [1899, 1949, 1989, 2009, 2024],",
  "                           labels=['avant 1950', '1950-1989', '1990-2009', 'depuis 2010']).astype(str)",
  "    return out",
);

/** Variables construites : les tableaux enrichis de l'entraînement et du test (étapes 4 à 7) */
const BASE_MODELES = lines(
  DECOUPAGE,
  "",
  VARIABLES,
  "Xa_train, Xa_test = ajouter_variables(X_train), ajouter_variables(X_test)",
);

/** Deux familles de modèles, construites par des fonctions pour pouvoir les comparer (étapes 5 à 7) */
const FONCTIONS = lines(
  "from sklearn.compose import ColumnTransformer, TransformedTargetRegressor",
  "from sklearn.pipeline import Pipeline",
  "from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler",
  "from sklearn.linear_model import LinearRegression",
  "from sklearn.ensemble import HistGradientBoostingRegressor",
  "",
  "# les variables retenues pour le modèle linéaire à l'étape 4",
  "CATEGORIES = ['quartier', 'epoque']",
  "NOMBRES = ['log_surface', 'pieces', 'etage', 'distance_centre']",
  "",
  "def lineaire(categories, nombres):",
  "    # régression linéaire sur le logarithme du prix ; TransformedTargetRegressor revient aux euros tout seul",
  "    prep = ColumnTransformer([('cat', OneHotEncoder(handle_unknown='ignore'), categories), ('nombres', StandardScaler(), nombres)])",
  "    return TransformedTargetRegressor(regressor=Pipeline([('prep', prep), ('reg', LinearRegression())]), func=np.log, inverse_func=np.exp)",
  "",
  "def boosting(**options):",
  "    # les arbres lisent la surface et l'année telles quelles, sans logarithme ; la colonne 0 (quartier) est une catégorie",
  "    prep = ColumnTransformer([",
  "        ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), ['quartier']),",
  "        ('nombres', 'passthrough', ['surface', 'pieces', 'etage', 'annee_construction', 'distance_centre']),",
  "    ])",
  "    reg = HistGradientBoostingRegressor(categorical_features=[0], random_state=0, **options)",
  "    return TransformedTargetRegressor(regressor=Pipeline([('prep', prep), ('reg', reg)]), func=np.log, inverse_func=np.exp)",
);

/** Tout ce qui précède, pour les exemples et exercices qui s'appuient sur les deux familles de modèles */
const MODELES = lines(BASE_MODELES, "", FONCTIONS);

/** Le modèle linéaire enrichi, ajusté sur l'entraînement, et le tableau de ses erreurs sur le test (étape 6) */
const BILAN = lines(
  MODELES,
  "",
  "modele = lineaire(CATEGORIES, NOMBRES).fit(Xa_train, y_train)",
  "bilan = pd.DataFrame({'quartier': X_test['quartier'], 'prix': y_test, 'prevu': modele.predict(Xa_test)})",
  "bilan['erreur'] = bilan['prevu'] - bilan['prix']  # positive : le modèle surestime",
);

export const projectHousePrices: LessonModule = {
  id: "intermediate-2",
  title: "Projet guidé : estimer le prix d'un logement",
  duration: "3 h 30",
  summary: "Estimer le prix de 1000 logements fictifs : explorer, découper honnêtement, partir d'une référence, passer par le logarithme, construire des variables, comparer régression linéaire et boosting par validation croisée, puis lire les erreurs.",
  objectives: [
    "Explorer un jeu de données de logements : distribution des prix, cartes, effets de la surface, de la distance et du quartier",
    "Découper les données et mesurer un modèle contre une référence simple, en euros",
    "Construire des variables sans jamais utiliser la valeur à estimer, et mesurer ce qu'elles apportent",
    "Comparer des modèles par validation croisée, puis lire les erreurs par quartier avant de conclure",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Une agence immobilière d'une ville moyenne voudrait **estimer le prix d'un logement** à partir de ses caractéristiques. La valeur à estimer, le prix en euros, est un nombre : c'est un problème de **régression**. Le projet suit la démarche d'un vrai travail : explorer, découper les données honnêtement, partir d'une référence simple, construire des variables, comparer des modèles, puis lire les erreurs avant de conclure.

Les données sont **entièrement inventées** : 1000 logements d'une ville imaginaire, fabriqués par une fonction Python à graine fixe. Rien n'est téléchargé et rien ne vient d'une vraie ville. Chaque logement est décrit par huit colonnes :

- \`surface\` (en m²), \`pieces\`, \`etage\` et \`annee_construction\` ;
- \`x_km\` et \`y_km\` : sa position en kilomètres, le centre de la ville étant le point (0, 0) ;
- \`quartier\` : l'un des six quartiers ;
- \`prix\` : le prix de vente en euros, la valeur à estimer.

Le prix est calculé par une **formule connue**, puis brouillé :

- le prix de base au m² baisse quand on s'éloigne du centre, de 4 000 euros au centre vers 1 700 loin du centre ;
- chaque quartier a une prime ou une décote, de -14 % à +18 % ;
- les grandes surfaces coûtent un peu moins cher au m² (environ 7 % de moins pour 120 m² que pour 60 m²) ;
- chaque étage ajoute quelques pour cent, jusqu'à un plafond, et davantage aux Berges, un quartier fictif au bord d'un fleuve ;
- l'époque de construction joue sans suivre l'âge : avant 1948, +4 % ; de 1948 à 1989, -7 % ; de 1990 à 2009, aucun effet ; depuis 2010, +10 % ;
- un bruit aléatoire de 7 % représente tout ce que la formule ne dit pas.

Connaître la formule n'a rien de réaliste, mais cela permet de **vérifier ce que les modèles retrouvent**, et de mesurer à la fin ce qu'aucun modèle ne peut faire mieux : le bruit. Avec de vraies ventes, il n'y a pas de formule. Il y a des erreurs de saisie, des biens atypiques, et des informations que l'on n'a pas : état intérieur, vue, bruit de la rue. Les graines sont fixées partout : vous devriez retrouver les nombres du texte, à l'arrondi près.`,
    },
    {
      kind: "text",
      md: `### Étape 1 : explorer

Avant tout modèle, on regarde. \`describe()\` donne l'échelle de chaque colonne, un histogramme montre la forme de la distribution du prix, un nuage de points le lien avec la surface. Le code qui fabrique les données est affiché en entier la première fois, pour que rien ne reste caché ; ensuite, \`logements\` et \`prix_sans_bruit\` sont déjà prêts.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "pd.set_option('display.width', 100)",
        "pd.set_option('display.max_columns', 20)",
        "print(logements.head())",
        "print(logements.describe().round(1))",
        "print(logements['quartier'].value_counts())",
        "print('asymétrie du prix :', round(logements['prix'].skew(), 2), ', du logarithme du prix :', round(np.log(logements['prix']).skew(), 2))",
        "",
        "fig, axes = plt.subplots(1, 3, figsize=(10, 3.4))",
        "axes[0].hist(logements['prix'] / 1000, bins=30)",
        "axes[0].set_xlabel('prix (k€)')",
        "axes[1].hist(np.log(logements['prix']), bins=30)",
        "axes[1].set_xlabel('logarithme du prix')",
        "axes[2].scatter(logements['surface'], logements['prix'] / 1000, s=8)",
        "axes[2].set_xlabel('surface (m²)')",
        "axes[2].set_ylabel('prix (k€)')",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Le prix médian est de 172 500 euros et la moyenne de 188 784 : quelques logements chers tirent la moyenne vers le haut, et l'asymétrie du prix est de 1,21. Le logarithme du prix donne une cloche presque symétrique (asymétrie de -0,04). Le nuage de la surface s'ouvre en éventail : plus la surface est grande, plus les prix sont dispersés, la surface seule ne suffit donc pas. Les six quartiers comptent de 93 à 215 logements.",
    },
    {
      kind: "code",
      language: "python",
      setup: DONNEES,
      code: lines(
        "prix_m2 = logements['prix'] / logements['surface']",
        "distance = np.hypot(logements['x_km'], logements['y_km'])",
        "print('corrélation entre la distance au centre et le prix au m² :', round(distance.corr(prix_m2), 2))",
        "print(prix_m2.groupby(pd.cut(distance, [0, 2, 4, 6, 8, 20]), observed=True).median().round(0))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(10, 4))",
        "points = axes[0].scatter(logements['x_km'], logements['y_km'], c=prix_m2, s=12, cmap='viridis')",
        "fig.colorbar(points, ax=axes[0], label='prix au m² (€)')",
        "axes[0].set_aspect('equal')",
        "axes[0].set_xlabel('x (km)')",
        "axes[0].set_ylabel('y (km)')",
        "axes[1].scatter(distance, prix_m2, s=8)",
        "axes[1].set_xlabel('distance au centre (km)')",
        "axes[1].set_ylabel('prix au m² (€)')",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Le prix au m² est le plus élevé près du centre et baisse en s'éloignant : la corrélation avec la distance est de -0,69. Par tranche de distance, la médiane passe de 3 891 euros le m² à moins de 2 km à 1 944 au-delà de 8 km. Le nuage de droite se courbe plus qu'il ne s'aligne : la baisse est rapide près du centre, puis ralentit (-760 euros entre les deux premières tranches, -243 entre les deux dernières). C'est un détail qui comptera pour un modèle linéaire.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `prix_m2`, le prix au m² de chaque logement (le prix divisé par la surface), puis `par_quartier`, la **médiane du prix au m² par quartier** (une série pandas indexée par le nom du quartier). Rangez dans `quartier_cher` le nom du quartier où cette médiane est la plus élevée.",
      setup: DONNEES,
      starter: lines("prix_m2 = None", "par_quartier = None", "quartier_cher = None"),
      solution: lines(
        "prix_m2 = logements['prix'] / logements['surface']",
        "par_quartier = prix_m2.groupby(logements['quartier']).median()",
        "quartier_cher = par_quartier.idxmax()",
        "print(par_quartier.round(0).sort_values())",
        "print('quartier le plus cher :', quartier_cher)",
      ),
      test: lines(
        "assert prix_m2 is not None and len(prix_m2) == 1000, \"prix_m2 doit contenir une valeur par logement (1000 au total), obtenue en divisant le prix par la surface\"",
        "assert np.allclose(prix_m2, logements['prix'] / logements['surface']), \"prix_m2 doit valoir le prix divisé par la surface\"",
        "assert isinstance(par_quartier, pd.Series) and len(par_quartier) == 6, \"par_quartier doit être une série de 6 valeurs, une par quartier\"",
        "_attendu = (logements['prix'] / logements['surface']).groupby(logements['quartier']).median()",
        "assert np.allclose(par_quartier.sort_index(), _attendu.sort_index()), \"par_quartier doit être la médiane du prix au m² de chaque quartier (groupby, puis median)\"",
        "assert quartier_cher == _attendu.idxmax(), f\"quartier_cher doit être le quartier de la plus forte médiane (vous avez {quartier_cher})\"",
      ),
      hint: "prix_m2.groupby(logements['quartier']).median() donne une valeur par quartier ; .idxmax() renvoie le nom du quartier où elle est maximale.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Les médianes vont de 2 080 euros le m² aux Hauts-Prés à 3 612 à la Vieille Ville, le quartier du centre. Attention à ne pas lire trop vite : les quartiers chers sont aussi les plus proches du centre, la prime du quartier et l'effet de la distance se mêlent. Les graphiques donnent des pistes, c'est la comparaison de modèles qui départagera.",
    },
    {
      kind: "text",
      md: `### Étape 2 : découper honnêtement, partir d'une référence

Un modèle se juge sur des logements qu'il n'a jamais vus. On met de côté 25 % des logements, le **jeu de test**, on apprend sur les 75 % restants, l'**entraînement**, et on ne regarde le test que pour mesurer. Le tirage est aléatoire, fixé par \`random_state=0\`. Ici, les logements ne sont pas classés dans le temps, un tirage au hasard convient ; pour des ventes datées, on découperait plutôt dans le temps.

L'erreur se mesure par l'**erreur absolue moyenne** (MAE) : l'écart moyen, en euros, entre le prix prévu et le prix réel. Elle se lit directement : « on se trompe de tant d'euros en moyenne ».

Avant tout modèle, une **référence** : estimer le prix d'un logement en multipliant sa surface par le prix médian au m² des logements d'entraînement. Aucun apprentissage, seulement une règle de métier. Un modèle ne vaut que par ce qu'il apporte au-delà. Un piège à éviter : la médiane se calcule sur l'entraînement seul. La calculer sur tous les logements ferait entrer le test dans la référence.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`X` (les caractéristiques des logements) et `y` (leur prix) sont prêts. Séparez-les en entraînement et test avec `train_test_split` : **25 % pour le test**, `random_state=0`. Calculez ensuite la **référence** : `prix_m2_ref` est la médiane du prix au m² des logements d'**entraînement** ; la prévision de chaque logement du test est `prix_m2_ref` multiplié par sa surface. Rangez dans `mae_ref` l'erreur absolue moyenne de cette prévision, en euros.",
      setup: lines(DONNEES, ENTREES),
      starter: lines(
        "from sklearn.model_selection import train_test_split",
        "from sklearn.metrics import mean_absolute_error",
        "",
        "X_train = X_test = y_train = y_test = None",
        "prix_m2_ref = None",
        "mae_ref = None",
      ),
      solution: lines(
        "from sklearn.model_selection import train_test_split",
        "from sklearn.metrics import mean_absolute_error",
        "",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)",
        "prix_m2_ref = (y_train / X_train['surface']).median()",
        "prevu_ref = prix_m2_ref * X_test['surface']",
        "mae_ref = mean_absolute_error(y_test, prevu_ref)",
        "print(len(X_train), 'logements pour apprendre,', len(X_test), 'pour tester')",
        "print('prix au m² de référence :', round(prix_m2_ref), '€ ; MAE de la référence :', round(mae_ref), '€')",
      ),
      test: lines(
        "from sklearn.model_selection import train_test_split as _tts",
        "assert X_train is not None and len(X_train) == 750 and len(X_test) == 250, \"le test doit contenir 25 % des logements : 750 pour l'entraînement, 250 pour le test\"",
        "assert 'prix' not in X_train.columns, \"X_train ne doit pas contenir la colonne prix : c'est la valeur à estimer\"",
        "_a, _b, _c, _d = _tts(X, y, test_size=0.25, random_state=0)",
        "assert list(X_train.index) == list(_a.index) and list(X_test.index) == list(_b.index), \"utilisez train_test_split(X, y, test_size=0.25, random_state=0), pour retrouver les mêmes logements et les mêmes nombres que le cours\"",
        "assert list(y_train.index) == list(X_train.index) and list(y_test.index) == list(X_test.index), \"y_train et y_test doivent correspondre aux mêmes logements que X_train et X_test\"",
        "_ref = (_c / _a['surface']).median()",
        "assert prix_m2_ref is not None and abs(prix_m2_ref - _ref) < 1e-6, \"prix_m2_ref doit être la médiane du prix au m² des logements d'entraînement (pas de tous les logements)\"",
        "_mae = np.mean(np.abs(_d - _ref * _b['surface']))",
        "assert mae_ref is not None and abs(mae_ref - _mae) < 1e-6, f\"mae_ref doit être la moyenne des écarts absolus entre le prix réel du test et prix_m2_ref x surface (vous avez {mae_ref})\"",
      ),
      hint: "train_test_split(X, y, test_size=0.25, random_state=0) renvoie X_train, X_test, y_train, y_test dans cet ordre. Le prix au m² se calcule sur l'entraînement : (y_train / X_train['surface']).median(). Puis mean_absolute_error(y_test, prix_m2_ref * X_test['surface']).",
    },
    {
      kind: "note",
      tone: "info",
      md: "La référence se trompe de 42 875 euros en moyenne, soit un peu plus de 22 % du prix moyen (188 784 euros). Elle sera le point de comparaison de tous les modèles suivants.",
    },
    {
      kind: "text",
      md: `### Étape 3 : une régression linéaire

Une **régression linéaire** estime le prix comme une somme de contributions : chaque variable est multipliée par un coefficient appris sur l'entraînement. Deux préparations sont nécessaires. Le quartier, qui est un texte, devient des colonnes de 0 et de 1 avec \`OneHotEncoder\` (une colonne par quartier). Les nombres sont mis à la même échelle avec \`StandardScaler\`. Tout est assemblé dans un **\`Pipeline\`** : la préparation est apprise sur l'entraînement seul, puis appliquée à l'identique au test, sans que le test influence le moindre calcul.

Le premier modèle apprend sur le prix brut, avec les variables telles qu'elles sont. À partir de cet exemple, \`X_train\`, \`X_test\`, \`y_train\` et \`y_test\` sont déjà prêts.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        PREPARATION,
        "",
        "modele = Pipeline([('preparation', preparation), ('regression', LinearRegression())])",
        "modele.fit(X_train, y_train)",
        "prevu = modele.predict(X_test)",
        "print('MAE du modèle linéaire sur le prix brut :', round(mean_absolute_error(y_test, prevu)), '€')",
        "print('erreur relative médiane :', round(float(np.median(np.abs(prevu - y_test) / y_test)), 3))",
        "print('plus petite prévision :', round(prevu.min()), '€ ; prévisions négatives :', int((prevu < 0).sum()))",
      ),
      caption: "Le modèle linéaire se trompe de 28 557 euros en moyenne sur le test, contre 42 875 pour la référence. L'erreur relative médiane est de 13,7 %. Les prévisions restent positives (la plus petite est de 41 084 euros), mais rien dans une régression linéaire ne l'y oblige.",
    },
    {
      kind: "text",
      md: `Un prix est positif et asymétrique, et ses écarts sont plutôt proportionnels : se tromper de 20 000 euros n'a pas la même gravité sur un logement à 80 000 euros et sur un logement à 500 000. De plus, la formule du prix **multiplie** des effets : surface, distance, prime de quartier, époque. Le **logarithme** transforme un produit en somme : \`log(a × b) = log(a) + log(b)\`. Une régression linéaire sur le logarithme du prix est donc un modèle de pourcentages, qui convient mieux à ce problème. On apprend sur \`np.log(y_train)\`, le modèle prédit un logarithme, et \`np.exp\` ramène la prévision en euros. L'erreur se calcule toujours en euros, sur les vrais prix.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`preparation` (le même traitement des colonnes que ci-dessus) est prêt. Construisez `modele_log`, un `Pipeline` qui enchaîne `preparation` et une `LinearRegression`, et entraînez-le sur le **logarithme** du prix d'entraînement. Rangez dans `prevu_log` ses prévisions pour `X_test`, **revenues en euros**, et dans `mae_log` leur erreur absolue moyenne par rapport à `y_test`.",
      setup: lines(DECOUPAGE, PREPARATION),
      starter: lines("modele_log = None", "prevu_log = None", "mae_log = None"),
      solution: lines(
        "modele_log = Pipeline([('preparation', preparation), ('regression', LinearRegression())])",
        "modele_log.fit(X_train, np.log(y_train))",
        "prevu_log = np.exp(modele_log.predict(X_test))",
        "mae_log = mean_absolute_error(y_test, prevu_log)",
        "print('MAE sur le logarithme du prix, ramenée en euros :', round(mae_log), '€')",
        "print('erreur relative médiane :', round(float(np.median(np.abs(prevu_log - y_test) / y_test)), 3))",
      ),
      test: lines(
        "from sklearn.base import clone as _clone",
        "assert modele_log is not None and hasattr(modele_log, 'predict'), \"modele_log doit être un Pipeline entraîné (preparation, puis LinearRegression)\"",
        "assert prevu_log is not None and len(prevu_log) == 250, \"prevu_log doit contenir une prévision par logement du test (250)\"",
        "_m = Pipeline([('preparation', _clone(preparation)), ('regression', LinearRegression())]).fit(X_train, np.log(y_train))",
        "_p = np.exp(_m.predict(X_test))",
        "assert np.all(np.asarray(prevu_log) > 1000), \"les prévisions doivent être en euros : passez par np.exp pour revenir du logarithme\"",
        "assert np.allclose(prevu_log, _p, rtol=1e-6), \"le modèle doit être entraîné sur np.log(y_train), et ses prévisions ramenées en euros avec np.exp\"",
        "assert mae_log is not None and abs(mae_log - mean_absolute_error(y_test, _p)) < 1e-3, \"mae_log doit être l'erreur absolue moyenne de prevu_log (en euros) par rapport à y_test\"",
      ),
      hint: "Pipeline([('preparation', preparation), ('regression', LinearRegression())]), puis .fit(X_train, np.log(y_train)). Les prévisions sont des logarithmes : np.exp(modele_log.predict(X_test)) les ramène en euros.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Sur ces variables brutes, le logarithme change peu : l'erreur passe de 28 557 à 28 192 euros, et l'erreur relative médiane de 13,7 % à 13,0 %. Son intérêt apparaît quand les variables sont bien choisies : l'étape 4 le montre.",
    },
    {
      kind: "text",
      md: `### Étape 4 : construire des variables, sans tricher

Les colonnes fournies ne sont pas figées : on peut en construire d'autres. Une règle domine toutes les autres : **une variable doit être connue au moment où l'on estime, sans connaître le prix**. La tentation classique est le prix au m². Il est précieux pour explorer, car il compare des logements de tailles différentes, mais c'est le prix divisé par la surface : s'en servir pour estimer le prix revient à donner la réponse au modèle. C'est une **fuite d'information** (en anglais, \`data leakage\`). L'exemple suivant le fait exprès, pour que vous reconnaissiez le symptôme.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        PREPARATION,
        "",
        "# ATTENTION : ce qu'il ne faut pas faire. Le prix au m² contient le prix, c'est-à-dire la réponse.",
        "fuite_train = X_train.assign(prix_m2=y_train / X_train['surface'])",
        "fuite_test = X_test.assign(prix_m2=y_test / X_test['surface'])",
        "preparation_fuite = ColumnTransformer([",
        "    ('quartier', OneHotEncoder(handle_unknown='ignore'), ['quartier']),",
        "    ('nombres', StandardScaler(), nombres + ['prix_m2']),",
        "])",
        "modele = Pipeline([('preparation', preparation_fuite), ('regression', LinearRegression())])",
        "modele.fit(fuite_train, np.log(y_train))",
        "prevu = np.exp(modele.predict(fuite_test))",
        "print('MAE avec la fuite :', round(mean_absolute_error(y_test, prevu)), '€')",
      ),
      caption: "En ajoutant le prix au m², l'erreur est presque divisée par deux (de 28 192 à 14 819 euros) sans que le modèle ait rien appris sur les logements : il lit la réponse. Pour un logement que l'on veut estimer, le prix au m² n'existe pas, puisque c'est le prix que l'on cherche : ce modèle est inutilisable. Un gain soudain et énorme est un signal d'alerte : demandez-vous d'abord si la variable contient la réponse.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une autre fuite, plus discrète : calculer une moyenne, une médiane ou une mise à l'échelle sur **tous** les logements avant de découper. Le test influence alors la préparation. C'est une raison d'utiliser un Pipeline : la préparation est apprise sur l'entraînement seul, à chaque fois.",
    },
    {
      kind: "text",
      md: `Les variables honnêtes se construisent à partir des seules colonnes qui décrivent le logement.

- **La distance au centre.** Une régression linéaire ne sait qu'additionner des multiples de \`x_km\` et de \`y_km\` : elle trace une droite, jamais un cercle autour du centre. La distance, racine de x² + y², fait ce travail à sa place.
- **Le logarithme de la surface.** Si les effets se multiplient, le logarithme du prix est une somme de logarithmes : la surface doit entrer elle aussi en logarithme.
- **L'époque de construction.** Le prix au m² ne varie pas régulièrement avec l'âge du logement. On découpe l'année en quatre périodes (voir l'exemple qui suit l'exercice).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Complétez `ajouter_variables(df)` : elle renvoie une **copie** de `df` avec deux colonnes de plus. `distance_centre` est la distance en km entre le logement et le centre de la ville, de coordonnées (0, 0), calculée avec `x_km` et `y_km`. `log_surface` est le logarithme népérien de la surface. La fonction ne doit pas utiliser le prix.",
      setup: DECOUPAGE,
      starter: lines("def ajouter_variables(df):", "    out = df.copy()", "    return out"),
      solution: lines(
        "def ajouter_variables(df):",
        "    out = df.copy()",
        "    out['distance_centre'] = np.hypot(out['x_km'], out['y_km'])",
        "    out['log_surface'] = np.log(out['surface'])",
        "    return out",
        "",
        "essai = ajouter_variables(X_train)",
        "print(essai[['surface', 'log_surface', 'x_km', 'y_km', 'distance_centre']].head(3).round(2))",
      ),
      test: lines(
        "_t = ajouter_variables(X_train)",
        "assert 'distance_centre' in _t.columns, \"la fonction doit ajouter une colonne distance_centre\"",
        "assert np.allclose(_t['distance_centre'], np.hypot(X_train['x_km'], X_train['y_km'])), \"distance_centre est la distance au point (0, 0) : racine de x_km au carré plus y_km au carré (np.hypot)\"",
        "assert 'log_surface' in _t.columns, \"la fonction doit ajouter une colonne log_surface\"",
        "assert np.allclose(_t['log_surface'], np.log(X_train['surface'])), \"log_surface est le logarithme népérien de la surface (np.log)\"",
        "assert len(_t) == len(X_train) and 'distance_centre' not in X_train.columns, \"la fonction doit renvoyer une copie : X_train lui-même ne doit pas être modifié\"",
        "assert not any('prix' in c for c in _t.columns), \"aucune colonne ne doit venir du prix\"",
        "_u = ajouter_variables(X_test.iloc[:5])",
        "assert len(_u) == 5, \"la fonction doit marcher sur n'importe quel tableau de logements, y compris sans le prix\"",
      ),
      hint: "np.hypot(df['x_km'], df['y_km']) donne la distance au point (0, 0) ; np.log(df['surface']) le logarithme népérien. Travaillez sur out = df.copy() pour ne pas modifier le tableau d'origine.",
    },
    {
      kind: "text",
      md: `Chaque variable construite a-t-elle servi ? Le code suivant les ajoute une à une, avec la fonction complète \`ajouter_variables\` (elle ajoute aussi l'époque de construction, en quatre périodes). Il compare deux façons d'apprendre : sur le prix brut et sur son logarithme. Le modèle est évalué sur le test à chaque étape, ce qui est acceptable pour quatre variantes décidées d'avance ; pour en comparer beaucoup, il faut la validation croisée, objet de l'étape suivante.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        VARIABLES,
        "from sklearn.compose import ColumnTransformer, TransformedTargetRegressor",
        "from sklearn.pipeline import Pipeline",
        "from sklearn.preprocessing import OneHotEncoder, StandardScaler",
        "from sklearn.linear_model import LinearRegression",
        "",
        "Xa_train, Xa_test = ajouter_variables(X_train), ajouter_variables(X_test)",
        "",
        "# le prix au m² des logements d'entraînement selon l'époque : calculé pour regarder, pas pour être une variable",
        "ordre = ['avant 1950', '1950-1989', '1990-2009', 'depuis 2010']",
        "print((y_train / X_train['surface']).groupby(Xa_train['epoque']).median().reindex(ordre).round(0))",
        "",
        "etapes = {",
        "    'variables brutes': (['quartier'], ['surface', 'pieces', 'etage', 'annee_construction', 'x_km', 'y_km']),",
        "    '+ distance au centre': (['quartier'], ['surface', 'pieces', 'etage', 'annee_construction', 'distance_centre']),",
        "    '+ logarithme de la surface': (['quartier'], ['log_surface', 'pieces', 'etage', 'annee_construction', 'distance_centre']),",
        "    '+ époque de construction': (['quartier', 'epoque'], ['log_surface', 'pieces', 'etage', 'distance_centre']),",
        "}",
        "for nom, (categories, nombres) in etapes.items():",
        "    prep = ColumnTransformer([('cat', OneHotEncoder(handle_unknown='ignore'), categories), ('nombres', StandardScaler(), nombres)])",
        "    maes = []",
        "    for func, inverse in [(None, None), (np.log, np.exp)]:  # prix brut, puis logarithme du prix",
        "        modele = TransformedTargetRegressor(regressor=Pipeline([('prep', prep), ('reg', LinearRegression())]), func=func, inverse_func=inverse)",
        "        modele.fit(Xa_train, y_train)",
        "        maes.append(round(mean_absolute_error(y_test, modele.predict(Xa_test))))",
        "    print(nom.ljust(28), 'MAE sur le prix brut :', maes[0], '€ ; sur le logarithme :', maes[1], '€')",
      ),
      caption: "Avec des variables brutes, le logarithme ne change presque rien (28 557 contre 28 192 euros). Ensuite, chaque variable construite fait baisser l'erreur sur le logarithme du prix : 19 841 euros avec la distance, 15 026 avec le logarithme de la surface, 12 451 avec l'époque, soit moins de la moitié de l'erreur de départ. Sur le prix brut, c'est autre chose : remplacer la surface par son logarithme dégrade le modèle (de 21 293 à 23 003 euros), car sans logarithme du prix la surface agit en ligne droite. Le bon traitement d'une variable dépend de la façon dont on traite le prix. Enfin, le prix médian au m² ne varie pas régulièrement avec l'époque : 2 791 euros avant 1950, 2 612 de 1950 à 1989, puis 3 063 et 3 067.",
    },
    {
      kind: "text",
      md: `### Étape 5 : un boosting, et une comparaison sérieuse

Un **boosting d'arbres** construit des arbres de décision l'un après l'autre, chacun corrigeant les erreurs des précédents. Il découpe lui-même la distance ou l'année en paliers, sans qu'on lui fournisse la bonne transformation, et il sait traiter des effets qui ne s'additionnent pas. scikit-learn propose \`HistGradientBoostingRegressor\`. XGBoost et LightGBM, très répandus, fonctionnent sur le même principe mais ne font pas partie du moteur de ce site.

Comparer deux modèles sur un seul découpage donne un chiffre qui dépend du tirage. On répète donc : la **validation croisée** (\`KFold\`) coupe l'entraînement en 5 plis, et chaque pli sert une fois de mini-test pendant que le modèle apprend sur les 4 autres. On obtient 5 erreurs, donc une moyenne **et une dispersion**. Le jeu de test reste fermé.

Deux détails dans l'exemple. \`TransformedTargetRegressor\` applique le logarithme avant l'apprentissage et l'exponentielle après la prévision : le modèle travaille en logarithme et renvoie des euros, comme à l'étape 3. Les arbres n'ont pas besoin du logarithme de la surface ni de mise à l'échelle (une transformation qui conserve l'ordre ne change pas leurs découpages) : on leur donne la surface telle quelle, et le quartier comme catégorie. À partir d'ici, \`ajouter_variables\`, \`Xa_train\` et \`Xa_test\` (les tableaux enrichis) sont déjà prêts.`,
    },
    {
      kind: "code",
      language: "python",
      setup: BASE_MODELES,
      code: lines(
        FONCTIONS,
        "from sklearn.model_selection import KFold, cross_val_score",
        "",
        "cv = KFold(n_splits=5, shuffle=True, random_state=0)",
        "candidats = {",
        "    'linéaire, variables brutes': lineaire(['quartier'], ['surface', 'pieces', 'etage', 'annee_construction', 'x_km', 'y_km']),",
        "    'linéaire, variables enrichies': lineaire(CATEGORIES, NOMBRES),",
        "    'boosting, réglage par défaut': boosting(),",
        "    'boosting, petits arbres': boosting(max_iter=150, learning_rate=0.1, max_leaf_nodes=8, min_samples_leaf=10),",
        "}",
        "for nom, modele in candidats.items():",
        "    erreurs = -cross_val_score(modele, Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "    print(nom.ljust(30), 'MAE', round(erreurs.mean()), '€ ; écart-type entre plis', round(erreurs.std()), '€')",
      ),
      caption: "Avec les variables brutes, le modèle linéaire se trompe de 27 206 euros en moyenne sur les plis, contre 12 966 avec les variables enrichies : le travail de l'étape 4 compte plus que le choix du modèle. Le boosting fait 14 693 euros avec son réglage par défaut et 13 292 avec des arbres plus petits (8 feuilles au plus, 150 arbres) : le réglage compte, et il se choisit lui aussi par validation croisée. Les deux meilleurs sont à moins de 330 euros l'un de l'autre, alors que l'écart-type entre plis est de 1 198 euros pour le modèle linéaire et de 1 384 pour le boosting.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les fonctions `lineaire(CATEGORIES, NOMBRES)` et `boosting(max_iter=150, learning_rate=0.1, max_leaf_nodes=8, min_samples_leaf=10)` construisent les deux modèles à comparer, et `Xa_train`, `y_train` sont prêts. Avec `cross_val_score` (`cv` fourni, `scoring='neg_mean_absolute_error'`), calculez l'erreur de chaque pli en euros (positive) : `erreurs_lin` pour le modèle linéaire et `erreurs_boost` pour le boosting, deux tableaux de 5 valeurs. Rangez dans `plis_boosting` le nombre de plis où le boosting se trompe **moins** que le linéaire, et dans `ecart_moyen` la moyenne de `erreurs_boost - erreurs_lin`.",
      setup: lines(MODELES, "from sklearn.model_selection import KFold, cross_val_score", "cv = KFold(n_splits=5, shuffle=True, random_state=0)"),
      starter: lines("erreurs_lin = None", "erreurs_boost = None", "plis_boosting = None", "ecart_moyen = None"),
      solution: lines(
        "options = dict(max_iter=150, learning_rate=0.1, max_leaf_nodes=8, min_samples_leaf=10)",
        "erreurs_lin = -cross_val_score(lineaire(CATEGORIES, NOMBRES), Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "erreurs_boost = -cross_val_score(boosting(**options), Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "plis_boosting = int((erreurs_boost < erreurs_lin).sum())",
        "ecart_moyen = float((erreurs_boost - erreurs_lin).mean())",
        "print('linéaire :', erreurs_lin.round(0))",
        "print('boosting :', erreurs_boost.round(0))",
        "print('plis gagnés par le boosting :', plis_boosting, 'sur 5 ; écart moyen :', round(ecart_moyen), '€')",
      ),
      test: lines(
        "assert erreurs_lin is not None and len(erreurs_lin) == 5, \"erreurs_lin doit contenir une erreur par pli (5 valeurs), donc le résultat de cross_val_score, changé de signe\"",
        "assert np.all(np.asarray(erreurs_lin) > 0) and np.all(np.asarray(erreurs_boost) > 0), \"les erreurs doivent être positives : cross_val_score renvoie l'opposé de l'erreur, mettez un signe moins devant\"",
        "_l = -cross_val_score(lineaire(CATEGORIES, NOMBRES), Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "_b = -cross_val_score(boosting(max_iter=150, learning_rate=0.1, max_leaf_nodes=8, min_samples_leaf=10), Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "assert np.allclose(erreurs_lin, _l, rtol=1e-6), \"erreurs_lin doit venir de lineaire(CATEGORIES, NOMBRES), sur Xa_train et y_train, avec le découpage cv fourni\"",
        "assert np.allclose(erreurs_boost, _b, rtol=1e-6), \"erreurs_boost doit venir de boosting(max_iter=150, learning_rate=0.1, max_leaf_nodes=8, min_samples_leaf=10), avec le même découpage cv\"",
        "assert plis_boosting == int((_b < _l).sum()), f\"plis_boosting compte les plis où l'erreur du boosting est plus petite que celle du linéaire (vous avez {plis_boosting})\"",
        "assert ecart_moyen is not None and abs(ecart_moyen - float((_b - _l).mean())) < 1e-3, \"ecart_moyen est la moyenne de erreurs_boost - erreurs_lin\"",
      ),
      hint: "-cross_val_score(modele, Xa_train, y_train, cv=cv, scoring='neg_mean_absolute_error') renvoie 5 erreurs positives. (erreurs_boost < erreurs_lin).sum() compte les plis gagnés ; (erreurs_boost - erreurs_lin).mean() donne l'écart moyen.",
    },
    {
      kind: "text",
      md: `Le boosting ne gagne que sur un pli sur cinq, de 438 euros. L'écart moyen est de 325 euros en faveur du modèle linéaire, alors que l'erreur d'un pli à l'autre varie de 11 000 à 14 900 euros environ : c'est trop petit pour désigner un vainqueur. Le modèle linéaire enrichi est au moins aussi bon, plus simple et plus facile à expliquer : **on le retient**. Cela tient aux données : la formule est un produit d'effets, donc une somme en logarithme, ce qui convient bien à une régression linéaire sur le logarithme du prix. Avec de vraies ventes et davantage d'interactions, le boosting peut prendre l'avantage. Seule une validation croisée sur les données que l'on a en main le dira.

### Étape 6 : lire les erreurs

Une MAE globale cache des différences entre logements. On ouvre le tableau des erreurs du modèle retenu, **sur le test**, avec trois mesures :

- l'**erreur** de chaque logement : le prix prévu moins le prix réel, positive quand le modèle surestime ;
- le **biais** d'un groupe : la moyenne de ces erreurs, qui dit si le modèle se trompe plutôt dans un sens ;
- l'**erreur relative** : la valeur absolue de l'erreur divisée par le prix réel, qui permet de comparer un petit logement à un grand.

\`bilan\` est déjà prêt : c'est le modèle linéaire enrichi, ajusté sur l'entraînement, avec ses prévisions pour les 250 logements du test.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`bilan` donne, pour chaque logement du test, son `quartier`, son `prix`, le prix `prevu` et l'`erreur` (prévu moins réel). Calculez `erreur_relative`, une série : la **valeur absolue de l'erreur divisée par le prix réel**. Rangez dans `par_quartier` sa **médiane par quartier**, et dans `quartier_difficile` le nom du quartier où elle est la plus élevée.",
      setup: BILAN,
      starter: lines("erreur_relative = None", "par_quartier = None", "quartier_difficile = None"),
      solution: lines(
        "erreur_relative = bilan['erreur'].abs() / bilan['prix']",
        "par_quartier = erreur_relative.groupby(bilan['quartier']).median()",
        "quartier_difficile = par_quartier.idxmax()",
        "print((par_quartier * 100).round(1).sort_values())",
        "print('quartier le plus difficile :', quartier_difficile)",
      ),
      test: lines(
        "_rel = (bilan['prevu'] - bilan['prix']).abs() / bilan['prix']",
        "assert erreur_relative is not None and len(erreur_relative) == 250, \"erreur_relative doit contenir une valeur par logement du test (250)\"",
        "assert np.allclose(erreur_relative, _rel), \"erreur_relative est la valeur absolue de l'erreur, divisée par le prix réel (pas par le prix prévu)\"",
        "assert isinstance(par_quartier, pd.Series) and len(par_quartier) == 6, \"par_quartier doit être une série de 6 valeurs, une par quartier\"",
        "_attendu = _rel.groupby(bilan['quartier']).median()",
        "assert np.allclose(par_quartier.sort_index(), _attendu.sort_index()), \"par_quartier doit être la médiane de l'erreur relative de chaque quartier\"",
        "assert quartier_difficile == _attendu.idxmax(), f\"quartier_difficile doit être le quartier de la plus forte médiane (vous avez {quartier_difficile})\"",
      ),
      hint: "bilan['erreur'].abs() / bilan['prix'], puis .groupby(bilan['quartier']).median() et .idxmax().",
    },
    {
      kind: "code",
      language: "python",
      setup: BILAN,
      code: lines(
        "bilan['erreur_relative'] = bilan['erreur'].abs() / bilan['prix']",
        "par_quartier = bilan.groupby('quartier').agg(",
        "    logements=('prix', 'size'),",
        "    mae=('erreur', lambda e: e.abs().mean()),",
        "    biais=('erreur', 'mean'),",
        "    erreur_relative_pct=('erreur_relative', lambda r: 100 * r.median()),",
        ")",
        "print(par_quartier.round(1))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(10, 4))",
        "axes[0].scatter(bilan['prix'] / 1000, bilan['prevu'] / 1000, s=10)",
        "axes[0].plot([40, 620], [40, 620], color='black', linewidth=1)",
        "axes[0].set_xlabel('prix réel (k€)')",
        "axes[0].set_ylabel('prix prévu (k€)')",
        "axes[1].boxplot([bilan.loc[bilan['quartier'] == q, 'erreur_relative'] * 100 for q in par_quartier.index], tick_labels=list(par_quartier.index))",
        "axes[1].set_ylabel('erreur relative (%)')",
        "axes[1].tick_params(axis='x', labelrotation=30)",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Les erreurs en euros vont de 6 593 (Faubourg Est) à 16 664 (Les Berges), mais ce classement dépend aussi du niveau de prix de chaque quartier. En proportion, la médiane de l'erreur relative va de 4,2 % (Faubourg Est) à 7,3 % (Les Berges). Le biais est de -3 632 euros aux Berges, +1 851 à la Vieille Ville : le modèle sous-estime plutôt l'un et surestime plutôt l'autre. Sur le graphique de gauche, les points suivent la diagonale ; le logement le plus cher, au-delà de 600 000 euros, est sous-estimé.",
    },
    {
      kind: "text",
      md: `Les Berges sont le quartier le plus difficile dans les deux lectures (de peu en proportion), et leur biais est négatif : en moyenne, le modèle y sous-estime. Faut-il en rester au constat ? Une erreur systématique est une piste. Le modèle ajoute le même effet d'étage dans tous les quartiers, mais l'étage compte peut-être davantage aux Berges, avec une vue sur le fleuve aux étages élevés. L'exemple suivant sépare les logements des Berges selon l'étage, puis essaie une variable qui ne s'applique qu'à ce quartier. Elle se juge par validation croisée sur l'entraînement, pas sur le test que l'on vient de regarder.`,
    },
    {
      kind: "code",
      language: "python",
      setup: BILAN,
      code: lines(
        "from sklearn.model_selection import KFold, cross_val_score",
        "",
        "# les erreurs des Berges selon l'étage : le signe change-t-il ?",
        "berges = bilan[bilan['quartier'] == 'Les Berges']",
        "haut = X_test.loc[berges.index, 'etage'] >= 5",
        "print(berges.groupby(haut.map({True: 'étage 5 et plus', False: 'étage 0 à 4'}))['erreur'].agg(['count', 'mean']).round(0))",
        "",
        "def ajouter_etage_berges(df):",
        "    out = ajouter_variables(df)",
        "    out['etage_berges'] = out['etage'] * (out['quartier'] == 'Les Berges')  # l'étage ne compte de cette façon qu'aux Berges",
        "    return out",
        "",
        "cv = KFold(n_splits=5, shuffle=True, random_state=0)",
        "Xb_train = ajouter_etage_berges(X_train)",
        "for nom, nombres in [('sans la variable', NOMBRES), ('avec etage_berges', NOMBRES + ['etage_berges'])]:",
        "    erreurs = -cross_val_score(lineaire(CATEGORIES, nombres), Xb_train, y_train, cv=cv, scoring='neg_mean_absolute_error')",
        "    print(nom.ljust(20), 'MAE', round(erreurs.mean()), '€ ; écart-type entre plis', round(erreurs.std()), '€')",
      ),
      caption: "Aux Berges, le modèle surestime en moyenne de 4 082 euros les logements des étages 0 à 4 (30 logements du test) et sous-estime de 11 898 euros ceux des étages 5 et plus (28 logements) : le signe change avec l'étage. C'est ce qu'un modèle qui ajoute les mêmes pourcents dans tous les quartiers ne sait pas faire, et c'est bien ce que nous avions fabriqué (bonus d'étage plus fort aux Berges). Avec la variable etage_berges, l'erreur de validation croisée passe de 12 966 à 12 104 euros. Le gain est modeste, plus petit que l'écart-type entre plis (environ 1 200 euros), mais il vient d'une variable que l'on sait expliquer.",
    },
    {
      kind: "text",
      md: `### Étape 7 : ouvrir le test une dernière fois, et conclure

Le modèle retenu est la régression linéaire sur le logarithme du prix, avec les variables construites et \`etage_berges\`. Il est ajusté sur tout l'entraînement, puis évalué sur le test, une dernière fois, face à la référence. On y ajoute un repère propre aux données fabriquées : le **plafond**, c'est-à-dire l'erreur moyenne d'un « modèle » qui connaîtrait la formule exacte (\`prix_sans_bruit\`) et se tromperait quand même, à cause du bruit de 7 %. Ce prix sans bruit ne sert qu'à cette mesure, jamais à construire une variable.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELES,
      code: lines(
        "def ajouter_etage_berges(df):",
        "    out = ajouter_variables(df)",
        "    out['etage_berges'] = out['etage'] * (out['quartier'] == 'Les Berges')",
        "    return out",
        "",
        "# le test est ouvert une seule fois, avec le modèle choisi par validation croisée",
        "final = lineaire(CATEGORIES, NOMBRES + ['etage_berges']).fit(ajouter_etage_berges(X_train), y_train)",
        "prevu = final.predict(ajouter_etage_berges(X_test))",
        "mae_final = mean_absolute_error(y_test, prevu)",
        "mae_ref = mean_absolute_error(y_test, (y_train / X_train['surface']).median() * X_test['surface'])",
        "plafond = mean_absolute_error(y_test, prix_sans_bruit[y_test.index])  # écart du prix bruité à la formule exacte : le bruit qu'aucun modèle ne peut deviner",
        "relative = np.abs(prevu - y_test) / y_test",
        "print('référence      : MAE', round(mae_ref), '€')",
        "print('modèle final   : MAE', round(mae_final), '€')",
        "print('plafond (bruit) : MAE', round(plafond), '€')",
        "print('logements estimés à moins de 10 % près :', round(100 * (relative < 0.10).mean()), '%')",
        "print('logements estimés à moins de 20 % près :', round(100 * (relative < 0.20).mean()), '%')",
      ),
      caption: "La référence se trompe de 42 875 euros en moyenne, le modèle final de 12 232. Le plafond, mesuré avec la formule exacte, est de 9 990 euros : même en connaissant la formule, on se tromperait de ce montant à cause du bruit de 7 %. Le modèle est donc à environ 2 200 euros de ce qu'on peut espérer de mieux. Sur le test, 78 % des logements sont estimés à moins de 10 % près, et 98 % à moins de 20 % près.",
    },
    {
      kind: "text",
      md: `### Conclure honnêtement

- **Un modèle se juge contre une référence.** La règle du prix médian au m² se trompe de 42 875 euros, le modèle final de 12 232. Sans la référence, le second nombre ne veut rien dire.
- **Les variables ont compté plus que le modèle.** Entre variables brutes et variables construites, l'erreur est divisée par plus de deux. Entre régression linéaire et boosting, la différence est de quelques centaines d'euros, plus petite que la dispersion entre plis.
- **Aucune variable ne vient du prix.** Le prix au m² est un bon outil d'exploration et une mauvaise variable. Le prix sans bruit est un repère de mesure, pas une variable.
- **Ces nombres valent pour des données fabriquées.** Elles sont lisses, sans erreur de saisie ni bien atypique, et nous en connaissions la formule : l'écart de 2 200 euros au plafond est flatteur. Avec de vraies ventes, il serait plus grand.
- **Le test a servi plusieurs fois à regarder** (étapes 2, 3, 4 et 6). Dans un vrai projet, on garderait un second jeu, jamais ouvert, pour la mesure finale.

De vraies données apporteraient la date de vente (les prix suivent le marché : on découperait alors dans le temps, comme dans le projet sur la fréquentation), l'état intérieur, la vue, le bruit, des ventes à part (viager, vente entre proches). Elles poseraient aussi une question d'usage : une estimation prépare une discussion ou une visite, elle ne les remplace pas.

Pour aller plus loin :

- estimer une **fourchette** plutôt qu'un seul prix, avec \`HistGradientBoostingRegressor(loss='quantile', quantile=0.1)\`, puis 0.9 ;
- chercher de meilleurs réglages du boosting avec \`RandomizedSearchCV\`, toujours en validation croisée sur l'entraînement ;
- vérifier la généralisation à un quartier jamais vu avec \`GroupKFold\` ;
- essayer \`Ridge\` ou \`Lasso\` si l'on ajoute beaucoup de variables ;
- refaire le projet avec XGBoost ou LightGBM dans votre propre environnement : même méthode, autres bibliothèques.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi apprend-on un modèle linéaire sur le logarithme du prix plutôt que sur le prix ?",
      options: [
        "Parce que scikit-learn refuse les prix supérieurs à 100 000 euros",
        "Parce que les effets sur le prix se multiplient : le logarithme les transforme en sommes, ce qui convient à un modèle linéaire",
        "Pour rendre les prix négatifs",
        "Pour réduire le nombre de logements à traiter",
      ],
      correct: 1,
      explanation: "Une formule de prix multiplie des effets (surface, quartier, époque). Le logarithme d'un produit est une somme de logarithmes : une régression linéaire sur le logarithme du prix est un modèle de pourcentages. On revient aux euros avec l'exponentielle, et l'erreur se mesure sur les vrais prix.",
    },
    {
      question: "Un collègue ajoute le prix au m² (le prix divisé par la surface) comme variable et voit l'erreur presque divisée par deux. Que faut-il en penser ?",
      options: [
        "C'est une excellente variable, il faut la garder",
        "Il faut l'ajouter aussi au jeu de test, et le tour est joué",
        "C'est une fuite d'information : la variable contient le prix, inconnu pour un logement à estimer, donc le modèle est inutilisable",
        "Il faut seulement la mettre à l'échelle",
      ],
      correct: 2,
      explanation: "Une variable doit être connue au moment d'estimer, sans connaître le prix. Le prix au m² est calculé à partir de la réponse : le modèle la lit au lieu de la prévoir. Un gain soudain et énorme est un signal d'alerte.",
    },
    {
      question: "Pourquoi comparer régression linéaire et boosting par validation croisée plutôt que sur un seul découpage ?",
      options: [
        "Parce que le boosting ne fonctionne qu'avec une validation croisée",
        "Parce que la validation croisée donne toujours le meilleur modèle",
        "Parce que l'erreur varie d'un tirage à l'autre : plusieurs plis donnent une moyenne et une dispersion, et un écart plus petit que cette dispersion ne désigne pas de vainqueur",
        "Parce que le jeu de test est trop petit pour servir",
      ],
      correct: 2,
      explanation: "Avec un seul découpage, un écart de quelques centaines d'euros peut venir du hasard du tirage. Les 5 plis montrent que l'erreur change de plus de 3 000 euros d'un pli à l'autre : un écart de 325 euros en moyenne ne tranche pas. Le jeu de test reste fermé jusqu'à la mesure finale.",
    },
    {
      question: "Sur ces données, la régression linéaire avec de bonnes variables fait aussi bien que le boosting. Que peut-on en conclure ?",
      options: [
        "Que le boosting est inutile, quelles que soient les données",
        "Que la validation croisée s'est trompée",
        "Que XGBoost ferait forcément moins bien",
        "Que le choix des variables compte plus que le choix du modèle sur ces données fabriquées par une formule multiplicative, et que d'autres données pourraient donner un autre classement",
      ],
      correct: 3,
      explanation: "Les données sont fabriquées par un produit d'effets, ce qui est presque linéaire en logarithme : un modèle simple avec les bonnes variables suffit. Avec de vraies ventes, aux interactions plus nombreuses, le résultat peut différer. Seule la comparaison par validation croisée, sur les données que l'on a, le dit.",
    },
  ],
};
