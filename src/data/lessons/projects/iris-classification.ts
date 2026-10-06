import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "from sklearn.datasets import load_iris",
  "from sklearn.model_selection import train_test_split, cross_val_score",
  "",
  "iris = load_iris(as_frame=True)",
  "X, y = iris.data, iris.target",
  "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)",
);

export const projectIris: LessonModule = {
  id: "beginner-2",
  title: "Projet guidé : classer des fleurs d'iris",
  duration: "3 h",
  summary: "Un projet d'apprentissage supervisé complet et sans précipitation : explorer, poser une référence, comparer des modèles honnêtement, analyser les erreurs.",
  objectives: [
    "Suivre les étapes d'un projet de classification dans l'ordre",
    "Poser une référence naïve avant tout modèle",
    "Comparer des modèles en validation croisée, sans toucher au jeu de test",
    "Analyser les erreurs avec une matrice de confusion",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Le jeu **iris** (Fisher, 1936) décrit 150 fleurs de trois espèces (setosa, versicolor, virginica) par quatre mesures : longueur et largeur du sépale et du pétale. Objectif : prédire l'espèce d'une fleur à partir de ses mesures.

C'est un jeu facile, et c'est tant mieux pour un premier projet : toute l'attention peut aller à la **méthode**. Le partage entraînement / test est fait une fois pour toutes (30 % pour le test, stratifié) : le jeu de test ne servira qu'à la toute fin.`,
    },
    {
      kind: "text",
      md: "### Étape 1 : explorer\n\nLes moyennes par espèce et un nuage de points des pétales montrent tout de suite ce qui sera facile (setosa) et ce qui le sera moins (versicolor et virginica se chevauchent un peu).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "noms = dict(enumerate(iris.target_names))",
        "print(X.groupby(y.map(noms)).mean().round(2))",
        "",
        "fig, ax = plt.subplots()",
        "for k, nom in noms.items():",
        "    masque = y == k",
        "    ax.scatter(X.loc[masque, 'petal length (cm)'], X.loc[masque, 'petal width (cm)'], s=14, label=nom)",
        "ax.set_xlabel('longueur du pétale (cm)')",
        "ax.set_ylabel('largeur du pétale (cm)')",
        "ax.legend()",
        "plt.show()",
      ),
      caption: "Les setosa sont isolées ; versicolor et virginica se touchent : c'est là que se feront les erreurs.",
    },
    {
      kind: "text",
      md: "### Étape 2 : une référence naïve\n\nAvant tout modèle, on mesure ce que donne une règle sans intelligence, par exemple « toujours prédire la classe la plus fréquente » (`DummyClassifier`). Un modèle qui ne fait pas nettement mieux n'a rien appris d'utile.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un `DummyClassifier(strategy='most_frequent')` sur l'entraînement et rangez son **exactitude moyenne en validation croisée à 5 plis** (sur `X_train`, `y_train`) dans `reference`.",
      setup: DONNEES,
      starter: lines("from sklearn.dummy import DummyClassifier", "", "reference = None"),
      solution: lines(
        "from sklearn.dummy import DummyClassifier",
        "",
        "reference = cross_val_score(DummyClassifier(strategy='most_frequent'), X_train, y_train, cv=5).mean()",
        "print(round(reference, 3))",
      ),
      test: lines(
        "assert reference is not None, \"rangez l'exactitude moyenne dans reference\"",
        "assert 0.3 < reference < 0.37, f\"trois classes équilibrées : la référence naïve tourne autour d'un tiers (vous avez {reference:.3f})\"",
      ),
      hint: "cross_val_score(DummyClassifier(strategy='most_frequent'), X_train, y_train, cv=5).mean().",
    },
    {
      kind: "text",
      md: "### Étape 3 : comparer des modèles\n\nOn compare quelques modèles simples **en validation croisée sur l'entraînement**. Pour le KNN, on met les variables à l'échelle dans un pipeline (ici, elles sont toutes en centimètres et d'ordres de grandeur proches, mais c'est une bonne habitude).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez l'exactitude moyenne en validation croisée à 5 plis de trois modèles : un **KNN à 5 voisins** (dans un pipeline avec `StandardScaler`), un **arbre de décision** de profondeur maximale 3 (`random_state=0`) et une **régression logistique** (`max_iter=1000`). Rangez les trois moyennes dans le dictionnaire `scores`, avec les clés `'knn'`, `'arbre'` et `'logistique'`.",
      setup: DONNEES,
      starter: lines(
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.tree import DecisionTreeClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.pipeline import make_pipeline",
        "",
        "scores = {}",
      ),
      solution: lines(
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.tree import DecisionTreeClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.pipeline import make_pipeline",
        "",
        "modeles = {",
        "    'knn': make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)),",
        "    'arbre': DecisionTreeClassifier(max_depth=3, random_state=0),",
        "    'logistique': LogisticRegression(max_iter=1000),",
        "}",
        "scores = {nom: cross_val_score(m, X_train, y_train, cv=5).mean() for nom, m in modeles.items()}",
        "print({nom: round(s, 3) for nom, s in scores.items()})",
      ),
      test: lines(
        "assert set(scores) == {'knn', 'arbre', 'logistique'}, f\"clés attendues : knn, arbre, logistique (vous avez {sorted(scores)})\"",
        "assert all(0.85 < s <= 1 for s in scores.values()), f\"les trois modèles devraient dépasser 0,85 en validation croisée (vous avez {scores})\"",
      ),
      hint: "Un dictionnaire {nom: modèle}, puis cross_val_score(modèle, X_train, y_train, cv=5).mean() pour chacun.",
    },
    {
      kind: "text",
      md: "### Étape 4 : évaluer une fois sur le test, et analyser les erreurs\n\nLes trois modèles sont proches : on en choisit un (ici la régression logistique, simple et stable), on l'entraîne sur tout l'entraînement, puis on l'évalue **une seule fois** sur le jeu de test. La **matrice de confusion** dit quelles espèces sont confondues.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez une régression logistique (`max_iter=1000`) sur tout l'entraînement, prédisez le jeu de test, et rangez la **matrice de confusion** dans `matrice` et le **nombre d'erreurs** dans `nb_erreurs`.",
      setup: DONNEES,
      starter: lines("from sklearn.linear_model import LogisticRegression", "from sklearn.metrics import confusion_matrix", "", "matrice = None", "nb_erreurs = None"),
      solution: lines(
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.metrics import confusion_matrix",
        "",
        "modele = LogisticRegression(max_iter=1000).fit(X_train, y_train)",
        "pred = modele.predict(X_test)",
        "matrice = confusion_matrix(y_test, pred)",
        "nb_erreurs = int((pred != y_test).sum())",
        "print(matrice)",
        "print('erreurs :', nb_erreurs, 'sur', len(y_test))",
      ),
      test: lines(
        "from sklearn.linear_model import LogisticRegression as _LR",
        "from sklearn.metrics import confusion_matrix as _cm",
        "_pred = _LR(max_iter=1000).fit(X_train, y_train).predict(X_test)",
        "assert matrice is not None and matrice.shape == (3, 3), \"la matrice de confusion d'un problème à 3 classes est un tableau 3 × 3\"",
        "assert (matrice == _cm(y_test, _pred)).all(), \"la matrice doit être calculée sur le jeu de test\"",
        "assert nb_erreurs == int((_pred != y_test).sum()), \"le nombre d'erreurs est la somme hors diagonale de la matrice\"",
      ),
      hint: "confusion_matrix(y_test, pred) ; le nombre d'erreurs est (pred != y_test).sum().",
    },
    {
      kind: "text",
      md: `### Étape 5 : conclure

- Tous les modèles battent très largement la référence naïve (un tiers) : les mesures des fleurs contiennent l'information utile.
- Les rares erreurs portent sur **versicolor et virginica**, comme l'exploration le laissait prévoir ; setosa n'est jamais confondue.
- Sur 45 fleurs de test, une ou deux erreurs de plus ou de moins changent l'exactitude de plusieurs points : on présente donc le score de validation croisée, avec sa dispersion, à côté du score de test.

Pour aller plus loin : refaites le projet avec le jeu **wine** (\`load_wine\`), où la mise à l'échelle change vraiment les résultats du KNN.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi calculer une référence naïve avant d'entraîner un modèle ?",
      options: [
        "Pour avoir un score plus élevé",
        "Pour savoir si le modèle apprend réellement quelque chose au-delà d'une règle triviale",
        "Parce que scikit-learn l'exige",
        "Pour remplacer le jeu de test",
      ],
      correct: 1,
      explanation: "Un modèle à 0,35 paraît honorable jusqu'à ce qu'on voie qu'une règle qui répond toujours la même classe obtient 0,33.",
    },
    {
      question: "Pourquoi comparer les modèles en validation croisée sur l'entraînement plutôt que sur le test ?",
      options: [
        "Parce que c'est plus rapide",
        "Pour garder le jeu de test intact, comme une mesure honnête utilisée une seule fois à la fin",
        "Parce que le test est trop grand",
        "Il n'y a aucune différence",
      ],
      correct: 1,
      explanation: "Choisir un modèle d'après le test revient à s'adapter à lui : son score ne serait plus une estimation honnête.",
    },
    {
      question: "Que montre la matrice de confusion que l'exactitude ne montre pas ?",
      options: [
        "Le temps de calcul",
        "Quelles classes sont confondues avec lesquelles",
        "Le nombre de variables",
        "La qualité des données",
      ],
      correct: 1,
      explanation: "L'exactitude donne un seul nombre ; la matrice dit où sont les erreurs (ici, entre versicolor et virginica).",
    },
  ],
};
