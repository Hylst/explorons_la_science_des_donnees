import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DIABETE } from "./data";

export const moduleCorrelationRegression: LessonModule = {
  id: "correlation-regression",
  title: "Corrélation et régression",
  duration: "2 h",
  summary: "Mesurer un lien entre deux variables, le résumer par une droite, et savoir ce que cela ne prouve pas.",
  objectives: [
    "Calculer et interpréter les corrélations de Pearson et de Spearman",
    "Ajuster une droite avec stats.linregress et lire pente, R² et p-value",
    "Regarder les données avant de conclure (nuage de points, résidus)",
    "Ne pas confondre corrélation et causalité",
  ],
  sections: [
    {
      kind: "text",
      md: `### Deux corrélations

- La corrélation de **Pearson** (r) mesure la force d'une relation **linéaire**, de -1 à 1. Elle est sensible aux valeurs extrêmes.
- La corrélation de **Spearman** (rho) travaille sur les **rangs** : elle mesure une relation **monotone** (qui monte, ou qui descend, sans forcément suivre une droite) et résiste mieux aux valeurs extrêmes.

Avec \`stats.pearsonr(x, y)\` et \`stats.spearmanr(x, y)\`, on obtient le coefficient et une p-value (qui teste l'hypothèse « corrélation nulle »). Avec beaucoup de données, une corrélation très faible peut être « significative » : c'est la **valeur** du coefficient qui dit si le lien est fort.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DIABETE,
        "import matplotlib.pyplot as plt",
        "",
        "r, p = stats.pearsonr(d['imc'], d['progression'])",
        "rho, p2 = stats.spearmanr(d['imc'], d['progression'])",
        "print(f'Pearson r = {r:.3f}   Spearman rho = {rho:.3f}')",
        "",
        "fig, ax = plt.subplots()",
        "ax.scatter(d['imc'], d['progression'], s=10, alpha=0.5)",
        "ax.set_xlabel('IMC')",
        "ax.set_ylabel('progression de la maladie')",
        "plt.show()",
      ),
      caption: "r ≈ 0,59 : un lien positif net, mais avec une grande dispersion autour de la tendance. On regarde toujours le nuage avant le chiffre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez la corrélation de **Pearson** entre la **pression artérielle** (colonne `bp`) et la **progression**, et rangez le coefficient dans `r_bp`.",
      setup: DIABETE,
      starter: "r_bp = None",
      solution: lines("r_bp, p = stats.pearsonr(d['bp'], d['progression'])", "print(round(r_bp, 3))"),
      test: lines(
        "assert r_bp is not None, \"rangez le coefficient dans r_bp\"",
        "attendu = stats.pearsonr(d['bp'], d['progression']).statistic",
        "assert abs(float(r_bp) - attendu) < 1e-9, f\"on attend la corrélation de Pearson entre bp et progression, environ {attendu:.3f}\"",
      ),
      hint: "stats.pearsonr(x, y) renvoie le coefficient et la p-value.",
    },
    {
      kind: "text",
      md: `### Une droite de régression

\`stats.linregress(x, y)\` ajuste la droite des moindres carrés et renvoie la **pente**, l'**ordonnée à l'origine**, le coefficient de corrélation \`rvalue\` (son carré est le **R²**, la part de variance expliquée) et une p-value pour la pente.

Sur le diabète : chaque point d'IMC supplémentaire est associé, en moyenne, à environ 10 points de progression en plus, et l'IMC seul explique environ un tiers de la variance (R² ≈ 0,34). Les deux tiers restants dépendent d'autres facteurs. Le cours de machine learning supervisé reprend la régression avec plusieurs variables.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec `stats.linregress`, ajustez la droite de la **progression en fonction de l'IMC**. Rangez la **pente** dans `pente` et le **R²** dans `r2`.",
      setup: DIABETE,
      starter: lines("resultat = stats.linregress(d['imc'], d['progression'])", "pente = None", "r2 = resultat.rvalue"),
      solution: lines(
        "resultat = stats.linregress(d['imc'], d['progression'])",
        "pente = resultat.slope",
        "r2 = resultat.rvalue ** 2",
        "print(round(pente, 2), round(r2, 3))",
      ),
      test: lines(
        "assert pente is not None and abs(pente - 10.233) < 0.01, \"la pente vaut environ 10,2 points de progression par point d'IMC\"",
        "assert abs(r2 - 0.344) < 0.001, f\"le R² est le carré de rvalue, environ 0,344 (vous avez {r2:.3f})\"",
      ),
      hint: "resultat.slope pour la pente ; le R² est resultat.rvalue au carré.",
    },
    {
      kind: "text",
      md: `### Ce qu'une corrélation ne dit pas

- **Pas de causalité** : l'IMC et la progression sont liés, mais l'âge, l'alimentation, l'activité physique peuvent agir sur les deux. Seule une étude conçue pour cela (expérience contrôlée, ou méthodes causales soigneuses) peut parler de cause.
- **Pas de relation non linéaire** : une relation en U peut donner r ≈ 0 alors que le lien est fort. D'où le nuage de points systématique.
- **Attention aux groupes mélangés** : une corrélation peut s'inverser quand on sépare les groupes (paradoxe de Simpson). L'article du blog « Corrélation n'est pas causalité » en donne des exemples réels.`,
    },
  ],
  quiz: [
    {
      question: "Quelle différence entre Pearson et Spearman ?",
      options: [
        "Aucune",
        "Pearson mesure une relation linéaire, Spearman une relation monotone en travaillant sur les rangs",
        "Spearman ne fonctionne qu'avec des catégories",
        "Pearson est toujours plus grand",
      ],
      correct: 1,
      explanation: "Spearman remplace les valeurs par leurs rangs : il capte toute relation qui monte ou descend régulièrement, et résiste mieux aux valeurs extrêmes.",
    },
    {
      question: "Un R² de 0,34 signifie :",
      options: [
        "Que le modèle se trompe dans 34 % des cas",
        "Que la variable explique environ un tiers de la variance de la cible",
        "Que la pente vaut 0,34",
        "Que la corrélation vaut 0,34",
      ],
      correct: 1,
      explanation: "Le R² est la part de variance expliquée par la droite. Ici r ≈ 0,59, et r² ≈ 0,34.",
    },
    {
      question: "Une corrélation proche de 0 prouve-t-elle l'absence de lien ?",
      options: [
        "Oui, toujours",
        "Non : il peut exister une relation non linéaire (en U, par exemple)",
        "Oui, si l'échantillon est grand",
        "Seulement avec Spearman",
      ],
      correct: 1,
      explanation: "Pearson ne mesure que l'alignement sur une droite. Une relation en U peut être forte avec r ≈ 0 : on regarde le nuage de points.",
    },
    {
      question: "L'IMC et la progression du diabète sont corrélés. Peut-on dire que l'IMC cause la progression ?",
      options: [
        "Oui, la corrélation le prouve",
        "Non, pas avec ces seules données : d'autres facteurs peuvent agir sur les deux",
        "Oui, si la p-value est petite",
        "Non, car la corrélation est négative",
      ],
      correct: 1,
      explanation: "Une corrélation, même très significative, ne suffit pas à établir une cause. Il faut une étude conçue pour cela.",
    },
  ],
};
