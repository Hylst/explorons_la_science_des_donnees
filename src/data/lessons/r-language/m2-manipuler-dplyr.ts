import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Le jeu iris de scikit-learn, avec les noms de colonnes de R (Sepal.Length...) et l'espèce en catégorie. */
const IRIS = lines(
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_iris",
  "_brut = load_iris(as_frame=True)",
  "iris = _brut.data.copy()",
  "iris.columns = ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']",
  "iris['Species'] = pd.Categorical.from_codes(_brut.target, _brut.target_names)",
);

export const moduleRDplyr: LessonModule = {
  id: "manipuler-dplyr",
  title: "Manipuler des données : dplyr et pandas",
  duration: "2 h 30",
  summary: "Les verbes de dplyr (filter, select, mutate, arrange, group_by, summarise, jointures) et de tidyr (pivot_longer) en regard de leurs équivalents pandas, avec le tube de R et le chaînage de méthodes de pandas.",
  objectives: [
    "Associer chaque verbe de dplyr à son équivalent pandas (filtrer, choisir, créer, trier, agréger, joindre)",
    "Lire une chaîne R écrite avec le tube |> et la traduire en une chaîne de méthodes pandas",
    "Passer du format large au format long, avec pivot_longer en R et melt en pandas",
    "Anticiper les différences de comportement : variables nommées, valeurs manquantes, ordre des lignes",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une grammaire de verbes

Le **tidyverse** est un ensemble de paquets R qui partagent une même philosophie. Celui qui sert à manipuler les tableaux s'appelle **dplyr**. Il repose sur quelques **verbes**, chacun fait une chose, et on les enchaîne :

- \`filter()\` garde des lignes selon une condition ;
- \`select()\` garde ou retire des colonnes ;
- \`mutate()\` crée ou modifie des colonnes ;
- \`arrange()\` trie les lignes ;
- \`group_by()\` puis \`summarise()\` calcule des agrégats par groupe ;
- \`left_join()\` et ses cousins fusionnent deux tableaux.

pandas offre les mêmes opérations, avec d'autres noms et un style de méthodes accrochées au tableau. Dans tout le module, le **code R est à lire** (il ne tourne pas dans le moteur du site) et le **code Python s'exécute** sur le jeu \`iris\` de scikit-learn, dont les colonnes sont renommées \`Sepal.Length\`, etc., comme en R. Pour pandas, un nom de colonne contenant un point se cite entre guillemets : \`d["Sepal.Length"]\`.`,
    },
    {
      kind: "text",
      md: `### Filtrer, choisir, trier

\`\`\`r
# Code R à lire (paquet dplyr)
library(dplyr)

iris |> filter(Species == "setosa")                      # lignes de l'espèce setosa
iris |> filter(Petal.Length > 5)                         # grands pétales
iris |> filter(Species == "virginica", Sepal.Length > 7) # les deux conditions (ET)
iris |> select(Species, Petal.Length)                    # deux colonnes
iris |> select(starts_with("Petal"))                     # colonnes dont le nom commence par Petal
iris |> arrange(desc(Petal.Length))                      # tri décroissant
\`\`\`

Remarquez que dans \`filter()\`, on écrit \`Petal.Length\` **sans guillemets ni nom du tableau** : dplyr sait où chercher. En pandas, on désigne le tableau explicitement. Deux conditions se combinent avec \`&\` (et) et \`|\` (ou), **chacune entre parenthèses**, parce que l'opérateur \`&\` passe avant les comparaisons.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "setosa = iris[iris['Species'] == 'setosa']                 # filter(Species == \"setosa\")",
        "print('setosa :', len(setosa), 'lignes')",
        "",
        "grands = iris.query('`Petal.Length` > 5')                   # filter(Petal.Length > 5)",
        "print('pétales > 5 cm :', len(grands), 'lignes')",
        "",
        "# deux conditions : chacune entre parenthèses, reliées par &",
        "tres_grands = iris[(iris['Species'] == 'virginica') & (iris['Sepal.Length'] > 7)]",
        "print('virginica à sépale > 7 cm :', len(tres_grands), 'lignes')",
        "",
        "deux = iris[['Species', 'Petal.Length']]                    # select(Species, Petal.Length)",
        "petales = iris.filter(like='Petal')                         # select(starts_with(\"Petal\"))",
        "print(list(petales.columns))",
        "",
        "# arrange(desc(Petal.Length)) ; kind='stable' garde l'ordre d'origine en cas d'égalité, comme R",
        "tri = deux.sort_values('Petal.Length', ascending=False, kind='stable')",
        "print(tri.head(3))",
      ),
      caption: "Il y a 50 setosa (sur 150 fleurs), 42 fleurs aux pétales de plus de 5 cm et 12 virginica aux sépales de plus de 7 cm. query accepte une expression texte (les noms avec un point s'écrivent entre accents graves) ; filter(like='Petal') choisit les colonnes dont le nom contient Petal. Les plus longs pétales mesurent 6,9 cm.",
    },
    {
      kind: "text",
      md: `### Créer une colonne, agréger par groupe

\`\`\`r
# Code R à lire
iris |> mutate(rapport = Petal.Length / Petal.Width)     # nouvelle colonne

iris |>
  group_by(Species) |>
  summarise(
    n         = n(),
    long_moy  = mean(Sepal.Length),
    long_sd   = sd(Sepal.Length),
    larg_max  = max(Petal.Width)
  )
\`\`\`

\`mutate()\` ajoute une colonne et garde les autres ; \`summarise()\` au contraire **réduit** chaque groupe à une ligne. En pandas, \`assign()\` correspond à \`mutate()\` et \`groupby(...).agg(...)\` à \`group_by() |> summarise()\`. L'agrégation *nommée* (\`nom=("colonne", "fonction")\`) donne des colonnes bien étiquetées, comme les arguments de \`summarise()\`.

Deux détails qui comptent. D'abord, l'écart-type : \`sd()\` de R et \`std()\` de pandas divisent tous deux par n - 1 (écart-type de l'échantillon), alors que NumPy divise par n par défaut ; ici, pandas et R s'accordent. Ensuite, le résultat d'un \`groupby\` met la clé de groupe dans l'**index** : \`reset_index()\` la remet en colonne, ce que fait \`summarise()\` sans qu'on le demande.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "# mutate(rapport = Petal.Length / Petal.Width)",
        "avec_rapport = iris.assign(rapport=iris['Petal.Length'] / iris['Petal.Width'])",
        "print(avec_rapport[['Petal.Length', 'Petal.Width', 'rapport']].head(2).round(2))",
        "",
        "# group_by(Species) |> summarise(n = n(), long_moy = mean(...), long_sd = sd(...), larg_max = max(...))",
        "resume = (",
        "    iris.groupby('Species', observed=True)",
        "    .agg(",
        "        n=('Species', 'size'),",
        "        long_moy=('Sepal.Length', 'mean'),",
        "        long_sd=('Sepal.Length', 'std'),",
        "        larg_max=('Petal.Width', 'max'),",
        "    )",
        "    .round(3)",
        "    .reset_index()",
        ")",
        "print(resume)",
      ),
      caption: "Trois lignes, une par espèce, de 50 fleurs chacune. La longueur moyenne du sépale vaut 5,006 cm chez setosa, 5,936 chez versicolor et 6,588 chez virginica, avec des écarts-types de 0,352, 0,516 et 0,636. Le paramètre observed=True évite que pandas conserve des catégories sans ligne dans un groupement.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Traduisez cette chaîne R en pandas : `iris |> filter(Sepal.Length > 6) |> group_by(Species) |> summarise(n = n(), largeur_moy = mean(Sepal.Width))`. Rangez le résultat dans `resultat`, un tableau à trois colonnes dans cet ordre : `Species`, `n`, `largeur_moy` (l'espèce en colonne, pas dans l'index).",
      setup: IRIS,
      starter: "resultat = iris",
      solution: lines(
        "resultat = (",
        "    iris[iris['Sepal.Length'] > 6]",
        "    .groupby('Species', observed=True)",
        "    .agg(n=('Species', 'size'), largeur_moy=('Sepal.Width', 'mean'))",
        "    .reset_index()",
        ")",
        "print(resultat)",
      ),
      test: lines(
        "assert list(resultat.columns) == ['Species', 'n', 'largeur_moy'], f\"les colonnes doivent être Species, n, largeur_moy (dans cet ordre), pas {list(resultat.columns)}\"",
        "_gardees = iris[iris['Sepal.Length'] > 6]",
        "for _e in resultat['Species']:",
        "    _l = resultat[resultat['Species'] == _e].iloc[0]",
        "    _v = _gardees[_gardees['Species'] == _e]",
        "    assert _l['n'] == len(_v), f\"{_e} : n doit compter les fleurs de sépale > 6 cm de l'espèce ({len(_v)}), pas {_l['n']}\"",
        "    assert abs(_l['largeur_moy'] - _v['Sepal.Width'].mean()) < 1e-9, f\"{_e} : largeur_moy doit être la moyenne de Sepal.Width après le filtre\"",
        "assert set(resultat['Species']) == set(_gardees['Species']), \"une ligne par espèce restante, sans catégorie vide\"",
      ),
      hint: "Filtrez d'abord avec iris[iris['Sepal.Length'] > 6], puis .groupby('Species', observed=True).agg(...) avec des agrégations nommées, puis .reset_index().",
    },
    {
      kind: "text",
      md: `### Le tube de R et le chaînage de pandas

Le **tube** de R passe le résultat de gauche comme premier argument de la fonction de droite : \`x |> f(y)\` équivaut à \`f(x, y)\`. Il évite d'imbriquer les appels ou de créer des variables intermédiaires, et se lit de haut en bas comme une recette. Le tube natif \`|>\` est apparu dans R 4.1 ; avant, on utilisait \`%>%\` du paquet magrittr, qui s'emploie de la même façon dans la plupart des cas. Vous rencontrerez les deux dans du code existant.

\`\`\`r
# Code R à lire : même résultat, deux écritures
iris |> filter(Sepal.Length > 5.5) |> group_by(Species) |> summarise(n = n())
iris %>% filter(Sepal.Length > 5.5) %>% group_by(Species) %>% summarise(n = n())
\`\`\`

Pandas obtient le même effet en **enchaînant des méthodes**, chacune renvoyant un nouveau tableau. On entoure la chaîne de parenthèses pour pouvoir la couper en lignes sans barre oblique. Quand une étape a besoin du tableau courant (créer une colonne à partir d'une autre), on passe par une fonction anonyme : \`assign(rapport=lambda d: d["a"] / d["b"])\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "# iris |> filter(Sepal.Length > 5.5)",
        "#      |> mutate(rapport = Petal.Length / Sepal.Length)",
        "#      |> group_by(Species)",
        "#      |> summarise(n = n(), rapport_moyen = mean(rapport))",
        "#      |> arrange(desc(rapport_moyen))",
        "resultat = (",
        "    iris",
        "    .loc[iris['Sepal.Length'] > 5.5]",
        "    .assign(rapport=lambda d: d['Petal.Length'] / d['Sepal.Length'])",
        "    .groupby('Species', observed=True)",
        "    .agg(n=('rapport', 'size'), rapport_moyen=('rapport', 'mean'))",
        "    .reset_index()",
        "    .sort_values('rapport_moyen', ascending=False)",
        ")",
        "print(resultat.round(3).to_string(index=False))",
      ),
      caption: "Parmi les fleurs aux sépales de plus de 5,5 cm, il reste 3 setosa, 39 versicolor et 49 virginica : le rapport entre la longueur du pétale et celle du sépale vaut en moyenne 0,256 chez setosa, 0,720 chez versicolor et 0,842 chez virginica. La chaîne Python se lit comme la chaîne R, verbe à verbe.",
    },
    {
      kind: "text",
      md: `### Joindre deux tableaux

Les jointures de dplyr portent des noms de SQL : \`left_join()\`, \`inner_join()\`, \`full_join()\`. Dans pandas, tout passe par \`merge()\`, dont l'argument \`how\` choisit le type (\`"left"\`, \`"inner"\`, \`"outer"\`).

\`\`\`r
# Code R à lire
resume |> left_join(etiquettes, by = "Species")    # garde toutes les lignes de resume
resume |> inner_join(etiquettes, by = "Species")   # garde seulement les espèces présentes des deux côtés
\`\`\`

Avec une jointure à gauche, une ligne sans correspondance reçoit une valeur manquante (\`NA\` en R, \`NaN\` ou \`None\` en pandas). C'est une source classique d'erreurs silencieuses : après chaque jointure, **comptez les lignes** avant et après, et les manquants créés. Si la clé n'est pas unique dans le tableau de droite, une ligne de gauche est dupliquée ; \`merge\` accepte \`validate="many_to_one"\` pour lever une erreur dans ce cas.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "resume = iris.groupby('Species', observed=True).agg(n=('Species', 'size')).reset_index()",
        "resume['Species'] = resume['Species'].astype(str)",
        "",
        "# table de correspondance écrite à la main : il manque volontairement l'espèce virginica",
        "etiquettes = pd.DataFrame({'Species': ['setosa', 'versicolor'], 'abreviation': ['Se', 'Ve']})",
        "",
        "gauche = resume.merge(etiquettes, on='Species', how='left', validate='many_to_one')   # left_join",
        "interne = resume.merge(etiquettes, on='Species', how='inner')                        # inner_join",
        "print(gauche)",
        "print('lignes après left :', len(gauche), ' après inner :', len(interne))",
        "print('manquants créés :', int(gauche['abreviation'].isna().sum()))",
      ),
      caption: "La jointure à gauche garde les 3 espèces et laisse un manquant pour virginica, absente de la table de correspondance ; la jointure interne ne garde que 2 lignes. Dans les deux cas, la clé de jointure doit avoir le même type des deux côtés : on a converti l'espèce, qui était une catégorie, en texte.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`mesures` est un tableau de 4 lignes avec les colonnes `Species`, `Petal.Length` et `Petal.Width`. Équivalent de `pivot_longer(mesures, cols = c(Petal.Length, Petal.Width), names_to = \"mesure\", values_to = \"valeur\")` : rangez dans `long` le tableau au format long (8 lignes, colonnes `Species`, `mesure`, `valeur`, dans cet ordre).",
      setup: lines(
        IRIS,
        "mesures = iris[['Species', 'Petal.Length', 'Petal.Width']].iloc[[0, 1, 50, 100]].reset_index(drop=True)",
      ),
      starter: "long = mesures",
      solution: lines(
        "long = mesures.melt(",
        "    id_vars='Species',",
        "    value_vars=['Petal.Length', 'Petal.Width'],",
        "    var_name='mesure',",
        "    value_name='valeur',",
        ")",
        "print(long)",
      ),
      test: lines(
        "assert list(long.columns) == ['Species', 'mesure', 'valeur'], f\"les colonnes doivent être Species, mesure, valeur, pas {list(long.columns)}\"",
        "assert len(long) == 8, f\"4 lignes x 2 colonnes de mesures font 8 lignes, pas {len(long)}\"",
        "assert set(long['mesure']) == {'Petal.Length', 'Petal.Width'}, \"la colonne mesure doit contenir les noms des deux colonnes déroulées\"",
        "_somme = mesures['Petal.Length'].sum() + mesures['Petal.Width'].sum()",
        "assert abs(long['valeur'].sum() - _somme) < 1e-9, \"toutes les valeurs d'origine doivent se retrouver dans valeur\"",
      ),
      hint: "DataFrame.melt(id_vars=..., value_vars=..., var_name=..., value_name=...).",
    },
    {
      kind: "text",
      md: `### Format large et format long

Un tableau est dit **large** quand chaque mesure a sa colonne (\`Petal.Length\`, \`Petal.Width\`...) et **long** quand les noms des mesures sont rangés dans une colonne et leurs valeurs dans une autre. Le format long est celui qu'attendent ggplot2 (module suivant) et la plupart des outils de statistiques : une ligne = une observation. Le paquet **tidyr** fait l'aller-retour avec \`pivot_longer()\` et \`pivot_wider()\` ; pandas avec \`melt()\` et \`pivot()\` (ou \`pivot_table()\`, qui agrège).

\`\`\`r
# Code R à lire (paquet tidyr)
library(tidyr)
iris |>
  mutate(id = row_number()) |>
  pivot_longer(cols = -c(id, Species), names_to = "mesure", values_to = "valeur") |>
  group_by(Species, mesure) |>
  summarise(moyenne = mean(valeur), .groups = "drop") |>
  pivot_wider(names_from = mesure, values_from = moyenne)
\`\`\``,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "long = (",
        "    iris.reset_index(names='id')                      # mutate(id = row_number())",
        "    .melt(id_vars=['id', 'Species'], var_name='mesure', value_name='valeur')   # pivot_longer",
        ")",
        "print('forme large :', iris.shape, ' forme longue :', long.shape)",
        "",
        "# group_by + summarise puis pivot_wider",
        "moyennes = long.groupby(['Species', 'mesure'], observed=True)['valeur'].mean().unstack()",
        "print(moyennes.round(2))",
      ),
      caption: "Le tableau large de 150 lignes et 5 colonnes devient un tableau long de 600 lignes : 150 fleurs fois 4 mesures. Les moyennes par espèce et par mesure, remises en largeur : par exemple 1,46 cm de longueur de pétale pour setosa contre 5,55 pour virginica.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Jointure : `resume` contient le nombre de fleurs par espèce, `etiquettes` une abréviation pour deux espèces seulement. Rangez dans `fusion` le résultat de l'équivalent de `left_join(resume, etiquettes, by = \"Species\")` (3 lignes, toutes les espèces conservées) et dans `nb_sans_etiquette` le nombre de lignes sans abréviation.",
      setup: lines(
        IRIS,
        "resume = iris.groupby('Species', observed=True).agg(n=('Species', 'size')).reset_index()",
        "resume['Species'] = resume['Species'].astype(str)",
        "etiquettes = pd.DataFrame({'Species': ['setosa', 'versicolor'], 'abreviation': ['Se', 'Ve']})",
      ),
      starter: lines(
        "fusion = resume.merge(etiquettes, on='Species', how='inner')",
        "nb_sans_etiquette = 0",
      ),
      solution: lines(
        "fusion = resume.merge(etiquettes, on='Species', how='left')",
        "nb_sans_etiquette = int(fusion['abreviation'].isna().sum())",
        "print(fusion, nb_sans_etiquette)",
      ),
      test: lines(
        "assert len(fusion) == 3, f\"une jointure à gauche garde les 3 espèces de resume (how='left'), pas {len(fusion)}\"",
        "assert 'abreviation' in fusion.columns and 'n' in fusion.columns, \"fusion doit contenir les colonnes des deux tableaux\"",
        "assert nb_sans_etiquette == 1, f\"une espèce n'a pas d'abréviation (virginica), pas {nb_sans_etiquette}\"",
      ),
      hint: "how='left' garde toutes les lignes du tableau de gauche ; les manquants se comptent avec .isna().sum().",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une même idée peut se comporter différemment d'un langage à l'autre. Trois pièges à vérifier : l'**ordre des lignes** après un tri ou un regroupement (R conserve l'ordre d'origine pour les égalités ; en pandas, indiquez `kind=\"stable\"`), le **traitement des manquants** dans les agrégats (`na.rm` en R, `skipna` en pandas) et la **modification sur place** : les verbes de dplyr renvoient toujours un nouveau tableau, alors que certaines opérations de pandas peuvent modifier l'original selon la façon dont on les écrit.",
    },
  ],
  quiz: [
    {
      question: "Quelle méthode pandas ressemble le plus à mutate() de dplyr ?",
      options: [
        "assign()",
        "merge()",
        "melt()",
        "query()",
      ],
      correct: 0,
      explanation: "assign() ajoute ou remplace des colonnes en renvoyant un nouveau tableau, comme mutate(). query() correspond à filter(), merge() aux jointures et melt() à pivot_longer().",
    },
    {
      question: "Que fait le tube |> en R ?",
      options: [
        "Il calcule un « ou » logique entre deux conditions",
        "Il passe le résultat de gauche comme premier argument de la fonction de droite : x |> f(y) équivaut à f(x, y)",
        "Il enregistre le tableau dans un fichier",
        "Il trie les lignes",
      ],
      correct: 1,
      explanation: "Le tube enchaîne les opérations de haut en bas, sans variables intermédiaires. En pandas, on obtient la même lisibilité en chaînant des méthodes entre parenthèses.",
    },
    {
      question: "Dans iris[(iris['Species'] == 'virginica') & (iris['Sepal.Length'] > 7)], pourquoi les parenthèses ?",
      options: [
        "Elles sont facultatives, c'est une question de style",
        "Elles servent à convertir en texte",
        "Elles sélectionnent des colonnes",
        "L'opérateur & passe avant les comparaisons : sans parenthèses, l'expression est mal analysée et lève une erreur",
      ],
      correct: 3,
      explanation: "En Python, & a une priorité plus forte que == et >. Il faut donc entourer chaque condition de parenthèses, alors que filter() de dplyr accepte les conditions séparées par des virgules.",
    },
    {
      question: "Après un left_join (ou merge avec how='left'), que faut-il vérifier avant tout ?",
      options: [
        "Que le nombre de lignes n'a pas changé de façon inattendue et combien de manquants la jointure a créés",
        "Que les colonnes sont en ordre alphabétique",
        "Que le tableau est trié",
        "Rien, une jointure est toujours exacte",
      ],
      correct: 0,
      explanation: "Une clé absente à droite donne des manquants, une clé répétée à droite duplique des lignes de gauche. Compter les lignes avant et après, et les manquants, évite des erreurs silencieuses.",
    },
    {
      question: "Un tableau de 150 lignes et 4 colonnes de mesures passe au format long (melt ou pivot_longer) avec les 4 colonnes déroulées. Combien de lignes obtient-on ?",
      options: [
        "150",
        "154",
        "600",
        "4",
      ],
      correct: 2,
      explanation: "Chaque ligne d'origine produit une ligne par mesure déroulée : 150 fois 4 font 600. Le tableau devient plus long et plus étroit, sans perdre aucune valeur.",
    },
  ],
};
