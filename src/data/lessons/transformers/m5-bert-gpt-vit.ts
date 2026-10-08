import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const SOFTMAX = lines(
  "import numpy as np",
  "",
  "def softmax(x):",
  "    e = np.exp(x - x.max(axis=-1, keepdims=True))",
  "    return e / e.sum(axis=-1, keepdims=True)",
);

/** Attention avec masque facultatif : False = position interdite (son score devient -inf avant la softmax) */
const ATTENTION_MASQUE = lines(
  SOFTMAX,
  "",
  "def attention(Q, K, V, masque=None):",
  "    d_k = K.shape[-1]",
  "    scores = Q @ K.swapaxes(-1, -2) / np.sqrt(d_k)",
  "    if masque is not None:",
  "        scores = np.where(masque, scores, -np.inf)",
  "    poids = softmax(scores)",
  "    return poids @ V, poids",
);

const PATCHS = lines(
  "def decouper_en_patchs(image, p):",
  "    H, W = image.shape",
  "    return image.reshape(H // p, p, W // p, p).transpose(0, 2, 1, 3).reshape(-1, p * p)",
);

export const module5: LessonModule = {
  id: "bert-gpt-vit",
  title: "Encodeurs, décodeurs, BERT, GPT et Vision Transformers",
  duration: "2 h 30",
  summary:
    "Les trois familles d'architectures Transformer, le masque qui distingue BERT de GPT (calculé et mesuré), la fabrication des exemples de pré-entraînement, puis l'adaptation aux images avec les patchs d'un Vision Transformer. Les modèles de Hugging Face sont présentés en code à lire.",
  objectives: [
    "Distinguer encodeur seul, décodeur seul et encodeur-décodeur, et les tâches auxquelles chacun est associé",
    "Calculer un masque causal et montrer par la mesure qu'il interdit de regarder le futur, contrairement à l'attention bidirectionnelle",
    "Fabriquer des exemples de pré-entraînement : mots masqués (BERT) et mot suivant (GPT)",
    "Découper une image en patchs et calculer la longueur de séquence d'un Vision Transformer",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois familles à partir d'un même plan

Le Transformer de Vaswani et de ses coauteurs (2017) a été conçu pour la **traduction** et comprend deux parties : un **encodeur**, qui lit la phrase source et en produit une représentation, et un **décodeur**, qui écrit la phrase cible mot après mot. Les travaux suivants ont gardé l'une des deux moitiés, ou les deux :

- **encodeur seul** (BERT, RoBERTa, DeBERTa...) : chaque position voit toute la séquence. On l'associe d'ordinaire aux tâches de **compréhension** : classification, reconnaissance d'entités, plongements de phrases ;
- **décodeur seul** (la famille GPT, LLaMA...) : chaque position ne voit que les positions précédentes. Il est entraîné à prédire le mot suivant, et sert à **générer** du texte ;
- **encodeur-décodeur** (le Transformer d'origine, T5, BART...) : l'encodeur lit l'entrée, le décodeur produit la sortie en consultant l'encodeur. On l'associe à la traduction et au résumé.

Ces associations sont des tendances, pas des lois : un décodeur sait aussi classer ou traduire (on lui demande dans la consigne), et un encodeur peut servir de base à de nombreuses tâches avec un petit réseau ajouté au-dessus.

Dans un encodeur-décodeur, le décodeur relie les deux moitiés par une **attention croisée** (*cross-attention*) : les **requêtes** viennent du décodeur, les **clés et les valeurs** de l'encodeur. Chaque mot en cours d'écriture regarde ainsi les mots de la phrase source.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        SOFTMAX,
        "",
        "def attention(Q, K, V):",
        "    poids = softmax(Q @ K.T / np.sqrt(K.shape[1]))",
        "    return poids @ V, poids",
        "",
        "rng = np.random.default_rng(4)",
        "d = 8",
        "encodeur = rng.normal(size=(5, d))  # 5 éléments de la phrase source",
        "decodeur = rng.normal(size=(3, d))  # 3 éléments déjà produits",
        "Wq, Wk, Wv = (rng.normal(size=(d, d)) / np.sqrt(d) for _ in range(3))",
        "",
        "sortie, poids = attention(decodeur @ Wq, encodeur @ Wk, encodeur @ Wv)",
        "print('poids :', poids.shape, ' sortie :', sortie.shape)",
        "print(poids.round(2))",
      ),
      caption:
        "La matrice de poids n'est plus carrée : (3, 5), une ligne par élément du décodeur et une colonne par élément de l'encodeur, chaque ligne de somme 1. La sortie a autant de lignes que de requêtes (3). Les longueurs de la source et de la cible n'ont pas besoin d'être égales.",
    },
    {
      kind: "text",
      md: `### Le masque : ce que chaque position a le droit de voir

La différence essentielle entre un encodeur de type BERT et un décodeur de type GPT tient dans une matrice : le **masque**.

- Dans un encodeur, **aucun masque** : le poids d'attention de chaque position sur chaque autre est calculé librement, avant comme après. L'attention est **bidirectionnelle**.
- Dans un décodeur, le **masque causal** interdit à la position i de regarder les positions j > i, qui sont dans le futur. On l'applique **avant** la softmax, en remplaçant les scores interdits par moins l'infini : l'exponentielle de moins l'infini vaut 0, donc le poids devient exactement nul, et les poids restants se renormalisent pour sommer à 1.

Pourquoi ce masque est-il indispensable ? Un décodeur est entraîné à prédire le mot suivant à chaque position, **toutes les positions en même temps**. Sans masque, la position i verrait le mot i + 1, qui est précisément ce qu'elle doit deviner : la tâche serait triviale et le modèle n'apprendrait rien d'utile.`,
    },
    {
      kind: "equation",
      latex: String.raw`\text{Attention masquée}(Q,K,V) = \operatorname{softmax}\!\left(\frac{Q\,K^{\top}}{\sqrt{d_k}} + M\right)V \qquad M_{ij}=\begin{cases}0 & \text{si } j \le i\\ -\infty & \text{si } j > i\end{cases}`,
      caption: "Attention avec masque causal : la matrice M s'ajoute aux scores avant la softmax ; sans masque (encodeur), M est nulle partout",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `attention_causale(Q, K, V)` qui renvoie `(sortie, poids)` : calculez les scores `Q @ K.T / sqrt(d_k)`, remplacez par `-np.inf` ceux dont la colonne est **strictement supérieure** à la ligne (le futur), appliquez `softmax` (fournie) à chaque ligne, puis multipliez par `V`. Aide : `np.triu(np.ones((n, n), dtype=bool), k=1)` marque les positions du futur.",
      setup: SOFTMAX,
      starter: lines(
        "def attention_causale(Q, K, V):",
        "    scores = Q @ K.T / np.sqrt(K.shape[1])",
        "    # à compléter : masquer le futur avant la softmax",
        "    poids = softmax(scores)",
        "    return poids @ V, poids",
      ),
      solution: lines(
        "def attention_causale(Q, K, V):",
        "    n = Q.shape[0]",
        "    scores = Q @ K.T / np.sqrt(K.shape[1])",
        "    futur = np.triu(np.ones((n, n), dtype=bool), k=1)",
        "    scores = np.where(futur, -np.inf, scores)",
        "    poids = softmax(scores)",
        "    return poids @ V, poids",
        "",
        "rng = np.random.default_rng(3)",
        "Q, K, V = (rng.normal(size=(4, 4)) for _ in range(3))",
        "print(attention_causale(Q, K, V)[1].round(2))",
      ),
      test: lines(
        "_rng = np.random.default_rng(3)",
        "_Q, _K, _V = (_rng.normal(size=(5, 4)) for _ in range(3))",
        "_s, _p = attention_causale(_Q, _K, _V)",
        "assert np.allclose(np.triu(_p, k=1), 0), f\"les poids au-dessus de la diagonale (le futur) doivent être nuls ; le plus grand vaut {np.triu(_p, k=1).max():.3f}\"",
        "assert np.allclose(_p.sum(axis=1), 1), \"chaque ligne de poids doit sommer à 1 : appliquez la softmax après le masque\"",
        "assert np.allclose(_p[0], [1, 0, 0, 0, 0]), f\"le premier élément ne voit que lui-même : sa ligne de poids doit être [1, 0, 0, 0, 0] (vous avez {_p[0].round(2)})\"",
        "_scores = _Q @ _K.T / 2.0",
        "_scores[np.triu_indices(5, k=1)] = -np.inf",
        "_attendu = softmax(_scores)",
        "assert np.allclose(_p, _attendu), \"les poids doivent être softmax(scores avec le futur à -inf)\"",
        "assert np.allclose(_s, _attendu @ _V), \"la sortie doit être poids @ V\"",
        "_K2, _V2 = _K.copy(), _V.copy()",
        "_K2[-1] += 5.0",
        "_V2[-1] -= 5.0",
        "_s2, _ = attention_causale(_Q, _K2, _V2)",
        "assert np.allclose(_s[:-1], _s2[:-1]), \"modifier le dernier élément ne doit pas changer les sorties des éléments qui le précèdent\"",
      ),
      hint: "scores = np.where(futur, -np.inf, scores) avec futur = np.triu(np.ones((n, n), dtype=bool), k=1) ; la softmax donne alors exactement 0 aux positions du futur.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ATTENTION_MASQUE,
        "",
        "rng = np.random.default_rng(2)",
        "n, d = 5, 8",
        "X = rng.normal(size=(n, d))",
        "Wq, Wk, Wv = (rng.normal(size=(d, d)) / np.sqrt(d) for _ in range(3))",
        "",
        "def auto_attention(X, causal):",
        "    masque = np.tril(np.ones((len(X), len(X)), dtype=bool)) if causal else None",
        "    return attention(X @ Wq, X @ Wk, X @ Wv, masque)",
        "",
        "print('poids bidirectionnels (type BERT) :')",
        "print(auto_attention(X, causal=False)[1].round(2))",
        "print('poids causaux (type GPT) :')",
        "print(auto_attention(X, causal=True)[1].round(2))",
        "",
        "X_modifie = X.copy()",
        "X_modifie[2] = rng.normal(size=d)  # on remplace le troisième élément",
        "for causal in (False, True):",
        "    avant, _ = auto_attention(X, causal)",
        "    apres, _ = auto_attention(X_modifie, causal)",
        "    changements = np.abs(avant - apres).max(axis=1).round(3)",
        "    print('causal       ' if causal else 'bidirectionnel', ': changement de la sortie à chaque position :', changements)",
      ),
      caption:
        "Les poids bidirectionnels sont tous positifs. Les poids causaux forment un triangle : le premier élément a la ligne [1, 0, 0, 0, 0], et chaque ligne somme toujours à 1. Remplacer le troisième élément (position 2) modifie la sortie de toutes les positions avec l'attention bidirectionnelle (changements de 0,274 à 2,113 selon la position). Avec le masque causal, les positions 0 et 1, qui le précèdent, ne changent pas du tout (0,0) : seules les positions 2, 3 et 4 réagissent (2,670, 2,516 et 0,598). C'est cette propriété qui permet de générer un mot à la fois sans réécrire le passé.",
    },
    {
      kind: "text",
      md: `### Comment on les entraîne : deux façons de fabriquer des exemples

Aucune de ces tâches n'exige d'étiquettes faites à la main : **le texte fournit lui-même la réponse**. C'est ce qui permet de pré-entraîner sur d'énormes quantités de texte brut.

**BERT** (Devlin et al., 2018) est entraîné à retrouver des **mots masqués**. On choisit au hasard 15 % des éléments de la séquence ; parmi eux, 80 % sont remplacés par un jeton spécial \`[MASK]\`, 10 % par un élément au hasard, et 10 % laissés tels quels. Le modèle doit retrouver l'élément d'origine à ces positions, en s'appuyant sur le contexte des deux côtés. Les deux derniers cas évitent que le modèle ne s'habitue à ne voir « un mot à deviner » que sous la forme \`[MASK]\`, qui n'existe pas lors de l'utilisation. L'article d'origine ajoute une seconde tâche, qui prédit si deux phrases se suivent.

**GPT** (Radford et al., 2018) est entraîné à prédire le **mot suivant** : à chaque position, la cible est l'élément de la position d'après. Les entrées sont la séquence privée de son dernier élément, les cibles la séquence privée de son premier : un simple décalage d'un cran. Grâce au masque causal, toutes les prédictions se calculent en un seul passage.`,
    },
    {
      kind: "equation",
      latex: String.raw`\mathcal{L}_{\text{GPT}} = -\sum_{t=2}^{T}\log P\big(x_t \mid x_1,\dots,x_{t-1}\big) \qquad \mathcal{L}_{\text{BERT}} = -\sum_{t\in\text{masqués}}\log P\big(x_t \mid \text{séquence modifiée}\big)`,
      caption: "Les deux objectifs de pré-entraînement : le GPT prédit chaque élément d'après ceux qui le précèdent, BERT prédit les éléments masqués d'après tous les autres",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `exemple_mlm(tokens, positions)` qui fabrique un exemple de mots masqués. Elle renvoie `(entree, etiquettes)` : `entree` est une **copie** de la liste `tokens` où les éléments aux `positions` données sont remplacés par `\"[MASK]\"` ; `etiquettes` est une liste de même longueur qui contient le mot d'origine aux `positions` masquées, et `None` partout ailleurs. La liste `tokens` d'origine ne doit pas être modifiée.",
      starter: lines(
        "def exemple_mlm(tokens, positions):",
        "    # à compléter : masquer les positions demandées et conserver les mots d'origine comme étiquettes",
        "    return list(tokens), [None] * len(tokens)",
      ),
      solution: lines(
        "def exemple_mlm(tokens, positions):",
        "    entree = list(tokens)",
        "    etiquettes = [None] * len(tokens)",
        "    for i in positions:",
        "        etiquettes[i] = tokens[i]",
        "        entree[i] = '[MASK]'",
        "    return entree, etiquettes",
        "",
        "print(exemple_mlm(['la', 'médiathèque', 'ouvre', 'le', 'samedi'], [1, 4]))",
      ),
      test: lines(
        "_tokens = ['la', 'médiathèque', 'ouvre', 'le', 'samedi']",
        "_copie = list(_tokens)",
        "_entree, _etiquettes = exemple_mlm(_tokens, [1, 4])",
        "assert _entree == ['la', '[MASK]', 'ouvre', 'le', '[MASK]'], f\"les positions 1 et 4 doivent devenir [MASK] et les autres rester identiques (vous avez {_entree})\"",
        "assert _etiquettes == [None, 'médiathèque', None, None, 'samedi'], f\"les étiquettes doivent contenir le mot d'origine aux positions masquées et None ailleurs (vous avez {_etiquettes})\"",
        "assert _tokens == _copie, \"la liste tokens d'origine ne doit pas être modifiée : travaillez sur une copie\"",
        "assert exemple_mlm(_tokens, []) == (_tokens, [None] * 5), \"sans position à masquer, l'entrée est inchangée et toutes les étiquettes valent None\"",
      ),
      hint: "Partez de entree = list(tokens) et etiquettes = [None] * len(tokens), puis, pour chaque position i, etiquettes[i] = tokens[i] et entree[i] = '[MASK]'.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "def masquer_mlm(tokens, vocabulaire, rng, taux=0.15):",
        "    entree, etiquettes = list(tokens), [None] * len(tokens)",
        "    for i, mot in enumerate(tokens):",
        "        if rng.random() < taux:  # ce mot est choisi pour la prédiction",
        "            etiquettes[i] = mot",
        "            tirage = rng.random()",
        "            if tirage < 0.8:",
        "                entree[i] = '[MASK]'",
        "            elif tirage < 0.9:",
        "                entree[i] = vocabulaire[rng.integers(len(vocabulaire))]",
        "            # sinon : le mot est laissé tel quel",
        "    return entree, etiquettes",
        "",
        "vocabulaire = ['la', 'médiathèque', 'ouvre', 'ses', 'portes', 'le', 'samedi', 'matin', 'prêt', 'livre', 'roman', 'atelier']",
        "rng = np.random.default_rng(0)",
        "phrase = ['la', 'médiathèque', 'ouvre', 'ses', 'portes', 'le', 'samedi', 'matin']",
        "entree, etiquettes = masquer_mlm(phrase * 4, vocabulaire, rng)",
        "print('entrée     :', entree)",
        "print('étiquettes :', etiquettes)",
        "",
        "# Sur un grand nombre d'éléments, on retrouve les proportions 15 % puis 80 / 10 / 10",
        "grand = [vocabulaire[i % len(vocabulaire)] for i in range(20000)]",
        "entree, etiquettes = masquer_mlm(grand, vocabulaire, rng)",
        "choisis = [i for i, e in enumerate(etiquettes) if e is not None]",
        "masques = sum(entree[i] == '[MASK]' for i in choisis)",
        "inchanges = sum(entree[i] == grand[i] for i in choisis)",
        "print(f'éléments choisis : {len(choisis) / len(grand):.3f} du total')",
        "print(f'parmi eux, [MASK] : {masques / len(choisis):.3f}, inchangés : {inchanges / len(choisis):.3f}')",
        "",
        "# GPT : le mot suivant, par simple décalage",
        "mots = ['la', 'médiathèque', 'ouvre', 'ses', 'portes']",
        "entrees, cibles = mots[:-1], mots[1:]",
        "for e, c in zip(entrees, cibles):",
        "    print(f'  après « {e} », prédire « {c} »')",
      ),
      caption:
        "Sur un tirage de 20 000 éléments, 15,0 % sont choisis ; parmi eux, 81,1 % deviennent [MASK] et 10,2 % ressortent inchangés (valeurs propres à ce tirage, proches des 80 % et 10 % visés ; un remplacement au hasard peut retomber sur le mot d'origine, ce qui gonfle un peu la dernière part). Le décalage de GPT est encore plus simple : une même liste donne les entrées (tous sauf le dernier) et les cibles (tous sauf le premier).",
    },
    {
      kind: "text",
      md: lines(
        "### Utiliser ces modèles en pratique (code à lire)",
        "",
        "Les modèles pré-entraînés se comptent en centaines de millions de paramètres : ils ne tournent pas dans le moteur de ce site, qui n'a ni PyTorch ni la bibliothèque **transformers**. Sur votre machine, après `pip install transformers torch`, la bibliothèque de Hugging Face en donne l'accès en quelques lignes. Le premier appel télécharge les poids du modèle, soit plusieurs centaines de mégaoctets.",
        "",
        "Un encodeur de type BERT devine un mot masqué ; un décodeur de type GPT continue un texte ; un Vision Transformer classe une image :",
        "",
        "```python",
        "from transformers import pipeline",
        "",
        "# Encodeur : deviner le mot masqué",
        "deviner = pipeline('fill-mask', model='bert-base-uncased')",
        "print(deviner('The library is open on [MASK].'))",
        "",
        "# Décodeur : continuer un texte",
        "generer = pipeline('text-generation', model='gpt2')",
        "print(generer('The library opens', max_new_tokens=15)[0]['generated_text'])",
        "",
        "# Vision Transformer : classer une image",
        "classer = pipeline('image-classification', model='google/vit-base-patch16-224')",
        "print(classer('mon_image.jpg')[:3])",
        "```",
        "",
        "Pour récupérer les **représentations internes** plutôt qu'une prédiction, on charge le modèle et son découpeur de texte (*tokenizer*) séparément :",
        "",
        "```python",
        "from transformers import AutoModel, AutoTokenizer",
        "",
        "tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')",
        "modele = AutoModel.from_pretrained('bert-base-uncased')",
        "entrees = tokenizer('The library opens early', return_tensors='pt')",
        "sortie = modele(**entrees)",
        "print(sortie.last_hidden_state.shape)  # (1, nombre de tokens, 768) pour bert-base",
        "```",
        "",
        "Retenez deux précautions. Un modèle pré-entraîné reflète les textes sur lesquels il a appris, avec leurs biais et leurs lacunes : mesurez-le sur **vos** données avant de lui faire confiance. Et un modèle qui génère un texte fluide peut affirmer des choses fausses avec assurance : la fluidité ne prouve pas l'exactitude.",
      ),
    },
    {
      kind: "text",
      md: `### Les Vision Transformers : une image est une séquence de patchs

Le Transformer a d'abord été pensé pour des séquences de mots. Dosovitskiy et ses coauteurs (2020) montrent qu'on peut l'appliquer presque tel quel à des images, à condition de transformer l'image en séquence. Leur idée tient dans le titre de l'article, *An Image is Worth 16x16 Words* :

1. on **découpe** l'image en petits carrés de 16 × 16 pixels, les **patchs** ;
2. on **aplatit** chaque patch en un vecteur et on le projette linéairement vers la dimension du modèle : c'est l'équivalent du plongement d'un mot ;
3. on ajoute un **jeton de classe**, un vecteur supplémentaire dont la sortie servira à classer l'image, et des **positions apprises** pour que l'ordre des patchs compte ;
4. la séquence passe dans un **encodeur** Transformer standard, sans masque.

Pour une image de 224 × 224 pixels, cela donne (224 / 16)² = 196 patchs (197 éléments avec le jeton de classe). Découper en patchs, plutôt que de traiter chaque pixel comme un élément, est ce qui rend l'attention abordable : nous le chiffrons plus bas.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `decouper_en_patchs(image, p)`, qui découpe une image en niveaux de gris de forme `(H, W)` en patchs de `p × p` pixels (`H` et `W` sont des multiples de `p`) et renvoie un tableau `(nombre_de_patchs, p * p)`. Les patchs sont lus **ligne par ligne**, de gauche à droite puis de haut en bas, et chaque patch est aplati lui aussi ligne par ligne. Indice : `image.reshape(H // p, p, W // p, p)`, puis `transpose(0, 2, 1, 3)` met les deux indices de patch devant les deux indices de pixel.",
      setup: "import numpy as np",
      starter: lines(
        "def decouper_en_patchs(image, p):",
        "    # à compléter : un patch par ligne, lus de gauche à droite puis de haut en bas",
        "    return image.reshape(-1, p * p)",
      ),
      solution: lines(PATCHS, "", "print(decouper_en_patchs(np.arange(36).reshape(6, 6), 3))"),
      test: lines(
        "_image = np.arange(36).reshape(6, 6)",
        "_r = np.asarray(decouper_en_patchs(_image, 3))",
        "assert _r.shape == (4, 9), f\"une image 6 × 6 en patchs de 3 × 3 donne 4 patchs de 9 valeurs : forme (4, 9), vous avez {_r.shape}\"",
        "assert np.array_equal(_r[0], _image[:3, :3].ravel()), f\"le premier patch est le coin en haut à gauche : {_image[:3, :3].ravel()} (vous avez {_r[0]})\"",
        "assert np.array_equal(_r[1], _image[:3, 3:].ravel()), f\"le deuxième patch est le coin en haut à droite : {_image[:3, 3:].ravel()} (vous avez {_r[1]})\"",
        "assert np.array_equal(_r[2], _image[3:, :3].ravel()), \"le troisième patch est le coin en bas à gauche\"",
        "_grande = np.arange(8 * 12).reshape(8, 12)",
        "_r2 = np.asarray(decouper_en_patchs(_grande, 4))",
        "assert _r2.shape == (6, 16), f\"une image 8 × 12 en patchs de 4 × 4 donne 2 × 3 = 6 patchs de 16 valeurs, vous avez {_r2.shape}\"",
        "assert np.array_equal(_r2[4], _grande[4:8, 4:8].ravel()), \"le cinquième patch (indice 4) est la deuxième ligne de patchs, deuxième colonne\"",
      ),
      hint: "image.reshape(H // p, p, W // p, p).transpose(0, 2, 1, 3).reshape(-1, p * p) : le transpose place l'indice de ligne de patch puis celui de colonne de patch avant les indices de pixel.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "from sklearn.datasets import load_digits",
        "",
        PATCHS,
        "",
        "chiffres = load_digits()",
        "image = chiffres.images[0]  # un chiffre de 8 × 8 pixels, valeurs de 0 à 16",
        "patchs = decouper_en_patchs(image, 4)",
        "print('image', image.shape, '-> patchs', patchs.shape, ' (chiffre', chiffres.target[0], ')')",
        "",
        "# Plongement : projection linéaire (aléatoire ici), jeton de classe et positions",
        "rng = np.random.default_rng(0)",
        "d_model = 8",
        "projection = rng.normal(size=(16, d_model)) / 4",
        "jeton_classe = rng.normal(size=(1, d_model))",
        "positions = rng.normal(size=(5, d_model))",
        "sequence = np.vstack([jeton_classe, patchs @ projection]) + positions",
        "print('séquence envoyée à l’encodeur :', sequence.shape)",
        "",
        "# Le même calcul à l'échelle d'une image de 224 × 224 pixels",
        "for p in (16, 8):",
        "    n = (224 // p) ** 2",
        "    print(f'patchs de {p} × {p} : {n} éléments, {n * n:,} paires à comparer'.replace(',', ' '))",
        "print(f'un pixel par élément : {224 * 224} éléments, {(224 * 224) ** 2:,} paires à comparer'.replace(',', ' '))",
        "",
        "fig, axes = plt.subplots(1, 5, figsize=(9, 2.2))",
        "axes[0].imshow(image, cmap='gray_r')",
        "axes[0].set_title('image 8 × 8', fontsize=9)",
        "for i, ax in enumerate(axes[1:]):",
        "    ax.imshow(patchs[i].reshape(4, 4), cmap='gray_r', vmin=0, vmax=16)",
        "    ax.set_title(f'patch {i}', fontsize=9)",
        "for ax in axes:",
        "    ax.axis('off')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption:
        "Le premier chiffre du jeu (un « 0 ») de 8 × 8 pixels donne 4 patchs de 16 valeurs ; avec un jeton de classe, la séquence compte 5 éléments de 8 dimensions. À l'échelle d'une image de 224 × 224 pixels : 196 patchs de 16 × 16 donnent 38 416 paires d'éléments à comparer par tête d'attention ; des patchs de 8 × 8 en donnent 784 éléments et 614 656 paires ; un pixel par élément en donnerait 50 176 éléments et 2 517 630 976 paires. Le découpage en patchs rend l'attention abordable.",
    },
    {
      kind: "note",
      tone: "info",
      md: "**Ce que le Vision Transformer ne prend pas pour acquis.** Un réseau convolutif suppose, par sa construction même, qu'un motif garde le même sens où qu'il apparaisse dans l'image et que les pixels voisins comptent le plus. Un Vision Transformer ne contient pas ces hypothèses : il a, selon les termes de ses auteurs, **moins de biais propres aux images**, et doit apprendre ces régularités à partir des données. Dosovitskiy et ses coauteurs observent qu'il ne se généralise pas bien avec peu de données, et qu'il devient compétitif quand il est pré-entraîné sur de très grands jeux d'images. Ce n'est donc pas un remplaçant universel : pour un petit jeu d'images, un réseau convolutif ou un modèle pré-entraîné reste un point de départ plus sûr.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Vous rencontrerez des phrases comme « BERT comprend le sens » ou « GPT raisonne ». Ce sont des raccourcis. Ce que l'on peut vérifier, c'est ce que chaque architecture **calcule** (ici : qui regarde qui, quelle tâche de pré-entraînement) et ce que le modèle **obtient** sur une tâche mesurée avec des données de test. Les performances comparées de tel ou tel modèle changent vite et dépendent des jeux de données : ce cours n'en cite aucune, et vous devriez vous méfier de toute comparaison chiffrée sans sa source.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi un modèle de type GPT a-t-il besoin d'un masque causal à l'entraînement ?",
      options: [
        "Pour réduire la taille du vocabulaire",
        "Sans lui, chaque position verrait le mot suivant, qu'elle doit justement prédire : la tâche serait triviale",
        "Pour que le modèle ignore la ponctuation",
        "Pour accélérer la génération en l'arrêtant plus tôt",
      ],
      correct: 1,
      explanation: "Le décodeur prédit le mot suivant à toutes les positions en un seul passage. Le masque met à zéro le poids des positions futures, de sorte que la réponse n'est jamais visible.",
    },
    {
      question: "Comment BERT est-il pré-entraîné ?",
      options: [
        "À prédire le mot suivant, de gauche à droite",
        "À retrouver des éléments masqués d'après le contexte situé des deux côtés",
        "À traduire des phrases",
        "À classer des images",
      ],
      correct: 1,
      explanation: "On masque environ 15 % des éléments et le modèle doit les retrouver, ce qui l'oblige à utiliser le contexte à gauche comme à droite. C'est ce qui rend son attention bidirectionnelle utile.",
    },
    {
      question: "Dans l'attention croisée d'un décodeur d'encodeur-décodeur, d'où viennent les requêtes, les clés et les valeurs ?",
      options: [
        "Tout vient du décodeur",
        "Tout vient de l'encodeur",
        "Les requêtes viennent du décodeur, les clés et les valeurs de l'encodeur",
        "Les requêtes viennent de l'encodeur, les clés et les valeurs du décodeur",
      ],
      correct: 2,
      explanation: "Chaque élément en cours d'écriture interroge (requête) les éléments de la phrase source, représentés par leurs clés et leurs valeurs. La matrice de poids est donc rectangulaire.",
    },
    {
      question: "Un Vision Transformer découpe une image de 224 × 224 pixels en patchs de 16 × 16. Combien de patchs obtient-on ?",
      options: ["14", "196", "224", "3136"],
      correct: 1,
      explanation: "224 / 16 = 14 patchs par côté, donc 14 × 14 = 196 patchs (197 éléments avec le jeton de classe).",
    },
    {
      question: "Pourquoi un Vision Transformer demande-t-il en général beaucoup de données pour être performant ?",
      options: [
        "Parce qu'il n'a pas de paramètres",
        "Parce qu'il n'a pas, par construction, les hypothèses d'un réseau convolutif (localité, motifs identiques partout) et doit les apprendre",
        "Parce que les patchs sont trop grands",
        "Parce qu'il ne fonctionne que sur des images en noir et blanc",
      ],
      correct: 1,
      explanation: "Le Vision Transformer a moins de biais propres aux images que les réseaux convolutifs : c'est une souplesse, mais elle se paie en données, ce que les auteurs de l'article d'origine observent.",
    },
  ],
};
