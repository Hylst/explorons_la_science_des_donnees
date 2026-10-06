import type { LessonModule } from "@/lib/lessons/types";

const MOONS_SPLIT =
  "from sklearn.datasets import make_moons\nfrom sklearn.model_selection import train_test_split\n\n# Deux nuages de points en forme de croissants, avec du bruit (données fabriquées)\nX, y = make_moons(n_samples=300, noise=0.3, random_state=1)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)";

export const moduleDecisionTrees: LessonModule = {
  id: "decision-trees",
  title: "Arbres de décision",
  duration: "2 h 30",
  summary: "Une suite de questions simples, apprise à partir des données : lisible, puissant, et prompt à apprendre par cœur.",
  objectives: [
    "Expliquer comment un arbre choisit ses questions (impureté de Gini)",
    "Lire un petit arbre avec export_text",
    "Reconnaître le surapprentissage d'un arbre trop profond et le limiter",
    "Lire l'importance des variables, avec ses limites",
  ],
  sections: [
    {
      kind: "text",
      md: `### Vingt questions, version automatique

Un arbre de décision classe un exemple en posant une suite de questions du type « la largeur du pétale est-elle inférieure à 0,8 cm ? ». Chaque réponse mène à une nouvelle question, jusqu'à une **feuille** qui donne la prédiction.

Pour construire l'arbre, l'algorithme essaie, à chaque étape, toutes les questions possibles (chaque variable, chaque seuil) et garde celle qui sépare le mieux les classes. « Le mieux » se mesure par l'**impureté** des groupes obtenus : l'**indice de Gini** vaut 0 quand un groupe ne contient qu'une seule classe, et augmente quand les classes sont mélangées.

Avantages : aucune mise à l'échelle nécessaire, des décisions lisibles, des variables de types variés. Inconvénient majeur : laissé libre, l'arbre continue jusqu'à isoler chaque exemple.`,
    },
    {
      kind: "code",
      language: "python",
      code: "from sklearn.datasets import load_iris\nfrom sklearn.tree import DecisionTreeClassifier, export_text\n\niris = load_iris()\narbre = DecisionTreeClassifier(max_depth=2, random_state=0)\narbre.fit(iris.data, iris.target)\nprint(export_text(arbre, feature_names=list(iris.feature_names)))\nprint(\"Classes :\", list(iris.target_names))",
      caption: "Deux questions sur la largeur du pétale suffisent à séparer presque toutes les fleurs : classe 0 = setosa, 1 = versicolor, 2 = virginica.",
    },
    {
      kind: "text",
      md: `### Le surapprentissage, en direct

Un arbre sans limite de profondeur peut atteindre 100 % de bonnes réponses sur ses données d'entraînement : il a fini par créer une feuille pour presque chaque exemple, bruit compris. Sur de nouvelles données, il fait moins bien qu'un arbre plus modeste.

Les réglages qui limitent l'arbre : \`max_depth\` (profondeur maximale), \`min_samples_leaf\` (nombre minimal d'exemples par feuille), \`max_leaf_nodes\`. Le bon réglage se choisit en mesurant sur des données non vues (le module sur les hyperparamètres montre comment le faire proprement).`,
    },
    {
      kind: "code",
      language: "python",
      code: [
        MOONS_SPLIT,
        "from sklearn.tree import DecisionTreeClassifier",
        "",
        "for profondeur in [None, 3]:",
        "    arbre = DecisionTreeClassifier(max_depth=profondeur, random_state=0).fit(X_train, y_train)",
        "    print(f\"max_depth={profondeur} : profondeur réelle {arbre.get_depth()}, \"",
        "          f\"entraînement {arbre.score(X_train, y_train):.2f}, test {arbre.score(X_test, y_test):.2f}\")",
      ].join("\n"),
      caption: "L'arbre libre est parfait sur l'entraînement et moins bon sur le test : il a appris le bruit. L'arbre de profondeur 3 généralise mieux.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur les mêmes données, entraînez un arbre `arbre` de **profondeur maximale 4** (`random_state=0`), puis rangez son exactitude sur l'entraînement dans `score_train` et sur le test dans `score_test`.",
      setup: MOONS_SPLIT,
      starter: "from sklearn.tree import DecisionTreeClassifier\n\narbre = DecisionTreeClassifier(random_state=0)\narbre.fit(X_train, y_train)\nscore_train = arbre.score(X_train, y_train)\nscore_test = None",
      solution: "from sklearn.tree import DecisionTreeClassifier\n\narbre = DecisionTreeClassifier(max_depth=4, random_state=0)\narbre.fit(X_train, y_train)\nscore_train = arbre.score(X_train, y_train)\nscore_test = arbre.score(X_test, y_test)\nprint(round(score_train, 3), round(score_test, 3))",
      test: "assert arbre.get_depth() == 4, f\"l'arbre doit avoir une profondeur de 4 (il en a {arbre.get_depth()})\"\nassert score_test is not None, \"score_test n'est pas encore calculé\"\nassert abs(score_train - arbre.score(X_train, y_train)) < 1e-9 and abs(score_test - arbre.score(X_test, y_test)) < 1e-9, \"les deux scores doivent être mesurés sur l'entraînement puis sur le test\"\nassert score_train < 1, \"limité à 4 niveaux, l'arbre ne devrait plus être parfait sur l'entraînement\"",
      hint: "DecisionTreeClassifier(max_depth=4, random_state=0), puis score sur chacun des deux jeux.",
    },
    {
      kind: "text",
      md: `### L'importance des variables

\`arbre.feature_importances_\` indique, pour chaque variable, sa contribution totale à la baisse d'impureté dans l'arbre (la somme vaut 1). C'est une première indication utile, avec deux limites :

- elle décrit **ce modèle-là**, pas une vérité sur le monde ; un autre arbre, entraîné sur un autre échantillon, peut préférer une autre variable très liée à la première ;
- elle favorise les variables qui offrent beaucoup de seuils possibles (les variables continues, ou avec de nombreuses valeurs).

L'**importance par permutation** (\`sklearn.inspection.permutation_importance\`), mesurée sur le jeu de test, est souvent plus fiable.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un arbre sans limite (`random_state=0`) sur le jeu **breast cancer** (déjà partagé et chargé avec les noms de variables), puis rangez dans `plus_importante` le **nom** de la variable la plus importante pour cet arbre.",
      setup: "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\n\ndonnees = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(donnees.data, donnees.target, test_size=0.25, random_state=0, stratify=donnees.target)",
      starter: "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\n\narbre = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)\nplus_importante = None",
      solution: "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\n\narbre = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)\nplus_importante = donnees.feature_names[np.argmax(arbre.feature_importances_)]\nprint(plus_importante)",
      test: "assert plus_importante is not None, \"plus_importante n'est pas encore définie\"\nassert str(plus_importante) == \"worst perimeter\", f\"pour cet arbre, la variable la plus importante est « worst perimeter » (vous trouvez {plus_importante})\"",
      hint: "np.argmax(arbre.feature_importances_) donne l'indice de la plus grande importance ; donnees.feature_names donne le nom.",
    },
  ],
  quiz: [
    {
      question: "Que mesure l'indice de Gini dans un nœud de l'arbre ?",
      options: [
        "La profondeur du nœud",
        "Le mélange des classes : 0 quand le nœud ne contient qu'une seule classe",
        "Le nombre de variables utilisées",
        "La vitesse de l'arbre",
      ],
      correct: 1,
      explanation: "Gini mesure l'impureté : un nœud « pur » (une seule classe) vaut 0. L'arbre choisit la question qui réduit le plus cette impureté.",
    },
    {
      question: "Un arbre a 100 % de bonnes réponses sur l'entraînement et 80 % sur le test. Le plus probable :",
      options: [
        "L'arbre est excellent",
        "Le jeu de test est faux",
        "L'arbre a surappris : il a mémorisé le bruit de l'entraînement",
        "Il faut un arbre encore plus profond",
      ],
      correct: 2,
      explanation: "Un grand écart entre entraînement et test signale le surapprentissage. On limite l'arbre (max_depth, min_samples_leaf) et on mesure à nouveau.",
    },
    {
      question: "Faut-il standardiser les variables avant un arbre de décision ?",
      options: [
        "Oui, toujours",
        "Non : l'arbre compare chaque variable à des seuils, l'échelle ne change pas les découpages possibles",
        "Seulement pour la classification",
        "Seulement si l'arbre est profond",
      ],
      correct: 1,
      explanation: "Multiplier une variable par 1 000 déplace les seuils mais ne change pas l'ordre des valeurs : l'arbre trouve les mêmes séparations.",
    },
    {
      question: "Que faut-il retenir de feature_importances_ ?",
      options: [
        "Qu'elle prouve quelles variables causent la cible",
        "Qu'elle décrit ce modèle-là et favorise les variables à nombreux seuils",
        "Qu'elle est toujours identique d'un entraînement à l'autre",
        "Qu'elle ne fonctionne qu'en régression",
      ],
      correct: 1,
      explanation: "C'est une indication sur le fonctionnement de cet arbre, pas une relation de cause. L'importance par permutation sur le test est souvent plus fiable.",
    },
  ],
};
