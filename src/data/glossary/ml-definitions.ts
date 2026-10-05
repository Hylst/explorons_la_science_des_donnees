
import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

export const mlDefinitions: Record<string, GlossaryTermDefinition> = {
  "machine-learning": {
    term: "Machine Learning",
    shortDefinition: "Branche de l'IA permettant aux systèmes d'apprendre à partir de données sans être explicitement programmés.",
    longDefinition: "Le Machine Learning est un domaine de l'intelligence artificielle qui se concentre sur le développement d'algorithmes permettant aux ordinateurs d'apprendre à partir de données et d'améliorer leur performance au fil du temps sans être explicitement programmés pour effectuer des tâches spécifiques.",
    examples: [
      "Un système qui apprend à reconnaître des visages après avoir été entraîné sur des milliers d'images",
      "Un programme qui prédit les prix immobiliers en analysant les ventes historiques"
    ],
    relatedTerms: ["Intelligence Artificielle", "Deep Learning", "Apprentissage supervisé"],
    source: "Mitchell, Tom M. (1997). Machine Learning",
    sourceUrl: "https://www.cs.cmu.edu/~tom/mlbook.html",
    domain: "general",
    level: "beginner",
    synonyms: ["Apprentissage automatique", "Apprentissage machine"],
    englishTerm: "Machine Learning"
  },
  "apprentissage-supervise": {
    term: "Apprentissage supervisé",
    shortDefinition: "Approche où l'algorithme apprend à partir de données étiquetées pour prédire des valeurs sur de nouvelles données.",
    longDefinition: "L'apprentissage supervisé est une technique de machine learning où l'algorithme est entraîné sur un ensemble de données étiquetées, ce qui signifie que chaque exemple d'entraînement est associé à une étiquette ou une valeur cible. L'objectif est d'apprendre une fonction de mappage qui peut être utilisée pour prédire les valeurs des nouvelles entrées non vues.",
    examples: [
      "Classification d'emails comme spam ou non spam",
      "Prédiction de prix immobiliers basée sur les caractéristiques de la propriété"
    ],
    relatedTerms: ["Classification", "Régression", "Machine Learning", "Étiquetage de données"],
    source: "Hastie, T., Tibshirani, R., & Friedman, J. (2009). The Elements of Statistical Learning",
    domain: "machinelearning",
    level: "beginner",
    synonyms: ["Apprentissage dirigé"],
    englishTerm: "Supervised Learning"
  },
  "apprentissage-non-supervise": {
    term: "Apprentissage non supervisé",
    shortDefinition: "Technique qui traite des données non étiquetées pour découvrir des structures et patterns cachés.",
    longDefinition: "L'apprentissage non supervisé est une méthode de machine learning où l'algorithme est entraîné sur des données non étiquetées. L'objectif est de découvrir des structures intrinsèques, des patterns et des relations dans les données sans guidance externe ou connaissance préalable des résultats attendus.",
    examples: [
      "Segmentation de clients en groupes similaires",
      "Détection d'anomalies dans les transactions bancaires"
    ],
    relatedTerms: ["Clustering", "Réduction de dimensionnalité", "K-means", "DBSCAN"],
    source: "Ghahramani, Z. (2004). Unsupervised Learning",
    domain: "machinelearning",
    level: "intermediate",
    synonyms: ["Apprentissage sans supervision", "Apprentissage autonome"],
    englishTerm: "Unsupervised Learning"
  },
  "classification": {
    term: "Classification",
    shortDefinition: "Prédiction d'une catégorie ou classe pour une instance de données parmi un ensemble fini de possibilités.",
    longDefinition: "La classification est une forme d'apprentissage supervisé où l'algorithme apprend à attribuer une instance de données à une catégorie ou classe prédéfinie. Le modèle est entraîné sur des exemples étiquetés et apprend à généraliser pour classer correctement de nouvelles instances.",
    examples: [
      "Détection de fraude (frauduleux/légitime)",
      "Diagnostic médical (malade/sain)",
      "Reconnaissance d'objets dans des images"
    ],
    relatedTerms: ["Apprentissage supervisé", "Régression logistique", "Arbres de décision", "SVM"],
    source: "Bishop, C. M. (2006). Pattern Recognition and Machine Learning",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "Classification"
  },
  "regression": {
    term: "Régression",
    shortDefinition: "Prédiction d'une valeur numérique continue basée sur des variables d'entrée.",
    longDefinition: "La régression est une technique d'apprentissage supervisé visant à prédire une valeur numérique continue plutôt qu'une classe discrète. Elle modélise la relation entre une variable dépendante (cible) et une ou plusieurs variables indépendantes (prédicteurs).",
    examples: [
      "Prédiction des prix immobiliers",
      "Estimation de la consommation d'énergie",
      "Prévision des ventes"
    ],
    relatedTerms: ["Apprentissage supervisé", "Régression linéaire", "Régression polynomiale", "MSE"],
    source: "James, G., Witten, D., Hastie, T., & Tibshirani, R. (2013). An Introduction to Statistical Learning",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "Regression"
  },
  "clustering": {
    term: "Clustering",
    shortDefinition: "Regroupement d'instances similaires en groupes (clusters) sans étiquettes prédéfinies.",
    longDefinition: "Le clustering est une technique d'apprentissage non supervisé qui consiste à regrouper des données en sous-ensembles (clusters) de manière à ce que les objets au sein d'un même groupe soient plus similaires entre eux qu'avec ceux des autres groupes, selon certaines mesures de similarité.",
    examples: [
      "Segmentation client pour le marketing ciblé",
      "Regroupement d'articles de presse par thématique",
      "Identification de zones géographiques avec des caractéristiques similaires"
    ],
    relatedTerms: ["Apprentissage non supervisé", "K-means", "DBSCAN", "Clustering hiérarchique"],
    source: "Jain, A. K. (2010). Data clustering: 50 years beyond K-means",
    domain: "machinelearning",
    level: "intermediate",
    synonyms: ["Partitionnement de données", "Segmentation"],
    englishTerm: "Clustering"
  },
  "reduction-dimensionnalite": {
    term: "Réduction de dimensionnalité",
    shortDefinition: "Techniques réduisant le nombre de variables tout en préservant l'information essentielle.",
    longDefinition: "La réduction de dimensionnalité est un ensemble de techniques visant à réduire le nombre de variables aléatoires à considérer dans un jeu de données, tout en préservant au maximum l'information pertinente. Ces méthodes permettent de lutter contre le fléau de la dimensionnalité et facilitent la visualisation des données.",
    examples: [
      "Visualisation de données complexes en 2D ou 3D",
      "Compression d'images",
      "Prétraitement pour d'autres algorithmes de ML"
    ],
    relatedTerms: ["PCA", "t-SNE", "UMAP", "Apprentissage non supervisé"],
    source: "Van der Maaten, L., & Hinton, G. (2008). Visualizing data using t-SNE",
    domain: "machinelearning",
    level: "intermediate",
    synonyms: ["Projection de données", "Compression de caractéristiques"],
    englishTerm: "Dimensionality Reduction"
  },
  "overfitting": {
    term: "Surapprentissage",
    shortDefinition: "Phénomène où un modèle apprend trop précisément les données d'entraînement au détriment de sa capacité à généraliser.",
    longDefinition: "Le surapprentissage (overfitting) se produit lorsqu'un modèle capture le bruit et les fluctuations aléatoires des données d'entraînement comme étant des caractéristiques significatives. Le modèle performe alors très bien sur les données d'entraînement mais échoue à généraliser correctement sur de nouvelles données.",
    examples: [
      "Un arbre de décision qui crée des branches jusqu'à classer parfaitement chaque exemple d'entraînement",
      "Un réseau de neurones qui continue à s'entraîner bien après que l'erreur de validation commence à augmenter"
    ],
    relatedTerms: ["Sous-apprentissage", "Régularisation", "Validation croisée", "Biais-variance"],
    source: "Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning",
    domain: "machinelearning",
    level: "intermediate",
    synonyms: ["Surajustement", "Hyperspécialisation"],
    englishTerm: "Overfitting"
  },
  "underfitting": {
    term: "Sous-apprentissage",
    shortDefinition: "Situation où un modèle est trop simple pour capturer la structure sous-jacente des données.",
    longDefinition: "Le sous-apprentissage (underfitting) se produit lorsqu'un modèle est trop simpliste pour saisir les relations importantes dans les données. Il performe mal à la fois sur les données d'entraînement et de test car il n'a pas suffisamment de capacité pour modéliser la complexité inhérente au problème.",
    examples: [
      "Utiliser une régression linéaire pour modéliser une relation hautement non linéaire",
      "Un réseau de neurones avec trop peu de couches pour un problème complexe"
    ],
    relatedTerms: ["Surapprentissage", "Complexité du modèle", "Biais élevé"],
    source: "Domingos, P. (2012). A few useful things to know about machine learning",
    domain: "machinelearning",
    level: "intermediate",
    synonyms: ["Sous-ajustement", "Sous-modélisation"],
    englishTerm: "Underfitting"
  },
  "deep-learning": {
    term: "Deep Learning",
    shortDefinition: "Sous-ensemble du ML utilisant des réseaux de neurones à multiples couches pour apprendre des représentations hiérarchiques.",
    longDefinition: "Le Deep Learning est une forme avancée de machine learning utilisant des réseaux de neurones artificiels à plusieurs couches (réseaux profonds) pour modéliser des abstractions de haut niveau dans les données. Cette approche permet au système d'apprendre des représentations hiérarchiques des données, chaque couche transformant sa représentation d'entrée en une représentation plus abstraite.",
    examples: [
      "Reconnaissance d'images avec des réseaux CNN",
      "Traduction automatique avec des transformers",
      "Génération d'images avec des GANs"
    ],
    relatedTerms: ["Réseaux de neurones", "CNN", "RNN", "Transformers", "Apprentissage par transfert"],
    source: "LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature",
    sourceUrl: "https://www.nature.com/articles/nature14539",
    domain: "machinelearning",
    level: "advanced",
    synonyms: ["Apprentissage profond", "Réseaux de neurones profonds"],
    englishTerm: "Deep Learning"
  },
  "cnn": {
    term: "Réseaux de neurones convolutifs",
    shortDefinition: "Architecture de deep learning optimisée pour traiter des données avec une topologie en grille, comme les images.",
    longDefinition: "Les réseaux de neurones convolutifs (CNN) sont une classe spécialisée de réseaux de neurones conçus pour traiter efficacement des données structurées en grille, comme les images. Ils utilisent l'opération de convolution pour extraire automatiquement des caractéristiques hiérarchiques à partir des données d'entrée, en apprenant des filtres qui détectent des motifs locaux.",
    examples: [
      "Classification d'images",
      "Détection d'objets",
      "Segmentation sémantique",
      "Reconnaissance faciale"
    ],
    relatedTerms: ["Deep Learning", "Convolution", "Pooling", "Feature maps"],
    source: "Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). ImageNet classification with deep convolutional neural networks",
    domain: "machinelearning",
    level: "advanced",
    synonyms: ["ConvNets", "Réseaux convolutifs"],
    englishTerm: "Convolutional Neural Networks (CNN)"
  },
  "rnn": {
    term: "Réseaux de neurones récurrents",
    shortDefinition: "Architecture de deep learning conçue pour traiter des données séquentielles en utilisant des connexions récurrentes.",
    longDefinition: "Les réseaux de neurones récurrents (RNN) sont spécialisés dans le traitement de données séquentielles comme le texte ou les séries temporelles. Contrairement aux réseaux feedforward, les RNN possèdent des connexions récurrentes qui leur permettent de maintenir un état interne (mémoire) et de traiter des séquences de longueur variable en partageant les paramètres à travers les étapes temporelles.",
    examples: [
      "Analyse de sentiment dans des textes",
      "Traduction automatique",
      "Prédiction de séries temporelles",
      "Génération de texte"
    ],
    relatedTerms: ["LSTM", "GRU", "Deep Learning", "Séquences", "Problème de gradient qui s'évanouit"],
    source: "Elman, J. L. (1990). Finding structure in time",
    domain: "machinelearning",
    level: "advanced",
    synonyms: ["Réseaux récurrents"],
    englishTerm: "Recurrent Neural Networks (RNN)"
  },
  "transformers": {
    term: "Transformers",
    shortDefinition: "Architecture de deep learning basée sur le mécanisme d'attention, qui excelle dans le traitement du langage naturel.",
    longDefinition: "Les Transformers sont une architecture de réseaux de neurones introduite en 2017 qui a révolutionné le traitement du langage naturel. Contrairement aux RNN, les Transformers traitent l'ensemble de la séquence simultanément grâce au mécanisme d'auto-attention, ce qui leur permet de modéliser les dépendances à longue distance plus efficacement et de se prêter à la parallélisation pendant l'entraînement.",
    examples: [
      "Modèles BERT pour la compréhension du langage",
      "GPT pour la génération de texte",
      "T5 pour diverses tâches de NLP",
      "ViT pour la vision par ordinateur"
    ],
    relatedTerms: ["Attention", "Auto-attention", "BERT", "GPT", "Encodeur-Décodeur"],
    source: "Vaswani, A., et al. (2017). Attention Is All You Need",
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    domain: "machinelearning",
    level: "advanced",
    englishTerm: "Transformers"
  },
  "evaluation-modele": {
    term: "Évaluation de modèle",
    shortDefinition: "Processus de mesure des performances d'un modèle de machine learning pour estimer sa qualité et son utilité.",
    longDefinition: "L'évaluation de modèle est le processus systématique d'estimation de la qualité et de l'utilité d'un modèle de machine learning. Elle implique de mesurer diverses métriques de performance sur des données non vues pendant l'entraînement, afin d'évaluer la capacité du modèle à généraliser et à faire des prédictions précises dans des contextes réels.",
    examples: [
      "Utilisation de métriques comme la précision, le rappel et le F1-score pour les modèles de classification",
      "Calcul de l'erreur quadratique moyenne (MSE) pour les modèles de régression",
      "Analyse des courbes ROC et de l'aire sous la courbe (AUC)"
    ],
    relatedTerms: ["Validation croisée", "Train-test split", "Métriques de performance", "Matrice de confusion"],
    source: "Japkowicz, N., & Shah, M. (2011). Evaluating Learning Algorithms: A Classification Perspective",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "Model Evaluation"
  },
  "matrice-confusion": {
    term: "Matrice de confusion",
    shortDefinition: "Tableau qui présente les prédictions correctes et incorrectes d'un modèle de classification par classe.",
    longDefinition: "Une matrice de confusion est un outil d'évaluation pour les problèmes de classification qui montre le nombre de prédictions correctes et incorrectes pour chaque classe. Elle permet de calculer diverses métriques de performance comme la précision, le rappel, le F1-score et d'analyser les types d'erreurs commises par le modèle.",
    examples: [
      "Dans un problème de classification binaire, la matrice contient les vrais positifs (TP), faux positifs (FP), vrais négatifs (TN) et faux négatifs (FN)",
      "Pour la détection de fraude, on peut voir combien de transactions frauduleuses ont été correctement identifiées vs. manquées"
    ],
    relatedTerms: ["Précision", "Rappel", "F1-score", "Classification"],
    source: "Fawcett, T. (2006). An introduction to ROC analysis",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "Confusion Matrix"
  },
  "precision": {
    term: "Précision",
    shortDefinition: "Proportion des positifs identifiés qui sont réellement positifs.",
    longDefinition: "La précision est une métrique de performance pour les modèles de classification, qui mesure la proportion des cas identifiés comme positifs qui sont effectivement des positifs réels. Elle quantifie la capacité du modèle à éviter les faux positifs, c'est-à-dire à ne pas étiqueter comme positifs des cas qui sont en réalité négatifs.",
    examples: [
      "Dans un système de détection de spam, la précision mesure combien d'emails identifiés comme spam sont réellement des spams",
      "Formule: Précision = VP / (VP + FP), où VP = vrais positifs et FP = faux positifs"
    ],
    relatedTerms: ["Rappel", "F1-score", "Matrice de confusion", "Spécificité"],
    source: "Powers, D. M. W. (2011). Evaluation: From Precision, Recall and F-Measure to ROC, Informedness, Markedness & Correlation",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "Precision"
  },
  "rappel": {
    term: "Rappel",
    shortDefinition: "Proportion des positifs réels qui ont été correctement identifiés.",
    longDefinition: "Le rappel (ou sensibilité) est une métrique de performance pour les modèles de classification, qui mesure la proportion des cas positifs réels qui ont été correctement identifiés comme tels par le modèle. Il quantifie la capacité du modèle à trouver tous les cas positifs, en évitant les faux négatifs.",
    examples: [
      "Dans un test médical, le rappel mesure la capacité à identifier correctement tous les patients malades",
      "Formule: Rappel = VP / (VP + FN), où VP = vrais positifs et FN = faux négatifs"
    ],
    relatedTerms: ["Précision", "F1-score", "Matrice de confusion", "Sensibilité"],
    source: "Powers, D. M. W. (2011). Evaluation: From Precision, Recall and F-Measure to ROC, Informedness, Markedness & Correlation",
    domain: "machinelearning",
    level: "beginner",
    synonyms: ["Sensibilité", "Taux de vrais positifs"],
    englishTerm: "Recall"
  },
  "f1-score": {
    term: "F1-Score",
    shortDefinition: "Moyenne harmonique de la précision et du rappel, combinant ces deux métriques en une seule valeur.",
    longDefinition: "Le F1-Score est une métrique de performance pour les modèles de classification qui combine la précision et le rappel en une seule valeur. Il représente la moyenne harmonique de ces deux métriques, donnant un équilibre entre la capacité du modèle à être précis (minimiser les faux positifs) et complet (minimiser les faux négatifs).",
    examples: [
      "Utile dans les cas où un équilibre entre précision et rappel est nécessaire",
      "Formule: F1 = 2 * (Précision * Rappel) / (Précision + Rappel)"
    ],
    relatedTerms: ["Précision", "Rappel", "Matrice de confusion", "Mesure-F"],
    source: "Van Rijsbergen, C. J. (1979). Information Retrieval",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "F1-Score"
  },
  "auc-roc": {
    term: "AUC-ROC",
    shortDefinition: "Aire sous la courbe ROC, mesurant la capacité d'un modèle à distinguer entre les classes.",
    longDefinition: "L'AUC-ROC (Area Under the Receiver Operating Characteristic Curve) est une métrique de performance pour les modèles de classification, représentant la probabilité qu'un exemple positif aléatoire soit classé avec un score plus élevé qu'un exemple négatif aléatoire. Une valeur de 1 représente un classifieur parfait, tandis que 0.5 équivaut à un classement aléatoire.",
    examples: [
      "Utilisé pour évaluer les modèles produisant des scores de probabilité plutôt que des classifications binaires directes",
      "Permet de comparer différents modèles indépendamment du seuil de classification"
    ],
    relatedTerms: ["Courbe ROC", "Sensibilité", "Spécificité", "Seuil de classification"],
    source: "Fawcett, T. (2006). An introduction to ROC analysis",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "AUC-ROC (Area Under the ROC Curve)"
  },
  "mse": {
    term: "MSE (Erreur quadratique moyenne)",
    shortDefinition: "Moyenne des carrés des erreurs entre les valeurs prédites et réelles.",
    longDefinition: "L'erreur quadratique moyenne (Mean Squared Error) est une métrique d'évaluation pour les problèmes de régression, calculée comme la moyenne des carrés des différences entre les valeurs prédites et les valeurs réelles. Elle donne plus de poids aux grandes erreurs en raison de l'élévation au carré, ce qui la rend particulièrement sensible aux valeurs aberrantes.",
    examples: [
      "Utilisée pour évaluer des modèles de prédiction de prix immobiliers ou de consommation d'énergie",
      "Formule: MSE = (1/n) * Σ(y_i - ŷ_i)²"
    ],
    relatedTerms: ["RMSE", "MAE", "Régression", "Fonction de perte"],
    source: "Chai, T., & Draxler, R. R. (2014). Root mean square error (RMSE) or mean absolute error (MAE)?",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "MSE (Mean Squared Error)"
  },
  "rmse": {
    term: "RMSE (Racine de l'erreur quadratique moyenne)",
    shortDefinition: "Racine carrée de la MSE, exprimant l'erreur dans la même unité que la variable cible.",
    longDefinition: "La racine de l'erreur quadratique moyenne (Root Mean Squared Error) est l'une des métriques les plus couramment utilisées pour évaluer les modèles de régression. Elle est calculée comme la racine carrée de la MSE, ce qui permet d'exprimer l'erreur dans la même unité que la variable cible, facilitant l'interprétation.",
    examples: [
      "Un RMSE de 5000€ dans un modèle de prédiction immobilière signifie que l'erreur moyenne est d'environ 5000€",
      "Formule: RMSE = √((1/n) * Σ(y_i - ŷ_i)²)"
    ],
    relatedTerms: ["MSE", "MAE", "Régression", "Fonction de perte"],
    source: "Chai, T., & Draxler, R. R. (2014). Root mean square error (RMSE) or mean absolute error (MAE)?",
    domain: "machinelearning",
    level: "beginner",
    englishTerm: "RMSE (Root Mean Squared Error)"
  },
  "r-carre": {
    term: "R² (Coefficient de détermination)",
    shortDefinition: "Proportion de la variance de la variable dépendante qui est prédictible à partir des variables indépendantes.",
    longDefinition: "Le coefficient de détermination (R²) est une mesure statistique qui représente la proportion de la variance dans la variable dépendante qui est prédictible à partir des variables indépendantes. Il varie entre 0 et 1, où 1 indique que le modèle explique parfaitement toute la variabilité des données, et 0 indique que le modèle n'explique aucune variabilité.",
    examples: [
      "Un R² de 0.75 signifie que 75% de la variance de la variable cible est expliquée par le modèle",
      "Formule: R² = 1 - (Σ(y_i - ŷ_i)² / Σ(y_i - ȳ)²)"
    ],
    relatedTerms: ["MSE", "Régression", "Variance expliquée", "R² ajusté"],
    source: "Draper, N. R., & Smith, H. (1998). Applied Regression Analysis",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "R² (Coefficient of Determination)"
  },
  "k-means": {
    term: "K-means",
    shortDefinition: "Algorithme de clustering qui partitionne les données en K groupes en minimisant la variance intra-cluster.",
    longDefinition: "K-means est l'un des algorithmes de clustering les plus populaires et simples. Il vise à partitionner n observations en k clusters, où chaque observation appartient au cluster avec la moyenne la plus proche. L'algorithme procède par itérations, en alternant entre l'affectation des points aux centroïdes les plus proches et la mise à jour des centroïdes.",
    examples: [
      "Segmentation de clients pour des campagnes marketing ciblées",
      "Compression d'images en réduisant le nombre de couleurs",
      "Regroupement de documents par thème"
    ],
    relatedTerms: ["Clustering", "Centroïde", "Méthode du coude", "Distance euclidienne"],
    source: "MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "K-means"
  },
  "dbscan": {
    term: "DBSCAN",
    shortDefinition: "Algorithme de clustering basé sur la densité, capable de découvrir des clusters de forme arbitraire.",
    longDefinition: "DBSCAN (Density-Based Spatial Clustering of Applications with Noise) est un algorithme de clustering basé sur la densité qui groupe les points densément regroupés et marque comme outliers les points dans des régions à faible densité. Contrairement à K-means, DBSCAN ne nécessite pas de spécifier à l'avance le nombre de clusters et peut découvrir des clusters de forme arbitraire.",
    examples: [
      "Détection d'anomalies dans les données de transaction",
      "Identification de zones urbaines à partir de données géospatiales",
      "Segmentation d'images basée sur la densité des pixels"
    ],
    relatedTerms: ["Clustering", "Densité", "Epsilon-voisinage", "Points de bruit"],
    source: "Ester, M., Kriegel, H. P., Sander, J., & Xu, X. (1996). A density-based algorithm for discovering clusters in large spatial databases with noise",
    domain: "machinelearning",
    level: "advanced",
    englishTerm: "DBSCAN"
  },
  "pca": {
    term: "PCA (Analyse en Composantes Principales)",
    shortDefinition: "Technique de réduction de dimensionnalité qui transforme les données en un nouvel ensemble de variables décorrélées.",
    longDefinition: "L'Analyse en Composantes Principales (PCA) est une technique statistique qui transforme un ensemble de variables possiblement corrélées en un ensemble de variables linéairement décorrélées appelées composantes principales. La transformation est définie de telle sorte que la première composante principale capture la plus grande variance possible, et chaque composante suivante capture la variance maximale sous contrainte d'être orthogonale aux composantes précédentes.",
    examples: [
      "Réduction de la dimensionnalité d'un dataset pour la visualisation",
      "Prétraitement des données avant l'application d'autres algorithmes de ML",
      "Compression d'images en préservant les caractéristiques principales"
    ],
    relatedTerms: ["Réduction de dimensionnalité", "Valeurs propres", "Vecteurs propres", "Variance expliquée"],
    source: "Pearson, K. (1901). On lines and planes of closest fit to systems of points in space",
    domain: "machinelearning",
    level: "intermediate",
    englishTerm: "PCA (Principal Component Analysis)"
  },
  "t-sne": {
    term: "t-SNE",
    shortDefinition: "Algorithme de réduction de dimensionnalité non linéaire adapté à la visualisation de données de haute dimension.",
    longDefinition: "t-SNE (t-distributed Stochastic Neighbor Embedding) est une technique de réduction de dimensionnalité non linéaire particulièrement adaptée à la visualisation de données de haute dimension. Elle modélise chaque objet de haute dimension par un point dans un espace de faible dimension, de manière à ce que les objets similaires soient modélisés par des points proches et les objets dissimilaires par des points éloignés.",
    examples: [
      "Visualisation de clusters dans des datasets complexes comme MNIST",
      "Exploration de données génomiques",
      "Analyse de données de séquençage d'ARN"
    ],
    relatedTerms: ["Réduction de dimensionnalité", "Embedding", "Perplexité", "Visualisation de données"],
    source: "Van der Maaten, L., & Hinton, G. (2008). Visualizing data using t-SNE",
    sourceUrl: "https://www.jmlr.org/papers/volume9/vandermaaten08a/vandermaaten08a.pdf",
    domain: "machinelearning",
    level: "advanced",
    englishTerm: "t-SNE (t-distributed Stochastic Neighbor Embedding)"
  },
  "lstm": {
    term: "LSTM (Long Short-Term Memory)",
    shortDefinition: "Type de réseau de neurones récurrent conçu pour apprendre les dépendances à long terme dans les données séquentielles.",
    longDefinition: "Les LSTM (Long Short-Term Memory) sont un type spécial de réseaux de neurones récurrents capables d'apprendre les dépendances à long terme dans les données séquentielles. Ils sont conçus pour éviter le problème du gradient qui s'évanouit présent dans les RNN classiques grâce à une architecture à base de cellules mémoire avec des portes d'entrée, de sortie et d'oubli qui contrôlent le flux d'information.",
    examples: [
      "Traduction automatique",
      "Reconnaissance vocale",
      "Génération de texte",
      "Prédiction de séries temporelles financières"
    ],
    relatedTerms: ["RNN", "GRU", "Deep Learning", "Problème du gradient qui s'évanouit"],
    source: "Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory",
    sourceUrl: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    domain: "machinelearning",
    level: "advanced",
    englishTerm: "LSTM (Long Short-Term Memory)"
  },
  "modèle": {
    term: "Modèle",
    shortDefinition: "Représentation mathématique d'un processus réel utilisée pour faire des prédictions ou des classifications.",
    longDefinition: "Un modèle de machine learning est une représentation mathématique qui capture les patterns et relations dans les données d'entraînement. Il s'agit d'un ensemble de règles, paramètres et algorithmes qui permettent de transformer des données d'entrée en prédictions ou classifications. Le modèle est créé pendant la phase d'entraînement et peut ensuite être utilisé pour faire des inférences sur de nouvelles données.",
    examples: [
      "Un modèle de régression linéaire pour prédire les prix immobiliers",
      "Un réseau de neurones pour la reconnaissance d'images",
      "Un arbre de décision pour la classification de clients"
    ],
    relatedTerms: ["Algorithme", "Entraînement", "Prédiction", "Paramètres"],
    source: "Fundamentals of Machine Learning",
    domain: "machinelearning",
    level: "beginner",
    synonyms: ["Modèle prédictif", "Modèle statistique"],
    englishTerm: "Model"
  }
};
