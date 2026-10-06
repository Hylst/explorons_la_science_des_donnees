import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const METEO = lines(
  "import pandas as pd",
  "",
  "# Températures moyennes fictives, au format « large » : une colonne par ville",
  "large = pd.DataFrame({",
  "    'mois': ['janv.', 'févr.', 'mars', 'avr.'],",
  "    'Rennes': [6, 7, 9, 11],",
  "    'Brest': [8, 8, 9, 10],",
  "    'Strasbourg': [2, 4, 8, 12],",
  "})",
);

export const moduleInteractive: LessonModule = {
  id: "plotly-interactive",
  title: "Visualisations interactives (et Plotly)",
  duration: "2 h",
  summary: "Quand l'interactivité aide vraiment, et la forme de données que demandent tous les outils modernes : le format long.",
  objectives: [
    "Dire quand l'interactivité apporte quelque chose, et quand elle gêne",
    "Passer du format large au format long avec melt, et revenir avec pivot",
    "Lire un exemple Plotly Express et retrouver la logique des encodages",
    "Préparer un graphique statique qui reste lisible sans interaction",
  ],
  sections: [
    {
      kind: "text",
      md: `### L'interactivité, un outil et non un décor

Survoler un point pour lire sa valeur exacte, zoomer sur une période, filtrer une catégorie : l'interactivité aide quand le lecteur **explore** des données nombreuses et cherche ses propres réponses. Elle aide peu quand on veut **transmettre** un message précis : un lecteur pressé ne survolera pas, et une conclusion cachée derrière un clic n'est pas vue.

Bonne pratique : un graphique interactif doit déjà être lisible **sans** interaction (titre qui dit ce qu'il faut voir, étiquettes directes), l'interaction venant en plus.`,
    },
    {
      kind: "text",
      md: `### Plotly Express, en lecture

**Plotly** produit des graphiques interactifs affichés dans le navigateur (avec une bibliothèque JavaScript). Son module **Plotly Express** décrit un graphique par les **colonnes** à utiliser pour chaque rôle :

\`\`\`
import plotly.express as px
fig = px.line(long, x="mois", y="temperature", color="ville",
              title="Températures moyennes par ville")
fig.show()
\`\`\`

Plotly n'est pas disponible dans le moteur Python de ce site (et il chargerait sa bibliothèque d'affichage depuis un serveur tiers, ce que le site s'interdit). Ce qui compte ici est la logique : une colonne pour l'axe horizontal, une pour l'axe vertical, une pour la couleur. Cette logique demande des données au **format long**.`,
    },
    {
      kind: "text",
      md: `### Format large et format long

- **Format large** : une ligne par mois, une colonne par ville. Pratique à lire dans un tableur.
- **Format long** (ou « tidy ») : une ligne par **observation** (un mois, une ville, une température), une colonne par **variable**. C'est la forme qu'attendent Plotly Express, Seaborn, Altair et ggplot2 : chaque variable devient une colonne que l'on associe à un rôle (\`x\`, \`y\`, \`color\`).

Avec pandas, \`melt\` passe du large au long, \`pivot\` du long au large.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        METEO,
        "",
        "long = large.melt(id_vars='mois', var_name='ville', value_name='temperature')",
        "print(long)",
        "print()",
        "print(long.pivot(index='mois', columns='ville', values='temperature'))",
      ),
      caption: "melt transforme 4 lignes et 3 colonnes de villes en 12 observations ; pivot fait le chemin inverse (en triant les lignes par ordre alphabétique).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Passez le tableau `large` au **format long** dans `long`, avec les colonnes **`mois`**, **`ville`** et **`temperature`**.",
      setup: METEO,
      starter: "long = large.copy()",
      solution: "long = large.melt(id_vars='mois', var_name='ville', value_name='temperature')\nprint(long.head())",
      test: lines(
        "assert list(long.columns) == ['mois', 'ville', 'temperature'], f\"colonnes attendues : mois, ville, temperature (vous avez {list(long.columns)})\"",
        "assert len(long) == 12, f\"4 mois et 3 villes font 12 observations (vous en avez {len(long)})\"",
        "assert set(long['ville']) == {'Rennes', 'Brest', 'Strasbourg'}, \"la colonne ville doit contenir les noms des trois villes\"",
      ),
      hint: "large.melt(id_vars='mois', var_name='ville', value_name='temperature').",
    },
    {
      kind: "text",
      md: `### Le même graphique, en statique

Avec Matplotlib, on reproduit la logique d'encodage en traçant une courbe par valeur de la colonne \`ville\`. Une étiquette directe au bout de chaque courbe remplace avantageusement une légende.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "À partir du format long, tracez **une courbe par ville** (mois en abscisse, température en ordonnée), avec une **légende** qui donne le nom de chaque ville. Gardez les noms `fig` et `ax`.",
      setup: lines(METEO, "long = large.melt(id_vars='mois', var_name='ville', value_name='temperature')", "import matplotlib.pyplot as plt"),
      starter: lines("fig, ax = plt.subplots()", "ax.plot(long['mois'], long['temperature'])", "plt.show()"),
      solution: lines(
        "fig, ax = plt.subplots()",
        "for ville, groupe in long.groupby('ville'):",
        "    ax.plot(groupe['mois'], groupe['temperature'], marker='o', label=ville)",
        "ax.set_ylabel('température (°C)')",
        "ax.legend()",
        "plt.show()",
      ),
      test: lines(
        "assert len(ax.lines) == 3, f\"on attend une courbe par ville, soit 3 (il y en a {len(ax.lines)})\"",
        "legende = ax.get_legend()",
        "assert legende is not None, \"ajoutez une légende avec ax.legend() (et label=... pour chaque courbe)\"",
        "assert sorted(t.get_text() for t in legende.get_texts()) == ['Brest', 'Rennes', 'Strasbourg'], \"la légende doit nommer les trois villes\"",
      ),
      hint: "for ville, groupe in long.groupby('ville'): ax.plot(..., label=ville), puis ax.legend().",
    },
  ],
  quiz: [
    {
      question: "Quand l'interactivité est-elle la plus utile ?",
      options: [
        "Pour transmettre un message unique à un lecteur pressé",
        "Pour laisser le lecteur explorer des données nombreuses",
        "Toujours, un graphique interactif est toujours meilleur",
        "Jamais",
      ],
      correct: 1,
      explanation: "L'exploration (survoler, zoomer, filtrer) profite de l'interactivité. Pour un message précis, un graphique statique bien titré et annoté est souvent plus efficace.",
    },
    {
      question: "Qu'est-ce que le format long ?",
      options: [
        "Un tableau avec beaucoup de colonnes",
        "Une ligne par observation et une colonne par variable",
        "Un tableau trié par ordre alphabétique",
        "Un fichier CSV très grand",
      ],
      correct: 1,
      explanation: "Chaque observation (mois, ville, température) occupe une ligne : les outils peuvent alors associer chaque colonne à un rôle du graphique.",
    },
    {
      question: "Quelle fonction pandas passe du format large au format long ?",
      options: ["pivot", "melt", "merge", "concat"],
      correct: 1,
      explanation: "melt « fait fondre » les colonnes en lignes ; pivot fait l'opération inverse.",
    },
    {
      question: "Dans px.line(long, x='mois', y='temperature', color='ville'), que fait color='ville' ?",
      options: [
        "Il colore tout en une seule couleur",
        "Il trace une courbe d'une couleur différente pour chaque valeur de la colonne ville",
        "Il trie les villes",
        "Il supprime la colonne ville",
      ],
      correct: 1,
      explanation: "La colonne ville est associée à la couleur : chaque ville a sa courbe et sa couleur, et la légende est créée automatiquement.",
    },
  ],
};
