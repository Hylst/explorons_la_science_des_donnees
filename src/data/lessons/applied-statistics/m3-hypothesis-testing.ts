import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DIABETE } from "./data";

export const moduleHypothesisTesting: LessonModule = {
  id: "hypothesis-testing",
  title: "Tests d'hypothèses",
  duration: "2 h 30",
  summary: "Ce qu'une p-value dit, et surtout ce qu'elle ne dit pas ; tests t sur une moyenne, deux groupes et des mesures appariées.",
  objectives: [
    "Formuler une hypothèse nulle et une hypothèse alternative",
    "Interpréter correctement une p-value et le seuil alpha",
    "Choisir entre test à un échantillon, test de Welch et test apparié",
    "Distinguer « non significatif » et « pas de différence », significativité et importance pratique",
  ],
  sections: [
    {
      kind: "text",
      md: `### La logique d'un test

Un test part d'une hypothèse « par défaut », l'**hypothèse nulle** (H0) : « pas de différence », « pas d'effet ». On calcule ensuite la **p-value** : la probabilité d'observer un écart **au moins aussi grand** que celui des données, **si H0 était vraie**.

- Une petite p-value (sous un seuil **alpha** fixé à l'avance, souvent 0,05) indique que les données seraient surprenantes sous H0 : on **rejette** H0.
- Une grande p-value dit seulement que les données sont compatibles avec H0 : on **ne la rejette pas**, ce qui ne prouve pas qu'elle est vraie.

Ce que la p-value **n'est pas** : la probabilité que H0 soit vraie, ni la taille de l'effet, ni son importance pratique.`,
    },
    {
      kind: "text",
      md: `### Une moyenne contre une valeur de référence

Un service promet des trajets de 30 minutes en moyenne. Sur 25 trajets mesurés (données fictives), la moyenne est de 31,4 minutes. Le **test t à un échantillon** (\`stats.ttest_1samp\`) dit si cet écart pourrait venir du seul hasard de l'échantillon.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(42)",
        "temps = rng.normal(31.5, 4, 25).round(1)  # 25 trajets fictifs",
        "print('moyenne observée :', round(temps.mean(), 2))",
        "resultat = stats.ttest_1samp(temps, 30)",
        "print('t =', round(resultat.statistic, 3), ' p =', round(resultat.pvalue, 4))",
      ),
      caption: "p ≈ 0,051 : juste au-dessus de 0,05. Le seuil n'est pas magique : un tel résultat invite à recueillir plus de données, pas à conclure dans un sens ou dans l'autre.",
    },
    {
      kind: "text",
      md: `### Deux groupes indépendants : le test de Welch

Pour comparer les moyennes de deux groupes **indépendants**, on utilise le **test t de Welch** : \`stats.ttest_ind(groupe_a, groupe_b, equal_var=False)\`. Il ne suppose pas que les deux groupes ont la même variance, ce qui le rend plus sûr que le test t « classique » ; beaucoup de statisticiens le recommandent par défaut.

Dans le jeu diabetes, la progression moyenne vaut 149 dans un groupe (sexe codé 1) et 156 dans l'autre (codé 2). Est-ce une différence notable ?`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Comparez la **progression** des deux groupes (`sex` vaut 1 ou 2) avec un **test de Welch**, et rangez la p-value dans `p_valeur`. Peut-on conclure à une différence au seuil de 5 % ?",
      setup: DIABETE,
      starter: lines(
        "groupe_1 = d.loc[d['sex'] == 1, 'progression']",
        "groupe_2 = d.loc[d['sex'] == 2, 'progression']",
        "p_valeur = None",
      ),
      solution: lines(
        "groupe_1 = d.loc[d['sex'] == 1, 'progression']",
        "groupe_2 = d.loc[d['sex'] == 2, 'progression']",
        "resultat = stats.ttest_ind(groupe_1, groupe_2, equal_var=False)",
        "p_valeur = resultat.pvalue",
        "print(round(p_valeur, 3))",
      ),
      test: lines(
        "assert p_valeur is not None, \"rangez la p-value du test dans p_valeur\"",
        "assert abs(p_valeur - 0.3674449793083972) < 1e-6, f\"avec le test de Welch (equal_var=False), on obtient p ≈ 0,367 (vous avez {p_valeur:.4f})\"",
      ),
      hint: "stats.ttest_ind(groupe_1, groupe_2, equal_var=False), puis .pvalue.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Avec p ≈ 0,37, on ne rejette pas l'hypothèse nulle : les données sont compatibles avec une absence de différence. Ce n'est **pas** une preuve que les deux groupes sont identiques : l'écart réel, s'il existe, est peut-être trop petit pour être détecté avec ces effectifs.",
    },
    {
      kind: "text",
      md: `### Mesures appariées

Quand on mesure **les mêmes personnes** deux fois (avant et après un programme, par exemple), les deux séries ne sont pas indépendantes. On compare alors les **différences** individuelles avec le test t **apparié** : \`stats.ttest_rel(avant, apres)\`. Il est bien plus sensible qu'un test entre groupes indépendants, car chaque personne sert de témoin à elle-même.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Quinze personnes (données fictives) ont été pesées **avant** et **après** un programme. Faites le **test apparié** et rangez la p-value dans `p_apparie`.",
      setup: lines(
        "import numpy as np",
        "from scipy import stats",
        "",
        "rng = np.random.default_rng(42)",
        "rng.normal(31.5, 4, 25)  # même générateur que l'exemple précédent",
        "avant = rng.normal(60, 8, 15).round(1)",
        "apres = (avant - rng.normal(2, 3, 15)).round(1)",
      ),
      starter: "p_apparie = stats.ttest_ind(avant, apres).pvalue",
      solution: lines("p_apparie = stats.ttest_rel(avant, apres).pvalue", "print(p_apparie)"),
      test: lines(
        "attendu = stats.ttest_rel(avant, apres).pvalue",
        "assert abs(p_apparie - attendu) < 1e-12, \"les mesures portent sur les mêmes personnes : utilisez le test apparié stats.ttest_rel\"",
        "assert p_apparie < 0.001, \"avec le test apparié, la p-value est très petite\"",
      ),
      hint: "Même personne mesurée deux fois : stats.ttest_rel(avant, apres).",
    },
    {
      kind: "text",
      md: `### Erreurs et taille d'effet

- **Erreur de type I** : rejeter H0 alors qu'elle est vraie (un faux positif). Sa probabilité est alpha.
- **Erreur de type II** : ne pas rejeter H0 alors qu'elle est fausse (un effet réel non détecté). Elle diminue quand l'échantillon grandit.
- **Tests multiples** : avec 20 tests au seuil de 5 %, on s'attend à environ un faux positif même s'il n'y a aucun effet. On corrige (Bonferroni, Holm) ou on annonce le nombre de tests.

Enfin, avec un très grand échantillon, un écart minuscule devient « significatif ». On rapporte donc toujours la **taille de l'effet** (l'écart entre les moyennes, avec un intervalle de confiance), pas seulement la p-value.`,
    },
  ],
  quiz: [
    {
      question: "Une p-value de 0,03 signifie :",
      options: [
        "Qu'il y a 3 % de chances que H0 soit vraie",
        "Que si H0 était vraie, on observerait un écart au moins aussi grand dans environ 3 % des échantillons",
        "Que l'effet est grand",
        "Que l'effet a 97 % de chances d'être réel",
      ],
      correct: 1,
      explanation: "La p-value se calcule en supposant H0 vraie : elle mesure à quel point les données seraient surprenantes dans ce cas. Ce n'est pas la probabilité de H0.",
    },
    {
      question: "Un test donne p = 0,37. Que conclure ?",
      options: [
        "Les deux groupes sont identiques",
        "On ne rejette pas H0 : les données sont compatibles avec l'absence de différence, sans la prouver",
        "Il faut rejeter H0",
        "Le test est faux",
      ],
      correct: 1,
      explanation: "« Non significatif » ne veut pas dire « pas de différence » : un écart réel peut être trop petit pour être détecté avec l'échantillon disponible.",
    },
    {
      question: "On mesure la tension de 20 patients avant et après un traitement. Quel test ?",
      options: ["Test de Welch entre deux groupes indépendants", "Test t apparié", "Test du khi-deux", "Aucun test possible"],
      correct: 1,
      explanation: "Les deux séries portent sur les mêmes personnes : on teste les différences individuelles avec ttest_rel.",
    },
    {
      question: "Pourquoi rapporter la taille de l'effet en plus de la p-value ?",
      options: [
        "Parce que c'est obligatoire",
        "Parce qu'avec beaucoup de données, un écart minuscule devient significatif sans avoir d'importance pratique",
        "Parce que la p-value est toujours fausse",
        "Pour avoir plus de chiffres",
      ],
      correct: 1,
      explanation: "Significatif ne veut pas dire important. L'écart observé, avec son intervalle de confiance, dit si la différence compte en pratique.",
    },
  ],
};
