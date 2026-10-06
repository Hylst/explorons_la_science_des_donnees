import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const SOFTMAX = lines(
  "import numpy as np",
  "",
  "def softmax(x):",
  "    x = np.asarray(x, dtype=float)",
  "    e = np.exp(x - x.max(axis=-1, keepdims=True))",
  "    return e / e.sum(axis=-1, keepdims=True)",
);

export const moduleTransformers: LessonModule = {
  id: "transformers-bert",
  title: "Plongements, attention et BERT",
  duration: "2 h 30",
  summary: "Des mots représentés par des vecteurs, le mécanisme d'attention programmé avec NumPy, et les modèles pré-entraînés de type BERT.",
  objectives: [
    "Expliquer ce qu'est un plongement de mots (embedding)",
    "Programmer une fonction softmax stable et l'attention par produit scalaire",
    "Comprendre le pré-entraînement de BERT par mots masqués",
    "Savoir utiliser un modèle pré-entraîné, et ce que cela suppose",
  ],
  sections: [
    {
      kind: "text",
      md: `### Des mots aux vecteurs denses

Dans un sac de mots, chaque mot est une colonne à part : « livre » et « roman » sont aussi différents que « livre » et « parking ». Les **plongements** (*embeddings*) représentent chaque mot par un vecteur de quelques centaines de nombres, appris de sorte que des mots employés dans des contextes semblables aient des vecteurs proches. Word2vec (Mikolov et al., 2013) a popularisé l'idée.

Limite : un seul vecteur par mot, quel que soit le sens. « avocat » a le même vecteur au tribunal et dans une salade. Les **transformeurs** résolvent ce problème en calculant un vecteur **pour chaque mot dans sa phrase**, grâce à l'**attention**.`,
    },
    {
      kind: "text",
      md: `### L'attention

Pour recalculer le vecteur d'un mot, l'attention regarde **tous les mots de la phrase** et décide combien chacun compte. Chaque mot produit trois vecteurs :

- une **requête** (Q) : ce que le mot cherche ;
- une **clé** (K) : ce que le mot offre ;
- une **valeur** (V) : l'information qu'il transmet.

Le score entre deux mots est le produit scalaire de la requête de l'un et de la clé de l'autre, divisé par la racine de la dimension. Une **softmax** transforme ces scores en poids positifs de somme 1, et le nouveau vecteur du mot est la moyenne des valeurs pondérée par ces poids. En une formule : \`attention(Q, K, V) = softmax(Q Kᵀ / √d) V\`. C'est le cœur de l'architecture *Transformer* (Vaswani et al., 2017).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez une fonction `softmax(x)` **stable** : elle transforme un vecteur de scores en probabilités (positives, de somme 1). Calculée naïvement, `np.exp(1000)` déborde ; l'astuce consiste à **soustraire le maximum** avant l'exponentielle, ce qui ne change pas le résultat. Gérez aussi les matrices : la softmax s'applique alors à **chaque ligne** (`axis=-1`, `keepdims=True`).",
      setup: "import numpy as np",
      starter: lines("def softmax(x):", "    x = np.asarray(x, dtype=float)", "    return np.exp(x) / np.exp(x).sum(axis=-1, keepdims=True)"),
      solution: lines(SOFTMAX, "", "print(softmax([1.0, 2.0, 3.0]).round(3))", "print(softmax([1000.0, 1000.0]))"),
      test: lines(
        "import warnings",
        "warnings.simplefilter('ignore')",
        "assert np.allclose(softmax([1.0, 2.0, 3.0]), [0.09003057, 0.24472847, 0.66524096]), \"softmax([1, 2, 3]) doit valoir environ [0.090, 0.245, 0.665]\"",
        "assert np.allclose(softmax([1000.0, 1000.0]), [0.5, 0.5]), f\"softmax([1000, 1000]) doit valoir [0.5, 0.5] sans débordement (vous avez {softmax([1000.0, 1000.0])}) : soustrayez le maximum\"",
        "assert np.allclose(softmax(np.array([[1.0, 1.0], [0.0, 1000.0]])), [[0.5, 0.5], [0.0, 1.0]]), \"sur une matrice, la softmax s'applique à chaque ligne\"",
      ),
      hint: "e = np.exp(x - x.max(axis=-1, keepdims=True)), puis e / e.sum(axis=-1, keepdims=True).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `attention(Q, K, V)` : calculez les scores `Q @ K.T` divisés par la racine de la dimension `d` (nombre de colonnes de K), appliquez `softmax` à chaque ligne pour obtenir les **poids**, et renvoyez le couple `(poids @ V, poids)`. La fonction `softmax` stable est fournie.",
      setup: SOFTMAX,
      starter: lines("def attention(Q, K, V):", "    poids = Q @ K.T", "    return poids @ V, poids"),
      solution: lines(
        "def attention(Q, K, V):",
        "    d = K.shape[1]",
        "    poids = softmax(Q @ K.T / np.sqrt(d))",
        "    return poids @ V, poids",
        "",
        "rng = np.random.default_rng(0)",
        "Q, K, V = rng.normal(size=(3, 4)), rng.normal(size=(3, 4)), rng.normal(size=(3, 4))",
        "sortie, poids = attention(Q, K, V)",
        "print(poids.round(2))",
        "print('somme de chaque ligne :', poids.sum(axis=1).round(6))",
      ),
      test: lines(
        "_rng = np.random.default_rng(1)",
        "_Q, _K, _V = _rng.normal(size=(5, 8)), _rng.normal(size=(5, 8)), _rng.normal(size=(5, 3))",
        "_s, _p = attention(_Q, _K, _V)",
        "assert np.allclose(_p.sum(axis=1), 1), \"chaque ligne de poids doit sommer à 1 : appliquez softmax aux scores\"",
        "_attendus = softmax(_Q @ _K.T / np.sqrt(8))",
        "assert np.allclose(_p, _attendus), \"les poids doivent être softmax(Q @ K.T / racine de d), avec d = K.shape[1]\"",
        "assert np.allclose(_s, _attendus @ _V), \"la sortie doit être poids @ V\"",
      ),
      hint: "d = K.shape[1] ; poids = softmax(Q @ K.T / np.sqrt(d)) ; return poids @ V, poids.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        SOFTMAX,
        "",
        "# Pourquoi diviser par la racine de d ? Requêtes et clés aléatoires de dimension 512",
        "rng = np.random.default_rng(0)",
        "d = 512",
        "Q, K = rng.normal(size=(4, d)), rng.normal(size=(4, d))",
        "scores = Q @ K.T",
        "print('écart-type des scores bruts :', round(scores.std(), 1))",
        "print('plus grand poids par ligne, sans division :', softmax(scores).max(axis=1).round(3))",
        "print('plus grand poids par ligne, avec division :', softmax(scores / np.sqrt(d)).max(axis=1).round(3))",
      ),
      caption: "Les produits scalaires grandissent avec la dimension (écart-type mesuré ici : 25,3, de l'ordre de √512 ≈ 22,6). Sans division, trois lignes sur quatre donnent tout le poids (1,0) à un seul mot, ce qui gêne l'apprentissage ; divisés par √d, le plus grand poids va de 0,45 à 0,76 et les autres mots comptent encore.",
    },
    {
      kind: "text",
      md: `### BERT et les modèles pré-entraînés

Un transformeur empile des dizaines de couches d'attention et compte des centaines de millions de paramètres. Personne ne les entraîne pour chaque tâche : on les **pré-entraîne** une fois sur d'immenses quantités de texte, puis on les **ajuste** (*fine-tuning*) sur une tâche précise avec peu d'exemples.

**BERT** (Devlin et al., 2018) est pré-entraîné à **deviner des mots masqués** : on cache des mots d'une phrase et le modèle apprend à les retrouver à partir du contexte, à gauche comme à droite. Pour le français, **CamemBERT** (Martin et al., 2020) suit la même recette sur 138 Go de textes du corpus OSCAR.`,
    },
    {
      kind: "text",
      md: lines(
        "Ces modèles ne tournent pas dans le moteur de ce site (ils pèsent des centaines de mégaoctets). Avec la bibliothèque **transformers** de Hugging Face, sur votre machine, deviner un mot masqué tient en trois lignes :",
        "",
        "```python",
        "from transformers import pipeline",
        "",
        "deviner = pipeline('fill-mask', model='almanach/camembert-base')",
        "print(deviner('Le prêt de livres est <mask> pour les enfants.'))",
        "```",
        "",
        "Le premier appel télécharge le modèle. Les propositions reflètent les textes d'entraînement, avec leurs biais : un modèle pré-entraîné s'évalue sur ses propres données avant de lui faire confiance.",
      ),
    },
    {
      kind: "note",
      tone: "info",
      md: "Les transformeurs découpent le texte en **sous-mots** plutôt qu'en mots : un mot rare est coupé en morceaux plus fréquents. Le vocabulaire reste ainsi de taille raisonnable (quelques dizaines de milliers d'unités), et aucun mot n'est totalement inconnu.",
    },
  ],
  quiz: [
    {
      question: "Quel avantage les plongements contextuels (BERT) ont-ils sur word2vec ?",
      options: [
        "Ils sont plus petits",
        "Le vecteur d'un mot dépend de la phrase, donc « avocat » n'a pas le même vecteur au tribunal et en cuisine",
        "Ils n'ont pas besoin d'entraînement",
        "Ils ne fonctionnent qu'en anglais",
      ],
      correct: 1,
      explanation: "Word2vec donne un seul vecteur par mot ; l'attention recalcule le vecteur de chaque mot à partir de ses voisins.",
    },
    {
      question: "Pourquoi soustraire le maximum dans la softmax ?",
      options: [
        "Pour changer le résultat",
        "Pour éviter le débordement de l'exponentielle, sans changer le résultat",
        "Pour que la somme fasse 0",
        "Pour aller plus vite",
      ],
      correct: 1,
      explanation: "exp(x - m) / somme(exp(x - m)) = exp(x) / somme(exp(x)) : le facteur exp(-m) se simplifie, et les exponentielles restent petites.",
    },
    {
      question: "Comment BERT est-il pré-entraîné ?",
      options: [
        "En traduisant des textes",
        "En devinant des mots masqués à partir du contexte",
        "En classant des avis",
        "En générant des images",
      ],
      correct: 1,
      explanation: "Le masquage oblige le modèle à utiliser le contexte des deux côtés du mot ; il est ensuite ajusté sur la tâche voulue.",
    },
  ],
};
