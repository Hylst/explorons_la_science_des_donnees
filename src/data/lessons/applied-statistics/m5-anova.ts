import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { VINS } from "./data";

export const moduleAnova: LessonModule = {
  id: "anova",
  title: "ANOVA : comparer plusieurs groupes",
  duration: "2 h",
  summary: "Comparer les moyennes de plus de deux groupes en un seul test, vérifier les conditions, puis chercher quels groupes diffèrent.",
  objectives: [
    "Expliquer pourquoi on ne multiplie pas les tests t entre groupes",
    "Faire une ANOVA à un facteur avec stats.f_oneway",
    "Vérifier les conditions : normalité approximative, variances proches (test de Levene)",
    "Identifier les paires de groupes qui diffèrent avec le test de Tukey",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi pas plusieurs tests t ?

Avec trois groupes, on pourrait faire trois tests t (A contre B, A contre C, B contre C). Mais chaque test a 5 % de risque de faux positif, et ces risques s'additionnent : avec dix groupes, on ferait 45 comparaisons et l'on trouverait presque sûrement une « différence » par hasard.

L'**analyse de la variance** (ANOVA) répond en un seul test à la question : « les moyennes des groupes sont-elles toutes égales ? ». Elle compare la variabilité **entre** les groupes à la variabilité **à l'intérieur** des groupes : la statistique **F** est grande quand les groupes sont bien séparés par rapport à leur dispersion interne.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        VINS,
        "",
        "for k, groupe in enumerate(alcool):",
        "    print(f'cultivar {k} : {len(groupe)} vins, alcool moyen {groupe.mean():.2f} % vol.')",
        "resultat = stats.f_oneway(*alcool)",
        "print(f'F = {resultat.statistic:.1f}   p = {resultat.pvalue:.1e}')",
      ),
      caption: "Trois cultivars de vins italiens (jeu wine) : la teneur en alcool diffère nettement d'un cultivar à l'autre (F ≈ 135).",
    },
    {
      kind: "text",
      md: `### Les conditions de l'ANOVA

L'ANOVA classique suppose :

- des observations **indépendantes** ;
- dans chaque groupe, une distribution **à peu près normale** (avec des groupes de taille moyenne, l'ANOVA tolère des écarts modérés) ;
- des **variances proches** d'un groupe à l'autre, que l'on vérifie avec le **test de Levene** (\`stats.levene\`) : une petite p-value signale des variances différentes.

Quand ces conditions ne tiennent pas, on se tourne vers le test non paramétrique de **Kruskal-Wallis** (module 6).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Vérifiez l'égalité des variances de la teneur en alcool entre les trois cultivars avec le **test de Levene**, et rangez la p-value dans `p_levene`. La condition est-elle respectée ?",
      setup: VINS,
      starter: "p_levene = stats.f_oneway(*alcool).pvalue",
      solution: lines("p_levene = stats.levene(*alcool).pvalue", "print(round(p_levene, 3))"),
      test: "assert abs(p_levene - stats.levene(*alcool).pvalue) < 1e-12, \"utilisez stats.levene(*alcool) : c'est lui qui teste l'égalité des variances\"\nassert p_levene > 0.05, \"ici, la p-value de Levene est grande : rien n'indique des variances différentes\"",
      hint: "stats.levene accepte les groupes comme f_oneway : stats.levene(*alcool).",
    },
    {
      kind: "text",
      md: `### Quels groupes diffèrent ?

Une ANOVA significative dit seulement que **toutes** les moyennes ne sont pas égales. Pour savoir **lesquelles** diffèrent, on fait un test **post hoc** qui tient compte des comparaisons multiples, comme le test de **Tukey** : \`stats.tukey_hsd(*groupes)\` renvoie une p-value pour chaque paire.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(VINS, "", "resultat = stats.tukey_hsd(*alcool)", "print(resultat)"),
      caption: "Pour la teneur en alcool, les trois cultivars diffèrent deux à deux : toutes les p-values sont très petites.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les trois espèces d'iris ont-elles la même **longueur de pétale** en moyenne ? Faites une **ANOVA à un facteur** et rangez la statistique F dans `f_stat` et la p-value dans `p_anova`. Vérifiez ensuite les variances avec Levene : que remarquez-vous ?",
      setup: lines(
        "import pandas as pd",
        "from scipy import stats",
        "from sklearn.datasets import load_iris",
        "",
        "iris = load_iris(as_frame=True).frame",
        "petales = [iris.loc[iris['target'] == k, 'petal length (cm)'] for k in range(3)]",
      ),
      starter: lines("f_stat = None", "p_anova = None"),
      solution: lines(
        "resultat = stats.f_oneway(*petales)",
        "f_stat, p_anova = resultat.statistic, resultat.pvalue",
        "print(round(f_stat, 1), p_anova)",
        "print('Levene :', stats.levene(*petales).pvalue)",
      ),
      test: lines(
        "assert f_stat is not None and abs(f_stat - 1180.16) < 0.1, \"la statistique F de l'ANOVA vaut environ 1180\"",
        "assert p_anova < 1e-50, \"la p-value de l'ANOVA est extrêmement petite\"",
      ),
      hint: "stats.f_oneway(*petales) renvoie la statistique F et la p-value.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Pour les pétales d'iris, la p-value de Levene est minuscule (de l'ordre de 10⁻⁸) : les variances diffèrent fortement d'une espèce à l'autre (les setosa ont des pétales presque tous identiques). La conclusion de l'ANOVA reste évidente ici, mais dans un cas moins tranché, le test de Kruskal-Wallis serait plus prudent.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi une ANOVA plutôt que plusieurs tests t entre paires de groupes ?",
      options: [
        "Parce qu'elle est plus rapide à écrire",
        "Parce que multiplier les tests augmente le risque de trouver une différence par hasard",
        "Parce que les tests t ne fonctionnent pas en Python",
        "Il n'y a aucune différence",
      ],
      correct: 1,
      explanation: "Chaque test a son risque de faux positif ; avec de nombreuses paires, une fausse différence devient presque certaine. L'ANOVA pose la question globale en un seul test.",
    },
    {
      question: "Que compare la statistique F de l'ANOVA ?",
      options: [
        "La moyenne la plus grande et la plus petite",
        "La variabilité entre les groupes et la variabilité à l'intérieur des groupes",
        "Les médianes des groupes",
        "Les effectifs des groupes",
      ],
      correct: 1,
      explanation: "F est grand quand les moyennes des groupes sont éloignées par rapport à la dispersion à l'intérieur de chaque groupe.",
    },
    {
      question: "Une ANOVA est significative. Que sait-on ?",
      options: [
        "Que tous les groupes diffèrent deux à deux",
        "Qu'au moins une moyenne diffère des autres ; un test post hoc (Tukey) dit lesquelles",
        "Que le premier groupe est le plus grand",
        "Que les variances sont égales",
      ],
      correct: 1,
      explanation: "L'ANOVA répond « non, elles ne sont pas toutes égales ». Pour savoir quelles paires diffèrent, on utilise un test post hoc qui corrige les comparaisons multiples.",
    },
    {
      question: "À quoi sert le test de Levene avant une ANOVA ?",
      options: [
        "À vérifier que les variances des groupes sont proches",
        "À vérifier que les moyennes sont égales",
        "À choisir le nombre de groupes",
        "À supprimer les valeurs atypiques",
      ],
      correct: 0,
      explanation: "L'ANOVA classique suppose des variances proches. Une petite p-value de Levene signale le contraire, et invite à une méthode plus robuste.",
    },
  ],
};
