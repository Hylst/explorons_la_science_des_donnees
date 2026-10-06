import type { LessonModule } from "@/lib/lessons/types";

const WINE_SPLIT =
  "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\n\ndonnees = load_wine()\nX_train, X_test, y_train, y_test = train_test_split(donnees.data, donnees.target, test_size=0.25, random_state=0, stratify=donnees.target)";

export const moduleRandomForests: LessonModule = {
  id: "random-forests",
  title: "Forêts aléatoires",
  duration: "2 h",
  summary: "Beaucoup d'arbres un peu différents, qui votent : plus stable et plus précis qu'un arbre seul.",
  objectives: [
    "Expliquer le bagging et le tirage aléatoire des variables",
    "Comparer un arbre seul et une forêt sur les mêmes données",
    "Utiliser le score hors du sac (OOB) comme estimation gratuite",
    "Lire l'importance des variables d'une forêt",
  ],
  sections: [
    {
      kind: "text",
      md: `### La sagesse des foules, appliquée aux arbres

Un arbre de décision est instable : changer quelques exemples d'entraînement peut changer toute sa structure. L'idée de la **forêt aléatoire** (Breiman, 2001) est d'en entraîner beaucoup, chacun un peu différent, puis de les faire **voter** (ou de moyenner leurs prédictions en régression). Les erreurs individuelles se compensent en partie.

Deux sources de diversité :

- le **bagging** (*bootstrap aggregating*) : chaque arbre est entraîné sur un échantillon tiré **avec remise** dans les données d'entraînement ; certains exemples y figurent plusieurs fois, d'autres pas du tout ;
- le **tirage des variables** : à chaque question, l'arbre ne choisit que parmi un sous-ensemble de variables tiré au hasard, ce qui empêche tous les arbres de se ressembler.`,
    },
    {
      kind: "code",
      language: "python",
      code: [
        WINE_SPLIT,
        "from sklearn.tree import DecisionTreeClassifier",
        "from sklearn.ensemble import RandomForestClassifier",
        "",
        "arbre = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)",
        "print(\"Un arbre seul :\", round(arbre.score(X_test, y_test), 3))",
        "for n in [1, 10, 100]:",
        "    foret = RandomForestClassifier(n_estimators=n, random_state=0).fit(X_train, y_train)",
        "    print(f\"Forêt de {n} arbre(s) :\", round(foret.score(X_test, y_test), 3))",
      ].join("\n"),
      caption: "Le jeu de test ne compte que 45 vins : un score de 1,0 signifie zéro erreur sur ces 45 vins, pas un modèle infaillible.",
    },
    {
      kind: "text",
      md: `### Le score hors du sac, une validation gratuite

Comme chaque arbre n'a vu qu'environ deux tiers des exemples (tirage avec remise), on peut évaluer chaque exemple avec les arbres qui ne l'ont **pas** vu. C'est le **score OOB** (*out of bag*) : une estimation des performances sur des données non vues, sans sacrifier de données pour la validation. On l'obtient avec \`oob_score=True\`.

Réglages principaux : \`n_estimators\` (le nombre d'arbres : plus il y en a, plus c'est stable, mais plus c'est lent), \`max_features\` (combien de variables tirer à chaque question), et les mêmes limites que pour un arbre (\`max_depth\`, \`min_samples_leaf\`). Bonne nouvelle : une forêt fonctionne souvent correctement avec les réglages par défaut.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez une forêt `foret` de **200 arbres** avec `random_state=0` et le **score hors du sac** activé, puis rangez ce score OOB dans `score_oob`.",
      setup: WINE_SPLIT,
      starter: "from sklearn.ensemble import RandomForestClassifier\n\nforet = RandomForestClassifier(random_state=0)\nforet.fit(X_train, y_train)\nscore_oob = None",
      solution: "from sklearn.ensemble import RandomForestClassifier\n\nforet = RandomForestClassifier(n_estimators=200, random_state=0, oob_score=True)\nforet.fit(X_train, y_train)\nscore_oob = foret.oob_score_\nprint(round(score_oob, 3))",
      test: "assert foret.n_estimators == 200, f\"la forêt doit compter 200 arbres (elle en a {foret.n_estimators})\"\nassert getattr(foret, \"oob_score\", False), \"activez le score hors du sac avec oob_score=True\"\nassert score_oob is not None and abs(score_oob - foret.oob_score_) < 1e-9, \"score_oob doit valoir foret.oob_score_\"",
      hint: "RandomForestClassifier(n_estimators=200, random_state=0, oob_score=True), puis foret.oob_score_ après fit.",
    },
    {
      kind: "text",
      md: `### Importance des variables dans une forêt

Une forêt moyenne les importances de ses arbres : le résultat est plus stable que pour un arbre seul. Sur les vins, la teneur en proline, les flavonoïdes et l'intensité de la couleur arrivent en tête. Les limites vues au module 4 restent valables : c'est une description du modèle, pas une relation de cause, et l'importance par permutation sur le test est souvent plus fiable.

Le prix à payer pour la précision d'une forêt : on perd la lisibilité d'un arbre unique. On ne peut plus « lire » une décision en quelques questions.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec une forêt de 200 arbres (`random_state=0`), rangez dans `top3` la **liste des noms des trois variables les plus importantes**, de la plus importante à la moins importante.",
      setup: WINE_SPLIT,
      starter: "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\nforet = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_train, y_train)\ntop3 = list(donnees.feature_names[:3])",
      solution: "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\nforet = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_train, y_train)\nordre = np.argsort(foret.feature_importances_)[::-1]\ntop3 = [donnees.feature_names[i] for i in ordre[:3]]\nprint(top3)",
      test: "assert [str(n) for n in top3] == [\"proline\", \"flavanoids\", \"color_intensity\"], f\"les trois premières variables attendues sont proline, flavanoids et color_intensity (vous avez {top3})\"",
      hint: "np.argsort trie par ordre croissant : [::-1] inverse l'ordre, puis on garde les trois premiers indices.",
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce que le bagging ?",
      options: [
        "Entraîner chaque arbre sur un échantillon tiré avec remise dans les données",
        "Supprimer les variables inutiles",
        "Ranger les arbres par ordre de qualité",
        "Entraîner un seul arbre très profond",
      ],
      correct: 0,
      explanation: "Bootstrap aggregating : chaque arbre voit un échantillon différent, tiré avec remise, puis les arbres votent. Les erreurs individuelles se compensent en partie.",
    },
    {
      question: "Pourquoi tirer au hasard un sous-ensemble de variables à chaque question ?",
      options: [
        "Pour aller plus vite uniquement",
        "Pour que les arbres ne se ressemblent pas tous : un vote entre arbres identiques n'apporte rien",
        "Pour réduire le nombre de classes",
        "Parce que les arbres ne savent pas gérer beaucoup de variables",
      ],
      correct: 1,
      explanation: "Sans ce tirage, les arbres choisiraient tous les mêmes variables fortes et feraient les mêmes erreurs. La diversité rend le vote utile.",
    },
    {
      question: "Que mesure le score OOB ?",
      options: [
        "La vitesse de la forêt",
        "Le score sur l'entraînement",
        "Une estimation des performances sur des données non vues, à partir des exemples que chaque arbre n'a pas vus",
        "Le nombre d'arbres inutiles",
      ],
      correct: 2,
      explanation: "Chaque exemple est évalué par les arbres qui ne l'ont pas tiré : on obtient une validation sans réserver de données supplémentaires.",
    },
    {
      question: "Que perd-on en passant d'un arbre à une forêt ?",
      options: ["La précision", "La lisibilité d'une décision en quelques questions", "La possibilité de faire de la régression", "La possibilité de prédire"],
      correct: 1,
      explanation: "Une forêt est généralement plus précise et plus stable, mais une décision issue du vote de centaines d'arbres ne se lit plus d'un coup d'œil.",
    },
  ],
};
