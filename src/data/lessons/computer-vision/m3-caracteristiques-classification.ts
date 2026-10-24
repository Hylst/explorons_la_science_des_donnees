import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DECOUPAGE } from "./data";

/** Le découpage commun, plus les positions des images d'apprentissage et de test (pour découper d'autres tableaux de la même façon) */
const AVEC_POSITIONS = lines(
  DECOUPAGE,
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.neighbors import KNeighborsClassifier",
  "from sklearn.metrics import confusion_matrix",
  "",
  "i_train, i_test = train_test_split(np.arange(len(y)), test_size=0.25, random_state=0, stratify=y)",
);

export const moduleCaracteristiquesClassification: LessonModule = {
  id: "caracteristiques-classification",
  title: "Des pixels aux caractéristiques",
  duration: "2 h 30",
  summary: "Classer les chiffres avec scikit-learn : régression logistique et plus proches voisins sur les 64 pixels, matrice de confusion, images mal classées, caractéristiques fabriquées à la main (profils d'encre, orientations des contours) et projection ACP en deux dimensions.",
  objectives: [
    "Aplatir une image en un vecteur de 64 caractéristiques et entraîner un classifieur, en mesurant la réussite sur des images de test",
    "Lire une matrice de confusion, trouver la paire de chiffres la plus confondue et regarder les images mal classées",
    "Fabriquer des caractéristiques à la main (profils d'encre, histogramme d'orientations de gradients) et les comparer aux 64 pixels",
    "Projeter les images en deux dimensions avec l'ACP et lire ce que la projection montre et cache",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une image aplatie est une ligne de 64 nombres

Un classifieur de scikit-learn attend un tableau à deux dimensions : une **ligne par exemple**, une **colonne par caractéristique**. Pour une image de 8 sur 8, le plus direct est de l'**aplatir** : mettre ses 8 lignes bout à bout, ce qui donne 64 nombres, un par pixel. Le jeu complet devient un tableau \`X\` de forme (1 797, 64), et chaque pixel est une **caractéristique** (*feature*).

Cette écriture perd une chose : la position. Le modèle ne sait pas que le pixel 9 est juste sous le pixel 1. Pour lui, les 64 colonnes sont 64 mesures sans lien de voisinage. Il apprend quand même, parce que les pixels d'un même chiffre se ressemblent d'une image à l'autre. Les images sont divisées en **75 % pour apprendre** (1 347 images) et **25 % pour évaluer** (450 images), avec les mêmes proportions de chaque chiffre des deux côtés. Toute réussite citée dans ce module est mesurée sur ces 450 images de test.

La **régression logistique** apprend, pour chacun des dix chiffres, une pondération des 64 pixels, et choisit le chiffre dont le score est le plus élevé. Après l'entraînement, on ne regarde pas seulement la réussite globale : la **matrice de confusion** compte, pour chaque vrai chiffre (en ligne), ce que le modèle a prédit (en colonne).`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.metrics import confusion_matrix",
        "",
        "print('forme de X :', X.shape, ' apprentissage :', X_train.shape[0], ' test :', X_test.shape[0])",
        "modele = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
        "print('réussite sur les images d\\'apprentissage :', round(modele.score(X_train, y_train), 3))",
        "print('réussite sur les images de test          :', round(modele.score(X_test, y_test), 3))",
        "",
        "predit = modele.predict(X_test)",
        "matrice = confusion_matrix(y_test, predit)      # ligne = vrai chiffre, colonne = chiffre prédit",
        "erreurs = matrice.copy()",
        "np.fill_diagonal(erreurs, 0)                    # on garde seulement les erreurs",
        "vrai, faux = np.unravel_index(erreurs.argmax(), erreurs.shape)",
        "print('erreurs :', erreurs.sum(), ' paire la plus confondue : un', vrai, 'pris pour un', faux, '(', erreurs[vrai, faux], 'fois )')",
        "",
        "mal = np.where(predit != y_test)[0]             # positions des images mal classées",
        "fig, axes = plt.subplots(2, 7, figsize=(8, 3))",
        "for ax, k in zip(axes.ravel(), mal):",
        "    ax.imshow(X_test[k].reshape(8, 8), cmap='gray_r')",
        "    ax.set_title(f'vrai {y_test[k]}, lu {predit[k]}', fontsize=8)",
        "for ax in axes.ravel():",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Réussite de 0,969 sur les 450 images de test (0,983 sur celles d'apprentissage, légèrement plus : le modèle les a vues). Il y a 14 erreurs. La paire la plus confondue est le 8 lu comme un 1, 3 fois ; viennent ensuite le 4 lu comme un 8 et le 6 lu comme un 1, 2 fois chacun. Regarder les 14 images aide à juger : certaines sont tracées de façon ambiguë, même pour un œil humain.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les variables `X_train`, `X_test`, `y_train`, `y_test` sont prêtes. Entraînez une régression logistique (`LogisticRegression(max_iter=2000)`) sur l'apprentissage, rangez ses prédictions pour le test dans `predit`, puis calculez la matrice de confusion dans `matrice` (10 sur 10, `confusion_matrix(y_test, predit)`). Rangez dans `paire` le couple `(vrai chiffre, chiffre prédit)` de l'**erreur la plus fréquente** (hors diagonale).",
      setup: AVEC_POSITIONS,
      starter: lines(
        "predit = y_test",
        "matrice = None",
        "paire = (0, 0)",
      ),
      solution: lines(
        "modele = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
        "predit = modele.predict(X_test)",
        "matrice = confusion_matrix(y_test, predit)",
        "erreurs = matrice.copy()",
        "np.fill_diagonal(erreurs, 0)",
        "vrai, faux = np.unravel_index(erreurs.argmax(), erreurs.shape)",
        "paire = (int(vrai), int(faux))",
        "print(paire, int(erreurs[vrai, faux]))",
      ),
      test: lines(
        "_m = LogisticRegression(max_iter=2000).fit(X_train, y_train)",
        "_p = _m.predict(X_test)",
        "_c = confusion_matrix(y_test, _p)",
        "assert np.array_equal(predit, _p), \"predit doit contenir les prédictions du modèle sur X_test (et non les vrais chiffres)\"",
        "assert np.shape(matrice) == (10, 10), \"matrice doit être la matrice de confusion 10 sur 10 : confusion_matrix(y_test, predit)\"",
        "assert np.array_equal(matrice, _c), \"matrice[i, j] compte les images de vrai chiffre i prédites j : confusion_matrix(y_test, predit)\"",
        "_e = _c.copy()",
        "np.fill_diagonal(_e, 0)",
        "_i, _j = np.unravel_index(_e.argmax(), _e.shape)",
        "assert tuple(paire) == (int(_i), int(_j)), f\"l'erreur la plus fréquente est un {int(_i)} pris pour un {int(_j)} : mettez la diagonale à zéro avant de chercher le maximum\"",
      ),
      hint: "La diagonale compte les bonnes réponses : np.fill_diagonal(erreurs, 0) l'efface. Ensuite, np.unravel_index(erreurs.argmax(), erreurs.shape) donne (ligne, colonne), donc (vrai, prédit).",
    },
    {
      kind: "text",
      md: `### Les k plus proches voisins

Une autre idée, sans aucune équation à ajuster : pour classer une image, on cherche dans l'apprentissage les **k images les plus proches** (au sens de la distance euclidienne entre les deux vecteurs de 64 pixels) et on retient le chiffre le plus fréquent parmi elles. L'« apprentissage » consiste simplement à garder les exemples. Avec \`k = 1\`, on copie le chiffre de l'image la plus ressemblante ; avec un \`k\` plus grand, on vote et l'on lisse les cas isolés.

Attention à une tentation : essayer plusieurs valeurs de \`k\` sur les images de test et garder la meilleure revient à **choisir le réglage avec le test**, qui n'est plus alors un vrai test. Ici, nous comparons pour comprendre, et les écarts sont de quelques images sur 450, trop petits pour désigner un vainqueur. Pour choisir proprement, on utilise une partie de l'apprentissage comme validation, ou la validation croisée.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DECOUPAGE,
      code: lines(
        "from sklearn.neighbors import KNeighborsClassifier",
        "",
        "for k in [1, 3, 5, 7]:",
        "    voisins = KNeighborsClassifier(n_neighbors=k).fit(X_train, y_train)   # garde simplement les exemples",
        "    reussite = voisins.score(X_test, y_test)",
        "    print('k =', k, ' réussite :', round(reussite, 3), ' images mal classées :', round((1 - reussite) * len(y_test)))",
      ),
      caption: "Sur les mêmes 450 images de test, les plus proches voisins font mieux que la régression logistique (0,969) : 0,982 avec k = 1, 0,987 avec k = 3, 0,980 avec k = 5, 0,973 avec k = 7. Entre k = 1 et k = 3, la différence est de 2 images seulement. Les pixels de deux chiffres identiques se superposent bien sur ces images centrées et de taille fixe, ce qui favorise probablement la comparaison directe.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un classifieur des plus proches voisins avec **k = 9** sur `X_train`, rangez-le dans `voisins` et rangez dans `reussite` sa réussite sur `X_test` (une proportion entre 0 et 1).",
      setup: AVEC_POSITIONS,
      starter: lines(
        "voisins = None",
        "reussite = 0.0",
      ),
      solution: lines(
        "voisins = KNeighborsClassifier(n_neighbors=9).fit(X_train, y_train)",
        "reussite = voisins.score(X_test, y_test)",
        "print(round(reussite, 3))",
      ),
      test: lines(
        "assert isinstance(voisins, KNeighborsClassifier), \"voisins doit être un KNeighborsClassifier entraîné avec .fit\"",
        "assert voisins.n_neighbors == 9, f\"il faut k = 9 voisins, pas {voisins.n_neighbors}\"",
        "assert abs(reussite - voisins.score(X_test, y_test)) < 1e-9, \"reussite doit être voisins.score(X_test, y_test), mesurée sur les images de test\"",
        "assert reussite > 0.9, \"la réussite attendue est bien supérieure à 0,9 : le modèle est-il entraîné sur X_train et y_train ?\"",
      ),
      hint: "KNeighborsClassifier(n_neighbors=9).fit(X_train, y_train), puis .score(X_test, y_test).",
    },
    {
      kind: "text",
      md: `### Fabriquer des caractéristiques à la main

Les 64 pixels bruts ne sont pas la seule description possible d'une image. Avant l'apprentissage profond, on **fabriquait** des caractéristiques en réfléchissant à ce qui distingue les objets. Deux exemples, très simples :

- Les **profils d'encre** : la somme des pixels de chaque ligne (8 nombres) et de chaque colonne (8 nombres), soit 16 caractéristiques. Un 1 concentre son encre sur quelques colonnes centrales, un 7 en a beaucoup dans ses premières lignes.
- Un **histogramme d'orientations de gradients**, version très simplifiée de la méthode HOG (*histogram of oriented gradients*). On calcule le gradient de Sobel du module précédent, puis on classe chaque pixel de contour selon la **direction** de son gradient (8 secteurs de 0 à 180 degrés), en pondérant par la force du contour. On le fait séparément dans 4 quartiers de l'image, ce qui donne 4 fois 8, soit 32 caractéristiques. L'idée est qu'un 0 est fait de contours qui tournent, un 1 de contours presque verticaux.

Comparons-les aux 64 pixels avec le même modèle (régression logistique) et le même découpage. Pour appliquer les mêmes images d'apprentissage et de test, on découpe les nouveaux tableaux avec les **positions** de l'ancien découpage.`,
    },
    {
      kind: "code",
      language: "python",
      setup: AVEC_POSITIONS,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from scipy import signal",
        "",
        "def profils_encre(imgs):",
        "    par_ligne = imgs.sum(axis=2)                  # (n, 8) : encre de chaque ligne",
        "    par_colonne = imgs.sum(axis=1)                # (n, 8) : encre de chaque colonne",
        "    return np.hstack([par_ligne, par_colonne])    # (n, 16)",
        "",
        "sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])",
        "sobel_y = sobel_x.T",
        "",
        "def orientations(imgs, secteurs=8):",
        "    resultat = []",
        "    for image in imgs:",
        "        gx = signal.correlate2d(image, sobel_x, mode='valid')     # 6 x 6",
        "        gy = signal.correlate2d(image, sobel_y, mode='valid')",
        "        force = np.hypot(gx, gy)",
        "        angle = np.arctan2(gy, gx) % np.pi                        # direction entre 0 et 180 degrés",
        "        secteur = np.minimum((angle / np.pi * secteurs).astype(int), secteurs - 1)",
        "        histogrammes = []",
        "        for a in range(2):                                        # 2 x 2 quartiers de 3 x 3",
        "            for b in range(2):",
        "                f = force[3 * a:3 * a + 3, 3 * b:3 * b + 3].ravel()",
        "                s = secteur[3 * a:3 * a + 3, 3 * b:3 * b + 3].ravel()",
        "                histogrammes.append(np.bincount(s, weights=f, minlength=secteurs))",
        "        resultat.append(np.concatenate(histogrammes))",
        "    return np.array(resultat)                                     # (n, 32)",
        "",
        "ensembles = {",
        "    'pixels bruts': X,",
        "    'profils d\\'encre': profils_encre(images),",
        "    'orientations': orientations(images),",
        "}",
        "ensembles['orientations + profils'] = np.hstack([ensembles['orientations'], ensembles['profils d\\'encre']])",
        "",
        "for nom, F in ensembles.items():",
        "    modele = LogisticRegression(max_iter=2000).fit(F[i_train], y_train)",
        "    print(f'{nom:24s} {F.shape[1]:3d} caractéristiques, réussite :', round(modele.score(F[i_test], y_test), 3))",
        "",
        "# profils moyens de trois chiffres",
        "fig, axes = plt.subplots(1, 2, figsize=(7, 2.6))",
        "for chiffre in [0, 1, 7]:",
        "    moyenne = images[y == chiffre].mean(axis=0)",
        "    axes[0].plot(moyenne.sum(axis=1), marker='o', label=f'chiffre {chiffre}')",
        "    axes[1].plot(moyenne.sum(axis=0), marker='o', label=f'chiffre {chiffre}')",
        "axes[0].set_title('encre par ligne (de haut en bas)')",
        "axes[1].set_title('encre par colonne (de gauche à droite)')",
        "axes[0].legend(fontsize=7)",
        "plt.tight_layout()",
      ),
      caption: "Avec la régression logistique, les 64 pixels réussissent 0,969, les 16 profils d'encre 0,911, les 32 orientations 0,904, et les deux ensembles réunis (48 caractéristiques) 0,964. Les caractéristiques fabriquées résument l'image en moins de nombres au prix de quelques points, mais ne battent pas les pixels sur ces images minuscules. Les courbes montrent pourquoi les profils informent : la colonne centrale du 1 porte beaucoup d'encre alors que le 0 répartit la sienne sur deux flancs.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Il ne faut pas en conclure que fabriquer des caractéristiques est inutile. Ici, l'image fait 8 sur 8 : les 64 pixels sont déjà un résumé compact. Sur une photo de plusieurs millions de pixels, les pixels bruts sont beaucoup trop nombreux et peu informatifs un par un, et des descripteurs comme HOG ont longtemps été indispensables. Les réseaux convolutifs du module suivant font un autre choix : ils **apprennent** les caractéristiques au lieu de les fabriquer.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `profils_encre(imgs)`, qui renvoie pour chaque image les 8 sommes par ligne puis les 8 sommes par colonne (un tableau de forme `(n, 16)`). Puis entraînez une régression logistique (`max_iter=2000`) sur les profils des images d'apprentissage (`images[i_train]`) et rangez dans `reussite_profils` sa réussite sur les profils des images de test (`images[i_test]`).",
      setup: AVEC_POSITIONS,
      starter: lines(
        "def profils_encre(imgs):",
        "    return imgs.reshape(len(imgs), -1)[:, :16]",
        "",
        "reussite_profils = 0.0",
      ),
      solution: lines(
        "def profils_encre(imgs):",
        "    return np.hstack([imgs.sum(axis=2), imgs.sum(axis=1)])",
        "",
        "P = profils_encre(images)",
        "modele = LogisticRegression(max_iter=2000).fit(P[i_train], y_train)",
        "reussite_profils = modele.score(P[i_test], y_test)",
        "print(P.shape, round(reussite_profils, 3))",
      ),
      test: lines(
        "_a = images[:5]",
        "_p = profils_encre(_a)",
        "assert np.shape(_p) == (5, 16), f\"pour 5 images, la forme attendue est (5, 16), pas {np.shape(_p)}\"",
        "assert np.allclose(_p[:, :8], _a.sum(axis=2)), \"les 8 premières colonnes sont les sommes par ligne : imgs.sum(axis=2)\"",
        "assert np.allclose(_p[:, 8:], _a.sum(axis=1)), \"les 8 dernières colonnes sont les sommes par colonne : imgs.sum(axis=1)\"",
        "_P = np.hstack([images.sum(axis=2), images.sum(axis=1)])",
        "_r = LogisticRegression(max_iter=2000).fit(_P[i_train], y_train).score(_P[i_test], y_test)",
        "assert abs(reussite_profils - _r) < 1e-9, f\"la réussite attendue avec ces profils est {round(_r, 3)} : entraînez sur images[i_train] et mesurez sur images[i_test]\"",
      ),
      hint: "imgs.sum(axis=2) additionne les colonnes de chaque ligne ; imgs.sum(axis=1) additionne les lignes de chaque colonne. np.hstack les met côte à côte.",
    },
    {
      kind: "text",
      md: `### Voir les 64 dimensions en deux : l'ACP

On ne peut pas dessiner un nuage dans un espace à 64 dimensions. L'**analyse en composantes principales** (ACP) cherche les directions de cet espace le long desquelles les images varient le plus, et projette chaque image sur les deux premières. On obtient un nuage de points plan, que l'on colore selon le vrai chiffre. L'ACP ne connaît pas les chiffres : elle ne regarde que les pixels. Si les couleurs se regroupent, c'est que les chiffres se distinguent déjà par leurs pixels.

Pour rester propre, on **ajuste l'ACP sur l'apprentissage seulement**, puis on projette les images de test avec la transformation obtenue.`,
    },
    {
      kind: "code",
      language: "python",
      setup: AVEC_POSITIONS,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.decomposition import PCA",
        "",
        "acp = PCA(n_components=2).fit(X_train)            # ajustée sur l'apprentissage seulement",
        "plan = acp.transform(X_test)                      # coordonnées des images de test",
        "part = acp.explained_variance_ratio_.sum()",
        "print('part de la variance conservée par 2 axes :', round(part, 3))",
        "",
        "# réussite d'une régression logistique sur les 2, 10 puis 20 premiers axes",
        "for n in [2, 10, 20]:",
        "    p = PCA(n_components=n).fit(X_train)",
        "    modele = LogisticRegression(max_iter=2000).fit(p.transform(X_train), y_train)",
        "    print(n, 'axes : variance', round(p.explained_variance_ratio_.sum(), 3), ' réussite', round(modele.score(p.transform(X_test), y_test), 3))",
        "",
        "fig, ax = plt.subplots(figsize=(5.5, 4))",
        "points = ax.scatter(plan[:, 0], plan[:, 1], c=y_test, cmap='tab10', s=14)",
        "for chiffre in range(10):",
        "    centre = plan[y_test == chiffre].mean(axis=0)",
        "    ax.text(centre[0], centre[1], str(chiffre), fontsize=13, fontweight='bold', ha='center', va='center')",
        "ax.set_xlabel('axe 1')",
        "ax.set_ylabel('axe 2')",
        "fig.colorbar(points, label='chiffre')",
        "plt.tight_layout()",
      ),
      caption: "Les deux premiers axes ne conservent que 28,5 % de la variance des pixels : le nuage plan est une vue très partielle. Certains chiffres se regroupent (le 0 en bas, le 4 à droite), d'autres se recouvrent au centre. Avec ces 2 axes seuls, une régression logistique réussit 0,589 ; avec 10 axes (73,9 % de la variance) 0,940 ; avec 20 axes (89,5 %) 0,956, contre 0,969 pour les 64 pixels.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Deux limites à garder en tête. D'abord, **tout ce qui est mesuré ici l'est sur les images de test, et sur un seul découpage** : avec 450 images, une image de plus ou de moins déplace la réussite de 0,2 point, et un autre découpage donnerait des nombres un peu différents. Ensuite, les 1 797 chiffres viennent de **13 scripteurs**, présents des deux côtés du découpage : le modèle a croisé leurs habitudes d'écriture pendant l'apprentissage. Devant l'écriture de personnes inconnues, la réussite serait vraisemblablement plus basse, et nous ne l'avons pas mesurée.",
    },
  ],
  quiz: [
    {
      question: "Une image de 8 sur 8 est aplatie pour un classifieur de scikit-learn. Que devient-elle ?",
      options: [
        "Une matrice de 8 lignes et 8 colonnes, conservée telle quelle",
        "Une ligne de 64 caractéristiques, un nombre par pixel",
        "Une seule valeur : la moyenne de ses pixels",
        "Un vecteur de 10 scores, un par chiffre",
      ],
      correct: 1,
      explanation: "Les 8 lignes sont mises bout à bout : 64 colonnes pour une image. Le tableau X d'un jeu de 1 797 images a donc la forme (1 797, 64). Les 10 scores sont la sortie du modèle, pas son entrée.",
    },
    {
      question: "Dans la matrice de confusion de scikit-learn, que contient la case à la ligne 8 et à la colonne 1 ?",
      options: [
        "Le nombre d'images de vrai chiffre 1 que le modèle a prises pour un 8",
        "Le nombre d'images de vrai chiffre 8 que le modèle a prises pour un 1",
        "La réussite du modèle sur les 8 et les 1",
        "La distance entre le chiffre moyen 8 et le chiffre moyen 1",
      ],
      correct: 1,
      explanation: "Les lignes sont les vrais chiffres et les colonnes les chiffres prédits. La diagonale contient les bonnes réponses ; hors diagonale, chaque case compte une confusion dans un sens précis.",
    },
    {
      question: "Pourquoi mesure-t-on la réussite uniquement sur les images de test ?",
      options: [
        "Parce que les images d'apprentissage sont perdues après l'entraînement",
        "Parce qu'un modèle a déjà vu les images d'apprentissage : sa réussite y est trop flatteuse pour juger son comportement sur des images nouvelles",
        "Parce que scikit-learn refuse de calculer un score sur l'apprentissage",
        "Parce que le test contient les images les plus faciles",
      ],
      correct: 1,
      explanation: "Le score sur l'apprentissage mesure une mémoire autant qu'une compétence. Dans l'exemple, il est de 0,983 contre 0,969 sur le test. L'écart reste modeste ici, mais il peut devenir énorme pour un modèle plus souple.",
    },
    {
      question: "Que fait l'ACP quand on la projette sur deux axes et que l'on colore les points par chiffre ?",
      options: [
        "Elle apprend à classer les chiffres puis dessine ses prédictions",
        "Elle cherche, sans connaître les chiffres, les deux directions de plus grande variation des pixels, et la couleur sert seulement à lire le résultat",
        "Elle supprime les images mal classées",
        "Elle garantit que les chiffres de même couleur seront séparés des autres",
      ],
      correct: 1,
      explanation: "L'ACP est non supervisée : elle ne voit que les pixels. Les deux premiers axes ne gardent ici que 28,5 % de la variance, donc des chiffres qui se recouvrent sur le dessin peuvent être séparables dans les 64 dimensions.",
    },
    {
      question: "Sur les chiffres de 8 sur 8, la régression logistique réussit 0,969 avec les 64 pixels et 0,911 avec les 16 profils d'encre. Que peut-on conclure ?",
      options: [
        "Qu'il faut toujours préférer les pixels bruts à des caractéristiques fabriquées",
        "Que les profils d'encre gardent une grande partie de l'information avec quatre fois moins de nombres, mais en perdent aussi une partie, sur ces images minuscules et ce découpage",
        "Que les profils d'encre sont inutiles",
        "Que le modèle est mauvais",
      ],
      correct: 1,
      explanation: "Les profils résument l'image en 16 nombres et conservent la plupart du signal, au prix de quelques points. La conclusion vaut pour ces images et ce découpage ; sur de grandes images, le résumé devient bien plus utile.",
    },
  ],
};
