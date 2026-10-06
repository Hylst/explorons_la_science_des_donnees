import type { LessonModule } from "@/lib/lessons/types";

export const moduleIntroduction: LessonModule = {
  id: "ml-intro",
  title: "Introduction au ML supervisé",
  duration: "1 h 30",
  summary: "Apprendre à partir d'exemples étiquetés : vocabulaire, découpage entraînement / test, et un premier modèle avec scikit-learn.",
  objectives: [
    "Distinguer apprentissage supervisé et non supervisé, classification et régression",
    "Nommer variables explicatives (X) et variable cible (y)",
    "Séparer les données en jeu d'entraînement et jeu de test, et dire pourquoi",
    "Entraîner un premier modèle avec l'API fit / predict / score de scikit-learn",
  ],
  sections: [
    {
      kind: "text",
      md: `### Apprendre à partir d'exemples

En **apprentissage supervisé**, on montre à un algorithme des exemples dont on connaît déjà la réponse : des fleurs mesurées dont on connaît l'espèce, des patients dont on connaît l'évolution. Il en tire une règle qui lui permet de répondre pour de nouveaux exemples.

- Les **variables explicatives** (ou *features*), notées \`X\` : ce que l'on mesure (longueur des pétales, âge, IMC...).
- La **variable cible**, notée \`y\` : ce que l'on veut prédire.

Deux grandes familles de problèmes :

- **classification** : la cible est une catégorie (espèce de fleur, tumeur bénigne ou maligne) ;
- **régression** : la cible est un nombre (prix, température, progression d'une maladie).

En **non supervisé**, il n'y a pas de cible : on cherche des structures (des groupes, par exemple). C'est le sujet d'une autre page du site.`,
    },
    {
      kind: "text",
      md: `### Les données du cours

Le cours utilise des jeux de données classiques fournis avec scikit-learn (rien à télécharger) :

- **iris** : 150 fleurs, 4 mesures, 3 espèces (classification) ;
- **wine** : 178 vins, 13 mesures chimiques, 3 cépages (classification) ;
- **breast cancer** : 569 tumeurs, 30 mesures, bénigne ou maligne (classification) ;
- **diabetes** : 442 patients, 10 variables, et une mesure de la progression de la maladie un an plus tard (régression).

Ce sont des jeux d'apprentissage, petits et propres. Les vraies données sont rarement aussi sages : la page Préparation des données du site en parle.`,
    },
    {
      kind: "code",
      language: "python",
      code: "import pandas as pd  # as_frame=True renvoie des tableaux pandas\nfrom sklearn.datasets import load_iris\n\niris = load_iris(as_frame=True)\nX = iris.data\ny = iris.target\nprint(X.shape)\nprint(X.head())\nprint(y.value_counts())\nprint(list(iris.target_names))",
      caption: "Le premier lancement charge Python dans votre navigateur : comptez quelques secondes. Ensuite, c'est rapide.",
    },
    {
      kind: "text",
      md: `### Pourquoi garder des données de côté

Un modèle peut apprendre ses exemples par cœur. Il aura alors tout juste sur les données qu'il a vues, et se trompera sur les nouvelles : c'est le **surapprentissage**. Pour mesurer honnêtement ce qu'il a appris, on garde une partie des données qu'il ne verra jamais pendant l'entraînement : le **jeu de test**.

\`train_test_split\` fait ce partage au hasard. Deux réglages reviennent tout le temps :

- \`test_size=0.25\` : un quart des données pour le test ;
- \`random_state=0\` : fixe le tirage, pour retrouver exactement le même partage à chaque exécution ;
- et, en classification, \`stratify=y\` garde les mêmes proportions de classes dans les deux parties.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Chargez le jeu **diabetes** (`load_diabetes(return_X_y=True)`) et partagez-le en `X_train`, `X_test`, `y_train`, `y_test`, avec **20 %** des données pour le test et `random_state=42`.",
      starter: "from sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_diabetes(return_X_y=True)\n# Partagez les données ici\nX_train = X_test = y_train = y_test = None",
      solution: "from sklearn.datasets import load_diabetes\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_diabetes(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)",
      test: "assert X_train is not None, \"X_train n'est pas encore défini\"\nassert X_test.shape == (89, 10), f\"X_test devrait avoir 89 lignes (20 % de 442), il a la forme {X_test.shape}\"\nassert X_train.shape == (353, 10), \"X_train devrait avoir 353 lignes\"\nassert len(y_train) == 353 and len(y_test) == 89, \"y_train et y_test doivent suivre le même partage\"",
      hint: "train_test_split(X, y, test_size=0.2, random_state=42) renvoie quatre éléments, dans l'ordre X_train, X_test, y_train, y_test.",
    },
    {
      kind: "text",
      md: `### fit, predict, score : l'API de scikit-learn

Tous les modèles de scikit-learn s'utilisent de la même façon :

1. on crée le modèle avec ses réglages : \`modele = KNeighborsClassifier(n_neighbors=5)\` ;
2. on l'entraîne sur les données d'entraînement : \`modele.fit(X_train, y_train)\` ;
3. on prédit sur de nouvelles données : \`modele.predict(X_test)\` ;
4. on mesure : \`modele.score(X_test, y_test)\` (la proportion de bonnes réponses en classification, le R² en régression).

Le modèle des **k plus proches voisins** (KNN) est le plus intuitif : pour classer une fleur, il regarde les k fleurs d'entraînement les plus proches et choisit l'espèce majoritaire parmi elles.`,
    },
    {
      kind: "code",
      language: "python",
      code: "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\n\nX, y = load_iris(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\nmodele = KNeighborsClassifier(n_neighbors=5)\nmodele.fit(X_train, y_train)\nprint(\"Prédictions :\", modele.predict(X_test[:5]))\nprint(\"Réponses     :\", y_test[:5])\nprint(\"Exactitude sur le test :\", modele.score(X_test, y_test))",
      caption: "Iris est un jeu facile : un score parfait sur 38 fleurs de test ne veut pas dire que le modèle ne se trompera jamais.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un `KNeighborsClassifier` avec **3 voisins** sur le jeu **wine** (déjà partagé), puis rangez dans `score` l'exactitude obtenue sur le jeu de test.",
      starter: "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\n\nX, y = load_wine(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\nmodele = None\nscore = None",
      solution: "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\n\nX, y = load_wine(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\nmodele = KNeighborsClassifier(n_neighbors=3)\nmodele.fit(X_train, y_train)\nscore = modele.score(X_test, y_test)\nprint(score)",
      test: "from sklearn.neighbors import KNeighborsClassifier as _K\nassert isinstance(modele, _K), \"modele doit être un KNeighborsClassifier\"\nassert modele.n_neighbors == 3, \"le modèle doit utiliser 3 voisins\"\nassert score is not None and 0 <= score <= 1, \"score doit contenir l'exactitude sur le test (entre 0 et 1)\"\nassert abs(score - _K(n_neighbors=3).fit(X_train, y_train).score(X_test, y_test)) < 1e-9, \"score doit être mesuré sur X_test et y_test\"",
      hint: "Créez le modèle, appelez fit sur X_train et y_train, puis score sur X_test et y_test.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le score obtenu sur wine est nettement moins bon que sur iris. Ce n'est pas une fatalité : les mesures de wine ont des échelles très différentes (la proline va de 278 à 1 680, les phénols non flavonoïdes de 0,13 à 0,66), et le KNN calcule des distances : la proline écrase tout le reste. Le module sur l'évaluation montre comment une simple mise à l'échelle change tout.",
    },
  ],
  quiz: [
    {
      question: "Prédire le prix d'un appartement à partir de sa surface et de son quartier, c'est :",
      options: ["Un problème de classification", "Un problème de régression", "De l'apprentissage non supervisé", "Un problème de tri"],
      correct: 1,
      explanation: "La cible (le prix) est un nombre : c'est une régression. Ce serait une classification si l'on prédisait une catégorie, par exemple « cher » ou « abordable ».",
    },
    {
      question: "Pourquoi évaluer un modèle sur un jeu de test qu'il n'a jamais vu ?",
      options: [
        "Pour qu'il s'entraîne plus vite",
        "Parce qu'un modèle peut apprendre ses exemples par cœur : seul un jeu inconnu mesure ce qu'il a vraiment appris",
        "Parce que scikit-learn l'exige",
        "Pour avoir plus de données d'entraînement",
      ],
      correct: 1,
      explanation: "Sur ses propres exemples, un modèle peut avoir tout juste sans rien avoir compris (surapprentissage). Le jeu de test simule de nouvelles données.",
    },
    {
      question: "À quoi sert random_state=0 dans train_test_split ?",
      options: [
        "À ne garder aucune donnée pour le test",
        "À obtenir le même partage aléatoire à chaque exécution",
        "À mélanger les colonnes",
        "À rendre le modèle plus précis",
      ],
      correct: 1,
      explanation: "Le partage reste aléatoire, mais le tirage est fixé : on retrouve les mêmes jeux d'entraînement et de test, ce qui rend les résultats reproductibles.",
    },
    {
      question: "Dans l'ordre, que fait-on avec un modèle scikit-learn ?",
      options: [
        "predict, puis fit, puis score",
        "score, puis fit",
        "Le créer avec ses réglages, fit sur l'entraînement, puis predict ou score sur le test",
        "fit sur le test, puis predict sur l'entraînement",
      ],
      correct: 2,
      explanation: "On crée le modèle, on l'entraîne avec fit sur les données d'entraînement, puis on prédit ou on mesure sur des données qu'il n'a pas vues.",
    },
  ],
};
