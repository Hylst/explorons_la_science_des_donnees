import type { LessonModule } from "@/lib/lessons/types";

const MOONS_SPLIT =
  "from sklearn.datasets import make_moons\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_moons(n_samples=300, noise=0.25, random_state=0)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)";

export const moduleHyperparameters: LessonModule = {
  id: "hyperparameters",
  title: "Optimisation des hyperparamètres",
  duration: "2 h",
  summary: "Choisir les réglages d'un modèle sans tricher : recherche sur grille, recherche aléatoire, et le jeu de test gardé pour la fin.",
  objectives: [
    "Distinguer paramètres appris et hyperparamètres choisis",
    "Utiliser GridSearchCV pour comparer des réglages en validation croisée",
    "Régler les étapes d'un pipeline (syntaxe etape__parametre)",
    "Garder le jeu de test pour une seule évaluation finale",
  ],
  sections: [
    {
      kind: "text",
      md: `### Paramètres et hyperparamètres

Les **paramètres** d'un modèle sont appris pendant \`fit\` : les coefficients d'une régression, les seuils d'un arbre. Les **hyperparamètres** sont choisis avant : le nombre de voisins d'un KNN, la profondeur d'un arbre, le C d'un SVM.

Pour les choisir, la tentation est d'essayer plusieurs valeurs et de garder celle qui donne le meilleur score **sur le jeu de test**. C'est une erreur subtile : à force de choisir d'après le test, on finit par s'adapter à lui, et son score n'est plus une mesure honnête. On choisit donc les réglages en **validation croisée sur l'entraînement**, et le test ne sert qu'une fois, à la fin.`,
    },
    {
      kind: "text",
      md: `### La recherche sur grille

\`GridSearchCV\` essaie toutes les combinaisons d'une grille de valeurs, évalue chacune en validation croisée sur les données d'entraînement, puis réentraîne le meilleur modèle sur tout l'entraînement :

- \`best_params_\` : la meilleure combinaison ;
- \`best_score_\` : son score moyen en validation croisée ;
- l'objet s'utilise ensuite comme un modèle (\`predict\`, \`score\`).

Le coût grandit vite : 4 valeurs de C, 3 valeurs de gamma et 5 plis font 60 entraînements. Quand la grille devient trop grande, \`RandomizedSearchCV\` tire au hasard un nombre fixé de combinaisons, souvent avec de bons résultats pour bien moins de calcul.`,
    },
    {
      kind: "code",
      language: "python",
      code: [
        MOONS_SPLIT,
        "from sklearn.model_selection import GridSearchCV",
        "from sklearn.neighbors import KNeighborsClassifier",
        "",
        "recherche = GridSearchCV(KNeighborsClassifier(), {\"n_neighbors\": [1, 3, 5, 7, 9, 11, 15, 21]}, cv=5)",
        "recherche.fit(X_train, y_train)",
        "print(\"Meilleur réglage :\", recherche.best_params_)",
        "print(\"Score moyen en validation croisée :\", round(recherche.best_score_, 3))",
        "print(\"Score final sur le test (une seule fois) :\", round(recherche.score(X_test, y_test), 3))",
        "for k, s in zip(recherche.cv_results_[\"param_n_neighbors\"], recherche.cv_results_[\"mean_test_score\"]):",
        "    print(f\"  k = {k:>2} : {s:.3f}\")",
      ].join("\n"),
      caption: "Un seul voisin fait moins bien : il colle au bruit des données. De 5 à 15 voisins, les scores sont égaux, et GridSearchCV garde le premier de ces ex aequo. Les écarts restent petits : sur un jeu de cette taille, on évite de sur-interpréter un millième.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Cherchez la meilleure **profondeur maximale** d'un arbre de décision (`random_state=0`) parmi `[1, 2, 3, 4, 5, 6]`, avec `GridSearchCV` en validation croisée à 5 plis sur l'entraînement. Rangez l'objet de recherche entraîné dans `recherche`.",
      setup: MOONS_SPLIT,
      starter: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.tree import DecisionTreeClassifier\n\nrecherche = None",
      solution: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.tree import DecisionTreeClassifier\n\nrecherche = GridSearchCV(DecisionTreeClassifier(random_state=0), {\"max_depth\": [1, 2, 3, 4, 5, 6]}, cv=5)\nrecherche.fit(X_train, y_train)\nprint(recherche.best_params_, round(recherche.best_score_, 3))",
      test: "from sklearn.model_selection import GridSearchCV as _G\nassert isinstance(recherche, _G), \"recherche doit être un GridSearchCV\"\nassert hasattr(recherche, \"best_params_\"), \"pensez à appeler fit sur les données d'entraînement\"\nassert sorted(recherche.param_grid[\"max_depth\"]) == [1, 2, 3, 4, 5, 6], \"la grille doit porter sur max_depth, de 1 à 6\"\nassert recherche.cv == 5, \"utilisez cv=5\"\nassert len(recherche.cv_results_[\"mean_test_score\"]) == 6, \"six profondeurs doivent avoir été évaluées\"",
      hint: "GridSearchCV(DecisionTreeClassifier(random_state=0), {\"max_depth\": [1, 2, 3, 4, 5, 6]}, cv=5), puis fit sur X_train, y_train.",
    },
    {
      kind: "text",
      md: `### Régler un pipeline

Quand le modèle est un pipeline, on désigne un hyperparamètre par le **nom de l'étape**, deux tirets bas, puis le nom du paramètre. Avec \`make_pipeline\`, les étapes portent le nom de leur classe en minuscules : \`svc__C\` pour le C du SVM, \`kneighborsclassifier__n_neighbors\` pour le nombre de voisins.

Avantage : la mise à l'échelle est refaite dans chaque pli de la validation croisée, sans fuite de données.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur le jeu **wine** (déjà partagé), réglez un pipeline (mise à l'échelle puis `SVC()`) en cherchant `C` parmi `[0.1, 1, 10, 100]`, en validation croisée à 5 plis. Rangez l'objet entraîné dans `recherche`, puis son exactitude sur le jeu de test dans `score_final`.",
      setup: "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_wine(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
      starter: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.svm import SVC\n\nrecherche = GridSearchCV(make_pipeline(StandardScaler(), SVC()), {\"C\": [0.1, 1, 10, 100]}, cv=5)\nscore_final = None",
      solution: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.svm import SVC\n\nrecherche = GridSearchCV(make_pipeline(StandardScaler(), SVC()), {\"svc__C\": [0.1, 1, 10, 100]}, cv=5)\nrecherche.fit(X_train, y_train)\nscore_final = recherche.score(X_test, y_test)\nprint(recherche.best_params_, round(score_final, 3))",
      test: "assert \"svc__C\" in recherche.param_grid, \"dans un pipeline, le paramètre s'écrit svc__C (nom de l'étape, deux tirets bas, nom du paramètre)\"\nassert hasattr(recherche, \"best_params_\"), \"pensez à appeler fit\"\nassert score_final is not None and score_final > 0.95, \"le score final sur le test devrait dépasser 0,95\"",
      hint: "La clé de la grille doit être \"svc__C\" et non \"C\". Avec la clé \"C\", scikit-learn signale un paramètre invalide.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : le cours « Modèles de machine learning » compare les familles de modèles vues ici, et la page Projets propose des sujets pour s'exercer sur un problème complet.",
    },
  ],
  quiz: [
    {
      question: "Lequel est un hyperparamètre ?",
      options: ["Les coefficients d'une régression linéaire", "La profondeur maximale d'un arbre", "Les seuils appris par un arbre", "Les vecteurs de support d'un SVM"],
      correct: 1,
      explanation: "La profondeur maximale est choisie avant l'entraînement. Les coefficients, les seuils et les vecteurs de support sont appris par fit.",
    },
    {
      question: "Pourquoi ne pas choisir les hyperparamètres d'après le score sur le jeu de test ?",
      options: [
        "Parce que c'est trop lent",
        "Parce qu'on finit par s'adapter au test, dont le score n'est plus une mesure honnête",
        "Parce que le jeu de test est trop petit pour calculer un score",
        "Il n'y a aucun problème à le faire",
      ],
      correct: 1,
      explanation: "Le test doit simuler des données jamais vues. Si l'on choisit d'après lui, il devient une donnée d'entraînement déguisée. On règle en validation croisée et on garde le test pour la fin.",
    },
    {
      question: "Dans un pipeline créé par make_pipeline(StandardScaler(), SVC()), comment désigner le paramètre C du SVM ?",
      options: ["C", "SVC.C", "svc__C", "pipeline_C"],
      correct: 2,
      explanation: "Nom de l'étape (svc, en minuscules avec make_pipeline), deux tirets bas, nom du paramètre.",
    },
    {
      question: "Quand préférer RandomizedSearchCV à GridSearchCV ?",
      options: [
        "Quand la grille est petite",
        "Quand la grille de combinaisons est trop grande pour tout essayer",
        "Quand on n'a pas de jeu de test",
        "Jamais",
      ],
      correct: 1,
      explanation: "La recherche aléatoire essaie un nombre fixé de combinaisons tirées au hasard : beaucoup moins de calculs, souvent un résultat proche du meilleur.",
    },
  ],
};
