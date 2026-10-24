import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CHIFFRES } from "./data";

/**
 * Trois parts des 1 797 images : source (898 images nettes, toutes étiquetées), cible (449 images transformées, dont on
 * ne garde que quelques étiquettes) et test (450 images transformées de la même façon). `tirer(y, n)` choisit n images
 * par chiffre. Chiffres mesurés le 24 octobre 2026 (Pyodide 314.0.7) : modèle source 96,9 % sur le test net, 63,6 % sur
 * le test flou, entraîné en 2,7 s sans avertissement.
 */
const DOMAINES = lines(
  CHIFFRES,
  "import copy",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.neural_network import MLPClassifier",
  "from sklearn.linear_model import LogisticRegression",
  "from scipy import ndimage",
  "",
  "i_source, i_reste = train_test_split(np.arange(len(y)), test_size=0.5, random_state=0, stratify=y)",
  "i_cible, i_test = train_test_split(i_reste, test_size=0.5, random_state=0, stratify=y[i_reste])",
  "",
  "def flouter(ims):",
  "    return np.array([ndimage.gaussian_filter(im, 1.0) for im in ims])",
  "",
  "def decaler(ims):",
  "    return np.array([ndimage.shift(im, (1, 1), order=0, cval=0) for im in ims])",
  "",
  "def tirer(y_dispo, n, graine=0):",
  "    rng = np.random.default_rng(graine)",
  "    return np.concatenate([rng.choice(np.where(y_dispo == k)[0], n, replace=False) for k in range(10)])",
  "",
  "X_source, y_source = images[i_source].reshape(-1, 64), y[i_source]",
  "y_cible, y_test = y[i_cible], y[i_test]",
);

/** Le modèle appris sur la source, et les images floues de la cible et du test */
const SOURCE_FLOU = lines(
  DOMAINES,
  "source = MLPClassifier(hidden_layer_sizes=(64,), max_iter=150, learning_rate_init=0.01, random_state=0).fit(X_source, y_source)",
  "Xf_cible, Xf_test = flouter(images[i_cible]).reshape(-1, 64), flouter(images[i_test]).reshape(-1, 64)",
);

