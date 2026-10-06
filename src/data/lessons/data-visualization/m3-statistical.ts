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

export const moduleStatistical: LessonModule = {
  id: "seaborn-statistical",
  title: "Graphiques statistiques (et Seaborn)",
  duration: "2 h 30",
  summary: "Histogrammes, boîtes à moustaches, nuages de points et cartes de corrélation : montrer une distribution, pas seulement une moyenne.",
  objectives: [
    "Choisir le nombre de classes d'un histogramme en connaissance de cause",
    "Comparer des distributions avec des boîtes à moustaches",
    "Montrer une relation avec un nuage de points, et une matrice de corrélation avec une carte de chaleur",
    "Situer Seaborn par rapport à Matplotlib",
  ],
  sections: [
    {
      kind: "text",
      md: `### Montrer la distribution

Une moyenne cache presque tout : deux classes de même moyenne peuvent avoir des notes très groupées ou très dispersées, une forme symétrique ou deux bosses. Les graphiques statistiques montrent la **distribution** entière.

- L'**histogramme** découpe les valeurs en classes et compte les observations dans chacune. Le nombre de classes (\`bins\`) change beaucoup l'impression : trop peu, on écrase la forme ; trop, on ne voit que du bruit. On en essaie plusieurs.
- La **boîte à moustaches** (*boxplot*) résume une distribution par sa médiane, ses quartiles et ses valeurs extrêmes ; elle permet de comparer de nombreux groupes côte à côte.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharey=True)",
        "for ax, n in zip(axes, [5, 15, 60]):",
        "    ax.hist(df['sepal length (cm)'], bins=n)",
        "    ax.set_title(f'{n} classes')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Les mêmes 150 longueurs de sépale avec 5, 15 et 60 classes : la forme perçue change avec ce seul réglage.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Tracez l'**histogramme** de la colonne `'petal length (cm)'` avec **20 classes**, et donnez à l'axe horizontal le libellé **« longueur du pétale (cm) »**. Gardez les noms `fig` et `ax`.",
      setup: IRIS,
      starter: lines("fig, ax = plt.subplots()", "ax.hist(df['petal length (cm)'])", "plt.show()"),
      solution: lines(
        "fig, ax = plt.subplots()",
        "ax.hist(df['petal length (cm)'], bins=20)",
        "ax.set_xlabel('longueur du pétale (cm)')",
        "plt.show()",
      ),
      test: lines(
        "assert len(ax.patches) == 20, f\"on attend 20 classes (bins=20) ; il y en a {len(ax.patches)}\"",
        "assert ax.get_xlabel() == 'longueur du pétale (cm)', f\"libellé attendu : « longueur du pétale (cm) » (vous avez « {ax.get_xlabel()} »)\"",
      ),
      hint: "ax.hist(..., bins=20) puis ax.set_xlabel('longueur du pétale (cm)').",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Comparez la **longueur du pétale** des trois espèces avec **une boîte à moustaches par espèce**, étiquetées par le nom de l'espèce (`setosa`, `versicolor`, `virginica`, dans cet ordre).",
      setup: IRIS,
      starter: lines("fig, ax = plt.subplots()", "ax.boxplot(df['petal length (cm)'])", "plt.show()"),
      solution: lines(
        "especes = ['setosa', 'versicolor', 'virginica']",
        "groupes = [df.loc[df['espece'] == e, 'petal length (cm)'] for e in especes]",
        "fig, ax = plt.subplots()",
        "ax.boxplot(groupes, tick_labels=especes)",
        "ax.set_ylabel('longueur du pétale (cm)')",
        "plt.show()",
      ),
      test: lines(
        "etiquettes = [t.get_text() for t in ax.get_xticklabels()]",
        "assert etiquettes == ['setosa', 'versicolor', 'virginica'], f\"on attend une boîte par espèce, étiquetées setosa, versicolor, virginica (vous avez {etiquettes})\"",
      ),
      hint: "Préparez une liste de trois séries (une par espèce), puis ax.boxplot(groupes, tick_labels=especes).",
    },
    {
      kind: "text",
      md: `### Relations : nuage de points et carte de corrélation

Le **nuage de points** montre la relation entre deux variables quantitatives ; une couleur par groupe ajoute une troisième information. Quand les points sont nombreux, on les rend transparents (\`alpha=0.3\`) pour voir les zones denses.

Pour un aperçu de toutes les relations deux à deux, on peut afficher la **matrice de corrélation** sous forme de **carte de chaleur** (\`ax.imshow\`), avec une échelle de couleur divergente (bleu pour négatif, rouge pour positif) centrée sur 0, et les valeurs écrites dans les cases. Rappel : une corrélation ne mesure que les relations **linéaires**, et ne dit rien de la cause.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "import numpy as np",
        "",
        "mesures = df[iris.feature_names]",
        "corr = mesures.corr().round(2)",
        "fig, ax = plt.subplots(figsize=(5.5, 4.5))",
        "image = ax.imshow(corr, cmap='RdBu_r', vmin=-1, vmax=1)",
        "noms = ['sépale L', 'sépale l', 'pétale L', 'pétale l']",
        "ax.set_xticks(range(4), noms, rotation=30)",
        "ax.set_yticks(range(4), noms)",
        "for i in range(4):",
        "    for j in range(4):",
        "        ax.text(j, i, corr.iloc[i, j], ha='center', va='center')",
        "fig.colorbar(image)",
        "ax.set_title('Corrélations entre les mesures des iris')",
        "plt.show()",
      ),
      caption: "Longueur et largeur du pétale sont très liées (0,96) ; la largeur du sépale est liée négativement aux autres mesures, de façon faible à modérée (de -0,12 à -0,43).",
    },
    {
      kind: "text",
      md: `### Et Seaborn ?

**Seaborn** est une bibliothèque construite au-dessus de Matplotlib, spécialisée dans les graphiques statistiques. Une ligne suffit souvent là où Matplotlib en demande dix : \`sns.boxplot(data=df, x='espece', y='petal length (cm)')\`, \`sns.histplot\`, \`sns.scatterplot(..., hue='espece')\`, \`sns.heatmap(corr, annot=True)\`, \`sns.pairplot(df, hue='espece')\`.

Seaborn n'est pas installé dans le moteur Python de ce site : les exemples ci-dessus sont donc écrits avec Matplotlib et pandas, ce qui a l'avantage de montrer ce qui se passe « sous le capot ». Sur votre machine, \`pip install seaborn\` suffit, et tout ce que vous avez appris ici reste valable : Seaborn renvoie des axes Matplotlib que l'on personnalise de la même façon.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi essayer plusieurs nombres de classes pour un histogramme ?",
      options: [
        "Parce que le résultat est aléatoire",
        "Parce que la forme perçue change beaucoup avec ce réglage",
        "Pour avoir plus de couleurs",
        "Ce n'est pas utile",
      ],
      correct: 1,
      explanation: "Trop peu de classes écrasent la forme, trop de classes montrent surtout du bruit. Comparer plusieurs réglages évite de tirer une conclusion d'un artefact.",
    },
    {
      question: "Que montre une boîte à moustaches ?",
      options: [
        "Seulement la moyenne",
        "La médiane, les quartiles et l'étendue des valeurs, de quoi comparer plusieurs groupes",
        "L'évolution dans le temps",
        "La corrélation entre deux variables",
      ],
      correct: 1,
      explanation: "La boîte va du premier au troisième quartile, le trait central est la médiane, et les moustaches montrent l'étendue (avec les valeurs extrêmes à part).",
    },
    {
      question: "Pour une matrice de corrélation, quelle palette de couleurs convient ?",
      options: [
        "Une palette divergente centrée sur 0 (par exemple bleu pour négatif, rouge pour positif)",
        "Une seule couleur",
        "Des couleurs au hasard",
        "Une palette arc-en-ciel",
      ],
      correct: 0,
      explanation: "Les corrélations vont de -1 à 1 avec un centre naturel en 0 : une palette divergente fixée de -1 à 1 rend le signe et la force lisibles d'un coup d'œil.",
    },
    {
      question: "Quel lien entre Seaborn et Matplotlib ?",
      options: [
        "Aucun, ce sont deux outils concurrents",
        "Seaborn est construit au-dessus de Matplotlib et renvoie des axes Matplotlib",
        "Matplotlib est construit au-dessus de Seaborn",
        "Seaborn ne fonctionne que dans un navigateur",
      ],
      correct: 1,
      explanation: "Seaborn simplifie les graphiques statistiques, mais dessine avec Matplotlib : les axes obtenus se personnalisent avec les méthodes vues au module 2.",
    },
  ],
};
