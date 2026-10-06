import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const modulePrinciples: LessonModule = {
  id: "dataviz-principles",
  title: "Principes de visualisation",
  duration: "1 h 30",
  summary: "Choisir le bon graphique pour la bonne question, et ne pas tromper son lecteur, même sans le vouloir.",
  objectives: [
    "Partir de la question posée pour choisir un type de graphique",
    "Connaître l'ordre de précision de lecture des encodages visuels",
    "Repérer et corriger un axe tronqué ou un camembert illisible",
    "Choisir des couleurs lisibles par tous",
  ],
  sections: [
    {
      kind: "text",
      md: `### D'abord la question, ensuite le graphique

Un graphique répond à une question. Avant de choisir un type de graphique, on la formule :

- **comparer** des catégories : diagramme en barres (horizontales si les libellés sont longs) ;
- voir une **évolution** dans le temps : courbe ;
- montrer une **distribution** : histogramme, boîte à moustaches ;
- étudier une **relation** entre deux variables : nuage de points ;
- montrer une **composition** (des parts d'un tout) : barres empilées, et parfois un camembert s'il y a très peu de parts.

Un graphique qui essaie de répondre à tout ne répond à rien : mieux vaut deux graphiques simples qu'un seul surchargé.`,
    },
    {
      kind: "text",
      md: `### Ce que l'œil lit bien, et moins bien

Cleveland et McGill (1984) ont mesuré la précision avec laquelle on compare des valeurs selon leur encodage. Du plus précis au moins précis, à peu près : la **position** sur une échelle commune, la **longueur**, l'**angle**, l'**aire**, puis la **couleur**.

Conséquence pratique : des barres alignées sur un même axe se comparent bien mieux que des parts de camembert (des angles) ou des bulles (des aires). On réserve la couleur aux catégories, ou à une information secondaire.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "# Parts fictives de cinq catégories, proches les unes des autres",
        "categories = ['A', 'B', 'C', 'D', 'E']",
        "parts = [23, 21, 20, 19, 17]",
        "",
        "fig, (gauche, droite) = plt.subplots(1, 2, figsize=(9, 3.5))",
        "gauche.pie(parts, labels=categories)",
        "gauche.set_title('Camembert : qui est le plus grand ?')",
        "droite.barh(categories[::-1], parts[::-1])",
        "droite.set_title('Barres : la réponse se lit tout de suite')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Mêmes données, deux encodages : sur le camembert, les parts voisines sont presque impossibles à départager ; sur les barres, l'ordre saute aux yeux.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Remplacez le camembert par un **diagramme en barres horizontales** (`ax.barh`), avec les catégories **triées de la plus grande à la plus petite en partant du haut**. Gardez les noms `fig` et `ax`.",
      starter: lines(
        "import matplotlib.pyplot as plt",
        "",
        "categories = ['Transport', 'Logement', 'Loisirs', 'Alimentation']",
        "montants = [180, 650, 120, 420]",
        "",
        "fig, ax = plt.subplots()",
        "ax.pie(montants, labels=categories)",
        "plt.show()",
      ),
      solution: lines(
        "import matplotlib.pyplot as plt",
        "",
        "categories = ['Transport', 'Logement', 'Loisirs', 'Alimentation']",
        "montants = [180, 650, 120, 420]",
        "",
        "paires = sorted(zip(montants, categories))  # du plus petit au plus grand",
        "fig, ax = plt.subplots()",
        "ax.barh([c for _, c in paires], [m for m, _ in paires])",
        "plt.show()",
      ),
      test: lines(
        "from matplotlib.patches import Rectangle",
        "assert ax.patches and all(isinstance(p, Rectangle) for p in ax.patches), \"remplacez le camembert par des barres : ax.barh(...)\"",
        "assert len(ax.patches) == 4, f\"on attend 4 barres (il y en a {len(ax.patches)})\"",
        "assert all(p.get_height() <= 1 for p in ax.patches), \"les barres doivent être horizontales : ax.barh et non ax.bar\"",
        "largeurs = [p.get_width() for p in ax.patches]",
        "assert largeurs == sorted(largeurs), \"barh dessine de bas en haut : pour voir la plus grande en haut, passez les valeurs de la plus petite à la plus grande\"",
      ),
      hint: "ax.barh place la première barre en bas. Triez les couples (montant, catégorie) par ordre croissant, puis passez catégories et montants dans cet ordre.",
    },
    {
      kind: "text",
      md: `### L'axe tronqué

Un diagramme en barres encode les valeurs par la **longueur** des barres. Si l'axe commence à 50 au lieu de 0, une barre de 58 paraît trois fois plus longue qu'une barre de 52 alors que l'écart réel est d'environ 12 %. Pour des barres, l'axe des valeurs commence à **zéro**.

Pour une courbe, c'est différent : on lit des **positions** et des variations, et un axe qui ne part pas de zéro peut être tout à fait honnête (une température corporelle de 36 à 40 °C se lit mieux sans zéro). L'important est d'indiquer clairement l'échelle.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ce graphique en barres exagère les écarts. Corrigez-le pour que l'axe vertical **commence à 0** (sans changer les données).",
      starter: lines(
        "import matplotlib.pyplot as plt",
        "",
        "annees = ['2023', '2024', '2025']",
        "inscrits = [52, 55, 58]  # chiffres fictifs",
        "",
        "fig, ax = plt.subplots()",
        "ax.bar(annees, inscrits)",
        "ax.set_ylim(50, 60)",
        "ax.set_title('Inscriptions à la bibliothèque')",
        "plt.show()",
      ),
      solution: lines(
        "import matplotlib.pyplot as plt",
        "",
        "annees = ['2023', '2024', '2025']",
        "inscrits = [52, 55, 58]  # chiffres fictifs",
        "",
        "fig, ax = plt.subplots()",
        "ax.bar(annees, inscrits)",
        "ax.set_ylim(bottom=0)",
        "ax.set_title('Inscriptions à la bibliothèque')",
        "plt.show()",
      ),
      test: lines(
        "bas, haut = ax.get_ylim()",
        "assert bas == 0, f\"l'axe vertical doit commencer à 0 (il commence à {bas})\"",
        "assert haut >= 58, \"toutes les barres doivent rester visibles\"",
        "assert [p.get_height() for p in ax.patches] == [52, 55, 58], \"ne changez pas les données\"",
      ),
      hint: "Supprimez ax.set_ylim(50, 60), ou remplacez-le par ax.set_ylim(bottom=0).",
    },
    {
      kind: "text",
      md: `### Des couleurs lisibles par tous

- Pour des **catégories**, une palette qualitative aux teintes bien distinctes ; au-delà de six ou sept catégories, on regroupe ou on utilise des étiquettes directes.
- Pour une **grandeur continue**, une palette séquentielle (du clair au foncé), comme \`viridis\`, conçue pour rester lisible en niveaux de gris et par la plupart des personnes qui distinguent mal certaines couleurs.
- Ne jamais compter **uniquement** sur l'opposition rouge et vert : une partie de la population, surtout masculine, les confond. Doubler la couleur d'une autre indication (forme, étiquette, position) règle le problème.`,
    },
  ],
  quiz: [
    {
      question: "Pour comparer précisément les ventes de huit produits, quel graphique choisir ?",
      options: ["Un camembert", "Un diagramme en barres trié", "Un nuage de points", "Un graphique en 3D"],
      correct: 1,
      explanation: "Des barres alignées sur un axe commun encodent les valeurs par la position et la longueur, ce que l'œil compare le plus précisément. Le tri facilite encore la lecture.",
    },
    {
      question: "Pourquoi un diagramme en barres doit-il partir de zéro ?",
      options: [
        "Parce que Matplotlib l'exige",
        "Parce que la longueur des barres encode la valeur : tronquer l'axe exagère les écarts",
        "Pour que le graphique soit plus grand",
        "Ce n'est jamais nécessaire",
      ],
      correct: 1,
      explanation: "Avec un axe qui part de 50, une barre de 58 paraît trois fois plus longue qu'une barre de 52 alors que l'écart est d'environ 12 %.",
    },
    {
      question: "Selon Cleveland et McGill, quel encodage se compare le moins précisément ?",
      options: ["La position sur un axe commun", "La longueur", "L'angle", "La couleur"],
      correct: 3,
      explanation: "Dans leur classement, la position et la longueur viennent en tête, la couleur en dernier : on la réserve aux catégories ou à une information secondaire.",
    },
    {
      question: "Comment rendre un graphique lisible par une personne qui confond le rouge et le vert ?",
      options: [
        "Utiliser des rouges et des verts plus vifs",
        "Doubler la couleur d'une autre indication (étiquette, forme, position) et choisir une palette adaptée",
        "Passer en noir et blanc sans légende",
        "Ajouter une troisième couleur",
      ],
      correct: 1,
      explanation: "Une palette pensée pour la lisibilité (comme viridis) et une information redondante (étiquette, forme) rendent le graphique lisible pour tout le monde.",
    },
  ],
};
