import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DIABETE } from "./data";

export const moduleDescriptive: LessonModule = {
  id: "descriptive-stats",
  title: "Décrire des données réelles",
  duration: "1 h 30",
  summary: "Résumer une variable sans se laisser piéger : moyenne ou médiane, dispersion, valeurs atypiques, comparaisons par groupe.",
  objectives: [
    "Choisir entre moyenne et médiane selon la forme de la distribution",
    "Mesurer la dispersion avec l'écart-type et l'écart interquartile",
    "Repérer des valeurs atypiques avec la règle de 1,5 fois l'écart interquartile",
    "Résumer une variable par groupe avec pandas",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un cours pour pratiquer

Ce cours applique, en Python, les notions présentées dans les pages Statistiques descriptives, Théorie des probabilités et Statistiques inférentielles du site : on y revient pour les définitions, ici on manipule de vraies données.

Le premier jeu de données décrit **442 patients diabétiques** (jeu *diabetes* fourni avec scikit-learn, en unités d'origine) : âge, sexe (codé 1 ou 2, sans plus de précision dans la documentation), indice de masse corporelle (IMC), pression artérielle, mesures sanguines, et une mesure de la **progression** de la maladie un an plus tard.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(DIABETE, "", "print(d.shape)", "print(d[['age', 'imc', 'progression']].describe().round(1))"),
      caption: "describe() donne en une ligne le nombre de valeurs, la moyenne, l'écart-type, le minimum, les quartiles et le maximum.",
    },
    {
      kind: "text",
      md: `### Moyenne ou médiane ?

La **moyenne** est sensible aux valeurs extrêmes ; la **médiane** (la valeur du milieu) ne l'est pas. Quand une distribution est **asymétrique**, les deux s'écartent : pour la progression de la maladie, la moyenne (152) dépasse la médiane (140,5), signe d'une queue de distribution étirée vers les grandes valeurs.

Règle pratique : pour une distribution asymétrique (revenus, durées, prix), on présente la médiane, ou les deux en expliquant l'écart.

Pour la **dispersion** : l'**écart-type** accompagne la moyenne, l'**écart interquartile** (IQR, du premier au troisième quartile, la moitié centrale des données) accompagne la médiane.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez la **médiane** de la progression dans `mediane`, et son **écart interquartile** (troisième quartile moins premier quartile) dans `iqr`.",
      setup: DIABETE,
      starter: lines("mediane = d['progression'].mean()", "iqr = None"),
      solution: lines(
        "mediane = d['progression'].median()",
        "q1, q3 = d['progression'].quantile([0.25, 0.75])",
        "iqr = q3 - q1",
        "print(mediane, iqr)",
      ),
      test: lines(
        "assert mediane == 140.5, f\"la médiane de la progression vaut 140,5 (vous avez {mediane}) : utilisez median() et non mean()\"",
        "assert iqr is not None and abs(iqr - 124.5) < 1e-9, f\"l'écart interquartile vaut 211,5 - 87 = 124,5 (vous avez {iqr})\"",
      ),
      hint: "median(), puis quantile([0.25, 0.75]) pour les deux quartiles.",
    },
    {
      kind: "text",
      md: `### Les valeurs atypiques

Une règle simple, celle des boîtes à moustaches : est **atypique** une valeur située à plus de **1,5 fois l'écart interquartile** sous le premier quartile ou au-dessus du troisième.

Atypique ne veut pas dire fausse. Une valeur atypique peut être une erreur de saisie (un IMC de 420), ou un cas réel et intéressant (un patient très corpulent). On la regarde, on cherche à la comprendre, et on ne la supprime qu'avec une raison que l'on note.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec la règle de 1,5 fois l'écart interquartile, **comptez les valeurs atypiques de l'IMC** (colonne `imc`) et rangez ce nombre dans `nb_atypiques`.",
      setup: DIABETE,
      starter: "nb_atypiques = None",
      solution: lines(
        "q1, q3 = d['imc'].quantile([0.25, 0.75])",
        "iqr = q3 - q1",
        "bas, haut = q1 - 1.5 * iqr, q3 + 1.5 * iqr",
        "nb_atypiques = int(((d['imc'] < bas) | (d['imc'] > haut)).sum())",
        "print(bas, haut, nb_atypiques)",
      ),
      test: "assert nb_atypiques == 3, f\"on trouve 3 IMC au-delà de Q3 + 1,5 × IQR (vous trouvez {nb_atypiques})\"",
      hint: "Bornes : q1 - 1.5 * iqr et q3 + 1.5 * iqr ; comptez les valeurs hors de ces bornes avec ((... < bas) | (... > haut)).sum().",
    },
    {
      kind: "text",
      md: `### Comparer des groupes

\`groupby\` résume une variable par groupe : \`d.groupby('sex')['progression'].agg(['count', 'mean', 'median'])\`. Toujours afficher les **effectifs** : une moyenne calculée sur 5 personnes n'a pas le poids d'une moyenne calculée sur 500.

Une différence observée entre deux groupes peut venir du hasard de l'échantillon : savoir si elle est « réelle » est l'objet des tests du module 3.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(DIABETE, "", "print(d.groupby('sex')['progression'].agg(['count', 'mean', 'median']).round(1))"),
      caption: "Les deux groupes ont des médianes presque identiques (140 et 141) ; les moyennes diffèrent un peu plus. Le module 3 dira si cet écart est notable.",
    },
  ],
  quiz: [
    {
      question: "Pour une distribution très asymétrique (des revenus, par exemple), quel indicateur de position présenter ?",
      options: ["La moyenne seule", "La médiane (ou les deux, en expliquant l'écart)", "Le maximum", "Le mode seul"],
      correct: 1,
      explanation: "Quelques valeurs très grandes tirent la moyenne vers le haut ; la médiane décrit mieux une valeur « typique ».",
    },
    {
      question: "Que mesure l'écart interquartile ?",
      options: [
        "La différence entre le maximum et le minimum",
        "L'étendue de la moitié centrale des données (de Q1 à Q3)",
        "La moyenne des écarts à la moyenne",
        "Le nombre de valeurs atypiques",
      ],
      correct: 1,
      explanation: "IQR = Q3 - Q1 : il ne dépend pas des valeurs extrêmes, ce qui en fait le bon compagnon de la médiane.",
    },
    {
      question: "Une valeur est atypique selon la règle de 1,5 × IQR. Que faire ?",
      options: [
        "La supprimer immédiatement",
        "La regarder et chercher à la comprendre ; ne la retirer qu'avec une raison notée",
        "La remplacer par la moyenne",
        "L'ignorer",
      ],
      correct: 1,
      explanation: "Une valeur atypique peut être une erreur ou un cas réel important. La décision dépend de sa cause, et doit être documentée.",
    },
    {
      question: "Pourquoi afficher les effectifs à côté des moyennes de groupes ?",
      options: [
        "Pour remplir le tableau",
        "Parce qu'une moyenne sur peu de personnes est beaucoup moins fiable",
        "Parce que pandas l'exige",
        "Ce n'est pas utile",
      ],
      correct: 1,
      explanation: "Plus l'effectif est petit, plus la moyenne varie d'un échantillon à l'autre : le lecteur doit pouvoir le savoir.",
    },
  ],
};
