import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const moduleRPremiersPas: LessonModule = {
  id: "premiers-pas",
  title: "Premiers pas : vecteurs et tableaux",
  duration: "2 h",
  summary: "Lire du code R en s'appuyant sur ce que l'on sait de Python : vecteurs, indices qui commencent à 1, valeurs manquantes, vectorisation, tableaux de données et facteurs. Le code R est à lire ; son équivalent Python s'exécute dans la page.",
  objectives: [
    "Lire du code R simple (affectation, vecteurs, data.frame) en le rapprochant de son équivalent NumPy et pandas",
    "Traduire les indices de R, qui commencent à 1, vers ceux de Python, qui commencent à 0, y compris les indices négatifs",
    "Distinguer valeur manquante (NA en R, NaN en pandas) et résultat d'un calcul qui l'ignore ou non",
    "Rapprocher un facteur de R d'une catégorie pandas, avec ses niveaux et leur ordre",
  ],
  sections: [
    {
      kind: "text",
      md: `### R et Python : lire l'un avec les yeux de l'autre

**R** est un langage créé pour les statistiques : on y trouve, dès l'installation, les tableaux de données, les tests, les régressions et les graphiques. **Python** est un langage généraliste qui a acquis les mêmes capacités grâce à des bibliothèques (NumPy, pandas, SciPy, statsmodels, Matplotlib). Beaucoup d'équipes en utilisent les deux, et il est fréquent de devoir lire le code de l'autre.

Ce cours est construit sur un principe d'honnêteté. **Le moteur de ce site ne contient pas R** : le code R est donc montré pour être *lu*, dans des blocs marqués « R », et il ne s'exécute pas ici. À côté, on écrit l'**équivalent en Python**, qui tourne réellement dans votre navigateur ; toutes les sorties affichées viennent de ce code Python. Quand on affirme qu'une fonction de R calcule la même chose qu'une fonction de Python (la moyenne, par exemple), c'est que la définition mathématique est la même, pas que l'on a lancé R.

Pour pratiquer R lui-même, il faut l'installer sur sa machine (c'est un logiciel libre) ou utiliser un environnement en ligne. Le cours vous apprend surtout à **comprendre et à traduire**, ce qui sert dans les deux sens.`,
    },
    {
      kind: "text",
      md: `### Affectation et vecteurs

En R, on range une valeur dans un nom avec la flèche \`<-\` (le signe \`=\` fonctionne aussi, mais la flèche est l'usage). Et surtout, **tout est vecteur** : un nombre seul est un vecteur de longueur 1. On construit un vecteur avec \`c()\` (*combine*).

\`\`\`r
# Code R à lire : il ne s'exécute pas dans le moteur du site
temperatures <- c(12.5, 8.0, 15.0, 9.5, 11.0)

length(temperatures)        # nombre d'éléments
temperatures[1]             # le PREMIER élément
temperatures[2:4]           # éléments 2, 3 et 4 (la borne de fin est incluse)
temperatures[-1]            # tout SAUF le premier
tail(temperatures, 1)       # le dernier
temperatures * 9 / 5 + 32   # opération sur tout le vecteur, sans boucle
temperatures[temperatures > 10]   # filtre par une condition
mean(temperatures)
\`\`\`

Les différences de fond avec Python sont de trois ordres :

- **les indices commencent à 1**, et \`2:4\` désigne les éléments 2, 3 **et 4** ;
- **un indice négatif retire** l'élément : \`x[-1]\` signifie « tout sauf le premier », alors qu'en Python \`x[-1]\` est le dernier ;
- **la vectorisation est la règle** : une opération s'applique à tous les éléments. NumPy fait de même, là où une liste Python pure demanderait une boucle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "temperatures = np.array([12.5, 8.0, 15.0, 9.5, 11.0])",
        "print('longueur :', len(temperatures))",
        "print('premier (R : t[1]) :', temperatures[0])",
        "print('éléments 2 à 4 (R : t[2:4]) :', temperatures[1:4])",
        "print('sans le premier (R : t[-1]) :', temperatures[1:])",
        "print('dernier (R : tail(t, 1)) :', temperatures[-1])",
        "print('en Fahrenheit :', temperatures * 9 / 5 + 32)",
        "print('plus de 10 degrés :', temperatures[temperatures > 10])",
        "print('moyenne :', temperatures.mean())",
        "",
        "# R répète le vecteur court pour compléter le long (recyclage) : c(1, 2, 3, 4) + c(10, 20)",
        "# donne 11 22 13 24. NumPy refuse, sauf si on répète soi-même.",
        "print('recyclage à la main :', np.array([1, 2, 3, 4]) + np.tile([10, 20], 2))",
        "try:",
        "    np.array([1, 2, 3, 4]) + np.array([10, 20])",
        "except ValueError as erreur:",
        "    print('NumPy refuse :', erreur)",
      ),
      caption: "Les cinq températures ont pour moyenne 11,2. Les indices de R (1 à 5) deviennent 0 à 4 en Python : la tranche 1:4 de Python donne les éléments 8, 15 et 9,5, soit les positions 2 à 4 de R. Le recyclage de R est pratique mais silencieux ; NumPy préfère une erreur, ce qui évite des résultats faux sans prévenir.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Voici le vecteur `ventes` de six valeurs. Le code R `ventes[3:5]` désigne les éléments 3, 4 et 5, et `ventes[-2]` retire le deuxième élément. Rangez dans `milieu` l'équivalent Python du premier, et dans `sans_deuxieme` celui du second (un vecteur de cinq valeurs).",
      setup: lines(
        "import numpy as np",
        "ventes = np.array([30, 45, 28, 52, 41, 36])",
      ),
      starter: lines(
        "milieu = ventes[3:5]",
        "sans_deuxieme = ventes[-2]",
      ),
      solution: lines(
        "milieu = ventes[2:5]",
        "sans_deuxieme = np.delete(ventes, 1)",
        "print(milieu, sans_deuxieme)",
      ),
      test: lines(
        "assert np.array_equal(milieu, [28, 52, 41]), f\"R lit les positions 3, 4 et 5, soit 28, 52, 41 ; en Python elles sont aux indices 2, 3 et 4 : ventes[2:5] (vous avez {list(milieu)})\"",
        "assert np.ndim(sans_deuxieme) == 1, \"sans_deuxieme doit rester un vecteur : ventes[-2] en Python est l'avant-dernier élément, pas un retrait\"",
        "assert np.array_equal(sans_deuxieme, [30, 28, 52, 41, 36]), f\"il faut retirer le deuxième élément (45, à l'indice 1) : np.delete(ventes, 1) ; vous avez {list(np.atleast_1d(sans_deuxieme))}\"",
      ),
      hint: "Position R = indice Python + 1. Pour retirer un élément, np.delete(vecteur, indice) en renvoie une copie.",
    },
    {
      kind: "text",
      md: `### Les valeurs manquantes : NA

Dans les données réelles, il manque des valeurs. R a une valeur spéciale pour cela, **\`NA\`** (*not available*), qui existe pour tous les types : nombres, texte, booléens. Elle est **contagieuse** : une opération qui touche un \`NA\` donne \`NA\`, car on ne peut pas savoir le résultat. Pour calculer malgré tout, on demande d'ignorer les manquants.

\`\`\`r
# Code R à lire
mesures <- c(4, NA, 7)

mean(mesures)                 # NA : un manquant contamine la moyenne
mean(mesures, na.rm = TRUE)   # 5.5 : on ignore le manquant (na.rm = remove NA)
is.na(mesures)                # FALSE TRUE FALSE
sum(is.na(mesures))           # nombre de manquants
\`\`\`

En Python, la situation est moins uniforme : NumPy et pandas représentent un nombre manquant par **\`NaN\`** (*not a number*, un flottant spécial), alors que \`None\` est l'absence de valeur du langage. Le piège est que **la plupart des fonctions de pandas ignorent déjà les manquants** (\`skipna=True\` par défaut), alors que celles de NumPy les propagent, comme R. Autre piège : \`NaN\` n'est égal à rien, pas même à lui-même, donc on le teste avec \`np.isnan\` ou \`.isna()\`, jamais avec \`==\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "",
        "mesures = np.array([4.0, np.nan, 7.0])",
        "print('numpy mean :', mesures.mean(), ' (R : mean(x))')",
        "print('numpy nanmean :', np.nanmean(mesures), ' (R : mean(x, na.rm = TRUE))')",
        "print('pandas mean :', pd.Series(mesures).mean(), ' (ignore les manquants par défaut)')",
        "print('is.na :', np.isnan(mesures), ' nombre :', int(np.isnan(mesures).sum()))",
        "",
        "print('nan == nan :', np.nan == np.nan)",
        "print('nan + 1 :', np.nan + 1)",
        "",
        "# pandas range None en NaN dans une colonne de nombres",
        "serie = pd.Series([4, None, 7])",
        "print('type :', serie.dtype, ' manquants :', int(serie.isna().sum()))",
      ),
      caption: "La moyenne NumPy de [4, NaN, 7] est NaN, comme celle de R sans na.rm ; ignorer le manquant donne 5,5, de même chez pandas. La comparaison nan == nan est fausse. Une colonne qui contient None devient de type float64, ce qui permet de loger NaN.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`notes` est un vecteur de six notes dont certaines manquent (`np.nan`). Rangez dans `moyenne` la moyenne des notes **présentes** (équivalent de `mean(notes, na.rm = TRUE)`) et dans `nb_manquantes` le nombre de notes manquantes (équivalent de `sum(is.na(notes))`).",
      setup: lines(
        "import numpy as np",
        "notes = np.array([12.0, np.nan, 15.5, 9.0, np.nan, 14.0])",
      ),
      starter: lines(
        "moyenne = notes.mean()",
        "nb_manquantes = 0",
      ),
      solution: lines(
        "moyenne = np.nanmean(notes)",
        "nb_manquantes = int(np.isnan(notes).sum())",
        "print(moyenne, nb_manquantes)",
      ),
      test: lines(
        "assert not np.isnan(moyenne), \"notes.mean() propage le manquant et donne nan : utilisez np.nanmean(notes) pour l'ignorer\"",
        "assert abs(moyenne - np.nanmean(notes)) < 1e-9, f\"la moyenne doit porter sur les 4 notes présentes, pas {moyenne}\"",
        "assert nb_manquantes == 2, f\"il y a 2 notes manquantes : int(np.isnan(notes).sum()), pas {nb_manquantes}\"",
      ),
      hint: "np.nanmean ignore les nan ; np.isnan donne un tableau de booléens que l'on peut sommer.",
    },
    {
      kind: "text",
      md: `### Le tableau de données : data.frame et DataFrame

Le **\`data.frame\`** de R joue le rôle du \`DataFrame\` de pandas : un tableau dont chaque colonne a son type, et dont les colonnes ont un nom. R en fournit plusieurs dès le départ, dont le célèbre jeu \`iris\` : 150 fleurs, quatre mesures et une espèce. On l'explore avec deux fonctions que l'on utilise sans cesse.

\`\`\`r
# Code R à lire
str(iris)        # structure : nombre de lignes, type de chaque colonne
summary(iris)    # résumé : minimum, quartiles, médiane, moyenne, maximum
dim(iris)        # 150 5
head(iris, 3)    # trois premières lignes
iris$Sepal.Length            # une colonne, avec le signe dollar
iris[iris$Species == "setosa", ]   # lignes filtrées ; la virgule laisse toutes les colonnes
\`\`\`

Les équivalents pandas sont \`info()\` pour \`str()\`, \`describe()\` pour \`summary()\`, \`shape\` pour \`dim()\` et \`head()\` identique. Une colonne s'obtient avec \`d["Sepal.Length"]\`, un filtre avec \`d[d["Species"] == "setosa"]\`.

Le jeu \`iris\` de scikit-learn est le même au sens de la source (les fleurs de Fisher, 1936), mais ses colonnes s'appellent \`sepal length (cm)\` et l'espèce est un code 0, 1, 2 : on renomme les colonnes comme en R pour que la comparaison saute aux yeux. Selon la documentation de scikit-learn, quelques mesures du jeu peuvent différer de celles de R : on compare donc la forme, pas le dernier chiffre.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "from sklearn.datasets import load_iris",
        "",
        "brut = load_iris(as_frame=True)",
        "iris = brut.data.copy()",
        "iris.columns = ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']",
        "iris['Species'] = pd.Categorical.from_codes(brut.target, brut.target_names)",
        "",
        "print('dim :', iris.shape)",
        "iris.info()                       # équivalent de str(iris)",
        "print(iris.describe().round(2))   # équivalent (en gros) de summary(iris)",
        "print(iris.head(3))",
      ),
      caption: "150 lignes et 5 colonnes : quatre colonnes de nombres à virgule et une colonne de catégories, sans valeur manquante. La longueur moyenne du sépale est de 5,84 cm, l'écart-type de 0,83. info() est plus proche de str() ; describe() ne résume que les colonnes numériques, alors que summary() de R résume aussi le facteur en comptant ses niveaux.",
    },
    {
      kind: "text",
      md: `### Les facteurs : des catégories avec des niveaux

Quand une colonne contient un petit nombre de valeurs répétées (une espèce, un niveau d'étude), R la stocke en **facteur** (*factor*) : une suite de codes entiers associée à une liste de **niveaux** (*levels*). pandas a le même mécanisme avec le type \`category\`.

\`\`\`r
# Code R à lire
taille <- factor(c("petit", "grand", "moyen", "petit"),
                 levels = c("petit", "moyen", "grand"),
                 ordered = TRUE)
levels(taille)    # "petit" "moyen" "grand"
table(taille)     # comptage par niveau
\`\`\`

Sans l'argument \`levels\`, R range les niveaux dans l'**ordre alphabétique** (grand, moyen, petit), ce qui est rarement ce que l'on veut pour des tailles. Le même soin vaut pour pandas : un type catégoriel *ordonné* permet de comparer (\`petit < grand\`), de trier selon l'ordre voulu, et de tracer les graphiques dans le bon ordre.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "",
        "taille = pd.Categorical(",
        "    ['petit', 'grand', 'moyen', 'petit'],",
        "    categories=['petit', 'moyen', 'grand'],",
        "    ordered=True,",
        ")",
        "print('niveaux :', list(taille.categories))",
        "print('codes   :', list(taille.codes))",
        "print(pd.Series(taille).value_counts(sort=False).to_dict())",
        "print('petit < grand ?', taille[0] < taille[1])",
        "",
        "# sans l'argument categories, l'ordre est alphabétique",
        "print('ordre par défaut :', list(pd.Categorical(['petit', 'grand', 'moyen']).categories))",
      ),
      caption: "Les codes (0, 2, 1, 0) renvoient aux niveaux dans l'ordre choisi ; avec l'ordre alphabétique par défaut, grand viendrait avant moyen et petit. Les codes de pandas commencent à 0, ceux de R à 1.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`reponses` contient les réponses d'un sondage. Construisez `niveau`, un `pd.Categorical` **ordonné** de ces réponses avec les niveaux dans l'ordre `faible`, `moyen`, `fort` (équivalent de `factor(reponses, levels = c(\"faible\", \"moyen\", \"fort\"), ordered = TRUE)`). Rangez dans `nb_fort` le nombre de réponses « fort ».",
      setup: lines(
        "import pandas as pd",
        "reponses = ['moyen', 'fort', 'faible', 'fort', 'moyen', 'moyen', 'fort']",
      ),
      starter: lines(
        "niveau = pd.Categorical(reponses)",
        "nb_fort = 0",
      ),
      solution: lines(
        "niveau = pd.Categorical(reponses, categories=['faible', 'moyen', 'fort'], ordered=True)",
        "nb_fort = int((niveau == 'fort').sum())",
        "print(list(niveau.categories), nb_fort)",
      ),
      test: lines(
        "assert list(niveau.categories) == ['faible', 'moyen', 'fort'], f\"les niveaux doivent suivre l'ordre faible, moyen, fort (categories=[...]), pas {list(niveau.categories)}\"",
        "assert niveau.ordered, \"le facteur doit être ordonné : ordered=True\"",
        "assert nb_fort == 3, f\"il y a 3 réponses « fort », pas {nb_fort}\"",
      ),
      hint: "pd.Categorical(valeurs, categories=[...], ordered=True). Comparer un Categorical à une chaîne donne un tableau de booléens que l'on peut sommer.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Aide-mémoire : `<-` affecte, `c()` construit un vecteur, `x[i]` compte à partir de 1, `x[-i]` retire, `NA` est un manquant que l'on ignore avec `na.rm = TRUE`, `factor()` fixe les niveaux (donnez `levels` si l'ordre compte), `str()` et `summary()` se traduisent par `info()` et `describe()`. Quand un code R vous surprend, vérifiez d'abord ces six points.",
    },
  ],
  quiz: [
    {
      question: "En R, que renvoie x[-1] si x est un vecteur de cinq nombres ?",
      options: [
        "Le dernier élément",
        "Une erreur, car un indice ne peut pas être négatif",
        "Le vecteur privé de son premier élément, soit quatre nombres",
        "Le premier élément",
      ],
      correct: 2,
      explanation: "Un indice négatif retire l'élément en R. C'est l'inverse de Python, où x[-1] est le dernier élément : en traduisant, x[1:] garde tout sauf le premier.",
    },
    {
      question: "Quel code Python correspond à temperatures[2:4] en R ?",
      options: [
        "temperatures[2:4]",
        "temperatures[1:3]",
        "temperatures[2:5]",
        "temperatures[1:4]",
      ],
      correct: 3,
      explanation: "R compte à partir de 1 et inclut la borne de fin : les positions 2, 3 et 4 sont aux indices 1, 2 et 3 de Python. La tranche Python exclut sa fin, donc 1:4.",
    },
    {
      question: "mesures = np.array([4.0, np.nan, 7.0]). Pourquoi mesures.mean() donne-t-il nan ?",
      options: [
        "Parce que NumPy ne sait pas calculer une moyenne",
        "Parce que le tableau contient un manquant et que NumPy le propage, comme R sans na.rm ; np.nanmean l'ignore",
        "Parce que la moyenne de 4 et 7 est nan",
        "Parce que le type du tableau est mauvais",
      ],
      correct: 1,
      explanation: "Un calcul qui touche un nan donne nan. R se comporte ainsi avec NA, et se corrige avec na.rm = TRUE ; en NumPy on utilise np.nanmean. pandas, lui, ignore les manquants par défaut.",
    },
    {
      question: "Comment tester qu'une valeur x est NaN en Python ?",
      options: [
        "x == np.nan",
        "x is None",
        "np.isnan(x), car nan n'est égal à rien, pas même à lui-même",
        "x < 0",
      ],
      correct: 2,
      explanation: "La comparaison nan == nan est fausse, donc x == np.nan ne détecte jamais rien. np.isnan (ou .isna() dans pandas) est le bon test, l'équivalent de is.na() en R.",
    },
    {
      question: "Quel est le piège quand on crée un factor() en R sans l'argument levels ?",
      options: [
        "Les niveaux sont rangés dans l'ordre alphabétique, ce qui peut ne pas être l'ordre voulu",
        "R refuse de créer le facteur",
        "Les niveaux sont rangés au hasard",
        "Le facteur devient un nombre",
      ],
      correct: 0,
      explanation: "Par défaut, les niveaux sont triés par ordre alphabétique : grand, moyen, petit. Pour des tailles ou des niveaux ordonnés, on donne levels (et ordered = TRUE), comme categories et ordered=True en pandas.",
    },
  ],
};
