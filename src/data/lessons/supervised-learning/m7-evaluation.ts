import type { LessonModule } from "@/lib/lessons/types";

const DESEQUILIBRE =
  "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\n\n# Données fabriquées : 95 % de cas négatifs, 5 % de cas positifs (par exemple des transactions frauduleuses)\nX, y = make_classification(n_samples=1000, n_features=10, weights=[0.95, 0.05], random_state=0)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)";

export const moduleEvaluation: LessonModule = {
  id: "evaluation",
  title: "Évaluation et validation",
  duration: "2 h 30",
  summary: "Choisir la bonne mesure, se méfier de l'exactitude sur des classes déséquilibrées, et valider sans se tromper soi-même.",
  objectives: [
    "Lire une matrice de confusion et en tirer précision, rappel et F1",
    "Expliquer pourquoi l'exactitude trompe quand les classes sont déséquilibrées",
    "Utiliser la validation croisée et lire la dispersion de ses scores",
    "Éviter les fuites de données (data leakage)",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le piège de l'exactitude

Imaginez 1 000 transactions dont 5 % sont frauduleuses. Un « modèle » qui répond toujours « pas de fraude » a raison 95 fois sur 100 : une exactitude de 0,95... et il ne détecte **aucune** fraude. L'exactitude seule ne suffit pas dès que les classes sont déséquilibrées, ce qui est le cas de la plupart des problèmes intéressants (fraude, maladie rare, panne).`,
    },
    {
      kind: "code",
      language: "python",
      code: `${DESEQUILIBRE}\n\nprint("Répartition des classes :", np.bincount(y))\ntoujours_zero = np.zeros_like(y_test)\nprint("Exactitude du modèle qui répond toujours 0 :", round((toujours_zero == y_test).mean(), 3))`,
      caption: "Un score de près de 95 % sans rien avoir appris.",
    },
    {
      kind: "text",
      md: `### La matrice de confusion

Pour un problème à deux classes, on range les prédictions dans un tableau à quatre cases :

- **vrais positifs (VP)** : fraudes détectées ;
- **faux positifs (FP)** : transactions honnêtes signalées à tort ;
- **faux négatifs (FN)** : fraudes manquées ;
- **vrais négatifs (VN)** : transactions honnêtes laissées passer.

Dans scikit-learn, \`confusion_matrix(y_vrai, y_pred)\` renvoie \`[[VN, FP], [FN, VP]]\` (les lignes sont les vraies classes, les colonnes les prédictions). On en tire :

- la **précision** \`VP / (VP + FP)\` : parmi les alertes, combien étaient justes ?
- le **rappel** \`VP / (VP + FN)\` : parmi les vraies fraudes, combien ont été trouvées ?
- le **F1**, moyenne harmonique des deux, utile pour résumer en un seul nombre.

Précision et rappel tirent en sens inverse : on choisit le compromis selon le coût de chaque erreur (comme le seuil du module 3).`,
    },
    {
      kind: "code",
      language: "python",
      code: `${DESEQUILIBRE}\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\nmodele = LogisticRegression().fit(X_train, y_train)\npred = modele.predict(X_test)\nprint(confusion_matrix(y_test, pred))\nprint("précision", round(precision_score(y_test, pred), 3), " rappel", round(recall_score(y_test, pred), 3), " F1", round(f1_score(y_test, pred), 3))\n\n# Donner plus de poids à la classe rare\nequilibre = LogisticRegression(class_weight="balanced").fit(X_train, y_train)\npred_eq = equilibre.predict(X_test)\nprint(confusion_matrix(y_test, pred_eq))\nprint("précision", round(precision_score(y_test, pred_eq), 3), " rappel", round(recall_score(y_test, pred_eq), 3))`,
      caption: "Avec class_weight=\"balanced\", le modèle trouve toutes les fraudes du test, mais plus d'une alerte sur trois est fausse : c'est un choix, pas une amélioration gratuite.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Une matrice de confusion vaut `[[284, 0], [3, 13]]` (au format de scikit-learn). Calculez **à la main** la précision et le rappel de la classe positive, et rangez-les dans `precision` et `rappel`.",
      starter: "vn, fp = 284, 0\nfn, vp = 3, 13\n\nprecision = None\nrappel = None",
      solution: "vn, fp = 284, 0\nfn, vp = 3, 13\n\nprecision = vp / (vp + fp)\nrappel = vp / (vp + fn)\nprint(precision, rappel)",
      test: "assert precision is not None and rappel is not None, \"calculez precision et rappel\"\nassert abs(precision - 1.0) < 1e-9, \"aucune fausse alerte : la précision vaut 13 / 13 = 1\"\nassert abs(rappel - 13 / 16) < 1e-9, f\"13 fraudes trouvées sur 16 : le rappel vaut 13/16, soit 0,8125 (vous avez {rappel})\"",
      hint: "Précision : VP / (VP + FP). Rappel : VP / (VP + FN).",
    },
    {
      kind: "text",
      md: `### La validation croisée

Un seul partage entraînement / test donne un score qui dépend du hasard du partage. La **validation croisée** à k plis découpe les données en k parts, entraîne k fois en gardant à chaque fois une part différente pour l'évaluation, et donne k scores. On regarde leur **moyenne**, mais aussi leur **dispersion** : des scores très variables signalent un modèle instable ou trop peu de données.

\`cross_val_score(modele, X, y, cv=5)\` fait tout cela en une ligne. Pour la classification, scikit-learn utilise des plis **stratifiés**, qui gardent la proportion de chaque classe.

Le jeu de test final reste à part : il ne sert qu'une fois, à la toute fin, pour annoncer le résultat.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur le jeu **breast cancer**, calculez les scores en validation croisée à **5 plis** d'un pipeline (mise à l'échelle puis régression logistique). Rangez la liste des scores dans `scores`, leur moyenne dans `moyenne` et leur écart-type dans `ecart`.",
      setup: "from sklearn.datasets import load_breast_cancer\nX, y = load_breast_cancer(return_X_y=True)",
      starter: "from sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import make_pipeline\n\nscores = None\nmoyenne = None\necart = None",
      solution: "from sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import make_pipeline\n\nmodele = make_pipeline(StandardScaler(), LogisticRegression())\nscores = cross_val_score(modele, X, y, cv=5)\nmoyenne = scores.mean()\necart = scores.std()\nprint(scores.round(3), round(moyenne, 3), round(ecart, 3))",
      test: "assert scores is not None and len(scores) == 5, \"il faut 5 scores (cv=5)\"\nassert abs(moyenne - scores.mean()) < 1e-9 and abs(ecart - scores.std()) < 1e-9, \"moyenne et ecart doivent être calculés à partir de scores\"\nassert moyenne > 0.97, f\"la moyenne devrait dépasser 0,97 (vous obtenez {moyenne:.3f})\"",
      hint: "cross_val_score(make_pipeline(StandardScaler(), LogisticRegression()), X, y, cv=5), puis .mean() et .std().",
    },
    {
      kind: "text",
      md: `### Les fuites de données

Une **fuite** (*data leakage*) se produit quand une information sur les données d'évaluation se glisse dans l'entraînement. Le score obtenu est alors trop optimiste, et la déception arrive en production. Les cas classiques :

- **prétraitement appris sur tout le jeu** : calculer la moyenne et l'écart-type pour la mise à l'échelle sur toutes les données, avant le partage. Le pipeline évite ce piège en apprenant la mise à l'échelle sur chaque pli d'entraînement seulement (sur le jeu wine, l'écart est faible ; il peut être important avec d'autres prétraitements, comme la sélection de variables) ;
- **variable qui contient la réponse** : un champ « date de clôture du dossier » pour prédire si un client va partir ;
- **doublons** entre entraînement et test, ou **données du futur** dans une prévision temporelle (pour les séries temporelles, on valide en respectant l'ordre du temps, avec \`TimeSeriesSplit\`).

Règle simple : tout ce qui est « appris » (moyennes, sélections, encodages) doit l'être dans le pipeline, à partir des seules données d'entraînement.`,
    },
  ],
  quiz: [
    {
      question: "Un modèle de détection de fraude a une exactitude de 0,95 sur des données où 5 % des cas sont des fraudes. Que peut-on en conclure ?",
      options: [
        "Qu'il est excellent",
        "Rien de solide : répondre toujours « pas de fraude » donne déjà 0,95",
        "Qu'il détecte 95 % des fraudes",
        "Qu'il a surappris",
      ],
      correct: 1,
      explanation: "Avec des classes déséquilibrées, l'exactitude est dominée par la classe majoritaire. Il faut regarder la matrice de confusion, le rappel et la précision.",
    },
    {
      question: "Le rappel mesure :",
      options: [
        "Parmi les alertes, la part de vraies fraudes",
        "Parmi les vraies fraudes, la part détectée",
        "La part de bonnes réponses sur l'ensemble",
        "La vitesse du modèle",
      ],
      correct: 1,
      explanation: "Rappel = VP / (VP + FN) : la part des cas positifs réels que le modèle retrouve. La précision, elle, porte sur les alertes émises.",
    },
    {
      question: "Pourquoi regarder l'écart-type des scores d'une validation croisée ?",
      options: [
        "Pour savoir si le résultat est stable d'un partage à l'autre",
        "Pour calculer la précision",
        "Il n'a aucune utilité",
        "Pour choisir le nombre de plis",
      ],
      correct: 0,
      explanation: "Une moyenne de 0,90 avec des plis entre 0,89 et 0,91 n'a pas le même sens qu'une moyenne de 0,90 avec des plis entre 0,75 et 1.",
    },
    {
      question: "Quelle pratique provoque une fuite de données ?",
      options: [
        "Mettre la mise à l'échelle dans un pipeline",
        "Calculer la mise à l'échelle sur toutes les données avant de les partager",
        "Fixer random_state",
        "Utiliser des plis stratifiés",
      ],
      correct: 1,
      explanation: "La moyenne et l'écart-type calculés sur tout le jeu contiennent une information sur le test. Dans un pipeline, ils sont appris sur l'entraînement seulement.",
    },
  ],
};
