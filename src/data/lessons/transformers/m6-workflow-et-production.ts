import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module6: LessonModule = {
  id: "workflow-et-production",
  title: "Du tableau brut au modèle : workflow, fuites et mise en production",
  duration: "2 h",
  summary:
    "Un workflow complet de prétraitement : explorer, comparer des transformations par validation croisée en lisant les résultats honnêtement, mesurer une vraie fuite de données (la sélection de variables) et la corriger avec un Pipeline, puis sauvegarder le pipeline appris et surveiller la dérive des données.",
  objectives: [
    "Suivre un workflow de prétraitement, de l'exploration à la surveillance, et savoir où se place chaque transformeur",
    "Comparer plusieurs transformations par validation croisée et lire le résultat avec sa dispersion",
    "Mesurer une fuite de données grave (sélection de variables sur tout le jeu) et la corriger avec un Pipeline",
    "Sauvegarder et recharger un pipeline appris, et détecter la dérive d'un lot de nouvelles données",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un workflow en sept gestes

Les modules précédents ont présenté les outils. Un projet les assemble dans un ordre, que l'on peut résumer en sept gestes :

1. **Explorer** : types, valeurs manquantes, étendues, asymétries, valeurs extrêmes, corrélations. Une valeur extrême est d'abord une question (erreur de saisie, panne de capteur, cas réel rare ?) avant d'être un problème à corriger ;
2. **Nettoyer** : doublons, valeurs impossibles, valeurs manquantes. Il n'existe pas de seuil universel au-delà duquel on supprime plutôt que d'imputer : cela dépend de la raison pour laquelle la valeur manque ;
3. **Séparer** les données d'entraînement et de test **avant** toute transformation qui apprend quelque chose ;
4. **Choisir** les transformations selon le type de chaque colonne (module 3) et le modèle visé (module 2) ;
5. **Assembler** transformations et modèle dans un \`Pipeline\`, avec un \`ColumnTransformer\` pour les tableaux mixtes ;
6. **Valider** par validation croisée, en comparant les options et en regardant la dispersion des résultats ;
7. **Déployer et surveiller** : sauvegarder le pipeline entier, vérifier que les données qui arrivent ressemblent à celles de l'entraînement, ré-entraîner par décision et non par réflexe.

Le reste du module met chaque geste à l'épreuve sur des données mesurées.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "from sklearn.datasets import load_breast_cancer",
        "",
        "cancer = load_breast_cancer(as_frame=True)",
        "X, y = cancer.data, cancer.target",
        "print(X.shape, ' classes :', y.value_counts().to_dict())",
        "print('valeurs manquantes :', int(X.isna().sum().sum()))",
        "etendue = X.max() - X.min()",
        "print(f'étendue la plus grande : {etendue.idxmax()} ({etendue.max():.1f}) ; la plus petite : {etendue.idxmin()} ({etendue.min():.3f})')",
        "print('asymétries les plus fortes :', X.skew().sort_values(ascending=False).head(3).round(2).to_dict())",
      ),
      caption:
        "Le jeu de diagnostic de tumeurs de scikit-learn compte 569 lignes et 30 mesures, sans valeur manquante, avec 357 tumeurs bénignes (classe 1) et 212 malignes (classe 0). Les étendues vont de 0,029 (fractal dimension error) à 4 068,8 (worst area) : un écart de cinq ordres de grandeur entre variables, ce qui désigne d'emblée les modèles à distances comme sensibles à l'échelle. Les asymétries les plus fortes (5,45 pour area error) appellent un regard sur les transformations du module 3.",
    },
    {
      kind: "text",
      md: `### Comparer les transformations honnêtement

Quel scaler faut-il choisir ? Aucune réponse générale n'est fiable : on **mesure**, sur le modèle et les données visés. Trois précautions rendent la comparaison honnête :

- le transformeur est **dans le pipeline**, de sorte que la validation croisée le réapprend sur chaque partie d'entraînement ;
- tous les candidats sont évalués sur les **mêmes plis** (un \`StratifiedKFold\` avec \`random_state\` fixé) : sans cela, on compare aussi la chance du découpage ;
- on regarde la **moyenne et l'écart-type** des scores par pli. Si deux options diffèrent de moins que l'écart-type entre plis, le classement ne repose sur rien de solide.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import MinMaxScaler, QuantileTransformer, RobustScaler, StandardScaler",
        "from sklearn.svm import SVC",
        "",
        "X, y = load_breast_cancer(return_X_y=True)",
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "transformeurs = {",
        "    'aucune': None,",
        "    'StandardScaler': StandardScaler(),",
        "    'MinMaxScaler': MinMaxScaler(),",
        "    'RobustScaler': RobustScaler(),",
        "    'QuantileTransformer': QuantileTransformer(n_quantiles=100, output_distribution='normal'),",
        "}",
        "modeles = {'SVC': SVC(), 'régression logistique': LogisticRegression(max_iter=5000)}",
        "for nom_modele, modele in modeles.items():",
        "    print(nom_modele)",
        "    for nom, transformeur in transformeurs.items():",
        "        etapes = [modele] if transformeur is None else [transformeur, modele]",
        "        scores = cross_val_score(make_pipeline(*etapes), X, y, cv=cv)",
        "        print(f'  {nom:<20} {scores.mean():.3f} ± {scores.std():.3f}')",
      ),
      caption:
        "Sans transformation, le SVC atteint 0,921 ± 0,031 et la régression logistique 0,949 ± 0,020. Avec l'un des quatre transformeurs, on obtient entre 0,972 et 0,981 pour le SVC et entre 0,967 et 0,982 pour la régression logistique : la mise à l'échelle compte, ce que l'on attendait d'étendues si différentes. Entre les quatre transformeurs, les écarts (0,009 pour le SVC, 0,015 pour la régression logistique) sont du même ordre que les écarts-types entre plis (de 0,007 à 0,015) : ici, rien ne permet de désigner un gagnant, et le meilleur n'est pas le même pour les deux modèles. Cinq plis et 569 exemples donnent une mesure bruitée.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `comparer(transformeurs, X, y, cv)` : pour chaque couple `(nom, transformeur)` du dictionnaire, construisez un pipeline `make_pipeline(transformeur, LogisticRegression(max_iter=2000))`, évaluez-le avec `cross_val_score(..., cv=cv)` et renvoyez un dictionnaire `{nom: (moyenne, ecart_type)}` des scores par pli.",
      setup: lines(
        "import numpy as np",
        "from sklearn.datasets import load_wine",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler",
        "",
        "X, y = load_wine(return_X_y=True)",
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "transformeurs = {'standard': StandardScaler(), 'min-max': MinMaxScaler(), 'robuste': RobustScaler()}",
      ),
      starter: lines(
        "def comparer(transformeurs, X, y, cv):",
        "    resultats = {}",
        "    # à compléter : un pipeline évalué par validation croisée pour chaque transformeur",
        "    return resultats",
      ),
      solution: lines(
        "def comparer(transformeurs, X, y, cv):",
        "    resultats = {}",
        "    for nom, transformeur in transformeurs.items():",
        "        modele = make_pipeline(transformeur, LogisticRegression(max_iter=2000))",
        "        scores = cross_val_score(modele, X, y, cv=cv)",
        "        resultats[nom] = (scores.mean(), scores.std())",
        "    return resultats",
        "",
        "for nom, (moyenne, ecart) in comparer(transformeurs, X, y, cv).items():",
        "    print(f'{nom:<10} {moyenne:.3f} ± {ecart:.3f}')",
      ),
      test: lines(
        "_r = comparer(transformeurs, X, y, cv)",
        "assert set(_r) == set(transformeurs), f\"le dictionnaire doit avoir une entrée par transformeur ({sorted(transformeurs)}), vous avez {sorted(_r)}\"",
        "for _nom, _t in transformeurs.items():",
        "    _scores = cross_val_score(make_pipeline(_t, LogisticRegression(max_iter=2000)), X, y, cv=cv)",
        "    _moyenne, _ecart = _r[_nom]",
        "    assert abs(_moyenne - _scores.mean()) < 1e-9, f\"« {_nom} » : la moyenne attendue est {_scores.mean():.3f}, vous avez {_moyenne:.3f}\"",
        "    assert abs(_ecart - _scores.std()) < 1e-9, f\"« {_nom} » : l'écart-type attendu est {_scores.std():.3f}, vous avez {_ecart:.3f}\"",
      ),
      hint: "Dans une boucle sur transformeurs.items() : scores = cross_val_score(make_pipeline(transformeur, LogisticRegression(max_iter=2000)), X, y, cv=cv), puis resultats[nom] = (scores.mean(), scores.std()).",
    },
    {
      kind: "text",
      md: `### Quand les données ont un ordre

Une validation croisée ordinaire mélange les lignes : un pli de test contient alors des dates situées **avant** celles de l'entraînement. Pour une série temporelle, le modèle apprendrait du futur pour prédire le passé, ce qui est une autre forme de fuite (celle du module 2, avec la série qui monte). Le découpage \`TimeSeriesSplit\` respecte l'ordre : chaque pli de test est **après** son entraînement, et l'entraînement s'agrandit de pli en pli.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.model_selection import TimeSeriesSplit",
        "",
        "mois = np.arange(12)  # douze mois dans l'ordre chronologique",
        "for numero, (entrainement, test) in enumerate(TimeSeriesSplit(n_splits=3).split(mois), start=1):",
        "    print(f'pli {numero} : entraînement {entrainement.tolist()}  test {test.tolist()}')",
      ),
      caption:
        "Les trois plis entraînent sur les mois 0 à 2, puis 0 à 5, puis 0 à 8, et testent à chaque fois sur les trois mois suivants : le test est toujours dans le futur de l'entraînement.",
    },
    {
      kind: "text",
      md: `### Une fuite bien plus grave qu'un scaler

Le module 2 a mesuré qu'une fuite par un simple scaler reste discrète sur des données stables et devient visible quand elles dérivent. Elle peut être bien pire : une étape qui utilise la **cible** (comme une sélection de variables) peut produire une fuite énorme. Voici une variante d'une expérience classique, décrite dans *The Elements of Statistical Learning* (Hastie, Tibshirani et Friedman), avec ici 100 exemples, 2 000 variables de **pur bruit**, des étiquettes sans aucun rapport avec elles. Aucun modèle ne peut y prédire mieux que le hasard, soit 0,5.

- **Mauvaise méthode** : on garde les 20 variables les mieux corrélées avec l'étiquette en regardant **tous** les exemples, puis on valide. Parmi 2 000 variables aléatoires, quelques-unes sont corrélées aux étiquettes par pur hasard, et la sélection les a trouvées en voyant aussi les exemples de test.
- **Bonne méthode** : la sélection est une étape du \`Pipeline\`, donc refaite sur chaque partie d'entraînement, sans voir les étiquettes du pli de test.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.feature_selection import SelectKBest, f_classif",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "",
        "rng = np.random.default_rng(0)",
        "X = rng.normal(size=(100, 2000))              # 2000 variables de pur bruit",
        "y = rng.permutation(np.repeat([0, 1], 50))    # 50 et 50, sans aucun lien avec X",
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "",
        "# Mauvaise méthode : sélection sur toutes les données, puis validation croisée",
        "X_choisi = SelectKBest(f_classif, k=20).fit_transform(X, y)",
        "fuite = cross_val_score(LogisticRegression(max_iter=1000), X_choisi, y, cv=cv)",
        "",
        "# Bonne méthode : la sélection est refaite dans chaque pli, grâce au pipeline",
        "pipeline = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))",
        "honnete = cross_val_score(pipeline, X, y, cv=cv)",
        "",
        "print('exactitude avec fuite    :', fuite.round(2), ' moyenne', fuite.mean().round(3))",
        "print('exactitude sans fuite    :', honnete.round(2), ' moyenne', honnete.mean().round(3))",
        "print('exactitude du hasard pur :', 0.5)",
      ),
      caption:
        "Sur du bruit pur, la méthode fautive annonce 0,84 d'exactitude en moyenne (de 0,75 à 0,95 selon le pli), ce qui ferait croire à un modèle remarquable. La méthode correcte donne 0,54, tout près du hasard, ce qui est la vérité. Les deux utilisent exactement les mêmes données et le même modèle : seule change la place de la sélection. Voilà ce que le Pipeline protège.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Le code de départ commet la faute : il sélectionne les variables sur tout le jeu avant la validation croisée. Corrigez-le pour que la sélection (`SelectKBest(f_classif, k=20)`) fasse partie d'un `make_pipeline` avec la `LogisticRegression`, et rangez dans `score_honnete` la moyenne de `cross_val_score(..., cv=cv)`. Les données de bruit (`X`, `y`) et `cv` sont fournis.",
      setup: lines(
        "import numpy as np",
        "from sklearn.feature_selection import SelectKBest, f_classif",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "",
        "rng = np.random.default_rng(0)",
        "X = rng.normal(size=(100, 2000))",
        "y = rng.permutation(np.repeat([0, 1], 50))",
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
      ),
      starter: lines(
        "X_choisi = SelectKBest(f_classif, k=20).fit_transform(X, y)  # fuite : la sélection voit tout le jeu",
        "score_honnete = cross_val_score(LogisticRegression(max_iter=1000), X_choisi, y, cv=cv).mean()",
      ),
      solution: lines(
        "modele = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))",
        "score_honnete = cross_val_score(modele, X, y, cv=cv).mean()",
        "print(round(score_honnete, 3))",
      ),
      test: lines(
        "_modele = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))",
        "_attendu = cross_val_score(_modele, X, y, cv=cv).mean()",
        "assert abs(score_honnete - _attendu) < 1e-9, f\"sur du bruit pur, le score honnête doit avoisiner 0,5 : attendu {_attendu:.2f} avec la sélection refaite dans chaque pli, vous avez {score_honnete:.2f} (la sélection voit encore les exemples de test)\"",
      ),
      hint: "Ne transformez pas X avant cross_val_score. Donnez à cross_val_score un pipeline make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000)) et X tel quel.",
    },
    {
      kind: "text",
      md: `### Sauvegarder le pipeline entier, puis surveiller

En production, le modèle ne reçoit pas des données déjà prêtes : il reçoit les données brutes, et doit leur faire subir **exactement** les transformations apprises à l'entraînement. Deux conséquences :

- on sauvegarde le **pipeline entier** (scaler, encodeur, modèle) et non le seul modèle : c'est lui qui contient la moyenne, l'écart-type et les catégories apprises ;
- on recharge un nouveau lot avec \`transform\`, jamais avec un nouveau \`fit\`.

L'autre moitié du travail est la **surveillance**. Les données changent : un capteur est recalibré, une population évolue. Un pipeline continue de produire des prédictions, mais sur des valeurs qui sortent de ce qu'il a appris. Une première alerte simple consiste à comparer la **moyenne** d'un lot de nouvelles données à celle de l'entraînement, en nombre d'erreurs standard de la moyenne : \`z = (moyenne du lot - moyenne apprise) / (écart-type appris / racine de n)\`. C'est un signal à examiner, pas un test rigoureux : les variables sont souvent corrélées et les lots ne sont pas toujours indépendants.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import io",
        "import joblib",
        "import numpy as np",
        "import pandas as pd  # as_frame=True renvoie des tableaux pandas",
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "cancer = load_breast_cancer(as_frame=True)",
        "X, y = cancer.data, cancer.target",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)",
        "modele = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000)).fit(X_train, y_train)",
        "print('exactitude sur le test :', round(modele.score(X_test, y_test), 3))",
        "",
        "# Sauvegarde du pipeline entier (en mémoire ici : le moteur du site n'a pas de fichiers)",
        "tampon = io.BytesIO()",
        "joblib.dump(modele, tampon)",
        "print('taille sauvegardée :', tampon.getbuffer().nbytes, 'octets')",
        "tampon.seek(0)",
        "recharge = joblib.load(tampon)",
        "print('mêmes prédictions après rechargement :', bool((recharge.predict(X_test) == modele.predict(X_test)).all()))",
        "",
        "# Surveillance : la moyenne d'un lot s'écarte-t-elle de celle de l'entraînement ?",
        "scaler = recharge.named_steps['standardscaler']",
        "def z_moyenne(lot):",
        "    return (lot.mean(axis=0).to_numpy() - scaler.mean_) / (scaler.scale_ / np.sqrt(len(lot)))",
        "",
        "normal = X_test.sample(60, random_state=1)",
        "derive = normal.copy()",
        "i = list(X.columns).index('mean texture')",
        "derive['mean texture'] = derive['mean texture'] + 1.5 * scaler.scale_[i]  # un capteur décalé de 1,5 écart-type",
        "for nom, lot in (('lot normal', normal), ('lot dérivé', derive)):",
        "    z = z_moyenne(lot)",
        "    alertes = [X.columns[j] for j in np.where(np.abs(z) > 3)[0]]",
        "    print(f'{nom} : |z| maximal {np.abs(z).max():.2f}, variables en alerte {alertes}, exactitude {modele.score(lot, y_test.loc[lot.index]):.3f}')",
      ),
      caption:
        "Le pipeline rechargé (3 057 octets) donne exactement les mêmes prédictions. Sur un lot de 60 lignes de même origine que l'entraînement, le plus grand |z| est 1,52 et aucune variable n'est en alerte. Dans le lot dont « mean texture » a été décalée de 1,5 écart-type, cette variable atteint |z| = 12,82 et seule elle est signalée. Nuance importante : l'exactitude reste à 0,983 sur les deux lots. Une alerte de dérive prévient que les données ont changé, elle ne prouve pas que le modèle se trompe davantage : en production, on n'a d'ailleurs souvent pas les étiquettes pour le vérifier tout de suite.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `variables_derivees(scaler, lot, seuil=3.0)` qui renvoie la **liste des indices de colonnes** dont la moyenne dans `lot` (un tableau NumPy, une ligne par observation) s'écarte de plus de `seuil` erreurs standard de la moyenne apprise : `z = (lot.mean(axis=0) - scaler.mean_) / (scaler.scale_ / np.sqrt(n))`, où `n` est le nombre de lignes du lot, puis les colonnes où `abs(z) > seuil`.",
      setup: lines(
        "import numpy as np",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "rng = np.random.default_rng(0)",
        "historique = rng.normal(loc=[10.0, 50.0, 0.0, 200.0], scale=[2.0, 10.0, 1.0, 40.0], size=(500, 4))",
        "scaler = StandardScaler().fit(historique)",
      ),
      starter: lines("def variables_derivees(scaler, lot, seuil=3.0):", "    # à compléter : un z par colonne, puis les indices où |z| dépasse le seuil", "    return []"),
      solution: lines(
        "def variables_derivees(scaler, lot, seuil=3.0):",
        "    z = (lot.mean(axis=0) - scaler.mean_) / (scaler.scale_ / np.sqrt(len(lot)))",
        "    return [int(j) for j in np.where(np.abs(z) > seuil)[0]]",
        "",
        "lot = np.random.default_rng(3).normal(loc=[10.0, 50.0, 0.0, 200.0], scale=[2.0, 10.0, 1.0, 40.0], size=(100, 4))",
        "lot[:, 2] += 0.5",
        "print(variables_derivees(scaler, lot))",
      ),
      test: lines(
        "_lot = np.random.default_rng(3).normal(loc=[10.0, 50.0, 0.0, 200.0], scale=[2.0, 10.0, 1.0, 40.0], size=(100, 4))",
        "assert list(variables_derivees(scaler, _lot)) == [], f\"un lot de même origine que l'historique ne doit déclencher aucune alerte (vous avez {variables_derivees(scaler, _lot)})\"",
        "_decale = _lot.copy()",
        "_decale[:, 2] += 0.5   # un demi-écart-type sur la colonne 2 : z d'environ 6 avec 100 lignes",
        "_decale[:, 3] += 4.0   # un dixième d'écart-type sur la colonne 3 : z inférieur à 1, pas d'alerte",
        "assert list(variables_derivees(scaler, _decale)) == [2], f\"seule la colonne 2 a dérivé (|z| autour de 6) : attendu [2], vous avez {list(variables_derivees(scaler, _decale))}\"",
        "assert list(variables_derivees(scaler, _decale, seuil=10.0)) == [], \"avec un seuil de 10, plus aucune colonne ne doit être signalée\"",
      ),
      hint: "z = (lot.mean(axis=0) - scaler.mean_) / (scaler.scale_ / np.sqrt(len(lot))) donne un z par colonne ; np.where(np.abs(z) > seuil)[0] donne les indices à renvoyer.",
    },
    {
      kind: "text",
      md: lines(
        "### Sur votre machine : écrire sur disque (code à lire)",
        "",
        "Le moteur de ce site n'a pas de système de fichiers : l'exemple ci-dessus sauvegarde donc en mémoire. Sur votre machine, c'est la même fonction avec un nom de fichier :",
        "",
        "```python",
        "import joblib",
        "",
        "joblib.dump(modele, 'modele_v1.joblib')   # à l'entraînement : le pipeline entier",
        "",
        "modele = joblib.load('modele_v1.joblib')  # en production",
        "print(modele.predict(nouvelles_donnees))  # données brutes : le pipeline les transforme",
        "```",
        "",
        "Deux précautions. **Un fichier joblib ou pickle exécute du code à sa lecture** : ne chargez jamais un fichier dont vous ne connaissez pas la provenance. Et rechargez-le avec la **même version de scikit-learn** que celle de l'entraînement, que l'on note à côté du fichier, avec la date, les paramètres et la graine aléatoire : c'est ce qui rend un résultat reproductible. Des outils spécialisés existent pour le suivi d'expériences (MLflow, par exemple) et la validation des données (Great Expectations), mais ce cours n'en dépend pas : un fichier de notes tenu à jour vaut mieux qu'un outil non utilisé.",
      ),
    },
    {
      kind: "note",
      tone: "tip",
      md: "**À retenir de tout le cours, côté données.** Explorez avant de transformer ; tout ce qui apprend quelque chose (scaler, imputeur, encodeur, sélection de variables, ACP) va dans le `Pipeline` ; comparez les options par validation croisée sur les mêmes plis, en lisant la dispersion ; respectez l'ordre du temps quand il existe ; sauvegardez le pipeline entier et surveillez les données qui arrivent ; et gardez en tête que l'on n'a jamais prouvé qu'une transformation est « la meilleure » : on a seulement mesuré qu'elle suffit, sur ces données-là.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi mettre le scaler dans le Pipeline plutôt que de transformer X avant cross_val_score ?",
      options: [
        "Parce que cross_val_score refuse les données non transformées",
        "Pour que le scaler soit réappris sur la partie d'entraînement de chaque pli, sans voir le pli de test",
        "Pour accélérer le calcul",
        "Pour obtenir un meilleur score à coup sûr",
      ],
      correct: 1,
      explanation: "Transformé à l'avance, X a déjà servi à calculer les statistiques du scaler, test compris. Dans le pipeline, chaque pli réapprend sa propre transformation, comme en production.",
    },
    {
      question: "Sur 2 000 variables de pur bruit, on sélectionne les 20 meilleures avec toutes les données, puis on valide : on obtient environ 0,84. Pourquoi ?",
      options: [
        "Le modèle est vraiment bon",
        "La sélection a utilisé les étiquettes des exemples de test : parmi 2 000 variables, quelques-unes sont corrélées aux étiquettes par hasard",
        "Les étiquettes étaient déséquilibrées",
        "La validation croisée a mal fonctionné",
      ],
      correct: 1,
      explanation: "La sélection a vu les étiquettes de tous les exemples, y compris ceux du pli de test. Refaite dans chaque pli (dans le Pipeline), elle redonne environ 0,54, soit le hasard.",
    },
    {
      question: "Deux scalers donnent 0,972 ± 0,015 et 0,981 ± 0,009 en validation croisée. Que peut-on conclure ?",
      options: [
        "Le second est meilleur de façon certaine",
        "L'écart est du même ordre que la dispersion entre plis : on ne peut pas les départager sur cette mesure",
        "Le premier est meilleur car son écart-type est plus grand",
        "Les deux sont mauvais",
      ],
      correct: 1,
      explanation: "Neuf millièmes d'écart, pour des écarts-types de 0,009 à 0,015 entre plis : la différence peut tenir au découpage. Il faudrait plus de données ou plus de répétitions pour trancher.",
    },
    {
      question: "Pourquoi ne faut-il jamais charger un fichier joblib ou pickle de provenance inconnue ?",
      options: [
        "Parce qu'il est trop volumineux",
        "Parce que sa lecture peut exécuter du code arbitraire",
        "Parce qu'il ne contient que le modèle",
        "Parce qu'il ne se recharge qu'une fois",
      ],
      correct: 1,
      explanation: "Ces formats reconstruisent des objets Python et peuvent, à cette occasion, exécuter n'importe quel code. On ne les charge que si l'on a produit ou vérifié le fichier.",
    },
    {
      question: "Pour prédire les ventes du mois prochain à partir de l'historique, quel découpage de validation choisir ?",
      options: [
        "Un KFold avec mélange",
        "Un TimeSeriesSplit, où chaque pli de test est après son entraînement",
        "Un test pris au hasard au milieu de la série",
        "Aucun : on évalue sur l'entraînement",
      ],
      correct: 1,
      explanation: "Avec un mélange, le modèle apprendrait du futur pour prédire le passé, ce qui est une fuite. TimeSeriesSplit garde l'ordre du temps, comme en situation réelle.",
    },
  ],
};
