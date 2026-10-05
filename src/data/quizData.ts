/**
 * Quiz data structure and sample questions for Data Science topics
 */
import { shuffle, shuffleOptions } from '../lib/quiz-shuffle';

/**
 * Interface for quiz questions
 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  topic: string;
  points: number;
}

/**
 * Interface for quiz categories
 */
export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedTime: number; // in minutes
  topics: string[];
  questions: QuizQuestion[];
}

/**
 * Programming Quiz Questions
 */
const programmingQuestions: QuizQuestion[] = [
  {
    id: 'prog_001',
    question: 'Quelle bibliothèque Python est principalement utilisée pour la manipulation de données tabulaires ?',
    options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
    correctAnswer: 1,
    explanation: 'Pandas est la bibliothèque de référence pour la manipulation et l\'analyse de données tabulaires en Python. Elle offre des structures de données comme DataFrame et Series.',
    difficulty: 'Débutant',
    topic: 'Pandas',
    points: 10
  },
  {
    id: 'prog_002',
    question: 'Comment créer un DataFrame vide avec des colonnes spécifiques en Pandas ?',
    options: [
      'pd.DataFrame(columns=["A", "B", "C"])',
      'pd.DataFrame({"A": [], "B": [], "C": []})',
      'pd.empty_dataframe(["A", "B", "C"])',
      'Les deux premières réponses sont correctes'
    ],
    correctAnswer: 3,
    explanation: 'Les deux premières méthodes permettent de créer un DataFrame vide avec des colonnes spécifiques. La troisième option n\'existe pas en Pandas.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_003',
    question: 'Quelle fonction NumPy permet de créer un tableau de zéros ?',
    options: ['np.empty()', 'np.zeros()', 'np.null()', 'np.void()'],
    correctAnswer: 1,
    explanation: 'np.zeros() crée un tableau rempli de zéros avec la forme spécifiée. np.empty() crée un tableau non initialisé.',
    difficulty: 'Débutant',
    topic: 'NumPy',
    points: 10
  },
  {
    id: 'prog_004',
    question: 'Comment filtrer un DataFrame Pandas pour obtenir les lignes où la colonne "age" est supérieure à 25 ?',
    options: [
      'df[df.age > 25]',
      'df.filter(age > 25)',
      'df.where(df["age"] > 25)',
      'df.loc[age > 25]'
    ],
    correctAnswer: 0,
    explanation: 'df[df.age > 25] est la syntaxe standard pour filtrer un DataFrame. df.query("age > 25") convient aussi, mais ne figure pas dans les choix ; df.loc[age > 25] échoue, car age n\'est pas une variable.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_005',
    question: 'Quelle méthode permet de gérer les valeurs manquantes en les supprimant ?',
    options: ['dropna()', 'fillna()', 'isna()', 'remove_na()'],
    correctAnswer: 0,
    explanation: 'dropna() supprime les lignes ou colonnes contenant des valeurs manquantes. fillna() les remplace par une valeur spécifiée.',
    difficulty: 'Débutant',
    topic: 'Nettoyage de données',
    points: 10
  },
  {
    id: 'prog_006',
    question: 'Quelle méthode permet de lire un fichier CSV avec Pandas ?',
    options: ['read_csv()', 'load_csv()', 'import_csv()', 'open_csv()'],
    correctAnswer: 0,
    explanation: 'La fonction read_csv() de Pandas est la méthode standard pour lire des fichiers CSV et les convertir en DataFrame.',
    difficulty: 'Débutant',
    topic: 'Pandas',
    points: 10
  },
  {
    id: 'prog_007',
    question: 'Comment créer un array NumPy de zéros de taille 3x4 ?',
    options: ['np.zeros((3,4))', 'np.empty(3,4)', 'np.zero_array(3,4)', 'np.create_zeros(3,4)'],
    correctAnswer: 0,
    explanation: 'np.zeros((3,4)) crée un array NumPy de forme 3x4 rempli de zéros. La forme est spécifiée comme un tuple.',
    difficulty: 'Débutant',
    topic: 'NumPy',
    points: 10
  },
  {
    id: 'prog_008',
    question: 'Quelle est la différence entre une liste Python et un array NumPy ?',
    options: [
      'Aucune différence',
      'Les arrays NumPy sont plus rapides et optimisés pour les calculs numériques',
      'Les listes sont plus rapides',
      'Les arrays ne peuvent contenir que des entiers'
    ],
    correctAnswer: 1,
    explanation: 'Les arrays NumPy sont optimisés en C, homogènes (un seul type de données), et offrent des opérations vectorisées beaucoup plus rapides que les listes Python.',
    difficulty: 'Intermédiaire',
    topic: 'NumPy',
    points: 15
  },
  {
    id: 'prog_009',
    question: 'Que renvoie df.isna().sum() sur un DataFrame Pandas ?',
    options: [
      'Le nombre de valeurs manquantes de chaque colonne',
      'La somme des valeurs numériques de chaque colonne',
      'Le nombre de lignes du DataFrame',
      'La liste des colonnes de type texte'
    ],
    correctAnswer: 0,
    explanation: 'df.isna() renvoie un DataFrame de booléens (True là où la valeur est manquante) ; sum() additionne les True colonne par colonne, ce qui donne le nombre de valeurs manquantes par colonne.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_010',
    question: 'Quelle fonction permet de combiner deux DataFrames verticalement ?',
    options: ['pd.concat()', 'pd.merge()', 'pd.join()', 'pd.append()'],
    correctAnswer: 0,
    explanation: 'pd.concat() est la méthode recommandée pour combiner des DataFrames. Avec axis=0 (par défaut), elle les empile verticalement. DataFrame.append() a été supprimée dans pandas 2.0.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_011',
    question: 'Comment obtenir les informations générales sur un DataFrame (types, valeurs non-nulles) ?',
    options: ['df.info()', 'df.describe()', 'df.summary()', 'df.details()'],
    correctAnswer: 0,
    explanation: 'df.info() fournit un résumé concis du DataFrame incluant les types de données, le nombre de valeurs non-nulles et l\'utilisation mémoire.',
    difficulty: 'Débutant',
    topic: 'Pandas',
    points: 10
  },
  {
    id: 'prog_012',
    question: 'Quelle méthode NumPy permet de remodeler un array ?',
    options: ['reshape()', 'resize()', 'reform()', 'remodel()'],
    correctAnswer: 0,
    explanation: 'reshape() change la forme d\'un array sans modifier ses données. Le nombre total d\'éléments doit rester le même.',
    difficulty: 'Débutant',
    topic: 'NumPy',
    points: 10
  },
  {
    id: 'prog_013',
    question: 'Comment grouper des données dans un DataFrame Pandas ?',
    options: ['df.groupby()', 'df.group()', 'df.aggregate()', 'df.cluster()'],
    correctAnswer: 0,
    explanation: 'df.groupby() permet de regrouper les données selon une ou plusieurs colonnes pour appliquer des fonctions d\'agrégation.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_014',
    question: 'Quelle est la différence entre loc et iloc dans Pandas ?',
    options: [
      'Aucune différence',
      'loc utilise les labels, iloc utilise les positions entières',
      'iloc utilise les labels, loc utilise les positions',
      'loc est plus rapide qu\'iloc'
    ],
    correctAnswer: 1,
    explanation: 'loc utilise les labels (noms des index/colonnes) pour l\'indexation, tandis qu\'iloc utilise les positions entières (0, 1, 2...).',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_015',
    question: 'Comment créer une séquence de nombres avec NumPy ?',
    options: ['np.arange()', 'np.sequence()', 'np.range()', 'np.series()'],
    correctAnswer: 0,
    explanation: 'np.arange() crée un array avec des valeurs espacées uniformément dans un intervalle donné, similaire à range() mais pour les arrays NumPy.',
    difficulty: 'Débutant',
    topic: 'NumPy',
    points: 10
  },
  {
    id: 'prog_016',
    question: 'Quelle méthode permet de pivoter un DataFrame ?',
    options: ['pivot()', 'rotate()', 'transpose()', 'flip()'],
    correctAnswer: 0,
    explanation: 'pivot() réorganise les données en utilisant des valeurs de colonnes comme nouveaux index et colonnes, créant une table pivot.',
    difficulty: 'Avancé',
    topic: 'Pandas',
    points: 20
  },
  {
    id: 'prog_017',
    question: 'Comment calculer la corrélation entre les colonnes d\'un DataFrame ?',
    options: ['df.corr()', 'df.correlation()', 'df.relate()', 'df.covariance()'],
    correctAnswer: 0,
    explanation: 'df.corr() calcule la matrice de corrélation de Pearson entre toutes les colonnes numériques du DataFrame.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_018',
    question: 'Quelle fonction NumPy calcule la moyenne arithmétique d\'un tableau, le long d\'un axe au choix ?',
    options: ['np.mean()', 'np.sum()', 'np.median()', 'np.var()'],
    correctAnswer: 0,
    explanation: 'np.mean() calcule la moyenne arithmétique le long de l\'axe spécifié (np.sum() additionne, np.median() donne la médiane, np.var() la variance). np.average() la calcule aussi (avec des poids optionnels), mais ne figure pas dans les choix.',
    difficulty: 'Débutant',
    topic: 'NumPy',
    points: 10
  },
  {
    id: 'prog_019',
    question: 'Comment sauvegarder un DataFrame au format Excel ?',
    options: ['df.to_excel()', 'df.save_excel()', 'df.export_excel()', 'df.write_excel()'],
    correctAnswer: 0,
    explanation: 'df.to_excel() sauvegarde le DataFrame dans un fichier Excel. Il faut installer openpyxl ou xlsxwriter pour cette fonctionnalité.',
    difficulty: 'Débutant',
    topic: 'Pandas',
    points: 10
  },
  {
    id: 'prog_020',
    question: 'Qu\'est-ce qu\'un Jupyter Notebook ?',
    options: [
      'Un éditeur de texte',
      'Un environnement interactif pour combiner code, texte et visualisations',
      'Une base de données',
      'Un serveur web'
    ],
    correctAnswer: 1,
    explanation: 'Jupyter Notebook est un environnement interactif qui permet de créer des documents combinant code exécutable, texte formaté, équations et visualisations.',
    difficulty: 'Débutant',
    topic: 'Jupyter',
    points: 10
  },
  {
    id: 'prog_021',
    question: 'Comment gérer les valeurs manquantes dans un DataFrame ?',
    options: ['dropna() et fillna()', 'remove_null() et replace_null()', 'delete_na() et insert_na()', 'clear_missing() et add_missing()'],
    correctAnswer: 0,
    explanation: 'dropna() supprime les lignes/colonnes avec des valeurs manquantes, tandis que fillna() les remplace par des valeurs spécifiées.',
    difficulty: 'Intermédiaire',
    topic: 'Pandas',
    points: 15
  },
  {
    id: 'prog_022',
    question: 'Quelle est la différence entre np.array() et np.asarray() ?',
    options: [
      'Aucune différence',
      'np.asarray() ne copie pas si l\'entrée est déjà un array',
      'np.array() est plus rapide',
      'np.asarray() ne fonctionne qu\'avec les listes'
    ],
    correctAnswer: 1,
    explanation: 'np.asarray() ne crée une copie que si nécessaire, tandis que np.array() crée toujours une nouvelle copie par défaut (sauf si copy=False).',
    difficulty: 'Avancé',
    topic: 'NumPy',
    points: 20
  },
  {
    id: 'prog_023',
    question: 'Comment appliquer une fonction à chaque élément d\'une Series Pandas ?',
    options: ['apply()', 'map()', 'transform()', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'apply(), map() et transform() peuvent tous appliquer une fonction à une Series, avec des nuances : map() pour les dictionnaires/Series, apply() plus général, transform() pour garder la même forme.',
    difficulty: 'Avancé',
    topic: 'Pandas',
    points: 20
  },
  {
    id: 'prog_024',
    question: 'Quelle méthode permet de trier un DataFrame par une colonne ?',
    options: ['sort_values()', 'sort()', 'order_by()', 'arrange()'],
    correctAnswer: 0,
    explanation: 'sort_values() trie un DataFrame selon les valeurs d\'une ou plusieurs colonnes. On peut spécifier ascending=False pour un tri décroissant.',
    difficulty: 'Débutant',
    topic: 'Pandas',
    points: 10
  },
  {
    id: 'prog_025',
    question: 'Comment créer un array NumPy avec des valeurs aléatoires ?',
    options: ['np.random.random()', 'np.random.rand()', 'np.random.randn()', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'Toutes ces fonctions créent des arrays aléatoires : random() et rand() tirent des valeurs uniformes sur [0, 1) (seule la façon de donner la forme diffère : un tuple pour random(), des dimensions séparées pour rand()), randn() suit une loi normale centrée réduite.',
    difficulty: 'Intermédiaire',
    topic: 'NumPy',
    points: 15
  }
];

/**
 * Mathematics & Statistics Quiz Questions
 */
const mathStatsQuestions: QuizQuestion[] = [
  {
    id: 'math_001',
    question: 'Quelle mesure de tendance centrale est la plus résistante aux valeurs aberrantes ?',
    options: ['Moyenne', 'Médiane', 'Mode', 'Étendue'],
    correctAnswer: 1,
    explanation: 'La médiane est la mesure de tendance centrale la plus résistante aux valeurs aberrantes car elle ne dépend que de la valeur centrale, pas de toutes les valeurs.',
    difficulty: 'Débutant',
    topic: 'Statistiques descriptives',
    points: 10
  },
  {
    id: 'math_002',
    question: 'Dans une distribution normale, quel pourcentage des données se trouve dans un écart-type de la moyenne ?',
    options: ['68%', '95%', '99.7%', '50%'],
    correctAnswer: 0,
    explanation: 'Dans une distribution normale, environ 68% des données se trouvent dans un écart-type de la moyenne (règle 68-95-99.7).',
    difficulty: 'Intermédiaire',
    topic: 'Distribution normale',
    points: 15
  },
  {
    id: 'math_003',
    question: 'Quelle est la différence entre corrélation et causalité ?',
    options: [
      'Il n\'y a pas de différence',
      'La corrélation implique toujours la causalité',
      'La corrélation mesure une relation, la causalité implique qu\'une variable cause l\'autre',
      'La causalité est plus faible que la corrélation'
    ],
    correctAnswer: 2,
    explanation: 'La corrélation mesure la force d\'une relation linéaire entre deux variables, mais n\'implique pas qu\'une variable cause l\'autre. La causalité nécessite des preuves supplémentaires.',
    difficulty: 'Intermédiaire',
    topic: 'Corrélation',
    points: 15
  },
  {
    id: 'math_004',
    question: 'Qu\'est-ce qu\'un test d\'hypothèse ?',
    options: [
      'Une méthode pour prouver qu\'une hypothèse est vraie',
      'Une procédure statistique pour évaluer des affirmations sur une population',
      'Un moyen de calculer la moyenne d\'un échantillon',
      'Une technique de visualisation de données'
    ],
    correctAnswer: 1,
    explanation: 'Un test d\'hypothèse est une procédure statistique qui utilise des données d\'échantillon pour évaluer des affirmations (hypothèses) sur une population.',
    difficulty: 'Avancé',
    topic: 'Tests d\'hypothèse',
    points: 20
  },
  {
    id: 'math_005',
    question: 'Quelle est la formule de la variance ?',
    options: [
      'Σ(x - μ) / n',
      'Σ(x - μ)² / n',
      '√[Σ(x - μ)² / n]',
      'Σx / n'
    ],
    correctAnswer: 1,
    explanation: 'La variance est calculée comme la moyenne des carrés des écarts à la moyenne : Σ(x - μ)² / n. L\'option « √[Σ(x - μ)² / n] » est l\'écart-type.',
    difficulty: 'Intermédiaire',
    topic: 'Variance',
    points: 15
  },
  {
    id: 'math_006',
    question: 'Qu\'est-ce que la loi normale ?',
    options: [
      'Une distribution symétrique en forme de cloche',
      'Une distribution uniforme',
      'Une distribution exponentielle',
      'Une distribution binomiale'
    ],
    correctAnswer: 0,
    explanation: 'La loi normale (ou gaussienne) est une distribution continue symétrique en forme de cloche, caractérisée par sa moyenne et son écart-type.',
    difficulty: 'Intermédiaire',
    topic: 'Distributions',
    points: 15
  },
  {
    id: 'math_007',
    question: 'Qu\'est-ce qu\'un test de Student (t-test) ?',
    options: [
      'Un test pour comparer des moyennes',
      'Un test pour mesurer la corrélation',
      'Un test pour la normalité',
      'Un test pour l\'indépendance'
    ],
    correctAnswer: 0,
    explanation: 'Le test de Student compare les moyennes de deux groupes pour déterminer si la différence observée est statistiquement significative.',
    difficulty: 'Avancé',
    topic: 'Tests statistiques',
    points: 20
  },
  {
    id: 'math_008',
    question: 'Que représente la p-value dans un test statistique ?',
    options: [
      'La probabilité que l\'hypothèse nulle soit vraie',
      'La probabilité d\'observer un résultat au moins aussi extrême que le nôtre, si l\'hypothèse nulle est vraie',
      'La probabilité d\'erreur',
      'La puissance du test'
    ],
    correctAnswer: 1,
    explanation: 'La p-value est la probabilité d\'observer des données au moins aussi extrêmes que celles observées, en supposant que l\'hypothèse nulle est vraie.',
    difficulty: 'Avancé',
    topic: 'Tests statistiques',
    points: 20
  },
  {
    id: 'math_009',
    question: 'Qu\'est-ce que l\'intervalle de confiance à 95% ?',
    options: [
      'Un intervalle qui contient 95% des données',
      'Un intervalle construit par une procédure qui contient le vrai paramètre dans 95% des échantillons',
      'Un intervalle de 95 unités',
      'Un intervalle calculé 95 fois'
    ],
    correctAnswer: 1,
    explanation: 'Un intervalle de confiance à 95% est un intervalle qui, si l\'expérience était répétée de nombreuses fois, contiendrait le vrai paramètre dans 95% des cas.',
    difficulty: 'Avancé',
    topic: 'Intervalles de confiance',
    points: 20
  },
  {
    id: 'math_010',
    question: 'Quelle est la différence entre l\'écart-type et la variance ?',
    options: [
      'Il n\'y a pas de différence',
      'L\'écart-type est la racine carrée de la variance',
      'La variance est la racine carrée de l\'écart-type',
      'L\'écart-type est toujours plus grand'
    ],
    correctAnswer: 1,
    explanation: 'L\'écart-type est la racine carrée de la variance. Il a l\'avantage d\'être dans la même unité que les données originales.',
    difficulty: 'Débutant',
    topic: 'Mesures de dispersion',
    points: 10
  },
  {
    id: 'math_011',
    question: 'Qu\'est-ce que le théorème central limite ?',
    options: [
      'La moyenne d\'un échantillon suit une loi normale',
      'La distribution des moyennes d\'échantillons tend vers une loi normale',
      'Toutes les distributions sont normales',
      'La limite d\'une fonction est toujours centrale'
    ],
    correctAnswer: 1,
    explanation: 'Le théorème central limite stipule que la distribution des moyennes d\'échantillons tend vers une loi normale quand la taille des échantillons augmente, quelle que soit la distribution de la population, pourvu que sa variance soit finie.',
    difficulty: 'Avancé',
    topic: 'Théorèmes',
    points: 20
  },
  {
    id: 'math_012',
    question: 'Quelle est la probabilité d\'obtenir pile avec une pièce équilibrée ?',
    options: ['0.25', '0.5', '0.75', '1'],
    correctAnswer: 1,
    explanation: 'Avec une pièce équilibrée, la probabilité d\'obtenir pile est de 0.5, tout comme celle d\'obtenir face.',
    difficulty: 'Débutant',
    topic: 'Probabilités',
    points: 10
  },
  {
    id: 'math_013',
    question: 'Qu\'est-ce qu\'une distribution binomiale ?',
    options: [
      'Une distribution avec deux paramètres',
      'Une distribution pour des expériences avec deux issues possibles',
      'Une distribution symétrique',
      'Une distribution continue'
    ],
    correctAnswer: 1,
    explanation: 'La distribution binomiale modélise le nombre de succès dans n essais indépendants, chacun ayant deux issues possibles (succès/échec).',
    difficulty: 'Intermédiaire',
    topic: 'Distributions',
    points: 15
  },
  {
    id: 'math_014',
    question: 'Qu\'est-ce que l\'erreur de type I dans un test statistique ?',
    options: [
      'Rejeter une hypothèse nulle vraie',
      'Accepter une hypothèse nulle fausse',
      'Une erreur de calcul',
      'Une erreur de mesure'
    ],
    correctAnswer: 0,
    explanation: 'L\'erreur de type I consiste à rejeter l\'hypothèse nulle alors qu\'elle est vraie. Sa probabilité est contrôlée par le seuil α (souvent 0.05).',
    difficulty: 'Avancé',
    topic: 'Tests statistiques',
    points: 20
  },
  {
    id: 'math_015',
    question: 'Quelle mesure de tendance centrale utiliser pour des données très asymétriques ?',
    options: ['Moyenne', 'Médiane', 'Mode', 'Étendue'],
    correctAnswer: 1,
    explanation: 'Pour des données très asymétriques, la médiane est préférable car elle n\'est pas influencée par les valeurs extrêmes, contrairement à la moyenne.',
    difficulty: 'Intermédiaire',
    topic: 'Statistiques descriptives',
    points: 15
  },
  {
    id: 'math_016',
    question: 'Qu\'est-ce que la loi de Poisson ?',
    options: [
      'Une distribution pour des événements rares',
      'Une distribution uniforme',
      'Une distribution normale',
      'Une distribution exponentielle'
    ],
    correctAnswer: 0,
    explanation: 'La loi de Poisson modélise le nombre d\'événements rares qui se produisent dans un intervalle de temps ou d\'espace fixe.',
    difficulty: 'Avancé',
    topic: 'Distributions',
    points: 20
  },
  {
    id: 'math_017',
    question: 'Comment interpréter un coefficient de corrélation de -0.8 ?',
    options: [
      'Corrélation positive forte',
      'Corrélation négative forte',
      'Pas de corrélation',
      'Corrélation faible'
    ],
    correctAnswer: 1,
    explanation: 'Un coefficient de -0.8 indique une corrélation négative forte : quand une variable augmente, l\'autre tend à diminuer de manière marquée.',
    difficulty: 'Intermédiaire',
    topic: 'Corrélation',
    points: 15
  },
  {
    id: 'math_018',
    question: 'Qu\'est-ce que l\'écart interquartile (IQR) ?',
    options: [
      'La différence entre le maximum et le minimum',
      'La différence entre Q3 et Q1',
      'La moitié de l\'écart-type',
      'La différence entre la moyenne et la médiane'
    ],
    correctAnswer: 1,
    explanation: 'L\'IQR est la différence entre le troisième quartile (Q3) et le premier quartile (Q1). Il mesure la dispersion des 50% centraux des données.',
    difficulty: 'Intermédiaire',
    topic: 'Mesures de dispersion',
    points: 15
  },
  {
    id: 'math_019',
    question: 'Qu\'est-ce qu\'un test du chi-carré ?',
    options: [
      'Un test de normalité',
      'Un test d\'indépendance ou d\'adéquation',
      'Un test de moyenne',
      'Un test de variance'
    ],
    correctAnswer: 1,
    explanation: 'Le test du chi-carré teste l\'indépendance entre variables catégorielles ou l\'adéquation d\'une distribution observée à une distribution théorique.',
    difficulty: 'Avancé',
    topic: 'Tests statistiques',
    points: 20
  },
  {
    id: 'math_020',
    question: 'Quelle est la propriété principale d\'une distribution uniforme ?',
    options: [
      'Toutes les valeurs ont la même probabilité',
      'Elle est asymétrique',
      'Elle a une forme de cloche',
      'Elle est toujours discrète'
    ],
    correctAnswer: 0,
    explanation: 'Dans une distribution uniforme, toutes les valeurs dans l\'intervalle défini ont la même probabilité d\'occurrence.',
    difficulty: 'Débutant',
    topic: 'Distributions',
    points: 10
  }
];

/**
 * Machine Learning Quiz Questions
 */
const machineLearningQuestions: QuizQuestion[] = [
  {
    id: 'ml_001',
    question: 'Quelle est la différence principale entre l\'apprentissage supervisé et non supervisé ?',
    options: [
      'L\'apprentissage supervisé utilise plus de données',
      'L\'apprentissage supervisé utilise des données étiquetées',
      'L\'apprentissage non supervisé est plus précis',
      'Il n\'y a pas de différence'
    ],
    correctAnswer: 1,
    explanation: 'L\'apprentissage supervisé utilise des données étiquetées (avec des réponses connues) pour entraîner le modèle, tandis que l\'apprentissage non supervisé trouve des patterns dans des données non étiquetées.',
    difficulty: 'Débutant',
    topic: 'Types d\'apprentissage',
    points: 10
  },
  {
    id: 'ml_002',
    question: 'Qu\'est-ce que le surapprentissage (overfitting) ?',
    options: [
      'Quand le modèle apprend trop lentement',
      'Quand le modèle mémorise les données d\'entraînement au lieu de généraliser',
      'Quand le modèle n\'a pas assez de données',
      'Quand le modèle est trop simple'
    ],
    correctAnswer: 1,
    explanation: 'Le surapprentissage se produit quand un modèle mémorise les données d\'entraînement au lieu d\'apprendre des patterns généralisables, ce qui réduit ses performances sur de nouvelles données.',
    difficulty: 'Intermédiaire',
    topic: 'Surapprentissage',
    points: 15
  },
  {
    id: 'ml_003',
    question: 'Quelle métrique est appropriée pour évaluer un modèle de classification binaire déséquilibré ?',
    options: ['Exactitude (accuracy)', 'F1-Score', 'Erreur quadratique moyenne', 'R²'],
    correctAnswer: 1,
    explanation: 'Le F1-Score est plus approprié pour les classes déséquilibrées car il combine précision et rappel. L\'accuracy peut être trompeuse avec des classes déséquilibrées.',
    difficulty: 'Avancé',
    topic: 'Métriques d\'évaluation',
    points: 20
  },
  {
    id: 'ml_004',
    question: 'Qu\'est-ce que la validation croisée ?',
    options: [
      'Une technique pour nettoyer les données',
      'Une méthode pour évaluer la performance d\'un modèle en divisant les données en plusieurs plis',
      'Un algorithme d\'apprentissage',
      'Une technique de visualisation'
    ],
    correctAnswer: 1,
    explanation: 'La validation croisée divise les données en plusieurs plis (folds) et utilise chaque pli tour à tour comme ensemble de test, permettant une évaluation plus robuste du modèle.',
    difficulty: 'Intermédiaire',
    topic: 'Validation',
    points: 15
  },
  {
    id: 'ml_005',
    question: 'Quel algorithme est le mieux adapté pour la classification de texte ?',
    options: ['K-means', 'Naive Bayes', 'Régression linéaire', 'DBSCAN'],
    correctAnswer: 1,
    explanation: 'Naive Bayes est particulièrement efficace pour la classification de texte car il gère bien les données de haute dimension et son hypothèse d\'indépendance conditionnelle des mots, fausse mais commode, donne de bons résultats sur du texte.',
    difficulty: 'Intermédiaire',
    topic: 'Algorithmes de classification',
    points: 15
  },
  {
    id: 'ml_006',
    question: 'Quelle est la différence entre bagging et boosting ?',
    options: [
      'Bagging combine des modèles en parallèle, boosting en séquence',
      'Boosting combine des modèles en parallèle, bagging en séquence',
      'Il n\'y a pas de différence',
      'Bagging est plus rapide que boosting'
    ],
    correctAnswer: 0,
    explanation: 'Le bagging (Bootstrap Aggregating) entraîne des modèles en parallèle sur différents échantillons, tandis que le boosting les entraîne séquentiellement en corrigeant les erreurs.',
    difficulty: 'Avancé',
    topic: 'Ensemble methods',
    points: 20
  },
  {
    id: 'ml_007',
    question: 'Qu\'est-ce que la régularisation L1 (Lasso) ?',
    options: [
      'Une technique qui ajoute la somme des valeurs absolues des coefficients',
      'Une technique qui ajoute la somme des carrés des coefficients',
      'Une technique de normalisation des données',
      'Une méthode d\'optimisation'
    ],
    correctAnswer: 0,
    explanation: 'La régularisation L1 (Lasso) ajoute la somme des valeurs absolues des coefficients à la fonction de coût, favorisant la sélection de variables en mettant certains coefficients à zéro.',
    difficulty: 'Avancé',
    topic: 'Régularisation',
    points: 20
  },
  {
    id: 'ml_008',
    question: 'Que signifie une aire sous la courbe ROC (AUC) de 0,5 pour un classifieur binaire ?',
    options: [
      'Le modèle classe les exemples comme le ferait le hasard',
      'Le modèle se trompe une fois sur deux sur chaque exemple',
      'Le modèle est parfait',
      'Le modèle classe toujours les exemples à l\'envers'
    ],
    correctAnswer: 0,
    explanation: 'L\'AUC est la probabilité qu\'un exemple positif tiré au hasard reçoive un score plus élevé qu\'un exemple négatif tiré au hasard. À 0,5, le modèle ne sépare pas mieux les classes que le hasard ; 1 correspond à une séparation parfaite et une valeur proche de 0 à un classement inversé.',
    difficulty: 'Avancé',
    topic: 'Évaluation',
    points: 20
  },
  {
    id: 'ml_009',
    question: 'Qu\'est-ce que l\'algorithme k-means ?',
    options: [
      'Un algorithme de classification supervisée',
      'Un algorithme de clustering non-supervisé',
      'Un algorithme de régression',
      'Un algorithme de réduction de dimensionnalité'
    ],
    correctAnswer: 1,
    explanation: 'K-means est un algorithme de clustering non-supervisé qui partitionne les données en k clusters en minimisant la variance intra-cluster.',
    difficulty: 'Intermédiaire',
    topic: 'Clustering',
    points: 15
  },
  {
    id: 'ml_010',
    question: 'Quelle est la différence entre précision et rappel ?',
    options: [
      'Précision = VP/(VP+FP), Rappel = VP/(VP+FN)',
      'Précision = VP/(VP+FN), Rappel = VP/(VP+FP)',
      'Il n\'y a pas de différence',
      'Précision mesure la vitesse, rappel mesure la mémoire'
    ],
    correctAnswer: 0,
    explanation: 'La précision mesure la proportion de vrais positifs parmi les prédictions positives. Le rappel mesure la proportion de vrais positifs détectés parmi tous les positifs réels.',
    difficulty: 'Intermédiaire',
    topic: 'Métriques',
    points: 15
  },
  {
    id: 'ml_011',
    question: 'Qu\'est-ce que la régularisation L2 (Ridge) ?',
    options: [
      'Une technique qui ajoute la somme des carrés des coefficients',
      'Une technique qui ajoute la somme des valeurs absolues des coefficients',
      'Une technique de normalisation des données',
      'Une méthode de sélection de variables'
    ],
    correctAnswer: 0,
    explanation: 'La régularisation L2 (Ridge) ajoute la somme des carrés des coefficients à la fonction de coût, réduisant la magnitude des coefficients sans les mettre à zéro.',
    difficulty: 'Avancé',
    topic: 'Régularisation',
    points: 20
  },
  {
    id: 'ml_012',
    question: 'Quel est l\'objectif de la réduction de dimensionnalité ?',
    options: [
      'Augmenter le nombre de variables',
      'Réduire la complexité tout en préservant l\'information importante',
      'Améliorer la vitesse d\'exécution uniquement',
      'Supprimer toutes les corrélations'
    ],
    correctAnswer: 1,
    explanation: 'La réduction de dimensionnalité vise à diminuer le nombre de variables tout en conservant l\'information essentielle, réduisant ainsi la complexité et le risque de surapprentissage.',
    difficulty: 'Intermédiaire',
    topic: 'Réduction de dimensionnalité',
    points: 15
  },
  {
    id: 'ml_013',
    question: 'Qu\'est-ce que l\'algorithme Random Forest ?',
    options: [
      'Un seul arbre de décision très profond',
      'Un ensemble d\'arbres de décision avec vote majoritaire',
      'Un algorithme de clustering',
      'Une technique de régularisation'
    ],
    correctAnswer: 1,
    explanation: 'Random Forest est un algorithme d\'ensemble qui combine plusieurs arbres de décision entraînés sur des échantillons différents et utilise le vote majoritaire pour la prédiction finale.',
    difficulty: 'Intermédiaire',
    topic: 'Ensemble methods',
    points: 15
  },
  {
    id: 'ml_014',
    question: 'Qu\'est-ce que la descente de gradient ?',
    options: [
      'Une technique de visualisation',
      'Un algorithme d\'optimisation pour minimiser une fonction de coût',
      'Une méthode de validation',
      'Un type de réseau de neurones'
    ],
    correctAnswer: 1,
    explanation: 'La descente de gradient est un algorithme d\'optimisation itératif qui ajuste les paramètres du modèle dans la direction qui minimise la fonction de coût.',
    difficulty: 'Intermédiaire',
    topic: 'Optimisation',
    points: 15
  },
  {
    id: 'ml_015',
    question: 'Quelle est la différence entre SVM linéaire et SVM à noyau ?',
    options: [
      'SVM linéaire est plus rapide, SVM à noyau gère les données non-linéaires',
      'SVM à noyau est plus rapide, SVM linéaire gère les données non-linéaires',
      'Il n\'y a pas de différence',
      'SVM linéaire utilise plus de mémoire'
    ],
    correctAnswer: 0,
    explanation: 'SVM linéaire sépare les classes avec une frontière linéaire et est plus rapide. SVM à noyau utilise des fonctions noyau pour gérer des données non-linéairement séparables.',
    difficulty: 'Avancé',
    topic: 'SVM',
    points: 20
  },
  {
    id: 'ml_016',
    question: 'Qu\'est-ce que l\'analyse en composantes principales (PCA) ?',
    options: [
      'Une technique de classification',
      'Une méthode de réduction de dimensionnalité par projection linéaire',
      'Un algorithme de clustering',
      'Une technique de régularisation'
    ],
    correctAnswer: 1,
    explanation: 'PCA est une technique de réduction de dimensionnalité qui projette les données sur les directions de variance maximale (composantes principales).',
    difficulty: 'Avancé',
    topic: 'Réduction de dimensionnalité',
    points: 20
  },
  {
    id: 'ml_017',
    question: 'Qu\'est-ce que le biais et la variance dans un modèle ?',
    options: [
      'Biais = sous-apprentissage, Variance = surapprentissage',
      'Biais = surapprentissage, Variance = sous-apprentissage',
      'Biais et variance sont identiques',
      'Biais mesure la vitesse, variance mesure la précision'
    ],
    correctAnswer: 0,
    explanation: 'Le biais mesure l\'erreur due à des hypothèses simplificatrices (sous-apprentissage). La variance mesure la sensibilité aux variations des données d\'entraînement (surapprentissage).',
    difficulty: 'Avancé',
    topic: 'Biais-Variance',
    points: 20
  },
  {
    id: 'ml_018',
    question: 'Quel algorithme utilise la règle de Bayes ?',
    options: ['K-means', 'Naive Bayes', 'SVM', 'Random Forest'],
    correctAnswer: 1,
    explanation: 'Naive Bayes utilise le théorème de Bayes avec l\'hypothèse d\'indépendance conditionnelle entre les caractéristiques pour calculer les probabilités de classe.',
    difficulty: 'Intermédiaire',
    topic: 'Algorithmes probabilistes',
    points: 15
  },
  {
    id: 'ml_019',
    question: 'Qu\'est-ce que l\'apprentissage par renforcement ?',
    options: [
      'Un type d\'apprentissage supervisé',
      'Un apprentissage par interaction avec un environnement via récompenses',
      'Un type de clustering',
      'Une technique de régularisation'
    ],
    correctAnswer: 1,
    explanation: 'L\'apprentissage par renforcement apprend par interaction avec un environnement, recevant des récompenses ou pénalités pour optimiser une stratégie de décision.',
    difficulty: 'Avancé',
    topic: 'Apprentissage par renforcement',
    points: 20
  },
  {
    id: 'ml_020',
    question: 'Qu\'est-ce que la matrice de confusion ?',
    options: [
      'Une matrice pour embrouiller les données',
      'Un tableau croisant prédictions et vraies classes',
      'Une technique d\'optimisation',
      'Un type de réseau de neurones'
    ],
    correctAnswer: 1,
    explanation: 'La matrice de confusion est un tableau qui croise les prédictions du modèle avec les vraies classes, permettant d\'analyser les types d\'erreurs commises.',
    difficulty: 'Intermédiaire',
    topic: 'Évaluation',
    points: 15
  }
];

/**
 * Data Visualization Quiz Questions
 */
const dataVizQuestions: QuizQuestion[] = [
  {
    id: 'viz_001',
    question: 'Quel type de graphique est le plus approprié pour montrer l\'évolution d\'une variable dans le temps ?',
    options: ['Graphique en barres', 'Graphique en secteurs', 'Graphique linéaire', 'Histogramme'],
    correctAnswer: 2,
    explanation: 'Le graphique linéaire est idéal pour montrer l\'évolution d\'une variable continue dans le temps, car il met en évidence les tendances et les changements.',
    difficulty: 'Débutant',
    topic: 'Types de graphiques',
    points: 10
  },
  {
    id: 'viz_002',
    question: 'Quelle bibliothèque Python est basée sur la grammaire des graphiques ?',
    options: ['Matplotlib', 'Seaborn', 'Plotly', 'Plotnine'],
    correctAnswer: 3,
    explanation: 'Plotnine est basée sur ggplot2 de R et implémente la grammaire des graphiques en Python. Bien que Plotly soit moderne, il n\'est pas basé sur cette grammaire.',
    difficulty: 'Avancé',
    topic: 'Bibliothèques de visualisation',
    points: 20
  },
  {
    id: 'viz_003',
    question: 'Qu\'est-ce qu\'un boxplot permet de visualiser ?',
    options: [
      'La corrélation entre deux variables',
      'La distribution d\'une variable avec quartiles et outliers',
      'L\'évolution temporelle',
      'La fréquence des catégories'
    ],
    correctAnswer: 1,
    explanation: 'Un boxplot (boîte à moustaches) montre la distribution d\'une variable avec les quartiles, la médiane et les valeurs aberrantes (outliers).',
    difficulty: 'Débutant',
    topic: 'Boxplot',
    points: 10
  },
  {
    id: 'viz_004',
    question: 'Quelle est la différence entre un histogramme et un graphique en barres ?',
    options: [
      'Il n\'y a pas de différence',
      'L\'histogramme montre des données continues, le graphique en barres des données catégorielles',
      'L\'histogramme est en 3D',
      'Le graphique en barres est plus coloré'
    ],
    correctAnswer: 1,
    explanation: 'L\'histogramme représente la distribution de données continues en regroupant les valeurs en intervalles, tandis que le graphique en barres compare des catégories distinctes.',
    difficulty: 'Intermédiaire',
    topic: 'Histogramme vs Barres',
    points: 15
  },
  {
    id: 'viz_005',
    question: 'Quel principe de design est important pour une visualisation efficace ?',
    options: [
      'Utiliser autant de couleurs que possible',
      'Maximiser le ratio données-encre',
      'Ajouter des effets 3D',
      'Utiliser des polices fantaisistes'
    ],
    correctAnswer: 1,
    explanation: 'Le ratio données-encre, concept d\'Edward Tufte, suggère de maximiser la proportion d\'encre utilisée pour représenter les données par rapport aux éléments décoratifs.',
    difficulty: 'Avancé',
    topic: 'Principes de design',
    points: 20
  },
  {
    id: 'viz_006',
    question: 'Quelle fonction Matplotlib permet de créer des sous-graphiques ?',
    options: ['subplot()', 'subplots()', 'Les deux réponses', 'figure()'],
    correctAnswer: 2,
    explanation: 'Matplotlib offre subplot() pour créer un sous-graphique à la fois et subplots() pour créer plusieurs sous-graphiques simultanément avec une grille.',
    difficulty: 'Intermédiaire',
    topic: 'Matplotlib',
    points: 15
  },
  {
    id: 'viz_007',
    question: 'Quel est l\'avantage principal de Seaborn par rapport à Matplotlib ?',
    options: [
      'Plus rapide',
      'Interface plus simple et styles par défaut plus esthétiques',
      'Plus de types de graphiques',
      'Meilleure performance'
    ],
    correctAnswer: 1,
    explanation: 'Seaborn offre une interface plus simple et des styles par défaut plus esthétiques, tout en étant construit sur Matplotlib pour les visualisations statistiques.',
    difficulty: 'Débutant',
    topic: 'Seaborn',
    points: 10
  },
  {
    id: 'viz_008',
    question: 'Quel graphique Seaborn utiliser pour visualiser la corrélation entre variables ?',
    options: ['boxplot', 'heatmap', 'violinplot', 'stripplot'],
    correctAnswer: 1,
    explanation: 'sns.heatmap() est parfait pour visualiser les matrices de corrélation avec un code couleur intuitif pour identifier les relations entre variables.',
    difficulty: 'Intermédiaire',
    topic: 'Seaborn',
    points: 15
  },
  {
    id: 'viz_009',
    question: 'Quelle est la différence entre un boxplot et un violinplot ?',
    options: [
      'Aucune différence',
      'Le violinplot montre la distribution complète, le boxplot les quartiles',
      'Le boxplot est plus coloré',
      'Le violinplot est plus rapide à calculer'
    ],
    correctAnswer: 1,
    explanation: 'Le violinplot combine boxplot et estimation de densité, montrant la forme complète de la distribution, tandis que le boxplot se limite aux quartiles et outliers.',
    difficulty: 'Intermédiaire',
    topic: 'Types de graphiques',
    points: 15
  },
  {
    id: 'viz_010',
    question: 'Quel est l\'avantage principal de Plotly ?',
    options: [
      'Plus rapide que Matplotlib',
      'Graphiques interactifs et support web natif',
      'Plus simple à utiliser',
      'Meilleure qualité d\'impression'
    ],
    correctAnswer: 1,
    explanation: 'Plotly excelle dans la création de visualisations interactives avec zoom, hover, sélection, et s\'intègre parfaitement dans les applications web.',
    difficulty: 'Débutant',
    topic: 'Plotly',
    points: 10
  },
  {
    id: 'viz_011',
    question: 'Quels paramètres Matplotlib permettent de personnaliser les couleurs d\'un graphique ?',
    options: ['color seulement', 'cmap seulement', 'palette (comme dans Seaborn)', 'color et cmap'],
    correctAnswer: 3,
    explanation: 'Matplotlib offre color pour une couleur unique et cmap pour une carte de couleurs. palette est un paramètre de Seaborn, pas de Matplotlib.',
    difficulty: 'Intermédiaire',
    topic: 'Matplotlib',
    points: 15
  },
  {
    id: 'viz_012',
    question: 'Quel type de graphique utiliser pour comparer des proportions ?',
    options: ['Histogramme', 'Graphique en secteurs (pie chart)', 'Nuage de points', 'Graphique en aires'],
    correctAnswer: 1,
    explanation: 'Le graphique en secteurs est idéal pour montrer les proportions d\'un tout, bien que les graphiques en barres soient souvent préférés pour la lisibilité.',
    difficulty: 'Débutant',
    topic: 'Types de graphiques',
    points: 10
  },
  {
    id: 'viz_013',
    question: 'Qu\'est-ce qu\'un graphique en aires empilées ?',
    options: [
      'Un graphique 3D',
      'Un graphique montrant l\'évolution de plusieurs séries cumulées',
      'Un type d\'histogramme',
      'Un graphique de corrélation'
    ],
    correctAnswer: 1,
    explanation: 'Le graphique en aires empilées montre l\'évolution de plusieurs séries de données en les empilant, permettant de voir à la fois les parties et le total.',
    difficulty: 'Intermédiaire',
    topic: 'Types de graphiques',
    points: 15
  },
  {
    id: 'viz_014',
    question: 'Quelle fonction Seaborn permet de créer une matrice de graphiques ?',
    options: ['pairplot()', 'heatmap()', 'jointplot()', 'distplot()'],
    correctAnswer: 0,
    explanation: 'sns.pairplot() crée une matrice de graphiques montrant les relations entre toutes les paires de variables numériques d\'un dataset.',
    difficulty: 'Intermédiaire',
    topic: 'Seaborn',
    points: 15
  },
  {
    id: 'viz_015',
    question: 'Quel est le problème principal des graphiques 3D pour la visualisation de données ?',
    options: [
      'Ils sont trop colorés',
      'Ils peuvent masquer des données et créer des illusions d\'optique',
      'Ils sont trop lents à générer',
      'Ils consomment trop de mémoire'
    ],
    correctAnswer: 1,
    explanation: 'Les graphiques 3D peuvent masquer des points de données derrière d\'autres et créer des distorsions visuelles qui rendent l\'interprétation difficile.',
    difficulty: 'Avancé',
    topic: 'Principes de design',
    points: 20
  },
  {
    id: 'viz_016',
    question: 'Comment ajouter des annotations à un graphique Matplotlib ?',
    options: ['annotate()', 'text()', 'Les deux réponses', 'label()'],
    correctAnswer: 2,
    explanation: 'Matplotlib offre annotate() pour des annotations avec flèches et text() pour du texte simple. Les deux peuvent être utilisées selon le besoin.',
    difficulty: 'Intermédiaire',
    topic: 'Matplotlib',
    points: 15
  },
  {
    id: 'viz_017',
    question: 'Qu\'est-ce qu\'un graphique en radar (spider chart) ?',
    options: [
      'Un graphique circulaire avec plusieurs axes',
      'Un type d\'histogramme',
      'Un graphique de réseau',
      'Un graphique temporel'
    ],
    correctAnswer: 0,
    explanation: 'Le graphique en radar utilise plusieurs axes disposés en cercle pour comparer plusieurs variables simultanément, formant une \'toile d\'araignée\'.',
    difficulty: 'Avancé',
    topic: 'Types de graphiques',
    points: 20
  },
  {
    id: 'viz_018',
    question: 'Quelle palette de couleurs éviter pour l\'accessibilité ?',
    options: [
      'Palette en niveaux de gris',
      'Palette rouge-vert uniquement',
      'Palette bleue',
      'Palette séquentielle'
    ],
    correctAnswer: 1,
    explanation: 'Les palettes rouge-vert posent problème pour les personnes daltoniennes. Il faut privilégier des palettes accessibles ou ajouter d\'autres distinctions visuelles.',
    difficulty: 'Avancé',
    topic: 'Accessibilité',
    points: 20
  },
  {
    id: 'viz_019',
    question: 'Comment créer un graphique interactif avec Plotly en Python ?',
    options: ['plotly.express', 'plotly.graph_objects', 'Les deux réponses', 'plotly.offline'],
    correctAnswer: 2,
    explanation: 'Plotly offre plotly.express pour une interface simple et plotly.graph_objects pour un contrôle plus fin. Les deux créent des graphiques interactifs.',
    difficulty: 'Intermédiaire',
    topic: 'Plotly',
    points: 15
  },
  {
    id: 'viz_020',
    question: 'Quel est l\'objectif principal d\'une légende dans un graphique ?',
    options: [
      'Décorer le graphique',
      'Expliquer la signification des couleurs, formes ou lignes',
      'Remplir l\'espace vide',
      'Ajouter du texte'
    ],
    correctAnswer: 1,
    explanation: 'La légende explique la signification des différents éléments visuels (couleurs, formes, lignes) permettant au lecteur de comprendre les données représentées.',
    difficulty: 'Débutant',
    topic: 'Principes de design',
    points: 10
  }
];

/**
 * Data Preparation Quiz Questions
 */
const dataPreparationQuestions: QuizQuestion[] = [
  {
    id: 'prep_001',
    question: 'Quelle est la première étape du processus de nettoyage de données ?',
    options: [
      'Supprimer les doublons',
      'Explorer et comprendre les données',
      'Normaliser les données',
      'Créer de nouvelles variables'
    ],
    correctAnswer: 1,
    explanation: 'L\'exploration et la compréhension des données (EDA) est la première étape cruciale pour identifier les problèmes de qualité et planifier le nettoyage.',
    difficulty: 'Débutant',
    topic: 'Processus de nettoyage',
    points: 10
  },
  {
    id: 'prep_002',
    question: 'Quelle méthode n\'est PAS appropriée pour traiter les valeurs manquantes ?',
    options: [
      'Suppression des lignes',
      'Imputation par la moyenne',
      'Imputation par régression',
      'Remplacement par des valeurs aléatoires'
    ],
    correctAnswer: 3,
    explanation: 'Remplacer les valeurs manquantes par des valeurs aléatoires introduit du bruit et peut biaiser l\'analyse. Les autres méthodes sont des techniques valides selon le contexte.',
    difficulty: 'Intermédiaire',
    topic: 'Valeurs manquantes',
    points: 15
  },
  {
    id: 'prep_003',
    question: 'Qu\'est-ce que la normalisation des données ?',
    options: [
      'Supprimer les doublons',
      'Mettre les variables à la même échelle',
      'Corriger les erreurs de saisie',
      'Créer de nouvelles colonnes'
    ],
    correctAnswer: 1,
    explanation: 'La normalisation consiste à mettre toutes les variables numériques à la même échelle, souvent entre 0 et 1, pour éviter qu\'une variable domine les autres par sa magnitude.',
    difficulty: 'Débutant',
    topic: 'Normalisation',
    points: 10
  },
  {
    id: 'prep_004',
    question: 'Comment détecter les valeurs aberrantes (outliers) ?',
    options: [
      'Uniquement par visualisation',
      'Méthode IQR, Z-score, ou isolation forest',
      'En regardant les premières lignes',
      'Par la corrélation'
    ],
    correctAnswer: 1,
    explanation: 'Les outliers peuvent être détectés par plusieurs méthodes : IQR (écart interquartile), Z-score, isolation forest, ou méthodes de clustering. La visualisation aide mais n\'est pas suffisante.',
    difficulty: 'Intermédiaire',
    topic: 'Détection d\'outliers',
    points: 15
  },
  {
    id: 'prep_005',
    question: 'Qu\'est-ce que l\'encodage des variables catégorielles ?',
    options: [
      'Changer le nom des colonnes',
      'Convertir les catégories en valeurs numériques',
      'Supprimer les catégories',
      'Trier les données'
    ],
    correctAnswer: 1,
    explanation: 'L\'encodage des variables catégorielles consiste à convertir les catégories (texte) en valeurs numériques que les algorithmes peuvent traiter, par exemple avec one-hot encoding.',
    difficulty: 'Intermédiaire',
    topic: 'Encodage catégoriel',
    points: 15
  },
  {
    id: 'prep_006',
    question: 'Quelle est la différence entre One-Hot Encoding et Label Encoding ?',
    options: [
      'Aucune différence',
      'One-Hot crée des colonnes binaires, Label assigne des nombres',
      'Label est plus rapide',
      'One-Hot est obsolète'
    ],
    correctAnswer: 1,
    explanation: 'One-Hot Encoding crée une colonne binaire pour chaque catégorie, tandis que Label Encoding assigne un nombre unique à chaque catégorie. One-Hot évite l\'ordre artificiel.',
    difficulty: 'Intermédiaire',
    topic: 'Encodage catégoriel',
    points: 15
  },
  {
    id: 'prep_007',
    question: 'Comment traiter les valeurs manquantes numériques ?',
    options: [
      'Toujours les supprimer',
      'Imputation par moyenne, médiane, ou méthodes avancées',
      'Les remplacer par zéro',
      'Les ignorer'
    ],
    correctAnswer: 1,
    explanation: 'Les valeurs manquantes peuvent être imputées par la moyenne, médiane, mode, ou méthodes plus sophistiquées comme KNN imputation ou MICE selon le contexte.',
    difficulty: 'Intermédiaire',
    topic: 'Valeurs manquantes',
    points: 15
  },
  {
    id: 'prep_008',
    question: 'Qu\'est-ce que la normalisation Min-Max ?',
    options: [
      'Diviser par la moyenne',
      'Mettre à l\'échelle entre 0 et 1',
      'Centrer autour de zéro',
      'Calculer l\'écart-type'
    ],
    correctAnswer: 1,
    explanation: 'La normalisation Min-Max transforme les données pour qu\'elles soient comprises entre 0 et 1 en utilisant la formule (x-min)/(max-min).',
    difficulty: 'Débutant',
    topic: 'Normalisation',
    points: 10
  },
  {
    id: 'prep_009',
    question: 'Quelle est la différence entre normalisation et standardisation ?',
    options: [
      'Aucune différence',
      'Normalisation: [0,1], Standardisation: moyenne=0, écart-type=1',
      'Standardisation est plus rapide',
      'Normalisation est obsolète'
    ],
    correctAnswer: 1,
    explanation: 'La normalisation met les données entre 0 et 1, tandis que la standardisation centre les données autour de 0 avec un écart-type de 1 (z-score).',
    difficulty: 'Intermédiaire',
    topic: 'Normalisation',
    points: 15
  },
  {
    id: 'prep_010',
    question: 'Comment détecter les doublons dans un dataset ?',
    options: [
      'Visuellement seulement',
      'df.duplicated() et df.drop_duplicates()',
      'Par tri alphabétique',
      'Impossible à détecter'
    ],
    correctAnswer: 1,
    explanation: 'Pandas offre df.duplicated() pour identifier les doublons et df.drop_duplicates() pour les supprimer, avec options pour spécifier les colonnes à considérer.',
    difficulty: 'Débutant',
    topic: 'Nettoyage des données',
    points: 10
  },
  {
    id: 'prep_011',
    question: 'Qu\'est-ce que le feature engineering ?',
    options: [
      'Supprimer des colonnes',
      'Créer de nouvelles variables à partir des existantes',
      'Changer les noms de colonnes',
      'Trier les données'
    ],
    correctAnswer: 1,
    explanation: 'Le feature engineering consiste à créer, transformer ou sélectionner des variables pour améliorer les performances des modèles d\'apprentissage automatique.',
    difficulty: 'Intermédiaire',
    topic: 'Feature Engineering',
    points: 15
  },
  {
    id: 'prep_012',
    question: 'Comment traiter les variables catégorielles ordinales ?',
    options: [
      'One-Hot Encoding uniquement',
      'Encodage ordinal en respectant l\'ordre',
      'Les supprimer',
      'Les convertir en texte'
    ],
    correctAnswer: 1,
    explanation: 'Les variables ordinales ont un ordre naturel (ex: petit, moyen, grand). Un encodage ordinal (par exemple OrdinalEncoder avec la liste ordonnée des catégories) préserve cet ordre, contrairement à One-Hot Encoding.',
    difficulty: 'Avancé',
    topic: 'Encodage catégoriel',
    points: 20
  },
  {
    id: 'prep_013',
    question: 'Qu\'est-ce que la discrétisation (binning) ?',
    options: [
      'Supprimer des données',
      'Convertir des variables continues en catégories',
      'Trier les colonnes',
      'Calculer des moyennes'
    ],
    correctAnswer: 1,
    explanation: 'La discrétisation transforme des variables continues en catégories (bins), utile pour simplifier les modèles ou capturer des relations non-linéaires.',
    difficulty: 'Intermédiaire',
    topic: 'Transformation des données',
    points: 15
  },
  {
    id: 'prep_014',
    question: 'Comment gérer les données déséquilibrées ?',
    options: [
      'Les ignorer',
      'Sous-échantillonnage, sur-échantillonnage, ou SMOTE',
      'Supprimer la classe minoritaire',
      'Changer d\'algorithme uniquement'
    ],
    correctAnswer: 1,
    explanation: 'Les données déséquilibrées peuvent être traitées par sous-échantillonnage, sur-échantillonnage, SMOTE, ou ajustement des poids dans les modèles.',
    difficulty: 'Avancé',
    topic: 'Déséquilibre des classes',
    points: 20
  },
  {
    id: 'prep_015',
    question: 'Qu\'est-ce que la validation croisée dans la préparation des données ?',
    options: [
      'Vérifier les types de données',
      'Évaluer la robustesse du preprocessing sur différents échantillons',
      'Compter les lignes',
      'Vérifier la syntaxe'
    ],
    correctAnswer: 1,
    explanation: 'La validation croisée en preprocessing vérifie que les transformations sont robustes et généralisables sur différents échantillons des données.',
    difficulty: 'Avancé',
    topic: 'Validation',
    points: 20
  },
  {
    id: 'prep_016',
    question: 'Comment traiter les variables de date/temps ?',
    options: [
      'Les supprimer',
      'Extraire composants (année, mois, jour) et créer des features cycliques',
      'Les convertir en texte',
      'Les ignorer'
    ],
    correctAnswer: 1,
    explanation: 'Les dates peuvent être décomposées en composants (année, mois, jour) et transformées en features cycliques (sin/cos) pour capturer la périodicité.',
    difficulty: 'Avancé',
    topic: 'Feature Engineering',
    points: 20
  },
  {
    id: 'prep_017',
    question: 'Qu\'est-ce que l\'analyse de corrélation dans la préparation ?',
    options: [
      'Compter les lignes',
      'Identifier les variables redondantes ou fortement corrélées',
      'Trier les colonnes',
      'Changer les types'
    ],
    correctAnswer: 1,
    explanation: 'L\'analyse de corrélation identifie les variables redondantes (multicolinéarité) qui peuvent nuire aux performances des modèles et doivent être traitées.',
    difficulty: 'Intermédiaire',
    topic: 'Analyse exploratoire',
    points: 15
  },
  {
    id: 'prep_018',
    question: 'Comment créer des features d\'interaction ?',
    options: [
      'Multiplier ou combiner des variables existantes',
      'Supprimer des colonnes',
      'Changer les noms',
      'Trier les données'
    ],
    correctAnswer: 0,
    explanation: 'Les features d\'interaction sont créées en combinant des variables existantes (multiplication, addition, ratios) pour capturer des relations complexes.',
    difficulty: 'Avancé',
    topic: 'Feature Engineering',
    points: 20
  },
  {
    id: 'prep_019',
    question: 'Qu\'est-ce que le data leakage ?',
    options: [
      'Perte de données',
      'Utilisation d\'informations futures dans les features',
      'Erreur de syntaxe',
      'Données manquantes'
    ],
    correctAnswer: 1,
    explanation: 'Le data leakage survient quand des informations du futur ou de la variable cible \'fuient\' dans les features, créant des performances artificiellement élevées.',
    difficulty: 'Avancé',
    topic: 'Bonnes pratiques',
    points: 20
  },
  {
    id: 'prep_020',
    question: 'Comment valider la qualité du preprocessing ?',
    options: [
      'Visuellement seulement',
      'Tests statistiques, profiling, et validation sur données de test',
      'Compter les lignes',
      'Vérifier les noms de colonnes'
    ],
    correctAnswer: 1,
    explanation: 'La qualité du preprocessing se valide par des tests statistiques, profiling des données, visualisations, et validation des performances sur données de test.',
    difficulty: 'Avancé',
    topic: 'Validation',
    points: 20
  }
];

/**
 * Deep Learning Quiz Questions
 */
const deepLearningQuestions: QuizQuestion[] = [
  {
    id: 'dl_001',
    question: 'Qu\'est-ce qu\'un neurone artificiel ?',
    options: [
      'Une cellule biologique',
      'Une unité de calcul qui applique une fonction à ses entrées',
      'Un type de base de données',
      'Un algorithme de tri'
    ],
    correctAnswer: 1,
    explanation: 'Un neurone artificiel est une unité de calcul qui reçoit des entrées, leur applique des poids, ajoute un biais, et applique une fonction d\'activation pour produire une sortie.',
    difficulty: 'Débutant',
    topic: 'Neurones artificiels',
    points: 10
  },
  {
    id: 'dl_002',
    question: 'Quelle fonction d\'activation est sujette au problème de gradient qui disparaît ?',
    options: ['ReLU', 'Sigmoid', 'Tanh', 'Sigmoid et Tanh'],
    correctAnswer: 3,
    explanation: 'Les fonctions sigmoid et tanh peuvent causer le problème de gradient qui disparaît car leurs dérivées deviennent très petites, ralentissant l\'apprentissage dans les couches profondes.',
    difficulty: 'Avancé',
    topic: 'Fonctions d\'activation',
    points: 20
  },
  {
    id: 'dl_003',
    question: 'Qu\'est-ce que la rétropropagation ?',
    options: [
      'Une technique de visualisation',
      'Un algorithme pour calculer les gradients de l\'erreur par rapport aux poids',
      'Une méthode de nettoyage de données',
      'Un type de réseau de neurones'
    ],
    correctAnswer: 1,
    explanation: 'La rétropropagation est l\'algorithme qui calcule les gradients de l\'erreur par rapport aux poids du réseau ; c\'est ensuite l\'optimiseur (descente de gradient, Adam...) qui utilise ces gradients pour mettre à jour les poids.',
    difficulty: 'Intermédiaire',
    topic: 'Rétropropagation',
    points: 15
  },
  {
    id: 'dl_004',
    question: 'Quel type de réseau est le mieux adapté pour le traitement d\'images ?',
    options: [
      'Réseau de neurones récurrent (RNN)',
      'Réseau de neurones convolutionnel (CNN)',
      'Perceptron multicouche (MLP)',
      'Réseau de Hopfield'
    ],
    correctAnswer: 1,
    explanation: 'Les CNN sont spécialement conçus pour traiter les images grâce à leurs couches convolutionnelles qui détectent des caractéristiques locales et leur équivariance à la translation (le pooling ajoute une invariance approchée).',
    difficulty: 'Intermédiaire',
    topic: 'Types de réseaux',
    points: 15
  },
  {
    id: 'dl_005',
    question: 'Qu\'est-ce que le dropout ?',
    options: [
      'Une technique pour supprimer des données',
      'Une méthode de régularisation qui désactive aléatoirement des neurones',
      'Un type de fonction d\'activation',
      'Une technique d\'optimisation'
    ],
    correctAnswer: 1,
    explanation: 'Le dropout est une technique de régularisation qui désactive aléatoirement certains neurones pendant l\'entraînement pour réduire le surapprentissage et améliorer la généralisation.',
    difficulty: 'Avancé',
    topic: 'Régularisation',
    points: 20
  },
  {
    id: 'dl_006',
    question: 'Quelle est la différence entre RNN et LSTM ?',
    options: [
      'Aucune différence',
      'LSTM atténue le problème du gradient qui disparaît des RNN',
      'RNN est plus récent',
      'LSTM est plus simple'
    ],
    correctAnswer: 1,
    explanation: 'LSTM (Long Short-Term Memory) est une variante de RNN qui utilise des portes pour contrôler le flux d\'information, ce qui atténue fortement le problème du gradient qui disparaît.',
    difficulty: 'Avancé',
    topic: 'Réseaux récurrents',
    points: 20
  },
  {
    id: 'dl_007',
    question: 'Qu\'est-ce qu\'un autoencoder ?',
    options: [
      'Un type de CNN',
      'Un réseau qui apprend à reconstruire ses entrées',
      'Un algorithme de classification',
      'Une fonction d\'activation'
    ],
    correctAnswer: 1,
    explanation: 'Un autoencoder est un réseau de neurones qui apprend à compresser puis reconstruire ses données d\'entrée, utile pour la réduction de dimensionnalité et la détection d\'anomalies.',
    difficulty: 'Avancé',
    topic: 'Architectures spécialisées',
    points: 20
  },
  {
    id: 'dl_008',
    question: 'Quelle fonction d\'activation utiliser sur une unique unité de sortie pour une classification binaire ?',
    options: [
      'ReLU',
      'Sigmoid',
      'Tanh',
      'Softmax'
    ],
    correctAnswer: 1,
    explanation: 'La fonction sigmoid, appliquée à une seule unité de sortie, produit une valeur entre 0 et 1 interprétable comme la probabilité de la classe positive. (Un softmax sur deux unités est équivalent, mais la sigmoid est le choix usuel pour deux classes ; le softmax sert surtout à plus de deux classes exclusives.)',
    difficulty: 'Intermédiaire',
    topic: 'Fonctions d\'activation',
    points: 15
  },
  {
    id: 'dl_009',
    question: 'Qu\'est-ce que le batch normalization ?',
    options: [
      'Normaliser les données d\'entrée',
      'Normaliser les activations de chaque couche',
      'Changer la taille des batches',
      'Une technique d\'optimisation'
    ],
    correctAnswer: 1,
    explanation: 'Le batch normalization normalise les activations de chaque couche, accélérant l\'entraînement et réduisant la sensibilité à l\'initialisation des poids.',
    difficulty: 'Avancé',
    topic: 'Techniques d\'entraînement',
    points: 20
  },
  {
    id: 'dl_010',
    question: 'Quel est l\'avantage principal des réseaux résiduels (ResNet) ?',
    options: [
      'Plus rapides à entraîner',
      'Permettent d\'entraîner des réseaux très profonds',
      'Utilisent moins de mémoire',
      'Plus simples à implémenter'
    ],
    correctAnswer: 1,
    explanation: 'Les connexions résiduelles (skip connections) permettent d\'entraîner des réseaux très profonds en évitant le problème du gradient qui disparaît.',
    difficulty: 'Avancé',
    topic: 'Architectures avancées',
    points: 20
  },
  {
    id: 'dl_011',
    question: 'Qu\'est-ce qu\'un GAN (Generative Adversarial Network) ?',
    options: [
      'Un type de CNN',
      'Deux réseaux en compétition : générateur et discriminateur',
      'Un algorithme de classification',
      'Une technique d\'optimisation'
    ],
    correctAnswer: 1,
    explanation: 'Un GAN comprend un générateur qui crée de fausses données et un discriminateur qui les distingue des vraies, s\'entraînant en compétition pour générer des données réalistes.',
    difficulty: 'Avancé',
    topic: 'Modèles génératifs',
    points: 20
  },
  {
    id: 'dl_012',
    question: 'Quelle est la différence entre fine-tuning et transfer learning ?',
    options: [
      'Aucune différence',
      'Transfer learning utilise un modèle pré-entraîné, fine-tuning ajuste ses poids',
      'Fine-tuning est plus rapide',
      'Transfer learning est obsolète'
    ],
    correctAnswer: 1,
    explanation: 'Transfer learning utilise un modèle pré-entraîné comme base, tandis que fine-tuning ajuste spécifiquement les poids de ce modèle pour une nouvelle tâche.',
    difficulty: 'Intermédiaire',
    topic: 'Transfer Learning',
    points: 15
  },
  {
    id: 'dl_013',
    question: 'Qu\'est-ce que l\'attention mechanism ?',
    options: [
      'Une technique de régularisation',
      'Un mécanisme qui permet au modèle de se concentrer sur certaines parties de l\'entrée',
      'Un type de fonction d\'activation',
      'Une méthode d\'optimisation'
    ],
    correctAnswer: 1,
    explanation: 'Le mécanisme d\'attention permet au modèle de pondérer différemment les parties de l\'entrée, se concentrant sur les éléments les plus pertinents pour la tâche.',
    difficulty: 'Avancé',
    topic: 'Mécanismes d\'attention',
    points: 20
  },
  {
    id: 'dl_014',
    question: 'Quel est le problème du gradient qui explose ?',
    options: [
      'Les gradients deviennent trop petits',
      'Les gradients deviennent trop grands et déstabilisent l\'entraînement',
      'Les gradients disparaissent',
      'Les gradients changent de signe'
    ],
    correctAnswer: 1,
    explanation: 'Le gradient qui explose survient quand les gradients deviennent très grands, causant des mises à jour instables des poids et empêchant la convergence.',
    difficulty: 'Avancé',
    topic: 'Problèmes d\'entraînement',
    points: 20
  },
  {
    id: 'dl_015',
    question: 'Qu\'est-ce que l\'early stopping ?',
    options: [
      'Arrêter l\'entraînement après un nombre fixe d\'époques',
      'Arrêter quand la performance sur validation cesse de s\'améliorer',
      'Arrêter quand le loss devient zéro',
      'Arrêter manuellement l\'entraînement'
    ],
    correctAnswer: 1,
    explanation: 'L\'early stopping arrête l\'entraînement quand la performance sur les données de validation cesse de s\'améliorer, évitant le surapprentissage.',
    difficulty: 'Intermédiaire',
    topic: 'Régularisation',
    points: 15
  },
  {
    id: 'dl_016',
    question: 'Quelle est la différence entre epoch, batch et iteration ?',
    options: [
      'Aucune différence',
      'Epoch: passage complet, Batch: sous-ensemble, Iteration: traitement d\'un batch',
      'Epoch est plus petit que batch',
      'Iteration contient plusieurs epochs'
    ],
    correctAnswer: 1,
    explanation: 'Une epoch est un passage complet sur toutes les données, un batch est un sous-ensemble des données, et une iteration est le traitement d\'un batch.',
    difficulty: 'Débutant',
    topic: 'Concepts de base',
    points: 10
  },
  {
    id: 'dl_017',
    question: 'Qu\'est-ce que la fonction de perte cross-entropy ?',
    options: [
      'Une fonction pour les régressions',
      'Une fonction de perte pour la classification qui pénalise les mauvaises prédictions',
      'Une fonction d\'activation',
      'Une technique d\'optimisation'
    ],
    correctAnswer: 1,
    explanation: 'La cross-entropy mesure la différence entre les probabilités prédites et réelles, pénalisant fortement les prédictions très incorrectes en classification.',
    difficulty: 'Intermédiaire',
    topic: 'Fonctions de perte',
    points: 15
  },
  {
    id: 'dl_018',
    question: 'Qu\'est-ce qu\'un Transformer ?',
    options: [
      'Un type de CNN',
      'Une architecture basée uniquement sur l\'attention',
      'Un algorithme d\'optimisation',
      'Une fonction d\'activation'
    ],
    correctAnswer: 1,
    explanation: 'Les Transformers utilisent uniquement des mécanismes d\'attention, sans convolution ni récurrence, révolutionnant le traitement du langage naturel.',
    difficulty: 'Avancé',
    topic: 'Architectures modernes',
    points: 20
  },
  {
    id: 'dl_019',
    question: 'Comment initialiser les poids d\'un réseau de neurones ?',
    options: [
      'Tous à zéro',
      'Aléatoirement avec des méthodes comme Xavier ou He',
      'Tous à un',
      'Avec des valeurs très grandes'
    ],
    correctAnswer: 1,
    explanation: 'L\'initialisation aléatoire avec des méthodes comme Xavier (Glorot) ou He évite la symétrie et assure une propagation appropriée des gradients.',
    difficulty: 'Intermédiaire',
    topic: 'Initialisation',
    points: 15
  },
  {
    id: 'dl_020',
    question: 'Qu\'est-ce que le learning rate scheduling ?',
    options: [
      'Changer la taille des batches',
      'Ajuster le taux d\'apprentissage pendant l\'entraînement',
      'Modifier l\'architecture du réseau',
      'Changer les données d\'entraînement'
    ],
    correctAnswer: 1,
    explanation: 'Le learning rate scheduling ajuste le taux d\'apprentissage pendant l\'entraînement, souvent en le diminuant progressivement pour une convergence plus fine.',
    difficulty: 'Intermédiaire',
    topic: 'Optimisation',
    points: 15
  }
];

/**
 * Big Data Quiz Questions
 */
const bigDataQuestions: QuizQuestion[] = [
  {
    id: 'bd_001',
    question: 'Quelles sont les 3 V du Big Data ?',
    options: [
      'Volume, Vitesse, Variété',
      'Volume, Valeur, Vérité',
      'Vitesse, Variété, Validation',
      'Volume, Version, Variété'
    ],
    correctAnswer: 0,
    explanation: 'Les 3 V traditionnels du Big Data sont Volume (quantité de données), Vitesse (rapidité de génération/traitement), et Variété (diversité des types de données).',
    difficulty: 'Débutant',
    topic: 'Concepts Big Data',
    points: 10
  },
  {
    id: 'bd_002',
    question: 'Qu\'est-ce qu\'Apache Spark ?',
    options: [
      'Une base de données',
      'Un moteur de traitement de données distribuées',
      'Un langage de programmation',
      'Un système d\'exploitation'
    ],
    correctAnswer: 1,
    explanation: 'Apache Spark est un moteur de traitement de données distribuées rapide et général, conçu pour traiter de gros volumes de données sur des clusters.',
    difficulty: 'Intermédiaire',
    topic: 'Apache Spark',
    points: 15
  },
  {
    id: 'bd_003',
    question: 'Quelle est la différence entre un Data Lake et un Data Warehouse ?',
    options: [
      'Il n\'y a pas de différence',
      'Le Data Lake stocke des données brutes, le Data Warehouse des données structurées',
      'Le Data Warehouse est plus récent',
      'Le Data Lake est plus petit'
    ],
    correctAnswer: 1,
    explanation: 'Un Data Lake stocke des données brutes dans leur format natif, tandis qu\'un Data Warehouse stocke des données structurées, nettoyées et organisées pour l\'analyse.',
    difficulty: 'Intermédiaire',
    topic: 'Architecture de données',
    points: 15
  },
  {
    id: 'bd_004',
    question: 'Qu\'est-ce que MapReduce ?',
    options: [
      'Un algorithme de tri',
      'Un paradigme de programmation pour traiter de gros datasets',
      'Une base de données NoSQL',
      'Un protocole réseau'
    ],
    correctAnswer: 1,
    explanation: 'MapReduce est un paradigme de programmation qui divise le traitement en deux phases : Map (traitement parallèle) et Reduce (agrégation des résultats).',
    difficulty: 'Avancé',
    topic: 'MapReduce',
    points: 20
  },
  {
    id: 'bd_005',
    question: 'Quel type de base de données NoSQL est optimisé pour les données de graphe ?',
    options: ['Document', 'Colonne', 'Clé-valeur', 'Graphe'],
    correctAnswer: 3,
    explanation: 'Les bases de données de graphe (comme Neo4j) sont spécialement conçues pour stocker et interroger efficacement des données sous forme de nœuds et de relations.',
    difficulty: 'Intermédiaire',
    topic: 'Bases de données NoSQL',
    points: 15
  },
  {
    id: 'bd_006',
    question: 'Qu\'est-ce que HDFS dans l\'écosystème Hadoop ?',
    options: [
      'Un langage de requête SQL',
      'Un outil de visualisation',
      'Le système de fichiers distribué de Hadoop',
      'Un format de compression'
    ],
    correctAnswer: 2,
    explanation: 'HDFS (Hadoop Distributed File System) répartit les fichiers en blocs sur plusieurs machines d\'un cluster et les réplique pour tolérer les pannes ; il sert de stockage à Hadoop et à d\'autres moteurs comme Spark.',
    difficulty: 'Intermédiaire',
    topic: 'Hadoop',
    points: 15
  },
  {
    id: 'bd_007',
    question: 'Quelle est la différence entre batch processing et stream processing ?',
    options: [
      'Aucune différence',
      'Batch traite des lots de données, Stream traite en temps réel',
      'Batch est plus rapide',
      'Stream est obsolète'
    ],
    correctAnswer: 1,
    explanation: 'Le batch processing traite de gros volumes de données par lots à intervalles réguliers, tandis que le stream processing traite les données en continu en temps réel.',
    difficulty: 'Intermédiaire',
    topic: 'Types de traitement',
    points: 15
  },
  {
    id: 'bd_008',
    question: 'Qu\'est-ce qu\'un Data Lake ?',
    options: [
      'Une base de données relationnelle',
      'Un référentiel centralisé pour stocker des données structurées et non-structurées',
      'Un algorithme de machine learning',
      'Un type de visualisation'
    ],
    correctAnswer: 1,
    explanation: 'Un Data Lake est un référentiel centralisé qui permet de stocker toutes les données structurées et non-structurées à n\'importe quelle échelle, dans leur format natif.',
    difficulty: 'Intermédiaire',
    topic: 'Architecture des données',
    points: 15
  },
  {
    id: 'bd_009',
    question: 'Quel est l\'avantage principal de Cassandra ?',
    options: [
      'Interface SQL complète',
      'Haute disponibilité et scalabilité linéaire',
      'Traitement en temps réel',
      'Stockage en mémoire uniquement'
    ],
    correctAnswer: 1,
    explanation: 'Apache Cassandra offre une haute disponibilité sans point de défaillance unique et une scalabilité linéaire, idéale pour les applications nécessitant une disponibilité continue.',
    difficulty: 'Avancé',
    topic: 'Bases de données NoSQL',
    points: 20
  },
  {
    id: 'bd_010',
    question: 'Qu\'est-ce que le partitioning (sharding) ?',
    options: [
      'Supprimer des données',
      'Diviser une base de données en fragments distribués',
      'Compresser les données',
      'Chiffrer les données'
    ],
    correctAnswer: 1,
    explanation: 'Le partitioning ou sharding divise une grande base de données en fragments plus petits distribués sur plusieurs serveurs pour améliorer les performances et la scalabilité.',
    difficulty: 'Avancé',
    topic: 'Architecture distribuée',
    points: 20
  },
  {
    id: 'bd_011',
    question: 'Quel est le rôle d\'Apache Kafka ?',
    options: [
      'Base de données NoSQL',
      'Plateforme de streaming de données distribuée',
      'Moteur de calcul',
      'Système de fichiers'
    ],
    correctAnswer: 1,
    explanation: 'Apache Kafka est une plateforme de streaming distribuée qui permet de publier, souscrire, stocker et traiter des flux de données en temps réel de manière scalable.',
    difficulty: 'Intermédiaire',
    topic: 'Streaming de données',
    points: 15
  },
  {
    id: 'bd_012',
    question: 'Qu\'est-ce que le théorème CAP ?',
    options: [
      'Un algorithme de tri',
      'Consistency, Availability, Partition tolerance - on ne peut garantir que 2 sur 3',
      'Un protocole réseau',
      'Une méthode de compression'
    ],
    correctAnswer: 1,
    explanation: 'Le théorème CAP (Brewer 2000, démontré par Gilbert et Lynch 2002) dit qu\'un système distribué ne peut garantir à la fois Cohérence, Disponibilité et Tolérance au partitionnement. Comme une partition réseau ne peut pas être exclue, le vrai choix se fait entre cohérence et disponibilité quand elle survient.',
    difficulty: 'Avancé',
    topic: 'Systèmes distribués',
    points: 20
  },
  {
    id: 'bd_013',
    question: 'Que signifie « schema-on-read » (schéma à la lecture) ?',
    options: [
      'Le schéma est vérifié à chaque écriture',
      'La structure des données est appliquée au moment de la lecture, pas du stockage',
      'Les données sont chiffrées lors de la lecture',
      'Le schéma est supprimé après la première lecture'
    ],
    correctAnswer: 1,
    explanation: 'Dans un data lake, les données sont stockées brutes et c\'est la requête ou l\'outil de lecture qui leur donne une structure. À l\'inverse, un entrepôt de données relationnel impose le schéma à l\'écriture (schema-on-write).',
    difficulty: 'Avancé',
    topic: 'Data Lake',
    points: 20
  },
  {
    id: 'bd_014',
    question: 'Qu\'est-ce qu\'Apache Hive ?',
    options: [
      'Une base de données NoSQL',
      'Un entrepôt de données qui fournit une interface SQL sur Hadoop',
      'Un moteur de streaming',
      'Un système de fichiers'
    ],
    correctAnswer: 1,
    explanation: 'Apache Hive est un entrepôt de données construit sur Hadoop qui permet d\'interroger et d\'analyser de gros datasets en utilisant un langage similaire à SQL (HiveQL).',
    difficulty: 'Intermédiaire',
    topic: 'Écosystème Hadoop',
    points: 15
  },
  {
    id: 'bd_015',
    question: 'Quel est l\'avantage des bases de données colonnaires ?',
    options: [
      'Plus simples à utiliser',
      'Optimisées pour les requêtes analytiques et la compression',
      'Plus rapides pour les transactions',
      'Moins chères'
    ],
    correctAnswer: 1,
    explanation: 'Les bases de données colonnaires stockent les données par colonnes plutôt que par lignes, optimisant les requêtes analytiques et offrant une meilleure compression.',
    difficulty: 'Avancé',
    topic: 'Types de stockage',
    points: 20
  },
  {
    id: 'bd_016',
    question: 'Qu\'est-ce que la réplication dans les systèmes distribués ?',
    options: [
      'Supprimer des données',
      'Dupliquer les données sur plusieurs nœuds pour la disponibilité',
      'Compresser les données',
      'Chiffrer les données'
    ],
    correctAnswer: 1,
    explanation: 'La réplication consiste à maintenir des copies des données sur plusieurs nœuds pour assurer la disponibilité, la tolérance aux pannes et améliorer les performances de lecture.',
    difficulty: 'Intermédiaire',
    topic: 'Systèmes distribués',
    points: 15
  },
  {
    id: 'bd_017',
    question: 'Quel est le rôle d\'Apache Zookeeper ?',
    options: [
      'Base de données',
      'Service de coordination pour systèmes distribués',
      'Moteur de calcul',
      'Interface utilisateur'
    ],
    correctAnswer: 1,
    explanation: 'Apache Zookeeper est un service de coordination centralisé pour les systèmes distribués, gérant la configuration, la synchronisation et les services de nommage.',
    difficulty: 'Avancé',
    topic: 'Coordination distribuée',
    points: 20
  },
  {
    id: 'bd_018',
    question: 'Qu\'est-ce que l\'eventual consistency ?',
    options: [
      'Cohérence immédiate',
      'Cohérence garantie à terme sans garantie de délai',
      'Incohérence permanente',
      'Cohérence parfaite'
    ],
    correctAnswer: 1,
    explanation: 'L\'eventual consistency garantit que si aucune nouvelle mise à jour n\'est effectuée, tous les nœuds convergeront vers la même valeur, mais sans garantie de délai.',
    difficulty: 'Avancé',
    topic: 'Cohérence des données',
    points: 20
  },
  {
    id: 'bd_019',
    question: 'Quel est l\'avantage principal d\'Elasticsearch ?',
    options: [
      'Stockage relationnel',
      'Recherche et analyse en temps réel de gros volumes de données',
      'Interface graphique',
      'Calcul distribué'
    ],
    correctAnswer: 1,
    explanation: 'Elasticsearch est un moteur de recherche et d\'analyse distribué qui permet la recherche et l\'analyse en temps réel de gros volumes de données textuelles et structurées.',
    difficulty: 'Intermédiaire',
    topic: 'Moteurs de recherche',
    points: 15
  },
  {
    id: 'bd_020',
    question: 'Qu\'est-ce que le data lineage ?',
    options: [
      'Un type de graphique',
      'Le suivi de l\'origine et des transformations des données',
      'Une méthode de compression',
      'Un protocole de sécurité'
    ],
    correctAnswer: 1,
    explanation: 'Le data lineage trace l\'origine, les mouvements et les transformations des données tout au long de leur cycle de vie, essentiel pour la gouvernance et la conformité.',
    difficulty: 'Avancé',
    topic: 'Gouvernance des données',
    points: 20
  }
];

/**
 * Business Intelligence Quiz Questions
 */
const businessIntelligenceQuestions: QuizQuestion[] = [
  {
    id: 'bi_001',
    question: 'Qu\'est-ce qu\'un KPI (Key Performance Indicator) ?',
    options: [
      'Un type de graphique',
      'Une métrique qui mesure la performance d\'un objectif business',
      'Un algorithme d\'analyse',
      'Un outil de visualisation'
    ],
    correctAnswer: 1,
    explanation: 'Un KPI est une métrique quantifiable qui mesure la performance d\'une organisation, d\'un département ou d\'un processus par rapport à ses objectifs stratégiques.',
    difficulty: 'Débutant',
    topic: 'KPI',
    points: 10
  },
  {
    id: 'bi_002',
    question: 'Quelle est la différence entre OLTP et OLAP ?',
    options: [
      'OLTP pour les transactions, OLAP pour l\'analyse',
      'OLAP pour les transactions, OLTP pour l\'analyse',
      'Il n\'y a pas de différence',
      'OLTP est plus récent qu\'OLAP'
    ],
    correctAnswer: 0,
    explanation: 'OLTP (Online Transaction Processing) gère les transactions quotidiennes, tandis qu\'OLAP (Online Analytical Processing) est optimisé pour l\'analyse et les requêtes complexes.',
    difficulty: 'Intermédiaire',
    topic: 'OLTP vs OLAP',
    points: 15
  },
  {
    id: 'bi_003',
    question: 'Qu\'est-ce qu\'un tableau de bord (dashboard) ?',
    options: [
      'Une base de données',
      'Une interface visuelle qui affiche des métriques clés',
      'Un algorithme d\'analyse',
      'Un type de rapport statique'
    ],
    correctAnswer: 1,
    explanation: 'Un tableau de bord est une interface visuelle qui présente les informations les plus importantes nécessaires pour atteindre des objectifs, consolidées sur un seul écran.',
    difficulty: 'Débutant',
    topic: 'Tableaux de bord',
    points: 10
  },
  {
    id: 'bi_004',
    question: 'Qu\'est-ce que l\'ETL ?',
    options: [
      'Extract, Transform, Load',
      'Evaluate, Test, Launch',
      'Export, Transfer, Link',
      'Execute, Track, Log'
    ],
    correctAnswer: 0,
    explanation: 'ETL signifie Extract (extraire les données), Transform (les transformer/nettoyer), et Load (les charger dans le système de destination).',
    difficulty: 'Intermédiaire',
    topic: 'ETL',
    points: 15
  },
  {
    id: 'bi_005',
    question: 'Quel outil n\'est PAS typiquement utilisé pour la Business Intelligence ?',
    options: ['Tableau', 'Power BI', 'QlikView', 'Photoshop'],
    correctAnswer: 3,
    explanation: 'Photoshop est un outil de retouche d\'images, pas un outil de Business Intelligence. Tableau, Power BI et QlikView sont des plateformes BI populaires.',
    difficulty: 'Débutant',
    topic: 'Outils BI',
    points: 10
  },
  {
    id: 'bi_006',
    question: 'Quelle différence entre un tableau de bord opérationnel et un tableau de bord stratégique ?',
    options: [
      'L\'opérationnel suit des processus à court terme, le stratégique des objectifs à long terme',
      'Le stratégique est toujours en temps réel, l\'opérationnel jamais',
      'Il n\'y a aucune différence',
      'L\'opérationnel est réservé à la direction générale'
    ],
    correctAnswer: 0,
    explanation: 'Un tableau de bord opérationnel surveille l\'activité courante (jour, heure) pour réagir vite ; un tableau de bord stratégique suit des indicateurs de long terme par rapport aux objectifs de l\'organisation, avec une mise à jour moins fréquente.',
    difficulty: 'Débutant',
    topic: 'Tableaux de bord',
    points: 10
  },
  {
    id: 'bi_007',
    question: 'Quelle est la différence entre un Data Warehouse et un Data Mart ?',
    options: [
      'Aucune différence',
      'Data Warehouse est plus grand et centralisé, Data Mart est spécialisé par domaine',
      'Data Mart est plus récent',
      'Data Warehouse est obsolète'
    ],
    correctAnswer: 1,
    explanation: 'Un Data Warehouse est un référentiel centralisé pour toute l\'organisation, tandis qu\'un Data Mart est un sous-ensemble spécialisé pour un domaine métier spécifique.',
    difficulty: 'Intermédiaire',
    topic: 'Architecture des données',
    points: 15
  },
  {
    id: 'bi_008',
    question: 'À quoi sert un diagramme en cascade (waterfall) ?',
    options: [
      'À montrer la corrélation entre deux variables',
      'À représenter la distribution d\'une variable continue',
      'À afficher des données géographiques',
      'À montrer comment des variations positives et négatives mènent d\'une valeur initiale à une valeur finale'
    ],
    correctAnswer: 3,
    explanation: 'Un diagramme en cascade décompose l\'écart entre deux valeurs (par exemple le résultat d\'une année à l\'autre) en contributions successives, positives ou négatives, ce qui le rend courant en finance et en reporting.',
    difficulty: 'Débutant',
    topic: 'Visualisation BI',
    points: 10
  },
  {
    id: 'bi_009',
    question: 'Qu\'est-ce que le Self-Service BI ?',
    options: [
      'BI automatique',
      'Capacité pour les utilisateurs métier de créer leurs propres analyses',
      'BI gratuite',
      'BI sans serveur'
    ],
    correctAnswer: 1,
    explanation: 'Le Self-Service BI permet aux utilisateurs métier de créer leurs propres rapports et analyses sans dépendre des équipes IT, favorisant l\'autonomie et la réactivité.',
    difficulty: 'Intermédiaire',
    topic: 'Self-Service BI',
    points: 15
  },
  {
    id: 'bi_010',
    question: 'Qu\'est-ce qu\'un modèle dimensionnel ?',
    options: [
      'Un modèle 3D',
      'Une structure de données avec tables de faits et dimensions',
      'Un algorithme de machine learning',
      'Un type de graphique'
    ],
    correctAnswer: 1,
    explanation: 'Un modèle dimensionnel organise les données en tables de faits (mesures) et tables de dimensions (contexte), optimisant les performances des requêtes analytiques.',
    difficulty: 'Avancé',
    topic: 'Modélisation des données',
    points: 20
  },
  {
    id: 'bi_011',
    question: 'Qu\'est-ce que l\'OLAP (Online Analytical Processing) ?',
    options: [
      'Un type de base de données',
      'Une technologie pour l\'analyse multidimensionnelle rapide',
      'Un langage de programmation',
      'Un protocole réseau'
    ],
    correctAnswer: 1,
    explanation: 'OLAP permet l\'analyse multidimensionnelle rapide des données, offrant des opérations comme le drill-down, roll-up, slice et dice pour explorer les données sous différents angles.',
    difficulty: 'Avancé',
    topic: 'OLAP',
    points: 20
  },
  {
    id: 'bi_012',
    question: 'Qu\'est-ce qu\'un cube OLAP ?',
    options: [
      'Un objet géométrique',
      'Une structure de données multidimensionnelle pour l\'analyse',
      'Un serveur de base de données',
      'Un type de graphique'
    ],
    correctAnswer: 1,
    explanation: 'Un cube OLAP est une structure de données multidimensionnelle qui permet d\'analyser les données selon plusieurs dimensions simultanément, facilitant l\'exploration analytique.',
    difficulty: 'Avancé',
    topic: 'OLAP',
    points: 20
  },
  {
    id: 'bi_013',
    question: 'Qu\'est-ce que le Data Mining dans le contexte BI ?',
    options: [
      'Extraction de données brutes',
      'Découverte de patterns et tendances cachés dans les données',
      'Suppression de données',
      'Sauvegarde de données'
    ],
    correctAnswer: 1,
    explanation: 'Le Data Mining utilise des techniques statistiques et d\'apprentissage automatique pour découvrir des patterns, tendances et relations cachés dans de gros volumes de données.',
    difficulty: 'Avancé',
    topic: 'Data Mining',
    points: 20
  },
  {
    id: 'bi_014',
    question: 'Qu\'est-ce qu\'un SLA (Service Level Agreement) en BI ?',
    options: [
      'Un type de rapport',
      'Un accord définissant les niveaux de service attendus',
      'Un algorithme de calcul',
      'Une base de données'
    ],
    correctAnswer: 1,
    explanation: 'Un SLA définit les niveaux de service attendus pour les systèmes BI, incluant la disponibilité, les temps de réponse, et la fraîcheur des données.',
    difficulty: 'Intermédiaire',
    topic: 'Gouvernance BI',
    points: 15
  },
  {
    id: 'bi_015',
    question: 'Qu\'est-ce que la Real-Time BI ?',
    options: [
      'BI traditionnelle',
      'Analyse et reporting des données en temps réel ou quasi-réel',
      'BI plus rapide',
      'BI automatisée'
    ],
    correctAnswer: 1,
    explanation: 'La Real-Time BI permet l\'analyse et le reporting des données en temps réel ou quasi-réel, permettant une prise de décision immédiate basée sur les données les plus récentes.',
    difficulty: 'Avancé',
    topic: 'BI temps réel',
    points: 20
  },
  {
    id: 'bi_016',
    question: 'Qu\'est-ce qu\'un Data Catalog ?',
    options: [
      'Une liste de données',
      'Un inventaire métadonnées facilitant la découverte et gouvernance des données',
      'Un type de base de données',
      'Un rapport automatisé'
    ],
    correctAnswer: 1,
    explanation: 'Un Data Catalog est un inventaire centralisé des métadonnées qui aide les utilisateurs à découvrir, comprendre et gouverner les actifs de données de l\'organisation.',
    difficulty: 'Avancé',
    topic: 'Gouvernance des données',
    points: 20
  },
  {
    id: 'bi_017',
    question: 'Qu\'est-ce que le ROI (Return on Investment) d\'un projet BI ?',
    options: [
      'Le coût du projet',
      'La mesure de la rentabilité et valeur générée par le projet BI',
      'Le temps de développement',
      'Le nombre d\'utilisateurs'
    ],
    correctAnswer: 1,
    explanation: 'Le ROI d\'un projet BI mesure la rentabilité en comparant les bénéfices générés (économies, revenus supplémentaires) aux coûts d\'investissement du projet.',
    difficulty: 'Intermédiaire',
    topic: 'ROI et valeur métier',
    points: 15
  },
  {
    id: 'bi_018',
    question: 'Qu\'est-ce que l\'Embedded BI ?',
    options: [
      'BI sur mobile',
      'Intégration de capacités BI directement dans les applications métier',
      'BI gratuite',
      'BI simplifiée'
    ],
    correctAnswer: 1,
    explanation: 'L\'Embedded BI intègre les capacités d\'analyse et de reporting directement dans les applications métier existantes, offrant une expérience utilisateur transparente.',
    difficulty: 'Avancé',
    topic: 'BI intégrée',
    points: 20
  },
  {
    id: 'bi_019',
    question: 'Qu\'est-ce que la Data Governance en BI ?',
    options: [
      'Stockage des données',
      'Ensemble de processus et politiques pour assurer qualité et sécurité des données',
      'Analyse des données',
      'Visualisation des données'
    ],
    correctAnswer: 1,
    explanation: 'La Data Governance établit les processus, politiques et responsabilités pour assurer la qualité, sécurité, conformité et utilisation appropriée des données dans l\'organisation.',
    difficulty: 'Avancé',
    topic: 'Gouvernance des données',
    points: 20
  },
  {
    id: 'bi_020',
    question: 'Qu\'est-ce que l\'Augmented Analytics ?',
    options: [
      'BI traditionnelle',
      'Utilisation de l\'IA et ML pour automatiser la préparation et découverte de données',
      'BI plus rapide',
      'BI sur le cloud'
    ],
    correctAnswer: 1,
    explanation: 'L\'Augmented Analytics utilise l\'intelligence artificielle et le machine learning pour automatiser la préparation des données, la découverte d\'insights et la génération de narratifs.',
    difficulty: 'Avancé',
    topic: 'IA et Analytics',
    points: 20
  }
];

/**
 * Quiz Categories Data
 */
export const quizCategories: QuizCategory[] = [
  {
    id: 'programming',
    title: 'Programmation',
    description: 'Python, Pandas, NumPy et outils de développement pour la data science',
    icon: 'Code',
    color: 'green',
    difficulty: 'Débutant',
    estimatedTime: 15,
    topics: ['Python', 'Pandas', 'NumPy', 'Jupyter'],
    questions: programmingQuestions
  },
  {
    id: 'math-stats',
    title: 'Mathématiques & Statistiques',
    description: 'Statistiques descriptives, probabilités, tests d\'hypothèse et concepts mathématiques',
    icon: 'Calculator',
    color: 'blue',
    difficulty: 'Intermédiaire',
    estimatedTime: 20,
    topics: ['Statistiques', 'Probabilités', 'Tests', 'Distribution'],
    questions: mathStatsQuestions
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Algorithmes d\'apprentissage automatique, évaluation de modèles et techniques avancées',
    icon: 'Brain',
    color: 'purple',
    difficulty: 'Avancé',
    estimatedTime: 25,
    topics: ['Algorithmes', 'Évaluation', 'Validation', 'Optimisation'],
    questions: machineLearningQuestions
  },
  {
    id: 'data-visualization',
    title: 'Visualisation de Données',
    description: 'Création de graphiques efficaces, outils de visualisation et principes de design',
    icon: 'BarChart3',
    color: 'teal',
    difficulty: 'Intermédiaire',
    estimatedTime: 15,
    topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Design'],
    questions: dataVizQuestions
  },
  {
    id: 'data-preparation',
    title: 'Préparation des Données',
    description: 'Nettoyage, transformation et préparation des données pour l\'analyse',
    icon: 'Database',
    color: 'orange',
    difficulty: 'Intermédiaire',
    estimatedTime: 18,
    topics: ['Nettoyage', 'Transformation', 'Qualité', 'ETL'],
    questions: dataPreparationQuestions
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Réseaux de neurones, architectures profondes et applications avancées',
    icon: 'Zap',
    color: 'red',
    difficulty: 'Avancé',
    estimatedTime: 30,
    topics: ['Réseaux de neurones', 'CNN', 'RNN', 'Optimisation'],
    questions: deepLearningQuestions
  },
  {
    id: 'big-data',
    title: 'Big Data',
    description: 'Technologies et concepts pour traiter de gros volumes de données',
    icon: 'Server',
    color: 'indigo',
    difficulty: 'Avancé',
    estimatedTime: 22,
    topics: ['Hadoop', 'Spark', 'NoSQL', 'Architecture'],
    questions: bigDataQuestions
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    description: 'Analyse business, KPI, tableaux de bord et prise de décision data-driven',
    icon: 'TrendingUp',
    color: 'yellow',
    difficulty: 'Intermédiaire',
    estimatedTime: 16,
    topics: ['KPI', 'Dashboards', 'OLAP', 'Reporting'],
    questions: businessIntelligenceQuestions
  }
];

/**
 * Get quiz category by ID
 */
export const getQuizCategoryById = (id: string): QuizCategory | undefined => {
  return quizCategories.find(category => category.id === id);
};

/**
 * Get random questions from a category
 */
export const getRandomQuestions = (categoryId: string, count: number): QuizQuestion[] => {
  const category = getQuizCategoryById(categoryId);
  if (!category) return [];
  
  // Questions tirées au sort (Fisher-Yates) puis options mélangées : la bonne réponse change de place
  const shuffled = shuffle(category.questions);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((question) => shuffleOptions(question));
};

/**
 * Get quiz statistics
 */
export const getQuizStats = () => {
  const totalCategories = quizCategories.length;
  const totalQuestions = quizCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const totalTime = quizCategories.reduce((sum, cat) => sum + cat.estimatedTime, 0);
  const avgProgress = 0; // This would come from user data
  
  return {
    totalCategories,
    totalQuestions,
    totalTime,
    avgProgress
  };
};