/**
 * Deep Learning and Neural Networks
 * Neural network architectures, training techniques, and deep learning concepts
 */

import { GlossaryEntry } from './types';

export const deepLearningTerms: GlossaryEntry[] = [
  {
    term: "Deep Learning",
    description: `Le deep learning (apprentissage profond) est une famille de méthodes d'apprentissage automatique fondée sur des réseaux de neurones à nombreuses couches, qui apprennent eux-mêmes les représentations utiles à partir de données brutes.

**Principe :**
• Chaque couche transforme la sortie de la précédente. Dans un réseau de vision, les premières couches réagissent à des contours et à des couleurs, les suivantes à des motifs et à des parties d'objets, les dernières à des objets entiers.
• Cette hiérarchie remplace une grande part de l'ingénierie manuelle des variables (feature engineering) des méthodes classiques.
• L'entraînement ajuste des millions de paramètres par descente de gradient, grâce à la rétropropagation.

**Repères :** perceptron (Rosenblatt, 1958), rétropropagation (Rumelhart, Hinton et Williams, 1986), réseau convolutif LeNet (1998), AlexNet qui remporte le concours ImageNet en 2012 en s'appuyant sur des GPU, Transformer (Vaswani et al., 2017).

**Domaines :** images, son, texte, séries temporelles, jeux, génération de contenu.

**Conditions et limites :**
• Il demande en général beaucoup de données et de calcul (GPU ou TPU) ; le transfert d'apprentissage réduit ce besoin.
• Sur des données tabulaires, les méthodes à base d'arbres restent souvent compétitives (voir Boosting de gradient).
• Les modèles sont difficiles à interpréter et sensibles aux changements de distribution des données.
• Le lien avec le cortex visuel ou les neurones biologiques est une inspiration lointaine, pas une imitation.`,
    category: "deep-learning",
    icon: "Brain"
  },
  {
    term: "Réseaux de neurones (Neural Networks)",
    description: `Un réseau de neurones artificiels est un modèle composé d'unités simples, les neurones, organisées en couches et reliées par des poids ajustables. Il apprend une fonction à partir d'exemples.

**Le neurone artificiel :** il calcule une somme pondérée de ses entrées plus un biais, z = Σ w_i x_i + b, puis applique une fonction d'activation non linéaire : a = φ(z). Les poids w et le biais b sont les paramètres appris.

**Architecture :** une couche d'entrée, une ou plusieurs couches cachées et une couche de sortie. Chaque couche calcule φ(W x + b) à partir de la précédente.

**Apprentissage :** une fonction de perte mesure l'écart entre prédictions et réalité ; la rétropropagation calcule son gradient par rapport aux poids ; la descente de gradient ajuste les poids.

**Familles principales :** perceptron multicouche (MLP), réseaux convolutifs (images), récurrents (séquences), Transformers (texte et bien d'autres données), autoencodeurs, GAN.

**Approximation universelle :** un réseau à une couche cachée assez large peut approcher n'importe quelle fonction continue sur un domaine borné (Cybenko, 1989 ; Hornik, 1991). C'est un résultat d'existence : il ne dit ni combien de neurones il faut, ni que l'entraînement trouvera ces poids.

**Précision :** un neurone artificiel est une formule simple, pas un modèle fidèle de la cellule nerveuse. L'analogie biologique est une source d'inspiration.`,
    category: "deep-learning",
    icon: "Network"
  },
  {
    term: "Perceptron multicouche (Multi-Layer Perceptron - MLP)",
    description: `Le perceptron multicouche (MLP) est un réseau de neurones « avant » (feedforward) : une couche d'entrée, une ou plusieurs couches cachées entièrement connectées, et une couche de sortie. L'information circule dans un seul sens, sans boucle.

**Architecture :** chaque neurone reçoit toutes les sorties de la couche précédente (couches denses, ou fully connected). Les activations non linéaires des couches cachées sont indispensables : sans elles, empiler des couches reviendrait à une seule transformation linéaire.

**Pourquoi plusieurs couches :** un perceptron à une seule couche (Rosenblatt, 1958) ne sépare que des classes linéairement séparables et ne peut pas représenter le XOR (Minsky et Papert, 1969). Une couche cachée suffit. Voici un réseau à deux neurones cachés dont les poids sont choisis à la main :
\`\`\`python
import numpy as np

relu = lambda z: np.maximum(0, z)
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])

# Deux neurones cachés aux poids choisis à la main, puis un neurone de sortie
cachee = relu(X @ np.array([[1, 1], [1, 1]]) + np.array([0, -1]))
print(cachee @ np.array([1, -2]))
# Affichage :
# [0 1 1 0]
\`\`\`
Le résultat est bien le XOR des entrées (0,0), (0,1), (1,0), (1,1).

**Entraînement :** rétropropagation et descente de gradient. Avec scikit-learn : MLPClassifier et MLPRegressor.

**Usages et limites :**
• Adapté aux données tabulaires et comme brique finale d'architectures plus larges.
• Ignore la structure spatiale ou séquentielle des entrées : une image aplatie perd ses voisinages.
• Beaucoup de paramètres : risque de surapprentissage, d'où la régularisation (dropout, pénalité L2, arrêt précoce).`,
    category: "deep-learning",
    icon: "Layers"
  },
  {
    term: "Rétropropagation (Backpropagation)",
    description: `La rétropropagation (backpropagation) est l'algorithme qui calcule le gradient de la fonction de perte par rapport à tous les poids d'un réseau de neurones. C'est la règle de dérivation en chaîne appliquée dans l'ordre inverse du calcul.

**Une itération d'entraînement :**
1. Passe avant : calcul des sorties couche par couche, puis de la perte.
2. Passe arrière : on part de la dérivée de la perte par rapport à la sortie et on remonte couche par couche, en multipliant par les dérivées locales.
3. Mise à jour : un optimiseur (SGD, Adam...) ajuste les poids avec ce gradient.

La rétropropagation ne fait que calculer les gradients ; la mise à jour revient à l'optimiseur.

**Exemple :** un neurone sigmoïde avec la perte (y − cible)². La règle de la chaîne donne ∂L/∂w = 2 (y − cible) × y (1 − y) × x, que l'on vérifie par une différence finie.
\`\`\`python
import numpy as np

sigmoide = lambda z: 1 / (1 + np.exp(-z))
x, cible, w, b = 2.0, 1.0, 0.3, -0.1
perte = lambda w: (sigmoide(w * x + b) - cible) ** 2

y = sigmoide(w * x + b)
gradient = 2 * (y - cible) * y * (1 - y) * x                 # règle de dérivation en chaîne
numerique = (perte(w + 1e-6) - perte(w - 1e-6)) / 2e-6       # différence finie
print(round(gradient, 6), round(numerique, 6))
# Affichage :
# -0.354894 -0.354894
\`\`\`

**Historique :** c'est une forme de différentiation automatique en mode inverse, popularisée pour les réseaux par Rumelhart, Hinton et Williams (1986).

**Difficultés :**
• Les gradients s'évanouissent ou explosent dans les réseaux profonds. Remèdes : activation ReLU, initialisation soignée, normalisation par lots, connexions résiduelles, gradient clipping.
• Les valeurs intermédiaires de la passe avant sont gardées en mémoire pour la passe arrière.

PyTorch et TensorFlow calculent ces gradients automatiquement (autograd).`,
    category: "deep-learning",
    icon: "RefreshCw"
  },
  {
    term: "Fonctions d'activation (Activation Functions)",
    description: `Une fonction d'activation est la fonction non linéaire appliquée à la sortie pondérée de chaque neurone. Sans elle, un réseau de plusieurs couches resterait une simple transformation linéaire.

**Fonctions courantes :**
• ReLU : max(0, x). Simple, peu coûteuse, sans saturation pour x > 0, c'est le choix par défaut des couches cachées. Limite : un neurone dont l'entrée reste négative a un gradient nul et peut « mourir ».
• Leaky ReLU : une petite pente (par exemple 0,01 x) pour x < 0, qui évite les neurones morts.
• Sigmoïde : 1 / (1 + e^(−x)), sortie dans ]0, 1[. Utile en sortie pour une probabilité binaire ; elle sature aux extrêmes, ce qui ralentit l'apprentissage des couches profondes.
• Tanh : sortie dans ]−1, 1[, centrée en 0 ; sature aussi.
• Softmax : transforme un vecteur de scores en probabilités de somme 1 ; sortie des classifieurs multiclasses.
• GELU et Swish (SiLU) : variantes lisses utilisées dans les Transformers.
\`\`\`python
import numpy as np

x = np.array([-2.0, 0.0, 2.0])
print("ReLU    ", np.maximum(0, x))
print("sigmoïde", (1 / (1 + np.exp(-x))).round(3))
print("tanh    ", np.tanh(x).round(3))
# Affichage :
# ReLU     [0. 0. 2.]
# sigmoïde [0.119 0.5   0.881]
# tanh     [-0.964  0.     0.964]
\`\`\`

**Choisir :**
• Couches cachées : ReLU ou une variante pour commencer.
• Couche de sortie, selon la tâche : aucune activation (régression), sigmoïde (binaire), softmax (multiclasse).
• Éviter la saturation limite l'évanouissement des gradients.`,
    category: "deep-learning",
    icon: "Zap"
  },
  {
    term: "Réseaux de neurones convolutifs (CNN)",
    description: `Un réseau de neurones convolutif (CNN) est un réseau conçu pour des données en grille, surtout des images : il applique des filtres appris qui balaient l'entrée en partageant leurs poids.

**Composants typiques :**
• Couches de convolution : de petits filtres détectent des motifs locaux (contours, textures) et produisent des cartes de caractéristiques.
• Une activation (souvent ReLU), puis parfois un pooling qui réduit la taille spatiale.
• En fin de réseau, des couches denses ou un pooling global produisent la classe ou la valeur prédite.

**Pourquoi c'est adapté aux images :**
• Connexions locales : chaque neurone ne regarde qu'une petite zone, comme les champs récepteurs décrits par Hubel et Wiesel dans le cortex visuel.
• Partage des poids : le même filtre sert partout, d'où bien moins de paramètres.
• Équivariance à la translation : un motif déplacé donne une réponse déplacée. Le pooling ajoute une invariance partielle. Un CNN n'est pas invariant par défaut à la rotation ni à l'échelle : on recourt à l'augmentation de données.

**Hiérarchie :** les premières couches repèrent des contours, les suivantes des formes, les dernières des parties d'objets.

**Repères :** LeNet (LeCun et al., 1998), AlexNet (2012), VGG, Inception, ResNet (He et al., 2015) ; U-Net (Ronneberger et al., 2015) pour la segmentation.

**Limites :** besoin de grandes bases d'images annotées (ou de transfert d'apprentissage), sensibilité à des perturbations imperceptibles, concurrence des Vision Transformers.`,
    category: "deep-learning",
    icon: "Eye"
  },
  {
    term: "Couches convolutives (Convolutional Layers)",
    description: `Une couche convolutive applique plusieurs filtres (noyaux) appris qui glissent sur l'entrée et calculent, à chaque position, une somme pondérée des valeurs de la zone couverte. Chaque filtre produit une carte de caractéristiques.

**Fonctionnement :**
• Un filtre 3 × 3 couvre 9 pixels (par canal) et multiplie chaque valeur par un poids.
• Le pas (stride) règle le déplacement du filtre ; le remplissage (padding) ajoute des bordures pour conserver la taille.
• Taille de sortie par dimension : ⌊(n + 2p − k) / s⌋ + 1, avec n la taille de l'entrée, k celle du filtre, p le remplissage et s le pas.
• En apprentissage profond, l'opération est en fait une corrélation croisée (le filtre n'est pas retourné), sans conséquence puisque les poids sont appris.

**Exemple :** un filtre [−1, 1] réagit à une hausse de gauche à droite, donc à un bord vertical.
\`\`\`python
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

image = np.array([[0, 0, 0, 1, 1, 1]] * 4)   # un bord vertical au milieu
filtre = np.array([[-1, 1]])                  # réagit à une hausse de gauche à droite
fenetres = sliding_window_view(image, filtre.shape)
print((fenetres * filtre).sum(axis=(2, 3)))
# Affichage :
# [[0 0 1 0 0]
#  [0 0 1 0 0]
#  [0 0 1 0 0]
#  [0 0 1 0 0]]
\`\`\`

**Paramètres :** k × k × C_in × C_out + C_out pour C_in canaux d'entrée et C_out filtres. Avec 3 canaux d'entrée et 16 filtres 3 × 3 : 3 × 3 × 3 × 16 + 16 = 448, quelle que soit la taille de l'image.

**Hiérarchie :** dans un réseau empilé, les premières couches captent des motifs simples, les suivantes les combinent en motifs plus complexes, car le champ réceptif d'un neurone grandit avec la profondeur.`,
    category: "deep-learning",
    icon: "Search"
  },
  {
    term: "Couches de pooling (Pooling Layers)",
    description: `Une couche de pooling résume chaque petite région d'une carte de caractéristiques par une seule valeur. Elle réduit la taille spatiale, sans paramètre à apprendre.

**Types :**
• Max pooling : garde la valeur maximale de chaque région.
• Average pooling : garde la moyenne.
• Global average pooling : une moyenne par carte entière, souvent avant la couche de sortie.

**Exemple :** un max pooling 2 × 2 de pas 2 réduit une carte 4 × 4 à 2 × 2 en gardant le maximum de chaque bloc.
\`\`\`python
import numpy as np

carte = np.array([[1, 3, 2, 0], [4, 2, 1, 5], [0, 1, 7, 2], [3, 2, 1, 4]])
blocs = carte.reshape(2, 2, 2, 2).swapaxes(1, 2)   # quatre blocs de 2 × 2
print(blocs.max(axis=(2, 3)))
# Affichage :
# [[4 5]
#  [3 7]]
\`\`\`

**Effets :**
• Moins de valeurs à traiter : calculs plus rapides et moins de paramètres dans les couches suivantes. Avec une fenêtre 2 × 2 et un pas de 2, chaque carte compte 4 fois moins de valeurs.
• Insensibilité aux petits déplacements : un motif décalé d'un pixel dans sa région donne le même maximum.
• Champ réceptif élargi : les couches suivantes voient une zone plus grande.

**Limites :**
• Le pooling perd de l'information de position précise, gênante pour la segmentation ou la détection fine.
• Certaines architectures le remplacent par une convolution de pas 2, apprise.`,
    category: "deep-learning",
    icon: "TrendingDown"
  },
  {
    term: "Réseaux de neurones récurrents (RNN)",
    description: `Un réseau de neurones récurrent (RNN) traite une séquence élément par élément en conservant un état caché qui résume ce qu'il a déjà lu. Il convient aux données ordonnées : texte, son, séries temporelles.

**Fonctionnement :** à chaque pas t, le réseau combine l'entrée x_t et l'état précédent h_(t−1) : h_t = tanh(W_h h_(t−1) + W_x x_t + b). Les mêmes poids servent à chaque pas, ce qui permet de traiter des séquences de longueurs variables.

**Entraînement :** rétropropagation à travers le temps (BPTT) : on déroule le réseau sur la séquence et on rétropropage dans ce réseau déroulé.

**Difficultés :**
• Les gradients s'évanouissent ou explosent sur de longues séquences : un RNN simple retient mal les dépendances lointaines. Le gradient clipping limite l'explosion ; les portes des LSTM et des GRU atténuent l'évanouissement.
• Le calcul est séquentiel : l'entraînement se parallélise mal.

**Variantes :** RNN bidirectionnels (lecture dans les deux sens), architectures encodeur-décodeur pour la traduction, empilement de plusieurs couches récurrentes.

**Aujourd'hui :** en traitement du langage, les Transformers ont largement remplacé les RNN. Ceux-ci restent employés sur des séquences courtes ou avec des ressources limitées.`,
    category: "deep-learning",
    icon: "RefreshCw"
  },
  {
    term: "LSTM (Long Short-Term Memory)",
    description: `Le LSTM (Long Short-Term Memory, Hochreiter et Schmidhuber, 1997) est un réseau récurrent doté d'une cellule mémoire et de portes qui contrôlent ce qui est conservé, oublié et lu. Il a été conçu pour atténuer l'évanouissement du gradient.

**Éléments, à chaque pas t :**
• État de cellule c_t : la mémoire à long terme, mise à jour surtout par addition, ce qui laisse passer le gradient sur de longues durées.
• Porte d'oubli f_t : part de c_(t−1) conservée.
• Porte d'entrée i_t : part de l'information candidate ajoutée.
• Porte de sortie o_t : part de la cellule exposée dans l'état caché h_t.

**Équations :** c_t = f_t ⊙ c_(t−1) + i_t ⊙ c̃_t et h_t = o_t ⊙ tanh(c_t). Chaque porte est une sigmoïde de (x_t, h_(t−1)) et c̃_t un candidat en tanh.

**Remarques :**
• La porte d'oubli a été ajoutée après l'article d'origine (Gers, Schmidhuber et Cummins, 2000).
• Quatre blocs de poids contre un pour un RNN simple : plus coûteux, mais les dépendances longues sont mieux apprises.
• Usages : texte, parole, capteurs, séries temporelles.
• Limites : calcul séquentiel, contextes très longs difficiles ; pour le texte, les Transformers l'ont largement supplanté.
• Variante plus légère : le GRU.`,
    category: "deep-learning",
    icon: "Calendar"
  },
  {
    term: "GRU (Gated Recurrent Unit)",
    description: `Le GRU (Gated Recurrent Unit, Cho et al., 2014) est un réseau récurrent à portes plus simple que le LSTM : il fusionne mémoire et état caché et n'utilise que deux portes.

**Portes :**
• Porte de mise à jour z_t : plus elle est proche de 1, plus l'ancien état est conservé.
• Porte de réinitialisation r_t : décide quelle part de l'état précédent sert à calculer le candidat.

**Équations (forme courante) :** h_t = z_t ⊙ h_(t−1) + (1 − z_t) ⊙ h̃_t, avec h̃_t = tanh(W x_t + U (r_t ⊙ h_(t−1))). Les conventions varient selon les bibliothèques.

**Par rapport au LSTM :**
• Moins de paramètres (trois blocs de poids au lieu de quatre) et calcul un peu plus rapide.
• Pas d'état de cellule séparé.
• Performances souvent comparables, sans que l'un l'emporte systématiquement : on essaie les deux sur la tâche.

**Usages :** séquences de longueur moyenne, séries temporelles, parole, ressources limitées.

**Limites :** comme tous les réseaux récurrents, calcul séquentiel et dépendances très longues difficiles ; pour le texte, les Transformers dominent.`,
    category: "deep-learning",
    icon: "Settings"
  },
  {
    term: "Architecture Transformer",
    description: `Le Transformer (Vaswani et al., 2017, « Attention Is All You Need ») est une architecture fondée sur le mécanisme d'attention, sans récurrence ni convolution. Il traite tous les éléments d'une séquence en parallèle.

**Composants d'un bloc :**
• Attention multi-têtes : chaque position pondère toutes les autres (auto-attention).
• Réseau feed-forward appliqué à chaque position.
• Connexions résiduelles et normalisation par couche (layer normalization) autour de ces sous-couches.
• Encodage de position ajouté aux entrées : l'attention seule ne connaît pas l'ordre.

**Variantes :**
• Encodeur-décodeur (architecture d'origine, T5) : traduction, résumé.
• Encodeur seul (BERT) : représentations de textes, classification.
• Décodeur seul (famille GPT) : génération, avec un masque qui interdit de regarder les positions futures.

Le principe a aussi été étendu aux images (Vision Transformer), à l'audio et aux données multimodales.

**Atouts :**
• Calcul parallélisable sur GPU, contrairement aux réseaux récurrents.
• Accès direct entre positions éloignées.

**Limites :**
• Le coût de l'auto-attention croît comme le carré de la longueur de la séquence, d'où des variantes à attention creuse ou approchée.
• Le pré-entraînement exige beaucoup de données et de calcul.
• Lire les poids d'attention comme une explication des décisions est discutable.`,
    category: "deep-learning",
    icon: "Cpu"
  },
  {
    term: "Mécanisme d'attention (Attention Mechanism)",
    description: `Le mécanisme d'attention permet à un modèle de calculer chaque sortie comme une moyenne pondérée d'éléments d'entrée, avec des poids appris qui dépendent du contexte. Il décide ainsi sur quelles parties de l'entrée « regarder ».

**Origine :** proposé pour la traduction automatique (Bahdanau et al., 2014), afin d'éviter de compresser toute la phrase source dans un seul vecteur de taille fixe.

**Attention par produit scalaire normalisé (Vaswani et al., 2017) :** Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V.
• Q (requêtes), K (clés) et V (valeurs) sont obtenues par des projections linéaires de l'entrée.
• Q Kᵀ mesure la similarité entre chaque requête et chaque clé ; la division par √d_k évite des produits trop grands.
• Le softmax transforme les scores en poids positifs de somme 1 ; la sortie est la moyenne pondérée des valeurs.
\`\`\`python
import numpy as np

def softmax(z):
    e = np.exp(z - z.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

V = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])   # 3 mots, dimension 2
Q = K = V                                             # simplification : une seule séquence
poids = softmax(Q @ K.T / np.sqrt(K.shape[1]))
print(poids.round(2))
print((poids @ V).round(2))
# Affichage :
# [[0.4  0.2  0.4 ]
#  [0.2  0.4  0.4 ]
#  [0.25 0.25 0.5 ]]
# [[0.8  0.6 ]
#  [0.6  0.8 ]
#  [0.75 0.75]]
\`\`\`
Le troisième mot accorde la moitié de son attention à lui-même et un quart à chacun des deux autres.

**Types :**
• Auto-attention : Q, K et V viennent de la même séquence.
• Attention croisée : Q vient d'une séquence (décodeur), K et V d'une autre (encodeur).
• Attention causale : un masque interdit de regarder le futur (génération de texte).
• Attention multi-têtes : voir l'entrée suivante.

**Limite :** coût quadratique en la longueur de la séquence.`,
    category: "deep-learning",
    icon: "Eye"
  },
  {
    term: "Dropout",
    description: `Le dropout est une technique de régularisation qui éteint au hasard une fraction des neurones à chaque itération d'entraînement (Srivastava et al., 2014). Il réduit le surapprentissage.

**Principe :**
• Pendant l'entraînement, chaque neurone est mis à zéro avec une probabilité p, indépendamment des autres et à chaque lot de données.
• Le réseau ne peut plus compter sur un neurone précis : il apprend des représentations redondantes. On peut aussi y voir l'entraînement d'un grand nombre de sous-réseaux qui partagent leurs poids.
• À l'inférence, tous les neurones sont actifs. Pour garder la même échelle moyenne, la version « inversée » des bibliothèques divise les valeurs conservées par (1 − p) pendant l'entraînement.
\`\`\`python
import numpy as np

rng = np.random.default_rng(0)
p = 0.5                                   # probabilité d'éteindre un neurone
activations = np.ones(8)
masque = rng.random(8) >= p
print(activations * masque / (1 - p))     # dropout « inversé » : rééchelonnage pendant l'entraînement
# Affichage :
# [2. 0. 0. 0. 2. 2. 2. 2.]
\`\`\`
Huit activations égales à 1 : les unités éteintes passent à 0, les autres à 1 / (1 − p) = 2.

**Valeurs usuelles :** p entre 0,1 et 0,5 selon la couche et la taille du réseau, à régler comme un hyperparamètre.

**En pratique :** nn.Dropout(p) en PyTorch, désactivé à l'évaluation par model.eval().

**Limites :**
• Il ralentit la convergence et ajoute du bruit à l'entraînement.
• Moins utile avec beaucoup de données ou avec la normalisation par lots.
• Dans les réseaux récurrents, il demande des précautions (même masque à chaque pas de temps).`,
    category: "deep-learning",
    icon: "TrendingDown"
  },
  {
    term: "Batch Normalization",
    description: `La normalisation par lots (batch normalization, Ioffe et Szegedy, 2015) normalise les activations d'une couche sur chaque mini-lot, puis les remet à l'échelle avec deux paramètres appris. Elle stabilise et accélère l'entraînement.

**Calcul, pour une variable et un mini-lot :** x̂ = (x − μ_lot) / √(σ²_lot + ε), puis y = γ x̂ + β. Les paramètres γ (échelle) et β (décalage) sont appris. À l'inférence, on utilise des moyennes et variances calculées pendant l'entraînement (moyennes mobiles).
\`\`\`python
import numpy as np

lot = np.array([[1.0, 200.0], [2.0, 220.0], [3.0, 180.0]])   # 3 exemples, 2 variables
x_hat = (lot - lot.mean(axis=0)) / np.sqrt(lot.var(axis=0) + 1e-5)
print(x_hat.round(2))
print(x_hat.mean(axis=0).round(2), x_hat.std(axis=0).round(2))
# Affichage :
# [[-1.22  0.  ]
#  [ 0.    1.22]
#  [ 1.22 -1.22]]
# [0. 0.] [1. 1.]
\`\`\`

**Effets constatés :** entraînement plus rapide avec des pas d'apprentissage plus grands, moindre sensibilité à l'initialisation, léger effet régularisant (bruit lié aux statistiques du lot).

**Explication :** l'article d'origine invoquait la réduction du « décalage de covariables interne ». Cette explication est discutée : Santurkar et al. (2018) montrent que la normalisation rend surtout la surface de perte plus lisse.

**Placement :** souvent entre la couche linéaire ou convolutive et l'activation ; l'ordre est discuté.

**Limites et alternatives :**
• Dépend de la taille du lot : peu fiable avec de très petits lots.
• Comportement différent à l'entraînement et à l'inférence, source d'erreurs.
• La normalisation par couche (Ba et al., 2016) normalise sur les variables d'un même exemple : standard dans les Transformers. La normalisation par groupes (Wu et He, 2018) convient aux petits lots.`,
    category: "deep-learning",
    icon: "BarChart3"
  },
  {
    term: "Optimiseurs (Optimizers)",
    description: `Un optimiseur est l'algorithme qui utilise le gradient de la perte pour mettre à jour les poids d'un réseau et la faire diminuer.

**Descente de gradient :** w ← w − η ∇L(w), où η est le pas d'apprentissage (learning rate). En variante stochastique (SGD), le gradient est estimé sur un mini-lot plutôt que sur tout le jeu de données.

**Optimiseurs courants :**
• SGD avec momentum : ajoute une inertie qui lisse les oscillations et accélère dans les directions stables.
• RMSprop : divise le pas de chaque paramètre par une moyenne mobile de ses gradients récents.
• Adam (Kingma et Ba, 2014) : combine momentum et pas adapté à chaque paramètre ; très répandu car il demande peu de réglages.
• AdamW (Loshchilov et Hutter) : sépare la décroissance des poids (weight decay) de la mise à jour adaptative.

**Le pas d'apprentissage est le réglage le plus important.** Sur f(w) = w², dont le gradient est 2w, en partant de w = 1 et après 5 itérations :
\`\`\`python
# Descente de gradient sur f(w) = w², dont le gradient est 2w, en partant de w = 1
for pas in [0.1, 0.5, 1.1]:
    w = 1.0
    for _ in range(5):
        w = w - pas * 2 * w
    print(pas, round(w, 4))
# Affichage :
# 0.1 0.3277
# 0.5 0.0
# 1.1 -2.4883
\`\`\`
Un pas de 0,1 converge lentement, 0,5 converge d'un coup, 1,1 diverge.

**Pratiques :**
• Planifier le pas : décroissance, échauffement (warm-up), cosinus.
• SGD avec momentum reste compétitif en vision ; Adam ou AdamW est le choix courant pour les Transformers.
• Il n'existe pas d'optimiseur universel : comparer sur la tâche.`,
    category: "deep-learning",
    icon: "TrendingUp"
  },
  {
    term: "Tenseurs (Tensors)",
    description: `En apprentissage profond, un tenseur est un tableau de nombres à un nombre quelconque de dimensions (les axes). C'est la structure de données de base de PyTorch, TensorFlow et JAX.

**Ordre (nombre d'axes) :**
• 0 : scalaire, un nombre.
• 1 : vecteur.
• 2 : matrice.
• 3 ou plus : par exemple une image couleur (hauteur, largeur, canaux), un lot d'images, une séquence de vecteurs.
\`\`\`python
import numpy as np

print(np.array(3.0).shape)              # scalaire
print(np.zeros(5).shape)                # vecteur
print(np.zeros((28, 28)).shape)         # image en niveaux de gris
print(np.zeros((32, 28, 28, 3)).shape)  # lot de 32 images couleur
# Affichage :
# ()
# (5,)
# (28, 28)
# (32, 28, 28, 3)
\`\`\`

**Conventions :** la forme (shape) donne la taille de chaque axe. L'ordre des axes dépend de la bibliothèque : (lot, hauteur, largeur, canaux) dans TensorFlow, (lot, canaux, hauteur, largeur) dans PyTorch.

**Ce que les bibliothèques ajoutent aux tableaux NumPy :**
• Calcul sur GPU ou TPU.
• Différentiation automatique : le suivi des opérations permet de calculer les gradients.
• Types de données adaptés (float32, float16, bfloat16).

**Vocabulaire :** en mathématiques, un tenseur est un objet qui se transforme d'une manière précise lors d'un changement de repère. En apprentissage profond, le terme désigne simplement un tableau multidimensionnel.

**Erreurs fréquentes :** formes incompatibles dans un produit matriciel, axes lot et canaux mélangés, types entiers et flottants confondus.`,
    category: "deep-learning",
    icon: "Layers"
  },
  {
    term: "Transfer Learning",
    description: `Le transfert d'apprentissage (transfer learning) réutilise un modèle déjà entraîné sur une tâche source comme point de départ pour une tâche cible. Il réduit les données et le calcul nécessaires.

**Principe :** les premières couches d'un réseau apprennent des caractéristiques générales (contours et textures en vision, structure de la langue en texte) qui servent à d'autres tâches. On les conserve et on adapte le reste.

**Deux approches :**
• Extraction de caractéristiques : on gèle le modèle pré-entraîné et on entraîne seulement une nouvelle tête (couche de sortie) sur ses représentations.
• Ajustement fin (fine-tuning) : on poursuit l'entraînement de tout ou partie du modèle, avec un pas d'apprentissage faible.

**Exemple** (PyTorch et torchvision, non exécuté ici) :
\`\`\`python
import torch.nn as nn
from torchvision import models

modele = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)   # pré-entraîné sur ImageNet
for p in modele.parameters():
    p.requires_grad = False                                         # on gèle le corps du réseau
modele.fc = nn.Linear(modele.fc.in_features, 3)                      # nouvelle tête, 3 classes
\`\`\`

**Quand c'est utile :** peu de données étiquetées, tâche proche de la source (photographies, texte courant).

**Limites :**
• Transfert négatif possible si les domaines sont trop différents.
• Les biais et les défauts du modèle source sont hérités.
• Vérifier la licence du modèle et des données d'origine.`,
    category: "deep-learning",
    icon: "GitBranch"
  },
  {
    term: "Fine-tuning",
    description: `L'ajustement fin (fine-tuning) poursuit l'entraînement d'un modèle pré-entraîné sur les données d'une tâche précise, avec un pas d'apprentissage en général nettement plus faible que lors du pré-entraînement.

**Démarche :**
• Remplacer ou ajouter la couche de sortie adaptée à la nouvelle tâche.
• Éventuellement geler les premières couches (caractéristiques générales), entraîner d'abord la nouvelle tête, puis dégeler progressivement.
• Utiliser un pas d'apprentissage faible, parfois différent selon les couches, et surveiller la validation.

**Risques :**
• Oubli catastrophique : le modèle perd des capacités acquises au pré-entraînement si l'ajustement est trop long ou trop fort.
• Surapprentissage sur un petit jeu de données.
• Changement du comportement d'un modèle de langage après ajustement, y compris de ses garde-fous.

**Pour les grands modèles :** les méthodes économes en paramètres n'entraînent qu'une petite part des poids ou des matrices ajoutées. LoRA (Hu et al., 2021) ajoute des matrices de faible rang aux poids existants. L'ajustement sur des instructions et l'apprentissage par renforcement à partir de retours humains (RLHF) servent à adapter les modèles de langage au dialogue.

**Quand l'éviter :** si une simple extraction de caractéristiques suffit, ou, pour un modèle de langage, si quelques exemples donnés dans la consigne suffisent.`,
    category: "deep-learning",
    icon: "Settings"
  },
  {
    term: "Réseaux antagonistes génératifs (GAN)",
    description: `Un réseau antagoniste génératif (GAN, Goodfellow et al., 2014) associe deux réseaux entraînés l'un contre l'autre : un générateur qui produit de fausses données et un discriminateur qui apprend à les distinguer des vraies.

**Principe :** c'est un jeu à deux joueurs. Le générateur G transforme un bruit aléatoire z en échantillon ; le discriminateur D estime la probabilité qu'un échantillon soit réel. On cherche min_G max_D E[log D(x)] + E[log(1 − D(G(z)))]. À l'équilibre, G produit des échantillons que D ne distingue plus des vrais.

**Entraînement :** on alterne des mises à jour de D (distinguer le réel du faux) et de G (tromper D).

**Difficultés :**
• Entraînement instable : les deux réseaux doivent progresser de façon équilibrée.
• Effondrement de modes (mode collapse) : G ne produit que quelques types d'échantillons.
• Pas de mesure unique de la qualité : on utilise des métriques comme le FID, complétées par un examen visuel.

**Variantes :** DCGAN (convolutif), GAN conditionnel (génération guidée par une étiquette), CycleGAN (traduction d'images sans paires), StyleGAN.

**Place actuelle :** pour la génération d'images, les modèles de diffusion (Ho et al., 2020) ont largement pris le relais. Les GAN servent encore pour la génération rapide, la super-résolution et les données synthétiques.

**Précaution :** les images générées posent des questions d'usage (hypertrucages, droits).`,
    category: "deep-learning",
    icon: "Shuffle"
  },
  {
    term: "Autoencodeurs (Autoencoders)",
    description: `Un autoencodeur est un réseau de neurones entraîné à reconstruire son entrée après l'avoir fait passer par une représentation compressée, le code latent. Il apprend sans étiquettes.

**Architecture :** un encodeur compresse l'entrée x en un code z de dimension réduite, un décodeur reconstruit x̂ à partir de z. La perte mesure l'écart de reconstruction, par exemple ‖x − x̂‖². Le goulot d'étranglement oblige le réseau à garder l'essentiel.
• Exemple pour des images de 28 × 28 pixels : 784 → 256 → 64 → 256 → 784.
• Un autoencodeur linéaire entraîné avec la perte quadratique retrouve le sous-espace de l'analyse en composantes principales ; avec des activations non linéaires, il apprend des représentations plus riches.

**Variantes :**
• Débruiteur (denoising) : entrée bruitée, sortie propre.
• Parcimonieux (sparse) : pénalité pour n'activer que peu d'unités.
• Variationnel (VAE, Kingma et Welling, 2013) : le code est une distribution, et la perte ajoute un terme de divergence de Kullback-Leibler. On peut tirer z au hasard et décoder pour générer de nouvelles données.
• Convolutif : pour les images.

**Usages :**
• Réduction de dimension et visualisation.
• Détection d'anomalies : une entrée mal reconstruite s'écarte de ce que le modèle a appris.
• Débruitage, génération (VAE), pré-entraînement de représentations.

**Limites :** reconstructions floues avec la perte quadratique ; effondrement a posteriori des VAE (le décodeur ignore le code) ; un autoencodeur trop puissant peut recopier l'entrée sans rien apprendre d'utile.`,
    category: "deep-learning",
    icon: "RefreshCw"
  },
  {
    term: "Réseaux de neurones convolutifs génératifs (DCGAN)",
    description: `DCGAN (Deep Convolutional GAN, Radford, Metz et Chintala, 2015) est un GAN dont le générateur et le discriminateur sont des réseaux convolutifs, avec des choix d'architecture qui ont rendu l'entraînement plus stable.

**Principales recommandations de l'article :**
• Remplacer le pooling par des convolutions à pas (strided) dans le discriminateur et des convolutions transposées dans le générateur : le sous- et le sur-échantillonnage sont appris.
• Utiliser la normalisation par lots dans les deux réseaux, sauf en sortie du générateur et en entrée du discriminateur.
• Supprimer les couches entièrement connectées cachées.
• ReLU dans le générateur (tanh en sortie), LeakyReLU dans le discriminateur.

**Fonctionnement :** le générateur part d'un vecteur de bruit, l'étend en une petite carte de caractéristiques, puis augmente la résolution par des convolutions transposées jusqu'à l'image. Le discriminateur fait le chemin inverse jusqu'à une probabilité « réel ou faux ».

**Résultats de l'article :** des images de petite taille (64 × 64 pixels) et un espace latent exploitable : des opérations arithmétiques sur les vecteurs latents correspondent à des changements de contenu, par exemple de pose ou d'accessoire.

**Limites :** celles des GAN (instabilité, effondrement de modes), avec une résolution limitée. Pour des images de haute qualité, on préfère aujourd'hui des architectures plus récentes (StyleGAN, modèles de diffusion).`,
    category: "deep-learning",
    icon: "Eye"
  },
  {
    term: "Réseaux siamois (Siamese Networks)",
    description: `Un réseau siamois est formé de deux branches identiques, qui partagent les mêmes poids, appliquées à deux entrées. Leurs sorties sont comparées pour dire si les entrées se ressemblent. Le principe remonte à la vérification de signatures (Bromley et al., 1993).

**Fonctionnement :**
• Chaque entrée passe par le même réseau, qui produit un plongement (embedding).
• Une distance (euclidienne, cosinus) entre les deux plongements mesure la similarité.
• On entraîne pour rapprocher les paires similaires et éloigner les paires différentes.

**Fonctions de perte :**
• Contrastive (Hadsell, Chopra et LeCun, 2006) : pénalise les paires similaires éloignées et les paires différentes plus proches qu'une marge.
• Triplet : avec une ancre, un exemple positif et un exemple négatif, impose d(ancre, positif) + marge < d(ancre, négatif) (FaceNet, Schroff et al., 2015).

**Usages :**
• Vérification d'identité (visage, signature).
• Recherche par similarité, détection de doublons.
• Classification avec très peu d'exemples par classe (few-shot) : on compare un nouvel exemple aux exemples connus, sans réentraîner.

**Atouts et limites :**
• Pas besoin de nombreux exemples par classe, ni de classes connues à l'avance.
• Le choix des paires ou des triplets (surtout les « négatifs difficiles ») conditionne la qualité.
• La qualité dépend de la représentation apprise, donc des données d'entraînement.`,
    category: "deep-learning",
    icon: "Users"
  },
  {
    term: "Distillation de connaissances (Knowledge Distillation)",
    description: `La distillation de connaissances (Hinton, Vinyals et Dean, 2015) entraîne un petit modèle, l'élève, à imiter un grand modèle, le professeur, pour obtenir un modèle plus léger et plus rapide qui garde une grande partie de la performance.

**Principe :** l'élève apprend à partir des probabilités produites par le professeur, plus riches que les étiquettes dures : elles indiquent quelles classes il juge proches. On les adoucit avec une température T > 1 dans le softmax.
\`\`\`python
import numpy as np

def softmax(z, T=1.0):
    e = np.exp(np.array(z) / T)
    return e / e.sum()

logits = [4.0, 1.0, 0.0]
print(softmax(logits).round(3))
print(softmax(logits, T=4).round(3))
# Affichage :
# [0.936 0.047 0.017]
# [0.543 0.257 0.2  ]
\`\`\`
Avec T = 4, la distribution est plus étalée et les classes secondaires deviennent informatives.

**Perte typique :** α × perte avec les étiquettes réelles + (1 − α) × T² × divergence de Kullback-Leibler entre les sorties adoucies du professeur et de l'élève.

**Exemple :** DistilBERT (Sanh et al., 2019) est, selon ses auteurs, 40 % plus petit que BERT et 60 % plus rapide, pour 97 % de ses performances de compréhension du langage.

**Usages :** déploiement sur mobile ou sur un serveur à budget limité, réduction du coût d'inférence, transfert des capacités d'un grand modèle vers un modèle spécialisé.

**Limites :**
• L'élève reste en général un peu moins bon que le professeur.
• Il hérite des biais et des erreurs du professeur.
• Les conditions d'utilisation du professeur peuvent restreindre la distillation de ses sorties.

Autres techniques de compression : quantification, élagage (pruning).`,
    category: "deep-learning",
    icon: "TrendingDown"
  },
  {
    term: "Gradient Clipping",
    description: `Le gradient clipping (écrêtage du gradient) limite la taille du gradient avant la mise à jour des poids, pour qu'un pas trop grand ne déstabilise pas l'entraînement (explosion du gradient).

**Deux formes :**
• Par norme : si ‖g‖ dépasse un seuil s, on remplace g par g × s / ‖g‖. La direction est conservée, seule la longueur diminue.
• Par valeur : chaque composante est bornée à l'intervalle [−s, s]. La direction peut changer.
\`\`\`python
import numpy as np

gradient = np.array([30.0, 40.0])    # norme 50
seuil = 5.0
norme = np.linalg.norm(gradient)
if norme > seuil:
    gradient = gradient * seuil / norme
print(gradient, np.linalg.norm(gradient))
# Affichage :
# [3. 4.] 5.0
\`\`\`

**Quand l'utiliser :**
• Réseaux récurrents, où les gradients peuvent exploser sur de longues séquences (Pascanu et al., 2013).
• Entraînement de grands modèles, souvent avec une norme maximale de l'ordre de 1.
• Pics de perte ou valeurs NaN pendant l'entraînement.

**En PyTorch :** torch.nn.utils.clip_grad_norm_(modele.parameters(), max_norm=1.0), appelé après loss.backward() et avant optimizer.step().

**Limites :**
• Il traite l'explosion du gradient, pas son évanouissement.
• Un seuil trop bas ralentit l'apprentissage : observer la norme du gradient avant écrêtage pour le choisir.`,
    category: "deep-learning",
    icon: "Gauge"
  },
  {
    term: "Residual Networks (ResNet)",
    description: `Un réseau résiduel (ResNet, He et al., 2015) ajoute à chaque bloc une connexion de saut (skip connection) qui additionne l'entrée du bloc à sa sortie : y = F(x) + x. Le bloc n'a plus qu'à apprendre la correction F(x) = y − x.

**Problème résolu :** en augmentant la profondeur d'un réseau classique, l'erreur d'entraînement finissait par augmenter : c'est le problème de dégradation, une difficulté d'optimisation et non du surapprentissage. Avec une connexion résiduelle, un bloc peut facilement se comporter comme l'identité (F = 0), et les gradients se propagent directement par le chemin de saut.

**Architecture :**
• Blocs de deux convolutions 3 × 3 (ResNet-18 et 34) ou de trois convolutions dont des 1 × 1, dites « bottleneck » (ResNet-50, 101, 152).
• Normalisation par lots dans chaque bloc.
• Quand les dimensions changent, une convolution 1 × 1 adapte le chemin de saut.

**Résultats :** des réseaux résiduels allant jusqu'à 152 couches ont remporté la classification d'ILSVRC 2015.

**Influence :** les connexions résiduelles se retrouvent partout : Transformers (autour de l'attention et du feed-forward), U-Net, réseaux de diffusion. Variantes : ResNeXt, DenseNet (concaténation au lieu d'addition).

**Utilisation :** un ResNet pré-entraîné sur ImageNet est une base courante pour le transfert d'apprentissage.`,
    category: "deep-learning",
    icon: "GitBranch"
  },
  {
    term: "Attention multi-têtes (Multi-Head Attention)",
    description: `L'attention multi-têtes exécute plusieurs attentions en parallèle, chacune avec ses propres projections, puis concatène leurs résultats. Chaque tête peut ainsi capter un type de relation différent (Vaswani et al., 2017).

**Formule :** MultiHead(Q, K, V) = Concat(tête_1, ..., tête_h) W^O, avec tête_i = Attention(Q W_i^Q, K W_i^K, V W_i^V). Les matrices W sont apprises.

**Dimensions :** avec h têtes et un modèle de dimension d_model, chaque tête travaille sur d_k = d_model / h dimensions. Le coût total reste voisin de celui d'une seule attention de dimension d_model.
\`\`\`python
import numpy as np

sequence, d_model, tetes = 4, 8, 2
x = np.zeros((sequence, d_model))
par_tete = x.reshape(sequence, tetes, d_model // tetes).transpose(1, 0, 2)
print(par_tete.shape)   # (têtes, séquence, d_k) avec d_k = d_model / têtes
# Affichage :
# (2, 4, 4)
\`\`\`
Dans le Transformer d'origine, d_model = 512 et h = 8, soit d_k = 64. BERT-base utilise 12 têtes par couche (d_model = 768).

**Pourquoi plusieurs têtes :** une seule moyenne pondérée mélange tous les types de relation. Avec plusieurs sous-espaces, le modèle peut suivre plusieurs dépendances en parallèle.

**Ce qu'on observe :**
• Certaines têtes semblent suivre des relations syntaxiques ou la position relative.
• D'autres sont redondantes : une partie des têtes peut être supprimée avec peu de perte (Michel et al., 2019 ; Voita et al., 2019).
• Attribuer un rôle précis à une tête reste une interprétation à manier avec prudence.

**Coût et variantes :** le calcul de l'attention est quadratique en la longueur de la séquence. Multi-Query et Grouped-Query Attention partagent clés et valeurs entre têtes pour accélérer l'inférence ; FlashAttention calcule la même attention en optimisant les accès mémoire.`,
    category: "deep-learning",
    icon: "Eye"
  },
  {
    term: "Embeddings",
    description: `Un embedding (plongement) représente un objet discret (mot, utilisateur, produit, catégorie) par un vecteur dense de nombres réels, appris de sorte que des objets proches par le sens ou le comportement aient des vecteurs proches.

**Fonctionnement :**
• Une table (matrice) de poids associe à chaque identifiant un vecteur de dimension d, de quelques dizaines à quelques milliers.
• Les vecteurs sont des paramètres appris avec le reste du réseau, ou pré-entraînés (Word2Vec, GloVe) puis réutilisés.
• La similarité se mesure en général par le cosinus.
\`\`\`python
import numpy as np

# Vecteurs choisis à la main pour l'exemple (dimension 3)
E = {"roi": [0.9, 0.8, 0.1], "reine": [0.9, 0.7, 0.2], "pomme": [0.1, 0.0, 0.9]}
cos = lambda a, b: np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
print(round(cos(E["roi"], E["reine"]), 2), round(cos(E["roi"], E["pomme"]), 2))
# Affichage :
# 0.99 0.16
\`\`\`
Les vecteurs « roi » et « reine » sont proches, « pomme » est loin (vecteurs choisis à la main pour l'exemple).

**Pourquoi c'est utile :**
• Un vecteur compact remplace un encodage one-hot de très grande dimension, presque vide.
• Des directions peuvent encoder des relations : l'exemple classique est roi − homme + femme ≈ reine (Mikolov et al., 2013), observé plus ou moins nettement selon les modèles.
• Permet de comparer, regrouper et rechercher des objets.

**Usages :** recherche sémantique, recommandation, classification de texte, entrée des modèles de langage.

**Limites :**
• Un embedding statique donne un seul vecteur par mot ; les modèles contextuels (BERT) en donnent un par occurrence.
• Les biais des données d'entraînement (stéréotypes) se retrouvent dans les vecteurs.
• Le sens de chaque dimension n'est pas directement interprétable.`,
    category: "deep-learning",
    icon: "Network"
  },
  {
    term: "Modèles de langage (Language Models)",
    description: `Un modèle de langage attribue une probabilité à des séquences de mots (ou de sous-mots, les tokens). Il prédit le mot suivant en fonction du contexte, ce qui permet de générer, compléter ou évaluer du texte.

**Principe :** P(w_1, ..., w_n) = Π P(w_t | w_1, ..., w_(t−1)). En comptant les paires de mots d'un corpus minuscule, on estime la probabilité du mot qui suit « le ».
\`\`\`python
from collections import Counter

texte = "le chat dort . le chat mange . le chien dort .".split()
suites = Counter(zip(texte, texte[1:]))
total = sum(n for (a, _), n in suites.items() if a == "le")
for (a, b), n in suites.items():
    if a == "le":
        print(f"P({b} | le) = {n}/{total}")
# Affichage :
# P(chat | le) = 2/3
# P(chien | le) = 1/3
\`\`\`

**Familles :**
• Modèles n-grammes : comptent les suites de n mots ; simples, mais limités à un contexte court.
• Modèles neuronaux : réseaux récurrents, puis Transformers ; contexte long, représentations apprises.
• Modèles autorégressifs (famille GPT) : prédisent le mot suivant. Modèles masqués (BERT) : prédisent des mots cachés à partir de tout le contexte.

**Évaluation :** perplexité (plus elle est basse, mieux le modèle prédit le texte), puis évaluation sur des tâches (questions-réponses, traduction, résumé).

**Grands modèles de langage (LLM) :** Transformers de plusieurs milliards de paramètres, pré-entraînés sur de très grands corpus, puis ajustés (instructions, retours humains) pour dialoguer.

**Limites :**
• Ils produisent des textes plausibles, pas forcément vrais : on parle d'hallucinations.
• Ils reflètent les biais de leurs données.
• Leur fiabilité doit être contrôlée sur chaque cas d'usage, avec des sources vérifiables pour les faits.`,
    category: "deep-learning",
    icon: "MessageSquare"
  },
  {
    term: "BERT (Bidirectional Encoder Representations from Transformers)",
    description: `BERT (Devlin et al., 2018) est un modèle de langage fondé sur l'encodeur du Transformer, pré-entraîné pour produire des représentations de textes qui tiennent compte du contexte à gauche et à droite de chaque mot.

**Pré-entraînement :**
• Masked Language Modeling : environ 15 % des tokens sont masqués et le modèle les prédit à partir du contexte complet. Exemple : « Paris est la [MASK] de la France » doit donner « capitale ».
• Next Sentence Prediction : prédire si deux phrases se suivent. Des travaux ultérieurs (RoBERTa) ont montré que cette tâche n'est pas nécessaire.

**Architecture :** BERT-base compte 12 couches, 12 têtes d'attention et 110 millions de paramètres ; BERT-large 24 couches et 340 millions. Le texte est découpé en sous-mots (WordPiece), en séquences d'au plus 512 tokens, avec des jetons spéciaux [CLS], [SEP] et [MASK].

**Utilisation, en trois étapes :**
1. Charger le modèle pré-entraîné.
2. Ajouter une petite couche de sortie adaptée à la tâche.
3. Ajuster le modèle (fine-tuning) sur les données de la tâche, avec un pas d'apprentissage faible.

Tâches typiques : classification de textes, reconnaissance d'entités nommées, questions-réponses extractives, similarité de phrases.

**Variantes :** RoBERTa (sans NSP, pré-entraînement plus long), ALBERT, DistilBERT (distillé), ELECTRA, DeBERTa ; versions françaises (CamemBERT, FlauBERT).

**Limites :**
• Ce n'est pas un modèle génératif : il sert à comprendre du texte, pas à en produire.
• Contexte limité à 512 tokens, coût de calcul élevé.
• Il reproduit les biais de ses données.`,
    category: "deep-learning",
    icon: "MessageSquare"
  },
  {
    term: "GPT (Generative Pre-trained Transformer)",
    description: `GPT (Generative Pre-trained Transformer) désigne une famille de modèles de langage d'OpenAI, apparue en 2018 (Radford et al.), fondée sur la partie décodeur du Transformer et entraînée à prédire le mot suivant.

**Principe :**
• Un masque causal empêche chaque position de voir les suivantes : le modèle est autorégressif et génère le texte mot après mot.
• Pré-entraînement sur de très grands corpus de texte, puis adaptation éventuelle.
• Génération : à chaque pas, on tire le token suivant dans la distribution prédite (réglages de température, top-k, top-p).

**Évolution :**
• GPT-2 (2019) puis GPT-3 (2020, 175 milliards de paramètres) montrent qu'un grand modèle peut accomplir de nombreuses tâches à partir de quelques exemples donnés dans la consigne, sans réentraînement (apprentissage en contexte, Brown et al., 2020).
• InstructGPT (Ouyang et al., 2022) ajoute l'ajustement sur des instructions et l'apprentissage par renforcement à partir de retours humains, ce qui rend le modèle plus utile en dialogue.

Le principe du décodeur seul est repris par de nombreux autres modèles, ouverts ou non.

**Différence avec BERT :** GPT lit de gauche à droite et génère ; BERT lit dans les deux sens et sert à comprendre.

**Limites :**
• Hallucinations : le texte est plausible mais peut être faux.
• Biais hérités des données, sensibilité à la formulation de la consigne.
• Coût d'entraînement et d'inférence élevé.
• Les faits doivent être vérifiés, et les décisions sensibles ne doivent pas reposer sur ses seules sorties.`,
    category: "deep-learning",
    icon: "MessageSquare"
  }
];