import type { LessonModule } from "@/lib/lessons/types";

const CANCER_SPLIT =
  "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)";

export const moduleLogisticRegression: LessonModule = {
  id: "logistic-regression",
  title: "Régression logistique",
  duration: "2 h 30",
  summary: "Malgré son nom, un modèle de classification : il prédit une probabilité, puis tranche avec un seuil.",
  objectives: [
    "Expliquer comment la fonction sigmoïde transforme un score en probabilité",
    "Obtenir des probabilités avec predict_proba et choisir un seuil de décision",
    "Mettre les variables à l'échelle dans un pipeline, et dire pourquoi",
    "Lire les erreurs d'un classifieur selon leur gravité",
  ],
  sections: [
    {
      kind: "text",
      md: `### D'un score à une probabilité

La régression logistique calcule d'abord, comme la régression linéaire, un score \`z = a1 × x1 + a2 × x2 + ... + b\`. Ce score peut valoir n'importe quoi, de moins l'infini à plus l'infini. La **fonction sigmoïde** \`1 / (1 + e^(-z))\` le ramène entre 0 et 1 : c'est la probabilité estimée d'appartenir à la classe 1.

Pour décider, on compare cette probabilité à un **seuil**, 0,5 par défaut : au-dessus, classe 1 ; en dessous, classe 0. Le nom « régression » vient de l'histoire des statistiques : en pratique, c'est l'un des classifieurs les plus utilisés, simple, rapide et facile à interpréter.`,
    },
    {
      kind: "code",
      language: "python",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\n\nz = np.linspace(-8, 8, 200)\nplt.plot(z, 1 / (1 + np.exp(-z)))\nplt.axhline(0.5, color=\"gray\", linestyle=\"--\")\nplt.xlabel(\"score z\")\nplt.ylabel(\"probabilité de la classe 1\")\nplt.title(\"La fonction sigmoïde\")\nplt.show()",
      caption: "Un score nul donne une probabilité de 0,5 ; plus le score est grand, plus la probabilité approche 1.",
    },
    {
      kind: "text",
      md: `### Le jeu de données : tumeurs bénignes ou malignes

Le jeu **breast cancer** décrit 569 tumeurs du sein par 30 mesures prises sur des images de cellules. Attention à un piège d'étiquetage : dans ce jeu, la classe **1 signifie « bénigne »** et la classe 0 « maligne ». Toujours vérifier \`target_names\` avant d'interpréter un résultat.

Les mesures ont des échelles très différentes (des surfaces de plusieurs centaines, des rapports inférieurs à 1). L'algorithme d'optimisation de la régression logistique converge mal dans ce cas : scikit-learn affiche alors un avertissement \`ConvergenceWarning\`. La solution est de **standardiser** les variables (moyenne 0, écart-type 1) avec \`StandardScaler\`, dans un **pipeline** qui enchaîne les étapes.`,
    },
    {
      kind: "code",
      language: "python",
      code: `${CANCER_SPLIT}\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nmodele = make_pipeline(StandardScaler(), LogisticRegression())\nmodele.fit(X_train, y_train)\nprint("Exactitude :", round(modele.score(X_test, y_test), 3))\nprint("Probabilités des 5 premières tumeurs (maligne, bénigne) :")\nprint(modele.predict_proba(X_test[:5]).round(3))`,
      caption: "Le pipeline apprend la mise à l'échelle sur l'entraînement seulement, puis l'applique au test : aucune information du test ne fuit dans l'entraînement.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez un pipeline `modele` qui **standardise** les variables puis applique une **régression logistique**, entraînez-le, et rangez son exactitude sur le jeu de test dans `exactitude`.",
      setup: CANCER_SPLIT,
      starter: "from sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nmodele = None\nexactitude = None",
      solution: "from sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nmodele = make_pipeline(StandardScaler(), LogisticRegression())\nmodele.fit(X_train, y_train)\nexactitude = modele.score(X_test, y_test)\nprint(round(exactitude, 3))",
      test: "from sklearn.pipeline import Pipeline as _P\nassert isinstance(modele, _P), \"modele doit être un pipeline (make_pipeline)\"\nnoms = [type(etape).__name__ for _, etape in modele.steps]\nassert noms == [\"StandardScaler\", \"LogisticRegression\"], f\"étapes attendues : StandardScaler puis LogisticRegression (vous avez {noms})\"\nassert exactitude is not None and exactitude > 0.95, \"l'exactitude sur le test devrait dépasser 0,95\"",
      hint: "make_pipeline(StandardScaler(), LogisticRegression()), puis fit sur l'entraînement et score sur le test.",
    },
    {
      kind: "text",
      md: `### Choisir le seuil selon le coût des erreurs

Un classifieur fait deux sortes d'erreurs, qui n'ont pas la même gravité. Ici, déclarer « bénigne » une tumeur maligne (un **faux négatif** du point de vue du dépistage) est bien plus grave que l'inverse, qui entraîne un examen de plus.

Le seuil de 0,5 n'a rien d'obligatoire. Si l'on ne déclare « bénigne » qu'une tumeur dont la probabilité dépasse 0,9, on rate moins de tumeurs malignes, au prix de plus de fausses alertes. Sur notre jeu de test, cela fait passer de 3 à 1 le nombre de tumeurs malignes classées bénignes, tandis que l'exactitude globale baisse un peu : la « meilleure » exactitude n'est pas toujours le bon objectif.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Ces exemples servent à apprendre la classification. Ils ne constituent ni un outil médical ni un avis médical.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec le pipeline entraîné, calculez la probabilité d'être **bénigne** (colonne 1 de `predict_proba`) pour chaque tumeur du test, puis prédisez « bénigne » seulement quand cette probabilité est **au moins 0,9**. Rangez les prédictions (des 0 et des 1) dans `pred_prudent`, et le nombre de tumeurs **malignes** classées bénignes dans `malignes_ratees`.",
      setup: `${CANCER_SPLIT}\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nmodele = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)`,
      starter: "proba_benigne = modele.predict_proba(X_test)[:, 1]\n\npred_prudent = modele.predict(X_test)  # seuil de 0,5 : à remplacer\nmalignes_ratees = None",
      solution: "proba_benigne = modele.predict_proba(X_test)[:, 1]\n\npred_prudent = (proba_benigne >= 0.9).astype(int)\nmalignes_ratees = int(((pred_prudent == 1) & (y_test == 0)).sum())\nprint(malignes_ratees)",
      test: "import numpy as _np\nassert _np.array_equal(pred_prudent, (modele.predict_proba(X_test)[:, 1] >= 0.9).astype(int)), \"pred_prudent doit valoir 1 quand la probabilité d'être bénigne est au moins 0,9, et 0 sinon\"\nassert malignes_ratees == 1, f\"avec ce seuil, une seule tumeur maligne est classée bénigne (vous trouvez {malignes_ratees})\"",
      hint: "(proba_benigne >= 0.9).astype(int) donne les prédictions ; une tumeur maligne ratée a pred_prudent == 1 et y_test == 0.",
    },
  ],
  quiz: [
    {
      question: "Que renvoie la fonction sigmoïde ?",
      options: ["Une catégorie", "Un nombre entre 0 et 1, lu comme une probabilité", "Un score sans limite", "La pente du modèle"],
      correct: 1,
      explanation: "La sigmoïde ramène n'importe quel score entre 0 et 1. On l'interprète comme la probabilité estimée de la classe 1.",
    },
    {
      question: "Pourquoi standardiser les variables avant une régression logistique ?",
      options: [
        "Pour supprimer les valeurs manquantes",
        "Parce que des échelles très différentes gênent l'optimisation, qui converge mal",
        "Pour transformer la régression en classification",
        "Ce n'est jamais utile",
      ],
      correct: 1,
      explanation: "Sans mise à l'échelle, l'algorithme d'optimisation peut ne pas converger (ConvergenceWarning) et donner un modèle moins bon. StandardScaler règle le problème.",
    },
    {
      question: "Dans le jeu breast cancer de scikit-learn, que signifie la classe 1 ?",
      options: ["Tumeur maligne", "Tumeur bénigne", "Donnée manquante", "Ça dépend du modèle"],
      correct: 1,
      explanation: "La classe 1 est « benign ». Ce genre de détail inverse complètement la lecture des erreurs : on vérifie toujours target_names.",
    },
    {
      question: "Relever le seuil au-dessus duquel une tumeur est déclarée bénigne a pour effet :",
      options: [
        "De rater moins de tumeurs malignes, au prix de plus de fausses alertes",
        "D'améliorer toutes les mesures à la fois",
        "De changer les coefficients du modèle",
        "De ne rien changer",
      ],
      correct: 0,
      explanation: "Le modèle ne change pas, seule la décision change : on exige plus de certitude pour dire « bénigne », donc on rate moins de cas graves, et on envoie plus de cas bénins en examen complémentaire.",
    },
  ],
};
