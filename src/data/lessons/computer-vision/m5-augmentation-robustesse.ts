import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DECOUPAGE } from "./data";

/** Jeu d'images de test et fonctions de décalage communs à plusieurs exemples du module. */
const DECALAGE = lines(
  "from scipy import ndimage",
  "",
  "def decaler(imgs, dy, dx):",
  "    # décale chaque image de dy lignes et dx colonnes ; les cases vides sont remplies de 0",
  "    return ndimage.shift(imgs, (0, dy, dx), order=0, cval=0)",
  "",
  "img_train = X_train.reshape(-1, 8, 8)",
  "img_test = X_test.reshape(-1, 8, 8)",
);

export const moduleAugmentationRobustesse: LessonModule = {
  id: "augmentation-robustesse",
  title: "Augmentation de données et robustesse",
  duration: "2 h",
  summary: "Fabriquer de nouvelles images d'apprentissage par de petites transformations (décalages, rotations, bruit), distinguer celles qui gardent le sens de l'étiquette de celles qui le cassent, éviter la fuite entre apprentissage et test, et mesurer le gain de robustesse.",
  objectives: [
    "Distinguer les transformations qui conservent l'étiquette de celles qui la changent ou la détruisent",
    "Augmenter uniquement les données d'apprentissage, après le découpage, et expliquer la fuite qu'on évite ainsi",
    "Entraîner un modèle sur des données augmentées et le comparer à l'original sur le test propre et sur un test décalé",
    "Nommer les limites d'une telle comparaison (un seul découpage, gain lié aux transformations choisies)",
  ],
  sections: [
    {
      kind: "text",
      md: `### Montrer au modèle ce qu'on veut qu'il ignore

Au module précédent, un décalage d'un seul pixel faisait tomber la réussite d'environ 97 % à moins de 50 %. Le modèle n'est pas stupide : on ne lui a jamais montré de chiffre décalé, il n'a donc aucune raison de les reconnaître. La parade la plus simple est de **lui en montrer** : on ajoute à l'apprentissage des copies légèrement transformées des images, avec **la même étiquette**. C'est l'**augmentation de données**.

Le principe repose sur une hypothèse qu'il faut toujours vérifier : la transformation ne doit **pas changer ce que l'image représente**. Un « 7 » décalé d'un pixel est toujours un 7. Un « 6 » tourné d'un demi-tour ressemble à un 9, donc lui donner l'étiquette 6 serait lui apprendre quelque chose de faux.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from scipy import ndimage",
        "",
        "image = X_test.reshape(-1, 8, 8)[3]",
        "rng = np.random.default_rng(0)",
        "transformations = {",
        "    'originale': image,",
        "    'décalée de 1': ndimage.shift(image, (0, 1), order=0, cval=0),",
        "    'rotation de 15°': ndimage.rotate(image, 15, reshape=False, order=1, cval=0),",
        "    'bruit': np.clip(image + rng.normal(0, 0.1, image.shape), 0, 1),",
        "    'miroir': image[:, ::-1],",
        "    'tournée de 180°': image[::-1, ::-1],",
        "}",
        "fig, axes = plt.subplots(1, 6, figsize=(10, 2))",
        "for ax, (nom, im) in zip(axes, transformations.items()):",
        "    ax.imshow(im, cmap='gray_r', vmin=0, vmax=1)",
        "    ax.set_title(nom, fontsize=8)",
        "    ax.axis('off')",
        "plt.tight_layout()",
        "print('chiffre :', y_test[3])",
      ),
      caption: "Une même image de test (un 9) de six façons. Les trois premières transformations (décalage d'un pixel, rotation de 15° avec scipy.ndimage.rotate, bruit gaussien d'écart-type 0,1 ramené entre 0 et 1) laissent le chiffre lisible : l'étiquette reste valable. Le miroir donne une forme qui n'est plus un chiffre, et le demi-tour change le sens : ce 9 tourné ressemble à un 6. rotate interpole entre pixels (order=1), ce qui floute légèrement une image si petite.",
    },
    {
      kind: "text",
      md: `### Ce qui garde l'étiquette, ce qui la casse

Pour des chiffres :

- **Gardent l'étiquette** : de petits décalages (un ou deux pixels), de petites rotations (10 à 15°), un peu de bruit, un léger changement de contraste.
- **Cassent l'étiquette** : le **miroir** (la plupart des chiffres ne ressemblent plus à un chiffre), le **demi-tour** (un 6 devient un 9, et inversement), de grandes rotations, tout ce qui sort le chiffre de l'image.

La bonne transformation dépend de la tâche. Pour reconnaître des animaux sur des photos, le miroir est utile (un chat vu de gauche est un chat vu de droite). Pour lire du texte, il est interdit. Il n'existe pas de liste universelle : c'est une décision de domaine, à prendre **avant** de coder.

On peut même le mesurer : un modèle entraîné sur les images originales, confronté à des images transformées, doit être mis en défaut de façon différente selon que la transformation déplace l'image ou en change le sens.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DECOUPAGE, DECALAGE),
      code: lines(
        "from sklearn.linear_model import LogisticRegression",
        "",
        "modele = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
        "six, neuf = (y_test == 6), (y_test == 9)",
        "print('images de test : ', six.sum(), 'six et', neuf.sum(), 'neuf')",
        "",
        "transformations = {",
        "    'propre': img_test,",
        "    'décalage de 1': decaler(img_test, 0, 1),",
        "    'rotation de 15°': ndimage.rotate(img_test, 15, axes=(1, 2), reshape=False, order=1),",
        "    'miroir': img_test[:, :, ::-1],",
        "    'demi-tour': img_test[:, ::-1, ::-1],",
        "}",
        "for nom, imgs in transformations.items():",
        "    predit = modele.predict(imgs.reshape(len(imgs), -1))",
        "    print(f'{nom:16s} 6 pris pour 9 : {(predit[six] == 9).mean():.2f}   9 pris pour 6 : {(predit[neuf] == 6).mean():.2f}   réussite : {(predit == y_test).mean():.3f}')",
      ),
      caption: "Le modèle entraîné sur les images originales. Après un demi-tour, 88,9 % des six (40 sur 45) sont lus comme des 9 et 55,6 % des neuf comme des 6 : l'image a vraiment changé de sens, une étiquette 6 collée sur un six tourné serait fausse. Le décalage, le miroir et la rotation de 15° font bien baisser la réussite (39,6 %, 43,3 %, 63,3 %) mais ne transforment aucun six en neuf : le modèle se trompe sans que le chiffre ait changé, c'est exactement le défaut que l'augmentation corrige.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le `modele` ci-dessus (régression logistique entraînée sur les originaux) est prêt, avec les images de test `img_test` (450, 8, 8) et la fonction `decaler`. Calculez la part des **six de test décalés d'un pixel vers la droite** que `modele` prend pour un 9 (`six_en_neuf_decalage`), puis la part des **six de test tournés d'un demi-tour** (`img_test[:, ::-1, ::-1]`) qu'il prend pour un 9 (`six_en_neuf_demi_tour`). Rangez dans `casse` le nom de la transformation qui **change le sens** de l'image : `\"décalage\"` ou `\"demi-tour\"`.",
      setup: lines(
        DECOUPAGE,
        DECALAGE,
        "from sklearn.linear_model import LogisticRegression",
        "modele = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
      ),
      starter: lines(
        "six_en_neuf_decalage = 0.0",
        "six_en_neuf_demi_tour = 0.0",
        "casse = \"décalage\"",
      ),
      solution: lines(
        "six = (y_test == 6)",
        "decalees = decaler(img_test, 0, 1)",
        "tournees = img_test[:, ::-1, ::-1]",
        "six_en_neuf_decalage = (modele.predict(decalees[six].reshape(six.sum(), -1)) == 9).mean()",
        "six_en_neuf_demi_tour = (modele.predict(tournees[six].reshape(six.sum(), -1)) == 9).mean()",
        "casse = \"demi-tour\" if six_en_neuf_demi_tour > six_en_neuf_decalage else \"décalage\"",
        "print(round(float(six_en_neuf_decalage), 3), round(float(six_en_neuf_demi_tour), 3), casse)",
      ),
      test: lines(
        "_six = (y_test == 6)",
        "_a = (modele.predict(decaler(img_test, 0, 1)[_six].reshape(_six.sum(), -1)) == 9).mean()",
        "_b = (modele.predict(img_test[:, ::-1, ::-1][_six].reshape(_six.sum(), -1)) == 9).mean()",
        "assert abs(six_en_neuf_decalage - _a) < 1e-9, \"gardez les six de test (y_test == 6), décalez-les (decaler(img_test, 0, 1)), aplatissez en 64 colonnes, prédisez, puis comptez la part de 9\"",
        "assert abs(six_en_neuf_demi_tour - _b) < 1e-9, \"pour le demi-tour, utilisez img_test[:, ::-1, ::-1] sur les six de test, aplatis en 64 colonnes, puis comptez la part de prédictions égales à 9\"",
        "assert casse == \"demi-tour\", \"la transformation qui change le sens est celle qui transforme beaucoup de six en neuf : comparez les deux parts\"",
      ),
      hint: "predit = modele.predict(images_six.reshape(len(images_six), -1)) ; (predit == 9).mean() donne la part prise pour un 9.",
    },
    {
      kind: "text",
      md: `### Augmenter seulement l'apprentissage, et après le découpage

Deux règles, pour la même raison : le test doit représenter ce qu'on rencontrera **en vrai**.

1. **Ne jamais augmenter le test.** Le jeu de test sert à mesurer ce que le modèle fera sur de nouvelles images, non transformées. Lui ajouter des images fabriquées fausserait la mesure. (On peut en revanche construire un **test décalé** à part pour mesurer la robustesse, comme depuis le module précédent : il est annoncé comme tel et vient *en plus* du test propre.)
2. **Augmenter après le découpage.** Si l'on augmente toutes les images puis qu'on découpe au hasard, les copies décalées d'une même image se retrouvent des deux côtés : le modèle apprend l'image décalée à droite, puis on le teste sur la même image décalée à gauche. C'est une **fuite** : le test n'est plus indépendant de l'apprentissage et le score devient trop beau. Le bon ordre est découper d'abord, puis augmenter uniquement \`X_train\`.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        "from scipy import ndimage",
        "from sklearn.model_selection import train_test_split",
        "",
        "# on augmente les 1797 images avec 4 décalages : 5 lignes par image d'origine",
        "def cinq_versions(imgs):",
        "    return np.concatenate([imgs] + [ndimage.shift(imgs, (0, dy, dx), order=0, cval=0)",
        "                                    for dy, dx in [(0, 1), (0, -1), (1, 0), (-1, 0)]])",
        "",
        "toutes = cinq_versions(images)",
        "origine = np.tile(np.arange(len(images)), 5)   # numéro de l'image d'origine de chaque ligne",
        "etiquettes = np.tile(y, 5)",
        "",
        "# MAUVAIS ORDRE : augmenter puis découper les 8985 lignes",
        "lignes_train, lignes_test = train_test_split(np.arange(len(toutes)), test_size=0.25, random_state=0, stratify=etiquettes)",
        "fuite = np.isin(origine[lignes_test], origine[lignes_train]).mean()",
        "print('augmenter puis découper : part des lignes de test dont l image d origine est aussi dans le train :', round(fuite, 3))",
        "",
        "# BON ORDRE : découper les images, puis augmenter le train seulement",
        "n_train = len(X_train)",
        "train_augmente = cinq_versions(X_train.reshape(-1, 8, 8))",
        "print('découper puis augmenter : train', train_augmente.shape[0], 'lignes, test', len(X_test), 'images intactes')",
      ),
      caption: "Si l'on augmente avant de découper, 100 % des lignes de test (2 247 sur 2 247) ont une copie de la même image d'origine côté apprentissage : le test n'est plus du neuf. Découper d'abord garde le test à 450 images jamais vues, et le jeu d'apprentissage passe de 1 347 à 6 735 lignes (5 × 1 347). Avec seulement des copies décalées, ces 6 735 lignes ne contiennent que 1 347 chiffres différents.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez une fonction `augmenter(images, etiquettes)` qui reçoit des images de forme (n, 8, 8) et leurs étiquettes, et renvoie `(images_aug, etiquettes_aug)` où `images_aug` empile **dans cet ordre** : les images d'origine, puis décalées d'un pixel vers la **droite** (colonnes), vers la **gauche**, vers le **bas** (lignes), vers le **haut**. Les étiquettes sont répétées 5 fois. Utilisez `decaler(imgs, dy, dx)`, déjà définie (`dy` : lignes, `dx` : colonnes, positif vers le bas ou la droite).",
      setup: lines(DECOUPAGE, DECALAGE),
      starter: lines(
        "def augmenter(images, etiquettes):",
        "    return images, etiquettes",
      ),
      solution: lines(
        "def augmenter(images, etiquettes):",
        "    versions = [images]",
        "    for dy, dx in [(0, 1), (0, -1), (1, 0), (-1, 0)]:",
        "        versions.append(decaler(images, dy, dx))",
        "    return np.concatenate(versions), np.tile(etiquettes, 5)",
        "",
        "aug, lab = augmenter(img_train, y_train)",
        "print(aug.shape, lab.shape)",
      ),
      test: lines(
        "_im, _lab = augmenter(img_train, y_train)",
        "assert _im.shape == (5 * len(img_train), 8, 8), f\"il faut 5 fois plus d'images : forme (6735, 8, 8), pas {_im.shape}\"",
        "assert _lab.shape == (5 * len(y_train),), \"les étiquettes doivent être répétées 5 fois\"",
        "assert np.array_equal(_im[:len(img_train)], img_train), \"le premier bloc doit être les images d'origine, sans changement\"",
        "assert np.array_equal(_im[len(img_train):2 * len(img_train)], decaler(img_train, 0, 1)), \"le deuxième bloc est décalé d'un pixel vers la droite : decaler(images, 0, 1)\"",
        "assert np.array_equal(_im[3 * len(img_train):4 * len(img_train)], decaler(img_train, 1, 0)), \"le quatrième bloc est décalé d'un pixel vers le bas : decaler(images, 1, 0)\"",
        "assert np.array_equal(_lab[3 * len(img_train):4 * len(img_train)], y_train), \"chaque bloc garde les étiquettes des images d'origine, dans le même ordre\"",
      ),
      hint: "np.concatenate([bloc0, bloc1, ...]) empile les blocs, np.tile(etiquettes, 5) répète le tableau d'étiquettes 5 fois de suite.",
    },
    {
      kind: "text",
      md: `### L'expérience : original contre augmenté

Entraînons deux perceptrons multicouches de mêmes réglages : l'un sur les 1 347 images d'origine, l'autre sur ces images **plus deux copies chacune décalées au hasard** de -1, 0 ou +1 pixel en hauteur et en largeur (4 041 lignes). On les évalue sur trois jeux de test : le test **propre**, le test **décalé d'un pixel vers la droite** (le cas du module précédent) et un test **décalé en diagonale** (1 pixel vers le bas et vers la droite), un décalage qui peut ne jamais avoir été vu sous cette forme exacte.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DECOUPAGE, DECALAGE),
      code: lines(
        "from sklearn.neural_network import MLPClassifier",
        "",
        "def augmenter_au_hasard(imgs, etiquettes, copies=2, graine=0):",
        "    rng = np.random.default_rng(graine)",
        "    versions, labels = [imgs], [etiquettes]",
        "    for _ in range(copies):",
        "        dy = rng.integers(-1, 2, len(imgs))   # -1, 0 ou 1 pour chaque image",
        "        dx = rng.integers(-1, 2, len(imgs))",
        "        versions.append(np.array([ndimage.shift(im, (a, b), order=0, cval=0) for im, a, b in zip(imgs, dy, dx)]))",
        "        labels.append(etiquettes)",
        "    return np.concatenate(versions), np.concatenate(labels)",
        "",
        "train_aug, y_aug = augmenter_au_hasard(img_train, y_train)",
        "print('apprentissage :', len(img_train), '->', len(train_aug), 'images')",
        "",
        "reglages = dict(hidden_layer_sizes=(32,), max_iter=300, tol=3e-3, random_state=0)",
        "original = MLPClassifier(**reglages).fit(X_train, y_train)",
        "augmente = MLPClassifier(**reglages).fit(train_aug.reshape(len(train_aug), -1), y_aug)",
        "",
        "tests = {",
        "    'propre': img_test,",
        "    'décalé à droite': decaler(img_test, 0, 1),",
        "    'décalé en diagonale': decaler(img_test, 1, 1),",
        "}",
        "for nom, imgs in tests.items():",
        "    Xt = imgs.reshape(len(imgs), -1)",
        "    print(f'{nom:20s} original {original.score(Xt, y_test):.3f}   augmenté {augmente.score(Xt, y_test):.3f}')",
      ),
      caption: "Sur le test propre, l'augmentation ne coûte presque rien : 96,2 % pour l'original, 96,0 % pour l'augmenté (un écart d'une image sur 450). Sur le test décalé à droite, la réussite passe de 43,1 % à 87,3 %, et en diagonale de 12,4 % à 81,6 %. L'entraînement est environ quatre fois plus long ici (trois fois plus d'images). Le gain est massif sur les décalages que l'on a simulés ; rien ne dit qu'on le retrouverait sur d'autres perturbations (flou, rotation), que l'on n'a pas simulées.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`modele_orig` (régression logistique sur les images d'origine) et la fonction `augmenter(images, etiquettes)` de l'exercice précédent (5 versions) sont fournies, ainsi que `X_decale`, le test décalé d'un pixel vers la droite (aplati, 450 × 64). Entraînez `modele_aug`, une `LogisticRegression(max_iter=2000)`, sur les images **augmentées** de `img_train` (aplaties à 64 colonnes). Rangez dans `reussite_orig` et `reussite_aug` leurs réussites sur `X_decale`, et dans `gain` la différence `reussite_aug - reussite_orig`.",
      setup: lines(
        DECOUPAGE,
        DECALAGE,
        "from sklearn.linear_model import LogisticRegression",
        "def augmenter(images, etiquettes):",
        "    versions = [images] + [decaler(images, dy, dx) for dy, dx in [(0, 1), (0, -1), (1, 0), (-1, 0)]]",
        "    return np.concatenate(versions), np.tile(etiquettes, 5)",
        "modele_orig = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
        "X_decale = decaler(img_test, 0, 1).reshape(len(img_test), -1)",
      ),
      starter: lines(
        "modele_aug = modele_orig",
        "reussite_orig = modele_orig.score(X_decale, y_test)",
        "reussite_aug = modele_aug.score(X_decale, y_test)",
        "gain = reussite_aug - reussite_orig",
      ),
      solution: lines(
        "images_aug, etiquettes_aug = augmenter(img_train, y_train)",
        "modele_aug = LogisticRegression(max_iter=2000).fit(images_aug.reshape(len(images_aug), -1), etiquettes_aug)",
        "reussite_orig = modele_orig.score(X_decale, y_test)",
        "reussite_aug = modele_aug.score(X_decale, y_test)",
        "gain = reussite_aug - reussite_orig",
        "print(round(reussite_orig, 4), round(reussite_aug, 4), round(gain, 4))",
      ),
      test: lines(
        "assert modele_aug is not modele_orig, \"modele_aug doit être un nouveau modèle, entraîné sur les images augmentées\"",
        "assert modele_aug.coef_.shape == modele_orig.coef_.shape, \"modele_aug doit être une régression logistique sur 64 pixels\"",
        "assert abs(reussite_aug - modele_aug.score(X_decale, y_test)) < 1e-9, \"reussite_aug est la réussite de modele_aug sur X_decale\"",
        "assert abs(reussite_orig - modele_orig.score(X_decale, y_test)) < 1e-9, \"reussite_orig est la réussite de modele_orig sur X_decale\"",
        "assert gain > 0.2, \"le modèle entraîné sur les images augmentées doit mieux lire les images décalées : entraînez-le sur augmenter(img_train, y_train), aplati avec reshape(len(...), -1)\"",
        "assert abs(gain - (reussite_aug - reussite_orig)) < 1e-9, \"gain = reussite_aug - reussite_orig\"",
      ),
      hint: "images_aug, etiquettes_aug = augmenter(img_train, y_train) ; aplatissez avec images_aug.reshape(len(images_aug), -1) avant fit.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Les limites de ces comparaisons : un seul découpage (13 scripteurs, 450 images de test : une différence de quelques images n'est pas significative), un seul tirage des décalages aléatoires et une seule initialisation du réseau. Le gain dépend des transformations choisies : on a simulé des décalages et on teste des décalages, la mesure est donc favorable. Un test réellement indépendant demanderait de nouvelles images, écrites par d'autres personnes, avec leurs propres défauts (inclinaison, épaisseur du trait, bruit du scanner).",
    },
    {
      kind: "text",
      md: `### À retenir

- Une **augmentation de données** fabrique de nouveaux exemples d'apprentissage par des transformations qui gardent l'étiquette ; elle apprend au modèle les invariances que le problème exige.
- Le choix des transformations est une décision de domaine : décalages et petites rotations pour des chiffres, **jamais** de demi-tour ni de miroir.
- On **découpe d'abord**, on augmente ensuite **le seul apprentissage**, et on garde un test propre. On peut ajouter un test volontairement perturbé pour mesurer la robustesse, annoncé comme tel.
- L'augmentation est gratuite en données mais coûte du temps de calcul et ne remplace pas de vraies images variées.

Au dernier module, une autre façon de profiter de peu de données : réutiliser un modèle déjà entraîné par d'autres sur de très nombreuses images.`,
    },
  ],
  quiz: [
    {
      question: "Laquelle de ces transformations conserve l'étiquette d'un chiffre manuscrit ?",
      options: [
        "Un demi-tour de l'image",
        "Le miroir gauche-droite",
        "Un décalage d'un pixel",
        "Une rotation de 90°",
      ],
      correct: 2,
      explanation: "Un chiffre décalé d'un pixel reste le même chiffre. Un demi-tour fait d'un 6 un 9, et le miroir ou une rotation de 90° produisent des formes qui ne sont plus des chiffres.",
    },
    {
      question: "Pourquoi faut-il augmenter les données après le découpage apprentissage/test et non avant ?",
      options: [
        "Pour que le calcul soit plus rapide",
        "Pour que des copies d'une même image ne se retrouvent pas des deux côtés, ce qui rendrait le test trop facile",
        "Parce que scikit-learn l'impose",
        "Pour obtenir un test plus grand",
      ],
      correct: 1,
      explanation: "Dans l'expérience du module, augmenter avant de découper met toutes les lignes de test en face d'une copie de la même image dans l'apprentissage. C'est une fuite : le score mesuré serait trop beau.",
    },
    {
      question: "Pourquoi ne pas augmenter le jeu de test propre ?",
      options: [
        "Parce que le test doit représenter les images réelles, non transformées, qu'on rencontrera en pratique",
        "Parce que les images de test sont trop petites",
        "Parce que le modèle ne sait pas lire des images de test plus nombreuses",
        "Parce que cela donnerait un score plus bas",
      ],
      correct: 0,
      explanation: "Le test mesure ce que le modèle fera en situation réelle. Ajouter des images fabriquées déplace la mesure. Un test décalé séparé reste utile pour mesurer la robustesse, à condition de l'annoncer comme tel.",
    },
    {
      question: "Dans l'expérience, le perceptron entraîné avec des décalages aléatoires passe de 43,1 % à 87,3 % sur le test décalé à droite. Qu'est-ce qui limite la portée de ce résultat ?",
      options: [
        "Les décalages simulés à l'entraînement sont aussi ceux du test, et il n'y a qu'un découpage de 450 images",
        "Le test décalé contient plus d'images que le test propre",
        "Le perceptron n'a pas de couche cachée",
        "Les images augmentées étaient dans le test",
      ],
      correct: 0,
      explanation: "Le gain est mesuré sur la perturbation même qu'on a simulée, avec un seul tirage et un seul découpage. Il ne dit rien des rotations ou du flou, et d'autres personnes écriraient autrement.",
    },
    {
      question: "Le modèle entraîné sur les originaux lit 88,9 % des six tournés d'un demi-tour comme des 9. Qu'est-ce que cela montre ?",
      options: [
        "Que la rotation est une bonne augmentation pour les six",
        "Que la transformation change le sens de l'image : donner l'étiquette 6 à un six tourné serait faux",
        "Que le modèle ne sait pas lire les six",
        "Que 88,9 % est la réussite globale du modèle",
      ],
      correct: 1,
      explanation: "Un six tourné d'un demi-tour ressemble réellement à un 9, d'où le calcul. Une augmentation de ce type brouillerait l'apprentissage au lieu de l'aider.",
    },
  ],
};
