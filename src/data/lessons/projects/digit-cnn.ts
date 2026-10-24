import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Chiffres manuscrits fournis avec scikit-learn (load_digits, rien n'est téléchargé) : 1 797 images de 8 x 8 pixels,
 * niveaux de gris de 0 à 16 (ramenés ici entre 0 et 1), d'après le jeu « Optical Recognition of Handwritten Digits »
 * de l'UCI (E. Alpaydin, 1998). Découpage : 1 347 images pour apprendre, 450 pour évaluer, mêmes proportions de chaque chiffre.
 * Tous les chiffres cités dans ce projet ont été mesurés le 24 octobre 2026 avec Pyodide 314.0.7 (scikit-learn, NumPy).
 */
const DONNEES = lines(
  "import numpy as np",
  "from sklearn.datasets import load_digits",
  "from sklearn.model_selection import train_test_split",
  "",
  "chiffres = load_digits()",
  "images = chiffres.images / 16.0          # (1797, 8, 8), valeurs entre 0 et 1",
  "y = chiffres.target",
  "X = images.reshape(len(images), -1)      # une ligne de 64 pixels par image (pour les modèles non convolutifs)",
  "i_train, i_test = train_test_split(np.arange(len(y)), test_size=0.25, random_state=0, stratify=y)",
);

/** Passe avant : fenêtres, initialisation, convolution + ReLU + max pooling + couche dense, softmax */
const AVANT = lines(
  "def init(graine=0, nf=6):",
  "    # nf filtres 3x3, puis une couche dense de nf*3*3 entrées vers 10 sorties",
  "    rng = np.random.default_rng(graine)",
  "    return {'F': rng.normal(0, 0.3, (nf, 3, 3)), 'bF': np.zeros(nf),",
  "            'W': rng.normal(0, np.sqrt(2 / (nf * 9)), (nf * 9, 10)), 'b': np.zeros(10)}",
  "",
  "def avant(p, imgs):",
  "    fen = np.lib.stride_tricks.sliding_window_view(imgs, (3, 3), axis=(1, 2))   # (n, 6, 6, 3, 3)",
  "    z = np.einsum('nijkl,fkl->nfij', fen, p['F']) + p['bF'][None, :, None, None]  # convolution",
  "    a = np.maximum(z, 0)                                                          # ReLU",
  "    n, nf = a.shape[:2]",
  "    blocs = a.reshape(n, nf, 3, 2, 3, 2)                                          # blocs 2x2",
  "    m = blocs.max(axis=(3, 5))                                                    # max pooling : (n, nf, 3, 3)",
  "    plat = m.reshape(n, -1)",
  "    logits = plat @ p['W'] + p['b']                                               # couche dense",
  "    return {'fen': fen, 'z': z, 'a': a, 'blocs': blocs, 'm': m, 'plat': plat, 'logits': logits}",
  "",
  "def softmax(logits):",
  "    e = np.exp(logits - logits.max(axis=1, keepdims=True))   # on retranche le maximum : pas de débordement",
  "    return e / e.sum(axis=1, keepdims=True)",
);

/** Perte (entropie croisée) et rétropropagation */
const RETRO = lines(
  "def perte_grad(p, imgs, y):",
  "    c = avant(p, imgs)",
  "    n = len(y)",
  "    proba = softmax(c['logits'])",
  "    perte = -np.log(proba[np.arange(n), y] + 1e-12).mean()",
  "    # sortie : (probabilité - 1 pour la bonne classe) / n",
  "    dl = proba.copy()",
  "    dl[np.arange(n), y] -= 1",
  "    dl /= n",
  "    g = {'W': c['plat'].T @ dl, 'b': dl.sum(axis=0)}",
  "    dm = (dl @ p['W'].T).reshape(c['m'].shape)",
  "    # max pooling : le gradient revient à la case du maximum (réparti en cas d'égalité)",
  "    masque = (c['blocs'] == c['m'][:, :, :, None, :, None])",
  "    masque = masque / masque.sum(axis=(3, 5), keepdims=True)",
  "    da = (masque * dm[:, :, :, None, :, None]).reshape(c['a'].shape)",
  "    dz = da * (c['z'] > 0)                                   # ReLU : le gradient passe là où z > 0",
  "    g['F'] = np.einsum('nfij,nijkl->fkl', dz, c['fen'])      # convolution : corrélation avec les fenêtres",
  "    g['bF'] = dz.sum(axis=(0, 2, 3))",
  "    return perte, g",
);

/** Boucle d'entraînement par mini-lots (descente de gradient avec élan et pas adaptatif, dite Adam) et prédiction */
const ENTRAINEMENT = lines(
  "def entrainer(imgs, y, epoques=20, lot=32, pas=0.01, graine=0, nf=6):",
  "    p = init(graine, nf)",
  "    rng = np.random.default_rng(graine)",
  "    m = {k: np.zeros_like(v) for k, v in p.items()}      # moyenne mobile du gradient",
  "    v = {k: np.zeros_like(a) for k, a in p.items()}      # moyenne mobile du gradient au carré",
  "    t = 0",
  "    historique = []",
  "    for _ in range(epoques):",
  "        ordre = rng.permutation(len(y))",
  "        total = 0.0",
  "        for debut in range(0, len(y), lot):",
  "            b = ordre[debut:debut + lot]",
  "            perte, g = perte_grad(p, imgs[b], y[b])",
  "            total += perte * len(b)",
  "            t += 1",
  "            for k in p:",
  "                m[k] = 0.9 * m[k] + 0.1 * g[k]",
  "                v[k] = 0.999 * v[k] + 0.001 * g[k] ** 2",
  "                p[k] -= pas * (m[k] / (1 - 0.9 ** t)) / (np.sqrt(v[k] / (1 - 0.999 ** t)) + 1e-8)",
  "        historique.append(total / len(y))",
  "    return p, historique",
  "",
  "def predire(p, imgs):",
  "    return avant(p, imgs)['logits'].argmax(axis=1)",
);

const RESEAU = lines(DONNEES, "", AVANT, "", RETRO, "", ENTRAINEMENT);

/** Réseau entraîné (20 passages, graine 0) et ses prédictions sur les 450 images de test */
const MODELE = lines(
  RESEAU,
  "",
  "p, historique = entrainer(images[i_train], y[i_train], epoques=20)",
  "y_test = y[i_test]",
  "pred = predire(p, images[i_test])",
  "proba = softmax(avant(p, images[i_test])['logits'])",
);

export const projectDigitCnn: LessonModule = {
  id: "advanced-1",
  title: "Projet guidé : un réseau convolutif sur les chiffres, écrit en NumPy",
  duration: "4 h",
  summary: "Un projet de reconnaissance d'images de bout en bout sur les chiffres manuscrits de scikit-learn : une référence simple, un petit réseau convolutif écrit à la main en NumPy (passe avant, rétropropagation, entraînement en quelques secondes), la comparaison honnête avec un perceptron, l'analyse des erreurs, puis ce qui change quand les images sont médicales.",
  objectives: [
    "Établir une référence naïve et une référence solide avant de construire un réseau",
    "Écrire en NumPy un réseau convolutif complet (convolution, ReLU, max pooling, couche dense, softmax) et sa rétropropagation, et la vérifier par un gradient numérique",
    "Entraîner ce réseau par mini-lots, comparer ses résultats à ceux d'un modèle linéaire et d'un perceptron en tenant compte de l'incertitude d'une évaluation sur 450 images",
    "Lire une matrice de confusion, regarder les images mal classées et la confiance du modèle quand il se trompe",
    "Expliquer pourquoi passer à des images médicales change de métier (données de santé, validation clinique, biais), même si le code se ressemble",
  ],
  sections: [
    {
      kind: "note",
      tone: "warning",
      md: "Ce projet est un exercice pédagogique sur des images de chiffres manuscrits de 8 sur 8 pixels. Il ne porte sur aucune image médicale et ne constitue en aucun cas un dispositif médical ni une aide au diagnostic.",
    },
    {
      kind: "text",
      md: `### Le contexte

Le sujet initial de la page Projets était un classifieur d'**images médicales**. Pour un projet qui tourne dans un navigateur, sans téléchargement ni données de santé, nous prenons un cas voisin : les **chiffres manuscrits** fournis avec scikit-learn, 1 797 images de 8 sur 8 pixels. C'est petit, mais c'est suffisant pour parcourir tout le trajet d'un projet de vision : une référence, un réseau convolutif, une comparaison honnête, une analyse d'erreurs. La dernière étape revient sur ce qui change quand les images sont médicales.

Le cours « Vision par ordinateur » explique les idées une à une ; ce projet les **assemble**. Le réseau est écrit en **NumPy**, sans bibliothèque de réseaux de neurones : il n'y a pas de magie, seulement des tableaux, une dérivation à faire une fois et une boucle. Les images ont des niveaux de gris de 0 à 16 (blocs de points noirs d'une image de 32 sur 32), que l'on ramène entre 0 et 1.

Le plan :

- **étape 1** : découper les données et établir une référence ;
- **étape 2** : écrire la passe avant du réseau ;
- **étape 3** : écrire la rétropropagation et la vérifier ;
- **étape 4** : entraîner ;
- **étape 5** : comparer à un perceptron ;
- **étape 6** : analyser les erreurs ;
- **étape 7** : et pour de vraies images médicales.`,
    },
    {
      kind: "text",
      md: `### Étape 1 : découper et établir une référence

On garde **450 images** (25 %) que le modèle ne verra jamais pendant l'apprentissage, et 1 347 pour apprendre, avec les mêmes proportions de chaque chiffre dans les deux parts. Avant de construire quoi que ce soit, on mesure deux références :

- une référence **naïve** : toujours répondre le chiffre le plus fréquent ;
- une référence **solide mais simple** : une régression logistique sur les 64 pixels.

Un réseau convolutif n'a d'intérêt que s'il fait mieux que cela, ou s'il fait aussi bien avec d'autres qualités.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "from sklearn.dummy import DummyClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "",
        "print('images :', images.shape, ' apprentissage :', len(i_train), ' test :', len(i_test))",
        "print('images de test par chiffre :', np.bincount(y[i_test]))",
        "",
        "naif = DummyClassifier(strategy='most_frequent').fit(X[i_train], y[i_train])",
        "print('référence naïve    :', round(naif.score(X[i_test], y[i_test]), 4))",
        "logistique = LogisticRegression(max_iter=2000).fit(X[i_train], y[i_train])",
        "print('régression logistique :', round(logistique.score(X[i_test], y[i_test]), 4))",
      ),
      caption: "Dix classes presque équilibrées : répondre toujours le même chiffre réussit 10,2 % des images (46 sur 450), le hasard pur en donnerait 10 %. La régression logistique, qui lit les 64 pixels sans rien savoir de leur voisinage, réussit déjà 96,9 % : la barre à dépasser est haute.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Rangez dans `classe_naive` le chiffre le plus fréquent dans `y[i_train]` (`np.bincount` et `argmax`), puis dans `taux_naif` la part des images de test qui portent ce chiffre : c'est la réussite d'un modèle qui répond toujours `classe_naive`.",
      setup: DONNEES,
      starter: lines("classe_naive = 0", "taux_naif = 0.5"),
      solution: lines(
        "classe_naive = int(np.bincount(y[i_train]).argmax())",
        "taux_naif = float((y[i_test] == classe_naive).mean())",
        "print(classe_naive, round(taux_naif, 4))",
      ),
      test: lines(
        "assert classe_naive == np.bincount(y[i_train]).argmax(), \"classe_naive : le chiffre le plus fréquent de y[i_train], np.bincount(...).argmax()\"",
        "assert abs(taux_naif - (y[i_test] == classe_naive).mean()) < 1e-9, \"taux_naif : la part des images de test dont le chiffre est classe_naive\"",
      ),
      hint: "np.bincount(y[i_train]) compte les images de chaque chiffre ; (y[i_test] == c).mean() donne la part d'images de test égales à c.",
    },
    {
      kind: "text",
      md: `### Étape 2 : la passe avant

Notre réseau a quatre couches, toutes réduites au minimum :

- une **convolution** : 6 filtres de 3 sur 3, qui glissent sur l'image 8 sur 8 sans la déborder, soit 6 cartes de 6 sur 6 ;
- une **ReLU** : \`max(0, z)\` sur chaque valeur ;
- un **max pooling** 2 sur 2 : on ne garde que le maximum de chaque bloc, soit 6 cartes de 3 sur 3, donc 54 valeurs ;
- une **couche dense** de 54 entrées vers 10 sorties (une par chiffre), suivie d'un **softmax** qui les transforme en probabilités.

Un filtre calcule, en chaque position, une somme pondérée de la fenêtre qu'il couvre (ce que le cours appelle, en toute rigueur, une corrélation croisée : le filtre n'est pas retourné).`,
    },
    {
      kind: "equation",
      latex: "z_{f,i,j} = b_f + \\sum_{u=0}^{2} \\sum_{v=0}^{2} F_{f,u,v}\\, x_{i+u,\\,j+v} \\qquad p_{c} = \\frac{e^{s_c}}{\\sum_{k=0}^{9} e^{s_k}}",
      narrow: "z_{f,i,j} = b_f + \\sum_{u=0}^{2} \\sum_{v=0}^{2} F_{f,u,v}\\, x_{i+u,\\,j+v} \\\\ p_{c} = \\frac{e^{s_c}}{\\sum_{k=0}^{9} e^{s_k}}",
      caption: "À gauche, la convolution : la valeur de la carte f en (i, j) est le biais du filtre plus la somme pondérée de la fenêtre 3 sur 3 de l'image. À droite, le softmax : les dix scores s de la couche dense deviennent des probabilités positives de somme 1.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        AVANT,
        "",
        "p = init(graine=0)",
        "c = avant(p, images[:4])",
        "print('image                 :', images[:4].shape)",
        "print('après la convolution  :', c['z'].shape, ' (6 filtres, cartes de 6 x 6)')",
        "print('après le max pooling  :', c['m'].shape, ' soit', c['plat'].shape[1], 'valeurs par image')",
        "print('scores                :', c['logits'].shape)",
        "nb = sum(a.size for a in p.values())",
        "print('paramètres :', 6 * 9 + 6, '(filtres et biais) +', 54 * 10 + 10, '(couche dense) =', nb)",
        "print('probabilités de la 1re image, réseau non entraîné :', softmax(c['logits'])[0].round(2))",
      ),
      caption: "Le réseau n'a que 610 paramètres : 60 pour les filtres, 550 pour la couche dense. Avant tout apprentissage, ses probabilités vont de 0,02 à 0,27 sans rapport avec le chiffre dessiné : il ne sait rien. Les formes affichées servent de vérification, c'est l'erreur de forme qui piège le plus souvent dans ce genre de code.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `nb_parametres(nf, k, taille)` : le nombre de paramètres d'un réseau du même type, avec `nf` filtres `k` sur `k` appliqués à une image `taille` sur `taille` (sans bord ajouté), un max pooling 2 sur 2 (la taille de la carte est divisée par 2, arrondie vers le bas) et une couche dense vers 10 chiffres. Chaque filtre a un biais, chaque sortie aussi.",
      starter: lines(
        "def nb_parametres(nf, k, taille):",
        "    return 0",
      ),
      solution: lines(
        "def nb_parametres(nf, k, taille):",
        "    carte = taille - k + 1          # taille de la carte après la convolution",
        "    cote = carte // 2               # après le max pooling 2x2",
        "    filtres = nf * k * k + nf",
        "    dense = nf * cote * cote * 10 + 10",
        "    return filtres + dense",
        "",
        "print(nb_parametres(6, 3, 8), nb_parametres(8, 3, 10))",
      ),
      test: lines(
        "assert nb_parametres(6, 3, 8) == 610, \"avec 6 filtres 3x3 sur 8x8 : 60 paramètres de filtres + 550 de couche dense = 610\"",
        "assert nb_parametres(4, 3, 8) == 410, \"4 filtres 3x3 sur 8x8 : 40 + (4 x 3 x 3 x 10 + 10) = 410\"",
        "assert nb_parametres(8, 3, 10) == 1370, \"8 filtres 3x3 sur 10x10 : cartes de 8x8, puis de 4x4 après le pooling : 80 + 1 290 = 1 370\"",
      ),
      hint: "Carte après convolution : taille - k + 1. Après le pooling : divisez par 2 (//). La couche dense reçoit nf x côté x côté valeurs.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `perte(proba, y)` : l'entropie croisée moyenne, c'est-à-dire la moyenne de `-log` de la probabilité donnée à la **bonne** classe de chaque image. `proba` est un tableau (images, 10) dont chaque ligne somme à 1 ; `y` contient les chiffres. Ajoutez `1e-12` dans le logarithme pour éviter `log(0)`.",
      setup: lines("import numpy as np"),
      starter: lines(
        "def perte(proba, y):",
        "    return 0.0",
      ),
      solution: lines(
        "def perte(proba, y):",
        "    return -np.log(proba[np.arange(len(y)), y] + 1e-12).mean()",
        "",
        "proba = np.array([[0.7, 0.2, 0.1], [0.1, 0.1, 0.8]])",
        "print(round(perte(proba, np.array([0, 2])), 4))",
      ),
      test: lines(
        "_proba = np.array([[0.7, 0.2, 0.1], [0.1, 0.1, 0.8]])",
        "_y = np.array([0, 2])",
        "_attendu = -(np.log(0.7) + np.log(0.8)) / 2",
        "assert abs(perte(_proba, _y) - _attendu) < 1e-6, f\"pour ces deux images, la perte vaut -(ln 0,7 + ln 0,8) / 2, soit {_attendu:.4f}\"",
        "_sure = np.array([[1.0, 0.0], [0.0, 1.0]])",
        "assert perte(_sure, np.array([0, 1])) < 1e-9, \"un modèle qui donne la probabilité 1 à la bonne classe a une perte nulle\"",
        "assert perte(np.array([[0.5, 0.5]]), np.array([1])) > perte(np.array([[0.1, 0.9]]), np.array([1])), \"la perte doit baisser quand la bonne classe reçoit plus de probabilité\"",
      ),
      hint: "proba[np.arange(len(y)), y] prend, pour chaque ligne i, la colonne y[i] : la probabilité de la bonne classe.",
    },
    {
      kind: "text",
      md: `### Étape 3 : la rétropropagation, vérifiée

Pour apprendre, il faut savoir de combien la perte change quand on bouge chaque paramètre : le **gradient**. On le calcule couche par couche en remontant, avec la règle de dérivation des fonctions composées. Chaque couche a sa règle simple :

- **softmax et entropie croisée** : le gradient par rapport aux scores est \`(probabilité − 1 pour la bonne classe) / n\`. Il est positif pour les mauvaises classes, négatif pour la bonne ;
- **couche dense** : le gradient des poids est le produit des valeurs d'entrée par ce gradient de sortie ;
- **max pooling** : le gradient retourne **uniquement à la case qui a gagné** dans chaque bloc, les autres reçoivent 0 ;
- **ReLU** : le gradient passe là où la valeur était positive, et s'arrête ailleurs ;
- **convolution** : le gradient d'un filtre est la somme, sur toutes les positions, du gradient de la carte multiplié par la fenêtre d'image correspondante. C'est la même corrélation que la passe avant.

Une dérivation à la main se trompe facilement, et un réseau avec un gradient faux **apprend quand même un peu** : on ne s'en aperçoit pas. Le seul vrai contrôle est de comparer avec un gradient **numérique**, obtenu en bougeant un paramètre d'un tout petit pas \`h\` dans les deux sens : \`(perte(p + h) − perte(p − h)) / 2h\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        AVANT,
        "",
        RETRO,
        "",
        "# vérification : gradient écrit à la main contre gradient numérique, sur 5 images",
        "p = init(graine=1)",
        "xb, yb = images[:5], y[:5]",
        "_, g = perte_grad(p, xb, yb)",
        "h = 1e-6",
        "pire = 0.0",
        "for nom, indice in [('F', (1, 0, 2)), ('F', (3, 1, 1)), ('bF', (2,)), ('W', (5, 3)), ('W', (10, 2)), ('b', (7,))]:",
        "    p[nom][indice] += h",
        "    haut = perte_grad(p, xb, yb)[0]",
        "    p[nom][indice] -= 2 * h",
        "    bas = perte_grad(p, xb, yb)[0]",
        "    p[nom][indice] += h                       # on remet le paramètre en place",
        "    numerique = (haut - bas) / (2 * h)",
        "    ecart = abs(g[nom][indice] - numerique)",
        "    pire = max(pire, ecart)",
        "    print(f'{nom}{indice}: main {g[nom][indice]: .6f}   numérique {numerique: .6f}')",
        "print('écart absolu maximal :', f'{pire:.1e}')",
      ),
      caption: "Les deux colonnes coïncident sur les six paramètres testés (filtres, biais, couche dense), avec un écart absolu maximal de 3,8e-10. Le contrôle ne couvre pas tous les 610 paramètres : il prend un échantillon, de chaque sorte. Il sert à détecter une erreur de signe ou un oubli, pas à prouver l'absence de bogue.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `gradient_numerique(p, nom, indice, imgs, y, h=1e-6)` : la dérivée de la perte par rapport au paramètre `p[nom][indice]`, par différence centrée `(perte(p + h) − perte(p − h)) / (2h)`. Remettez le paramètre à sa valeur d'origine avant de rendre le résultat (`perte_grad(p, imgs, y)[0]` donne la perte).",
      setup: lines(DONNEES, "", AVANT, "", RETRO),
      starter: lines(
        "def gradient_numerique(p, nom, indice, imgs, y, h=1e-6):",
        "    return 0.0",
      ),
      solution: lines(
        "def gradient_numerique(p, nom, indice, imgs, y, h=1e-6):",
        "    origine = p[nom][indice]",
        "    p[nom][indice] = origine + h",
        "    haut = perte_grad(p, imgs, y)[0]",
        "    p[nom][indice] = origine - h",
        "    bas = perte_grad(p, imgs, y)[0]",
        "    p[nom][indice] = origine            # retour à la valeur d'origine",
        "    return (haut - bas) / (2 * h)",
        "",
        "_p = init(graine=1)",
        "print(round(gradient_numerique(_p, 'W', (5, 3), images[:5], y[:5]), 6))",
      ),
      test: lines(
        "_p = init(graine=1)",
        "_copie = _p['W'].copy()",
        "_, _g = perte_grad(_p, images[:5], y[:5])",
        "_val = gradient_numerique(_p, 'W', (5, 3), images[:5], y[:5])",
        "assert abs(_val - _g['W'][5, 3]) < 1e-6, f\"le gradient numérique doit être proche du gradient écrit à la main : {_g['W'][5, 3]:.6f}\"",
        "assert np.array_equal(_p['W'], _copie), \"remettez le paramètre à sa valeur d'origine après les deux essais\"",
        "_val2 = gradient_numerique(_p, 'F', (1, 0, 2), images[:5], y[:5])",
        "assert abs(_val2 - _g['F'][1, 0, 2]) < 1e-6, \"la fonction doit marcher pour n'importe quel paramètre, y compris un filtre\"",
      ),
      hint: "p[nom][indice] = ... modifie le tableau en place : gardez la valeur d'origine dans une variable pour la remettre à la fin.",
    },
    {
      kind: "text",
      md: `### Étape 4 : entraîner

L'entraînement répète trois gestes : tirer un **mini-lot** de 32 images, calculer la perte et le gradient, déplacer les paramètres dans le sens opposé au gradient. Passer une fois sur toutes les images s'appelle une **époque**. Plutôt que de retrancher le gradient tel quel, on utilise ici la variante **Adam**, qui lisse le gradient dans le temps et adapte le pas de chaque paramètre ; elle tient en quelques lignes et rend l'apprentissage peu sensible au choix du pas. Les mini-lots sont tirés dans un ordre aléatoire fixé par une graine, donc le résultat se reproduit exactement.

On suit la **perte moyenne** à chaque époque : elle doit descendre.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(DONNEES, "", AVANT, "", RETRO, "", ENTRAINEMENT),
      code: lines(
        "import time",
        "",
        "debut = time.perf_counter()",
        "p, historique = entrainer(images[i_train], y[i_train], epoques=20)",
        "duree = time.perf_counter() - debut",
        "",
        "print('perte moyenne aux époques 1, 5, 10, 15, 20 :', [round(float(historique[k]), 3) for k in (0, 4, 9, 14, 19)])",
        "print('réussite sur l\\'apprentissage :', round(float((predire(p, images[i_train]) == y[i_train]).mean()), 4))",
        "print('réussite sur le test          :', round(float((predire(p, images[i_test]) == y[i_test]).mean()), 4))",
        "print('durée de l\\'entraînement : moins de 10 s ?', duree < 10)",
      ),
      caption: "La perte moyenne passe de 1,91 (première époque, quand le réseau apprend encore) à 0,054 à la vingtième. Le réseau réussit 99,0 % des images d'apprentissage et 98,0 % des 450 images de test, soit 9 erreurs. L'entraînement a pris environ 3 s sous Node pendant la rédaction, plus dans un navigateur selon l'appareil.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un réseau plus petit : `entrainer(images[i_train], y[i_train], epoques=10, nf=3)`, rangez le réseau dans `p_petit`, puis dans `acc_petit` sa réussite sur les images de test (`predire`, comparée à `y[i_test]`).",
      setup: lines(DONNEES, "", AVANT, "", RETRO, "", ENTRAINEMENT),
      starter: lines("p_petit = None", "acc_petit = 0.0"),
      solution: lines(
        "p_petit, _ = entrainer(images[i_train], y[i_train], epoques=10, nf=3)",
        "acc_petit = float((predire(p_petit, images[i_test]) == y[i_test]).mean())",
        "print(sum(a.size for a in p_petit.values()), 'paramètres, réussite', round(acc_petit, 4))",
      ),
      test: lines(
        "assert p_petit is not None and p_petit['F'].shape[0] == 3, \"p_petit doit venir de entrainer(..., nf=3) : 3 filtres\"",
        "assert abs(acc_petit - (predire(p_petit, images[i_test]) == y[i_test]).mean()) < 1e-9, \"acc_petit : la part d'images de test bien classées par p_petit\"",
        "assert acc_petit > 0.8, f\"3 filtres suffisent à dépasser 80 % sur ces chiffres, et vous obtenez {acc_petit:.3f}\"",
      ),
      hint: "p_petit, _ = entrainer(...) : la fonction rend le réseau et l'historique de la perte.",
    },
    {
      kind: "text",
      md: `### Étape 5 : comparer sans se raconter d'histoires

Sur 450 images de test, **une image de plus ou de moins** change la réussite de 0,22 point. Une différence d'un point entre deux modèles ne veut donc presque rien dire. Pour une réussite mesurée \`r\` sur \`n\` images, l'écart-type de l'estimation est environ \`sqrt(r (1 − r) / n)\`. De plus, un réseau dépend de sa **graine d'initialisation** : un autre tirage des poids de départ donne un autre résultat.

Comparons donc trois modèles sur le même découpage : la régression logistique, un perceptron multicouche de scikit-learn (32 neurones cachés, qui lit les 64 pixels un par un) et notre réseau convolutif, puis regardons l'effet de la graine.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.neural_network import MLPClassifier",
        "",
        "logistique = LogisticRegression(max_iter=2000).fit(X[i_train], y[i_train])",
        "mlp = MLPClassifier(hidden_layer_sizes=(32,), max_iter=300, tol=1e-3, random_state=0).fit(X[i_train], y[i_train])",
        "nb_mlp = sum(c.size for c in mlp.coefs_) + sum(b.size for b in mlp.intercepts_)",
        "",
        "resultats = [",
        "    ('régression logistique', logistique.predict(X[i_test]), 64 * 10 + 10),",
        "    ('perceptron (32 cachés)', mlp.predict(X[i_test]), nb_mlp),",
        "    ('réseau convolutif NumPy', pred, sum(a.size for a in p.values())),",
        "]",
        "for nom, prediction, nb in resultats:",
        "    erreurs = int((prediction != y_test).sum())",
        "    r = 1 - erreurs / len(y_test)",
        "    print(f'{nom:24s} réussite {r:.4f}  erreurs {erreurs:2d}  paramètres {nb:4d}')",
        "print('écart-type de l\\'estimation à 98 % sur 450 images :', round(float(np.sqrt(0.98 * 0.02 / 450)), 4))",
      ),
      caption: "Régression logistique 96,9 % (14 erreurs, 650 paramètres), perceptron 97,1 % (13 erreurs, 2 410 paramètres), réseau convolutif 98,0 % (9 erreurs, 610 paramètres). L'écart-type d'une estimation est de 0,66 point : les trois résultats se recouvrent presque.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(RESEAU, "y_test = y[i_test]"),
      code: lines(
        "# l'effet de la graine d'initialisation : trois autres réseaux, entraînés 10 époques seulement pour rester courts",
        "for graine in (1, 2, 3):",
        "    q, _ = entrainer(images[i_train], y[i_train], epoques=10, graine=graine)",
        "    print('graine', graine, ': réussite', round(float((predire(q, images[i_test]) == y_test).mean()), 4))",
      ),
      caption: "Avec trois autres graines et 10 époques, le réseau obtient 96,9 %, 96,9 % et 97,6 %. Sur de si petites images, tout le monde fait bien, et un seul découpage ne permet pas de proclamer un vainqueur. L'avantage du réseau convolutif est surtout son nombre de paramètres : un niveau voisin avec environ quatre fois moins de paramètres que le perceptron.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `incertitude(r, n)` : l'écart-type d'une réussite `r` mesurée sur `n` images, `sqrt(r (1 − r) / n)`. Puis rangez dans `ecart_modeles` la différence de réussite, en points de pourcentage (positive), entre 0,980 et 0,969, et dans `distinguables` un booléen qui dit si cette différence est plus grande que **deux fois** `incertitude(0.975, 450) * 100`.",
      setup: lines("import numpy as np"),
      starter: lines(
        "def incertitude(r, n):",
        "    return 0.0",
        "",
        "ecart_modeles = 0.0",
        "distinguables = True",
      ),
      solution: lines(
        "def incertitude(r, n):",
        "    return float(np.sqrt(r * (1 - r) / n))",
        "",
        "ecart_modeles = (0.980 - 0.969) * 100",
        "distinguables = bool(ecart_modeles > 2 * incertitude(0.975, 450) * 100)",
        "print(round(ecart_modeles, 2), round(incertitude(0.975, 450) * 100, 2), distinguables)",
      ),
      test: lines(
        "assert abs(incertitude(0.5, 100) - 0.05) < 1e-9, \"incertitude(0.5, 100) = sqrt(0,5 x 0,5 / 100) = 0,05\"",
        "assert incertitude(0.9, 1000) < incertitude(0.9, 100), \"plus il y a d'images, plus l'incertitude baisse\"",
        "assert abs(ecart_modeles - 1.1) < 1e-6, \"ecart_modeles : (0,980 - 0,969) x 100 = 1,1 point\"",
        "assert distinguables is False, \"1,1 point est plus petit que deux fois l'incertitude (environ 1,5 point) : sur 450 images, on ne peut pas les distinguer\"",
      ),
      hint: "Deux fois l'écart-type vaut environ 1,5 point ici ; la différence entre les deux modèles est de 1,1 point.",
    },
    {
      kind: "text",
      md: `### Étape 6 : regarder les erreurs

Une seule réussite cache **où** le modèle se trompe. La **matrice de confusion** compte, pour chaque chiffre réel (lignes), les chiffres prédits (colonnes) : la diagonale contient les bonnes réponses, tout le reste sont des erreurs. On repère ainsi les chiffres confondus entre eux, puis on **regarde les images**, ce qu'aucune statistique ne remplace.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.metrics import confusion_matrix",
        "",
        "cm = confusion_matrix(y_test, pred)",
        "rappel = cm.diagonal() / cm.sum(axis=1)",
        "print('rappel par chiffre :', rappel.round(3))",
        "print('chiffre le moins bien reconnu :', int(rappel.argmin()))",
        "hors_diag = cm.copy()",
        "np.fill_diagonal(hors_diag, 0)",
        "print('confusions les plus fréquentes (vrai -> prédit : nombre) :')",
        "for k in np.argsort(-hors_diag.ravel())[:3]:",
        "    vrai, predit = np.unravel_index(k, hors_diag.shape)",
        "    print(f'  {vrai} -> {predit} : {hors_diag[vrai, predit]}')",
        "",
        "fig, ax = plt.subplots(figsize=(5.5, 5))",
        "ax.imshow(cm, cmap='Blues')",
        "for i in range(10):",
        "    for j in range(10):",
        "        if cm[i, j] > 0:",
        "            ax.text(j, i, cm[i, j], ha='center', va='center', color='white' if cm[i, j] > 20 else 'black', fontsize=8)",
        "ax.set_xticks(range(10))",
        "ax.set_yticks(range(10))",
        "ax.set_xlabel('chiffre prédit')",
        "ax.set_ylabel('chiffre réel')",
        "ax.set_title('Matrice de confusion, 450 images de test')",
        "plt.tight_layout()",
      ),
      caption: "Neuf erreurs sur 450, réparties presque partout : aucune case hors diagonale ne dépasse 2. Le chiffre le moins bien reconnu est le 9 (rappel de 93,3 %, 3 erreurs sur 45), et deux confusions se répètent deux fois, 4 pris pour un 8 et 9 pris pour un 8. Avec si peu d'erreurs, ces tendances sont à lire avec prudence : une image de plus ou de moins les change.",
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "erreurs = np.where(pred != y_test)[0]",
        "confiance = proba.max(axis=1)",
        "print('confiance moyenne quand le modèle a raison :', round(float(confiance[pred == y_test].mean()), 3))",
        "print('confiance moyenne quand il se trompe       :', round(float(confiance[erreurs].mean()), 3))",
        "",
        "fig, axes = plt.subplots(1, len(erreurs), figsize=(1.6 * len(erreurs), 2.2))",
        "for ax, k in zip(axes, erreurs):",
        "    ax.imshow(images[i_test][k], cmap='gray_r')",
        "    ax.set_title(f'{y_test[k]} -> {pred[k]}\\n{confiance[k]:.0%}', fontsize=9)",
        "    ax.axis('off')",
        "fig.suptitle('Images mal classées : vrai -> prédit, et confiance du réseau', fontsize=10)",
        "plt.tight_layout()",
      ),
      caption: "Les 9 images mal classées, avec le chiffre réel, la réponse du réseau et la probabilité qu'il lui accorde. En moyenne, le réseau donne 97,4 % de probabilité à sa réponse quand il a raison et 64,1 % quand il se trompe : il hésite plutôt bien. Mais 2 des 9 erreurs ont une confiance d'au moins 90 %, dont une à 99 % : une probabilité élevée n'est pas une garantie. Sur des images de 8 sur 8 pixels, certaines sont aussi difficiles à lire pour un humain.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "À partir de `pred`, `y_test` et `proba` (déjà calculés pour le réseau entraîné), rangez dans `nb_erreurs_sures` le nombre d'images **mal classées** dont la confiance (probabilité maximale de la ligne de `proba`) est **au moins 0,9**, et dans `chiffre_difficile` le chiffre dont le rappel (part de ses images bien classées) est le plus bas.",
      setup: MODELE,
      starter: lines("nb_erreurs_sures = 0", "chiffre_difficile = 0"),
      solution: lines(
        "confiance = proba.max(axis=1)",
        "nb_erreurs_sures = int(((pred != y_test) & (confiance >= 0.9)).sum())",
        "rappel = [(pred[y_test == c] == c).mean() for c in range(10)]",
        "chiffre_difficile = int(np.argmin(rappel))",
        "print(nb_erreurs_sures, chiffre_difficile, round(min(rappel), 3))",
      ),
      test: lines(
        "_conf = proba.max(axis=1)",
        "_attendu = int(((pred != y_test) & (_conf >= 0.9)).sum())",
        "assert nb_erreurs_sures == _attendu, \"nb_erreurs_sures : les erreurs (pred != y_test) dont la confiance proba.max(axis=1) vaut au moins 0,9\"",
        "_rappel = [(pred[y_test == c] == c).mean() for c in range(10)]",
        "assert chiffre_difficile == int(np.argmin(_rappel)), \"chiffre_difficile : le chiffre dont la part d'images bien classées est la plus basse\"",
      ),
      hint: "Combinez deux conditions avec & : (pred != y_test) & (confiance >= 0.9). Le rappel du chiffre c est (pred[y_test == c] == c).mean().",
    },
    {
      kind: "text",
      md: lines(
        "### Étape 7 : et pour de vraies images médicales",
        "",
        "Remplacer les chiffres par des radiographies, des coupes de scanner ou des lames de microscope ne change presque rien au **code** : on garde la même chaîne (référence, réseau, comparaison, analyse d'erreurs). Tout le reste change, et c'est ce qui fait que ce n'est pas le même métier :",
        "",
        "- **Les données sont des données de santé.** Le règlement européen sur la protection des données range les données de santé parmi les catégories particulières, soumises à des conditions strictes : base légale, **consentement** ou cadre légal précis, minimisation, pseudonymisation ou anonymisation sérieuse, accès restreint, hébergement conforme. Une image médicale peut identifier une personne (informations dans l'en-tête du fichier, parfois dans l'image elle-même). On ne copie pas de telles images sur un ordinateur personnel ou un service en ligne sans cadre ;",
        "- **Les images sont en grand format et en format dédié** (le standard DICOM, qui embarque aussi des métadonnées), souvent en plusieurs coupes ou plusieurs phases : le prétraitement est un chantier à lui seul ;",
        "- **Les classes sont rarement équilibrées.** Une maladie rare représente quelques pour cent des cas, la réussite brute devient trompeuse (la référence naïve de l'étape 1 en est le cas extrême), et il faut raisonner en sensibilité, spécificité et coût des deux sortes d'erreur ;",
        "- **Les biais coûtent cher.** Un modèle appris dans un hôpital, sur un type d'appareil, avec une population donnée, peut se dégrader ailleurs, ou selon l'âge, le sexe, l'origine : cela se mesure sur des données de provenance différente de celles de l'apprentissage ;",
        "- **La validation est clinique, pas seulement statistique.** Une évaluation sur un jeu de test tiré des mêmes données ne dit pas si l'outil aide réellement un soignant. Un logiciel destiné au diagnostic ou à la décision thérapeutique relève de la réglementation des **dispositifs médicaux** : exigences de qualité, de traçabilité, d'évaluation clinique et de suivi après mise en service ;",
        "- **L'explication et la responsabilité comptent.** On doit pouvoir dire sur quoi le modèle s'appuie, quand il ne sait pas répondre, et qui répond d'une erreur.",
        "",
        "Pour apprendre sans risque, on s'exerce sur des jeux publics prévus pour cela, avec leur licence, et on garde la mention « exercice, pas un outil médical ». Pour des images réelles, le point de départ est de parler aux personnes responsables des données et de la réglementation avant d'écrire une ligne de code.",
        "",
        "Le réseau de ce projet est minuscule. Avec de vraies images, on utilise une bibliothèque qui calcule les gradients à notre place et tourne sur carte graphique. Ce code Keras fait le même travail que notre réseau, en plus grand ; il ne tourne pas dans le moteur du site (TensorFlow n'y est pas) ; sur votre machine, après avoir installé TensorFlow :",
        "",
        "```python",
        "import tensorflow as tf",
        "",
        "modele = tf.keras.Sequential([",
        "    tf.keras.layers.Input(shape=(8, 8, 1)),",
        "    tf.keras.layers.Conv2D(6, 3, activation='relu'),     # 6 filtres 3x3 + ReLU",
        "    tf.keras.layers.MaxPooling2D(2),                      # max pooling 2x2",
        "    tf.keras.layers.Flatten(),",
        "    tf.keras.layers.Dense(10, activation='softmax'),      # 10 chiffres",
        "])",
        "modele.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])",
        "modele.summary()                                          # compte les paramètres",
        "modele.fit(images_train[..., None], y_train, epochs=20, batch_size=32,",
        "           validation_split=0.1)",
        "print(modele.evaluate(images_test[..., None], y_test))",
        "```",
        "",
        "Ce modèle a la même architecture que le nôtre, donc le même nombre de paramètres (610) ; la différence est que Keras écrit pour nous la rétropropagation et choisit l'implémentation rapide. Les résultats exacts ne seront pas identiques aux nôtres : l'initialisation et l'ordre des lots diffèrent.",
      ),
    },
    {
      kind: "note",
      tone: "warning",
      md: "Rappel : tout ce projet est un exercice. Un modèle qui reconnaît des chiffres de 8 sur 8 pixels ne dit rien de la capacité à lire des images médicales, et aucun résultat de cette page ne doit servir à une décision de santé.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : ajouter une deuxième couche de convolution, tester 12 filtres, décaler les images d'un pixel pour vérifier la robustesse (le cours « Vision par ordinateur » le fait avec un perceptron), ou répéter le découpage avec plusieurs graines pour obtenir une vraie dispersion plutôt qu'une seule mesure.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi mesurer une référence naïve et une régression logistique avant d'écrire le réseau convolutif ?",
      options: [
        "Parce que scikit-learn l'exige",
        "Pour savoir ce que le réseau doit battre : sans référence, une réussite de 98 % ne dit pas si c'est beaucoup",
        "Parce que le réseau convolutif ne marche qu'après une régression logistique",
        "Pour que le réseau apprenne plus vite",
      ],
      correct: 1,
      explanation: "La référence naïve réussit 10,2 % et la régression logistique 96,9 % : sans elles, on ne saurait pas que le réseau gagne seulement un ou deux points sur ce jeu.",
    },
    {
      question: "À quoi sert de comparer le gradient écrit à la main à un gradient numérique ?",
      options: [
        "À entraîner le réseau plus vite",
        "À détecter une erreur dans la rétropropagation, qui peut apprendre un peu même avec un gradient faux",
        "À remplacer la rétropropagation en production",
        "À choisir le nombre de filtres",
      ],
      correct: 1,
      explanation: "Un gradient faux donne souvent un réseau qui apprend quand même, mal. Le gradient numérique, lent mais simple, est un contrôle indépendant : on le fait sur un petit échantillon de paramètres, puis on l'abandonne.",
    },
    {
      question: "Dans un max pooling, où va le gradient pendant la rétropropagation ?",
      options: [
        "Réparti également sur les quatre cases du bloc",
        "Uniquement vers la case qui contenait le maximum dans chaque bloc",
        "Vers la case la plus petite du bloc",
        "Il disparaît toujours",
      ],
      correct: 1,
      explanation: "Seule la case du maximum a influencé la sortie : elle reçoit tout le gradient, les autres reçoivent 0. En cas d'égalité, notre code le partage.",
    },
    {
      question: "Le réseau réussit 98,0 % sur 450 images, la régression logistique 96,9 %. Que peut-on conclure ?",
      options: [
        "Que le réseau convolutif est meilleur de façon certaine",
        "Que la différence (1,1 point) est du même ordre que l'incertitude d'une mesure sur 450 images : on ne peut pas trancher avec un seul découpage",
        "Que la régression logistique est défectueuse",
        "Que le jeu de test est trop grand",
      ],
      correct: 1,
      explanation: "L'écart-type d'une réussite proche de 0,975 sur 450 images est d'environ 0,7 point, et d'autres graines donnent 96,9 % ou 97,6 %. Il faut plusieurs découpages ou plus d'images pour conclure.",
    },
    {
      question: "Le réseau donne 99 % de probabilité à une réponse fausse. Que montre ce cas ?",
      options: [
        "Qu'une probabilité élevée n'est pas une garantie : un réseau peut être très sûr de lui et se tromper",
        "Que le softmax est mal codé",
        "Que l'image est forcément corrompue",
        "Que le modèle surapprend toujours dans ce cas",
      ],
      correct: 0,
      explanation: "Les probabilités du softmax mesurent la confiance du réseau, pas sa justesse. Quand les erreurs coûtent cher, on étudie la fiabilité de ces probabilités et on prévoit un mécanisme pour passer la main à un humain.",
    },
    {
      question: "Qu'est-ce qui change le plus quand on passe de ces chiffres à de vraies images médicales ?",
      options: [
        "Le nombre de lignes du code NumPy",
        "Le cadre : données de santé et consentement, classes déséquilibrées, biais, validation clinique et réglementation des dispositifs médicaux",
        "Le fait que les convolutions deviennent inutiles",
        "Le fait qu'il n'y a plus besoin de jeu de test",
      ],
      correct: 1,
      explanation: "Le code d'un classifieur d'images se ressemble d'un domaine à l'autre. Les obligations légales, la qualité des données, l'évaluation sur d'autres sites et la responsabilité font la vraie différence.",
    },
  ],
};
