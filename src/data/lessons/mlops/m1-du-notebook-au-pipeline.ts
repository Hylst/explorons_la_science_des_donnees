import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Jeu réel de scikit-learn (569 tumeurs, rien n'est téléchargé), réduit à quatre colonnes. Deux altérations
// annoncées dans le cours : « taille » est une colonne catégorielle fabriquée à partir de l'aire, et 10 % des
// textures sont effacées au hasard (graine fixe) pour avoir de vrais trous à combler.
const PREPARATION = lines(
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_breast_cancer",
  "from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold",
  "from sklearn.pipeline import Pipeline",
  "from sklearn.compose import ColumnTransformer",
  "from sklearn.impute import SimpleImputer",
  "from sklearn.preprocessing import StandardScaler, OneHotEncoder",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.ensemble import RandomForestClassifier",
  "from sklearn.feature_selection import SelectKBest, f_classif",
  "",
  "donnees = load_breast_cancer(as_frame=True)",
  "X = donnees.data[['mean radius', 'mean texture', 'mean smoothness', 'mean area']].copy()",
  "X.columns = ['rayon', 'texture', 'lissage', 'aire']",
  "y = donnees.target",
  "# colonne catégorielle fabriquée : l'aire découpée en trois groupes de même effectif",
  "X['taille'] = pd.qcut(X['aire'], 3, labels=['petite', 'moyenne', 'grande']).astype(str)",
  "X = X.drop(columns='aire')",
  "# 10 % des textures effacées au hasard (graine fixe) pour avoir de vrais trous",
  "rng = np.random.default_rng(0)",
  "X.loc[rng.random(len(X)) < 0.1, 'texture'] = np.nan",
  "colonnes_num = ['rayon', 'texture', 'lissage']",
  "colonnes_cat = ['taille']",
  "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
);

export const moduleNotebookPipeline: LessonModule = {
  id: "du-notebook-au-pipeline",
  title: "Du carnet de notes au pipeline reproductible",
  duration: "2 h",
  summary: "Remplacer des cellules de carnet éparpillées par un pipeline scikit-learn, comprendre la fuite de données quand on prépare avant de découper, fixer les graines aléatoires et noter les versions pour que le résultat de demain soit celui d'aujourd'hui.",
  objectives: [
    "Assembler imputation, mise à l'échelle et encodage dans un Pipeline avec un ColumnTransformer",
    "Expliquer la fuite de données et la mesurer, y compris quand elle est minuscule",
    "Fixer les graines aléatoires et vérifier que deux exécutions donnent le même score",
    "Noter les versions des bibliothèques qui ont produit un résultat",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi sortir du carnet de notes

Un carnet de notes (*notebook*) est excellent pour explorer : on essaie, on regarde, on corrige. Il devient fragile dès qu'un résultat doit être **refait** : par vous dans six mois, par un collègue, ou par une machine qui réentraîne le modèle chaque semaine. Les ennuis habituels sont connus : des cellules exécutées dans le désordre, une variable restée en mémoire depuis une version précédente, une standardisation appliquée à un tableau qu'on ne retrouve plus, un score que personne ne sait reproduire.

Le **MLOps** (de *machine learning* et *operations*) regroupe les pratiques qui rendent un modèle **reproductible, testable, déployable et surveillé**. Ce cours en suit les étapes, de la plus simple à la plus exigeante. Ici, la première : transformer des étapes éparpillées en **un seul objet** qui sait s'ajuster sur des données et se rejouer sur d'autres.

Le jeu de données est réel et fourni avec scikit-learn : **569 tumeurs** décrites par des mesures sur des images, avec le diagnostic (bénigne ou maligne). Pour avoir de quoi préparer, on garde trois mesures (le rayon, la texture et le lissage moyens) et on y ajoute deux altérations, **dites ici pour ne pas vous tromper** : une colonne catégorielle \`taille\` est **fabriquée** en découpant l'aire en trois groupes de même effectif, et **10 % des textures sont effacées au hasard** (avec une graine fixe) pour obtenir de vrais trous. Rien de cela n'existe dans le jeu d'origine.`,
    },
    {
      kind: "text",
      md: `### Un pipeline, trois idées

- Un **Pipeline** enchaîne des étapes nommées : chaque étape transforme les données et passe le résultat à la suivante, la dernière est le modèle. \`fit\` ajuste tout dans l'ordre, \`predict\` rejoue tout.
- Un **ColumnTransformer** applique un traitement différent à chaque groupe de colonnes : ici, imputation puis mise à l'échelle pour les nombres, encodage *one-hot* pour la catégorie.
- Tout ce qui s'apprend sur les données (la médiane qui comble les trous, la moyenne et l'écart-type de la mise à l'échelle, la liste des catégories) est appris **sur l'apprentissage seulement** et réutilisé tel quel ensuite.

L'exemple ci-dessous fait d'abord le travail à la main, étape par étape, puis avec un pipeline. Les deux donnent les mêmes prédictions : le pipeline ne change pas le calcul, il le **range**.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        PREPARATION,
        "",
        "print('forme :', X.shape, ' textures manquantes :', int(X['texture'].isna().sum()))",
        "print('apprentissage :', len(X_app), ' test :', len(X_test))",
        "",
        "# --- Version éparpillée : chaque étape à la main, à ne pas oublier sur le test ---",
        "imp = SimpleImputer(strategy='median').fit(X_app[colonnes_num])",
        "num_app = imp.transform(X_app[colonnes_num])",
        "ech = StandardScaler().fit(num_app)",
        "num_app = ech.transform(num_app)",
        "enc = OneHotEncoder(handle_unknown='ignore').fit(X_app[colonnes_cat])",
        "M_app = np.hstack([num_app, enc.transform(X_app[colonnes_cat]).toarray()])",
        "modele = LogisticRegression(max_iter=1000).fit(M_app, y_app)",
        "",
        "num_test = ech.transform(imp.transform(X_test[colonnes_num]))",
        "M_test = np.hstack([num_test, enc.transform(X_test[colonnes_cat]).toarray()])",
        "pred_main = modele.predict(M_test)",
        "print('à la main : réussite sur le test', round(modele.score(M_test, y_test), 3))",
        "",
        "# --- Version pipeline : un seul objet ---",
        "pretraitement = ColumnTransformer([",
        "    ('num', Pipeline([('imputation', SimpleImputer(strategy='median')), ('echelle', StandardScaler())]), colonnes_num),",
        "    ('cat', OneHotEncoder(handle_unknown='ignore'), colonnes_cat),",
        "])",
        "pipe = Pipeline([('pretraitement', pretraitement), ('modele', LogisticRegression(max_iter=1000))])",
        "pipe.fit(X_app, y_app)",
        "print('pipeline : réussite sur le test', round(pipe.score(X_test, y_test), 3),",
        "      ' mêmes prédictions :', bool((pipe.predict(X_test) == pred_main).all()))",
        "print('colonnes fabriquées :', list(pipe.named_steps['pretraitement'].get_feature_names_out()))",
        "",
        "# une catégorie jamais vue à l'apprentissage ne fait pas planter (handle_unknown='ignore')",
        "nouveau = X_test.iloc[[0]].copy()",
        "nouveau['taille'] = 'géante'",
        "print('prédiction avec une taille inconnue :', pipe.predict(nouveau))",
      ),
      caption: "Sur 426 tumeurs d'apprentissage et 143 de test, 51 textures manquent. Les deux versions réussissent 0,902 sur le test (129 sur 143) et prédisent exactement la même chose. Le pipeline dérive six colonnes : trois nombres et trois colonnes 0/1 pour la taille. Une taille « géante », jamais vue, ne provoque pas d'erreur : la ligne reçoit des 0 partout pour cette colonne. Un seul découpage de 143 tumeurs : 0,902 est une estimation grossière, pas une vérité.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`X_app`, `y_app`, `X_test`, `y_test` et la liste `colonnes_num` (rayon, texture, lissage) sont prêts. Construisez dans `pipe` un `Pipeline` de trois étapes nommées, dans cet ordre : `'imputation'` (`SimpleImputer` à la médiane), `'echelle'` (`StandardScaler`) et `'modele'` (`LogisticRegression(max_iter=1000)`). Le test l'ajuste ensuite sur `X_app[colonnes_num]`.",
      setup: PREPARATION,
      starter: lines("pipe = Pipeline([('modele', LogisticRegression(max_iter=1000))])"),
      solution: lines(
        "pipe = Pipeline([",
        "    ('imputation', SimpleImputer(strategy='median')),",
        "    ('echelle', StandardScaler()),",
        "    ('modele', LogisticRegression(max_iter=1000)),",
        "])",
        "pipe.fit(X_app[colonnes_num], y_app)",
        "print('réussite sur le test :', round(pipe.score(X_test[colonnes_num], y_test), 3))",
      ),
      test: lines(
        "assert isinstance(pipe, Pipeline), \"pipe doit être un Pipeline\"",
        "assert list(pipe.named_steps) == ['imputation', 'echelle', 'modele'], f\"les étapes doivent s'appeler imputation, echelle, modele dans cet ordre, pas {list(pipe.named_steps)}\"",
        "assert isinstance(pipe.named_steps['imputation'], SimpleImputer) and pipe.named_steps['imputation'].strategy == 'median', \"l'imputation doit être un SimpleImputer(strategy='median')\"",
        "_p = pipe.fit(X_app[colonnes_num], y_app)",
        "assert _p.score(X_test[colonnes_num], y_test) > 0.85, \"le pipeline s'ajuste mal : vérifiez l'ordre des étapes (imputer avant d'échelonner)\"",
      ),
      hint: "Chaque étape est un couple (nom, objet). Les trous doivent être comblés avant la mise à l'échelle, et le modèle vient en dernier.",
    },
    {
      kind: "text",
      md: `### La fuite de données

On parle de **fuite** (*data leakage*) quand une information venue des données de test, ou de la partie qu'on évalue, a servi à préparer ou à choisir le modèle. Le score est alors trop beau, et on ne le découvre qu'en production. Le cas le plus courant : **standardiser tout le tableau avant le découpage**. La moyenne et l'écart-type calculés contiennent alors un peu des lignes de test.

Pour la validation croisée, la règle est la même : l'étape de préparation doit être **dans le pipeline**, pour être réajustée sur les seuls plis d'apprentissage à chaque tour. L'exemple mesure deux cas :

- la standardisation avant validation croisée contre dans le pipeline, sur cinq découpages différents ;
- un cas extrême construit pour montrer l'effet d'une grosse fuite : 100 lignes et 1 000 colonnes de **pur bruit**, une étiquette tirée à pile ou face. On choisit les 10 colonnes les plus liées à l'étiquette, puis on évalue. Aucun modèle honnête ne peut dépasser le hasard (environ 0,5).`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "Xn = X[colonnes_num].fillna(X[colonnes_num].median())   # imputation simple, hors sujet ici",
        "",
        "# 1) Standardiser avant la validation croisée (fuite) ou dans le pipeline (propre)",
        "ecarts = []",
        "for graine in range(5):",
        "    plis = StratifiedKFold(5, shuffle=True, random_state=graine)",
        "    avec_fuite = cross_val_score(LogisticRegression(max_iter=1000), StandardScaler().fit_transform(Xn), y, cv=plis).mean()",
        "    propre = Pipeline([('echelle', StandardScaler()), ('modele', LogisticRegression(max_iter=1000))])",
        "    sans_fuite = cross_val_score(propre, Xn, y, cv=plis).mean()",
        "    ecarts.append(avec_fuite - sans_fuite)",
        "    print('découpage', graine, ': avec fuite', round(avec_fuite, 4), ' sans fuite', round(sans_fuite, 4))",
        "print('écart moyen :', round(float(np.mean(ecarts)), 4), ' plus grand écart :', round(float(np.max(np.abs(ecarts))), 4))",
        "",
        "# 2) Un cas où la fuite est énorme : sélectionner des colonnes sur toutes les lignes",
        "rng = np.random.default_rng(1)",
        "bruit = rng.normal(size=(100, 1000))        # 1 000 colonnes de bruit pur",
        "etiquette = rng.integers(0, 2, 100)         # étiquette tirée à pile ou face",
        "choisies = SelectKBest(f_classif, k=10).fit_transform(bruit, etiquette)   # sélection sur TOUTES les lignes",
        "fuite = cross_val_score(LogisticRegression(), choisies, etiquette, cv=5).mean()",
        "propre = Pipeline([('selection', SelectKBest(f_classif, k=10)), ('modele', LogisticRegression())])",
        "sans_fuite = cross_val_score(propre, bruit, etiquette, cv=5).mean()",
        "print('bruit pur, avec fuite :', round(fuite, 3), ' dans le pipeline :', round(sans_fuite, 3))",
      ),
      caption: "Pour la standardisation, la fuite existe mais ne se voit presque pas : sur cinq découpages, l'écart moyen est de -0,0004 et le plus grand de 0,0018 (les scores tournent autour de 0,92). Sur ce jeu, avec une régression logistique, elle ne change pas la conclusion. Pour la sélection de colonnes sur du bruit, c'est un autre monde : 0,85 avec fuite, alors que la bonne valeur, dans le pipeline, est de 0,47, c'est-à-dire le hasard. Une petite fuite aujourd'hui ne garantit pas une petite fuite demain : on met la préparation dans le pipeline sans se poser la question.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le jeu de bruit pur de l'exemple (`bruit`, `etiquette`) est prêt, ainsi que `score_fuite`, le score trompeur obtenu en sélectionnant les 10 colonnes sur toutes les lignes. Calculez dans `score_propre` le score de validation croisée à 5 plis (`cross_val_score(..., cv=5).mean()`) d'un `Pipeline` qui contient la sélection `SelectKBest(f_classif, k=10)` puis `LogisticRegression()`, appliqué à `bruit` entier.",
      setup: lines(
        PREPARATION,
        "rng = np.random.default_rng(1)",
        "bruit = rng.normal(size=(100, 1000))",
        "etiquette = rng.integers(0, 2, 100)",
        "_choisies = SelectKBest(f_classif, k=10).fit_transform(bruit, etiquette)",
        "score_fuite = cross_val_score(LogisticRegression(), _choisies, etiquette, cv=5).mean()",
      ),
      starter: lines("score_propre = score_fuite"),
      solution: lines(
        "chaine = Pipeline([('selection', SelectKBest(f_classif, k=10)), ('modele', LogisticRegression())])",
        "score_propre = cross_val_score(chaine, bruit, etiquette, cv=5).mean()",
        "print('avec fuite :', round(score_fuite, 3), ' sans fuite :', round(score_propre, 3))",
      ),
      test: lines(
        "assert score_propre < 0.65, f\"sur du bruit pur, un score honnête reste proche de 0,5 ; {score_propre:.2f} trahit une fuite : la sélection doit être dans le Pipeline\"",
        "assert score_propre > 0.3, \"un score très inférieur à 0,5 sur du bruit est suspect : vérifiez que vous évaluez sur l'étiquette\"",
      ),
      hint: "Passez bruit en entier à cross_val_score, avec un Pipeline dont la première étape est SelectKBest : la sélection est alors refaite à chaque pli, sur ses seules lignes d'apprentissage.",
    },
    {
      kind: "text",
      md: `### Graines et reproductibilité

Beaucoup d'étapes tirent au hasard : le découpage apprentissage/test, le mélange des plis, l'initialisation d'une forêt aléatoire. Sans **graine** (*seed*, le paramètre \`random_state\`), chaque exécution donne un résultat un peu différent, et comparer deux versions d'un modèle devient impossible : on ne sait pas si l'écart vient du modèle ou du hasard.

Deux règles :

- **fixer** toutes les graines dans le pipeline (\`random_state=...\` partout où il existe) pour que la même exécution donne le même score ;
- **ne pas en conclure que la graine retenue est la bonne**. Changer de graine change le score : cet écart mesure l'incertitude de l'évaluation. Choisir la graine qui flatte le plus est une façon discrète de tricher.

Dernier réflexe : **noter les versions** des bibliothèques (\`sklearn.__version__\`, \`np.__version__\`, \`pd.__version__\`). Une mise à jour peut changer un résultat sans que votre code bouge.`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "import sklearn",
        "Xn = X[colonnes_num].fillna(X[colonnes_num].median())",
        "",
        "print('scikit-learn', sklearn.__version__, ' numpy', np.__version__, ' pandas', pd.__version__)",
        "",
        "def score_foret(graine):",
        "    # la même graine sert à la forêt et au mélange des plis",
        "    foret = RandomForestClassifier(n_estimators=50, random_state=graine)",
        "    plis = StratifiedKFold(5, shuffle=True, random_state=graine)",
        "    return cross_val_score(foret, Xn, y, cv=plis).mean()",
        "",
        "for graine in [0, 0, 1, 2, 3]:",
        "    print('graine', graine, ':', round(score_foret(graine), 4))",
        "",
        "tous = [score_foret(g) for g in range(10)]",
        "print('sur 10 graines : de', round(min(tous), 4), 'à', round(max(tous), 4), ' écart-type', round(float(np.std(tous)), 4))",
      ),
      caption: "Les deux premières lignes, même graine 0, donnent exactement le même score, 0,9192 : le calcul est reproductible. Les graines 1, 2 et 3 donnent 0,9156, 0,9192 et 0,9174. Sur dix graines, les scores vont de 0,9069 à 0,9192 (écart-type 0,0040) : cet écart entre graines est du même ordre que celui qu'on cherche souvent à mesurer entre deux modèles voisins. Les versions affichées par la première ligne sont celles du moteur du site, à noter dans la fiche d'une expérience.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La fonction `score_foret(graine)` ci-dessous ignore sa graine pour la forêt : deux appels identiques donnent des scores différents. Corrigez-la pour que `score_foret(0)` renvoie toujours la même valeur (graine passée à la forêt, les plis étant déjà fixés).",
      setup: lines(PREPARATION, "Xn = X[colonnes_num].fillna(X[colonnes_num].median())"),
      starter: lines(
        "def score_foret(graine):",
        "    foret = RandomForestClassifier(n_estimators=10)",
        "    plis = StratifiedKFold(5, shuffle=True, random_state=graine)",
        "    return cross_val_score(foret, Xn, y, cv=plis).mean()",
      ),
      solution: lines(
        "def score_foret(graine):",
        "    foret = RandomForestClassifier(n_estimators=10, random_state=graine)",
        "    plis = StratifiedKFold(5, shuffle=True, random_state=graine)",
        "    return cross_val_score(foret, Xn, y, cv=plis).mean()",
        "",
        "print([round(score_foret(0), 4) for _ in range(3)])",
      ),
      test: lines(
        "_scores = [score_foret(0) for _ in range(5)]",
        "assert len(set(_scores)) == 1, f\"cinq appels avec la même graine donnent {len(set(_scores))} scores différents : passez random_state=graine à RandomForestClassifier\"",
      ),
      hint: "RandomForestClassifier accepte random_state, comme StratifiedKFold.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Fixer la graine rend un résultat **reproductible**, pas **vrai**. Un score obtenu sur un seul découpage de 143 tumeurs reste une estimation bruitée. La reproductibilité sert à se mettre d'accord sur ce qu'on a calculé, pas à garantir que le modèle marchera ailleurs.",
    },
  ],
  quiz: [
    {
      question: "Quel est l'intérêt principal de mettre la standardisation dans le Pipeline plutôt que de standardiser le tableau avant le découpage ?",
      options: [
        "Le code est plus court et le calcul plus rapide",
        "La moyenne et l'écart-type sont appris sur l'apprentissage seulement, sans information venue des lignes de test",
        "La standardisation devient inutile pour la régression logistique",
        "Le modèle n'a plus besoin de graine aléatoire",
      ],
      correct: 1,
      explanation: "Standardiser avant le découpage mélange un peu des lignes de test aux paramètres de la préparation. Dans le pipeline, chaque pli réapprend ces paramètres sur ses seules lignes d'apprentissage.",
    },
    {
      question: "Dans l'exemple, la fuite par standardisation changeait le score de moins de 0,002. Que faut-il en conclure ?",
      options: [
        "Qu'on peut standardiser avant le découpage sans risque",
        "Que la validation croisée ne détecte jamais les fuites",
        "Que sur ce jeu et ce modèle elle est minuscule, mais qu'on garde la préparation dans le pipeline parce que d'autres cas, comme la sélection de colonnes, donnent un écart énorme",
        "Que la régression logistique est insensible à l'échelle des colonnes",
      ],
      correct: 2,
      explanation: "Une fuite peut être invisible sur un jeu et ravageuse sur un autre : la sélection de 10 colonnes sur du bruit pur donnait 0,85 au lieu de 0,47. La règle de prudence coûte une ligne de code.",
    },
    {
      question: "Sur 1 000 colonnes de bruit pur et une étiquette aléatoire, quel score de validation croisée est honnête ?",
      options: [
        "Environ 0,85, parce que les 10 colonnes choisies sont les plus informatives",
        "Environ 1,0, parce qu'il y a beaucoup plus de colonnes que de lignes",
        "Environ 0,5, le hasard, puisqu'il n'y a rien à apprendre",
        "Cela dépend uniquement du modèle choisi",
      ],
      correct: 2,
      explanation: "Il n'y a aucun lien entre les colonnes et l'étiquette : un modèle honnête ne fait pas mieux que le hasard. Un score de 0,85 vient de la sélection faite hors validation, sur des lignes qui allaient servir de test.",
    },
    {
      question: "Avec OneHotEncoder(handle_unknown='ignore'), que se passe-t-il pour une catégorie absente de l'apprentissage ?",
      options: [
        "Une erreur est levée à la prédiction",
        "La catégorie est ajoutée à l'encodeur sans réajustement",
        "La ligne est supprimée du résultat",
        "Toutes les colonnes 0/1 de cette variable valent 0 pour cette ligne",
      ],
      correct: 3,
      explanation: "L'encodeur ne connaît pas la catégorie : il remplit la ligne de zéros pour cette variable au lieu de planter. Le modèle fait alors sa prédiction sans cette information.",
    },
    {
      question: "Pourquoi ne faut-il pas choisir la graine aléatoire qui donne le meilleur score ?",
      options: [
        "Parce que les graines n'ont aucun effet sur les résultats",
        "Parce que cela retient un coup de chance : l'écart entre graines (ici de 0,907 à 0,919) mesure le bruit de l'évaluation, pas la qualité du modèle",
        "Parce que scikit-learn interdit de changer de graine",
        "Parce qu'une graine ne peut être fixée qu'une seule fois par projet",
      ],
      correct: 1,
      explanation: "Les scores varient d'une graine à l'autre à cause du tirage seul. Retenir la meilleure revient à publier un résultat optimiste que personne ne retrouvera sur de nouvelles données.",
    },
  ],
};
