/**
 * Model Evaluation and Metrics
 * Performance metrics, validation techniques, and model assessment methods
 */

import { GlossaryEntry } from './types';

export const evaluationTerms: GlossaryEntry[] = [
  {
    term: "Évaluation de modèles (Model Evaluation)",
    description: `L'évaluation d'un modèle consiste à mesurer la qualité de ses prédictions avec des métriques adaptées, sur des données qu'il n'a pas vues pendant l'entraînement, afin d'estimer sa capacité de généralisation.

**Principe :**
• Séparer les données : entraînement pour ajuster le modèle, validation pour choisir les réglages, test pour une estimation finale, consulté une seule fois.
• Choisir une métrique qui reflète l'objectif réel : exactitude, rappel, AUC, MAE, R²... selon la tâche et le coût des erreurs.
• Se comparer à une référence simple (voir Baseline Models) avant de conclure.
• Chiffrer l'incertitude : un score sur un jeu de test fini est une estimation, pas une valeur exacte (validation croisée, intervalles de confiance).

**Exemple :** un filtre anti-spam affiche 95 % d'exactitude. Si 95 % des messages sont légitimes, un modèle qui ne détecte jamais de spam fait aussi bien : la matrice de confusion, la précision et le rappel montrent ce que l'exactitude cache.

**Pièges :**
• La fuite de données : toute information du jeu de test utilisée à l'entraînement (normalisation calculée sur l'ensemble des données, doublons) rend le score trop optimiste.
• Tester plusieurs modèles sur le même jeu de test et garder le meilleur revient à utiliser ce jeu pour choisir.
• Un bon score hors ligne ne garantit pas la même performance en production, car les données évoluent (voir Robustness Testing).
• Un score moyen peut masquer de grands écarts selon les sous-groupes : évaluer aussi par tranche de données.`,
    category: "evaluation",
    icon: "BarChart3"
  },
  {
    term: "Matrice de confusion (Confusion Matrix)",
    description: `La matrice de confusion est un tableau qui croise les classes réelles et les classes prédites par un modèle de classification. Elle montre quelles erreurs le modèle commet, pas seulement combien.

**Cas binaire :** quatre cases.
• VP (vrais positifs) : positifs correctement prédits.
• VN (vrais négatifs) : négatifs correctement prédits.
• FP (faux positifs) : négatifs prédits positifs, une fausse alerte.
• FN (faux négatifs) : positifs prédits négatifs, un cas manqué.

**Lecture :** la diagonale contient les bonnes prédictions, le reste les erreurs. En multiclasse, c'est un tableau n × n qui montre quelles classes sont confondues entre elles. Exactitude, précision, rappel, spécificité et F1 s'en déduisent.

**Exemple :** sur 10 messages dont 4 spams, un filtre en classe 5 comme spams, dont 3 le sont réellement : VP = 3, FP = 2, FN = 1, VN = 4.
\`\`\`python
from sklearn.metrics import confusion_matrix, precision_score, recall_score

# 1 = spam. Lignes : classe réelle, colonnes : classe prédite
y_reel = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
y_pred = [1, 1, 1, 0, 1, 1, 0, 0, 0, 0]

print(confusion_matrix(y_reel, y_pred))
print(precision_score(y_reel, y_pred), recall_score(y_reel, y_pred))
# Affichage :
# [[4 2]
#  [1 3]]
# 0.6 0.75
\`\`\`

**À vérifier :** scikit-learn place les classes réelles en lignes et les classes prédites en colonnes ; d'autres sources inversent les axes. Avec des classes déséquilibrées, normalize="true" donne des taux par classe réelle, plus lisibles que des effectifs.`,
    category: "evaluation",
    icon: "Hash"
  },
  {
    term: "Précision (Precision)",
    description: `La précision est la part des prédictions positives qui sont correctes : parmi tous les cas que le modèle a signalés, combien étaient réellement positifs.

**Formule :** précision = VP / (VP + FP).

**Exemple :** un filtre signale 5 messages comme spams et 3 le sont réellement : précision = 3/5 = 0,6. Deux messages légitimes ont été écartés à tort.

**Quand la privilégier :** quand une fausse alerte coûte cher : bloquer un message légitime, accuser à tort un client, déclencher une intervention inutile.

**Limites :**
• Elle ignore les positifs que le modèle n'a pas signalés : un modèle qui ne signale qu'un seul cas, certain, atteint 100 % de précision en manquant presque tous les autres. Il faut la lire avec le rappel.
• Relever le seuil de décision rend le modèle plus sélectif : la précision a tendance à monter et le rappel à baisser (voir Courbe Précision-Rappel).
• Elle dépend de la proportion de positifs : à qualité égale, elle est plus faible quand la classe positive est rare.
• Elle n'est pas définie si le modèle ne prédit aucun positif (0/0) : scikit-learn renvoie alors 0 avec un avertissement, réglable par zero_division.

**Multiclasse :** précision par classe, puis moyenne simple (macro), pondérée par les effectifs (weighted) ou calculée sur l'ensemble des prédictions (micro).`,
    category: "evaluation",
    icon: "Target"
  },
  {
    term: "Rappel (Recall/Sensitivity)",
    description: `Le rappel (ou sensibilité, taux de vrais positifs) est la part des cas réellement positifs que le modèle a détectés.

**Formule :** rappel = VP / (VP + FN).

**Exemple :** sur 4 spams, le filtre en détecte 3 : rappel = 3/4 = 0,75. Un spam est passé.

**Quand le privilégier :** quand manquer un cas coûte cher : dépistage médical, détection d'incident ou de fraude suivie d'une vérification humaine. On accepte alors davantage de fausses alertes.

**Compromis avec la précision :**
• Abaisser le seuil de décision détecte plus de positifs (rappel en hausse), mais déclenche aussi plus de fausses alertes (précision en baisse).
• Un modèle qui répond « positif » pour tous les exemples atteint 100 % de rappel sans aucune valeur : le rappel se lit toujours avec la précision ou la spécificité.

**Noms et liens :** sensibilité en médecine, TPR (True Positive Rate) en ROC, où il forme l'axe vertical. Contrairement à la précision, il ne dépend pas de la proportion de positifs dans les données.

**Multiclasse :** rappel par classe, puis moyenne macro, pondérée ou micro.`,
    category: "evaluation",
    icon: "Search"
  },
  {
    term: "F1-Score",
    description: `Le score F1 est la moyenne harmonique de la précision et du rappel : un seul nombre entre 0 et 1, élevé seulement si les deux le sont.

**Formule :** F1 = 2 × P × R / (P + R) = 2 VP / (2 VP + FP + FN).

**Pourquoi harmonique :** cette moyenne est tirée vers la plus petite des deux valeurs. Avec une précision de 0,9 et un rappel de 0,1, la moyenne arithmétique vaut 0,5 mais F1 = 2 × 0,9 × 0,1 / (0,9 + 0,1) = 0,18.

**Exemple :** précision 0,6 et rappel 0,75 donnent F1 = 2 × 0,6 × 0,75 / 1,35 ≈ 0,67.

**Variante :** le score Fβ donne au rappel β fois plus d'importance qu'à la précision. F2 favorise le rappel, F0,5 la précision.

**Limites :**
• Il ignore les vrais négatifs : deux modèles ayant les mêmes VP, FP et FN ont le même F1, quel que soit le nombre de négatifs.
• Il suppose que précision et rappel comptent autant, ce qui n'est pas toujours le cas.
• Il dépend du seuil de décision, comme les deux métriques qu'il résume.
• En multiclasse, il faut choisir la moyenne : macro (classes à poids égal), pondérée ou micro.

**En pratique :** il est utile quand les classes sont déséquilibrées et que l'exactitude est trompeuse, mais il ne remplace pas la lecture de la matrice de confusion.`,
    category: "evaluation",
    icon: "BarChart3"
  },
  {
    term: "Exactitude (Accuracy)",
    description: `L'exactitude (accuracy) est la proportion de prédictions correctes parmi toutes les prédictions d'un modèle de classification.

**Formule :** exactitude = (VP + VN) / (VP + VN + FP + FN).

**Exemple :** 85 bonnes réponses sur 100 exemples donnent une exactitude de 85 %.

**Le piège des classes déséquilibrées :** sur 1 000 messages dont 950 légitimes et 50 spams, un modèle qui répond toujours « légitime » obtient 95 % d'exactitude et ne détecte aucun spam. Ce 95 % est le niveau à dépasser, pas un succès.

**Quand elle convient :**
• Les classes sont à peu près équilibrées.
• Les deux types d'erreur coûtent autant.
• On veut un chiffre de synthèse simple à communiquer.

**Quand la compléter :**
• Classes déséquilibrées ou événements rares.
• Coûts d'erreur différents (médecine, sécurité, fraude).

**Alternatives :**
• Précision, rappel et F1 (voir ces entrées).
• Exactitude équilibrée (balanced accuracy) : moyenne des rappels de chaque classe.
• Kappa de Cohen : accord corrigé de celui qu'on attend du hasard.
• AUC : qualité du classement des scores, indépendante du seuil.

**En pratique :** donner l'exactitude avec la proportion de la classe majoritaire et la matrice de confusion.`,
    category: "evaluation",
    icon: "CheckCircle"
  },
  {
    term: "Spécificité (Specificity)",
    description: `La spécificité (taux de vrais négatifs) est la part des cas réellement négatifs que le modèle identifie comme tels : sa capacité à ne pas donner de fausse alerte.

**Formule :** spécificité = VN / (VN + FP) = 1 − taux de faux positifs (FPR).

**Exemple :** sur 6 messages légitimes, le filtre en reconnaît 4 comme légitimes et en classe 2 à tort comme spams : spécificité = 4/6 ≈ 0,67.

**Lien avec la sensibilité :** la sensibilité (rappel) porte sur les cas positifs, la spécificité sur les cas négatifs. Quand on déplace le seuil de décision, l'une monte et l'autre baisse. La courbe ROC représente ce compromis : abscisse = 1 − spécificité, ordonnée = sensibilité.

**Usage :** très employée en médecine pour les tests de diagnostic, avec la sensibilité. Un test très spécifique produit peu de faux positifs ; un test très sensible manque peu de malades.

**Spécificité et précision sont deux notions différentes :** la précision, VP / (VP + FP), dépend de la proportion de positifs dans la population ; la spécificité n'en dépend pas. Pour une maladie rare, même un test de spécificité 95 % peut donner une majorité de faux positifs parmi ses résultats positifs.

**Limite :** une spécificité de 100 % s'obtient en prédisant toujours « négatif ». Elle se lit avec la sensibilité.`,
    category: "evaluation",
    icon: "Shield"
  },
  {
    term: "Courbe ROC (ROC Curve)",
    description: `La courbe ROC (Receiver Operating Characteristic) montre, pour un classifieur qui produit un score, le compromis entre détections et fausses alertes quand on fait varier le seuil de décision.

**Construction :** pour chaque seuil, on classe comme positifs les exemples dont le score atteint ce seuil, puis on calcule :
• en ordonnée, le taux de vrais positifs TPR = VP / (VP + FN), la sensibilité ;
• en abscisse, le taux de faux positifs FPR = FP / (FP + VN) = 1 − spécificité.

Un seuil très haut classe tout en négatif (point (0, 0)), un seuil très bas tout en positif (point (1, 1)).
\`\`\`python
from sklearn.metrics import roc_curve

y_reel = [0, 0, 0, 0, 1, 1, 1, 1]
score = [0.1, 0.3, 0.35, 0.8, 0.4, 0.6, 0.7, 0.9]
fpr, tpr, seuils = roc_curve(y_reel, score)
print(fpr)
print(tpr)
# Affichage :
# [0.   0.   0.25 0.25 1.  ]
# [0.   0.25 0.25 1.   1.  ]
\`\`\`

**Lecture :**
• La diagonale correspond à un classement au hasard.
• Plus la courbe s'approche du coin supérieur gauche (0, 1), mieux le score sépare les classes.
• Une courbe sous la diagonale signale un score inversé.
• Choisir un point revient à choisir un seuil, de préférence selon le coût des erreurs (l'indice de Youden J = TPR − FPR est un critère courant).

**Limites :**
• Elle ne dépend pas du seuil, mais ne dit pas lequel retenir.
• Quand les positifs sont très rares, un FPR faible peut cacher beaucoup de fausses alertes : compléter par la courbe précision-rappel.
• Multiclasse : une courbe par classe (un contre tous).

Son résumé numérique est l'AUC.`,
    category: "evaluation",
    icon: "TrendingUp"
  },
  {
    term: "AUC (Area Under Curve)",
    description: `L'AUC (Area Under the Curve) est l'aire sous la courbe ROC. Elle résume en un nombre entre 0 et 1 la capacité d'un score à séparer les positifs des négatifs, quel que soit le seuil.

**Interprétation :** c'est la probabilité qu'un positif tiré au hasard reçoive un score plus élevé qu'un négatif tiré au hasard (une égalité compte pour 1/2). Elle ne dépend que de l'ordre des scores.
\`\`\`python
from sklearn.metrics import roc_auc_score

y_reel = [0, 0, 0, 0, 1, 1, 1, 1]
score = [0.1, 0.3, 0.35, 0.8, 0.4, 0.6, 0.7, 0.9]
pos, neg = score[4:], score[:4]
paires = [p > n for p in pos for n in neg]   # 16 paires (positif, négatif)
print(roc_auc_score(y_reel, score), sum(paires) / len(paires))
# Affichage :
# 0.8125 0.8125
\`\`\`

**Repères :** 0,5 correspond au hasard, 1 à une séparation parfaite ; sous 0,5, le score est inversé. Les niveaux de « bon » ou « excellent » sont des conventions qui varient selon le domaine.

**Limites :**
• Elle ne dit rien de la calibration : des probabilités peu fiables peuvent avoir une bonne AUC.
• Elle ne tient compte ni des coûts des erreurs ni du seuil retenu en production.
• Quand les positifs sont très rares, elle peut flatter le modèle : ajouter la précision moyenne.
• Pour comparer deux AUC sur le même jeu de test, utiliser le test de DeLong ou le bootstrap.

**Multiclasse :** moyenne des AUC un contre tous ou un contre un (roc_auc_score, paramètre multi_class).`,
    category: "evaluation",
    icon: "BarChart3"
  },
  {
    term: "Courbe Précision-Rappel",
    description: `La courbe précision-rappel trace la précision en fonction du rappel quand on fait varier le seuil de décision. Elle se concentre sur la classe positive, ce qui la rend plus informative que la courbe ROC quand les positifs sont rares.

**Construction :** à chaque seuil, précision = VP / (VP + FP) et rappel = VP / (VP + FN). Quand le seuil baisse, le rappel augmente et la précision tend à diminuer, avec des variations en dents de scie.

**Repère :** un modèle aléatoire a une précision constante égale à la proportion de positifs. La courbe doit passer nettement au-dessus.

**Résumé :** la précision moyenne (average precision, AP) additionne les gains de rappel pondérés par la précision atteinte : AP = Σ (R_n − R_(n−1)) × P_n.

**Exemple :** avec 1 % de positifs, une AUC ROC de 0,82 coexiste avec une précision moyenne de 0,16, à comparer à la base de 0,01.
\`\`\`python
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=40000, n_informative=5, n_redundant=0,
                           weights=[0.99], class_sep=0.8, flip_y=0, random_state=0)
X_ent, X_test, y_ent, y_test = train_test_split(X, y, stratify=y, random_state=0)
score = LogisticRegression().fit(X_ent, y_ent).predict_proba(X_test)[:, 1]
print(y_test.mean(), round(roc_auc_score(y_test, score), 3), round(average_precision_score(y_test, score), 3))
# Affichage :
# 0.01 0.819 0.163
\`\`\`

**Pourquoi la ROC peut rassurer à tort :** le FPR est rapporté à l'énorme nombre de négatifs, donc beaucoup de fausses alertes le laissent presque nul, alors qu'elles noient les quelques vrais positifs détectés. La précision, qui compare les fausses alertes aux détections, le montre.

**Autres usages :** précision parmi les K premiers résultats (P@K) ; choix d'un seuil pour une précision ou un rappel imposés.`,
    category: "evaluation",
    icon: "LineChart"
  },
  {
    term: "Erreur quadratique moyenne (MSE)",
    description: `L'erreur quadratique moyenne (MSE, Mean Squared Error) est la moyenne des carrés des écarts entre valeurs prédites et valeurs réelles. C'est une métrique de régression très courante et la fonction de coût de nombreux modèles.

**Formule :** MSE = (1/n) × Σ (y_i − ŷ_i)².

**Exemple :** valeurs réelles 3, 5, 2, 7 et prédictions 2,5, 5, 4, 8 : écarts −0,5, 0, 2 et 1, carrés 0,25, 0, 4 et 1, donc MSE = 5,25 / 4 = 1,3125.

**Propriétés :**
• Elle pénalise fortement les grosses erreurs (un écart doublé compte quatre fois plus) : elle est sensible aux valeurs aberrantes.
• Elle s'exprime dans le carré de l'unité de la cible (euros², mètres²), peu lisible : on lui préfère souvent sa racine, la RMSE.
• Elle est dérivable partout, ce qui facilite l'optimisation par descente de gradient. Le modèle qui la minimise prédit la moyenne conditionnelle de la cible.
• Elle vaut 0 pour des prédictions parfaites et n'a pas de borne supérieure : elle ne se compare qu'entre modèles évalués sur la même cible et les mêmes données.

**Repère :** la MSE d'un modèle qui prédit toujours la moyenne est la variance de la cible. Comparer à ce repère est ce que fait le R².`,
    category: "evaluation",
    icon: "Divide"
  },
  {
    term: "Erreur absolue moyenne (MAE)",
    description: `L'erreur absolue moyenne (MAE, Mean Absolute Error) est la moyenne des valeurs absolues des écarts entre prédictions et valeurs réelles.

**Formule :** MAE = (1/n) × Σ |y_i − ŷ_i|.

**Exemple :** avec les écarts −0,5, 0, 2 et 1 de l'entrée MSE, MAE = (0,5 + 0 + 2 + 1) / 4 = 0,875.

**Propriétés :**
• Elle s'exprime dans l'unité de la cible : une MAE de 0,875 signifie que la prédiction s'écarte en moyenne de 0,875 unité.
• Elle donne le même poids à toutes les erreurs : elle est moins sensible aux valeurs aberrantes que la MSE.
• Le modèle qui la minimise prédit la médiane conditionnelle, pas la moyenne.
• Elle n'est pas dérivable en 0, ce qui complique un peu l'optimisation : on l'emploie surtout pour évaluer, ou via la perte de Huber.

**MAE ou RMSE :** on a toujours MAE ≤ RMSE, et un grand écart entre les deux indique quelques grosses erreurs. Le choix suit le coût réel : si une erreur de 10 est aussi grave que deux erreurs de 5, la MAE reflète ce coût ; si les grosses erreurs sont disproportionnellement graves, la RMSE.

**Variante relative :** la MAPE (erreur absolue en pourcentage) est indéfinie quand la valeur réelle est nulle et asymétrique (elle pénalise davantage les surestimations).`,
    category: "evaluation",
    icon: "Divide"
  },
  {
    term: "R² (Coefficient de détermination)",
    description: `Le coefficient de détermination R² compare l'erreur d'un modèle de régression à celle du modèle le plus simple, qui prédit toujours la moyenne des valeurs observées.

**Formule :** R² = 1 − SS_res / SS_tot, avec SS_res = Σ (y_i − ŷ_i)² (erreur du modèle) et SS_tot = Σ (y_i − ȳ)² (erreur de la moyenne).

**Interprétation :** R² = 1 pour des prédictions parfaites, 0 pour un modèle qui ne fait pas mieux que la moyenne, et il devient négatif s'il fait pire (possible sur des données de test, ou sans constante). Pour une régression linéaire avec constante, évaluée sur ses données d'entraînement, c'est la part de la variance de la cible expliquée par le modèle.
\`\`\`python
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

y = np.array([3.0, 5.0, 2.0, 7.0])
pred = np.array([2.5, 5.0, 4.0, 8.0])
print(mean_absolute_error(y, pred), mean_squared_error(y, pred), round(r2_score(y, pred), 3))
print(round(r2_score(y, np.full(4, 10.0)), 3))   # toujours 10 : pire que la moyenne
# Affichage :
# 0.875 1.3125 0.644
# -8.966
\`\`\`

**Limites :**
• Sur l'entraînement, il ne peut qu'augmenter quand on ajoute une variable, même inutile : le R² ajusté pénalise le nombre de variables, et un jeu de test est préférable.
• Il ne dit rien de la validité du modèle : quatre jeux de données très différents partagent le même R² (quartet d'Anscombe).
• Il dépend de la variance de la cible et n'a pas d'unité : l'accompagner d'une erreur (RMSE, MAE).`,
    category: "evaluation",
    icon: "TrendingUp"
  },
  {
    term: "RMSE (Root Mean Square Error)",
    description: `La RMSE (Root Mean Square Error, racine de l'erreur quadratique moyenne) est la racine carrée de la MSE. Elle s'exprime dans la même unité que la variable cible.

**Formule :** RMSE = √[(1/n) × Σ (y_i − ŷ_i)²].

**Exemple :** pour les prédictions de l'entrée MSE, MSE = 1,3125 donc RMSE = √1,3125 ≈ 1,146 : l'erreur typique est d'environ 1,1 unité, avec un poids plus fort pour les grosses erreurs.

**Propriétés :**
• Elle garde la sensibilité de la MSE aux valeurs aberrantes, avec une unité interprétable.
• On a toujours MAE ≤ RMSE ; plus l'écart est grand, plus les erreurs sont inégales.
• Quand les erreurs sont centrées, c'est leur écart type.

**Juger sa valeur :** il n'existe pas de bonne RMSE absolue. Une RMSE de 5 est excellente pour des prix de biens à plusieurs millions d'euros et mauvaise pour une température corporelle en degrés. On la compare à l'écart type de la cible, à la RMSE d'un modèle de référence (voir Baseline Models) et à l'erreur tolérable pour l'usage.

**Comparer des cibles d'échelles différentes :** normaliser (RMSE divisée par la moyenne ou par l'écart type de la cible).

**Pièges :** évaluer sur des données de test, pas sur l'entraînement ; ne pas la comparer entre jeux de données différents sans normalisation.`,
    category: "evaluation",
    icon: "Divide"
  },
  {
    term: "Validation croisée (Cross-Validation)",
    description: `La validation croisée (cross-validation) estime la performance d'un modèle sur des données non vues en l'entraînant et en l'évaluant plusieurs fois sur des découpages différents des mêmes données.

**K-fold :** on découpe les données en k plis de taille égale ; pour chaque pli, on entraîne sur les k − 1 autres et on évalue sur celui-là. La moyenne des k scores estime la performance, leur écart type indique la stabilité.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
modele = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))   # normalisation refaite à chaque pli
plis = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(modele, X, y, cv=plis)
print(scores.round(3), scores.mean().round(3))
# Affichage :
# [0.956 0.974 0.982 1.    0.982] 0.979
\`\`\`

**Variantes :**
• Stratified K-Fold : garde la proportion des classes dans chaque pli (classes déséquilibrées).
• Group K-Fold : garde toutes les lignes d'un même groupe (patient, client) dans le même pli.
• TimeSeriesSplit : l'entraînement précède toujours le test, pour les données temporelles.
• Leave-One-Out : k = n, très coûteux, estimation parfois à forte variance.

**Choix de k :** 5 ou 10 sont des valeurs courantes, un compromis entre biais de l'estimation, variance et coût (k entraînements). Usages : comparer des modèles, régler des hyperparamètres, estimer la performance finale.

**Pièges :**
• Toute étape apprise (normalisation, sélection de variables, imputation) doit être dans le Pipeline pour être refaite dans chaque pli : sinon, fuite de données.
• Régler les hyperparamètres avec la validation croisée qui annonce aussi le score est optimiste : utiliser une validation croisée imbriquée ou un jeu de test final.
• Les plis d'entraînement se recouvrent : l'écart type des scores n'est pas un intervalle de confiance exact.`,
    category: "evaluation",
    icon: "RefreshCw"
  },
  {
    term: "Validation holdout",
    description: `La validation holdout (« mise de côté ») consiste à découper les données une seule fois : une partie pour entraîner le modèle, l'autre, qu'il n'a jamais vue, pour l'évaluer.

**Principe :**
• Découpages courants : 70/30 ou 80/20 (des conventions, pas des règles).
• Avec trois ensembles : entraînement pour ajuster, validation pour choisir (modèle, hyperparamètres), test pour l'évaluation finale, consulté une seule fois.
• Mélanger avant de couper, stratifier pour garder les proportions de classes, couper dans le temps pour une série temporelle, et garder ensemble les lignes liées (même patient).

**Exemple :** le même modèle évalué sur cinq découpages 80/20 donne des scores qui varient d'un découpage à l'autre.
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
modele = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))

# Le même modèle, cinq découpages différents : le score bouge
for graine in range(5):
    X_ent, X_test, y_ent, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=graine)
    print(graine, round(modele.fit(X_ent, y_ent).score(X_test, y_test), 3))
# Affichage :
# 0 0.982
# 1 0.991
# 2 0.982
# 3 0.974
# 4 0.974
\`\`\`

**Avantages :** simple et rapide, un seul entraînement ; adapté aux très gros jeux de données.

**Limites :**
• L'estimation dépend du découpage, surtout sur un petit jeu de données : la validation croisée la stabilise.
• Les données mises de côté ne servent pas à l'entraînement, ce qui coûte cher quand on en a peu.
• Tester plusieurs modèles sur le même ensemble de test et garder le meilleur rend son score optimiste.`,
    category: "evaluation",
    icon: "Divide"
  },
  {
    term: "Bootstrap",
    description: `Le bootstrap (Efron, 1979) estime l'incertitude d'une statistique en rééchantillonnant plusieurs fois, avec remise, les données observées.

**Principe :**
• On tire n observations avec remise dans un échantillon de taille n : certaines apparaissent plusieurs fois, d'autres pas du tout.
• On calcule la statistique d'intérêt (moyenne, médiane, score d'un modèle) sur chacun des B rééchantillons.
• La dispersion des B valeurs approche la variabilité de l'estimateur : son écart type donne l'erreur-type, ses quantiles un intervalle de confiance.
\`\`\`python
import numpy as np

rng = np.random.default_rng(0)
x = np.array([12, 15, 11, 18, 14, 16, 13, 17, 12, 19])

# 2000 rééchantillons de même taille, tirés avec remise
moyennes = [rng.choice(x, size=len(x), replace=True).mean() for _ in range(2000)]
print(x.mean(), np.percentile(moyennes, [2.5, 97.5]).round(1))
# Affichage :
# 14.7 [13.1 16.3]
\`\`\`

**Part des observations tirées :** une observation donnée est tirée au moins une fois avec la probabilité 1 − (1 − 1/n)^n, qui tend vers 1 − 1/e ≈ 0,632. Chaque rééchantillon contient donc environ 63 % des observations distinctes ; les autres (≈ 37 %) forment l'échantillon « hors sac » (out-of-bag), utilisable comme jeu de validation.

**Usages en apprentissage :**
• Intervalle de confiance d'une métrique : on rééchantillonne le jeu de test et on recalcule le score.
• Bagging et forêts aléatoires : chaque modèle est entraîné sur un rééchantillon.
• Statistiques sans formule simple (médiane, AUC, rapports).

**Variantes :** bootstrap paramétrique (tirage dans une loi ajustée), par blocs (séries temporelles), intervalles percentile ou BCa (corrigés du biais et de l'asymétrie).

**Limites :** il suppose des observations indépendantes et un échantillon représentatif ; il est peu fiable pour de très petits échantillons et pour des statistiques d'extrêmes (maximum). B doit être assez grand pour que le résultat soit stable (plusieurs centaines à quelques milliers).`,
    category: "evaluation",
    icon: "Shuffle"
  },
  {
    term: "Biais-Variance Tradeoff",
    description: `Le compromis biais-variance décrit les deux sources d'erreur d'un modèle, qui évoluent en sens contraire quand on fait varier sa complexité.

**Décomposition (erreur quadratique, en un point x) :** erreur attendue = biais² + variance + bruit irréductible.
• Biais : écart entre la prédiction moyenne du modèle (sur de nombreux jeux d'entraînement possibles) et la vraie valeur. Un biais élevé correspond au sous-apprentissage : le modèle est trop simple.
• Variance : sensibilité de la prédiction au jeu d'entraînement. Une variance élevée correspond au sur-apprentissage : le modèle suit le bruit.
• Bruit : variabilité propre aux données, qu'aucun modèle ne supprime.

Comme des flèches : groupées mais loin de la cible, c'est un biais élevé ; dispersées autour de la cible, une variance élevée.

**Exemple :** un polynôme ajusté à 15 points bruités (colonnes : degré, erreur d'entraînement, erreur de test). Degré 1 : deux erreurs élevées (biais). Degré 14 : erreur d'entraînement nulle, erreur de test énorme (variance).
\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

rng = np.random.default_rng(2)
x = np.linspace(0, 1, 30).reshape(-1, 1)
y = np.sin(2 * np.pi * x).ravel() + rng.normal(0, 0.3, 30)
ent, test = np.arange(0, 30, 2), np.arange(1, 29, 2)   # points d'entraînement et points intermédiaires

for degre in [1, 3, 8, 14]:
    modele = make_pipeline(PolynomialFeatures(degre), LinearRegression()).fit(x[ent], y[ent])
    erreur_ent = mean_squared_error(y[ent], modele.predict(x[ent]))
    erreur_test = mean_squared_error(y[test], modele.predict(x[test]))
    print(degre, round(erreur_ent, 3), round(erreur_test, 3))
# Affichage :
# 1 0.273 0.296
# 3 0.08 0.13
# 8 0.041 0.153
# 14 0.0 6.958
\`\`\`

**Agir :**
• Biais trop élevé : modèle plus riche, variables supplémentaires, moins de régularisation, boosting.
• Variance trop élevée : plus de données, régularisation, modèle plus simple, bagging.

**Limite :** pour de très grands réseaux, l'erreur de test peut redescendre au-delà du seuil d'interpolation (double descente, Belkin et al., 2019) : la courbe en U n'est pas universelle.`,
    category: "evaluation",
    icon: "Gauge"
  },
  {
    term: "Courbe d'apprentissage (Learning Curve)",
    description: `La courbe d'apprentissage trace le score d'un modèle sur l'entraînement et sur la validation en fonction du nombre d'exemples d'entraînement. Elle sert à diagnostiquer le sous-apprentissage ou le sur-apprentissage et à juger l'intérêt de collecter plus de données.

**Construction :** pour chaque taille t, on entraîne sur t exemples, puis on mesure le score sur ces exemples et sur un jeu de validation (moyenne sur plusieurs plis).
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import learning_curve
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
modele = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
tailles, train, val = learning_curve(modele, X, y, train_sizes=[0.1, 0.3, 0.6, 1.0], cv=5)
print(tailles)
print(train.mean(axis=1).round(3))
print(val.mean(axis=1).round(3))
# Affichage :
# [ 45 136 273 455]
# [1.    0.987 0.984 0.989]
# [0.793 0.944 0.967 0.981]
\`\`\`

**Lecture :**
• Deux courbes proches et faibles : biais élevé (sous-apprentissage). Plus de données n'aidera pas ; il faut un modèle plus expressif ou de meilleures variables.
• Score d'entraînement élevé, score de validation plus bas, écart qui se réduit lentement : variance élevée (sur-apprentissage). Plus de données, de la régularisation ou un modèle plus simple aident.
• Courbes qui se rejoignent à un niveau satisfaisant : le modèle exploite bien les données disponibles.
• Courbe de validation encore en hausse à la taille maximale : des données supplémentaires l'amélioreraient probablement.

Dans l'exemple, le score de validation passe de 0,79 à 0,98 quand la taille augmente, et l'écart avec l'entraînement se resserre.

**Précautions :** stratifier ou grouper les plis selon les données, fixer les graines, ne pas extrapoler loin au-delà des tailles mesurées.`,
    category: "evaluation",
    icon: "TrendingUp"
  },
  {
    term: "Courbe de validation (Validation Curve)",
    description: `La courbe de validation trace le score d'un modèle sur l'entraînement et sur la validation en fonction d'un seul hyperparamètre. Elle montre où le modèle passe du sous-apprentissage au sur-apprentissage.

**Exemple :** profondeur maximale d'un arbre de décision (validation croisée à 5 plis ; colonnes : profondeur, score d'entraînement, score de validation).
\`\`\`python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import validation_curve
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
profondeurs = [1, 2, 3, 5, 8, 12]
train, val = validation_curve(DecisionTreeClassifier(random_state=0), X, y,
                              param_name="max_depth", param_range=profondeurs, cv=5)
for p, a, b in zip(profondeurs, train.mean(axis=1), val.mean(axis=1)):
    print(p, round(a, 3), round(b, 3))
# Affichage :
# 1 0.924 0.9
# 2 0.952 0.928
# 3 0.974 0.917
# 5 0.991 0.916
# 8 1.0 0.916
# 12 1.0 0.917
\`\`\`
Le score d'entraînement monte jusqu'à 1 : l'arbre apprend les données par cœur. Le score de validation est maximal pour une profondeur de 2, puis stagne autour de 0,92.

**Lecture, avec un score (plus haut = mieux) :**
• À gauche (modèle trop contraint) : les deux scores sont bas, sous-apprentissage.
• À droite (modèle trop libre) : le score d'entraînement reste haut, celui de validation baisse ou stagne, sur-apprentissage.
• On retient la zone où le score de validation est maximal, ou le modèle le plus simple dont le score est à moins d'une erreur standard du meilleur.

Avec une erreur plutôt qu'un score, la courbe prend la forme d'un U.

**Hyperparamètres typiques :** profondeur d'un arbre, k de k-NN, force de régularisation (alpha de Ridge, C d'une SVM), gamma d'un noyau RBF, nombre d'arbres.

**Limite :** un seul hyperparamètre varie, les autres restant fixes ; pour plusieurs, utiliser GridSearchCV ou RandomizedSearchCV. À ne pas confondre avec la courbe d'apprentissage, dont l'abscisse est le nombre d'exemples.`,
    category: "evaluation",
    icon: "Settings"
  },
  {
    term: "Test statistique",
    description: `Un test statistique évalue si une différence observée (entre deux modèles, deux groupes ou une valeur de référence) peut s'expliquer par le seul hasard de l'échantillonnage.

**Principe :** on pose une hypothèse nulle H0 (pas de différence réelle), puis on calcule une statistique de test et la p-valeur : la probabilité d'observer un résultat au moins aussi extrême si H0 était vraie. Une p-valeur sous un seuil α fixé à l'avance (souvent 0,05) conduit à rejeter H0 (voir Significance Testing).

**Comparer deux modèles :**
• Mêmes données de test, classifieurs : test de McNemar, qui s'appuie sur les exemples où les deux modèles ne donnent pas la même réponse.
• Scores par plis de validation croisée : test t apparié, mais les plis ne sont pas indépendants, ce qui rend le test trop optimiste (Dietterich, 1998) ; des corrections existent (Nadeau et Bengio, 2003).
• Plusieurs jeux de données : test de Wilcoxon des rangs signés pour deux modèles, test de Friedman au-delà (Demšar, 2006).

**À savoir :**
• Une différence significative n'est pas forcément importante : donner aussi la taille de l'effet.
• Comparer beaucoup de modèles multiplie les chances de faux positifs : corriger les comparaisons multiples (Bonferroni, Holm).
• Ne pas rejeter H0 ne prouve pas l'absence de différence : l'échantillon peut manquer de puissance (voir Power Analysis).`,
    category: "evaluation",
    icon: "BarChart3"
  },
  {
    term: "Intervalles de confiance",
    description: `Un intervalle de confiance donne une plage de valeurs plausibles pour une quantité inconnue (par exemple la vraie exactitude d'un modèle) à partir d'un échantillon, avec un niveau de confiance fixé, souvent 95 %.

**Interprétation correcte :** si l'on répétait l'expérience avec de nouveaux échantillons en construisant chaque fois l'intervalle de la même façon, environ 95 % de ces intervalles contiendraient la vraie valeur. Ce n'est pas la probabilité que la vraie valeur se trouve dans l'intervalle calculé une fois.

**Exemple :** 180 bonnes réponses sur 200 exemples de test, soit une exactitude de 0,90. Intervalle approché à 95 % : p ± 1,96 × √(p (1 − p) / n).
\`\`\`python
from math import sqrt

# 180 bonnes réponses sur 200 exemples de test : exactitude 0,90
n, ok = 200, 180
p = ok / n
marge = 1.96 * sqrt(p * (1 - p) / n)
print(round(p - marge, 3), round(p + marge, 3))
# Affichage :
# 0.858 0.942
\`\`\`
Avec dix fois plus d'exemples, la marge serait divisée par √10, soit environ 3.

**Méthodes :**
• Formule normale ci-dessus : correcte si n est assez grand et p pas trop proche de 0 ou de 1 ; sinon, intervalle de Wilson.
• Bootstrap : rééchantillonner le jeu de test pour une métrique quelconque (F1, AUC).
• Validation croisée : l'écart type des scores renseigne sur la variabilité, sans donner un intervalle exact.

**Bon usage :** donner l'intervalle avec la métrique. Si les intervalles de deux modèles se recouvrent largement, la différence est probablement dans la marge d'erreur ; pour trancher, utiliser un test apparié sur les mêmes données.`,
    category: "evaluation",
    icon: "Target"
  },
  {
    term: "Métriques métier (Business Metrics)",
    description: `Les métriques métier mesurent l'effet d'un modèle sur l'objectif de l'organisation (coût évité, temps gagné, satisfaction, chiffre d'affaires) plutôt que sa qualité statistique seule.

**Pourquoi :** une bonne métrique technique ne suffit pas. Un modèle précis peut ne rien changer à la décision, ou coûter plus cher qu'il ne rapporte.

**Exemple (chiffres fictifs) :** dans une détection de fraude, un faux négatif (fraude manquée) coûte 10 fois plus qu'un faux positif (vérification manuelle inutile).
• Modèle A : 20 FP et 5 FN, coût = 20 × 1 + 5 × 10 = 70.
• Modèle B : 60 FP et 2 FN, coût = 60 × 1 + 2 × 10 = 80.

B a le meilleur rappel, mais A coûte moins cher. Le seuil de décision se règle de la même façon : on retient celui qui minimise le coût total attendu.

**Démarche :**
• Traduire les erreurs en coûts ou en gains avec les équipes concernées (matrice de coûts).
• Choisir une métrique technique corrélée au résultat métier, et suivre les deux.
• Mesurer l'effet réel par une expérience contrôlée (voir A/B Testing), car un gain hors ligne ne garantit pas un gain en production.

**Pièges :**
• Des coûts estimés à la louche : montrer la sensibilité du résultat à ces hypothèses.
• Un indicateur qui devient un objectif se déforme (loi de Goodhart).
• Effets indirects : charge de travail de la vérification manuelle, équité, confiance des utilisateurs.`,
    category: "evaluation",
    icon: "Gauge"
  },
  {
    term: "A/B Testing",
    description: `Un test A/B compare deux versions (A, le témoin, et B, la variante) en les présentant à des groupes d'utilisateurs tirés au hasard, pour savoir si la différence observée sur une métrique est réelle.

**Étapes :**
• Définir à l'avance la métrique principale (taux de conversion, temps passé) et l'effet minimal qui compte.
• Calculer la taille d'échantillon nécessaire (voir Power Analysis).
• Répartir les utilisateurs au hasard entre A et B : les groupes ne diffèrent alors que par la version.
• Attendre la fin prévue, puis appliquer un test adapté (deux proportions, test t).

**Exemple (chiffres fictifs) :** 120 achats sur 2 400 visiteurs avec A, 150 sur 2 400 avec B (taux de A, taux de B, z, p-valeur).
\`\`\`python
from math import sqrt
from scipy.stats import norm

# Exemple fictif : 120 achats sur 2400 visiteurs (A), 150 sur 2400 (B)
a, b, n = 120, 150, 2400
p_a, p_b, p = a / n, b / n, (a + b) / (2 * n)
z = (p_b - p_a) / sqrt(p * (1 - p) * 2 / n)
print(round(p_a, 4), round(p_b, 4), round(z, 2), round(2 * (1 - norm.cdf(abs(z))), 3))
# Affichage :
# 0.05 0.0625 1.88 0.06
\`\`\`
La variante gagne 1,25 point (5 % contre 6,25 %), mais p ≈ 0,06 : au seuil de 5 %, on ne peut pas écarter le hasard. Il faut plus de visiteurs.

**Pièges :**
• S'arrêter dès que p passe sous 0,05 en regardant les résultats en continu gonfle le taux de faux positifs.
• Tester beaucoup de variantes ou de métriques : corriger les comparaisons multiples.
• Effets de nouveauté, de saison, d'interférence entre utilisateurs.

En apprentissage automatique, le test A/B compare un nouveau modèle à l'ancien en production, car les métriques hors ligne ne prédisent pas toujours l'effet réel.`,
    category: "evaluation",
    icon: "GitBranch"
  },
  {
    term: "Significance Testing",
    description: `Le test de significativité évalue si un résultat observé est compatible avec le seul hasard, en le comparant à ce qu'on obtiendrait si l'effet recherché n'existait pas.

**Démarche :**
• Hypothèse nulle H0 (pas d'effet, pas de différence) et hypothèse alternative H1.
• Seuil α fixé avant l'analyse, par convention 0,05 : c'est le risque accepté de rejeter H0 à tort (erreur de type I).
• p-valeur : probabilité, si H0 est vraie, d'obtenir un résultat au moins aussi extrême que celui observé.
• Si p ≤ α, on rejette H0 : le résultat est dit statistiquement significatif.

**Ce que la p-valeur n'est pas :**
• Ce n'est pas la probabilité que H0 soit vraie.
• Ce n'est pas la taille ni l'importance de l'effet : avec assez de données, une différence minuscule devient significative.
• Une p-valeur supérieure à α ne prouve pas l'absence d'effet : le test peut manquer de puissance.

**Erreurs :** type I (faux positif, probabilité α) et type II (faux négatif, probabilité β). La puissance vaut 1 − β.

**Bonnes pratiques :**
• Donner la taille d'effet et un intervalle de confiance avec la p-valeur.
• Corriger les comparaisons multiples (Bonferroni, Holm, Benjamini-Hochberg).
• Fixer l'analyse à l'avance : essayer plusieurs analyses et ne garder que la significative (p-hacking) invalide le test.
• Choisir un test dont les hypothèses sont vérifiées (indépendance, normalité, ou test non paramétrique).`,
    category: "evaluation",
    icon: "CheckCircle"
  },
  {
    term: "Power Analysis",
    description: `L'analyse de puissance détermine, avant une expérience, le nombre d'observations nécessaire pour détecter un effet d'une taille donnée avec une probabilité fixée.

**Quatre quantités liées** (en connaître trois donne la quatrième) :
• la taille de l'effet à détecter (par exemple le d de Cohen, différence de moyennes divisée par l'écart type) ;
• le seuil α (risque de faux positif), souvent 0,05 ;
• la puissance 1 − β (probabilité de détecter l'effet s'il existe), souvent fixée à 0,80 par convention ;
• la taille d'échantillon n.

**Exemple :** pour comparer deux groupes avec un effet moyen (d = 0,5), α = 0,05 et une puissance de 0,80, il faut environ 63 observations par groupe (approximation normale).
\`\`\`python
from scipy.stats import norm

# Deux groupes, comparaison de moyennes, effet d = différence / écart-type
d, alpha, puissance = 0.5, 0.05, 0.80
n = 2 * ((norm.ppf(1 - alpha / 2) + norm.ppf(puissance)) / d) ** 2
print(round(n, 1))
# Affichage :
# 62.8
\`\`\`
Un effet deux fois plus petit (d = 0,25) demande environ quatre fois plus d'observations, soit près de 251 par groupe.

**Pourquoi la faire :**
• Un échantillon trop petit manque des effets réels, et les résultats « positifs » qu'il donne sont souvent surestimés.
• Un échantillon trop grand gaspille du temps et des ressources.
• Elle se calcule avant de collecter les données, pas après avec l'effet observé (la puissance a posteriori est peu informative).

**Piège :** la taille d'effet attendue est une hypothèse. La fixer à partir de la plus petite différence qui compterait en pratique, ou d'études préalables, pas à partir de ce qui donne un n commode.

**Outils :** statsmodels (TTestIndPower), G*Power, ou des formules pour deux proportions dans le cas d'un test A/B.`,
    category: "evaluation",
    icon: "Zap"
  },
  {
    term: "Métriques de ranking",
    description: `Les métriques de ranking évaluent la qualité d'un classement de résultats (moteur de recherche, recommandation) : il ne suffit pas de trouver les bons éléments, il faut les placer en tête.

**Principales métriques :**
• Precision@K et Recall@K : précision ou rappel parmi les K premiers résultats.
• MRR (Mean Reciprocal Rank) : moyenne, sur les requêtes, de 1 / rang du premier résultat pertinent (rang 1 : 1 ; rang 4 : 0,25).
• MAP (Mean Average Precision) : moyenne, sur les requêtes, de la précision moyenne de chaque classement.
• NDCG (Normalized Discounted Cumulative Gain) : gère des niveaux de pertinence (0, 1, 2, 3...) et décote les résultats lointains. DCG = Σ pertinence_i / log2(i + 1), puis NDCG = DCG / DCG du classement idéal, entre 0 et 1.

**Exemple :** cinq documents notés de 0 à 3. Les deux documents de pertinence 3 sont classés en 1re et en 5e position, loin du classement idéal.
\`\`\`python
import numpy as np
from sklearn.metrics import ndcg_score

pertinence = np.array([[3, 2, 3, 0, 1]])        # pertinence réelle de 5 documents
score = np.array([[0.9, 0.8, 0.1, 0.7, 0.2]])   # score donné par le modèle
print(round(ndcg_score(pertinence, score), 3))
# Affichage :
# 0.926
\`\`\`

**Choisir :** Precision@K ou MRR quand seul le début de la liste compte ; NDCG quand la pertinence est graduée ; MAP pour une pertinence binaire sur tout le classement.

**Remarques :** les métriques de classification ordinaires ignorent l'ordre. Les jugements de pertinence (annotateurs, clics) sont bruités et sujets au biais de position. En production, on les complète par des tests A/B.`,
    category: "evaluation",
    icon: "Star"
  },
  {
    term: "Métriques de clustering",
    description: `Les métriques de clustering évaluent la qualité d'un regroupement. Comme il n'existe généralement pas de vérité terrain, on distingue deux familles.

**Métriques internes (sans étiquettes) :**
• Inertie (somme des carrés intra-cluster) : somme des carrés des distances de chaque point au centre de son cluster. Elle baisse toujours quand k augmente : on cherche un « coude », mais elle ne suffit pas à choisir k.
• Coefficient de silhouette : s = (b − a) / max(a, b), où a est la distance moyenne d'un point aux autres points de son cluster et b sa distance moyenne au cluster voisin le plus proche. Il va de −1 à 1 : près de 1, le point est bien classé, négatif, il est probablement mal placé.
• Indices de Davies-Bouldin (plus bas = mieux) et de Calinski-Harabasz (plus haut = mieux).

**Métriques externes (avec étiquettes connues) :** indice de Rand ajusté (ARI : 1 = partitions identiques, proche de 0 = hasard) et information mutuelle normalisée (NMI).

**Exemple :** k-means sur les iris (colonnes : k, inertie, silhouette, ARI par rapport aux espèces).
\`\`\`python
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris
from sklearn.metrics import adjusted_rand_score, silhouette_score

X, y = load_iris(return_X_y=True)
for k in range(2, 6):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    print(k, round(km.inertia_, 1), round(silhouette_score(X, km.labels_), 3), round(adjusted_rand_score(y, km.labels_), 3))
# Affichage :
# 2 152.3 0.681 0.54
# 3 78.9 0.553 0.73
# 4 57.2 0.498 0.65
# 5 46.4 0.489 0.608
\`\`\`
La silhouette est maximale pour k = 2 (les setosa sont bien séparées des deux autres espèces), l'ARI pour k = 3, le nombre d'espèces : elles ne mesurent pas la même chose.

**Précautions :** ces métriques favorisent les clusters compacts et sphériques. Elles ne remplacent pas l'interprétation des groupes par un connaisseur du domaine.`,
    category: "evaluation",
    icon: "Layers"
  },
  {
    term: "Métriques de génération de texte",
    description: `Les métriques de génération de texte comparent un texte produit par un modèle (traduction, résumé, réponse) à une ou plusieurs références, ou mesurent la qualité du modèle de langage lui-même.

**Avec références :**
• BLEU (Papineni et al., 2002) : part des n-grammes du texte généré présents dans les références, avec une pénalité de brièveté. Conçue pour la traduction, elle se calcule sur un corpus plus que sur une phrase.
• ROUGE (Lin, 2004) : orientée rappel, elle compte les n-grammes (ROUGE-N) ou la plus longue sous-séquence commune (ROUGE-L) de la référence retrouvés dans le résumé généré.
• BERTScore (Zhang et al., 2020) : compare des représentations de mots issues d'un modèle, ce qui reconnaît des reformulations.

**Pour le modèle de langage :** la perplexité est l'exponentielle de l'entropie croisée moyenne par unité : exp(−(1/N) Σ log P(unité_i | contexte)). Plus elle est basse, mieux le modèle prédit un texte. Elle ne se compare qu'entre modèles qui utilisent le même découpage en unités (tokens) sur les mêmes textes.

**Limites :**
• Ces métriques mesurent un recouvrement de mots, pas la vérité, la cohérence ou l'utilité : un texte fluide et faux peut obtenir un bon score.
• Une bonne réponse qui s'écarte de la référence est pénalisée.
• Elles corrèlent imparfaitement avec le jugement humain, surtout en génération ouverte.
• On les complète par une évaluation humaine (voir Human Evaluation), des vérifications factuelles et, avec prudence, un modèle utilisé comme juge.`,
    category: "evaluation",
    icon: "MessageSquare"
  },
  {
    term: "Fairness Metrics",
    description: `Les métriques d'équité comparent le comportement d'un modèle selon des groupes de personnes définis par un attribut sensible (sexe, âge, origine...) pour repérer des écarts de traitement.

**Principales définitions :**
• Parité démographique : même taux de prédictions positives dans chaque groupe.
• Égalité des chances (Hardt et al., 2016) : même taux de vrais positifs (rappel) dans chaque groupe.
• Égalisation des cotes (equalized odds) : mêmes taux de vrais positifs et de faux positifs.
• Calibration par groupe : à score égal, même probabilité réelle d'être positif.

**Exemple (données fictives) :** taux de prédictions positives et rappel par groupe.
\`\`\`python
import numpy as np

groupe = np.array(["A"] * 6 + ["B"] * 6)
y_reel = np.array([1, 1, 1, 0, 0, 0,   1, 1, 0, 0, 0, 0])
y_pred = np.array([1, 1, 0, 1, 0, 0,   1, 0, 0, 0, 0, 0])

for g in ["A", "B"]:
    m = groupe == g
    print(g, y_pred[m].mean().round(2), y_pred[m & (y_reel == 1)].mean().round(2))
# Affichage :
# A 0.5 0.67
# B 0.17 0.5
\`\`\`
Le groupe A reçoit 50 % de prédictions positives contre 17 % pour B, et son rappel est de 0,67 contre 0,5 : ni la parité démographique ni l'égalité des chances ne sont respectées.

**Limites :**
• Quand les taux de base diffèrent entre groupes, ces critères sont en général incompatibles entre eux (Kleinberg et al., 2016 ; Chouldechova, 2017). Choisir le critère adapté au contexte est une décision éthique et juridique autant que technique.
• Un bon score n'établit pas l'absence de discrimination : les étiquettes peuvent elles-mêmes refléter des biais.
• Mesurer suppose de disposer de l'attribut sensible, ce qui pose des questions de protection des données.
• Les groupes, surtout croisés, peuvent être petits : donner des intervalles de confiance.

Des bibliothèques comme Fairlearn ou AIF360 implémentent ces métriques.`,
    category: "evaluation",
    icon: "Users"
  },
  {
    term: "Robustness Testing",
    description: `Le test de robustesse évalue si un modèle conserve ses performances quand les données s'écartent de celles de l'entraînement : bruit, valeurs manquantes, changement de distribution, entrées malveillantes.

**Types de perturbations :**
• Bruit et corruptions : bruit gaussien, flou, compression, fautes de frappe.
• Changement de distribution : autre période, autre site, autre population, autre capteur.
• Valeurs manquantes ou aberrantes.
• Attaques adverses : perturbations calculées pour tromper le modèle.
• Sous-groupes rares et cas limites.

**Exemple :** on ajoute au jeu de test un bruit gaussien d'écart type croissant (en écarts types des variables) et on mesure l'exactitude (colonnes : bruit, exactitude).
\`\`\`python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
X = StandardScaler().fit_transform(X)
X_ent, X_test, y_ent, y_test = train_test_split(X, y, stratify=y, random_state=0)
modele = LogisticRegression(max_iter=1000).fit(X_ent, y_ent)

rng = np.random.default_rng(0)
for bruit in [0.0, 0.5, 1.0, 2.0]:
    X_bruite = X_test + rng.normal(0, bruit, X_test.shape)
    print(bruit, round(modele.score(X_bruite, y_test), 3))
# Affichage :
# 0.0 0.958
# 0.5 0.958
# 1.0 0.902
# 2.0 0.797
\`\`\`
L'exactitude passe de 0,958 à 0,797 : le modèle est sensible à un bruit d'amplitude comparable à celle des variables.

**Méthode :**
• Définir les perturbations plausibles dans l'usage réel et la perte de performance acceptable.
• Tracer le score en fonction de l'intensité de la perturbation.
• Évaluer par sous-groupes, pas seulement en moyenne.
• Surveiller en production la dérive des données.

**Pour améliorer :** augmentation de données, entraînement avec bruit, régularisation, ensemble de modèles, entraînement adverse.`,
    category: "evaluation",
    icon: "Shield"
  },
  {
    term: "Ablation Study",
    description: `Une étude d'ablation mesure la contribution de chaque composant d'un système en le retirant, ou en le remplaçant par une version simple, puis en comparant les performances.

**Principe :**
• Partir du système complet et d'un protocole d'évaluation fixé (données, métrique, graines).
• Retirer ou neutraliser un élément à la fois : une couche, un groupe de variables, une étape de prétraitement, une perte auxiliaire, un module d'attention.
• Réentraîner dans les mêmes conditions et noter la variation du score.
• Un élément dont le retrait ne change pas le score est peut-être inutile.

**Exemple :** pour un modèle de classification de texte, on compare le modèle complet à trois variantes (sans lemmatisation, sans variables de longueur, sans couche d'attention) et on rapporte la baisse d'exactitude de chacune.

**Précautions :**
• Répéter avec plusieurs graines et donner l'écart type : de petites différences peuvent n'être que du hasard.
• Les composants interagissent : retirer A puis B peut coûter plus ou moins que la somme des deux pertes. Tester aussi des retraits combinés.
• Réajuster les hyperparamètres de chaque variante, sinon on mesure surtout un désajustement.
• Une ablation faite sur un jeu de données ne se généralise pas automatiquement.

**Origine du terme :** en neurosciences, l'ablation est le retrait d'une zone pour étudier sa fonction ; la démarche est la même, appliquée à un modèle.`,
    category: "evaluation",
    icon: "TrendingDown"
  },
  {
    term: "Baseline Models",
    description: `Un modèle de référence (baseline) est un modèle très simple dont le score sert de point de comparaison : un modèle plus complexe n'a d'intérêt que s'il fait nettement mieux.

**Exemples de références :**
• Classification : toujours prédire la classe majoritaire, ou une règle métier simple.
• Régression : toujours prédire la moyenne ou la médiane de l'entraînement.
• Série temporelle : répéter la dernière valeur (prévision naïve) ou la valeur de la même période l'an passé (naïve saisonnière).
• Un modèle linéaire (régression linéaire ou logistique) avec peu de variables.
• La pratique actuelle de l'organisation (règle, processus manuel).

**Exemple :** 1 000 exemples dont 5 % de positifs, et un DummyClassifier qui prédit toujours « négatif ».
\`\`\`python
import numpy as np
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, recall_score

y = np.array([0] * 950 + [1] * 50)       # 5 % de cas positifs
X = np.zeros((1000, 1))                  # aucune information utile
modele = DummyClassifier(strategy="most_frequent").fit(X, y)
pred = modele.predict(X)
print(accuracy_score(y, pred), recall_score(y, pred))
# Affichage :
# 0.95 0.0
\`\`\`
Son exactitude est de 0,95 et son rappel de 0 : tout modèle qui n'atteint pas 95 % d'exactitude fait moins bien que ne rien faire.

**Pourquoi c'est utile :**
• Situer un score : 0,90 est excellent ou médiocre selon la base.
• Détecter une erreur de mise en place (fuite de données, mauvaise cible) quand un modèle complexe ne bat pas la base.
• Décider si la complexité (coût, délai, explicabilité) est justifiée.

**En pratique :** scikit-learn propose DummyClassifier et DummyRegressor ; évaluer la base avec les mêmes découpages et les mêmes métriques que le modèle étudié.`,
    category: "evaluation",
    icon: "BarChart3"
  },
  {
    term: "Human Evaluation",
    description: `L'évaluation humaine fait juger la qualité des sorties d'un modèle par des personnes. Elle est nécessaire quand l'objectif est subjectif ou difficile à mesurer automatiquement : fluidité, pertinence et utilité d'un texte généré, qualité d'une traduction ou d'une image, ton d'un assistant.

**Formes courantes :**
• Notation absolue : une échelle (par exemple de 1 à 5) par critère (fluidité, exactitude, utilité).
• Comparaison par paires : l'évaluateur choisit la meilleure de deux sorties, souvent sans savoir quel modèle a produit laquelle (évaluation en aveugle). C'est plus facile à juger qu'une note.
• Classement, ou annotation d'erreurs (erreurs factuelles, omissions, propos toxiques).

**Qualité de l'évaluation :**
• Consignes écrites, exemples d'étalonnage, plusieurs évaluateurs par sortie, ordre de présentation aléatoire.
• Accord entre évaluateurs : kappa de Cohen (2 évaluateurs), kappa de Fleiss ou alpha de Krippendorff (plus de deux), qui retirent l'accord dû au hasard.
\`\`\`python
from sklearn.metrics import cohen_kappa_score

a = [1, 1, 0, 1, 0, 0, 1, 0, 1, 1]
b = [1, 0, 0, 1, 0, 1, 1, 0, 1, 1]
accord = sum(x == y for x, y in zip(a, b)) / len(a)
print(accord, round(cohen_kappa_score(a, b), 3))
# Affichage :
# 0.8 0.583
\`\`\`
Ici les évaluateurs sont d'accord dans 80 % des cas, mais le kappa n'est que de 0,583.

**Limites :**
• Coûteuse, lente, difficile à répéter à l'identique.
• Subjective : biais de position, préférence pour les réponses longues ou assurées, fatigue.
• Des évaluateurs non spécialistes jugent mal les erreurs factuelles dans les domaines techniques.
• Un modèle de langage peut servir de juge pour réduire le coût, mais il a ses propres biais : le valider sur un échantillon noté par des humains.`,
    category: "evaluation",
    icon: "Users"
  }
];