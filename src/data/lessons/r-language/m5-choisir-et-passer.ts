import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Le jeu iris de scikit-learn, avec les noms de colonnes de R (Sepal.Length...) et l'espèce en catégorie. */
const IRIS = lines(
  "import io",
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_iris",
  "_brut = load_iris(as_frame=True)",
  "iris = _brut.data.copy()",
  "iris.columns = ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']",
  "iris['Species'] = pd.Categorical.from_codes(_brut.target, _brut.target_names)",
);

/** Fichier CSV écrit à la main d'après la forme par défaut de write.csv de R (colonne des noms de lignes, NA, guillemets). */
const CSV_STYLE_R = lines(
  "texte_csv = '\"\",\"Species\",\"Sepal.Length\",\"Taille\"\\n\"1\",\"setosa\",5.1,NA\\n\"2\",\"setosa\",4.9,\"petit\"\\n\"3\",\"virginica\",NA,\"grand\"\\n'",
);

export const moduleRChoisir: LessonModule = {
  id: "choisir-et-passer",
  title: "Choisir entre R et Python, passer de l'un à l'autre",
  duration: "1 h 30",
  summary: "Les forces de chaque langage sans parti pris, tidymodels et scikit-learn côte à côte, les formats pour échanger des données (CSV, Parquet, Arrow), les ponts reticulate et rpy2, et des exercices de traduction côté Python.",
  objectives: [
    "Comparer R et Python selon le besoin (analyse statistique, publication, apprentissage automatique, mise en production, équipe) sans en faire un duel",
    "Lire un flux de modélisation tidymodels et l'écrire avec scikit-learn, en sachant pourquoi les scores ne coïncident pas au dernier chiffre",
    "Échanger un tableau entre les deux langages en limitant les pertes (types, valeurs manquantes, noms de lignes)",
    "Lire un appel de l'un depuis l'autre (reticulate, rpy2) et savoir quand l'éviter",
  ],
  sections: [
    {
      kind: "text",
      md: `### Deux outils, pas deux camps

Ce module clôt le cours. Les quatre précédents ont mis en regard le code R, **à lire** (il ne s'exécute pas dans le moteur du site), et son équivalent Python, **exécuté** dans la page. Reste la question pratique : lequel utiliser, et comment travailler avec les deux ?

Les deux langages sont libres, très utilisés en analyse de données, et chacun a une histoire qui se voit dans ses réflexes.

**Du côté de R**, souvent apprécié pour :

- un **langage conçu pour les statistiques** : tests, modèles linéaires et généralisés, modèles mixtes, analyse de survie, séries temporelles, avec des méthodes souvent publiées d'abord sous forme de paquet ;
- le **CRAN**, le dépôt officiel de paquets, dont les paquets sont soumis à des vérifications automatiques de cohérence ;
- le **tidyverse** (dplyr, ggplot2, tidyr), une grammaire cohérente pour manipuler et représenter les données ;
- **R Markdown** et **Quarto**, qui mêlent texte, code et résultats dans un même document : rapports, articles, supports de cours.

**Du côté de Python**, souvent apprécié pour :

- un **langage généraliste** : le même code peut lire des données, entraîner un modèle, puis le servir dans une application ou un service web ;
- l'**apprentissage automatique et profond** : scikit-learn, et de nombreuses bibliothèques de réseaux de neurones ;
- l'**intégration** à des systèmes existants : bases de données, tâches planifiées, conteneurs, outils de déploiement ;
- une **communauté très large** autour du traitement du langage et de l'image.

Aucune de ces listes n'est un jugement. Le bon choix dépend souvent de ce qui existe déjà autour de vous : une équipe, un code, des collègues, une revue qui attend un format. Quarto fonctionne d'ailleurs avec les deux langages.`,
    },
    {
      kind: "note",
      tone: "info",
      md: "Une règle de bon sens : **un projet, un langage principal**, sauf raison claire. Mêler les deux multiplie les installations, les versions à reproduire et les endroits où une erreur peut se cacher. Quand on les mêle, c'est le plus souvent pour une brique précise : une méthode statistique qui n'existe que dans l'un, ou un modèle qui doit être servi par l'autre.",
    },
    {
      kind: "text",
      md: `### Modéliser : tidymodels et scikit-learn

**tidymodels** est la famille de paquets R qui organise la modélisation avec la même grammaire que le tidyverse. **scikit-learn** joue ce rôle en Python. Les étapes sont les mêmes : découper les données, préparer, ajuster, évaluer.

\`\`\`r
# Code R à lire (paquet tidymodels) : il ne s'exécute pas ici
library(tidymodels)

set.seed(42)
decoupage <- initial_split(iris, prop = 0.75, strata = Species)
app  <- training(decoupage)
test <- testing(decoupage)

recette <- recipe(Species ~ ., data = app) |>
  step_normalize(all_numeric_predictors())

flux <- workflow() |>
  add_recipe(recette) |>
  add_model(multinom_reg())

ajuste <- fit(flux, data = app)
predict(ajuste, new_data = test) |>
  bind_cols(test) |>
  accuracy(truth = Species, estimate = .pred_class)
\`\`\`

La correspondance se lit ligne à ligne : \`initial_split(strata=)\` devient \`train_test_split(stratify=)\`, \`recipe\` + \`step_normalize\` devient \`StandardScaler\`, \`workflow\` devient \`Pipeline\`, \`fit\` reste \`fit\`, \`accuracy\` devient \`score\` ou \`accuracy_score\`.

Attention à une illusion : **la même graine donne un découpage différent d'un langage à l'autre**. \`set.seed(42)\` en R et \`random_state=42\` en Python n'utilisent pas le même générateur, et les deux piocheront des fleurs différentes. Les scores des deux versions ne seront donc pas identiques au dernier chiffre, sans que l'une ou l'autre soit fausse.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "from sklearn.model_selection import train_test_split",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.ensemble import RandomForestClassifier",
        "",
        "X = iris[['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']]",
        "y = iris['Species'].astype(str)",
        "",
        "# initial_split(iris, prop = 0.75, strata = Species)",
        "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)",
        "print('apprentissage :', len(X_app), ' test :', len(X_test))",
        "",
        "# recipe(...) |> step_normalize(...) + workflow() + add_model(multinom_reg())",
        "flux = make_pipeline(StandardScaler(), LogisticRegression(max_iter=200))",
        "flux.fit(X_app, y_app)",
        "print('régression logistique, précision sur le test :', round(flux.score(X_test, y_test), 3))",
        "",
        "foret = RandomForestClassifier(n_estimators=200, random_state=42).fit(X_app, y_app)",
        "print('forêt aléatoire, précision sur le test :', round(foret.score(X_test, y_test), 3))",
      ),
      caption: "Un découpage de 112 fleurs d'apprentissage et 38 de test. La régression logistique classe correctement 92,1 % des fleurs de test (35 sur 38), la forêt aléatoire 89,5 % (34 sur 38). Ne concluez pas que l'une est meilleure : l'écart est d'une seule fleur sur 38, avec un seul découpage. Pour comparer des modèles, on répète le découpage ou on utilise la validation croisée.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `initial_split(iris, prop = 0.75, strata = Species)`. Découpez `X` et `y` en `X_app`, `X_test`, `y_app`, `y_test` : **75 % pour l'apprentissage**, **stratifié selon l'espèce** (mêmes proportions d'espèces dans les deux parties), avec `random_state=0`.",
      setup: lines(
        IRIS,
        "from sklearn.model_selection import train_test_split",
        "X = iris[['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']]",
        "y = iris['Species'].astype(str)",
      ),
      starter: lines(
        "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0)",
      ),
      solution: lines(
        "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
        "print(len(X_app), len(X_test), y_test.value_counts().to_dict())",
      ),
      test: lines(
        "assert len(X_app) == 112 and len(X_test) == 38, f\"75 % de 150 font 112 fleurs d'apprentissage (et 38 de test), pas {len(X_app)} et {len(X_test)}\"",
        "_n = sorted(y_test.value_counts().tolist())",
        "assert _n == [12, 13, 13], f\"le test doit garder les espèces en proportion (13, 13 et 12 fleurs) : ajoutez stratify=y ; vous avez {_n}\"",
        "assert y_app.value_counts().max() - y_app.value_counts().min() <= 1, \"l'apprentissage doit aussi garder les espèces en proportion (stratify=y)\"",
      ),
      hint: "train_test_split(X, y, test_size=0.25, random_state=0, stratify=y).",
    },
    {
      kind: "text",
      md: `### Échanger des données : CSV, Parquet, Arrow

Le plus simple pour passer un tableau de R à Python (ou l'inverse) est un fichier. Trois formats courants :

- le **CSV**, du texte lisible partout, mais qui **perd les types** : une catégorie redevient du texte, une date un texte, et la lecture doit deviner. Soignez trois points : la **colonne des noms de lignes** (par défaut, \`write.csv\` de R en ajoute une, d'où une colonne \`Unnamed: 0\` en pandas ; on l'évite avec \`row.names = FALSE\` ou on la lit comme index), la représentation du **manquant** (R écrit \`NA\`, que pandas lit comme manquant par défaut), et l'**encodage** (UTF-8) ;
- le **Parquet**, un format binaire par colonnes, compact et typé, lu par les deux langages ;
- **Arrow** (et son format de fichier *Feather*), qui permet de partager des tableaux en mémoire ou sur disque avec peu de conversions.

\`\`\`r
# Code R à lire : écrire un fichier typé que Python lira (paquet arrow)
library(arrow)
write_parquet(iris, "iris.parquet")
write.csv(iris, "iris.csv", row.names = FALSE)    # CSV sans colonne de noms de lignes
\`\`\`

\`\`\`python
# Code Python à lire : lire ces fichiers (pandas avec pyarrow installé)
import pandas as pd
tableau = pd.read_parquet("iris.parquet")
csv = pd.read_csv("iris.csv")
\`\`\`

Ce dernier bloc ne tourne pas dans le moteur du site : il ne fournit ni fichier persistant ni la bibliothèque pyarrow nécessaire au Parquet. Le CSV, en revanche, peut être étudié avec du texte : c'est l'objet de l'exemple suivant.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import io",
        "import pandas as pd",
        "",
        "# Fichier CSV écrit à la main, d'après la forme par défaut de write.csv de R :",
        "# une colonne de noms de lignes sans titre, des guillemets, NA pour le manquant.",
        CSV_STYLE_R,
        "",
        "brut = pd.read_csv(io.StringIO(texte_csv))",
        "print(brut.columns.tolist())                       # une colonne parasite, Unnamed: 0",
        "",
        "propre = pd.read_csv(io.StringIO(texte_csv), index_col=0)   # la première colonne est le nom des lignes",
        "print(propre.columns.tolist())",
        "print('manquants par colonne :', propre.isna().sum().to_dict())   # NA lu comme manquant",
        "",
        "# les types ne voyagent pas : la catégorie redevient du texte après un aller-retour",
        "cat = pd.DataFrame({'espece': pd.Categorical(['a', 'b'])})",
        "sortie = io.StringIO()",
        "cat.to_csv(sortie, index=False)",
        "retour = pd.read_csv(io.StringIO(sortie.getvalue()))",
        "print('avant :', cat['espece'].dtype, ' après :', retour['espece'].dtype)",
      ),
      caption: "Lu tel quel, le fichier a une colonne parasite : Unnamed: 0. En la lisant comme index, il reste Species, Sepal.Length et Taille, avec un manquant dans Sepal.Length et un dans Taille (le NA de R est reconnu). Après un aller-retour par CSV, la colonne catégorielle redevient du texte : il faut la reconvertir (pd.Categorical) si les niveaux et leur ordre comptent.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`texte_csv` est un fichier au style `write.csv` de R (colonne de noms de lignes, `NA`). Lisez-le dans `d` **sans colonne parasite** (la première colonne sert d'index), puis convertissez la colonne `Taille` en catégorie **ordonnée** `petit` < `grand`, et rangez dans `nb_manquants` le nombre **total** de valeurs manquantes du tableau.",
      setup: lines(
        "import io",
        "import pandas as pd",
        CSV_STYLE_R,
      ),
      starter: lines(
        "d = pd.read_csv(io.StringIO(texte_csv))",
        "nb_manquants = 0",
      ),
      solution: lines(
        "d = pd.read_csv(io.StringIO(texte_csv), index_col=0)",
        "d['Taille'] = pd.Categorical(d['Taille'], categories=['petit', 'grand'], ordered=True)",
        "nb_manquants = int(d.isna().sum().sum())",
        "print(d.dtypes.to_dict(), nb_manquants)",
      ),
      test: lines(
        "assert 'Unnamed: 0' not in d.columns, \"la première colonne contient les noms de lignes : lisez-la comme index avec index_col=0\"",
        "assert list(d.columns) == ['Species', 'Sepal.Length', 'Taille'], f\"colonnes attendues : Species, Sepal.Length, Taille (vous avez {list(d.columns)})\"",
        "assert isinstance(d['Taille'].dtype, pd.CategoricalDtype) and d['Taille'].cat.ordered, \"Taille doit être une catégorie ordonnée : pd.Categorical(..., categories=[...], ordered=True)\"",
        "assert list(d['Taille'].cat.categories) == ['petit', 'grand'], \"l'ordre des niveaux doit être petit puis grand\"",
        "assert nb_manquants == 2, f\"il y a 2 valeurs manquantes au total (un NA dans Sepal.Length, un dans Taille), pas {nb_manquants}\"",
      ),
      hint: "index_col=0 dans read_csv ; d.isna().sum().sum() compte tous les manquants.",
    },
    {
      kind: "text",
      md: `### Appeler l'un depuis l'autre : reticulate et rpy2

On peut aussi faire cohabiter les deux langages dans un même programme. Deux ponts existent.

**reticulate** (paquet R) permet d'appeler du Python depuis R : importer un module, exécuter du code, échanger des objets. Les tableaux pandas deviennent des \`data.frame\`, et réciproquement.

\`\`\`r
# Code R à lire (paquet reticulate) : il ne s'exécute pas ici
library(reticulate)
np <- import("numpy")
np$mean(c(1, 2, 3))             # appelle NumPy depuis R
py_run_string("x = [i ** 2 for i in range(5)]")
py$x                            # récupère l'objet Python dans R
\`\`\`

**rpy2** fait le chemin inverse : appeler R depuis Python.

\`\`\`python
# Code Python à lire (bibliothèque rpy2, avec R installé) : il ne s'exécute pas ici
import rpy2.robjects as ro
ro.r("mean(c(1, 2, 3))")
ro.r("lm(stack.loss ~ Air.Flow, data = stackloss)")
\`\`\`

Ces ponts sont commodes pour **une** fonction qui n'existe que de l'autre côté. Ils ont un coût : il faut installer et configurer les deux environnements, les versions doivent rester compatibles, les conversions de types ont leurs surprises (manquants, facteurs, dates), et les erreurs sont plus longues à diagnostiquer. Si l'enjeu est seulement de **réutiliser un résultat**, un fichier (CSV, Parquet) entre deux étapes, voire deux scripts, est souvent plus simple et plus robuste.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Traduisez cette chaîne R en pandas : `iris |> filter(Species != \"setosa\") |> mutate(ratio = Petal.Length / Petal.Width) |> group_by(Species) |> summarise(ratio_med = median(ratio), n = n()) |> arrange(desc(ratio_med))`. Rangez le résultat dans `resultat` (colonnes `Species`, `ratio_med`, `n`, l'espèce en colonne, triée par `ratio_med` décroissant).",
      setup: IRIS,
      starter: "resultat = iris",
      solution: lines(
        "resultat = (",
        "    iris[iris['Species'] != 'setosa']",
        "    .assign(ratio=lambda d: d['Petal.Length'] / d['Petal.Width'])",
        "    .groupby('Species', observed=True)",
        "    .agg(ratio_med=('ratio', 'median'), n=('ratio', 'size'))",
        "    .reset_index()",
        "    .sort_values('ratio_med', ascending=False)",
        ")",
        "print(resultat)",
      ),
      test: lines(
        "assert list(resultat.columns) == ['Species', 'ratio_med', 'n'], f\"les colonnes doivent être Species, ratio_med, n (dans cet ordre), pas {list(resultat.columns)}\"",
        "assert len(resultat) == 2, f\"setosa est exclue, il reste 2 espèces, pas {len(resultat)} lignes\"",
        "_cible = {}",
        "for _e in ['versicolor', 'virginica']:",
        "    _v = iris[iris['Species'] == _e]",
        "    _cible[_e] = float((_v['Petal.Length'] / _v['Petal.Width']).median())",
        "for _, _l in resultat.iterrows():",
        "    assert abs(_l['ratio_med'] - _cible[str(_l['Species'])]) < 1e-9, f\"{_l['Species']} : ratio_med doit être la médiane de Petal.Length / Petal.Width\"",
        "    assert _l['n'] == 50, f\"{_l['Species']} : n doit valoir 50\"",
        "assert resultat['ratio_med'].is_monotonic_decreasing, \"arrange(desc(ratio_med)) : triez par ratio_med décroissant (ascending=False)\"",
      ),
      hint: "Filtrer avec iris[iris['Species'] != 'setosa'], assign avec une lambda, groupby(observed=True).agg(...), reset_index(), sort_values('ratio_med', ascending=False).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Équivalent de `table(iris$Species, iris$Petal.Width > 1)` : rangez dans `tableau` le tableau croisé entre l'espèce (en lignes) et la condition « largeur de pétale **strictement supérieure à 1** » (en colonnes, `False` puis `True`).",
      setup: IRIS,
      starter: "tableau = iris['Species'].value_counts()",
      solution: lines(
        "tableau = pd.crosstab(iris['Species'], iris['Petal.Width'] > 1)",
        "print(tableau)",
      ),
      test: lines(
        "assert getattr(tableau, 'ndim', 1) == 2 and tableau.shape == (3, 2), f\"il faut un tableau croisé de 3 lignes (espèces) et 2 colonnes (False, True) : pd.crosstab(...) ; forme actuelle {getattr(tableau, 'shape', None)}\"",
        "assert tableau.loc['versicolor'].tolist() == [int(((iris['Species'] == 'versicolor') & (iris['Petal.Width'] <= 1)).sum()), int(((iris['Species'] == 'versicolor') & (iris['Petal.Width'] > 1)).sum())], \"la ligne versicolor doit compter les fleurs de largeur <= 1 puis > 1\"",
        "assert int(tableau.to_numpy().sum()) == 150, \"le tableau doit compter les 150 fleurs\"",
      ),
      hint: "pd.crosstab(serie_lignes, serie_colonnes) ; une comparaison comme iris['Petal.Width'] > 1 donne une série de booléens.",
    },
    {
      kind: "text",
      md: `### Comment décider, concrètement

Quelques questions à se poser, sans qu'aucune ne tranche à elle seule :

- **Que fait-on déjà autour de soi ?** Un code existant, un collègue, une revue ou un cours qui impose un outil pèsent plus que les mérites abstraits.
- **Quelle méthode faut-il ?** Une méthode statistique récente ou très spécialisée existe parfois d'abord dans un seul des deux écosystèmes ; vérifiez sa disponibilité, sa documentation et sa maintenance.
- **Où le résultat doit-il vivre ?** Un rapport ou un article se prête bien à Quarto ou R Markdown ; un service que d'autres programmes appelleront, ou un modèle à déployer, s'écrit souvent plus naturellement en Python.
- **Qui devra relire et reproduire ?** Le langage le plus adapté est souvent celui que l'équipe sait lire. Notez les versions, enregistrez l'environnement, et dites quel code produit quel résultat.

Enfin, savoir lire l'autre langage est un avantage en soi : vous avez, grâce à ce cours, de quoi comprendre un script R et en reconstruire l'essentiel en Python, ou l'inverse.`,
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour continuer, le mieux est de prendre un petit jeu de données qui vous intéresse et de refaire la **même analyse dans les deux langages** : lecture, nettoyage, un graphique, un modèle. Vous y verrez mieux les différences de style et de réglages par défaut que dans n'importe quel comparatif.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi, avec la même graine (42), un découpage train/test en R et en Python ne donne-t-il pas les mêmes fleurs ?",
      options: [
        "Parce que l'un des deux langages est incorrect",
        "Parce que set.seed ne fonctionne pas",
        "Parce que les deux n'utilisent ni le même générateur ni le même algorithme de tirage : une graine ne se transporte pas d'un langage à l'autre",
        "Parce que iris contient des valeurs manquantes",
      ],
      correct: 2,
      explanation: "Une graine n'a de sens que pour un générateur et un algorithme donnés. Deux découpages corrects mais différents donnent des scores proches, pas identiques au dernier chiffre.",
    },
    {
      question: "Après write.csv(iris, \"iris.csv\") en R, la lecture avec pandas fait apparaître une colonne Unnamed: 0. Pourquoi ?",
      options: [
        "Parce que write.csv ajoute par défaut une colonne de noms de lignes (on l'évite avec row.names = FALSE)",
        "Parce que pandas invente des colonnes",
        "Parce que le fichier est corrompu",
        "Parce que iris a une colonne en trop",
      ],
      correct: 0,
      explanation: "Par défaut, write.csv écrit les noms de lignes dans une première colonne sans titre. pandas la nomme Unnamed: 0. On la lit comme index (index_col=0) ou on ne l'écrit pas.",
    },
    {
      question: "Quel avantage le format Parquet a-t-il sur le CSV pour passer un tableau de R à Python ?",
      options: [
        "Il se lit dans un éditeur de texte",
        "Il est typé et compact : catégories, dates et nombres gardent leur type, sans qu'il faille les deviner",
        "Il est le seul format que pandas sache lire",
        "Il corrige automatiquement les valeurs manquantes",
      ],
      correct: 1,
      explanation: "Le CSV est du texte sans types, que le lecteur doit deviner ; Parquet enregistre les types et compresse par colonnes. Il demande en revanche une bibliothèque comme arrow ou pyarrow.",
    },
    {
      question: "Quand vaut-il mieux éviter reticulate ou rpy2 ?",
      options: [
        "Jamais, ils sont toujours préférables",
        "Quand on veut seulement réutiliser un résultat : un fichier entre deux étapes est souvent plus simple et plus robuste",
        "Quand on utilise pandas",
        "Quand on a déjà installé Python",
      ],
      correct: 1,
      explanation: "Les ponts demandent d'installer et de maintenir deux environnements compatibles, et les conversions de types ont des surprises. Pour passer un résultat, un fichier suffit le plus souvent.",
    },
    {
      question: "Un collègue affirme que « R est meilleur que Python » pour tout travail statistique. Que répondre, d'après ce module ?",
      options: [
        "Qu'il a raison : Python ne sait pas faire de statistiques",
        "Que le choix dépend du besoin et de l'existant : R offre un écosystème statistique très riche, Python couvre aussi beaucoup avec SciPy et statsmodels ; l'essentiel est de comprendre ce que fait la méthode",
        "Qu'il a tort : Python fait tout mieux",
        "Que la question n'a aucun sens",
      ],
      correct: 1,
      explanation: "Aucun des deux n'est supérieur dans l'absolu. Un test de Welch ou une régression des moindres carrés sont la même grandeur dans les deux ; la différence tient aux réglages par défaut, à l'écosystème et aux habitudes d'équipe.",
    },
  ],
};
