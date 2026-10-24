import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Le jeu iris de scikit-learn, avec les noms de colonnes de R (Sepal.Length...) et l'espèce en catégorie. */
const IRIS = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "from sklearn.datasets import load_iris",
  "_brut = load_iris(as_frame=True)",
  "iris = _brut.data.copy()",
  "iris.columns = ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']",
  "iris['Species'] = pd.Categorical.from_codes(_brut.target, _brut.target_names)",
);

export const moduleRGgplot: LessonModule = {
  id: "graphiques-ggplot2",
  title: "Graphiques : ggplot2 et Matplotlib",
  duration: "2 h",
  summary: "La grammaire des graphiques de ggplot2 (données, esthétiques, géométries, facettes), lue en R puis reproduite pas à pas avec Matplotlib : nuage coloré par espèce, histogrammes en facettes, droite de régression.",
  objectives: [
    "Décomposer un graphique ggplot2 en données, esthétiques, géométries, facettes et étiquettes",
    "Reproduire un nuage coloré, des histogrammes en facettes et une droite de régression avec Matplotlib",
    "Expliquer ce que ggplot2 fait automatiquement (légende, échelles, découpage) et que Matplotlib demande d'écrire",
    "Vérifier une figure par inspection de ses objets (collections, lignes, titres, légende)",
  ],
  sections: [
    {
      kind: "text",
      md: `### ggplot2 : un graphique se construit par couches

**ggplot2** est le paquet de graphiques du tidyverse. Il applique la *grammaire des graphiques* de Leland Wilkinson : un graphique est une phrase qui assemble des éléments indépendants.

- les **données** (\`ggplot(iris, ...)\`) ;
- les **esthétiques** (\`aes()\`) : quelle colonne va sur l'axe x, l'axe y, dans la couleur, la taille ;
- les **géométries** (\`geom_point()\`, \`geom_histogram()\`, \`geom_smooth()\`) : la forme dessinée ;
- les **facettes** (\`facet_wrap()\`) : un petit graphique par valeur d'une colonne ;
- les **étiquettes et thèmes** (\`labs()\`, \`theme_minimal()\`).

On les additionne avec le signe \`+\`. Le code R ci-dessous est à lire : il ne s'exécute pas dans le moteur du site. Les figures du module sont tracées avec **Matplotlib**, qui travaille autrement : on crée une figure et des axes, puis on dessine **impérativement**, instruction après instruction.

\`\`\`r
# Code R à lire (paquet ggplot2)
library(ggplot2)

ggplot(iris, aes(x = Petal.Length, y = Petal.Width, color = Species)) +
  geom_point() +
  labs(title = "Pétales par espèce", x = "Longueur (cm)", y = "Largeur (cm)")
\`\`\`

Ce que ggplot2 fait **sans qu'on le demande** : il choisit une couleur par espèce, construit la légende, ajuste les bornes des axes. Avec Matplotlib, on dessine une série à la fois et on réclame la légende.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "fig, ax = plt.subplots(figsize=(6, 4))",
        "# color = Species : on trace un nuage par espèce, Matplotlib attribue une couleur à chaque appel",
        "for espece, groupe in iris.groupby('Species', observed=True):",
        "    ax.scatter(groupe['Petal.Length'], groupe['Petal.Width'], label=espece, s=18)",
        "ax.set_title('Pétales par espèce')                    # labs(title = ...)",
        "ax.set_xlabel('Longueur (cm)')                        # labs(x = ...)",
        "ax.set_ylabel('Largeur (cm)')                         # labs(y = ...)",
        "ax.legend(title='Species')                            # la légende que ggplot2 ajoute seul",
        "plt.tight_layout()",
        "",
        "print('nuages :', len(ax.collections), ' points au total :', sum(len(c.get_offsets()) for c in ax.collections))",
      ),
      caption: "Trois nuages de 50 points chacun, soit 150 points, une couleur par espèce. Les setosa se détachent nettement : pétales courts et étroits. Versicolor et virginica se touchent par endroits. Remarquez qu'on a groupé les points à la main ; la même figure s'obtient avec une couleur par point, mais la légende serait alors à construire soi-même.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Reproduisez `ggplot(iris, aes(x = Sepal.Length, y = Sepal.Width, color = Species)) + geom_point() + labs(title = \"Sépales\")`. Créez `fig` et son graphique : **un nuage par espèce** (largeur du sépale en fonction de la longueur), une **légende** nommant les espèces, le titre **« Sépales »** et les étiquettes d'axes **« Sepal.Length »** et **« Sepal.Width »**.",
      setup: IRIS,
      starter: lines(
        "fig, ax = plt.subplots()",
        "ax.scatter(iris['Sepal.Length'], iris['Sepal.Width'])",
      ),
      solution: lines(
        "fig, ax = plt.subplots()",
        "for espece, groupe in iris.groupby('Species', observed=True):",
        "    ax.scatter(groupe['Sepal.Length'], groupe['Sepal.Width'], label=espece)",
        "ax.set_title('Sépales')",
        "ax.set_xlabel('Sepal.Length')",
        "ax.set_ylabel('Sepal.Width')",
        "ax.legend()",
        "print(len(ax.collections), 'nuages')",
      ),
      test: lines(
        "_ax = fig.axes[0]",
        "assert len(_ax.collections) == 3, f\"il faut un nuage par espèce, donc 3 appels à scatter (il y en a {len(_ax.collections)})\"",
        "assert sum(len(c.get_offsets()) for c in _ax.collections) == 150, \"les trois nuages doivent contenir les 150 fleurs au total\"",
        "assert _ax.get_legend() is not None, \"ajoutez la légende : ax.legend(), après avoir donné label= à chaque scatter\"",
        "assert {t.get_text() for t in _ax.get_legend().get_texts()} == {'setosa', 'versicolor', 'virginica'}, \"la légende doit nommer les trois espèces (label=espece)\"",
        "assert _ax.get_title() == 'Sépales', f\"le titre doit être « Sépales », pas « {_ax.get_title()} »\"",
        "assert _ax.get_xlabel() == 'Sepal.Length' and _ax.get_ylabel() == 'Sepal.Width', \"étiquettes attendues : Sepal.Length en x, Sepal.Width en y\"",
      ),
      hint: "Une boucle sur iris.groupby('Species', observed=True) ; label=espece dans scatter ; puis ax.legend(), set_title, set_xlabel, set_ylabel.",
    },
    {
      kind: "text",
      md: `### Les facettes : un petit graphique par groupe

Pour comparer des groupes sans que les points se recouvrent, ggplot2 découpe le graphique en **facettes**. Une seule ligne de plus :

\`\`\`r
# Code R à lire
ggplot(iris, aes(x = Petal.Length)) +
  geom_histogram(bins = 10) +
  facet_wrap(~ Species)
\`\`\`

La formule \`~ Species\` se lit « selon l'espèce ». Par défaut, ggplot2 donne **la même échelle** à toutes les facettes, ce qui rend la comparaison honnête. En Matplotlib, on crée la grille avec \`plt.subplots(1, 3, sharex=True)\` : le paramètre \`sharex\` impose la même échelle horizontale, \`sharey\` la même échelle verticale. Un point de vigilance : dans un histogramme, le **nombre de classes** (\`bins\`) et leurs **bornes** changent l'allure, il faut les fixer pour que les facettes soient comparables.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "# facet_wrap(~ Species) : une colonne de la grille par espèce, mêmes bornes et mêmes classes",
        "bornes = np.linspace(1, 7, 13)             # 12 classes de 0,5 cm entre 1 et 7 cm",
        "fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharex=True, sharey=True)",
        "for ax, (espece, groupe) in zip(axes, iris.groupby('Species', observed=True)):",
        "    ax.hist(groupe['Petal.Length'], bins=bornes)",
        "    ax.set_title(espece)",
        "    ax.set_xlabel('Petal.Length (cm)')",
        "axes[0].set_ylabel('effectif')",
        "plt.tight_layout()",
        "",
        "for ax, (espece, groupe) in zip(axes, iris.groupby('Species', observed=True)):",
        "    print(espece, ': effectif', len(groupe), ' longueur moyenne', round(groupe['Petal.Length'].mean(), 2))",
      ),
      caption: "Les trois histogrammes partagent leurs axes. Les longueurs de pétale moyennes sont de 1,46 cm (setosa), 4,26 cm (versicolor) et 5,55 cm (virginica) : trois groupes presque séparés, ce que la facette rend visible d'un coup d'œil.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Reproduisez `ggplot(iris, aes(x = Sepal.Length)) + geom_histogram(bins = 10) + facet_wrap(~ Species)`. Créez `fig` avec **trois graphiques côte à côte** (un par espèce, dans l'ordre alphabétique), chacun titré du **nom de l'espèce**, composé de **10 classes** et partageant la **même échelle horizontale**.",
      setup: IRIS,
      starter: lines(
        "fig, ax = plt.subplots()",
        "ax.hist(iris['Sepal.Length'], bins=10)",
      ),
      solution: lines(
        "bornes = np.linspace(iris['Sepal.Length'].min(), iris['Sepal.Length'].max(), 11)   # 10 classes communes",
        "fig, axes = plt.subplots(1, 3, sharex=True, figsize=(9, 3))",
        "for ax, (espece, groupe) in zip(axes, iris.groupby('Species', observed=True)):",
        "    ax.hist(groupe['Sepal.Length'], bins=bornes)",
        "    ax.set_title(espece)",
        "print(len(fig.axes), 'graphiques')",
      ),
      test: lines(
        "assert len(fig.axes) == 3, f\"il faut trois graphiques, un par espèce (il y en a {len(fig.axes)}) : plt.subplots(1, 3, ...)\"",
        "assert [a.get_title() for a in fig.axes] == ['setosa', 'versicolor', 'virginica'], f\"titres attendus : setosa, versicolor, virginica (vous avez {[a.get_title() for a in fig.axes]})\"",
        "assert all(len(a.patches) == 10 for a in fig.axes), f\"chaque histogramme doit avoir 10 classes (bins=10), pas {[len(a.patches) for a in fig.axes]}\"",
        "assert [round(sum(p.get_height() for p in a.patches)) for a in fig.axes] == [50, 50, 50], \"chaque graphique ne doit contenir que les 50 fleurs de son espèce\"",
        "assert fig.axes[0].get_xlim() == fig.axes[2].get_xlim(), \"les graphiques doivent partager la même échelle horizontale : sharex=True\"",
      ),
      hint: "plt.subplots(1, 3, sharex=True) ; zip(axes, iris.groupby('Species', observed=True)) pour parcourir graphique et groupe ensemble ; ax.hist(..., bins=10) ou des bornes communes.",
    },
    {
      kind: "text",
      md: `### La droite de régression : geom_smooth

\`geom_smooth(method = "lm")\` superpose au nuage la droite des **moindres carrés** : celle que renvoie la fonction \`lm()\`, que l'on étudie au module suivant. Par défaut, ggplot2 ajoute aussi une **bande de confiance** autour de la droite (argument \`se = TRUE\`).

\`\`\`r
# Code R à lire
ggplot(iris, aes(x = Petal.Length, y = Petal.Width)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE)     # se = FALSE : sans bande de confiance
\`\`\`

Matplotlib ne sait pas ajuster un modèle : on **calcule** les coefficients, ici avec \`np.polyfit(x, y, 1)\` (régression linéaire simple, mêmes moindres carrés), puis on trace la droite par deux points. Une limite à connaître : la droite n'a de sens que dans l'étendue des données, et ne dit pas que l'allongement du pétale *cause* son élargissement, seulement que les deux varient ensemble. Le graphique ci-dessous n'a pas de bande de confiance : c'est une différence assumée avec \`se = TRUE\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        IRIS,
        "",
        "x = iris['Petal.Length']",
        "y = iris['Petal.Width']",
        "pente, ordonnee = np.polyfit(x, y, 1)               # moindres carrés : y ≈ ordonnee + pente * x",
        "r2 = np.corrcoef(x, y)[0, 1] ** 2",
        "print('pente :', round(pente, 4), ' ordonnée à l origine :', round(ordonnee, 4), ' R² :', round(r2, 4))",
        "",
        "fig, ax = plt.subplots(figsize=(6, 4))",
        "ax.scatter(x, y, s=14, alpha=0.6, label='fleurs')    # geom_point(alpha = 0.6)",
        "bout = np.array([x.min(), x.max()])",
        "ax.plot(bout, ordonnee + pente * bout, color='black', label='droite des moindres carrés')   # geom_smooth(method = \"lm\", se = FALSE)",
        "ax.set_xlabel('Petal.Length (cm)')",
        "ax.set_ylabel('Petal.Width (cm)')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "Sur les 150 fleurs, la droite vaut y = -0,3631 + 0,4158 x : chaque centimètre de longueur de pétale s'accompagne en moyenne de 0,42 cm de largeur en plus, avec un R² de 0,927. Mais la pente n'est pas la même dans chaque espèce (0,201 chez setosa, 0,331 chez versicolor, 0,160 chez virginica) : la droite globale mélange les trois groupes, un exemple de plus qui invite à colorer par espèce.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Tracez, dans `fig`, le nuage de `Sepal.Length` (x) et `Sepal.Width` (y) des 150 fleurs, avec **par-dessus la droite des moindres carrés** (une seule ligne, tracée avec `ax.plot`) et le titre **« Régression »**. Rangez aussi dans `pente` la pente de cette droite.",
      setup: IRIS,
      starter: lines(
        "fig, ax = plt.subplots()",
        "ax.scatter(iris['Sepal.Length'], iris['Sepal.Width'])",
        "pente = 0.0",
      ),
      solution: lines(
        "fig, ax = plt.subplots()",
        "x = iris['Sepal.Length']",
        "y = iris['Sepal.Width']",
        "ax.scatter(x, y)",
        "pente, ordonnee = np.polyfit(x, y, 1)",
        "bout = np.array([x.min(), x.max()])",
        "ax.plot(bout, ordonnee + pente * bout, color='black')",
        "ax.set_title('Régression')",
        "print(round(pente, 4))",
      ),
      test: lines(
        "_ax = fig.axes[0]",
        "assert len(_ax.collections) >= 1 and len(_ax.collections[0].get_offsets()) == 150, \"tracez d'abord le nuage des 150 fleurs avec ax.scatter\"",
        "assert len(_ax.lines) == 1, f\"il faut une seule ligne, la droite de régression, tracée avec ax.plot (il y en a {len(_ax.lines)})\"",
        "_p, _o = np.polyfit(iris['Sepal.Length'], iris['Sepal.Width'], 1)",
        "assert abs(pente - _p) < 1e-9, f\"pente doit être celle des moindres carrés ({_p:.4f}) : np.polyfit(x, y, 1)[0]\"",
        "_xs, _ys = _ax.lines[0].get_xdata(), _ax.lines[0].get_ydata()",
        "assert abs(np.polyfit(_xs, _ys, 1)[0] - _p) < 1e-6, \"la droite tracée doit avoir la pente des moindres carrés\"",
        "assert _ax.get_title() == 'Régression', f\"le titre doit être « Régression », pas « {_ax.get_title()} »\"",
      ),
      hint: "np.polyfit(x, y, 1) renvoie (pente, ordonnée à l'origine) ; la droite se trace par ses deux extrémités : ax.plot([x_min, x_max], [...]).",
    },
    {
      kind: "note",
      tone: "info",
      md: "Ni l'un ni l'autre n'est « le bon » outil. ggplot2 est très concis pour les graphiques statistiques courants, parce que la grammaire fait le travail de mise en forme ; Matplotlib est plus verbeux mais contrôle chaque élément de la figure, et sert de base à beaucoup de bibliothèques Python (dont Seaborn). Pour enregistrer une figure, `ggsave(\"figure.png\")` en R correspond à `fig.savefig(\"figure.png\")` en Python ; le site ne fournit pas de dossier persistant, donc ce geste est à essayer sur votre machine.",
    },
  ],
  quiz: [
    {
      question: "Dans ggplot(iris, aes(x = Petal.Length, y = Petal.Width, color = Species)) + geom_point(), que fait aes() ?",
      options: [
        "Il choisit le type de graphique",
        "Il relie des colonnes du tableau à des propriétés visuelles : axe x, axe y, couleur",
        "Il enregistre le graphique",
        "Il filtre les lignes du tableau",
      ],
      correct: 1,
      explanation: "aes() (esthétiques) décrit la correspondance entre colonnes et propriétés visuelles ; la géométrie (geom_point) décide de la forme dessinée.",
    },
    {
      question: "Quel est l'équivalent du color = Species de ggplot2 dans la boucle Matplotlib du module ?",
      options: [
        "ax.set_title(espece)",
        "plt.show()",
        "Un appel à scatter par espèce avec label=espece, puis ax.legend()",
        "np.polyfit(x, y, 1)",
      ],
      correct: 2,
      explanation: "ggplot2 colore et fabrique la légende seul. Avec Matplotlib, on trace chaque groupe séparément, on lui donne un label, et on demande la légende.",
    },
    {
      question: "Pourquoi fixer les mêmes bornes de classes dans tous les histogrammes en facettes ?",
      options: [
        "Parce que Matplotlib l'exige",
        "Pour que le graphique soit plus joli",
        "Parce qu'on ne peut pas faire autrement",
        "Pour que les facettes soient comparables : des classes différentes changent l'allure sans que les données changent",
      ],
      correct: 3,
      explanation: "Le nombre et les bornes des classes modifient la forme d'un histogramme. Pour comparer des groupes, il faut le même découpage et les mêmes échelles (sharex, sharey).",
    },
    {
      question: "geom_smooth(method = \"lm\") trace la droite des moindres carrés. Que faut-il faire en Matplotlib pour obtenir la même droite ?",
      options: [
        "Appeler ax.smooth()",
        "Calculer pente et ordonnée (par exemple avec np.polyfit(x, y, 1)) puis tracer la droite avec ax.plot",
        "Rien, scatter la trace automatiquement",
        "Utiliser plt.show()",
      ],
      correct: 1,
      explanation: "Matplotlib dessine mais n'ajuste pas de modèle. On calcule la régression soi-même, puis on trace la droite par deux points. La bande de confiance de ggplot2 est à calculer à part.",
    },
    {
      question: "Sur les 150 fleurs, la pente globale (0,416) diffère de celle de chaque espèce (0,201, 0,331, 0,160). Que faut-il en retenir ?",
      options: [
        "Que le calcul est faux",
        "Que Matplotlib se trompe",
        "Que la droite globale mélange des groupes différents : colorer ou séparer par espèce évite une conclusion trompeuse",
        "Que la pente ne sert à rien",
      ],
      correct: 2,
      explanation: "Quand des sous-groupes ont des comportements différents, un ajustement global peut ne décrire aucun d'eux fidèlement. Les facettes et la couleur servent à le voir.",
    },
  ],
};
