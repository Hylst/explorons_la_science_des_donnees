import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Traduction jouet français -> anglais : phrases de 7 mots construites par une grammaire minuscule (déterminant, nom,
 * adjectif, verbe, déterminant, nom, adjectif), 3 072 phrases possibles. L'adjectif suit le nom en français et le précède en
 * anglais : c'est ce qui force le réordonnancement. Aucune donnée extérieure : tout est fabriqué ici avec une graine.
 * Tous les chiffres cités dans ce projet ont été mesurés le 24 octobre 2026 avec Pyodide 314.0.7 (NumPy).
 */
const DONNEES = lines(
  "import numpy as np",
  "",
  "MOTS_FR = ['le', 'un', 'chat', 'chien', 'oiseau', 'cheval', 'noir', 'petit', 'grand', 'rapide', 'voit', 'suit', 'aime']",
  "MOTS_EN = ['the', 'a', 'cat', 'dog', 'bird', 'horse', 'black', 'small', 'big', 'fast', 'sees', 'follows', 'likes']",
  "dictionnaire = dict(zip(MOTS_FR, MOTS_EN))",
  "indice_fr = {mot: i for i, mot in enumerate(MOTS_FR)}",
  "indice_en = {mot: i for i, mot in enumerate(MOTS_EN)}",
  "",
  "determinants = ['le', 'un']",
  "noms = ['chat', 'chien', 'oiseau', 'cheval']",
  "adjectifs = ['noir', 'petit', 'grand', 'rapide']",
  "verbes = ['voit', 'suit', 'aime']",
  "# déterminant, nom, adjectif, verbe, déterminant, nom, adjectif",
  "phrases = [(d1, n1, a1, v, d2, n2, a2)",
  "           for d1 in determinants for n1 in noms for a1 in adjectifs for v in verbes",
  "           for d2 in determinants for n2 in noms for a2 in adjectifs]",
  "",
  "def traduction_reference(phrase):",
  "    d1, n1, a1, v, d2, n2, a2 = phrase",
  "    # en anglais, l'adjectif passe devant le nom",
  "    return [dictionnaire[m] for m in (d1, a1, n1, v, d2, a2, n2)]",
  "",
  "def encoder(liste):",
  "    S = np.array([[indice_fr[m] for m in ph] for ph in liste])",
  "    T = np.array([[indice_en[m] for m in traduction_reference(ph)] for ph in liste])",
  "    return S, T",
  "",
  "ordre = np.random.default_rng(0).permutation(len(phrases))",
  "phrases_train = [phrases[i] for i in ordre[:300]]",
  "phrases_test = [phrases[i] for i in ordre[300:800]]",
  "S_train, T_train = encoder(phrases_train)",
  "S_test, T_test = encoder(phrases_test)",
);

/** Codage positionnel, softmax, attention multi-têtes en croisé, rétropropagation, entraînement (Adam) et prédiction */
const MODELE = lines(
  "def codage_positionnel(n, d):",
  "    pos = np.arange(n)[:, None]",
  "    i = np.arange(d // 2)[None, :]",
  "    angle = pos / 10000 ** (2 * i / d)",
  "    pe = np.zeros((n, d))",
  "    pe[:, 0::2] = np.sin(angle)",
  "    pe[:, 1::2] = np.cos(angle)",
  "    return pe",
  "",
  "def softmax(x):",
  "    e = np.exp(x - x.max(axis=-1, keepdims=True))",
  "    return e / e.sum(axis=-1, keepdims=True)",
  "",
  "def init(d=16, graine=0, n_fr=13, n_en=13, longueur=7):",
  "    rng = np.random.default_rng(graine)",
  "    def tirage(*forme):",
  "        return rng.normal(0, 0.3, forme)",
  "    return {'E': tirage(n_fr, d),            # plongements des mots français",
  "            'T': tirage(longueur, d),        # un vecteur par position à produire (les « questions »)",
  "            'Wq': tirage(d, d), 'Wk': tirage(d, d), 'Wv': tirage(d, d),",
  "            'Wo': tirage(d, n_en), 'b': np.zeros(n_en)}",
  "",
  "def avant(p, S, tetes, codage):",
  "    d = p['E'].shape[1]",
  "    dk = d // tetes",
  "    B, n = S.shape",
  "    m = p['T'].shape[0]",
  "    X = p['E'][S] + codage                                              # mots + positions : (B, n, d)",
  "    Q = (p['T'] @ p['Wq']).reshape(m, tetes, dk).transpose(1, 0, 2)     # (têtes, m, dk)",
  "    K = (X @ p['Wk']).reshape(B, n, tetes, dk).transpose(0, 2, 1, 3)    # (B, têtes, n, dk)",
  "    V = (X @ p['Wv']).reshape(B, n, tetes, dk).transpose(0, 2, 1, 3)",
  "    A = softmax(np.matmul(Q[None], K.swapaxes(-1, -2)) / np.sqrt(dk))  # (B, têtes, m, n) : poids d'attention",
  "    H = np.matmul(A, V)                                                 # moyennes pondérées des valeurs",
  "    Hc = H.transpose(0, 2, 1, 3).reshape(B, m, d)                       # on recolle les têtes",
  "    logits = Hc @ p['Wo'] + p['b']                                      # un score par mot anglais",
  "    return {'X': X, 'Q': Q, 'K': K, 'V': V, 'A': A, 'Hc': Hc, 'logits': logits, 'dk': dk}",
  "",
  "def perte_grad(p, S, T, tetes, codage):",
  "    c = avant(p, S, tetes, codage)",
  "    B, n = S.shape",
  "    m = T.shape[1]",
  "    d = p['E'].shape[1]",
  "    dk = c['dk']",
  "    proba = softmax(c['logits'])",
  "    lignes = np.arange(B)[:, None]",
  "    colonnes = np.arange(m)[None, :]",
  "    perte = -np.log(proba[lignes, colonnes, T] + 1e-12).mean()",
  "    dL = proba.copy()",
  "    dL[lignes, colonnes, T] -= 1",
  "    dL /= B * m",
  "    g = {'Wo': c['Hc'].reshape(-1, d).T @ dL.reshape(B * m, -1), 'b': dL.sum(axis=(0, 1))}",
  "    dH = (dL @ p['Wo'].T).reshape(B, m, tetes, dk).transpose(0, 2, 1, 3)",
  "    dA = np.matmul(dH, c['V'].swapaxes(-1, -2))",
  "    dV = np.matmul(c['A'].swapaxes(-1, -2), dH)",
  "    dS = c['A'] * (dA - (dA * c['A']).sum(axis=-1, keepdims=True)) / np.sqrt(dk)   # dérivée du softmax",
  "    dQ = np.matmul(dS, c['K']).sum(axis=0).transpose(1, 0, 2).reshape(m, d)",
  "    dK = np.matmul(dS.swapaxes(-1, -2), c['Q'][None]).transpose(0, 2, 1, 3).reshape(B, n, d)",
  "    dV = dV.transpose(0, 2, 1, 3).reshape(B, n, d)",
  "    g['Wq'] = p['T'].T @ dQ",
  "    g['T'] = dQ @ p['Wq'].T",
  "    X2 = c['X'].reshape(B * n, d).T",
  "    g['Wk'] = X2 @ dK.reshape(B * n, d)",
  "    g['Wv'] = X2 @ dV.reshape(B * n, d)",
  "    dX = dK @ p['Wk'].T + dV @ p['Wv'].T",
  "    g['E'] = np.eye(p['E'].shape[0])[S].reshape(B * n, -1).T @ dX.reshape(B * n, d)",
  "    return perte, g",
  "",
  "def entrainer(S, T, tetes=2, pas=0.03, etapes=150, graine=0, codage=None, d=16):",
  "    codage = codage_positionnel(S.shape[1], d) if codage is None else codage",
  "    p = init(d, graine)",
  "    m = {k: np.zeros_like(v) for k, v in p.items()}",
  "    v = {k: np.zeros_like(a) for k, a in p.items()}",
  "    historique = []",
  "    for t in range(1, etapes + 1):",
  "        perte, g = perte_grad(p, S, T, tetes, codage)",
  "        historique.append(perte)",
  "        for k in p:",
  "            m[k] = 0.9 * m[k] + 0.1 * g[k]",
  "            v[k] = 0.999 * v[k] + 0.001 * g[k] ** 2",
  "            p[k] -= pas * (m[k] / (1 - 0.9 ** t)) / (np.sqrt(v[k] / (1 - 0.999 ** t)) + 1e-8)",
  "    return p, historique",
  "",
  "def predire(p, S, tetes, codage):",
  "    return avant(p, S, tetes, codage)['logits'].argmax(axis=-1)",
);

