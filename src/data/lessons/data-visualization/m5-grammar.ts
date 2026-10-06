import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const IRIS = lines(
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "from sklearn.datasets import load_iris",
  "",
  "iris = load_iris(as_frame=True)",
  "df = iris.frame",
  "df['espece'] = df['target'].map(dict(enumerate(iris.target_names)))",
);

export const moduleGrammar: LessonModule = {
  id: "altair-grammar",
  title: "La grammaire des graphiques (et Altair)",
  duration: "1 h 30",
  summary: "Décrire un graphique par ses données, ses marques et ses encodages : l'idée derrière ggplot2, Altair et Plotly Express.",
  objectives: [
    "Décomposer un graphique en données, marques, encodages et échelles",
    "Lire un exemple Altair et dire quel encodage correspond à quelle colonne",
    "Réaliser un encodage de couleur et des facettes avec Matplotlib",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un graphique, c'est une phrase

Dans *The Grammar of Graphics* (1999), Leland Wilkinson propose de décrire tout graphique avec un petit vocabulaire :

- des **données** ;
- des **marques** : points, barres, lignes ;
- des **encodages** : quelle colonne va sur l'axe x, sur l'axe y, dans la couleur, la taille, la forme ;
- des **échelles** : comment une valeur devient une position ou une couleur ;
- éventuellement des **facettes** : un petit graphique par valeur d'une colonne.

Cette idée inspire **ggplot2** (en R), **Vega-Lite** et sa version Python **Altair**, et la logique de **Plotly Express** et **Seaborn**. Une fois comprise, passer d'un outil à l'autre devient facile.`,
    },
    {
      kind: "text",
      md: `### Altair, en lecture

\`\`\`
import altair as alt
alt.Chart(df).mark_point().encode(
    x="petal length (cm)",
    y="petal width (cm)",
    color="espece",
).facet(column="espece")
\`\`\`

Une marque (\`mark_point\`), trois encodages (\`x\`, \`y\`, \`color\`) et des facettes (une colonne de graphiques par espèce). Altair produit une description Vega-Lite affichée par une bibliothèque JavaScript chargée depuis un serveur tiers : il n'est pas utilisé dans ce site, qui ne fait aucune requête externe. On réalise ci-dessous les mêmes encodages avec Matplotlib.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharex=True, sharey=True)",
        "for ax, (espece, groupe) in zip(axes, df.groupby('espece')):",
        "    ax.scatter(groupe['petal length (cm)'], groupe['petal width (cm)'], s=12)",
        "    ax.set_title(espece)",
        "    ax.set_xlabel('longueur du pétale')",
        "axes[0].set_ylabel('largeur du pétale')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Des facettes : un petit graphique par espèce, avec les mêmes échelles (sharex, sharey) pour que la comparaison soit juste.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur **un seul** graphique, tracez le nuage de points largeur du pétale en fonction de la longueur, avec **une couleur par espèce** (un appel à `scatter` par espèce) et une **légende** qui nomme les trois espèces.",
      setup: IRIS,
      starter: lines(
        "fig, ax = plt.subplots()",
        "ax.scatter(df['petal length (cm)'], df['petal width (cm)'])",
        "plt.show()",
      ),
      solution: lines(
        "fig, ax = plt.subplots()",
        "for espece, groupe in df.groupby('espece'):",
        "    ax.scatter(groupe['petal length (cm)'], groupe['petal width (cm)'], s=12, label=espece)",
        "ax.set_xlabel('longueur du pétale (cm)')",
        "ax.set_ylabel('largeur du pétale (cm)')",
        "ax.legend()",
        "plt.show()",
      ),
      test: lines(
        "assert len(ax.collections) == 3, f\"on attend un nuage par espèce, soit 3 appels à scatter (il y en a {len(ax.collections)})\"",
        "assert ax.get_legend() is not None, \"ajoutez une légende (label=... puis ax.legend())\"",
        "assert sorted(t.get_text() for t in ax.get_legend().get_texts()) == ['setosa', 'versicolor', 'virginica'], \"la légende doit nommer setosa, versicolor et virginica\"",
      ),
      hint: "Une boucle sur df.groupby('espece'), un scatter par groupe avec label=espece, puis ax.legend().",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Créez des **facettes** : une figure `fig` avec **un histogramme de la longueur du sépale par espèce**, côte à côte, chacun titré par le nom de l'espèce, avec la **même échelle horizontale**.",
      setup: IRIS,
      starter: lines("fig, ax = plt.subplots()", "ax.hist(df['sepal length (cm)'])", "plt.show()"),
      solution: lines(
        "fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharex=True)",
        "for ax, (espece, groupe) in zip(axes, df.groupby('espece')):",
        "    ax.hist(groupe['sepal length (cm)'], bins=10)",
        "    ax.set_title(espece)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      test: lines(
        "assert len(fig.axes) == 3, f\"on attend trois graphiques, un par espèce (il y en a {len(fig.axes)})\"",
        "assert [a.get_title() for a in fig.axes] == ['setosa', 'versicolor', 'virginica'], \"titrez chaque graphique par son espèce, dans l'ordre alphabétique\"",
        "assert len({a.get_xlim() for a in fig.axes}) == 1, \"les trois graphiques doivent partager la même échelle horizontale (sharex=True)\"",
      ),
      hint: "plt.subplots(1, 3, sharex=True), puis une boucle sur zip(axes, df.groupby('espece')).",
    },
  ],
  quiz: [
    {
      question: "Dans la grammaire des graphiques, qu'est-ce qu'un encodage ?",
      options: [
        "Le format du fichier exporté",
        "L'association d'une colonne des données à un rôle visuel (x, y, couleur, taille...)",
        "La compression de l'image",
        "Le titre du graphique",
      ],
      correct: 1,
      explanation: "Encoder, c'est dire « cette colonne va sur l'axe x, celle-ci dans la couleur ». C'est le cœur de ggplot2, Altair ou Plotly Express.",
    },
    {
      question: "Que sont des facettes ?",
      options: [
        "Des couleurs différentes",
        "Plusieurs petits graphiques, un par valeur d'une colonne, avec les mêmes échelles",
        "Des étiquettes sur les points",
        "Un graphique en 3D",
      ],
      correct: 1,
      explanation: "Les facettes (small multiples) répètent le même graphique pour chaque groupe ; des échelles communes rendent la comparaison honnête.",
    },
    {
      question: "Qui a formalisé la grammaire des graphiques ?",
      options: ["John Tukey", "Leland Wilkinson", "Edward Tufte", "Florence Nightingale"],
      correct: 1,
      explanation: "Leland Wilkinson, dans The Grammar of Graphics (1999). Tukey a promu l'analyse exploratoire, Tufte a écrit sur la clarté graphique.",
    },
    {
      question: "Pourquoi Altair et Plotly ne sont-ils pas exécutés dans ce site ?",
      options: [
        "Parce qu'ils sont payants",
        "Parce qu'ils ne fonctionnent pas en Python",
        "Parce qu'ils ne sont pas dans le moteur du site et affichent leurs graphiques avec une bibliothèque JavaScript chargée depuis un serveur tiers",
        "Parce qu'ils sont obsolètes",
      ],
      correct: 2,
      explanation: "Le site n'effectue aucune requête vers des serveurs tiers. Les deux outils sont libres et très utilisés ; ils s'installent sans difficulté sur votre machine.",
    },
  ],
};
