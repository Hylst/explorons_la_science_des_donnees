import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DIABETE, VINS } from "./data";

export const moduleNonParametric: LessonModule = {
  id: "non-parametric",
  title: "Tests non paramétriques et khi-deux",
  duration: "1 h 30",
  summary: "Des tests qui ne supposent pas de loi normale, et le test du khi-deux pour croiser deux variables qualitatives.",
  objectives: [
    "Savoir quand préférer un test non paramétrique",
    "Utiliser Mann-Whitney, Wilcoxon et Kruskal-Wallis, équivalents des tests t et de l'ANOVA",
    "Tester l'indépendance de deux variables qualitatives avec le khi-deux",
    "Choisir un test à partir du type de données et du plan d'étude",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand la normalité n'est pas au rendez-vous

Les tests t et l'ANOVA reposent sur des moyennes et supposent des distributions à peu près normales (ou de grands échantillons). Avec de **petits échantillons asymétriques**, des **valeurs extrêmes**, ou des données **ordinales** (une note de satisfaction de 1 à 5), on préfère des tests **non paramétriques**, qui travaillent sur les **rangs** :

- **Mann-Whitney** (\`stats.mannwhitneyu\`) : deux groupes indépendants, à la place du test de Welch ;
- **Wilcoxon** (\`stats.wilcoxon\`) : mesures appariées, à la place du test t apparié ;
- **Kruskal-Wallis** (\`stats.kruskal\`) : plusieurs groupes, à la place de l'ANOVA.

Ils sont un peu moins puissants que leurs équivalents quand les conditions de ceux-ci sont remplies, mais bien plus sûrs quand elles ne le sont pas.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DIABETE,
        "",
        "groupe_1 = d.loc[d['sex'] == 1, 'progression']",
        "groupe_2 = d.loc[d['sex'] == 2, 'progression']",
        "print('Welch          p =', round(stats.ttest_ind(groupe_1, groupe_2, equal_var=False).pvalue, 3))",
        "print('Mann-Whitney   p =', round(stats.mannwhitneyu(groupe_1, groupe_2).pvalue, 3))",
      ),
      caption: "Sur la progression du diabète selon le sexe, les deux tests concluent de la même façon (pas de différence détectée) : bon signe de robustesse.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Reprenez les trois cultivars du jeu **wine** et comparez leur **teneur en alcool** avec le test de **Kruskal-Wallis**. Rangez la p-value dans `p_kruskal`.",
      setup: VINS,
      starter: "p_kruskal = stats.f_oneway(*alcool).pvalue",
      solution: lines("p_kruskal = stats.kruskal(*alcool).pvalue", "print(p_kruskal)"),
      test: "assert abs(p_kruskal - stats.kruskal(*alcool).pvalue) < 1e-30, \"utilisez le test de Kruskal-Wallis : stats.kruskal(*alcool)\"\nassert p_kruskal < 1e-20, \"la p-value est très petite : la teneur en alcool diffère selon le cultivar\"",
      hint: "stats.kruskal s'utilise comme f_oneway : stats.kruskal(*alcool).",
    },
    {
      kind: "text",
      md: `### Deux variables qualitatives : le khi-deux

Pour savoir si deux variables **qualitatives** sont liées (par exemple, la formule d'abonnement et le fait de renouveler), on range les effectifs dans un **tableau de contingence**, puis le **test du khi-deux d'indépendance** compare les effectifs observés à ceux qu'on attendrait si les deux variables étaient indépendantes.

\`stats.chi2_contingency(tableau)\` renvoie la statistique, la p-value, le nombre de degrés de liberté et le tableau des **effectifs attendus**. Condition pratique : les effectifs attendus ne doivent pas être trop petits (souvent, au moins 5 par case) ; sinon, on utilise le test exact de Fisher (\`stats.fisher_exact\`, pour un tableau 2 × 2).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un club (données fictives) a suivi 100 adhérents : parmi les 50 inscrits à la **formule mensuelle**, 30 ont renouvelé ; parmi les 50 inscrits à la **formule annuelle**, 15 ont renouvelé. Construisez le tableau de contingence (lignes : formule ; colonnes : renouvelé, pas renouvelé), faites le **test du khi-deux** et rangez la p-value dans `p_khi2`.",
      starter: lines("import numpy as np", "from scipy import stats", "", "tableau = np.array([[30, 15], [20, 35]])", "p_khi2 = None"),
      solution: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "tableau = np.array([[30, 20], [15, 35]])",
        "resultat = stats.chi2_contingency(tableau)",
        "p_khi2 = resultat.pvalue",
        "print(resultat.statistic, p_khi2)",
        "print(resultat.expected_freq)",
      ),
      test: lines(
        "assert tableau.tolist() == [[30, 20], [15, 35]], \"une ligne par formule : mensuelle [30 renouvelés, 20 non], annuelle [15 renouvelés, 35 non]\"",
        "assert p_khi2 is not None and abs(p_khi2 - 0.004891311452359333) < 1e-9, \"le test du khi-deux sur ce tableau donne p ≈ 0,0049\"",
      ),
      hint: "Chaque ligne est une formule : [[renouvelés, non renouvelés] de la mensuelle, [renouvelés, non renouvelés] de l'annuelle].",
    },
    {
      kind: "text",
      md: `### Choisir son test, en résumé

- **Une moyenne contre une référence** : test t à un échantillon (ou test de Wilcoxon sur un échantillon).
- **Deux groupes indépendants** : test de Welch (ou Mann-Whitney).
- **Deux mesures sur les mêmes individus** : test t apparié (ou Wilcoxon).
- **Plusieurs groupes** : ANOVA puis Tukey (ou Kruskal-Wallis).
- **Deux variables quantitatives** : corrélation de Pearson (ou Spearman).
- **Deux variables qualitatives** : khi-deux d'indépendance (ou Fisher pour de petits effectifs).

Et dans tous les cas : regarder les données, rapporter la taille de l'effet, et annoncer combien de tests ont été faits.`,
    },
  ],
  quiz: [
    {
      question: "Sur quoi travaillent les tests non paramétriques comme Mann-Whitney ?",
      options: ["Sur les moyennes", "Sur les rangs des observations", "Sur les variances", "Sur les maximums"],
      correct: 1,
      explanation: "En remplaçant les valeurs par leurs rangs, ces tests ne dépendent pas de la forme exacte de la distribution et résistent aux valeurs extrêmes.",
    },
    {
      question: "Quel test non paramétrique remplace l'ANOVA à un facteur ?",
      options: ["Wilcoxon", "Mann-Whitney", "Kruskal-Wallis", "Khi-deux"],
      correct: 2,
      explanation: "Kruskal-Wallis compare plusieurs groupes indépendants à partir des rangs, comme l'ANOVA le fait avec les moyennes.",
    },
    {
      question: "Pour savoir si la formule d'abonnement est liée au renouvellement, quel test ?",
      options: ["Un test t", "Une ANOVA", "Le test du khi-deux d'indépendance", "Une corrélation de Pearson"],
      correct: 2,
      explanation: "Deux variables qualitatives croisées dans un tableau de contingence : c'est le cas du khi-deux (ou de Fisher pour de petits effectifs).",
    },
    {
      question: "Quand préférer le test exact de Fisher au khi-deux ?",
      options: [
        "Quand les effectifs attendus sont petits",
        "Quand les données sont quantitatives",
        "Quand il y a plus de trois groupes",
        "Jamais",
      ],
      correct: 0,
      explanation: "Le khi-deux repose sur une approximation qui devient fragile avec de petits effectifs attendus (souvent moins de 5 par case) ; le test de Fisher est exact.",
    },
  ],
};