/** Mesure BLEU simplifiée : précision des n-grammes (comptes écrêtés) et pénalité de brièveté */
const BLEU = lines(
  "from collections import Counter",
  "",
  "def ngrammes(mots, n):",
  "    return Counter(tuple(mots[i:i + n]) for i in range(len(mots) - n + 1))",
  "",
  "def precision_ngrammes(hyp, ref, n):",
  "    # (nombre de n-grammes de l'hypothèse retrouvés dans la référence, nombre de n-grammes de l'hypothèse)",
  "    compte_hyp, compte_ref = ngrammes(hyp, n), ngrammes(ref, n)",
  "    trouves = sum(min(c, compte_ref[g]) for g, c in compte_hyp.items())    # écrêté : un n-gramme ne compte pas plus de fois que dans la référence",
  "    return trouves, sum(compte_hyp.values())",
  "",
  "def bleu(hypotheses, references, N=4):",
  "    log_precisions = []",
  "    for n in range(1, N + 1):",
  "        trouves = total = 0",
  "        for hyp, ref in zip(hypotheses, references):",
  "            t, s = precision_ngrammes(hyp, ref, n)",
  "            trouves += t",
  "            total += s",
  "        if trouves == 0:",
  "            return 0.0                                                    # aucune précision : BLEU nul (sans lissage)",
  "        log_precisions.append(np.log(trouves / total))",
  "    long_hyp = sum(len(h) for h in hypotheses)",
  "    long_ref = sum(len(r) for r in references)",
  "    penalite = 1.0 if long_hyp >= long_ref else np.exp(1 - long_ref / long_hyp)   # pénalité de brièveté",
  "    return float(penalite * np.exp(np.mean(log_precisions)))",
);

/** Modèle principal : 2 têtes, 150 pas, graine 1 ; ses prédictions et le tableau de comparaison */
const ENTRAINE = lines(
  DONNEES,
  "",
  MODELE,
  "",
  "CODAGE = codage_positionnel(7, 16)",
  "p, historique = entrainer(S_train, T_train, tetes=2, graine=1)",
  "pred_test = predire(p, S_test, 2, CODAGE)",
);

