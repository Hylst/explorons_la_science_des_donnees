import type { LessonModule } from "@/lib/lessons/types";

export const moduleLinearRegression: LessonModule = {
  id: "linear-regression",
  title: "Régression linéaire",
  duration: "2 h 30",
  summary: "Tracer la droite (ou le plan) qui colle le mieux aux données, lire ses coefficients et mesurer ses erreurs.",
  objectives: [
    "Expliquer le principe des moindres carrés",
    "Lire les coefficients et l'ordonnée à l'origine d'un modèle linéaire",
    "Mesurer l'erreur d'une régression avec la RMSE et le R²",
    "Reconnaître les limites d'un modèle linéaire (relations courbes, valeurs extrêmes)",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une droite qui résume un nuage de points

La régression linéaire cherche la relation la plus simple possible entre une variable \`x\` et une cible \`y\` : une droite \`y = a × x + b\`. Avec plusieurs variables, c'est la même idée en plus de dimensions : \`y = a1 × x1 + a2 × x2 + ... + b\`.

Comment choisir la « meilleure » droite ? Pour chaque point, on regarde l'écart entre la valeur réelle et la valeur prédite (le **résidu**). La méthode des **moindres carrés** choisit les coefficients qui rendent la **somme des carrés** de ces écarts la plus petite possible. Le carré évite que les écarts positifs et négatifs se compensent, et pénalise davantage les grosses erreurs.`,
    },
    {
      kind: "code",
      language: "python",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LinearRegression\n\n# Données fabriquées : y = 3x + 2, plus un peu de bruit\nrng = np.random.default_rng(0)\nx = rng.uniform(0, 10, 50)\ny = 3 * x + 2 + rng.normal(0, 2, 50)\n\nmodele = LinearRegression()\nmodele.fit(x.reshape(-1, 1), y)\nprint(\"pente a =\", round(modele.coef_[0], 2), \" ordonnée b =\", round(modele.intercept_, 2))\n\nplt.scatter(x, y, s=15, label=\"données\")\nxs = np.linspace(0, 10, 2)\nplt.plot(xs, modele.predict(xs.reshape(-1, 1)), color=\"red\", label=\"droite des moindres carrés\")\nplt.legend()\nplt.show()",
      caption: "Les données sont fabriquées avec une pente de 3 et une ordonnée de 2 : le modèle les retrouve à peu près, malgré le bruit. scikit-learn attend un tableau à deux dimensions pour X, d'où reshape(-1, 1).",
    },
    {
      kind: "text",
      md: `### Lire les coefficients

\`modele.coef_\` contient une pente par variable, \`modele.intercept_\` l'ordonnée à l'origine. Une pente de 3 se lit : « quand x augmente de 1, la prédiction augmente de 3, toutes choses égales par ailleurs ».

Deux précautions :

- avec plusieurs variables d'échelles différentes, on ne peut pas comparer directement la taille des coefficients (une pente « par euro » et une pente « par année » ne se comparent pas) ;
- un coefficient décrit une **association** dans les données, pas une cause : la page Statistiques et l'article « Corrélation n'est pas causalité » du blog y reviennent.`,
    },
    {
      kind: "text",
      md: `### Mesurer l'erreur

- La **MSE** (*mean squared error*) est la moyenne des carrés des résidus ; sa racine, la **RMSE**, s'exprime dans l'unité de la cible : « en moyenne, on se trompe d'environ tant ».
- Le **R²** compare le modèle à une prédiction naïve qui donnerait toujours la moyenne : 1 est parfait, 0 ne fait pas mieux que la moyenne, et il peut même être négatif sur un jeu de test si le modèle fait pire.

On mesure toujours ces erreurs sur le **jeu de test**.`,
    },
    {
      kind: "code",
      language: "python",
      code: "from sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nX, y = load_diabetes(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmodele = LinearRegression().fit(X_train, y_train)\npred = modele.predict(X_test)\nprint(\"RMSE :\", round(mean_squared_error(y_test, pred) ** 0.5, 1))\nprint(\"R²   :\", round(r2_score(y_test, pred), 3))",
      caption: "Avec les dix variables, le R² sur le test est d'environ 0,45 : le modèle explique une partie de la progression de la maladie, loin de la totalité.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec le même partage, entraînez une régression linéaire qui n'utilise **que l'indice de masse corporelle** (la colonne `bmi`, d'indice 2), puis rangez son R² sur le jeu de test dans `r2_bmi`. Est-il meilleur ou moins bon que le modèle à dix variables ?",
      starter: "from sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score\n\nX, y = load_diabetes(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nr2_bmi = None",
      solution: "from sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score\n\nX, y = load_diabetes(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmodele = LinearRegression().fit(X_train[:, [2]], y_train)\nr2_bmi = r2_score(y_test, modele.predict(X_test[:, [2]]))\nprint(round(r2_bmi, 3))",
      test: "assert r2_bmi is not None, \"r2_bmi n'est pas encore calculé\"\nassert 0.2 < r2_bmi < 0.27, f\"on attend un R² d'environ 0,23 avec la seule colonne bmi, vous obtenez {r2_bmi:.3f}\"",
      hint: "X_train[:, [2]] garde la seule colonne d'indice 2, sous forme de tableau à deux dimensions comme scikit-learn l'attend.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez vous-même la **RMSE** à partir des valeurs réelles `y_reel` et des prédictions `y_pred`, sans utiliser scikit-learn, et rangez-la dans `rmse`.",
      starter: "import numpy as np\n\ny_reel = np.array([10.0, 12.0, 9.0, 15.0])\ny_pred = np.array([11.0, 12.0, 7.0, 14.0])\n\nrmse = None",
      solution: "import numpy as np\n\ny_reel = np.array([10.0, 12.0, 9.0, 15.0])\ny_pred = np.array([11.0, 12.0, 7.0, 14.0])\n\nrmse = np.sqrt(np.mean((y_reel - y_pred) ** 2))\nprint(rmse)",
      test: "assert rmse is not None, \"rmse n'est pas encore calculée\"\nassert abs(rmse - 1.224744871391589) < 1e-9, f\"les écarts valent -1, 0, 2 et 1 : la RMSE vaut la racine de 6/4, soit environ 1,22 (vous obtenez {rmse})\"",
      hint: "Écarts, puis carrés, puis moyenne, puis racine : np.sqrt(np.mean((y_reel - y_pred) ** 2)).",
    },
    {
      kind: "text",
      md: `### Les limites du modèle linéaire

- **Relations courbes** : si \`y\` dépend de \`x²\`, une droite passe à côté. On peut ajouter des variables transformées (\`PolynomialFeatures\`), ou choisir un autre modèle.
- **Valeurs extrêmes** : comme les erreurs sont mises au carré, quelques points très éloignés tirent la droite vers eux.
- **Extrapolation** : la droite continue indéfiniment ; prédire bien au-delà des données observées est risqué.
- **Variables très liées entre elles** : les coefficients deviennent instables (la prédiction reste correcte, mais leur lecture devient trompeuse). Les versions régularisées, **Ridge** et **Lasso**, limitent la taille des coefficients et aident dans ce cas.`,
    },
  ],
  quiz: [
    {
      question: "Que minimise la méthode des moindres carrés ?",
      options: [
        "Le nombre de points mal placés",
        "La somme des carrés des écarts entre valeurs réelles et prédites",
        "La pente de la droite",
        "La somme des écarts, sans les élever au carré",
      ],
      correct: 1,
      explanation: "On élève les résidus au carré pour que les écarts positifs et négatifs ne se compensent pas, puis on cherche les coefficients qui rendent leur somme minimale.",
    },
    {
      question: "Un R² de 0 sur le jeu de test signifie que :",
      options: [
        "Le modèle est parfait",
        "Le modèle ne fait pas mieux que de prédire toujours la moyenne",
        "Le modèle a planté",
        "La RMSE est nulle",
      ],
      correct: 1,
      explanation: "Le R² compare le modèle à la prédiction constante égale à la moyenne. 0 : pas mieux ; 1 : parfait ; négatif : pire que la moyenne.",
    },
    {
      question: "Dans quelle unité s'exprime la RMSE d'un modèle qui prédit des prix en euros ?",
      options: ["En euros au carré", "En pourcentage", "En euros", "Sans unité"],
      correct: 2,
      explanation: "La MSE est en euros au carré ; sa racine, la RMSE, revient dans l'unité de la cible, ce qui la rend plus facile à lire.",
    },
    {
      question: "Une régression donne un coefficient positif pour le nombre de glaces vendues dans un modèle qui prédit les coups de soleil. On peut en conclure que :",
      options: [
        "Les glaces provoquent des coups de soleil",
        "Les deux sont associés dans les données, sans que cela prouve une cause (le soleil explique sans doute les deux)",
        "Le modèle est faux",
        "Il faut retirer la variable",
      ],
      correct: 1,
      explanation: "Un coefficient décrit une association. Ici, une troisième variable (l'ensoleillement) agit sur les deux : c'est le piège classique de la corrélation prise pour une cause.",
    },
  ],
};
