import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CHIFFRES } from "./data";

/** Images + la corrélation « valide » écrite dans le premier exemple, prêtes pour les exemples et exercices suivants */
const BASE = lines(
  CHIFFRES,
  "from scipy import signal",
  "",
  "def correlation_valide(image, noyau):",
  "    h, l = image.shape",
  "    kh, kl = noyau.shape",
  "    sortie = np.zeros((h - kh + 1, l - kl + 1))",
  "    for i in range(sortie.shape[0]):",
  "        for j in range(sortie.shape[1]):",
  "            sortie[i, j] = (image[i:i + kh, j:j + kl] * noyau).sum()",
  "    return sortie",
  "",
  "sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])",
  "sobel_y = sobel_x.T",
);

export const moduleFiltresConvolution: LessonModule = {
  id: "filtres-convolution",
  title: "Filtres et convolution",
  duration: "2 h 30",
  summary: "Faire glisser un petit noyau sur une image : corrélation écrite à la main, flou, contours de Sobel, différence entre convolution et corrélation, bourrage, pas et max pooling. Les briques des réseaux convolutifs.",
  objectives: [
    "Écrire à la main la corrélation d'une image par un noyau 3 sur 3 et la comparer à SciPy",
    "Appliquer un flou moyen et les noyaux de Sobel, et lire la norme du gradient comme une carte de contours",
    "Distinguer convolution et corrélation, et savoir ce que calcule vraiment une couche « convolutive »",
    "Calculer la taille de sortie selon le bourrage et le pas, et réduire une image par max pooling",
  ],
  sections: [
    {
      kind: "text",
      md: `### Regarder autour d'un pixel

Au module précédent, chaque pixel était traité seul. Or un pixel d'encre isolé ne dit presque rien : ce qui compte, c'est son **voisinage**. Un pixel noir entouré de blanc est un point ; un pixel noir dont les voisins de gauche sont blancs et ceux de droite sont noirs est sur un **bord**. Presque toute la vision par ordinateur repose sur cette idée : calculer, pour chaque pixel, une valeur qui dépend de la petite fenêtre qui l'entoure.

Le procédé le plus courant utilise un **noyau** (on dit aussi un **filtre**) : un petit tableau, souvent de 3 sur 3, de poids. On pose le noyau sur une fenêtre de 3 sur 3 pixels, on multiplie chaque pixel par le poids qui lui fait face, on additionne les neuf produits, et ce nombre devient un pixel de l'image de sortie. Puis on décale la fenêtre d'un cran et on recommence, sur toute l'image. Selon les poids choisis, le même procédé floute, accentue ou détecte les contours.`,
    },
    {
      kind: "equation",
      latex: String.raw`S(i,j) \;=\; \sum_{u=0}^{k-1}\sum_{v=0}^{k-1} K(u,v)\; I(i+u,\; j+v)`,
      narrow: String.raw`S(i,j) = \sum_{u=0}^{k-1}\sum_{v=0}^{k-1}
K(u,v)\, I(i+u,\, j+v)`,
      caption: "Corrélation croisée d'une image I par un noyau K de k sur k : le pixel (i, j) de la sortie S est la somme des produits entre le noyau et la fenêtre de l'image dont le coin haut gauche est (i, j).",
    },
    {
      kind: "text",
      md: `Dans la version dite **valide**, on ne pose le noyau que là où il tient entièrement dans l'image. Pour une image de 8 sur 8 et un noyau de 3 sur 3, la fenêtre peut occuper 6 positions par ligne et 6 par colonne : la sortie fait **6 sur 6**. Écrivons-la avec deux boucles sur les pixels de sortie, puis appliquons un premier noyau, le **flou moyen**, dont les neuf poids valent 1/9 : chaque pixel est remplacé par la moyenne de son voisinage.`,
    },
    {
      kind: "code",
      language: "python",
      setup: CHIFFRES,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "def correlation_valide(image, noyau):",
        "    h, l = image.shape",
        "    kh, kl = noyau.shape",
        "    sortie = np.zeros((h - kh + 1, l - kl + 1))      # taille de la version « valide »",
        "    for i in range(sortie.shape[0]):",
        "        for j in range(sortie.shape[1]):",
        "            fenetre = image[i:i + kh, j:j + kl]       # le voisinage du pixel de sortie (i, j)",
        "            sortie[i, j] = (fenetre * noyau).sum()    # produits terme à terme, puis somme",
        "    return sortie",
        "",
        "image = images[0]                                      # un zéro",
        "flou = np.ones((3, 3)) / 9                             # neuf poids égaux : la moyenne du voisinage",
        "image_floue = correlation_valide(image, flou)",
        "print('forme de la sortie :', image_floue.shape)",
        "print('fenêtre en haut à gauche :')",
        "print(image[:3, :3].round(2))",
        "print('première valeur de la sortie :', round(image_floue[0, 0], 3), '= moyenne de cette fenêtre')",
        "print('pixel le plus noir avant :', image.max(), ' après :', round(image_floue.max(), 3))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(5, 2.6))",
        "axes[0].imshow(image, cmap='gray_r', vmin=0, vmax=1)",
        "axes[0].set_title('image 8 x 8')",
        "axes[1].imshow(image_floue, cmap='gray_r', vmin=0, vmax=1)",
        "axes[1].set_title('floue 6 x 6')",
        "for ax in axes:",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "La sortie fait 6 sur 6 : le noyau ne se pose que sur 6 positions par ligne et par colonne. La première valeur est la moyenne de la fenêtre du coin (0,25). Le flou adoucit les traits : le pixel le plus noir passe de 0,94 à 0,57, parce qu'il est moyenné avec des voisins plus clairs.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le mot « filtre » vient du traitement du signal : le noyau laisse passer certaines variations de l'image et en retient d'autres. Le flou moyen laisse passer les variations lentes (les grandes plages) et retient les variations rapides (les détails fins et le bruit).",
    },
    {
      kind: "text",
      md: `### Détecter les contours : les noyaux de Sobel

Un **contour** est un endroit où l'intensité change vite. Pour le repérer, on cherche une différence entre la droite et la gauche d'un pixel. Le noyau de **Sobel horizontal** met des poids négatifs à gauche, des poids positifs à droite et zéro au milieu : il calcule, pour la fenêtre, « côté droit moins côté gauche », avec un poids double sur la ligne centrale. La sortie est positive quand l'image s'assombrit vers la droite, négative quand elle s'éclaircit, nulle sur une plage uniforme. Le noyau **vertical** est le même, tourné d'un quart de tour (sa transposée) : il mesure la variation de haut en bas.

Les deux sorties, \`gx\` et \`gy\`, forment pour chaque pixel un vecteur : le **gradient** de l'image, qui pointe vers là où l'intensité augmente le plus vite. Sa longueur, la **norme** \`racine(gx² + gy²)\`, mesure la force du contour sans tenir compte de sa direction. C'est la carte de contours qu'on affiche.`,
    },
    {
      kind: "code",
      language: "python",
      setup: BASE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "# contrôle sur une image fabriquée : moitié gauche blanche (0), moitié droite noire (1)",
        "echelon = np.zeros((8, 8))",
        "echelon[:, 4:] = 1",
        "print('Sobel x sur le bord vertical, première ligne :', correlation_valide(echelon, sobel_x)[0])",
        "print('Sobel y sur le même bord, première ligne      :', correlation_valide(echelon, sobel_y)[0])",
        "",
        "image = images[0]",
        "gx = correlation_valide(image, sobel_x)",
        "gy = correlation_valide(image, sobel_y)",
        "norme = np.sqrt(gx ** 2 + gy ** 2)               # force du contour, sans sa direction",
        "i, j = np.unravel_index(norme.argmax(), norme.shape)",
        "print('gx va de', gx.min().round(2), 'à', gx.max().round(2), ' gy va de', gy.min().round(2), 'à', gy.max().round(2))",
        "print('contour le plus fort :', norme.max().round(2), 'à la ligne', i, 'colonne', j, 'de la sortie')",
        "",
        "fig, axes = plt.subplots(1, 4, figsize=(9, 2.6))",
        "axes[0].imshow(image, cmap='gray_r')",
        "axes[0].set_title('image')",
        "axes[1].imshow(gx, cmap='coolwarm', vmin=-4, vmax=4)",
        "axes[1].set_title('gx (Sobel x)')",
        "axes[2].imshow(gy, cmap='coolwarm', vmin=-4, vmax=4)",
        "axes[2].set_title('gy (Sobel y)')",
        "axes[3].imshow(norme, cmap='gray_r')",
        "axes[3].set_title('norme')",
        "for ax in axes:",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Sur l'image fabriquée, Sobel x vaut 4 sur les deux colonnes de part et d'autre du bord vertical et 0 ailleurs, Sobel y vaut 0 partout : un bord vertical ne varie pas de haut en bas. Sur le zéro, gx est positif (rouge) là où l'on passe du blanc à l'encre en allant vers la droite et négatif (bleu) à l'inverse ; la norme dessine l'anneau, son maximum, 3,8, est à la ligne 1 et colonne 2 de la sortie.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`images[1]` est un chiffre 1. Calculez sa norme de gradient de Sobel (les noyaux `sobel_x` et `sobel_y` et la fonction `correlation_valide` sont prêts). Rangez dans `position` le couple `(ligne, colonne)` de la **sortie** où la norme est la plus forte, et dans `valeur` cette norme maximale.",
      setup: BASE,
      starter: lines(
        "norme = np.zeros((6, 6))",
        "position = (0, 0)",
        "valeur = 0.0",
      ),
      solution: lines(
        "gx = correlation_valide(images[1], sobel_x)",
        "gy = correlation_valide(images[1], sobel_y)",
        "norme = np.sqrt(gx ** 2 + gy ** 2)",
        "i, j = np.unravel_index(norme.argmax(), norme.shape)",
        "position = (int(i), int(j))",
        "valeur = float(norme.max())",
        "print(position, round(valeur, 2))",
      ),
      test: lines(
        "_n = np.hypot(correlation_valide(images[1], sobel_x), correlation_valide(images[1], sobel_y))",
        "_i, _j = np.unravel_index(_n.argmax(), _n.shape)",
        "assert abs(valeur - _n.max()) < 1e-9, \"valeur doit être la norme maximale : racine(gx² + gy²), puis .max()\"",
        "assert tuple(position) == (int(_i), int(_j)), f\"la norme est maximale à la ligne {int(_i)}, colonne {int(_j)} de la sortie : np.unravel_index(norme.argmax(), norme.shape)\"",
      ),
      hint: "norme.argmax() donne la position du maximum dans le tableau aplati ; np.unravel_index la retransforme en (ligne, colonne).",
    },
    {
      kind: "text",
      md: `### Convolution ou corrélation ?

Ce que nous avons écrit, poser le noyau tel quel et additionner, s'appelle une **corrélation croisée**. La **convolution** des manuels de mathématiques fait presque la même chose, mais commence par **retourner le noyau** (de gauche à droite et de haut en bas, soit une rotation d'un demi-tour). Pour un noyau symétrique, comme le flou moyen, les deux donnent le même résultat. Pour un noyau qui ne l'est pas, ils diffèrent. Avec Sobel, retourner le noyau change son signe : la convolution donne l'opposé de la corrélation.

SciPy fournit les deux : \`scipy.signal.correlate2d\` et \`scipy.signal.convolve2d\`. Vérifions sur un noyau volontairement asymétrique, et contrôlons notre fonction.`,
    },
    {
      kind: "code",
      language: "python",
      setup: BASE,
      code: lines(
        "image = images[0]",
        "noyau = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])      # volontairement asymétrique",
        "",
        "ma_correlation = correlation_valide(image, noyau)",
        "scipy_corr = signal.correlate2d(image, noyau, mode='valid')",
        "scipy_conv = signal.convolve2d(image, noyau, mode='valid')",
        "print('ma fonction = correlate2d        :', np.allclose(ma_correlation, scipy_corr))",
        "print('convolve2d = correlate2d         :', np.allclose(scipy_conv, scipy_corr))",
        "print('écart maximal entre les deux     :', np.abs(scipy_conv - scipy_corr).max().round(2))",
        "print('convolve2d = corrélation avec le noyau retourné :', np.allclose(scipy_conv, correlation_valide(image, np.flip(noyau))))",
        "print('première valeur, corrélation :', scipy_corr[0, 0].round(2), ' convolution :', scipy_conv[0, 0].round(2))",
        "",
        "# Sobel : le retournement change le signe",
        "gx = correlation_valide(image, sobel_x)",
        "print('Sobel : convolution = - corrélation :', np.allclose(signal.convolve2d(image, sobel_x, mode='valid'), -gx))",
      ),
      caption: "Notre boucle donne exactement le résultat de correlate2d. Pour un noyau asymétrique, convolve2d diffère de la corrélation (écart maximal de 13,5) et vaut la corrélation avec le noyau retourné. Pour Sobel, retourner le noyau revient à changer le signe de la sortie.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un piège de vocabulaire, qui servira au module sur les réseaux de neurones : une couche dite « convolutive » (Conv2D dans Keras, Conv2d dans PyTorch) calcule en pratique une **corrélation**, sans retourner le noyau. Cela ne change rien à ce que le réseau peut apprendre, puisque ses poids sont ajustés par l'apprentissage : un noyau retourné est simplement un autre noyau. Le nom de « convolution » est resté par tradition.",
    },
    {
      kind: "text",
      md: `### Bords, bourrage et pas

La sortie « valide » est plus petite que l'image : on perd une couronne de pixels (un pixel de chaque côté pour un noyau 3 sur 3). Deux réglages changent cela.

- Le **bourrage** (*padding*, noté \`p\`) ajoute \`p\` rangées de zéros tout autour de l'image avant de poser le noyau. Avec un noyau 3 sur 3 et \`p = 1\`, la sortie garde la taille de l'entrée.
- Le **pas** (*stride*, noté \`s\`) est le décalage du noyau d'une position à la suivante. Avec \`s = 2\`, on ne calcule qu'une position sur deux, donc la sortie est environ deux fois plus petite dans chaque direction.

Pour une entrée de côté \`n\`, un noyau de côté \`k\`, un bourrage \`p\` et un pas \`s\`, le côté de la sortie est :`,
    },
    {
      kind: "equation",
      latex: String.raw`\left\lfloor \frac{n - k + 2p}{s} \right\rfloor + 1`,
      caption: "Côté de la sortie. Les crochets signifient « partie entière » : si la division ne tombe pas juste, on garde la partie entière, car le noyau ne peut pas dépasser de l'image bourrée.",
    },
    {
      kind: "code",
      language: "python",
      setup: BASE,
      code: lines(
        "def taille_formule(n, k, p, s):",
        "    return (n - k + 2 * p) // s + 1               # division entière : la partie entière",
        "",
        "image = images[0]",
        "noyau = np.ones((3, 3)) / 9",
        "print('n=8, k=3 : p, s -> taille mesurée / formule')",
        "for p, s in [(0, 1), (1, 1), (0, 2), (1, 2)]:",
        "    bourree = np.pad(image, p)                    # p rangées de zéros tout autour",
        "    sortie = correlation_valide(bourree, noyau)[::s, ::s]   # une position sur s",
        "    print(f'  p={p}, s={s} ->', sortie.shape[0], '/', taille_formule(8, 3, p, s))",
        "",
        "print('image 224, noyau 7, p=3, s=2 :', taille_formule(224, 7, 3, 2))",
        "print('image 10, noyau 3, p=0, s=2   :', taille_formule(10, 3, 0, 2), '(10 - 3 = 7, et 7 / 2 = 3,5 est arrondi à 3)')",
      ),
      caption: "Pour une image de 8 sur 8 et un noyau de 3 sur 3, la sortie fait 6 sans bourrage, 8 avec p = 1 (la taille d'origine est conservée), 3 avec un pas de 2, et 4 avec les deux. La formule retrouve chaque taille mesurée. Un pas de 2 réduit bien la sortie d'un facteur proche de 2 par direction.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `correlation(image, noyau, bourrage=0, pas=1)` qui renvoie la corrélation avec `bourrage` rangées de zéros ajoutées tout autour et un décalage de `pas` positions. Servez-vous de `correlation_valide` (prête), de `np.pad` et d'une tranche `[::pas, ::pas]`.",
      setup: BASE,
      starter: lines(
        "def correlation(image, noyau, bourrage=0, pas=1):",
        "    return correlation_valide(image, noyau)",
      ),
      solution: lines(
        "def correlation(image, noyau, bourrage=0, pas=1):",
        "    bourree = np.pad(image, bourrage)",
        "    return correlation_valide(bourree, noyau)[::pas, ::pas]",
        "",
        "print(correlation(images[0], sobel_x, bourrage=1, pas=2).shape)",
      ),
      test: lines(
        "for _p, _s in [(0, 1), (1, 1), (0, 2), (1, 2), (2, 3)]:",
        "    _attendu = signal.correlate2d(np.pad(images[3], _p), sobel_x, mode='valid')[::_s, ::_s]",
        "    _obtenu = correlation(images[3], sobel_x, bourrage=_p, pas=_s)",
        "    assert _obtenu.shape == _attendu.shape, f\"bourrage={_p}, pas={_s} : la sortie doit faire {_attendu.shape}, pas {_obtenu.shape}\"",
        "    assert np.allclose(_obtenu, _attendu), f\"bourrage={_p}, pas={_s} : les valeurs ne sont pas celles de correlate2d sur l'image bourrée\"",
      ),
      hint: "np.pad(image, 1) entoure l'image d'une rangée de zéros. Un pas de 2 revient à garder une position sur deux de la sortie du pas 1 : sortie[::2, ::2].",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `taille_sortie(n, k, p, s)`, le côté de la sortie d'une corrélation selon la formule du cours (partie entière comprise).",
      starter: lines(
        "def taille_sortie(n, k, p, s):",
        "    return n - k + 1",
      ),
      solution: lines(
        "def taille_sortie(n, k, p, s):",
        "    return (n - k + 2 * p) // s + 1",
        "",
        "print(taille_sortie(28, 5, 0, 1), taille_sortie(224, 7, 3, 2))",
      ),
      test: lines(
        "for _n, _k, _p, _s, _t in [(8, 3, 0, 1, 6), (8, 3, 1, 1, 8), (8, 3, 0, 2, 3), (8, 3, 1, 2, 4), (28, 5, 0, 1, 24), (224, 7, 3, 2, 112), (10, 3, 0, 2, 4)]:",
        "    assert taille_sortie(_n, _k, _p, _s) == _t, f\"n={_n}, k={_k}, p={_p}, s={_s} : la sortie doit faire {_t}, pas {taille_sortie(_n, _k, _p, _s)} (n - k + 2p, divisé par s en gardant la partie entière, plus 1)\"",
      ),
      hint: "Le bourrage ajoute p de chaque côté, donc 2p. L'opérateur // garde la partie entière d'une division.",
    },
    {
      kind: "text",
      md: `### Réduire : le max pooling

Autre brique des réseaux d'images : le **max pooling**. On découpe l'image en blocs de 2 sur 2 qui ne se chevauchent pas, et on garde dans chaque bloc **la plus grande valeur**. Une image de côté 6 devient une image de côté 3 : on a perdu trois quarts des positions, mais on garde les réponses les plus fortes (un contour détecté quelque part dans le bloc reste détecté). Cela réduit les calculs et rend la suite un peu moins sensible à un léger décalage du trait.

Avec NumPy, pas de boucle nécessaire : on **redécoupe** le tableau de 6 sur 6 en \`(3, 2, 3, 2)\` (blocs de lignes, ligne dans le bloc, blocs de colonnes, colonne dans le bloc), puis on prend le maximum sur les deux axes « dans le bloc ».`,
    },
    {
      kind: "code",
      language: "python",
      setup: BASE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "image = images[0]",
        "norme = np.hypot(correlation_valide(image, sobel_x), correlation_valide(image, sobel_y))   # 6 x 6",
        "",
        "# version avec boucles, un bloc de 2 x 2 à la fois",
        "pool_boucles = np.zeros((3, 3))",
        "for i in range(3):",
        "    for j in range(3):",
        "        pool_boucles[i, j] = norme[2 * i:2 * i + 2, 2 * j:2 * j + 2].max()",
        "",
        "# version NumPy : on redécoupe en blocs, puis maximum sur les axes 1 et 3",
        "pool_numpy = norme.reshape(3, 2, 3, 2).max(axis=(1, 3))",
        "print('les deux versions sont identiques :', np.allclose(pool_boucles, pool_numpy))",
        "print('forme :', norme.shape, '->', pool_numpy.shape)",
        "print(pool_numpy.round(2))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(5, 2.6))",
        "axes[0].imshow(norme, cmap='gray_r', vmin=0, vmax=4)",
        "axes[0].set_title('norme 6 x 6')",
        "axes[1].imshow(pool_numpy, cmap='gray_r', vmin=0, vmax=4)",
        "axes[1].set_title('max pooling 3 x 3')",
        "for ax in axes:",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Le tableau de 6 sur 6 (36 valeurs) devient un tableau de 3 sur 3 (9 valeurs). La valeur la plus forte, 3,8, est conservée : elle domine son bloc. La version à boucles et la version NumPy donnent le même résultat.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `max_pooling(a)` qui renvoie le max pooling 2 sur 2 d'un tableau dont les deux dimensions sont paires : un tableau de `h/2` sur `l/2` valeurs, chacune étant le maximum d'un bloc de 2 sur 2.",
      setup: CHIFFRES,
      starter: lines(
        "def max_pooling(a):",
        "    return a",
      ),
      solution: lines(
        "def max_pooling(a):",
        "    h, l = a.shape",
        "    return a.reshape(h // 2, 2, l // 2, 2).max(axis=(1, 3))",
        "",
        "print(max_pooling(images[0]).shape)",
      ),
      test: lines(
        "_a = images[5]",
        "_s = max_pooling(_a)",
        "assert _s.shape == (4, 4), f\"une image 8 sur 8 doit donner une sortie 4 sur 4, pas {_s.shape}\"",
        "assert abs(_s[0, 0] - _a[:2, :2].max()) < 1e-12, \"la première valeur est le maximum du bloc des lignes 0-1 et des colonnes 0-1\"",
        "assert abs(_s[3, 2] - _a[6:8, 4:6].max()) < 1e-12, \"la valeur (3, 2) est le maximum du bloc des lignes 6-7 et des colonnes 4-5\"",
        "_b = np.arange(24.0).reshape(4, 6)",
        "assert max_pooling(_b).shape == (2, 3), \"le tableau 4 sur 6 doit donner un tableau 2 sur 3\"",
        "assert np.allclose(max_pooling(_b), [[7, 9, 11], [19, 21, 23]]), \"chaque valeur est le maximum de son bloc 2 sur 2\"",
      ),
      hint: "a.reshape(h // 2, 2, l // 2, 2) range chaque bloc 2 sur 2 sur les axes 1 et 3 ; .max(axis=(1, 3)) garde le plus grand.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Retenez la chaîne qui reviendra dans les réseaux convolutifs : corrélation par plusieurs noyaux, puis max pooling pour réduire, et on recommence. Ici les noyaux sont choisis à la main (flou, Sobel) ; dans un réseau, ce sont leurs poids que l'apprentissage ajuste.",
    },
  ],
  quiz: [
    {
      question: "Une image de 8 sur 8 est traitée par un noyau 3 sur 3, sans bourrage et avec un pas de 1. Quelle est la taille de la sortie ?",
      options: [
        "8 sur 8",
        "6 sur 6",
        "5 sur 5",
        "3 sur 3",
      ],
      correct: 1,
      explanation: "La formule (n - k + 2p) / s + 1 donne (8 - 3 + 0) / 1 + 1 = 6. Le noyau ne tient entièrement dans l'image que sur 6 positions par ligne et par colonne.",
    },
    {
      question: "Même image et même noyau, mais avec un bourrage de 1 et un pas de 2. Quelle est la taille de la sortie ?",
      options: [
        "8 sur 8",
        "6 sur 6",
        "4 sur 4",
        "3 sur 3",
      ],
      correct: 2,
      explanation: "Le bourrage donne une image de 10 sur 10, le noyau peut se poser sur 8 positions par direction, et un pas de 2 en garde une sur deux : (8 - 3 + 2) / 2 + 1 = 4 en gardant la partie entière.",
    },
    {
      question: "Que calculent en pratique les couches « convolutives » des bibliothèques d'apprentissage profond ?",
      options: [
        "Une vraie convolution, avec le noyau retourné",
        "Une corrélation croisée, sans retourner le noyau",
        "Un max pooling",
        "Une transformée de Fourier de l'image",
      ],
      correct: 1,
      explanation: "Elles posent le noyau tel quel et additionnent les produits. Comme les poids du noyau sont appris, retourner ou non le noyau ne change pas ce que le réseau peut représenter.",
    },
    {
      question: "Sur une image dont la moitié gauche est blanche et la moitié droite noire, que renvoie le noyau de Sobel horizontal ?",
      options: [
        "Des zéros partout",
        "Une valeur forte sur les colonnes au voisinage du bord vertical, des zéros ailleurs",
        "Une valeur forte sur toutes les lignes horizontales",
        "Une image floutée",
      ],
      correct: 1,
      explanation: "Le noyau calcule le côté droit moins le côté gauche : il ne réagit que là où l'intensité change de gauche à droite, c'est-à-dire autour du bord vertical. Sur une plage uniforme, la différence est nulle.",
    },
    {
      question: "Que fait un max pooling 2 sur 2 sur un tableau de 6 sur 6 ?",
      options: [
        "Il renvoie un tableau de 6 sur 6 où chaque valeur est remplacée par la moyenne de son voisinage",
        "Il renvoie un tableau de 3 sur 3 dont chaque valeur est le maximum d'un bloc de 2 sur 2",
        "Il renvoie un tableau de 12 sur 12",
        "Il renvoie la plus grande valeur du tableau, un seul nombre",
      ],
      correct: 1,
      explanation: "Les blocs de 2 sur 2 ne se chevauchent pas : 36 valeurs deviennent 9, chacune étant la plus forte de son bloc. La taille est divisée par deux dans chaque direction.",
    },
  ],
};
