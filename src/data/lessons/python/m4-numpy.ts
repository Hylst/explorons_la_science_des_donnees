import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module4: LessonModule = {
  id: "module-4",
  title: "NumPy : calculer sur des tableaux",
  duration: "3 h",
  summary:
    "Pourquoi un tableau NumPy n'est pas une liste, comment le créer, l'indexer et le filtrer, calculer sans boucle (opérations, agrégations par axe, broadcasting) et ne pas confondre copie et vue.",
  objectives: [
    "Expliquer ce qu'apporte un tableau NumPy par rapport à une liste Python (type unique, calcul vectorisé)",
    "Créer des tableaux, lire leur forme, leur nombre de dimensions et leur type, et les remodeler",
    "Sélectionner des éléments par indice, par tranche et par masque booléen",
    "Calculer sans boucle : opérations élément par élément, agrégations selon un axe, broadcasting",
    "Distinguer une vue d'une copie et connaître les opérations d'algèbre linéaire de base",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi des tableaux plutôt que des listes ?

Une liste Python peut contenir n'importe quoi (des nombres, du texte, d'autres listes) : c'est pratique, mais chaque élément est un objet à part, et un calcul sur mille éléments exige une boucle écrite en Python. Un **tableau NumPy** (\`ndarray\`) est autre chose :

- tous ses éléments ont **le même type** (des entiers, ou des flottants, ou des booléens...) ;
- les valeurs sont rangées **les unes à côté des autres** en mémoire, sans objet Python autour de chacune ;
- les opérations s'écrivent **sur le tableau entier** : la boucle est faite par du code compilé (écrit en C), pas par l'interpréteur Python. On appelle cela la **vectorisation**.

La différence se voit déjà sur l'opérateur \`*\` : sur une liste il la répète, sur un tableau il multiplie chaque élément.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "liste = [3, 1, 4, 1, 5, 9, 2, 6]",
        "tableau = np.array(liste)",
        "",
        "print('liste * 2     :', liste * 2)",
        "print('tableau * 2   :', tableau * 2)",
        "print('boucle        :', [x * 2 for x in liste])",
        "print(type(tableau), tableau.dtype)",
        "print('version de NumPy dans l\\'éditeur :', np.__version__)",
      ),
      caption: "Le même opérateur n'a pas le même sens : répéter une liste, ou calculer sur chaque élément d'un tableau. La dernière ligne affiche la version installée dans l'éditeur du site.",
    },
    {
      kind: "text",
      md: `### Mesurer l'écart

On répète souvent que NumPy est « bien plus rapide » que Python pur. Plutôt que de vous donner un chiffre, le banc d'essai ci-dessous le **mesure sur votre machine** : il calcule la somme des carrés d'un million d'entiers, une fois avec Python pur et une fois avec NumPy, et garde le meilleur de cinq essais.

Le résultat dépend de votre ordinateur, de votre navigateur et de ce qu'il fait en même temps : relancez-le, les temps varient un peu. Ici, Python tourne compilé en WebAssembly, donc les temps absolus diffèrent de ceux d'un Python installé chez vous. C'est l'**ordre de grandeur du rapport** qu'il faut retenir, pas les chiffres exacts.`,
    },
    { kind: "widget", widget: "numpy-benchmark" },
    {
      kind: "note",
      tone: "info",
      md: "Cette rapidité a un prix : un tableau a un **type unique** et une **taille fixe**. On n'y ajoute pas un élément comme on ajoute à une liste (`np.append` crée un nouveau tableau à chaque appel). On construit donc le tableau en une fois, ou on prépare sa place avec `np.zeros`.",
    },
    {
      kind: "text",
      md: `### Créer un tableau

Le plus direct : \`np.array\` à partir d'une liste (ou d'une liste de listes pour un tableau à deux dimensions). Pour les séquences régulières et les tableaux remplis d'une valeur, NumPy fournit des fonctions dédiées :

- \`np.arange(début, fin, pas)\` : comme \`range\`, la borne de fin est **exclue** ;
- \`np.linspace(début, fin, n)\` : \`n\` points régulièrement espacés, la borne de fin est **incluse** ;
- \`np.zeros(forme)\`, \`np.ones(forme)\`, \`np.full(forme, valeur)\` : tableaux remplis d'une valeur ; la forme est un entier ou un tuple comme \`(2, 3)\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "prets = np.array([12, 15, 9, 21])",
        "grille = np.array([[1, 2, 3], [4, 5, 6]])",
        "print(prets)",
        "print(grille)",
        "",
        "print(np.arange(0, 10, 2))",
        "print(np.linspace(0, 1, 5))",
        "print(np.zeros((2, 3)))",
        "print(np.full((2, 2), 7))",
      ),
      caption: "arange(0, 10, 2) s'arrête avant 10 ; linspace(0, 1, 5) va jusqu'à 1 inclus. zeros produit des flottants par défaut, full prend le type de la valeur donnée.",
    },
    {
      kind: "text",
      md: `### Des nombres aléatoires reproductibles

Pour fabriquer des données d'essai, on utilise un **générateur** créé par \`np.random.default_rng(graine)\`. La **graine** (*seed*) fixe la suite de nombres : avec la même graine, on obtient les mêmes valeurs à chaque exécution, ce qui rend un calcul répétable et vérifiable.

Les méthodes du générateur : \`integers(bas, haut, size=n)\` (la borne haute est exclue), \`random(n)\` (flottants entre 0 et 1) et \`normal(moyenne, écart_type, n)\` (loi normale).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(42)",
        "print('dix lancers de dé :', rng.integers(1, 7, size=10))",
        "print('trois flottants   :', rng.random(3).round(3))",
        "print('loi normale       :', rng.normal(loc=20, scale=3, size=5).round(1))",
        "",
        "premier = np.random.default_rng(7).random(4)",
        "second = np.random.default_rng(7).random(4)",
        "print('même graine, mêmes valeurs ?', np.array_equal(premier, second))",
      ),
      caption: "Deux générateurs créés avec la même graine produisent exactement la même suite. Le premier bloc dépend de la graine 42 et de la version de NumPy.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Dans du code plus ancien, vous verrez `np.random.seed(0)` puis `np.random.rand(...)` ou `np.random.random(...)`. Cette interface fonctionne encore, mais elle repose sur un état global ; `default_rng` est la façon recommandée aujourd'hui. Et même avec une graine fixée, la suite exacte produite par un générateur **peut changer d'une version de NumPy à l'autre** : ne comparez pas des valeurs écrites à la main, comparez des propriétés (forme, bornes, moyenne approchée).",
    },
    {
      kind: "text",
      md: `### Forme, dimensions et type

Trois attributs décrivent un tableau :

- \`shape\` : la **forme**, un tuple avec la taille de chaque dimension (\`(3, 4)\` : 3 lignes, 4 colonnes) ;
- \`ndim\` : le nombre de dimensions (1 pour un vecteur, 2 pour une matrice) ;
- \`dtype\` : le **type** commun des éléments (\`int32\`, \`int64\`, \`float64\`, \`bool\`...).

S'y ajoutent \`size\` (nombre d'éléments), \`itemsize\` (octets par élément) et \`nbytes\` (octets au total).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "t = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])",
        "print('shape   :', t.shape)",
        "print('ndim    :', t.ndim)",
        "print('size    :', t.size)",
        "print('dtype   :', t.dtype)",
        "print('itemsize:', t.itemsize)",
        "print('nbytes  :', t.nbytes)",
        "",
        "print(np.array([1, 2, 3]).dtype)",
        "print(np.array([1, 2.5, 3]).dtype)",
        "print(np.array([True, 2]).dtype)",
        "print(t.astype(np.float32).dtype)",
      ),
      caption: "Quand on mélange des types, NumPy choisit le plus large qui les contient tous : entiers et flottants donnent des flottants, booléens et entiers donnent des entiers. astype convertit en créant un nouveau tableau.",
    },
    { kind: "widget", widget: "numpy-array-structure" },
    {
      kind: "text",
      md: `Le schéma affiche le type \`int64\`, celui qu'on obtient par défaut sur la plupart des ordinateurs 64 bits. **L'éditeur du site, lui, donne \`int32\`** (voyez la sortie ci-dessus) : il fonctionne en WebAssembly 32 bits. Les deux sont corrects, c'est la plate-forme qui change.

### Choisir un type, et ses limites

Un type plus petit occupe moins de mémoire, mais ne peut représenter qu'une plage de valeurs plus étroite. Le dépassement n'est **pas signalé** : le résultat « fait le tour » sans message d'erreur.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import sys",
        "import numpy as np",
        "",
        "n = 1000",
        "liste = list(range(n))",
        "taille_liste = sys.getsizeof(liste) + sum(sys.getsizeof(x) for x in liste)",
        "print('liste Python         :', taille_liste, 'octets')",
        "print('tableau int32        :', np.arange(n, dtype=np.int32).nbytes, 'octets')",
        "print('tableau int16        :', np.arange(n, dtype=np.int16).nbytes, 'octets')",
        "",
        "petits = np.array([100, 120, 127], dtype=np.int8)",
        "print('int8 :', petits, '+ 10 ->', petits + 10)",
        "print('limites de int8  :', np.iinfo(np.int8).min, np.iinfo(np.int8).max)",
        "print('limites de int32 :', np.iinfo(np.int32).min, np.iinfo(np.int32).max)",
      ),
      caption: "La taille d'un entier Python dépend de la plate-forme ; mesurez-la ici plutôt que de retenir un chiffre. Avec int8, 127 + 10 ne donne pas 137 mais un nombre négatif.",
    },
    { kind: "widget", widget: "data-types-comparison" },
    {
      kind: "note",
      tone: "warning",
      md: "Le schéma ci-dessus donne les tailles d'un Python 64 bits ordinaire. Dans l'éditeur du site (WebAssembly 32 bits), la sortie du bloc précédent est différente : un entier Python y est plus petit, un pointeur aussi. **Ce qui ne change pas**, c'est l'idée : une liste coûte plusieurs fois plus de mémoire qu'un tableau du même contenu. Quand un type précis compte (fichiers binaires, grandes tables), écrivez `dtype=` explicitement au lieu de vous fier au type par défaut.",
    },
    {
      kind: "text",
      md: `### Remodeler un tableau

\`reshape\` change la forme sans changer les données (le nombre total d'éléments doit rester le même). Une dimension peut valoir \`-1\` : NumPy la calcule. \`.T\` transpose (lignes et colonnes échangées) et \`ravel()\` aplatit en une dimension.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "v = np.arange(12)",
        "m = v.reshape(3, 4)",
        "print(m)",
        "print('2 lignes, colonnes déduites :', v.reshape(2, -1).shape)",
        "print('transposée :', m.T.shape)",
        "print('aplatie     :', m.ravel())",
        "",
        "try:",
        "    v.reshape(5, 3)",
        "except ValueError as erreur:",
        "    print('erreur :', erreur)",
      ),
      caption: "12 éléments ne se rangent pas en 5 lignes de 3 : NumPy refuse et dit pourquoi.",
    },
    {
      kind: "text",
      md: `### Indexer et découper

Les indices commencent à **0**. Sur un tableau à deux dimensions, on écrit \`t[ligne, colonne]\`. Une **tranche** \`début:fin:pas\` suit les règles des listes (fin exclue, indices négatifs depuis la fin) et peut s'écrire sur chaque dimension, séparées par une virgule. Le signe \`:\` seul signifie « tout cet axe ».`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "t = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])",
        "print('t[0, 1]      :', t[0, 1])",
        "print('t[1]         :', t[1])",
        "print('t[:, 2]      :', t[:, 2])",
        "print('t[0:2, 1:3]  :')",
        "print(t[0:2, 1:3])",
        "print('t[-1, -1]    :', t[-1, -1])",
        "print('t[::2, ::2]  :')",
        "print(t[::2, ::2])",
      ),
      caption: "t[:, 2] donne toute la colonne 2 ; t[0:2, 1:3] garde les lignes 0 et 1 et les colonnes 1 et 2.",
    },
    {
      kind: "text",
      md: `### Filtrer avec un masque booléen

Comparer un tableau à une valeur donne un **tableau de booléens de même forme**, le *masque*. Utilisé comme indice, il ne garde que les éléments où il vaut \`True\`. C'est l'outil principal pour sélectionner des données selon une condition.

Pour combiner plusieurs conditions, on utilise \`&\` (et), \`|\` (ou) et \`~\` (non), **chaque condition entre parenthèses**. Les mots \`and\` et \`or\` de Python ne fonctionnent pas sur des tableaux. Comme \`True\` vaut 1 et \`False\` vaut 0, \`masque.sum()\` compte les éléments retenus et \`masque.mean()\` donne leur proportion. Enfin \`np.where(masque, a, b)\` choisit \`a\` ou \`b\` élément par élément.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "# maxima journaliers (valeurs inventées pour l'exemple)",
        "temperatures = np.array([18.5, 22.0, 27.5, 31.0, 24.0, 29.5, 33.0, 20.5])",
        "",
        "chaud = temperatures > 28",
        "print(chaud)",
        "print('jours chauds :', temperatures[chaud])",
        "print('combien :', chaud.sum(), ' proportion :', chaud.mean())",
        "print('entre 20 et 30 :', temperatures[(temperatures > 20) & (temperatures < 30)])",
        "print(np.where(chaud, 'chaud', 'ok'))",
        "",
        "try:",
        "    temperatures[(temperatures > 20) and (temperatures < 30)]",
        "except ValueError as erreur:",
        "    print('erreur avec and :', erreur)",
      ),
      caption: "Les parenthèses sont obligatoires autour de chaque comparaison. Avec and, NumPy ne sait pas décider si un tableau entier est « vrai » et lève une erreur.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "`temperatures` contient les maxima de dix journées (valeurs inventées). Construisez le masque `chaud` (vrai quand la température **dépasse** 28), puis `jours_chauds` (les températures de ces journées) et `nb_jours_chauds` (leur nombre).",
      setup: lines(
        "import numpy as np",
        "temperatures = np.array([18.5, 22.0, 27.5, 31.0, 24.0, 29.5, 33.0, 20.5, 26.0, 30.5])",
      ),
      starter: lines("chaud = None", "jours_chauds = None", "nb_jours_chauds = None"),
      solution: lines(
        "chaud = temperatures > 28",
        "jours_chauds = temperatures[chaud]",
        "nb_jours_chauds = chaud.sum()",
        "print(jours_chauds, nb_jours_chauds)",
      ),
      test: lines(
        "assert isinstance(chaud, np.ndarray) and chaud.dtype == bool, f\"chaud doit être un tableau de booléens (vous avez {type(chaud).__name__})\"",
        "assert chaud.tolist() == [False, False, False, True, False, True, True, False, False, True], f\"chaud doit valoir True quand la température dépasse 28 (vous avez {chaud.tolist()})\"",
        "assert isinstance(jours_chauds, np.ndarray) and jours_chauds.tolist() == [31.0, 29.5, 33.0, 30.5], f\"jours_chauds doit contenir les quatre températures supérieures à 28 (vous avez {jours_chauds})\"",
        "assert nb_jours_chauds == 4, f\"il y a 4 jours chauds (vous avez {nb_jours_chauds})\"",
      ),
      hint: "chaud = temperatures > 28 donne le masque ; temperatures[chaud] garde les valeurs vraies ; chaud.sum() compte les True.",
    },
    {
      kind: "text",
      md: `### Calculer sur tout le tableau

Les opérateurs arithmétiques (\`+\`, \`-\`, \`*\`, \`/\`, \`**\`) et les fonctions mathématiques (\`np.sqrt\`, \`np.exp\`, \`np.log\`, \`np.sin\`...) s'appliquent **élément par élément**, sans boucle. Entre deux tableaux de même forme, les éléments sont associés position par position ; avec un nombre seul, il est appliqué à tous les éléments.

Une précision sur les flottants : \`np.sin(np.pi)\` ne vaut pas exactement 0, mais un nombre minuscule. Ce sont les arrondis du calcul en virgule flottante, pas une erreur de NumPy.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "a = np.array([1, 2, 3, 4])",
        "b = np.array([5, 6, 7, 8])",
        "print('a + b  :', a + b)",
        "print('a * b  :', a * b)",
        "print('a ** 2 :', a ** 2)",
        "print('a * 10 :', a * 10)",
        "print('sqrt(a) :', np.sqrt(a))",
        "",
        "angles = np.array([0, np.pi / 2, np.pi])",
        "print('sin :', np.sin(angles))",
        "print('sin arrondi :', np.sin(angles).round(10))",
      ),
      caption: "Le dernier sinus vaut environ 1,2e-16 et non 0 : écrit en notation scientifique, c'est un reste d'arrondi.",
    },
    {
      kind: "text",
      md: `### Agréger : somme, moyenne, minimum... et l'axe

\`sum\`, \`mean\`, \`min\`, \`max\`, \`std\`, \`median\`... réduisent un tableau à un nombre. Sur un tableau à deux dimensions, l'argument \`axis\` indique **l'axe qui disparaît** :

- \`axis=0\` : on parcourt les **lignes**, le résultat a **une valeur par colonne** ;
- \`axis=1\` : on parcourt les **colonnes**, le résultat a **une valeur par ligne**.

Un moyen sûr de ne pas se tromper : regarder la forme du résultat. Pour un tableau de forme \`(4, 5)\`, supprimer l'axe 0 laisse \`(5,)\`, supprimer l'axe 1 laisse \`(4,)\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "# prêts par jour (lundi à vendredi) pendant 4 semaines : valeurs inventées",
        "prets = np.array([",
        "    [12, 15, 18, 21, 14],",
        "    [10, 13, 16, 19, 12],",
        "    [14, 17, 23, 20, 16],",
        "    [11, 14, 17, 20, 13],",
        "])",
        "print('forme :', prets.shape)",
        "print('total général          :', prets.sum())",
        "print('par semaine (axis=1)   :', prets.sum(axis=1), prets.sum(axis=1).shape)",
        "print('par jour (axis=0)      :', prets.sum(axis=0), prets.sum(axis=0).shape)",
        "print('moyenne par jour       :', prets.mean(axis=0))",
        "print('jour le plus chargé    :', prets.argmax(axis=1))",
        "print('cumul de la 1re semaine:', prets[0].cumsum())",
      ),
      caption: "argmax(axis=1) renvoie, pour chaque semaine, la position (0 = lundi) du jour où il y a eu le plus de prêts.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "x = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])",
        "print('écart-type, ddof=0 (NumPy par défaut)     :', x.std())",
        "print('écart-type, ddof=1 (estimation, pandas)    :', x.std(ddof=1))",
      ),
      caption: "NumPy divise par n par défaut, pandas par n - 1 : le même mot « écart-type » ne donne pas le même nombre.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Par défaut, `np.std` et `np.var` divisent par **n** (écart-type de la population, `ddof=0`), alors que pandas divise par **n - 1** (`ddof=1`, estimation à partir d'un échantillon). Sur de petits échantillons la différence est visible. Quand vous comparez deux résultats, vérifiez ce paramètre avant de chercher une erreur ailleurs.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "`prets` contient le nombre de prêts de six jours (valeurs inventées). Calculez `normalises`, la **mise à l'échelle min-max** : chaque valeur devient `(valeur - minimum) / (maximum - minimum)`, si bien que le minimum vaut 0 et le maximum 1. Écrivez-le sans boucle et sans modifier `prets`.",
      setup: lines("import numpy as np", "prets = np.array([12, 15, 9, 21, 18, 15])"),
      starter: "normalises = None",
      solution: lines(
        "normalises = (prets - prets.min()) / (prets.max() - prets.min())",
        "print(normalises)",
      ),
      test: lines(
        "assert isinstance(normalises, np.ndarray), f\"normalises doit être un tableau NumPy (vous avez {type(normalises).__name__})\"",
        "assert normalises.shape == (6,), f\"normalises doit avoir 6 valeurs (forme obtenue : {normalises.shape})\"",
        "assert np.isclose(normalises.min(), 0) and np.isclose(normalises.max(), 1), f\"le minimum doit valoir 0 et le maximum 1 (vous avez {normalises.min()} et {normalises.max()})\"",
        "assert np.allclose(normalises, [0.25, 0.5, 0.0, 1.0, 0.75, 0.5]), f\"valeurs attendues [0.25, 0.5, 0, 1, 0.75, 0.5] (vous avez {normalises})\"",
        "assert prets.tolist() == [12, 15, 9, 21, 18, 15], \"prets ne doit pas être modifié\"",
      ),
      hint: "(prets - prets.min()) calcule tous les écarts au minimum d'un coup ; divisez ensuite par prets.max() - prets.min().",
    },
    {
      kind: "text",
      md: `### Le broadcasting : opérer sur des formes différentes

Que se passe-t-il quand on additionne un tableau de forme \`(2, 3)\` et un tableau de forme \`(3,)\` ? NumPy « étend » le plus petit pour l'accorder au plus grand, **sans en recopier les données**. Les règles :

1. on aligne les formes **par la droite** (le dernier axe avec le dernier axe) ; une forme plus courte est complétée par des 1 à gauche ;
2. deux dimensions sont compatibles si elles sont **égales** ou si l'une d'elles vaut **1** ;
3. la dimension de taille 1 est alors répétée pour atteindre l'autre.

Si une paire de dimensions n'est ni égale ni égale à 1, NumPy lève une \`ValueError\`. Le schéma ci-dessous détaille un exemple et quelques cas compatibles ou non.`,
    },
    { kind: "widget", widget: "numpy-broadcasting" },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "m = np.array([[1, 2, 3], [4, 5, 6]])",
        "v = np.array([10, 20, 30])",
        "print('m + v    :', (m + v).tolist(), (m + v).shape)",
        "",
        "colonne = np.array([[100], [200]])",
        "print('forme de colonne :', colonne.shape)",
        "print('m + colonne :', (m + colonne).tolist())",
        "print('colonne + v :', (colonne + v).tolist(), (colonne + v).shape)",
        "",
        "x = np.ones((3, 4))",
        "y = np.ones(3)",
        "try:",
        "    x + y",
        "except ValueError as erreur:",
        "    print('erreur :', erreur)",
        "print('corrigé avec y[:, np.newaxis] :', (x + y[:, np.newaxis]).shape)",
      ),
      caption: "(3, 4) + (3,) échoue : les derniers axes, 4 et 3, ne sont ni égaux ni égaux à 1. Passer y en colonne, de forme (3, 1), rend l'opération possible.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Le cas le plus utile en analyse de données : **centrer des colonnes**. Si `X` a la forme `(n_lignes, n_colonnes)`, alors `X.mean(axis=0)` a la forme `(n_colonnes,)` et `X - X.mean(axis=0)` soustrait à chaque colonne sa propre moyenne, sans boucle. Pour centrer **par ligne**, il faut garder l'axe : `X - X.mean(axis=1, keepdims=True)`, car la forme `(n_lignes, 1)` s'accorde à `(n_lignes, n_colonnes)`.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "`notes` contient les notes de 4 élèves (lignes) à 3 contrôles (colonnes), valeurs inventées. Calculez `centrees` : le tableau où l'on a retiré à chaque colonne **sa propre moyenne**, en une seule expression et sans boucle. Les moyennes des colonnes de `centrees` doivent alors valoir 0.",
      setup: lines(
        "import numpy as np",
        "notes = np.array([[12.0, 14.0, 9.0], [15.0, 11.0, 13.0], [8.0, 16.0, 10.0], [17.0, 15.0, 12.0]])",
      ),
      starter: "centrees = None",
      solution: lines(
        "centrees = notes - notes.mean(axis=0)",
        "print(centrees)",
        "print(centrees.mean(axis=0))",
      ),
      test: lines(
        "assert isinstance(centrees, np.ndarray), f\"centrees doit être un tableau NumPy (vous avez {type(centrees).__name__})\"",
        "assert centrees.shape == (4, 3), f\"centrees doit garder la forme (4, 3) (forme obtenue : {centrees.shape})\"",
        "assert np.allclose(centrees.mean(axis=0), 0), f\"la moyenne de chaque colonne doit valoir 0 (vous avez {centrees.mean(axis=0)})\"",
        "assert np.allclose(centrees, notes - notes.mean(axis=0)), \"vérifiez l'axe : mean(axis=0) donne une moyenne par colonne\"",
      ),
      hint: "notes.mean(axis=0) a la forme (3,) : une moyenne par colonne. La soustraction avec notes, de forme (4, 3), se fait par broadcasting.",
    },
    {
      kind: "text",
      md: `### Copie ou vue ?

Une **vue** est un tableau qui partage ses données avec un autre ; une **copie** a les siennes. La différence compte dès qu'on modifie une valeur :

- une **tranche** (\`a[1:4]\`), \`reshape\` (quand c'est possible) et \`.T\` donnent des **vues** : modifier la vue modifie l'original ;
- un **masque booléen** ou une liste d'indices (\`a[a > 3]\`, \`a[[0, 2]]\`) donne une **copie** ;
- \`.copy()\` force une copie.

\`np.shares_memory(a, b)\` indique si deux tableaux partagent des données.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "a = np.arange(6)",
        "vue = a[1:4]",
        "vue[0] = 99",
        "print('a après modification de la vue :', a)",
        "",
        "copie = a[1:4].copy()",
        "copie[0] = -1",
        "print('a après modification de la copie :', a)",
        "",
        "grands = a[a > 3]",
        "print('tranche partage la mémoire              :', np.shares_memory(a, vue))",
        "print('copie partage la mémoire                :', np.shares_memory(a, copie))",
        "print('sélection par masque partage la mémoire :', np.shares_memory(a, grands))",
      ),
      caption: "La première modification (faite sur une tranche) a changé a en position 1 ; la seconde, faite sur une copie, ne l'a pas touché. Un masque donne lui aussi une copie.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le piège classique : on découpe un morceau d'un tableau, on le « nettoie » ou on le modifie, et l'original change aussi sans qu'on l'ait voulu. Si vous voulez travailler sur une version indépendante, écrivez `.copy()` explicitement. À l'inverse, ne copiez pas par réflexe de gros tableaux : une copie coûte de la mémoire et du temps.",
    },
    {
      kind: "text",
      md: `### Un peu d'algèbre linéaire

Deux opérateurs à ne pas confondre : \`*\` multiplie **élément par élément**, \`@\` fait le **produit matriciel** (lignes de la première matrice par colonnes de la seconde). \`.T\` transpose. Le sous-module \`np.linalg\` offre \`det\` (déterminant), \`inv\` (inverse) et \`solve\` (résolution d'un système \`A x = b\`).

Pour résoudre un système, \`np.linalg.solve(A, b)\` est préférable à \`inv(A) @ b\` : il est plus précis et ne calcule pas l'inverse inutilement. Comme toujours en virgule flottante, un résultat qui devrait être exactement 0 ou 1 est souvent proche à l'arrondi près.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "A = np.array([[1, 2], [3, 4]])",
        "B = np.array([[5, 6], [7, 8]])",
        "print('A * B (élément par élément) :')",
        "print(A * B)",
        "print('A @ B (produit matriciel) :')",
        "print(A @ B)",
        "print('transposée de A :')",
        "print(A.T)",
        "",
        "print('déterminant :', np.linalg.det(A))",
        "print('inverse :')",
        "print(np.linalg.inv(A))",
        "print('A @ inverse, arrondi :')",
        "print((A @ np.linalg.inv(A)).round(10))",
        "",
        "# résoudre  x + 2y = 5  et  3x + 4y = 11",
        "print('solution :', np.linalg.solve(A, np.array([5, 11])))",
      ),
      caption: "Le déterminant devrait valoir exactement -2 : l'affichage montre l'écart d'arrondi. A @ inverse donne la matrice identité, à l'arrondi près.",
    },
    {
      kind: "text",
      md: `### Application : nettoyer une série de mesures

Un capteur de température a produit neuf relevés (valeurs inventées) : deux manquent, représentés par \`np.nan\` (*not a number*), et un autre semble absurde. Les outils de ce module suffisent à l'examiner : \`np.isnan\` repère les valeurs manquantes, \`~\` les écarte, et la **règle de l'écart interquartile** signale les valeurs très éloignées du centre. Elle déclare « inhabituelle » toute valeur située à plus de 1,5 fois l'écart interquartile en dessous du premier quartile ou au-dessus du troisième.

Cette règle est une **convention**, pas une vérité : une valeur signalée n'est pas forcément une erreur (ce peut être un vrai événement), et il faut chercher la cause avant de la supprimer.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "mesures = np.array([20.1, 20.4, np.nan, 19.8, 20.2, 99.9, 20.0, np.nan, 20.3])",
        "manquantes = np.isnan(mesures)",
        "print('positions manquantes :', np.where(manquantes)[0])",
        "print('moyenne naïve (nan se propage) :', mesures.mean())",
        "print('moyenne en ignorant les nan    :', np.nanmean(mesures))",
        "",
        "propres = mesures[~manquantes]",
        "q1, q3 = np.percentile(propres, [25, 75])",
        "iqr = q3 - q1",
        "bas, haut = q1 - 1.5 * iqr, q3 + 1.5 * iqr",
        "print('bornes :', round(bas, 2), round(haut, 2))",
        "suspectes = propres[(propres < bas) | (propres > haut)]",
        "print('valeurs suspectes :', suspectes)",
        "print('moyenne sans la valeur suspecte :', propres[(propres >= bas) & (propres <= haut)].mean())",
      ),
      caption: "Un NaN contamine tout calcul qui le touche (la moyenne devient nan) ; np.nanmean l'ignore. Une seule valeur extrême tire fortement la moyenne.",
    },
    {
      kind: "text",
      md: `### Application : relier deux séries

Pour mesurer si deux séries varient ensemble, \`np.corrcoef(x, y)\` renvoie la matrice de corrélation (la case \`[0, 1]\` est le coefficient de Pearson) et \`np.polyfit(x, y, 1)\` ajuste une droite \`y = pente × x + ordonnée\`. Les données ci-dessous sont **inventées** et très peu nombreuses : elles servent à manipuler les fonctions, pas à conclure quoi que ce soit.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "# six jours : température (°C) et glaces vendues. Valeurs inventées.",
        "temperature = np.array([15, 20, 25, 30, 35, 40])",
        "glaces = np.array([50, 75, 100, 150, 200, 250])",
        "",
        "r = np.corrcoef(temperature, glaces)[0, 1]",
        "pente, ordonnee = np.polyfit(temperature, glaces, 1)",
        "print('corrélation :', round(r, 3))",
        "print(f'droite : glaces = {pente:.2f} x température {ordonnee:+.2f}')",
        "print('prévision pour 28 °C :', round(pente * 28 + ordonnee, 1))",
      ),
      caption: "Un coefficient proche de 1 dit que les deux séries croissent ensemble sur ces six points. Il ne dit rien sur la cause, et une prévision hors de la plage observée est une extrapolation fragile.",
    },
    {
      kind: "note",
      tone: "info",
      md: "**À retenir.** Un tableau NumPy a un type unique et une forme. On calcule sur le tableau entier plutôt que par boucle ; `axis` désigne l'axe qui disparaît ; le broadcasting accorde des formes qui s'alignent par la droite ; une tranche est une vue, un masque une copie. Ces notions reviennent presque à l'identique dans pandas, scikit-learn et Matplotlib.",
    },
  ],
  quiz: [
    {
      question: "Que renvoie `np.array([1, 2, 3]) * 2` ?",
      options: ["[1, 2, 3, 1, 2, 3]", "Une erreur de type", "[2, 4, 6]", "[1, 2, 3, 2]"],
      correct: 2,
      explanation:
        "Sur un tableau NumPy, l'opérateur * s'applique à chaque élément : on obtient [2, 4, 6]. C'est sur une liste Python que * répète les éléments.",
    },
    {
      question: "Un tableau `m` a la forme (4, 5). Quelle est la forme de `m.mean(axis=0)` ?",
      options: ["(5,)", "(4,)", "(4, 5)", "() : un seul nombre"],
      correct: 0,
      explanation:
        "L'axe indiqué disparaît : en supprimant l'axe 0 (les 4 lignes), il reste une valeur par colonne, donc 5 valeurs et la forme (5,).",
    },
    {
      question: "Parmi ces additions, laquelle échoue avec une ValueError ?",
      options: ["(3, 4) + (4,)", "(3, 1) + (1, 4)", "(3, 4) + (3,)", "(3, 4) + (1, 4)"],
      correct: 2,
      explanation:
        "Les formes s'alignent par la droite : 4 et 3 ne sont ni égaux ni égaux à 1, donc (3, 4) + (3,) est refusé. Il faudrait passer le second tableau en colonne, de forme (3, 1).",
    },
    {
      question: "On écrit `b = a[1:4]` puis `b[0] = 99`. Qu'arrive-t-il à `a` ?",
      options: [
        "Rien : b est une copie indépendante",
        "Python signale une erreur",
        "a est entièrement remplacé par b",
        "a[1] vaut aussi 99, car une tranche est une vue sur les mêmes données",
      ],
      correct: 3,
      explanation:
        "Une tranche partage la mémoire du tableau d'origine : la modifier modifie l'original. Pour une version indépendante, il faut écrire a[1:4].copy().",
    },
    {
      question: "Quelle différence entre `A * B` et `A @ B` pour deux matrices ?",
      options: [
        "Aucune, ce sont deux écritures du même calcul",
        "* multiplie élément par élément, @ calcule le produit matriciel",
        "* est le produit matriciel, @ est élément par élément",
        "@ ne fonctionne que sur des matrices carrées",
      ],
      correct: 1,
      explanation:
        "A * B associe les éléments situés à la même position. A @ B est le produit matriciel (lignes de A par colonnes de B), qui exige que le nombre de colonnes de A égale le nombre de lignes de B.",
    },
  ],
};
