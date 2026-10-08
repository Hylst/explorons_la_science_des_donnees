import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Tableau de prêts partagé par le module : titres d'œuvres réelles, mais prêts, adhérents et durées INVENTÉS pour le cours.
 * Les exemples qui le réutilisent le reçoivent par `setup` (son code est montré en entier dans le premier exemple).
 */
const EMPRUNTS = `import pandas as pd

emprunts = pd.DataFrame({
    'titre': [
        'Les Misérables', "L'Étranger", 'Notre-Dame de Paris', 'Le Petit Prince',
        'Matilda', 'Dune', 'Fondation', 'Tintin au Tibet',
        'Astérix le Gaulois', 'Une brève histoire du temps',
        'Vingt mille lieues sous les mers', 'Le Horla',
    ],
    'categorie': [
        'roman', 'roman', 'roman', 'jeunesse',
        'jeunesse', 'science-fiction', 'science-fiction', 'bande dessinée',
        'bande dessinée', 'documentaire', 'science-fiction', 'roman',
    ],
    'adherent': [101, 102, 103, 104, 104, 101, 105, 104, 102, 103, 101, 102],
    'date_emprunt': [
        '2026-01-05', '2026-01-12', '2026-01-19', '2026-02-02',
        '2026-02-09', '2026-02-16', '2026-02-23', '2026-03-02',
        '2026-03-09', '2026-03-16', '2026-03-23', '2026-03-30',
    ],
    'duree_jours': [28, 14, 21, 7, 10, 35, 21, 5, 6, 30, 42, 12],
})`;

/** Table des adhérents : l'adhérent 105 (prêt de Fondation) en est absent, et l'adhérent 106 n'a rien emprunté */
const ADHERENTS = `adherents = pd.DataFrame({
    'adherent': [101, 102, 103, 104, 106],
    'prenom': ['Camille', 'Noé', 'Inès', 'Louis', 'Jade'],
    'tranche_age': ['adulte', 'adulte', '65 ans et plus', 'moins de 18 ans', 'adulte'],
})`;

