import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CHIFFRES } from "./data";

export const moduleImagesTableaux: LessonModule = {
  id: "images-tableaux",
  title: "Une image, c'est un tableau de nombres",
  duration: "2 h",
  summary: "Ouvrir une image comme un tableau NumPy : pixels, niveaux de gris, canaux de couleur, coordonnées. La découper, la retourner, la seuiller, puis faire la moyenne d'images pour classer de premiers chiffres manuscrits.",
  objectives: [
    "Lire la forme d'une image (hauteur, largeur, canaux) et le type de ses valeurs",
    "Repérer un pixel par sa ligne et sa colonne, découper et retourner une image par tranches",
    "Passer de la couleur aux niveaux de gris et seuiller une image",
    "Calculer une image moyenne par classe et s'en servir pour classer, avec une évaluation honnête",
  ],
  sections: [
    {
      kind: "text",
      md: `### Ce que voit un ordinateur

La **vision par ordinateur** cherche à tirer une information d'une image : quel chiffre est écrit, où est la route, cette radiographie ressemble-t-elle à d'autres déjà diagnostiquées. Pour un programme, une image n'est ni une forme ni une couleur : c'est un **tableau de nombres**, une case par point de l'image. Ce point s'appelle un **pixel** (de l'anglais *picture element*).

Tout le cours travaille sur un jeu d'images réel fourni avec scikit-learn, rien n'est téléchargé : **1 797 chiffres manuscrits** de 0 à 9, scannés pour un travail de recherche à la fin des années 1990 (E. Alpaydin). Chaque image a été réduite à **8 pixels sur 8** : la page d'origine, en 32 points sur 32, a été découpée en blocs de 4 sur 4, et chaque pixel compte les points noirs de son bloc. D'où des valeurs entières de **0 (blanc) à 16 (noir)**. Les images sont minuscules, ce qui permet de tout calculer en quelques secondes dans votre navigateur et de voir chaque nombre.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "from sklearn.datasets import load_digits",
        "",
        "chiffres = load_digits()",
        "print('forme :', chiffres.images.shape)",
        "print('type :', chiffres.images.dtype, ' de', chiffres.images.min(), 'à', chiffres.images.max())",
        "print('première image, un', chiffres.target[0], ':')",
        "print(chiffres.images[0].astype(int))",
        "",
        "fig, axes = plt.subplots(1, 10, figsize=(10, 1.6))",
        "for k, ax in enumerate(axes):",
        "    ax.imshow(chiffres.images[k], cmap='gray_r')   # gray_r : 0 en blanc, 16 en noir",
        "    ax.set_title(str(chiffres.target[k]))",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Le jeu est un tableau de forme (1797, 8, 8) : 1 797 images de 8 lignes et 8 colonnes. Dans le tableau imprimé, on devine le zéro : des nombres élevés sur un anneau, des 0 au centre et sur les bords. imshow transforme chaque nombre en gris ; avec la palette gray_r, 0 est blanc et 16 noir.",
    },
    {
      kind: "text",
      md: `### Lignes, colonnes et tranches

Un pixel se repère par sa **ligne** puis sa **colonne**, en partant de **0 en haut à gauche** : \`image[2, 5]\` est sur la troisième ligne, sixième colonne. Attention, c'est l'inverse de l'habitude des graphiques (x d'abord, y vers le haut) : en image, la première coordonnée descend.

Les tranches de NumPy suffisent pour la plupart des manipulations, sans boucle :

- \`image[2:6, 1:5]\` découpe un rectangle (lignes 2 à 5, colonnes 1 à 4) ;
- \`image[:, ::-1]\` retourne l'image de gauche à droite (effet miroir), \`image[::-1, :]\` de haut en bas ;
- \`image.T\` échange lignes et colonnes (symétrie par rapport à la diagonale).

Ces opérations ne recopient pas les pixels : elles donnent une **vue** sur le même tableau. Modifier la vue modifie l'original ; \`.copy()\` en fait une copie indépendante.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`images` contient les 1 797 images, ramenées entre 0 et 1 (divisées par 16). Rangez dans `miroir` la première image (`images[0]`) retournée de **gauche à droite**, et dans `centre` son carré central de **4 sur 4** (lignes 2 à 5, colonnes 2 à 5).",
      setup: CHIFFRES,
      starter: lines("miroir = images[0]", "centre = images[0]"),
      solution: lines(
        "miroir = images[0][:, ::-1]",
        "centre = images[0][2:6, 2:6]",
        "print(centre.round(2))",
      ),
      test: lines(
        "assert miroir.shape == (8, 8), f\"miroir doit garder la forme (8, 8), pas {miroir.shape}\"",
        "assert np.allclose(miroir[:, 0], images[0][:, 7]), \"la première colonne du miroir doit être la dernière de l'image : images[0][:, ::-1]\"",
        "assert centre.shape == (4, 4), f\"le centre doit faire 4 sur 4, pas {centre.shape} : lignes 2:6 et colonnes 2:6\"",
        "assert np.allclose(centre, images[0][2:6, 2:6]), \"le centre va des lignes 2 à 5 et des colonnes 2 à 5 (la borne de fin d'une tranche est exclue)\"",
      ),
      hint: "Une tranche ::-1 parcourt un axe à l'envers ; 2:6 va de 2 à 5.",
    },
    {
      kind: "text",
      md: `### La couleur : trois tableaux superposés

Une image en couleur a une dimension de plus : pour chaque pixel, trois nombres, l'intensité de **rouge**, de **vert** et de **bleu** (RGB). Sa forme est \`(hauteur, largeur, 3)\`. Dans les fichiers courants (PNG, JPEG), chaque intensité est un entier de 0 à 255, rangé sur un octet : le type NumPy \`uint8\`. Une photo de 12 millions de pixels occupe ainsi 36 millions d'octets une fois ouverte, quelle que soit la taille de son fichier compressé.

Pour passer en **niveaux de gris**, le plus simple est la moyenne des trois canaux. Les normes de la vidéo donnent plutôt plus de poids au vert, auquel l'œil est le plus sensible, et moins au bleu ; la moyenne suffit pour comprendre. Beaucoup de méthodes de vision travaillent en gris : la forme d'un chiffre ne dépend pas de la couleur de l'encre.

Un piège classique : calculer sur des \`uint8\`. \`200 + 100\` y donne 44 (le résultat repart de zéro après 255). On convertit d'abord en nombres à virgule, avec \`image.astype(float)\` ou une division.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "image = np.zeros((60, 90, 3), dtype=np.uint8)   # 60 lignes, 90 colonnes, 3 canaux",
        "image[:, :30] = (0, 85, 164)      # bande bleue",
        "image[:, 30:60] = (255, 255, 255) # bande blanche",
        "image[:, 60:] = (239, 65, 53)     # bande rouge",
        "print('forme :', image.shape, ' type :', image.dtype, ' octets :', image.nbytes)",
        "print('pixel (0, 0) :', image[0, 0], ' pixel (0, 89) :', image[0, 89])",
        "",
        "gris = image.astype(float).mean(axis=2)          # moyenne des trois canaux",
        "print('gris des trois bandes :', gris[0, [0, 45, 89]])",
        "print('uint8 : 200 + 100 =', np.array([200], dtype=np.uint8) + np.array([100], dtype=np.uint8))",
        "",
        "fig, axes = plt.subplots(1, 5, figsize=(11, 2.2))",
        "axes[0].imshow(image)",
        "axes[0].set_title('couleur')",
        "for k, nom in enumerate(['rouge', 'vert', 'bleu']):",
        "    axes[k + 1].imshow(image[:, :, k], cmap='gray', vmin=0, vmax=255)",
        "    axes[k + 1].set_title('canal ' + nom)",
        "axes[4].imshow(gris, cmap='gray', vmin=0, vmax=255)",
        "axes[4].set_title('gris (moyenne)')",
        "for ax in axes:",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Une image de 60 sur 90 pixels fabriquée à la main : 16 200 octets (60 × 90 × 3). Chaque canal est une image en gris : la bande rouge est claire dans le canal rouge et sombre dans le bleu. En moyenne, le bleu donne un gris de 83, le blanc 255, le rouge 119. La dernière ligne montre le débordement des uint8 : 200 + 100 donne 44.",
    },
    {
      kind: "text",
      md: `### Seuiller : du gris au noir et blanc

**Seuiller** une image, c'est décider pour chaque pixel s'il est « allumé » : \`image > 0.5\` donne un tableau de booléens de même forme. C'est la façon la plus simple de séparer un objet du fond (l'encre du papier), à condition que l'éclairage soit régulier.

Sur les chiffres, la moitié des pixels (48,9 %) valent exactement 0, et 29,3 % dépassent la moitié de l'intensité maximale : l'encre occupe une petite partie de l'image. Les tableaux de booléens se comptent comme des nombres (\`True\` vaut 1) : \`(image > 0.5).sum()\` compte les pixels d'encre.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Pour chaque image, comptez ses pixels d'encre (valeur **strictement supérieure à 0,5**) et rangez ces 1 797 nombres dans `encre`. Puis rangez dans `encre_par_chiffre` une liste de 10 nombres : la moyenne de `encre` pour les images de 0, de 1... jusqu'à 9.",
      setup: CHIFFRES,
      starter: lines("encre = images.sum(axis=(1, 2))", "encre_par_chiffre = []"),
      solution: lines(
        "encre = (images > 0.5).sum(axis=(1, 2))",
        "encre_par_chiffre = [encre[y == k].mean() for k in range(10)]",
        "print([round(float(v), 1) for v in encre_par_chiffre])",
      ),
      test: lines(
        "assert np.shape(encre) == (1797,), f\"encre doit avoir une valeur par image (1797), pas la forme {np.shape(encre)}\"",
        "assert np.issubdtype(np.asarray(encre).dtype, np.integer), \"encre doit compter des pixels (des entiers) : (images > 0.5).sum(axis=(1, 2))\"",
        "assert np.array_equal(encre, (images > 0.5).sum(axis=(1, 2))), \"comptez les pixels dont la valeur dépasse strictement 0,5, image par image\"",
        "assert len(encre_par_chiffre) == 10, \"encre_par_chiffre doit contenir 10 moyennes, une par chiffre\"",
        "assert abs(encre_par_chiffre[8] - encre[y == 8].mean()) < 1e-9, \"chaque moyenne se calcule sur les images du chiffre : encre[y == k].mean()\"",
      ),
      hint: "(images > 0.5) donne des booléens ; .sum(axis=(1, 2)) les compte sur les lignes et les colonnes de chaque image. encre[y == k] garde les images du chiffre k.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le 8 utilise le plus d'encre (20,3 pixels en moyenne) et le 0 le moins (18,0), mais l'écart est minuscule : tous les chiffres tournent autour de 18 à 20 pixels. La quantité d'encre ne permet presque pas de les distinguer. Ce qui compte, c'est **où** est l'encre, et c'est ce que la suite du cours exploite.",
    },
    {
      kind: "text",
      md: `### Un premier classifieur : l'image moyenne la plus proche

Faisons la moyenne, pixel par pixel, de toutes les images d'apprentissage d'un même chiffre : on obtient un **chiffre moyen**, flou, qui montre où l'encre se trouve d'habitude. Pour classer une nouvelle image, on la compare aux dix chiffres moyens et on choisit le plus proche (la plus petite somme des carrés des écarts, pixel par pixel).

Pour juger honnêtement, on calcule les moyennes sur **75 %** des images et on mesure la réussite sur les **25 %** restantes, jamais vues. Mesurer sur les images qui ont servi à calculer les moyennes donnerait un score trop flatteur. Une limite propre à ce jeu : ses 1 797 chiffres viennent de 13 personnes, et chaque personne a des chiffres des deux côtés du découpage. Sur l'écriture d'inconnus, la réussite serait sans doute plus faible.`,
    },
    {
      kind: "code",
      language: "python",
      setup: CHIFFRES,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.model_selection import train_test_split",
        "",
        "img_train, img_test, y_train, y_test = train_test_split(images, y, test_size=0.25, random_state=0, stratify=y)",
        "moyennes = np.array([img_train[y_train == k].mean(axis=0) for k in range(10)])   # forme (10, 8, 8)",
        "",
        "# distance de chaque image de test à chacun des dix chiffres moyens : forme (450, 10)",
        "distances = ((img_test[:, None] - moyennes[None]) ** 2).sum(axis=(2, 3))",
        "predit = distances.argmin(axis=1)",
        "print('images de test :', len(y_test), ' réussite :', round((predit == y_test).mean(), 3))",
        "",
        "fig, axes = plt.subplots(1, 10, figsize=(10, 1.6))",
        "for k, ax in enumerate(axes):",
        "    ax.imshow(moyennes[k], cmap='gray_r')",
        "    ax.set_title(str(k))",
        "    ax.axis('off')",
        "plt.tight_layout()",
      ),
      caption: "Les dix chiffres moyens sont flous mais reconnaissables. Classer par le plus proche d'entre eux réussit 90,7 % des 450 images de test, sans aucun apprentissage au sens du machine learning. Les erreurs les plus fréquentes : des 8 pris pour des 1 (6 fois), puis des 2 pris pour des 1, des 5 pour des 9 et des 3 pour des 8 (4 fois chacune).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les variables `img_train`, `img_test`, `y_train`, `y_test` et `moyennes` de l'exemple précédent sont prêtes. Pour chaque chiffre de 0 à 9, calculez la **réussite** (part des images de test de ce chiffre bien classées par l'image moyenne la plus proche) et rangez les 10 valeurs dans `reussite_par_chiffre`. Rangez dans `pire` le chiffre le moins bien reconnu.",
      setup: lines(
        CHIFFRES,
        "from sklearn.model_selection import train_test_split",
        "img_train, img_test, y_train, y_test = train_test_split(images, y, test_size=0.25, random_state=0, stratify=y)",
        "moyennes = np.array([img_train[y_train == k].mean(axis=0) for k in range(10)])",
      ),
      starter: lines(
        "distances = ((img_test[:, None] - moyennes[None]) ** 2).sum(axis=(2, 3))",
        "predit = distances.argmin(axis=1)",
        "reussite_par_chiffre = []",
        "pire = None",
      ),
      solution: lines(
        "distances = ((img_test[:, None] - moyennes[None]) ** 2).sum(axis=(2, 3))",
        "predit = distances.argmin(axis=1)",
        "reussite_par_chiffre = [(predit[y_test == k] == k).mean() for k in range(10)]",
        "pire = int(np.argmin(reussite_par_chiffre))",
        "print([round(float(r), 2) for r in reussite_par_chiffre], ' le moins bien reconnu :', pire)",
      ),
      test: lines(
        "_p = (((img_test[:, None] - moyennes[None]) ** 2).sum(axis=(2, 3))).argmin(axis=1)",
        "_r = [(_p[y_test == k] == k).mean() for k in range(10)]",
        "assert len(reussite_par_chiffre) == 10, \"il faut une réussite par chiffre, donc 10 valeurs\"",
        "assert np.allclose(reussite_par_chiffre, _r), \"pour le chiffre k : parmi les images de test dont la vraie classe est k, part de celles prédites k\"",
        "assert pire == int(np.argmin(_r)), f\"pire doit être le chiffre dont la réussite est la plus basse ({int(np.argmin(_r))})\"",
      ),
      hint: "predit[y_test == k] garde les prédictions des images qui sont vraiment des k ; comparez-les à k puis faites la moyenne. np.argmin donne la position du minimum.",
    },
  ],
  quiz: [
    {
      question: "Une image en couleur a la forme (480, 640, 3). Que désigne chaque nombre ?",
      options: [
        "480 colonnes, 640 lignes, 3 octets par pixel",
        "480 lignes, 640 colonnes, 3 canaux (rouge, vert, bleu)",
        "480 pixels de large, 640 de haut, 3 images",
        "Une vidéo de 480 images de 640 pixels",
      ],
      correct: 1,
      explanation: "NumPy range d'abord les lignes (la hauteur), puis les colonnes (la largeur), puis les canaux. Le pixel image[0, 0] est en haut à gauche.",
    },
    {
      question: "Que donne image[:, ::-1] ?",
      options: [
        "L'image retournée de haut en bas",
        "L'image en négatif (le noir devient blanc)",
        "L'image retournée de gauche à droite",
        "Une erreur : une tranche ne peut pas avoir un pas négatif",
      ],
      correct: 2,
      explanation: "La tranche ::-1 parcourt les colonnes à l'envers, les lignes restent dans l'ordre : c'est l'effet miroir. image[::-1, :] retournerait de haut en bas.",
    },
    {
      question: "Pourquoi convertir une image uint8 en nombres à virgule avant de calculer ?",
      options: [
        "Parce que imshow n'affiche pas les uint8",
        "Parce qu'un uint8 ne dépasse pas 255 : une somme comme 200 + 100 repart de zéro et donne 44",
        "Parce que les uint8 sont plus lents à afficher",
        "Ce n'est jamais utile",
      ],
      correct: 1,
      explanation: "Un uint8 tient sur un octet, de 0 à 255. Au-delà, le calcul déborde sans prévenir. astype(float) ou une division évitent ce piège.",
    },
    {
      question: "Le classifieur « image moyenne la plus proche » réussit 90,7 % des images de test. Pourquoi ne pas mesurer la réussite sur les images qui ont servi à calculer les moyennes ?",
      options: [
        "Parce que le calcul serait trop long",
        "Parce que le score serait trop flatteur : ces images ont influencé les moyennes, ce n'est pas un test sur du neuf",
        "Parce que les moyennes changeraient",
        "Parce que scikit-learn l'interdit",
      ],
      correct: 1,
      explanation: "On évalue un modèle sur des données qu'il n'a pas vues pendant l'apprentissage. Ici même, la limite demeure : les mêmes 13 personnes ont écrit les images des deux côtés du découpage.",
    },
  ],
};
