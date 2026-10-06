import type { LessonModule } from "@/lib/lessons/types";

const MOONS_SPLIT =
  "from sklearn.datasets import make_moons\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_moons(n_samples=300, noise=0.25, random_state=0)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)";

export const moduleSvm: LessonModule = {
  id: "svm",
  title: "SVM et méthodes à noyau",
  duration: "2 h 30",
  summary: "Séparer les classes avec la marge la plus large possible, et courber la frontière grâce aux noyaux.",
  objectives: [
    "Expliquer l'idée de marge et de vecteurs de support",
    "Régler le compromis entre marge et erreurs avec le paramètre C",
    "Utiliser un noyau (linéaire, RBF) pour une frontière courbe",
    "Toujours mettre les variables à l'échelle avant un SVM",
  ],
  sections: [
    {
      kind: "text",
      md: `### La frontière la plus large possible

Quand deux classes sont séparables par une droite, il existe une infinité de droites possibles. Le **SVM** (*support vector machine*, machine à vecteurs de support) choisit celle qui laisse la **marge** la plus large entre elle et les points les plus proches de chaque classe. Ces points, qui « tiennent » la frontière, sont les **vecteurs de support** : les autres pourraient bouger sans rien changer.

Dans la réalité, les classes se chevauchent. Le paramètre **C** règle le compromis :

- **C petit** : on accepte des erreurs pour garder une marge large (modèle simple, risque de sous-apprentissage) ;
- **C grand** : on veut classer correctement presque tous les points d'entraînement, quitte à rétrécir la marge (risque de surapprentissage).`,
    },
    {
      kind: "text",
      md: `### Les noyaux : courber la frontière

Une droite ne sépare pas deux croissants imbriqués. L'**astuce du noyau** permet au SVM de travailler comme si les données étaient projetées dans un espace où une séparation plate devient possible, sans jamais calculer cette projection explicitement.

- \`kernel="linear"\` : une frontière droite ;
- \`kernel="rbf"\` (le noyau gaussien, par défaut) : une frontière souple, réglée aussi par \`gamma\` (plus il est grand, plus la frontière épouse les points) ;
- \`kernel="poly"\` : des frontières polynomiales.`,
    },
    {
      kind: "code",
      language: "python",
      code: [
        MOONS_SPLIT,
        "from sklearn.svm import SVC",
        "",
        "for noyau in [\"linear\", \"rbf\"]:",
        "    modele = SVC(kernel=noyau).fit(X_train, y_train)",
        "    print(f\"noyau {noyau} : test {modele.score(X_test, y_test):.3f}, vecteurs de support {modele.n_support_.sum()}\")",
      ].join("\n"),
      caption: "Sur des données en croissants, le noyau RBF fait nettement mieux qu'une frontière droite.",
    },
    {
      kind: "code",
      language: "python",
      code: `${MOONS_SPLIT}\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.svm import SVC\n\nmodele = SVC(kernel="rbf").fit(X_train, y_train)\nxx, yy = np.meshgrid(np.linspace(-1.5, 2.5, 300), np.linspace(-1.2, 1.7, 300))\nzz = modele.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)\nplt.contourf(xx, yy, zz, alpha=0.25, cmap="coolwarm")\nplt.scatter(X_train[:, 0], X_train[:, 1], c=y_train, cmap="coolwarm", s=12, edgecolors="k", linewidths=0.3)\nplt.title("Frontière d'un SVM à noyau RBF")\nplt.show()`,
      caption: "On colorie chaque point du plan selon la classe prédite : la frontière courbe suit les deux croissants.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez trois SVM à noyau RBF avec `C` valant **0.01**, **1** et **100**, et rangez leurs exactitudes sur le jeu de test dans le dictionnaire `scores` (clés : les valeurs de C). Lequel sous-apprend ?",
      setup: MOONS_SPLIT,
      starter: "from sklearn.svm import SVC\n\nscores = {}\nfor C in [0.01, 1, 100]:\n    pass  # entraînez et mesurez ici",
      solution: "from sklearn.svm import SVC\n\nscores = {}\nfor C in [0.01, 1, 100]:\n    modele = SVC(kernel=\"rbf\", C=C).fit(X_train, y_train)\n    scores[C] = modele.score(X_test, y_test)\nprint(scores)",
      test: "assert set(scores) == {0.01, 1, 100}, f\"les clés de scores doivent être 0.01, 1 et 100 (vous avez {sorted(scores)})\"\nassert scores[0.01] < 0.6, \"avec C = 0,01, la marge est si large que le modèle sous-apprend : son score devrait être faible\"\nassert scores[1] > 0.9, \"avec C = 1, le score devrait dépasser 0,9\"",
      hint: "Dans la boucle : SVC(kernel=\"rbf\", C=C).fit(X_train, y_train), puis scores[C] = modele.score(X_test, y_test).",
    },
    {
      kind: "text",
      md: `### La mise à l'échelle, indispensable

Le SVM, comme le KNN, repose sur des distances : une variable mesurée en milliers écrase celles mesurées en dixièmes. Sur le jeu **wine**, un SVM sans mise à l'échelle obtient environ 66 % de bonnes réponses en validation croisée, et environ 98 % avec un \`StandardScaler\` placé dans un pipeline. Les arbres et les forêts, eux, n'en ont pas besoin.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur le jeu **wine**, construisez un pipeline `modele` (mise à l'échelle puis `SVC()`), et rangez dans `moyenne_cv` la **moyenne** de ses scores en validation croisée à 5 plis (`cross_val_score`, `cv=5`) sur `X` et `y`.",
      setup: "from sklearn.datasets import load_wine\nX, y = load_wine(return_X_y=True)",
      starter: "from sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.svm import SVC\n\nmodele = SVC()\nmoyenne_cv = cross_val_score(modele, X, y, cv=5).mean()",
      solution: "from sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.svm import SVC\n\nmodele = make_pipeline(StandardScaler(), SVC())\nmoyenne_cv = cross_val_score(modele, X, y, cv=5).mean()\nprint(round(moyenne_cv, 3))",
      test: "assert moyenne_cv > 0.95, f\"avec la mise à l'échelle, la moyenne devrait dépasser 0,95 (vous obtenez {moyenne_cv:.3f})\"",
      hint: "make_pipeline(StandardScaler(), SVC()) : la mise à l'échelle est apprise sur chaque pli d'entraînement.",
    },
  ],
  quiz: [
    {
      question: "Que sont les vecteurs de support ?",
      options: [
        "Toutes les données d'entraînement",
        "Les points les plus proches de la frontière, qui la déterminent",
        "Les variables les plus importantes",
        "Les erreurs du modèle",
      ],
      correct: 1,
      explanation: "Seuls les points au bord de la marge (ou du mauvais côté) déterminent la frontière. Les autres pourraient bouger sans rien changer.",
    },
    {
      question: "Avec un C très petit, un SVM tend à :",
      options: ["Surapprendre", "Sous-apprendre, avec une marge très large qui tolère beaucoup d'erreurs", "Ne plus rien prédire", "Devenir linéaire"],
      correct: 1,
      explanation: "Un C petit pénalise peu les erreurs : le modèle privilégie une marge large, au point de mal séparer les classes. Sur les croissants, C = 0,01 tombe sous 50 % sur le test.",
    },
    {
      question: "À quoi sert un noyau RBF ?",
      options: [
        "À accélérer l'entraînement",
        "À obtenir une frontière courbe, comme si les données étaient projetées dans un espace plus riche",
        "À supprimer les valeurs aberrantes",
        "À choisir C automatiquement",
      ],
      correct: 1,
      explanation: "L'astuce du noyau permet des frontières non linéaires sans calculer explicitement la projection. gamma règle la souplesse de la frontière.",
    },
    {
      question: "Quels modèles ont besoin de variables mises à l'échelle ?",
      options: [
        "Les arbres de décision",
        "Les forêts aléatoires",
        "Les SVM et les KNN, qui reposent sur des distances",
        "Aucun",
      ],
      correct: 2,
      explanation: "Les distances sont dominées par les variables de grande échelle. Les arbres, eux, ne comparent qu'à des seuils et ne sont pas concernés.",
    },
  ],
};
