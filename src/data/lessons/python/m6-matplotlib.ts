import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module6: LessonModule = {
  id: "module-6",
  title: "Matplotlib : premiers graphiques",
  duration: "2 h",
  summary: "Figure et axes, courbes, barres, histogrammes et nuages de points, titres et légendes : de quoi regarder ses données, avant le cours dédié à la visualisation.",
  objectives: [
    "Créer une figure et ses axes avec plt.subplots",
    "Choisir entre courbe, barres, histogramme et nuage de points",
    "Rendre un graphique lisible : titre, étiquettes d'axes, légende",
    "Placer plusieurs graphiques dans une même figure",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi tracer

Un tableau de chiffres cache souvent ce qu'un graphique montre d'un coup d'œil : une tendance, un creux, une valeur aberrante. **Matplotlib** est la bibliothèque de graphiques historique de Python ; pandas et beaucoup d'autres outils s'appuient sur elle.

Un graphique Matplotlib est une **figure** (la feuille) qui contient un ou plusieurs **axes** (les zones de tracé, avec leurs échelles), sur lesquels on dessine des éléments : courbes, barres, textes. On les crée ensemble avec \`fig, ax = plt.subplots()\`, puis on appelle les méthodes de \`ax\`. Cette écriture, dite « orientée objet », est plus claire que les appels directs à \`plt\` dès qu'il y a plusieurs graphiques.`,
    },
    { kind: "widget", widget: "matplotlib-workflow" },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "jours = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']",
        "matin = [8, 9, 11, 10, 12, 14, 13]",
        "apres_midi = [15, 16, 19, 18, 20, 23, 21]",
        "",
        "fig, ax = plt.subplots(figsize=(7, 3.5))",
        "ax.plot(jours, matin, marker='o', label='matin')",
        "ax.plot(jours, apres_midi, marker='o', label='après-midi')",
        "ax.set_title('Températures de la semaine (données inventées)')",
        "ax.set_ylabel('°C')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "Une courbe par série, une légende pour les distinguer, un titre et une unité : le minimum pour qu'un graphique se lise seul.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Tracez un **diagramme en barres** du nombre de prêts par genre (listes `genres` et `prets` fournies) avec `ax.bar`. Donnez-lui le titre « Prêts par genre » et l'étiquette d'axe vertical « prêts ». Gardez la figure dans `fig` et les axes dans `ax`.",
      setup: lines("import matplotlib.pyplot as plt", "genres = ['roman', 'BD', 'policier', 'documentaire']", "prets = [42, 35, 28, 17]"),
      starter: lines("fig, ax = plt.subplots()", "ax.plot(genres, prets)"),
      solution: lines(
        "fig, ax = plt.subplots()",
        "ax.bar(genres, prets)",
        "ax.set_title('Prêts par genre')",
        "ax.set_ylabel('prêts')",
      ),
      test: lines(
        "assert len(ax.patches) == 4, f\"on attend 4 barres, une par genre (il y en a {len(ax.patches)}) : utilisez ax.bar\"",
        "_hauteurs = [p.get_height() for p in ax.patches]",
        "assert _hauteurs == prets, f\"les hauteurs des barres doivent être les nombres de prêts (vous avez {_hauteurs})\"",
        "assert ax.get_title() == 'Prêts par genre', f\"titre attendu : « Prêts par genre » (vous avez « {ax.get_title()} »)\"",
        "assert ax.get_ylabel() == 'prêts', f\"étiquette verticale attendue : « prêts » (vous avez « {ax.get_ylabel()} »)\"",
      ),
      hint: "ax.bar(genres, prets), puis ax.set_title(...) et ax.set_ylabel(...).",
    },
    {
      kind: "text",
      md: `### Quel graphique pour quelle question

- **Courbe** (\`ax.plot\`) : une valeur qui évolue dans un ordre (le temps, le plus souvent).
- **Barres** (\`ax.bar\`, \`ax.barh\` à l'horizontale) : comparer des quantités entre catégories.
- **Histogramme** (\`ax.hist\`) : la répartition d'une variable numérique ; le nombre de classes (\`bins\`) change l'impression, il faut en essayer plusieurs.
- **Nuage de points** (\`ax.scatter\`) : la relation entre deux variables numériques.
- **Boîte à moustaches** (\`ax.boxplot\`) : comparer des distributions de façon compacte.

Pour plusieurs graphiques côte à côte : \`fig, axes = plt.subplots(1, 2)\` renvoie un tableau d'axes, que l'on remplit un par un.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "rng = np.random.default_rng(1)",
        "age = rng.integers(8, 80, size=150)",
        "livres_par_an = np.clip(np.round(5 + 0.15 * age + rng.normal(0, 4, size=150)), 0, None)",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))",
        "axes[0].hist(age, bins=10, edgecolor='white')",
        "axes[0].set_title('Âge des lecteurs')",
        "axes[0].set_xlabel('âge')",
        "axes[1].scatter(age, livres_par_an, alpha=0.6)",
        "axes[1].set_title('Livres empruntés par an selon l\\'âge')",
        "axes[1].set_xlabel('âge')",
        "axes[1].set_ylabel('livres par an')",
        "plt.tight_layout()",
      ),
      caption: "Données inventées : l'histogramme montre la répartition d'une seule variable, le nuage de points la relation entre deux. Changez bins=10 en bins=5 ou bins=30 pour voir combien l'impression dépend de ce choix.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Tracez l'**histogramme** des 200 temps d'attente fournis (`attente`, en minutes) avec **10 classes**, et donnez à l'axe horizontal l'étiquette « minutes ». Gardez les axes dans `ax`.",
      setup: lines("import numpy as np", "import matplotlib.pyplot as plt", "attente = np.random.default_rng(3).exponential(6, size=200)"),
      starter: lines("fig, ax = plt.subplots()", "ax.hist(attente)", "ax.set_xlabel('temps')"),
      solution: lines("fig, ax = plt.subplots()", "ax.hist(attente, bins=10)", "ax.set_xlabel('minutes')"),
      test: lines(
        "assert len(ax.patches) == 10, f\"on attend 10 classes (il y a {len(ax.patches)} barres) : ax.hist(attente, bins=10)\"",
        "assert int(sum(p.get_height() for p in ax.patches)) == 200, \"l'histogramme doit compter les 200 temps d'attente\"",
        "assert ax.get_xlabel() == 'minutes', f\"étiquette horizontale attendue : « minutes » (vous avez « {ax.get_xlabel()} »)\"",
      ),
      hint: "ax.hist(attente, bins=10), puis ax.set_xlabel('minutes').",
    },
    {
      kind: "text",
      md: lines(
        "### Raccourcis et enregistrement",
        "",
        "Un DataFrame pandas sait tracer ses colonnes directement (`df.plot()`, `df['colonne'].hist()`) : c'est Matplotlib en coulisse, et la méthode renvoie les axes, que l'on peut compléter. Sur votre machine, une figure s'enregistre dans un fichier ; ce site n'écrit pas de fichiers, voici donc le code à lire :",
        "",
        "```python",
        "fig.savefig('prets.png', dpi=150, bbox_inches='tight')",
        "fig.savefig('prets.svg')  # format vectoriel, net à toutes les tailles",
        "```",
      ),
    },
    {
      kind: "note",
      tone: "tip",
      md: "Ce module ne donne que les bases. Le cours « Visualisation de données » (sept modules) va beaucoup plus loin : choisir le bon graphique, couleurs lisibles par tous, annotations, graphiques statistiques, et ce que proposent Seaborn ou Plotly.",
    },
  ],
  quiz: [
    {
      question: "Que renvoie fig, ax = plt.subplots() ?",
      options: [
        "Deux graphiques identiques",
        "La figure (la feuille) et les axes (la zone de tracé) sur lesquels on dessine",
        "Une image PNG",
        "Un DataFrame",
      ],
      correct: 1,
      explanation: "La figure contient les axes ; on trace avec les méthodes des axes (ax.plot, ax.bar, ax.set_title...).",
    },
    {
      question: "Pour montrer la répartition des âges de 150 lecteurs, quel graphique choisir ?",
      options: ["Une courbe", "Un histogramme", "Un diagramme circulaire", "Un nuage de points"],
      correct: 1,
      explanation: "L'histogramme compte combien de valeurs tombent dans chaque classe d'âge : c'est la forme de la distribution.",
    },
    {
      question: "Pourquoi essayer plusieurs valeurs de bins pour un histogramme ?",
      options: [
        "Pour accélérer le calcul",
        "Parce que le nombre de classes change l'impression donnée par la distribution",
        "Parce que Matplotlib l'exige",
        "Pour changer les couleurs",
      ],
      correct: 1,
      explanation: "Trop peu de classes cachent des détails, trop de classes font apparaître du bruit : on regarde plusieurs découpages avant de conclure.",
    },
  ],
};