export const moduleTransfertApprentissage: LessonModule = {
  id: "transfert-apprentissage",
  title: "Transfert d'apprentissage",
  duration: "2 h",
  summary: "Réutiliser un modèle appris sur une tâche où les étiquettes abondent pour une tâche voisine qui en a peu : ajustement fin, comparaison avec un modèle appris sur la cible seule, et mesure du transfert négatif.",
  objectives: [
    "Distinguer source et cible, extraction de caractéristiques et ajustement fin",
    "Ajuster un modèle déjà entraîné sur quelques exemples d'un autre domaine, sans toucher l'original",
    "Comparer toujours à un modèle appris sur la cible seule, sur plusieurs tirages",
    "Reconnaître un transfert négatif et savoir pourquoi il arrive",
  ],
  sections: [
    {
      kind: "text",
      md: `### Ne pas repartir de zéro

Étiqueter des images coûte cher : il faut des personnes, du temps, parfois des spécialistes (un radiologue pour des radiographies). Le **transfert d'apprentissage** part d'un constat : un modèle entraîné sur une tâche où les étiquettes abondent, la **source**, a appris des choses utiles pour une tâche voisine qui en a peu, la **cible**.

Deux façons de s'en servir :

- **Extraire des caractéristiques** : on garde le modèle source tel quel, **gelé**, et on n'entraîne qu'un petit classifieur sur ce qu'il calcule (ses couches internes) pour les images cibles.
- **Ajuster** (*fine-tuning*) : on part des poids du modèle source et on continue l'entraînement sur les exemples cibles, en douceur, pour ne pas effacer ce qu'il savait.

En pratique, la source est souvent un grand réseau convolutif entraîné sur des millions de photos variées. Ses premières couches détectent des bords et des textures, comme les filtres du module 2, et ces détecteurs servent à presque toutes les images. Ses dernières couches sont plus spécialisées : c'est la conclusion de Yosinski et al. (2014), qui ont mesuré couche par couche ce qui se transfère.`,
    },
    {
      kind: "text",
      md: `### Une expérience à notre échelle

Nos chiffres permettent de rejouer l'idée en petit. On coupe les 1 797 images en trois parts, chaque chiffre également représenté :

- la **source** : 898 images **nettes**, toutes étiquetées ;
- la **cible** : 449 images d'un autre « domaine », ici **floues** (un appareil mal réglé, par exemple), dont on ne garde que **quelques étiquettes** ;
- le **test** : 450 images floues, jamais vues, pour juger.

Le modèle source est un perceptron multicouche comme celui du module 4, avec 64 neurones cachés. Sur les images nettes, il fait très bien ; sur les floues, il perd pied.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DOMAINES,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "source = MLPClassifier(hidden_layer_sizes=(64,), max_iter=150, learning_rate_init=0.01, random_state=0)",
        "source.fit(X_source, y_source)",
        "",
        "Xn_test = images[i_test].reshape(-1, 64)               # test net",
        "Xf_test = flouter(images[i_test]).reshape(-1, 64)      # même test, flou",
        "print('source :', len(y_source), 'images ; cible :', len(y_cible), ' ; test :', len(y_test))",
        "print('modèle source, test net  :', round(source.score(Xn_test, y_test), 3))",
        "print('modèle source, test flou :', round(source.score(Xf_test, y_test), 3))",
        "",
        "fig, axes = plt.subplots(2, 6, figsize=(8, 3))",
        "for k in range(6):",
        "    axes[0, k].imshow(images[i_test][k], cmap='gray_r')",
        "    axes[1, k].imshow(flouter(images[i_test][k:k + 1])[0], cmap='gray_r')",
        "    axes[0, k].axis('off')",
        "    axes[1, k].axis('off')",
        "axes[0, 0].set_title('net', loc='left')",
        "axes[1, 0].set_title('flou', loc='left')",
        "plt.tight_layout()",
      ),
      caption: "Le modèle source reconnaît 96,9 % des images nettes du test, mais seulement 63,6 % des mêmes images une fois floutées : le flou étale l'encre sur les pixels voisins, et le modèle n'a jamais vu cela.",
    },
    {
      kind: "text",
      md: `### Ajuster sans abîmer l'original

Pour ajuster, on **copie** le modèle source (\`copy.deepcopy\`), puis on poursuit son entraînement sur les quelques images cibles étiquetées avec \`partial_fit\`, qui fait une passe d'entraînement à chaque appel en partant des poids actuels (et non de zéro, comme \`fit\`). Sans la copie, on modifierait le modèle source lui-même et on ne pourrait plus comparer.

La comparaison qui compte n'est pas « avant et après » : c'est le modèle ajusté face à un modèle appris **sur la cible seule**, avec les mêmes exemples. Si le second fait aussi bien, la source n'a servi à rien.`,
    },
    {
      kind: "code",
      language: "python",
      setup: SOURCE_FLOU,
      code: lines(
        "idx = tirer(y_cible, 1)          # une seule image floue étiquetée par chiffre : 10 images",
        "",
        "seule = LogisticRegression(max_iter=3000).fit(Xf_cible[idx], y_cible[idx])",
        "",
        "ajuste = copy.deepcopy(source)   # l'original reste intact",
        "for passe in range(20):",
        "    ajuste.partial_fit(Xf_cible[idx], y_cible[idx])",
        "",
        "print('cible seule (10 images)  :', round(seule.score(Xf_test, y_test), 3))",
        "print('source sans ajustement   :', round(source.score(Xf_test, y_test), 3))",
        "print('source ajustée (10 images):', round(ajuste.score(Xf_test, y_test), 3))",
      ),
      caption: "Avec une image floue par chiffre, le modèle appris sur la cible seule reconnaît 63,8 % du test flou, le modèle source tel quel 63,6 %, et le modèle source ajusté sur ces dix images 78,9 % : les poids appris sur les images nettes ont donné une longueur d'avance que dix images seules ne donnent pas.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le modèle `source`, les images floues `Xf_cible` et `Xf_test` et la fonction `tirer` sont prêts. Avec **trois** images par chiffre (`idx = tirer(y_cible, 3)`) : entraînez une régression logistique sur la cible seule et rangez sa réussite sur le test flou dans `score_seule` ; ajustez une **copie** du modèle source (20 passes de `partial_fit`), rangez-la dans `ajuste` et sa réussite dans `score_ajuste`.",
      setup: SOURCE_FLOU,
      starter: lines(
        "idx = tirer(y_cible, 3)",
        "ajuste = source",
        "score_seule = None",
        "score_ajuste = None",
      ),
      solution: lines(
        "idx = tirer(y_cible, 3)",
        "seule = LogisticRegression(max_iter=3000).fit(Xf_cible[idx], y_cible[idx])",
        "score_seule = seule.score(Xf_test, y_test)",
        "ajuste = copy.deepcopy(source)",
        "for passe in range(20):",
        "    ajuste.partial_fit(Xf_cible[idx], y_cible[idx])",
        "score_ajuste = ajuste.score(Xf_test, y_test)",
        "print('cible seule :', round(score_seule, 3), ' source ajustée :', round(score_ajuste, 3))",
      ),
      test: lines(
        "assert ajuste is not source, \"ajustez une copie : ajuste = copy.deepcopy(source), sinon le modèle source est modifié\"",
        "assert abs(source.score(Xf_test, y_test) - 0.6356) < 0.002, \"le modèle source ne doit pas avoir été modifié\"",
        "_idx = tirer(y_cible, 3)",
        "_seule = LogisticRegression(max_iter=3000).fit(Xf_cible[_idx], y_cible[_idx]).score(Xf_test, y_test)",
        "assert score_seule is not None and abs(score_seule - _seule) < 1e-9, f\"score_seule : régression logistique sur les 30 images cibles, mesurée sur le test flou (attendu {_seule:.3f})\"",
        "assert score_ajuste is not None and abs(score_ajuste - ajuste.score(Xf_test, y_test)) < 1e-9, \"score_ajuste doit être la réussite du modèle ajusté sur Xf_test\"",
        "assert score_ajuste > 0.80, f\"après 20 passes de partial_fit sur les 30 images, la copie ajustée dépasse 80 % (ici {score_ajuste:.3f})\"",
      ),
      hint: "copy.deepcopy(source) donne un modèle indépendant ; partial_fit(X, y) fait une passe en partant des poids actuels. score(X, y) donne la réussite.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Avec trois images par chiffre, la cible seule atteint 72,9 % et le modèle ajusté 84,9 %. L'écart se réduit quand les exemples cibles se multiplient : avec dix images par chiffre, 84,7 % contre 88,0 %. Le transfert sert surtout quand les étiquettes de la cible sont rares.",
    },
    {
      kind: "text",
      md: `### Un seul tirage ne prouve rien

Avec dix images, le hasard du choix pèse lourd : une image mal écrite tirée pour un chiffre, et tout change. Avant de conclure, on recommence avec plusieurs tirages et on regarde la moyenne **et** l'étendue des résultats. C'est le même réflexe que la validation croisée : un résultat n'existe que s'il résiste au changement de données.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Pour les graines 0 à 4 (`tirer(y_cible, 1, graine)`), mesurez sur le test flou la réussite de la cible seule (régression logistique) et celle d'une copie ajustée du modèle source (20 passes). Rangez les 5 différences « ajusté moins cible seule » dans la liste `gains`, et dans `toujours_mieux` un booléen qui dit si l'ajustement gagne à **chaque** tirage.",
      setup: SOURCE_FLOU,
      starter: lines("gains = []", "toujours_mieux = None"),
      solution: lines(
        "gains = []",
        "for graine in range(5):",
        "    idx = tirer(y_cible, 1, graine)",
        "    seule = LogisticRegression(max_iter=3000).fit(Xf_cible[idx], y_cible[idx]).score(Xf_test, y_test)",
        "    ajuste = copy.deepcopy(source)",
        "    for passe in range(20):",
        "        ajuste.partial_fit(Xf_cible[idx], y_cible[idx])",
        "    gains.append(ajuste.score(Xf_test, y_test) - seule)",
        "toujours_mieux = all(g > 0 for g in gains)",
        "print([round(g, 3) for g in gains], ' gain moyen :', round(float(np.mean(gains)), 3))",
      ),
      test: lines(
        "assert len(gains) == 5, f\"il faut un gain par tirage, donc 5 valeurs (vous en avez {len(gains)})\"",
        "_g = []",
        "for _graine in range(5):",
        "    _i = tirer(y_cible, 1, _graine)",
        "    _s = LogisticRegression(max_iter=3000).fit(Xf_cible[_i], y_cible[_i]).score(Xf_test, y_test)",
        "    _a = copy.deepcopy(source)",
        "    for _p in range(20):",
        "        _a.partial_fit(Xf_cible[_i], y_cible[_i])",
        "    _g.append(_a.score(Xf_test, y_test) - _s)",
        "assert np.allclose(gains, _g), \"chaque gain : réussite de la copie ajustée moins celle de la cible seule, mêmes images, même graine\"",
        "assert toujours_mieux == all(g > 0 for g in _g), \"toujours_mieux est vrai seulement si les 5 gains sont positifs\"",
      ),
      hint: "Une boucle for graine in range(5), et dans la boucle le code de l'exemple. all(g > 0 for g in gains) vérifie tous les gains.",
    },
    {
      kind: "text",
      md: `### Quand la source nuit : le transfert négatif

Changeons de domaine : la cible n'est plus floue mais **décalée d'un pixel** vers le bas et vers la droite. Pour nous, c'est la même image. Pour le perceptron, qui compare des pixels à des positions fixes (module 4), c'est un tout autre tableau : le modèle source n'en reconnaît plus que 12,9 %.

Ajuster aide, mais pas assez : avec trois images par chiffre, la copie ajustée atteint 77,1 % quand un modèle appris sur la cible seule fait 80,4 %. Le modèle source traîne des habitudes fausses pour ce domaine. On parle de **transfert négatif** : la source fait moins bien que rien du tout. Il arrive quand source et cible se ressemblent moins qu'on ne le croit, et seule la comparaison avec la cible seule le révèle.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Mesurez le transfert sur les images **décalées** (fonction `decaler`, déjà prête), avec trois images par chiffre (`tirer(y_cible, 3)`) : réussite de la cible seule dans `seule_decale`, réussite d'une copie ajustée du modèle source (20 passes) dans `ajuste_decale`, toutes deux sur le test décalé. Rangez dans `meilleur` le texte `'cible seule'` ou `'source ajustée'` selon le plus performant.",
      setup: lines(
        SOURCE_FLOU,
        "Xd_cible, Xd_test = decaler(images[i_cible]).reshape(-1, 64), decaler(images[i_test]).reshape(-1, 64)",
      ),
      starter: lines("seule_decale = None", "ajuste_decale = None", "meilleur = 'source ajustée'"),
      solution: lines(
        "idx = tirer(y_cible, 3)",
        "seule_decale = LogisticRegression(max_iter=3000).fit(Xd_cible[idx], y_cible[idx]).score(Xd_test, y_test)",
        "ajuste = copy.deepcopy(source)",
        "for passe in range(20):",
        "    ajuste.partial_fit(Xd_cible[idx], y_cible[idx])",
        "ajuste_decale = ajuste.score(Xd_test, y_test)",
        "meilleur = 'cible seule' if seule_decale > ajuste_decale else 'source ajustée'",
        "print('cible seule :', round(seule_decale, 3), ' source ajustée :', round(ajuste_decale, 3), ' ->', meilleur)",
      ),
      test: lines(
        "_i = tirer(y_cible, 3)",
        "_s = LogisticRegression(max_iter=3000).fit(Xd_cible[_i], y_cible[_i]).score(Xd_test, y_test)",
        "_a = copy.deepcopy(source)",
        "for _p in range(20):",
        "    _a.partial_fit(Xd_cible[_i], y_cible[_i])",
        "_a = _a.score(Xd_test, y_test)",
        "assert seule_decale is not None and abs(seule_decale - _s) < 1e-9, f\"seule_decale : régression logistique sur les 30 images décalées, mesurée sur le test décalé (attendu {_s:.3f})\"",
        "assert ajuste_decale is not None and abs(ajuste_decale - _a) < 1e-9, f\"ajuste_decale : copie du modèle source ajustée 20 passes (attendu {_a:.3f})\"",
        "assert meilleur == ('cible seule' if _s > _a else 'source ajustée'), \"meilleur doit nommer le modèle qui réussit le mieux sur le test décalé\"",
      ),
      hint: "Reprenez le code de l'exercice sur le flou en remplaçant Xf_ par Xd_.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une autre tentative, faite pour préparer ce module, a aussi échoué : réutiliser la couche cachée d'un perceptron appris sur les chiffres 0 à 4 pour reconnaître les chiffres 5 à 9. Avec cinq exemples par chiffre et dix tirages, 80,6 % de réussite en moyenne contre 89,3 % pour une régression logistique sur les pixels bruts. La source (moins de 700 images, cinq classes) était trop petite et trop spécialisée. Le transfert marche quand la source est grande, variée et proche de la cible.",
    },
    {
      kind: "text",
      md: lines(
        "### Le transfert en vrai : un réseau pré-entraîné",
        "",
        "Hors de ce site, on part d'un réseau convolutif pré-entraîné sur un très grand jeu de photos étiquetées (souvent ImageNet), fourni avec les bibliothèques de deep learning. Ce code Keras ne tourne pas dans le moteur du site (TensorFlow n'y est pas) ; sur votre machine, il télécharge les poids au premier appel :",
        "",
        "```python",
        "import tensorflow as tf",
        "",
        "base = tf.keras.applications.MobileNetV2(input_shape=(160, 160, 3), include_top=False, weights='imagenet')",
        "base.trainable = False                      # 1) extraction : la base est gelée",
        "",
        "modele = tf.keras.Sequential([",
        "    base,",
        "    tf.keras.layers.GlobalAveragePooling2D(),",
        "    tf.keras.layers.Dense(5, activation='softmax'),   # nouvelle tête : 5 classes cibles",
        "])",
        "modele.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])",
        "modele.fit(images_cible, etiquettes_cible, validation_split=0.2, epochs=10)",
        "",
        "base.trainable = True                       # 2) ajustement : on dégèle",
        "modele.compile(optimizer=tf.keras.optimizers.Adam(1e-5),   # pas d'apprentissage très petit",
        "               loss='sparse_categorical_crossentropy', metrics=['accuracy'])",
        "modele.fit(images_cible, etiquettes_cible, validation_split=0.2, epochs=5)",
        "```",
        "",
        "Les deux temps sont ceux de ce module : d'abord entraîner une nouvelle tête sur la base gelée, puis dégeler et ajuster avec un pas d'apprentissage très petit, pour ne pas effacer ce que la base savait. La règle de fond ne change pas : comparer à un modèle sans transfert, sur des images de test jamais vues.",
      ),
    },
    {
      kind: "note",
      tone: "info",
      md: "Un modèle pré-entraîné arrive avec ses données d'origine : leurs biais (types de photos, régions du monde représentées) et leur licence. Vérifiez la licence des poids avant un usage réel. Et dès que les images montrent des personnes, ce sont des données personnelles (RGPD) ; certains usages, comme la reconnaissance des visages, sont encadrés de près par le droit européen, dont le règlement sur l'intelligence artificielle.",
    },
  ],
  quiz: [
    {
      question: "Dans le transfert d'apprentissage, qu'appelle-t-on la source ?",
      options: [
        "Le code source du modèle",
        "La tâche ou le jeu de données, riche en étiquettes, sur lequel le modèle a d'abord été entraîné",
        "Les images de test",
        "La bibliothèque qui fournit le modèle",
      ],
      correct: 1,
      explanation: "La source est la tâche où les étiquettes abondent ; la cible, celle qui nous intéresse et en a peu. Le transfert réutilise ce que le modèle a appris sur la première.",
    },
    {
      question: "Pourquoi copier le modèle source avant de l'ajuster ?",
      options: [
        "Parce que partial_fit refuse un modèle déjà entraîné",
        "Pour garder l'original intact : le comparer, le réutiliser pour une autre cible",
        "Pour aller plus vite",
        "Parce que la copie a moins de paramètres",
      ],
      correct: 1,
      explanation: "partial_fit modifie le modèle sur place. Sans copy.deepcopy, l'original serait perdu et toute comparaison faussée.",
    },
    {
      question: "Le modèle ajusté réussit 78,9 % du test flou. Quelle comparaison dit si le transfert a servi ?",
      options: [
        "Avec le modèle source sur les images nettes (96,9 %)",
        "Avec un modèle appris sur les mêmes images cibles seulement, sans la source",
        "Avec le hasard (10 %)",
        "Aucune : 78,9 % suffit",
      ],
      correct: 1,
      explanation: "La question est : la source apporte-t-elle quelque chose que les exemples cibles seuls n'apportent pas ? Ici la cible seule fait 63,8 % avec les mêmes dix images : oui.",
    },
    {
      question: "Qu'est-ce qu'un transfert négatif ?",
      options: [
        "Un transfert qui inverse les couleurs des images",
        "Un transfert dont le modèle réussit moins bien qu'un modèle appris sur la cible seule",
        "Un transfert de la cible vers la source",
        "Un modèle dont la réussite est négative",
      ],
      correct: 1,
      explanation: "La source peut nuire quand elle diffère trop de la cible : sur les images décalées, la copie ajustée fait 77,1 % contre 80,4 % pour la cible seule.",
    },
    {
      question: "Quand le transfert d'apprentissage a-t-il le plus de chances d'aider ?",
      options: [
        "Quand la cible a des millions d'exemples étiquetés",
        "Quand la source est grande, variée et proche de la cible, et que la cible a peu d'étiquettes",
        "Quand la source est plus petite que la cible",
        "Toujours, quelle que soit la source",
      ],
      correct: 1,
      explanation: "Le gain fond quand les exemples cibles abondent (88,0 % contre 84,7 % avec dix images par chiffre) et disparaît quand la source est petite ou éloignée.",
    },
  ],
};
