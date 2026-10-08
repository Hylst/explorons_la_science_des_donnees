import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module1: LessonModule = {
  id: "choisir-un-modele",
  title: "Choisir une famille de modèles",
  duration: "2 h",
  summary: "Type de problème, référence naïve, comparaison de plusieurs familles en validation croisée sur un même jeu, et critères de choix : un panorama pour décider par la mesure plutôt que par habitude.",
  objectives: [
    "Distinguer problèmes supervisés, non supervisés et par renforcement, et en déduire les familles de modèles à essayer",
    "Mesurer une référence naïve avant tout autre modèle, et dire ce qu'elle apprend",
    "Comparer plusieurs familles en validation croisée avec le même découpage, en lisant la moyenne et l'écart-type",
    "Peser taille des données, interprétabilité et coût de calcul, et expliquer pourquoi le meilleur modèle d'un jeu n'est pas le meilleur partout",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois façons d'apprendre

Avant de choisir un algorithme, on choisit un type de problème. La question à se poser est simple : de quelles données dispose-t-on, et qu'attend-on d'elles ?

- **Apprentissage supervisé** : on a des exemples avec leur réponse (la cible). On prédit une catégorie (classification) ou un nombre (régression). C'est le cas le plus courant, et celui des modèles linéaires, des k plus proches voisins, des arbres et de leurs ensembles, des SVM et des réseaux de neurones.
- **Apprentissage non supervisé** : pas de cible. On cherche une structure dans les données : des groupes (clustering), des directions qui résument l'information (réduction de dimension), des points inhabituels.
- **Apprentissage par renforcement** : pas d'exemples tout faits, mais un agent qui agit dans un environnement et reçoit des récompenses. Il apprend une stratégie par essais successifs.

Les réseaux de neurones ne forment pas un quatrième type de problème : c'est une famille de modèles, utilisable dans les trois situations ci-dessus.`,
    },
    {
      kind: "text",
      md: `### Ce guide est un panorama

Il aide à choisir une famille de modèles, puis consacre un module pratique à chaque famille que le reste du site ne traite pas en détail :

- le module 2 : la descente de gradient stochastique (\`SGDClassifier\`), qui apprend sur de gros volumes ou au fil de l'eau ;
- le module 3 : le boosting, des arbres construits l'un après l'autre ;
- le module 4 : le clustering (K-Means, classification hiérarchique, DBSCAN) ;
- le module 5 : l'apprentissage par renforcement, avec un Q-learning écrit en NumPy ;
- le module 6 : les réseaux de neurones, du perceptron à la convolution.

Pour les modèles linéaires, les arbres de décision, les forêts aléatoires, les SVM, l'évaluation et le réglage des hyperparamètres, le guide renvoie au cours « Machine learning supervisé » du site : il y a là un module complet pour chacun, et il serait inutile de les recopier ici.

Tous les exemples s'exécutent dans votre navigateur, avec scikit-learn et NumPy, sur des jeux de données fournis avec la bibliothèque. Les scores affichés sont calculés par le code : ils dépendent des données et des graines aléatoires, et vous pouvez les voir changer si vous modifiez l'une ou l'autre.`,
    },
    {
      kind: "text",
      md: `### Toujours commencer par une référence naïve

Un score ne veut rien dire seul. 95 % de bonnes réponses, est-ce beaucoup ? Cela dépend de ce que donnerait une règle sans aucune intelligence. Le premier modèle à entraîner est donc le plus bête possible : \`DummyClassifier(strategy="most_frequent")\` prédit toujours la classe la plus fréquente, sans regarder les variables. Tout modèle sérieux doit faire nettement mieux ; sinon, il n'a rien appris d'utile.

La référence apprend aussi autre chose : elle montre si l'exactitude est une bonne mesure pour le problème. Voyons-le sur le jeu des tumeurs du sein de scikit-learn.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.metrics import recall_score",
        "from sklearn.model_selection import cross_val_score",
        "",
        "donnees = load_breast_cancer()",
        "X, y = donnees.data, donnees.target",
        "for nom, effectif in zip(donnees.target_names, np.bincount(y)):",
        "    print(nom, int(effectif))",
        "",
        "reference = DummyClassifier(strategy=\"most_frequent\")",
        "scores = cross_val_score(reference, X, y, cv=5)",
        "print(\"exactitude de la référence (5 plis) :\", round(scores.mean(), 3))",
        "",
        "# que détecte réellement cette référence ? Aucune tumeur maligne (classe 0).",
        "predictions = reference.fit(X, y).predict(X)",
        "print(\"tumeurs malignes retrouvées :\", recall_score(y, predictions, pos_label=0))",
      ),
      caption: "Une règle qui ne regarde rien obtient déjà la proportion de la classe majoritaire, et ne repère aucune tumeur maligne. L'exactitude seule flatte donc ce genre de problème.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `comparer(modeles, X, y)` : elle reçoit un dictionnaire `{nom: modèle}` et renvoie un dictionnaire `{nom: exactitude moyenne en validation croisée à 5 plis}` (utilisez `cross_val_score(modele, X, y, cv=5)`). C'est la brique de base de toute comparaison de modèles.",
      starter: lines(
        "from sklearn.datasets import load_wine",
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.model_selection import cross_val_score",
        "from sklearn.tree import DecisionTreeClassifier",
        "",
        "X, y = load_wine(return_X_y=True)",
        "",
        "",
        "def comparer(modeles, X, y):",
        "    resultats = {}",
        "    # remplissez resultats : un score moyen par nom de modèle",
        "    return resultats",
        "",
        "",
        "modeles = {",
        "    \"référence\": DummyClassifier(strategy=\"most_frequent\"),",
        "    \"arbre\": DecisionTreeClassifier(max_depth=3, random_state=0),",
        "}",
        "resultats = comparer(modeles, X, y)",
        "print(resultats)",
      ),
      solution: lines(
        "from sklearn.datasets import load_wine",
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.model_selection import cross_val_score",
        "from sklearn.tree import DecisionTreeClassifier",
        "",
        "X, y = load_wine(return_X_y=True)",
        "",
        "",
        "def comparer(modeles, X, y):",
        "    resultats = {}",
        "    for nom, modele in modeles.items():",
        "        resultats[nom] = cross_val_score(modele, X, y, cv=5).mean()",
        "    return resultats",
        "",
        "",
        "modeles = {",
        "    \"référence\": DummyClassifier(strategy=\"most_frequent\"),",
        "    \"arbre\": DecisionTreeClassifier(max_depth=3, random_state=0),",
        "}",
        "resultats = comparer(modeles, X, y)",
        "print(resultats)",
      ),
      test: lines(
        "assert isinstance(resultats, dict), f\"comparer doit renvoyer un dictionnaire (vous renvoyez {type(resultats).__name__})\"",
        "assert set(resultats) == {\"référence\", \"arbre\"}, f\"il faut un score par modèle, sous le même nom (vous avez {sorted(resultats)})\"",
        "for _nom, _modele in modeles.items():",
        "    _attendu = cross_val_score(_modele, X, y, cv=5).mean()",
        "    assert abs(resultats[_nom] - _attendu) < 1e-9, f\"score de « {_nom} » : on attend {_attendu:.3f}, vous avez {resultats[_nom]:.3f}\"",
      ),
      hint: "Une boucle sur modeles.items() ; pour chaque nom, resultats[nom] = cross_val_score(modele, X, y, cv=5).mean().",
    },
    {
      kind: "text",
      md: `### Comparer plusieurs familles, à armes égales

Pour que la comparaison soit honnête, tous les modèles doivent subir **les mêmes épreuves** : les mêmes données, les mêmes plis de validation croisée (on fixe donc le découpage avec \`StratifiedKFold(shuffle=True, random_state=0)\`), et chacun reçoit la préparation qu'il exige.

- Les modèles qui reposent sur des distances (k plus proches voisins, SVM) ou sur une descente de gradient (régression logistique, réseaux) demandent des variables à la même échelle : on les place dans un \`pipeline\` avec un \`StandardScaler\`, qui est alors réajusté dans chaque pli (sans fuite d'information).
- Les arbres et les forêts comparent chaque variable à un seuil : ils ne changent pas si l'on étire une variable, et se passent de mise à l'échelle.

On regarde la **moyenne** des scores des plis, mais aussi leur **écart-type** : il donne l'ordre de grandeur du bruit de la mesure.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import time",
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.ensemble import RandomForestClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.svm import SVC",
        "from sklearn.tree import DecisionTreeClassifier",
        "",
        "X, y = load_breast_cancer(return_X_y=True)",
        "decoupage = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "",
        "modeles = {",
        "    \"référence naïve\": DummyClassifier(strategy=\"most_frequent\"),",
        "    \"régression logistique\": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),",
        "    \"k plus proches voisins\": make_pipeline(StandardScaler(), KNeighborsClassifier()),",
        "    \"SVM à noyau gaussien\": make_pipeline(StandardScaler(), SVC()),",
        "    \"arbre de décision\": DecisionTreeClassifier(random_state=0),",
        "    \"forêt aléatoire\": RandomForestClassifier(n_estimators=100, random_state=0),",
        "}",
        "",
        "for nom, modele in modeles.items():",
        "    debut = time.perf_counter()",
        "    scores = cross_val_score(modele, X, y, cv=decoupage)",
        "    duree = time.perf_counter() - debut",
        "    print(f\"{nom:24s} {scores.mean():.3f} ± {scores.std():.3f}   ({duree:.2f} s pour 5 plis)\")",
      ),
      caption: "Les durées dépendent de votre machine, les scores des données et de la graine du découpage. Ce qui compte : l'ordre de grandeur des écarts, comparé à l'écart-type.",
    },
    {
      kind: "text",
      md: `### Lire le tableau sans en dire plus qu'il n'en dit

Sur ce jeu et ce découpage, la régression logistique (0,979) et le SVM (0,977) sont en tête, suivis de près par les k plus proches voisins et la forêt aléatoire (0,965 chacun). L'arbre seul ferme la marche (0,926), tout de même très au-dessus de la référence naïve (0,627).

Il faut résister à l'envie de proclamer un vainqueur. L'écart entre la régression logistique et la forêt est de 0,014, c'est-à-dire l'écart-type de chacune des deux. Avec 569 tumeurs et 5 plis, il serait imprudent de dire laquelle est meilleure : un autre découpage pourrait inverser leur ordre. Seul l'écart avec l'arbre isolé (0,053 pour la régression logistique) est assez grand, plus de deux fois l'écart-type, pour qu'on lui accorde du crédit.

Le classement dépend aussi du jeu. L'exemple suivant refait la même comparaison sur trois jeux : les tumeurs, les vins (178 exemples, 13 mesures chimiques, 3 cépages) et les chiffres manuscrits (1 797 images de 8 sur 8 pixels, 10 classes).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.datasets import load_breast_cancer, load_digits, load_wine",
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.ensemble import RandomForestClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.svm import SVC",
        "from sklearn.tree import DecisionTreeClassifier",
        "",
        "",
        "def fabriquer_modeles():",
        "    return {",
        "        \"référence naïve\": DummyClassifier(strategy=\"most_frequent\"),",
        "        \"régression logistique\": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),",
        "        \"k plus proches voisins\": make_pipeline(StandardScaler(), KNeighborsClassifier()),",
        "        \"SVM à noyau gaussien\": make_pipeline(StandardScaler(), SVC()),",
        "        \"arbre de décision\": DecisionTreeClassifier(random_state=0),",
        "        \"forêt aléatoire\": RandomForestClassifier(n_estimators=100, random_state=0),",
        "    }",
        "",
        "",
        "jeux = {\"tumeurs\": load_breast_cancer, \"vins\": load_wine, \"chiffres\": load_digits}",
        "moyennes = {}",
        "for nom_jeu, charger in jeux.items():",
        "    X, y = charger(return_X_y=True)",
        "    decoupage = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "    for nom, modele in fabriquer_modeles().items():",
        "        moyennes[(nom, nom_jeu)] = cross_val_score(modele, X, y, cv=decoupage).mean()",
        "",
        "print(f\"{'modèle':24s}\" + \"\".join(f\"{j:>10s}\" for j in jeux))",
        "for nom in fabriquer_modeles():",
        "    print(f\"{nom:24s}\" + \"\".join(f\"{moyennes[(nom, j)]:10.3f}\" for j in jeux))",
        "",
        "for j in jeux:",
        "    classement = sorted(fabriquer_modeles(), key=lambda nom: moyennes[(nom, j)], reverse=True)",
        "    print(\"classement sur\", j, \":\", \", \".join(classement[:4]))",
      ),
      caption: "Même protocole, trois jeux : l'ordre des familles n'est pas le même d'un jeu à l'autre.",
    },
    {
      kind: "text",
      md: `### Ce que le tableau montre

- Sur les tumeurs, la régression logistique arrive en tête (0,979). Sur les vins, elle est à égalité avec le SVM (0,983 chacun). Sur les chiffres, elle recule au quatrième rang (0,969), derrière le SVM (0,981), les k plus proches voisins (0,977) et la forêt (0,973).
- Les k plus proches voisins sont quatrièmes sur les vins (0,961) mais deuxièmes sur les chiffres : un même modèle peut sembler faible ou fort selon le jeu.
- L'arbre de décision seul est le dernier des vrais modèles sur les trois jeux (0,926, 0,927 et 0,859). Sur les chiffres, la référence naïve tombe à 0,101, soit à peu près une chance sur dix : le hasard pour dix classes de tailles voisines.
- Parmi les quatre premiers, les écarts sont de l'ordre d'un à deux points, du même ordre que les écarts-types vus plus haut.

Sur ces petits jeux de données, un modèle simple comme la régression logistique est une référence très difficile à battre. Ce constat vaut pour ces trois jeux, pas pour tous : sur d'autres données, d'autres modèles passeraient devant. C'est pourquoi on mesure au lieu de supposer.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: `Choisir le meilleur de plusieurs modèles d'après leurs scores de validation croisée rend ce score un peu optimiste : on a pioché le gagnant d'une loterie où le hasard aide certains candidats. Plus on compare de modèles et de réglages, plus ce biais grandit. Pour annoncer une performance, gardez un jeu de test intact, utilisé une seule fois à la fin. Le module « Évaluation et validation » du cours Machine learning supervisé détaille cette précaution.`,
    },
    {
      kind: "text",
      md: `### Les critères de choix, par ordre de bon sens

Une fois la référence mesurée et quelques familles comparées, d'autres critères que le score entrent en jeu :

- **la nature des données.** Pour un tableau de variables numériques et catégorielles, on essaie d'abord un modèle linéaire, une forêt aléatoire et du boosting. Pour des images, du son ou du texte, les réseaux de neurones sont les plus adaptés, souvent à partir d'un modèle déjà pré-entraîné ;
- **le nombre d'exemples.** Avec peu de lignes, les mesures de validation sont très bruitées (voir l'écart-type de l'arbre sur les vins) : mieux vaut un modèle simple ou fortement régularisé qu'un modèle très flexible. Avec des millions de lignes, le coût de calcul devient une contrainte : la descente de gradient stochastique et le boosting par histogrammes sont conçus pour cela ;
- **l'interprétabilité.** Un petit arbre se lit, les coefficients d'une régression linéaire ou logistique se commentent. Une forêt, un boosting ou un réseau donnent de bonnes prédictions mais s'expliquent difficilement. Si vous devez justifier chaque décision, ce critère peut passer avant quelques points de score ;
- **le coût de calcul.** Distinguer le coût de l'entraînement (une fois) de celui de la prédiction (à chaque requête), et la mémoire nécessaire. Un modèle des k plus proches voisins s'entraîne en un instant mais garde toutes les données pour prédire ;
- **la préparation demandée.** Mise à l'échelle, valeurs manquantes, variables catégorielles : chaque famille a ses exigences, et la préparation fait partie du coût réel ;
- **le fonctionnement dans le temps.** Si les données arrivent au fil de l'eau, un modèle capable d'apprendre par petits lots (module 2) évite de tout réentraîner.

Aucune famille ne gagne partout. Un choix raisonnable : commencer par la référence, puis un modèle simple et lisible, puis un modèle plus flexible, et ne garder la complexité que si la mesure la justifie.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur le jeu **diabetes** (régression), rangez dans `mae_reference` l'erreur absolue moyenne en validation croisée à 5 plis d'un `DummyRegressor(strategy=\"median\")`, dans `mae_ridge` celle d'un `Ridge()`, puis dans `ridge_meilleur` le booléen `True` si Ridge a la plus petite erreur. Avec `scoring=\"neg_mean_absolute_error\"`, scikit-learn renvoie l'**opposé** de l'erreur (pour que « plus grand » veuille toujours dire « meilleur ») : il faut donc changer le signe.",
      starter: lines(
        "from sklearn.datasets import load_diabetes",
        "from sklearn.dummy import DummyRegressor",
        "from sklearn.linear_model import Ridge",
        "from sklearn.model_selection import cross_val_score",
        "",
        "X, y = load_diabetes(return_X_y=True)",
        "",
        "mae_reference = None",
        "mae_ridge = None",
        "ridge_meilleur = None",
      ),
      solution: lines(
        "from sklearn.datasets import load_diabetes",
        "from sklearn.dummy import DummyRegressor",
        "from sklearn.linear_model import Ridge",
        "from sklearn.model_selection import cross_val_score",
        "",
        "X, y = load_diabetes(return_X_y=True)",
        "",
        "scores = cross_val_score(DummyRegressor(strategy=\"median\"), X, y, cv=5, scoring=\"neg_mean_absolute_error\")",
        "mae_reference = -scores.mean()",
        "scores = cross_val_score(Ridge(), X, y, cv=5, scoring=\"neg_mean_absolute_error\")",
        "mae_ridge = -scores.mean()",
        "ridge_meilleur = bool(mae_ridge < mae_reference)",
        "print(round(mae_reference, 1), round(mae_ridge, 1), ridge_meilleur)",
      ),
      test: lines(
        "assert mae_reference is not None and mae_ridge is not None, \"mae_reference et mae_ridge doivent contenir un nombre\"",
        "assert mae_reference > 0 and mae_ridge > 0, f\"une erreur absolue est positive : pensez à changer le signe (vous avez {mae_reference:.1f} et {mae_ridge:.1f})\"",
        "_ref = -cross_val_score(DummyRegressor(strategy=\"median\"), X, y, cv=5, scoring=\"neg_mean_absolute_error\").mean()",
        "_rid = -cross_val_score(Ridge(), X, y, cv=5, scoring=\"neg_mean_absolute_error\").mean()",
        "assert abs(mae_reference - _ref) < 1e-9, f\"mae_reference : on attend {_ref:.1f}, vous avez {mae_reference:.1f}\"",
        "assert abs(mae_ridge - _rid) < 1e-9, f\"mae_ridge : on attend {_rid:.1f}, vous avez {mae_ridge:.1f}\"",
        "assert ridge_meilleur is True or ridge_meilleur is False, \"ridge_meilleur doit être un booléen\"",
        "assert ridge_meilleur == (mae_ridge < mae_reference), \"ridge_meilleur doit valoir True si Ridge a la plus petite erreur\"",
      ),
      hint: "cross_val_score(modele, X, y, cv=5, scoring=\"neg_mean_absolute_error\") renvoie cinq nombres négatifs : prenez leur moyenne, puis son opposé.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi entraîner d'abord un modèle « naïf » comme DummyClassifier ?",
      options: [
        "Parce qu'il est toujours le plus rapide à utiliser en production",
        "Parce que scikit-learn l'exige avant tout autre modèle",
        "Pour connaître le score que n'importe quel modèle doit nettement dépasser pour avoir appris quelque chose",
        "Pour remplacer la validation croisée",
      ],
      correct: 2,
      explanation: "La référence naïve fixe le plancher. Un modèle qui n'est pas nettement au-dessus n'a rien appris d'utile, et elle montre aussi si la mesure choisie (ici l'exactitude) a un sens pour le problème.",
    },
    {
      question: "Un agent apprend à traverser un labyrinthe : il essaie des déplacements et reçoit une récompense à l'arrivée. De quel type d'apprentissage s'agit-il ?",
      options: [
        "Par renforcement",
        "Supervisé, car il y a une récompense",
        "Non supervisé, car il n'y a pas de tableau de données",
        "De la classification",
      ],
      correct: 0,
      explanation: "Pas d'exemples avec réponse, mais un agent qui agit et reçoit des récompenses : c'est le cadre de l'apprentissage par renforcement, vu au module 5.",
    },
    {
      question: "Deux modèles ont des exactitudes moyennes de 0,97 et 0,96, avec un écart-type de 0,02 sur les plis. Que peut-on dire ?",
      options: [
        "Le premier est meilleur, puisque 0,97 est supérieur à 0,96",
        "Les deux modèles sont identiques",
        "Il faut choisir celui qui a l'écart-type le plus grand",
        "L'écart est du même ordre que le bruit de la mesure : on ne peut pas les départager sur ces seules données",
      ],
      correct: 3,
      explanation: "Un écart de 0,01 avec des plis qui varient de 0,02 se retrouverait facilement à l'envers avec un autre découpage. Pour trancher, il faut plus de données, plus de répétitions, ou d'autres critères (coût, lisibilité).",
    },
    {
      question: "Pourquoi place-t-on un StandardScaler dans le pipeline des k plus proches voisins, mais pas devant un arbre de décision ?",
      options: [
        "Parce qu'un arbre ne supporte pas les valeurs standardisées",
        "Les distances dépendent de l'échelle des variables, alors qu'un arbre compare chaque variable à un seuil et ne change pas si on l'étire",
        "Parce que les k plus proches voisins ne marchent qu'avec des variables entre 0 et 1",
        "Pour accélérer l'arbre",
      ],
      correct: 1,
      explanation: "Une variable exprimée en grandes valeurs écrase les autres dans un calcul de distance. Un arbre ne fait que comparer chaque variable à un seuil : l'échelle n'a pas d'effet sur ses décisions.",
    },
    {
      question: "Vous avez comparé trente réglages en validation croisée et gardé le meilleur. Que vaut son score ?",
      options: [
        "C'est exactement la performance attendue sur de nouvelles données",
        "Il est forcément pessimiste",
        "Il est probablement un peu optimiste : un jeu de test gardé à part reste nécessaire pour annoncer une performance",
        "Il n'a aucun sens",
      ],
      correct: 2,
      explanation: "Choisir le meilleur parmi beaucoup de candidats avantage ceux que le hasard a favorisés. Le score du gagnant doit être confirmé sur des données qui n'ont servi à aucun choix.",
    },
  ],
};
