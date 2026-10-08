import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** softmax stable et attention par produit scalaire, qui marche sur une matrice (n, d) comme sur un lot de têtes (h, n, d) */
const ATTENTION = lines(
  "import numpy as np",
  "",
  "def softmax(x):",
  "    e = np.exp(x - x.max(axis=-1, keepdims=True))",
  "    return e / e.sum(axis=-1, keepdims=True)",
  "",
  "def attention(Q, K, V):",
  "    d_k = K.shape[-1]",
  "    poids = softmax(Q @ K.swapaxes(-1, -2) / np.sqrt(d_k))",
  "    return poids @ V, poids",
);

/** Codage positionnel de l'article de 2017 */
const CODAGE = lines(
  "def codage_positionnel(n_positions, d_model):",
  "    positions = np.arange(n_positions)[:, None]",
  "    indices_pairs = np.arange(0, d_model, 2)[None, :]",
  "    angles = positions / 10000 ** (indices_pairs / d_model)",
  "    PE = np.zeros((n_positions, d_model))",
  "    PE[:, 0::2] = np.sin(angles)",
  "    PE[:, 1::2] = np.cos(angles)",
  "    return PE",
);

export const module4: LessonModule = {
  id: "attention-multi-tetes",
  title: "Attention multi-têtes et codage positionnel",
  duration: "2 h 30",
  summary:
    "De l'attention d'un seul point de vue à l'attention multi-têtes, programmées en NumPy ; pourquoi l'attention ne voit pas l'ordre des mots et comment le codage positionnel en sinus et cosinus le lui apprend ; puis l'assemblage d'un bloc d'encodeur complet.",
  objectives: [
    "Construire Q, K et V à partir des mêmes plongements par trois projections, et suivre les formes des matrices",
    "Programmer l'attention multi-têtes (têtes calculées en parallèle, concaténées puis projetées)",
    "Montrer, par la mesure, que l'attention seule ne dépend pas de l'ordre des éléments",
    "Calculer et tracer le codage positionnel en sinus et cosinus, et assembler un bloc d'encodeur",
  ],
  sections: [
    {
      kind: "text",
      md: `### Rappel : de l'attention à l'auto-attention

Le module « Plongements, attention et BERT » du cours de traitement du langage programme la softmax et l'attention par produit scalaire sur des matrices Q, K et V données. Nous reprenons ces deux fonctions telles quelles, sous une forme qui accepte aussi un lot de plusieurs têtes, et nous nous concentrons sur ce qui manque pour arriver à un Transformer.

Dans un Transformer, Q, K et V ne sont pas des données : on les **calcule à partir de la même séquence** de plongements X (une ligne par élément, \`d_model\` colonnes), par trois **projections linéaires apprises**. Comme les requêtes, les clés et les valeurs viennent de la même séquence, on parle d'**auto-attention** (*self-attention*) : chaque élément regarde tous les éléments de sa propre séquence, lui-même compris. Pendant l'entraînement, ce sont les matrices W qui s'apprennent, par descente de gradient.`,
    },
    {
      kind: "equation",
      latex: String.raw`Q = X\,W^{Q} \qquad K = X\,W^{K} \qquad V = X\,W^{V}`,
      caption: "Projections apprises de l'auto-attention : X est de forme (n, d_model), chaque matrice W est de forme (d_model, d_model) dans la version à une seule tête",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ATTENTION,
        "",
        "rng = np.random.default_rng(0)",
        "mots = ['la', 'médiathèque', 'ouvre', 'tôt']",
        "n, d_model = len(mots), 8",
        "X = rng.normal(size=(n, d_model))  # plongements aléatoires : rien n'est appris ici",
        "Wq, Wk, Wv = (rng.normal(size=(d_model, d_model)) / np.sqrt(d_model) for _ in range(3))",
        "",
        "Q, K, V = X @ Wq, X @ Wk, X @ Wv",
        "sortie, poids = attention(Q, K, V)",
        "print('formes de X, Q, K, V, sortie, poids :', X.shape, Q.shape, K.shape, V.shape, sortie.shape, poids.shape)",
        "print('poids d’attention (ligne = mot qui regarde, colonne = mot regardé) :')",
        "print(poids.round(2))",
        "print('somme de chaque ligne :', poids.sum(axis=1).round(6))",
      ),
      caption:
        "Quatre mots, huit dimensions : la sortie a la même forme que l'entrée (4, 8), et la matrice de poids est carrée (4, 4), une ligne par mot qui regarde, de somme 1. Les poids viennent de matrices tirées au hasard : ils ne signifient rien. Seul l'entraînement leur donne un sens.",
    },
    {
      kind: "text",
      md: `### Pourquoi plusieurs têtes

Une attention calcule, pour chaque position, **une seule** moyenne pondérée des valeurs : un seul point de vue sur la séquence. Or un mot peut avoir besoin de se relier à plusieurs choses à la fois (son sujet, son complément, le mot qui le précède). L'**attention multi-têtes** lance \`h\` attentions **en parallèle**, chacune avec ses propres projections, appelées des **têtes**. Chaque tête travaille sur un sous-espace de dimension d_k = d_model / h. Les h résultats sont ensuite **concaténés** côte à côte, puis mélangés par une dernière projection W^O.

Dans le modèle de base de l'article de 2017, d_model vaut 512, h vaut 8 et donc d_k vaut 64. Les auteurs notent que, grâce à la dimension réduite de chaque tête, le coût de calcul total reste voisin de celui d'une seule tête de pleine dimension. Les têtes ne sont pas programmées pour des tâches précises : ce qu'elles repèrent est le produit de l'entraînement.`,
    },
    {
      kind: "equation",
      latex: String.raw`\text{MultiTête}(X) = \operatorname{Concat}\big(\text{tête}_1,\dots,\text{tête}_h\big)\,W^{O} \qquad \text{tête}_i = \text{Attention}\big(X W_i^{Q},\; X W_i^{K},\; X W_i^{V}\big)`,
      caption: "Attention multi-têtes (Vaswani et al., 2017). Chaque W_i est de forme (d_model, d_k) ; mises côte à côte, les h matrices W_i^Q forment une matrice (d_model, d_model)",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `attention_multi_tetes(X, Wq, Wk, Wv, Wo, h)`. Les trois matrices de projection ont la forme `(d_model, d_model)` ; la tête numéro `i` (de 0 à `h - 1`) utilise leurs colonnes de `i * d_k` à `(i + 1) * d_k`, avec `d_k = d_model // h`. Pour chaque tête, calculez `attention(X @ Wq_i, X @ Wk_i, X @ Wv_i)`, concaténez les `h` sorties côte à côte (`np.concatenate(..., axis=1)`) et multipliez le résultat par `Wo`. La fonction `attention`, qui renvoie `(sortie, poids)`, est fournie.",
      setup: ATTENTION,
      starter: lines(
        "def attention_multi_tetes(X, Wq, Wk, Wv, Wo, h):",
        "    # à compléter : une attention par tête, concaténées, puis projetées par Wo",
        "    return X @ Wo",
      ),
      solution: lines(
        "def attention_multi_tetes(X, Wq, Wk, Wv, Wo, h):",
        "    d_k = X.shape[1] // h",
        "    sorties = []",
        "    for i in range(h):",
        "        colonnes = slice(i * d_k, (i + 1) * d_k)",
        "        sortie, _ = attention(X @ Wq[:, colonnes], X @ Wk[:, colonnes], X @ Wv[:, colonnes])",
        "        sorties.append(sortie)",
        "    return np.concatenate(sorties, axis=1) @ Wo",
        "",
        "rng = np.random.default_rng(0)",
        "X = rng.normal(size=(4, 8))",
        "W = [rng.normal(size=(8, 8)) / np.sqrt(8) for _ in range(4)]",
        "print(attention_multi_tetes(X, *W, 2).shape)",
      ),
      test: lines(
        "_rng = np.random.default_rng(5)",
        "_X = _rng.normal(size=(5, 8))",
        "_W = [_rng.normal(size=(8, 8)) / np.sqrt(8) for _ in range(4)]",
        "for _h in (1, 2, 4):",
        "    _r = np.asarray(attention_multi_tetes(_X, *_W, _h))",
        "    assert _r.shape == (5, 8), f\"avec h = {_h}, la sortie doit avoir la forme (5, 8) comme l'entrée, vous avez {_r.shape}\"",
        "    _d_k = 8 // _h",
        "    _separer = lambda M: M.reshape(5, _h, _d_k).transpose(1, 0, 2)",
        "    _sortie_tetes, _ = attention(_separer(_X @ _W[0]), _separer(_X @ _W[1]), _separer(_X @ _W[2]))",
        "    _attendu = _sortie_tetes.transpose(1, 0, 2).reshape(5, 8) @ _W[3]",
        "    assert np.allclose(_r, _attendu), f\"avec h = {_h} têtes, le résultat est faux (écart maximal {np.abs(_r - _attendu).max():.3f}) : une attention par bloc de {_d_k} colonnes, concaténées puis multipliées par Wo\"",
      ),
      hint: "Dans une boucle sur i, colonnes = slice(i * d_k, (i + 1) * d_k) ; attention(X @ Wq[:, colonnes], X @ Wk[:, colonnes], X @ Wv[:, colonnes]) donne la sortie de la tête i.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ATTENTION,
        "",
        "def multi_tetes(X, Wq, Wk, Wv, Wo, h):",
        "    \"\"\"Toutes les têtes d'un coup : on range les colonnes en (h, n, d_k) et attention() traite le lot.\"\"\"",
        "    n, d_model = X.shape",
        "    d_k = d_model // h",
        "    separer = lambda M: M.reshape(n, h, d_k).transpose(1, 0, 2)",
        "    sortie_tetes, poids = attention(separer(X @ Wq), separer(X @ Wk), separer(X @ Wv))",
        "    concat = sortie_tetes.transpose(1, 0, 2).reshape(n, d_model)",
        "    return concat @ Wo, poids",
        "",
        "def multi_tetes_boucle(X, Wq, Wk, Wv, Wo, h):",
        "    d_k = X.shape[1] // h",
        "    sorties = []",
        "    for i in range(h):",
        "        c = slice(i * d_k, (i + 1) * d_k)",
        "        sorties.append(attention(X @ Wq[:, c], X @ Wk[:, c], X @ Wv[:, c])[0])",
        "    return np.concatenate(sorties, axis=1) @ Wo",
        "",
        "rng = np.random.default_rng(0)",
        "n, d_model = 4, 8",
        "X = rng.normal(size=(n, d_model))",
        "Wq, Wk, Wv, Wo = (rng.normal(size=(d_model, d_model)) / np.sqrt(d_model) for _ in range(4))",
        "for h in (1, 2, 4, 8):",
        "    vectorisee, poids = multi_tetes(X, Wq, Wk, Wv, Wo, h)",
        "    boucle = multi_tetes_boucle(X, Wq, Wk, Wv, Wo, h)",
        "    print(f'h = {h} : sortie {vectorisee.shape}, poids {poids.shape}, écart entre les deux écritures {np.abs(vectorisee - boucle).max():.1e}')",
        "",
        "_, poids = multi_tetes(X, Wq, Wk, Wv, Wo, 2)",
        "print('poids du premier mot, tête 0 :', poids[0, 0].round(2))",
        "print('poids du premier mot, tête 1 :', poids[1, 0].round(2))",
        "",
        "d = 512  # dimension du modèle de base de l'article de 2017",
        "print('paramètres des 4 projections (sans biais), quel que soit h :', 4 * d * d)",
      ),
      caption:
        "La version « en lot » (une seule opération sur un tableau (h, n, d_k)) donne exactement le même résultat que la boucle sur les têtes : c'est celle qu'utilisent les bibliothèques, parce qu'elle tire parti du calcul matriciel. Avec h = 2, le premier mot répartit son attention différemment dans chaque tête. Le nombre de paramètres des projections ne dépend pas de h : 4 matrices de 512 × 512, soit 1 048 576 valeurs. Plus de têtes ne coûte donc pas plus de paramètres, ça découpe le même espace en morceaux plus petits.",
    },
    {
      kind: "text",
      md: `### L'attention ne voit pas l'ordre

Regardez la formule de l'attention : rien n'y dépend de la **position** des éléments. Chaque requête est comparée à toutes les clés, sans savoir où elles se trouvent. Conséquence : si l'on **permute** les éléments de la séquence, les sorties sont les mêmes, simplement permutées de la même façon. On dit que l'auto-attention est **équivariante par permutation**. Pour elle, « le chat mange la souris » et « la souris mange le chat » contiennent les mêmes mots, et un mot garde le même vecteur de sortie quel que soit son rang.

Pour un modèle de langage, c'est un défaut : l'ordre porte du sens. Il faut donc **ajouter l'information de position** aux plongements avant l'attention. Mesurons d'abord le problème.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ATTENTION,
        "",
        "rng = np.random.default_rng(1)",
        "n, d = 6, 8",
        "X = rng.normal(size=(n, d))  # six « mots » aléatoires",
        "Wq, Wk, Wv = (rng.normal(size=(d, d)) / np.sqrt(d) for _ in range(3))",
        "",
        "def auto_attention(X):",
        "    return attention(X @ Wq, X @ Wk, X @ Wv)[0]",
        "",
        "perm = np.array([3, 0, 5, 1, 4, 2])  # un nouvel ordre pour les six mots",
        "sortie = auto_attention(X)",
        "sortie_permutee = auto_attention(X[perm])",
        "print('plus grand écart entre sortie permutée et sortie des mots permutés :', np.abs(sortie[perm] - sortie_permutee).max())",
        "print('les deux sont identiques :', np.allclose(sortie[perm], sortie_permutee))",
      ),
      caption:
        "Mélanger les mots d'entrée mélange les sorties de la même façon, à l'erreur d'arrondi près (de l'ordre de 1e-16) : l'attention seule ne sait pas dans quel ordre les mots sont arrivés.",
    },
    {
      kind: "text",
      md: `### Le codage positionnel

Vaswani et ses coauteurs ajoutent à chaque plongement un **vecteur de position** calculé par une formule. À la position p et pour la paire de dimensions (2i, 2i+1), on place un sinus et un cosinus de la même fréquence. Les fréquences décroissent d'une paire à l'autre : les premières dimensions oscillent vite, les dernières très lentement, un peu comme les aiguilles d'une horloge (secondes, minutes, heures) donnent ensemble une heure unique.`,
    },
    {
      kind: "equation",
      latex: String.raw`PE_{(p,\,2i)} = \sin\!\left(\frac{p}{10000^{\,2i/d_{\text{modèle}}}}\right) \qquad PE_{(p,\,2i+1)} = \cos\!\left(\frac{p}{10000^{\,2i/d_{\text{modèle}}}}\right)`,
      caption: "Codage positionnel sinusoïdal de l'article de 2017 : p est la position (0, 1, 2...) et i l'indice de la paire de dimensions",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `codage_positionnel(n_positions, d_model)` (`d_model` est pair) : elle renvoie un tableau de forme `(n_positions, d_model)` dont la ligne `p` contient, aux colonnes paires `2i`, `sin(p / 10000 ** (2i / d_model))` et, aux colonnes impaires `2i + 1`, le **cosinus** du même angle. Avec les affectations par tranches `PE[:, 0::2]` et `PE[:, 1::2]`, une seule ligne de NumPy suffit pour chaque.",
      setup: "import numpy as np",
      starter: lines(
        "def codage_positionnel(n_positions, d_model):",
        "    PE = np.zeros((n_positions, d_model))",
        "    # à compléter : sinus aux colonnes paires, cosinus aux colonnes impaires",
        "    return PE",
      ),
      solution: lines(CODAGE, "", "print(codage_positionnel(3, 8).round(3))"),
      test: lines(
        "_PE = np.asarray(codage_positionnel(10, 8), dtype=float)",
        "assert _PE.shape == (10, 8), f\"la forme attendue est (10, 8), vous avez {_PE.shape}\"",
        "assert np.allclose(_PE[0], [0, 1, 0, 1, 0, 1, 0, 1]), f\"à la position 0, sin(0) = 0 aux colonnes paires et cos(0) = 1 aux colonnes impaires ; vous avez {_PE[0].round(3)}\"",
        "for _p in (1, 3, 9):",
        "    for _i in range(4):",
        "        _angle = _p / 10000 ** (2 * _i / 8)",
        "        assert abs(_PE[_p, 2 * _i] - np.sin(_angle)) < 1e-9, f\"PE[{_p}, {2 * _i}] doit valoir sin({_p} / 10000 ** ({2 * _i} / 8)) = {np.sin(_angle):.4f} (vous avez {_PE[_p, 2 * _i]:.4f})\"",
        "        assert abs(_PE[_p, 2 * _i + 1] - np.cos(_angle)) < 1e-9, f\"PE[{_p}, {2 * _i + 1}] doit valoir cos({_p} / 10000 ** ({2 * _i} / 8)) = {np.cos(_angle):.4f} (vous avez {_PE[_p, 2 * _i + 1]:.4f})\"",
      ),
      hint: "angles = np.arange(n_positions)[:, None] / 10000 ** (np.arange(0, d_model, 2)[None, :] / d_model) donne un tableau (n_positions, d_model / 2) ; PE[:, 0::2] = np.sin(angles) et PE[:, 1::2] = np.cos(angles).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        CODAGE,
        "",
        "PE = codage_positionnel(50, 64)",
        "print('positions 0 et 1, premières dimensions :', PE[0, :4].round(3), PE[1, :4].round(3))",
        "print('norme au carré de chaque ligne (= d_model / 2) :', (PE ** 2).sum(axis=1)[:3])",
        "for k in (0, 1, 5, 20):",
        "    produits = [PE[p] @ PE[p + k] for p in (0, 10, 25)]",
        "    print(f'PE[p] · PE[p + {k}] pour p = 0, 10, 25 :', np.round(produits, 4))",
        "",
        "fig, (gauche, droite) = plt.subplots(1, 2, figsize=(10, 4))",
        "image = gauche.imshow(PE, aspect='auto', cmap='RdBu')",
        "gauche.set_xlabel('dimension')",
        "gauche.set_ylabel('position')",
        "gauche.set_title('Codage positionnel (50 positions, 64 dimensions)', fontsize=9)",
        "fig.colorbar(image, ax=gauche)",
        "for dim in (0, 1, 8, 9, 30, 31):",
        "    droite.plot(PE[:, dim], label=f'dimension {dim}')",
        "droite.set_xlabel('position')",
        "droite.legend(fontsize=7)",
        "droite.set_title('Quelques dimensions en fonction de la position', fontsize=9)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption:
        "À gauche, une ligne par position : chaque position a un motif unique, et les dimensions de gauche (vite changeantes) se distinguent des dimensions de droite (presque constantes). À droite, les dimensions 0 et 1 font un tour complet en environ six positions, les dimensions 30 et 31 varient à peine. Une propriété se mesure : le produit scalaire PE[p] · PE[p + k] ne dépend que de l'écart k, pas de p (32,0 pour k = 0, soit d_model / 2 ; 30,9168 pour k = 1 ; 23,504 pour k = 5 ; 18,8791 pour k = 20, aux trois positions testées). Le codage donne donc au modèle de quoi comparer des distances entre positions.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Mesurez l'effet du codage positionnel. Les fonctions `auto_attention(X)` et `codage_positionnel` sont fournies, ainsi que six « mots » `X`, une permutation `perm` et `PE = codage_positionnel(6, 8)`. Rangez dans `ecart_sans` le plus grand écart absolu entre `auto_attention(X[perm])` et `auto_attention(X)[perm]` (sans positions), puis dans `ecart_avec` le plus grand écart absolu entre `auto_attention(X[perm] + PE)` et `auto_attention(X + PE)[perm]` : les mots mélangés reçoivent les positions 0 à 5 dans leur nouvel ordre.",
      setup: lines(
        ATTENTION,
        "",
        CODAGE,
        "",
        "rng = np.random.default_rng(1)",
        "n, d = 6, 8",
        "X = rng.normal(size=(n, d))",
        "Wq, Wk, Wv = (rng.normal(size=(d, d)) / np.sqrt(d) for _ in range(3))",
        "",
        "def auto_attention(X):",
        "    return attention(X @ Wq, X @ Wk, X @ Wv)[0]",
        "",
        "perm = np.array([3, 0, 5, 1, 4, 2])",
        "PE = codage_positionnel(n, d)",
      ),
      starter: lines("ecart_sans = None", "ecart_avec = None"),
      solution: lines(
        "ecart_sans = np.abs(auto_attention(X[perm]) - auto_attention(X)[perm]).max()",
        "ecart_avec = np.abs(auto_attention(X[perm] + PE) - auto_attention(X + PE)[perm]).max()",
        "print(ecart_sans, ecart_avec)",
      ),
      test: lines(
        "assert ecart_sans is not None and ecart_avec is not None, \"rangez vos deux mesures dans ecart_sans et ecart_avec\"",
        "_sans = np.abs(auto_attention(X[perm]) - auto_attention(X)[perm]).max()",
        "_avec = np.abs(auto_attention(X[perm] + PE) - auto_attention(X + PE)[perm]).max()",
        "assert abs(ecart_sans - _sans) < 1e-9, f\"ecart_sans doit être un écart nul à l'arrondi près (environ {_sans:.1e}), vous avez {ecart_sans:.3g}\"",
        "assert abs(ecart_avec - _avec) < 1e-6, f\"ecart_avec doit mesurer l'écart entre auto_attention(X[perm] + PE) et auto_attention(X + PE)[perm] (environ {_avec:.2f}), vous avez {ecart_avec:.3g}\"",
      ),
      hint: "np.abs(A - B).max() donne le plus grand écart absolu entre deux tableaux. Pour le deuxième cas, les positions PE s'ajoutent aux mots dans l'ordre où ils sont lus : X[perm] + PE d'un côté, (X + PE)[perm] de l'autre.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le codage sinusoïdal est celui de l'article de 2017, mais il n'est pas le seul. BERT et le GPT d'origine utilisent plutôt des **positions apprises** (une table de vecteurs, un par position, entraînée avec le reste du modèle), et d'autres schémas existent. Dans tous les cas, l'idée est la même : le modèle ne reçoit pas seulement quels mots sont présents, mais aussi où ils se trouvent.",
    },
    {
      kind: "text",
      md: `### Un bloc d'encodeur complet

L'attention multi-têtes n'est qu'une des deux sous-couches d'un **bloc d'encodeur**. L'autre est un petit réseau **appliqué séparément à chaque position** (*feed-forward*) : deux transformations linéaires séparées par une ReLU. Chaque sous-couche est enveloppée de deux dispositifs qui aident l'entraînement des réseaux profonds :

- une **connexion résiduelle** : on additionne l'entrée de la sous-couche à sa sortie, de sorte que le bloc n'a qu'à apprendre une correction ;
- une **normalisation de couche** (*layer normalization*) : chaque vecteur est centré et réduit sur ses propres dimensions (et non sur les exemples, à la différence du scaler du module 2).

Le bloc garde la forme (n, d_model) : on peut en empiler autant qu'on veut. L'article de 2017 en empile 6. Des variantes plus récentes placent la normalisation *avant* la sous-couche plutôt qu'après.`,
    },
    {
      kind: "equation",
      latex: String.raw`y = \operatorname{LayerNorm}\big(x + \text{SousCouche}(x)\big) \qquad \text{FFN}(x) = \max(0,\; x\,W_1)\,W_2`,
      caption: "Sous-couche d'un bloc d'encodeur : « Add & Norm » de l'article d'origine, où la sous-couche est l'attention multi-têtes ou le réseau FFN (les biais sont omis ici)",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ATTENTION,
        "",
        "def multi_tetes(X, p, h):",
        "    n, d_model = X.shape",
        "    separer = lambda M: M.reshape(n, h, d_model // h).transpose(1, 0, 2)",
        "    sortie_tetes, _ = attention(separer(X @ p['Wq']), separer(X @ p['Wk']), separer(X @ p['Wv']))",
        "    return sortie_tetes.transpose(1, 0, 2).reshape(n, d_model) @ p['Wo']",
        "",
        "def norme_couche(x, eps=1e-5):",
        "    return (x - x.mean(axis=-1, keepdims=True)) / np.sqrt(x.var(axis=-1, keepdims=True) + eps)",
        "",
        "def bloc_encodeur(X, p, h):",
        "    X = norme_couche(X + multi_tetes(X, p, h))             # attention, puis Add & Norm",
        "    ffn = np.maximum(0, X @ p['W1']) @ p['W2']              # réseau par position",
        "    return norme_couche(X + ffn)                            # Add & Norm",
        "",
        "def parametres(rng, d_model, d_ff):",
        "    t = lambda a, b: rng.normal(size=(a, b)) / np.sqrt(a)",
        "    return {'Wq': t(d_model, d_model), 'Wk': t(d_model, d_model), 'Wv': t(d_model, d_model), 'Wo': t(d_model, d_model),",
        "            'W1': t(d_model, d_ff), 'W2': t(d_ff, d_model)}",
        "",
        "rng = np.random.default_rng(3)",
        "n, d_model, d_ff, h = 5, 16, 64, 4",
        "Y = rng.normal(size=(n, d_model))",
        "couches = [parametres(rng, d_model, d_ff) for _ in range(3)]",
        "for numero, p in enumerate(couches, start=1):",
        "    Y = bloc_encodeur(Y, p, h)",
        "    print(f'après le bloc {numero} : forme {Y.shape}, moyenne max par position {np.abs(Y.mean(axis=-1)).max():.1e}, écart-type par position {Y.std(axis=-1).round(3)}')",
        "",
        "print('paramètres d’un bloc ici :', sum(v.size for v in couches[0].values()))",
        "print('paramètres d’un bloc de l’article (d_model 512, d_ff 2048, sans biais) :', 4 * 512 * 512 + 2 * 512 * 2048)",
      ),
      caption:
        "Trois blocs empilés gardent la forme (5, 16), et chaque position ressort avec une moyenne nulle et un écart-type de 1 (c'est la normalisation de couche, ici sans ses deux paramètres appris). Un bloc de ce petit exemple compte 3 072 paramètres ; avec les dimensions de l'article (d_model 512, d_ff 2048), le calcul donne 3 145 728 paramètres par bloc, sans compter les biais ni la normalisation. Les poids de l'exemple sont aléatoires : le bloc calcule, mais n'a rien appris.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "for n in (100, 1000, 10000):",
        "    poids = n * n  # une matrice (n, n) de poids par tête et par couche",
        "    print(f'{n:>6} éléments : {poids:>11,} poids par tête, soit {poids * 8 / 1e6:>7.2f} Mo en float64'.replace(',', ' '))",
      ),
      caption:
        "La matrice de poids est carrée : multiplier par 10 la longueur de la séquence multiplie par 100 sa taille (0,08 Mo, 8,00 Mo, 800,00 Mo pour une seule tête, en nombres de 8 octets). C'est la raison pour laquelle la longueur de contexte des Transformers est limitée, et pourquoi tant de recherches portent sur des attentions moins coûteuses. Ce n'est qu'un ordre de grandeur : les implémentations réelles stockent des nombres plus petits, et certaines évitent de stocker la matrice entière.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Dans ce module, toutes les matrices W sont tirées au hasard : le code montre **comment** un Transformer calcule, pas **ce qu'il sait**. Dans un modèle entraîné, les poids d'attention ont un sens, mais on ne doit pas les lire comme une explication fiable de ce que le modèle « comprend » : ce ne sont que des quantités intermédiaires, parmi des milliers d'autres. Enfin, l'attention parallélise l'**entraînement** (tous les éléments d'une séquence sont calculés ensemble), mais un décodeur qui génère du texte produit toujours un élément après l'autre : c'est l'objet du module suivant.",
    },
  ],
  quiz: [
    {
      question: "Dans l'auto-attention d'un Transformer, d'où viennent Q, K et V ?",
      options: [
        "Ce sont trois jeux de données distincts fournis en entrée",
        "Ce sont trois projections linéaires apprises de la même séquence de plongements",
        "Ils sont tirés au hasard à chaque calcul",
        "Q vient de l'entrée, K et V de la sortie",
      ],
      correct: 1,
      explanation: "Les matrices W^Q, W^K et W^V sont des paramètres du modèle, appris à l'entraînement ; appliquées à la même séquence X, elles donnent Q, K et V. C'est ce qui justifie le nom d'auto-attention.",
    },
    {
      question: "Avec d_model = 512 et h = 8 têtes, quelle est la dimension d_k de chaque tête ?",
      options: ["512", "8", "64", "4096"],
      correct: 2,
      explanation: "d_k = d_model / h = 512 / 8 = 64. Les h têtes travaillent chacune sur un sous-espace de dimension 64, et leur concaténation retrouve 8 × 64 = 512 dimensions.",
    },
    {
      question: "Que se passe-t-il pour les sorties d'une couche d'auto-attention si l'on permute les éléments d'entrée, sans codage positionnel ?",
      options: [
        "Elles changent de façon imprévisible",
        "Elles sont permutées de la même façon, sans autre changement",
        "Elles sont toutes égales",
        "Le calcul échoue",
      ],
      correct: 1,
      explanation: "L'attention compare chaque requête à toutes les clés sans connaître leur position : elle est équivariante par permutation. D'où la nécessité d'ajouter aux plongements une information de position.",
    },
    {
      question: "Que deviennent les premières dimensions du codage positionnel sinusoïdal par rapport aux dernières ?",
      options: [
        "Elles oscillent plus vite avec la position",
        "Elles oscillent plus lentement",
        "Elles sont constantes",
        "Elles valent toujours 0",
      ],
      correct: 0,
      explanation: "La fréquence décroît avec l'indice de la paire de dimensions : les premières dimensions (période d'environ 6 positions) changent vite, les dernières à peine. Ensemble, elles donnent à chaque position un motif unique.",
    },
    {
      question: "Pourquoi la mémoire d'une matrice d'attention pose-t-elle problème pour de très longues séquences ?",
      options: [
        "Parce que sa taille est proportionnelle à la longueur de la séquence",
        "Parce que sa taille est proportionnelle au carré de la longueur de la séquence",
        "Parce que le nombre de têtes augmente avec la longueur",
        "Elle ne pose aucun problème",
      ],
      correct: 1,
      explanation: "Chaque élément se compare à tous les autres : une matrice (n, n). Multiplier n par 10 multiplie le nombre de poids par 100.",
    },
  ],
};