export const projectAttention: LessonModule = {
  id: "advanced-2",
  title: "Projet guidé : l'attention écrite en NumPy, une traduction jouet",
  duration: "4 h",
  summary: "Construire à la main, en NumPy, le mécanisme au cœur des Transformers : plongements, attention par produit scalaire, masque causal, plusieurs têtes, rétropropagation, puis l'entraîner sur une traduction jouet français-anglais qui oblige à réordonner les mots, la mesurer avec une mesure BLEU simplifiée et regarder ce que chaque tête regarde.",
  objectives: [
    "Écrire l'attention par produit scalaire mis à l'échelle, avec masque causal et plusieurs têtes, sur des tableaux NumPy",
    "Dériver et coder la rétropropagation de l'attention, et la vérifier par un gradient numérique",
    "Entraîner une attention croisée sur une tâche de traduction jouet, mesurer sur des phrases jamais vues, et lire les poids d'attention",
    "Coder une mesure BLEU simplifiée (précision des n-grammes) et comprendre ce qu'elle mesure et ce qu'elle ne mesure pas",
    "Mesurer l'effet du codage positionnel et du nombre de têtes sans en tirer des conclusions plus fortes que les données",
  ],
  sections: [
    {
      kind: "note",
      tone: "info",
      md: "Ce projet est une traduction **jouet** : 13 mots, une grammaire de 7 mots par phrase, aucune ambiguïté. Il montre le mécanisme de l'attention, pas la traduction automatique réelle, qui demande des millions de phrases, des modèles de milliards de paramètres et des cartes graphiques.",
    },
    {
      kind: "text",
      md: `### Le contexte

Le sujet initial de la page Projets était un système de traduction automatique avec des Transformers (Vaswani et al., 2017). Un tel système s'entraîne sur de très grands corpus avec PyTorch et des cartes graphiques : cela ne tient pas dans un navigateur. Nous gardons l'essentiel, **l'attention**, écrite en NumPy, et nous construisons une tâche minuscule sur laquelle elle s'entraîne en quelques secondes.

Le cours « Transformers » explique les idées (deux sens du mot, attention multi-têtes, codage positionnel, BERT et GPT) et le cours de traitement du langage programme l'attention sur des matrices données. Ce projet les **assemble** et ajoute ce qu'ils ne font pas : la **rétropropagation**, l'**entraînement** et la **mesure** sur des phrases nouvelles.

**La tâche.** Des phrases françaises de 7 mots : *déterminant, nom, adjectif, verbe, déterminant, nom, adjectif*, par exemple « le chat noir voit un chien petit ». La traduction anglaise de référence en change l'ordre : « the black cat sees a small dog ». En français les adjectifs de ce jeu suivent le nom, en anglais ils le précèdent (c'est une simplification : en français certains adjectifs précèdent le nom). Le modèle doit donc faire deux choses : traduire chaque mot, et **aller chercher** le bon mot de la phrase source pour chaque position de la phrase cible. La seconde est exactement ce que fait l'attention.

Le piège de la tâche est voulu : une phrase contient **deux noms** et **deux adjectifs**. Le modèle ne peut pas les distinguer par leur seule identité, il doit savoir *où* ils sont, donc utiliser les positions.

Le plan :

- **étape 1** : fabriquer les données et les découper ;
- **étape 2** : l'attention par produit scalaire ;
- **étape 3** : le masque causal ;
- **étape 4** : l'attention multi-têtes et le modèle ;
- **étape 5** : la rétropropagation ;
- **étape 6** : entraîner et lire l'attention ;
- **étape 7** : la mesure BLEU, avec ses limites ;
- **étape 8** : têtes, graines et positions ;
- **étape 9** : et en vrai, avec PyTorch.`,
    },
    {
      kind: "text",
      md: `### Étape 1 : les données

La grammaire donne 2 × 4 × 4 × 3 × 2 × 4 × 4 = 3 072 phrases possibles. On en tire au hasard (graine fixée) 300 pour apprendre et 500 pour évaluer, **sans aucune phrase commune**. Chaque *mot* apparaît pourtant dans l'apprentissage : le modèle est testé sur des combinaisons nouvelles de mots connus, pas sur des mots inconnus. C'est une généralisation modeste, mais c'est déjà plus que réciter.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "print('phrases possibles :', len(phrases), ' apprentissage :', len(phrases_train), ' test :', len(phrases_test))",
        "print('phrases communes :', len(set(phrases_train) & set(phrases_test)))",
        "vus = {m for ph in phrases_train for m in ph}",
        "print('mots français jamais vus à l\\'apprentissage :', [m for m in MOTS_FR if m not in vus])",
        "ph = phrases_train[0]",
        "print(' '.join(ph), '->', ' '.join(traduction_reference(ph)))",
        "print('indices source :', S_train[0], ' cible :', T_train[0])",
      ),
      caption: "Aucune phrase de test n'est dans l'apprentissage, et les 13 mots apparaissent tous à l'apprentissage. Les phrases sont codées en indices de mots : c'est ce que le modèle voit.",
    },
    {
      kind: "text",
      md: `### Étape 2 : l'attention par produit scalaire

Chaque mot de la source est représenté par un **vecteur** (son plongement), auquel on ajoute un vecteur de **position** pour que le modèle sache où il se trouve. L'attention répond à la question : pour produire cette position de la phrase cible, **quels mots de la source faut-il regarder, et avec quel poids ?**

On fabrique pour cela trois jeux de vecteurs, par trois multiplications matricielles :

- les **requêtes** *Q* : ce que chaque position cible cherche (une par position à produire) ;
- les **clés** *K* : ce que chaque mot source « annonce » ;
- les **valeurs** *V* : ce que chaque mot source apporte s'il est regardé.

Le produit scalaire d'une requête et d'une clé mesure leur accord. On divise par la racine de la dimension \`d_k\`, puis le softmax transforme les scores en poids positifs de somme 1, qui servent à faire une moyenne pondérée des valeurs.`,
    },
    {
      kind: "equation",
      latex: "\\text{attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^{\\top}}{\\sqrt{d_k}}\\right) V",
      caption: "Q a une ligne par position cible, K et V une ligne par mot source. Le produit Q·Kᵀ est une matrice (positions cibles, mots source) de scores ; le softmax se fait ligne par ligne, et chaque ligne de poids pondère les valeurs.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Pourquoi diviser par `sqrt(d_k)` ? Le tableau `Q` (2 000 vecteurs) et le tableau `K` (2 000 vecteurs) sont tirés au hasard, en dimension `d_k = 64`, composantes de moyenne 0 et d'écart-type 1. Rangez dans `ecart_brut` l'écart-type des 2 000 produits scalaires `Q[i] · K[i]`, et dans `ecart_echelle` celui des mêmes produits divisés par `np.sqrt(d_k)`.",
      setup: lines(
        "import numpy as np",
        "",
        "d_k = 64",
        "rng = np.random.default_rng(0)",
        "Q = rng.normal(0, 1, (2000, d_k))",
        "K = rng.normal(0, 1, (2000, d_k))",
      ),
      starter: lines("ecart_brut = 1.0", "ecart_echelle = 1.0"),
      solution: lines(
        "scores = (Q * K).sum(axis=1)                  # un produit scalaire par couple",
        "ecart_brut = float(scores.std())",
        "ecart_echelle = float((scores / np.sqrt(d_k)).std())",
        "print(round(ecart_brut, 2), round(ecart_echelle, 2))",
      ),
      test: lines(
        "_scores = (Q * K).sum(axis=1)",
        "assert abs(ecart_brut - _scores.std()) < 1e-9, \"ecart_brut : l'écart-type des produits scalaires (Q * K).sum(axis=1)\"",
        "assert abs(ecart_echelle - (_scores / np.sqrt(d_k)).std()) < 1e-9, \"ecart_echelle : l'écart-type des mêmes produits divisés par np.sqrt(d_k)\"",
        "assert ecart_brut > 5 and ecart_echelle < 1.5, \"sans l'échelle, l'écart-type est voisin de racine de d_k (8) ; avec l'échelle, il est voisin de 1\"",
      ),
      hint: "(Q * K).sum(axis=1) donne le produit scalaire de chaque paire de lignes ; un produit de 64 termes de variance 1 a une variance d'environ 64.",
    },
    {
      kind: "text",
      md: `Sans cette division, les scores ont un écart-type voisin de \`sqrt(d_k)\` : en dimension 64, les scores s'étalent vite sur des dizaines d'unités, le softmax devient presque un « tout ou rien » (un poids proche de 1, les autres proches de 0), et ses gradients s'écrasent. La division garde les scores d'ordre 1, là où le softmax est sensible.`,
    },
    {
      kind: "text",
      md: `### Étape 3 : le masque causal

Notre modèle produit toute la phrase cible d'un coup. Un vrai traducteur, lui, produit la phrase **mot après mot** : à l'instant *t*, il ne doit regarder que les mots déjà produits (de 1 à *t*), jamais les suivants, sans quoi il « tricherait » à l'entraînement en lisant la réponse. On l'impose avec un **masque causal** : avant le softmax, on remplace par moins l'infini les scores des positions futures. Leur poids devient exactement 0.`,
    },
    {
      kind: "equation",
      latex: "\\text{attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^{\\top}}{\\sqrt{d_k}} + M\\right) V \\qquad M_{ij} = \\begin{cases} 0 & \\text{si } j \\le i \\\\ -\\infty & \\text{sinon} \\end{cases}",
      narrow: "\\text{attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^{\\top}}{\\sqrt{d_k}} + M\\right) V \\\\ M_{ij} = 0 \\text{ si } j \\le i, \\quad -\\infty \\text{ sinon}",
      caption: "M est triangulaire : la position i peut regarder les positions j inférieures ou égales à i, jamais les suivantes.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `attention_causale(Q, K, V)` : l'attention par produit scalaire mis à l'échelle, avec un masque causal. Construisez le masque avec `np.tril(np.ones((n, n), dtype=bool))` (vrai là où `j <= i`), mettez `-np.inf` aux scores des cases fausses avant le softmax, et rendez la matrice des poids puis le résultat `poids @ V`.",
      setup: lines("import numpy as np"),
      starter: lines(
        "def attention_causale(Q, K, V):",
        "    return np.zeros((len(Q), len(Q))), np.zeros_like(V)",
      ),
      solution: lines(
        "def attention_causale(Q, K, V):",
        "    n, d_k = Q.shape",
        "    scores = Q @ K.T / np.sqrt(d_k)",
        "    autorise = np.tril(np.ones((n, n), dtype=bool))",
        "    scores = np.where(autorise, scores, -np.inf)             # les positions futures sont interdites",
        "    e = np.exp(scores - scores.max(axis=1, keepdims=True))",
        "    poids = e / e.sum(axis=1, keepdims=True)",
        "    return poids, poids @ V",
        "",
        "rng = np.random.default_rng(0)",
        "x = rng.normal(0, 1, (4, 8))",
        "poids, sortie = attention_causale(x, x, x)",
        "print(poids.round(2))",
      ),
      test: lines(
        "_rng = np.random.default_rng(1)",
        "_Q, _K, _V = (_rng.normal(0, 1, (5, 8)) for _ in range(3))",
        "_poids, _sortie = attention_causale(_Q, _K, _V)",
        "assert np.allclose(_poids.sum(axis=1), 1), \"chaque ligne de poids doit sommer à 1\"",
        "assert np.allclose(np.triu(_poids, k=1), 0), \"les poids au-dessus de la diagonale (positions futures) doivent être exactement 0\"",
        "assert np.allclose(_sortie[0], _V[0]), \"la première position ne voit qu'elle-même : sa sortie est V[0]\"",
        "_V2 = _V.copy()",
        "_V2[4] += 10",
        "assert np.allclose(attention_causale(_Q, _K, _V2)[1][:4], _sortie[:4]), \"modifier le dernier mot ne doit pas changer les sorties des positions précédentes\"",
      ),
      hint: "np.where(autorise, scores, -np.inf) garde les scores permis et met -inf ailleurs ; exp(-inf) vaut 0, donc le poids est nul.",
    },
    {
      kind: "text",
      md: `### Étape 4 : plusieurs têtes, et le modèle

Une seule attention ne regarde qu'une chose à la fois (un seul jeu de poids par position). L'**attention multi-têtes** découpe les vecteurs en *h* morceaux de taille \`d_k = d / h\`, fait tourner une attention indépendante dans chaque morceau, puis recolle les résultats. Chaque tête peut ainsi apprendre à regarder autre chose. Cela ne coûte pas plus de calcul qu'une grande tête, puisque les morceaux sont plus petits.

Notre modèle est une **attention croisée** : les requêtes viennent de la phrase cible (un vecteur appris par position à produire), les clés et les valeurs de la phrase source. Sa structure :

- les mots français sont transformés en plongements (16 dimensions) auxquels on ajoute le **codage positionnel** sinusoïdal du cours ;
- 7 vecteurs de requête appris, un par position de la phrase anglaise ;
- une attention à *h* têtes ;
- les têtes recollées passent dans une couche linéaire qui donne un score par mot anglais, puis un softmax : on prend le mot le plus probable de chaque position.

Cela fait 7 mots anglais produits **en parallèle**, sans que chacun dépende des précédents. C'est une simplification : un vrai décodeur produit les mots un par un, avec le masque causal de l'étape précédente. Ici la tâche est assez simple pour ne pas en avoir besoin.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        MODELE,
        "",
        "CODAGE = codage_positionnel(7, 16)",
        "p = init(graine=1)",
        "c = avant(p, S_train[:3], tetes=2, codage=CODAGE)",
        "print('plongements + positions X :', c['X'].shape)",
        "print('requêtes Q (têtes, positions cibles, dk) :', c['Q'].shape)",
        "print('clés K (phrases, têtes, mots source, dk) :', c['K'].shape)",
        "print('poids d\\'attention A (phrases, têtes, cible, source) :', c['A'].shape)",
        "print('scores par mot anglais :', c['logits'].shape)",
        "print('somme des poids sur les mots source (doit valoir 1) :', c['A'].sum(axis=-1).min().round(6), c['A'].sum(axis=-1).max().round(6))",
        "print('paramètres :', sum(a.size for a in p.values()))",
        "print('poids maximal moyen avant apprentissage :', round(float(c['A'].max(axis=-1).mean()), 3), '(1/7 =', round(1 / 7, 3), ')')",
      ),
      caption: "Pour chaque phrase et chaque tête, la matrice A a 7 lignes (positions cibles) et 7 colonnes (mots source) dont chaque ligne somme à 1. Avant apprentissage, les poids sont presque uniformes : le poids maximal moyen est de 0,175, à comparer à 1/7, soit 0,143, pour une répartition parfaitement égale. Le modèle compte 1 309 paramètres, plongements et requêtes compris.",
    },
    {
      kind: "text",
      md: `### Étape 5 : la rétropropagation

Pour apprendre, il faut le gradient de la perte (l'entropie croisée entre les mots prédits et les mots de référence) par rapport à chaque paramètre. On remonte le calcul étape par étape, avec les mêmes règles que pour tout réseau :

- **sortie** : le gradient des scores est \`(probabilité − 1 pour le bon mot) / nombre de mots\` ;
- **couche linéaire** : le gradient des poids est le produit des têtes recollées par ce gradient ;
- **moyenne pondérée** \`A @ V\` : elle donne le gradient de \`V\` (par \`Aᵀ\`) et celui de \`A\` (par \`Vᵀ\`) ;
- **softmax** : si \`A\` est la sortie et \`dA\` son gradient, le gradient des scores est \`A × (dA − somme(dA × A))\`, ligne par ligne ;
- **produit Q·Kᵀ** : donne les gradients de \`Q\` et de \`K\`, divisés par \`sqrt(d_k)\` ;
- **trois projections** : les gradients de \`Wq\`, \`Wk\`, \`Wv\`, des vecteurs de requête, et enfin des plongements (en additionnant, pour chaque mot, ce qui revient de toutes ses occurrences).

Comme pour le réseau convolutif du projet précédent, une dérivation à la main se contrôle par un **gradient numérique** : on bouge un paramètre d'un tout petit pas dans les deux sens et on compare. C'est le seul moyen sûr de savoir si la rétropropagation est juste.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        MODELE,
        "",
        "CODAGE = codage_positionnel(7, 16)",
        "p = init(graine=1)",
        "Sb, Tb = S_train[:6], T_train[:6]",
        "perte0, g = perte_grad(p, Sb, Tb, 2, CODAGE)",
        "h = 1e-6",
        "pire = 0.0",
        "for nom, indice in [('E', (2, 3)), ('T', (1, 4)), ('Wq', (3, 5)), ('Wk', (2, 7)), ('Wv', (8, 1)), ('Wo', (4, 2)), ('b', (3,))]:",
        "    origine = p[nom][indice]",
        "    p[nom][indice] = origine + h",
        "    haut = perte_grad(p, Sb, Tb, 2, CODAGE)[0]",
        "    p[nom][indice] = origine - h",
        "    bas = perte_grad(p, Sb, Tb, 2, CODAGE)[0]",
        "    p[nom][indice] = origine",
        "    numerique = (haut - bas) / (2 * h)",
        "    pire = max(pire, abs(g[nom][indice] - numerique))",
        "    print(f'{nom}{indice}: main {g[nom][indice]: .6f}   numérique {numerique: .6f}')",
        "print('écart absolu maximal :', f'{pire:.1e}')",
      ),
      caption: "Les sept paramètres testés, un de chaque sorte (plongement, requête, trois projections, couche de sortie, biais), donnent le même gradient par la dérivation et par la différence finie, à moins de 1e-9 près (écart absolu maximal de 3,6e-10). Ce contrôle porte sur un échantillon de paramètres, pas sur tous.",
    },
    {
      kind: "text",
      md: `### Étape 6 : entraîner, mesurer, lire l'attention

On entraîne avec **Adam** (une descente de gradient qui lisse le gradient et adapte le pas de chaque paramètre) sur les 300 phrases à la fois, pendant 150 pas, avec **2 têtes**. On mesure ensuite sur les 500 phrases de test : la part de **mots** bien traduits, et la part de **phrases** entièrement exactes (7 mots justes sur 7).`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DONNEES, "", MODELE),
      code: lines(
        "import time",
        "",
        "CODAGE = codage_positionnel(7, 16)",
        "debut = time.perf_counter()",
        "p, historique = entrainer(S_train, T_train, tetes=2, graine=1)",
        "duree = time.perf_counter() - debut",
        "print('perte aux pas 1, 10, 50, 100, 150 :', [round(float(historique[k - 1]), 4) for k in (1, 10, 50, 100, 150)])",
        "",
        "for nom, S, T in [('apprentissage', S_train, T_train), ('test', S_test, T_test)]:",
        "    pred = predire(p, S, 2, CODAGE)",
        "    print(f'{nom:14s} mots justes {float((pred == T).mean()):.4f}   phrases exactes {float((pred == T).all(axis=1).mean()):.4f}')",
        "print('durée de l\\'entraînement : moins de 10 s ?', duree < 10)",
        "",
        "ph = phrases_test[0]",
        "traduit = [MOTS_EN[i] for i in predire(p, S_test[:1], 2, CODAGE)[0]]",
        "print(' '.join(ph))",
        "print(' '.join(traduit), '  (référence :', ' '.join(traduction_reference(ph)) + ')')",
      ),
      caption: "La perte descend de 2,93 au premier pas à 0,0001 au 150e. Sur les 500 phrases de test, jamais vues, le modèle traduit 100 % des mots et 100 % des phrases. L'entraînement a pris environ 2 s sous Node pendant la rédaction. Attention à ne pas surestimer ce résultat : la tâche est minuscule et sans ambiguïté, 300 phrases suffisent à la résoudre, et ce n'est qu'un seul entraînement avec une seule graine (étape 8).",
    },
    {
      kind: "code",
      language: "python",
      setup: ENTRAINE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "ph = phrases_test[0]",
        "A = avant(p, S_test[:1], 2, CODAGE)['A'][0]       # (têtes, positions cibles, mots source)",
        "cible = traduction_reference(ph)",
        "fig, axes = plt.subplots(1, 2, figsize=(10, 4.2))",
        "for t, ax in enumerate(axes):",
        "    ax.imshow(A[t], cmap='Blues', vmin=0, vmax=1)",
        "    ax.set_xticks(range(7))",
        "    ax.set_xticklabels(ph, rotation=60, ha='right')",
        "    ax.set_yticks(range(7))",
        "    ax.set_yticklabels(cible)",
        "    ax.set_xlabel('mot source regardé')",
        "    ax.set_ylabel('mot cible produit')",
        "    ax.set_title(f'Tête {t + 1}')",
        "plt.tight_layout()",
        "",
        "attendu = [0, 2, 1, 3, 4, 6, 5]      # source à regarder pour chaque position cible, d'après la grammaire",
        "for t in range(2):",
        "    print('tête', t + 1, ': source la plus regardée par position cible :', A[t].argmax(axis=1))",
        "print('attendu               :', attendu)",
        "print('poids maximal de chaque tête et position :', A.max(axis=2).round(2))",
      ),
      caption: "Chaque ligne indique, pour un mot anglais produit, où une tête regarde dans la phrase française (colonnes). Pour cette phrase, les deux têtes se partagent le travail : par exemple, pour le premier nom produit (3e ligne) la tête 2 regarde le bon nom source avec un poids de 1,00 alors que la tête 1 regarde le verbe. Pour le verbe cible (4e ligne), aucune des deux ne regarde le verbe source : la tête 1 étale ses poids (0,48 sur le second nom, 0,29 sur le second déterminant) et la tête 2 regarde le premier déterminant. Le verbe est pourtant bien traduit : une carte d'attention éclaire le calcul, elle ne l'explique pas en entier.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le tableau `A` (2 têtes, 7 positions cibles, 7 mots source) contient les poids d'attention de la première phrase de test. La grammaire prévoit que les positions cibles `[déterminant, adjectif, nom, verbe, déterminant, adjectif, nom]` viennent des positions source `attendu = [0, 2, 1, 3, 4, 6, 5]`. Rangez dans `nb_conformes` le nombre de couples (tête, position cible), sur les 14, dont le mot source le plus regardé (`argmax` sur le dernier axe) est celui que prévoit `attendu`.",
      setup: lines(ENTRAINE, "A = avant(p, S_test[:1], 2, CODAGE)['A'][0]", "attendu = [0, 2, 1, 3, 4, 6, 5]"),
      starter: lines("nb_conformes = 0"),
      solution: lines(
        "regarde = A.argmax(axis=2)                       # (têtes, positions cibles) : source la plus regardée",
        "nb_conformes = int((regarde == np.array(attendu)).sum())",
        "print(nb_conformes, 'couples conformes sur', regarde.size)",
      ),
      test: lines(
        "_attendu = int((A.argmax(axis=2) == np.array(attendu)).sum())",
        "assert nb_conformes == _attendu, \"nb_conformes : le nombre de cases de A.argmax(axis=2) égales à attendu (comparé ligne à ligne, l'une après l'autre)\"",
        "assert 0 < nb_conformes < 14, \"les têtes sont en partie, pas entièrement, conformes à la grammaire\"",
      ),
      hint: "A.argmax(axis=2) a la forme (2, 7) ; la comparer à np.array(attendu) se fait ligne par ligne grâce à la diffusion.",
    },
    {
      kind: "text",
      md: `### Étape 7 : la mesure BLEU, simplifiée

Comment mesurer une traduction ? Ici, on sait comparer mot à mot, mais pour de vrai plusieurs traductions sont acceptables. La mesure **BLEU** (Papineni et al., 2002) compare une traduction à une ou plusieurs références en comptant les **n-grammes** (suites de n mots) qu'elles ont en commun :

- la **précision des n-grammes** est la part des n-grammes de la traduction qui se retrouvent dans la référence ; on **écrête** les comptes : un n-gramme ne compte pas plus de fois qu'il apparaît dans la référence, sinon répéter « the the the » gagnerait des points ;
- on combine les précisions de 1 à 4 mots par une moyenne géométrique ;
- une **pénalité de brièveté** pénalise les traductions plus courtes que la référence, sinon une traduction d'un seul mot sûr aurait 100 % de précision.

Notre version est volontairement simplifiée : une seule référence par phrase, calcul sur tout le corpus, sans lissage (une précision nulle donne un BLEU nul). Elle sert à comparer, pas à publier un score.

Pour juger le modèle, comparons-le à deux repères : une traduction **mot à mot** (chaque mot traduit à sa place, sans réordonner) et le même modèle entraîné **sans codage positionnel**.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `precision_ngrammes(hyp, ref, n)` qui rend le couple `(trouves, total)` : `total` est le nombre de n-grammes de la liste de mots `hyp`, et `trouves` le nombre de ceux-ci qui se retrouvent dans `ref`, **écrêté** : un n-gramme n'est compté que le nombre de fois où il apparaît dans `ref` au maximum. Utilisez `Counter` sur des tuples de n mots consécutifs.",
      setup: lines("from collections import Counter"),
      starter: lines(
        "def precision_ngrammes(hyp, ref, n):",
        "    return 0, 1",
      ),
      solution: lines(
        "def precision_ngrammes(hyp, ref, n):",
        "    compte_hyp = Counter(tuple(hyp[i:i + n]) for i in range(len(hyp) - n + 1))",
        "    compte_ref = Counter(tuple(ref[i:i + n]) for i in range(len(ref) - n + 1))",
        "    trouves = sum(min(c, compte_ref[g]) for g, c in compte_hyp.items())",
        "    return trouves, sum(compte_hyp.values())",
        "",
        "print(precision_ngrammes('the the the the'.split(), 'the cat sees the dog'.split(), 1))",
      ),
      test: lines(
        "_ref = 'the black cat sees the dog'.split()",
        "assert precision_ngrammes(_ref, _ref, 2) == (5, 5), \"une traduction identique à la référence a toutes ses n-grammes trouvés : (5, 5) pour les bigrammes de 6 mots\"",
        "assert precision_ngrammes('the the the the'.split(), 'the cat sees the dog'.split(), 1) == (2, 4), \"l'écrêtage : « the » est deux fois dans la référence, donc 2 trouvés sur 4\"",
        "assert precision_ngrammes('the cat black sees the dog'.split(), _ref, 1) == (6, 6), \"tous les mots sont dans la référence : 6 sur 6 pour les unigrammes\"",
        "assert precision_ngrammes('the cat black sees the dog'.split(), _ref, 2) == (2, 5), \"bigrammes communs : ('sees', 'the') et ('the', 'dog'), soit 2 sur 5\"",
      ),
      hint: "Counter(...)[g] vaut 0 pour un n-gramme absent ; min(c, compte_ref[g]) réalise l'écrêtage.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(ENTRAINE, "", BLEU),
      code: lines(
        "refs = [traduction_reference(ph) for ph in phrases_test]",
        "",
        "# repère 1 : mot à mot, sans réordonner",
        "mot_a_mot = [[dictionnaire[m] for m in ph] for ph in phrases_test]",
        "# le modèle entraîné",
        "modele = [[MOTS_EN[i] for i in ligne] for ligne in pred_test]",
        "# repère 2 : même modèle, mais sans aucune information de position",
        "sans_pos = np.zeros((7, 16))",
        "p2, _ = entrainer(S_train, T_train, tetes=2, graine=1, codage=sans_pos)",
        "pred2 = predire(p2, S_test, 2, sans_pos)",
        "sans_position = [[MOTS_EN[i] for i in ligne] for ligne in pred2]",
        "",
        "for nom, hyps in [('mot à mot', mot_a_mot), ('modèle sans position', sans_position), ('modèle complet', modele)]:",
        "    justes = np.mean([h == r for h, r in zip(hyps, refs)])",
        "    print(f'{nom:22s} BLEU {bleu(hyps, refs):.3f}   phrases exactes {justes:.3f}')",
        "print('précisions du mot à mot, n = 1 à 4 :')",
        "for n in (1, 2, 3, 4):",
        "    trouves = sum(precision_ngrammes(h, r, n)[0] for h, r in zip(mot_a_mot, refs))",
        "    total = sum(precision_ngrammes(h, r, n)[1] for h, r in zip(mot_a_mot, refs))",
        "    print(f'  n = {n} : {trouves / total:.3f}')",
      ),
      caption: "Le mot à mot a toutes les bonnes pièces (précision des mots isolés de 1,000) mais pas dans le bon ordre : la précision tombe à 0,167 pour les paires de mots et à 0,000 pour les suites de 3 mots, si bien que son BLEU, sans lissage, vaut 0 et qu'aucune phrase n'est exacte. Le modèle sans position retrouve les mots mais se trompe sur celui des deux noms (ou des deux adjectifs) qui va où : BLEU de 0,529, 12,6 % des phrases exactes. Le modèle complet a un BLEU de 1,000 et 100 % de phrases exactes. Un BLEU de 1 veut dire « identique à la référence », pas « bonne traduction » : sur une langue réelle, il n'existe jamais une seule bonne traduction.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une mesure fondée sur les mots communs ne voit pas le sens : une traduction fidèle mais tournée autrement est pénalisée, une traduction fausse qui réutilise les mêmes mots peut être récompensée. Dans la pratique, on la complète par d'autres mesures et par une relecture humaine.",
    },
    {
      kind: "text",
      md: `### Étape 8 : têtes, graines et positions

Deux expériences pour s'entraîner à ne pas conclure trop vite. La première compare **1, 2 et 4 têtes** (même graine). La seconde répète l'entraînement avec d'autres graines d'initialisation.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DONNEES, "", MODELE),
      code: lines(
        "CODAGE = codage_positionnel(7, 16)",
        "# têtes : 1 et 4 (la valeur 2 est le modèle principal, 100 % des mots), même graine 1",
        "for tetes in (1, 4):",
        "    q, _ = entrainer(S_train, T_train, tetes=tetes, graine=1)",
        "    pred = predire(q, S_test, tetes, CODAGE)",
        "    print(f'têtes {tetes}, graine 1 : mots justes {float((pred == T_test).mean()):.4f}   phrases exactes {float((pred == T_test).all(axis=1).mean()):.3f}')",
      ),
      caption: "Avec la graine 1, une seule tête n'atteint que 69,0 % des mots (2,0 % des phrases exactes), quatre têtes 96,5 % (75,4 % des phrases), et deux têtes 100 % (étape 6). On serait tenté de conclure que plus de têtes est mieux. Regardons l'autre expérience avant.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DONNEES, "", MODELE),
      code: lines(
        "CODAGE = codage_positionnel(7, 16)",
        "# même architecture, autres graines d'initialisation",
        "for tetes, graine in [(1, 0), (1, 2), (2, 0)]:",
        "    q, _ = entrainer(S_train, T_train, tetes=tetes, graine=graine)",
        "    pred = predire(q, S_test, tetes, CODAGE)",
        "    print(f'têtes {tetes}, graine {graine} : mots justes {float((pred == T_test).mean()):.4f}   phrases exactes {float((pred == T_test).all(axis=1).mean()):.3f}')",
      ),
      caption: "Avec les graines 0 et 2, une seule tête atteint 100 % des mots ; avec la graine 0, deux têtes restent à 93,0 % des mots (50,8 % des phrases exactes) après 150 pas. L'effet de la graine dépasse ici celui du nombre de têtes : sur une tâche aussi simple, les têtes supplémentaires ne sont pas nécessaires, et ces cinq entraînements ne permettent aucune conclusion sur leur effet. Pour en parler sérieusement, il faudrait de nombreuses graines et un intervalle de confiance. La seule différence nette de cette étape est celle des positions (étape 7).",
    },
    {
      kind: "text",
      md: lines(
        "### Étape 9 : et en vrai, avec PyTorch et Hugging Face",
        "",
        "Ce que nous avons écrit à la main existe tout fait. PyTorch calcule les gradients à notre place (plus de rétropropagation à dériver) et propose l'attention multi-têtes en une ligne. Ce code ne tourne pas dans le moteur du site (PyTorch n'y est pas) ; sur votre machine, après avoir installé PyTorch :",
        "",
        "```python",
        "import torch",
        "import torch.nn as nn",
        "",
        "attention = nn.MultiheadAttention(embed_dim=16, num_heads=2, batch_first=True)",
        "",
        "# requetes : (lot, positions cibles, 16) ; sources : (lot, mots source, 16)",
        "sortie, poids = attention(query=requetes, key=sources, value=sources)",
        "# poids : (lot, positions cibles, mots source), moyenné sur les têtes par défaut",
        "",
        "# masque causal pour un décodeur : True aux positions interdites (les futures)",
        "n = 7",
        "masque = torch.triu(torch.ones(n, n, dtype=torch.bool), diagonal=1)",
        "sortie, _ = attention(x, x, x, attn_mask=masque)",
        "```",
        "",
        "Pour de la vraie traduction, on ne repart pas de zéro : on charge un modèle déjà entraîné sur de grands corpus, avec la bibliothèque Transformers de Hugging Face. Ce code ne tourne pas ici non plus ; il télécharge un modèle au premier appel (taille et licence sont indiquées sur la page du modèle, à lire avant) et nécessite une connexion :",
        "",
        "```python",
        "from transformers import pipeline",
        "",
        "traducteur = pipeline('translation_fr_to_en', model='Helsinki-NLP/opus-mt-fr-en')",
        "print(traducteur('Le chat noir voit un petit chien.'))",
        "```",
        "",
        "Les différences avec notre modèle jouet sont nombreuses : un vocabulaire de dizaines de milliers de sous-mots au lieu de 13 mots, un décodeur qui produit un mot après l'autre avec le masque causal, une attention dans le codeur *et* dans le décodeur, plusieurs couches empilées avec normalisation et connexions résiduelles (le cours « Transformers » en écrit un bloc), et des corpus de phrases traduites par des humains. Le mécanisme de base, lui, est celui que vous avez écrit.",
      ),
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : produire la phrase mot par mot avec le masque causal en alimentant le décodeur de ses propres sorties, ajouter des phrases où l'adjectif est absent (longueurs variables, remplissage et masque de remplissage), ou compter combien de phrases d'apprentissage sont nécessaires pour atteindre 100 % sur le test.",
    },
  ],
  quiz: [
    {
      question: "Que fait la division par la racine de d_k dans l'attention par produit scalaire ?",
      options: [
        "Elle accélère le calcul",
        "Elle garde les scores d'ordre 1 : sans elle, leur écart-type grandit avec la dimension et le softmax devient presque tout ou rien",
        "Elle impose que les poids somment à 1",
        "Elle sert à masquer les positions futures",
      ],
      correct: 1,
      explanation: "Un produit scalaire de d_k termes de variance 1 a une variance d'environ d_k. Diviser par sa racine ramène l'écart-type à 1, là où le softmax a encore des gradients utiles.",
    },
    {
      question: "À quoi sert le masque causal d'un décodeur ?",
      options: [
        "À ignorer les mots rares",
        "À empêcher une position de regarder les positions suivantes, qu'elle n'est pas censée connaître au moment de les produire",
        "À réduire le nombre de têtes",
        "À remplacer le codage positionnel",
      ],
      correct: 1,
      explanation: "On met moins l'infini aux scores des positions futures avant le softmax : leur poids devient 0. Sans cela, le modèle lirait la réponse pendant l'entraînement.",
    },
    {
      question: "Dans ce projet, pourquoi le modèle sans codage positionnel traduit-il moins bien ?",
      options: [
        "Parce qu'il a moins de paramètres",
        "Parce qu'une phrase contient deux noms et deux adjectifs qu'il ne peut distinguer que par leur place, et que sans position l'attention ne voit que le contenu des mots",
        "Parce que le softmax ne marche pas sans positions",
        "Parce que les adjectifs sont inconnus",
      ],
      correct: 1,
      explanation: "Le premier et le second nom sont des mots de même nature : seule leur position dit lequel est le sujet. Sans position, le modèle retrouve les mots mais les place au hasard entre les deux.",
    },
    {
      question: "Un modèle a un BLEU de 1,000 sur ce jeu de test. Que peut-on en conclure ?",
      options: [
        "Qu'il traduit parfaitement n'importe quelle phrase française",
        "Qu'il produit exactement les références de ces 500 phrases ; sur une tâche aussi simple, cela ne dit rien de la traduction réelle",
        "Que la mesure BLEU est inutile",
        "Que le jeu de test est trop petit pour calculer BLEU",
      ],
      correct: 1,
      explanation: "BLEU compare à des références : 1,000 signifie identique à celles-ci. Notre grammaire a une seule traduction possible, ce qui n'est pas le cas d'une vraie langue.",
    },
    {
      question: "Avec la graine 1, un modèle à 1 tête obtient 69,0 % des mots et un modèle à 2 têtes 100 %. Peut-on en déduire que deux têtes valent mieux qu'une ?",
      options: [
        "Oui, la différence est énorme",
        "Non : avec d'autres graines, une tête atteint aussi 100 % et deux têtes restent parfois bloquées, donc l'effet de la graine masque celui des têtes",
        "Oui, si l'on ajoute encore des têtes",
        "Non, parce que BLEU ne s'applique pas aux têtes",
      ],
      correct: 1,
      explanation: "Un seul tirage ne mesure pas un effet. Ici, une tête atteint 100 % avec les graines 0 et 2, et deux têtes n'atteignent que 93,0 % avec la graine 0 : il faudrait de nombreuses graines.",
    },
    {
      question: "Qu'est-ce qui distingue le plus notre modèle jouet d'un vrai système de traduction automatique ?",
      options: [
        "Il n'utilise pas de softmax",
        "Son vocabulaire de 13 mots, sa grammaire fixe, l'absence de décodage mot à mot et d'empilement de couches, et l'absence de vraies phrases traduites",
        "Il n'utilise pas de produit scalaire",
        "Il est écrit en NumPy, donc il ne peut pas être un Transformer",
      ],
      correct: 1,
      explanation: "Le mécanisme d'attention est le même, mais un système réel apprend sur de très grands corpus, avec des sous-mots, un décodeur autorégressif et de nombreuses couches. Le langage de programmation n'est pas ce qui compte.",
    },
  ],
};
