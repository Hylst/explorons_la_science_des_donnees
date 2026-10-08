/**
 * Machine Learning Algorithms and Concepts
 * Core ML algorithms, techniques, and methodologies
 */

import { GlossaryEntry } from './types';

export const machineLearningTerms: GlossaryEntry[] = [
  {
    term: "Machine Learning",
    description: `Le machine learning (apprentissage automatique) regroupe les méthodes qui permettent à un programme d'améliorer ses performances sur une tâche à partir de données, plutôt que par des règles écrites à la main. Définition classique de Tom Mitchell (1997) : un programme apprend d'une expérience E pour une tâche T et une mesure de performance P si sa performance sur T, mesurée par P, s'améliore avec E.

**Principe :** au lieu de programmer « si ceci, alors cela », on fournit des exemples et un algorithme ajuste les paramètres d'un modèle pour qu'il généralise à des cas nouveaux.

**Grands types :**
• Supervisé : exemples étiquetés (entrée, sortie attendue) ; classification et régression.
• Non supervisé : données sans étiquette ; clustering, réduction de dimension, détection d'anomalies.
• Par renforcement : un agent apprend par essais, guidé par des récompenses.
• Semi-supervisé et auto-supervisé : peu d'étiquettes, ou étiquettes déduites des données elles-mêmes.

**Démarche usuelle :** formuler le problème, collecter et préparer les données, séparer entraînement, validation et test, choisir un modèle et une métrique, entraîner, évaluer, déployer et surveiller. Exemples : filtre anti-spam, prévision de la demande, recommandation.

**Limites :**
• La qualité des données conditionne celle du modèle : des données biaisées donnent des résultats biaisés.
• Un modèle bon sur le passé peut échouer si le contexte change.
• Une corrélation apprise n'est pas une cause.
• Le risque central est le surapprentissage : évaluer sur des données que le modèle n'a pas vues.`,
    category: "machine-learning",
    icon: "Cpu"
  },
  {
    term: "Classification",
    description: `La classification est une tâche d'apprentissage supervisé qui consiste à prédire la catégorie (la classe) d'une observation à partir de ses caractéristiques.

**Types :**
• Binaire : deux classes (spam ou non).
• Multiclasse : une classe parmi plusieurs (chien, chat, oiseau).
• Multi-étiquette : plusieurs étiquettes possibles à la fois (les thèmes d'un article).

**Principe :** le modèle apprend, sur des exemples étiquetés, une frontière de décision. Beaucoup de classifieurs produisent d'abord un score ou une probabilité par classe ; un seuil (0,5 par défaut en binaire) donne la classe. Ce seuil se règle selon le coût des erreurs.

**Algorithmes courants :** régression logistique, k plus proches voisins, arbres de décision, forêts aléatoires, boosting de gradient, SVM, Naive Bayes, réseaux de neurones.

**Évaluation :** matrice de confusion, exactitude, précision, rappel, F1, AUC. Le choix dépend du coût des erreurs et des proportions de classes.

**Défis :**
• Classes déséquilibrées : l'exactitude trompe ; rééchantillonnage, poids de classe, métriques adaptées.
• Frontières complexes : modèles non linéaires.
• Interprétabilité : arbres et modèles linéaires sont plus lisibles.
• Probabilités mal calibrées : les calibrer si on les utilise comme telles.

**À ne pas confondre :** la régression prédit une valeur numérique, la classification une catégorie, le clustering regroupe sans classes connues.`,
    category: "machine-learning",
    icon: "Target"
  },
  {
    term: "Apprentissage Supervisé",
    description: `L'apprentissage supervisé entraîne un modèle à partir d'exemples dont la réponse attendue est connue (les étiquettes), afin de prédire la réponse pour de nouvelles entrées.

**Principe :** à partir de paires (x, y), on cherche une fonction f telle que f(x) soit proche de y, en minimisant une fonction de perte sur les données d'entraînement. Le but réel est la généralisation : bien prédire sur des données jamais vues.

**Deux familles :**
• Classification : y est une catégorie.
• Régression : y est une valeur numérique.

**Démarche :** séparer entraînement, validation et test ; choisir le modèle et les hyperparamètres avec la validation ; mesurer la performance finale sur le test.

**Avantages :** objectif clair, métriques d'évaluation bien définies, large choix d'algorithmes.

**Limites :**
• Les étiquettes coûtent cher à produire (expertise, temps) et peuvent être bruitées ou subjectives.
• Les biais présents dans les étiquettes se retrouvent dans le modèle.
• Le surapprentissage guette quand les données sont peu nombreuses.
• Le modèle ne prédit bien que ce qui ressemble à ses données d'entraînement.

**Exemples :** prédire le prix d'un logement, détecter un courriel indésirable, reconnaître des chiffres manuscrits.

**Variantes proches :** apprentissage semi-supervisé (peu d'étiquettes), auto-supervisé (étiquettes déduites des données) et faiblement supervisé (étiquettes approximatives).`,
    category: "machine-learning",
    icon: "Users"
  },
  {
    term: "Apprentissage Non Supervisé",
    description: `L'apprentissage non supervisé cherche des structures dans des données sans étiquette : groupes, axes principaux de variation, observations atypiques.

**Principales tâches :**
• Clustering : regrouper des observations similaires (k-means, hiérarchique, DBSCAN).
• Réduction de dimension : résumer les variables en moins de dimensions (ACP, t-SNE, UMAP, autoencodeurs).
• Détection d'anomalies : repérer ce qui s'écarte de la norme.
• Estimation de densité et règles d'association (paniers d'achats).

**Exemples :** segmenter des clients, visualiser des données de grande dimension, compresser des images, repérer des transactions inhabituelles.

**Avantages :** pas besoin d'étiquettes, exploration de données inconnues, utile en prétraitement.

**Difficultés :**
• Pas de bonne réponse connue : l'évaluation est plus subjective. On s'appuie sur des critères internes (silhouette), des vérifications sur des cas connus et l'avis d'experts.
• Les résultats dépendent des choix : distance, nombre de groupes, échelle des variables.
• Un groupe trouvé n'est pas forcément utile ni réel.

**Différence avec le supervisé :** aucune variable cible n'est donnée ; on ne sait pas à l'avance ce que l'on cherche.

**En pratique :** mettre les variables à l'échelle, essayer plusieurs réglages, vérifier la stabilité des groupes et les interpréter avec des spécialistes du domaine.`,
    category: "machine-learning",
    icon: "Search"
  },
  {
    term: "Clustering",
    description: `Le clustering (partitionnement) regroupe des observations en clusters de sorte que les éléments d'un même groupe se ressemblent plus entre eux qu'avec ceux des autres groupes. C'est une tâche non supervisée.

**Familles :**
• Partitionnement : k-means, k-medoids (nombre de groupes fixé à l'avance).
• Hiérarchique : arbre de fusions ou de divisions (agglomératif, divisif).
• Densité : DBSCAN, OPTICS (groupes de forme quelconque, points isolés).
• Modèles de mélange : mélanges de gaussiennes (appartenance probabiliste).

**Notion de ressemblance :** une distance (euclidienne, Manhattan) ou une similarité (cosinus, Jaccard). Mettre les variables à l'échelle auparavant, sinon une variable de grande amplitude domine la distance.

**Évaluation :** il n'existe en général pas de partition « vraie ». Critères internes (silhouette, inertie, Davies-Bouldin), externes si des étiquettes existent (indice de Rand ajusté), stabilité aux rééchantillonnages, utilité pour la décision.

**Défis :**
• Choisir le nombre de groupes.
• Sensibilité aux valeurs aberrantes et à l'échelle.
• Groupes de formes, tailles ou densités différentes.
• Dimension élevée : les distances perdent de leur sens.

**Usages :** segmentation de clientèle, regroupement de documents, compression d'images, détection d'anomalies, exploration de données.`,
    category: "machine-learning",
    icon: "Layers"
  },
  {
    term: "Overfitting (Surapprentissage)",
    description: `Le surapprentissage (overfitting) se produit quand un modèle s'ajuste si bien aux données d'entraînement, bruit compris, qu'il généralise mal à de nouvelles données.

**Symptôme :** un grand écart entre le score d'entraînement (très bon) et le score de validation ou de test (nettement plus faible). Colonnes ci-dessous : profondeur de l'arbre, score d'entraînement, score de test.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_ent, X_test, y_ent, y_test = train_test_split(X, y, random_state=0)
for profondeur in [None, 3]:
    arbre = DecisionTreeClassifier(max_depth=profondeur, random_state=0).fit(X_ent, y_ent)
    print(profondeur, round(arbre.score(X_ent, y_ent), 3), round(arbre.score(X_test, y_test), 3))
# Affichage :
# None 1.0 0.881
# 3 0.977 0.937
\`\`\`
L'arbre non limité apprend l'entraînement par cœur (1,0) mais chute sur le test ; limité à une profondeur de 3, il perd un peu à l'entraînement et gagne en test.

**Causes :**
• Modèle trop complexe pour la quantité de données.
• Peu de données, ou données bruitées.
• Entraînement trop long (réseaux de neurones).
• Trop de variables candidates, ou fuite de données qui donne l'illusion d'un bon score.

**Remèdes :**
• Plus de données, augmentation de données.
• Modèle plus simple (profondeur d'arbre, nombre de neurones).
• Régularisation : pénalité L2 (somme des carrés des coefficients) ou L1 (somme des valeurs absolues, qui annule certains coefficients), dropout.
• Arrêt précoce (early stopping), élagage d'arbres, méthodes d'ensemble (bagging).

**Détection :** jeu de validation séparé, validation croisée, courbe d'apprentissage. La validation croisée détecte le surapprentissage mais ne le corrige pas.

**À l'opposé :** le sous-apprentissage. L'équilibre entre les deux est le compromis biais-variance.`,
    category: "machine-learning",
    icon: "AlertTriangle"
  },
  {
    term: "Underfitting (Sous-apprentissage)",
    description: `Le sous-apprentissage (underfitting) se produit quand un modèle est trop simple pour capturer la structure des données : il se trompe déjà sur les données d'entraînement.

**Symptôme :** scores d'entraînement et de validation tous deux médiocres et proches l'un de l'autre. Les résidus montrent une structure visible (courbe, tendance).
\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

x = np.linspace(0, 6, 50).reshape(-1, 1)
y = np.sin(x).ravel()                       # relation non linéaire
modele = LinearRegression().fit(x, y)
print(round(modele.score(x, y), 2))         # R² sur les données d'entraînement
# Affichage :
# 0.64
\`\`\`
Une droite ajustée sur une sinusoïde n'explique que 64 % de la variance, même sur les données qui ont servi à l'ajuster.

**Causes :**
• Modèle trop simple (relation non linéaire modélisée par une droite).
• Variables insuffisantes ou mal choisies.
• Régularisation trop forte.
• Entraînement trop court (réseaux de neurones) ou hyperparamètres trop contraignants (arbre trop peu profond).

**Remèdes :**
• Modèle plus expressif : polynômes, arbres plus profonds, réseau plus grand.
• Nouvelles variables (interactions, transformations).
• Réduire la régularisation.
• Entraîner plus longtemps, ajuster le pas d'apprentissage.

**Diagnostic :** des courbes d'apprentissage qui plafonnent à un score faible indiquent qu'ajouter des données n'aidera pas : il faut changer de modèle ou de variables.

**À l'opposé :** le surapprentissage. On part souvent d'un modèle simple (référence), puis on le complexifie jusqu'à ce que le score de validation cesse de progresser (voir Biais-Variance Tradeoff).`,
    category: "machine-learning",
    icon: "TrendingDown"
  },
  {
    term: "Random Forest",
    description: `Une forêt aléatoire (Random Forest, Breiman, 2001) est un ensemble de nombreux arbres de décision entraînés sur des variantes des données, dont les prédictions sont agrégées : vote majoritaire en classification, moyenne en régression.

**Deux sources d'aléa :**
• Bagging : chaque arbre est entraîné sur un échantillon bootstrap (tirage avec remise) des observations.
• Sous-ensemble de variables : à chaque nœud, seul un sous-ensemble aléatoire de variables est examiné pour la coupure (max_features), ce qui décorrèle les arbres.

Moyenner des arbres peu corrélés réduit fortement la variance sans augmenter beaucoup le biais.

**Estimation hors sac (OOB) :** environ 37 % des observations ne figurent pas dans l'échantillon d'un arbre donné ; leur prédiction par les arbres qui ne les ont pas vues donne une estimation de la performance sans jeu de validation séparé.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier

X, y = load_breast_cancer(return_X_y=True)
foret = RandomForestClassifier(n_estimators=200, oob_score=True, random_state=0).fit(X, y)
print(round(foret.oob_score_, 3))   # exactitude estimée sur les observations « hors sac »
# Affichage :
# 0.965
\`\`\`

**Hyperparamètres principaux :** n_estimators (plus d'arbres est rarement nuisible, avec un coût de calcul croissant), max_depth, min_samples_leaf, max_features.

**Atouts :** bonne performance sans réglage poussé, peu sensible à l'échelle des variables, relations non linéaires et interactions gérées, parallélisable.

**Limites :**
• Moins interprétable qu'un arbre seul. L'importance par impureté favorise les variables à nombreuses valeurs : préférer l'importance par permutation.
• Modèle volumineux (mémoire, temps de prédiction).
• En régression, pas d'extrapolation hors de la plage des valeurs vues.`,
    category: "machine-learning",
    icon: "TreePine"
  },
  {
    term: "Support Vector Machine (SVM)",
    description: `Une machine à vecteurs de support (SVM, Cortes et Vapnik, 1995) sépare deux classes par l'hyperplan de marge maximale : la frontière qui laisse le plus grand écart entre elle et les points les plus proches de chaque classe, les vecteurs de support.

**Principe :**
• Marge dure si les classes sont séparables, marge souple sinon. Le paramètre C arbitre entre une marge large et peu d'erreurs de classement : C petit tolère plus d'erreurs, C grand en tolère peu et risque le surapprentissage.
• Astuce du noyau (kernel trick) : un noyau calcule des produits scalaires dans un espace de dimension supérieure sans y aller explicitement, ce qui donne des frontières non linéaires. Noyaux courants : linéaire, polynomial, RBF avec son paramètre gamma (grand : influence locale, risque de surapprentissage).
• Seuls les vecteurs de support définissent la frontière.

**Sensible à l'échelle des variables :** normaliser est indispensable.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_breast_cancer(return_X_y=True)
print(cross_val_score(SVC(), X, y, cv=5).mean().round(3))
print(cross_val_score(make_pipeline(StandardScaler(), SVC()), X, y, cv=5).mean().round(3))
# Affichage :
# 0.912
# 0.974
\`\`\`
L'exactitude estimée passe de 0,912 sans normalisation à 0,974 avec.

**Atouts :** efficace en grande dimension, frontières non linéaires possibles, bon sur des jeux de taille petite à moyenne.

**Limites :**
• Le temps d'entraînement croît plus vite que le carré du nombre d'exemples : peu adapté aux très gros jeux.
• Pas de probabilités directes (probability=True ajoute un étalonnage de Platt, plus lent).
• Choix du noyau, de C et de gamma par validation croisée.
• Moins lisible qu'un arbre ou qu'un modèle linéaire.`,
    category: "machine-learning",
    icon: "Divide"
  },
  {
    term: "Hyperparameter Tuning",
    description: `Le réglage des hyperparamètres consiste à choisir les paramètres de configuration d'un algorithme, fixés avant l'entraînement et non appris à partir des données : profondeur d'un arbre, pas d'apprentissage, force de régularisation.

**Paramètres et hyperparamètres :** les paramètres (coefficients, poids) sont appris pendant l'entraînement ; les hyperparamètres sont choisis par l'utilisateur et contrôlent l'apprentissage.

**Méthodes de recherche :**
• Grid search : toutes les combinaisons d'une grille ; exhaustive mais coûteuse.
• Random search : combinaisons tirées au hasard ; souvent plus efficace à budget égal, car quelques hyperparamètres comptent beaucoup (Bergstra et Bengio, 2012).
• Optimisation bayésienne : un modèle de la performance guide les essais suivants.
• Successive halving et Hyperband : abandonnent tôt les configurations peu prometteuses.
\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

X, y = load_iris(return_X_y=True)
grille = {"C": [0.1, 1, 10], "gamma": [0.01, 0.1, 1]}
recherche = GridSearchCV(SVC(), grille, cv=5).fit(X, y)
print(recherche.best_params_, round(recherche.best_score_, 3))
# Affichage :
# {'C': 1, 'gamma': 0.1} 0.98
\`\`\`

**Démarche :** définir l'espace de recherche (souvent en échelle logarithmique pour C, alpha ou le pas d'apprentissage), évaluer chaque configuration par validation croisée, retenir la meilleure.

**Pièges :**
• Plus on essaie de combinaisons, plus le meilleur score est optimiste : garder un jeu de test final, ou utiliser une validation croisée imbriquée.
• Les étapes apprises (normalisation...) doivent être dans le Pipeline, pour éviter une fuite de données.
• Coût : paralléliser, chercher grossièrement puis finement.

**En pratique :** partir des réglages par défaut, repérer les hyperparamètres influents avec les courbes de validation, puis affiner. Un réglage fin apporte souvent moins que de meilleures données ou de meilleures variables.`,
    category: "machine-learning",
    icon: "Settings"
  },
  {
    term: "Ensemble Methods",
    description: `Les méthodes d'ensemble combinent les prédictions de plusieurs modèles pour obtenir un modèle plus précis ou plus stable que chacun d'eux.

**Pourquoi ça marche :** si les modèles font des erreurs en partie différentes, leur combinaison les compense. Il faut des modèles raisonnablement bons et diversifiés.

**Trois stratégies :**
• Bagging (Breiman, 1996) : modèles entraînés en parallèle sur des échantillons bootstrap, prédictions moyennées ou votées. Réduit surtout la variance. Exemple : la forêt aléatoire.
• Boosting : modèles entraînés l'un après l'autre, chacun se concentrant sur les erreurs des précédents (AdaBoost, Freund et Schapire, 1997 ; boosting de gradient). Réduit surtout le biais.
• Stacking (Wolpert, 1992) : un méta-modèle apprend à combiner les prédictions de modèles de natures différentes.

Le vote simple (VotingClassifier) en est la forme la plus élémentaire.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
for modele in [DecisionTreeClassifier(random_state=0), RandomForestClassifier(random_state=0), GradientBoostingClassifier(random_state=0)]:
    print(type(modele).__name__, cross_val_score(modele, X, y, cv=5).mean().round(3))
# Affichage :
# DecisionTreeClassifier 0.917
# RandomForestClassifier 0.963
# GradientBoostingClassifier 0.963
\`\`\`
Exactitude moyenne en validation croisée : un arbre seul fait moins bien que les deux ensembles.

**Atouts :** meilleure généralisation, robustesse, souvent parmi les meilleures méthodes sur données tabulaires.

**Limites :**
• Coût de calcul et de mémoire, prédiction plus lente.
• Interprétabilité réduite (on garde l'importance des variables et SHAP).
• Le stacking demande une validation soignée : le méta-modèle doit être entraîné sur des prédictions hors échantillon, sinon il y a fuite de données.
• Gain limité si les modèles se ressemblent trop.`,
    category: "machine-learning",
    icon: "Layers"
  },
  {
    term: "Explainable AI (XAI)",
    description: `L'IA explicable (XAI) regroupe les méthodes qui rendent compréhensibles les décisions d'un modèle, en particulier quand c'est une « boîte noire » comme un réseau profond ou un ensemble d'arbres.

**Pourquoi expliquer :** vérifier que le modèle s'appuie sur des raisons valables, déboguer, détecter des biais, informer les personnes concernées, répondre à des exigences réglementaires (RGPD, règlement européen sur l'IA) et gagner la confiance des utilisateurs.

**Deux approches :**
• Modèles interprétables par construction : régression linéaire ou logistique, arbres de faible profondeur, règles.
• Explications a posteriori d'un modèle opaque : importance par permutation, dépendance partielle, LIME (explication locale), SHAP (contributions de Shapley), contrefactuels (« quel changement minimal inverserait la décision ? »).

**Portée :** explication globale (comportement général) ou locale (une prédiction).

**Limites :**
• Une explication approche le modèle sans le reproduire : elle peut être instable ou trompeuse.
• Les variables corrélées compliquent l'attribution.
• Les cartes d'attention ou de saillance ne prouvent pas que le modèle « raisonne » ainsi.
• Une explication plausible peut donner une confiance injustifiée.
• Le compromis entre performance et interprétabilité n'est pas systématique : sur des données tabulaires, un modèle simple égale parfois un modèle complexe.

**En pratique :** prendre un modèle simple pour référence, tester les explications (cohérence, stabilité) et les confronter à l'avis d'experts du domaine.`,
    category: "machine-learning",
    icon: "Lightbulb"
  },
  {
    term: "Reinforcement Learning",
    description: `L'apprentissage par renforcement regroupe les méthodes où un agent apprend à agir dans un environnement par essais et erreurs, en cherchant à maximiser la somme des récompenses reçues.

**Éléments :**
• Agent, environnement, états, actions.
• Récompense : signal numérique reçu après chaque action.
• Politique π(s) : la façon dont l'agent choisit son action selon l'état.
• Fonction de valeur : récompense cumulée attendue (actualisée par un facteur γ entre 0 et 1) à partir d'un état ou d'un couple état-action.

**Exemple :** le Q-learning met à jour Q(s, a) ← Q(s, a) + α [r + γ max Q(s', a') − Q(s, a)]. Dans un couloir de 5 cases dont la dernière rapporte 1 (α = 0,5, γ = 0,9, exploration ε = 0,3), l'agent apprend à aller à droite, et les valeurs sont multipliées par γ à chaque case en s'éloignant de la sortie.
\`\`\`python
import numpy as np

rng = np.random.default_rng(0)
Q = np.zeros((5, 2))                  # 5 cases ; actions : 0 = gauche, 1 = droite
for episode in range(200):
    s = 0
    while s != 4:                     # la case 4 rapporte 1
        a = rng.integers(2) if rng.random() < 0.3 else Q[s].argmax()
        s2 = min(s + 1, 4) if a else max(s - 1, 0)
        r = float(s2 == 4)
        Q[s, a] += 0.5 * (r + 0.9 * Q[s2].max() - Q[s, a])
        s = s2
print(Q[:4].argmax(axis=1), Q[:4, 1].round(2))
# Affichage :
# [1 1 1 1] [0.73 0.81 0.9  1.  ]
\`\`\`

**Familles d'algorithmes :**
• Fondés sur les valeurs : Q-learning, DQN (Mnih et al., 2015, jeux Atari).
• Fondés sur la politique : gradient de politique, PPO ; acteur-critique, qui combine les deux.
• AlphaGo (Silver et al., 2016) associe apprentissage par renforcement, réseaux profonds et recherche arborescente.

**Défis :**
• Compromis exploration/exploitation (par exemple la stratégie ε-greedy).
• Récompenses rares ou mal conçues : l'agent peut exploiter la règle sans atteindre l'objectif voulu.
• Beaucoup d'interactions, souvent en simulation ; entraînement instable.

**Usages :** jeux, robotique, optimisation de ressources, adaptation de modèles de langage (RLHF).`,
    category: "machine-learning",
    icon: "Target"
  },
  // Specific Algorithms
  {
    term: "Régression linéaire (Linear Regression)",
    description: `La régression linéaire modélise une variable numérique comme une combinaison linéaire de variables explicatives : y = β₀ + β₁ x₁ + ... + β_p x_p + erreur.

**Estimation :** la méthode des moindres carrés ordinaires choisit les coefficients qui minimisent la somme des carrés des résidus (écarts entre valeurs observées et ajustées). Elle a une solution explicite, β = (XᵀX)⁻¹ Xᵀ y, quand XᵀX est inversible.
\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

x = np.array([[1], [2], [3], [4], [5]])
y = np.array([3.1, 4.9, 7.2, 8.8, 11.1])
modele = LinearRegression().fit(x, y)
print(modele.coef_[0].round(2), modele.intercept_.round(2), round(modele.score(x, y), 3))
print(modele.predict([[6]]).round(2))
# Affichage :
# 1.99 1.05 0.997
# [12.99]
\`\`\`
La pente vaut environ 2 : chaque unité de x ajoute environ 2 à y.

**Hypothèses (pour les inférences : intervalles, tests) :** relation linéaire, erreurs indépendantes et de variance constante (homoscédasticité), approximativement normales pour les tests exacts. Les prédictions n'exigent pas la normalité.

**Interprétation :** chaque coefficient est l'effet moyen d'une unité de la variable sur y, les autres variables restant constantes. Corrélation n'est pas causalité.

**Extensions :** régression multiple, polynomiale (variables transformées), régularisée (Ridge : pénalité L2 ; Lasso : pénalité L1, qui annule certains coefficients).

**Limites :**
• Relations non linéaires non captées sans transformation.
• Sensible aux valeurs aberrantes et aux points à fort levier.
• Multicolinéarité : coefficients instables.
• Extrapolation hasardeuse hors de la plage observée.

**Évaluation :** RMSE, MAE, R² sur des données de test, et examen des résidus. C'est un modèle de référence simple et lisible, à essayer avant les méthodes complexes.`,
    category: "machine-learning",
    icon: "LineChart"
  },
  {
    term: "Régression logistique (Logistic Regression)",
    description: `La régression logistique est un modèle de classification qui estime la probabilité d'appartenir à une classe. Malgré son nom, elle ne sert pas à prédire une valeur continue.

**Principe :** elle calcule une combinaison linéaire z = β₀ + β₁ x₁ + ... des variables, puis la transforme en probabilité par la fonction sigmoïde : p = 1 / (1 + e^(−z)). De façon équivalente, le logarithme des cotes, log(p / (1 − p)), est linéaire en les variables.

**Interprétation :** exp(β_j) est le facteur par lequel les cotes (odds) sont multipliées quand la variable j augmente d'une unité, les autres restant constantes.
\`\`\`python
import numpy as np
from sklearn.linear_model import LogisticRegression

heures = np.array([[0.5], [1], [1.5], [2], [2.5], [3], [3.5], [4], [4.5], [5]])
reussi = np.array([0, 0, 0, 0, 1, 0, 1, 1, 1, 1])
modele = LogisticRegression().fit(heures, reussi)
print(modele.predict_proba([[1], [3], [4.5]])[:, 1].round(2))
print(np.exp(modele.coef_[0, 0]).round(2))
# Affichage :
# [0.11 0.58 0.89]
# 3.4
\`\`\`
La probabilité de réussite passe de 0,11 à 0,89 selon le nombre d'heures ; chaque heure supplémentaire multiplie les cotes par 3,4 environ.

**Ajustement :** par maximum de vraisemblance, donc en minimisant la perte logistique (entropie croisée). scikit-learn applique par défaut une régularisation L2 (paramètre C).

**Décision :** on compare p à un seuil (0,5 par convention), à régler selon les coûts des erreurs.

**Extensions :** multinomiale (softmax) pour plusieurs classes, régularisations L1 et L2.

**Atouts :** rapide, lisible, probabilités souvent correctes, bonne référence.

**Limites :**
• Frontière de décision linéaire : ajouter des interactions ou des transformations, sinon sous-apprentissage.
• Variables corrélées : coefficients instables.
• Classes parfaitement séparables : les coefficients divergent sans régularisation.
• Normaliser les variables quand on régularise.`,
    category: "machine-learning",
    icon: "Target"
  },
  {
    term: "k-plus proches voisins (k-Nearest Neighbors - k-NN)",
    description: `La méthode des k plus proches voisins (k-NN) prédit la classe ou la valeur d'une observation à partir des k observations d'entraînement les plus proches d'elle : vote majoritaire en classification, moyenne en régression.

**Principe :**
1. Calculer la distance de la nouvelle observation à tous les points d'entraînement.
2. Retenir les k plus proches.
3. Voter (classification) ou moyenner (régression), éventuellement avec des poids selon la distance.

Il n'y a pas d'entraînement au sens strict : le modèle mémorise les données (apprentissage « paresseux »).

**Choix de k :** k petit donne une frontière irrégulière, sensible au bruit (variance élevée) ; k grand une frontière lisse, avec plus de biais. On choisit k par validation croisée ; en binaire, un k impair évite les égalités.

**Distances :** euclidienne (par défaut), Manhattan, Minkowski, cosinus, Hamming pour des variables catégorielles.

**Mettre les variables à l'échelle :** une variable de grande amplitude domine la distance. Sur le jeu « wine », exactitude moyenne en validation croisée sans, puis avec normalisation :
\`\`\`python
from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_wine(return_X_y=True)
brut = KNeighborsClassifier(n_neighbors=5)
normalise = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
print(cross_val_score(brut, X, y, cv=5).mean().round(3), cross_val_score(normalise, X, y, cv=5).mean().round(3))
# Affichage :
# 0.691 0.949
\`\`\`

**Atouts :** simple, aucune hypothèse sur la forme des données, frontières non linéaires.

**Limites :**
• Prédiction lente sur de grands jeux, sauf avec un index (KD-tree, Ball tree).
• Fléau de la dimension : en grande dimension, les distances perdent leur sens.
• Il faut conserver tout le jeu d'entraînement.
• Sensible aux variables non pertinentes.`,
    category: "machine-learning",
    icon: "Users"
  },
  {
    term: "Arbres de décision (Decision Trees)",
    description: `Un arbre de décision prédit en posant une suite de questions simples sur les variables (« largeur du pétale ≤ 0,8 cm ? »). Chaque nœud interne teste une variable, chaque branche une réponse, chaque feuille donne la prédiction.

**Construction (CART, Breiman et al., 1984) :** à chaque nœud, on cherche la variable et le seuil qui rendent les deux sous-groupes les plus homogènes possible, puis on recommence sur chaque sous-groupe jusqu'à un critère d'arrêt. Critères d'impureté : Gini (1 − Σ p_k²) ou entropie (−Σ p_k log₂ p_k) en classification, variance (MSE) en régression.
\`\`\`python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text

iris = load_iris()
arbre = DecisionTreeClassifier(max_depth=2, random_state=0).fit(iris.data, iris.target)
print(export_text(arbre, feature_names=list(iris.feature_names)))
# Affichage :
# |--- petal width (cm) <= 0.80
# |   |--- class: 0
# |--- petal width (cm) >  0.80
# |   |--- petal width (cm) <= 1.75
# |   |   |--- class: 1
# |   |--- petal width (cm) >  1.75
# |   |   |--- class: 2
\`\`\`

**Atouts :**
• Très lisible : des règles « si... alors ».
• Pas de normalisation des variables ; relations non linéaires et interactions captées.
• Peu sensible aux valeurs aberrantes dans les variables explicatives.

**Limites :**
• Instable : un petit changement dans les données peut changer l'arbre.
• Surapprentissage facile quand l'arbre est profond.
• Coupures par paliers : approximation grossière des relations lisses, pas d'extrapolation.
• L'importance par impureté favorise les variables à nombreuses valeurs.

**Régularisation :** limiter max_depth, imposer min_samples_leaf, élaguer (ccp_alpha).

**Extensions :** forêts aléatoires et boosting de gradient, qui combinent de nombreux arbres.`,
    category: "machine-learning",
    icon: "TreePine"
  },
  {
    term: "Boosting de gradient (Gradient Boosting)",
    description: `Le boosting de gradient (Friedman, 2001) construit un modèle en ajoutant, l'un après l'autre, de petits modèles (en général des arbres peu profonds), chacun entraîné à corriger les erreurs de l'ensemble actuel.

**Principe :** on part d'une prédiction simple (la moyenne). À chaque étape, on calcule les résidus (pour la perte quadratique, l'opposé du gradient de la perte), on entraîne un petit arbre à les prédire, puis on l'ajoute au modèle multiplié par un pas d'apprentissage (shrinkage). Pour d'autres pertes, l'arbre ajuste l'opposé du gradient.
\`\`\`python
import numpy as np
from sklearn.tree import DecisionTreeRegressor

x = np.linspace(-3, 3, 60).reshape(-1, 1)
y = x.ravel() ** 2
prediction = np.full_like(y, y.mean())                 # modèle initial : la moyenne
print(0, round(np.mean((y - prediction) ** 2), 2))
for etape in range(1, 4):
    arbre = DecisionTreeRegressor(max_depth=2).fit(x, y - prediction)   # on prédit les résidus
    prediction = prediction + 0.5 * arbre.predict(x)                    # pas d'apprentissage 0,5
    print(etape, round(np.mean((y - prediction) ** 2), 2))
# Affichage :
# 0 7.69
# 1 3.11
# 2 1.46
# 3 0.65
\`\`\`
L'erreur quadratique moyenne passe de 7,69 à 0,65 en trois étapes (colonnes : étape, erreur).

**Différence avec la forêt aléatoire :** les arbres sont construits en série pour réduire le biais, au lieu d'être moyennés en parallèle pour réduire la variance.

**Hyperparamètres clés :** learning_rate (petit, avec davantage d'arbres), n_estimators (avec arrêt précoce sur un jeu de validation), max_depth (arbres peu profonds), sous-échantillonnage.

**Implémentations :** GradientBoosting et HistGradientBoosting (scikit-learn), XGBoost (Chen et Guestrin, 2016), LightGBM (Ke et al., 2017), CatBoost (Prokhorenkova et al., 2018).

**Atouts :** sur des données tabulaires de taille moyenne, les modèles à base d'arbres surpassent souvent les réseaux de neurones (Grinsztajn et al., 2022).

**Limites :** surapprentissage si trop d'arbres (arrêt précoce, régularisation) ; sensibilité aux hyperparamètres ; moins interprétable (SHAP, importance par permutation) ; étiquettes bruitées nuisibles, car chaque arbre corrige aussi le bruit.`,
    category: "machine-learning",
    icon: "TrendingUp"
  },
  {
    term: "Clustering k-moyennes (k-Means Clustering)",
    description: `L'algorithme k-means partitionne n observations en k groupes en associant chacune au centre (centroïde) le plus proche. Il minimise l'inertie : la somme des carrés des distances de chaque point au centre de son groupe.

**Algorithme de Lloyd :**
1. Choisir k centres initiaux (k-means++ les espace, Arthur et Vassilvitskii, 2007).
2. Affecter chaque point au centre le plus proche.
3. Recalculer chaque centre comme la moyenne de ses points.
4. Répéter 2 et 3 jusqu'à stabilité.

L'inertie diminue à chaque itération : l'algorithme converge, mais vers un minimum local qui dépend de l'initialisation (d'où n_init, plusieurs initialisations).
\`\`\`python
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

X, _ = load_iris(return_X_y=True)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print(np.bincount(km.labels_), round(km.inertia_, 1))
# Affichage :
# [62 50 38] 78.9
\`\`\`
Les effectifs des trois groupes d'iris trouvés sont 62, 50 et 38 (l'ordre des groupes est arbitraire), pour une inertie de 78,9.

**Choix de k :** méthode du coude sur l'inertie (qui baisse toujours quand k augmente), coefficient de silhouette, besoin métier.

**Atouts :** simple, rapide (coût proportionnel à n × k × d par itération), adapté aux gros jeux avec la variante mini-batch.

**Limites :**
• Il faut fixer k.
• Groupes supposés compacts, de tailles proches et de forme sphérique : échec sur des formes allongées ou en croissant (voir DBSCAN).
• Sensible aux valeurs aberrantes et à l'échelle des variables : normaliser.
• Distances euclidiennes : peu adapté aux variables catégorielles (variante k-modes) et à la grande dimension.`,
    category: "machine-learning",
    icon: "Layers"
  },
  {
    term: "Clustering hiérarchique (Hierarchical Clustering)",
    description: `Le clustering hiérarchique construit une hiérarchie de groupes emboîtés, représentée par un arbre appelé dendrogramme.

**Deux approches :**
• Agglomératif (ascendant) : chaque point forme d'abord un groupe, puis on fusionne à chaque étape les deux groupes les plus proches. C'est la forme la plus courante.
• Divisif (descendant) : on part d'un seul groupe et on le divise.

**Distance entre groupes (linkage) :**
• Single : distance minimale entre deux points des groupes (peut former des chaînes).
• Complete : distance maximale (groupes compacts).
• Average : moyenne des distances entre paires de points.
• Ward : fusionne les groupes qui augmentent le moins la variance intra-groupe (distances euclidiennes).

**Dendrogramme :** la hauteur d'une fusion est la distance à laquelle elle a lieu. On coupe l'arbre à une hauteur pour obtenir un nombre de groupes ; un grand saut de hauteur suggère un bon point de coupe.
\`\`\`python
import numpy as np
from scipy.cluster.hierarchy import fcluster, linkage

points = np.array([[1.0], [2.0], [6.0], [7.0], [15.0]])
fusions = linkage(points, method="average")   # colonnes : cluster a, cluster b, distance, taille
print(fusions.round(2))
print(fcluster(fusions, t=3, criterion="maxclust"))
# Affichage :
# [[ 0.  1.  1.  2.]
#  [ 2.  3.  1.  2.]
#  [ 5.  6.  5.  4.]
#  [ 4.  7. 11.  5.]]
# [1 1 2 2 3]
\`\`\`
Chaque ligne de la matrice décrit une fusion (groupes a et b, distance, taille). Les deux paires de points proches fusionnent à la distance 1 ; le point isolé 15 est rattaché en dernier.

**Atouts :** pas de nombre de groupes à fixer d'avance, structure à plusieurs échelles.

**Limites :**
• Mémoire de l'ordre de n² (matrice des distances) et temps d'au moins n² : peu adapté aux très gros jeux.
• Une fusion ne se défait pas.
• Sensible aux valeurs aberrantes et au choix de la distance et du linkage.`,
    category: "machine-learning",
    icon: "Layers"
  },
  {
    term: "DBSCAN (Density-Based Spatial Clustering of Applications with Noise)",
    description: `DBSCAN (Ester et al., 1996) est un algorithme de clustering fondé sur la densité : un groupe est une région dense de points, séparée des autres par des zones peu denses. Les points isolés sont étiquetés comme bruit.

**Paramètres :**
• eps (ε) : rayon du voisinage.
• min_samples (MinPts) : nombre minimal de points dans ce voisinage pour qu'un point soit « dense ».

**Types de points :**
• Point central (core) : au moins min_samples points dans son voisinage ε.
• Point de bordure : dans le voisinage d'un point central, sans être central.
• Bruit : ni l'un ni l'autre (étiquette −1 dans scikit-learn).

Un groupe rassemble des points centraux voisins les uns des autres et leurs points de bordure.

**Atouts :** pas de nombre de groupes à fixer, formes quelconques, détection du bruit, coût de l'ordre de n log n avec un index spatial.
\`\`\`python
from sklearn.cluster import DBSCAN, KMeans
from sklearn.datasets import make_moons
from sklearn.metrics import adjusted_rand_score

X, y = make_moons(n_samples=300, noise=0.05, random_state=0)
db = DBSCAN(eps=0.2, min_samples=5).fit(X)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
print(len(set(db.labels_) - {-1}), (db.labels_ == -1).sum())
print(round(adjusted_rand_score(y, db.labels_), 2), round(adjusted_rand_score(y, km.labels_), 2))
# Affichage :
# 2 0
# 1.0 0.24
\`\`\`
Sur deux croissants de lune, DBSCAN retrouve les deux groupes sans bruit (indice de Rand ajusté 1,0), alors que k-means les coupe mal (0,24).

**Choix des paramètres :** pour eps, tracer la distance au k-ième plus proche voisin, triée, et chercher le coude. Pour min_samples, règle empirique : au moins le nombre de dimensions + 1.

**Limites :**
• Sensible à eps et à min_samples.
• Difficulté quand les densités des groupes diffèrent (OPTICS et HDBSCAN s'y prêtent mieux).
• Normaliser les variables ; la dimension élevée dégrade les distances.`,
    category: "machine-learning",
    icon: "Layers"
  },
  {
    term: "Naive Bayes",
    description: `Naive Bayes est une famille de classifieurs probabilistes fondés sur le théorème de Bayes avec une hypothèse « naïve » : les variables sont indépendantes entre elles, conditionnellement à la classe.

**Principe :** P(classe | x) ∝ P(classe) × Π P(x_i | classe). On calcule ce score pour chaque classe et on retient la plus probable. P(classe) est la fréquence de la classe ; P(x_i | classe) est estimée par comptage ou par une loi.

**Variantes :**
• Gaussien : variables continues, supposées gaussiennes dans chaque classe.
• Multinomial : comptages (occurrences de mots).
• Bernoulli : variables binaires (mot présent ou non).
• Complement : adapté aux classes déséquilibrées.

**Lissage de Laplace :** on ajoute un petit compte (alpha = 1 par défaut en scikit-learn) pour qu'un mot jamais vu dans une classe n'annule pas toute la probabilité.
\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

textes = ["gagnez un prix maintenant", "prix gratuit cliquez", "réunion demain à dix heures",
          "ordre du jour de la réunion", "cliquez pour gagner"]
etiquettes = ["spam", "spam", "normal", "normal", "spam"]
vec = CountVectorizer()
modele = MultinomialNB().fit(vec.fit_transform(textes), etiquettes)
print(modele.classes_, modele.predict_proba(vec.transform(["gagnez un prix gratuit"])).round(2))
# Affichage :
# ['normal' 'spam'] [[0.03 0.97]]
\`\`\`
Le message « gagnez un prix gratuit » est classé spam avec une probabilité de 0,97.

**Atouts :** très rapide, fonctionne avec peu de données et en grande dimension, bonne référence pour le texte (voir Sac de mots).

**Limites :**
• L'indépendance est rarement vraie : avec des variables corrélées, une même information est comptée plusieurs fois.
• Les probabilités sont en général mal calibrées (trop proches de 0 ou de 1) : il classe souvent bien, mais ses probabilités ne se lisent pas au pied de la lettre.
• Il ne capte pas les interactions entre variables.`,
    category: "machine-learning",
    icon: "Brain"
  },
  // Advanced ML Concepts
  {
    term: "Détection d'anomalies (Anomaly Detection)",
    description: `La détection d'anomalies identifie les observations rares qui s'écartent nettement du comportement habituel des données : fraudes, pannes, intrusions, défauts de fabrication.

**Contextes d'apprentissage :**
• Non supervisé : aucune étiquette, on suppose que les anomalies sont rares.
• Semi-supervisé : apprentissage sur des données normales seulement (détection de nouveauté).
• Supervisé : des anomalies étiquetées existent ; c'est alors une classification très déséquilibrée.

**Méthodes courantes :**
• Statistiques : écart à la moyenne (score z), à la médiane (MAD), distance de Mahalanobis.
• Isolation Forest (Liu et al., 2008) : des arbres aléatoires isolent plus vite les points atypiques.
• Local Outlier Factor (Breunig et al., 2000) : compare la densité locale d'un point à celle de ses voisins.
• One-class SVM, autoencodeurs (forte erreur de reconstruction), modèles de séries temporelles.
\`\`\`python
import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
X = np.concatenate([rng.normal(0, 1, (200, 2)), [[6, 6], [-7, 5]]])   # 200 points normaux + 2 aberrants
modele = IsolationForest(contamination=0.005, random_state=0).fit(X)
print(np.where(modele.predict(X) == -1)[0])
# Affichage :
# [200 201]
\`\`\`
Isolation Forest repère ici les deux points aberrants ajoutés (indices 200 et 201) parmi 200 points normaux.

**Difficultés :**
• Peu ou pas d'étiquettes ; la notion d'« anormal » dépend du contexte (une valeur extrême peut être légitime).
• Le taux de contamination est une hypothèse à régler.
• Évaluation : l'exactitude trompe ; utiliser précision, rappel et courbe précision-rappel.
• Dérive : le « normal » évolue avec le temps.

**En pratique :** coupler le score d'anomalie à une vérification humaine et suivre le taux de fausses alertes.`,
    category: "machine-learning",
    icon: "AlertTriangle"
  },
  {
    term: "Processus Gaussiens (Gaussian Processes)",
    description: `Un processus gaussien est un modèle bayésien non paramétrique qui définit une loi de probabilité sur des fonctions. En régression, il prédit une valeur et une incertitude associée pour chaque nouveau point (Rasmussen et Williams, 2006).

**Principe :**
• On choisit un noyau (par exemple RBF), qui exprime l'idée que des entrées proches ont des sorties proches.
• Après observation des données, la loi a posteriori en un nouveau point est gaussienne : sa moyenne est la prédiction, son écart type quantifie l'incertitude.
• Loin des données, l'écart type revient vers celui de l'a priori.
\`\`\`python
import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF

x = np.array([[1.0], [3.0], [5.0]])
y = np.sin(x).ravel()
gp = GaussianProcessRegressor(kernel=RBF(length_scale=1.0), optimizer=None).fit(x, y)
moyenne, ecart = gp.predict([[3.0], [4.0], [7.0]], return_std=True)
print(moyenne.round(2), ecart.round(2))   # x = 3 est observé, x = 7 est loin des données
# Affichage :
# [ 0.14 -0.49 -0.13] [0.   0.59 0.99]
\`\`\`
En x = 3 (point observé), l'écart type est nul. En x = 7, loin des données, il est voisin de 1 : le modèle indique qu'il ne sait pas.

**Intérêts :** bonnes prédictions sur de petits jeux de données, incertitude intégrée (intervalles de crédibilité), hyperparamètres du noyau appris par maximum de vraisemblance, base de l'optimisation bayésienne.

**Limites :**
• Coût en O(n³) en temps et O(n²) en mémoire : de l'ordre de quelques milliers de points sans approximation.
• Le choix du noyau encode des hypothèses (régularité, périodicité).
• Moins adapté à la grande dimension.

**Usages :** modélisation de simulations coûteuses, optimisation bayésienne d'hyperparamètres, géostatistique (krigeage).`,
    category: "machine-learning",
    icon: "TrendingUp"
  },
  {
    term: "Apprentissage Few-shot (Few-shot Learning)",
    description: `L'apprentissage few-shot vise à apprendre une nouvelle tâche à partir de très peu d'exemples par classe, parfois un seul (one-shot) ou aucun (zero-shot).

**Cadre :** une tâche « N classes, K exemples par classe » (N-way K-shot) est présentée avec un petit ensemble de support (les exemples étiquetés), puis on prédit sur un ensemble de requêtes.

**Approches :**
• Méta-apprentissage (« apprendre à apprendre ») : entraînement sur de nombreuses petites tâches pour s'adapter vite à une nouvelle. Exemples : MAML (Finn et al., 2017), réseaux prototypiques (Snell et al., 2017), matching networks (Vinyals et al., 2016).
• Apprentissage de métrique : apprendre un espace où la distance reflète la ressemblance (réseaux siamois), puis classer par proximité avec les exemples connus.
• Transfert d'apprentissage : réutiliser un modèle pré-entraîné et ne réajuster que peu de paramètres.
• Apprentissage en contexte des grands modèles de langage : quelques exemples placés dans la consigne suffisent, sans réentraînement (Brown et al., 2020).

**Zero-shot :** le modèle dispose d'une description de la classe plutôt que d'exemples. CLIP (Radford et al., 2021) classe des images selon des catégories décrites en texte ; ses auteurs rapportent 76,2 % de précision top-1 sur ImageNet sans exemple d'entraînement de ce jeu.

**Usages :** espèces ou maladies rares, nouveaux produits ou langues, personnalisation.

**Limites :**
• Peu d'exemples : forte variance, résultats sensibles au choix des exemples.
• Surapprentissage possible, généralisation limitée hors du domaine d'entraînement.
• L'évaluation demande de nombreuses tâches tirées au hasard, avec intervalles de confiance.`,
    category: "machine-learning",
    icon: "Zap"
  },
  {
    term: "LIME (Local Interpretable Model-agnostic Explanations)",
    description: `LIME (Ribeiro, Singh et Guestrin, 2016) explique une prédiction individuelle de n'importe quel modèle en l'approchant, au voisinage de cet exemple, par un modèle simple et interprétable, souvent linéaire.

**Principe :**
1. Perturber l'exemple à expliquer (masquer des mots d'un texte, des zones d'une image, modifier des valeurs).
2. Interroger le modèle sur ces variantes.
3. Pondérer les variantes selon leur proximité avec l'exemple.
4. Ajuster un modèle linéaire parcimonieux : ses coefficients indiquent les variables qui ont le plus pesé sur cette prédiction.

**Caractéristiques :** indépendant du modèle (model-agnostic), local (valable autour d'un exemple), applicable aux données tabulaires, au texte et aux images.

**Exemple :** pour un classifieur de textes, LIME peut montrer que les mots « gratuit » et « gagnez » ont poussé la prédiction vers « spam ».

**Limites :**
• Instabilité : le tirage aléatoire des perturbations peut changer l'explication d'une exécution à l'autre.
• Le résultat dépend de la définition du voisinage et de la pondération, difficiles à choisir.
• Fidélité locale seulement : l'explication ne vaut pas pour le modèle entier.
• Perturbations irréalistes si les variables sont corrélées.

**Alternative :** SHAP, aux propriétés théoriques plus solides mais plus coûteux. Dans les deux cas, confronter les explications à l'avis d'un expert du domaine.`,
    category: "machine-learning",
    icon: "Lightbulb"
  },
  {
    term: "SHAP (SHapley Additive exPlanations)",
    description: `SHAP (Lundberg et Lee, 2017) explique une prédiction en attribuant à chaque variable une contribution, calculée à partir des valeurs de Shapley de la théorie des jeux coopératifs (Shapley, 1953).

**Principe :** la contribution d'une variable est son apport marginal moyen à la prédiction, sur tous les ordres possibles d'ajout des variables. Les contributions sont additives : prédiction = valeur de base + Σ contributions.
\`\`\`python
from itertools import permutations

f = lambda a, b: a + 2 * b + a * b          # le « modèle »
x, base = (1, 2), (0, 0)                     # exemple à expliquer, référence
v = lambda S: f(*[x[i] if i in S else base[i] for i in range(2)])

phi = [0.0, 0.0]
for ordre in permutations(range(2)):         # tous les ordres d'arrivée des variables
    S = set()
    for i in ordre:
        phi[i] += (v(S | {i}) - v(S)) / 2
        S.add(i)
print(phi)
# Affichage :
# [2.0, 5.0]
\`\`\`
Avec f = x₁ + 2x₂ + x₁x₂, l'exemple (1, 2) et la référence (0, 0), les contributions sont 2 et 5 ; leur somme, 7, est l'écart entre la prédiction et la référence. Le terme d'interaction x₁x₂ = 2 est partagé à parts égales entre les deux variables.

**Usages :** explication locale (décomposition d'une prédiction) ou globale (moyenne des valeurs absolues, distribution par variable).

**Variantes :** TreeSHAP (calcul exact et rapide pour les arbres et les forêts, Lundberg et al., 2020), KernelSHAP (approximation valable pour tout modèle), DeepSHAP.

**Limites :**
• Le calcul exact est exponentiel en nombre de variables : on utilise des approximations.
• Le résultat dépend de la référence choisie ; avec des variables corrélées, il peut s'appuyer sur des combinaisons irréalistes.
• Attribution n'est pas causalité : elle décrit le modèle, pas le monde.`,
    category: "machine-learning",
    icon: "BarChart3"
  },
  {
    term: "Théorie des graphes (Graph Theory)",
    description: `Un graphe est formé de sommets (nœuds) reliés par des arêtes (liens). La théorie des graphes étudie ces structures, qui modélisent des relations par paires : amitiés, routes, liens entre pages, interactions entre molécules.

**Vocabulaire :**
• Orienté ou non, selon que les liens ont un sens (suivre quelqu'un) ou non (être amis).
• Pondéré si les liens portent une valeur (distance, force).
• Degré d'un sommet : nombre de ses liens (entrants et sortants dans un graphe orienté).
• Chemin, cycle, composante connexe, arbre (graphe connexe sans cycle).

**Représentations :** matrice d'adjacence M (M[i, j] = 1 s'il existe un lien de i vers j) ou liste d'adjacence, plus économe pour les graphes creux.
\`\`\`python
import numpy as np

# Pages A, B, C, D ; liens A→B, A→C, B→C, C→A, D→C
liens = [(0, 1), (0, 2), (1, 2), (2, 0), (3, 2)]
M = np.zeros((4, 4))
for source, cible in liens:
    M[source, cible] = 1
print(M.sum(axis=1), M.sum(axis=0))   # degrés sortants, degrés entrants
# Affichage :
# [2. 1. 1. 1.] [1. 1. 3. 0.]
\`\`\`

**Mesures de centralité :** degré, intermédiarité (passage par les plus courts chemins), proximité, PageRank. Elles repèrent les sommets importants.

**Algorithmes classiques :** parcours en largeur et en profondeur, plus court chemin (Dijkstra), arbre couvrant minimal, détection de communautés.

**En science des données :** analyse de réseaux sociaux, recommandation, détection de fraude, graphes de connaissances, chimie. Les réseaux de neurones sur graphes (GNN, comme les GCN de Kipf et Welling, 2017) apprennent sur ces structures. En Python : NetworkX.`,
    category: "machine-learning",
    icon: "Network"
  },
  {
    term: "PageRank",
    description: `PageRank (Brin et Page, 1998) est un algorithme de centralité qui attribue un score d'importance à chaque nœud d'un graphe orienté : un nœud est important s'il est pointé par des nœuds importants. Il a été conçu pour classer les pages web.

**Surfeur aléatoire :** un internaute suit un lien au hasard parmi ceux de sa page et, avec la probabilité 1 − d, saute vers une page quelconque. Le score d'une page est la probabilité de s'y trouver à long terme.

**Formule :** PR(p) = (1 − d) / N + d × Σ PR(q) / L(q), la somme portant sur les pages q qui pointent vers p, avec L(q) le nombre de liens sortants de q, N le nombre de pages et d le facteur d'amortissement, classiquement 0,85.

**Calcul :** par itération de puissance (on répète la formule jusqu'à stabilité) ou comme vecteur propre principal de la matrice de transition.
\`\`\`python
import numpy as np

# Liens A→B, A→C, B→C, C→A, D→C ; chaque ligne répartit le score d'une page entre ses liens
P = np.array([[0, .5, .5, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0]])
pr = np.full(4, 1 / 4)
for _ in range(50):
    pr = 0.15 / 4 + 0.85 * P.T @ pr   # facteur d'amortissement d = 0,85
print(pr.round(3))                    # scores de A, B, C, D
# Affichage :
# [0.373 0.196 0.394 0.038]
\`\`\`
La page C, pointée par A, B et D, a le plus fort score ; D, que personne ne pointe, a le plus faible.

**Usages :** classement de pages web (parmi de nombreux signaux), importance dans des réseaux sociaux ou de citations.

**Limites :** il ne mesure que la structure des liens, pas la qualité du contenu ; il peut être manipulé par des fermes de liens ; les pages sans lien sortant demandent un traitement particulier.`,
    category: "machine-learning",
    icon: "Star"
  },
  {
    term: "Attaques adverses (Adversarial Attacks)",
    description: `Une attaque adverse modifie légèrement une entrée, souvent de façon imperceptible pour un humain, afin de provoquer une erreur d'un modèle d'apprentissage. Les premiers exemples sur des réseaux profonds datent de Szegedy et al. (2013).

**Principe, avec FGSM (Goodfellow, Shlens et Szegedy, 2014) :** on déplace l'entrée de ε dans la direction du signe du gradient de la perte : x' = x + ε × signe(∇ₓ L).
\`\`\`python
import numpy as np

sigmoide = lambda z: 1 / (1 + np.exp(-z))
w, b = np.array([2.0, -1.0]), 0.0         # modèle logistique
x, y = np.array([1.0, 1.0]), 1            # exemple de classe positive
p = sigmoide(w @ x + b)
print(p.round(2))

# FGSM : x' = x + ε × signe(gradient de la perte par rapport à x)
gradient = (p - y) * w
x_adv = x + 0.5 * np.sign(gradient)
print(x_adv, sigmoide(w @ x_adv + b).round(2))
# Affichage :
# 0.73
# [0.5 1.5] 0.38
\`\`\`
Un petit déplacement de chaque variable (0,5) fait passer la probabilité de la classe positive de 0,73 à 0,38 : la prédiction s'inverse.

**Types :**
• Boîte blanche : l'attaquant connaît le modèle et ses gradients (FGSM, PGD de Madry et al., 2017, Carlini-Wagner).
• Boîte noire : seules les prédictions sont accessibles ; les exemples adverses se transfèrent souvent d'un modèle à un autre.
• Ciblée (forcer une classe donnée) ou non ciblée.
• Physique : des autocollants sur un panneau STOP ont trompé un classifieur d'images (Eykholt et al., 2018).

**Défenses :**
• Entraînement adverse : inclure des exemples adverses dans l'entraînement, efficace mais coûteux.
• Défenses certifiées, lissage aléatoire (Cohen et al., 2019).
• Détection d'entrées suspectes, prétraitement : beaucoup se sont révélés contournables, d'où l'évaluation contre des attaques adaptatives.

**Constat :** robustesse et exactitude standard peuvent être en tension (Tsipras et al., 2019).

**Domaines :** images, texte, audio, logiciels malveillants. D'autres menaces existent (empoisonnement des données, extraction de modèle). Tester la robustesse avant un usage sensible (voir Robustness Testing).`,
    category: "machine-learning",
    icon: "Shield"
  },
  {
    term: "Systèmes de recommandation (Recommender Systems)",
    description: `Un système de recommandation suggère à chaque utilisateur des éléments (films, produits, articles, musiques) susceptibles de l'intéresser, à partir de ses comportements, de ceux des autres utilisateurs et des caractéristiques des éléments.

**Approches :**
• Filtrage collaboratif : exploite les interactions (notes, achats, clics) ; des utilisateurs aux goûts proches apprécient des éléments proches.
• Filtrage par contenu : recommande des éléments proches de ceux déjà appréciés, selon leurs caractéristiques (genre, texte, image).
• Hybride : combine les deux et traite mieux les nouveaux éléments.
• Modèles séquentiels et réseaux profonds, qui tiennent compte du contexte (heure, appareil).

**Techniques :** voisinage (k-NN), factorisation de matrices (Koren, Bell et Volinsky, 2009), modèles de facteurs latents pour retours implicites, réseaux de neurones, apprentissage par renforcement ou bandits pour explorer.

**Évaluation :**
• Hors ligne : RMSE sur les notes, Precision@K, Recall@K, NDCG pour la qualité du classement.
• Au-delà de la précision : diversité, nouveauté, couverture du catalogue.
• En ligne : tests A/B sur des indicateurs d'usage.

**Défis :**
• Démarrage à froid : nouveaux utilisateurs ou éléments sans historique.
• Matrice d'interactions très creuse.
• Biais de popularité et boucles de rétroaction : on recommande ce qui est déjà populaire.
• Passage à l'échelle.

**Enjeux éthiques :** bulles de filtres, manipulation de l'attention, protection de la vie privée, transparence et choix laissé à l'utilisateur.`,
    category: "machine-learning",
    icon: "Star"
  },
  {
    term: "Filtrage collaboratif (Collaborative Filtering)",
    description: `Le filtrage collaboratif recommande des éléments en s'appuyant sur les évaluations ou comportements d'un grand nombre d'utilisateurs, sans connaître le contenu des éléments. Principe : des utilisateurs qui ont aimé les mêmes éléments ont des goûts proches.

**Données :** une matrice utilisateurs × éléments (notes, achats, clics), très creuse.

**Approches par voisinage :**
• Utilisateur-utilisateur : trouver les utilisateurs similaires à la personne ciblée et agréger leurs notes.
• Élément-élément : prédire à partir des éléments semblables à ceux qu'elle a déjà notés ; plus stable quand il y a plus d'utilisateurs que d'éléments.
• Similarités : cosinus, corrélation de Pearson, Jaccard.
\`\`\`python
import numpy as np

# Notes de 4 utilisateurs sur 4 films (0 = pas de note)
R = np.array([[5, 4, 0, 1], [4, 5, 1, 0], [1, 0, 5, 4], [0, 1, 4, 5]], dtype=float)
cos = lambda a, b: a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

sims = np.array([cos(R[0], R[u]) for u in range(1, 4)])   # similarité de l'utilisateur 0 avec les autres
notes = R[1:, 2]                                           # leurs notes pour le film 2
print(sims.round(2), round((sims * notes).sum() / sims.sum(), 2))
# Affichage :
# [0.95 0.21 0.21] 2.09
\`\`\`
Les similarités de l'utilisateur 0 avec les trois autres sont 0,95, 0,21 et 0,21. Pour le film 2, ils ont mis 1, 5 et 4 : la prédiction, tirée vers la note 1 de l'utilisateur au goût proche, est de 2,09 (une note manquante compte ici pour 0, par simplification).

**Factorisation de matrices :** la matrice est approchée par un produit de facteurs latents, r̂ = p_u · q_i, appris par descente de gradient ou par moindres carrés alternés (ALS). Elle gère mieux la creusité et passe à l'échelle.

**Atouts :** aucune connaissance du contenu, découvertes inattendues (sérendipité).

**Limites :**
• Démarrage à froid pour les nouveaux utilisateurs et éléments.
• Données creuses ; coût des similarités avec beaucoup d'utilisateurs.
• Biais de popularité.
• Retours implicites (clics) : l'absence d'interaction n'est pas un rejet.

L'évaluation est décrite dans l'entrée Systèmes de recommandation.`,
    category: "machine-learning",
    icon: "Users"
  }
];