import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "",
  "# Activité fictive d'un réseau de bibliothèques sur douze mois",
  "rng = np.random.default_rng(3)",
  "mois = pd.date_range('2025-01-01', periods=12, freq='MS')",
  "emprunts = (400 + 60 * np.sin(np.arange(12) / 12 * 2 * np.pi) + rng.normal(0, 15, 12)).round()",
  "inscriptions = (30 + rng.normal(0, 5, 12)).round()",
  "par_site = pd.Series({'Centre': 2300, 'Nord': 1600, 'Sud': 1100, 'Bibliobus': 450})",
);

export const moduleDashboard: LessonModule = {
  id: "dashboard-design",
  title: "Concevoir un tableau de bord",
  duration: "1 h 30",
  summary: "Peu d'indicateurs, bien choisis, bien rangés : un tableau de bord sert une décision, pas une collection de graphiques.",
  objectives: [
    "Partir des décisions de l'utilisateur pour choisir les indicateurs",
    "Organiser la lecture : l'essentiel en haut à gauche, du général au détail",
    "Garder des échelles, des couleurs et des unités cohérentes",
    "Assembler un petit tableau de bord avec Matplotlib",
  ],
  sections: [
    {
      kind: "text",
      md: `### À qui, et pour décider quoi ?

Un tableau de bord n'est pas une vitrine de tous les graphiques possibles. Avant d'en dessiner un, on répond à trois questions :

- **qui** le lit (une directrice, une équipe, le public) et **combien de temps** il y consacre ;
- quelles **décisions** il doit éclairer (ouvrir un créneau, déplacer des collections, relancer des adhérents) ;
- quels **indicateurs** répondent vraiment à ces décisions, avec leur **référence** (l'objectif, le mois précédent, l'an dernier) : un chiffre seul ne dit pas s'il est bon.

Trois à six indicateurs bien choisis valent mieux que vingt.`,
    },
    {
      kind: "text",
      md: `### Quelques règles de mise en page

- **L'essentiel en haut à gauche** : on lit dans ce sens. Les chiffres clés d'abord, le détail ensuite.
- **Du général au particulier** : la tendance globale, puis la répartition, puis le détail.
- **Cohérence** : une même couleur pour une même chose sur tous les graphiques, les mêmes unités, des échelles comparables quand on compare.
- **Sobriété** : pas d'effet 3D, pas de jauges décoratives, pas de couleurs vives sans raison ; on retire ce qui n'aide pas à lire.
- **Dire la date** des données et leur source, discrètement mais toujours.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "fig = plt.figure(figsize=(10, 6))",
        "grille = fig.add_gridspec(2, 2, height_ratios=[1, 2])",
        "chiffre = fig.add_subplot(grille[0, 0])",
        "chiffre.axis('off')",
        "chiffre.text(0, 0.6, f'{int(emprunts.sum()):,}'.replace(',', ' '), fontsize=28, fontweight='bold')",
        "chiffre.text(0, 0.25, 'emprunts sur douze mois', fontsize=11)",
        "tendance = fig.add_subplot(grille[0, 1])",
        "tendance.plot(mois, emprunts, color='tab:blue')",
        "tendance.set_title('Emprunts par mois', loc='left')",
        "tendance.tick_params(axis='x', labelrotation=45)",
        "repartition = fig.add_subplot(grille[1, :])",
        "repartition.barh(par_site.index[::-1], par_site.values[::-1], color='tab:blue')",
        "repartition.set_title('Emprunts par site sur l\\'année', loc='left')",
        "fig.suptitle('Activité du réseau (données fictives, 2025)', x=0.02, ha='left', fontsize=14)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Un chiffre clé, une tendance, une répartition : trois questions, trois réponses, une seule couleur pour une seule grandeur.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Assemblez un tableau de bord `fig` de **quatre graphiques en grille 2 × 2** : emprunts par mois, inscriptions par mois, emprunts par site (barres), et un histogramme des emprunts mensuels. Donnez un **titre à chaque graphique** et un **titre général** à la figure qui contient le mot **« fictives »**.",
      setup: DONNEES,
      starter: lines("fig, ax = plt.subplots()", "ax.plot(mois, emprunts)", "plt.show()"),
      solution: lines(
        "fig, axes = plt.subplots(2, 2, figsize=(10, 6))",
        "axes[0, 0].plot(mois, emprunts)",
        "axes[0, 0].set_title('Emprunts par mois')",
        "axes[0, 1].plot(mois, inscriptions, color='tab:green')",
        "axes[0, 1].set_title('Inscriptions par mois')",
        "axes[1, 0].barh(par_site.index, par_site.values)",
        "axes[1, 0].set_title('Emprunts par site')",
        "axes[1, 1].hist(emprunts, bins=6)",
        "axes[1, 1].set_title('Répartition des emprunts mensuels')",
        "fig.suptitle('Activité du réseau (données fictives, 2025)')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      test: lines(
        "assert len(fig.axes) == 4, f\"on attend quatre graphiques (il y en a {len(fig.axes)})\"",
        "assert all(a.get_title() for a in fig.axes), \"chaque graphique doit avoir un titre\"",
        "assert 'fictives' in fig.get_suptitle(), \"le titre général doit signaler que les données sont fictives\"",
      ),
      hint: "plt.subplots(2, 2) renvoie un tableau axes ; axes[0, 0], axes[0, 1]... puis fig.suptitle(...).",
    },
    {
      kind: "text",
      md: `### Et les outils de tableau de bord ?

Pour un tableau de bord partagé et mis à jour, on utilise un outil dédié : en code, **Streamlit** ou **Dash** (Python), **Shiny** (R ou Python) ; sans code, **Power BI**, **Tableau**, **Metabase** ou **Looker Studio**, qui ont chacun une offre gratuite ou libre avec ses limites. La page Outils du site les présente. Les principes de ce module valent pour tous : un outil ne rend pas un tableau de bord utile, ce sont les choix d'indicateurs et de mise en page.`,
    },
    {
      kind: "note",
      tone: "tip",
      md: "Exercice libre pour aller plus loin : reprenez un tableau de bord que vous utilisez (au travail, dans une association) et listez les décisions qu'il permet de prendre. Chaque graphique qui n'éclaire aucune décision est candidat au retrait.",
    },
  ],
  quiz: [
    {
      question: "Par quoi commencer la conception d'un tableau de bord ?",
      options: [
        "Par le choix des couleurs",
        "Par les lecteurs et les décisions qu'il doit éclairer",
        "Par la liste de tous les graphiques possibles",
        "Par le choix de l'outil",
      ],
      correct: 1,
      explanation: "Les indicateurs découlent des décisions à prendre. Sans cette étape, on empile des graphiques que personne n'utilise.",
    },
    {
      question: "Où placer l'information la plus importante ?",
      options: ["En bas à droite", "En haut à gauche, là où commence la lecture", "Au centre, en petit", "Dans une info-bulle"],
      correct: 1,
      explanation: "On lit de haut en bas et de gauche à droite : l'essentiel se place là où le regard arrive en premier.",
    },
    {
      question: "Pourquoi afficher un indicateur avec une référence (objectif, mois précédent) ?",
      options: [
        "Pour remplir l'espace",
        "Parce qu'un chiffre seul ne dit pas s'il est bon ou mauvais",
        "Parce que c'est plus joli",
        "Ce n'est pas utile",
      ],
      correct: 1,
      explanation: "« 1 850 emprunts » ne veut rien dire seul ; « 1 850, contre 1 600 l'an dernier » éclaire une décision.",
    },
    {
      question: "Quel principe de cohérence est le plus important dans un tableau de bord ?",
      options: [
        "Utiliser une couleur différente sur chaque graphique",
        "Garder la même couleur pour la même grandeur, les mêmes unités, et des échelles comparables",
        "Mettre des effets 3D partout",
        "Changer d'unité d'un graphique à l'autre",
      ],
      correct: 1,
      explanation: "La cohérence évite au lecteur de réapprendre chaque graphique : une couleur, une grandeur ; une unité, partout la même.",
    },
  ],
};
