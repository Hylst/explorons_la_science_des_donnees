/**
 * Fundamental Data Science Concepts
 * Core concepts that form the foundation of data science
 */

import { GlossaryEntry } from './types';

export const fundamentalsTerms: GlossaryEntry[] = [
  {
    term: "Data Science",
    description: "La Science des Données est un domaine interdisciplinaire qui combine les statistiques, l'informatique (notamment le Machine Learning), et l'expertise métier pour extraire des connaissances et des insights exploitables à partir de données. Imaginez un détective moderne : au lieu d'indices physiques, il analyse des montagnes de données (structurées comme des tableaux Excel, ou non structurées comme des textes, images, vidéos) pour découvrir des schémas cachés, prédire des événements futurs et aider à la prise de décision. C'est un mélange d'art et de science, où l'on pose les bonnes questions, collecte les bonnes données, les nettoie, les analyse avec des outils sophistiqués, et communique les découvertes de manière claire.",
    category: "fondamentaux",
    icon: "BookOpen"
  },
  {
    term: "Intelligence Artificielle (IA)",
    description: "L'Intelligence Artificielle (IA) est une branche de l'informatique qui cherche à créer des systèmes informatiques capables de réaliser des tâches qui nécessitent normalement l'intelligence humaine. Pensez à l'IA comme à un apprenti très doué qui observe comment les humains résolvent des problèmes, puis développe ses propres méthodes pour les résoudre de manière autonome. Contrairement à un programme traditionnel qui suit des instructions précises, l'IA apprend à partir d'exemples et s'améliore avec l'expérience. L'IA englobe plusieurs domaines : l'apprentissage automatique (Machine Learning) pour reconnaître des patterns, le traitement du langage naturel (NLP) pour comprendre et générer du texte, la vision par ordinateur pour analyser des images, et la robotique pour interagir avec le monde physique.",
    category: "fondamentaux",
    icon: "Brain"
  },
  {
    term: "Big Data",
    description: "Le Big Data désigne des ensembles de données si massifs, complexes et dynamiques qu'ils dépassent les capacités des outils traditionnels de gestion de bases de données et d'analyse. Avec l'explosion d'Internet, des réseaux sociaux, de l'IoT, nous générons aujourd'hui plus de données en 2 jours que l'humanité n'en a créé depuis ses débuts jusqu'en 2003. Le Big Data est caractérisé par les 5V : Volume (quantité massive), Vélocité (vitesse de génération), Variété (diversité des formats), Véracité (qualité des données), et Valeur (capacité à extraire des insights exploitables). Imaginez le Big Data comme l'océan : il est immense (Volume), les vagues arrivent sans cesse (Vélocité), il contient des éléments très divers (Variété), mais l'eau peut être plus ou moins pure (Véracité), et il faut savoir où chercher pour trouver des trésors (Valeur).",
    category: "fondamentaux",
    icon: "Database"
  },
  {
    term: "Algorithme",
    description: "Un Algorithme est une séquence logique et ordonnée d'instructions précises qui permet de résoudre un problème spécifique ou d'accomplir une tâche donnée de manière systématique et reproductible. Le terme vient du mathématicien persan Al-Khwarizmi (IXe siècle). Un algorithme est comme une recette de cuisine détaillée : les ingrédients sont les données d'entrée, les instructions étape par étape sont la séquence d'opérations, et le plat final est le résultat. En data science, les algorithmes transforment les données en insights exploitables, allant des algorithmes de tri simples aux réseaux de neurones complexes. Ils sont caractérisés par leur finitude, précision, efficacité et généralité.",
    category: "fondamentaux",
    icon: "Code"
  },
  {
    term: "Dataset (Jeu de données)",
    description: "Un Dataset (ou Jeu de données) est une collection organisée et structurée d'informations qui constitue la matière première fondamentale de toute analyse de données, projet de machine learning, ou recherche scientifique. Un dataset est comme une bibliothèque bien organisée : les livres sont les observations/enregistrements (lignes), les chapitres sont les variables/attributs (colonnes), le système de classification est la structure et métadonnées, et le catalogue est la documentation. Chaque ligne représente une entité ou un événement unique, chaque colonne représente une caractéristique mesurée. Les variables peuvent être quantitatives (continues ou discrètes), qualitatives (nominales ou ordinales), ou temporelles.",
    category: "fondamentaux",
    icon: "Database"
  },
  {
    term: "Modèle",
    description: "Un Modèle en data science est une représentation mathématique et conceptuelle simplifiée d'un processus, système ou phénomène réel, conçue pour comprendre, expliquer, simuler ou prédire des comportements à partir de données. Imaginez un modèle comme une maquette d'architecte : elle ne capture pas tous les détails du bâtiment final, mais elle représente les éléments essentiels pour comprendre sa structure et son fonctionnement. Un modèle transforme des données d'entrée (variables indépendantes) en prédictions ou classifications (variables dépendantes) en apprenant des patterns dans les données d'entraînement. Les modèles peuvent être simples (régression linéaire) ou complexes (réseaux de neurones profonds), supervisés (avec des exemples étiquetés) ou non supervisés (découverte de patterns cachés). La qualité d'un modèle se mesure par sa capacité à généraliser sur de nouvelles données non vues pendant l'entraînement, évitant le surapprentissage (overfitting) et le sous-apprentissage (underfitting).",
    category: "fondamentaux",
    icon: "Box"
  },
  {
    term: "Données structurées vs non structurées",
    description: "Cette distinction fondamentale classe les données selon leur niveau d'organisation et de formatage. Les Données Structurées sont organisées dans un format rigide et prédéfini, comme des tableaux avec lignes et colonnes (bases de données relationnelles, fichiers CSV, feuilles Excel). Elles sont facilement analysables par des algorithmes traditionnels et ne forment qu'une minorité des données produites. Exemples : transactions bancaires, inventaires, données de capteurs IoT. Les Données Non Structurées n'ont pas de format prédéfini et forment la plus grande part des données produites (les estimations souvent citées, de l'ordre de 80 % ou plus, sont des ordres de grandeur, non des mesures). Elles incluent le texte libre (emails, documents, réseaux sociaux), les médias (images, vidéos, audio), les logs serveur, et les données de géolocalisation. Entre les deux existent les Données Semi-Structurées (JSON, XML, logs formatés) qui ont une structure flexible. L'analogie de la bibliothèque : les données structurées sont comme des livres classés par système décimal Dewey (place fixe, facilement trouvables), tandis que les données non structurées sont comme des documents éparpillés dans des boîtes (contenu riche mais difficile à organiser). Le défi moderne est d'extraire de la valeur des données non structurées grâce au NLP, à la vision par ordinateur, et aux techniques de deep learning.",
    category: "fondamentaux",
    icon: "FileText"
  },
  {
    term: "Analyse exploratoire des données (EDA)",
    description: "L'Analyse Exploratoire des Données (EDA) est une approche investigative fondamentale qui consiste à examiner, visualiser et résumer un dataset pour en comprendre les caractéristiques principales avant d'appliquer des techniques de modélisation formelles. Popularisée par le statisticien John Tukey dans les années 1970, l'EDA est comme une enquête policière : on examine les preuves (données) sous tous les angles pour découvrir des indices cachés. L'EDA comprend l'analyse univariée (distribution de chaque variable), bivariée (relations entre paires de variables), et multivariée (interactions complexes). Les techniques incluent les statistiques descriptives (moyenne, médiane, écart-type), les visualisations (histogrammes, boxplots, scatter plots, heatmaps), la détection d'outliers, l'analyse de corrélations, et l'identification de patterns temporels ou géographiques. L'EDA révèle la qualité des données (valeurs manquantes, incohérences), guide le preprocessing (nettoyage, transformation), inspire la feature engineering, et oriente le choix des algorithmes de machine learning. C'est une phase créative où l'intuition du data scientist, combinée aux outils statistiques, permet de formuler des hypothèses et de découvrir des insights inattendus qui peuvent transformer la compréhension d'un problème business.",
    category: "fondamentaux",
    icon: "Search"
  },
  {
    term: "Visualisation de données",
    description: "La Visualisation de données (DataViz) est l'art et la science de représenter l'information de manière graphique pour faciliter la compréhension, l'analyse et la communication d'insights complexes. Basée sur le principe que 'une image vaut mille mots', elle exploite les capacités naturelles du cerveau humain à traiter l'information visuelle (nous traitons les images 60 000 fois plus vite que le texte). La visualisation transforme des données abstraites en représentations visuelles intuitives : graphiques en barres pour les comparaisons, courbes pour les tendances temporelles, scatter plots pour les corrélations, heatmaps pour les matrices, cartes pour les données géographiques, et dashboards interactifs pour le monitoring en temps réel. Elle suit des principes de design : clarté (message principal évident), précision (représentation fidèle des données), efficacité (ratio information/encre optimal selon Edward Tufte), et esthétique (engagement visuel). Les outils vont des solutions simples (Excel, Google Sheets) aux plateformes avancées (Tableau, Power BI, D3.js, Python/matplotlib/seaborn). La visualisation sert trois objectifs : l'exploration (découvrir des patterns pendant l'EDA), l'analyse (confirmer des hypothèses), et la communication (présenter des résultats à des audiences non techniques). Une bonne visualisation raconte une histoire avec les données, guide l'œil vers les insights importants, et permet la prise de décision éclairée.",
    category: "fondamentaux",
    icon: "BarChart3"
  },
  {
    term: "Corrélation vs Causalité",
    description: "Cette distinction fondamentale est l'un des concepts les plus importants en data science et statistiques. La Corrélation mesure la force et la direction d'une relation statistique entre deux variables (coefficient de -1 à +1), indiquant qu'elles varient ensemble de manière prévisible. La Causalité établit qu'une variable (cause) influence directement et provoque des changements dans une autre variable (effet). Le principe 'Corrélation n'implique pas causalité' met en garde contre l'erreur logique de déduire une relation de cause à effet à partir d'une simple association statistique. Exemples classiques : les ventes de glaces et les noyades sont corrélées (augmentent ensemble en été) mais l'une ne cause pas l'autre - c'est la température qui influence les deux. Les ventes de margarine et le taux de divorce au Maine étaient corrélées sur 10 ans, pure coïncidence statistique. Pour établir la causalité, il faut : une corrélation significative, un ordre temporel (cause précède effet), éliminer les variables confondantes (facteurs cachés), et idéalement des expériences contrôlées ou des quasi-expériences. Les méthodes incluent les essais randomisés contrôlés (gold standard), l'inférence causale (variables instrumentales, discontinuité de régression), et l'analyse contrefactuelle. Cette distinction est cruciale pour éviter les décisions business erronées basées sur des corrélations trompeuses et pour construire des modèles prédictifs robustes.",
    category: "fondamentaux",
    icon: "GitBranch"
  }
];