export const module5: LessonModule = {
  id: "module-5",
  title: "pandas : manipuler des tableaux de données",
  duration: "3 h",
  summary:
    "Lire un tableau de données avec pandas : Series et DataFrame, sélection, filtrage, nouvelles colonnes, valeurs manquantes traitées avec discernement, tri, regroupements, fusion de tables, dates et lecture de CSV.",
  objectives: [
    "Distinguer une Series d'un DataFrame et créer un DataFrame à partir d'un dictionnaire",
    "Explorer un tableau (head, info, describe) et en sélectionner colonnes et lignes (loc, iloc, filtres)",
    "Créer des colonnes calculées, trier, compter et regrouper (groupby et agg)",
    "Traiter les valeurs manquantes en justifiant son choix, et fusionner deux tables avec merge",
    "Convertir et manipuler des dates, et savoir lire un fichier CSV",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un tableau où chaque colonne a son type

Avec NumPy, un tableau n'a qu'un seul type. Or un tableau de données réel mélange des textes (un titre), des nombres (une durée), des dates, et ses lignes et colonnes ont des **noms**. **pandas** est construit sur NumPy pour manipuler ce genre de tableau, avec deux structures :

- la **Series** : une colonne de valeurs, avec un **index** qui donne une étiquette à chaque valeur ;
- le **DataFrame** : un tableau à deux dimensions, c'est-à-dire un ensemble de Series qui partagent le même index. Chaque colonne a son propre type.

Pour tout le module, nous travaillons sur des prêts d'une médiathèque. Les **titres sont ceux d'œuvres réelles, mais les prêts, les adhérents et les durées sont inventés** pour l'occasion.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "",
        "durees = pd.Series(",
        "    [28, 35, 10, 7],",
        "    index=['Les Misérables', 'Dune', 'Matilda', 'Le Petit Prince'],",
        "    name='duree_jours',",
        ")",
        "print(durees)",
        "print('Dune :', durees['Dune'])",
        "print('moyenne :', durees.mean())",
        "print('plus longue durée :', durees.idxmax())",
        "print(durees[durees > 20])",
        "",
        "autres = pd.Series({'Dune': 3, 'Matilda': 1, 'Fondation': 2})",
        "print(durees + autres)",
      ),
      caption: "L'addition de deux Series associe les valeurs par étiquette, pas par position : une étiquette absente d'un côté donne NaN (valeur manquante).",
    },
    {
      kind: "text",
      md: `### Créer un DataFrame

Le moyen le plus lisible : un **dictionnaire** dont les clés sont les noms de colonnes et les valeurs des listes de même longueur. L'index par défaut est numéroté à partir de 0. Trois instructions donnent un premier aperçu : \`head()\` (les premières lignes), \`shape\` (nombre de lignes et de colonnes) et \`dtypes\` (le type de chaque colonne).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        EMPRUNTS,
        "",
        "print(emprunts.head())",
        "print('forme :', emprunts.shape)",
        "print(emprunts.dtypes)",
        "print('version de pandas dans l\\'éditeur :', pd.__version__)",
      ),
      caption: "Voici le tableau emprunts, utilisé dans tout le module (les exemples suivants le reçoivent déjà créé). Les colonnes de texte apparaissent avec le type str.",
    },
    {
      kind: "text",
      md: "Le schéma ci-dessous montre la même idée sur un autre petit tableau, de personnes cette fois (exemple distinct, valeurs inventées). Cliquez sur un nom de colonne ou sur une ligne pour voir comment on y accède.",
    },
    { kind: "widget", widget: "pandas-dataframe" },
    {
      kind: "text",
      md: `### Explorer un tableau

Avant tout calcul, on regarde les données :

- \`head(n)\` et \`tail(n)\` : les \`n\` premières et dernières lignes ;
- \`info()\` : nombre de lignes, type de chaque colonne, nombre de valeurs **non manquantes** (il écrit son résultat directement, ne l'entourez pas de \`print\`) ;
- \`describe()\` : effectif, moyenne, écart-type, minimum, quartiles et maximum des colonnes **numériques**.

Un résumé n'est qu'un résumé : une moyenne ne dit rien de la forme de la distribution.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "emprunts.info()",
        "print(emprunts.describe())",
        "print(emprunts['categorie'].describe())",
      ),
      caption: "describe() ignore les colonnes de texte par défaut. Remarquez qu'il résume aussi adherent, qui est un numéro d'identification : sa moyenne n'a aucun sens. Un type numérique ne garantit pas qu'un calcul soit pertinent. Sur une colonne de texte, describe donne le nombre de valeurs, de valeurs distinctes et la plus fréquente.",
    },
    {
      kind: "note",
      tone: "info",
      md: "L'éditeur du site utilise **pandas 3.0**. Deux changements de cette version sont visibles dans le cours : les colonnes de texte ont un type dédié, `str` (c'était `object` avant), et la **copie sur écriture** est la règle : un tableau obtenu à partir d'un autre se comporte comme une copie indépendante. Si vous lisez du code écrit pour pandas 1 ou 2, ces deux points expliquent la plupart des différences.",
    },
    {
      kind: "text",
      md: `### Sélectionner des colonnes et des lignes

- \`df['titre']\` renvoie **une colonne**, sous forme de Series ; \`df[['titre', 'categorie']]\` (double crochet) renvoie **un DataFrame** de deux colonnes.
- \`df.loc[lignes, colonnes]\` sélectionne **par étiquette** : la borne de fin d'une tranche est **incluse**.
- \`df.iloc[lignes, colonnes]\` sélectionne **par position** (à partir de 0) : la borne de fin est **exclue**, comme pour les listes.

Avec un index numéroté de 0, les étiquettes et les positions coïncident, ce qui masque la différence : \`loc[2:4]\` donne trois lignes, \`iloc[2:4]\` en donne deux. Si l'on choisit une colonne comme index (\`set_index\`), \`loc\` accepte ses valeurs.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "print(type(emprunts['titre']).__name__, type(emprunts[['titre']]).__name__)",
        "print(emprunts[['titre', 'duree_jours']].head(3))",
        "",
        "print('loc[2:4]  (fin incluse) :')",
        "print(emprunts.loc[2:4, ['titre', 'categorie']])",
        "print('iloc[2:4] (fin exclue) :')",
        "print(emprunts.iloc[2:4, 0:2])",
        "",
        "par_titre = emprunts.set_index('titre')",
        "print('durée de Dune :', par_titre.loc['Dune', 'duree_jours'])",
      ),
      caption: "Les deux sélections visent les mêmes positions, mais loc retient trois lignes et iloc deux.",
    },
    {
      kind: "text",
      md: `### Filtrer les lignes

Comme avec NumPy, on construit un **masque booléen** (une Series de \`True\`/\`False\`) et on s'en sert comme indice. Les conditions se combinent avec \`&\` (et), \`|\` (ou), \`~\` (non), **chacune entre parenthèses** ; \`and\` et \`or\` ne marchent pas. Quelques méthodes pratiques : \`isin([...])\` (appartient à une liste), \`between(a, b)\` (entre deux bornes, incluses), \`str.contains('texte')\` (contient un motif) et \`query("...")\` qui écrit la condition sous forme de texte.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "masque = emprunts['duree_jours'] > 20",
        "print(masque.head(4).tolist(), '...')",
        "print(emprunts[masque][['titre', 'duree_jours']])",
        "",
        "romans_longs = emprunts[(emprunts['categorie'] == 'roman') & (emprunts['duree_jours'] > 14)]",
        "print(romans_longs[['titre', 'duree_jours']])",
        "",
        "print(emprunts[emprunts['categorie'].isin(['jeunesse', 'bande dessinée'])]['titre'].tolist())",
        "print(emprunts[emprunts['duree_jours'].between(10, 20)]['titre'].tolist())",
        "print(emprunts[emprunts['titre'].str.contains('Petit|Horla')]['titre'].tolist())",
        "print(emprunts.query(\"categorie == 'roman' and duree_jours > 14\")['titre'].tolist())",
        "",
        "try:",
        "    emprunts[(emprunts['categorie'] == 'roman') and (emprunts['duree_jours'] > 14)]",
        "except ValueError as erreur:",
        "    print('erreur avec and :', erreur)",
      ),
      caption: "Les conditions sont combinées avec &, chacune entre parenthèses. Avec and, pandas refuse : il ne sait pas dire si une colonne entière est « vraie ».",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Le DataFrame `emprunts` (colonnes `titre`, `categorie`, `adherent`, `date_emprunt`, `duree_jours`) est déjà créé. Rangez dans `longs_sf` les lignes des prêts de la catégorie `'science-fiction'` dont la durée est **strictement supérieure à 30 jours** : on doit retrouver toutes les colonnes d'origine.",
      setup: EMPRUNTS,
      starter: "longs_sf = None",
      solution: lines(
        "longs_sf = emprunts[(emprunts['categorie'] == 'science-fiction') & (emprunts['duree_jours'] > 30)]",
        "print(longs_sf[['titre', 'duree_jours']])",
      ),
      test: lines(
        "assert isinstance(longs_sf, pd.DataFrame), f\"longs_sf doit être un DataFrame (vous avez {type(longs_sf).__name__})\"",
        "assert list(longs_sf.columns) == list(emprunts.columns), f\"gardez toutes les colonnes (vous avez {list(longs_sf.columns)})\"",
        "assert sorted(longs_sf['titre']) == ['Dune', 'Vingt mille lieues sous les mers'], f\"titres attendus : Dune et Vingt mille lieues sous les mers (vous avez {sorted(longs_sf['titre'])})\"",
      ),
      hint: "Deux conditions entre parenthèses, reliées par & : (emprunts['categorie'] == 'science-fiction') & (emprunts['duree_jours'] > 30).",
    },
    {
      kind: "text",
      md: `### Créer de nouvelles colonnes

Une colonne se crée en lui **affectant** une expression calculée sur d'autres colonnes. Le calcul est vectorisé : pas de boucle. \`clip(lower=0)\` remplace par 0 les valeurs négatives, \`round(1)\` arrondit, et \`np.where(condition, a, b)\` choisit \`a\` ou \`b\` ligne par ligne. \`assign(nom=...)\` fait la même chose en renvoyant un **nouveau** DataFrame, ce qui permet d'enchaîner les opérations. \`rename\` change des noms et \`drop(columns=[...])\` retire des colonnes.

Ici, nous supposons (règle inventée) qu'un prêt dure 28 jours au plus.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "import numpy as np",
        "",
        "emprunts['semaines'] = (emprunts['duree_jours'] / 7).round(1)",
        "emprunts['retard_jours'] = (emprunts['duree_jours'] - 28).clip(lower=0)",
        "emprunts['statut'] = np.where(emprunts['retard_jours'] > 0, 'en retard', 'dans les temps')",
        "print(emprunts[['titre', 'duree_jours', 'semaines', 'retard_jours', 'statut']].head(6))",
        "",
        "autre = emprunts.assign(duree_heures=emprunts['duree_jours'] * 24).drop(columns=['semaines'])",
        "print(list(autre.columns))",
        "print(list(emprunts.columns))",
      ),
      caption: "assign et drop renvoient un nouveau DataFrame : emprunts garde ses colonnes d'origine plus celles qu'on lui a affectées.",
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "romans = emprunts[emprunts['categorie'] == 'roman']",
        "romans['duree_jours'] = 0",
        "print('dans romans    :', romans['duree_jours'].tolist())",
        "print('dans emprunts  :', emprunts['duree_jours'].tolist())",
      ),
      caption: "Avec la copie sur écriture de pandas 3, modifier romans ne touche pas emprunts. Pour modifier le tableau d'origine, on écrit dans emprunts lui-même, par exemple avec emprunts.loc[masque, colonne] = valeur.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Dans du code pour pandas 1 ou 2, vous verrez des messages `SettingWithCopyWarning` et des écritures comme `df['colonne'].fillna(0, inplace=True)`, qui modifiaient parfois le tableau d'origine et parfois non. Avec pandas 3, un tableau dérivé est toujours indépendant, et ces écritures « en chaîne » **ne modifient plus rien** (pandas 3 le signale par un avertissement). Écrivez plutôt `df['colonne'] = df['colonne'].fillna(0)`.",
    },
    {
      kind: "text",
      md: `### Trier et compter

- \`sort_values('colonne')\` trie par une colonne (\`ascending=False\` pour l'ordre décroissant) ; avec une liste de colonnes et une liste d'ordres, on trie sur plusieurs critères. L'index suit les lignes : il n'est pas renuméroté.
- \`nlargest(n, 'colonne')\` donne directement les \`n\` plus grandes valeurs.
- \`value_counts()\` compte les occurrences de chaque valeur d'une colonne, de la plus fréquente à la moins fréquente ; \`normalize=True\` donne des proportions.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "print(emprunts.sort_values('duree_jours', ascending=False)[['titre', 'duree_jours']].head(3))",
        "",
        "tri = emprunts.sort_values(['categorie', 'duree_jours'], ascending=[True, False])",
        "print(tri[['categorie', 'titre', 'duree_jours']].head(5))",
        "",
        "print(emprunts.nlargest(3, 'duree_jours')['titre'].tolist())",
        "print(emprunts['categorie'].value_counts())",
        "print(emprunts['categorie'].value_counts(normalize=True).round(2))",
        "print(emprunts['adherent'].value_counts().sort_index())",
      ),
      caption: "Le tri conserve les numéros de ligne d'origine dans l'index. value_counts classe par fréquence ; sort_index remet les adhérents dans l'ordre de leur numéro.",
    },
    {
      kind: "text",
      md: `### Valeurs manquantes : détecter, puis décider

Une valeur absente est notée \`NaN\` (ou \`NA\`/\`None\`). \`isna()\` repère les valeurs manquantes (\`isna().sum()\` les compte par colonne), \`dropna()\` supprime les lignes concernées, \`fillna(valeur)\` les remplace. Les calculs comme \`mean()\` **ignorent** les NaN par défaut ; ce n'est pas le cas de tous les outils.

Techniquement, c'est simple. La difficulté est de **décider**, et la première question est : *pourquoi la valeur manque-t-elle ?*

- un oubli de saisie, sans lien avec la valeur elle-même : on peut raisonnablement estimer la valeur ;
- une absence qui a un sens : une durée vide parce que le livre **n'est pas encore rendu**. Remplir par une durée typique inventerait une information, et les prêts rendus vite seraient sur-représentés dans les calculs ;
- une absence liée à la valeur (les personnes aux revenus élevés qui ne répondent pas) : aucun remplissage simple ne corrige ce biais.

Chaque option a un coût. **Supprimer** les lignes fait perdre de l'information, parfois beaucoup. **Remplir par 0** fabrique des prêts de zéro jour. **Remplir par la moyenne ou la médiane** conserve les lignes, mais réduit artificiellement la variabilité, puisque toutes les valeurs ajoutées sont identiques. La médiane est moins sensible aux valeurs extrêmes que la moyenne, d'où sa préférence habituelle. Une bonne pratique : garder une colonne indicatrice qui note quelles valeurs ont été remplacées, et écrire le choix fait.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "import numpy as np",
        "",
        "# trois durées « oubliées » à la saisie (suppression volontaire pour l'exemple)",
        "incomplet = emprunts.copy()",
        "incomplet['duree_jours'] = incomplet['duree_jours'].astype(float)",
        "incomplet.loc[[2, 6, 11], 'duree_jours'] = np.nan",
        "",
        "print('manquantes par colonne :')",
        "print(incomplet.isna().sum())",
        "print('lignes avant / après dropna :', len(incomplet), len(incomplet.dropna()))",
        "",
        "mediane = incomplet['duree_jours'].median()",
        "print('médiane des durées connues :', mediane)",
        "print('moyenne des durées connues :', round(incomplet['duree_jours'].mean(), 2))",
        "",
        "par_zero = incomplet['duree_jours'].fillna(0)",
        "par_mediane = incomplet['duree_jours'].fillna(mediane)",
        "print('moyenne après fillna(0)       :', round(par_zero.mean(), 2))",
        "print('moyenne après fillna(médiane) :', round(par_mediane.mean(), 2))",
        "print('écart-type avant / après médiane :', round(incomplet['duree_jours'].std(), 2), round(par_mediane.std(), 2))",
        "",
        "incomplet['duree_manquante'] = incomplet['duree_jours'].isna()",
        "incomplet['duree_jours'] = par_mediane",
        "print(incomplet[['titre', 'duree_jours', 'duree_manquante']].iloc[1:4])",
      ),
      caption: "La moyenne des durées connues est de 19,67 jours. Remplir par 0 la fait chuter à 14,75. Remplir par la médiane la ramène à 18,25, mais resserre la dispersion : l'écart-type passe de 14,13 à 12,32. La colonne duree_manquante garde la trace de ce qui a été remplacé.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Le DataFrame `suivi` contient la durée de prêt de dix adhérents (`duree_jours`), valeurs inventées. Trois durées n'ont pas été saisies (`NaN`) et l'une des valeurs connues est très élevée (90 jours). Calculez `nb_manquantes` (le nombre de durées manquantes), puis **remplacez les durées manquantes de la colonne `duree_jours` par la médiane des durées connues**. Pourquoi pas la moyenne ? Regardez ce qu'elle vaut ici avant de répondre.",
      setup: lines(
        "import numpy as np",
        "import pandas as pd",
        "suivi = pd.DataFrame({",
        "    'adherent': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],",
        "    'duree_jours': [14.0, 21.0, np.nan, 10.0, 7.0, np.nan, 18.0, 90.0, 12.0, np.nan],",
        "})",
      ),
      starter: lines("nb_manquantes = None", "# remplacez ensuite les NaN de suivi['duree_jours'] par la médiane"),
      solution: lines(
        "nb_manquantes = suivi['duree_jours'].isna().sum()",
        "mediane = suivi['duree_jours'].median()",
        "suivi['duree_jours'] = suivi['duree_jours'].fillna(mediane)",
        "print(nb_manquantes, mediane)",
        "print(suivi['duree_jours'].tolist())",
      ),
      test: lines(
        "assert nb_manquantes == 3, f\"il y a 3 durées manquantes (vous avez {nb_manquantes})\"",
        "assert suivi['duree_jours'].isna().sum() == 0, \"il reste des durées manquantes dans suivi['duree_jours']\"",
        "_connues = [14.0, 21.0, 10.0, 7.0, 18.0, 90.0, 12.0]",
        "_rempli = suivi.loc[[2, 5, 9], 'duree_jours'].tolist()",
        "assert _rempli != [sum(_connues) / 7] * 3, \"vous avez rempli par la moyenne (24,57 jours), tirée vers le haut par la valeur de 90 jours : essayez la médiane\"",
        "assert _rempli == [14.0, 14.0, 14.0], f\"la médiane des durées connues vaut 14 : les trois cases doivent valoir 14 (vous avez {_rempli})\"",
        "assert suivi.loc[7, 'duree_jours'] == 90.0, \"les durées connues ne doivent pas changer\"",
      ),
      hint: "suivi['duree_jours'].median() ignore les NaN. Écrivez ensuite suivi['duree_jours'] = suivi['duree_jours'].fillna(mediane).",
    },
    {
      kind: "text",
      md: `### Regrouper : groupby et agg

C'est l'opération la plus courante de l'analyse : couper le tableau en groupes selon les valeurs d'une colonne, calculer quelque chose sur chaque groupe, et rassembler les résultats. On écrit \`df.groupby('colonne')\`, puis la colonne à résumer et la fonction : \`['duree_jours'].mean()\`. Pour plusieurs résumés à la fois, \`agg\` accepte une liste de fonctions, ou des **agrégations nommées** de la forme \`nom=('colonne', 'fonction')\`. \`reset_index()\` ramène la clé de regroupement en colonne ordinaire. Plusieurs clés (\`groupby(['a', 'b'])\`) donnent un résultat par combinaison.

Un conseil de lecture : affichez toujours **l'effectif** de chaque groupe. Une moyenne calculée sur un seul prêt n'est pas une moyenne.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "par_categorie = emprunts.groupby('categorie')['duree_jours']",
        "print(par_categorie.mean())",
        "print(par_categorie.agg(['count', 'mean', 'max']))",
        "",
        "bilan = emprunts.groupby('categorie').agg(",
        "    nb_prets=('titre', 'count'),",
        "    duree_moyenne=('duree_jours', 'mean'),",
        "    duree_max=('duree_jours', 'max'),",
        ").round(1).reset_index()",
        "print(bilan.sort_values('duree_moyenne', ascending=False))",
        "",
        "print(emprunts.groupby(['categorie', 'adherent']).size())",
      ),
      caption: "Le groupe documentaire ne contient qu'un prêt : sa « moyenne » est cette seule valeur. Les noms donnés dans agg (nb_prets...) deviennent les noms de colonnes du résultat.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Calculez `duree_moyenne`, la **durée moyenne de prêt de chaque catégorie**, sous forme de Series (une valeur par catégorie), **triée de la plus longue à la plus courte**.",
      setup: EMPRUNTS,
      starter: "duree_moyenne = None",
      solution: lines(
        "duree_moyenne = emprunts.groupby('categorie')['duree_jours'].mean().sort_values(ascending=False)",
        "print(duree_moyenne)",
      ),
      test: lines(
        "assert isinstance(duree_moyenne, pd.Series), f\"duree_moyenne doit être une Series (vous avez {type(duree_moyenne).__name__})\"",
        "assert list(duree_moyenne.index) == ['science-fiction', 'documentaire', 'roman', 'jeunesse', 'bande dessinée'], f\"ordre attendu : du plus long au plus court prêt moyen (vous avez {list(duree_moyenne.index)})\"",
        "assert abs(duree_moyenne['roman'] - 18.75) < 1e-9, f\"la moyenne des romans vaut 18,75 (vous avez {duree_moyenne['roman']})\"",
      ),
      hint: "emprunts.groupby('categorie')['duree_jours'].mean() donne la moyenne par catégorie ; ajoutez .sort_values(ascending=False) pour trier.",
    },
    {
      kind: "text",
      md: `### Fusionner deux tables avec merge

Les données sont souvent réparties en plusieurs tables : ici, les prêts d'un côté, les informations sur les adhérents de l'autre, reliées par le numéro d'adhérent. \`merge\` joint les deux tables sur une **clé commune**, comme une jointure SQL. Le paramètre \`how\` décide des lignes conservées :

- \`'inner'\` : seulement les clés présentes **dans les deux tables** ;
- \`'left'\` : toutes les lignes de la table de gauche, complétées par NaN quand la clé n'a pas de correspondance à droite ;
- \`'right'\` et \`'outer'\` : de même pour la droite, ou pour l'ensemble.

Deux garde-fous : \`validate='many_to_one'\` vérifie que la clé est bien **unique** dans la table de droite (sinon un prêt serait dupliqué), et \`indicator=True\` ajoute une colonne \`_merge\` qui dit d'où vient chaque ligne. **Comparez toujours le nombre de lignes avant et après.**`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        ADHERENTS,
        "",
        "complet = emprunts.merge(adherents, on='adherent', how='left', validate='many_to_one', indicator=True)",
        "print(complet[['adherent', 'prenom', 'tranche_age', '_merge']])",
        "print('lignes avant / après :', len(emprunts), len(complet))",
        "print('avec inner :', len(emprunts.merge(adherents, on='adherent', how='inner')))",
        "",
        "print(complet.groupby('tranche_age')['duree_jours'].agg(['count', 'mean']))",
      ),
      caption: "L'adhérent 105 n'est pas dans la table adherents : avec left, son prêt est conservé avec des NaN, avec inner il disparaît. groupby ignore les clés manquantes, ce prêt n'apparaît donc dans aucun groupe d'âge.",
    },
    {
      kind: "text",
      md: `### Les dates

Une date lue dans un fichier est d'abord du **texte**. \`pd.to_datetime\` la convertit en vrai type date, ce qui donne accès à l'accesseur \`.dt\` (\`.dt.month\`, \`.dt.year\`, \`.dt.day_name()\`...), aux comparaisons, à la soustraction (qui donne une durée) et au regroupement par période.

Le format ISO (\`2026-03-04\`, année-mois-jour) est sans ambiguïté. Un format comme \`03/04/2026\` ne l'est pas : 3 avril ou 4 mars ? Précisez-le avec \`dayfirst=True\` ou \`format='%d/%m/%Y'\`. Les noms de jour donnés par \`day_name()\` sont en anglais par défaut.`,
    },
    {
      kind: "code",
      language: "python",
      setup: EMPRUNTS,
      code: lines(
        "emprunts['date_emprunt'] = pd.to_datetime(emprunts['date_emprunt'])",
        "emprunts['mois'] = emprunts['date_emprunt'].dt.month",
        "emprunts['jour'] = emprunts['date_emprunt'].dt.day_name()",
        "emprunts['date_retour'] = emprunts['date_emprunt'] + pd.to_timedelta(emprunts['duree_jours'], unit='D')",
        "print(emprunts[['titre', 'date_emprunt', 'jour', 'date_retour']].head(3))",
        "",
        "print(emprunts[emprunts['date_emprunt'] >= '2026-03-01']['titre'].tolist())",
        "print(emprunts.groupby('mois')['duree_jours'].mean().round(1))",
        "",
        "mensuel = emprunts.set_index('date_emprunt')['duree_jours'].resample('MS').agg(['count', 'mean'])",
        "print(mensuel)",
        "",
        "print(pd.to_datetime('03/04/2026'))",
        "print(pd.to_datetime('03/04/2026', dayfirst=True))",
        "print('étendue des emprunts :', (emprunts['date_emprunt'].max() - emprunts['date_emprunt'].min()).days, 'jours')",
      ),
      caption: "Sans précision, pandas lit 03/04/2026 comme le 4 mars (mois en premier) ; avec dayfirst=True, c'est le 3 avril. resample('MS') regroupe par mois, en repérant chaque mois par son premier jour.",
    },
    {
      kind: "text",
      md: `### Lire un fichier CSV

Les données viennent le plus souvent d'un fichier **CSV** (valeurs séparées par un séparateur). \`pd.read_csv\` le charge en DataFrame, et ses options règlent les cas fréquents, notamment en France où le séparateur est souvent \`;\` et la virgule sert de séparateur décimal : \`sep\`, \`decimal\`, \`encoding\`, \`parse_dates\`, \`usecols\`, \`na_values\`.

L'éditeur du site n'a **pas accès à vos fichiers**. On peut en revanche donner à \`read_csv\` un texte enveloppé dans \`io.StringIO\` : il le lit comme s'il s'agissait d'un fichier. C'est pratique pour tester les options. Les données ci-dessous sont inventées.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import io",
        "import pandas as pd",
        "",
        "texte = '''titre;note;date_emprunt",
        "Dune;4,5;16/02/2026",
        "Matilda;4,0;09/02/2026",
        "Fondation;3,5;23/02/2026'''",
        "",
        "avis = pd.read_csv(",
        "    io.StringIO(texte), sep=';', decimal=',',",
        "    parse_dates=['date_emprunt'], date_format='%d/%m/%Y',",
        ")",
        "print(avis)",
        "print(avis.dtypes)",
        "",
        "# to_csv sans nom de fichier renvoie le texte du CSV",
        "print(avis.to_csv(sep=';', decimal=',', index=False))",
      ),
      caption: "Sans decimal=',', la colonne note serait lue comme du texte (« 4,5 » n'est pas un nombre pour pandas). Sans date_format ni dayfirst, pandas devine le format et émet un avertissement : mieux vaut le préciser.",
    },
    {
      kind: "text",
      md: lines(
        "Sur votre machine, avec de vrais fichiers, la lecture et l'écriture ressemblent à ceci (code à lire, non exécutable dans l'éditeur du site) :",
        "",
        "```python",
        "import pandas as pd",
        "",
        "emprunts = pd.read_csv('emprunts.csv', sep=';', encoding='utf-8')",
        "emprunts.to_csv('emprunts_nettoyes.csv', index=False)",
        "```",
        "",
        "`read_excel` et `read_parquet` existent aussi, mais s'appuient sur des bibliothèques supplémentaires (par exemple `openpyxl` pour Excel, `pyarrow` pour Parquet) qu'il faut installer (elles ne sont pas dans l'éditeur du site). Avant de charger un gros fichier, regardez ses premières lignes avec `nrows=5` pour vérifier le séparateur, l'encodage et les types.",
      ),
    },
    {
      kind: "note",
      tone: "info",
      md: "**À retenir.** Un DataFrame est un ensemble de colonnes (Series) qui partagent un index. On sélectionne avec `[]`, `loc` (étiquettes, fin incluse) et `iloc` (positions, fin exclue), on filtre avec des masques combinés par `&`, `|`, `~`. On regroupe avec `groupby` et `agg`, on joint avec `merge` en vérifiant le nombre de lignes. Les valeurs manquantes demandent une décision explicite, à justifier. Pour aller plus loin : `pivot_table`, `crosstab`, `rolling` (moyennes mobiles), la visualisation avec Matplotlib.",
    },
  ],
  quiz: [
    {
      question: "Que renvoie `df['titre']` si `df` est un DataFrame ?",
      options: ["Une Series : la colonne titre", "Un DataFrame d'une seule colonne", "Une liste Python", "La première ligne du tableau"],
      correct: 0,
      explanation:
        "Un seul nom entre crochets simples donne une Series. Pour obtenir un DataFrame d'une colonne, il faut une liste : df[['titre']].",
    },
    {
      question: "Le DataFrame `df` a un index numéroté de 0 à 11. Combien de lignes renvoie `df.loc[2:4]` ?",
      options: ["2 lignes", "3 lignes", "4 lignes", "5 lignes"],
      correct: 1,
      explanation:
        "loc sélectionne par étiquette et inclut la borne de fin : lignes 2, 3 et 4, soit 3 lignes. iloc[2:4], par position, n'en donnerait que 2.",
    },
    {
      question: "Quelle écriture sélectionne les romans dont la durée dépasse 14 jours ?",
      options: [
        "df[df['categorie'] == 'roman' and df['duree_jours'] > 14]",
        "df[df['categorie'] == 'roman' & df['duree_jours'] > 14]",
        "df[(df['categorie'] == 'roman') & (df['duree_jours'] > 14)]",
        "df['roman', 'duree_jours' > 14]",
      ],
      correct: 2,
      explanation:
        "Il faut l'opérateur & et des parenthèses autour de chaque comparaison. Avec and, pandas lève une erreur ; sans parenthèses, & est évalué avant les comparaisons et le calcul échoue.",
    },
    {
      question: "Une colonne numérique contient des NaN. Que fait `df['duree_jours'].mean()` ?",
      options: [
        "Il renvoie NaN",
        "Il lève une erreur",
        "Il remplace les NaN par 0 avant de calculer",
        "Il ignore les NaN et calcule la moyenne des valeurs connues",
      ],
      correct: 3,
      explanation:
        "Par défaut, les méthodes statistiques de pandas ignorent les valeurs manquantes. Le résultat est donc la moyenne des seules valeurs connues, ce qui n'est pas toujours ce qu'on veut : il faut savoir combien de valeurs manquent.",
    },
    {
      question: "Dans `emprunts.merge(adherents, on='adherent', how='left')`, que devient un prêt dont l'adhérent est absent de `adherents` ?",
      options: [
        "Il est supprimé du résultat",
        "Il est conservé, avec des NaN dans les colonnes venant de adherents",
        "Il est dupliqué",
        "pandas lève une erreur",
      ],
      correct: 1,
      explanation:
        "Avec how='left', toutes les lignes de la table de gauche sont gardées. Celles sans correspondance reçoivent NaN pour les colonnes de la table de droite. how='inner' les aurait supprimées.",
    },
  ],
};
