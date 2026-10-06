import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const moduleMatplotlib: LessonModule = {
  id: "matplotlib-advanced",
  title: "Matplotlib en profondeur",
  duration: "2 h 30",
  summary: "Figure, axes et l'interface orientée objet : de quoi construire exactement le graphique voulu.",
  objectives: [
    "Utiliser l'interface orientée objet (fig, ax) plutôt que les fonctions plt.*",
    "Composer plusieurs graphiques avec subplots",
    "Soigner titres, axes, légendes et annotations",
    "Savoir exporter une figure et choisir son format",
  ],
  sections: [
    {
      kind: "text",
      md: `### Figure et axes

Matplotlib distingue deux objets :

- la **figure** (\`fig\`) : la page entière, qui peut contenir plusieurs graphiques ;
- les **axes** (\`ax\`) : un graphique, avec son repère, ses courbes, son titre.

On peut tout faire avec les fonctions \`plt.plot\`, \`plt.title\`... qui agissent sur « les axes courants ». Dès qu'il y a plus d'un graphique, l'**interface orientée objet** est plus claire : on crée explicitement \`fig, ax = plt.subplots()\`, puis on appelle les méthodes de \`ax\` (\`ax.plot\`, \`ax.set_title\`, \`ax.set_xlabel\`...). C'est le style utilisé dans tout ce cours.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "x = np.linspace(0, 10, 200)",
        "fig, ax = plt.subplots(figsize=(7, 3.5))",
        "ax.plot(x, np.sin(x), label='sinus')",
        "ax.plot(x, np.cos(x), label='cosinus', linestyle='--')",
        "ax.set_title('Deux courbes, un repère')",
        "ax.set_xlabel('x')",
        "ax.set_ylabel('valeur')",
        "ax.legend()",
        "ax.grid(alpha=0.3)",
        "plt.show()",
      ),
      caption: "Chaque réglage est une méthode de l'objet ax : le code se lit comme une liste de décisions.",
    },
    {
      kind: "text",
      md: `### Plusieurs graphiques : subplots

\`fig, axes = plt.subplots(2, 3)\` crée une grille de 2 lignes et 3 colonnes ; \`axes\` est alors un tableau, et \`axes[0, 1]\` désigne le graphique de la première ligne, deuxième colonne. Deux options utiles :

- \`sharex=True\` ou \`sharey=True\` : les graphiques partagent la même échelle, ce qui rend les comparaisons honnêtes ;
- \`fig.suptitle('...')\` : un titre pour l'ensemble, et \`plt.tight_layout()\` pour éviter que les titres se chevauchent.

Plusieurs petits graphiques de même échelle (les *small multiples*) valent souvent mieux qu'un seul graphique avec dix courbes enchevêtrées.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Créez une figure `fig` avec **deux graphiques côte à côte** (une ligne, deux colonnes) : à gauche l'histogramme de `notes_a`, à droite celui de `notes_b`, avec les titres **« Classe A »** et **« Classe B »**, et la **même échelle verticale** pour les deux.",
      starter: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "rng = np.random.default_rng(1)",
        "notes_a = rng.normal(12, 2, 30).clip(0, 20)  # notes fictives",
        "notes_b = rng.normal(11, 4, 30).clip(0, 20)",
        "",
        "fig, ax = plt.subplots()",
        "ax.hist(notes_a)",
        "plt.show()",
      ),
      solution: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "rng = np.random.default_rng(1)",
        "notes_a = rng.normal(12, 2, 30).clip(0, 20)  # notes fictives",
        "notes_b = rng.normal(11, 4, 30).clip(0, 20)",
        "",
        "fig, (gauche, droite) = plt.subplots(1, 2, sharey=True, figsize=(8, 3))",
        "gauche.hist(notes_a, bins=10, range=(0, 20))",
        "gauche.set_title('Classe A')",
        "droite.hist(notes_b, bins=10, range=(0, 20))",
        "droite.set_title('Classe B')",
        "plt.show()",
      ),
      test: lines(
        "assert len(fig.axes) == 2, f\"on attend deux graphiques dans la figure (il y en a {len(fig.axes)})\"",
        "titres = [a.get_title() for a in fig.axes]",
        "assert titres == ['Classe A', 'Classe B'], f\"titres attendus : Classe A puis Classe B (vous avez {titres})\"",
        "assert fig.axes[0].get_ylim() == fig.axes[1].get_ylim(), \"les deux graphiques doivent partager la même échelle verticale (sharey=True)\"",
        "assert fig.axes[0].get_position().x0 < fig.axes[1].get_position().x0, \"les graphiques doivent être côte à côte\"",
      ),
      hint: "plt.subplots(1, 2, sharey=True) renvoie la figure et deux axes ; appelez hist et set_title sur chacun.",
    },
    {
      kind: "text",
      md: `### Annoter pour guider la lecture

Un graphique de présentation gagne beaucoup à **dire** ce qu'il faut voir : une flèche vers le pic, une ligne de référence, une étiquette directe au bout d'une courbe plutôt qu'une légende lointaine.

- \`ax.annotate('texte', xy=(x, y), xytext=(x2, y2), arrowprops={'arrowstyle': '->'})\` : une étiquette reliée à un point par une flèche ;
- \`ax.axhline(valeur)\` et \`ax.axvline(valeur)\` : une ligne horizontale ou verticale de référence (une moyenne, un seuil) ;
- \`ax.text(x, y, 'texte')\` : un texte libre.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Sur la courbe de fréquentation (fictive), ajoutez une **annotation avec une flèche** qui pointe le **maximum**, avec le texte **« pic »**, et une **ligne horizontale** à la valeur **moyenne**.",
      starter: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "jours = np.arange(1, 15)",
        "visites = np.array([30, 32, 35, 33, 40, 52, 61, 45, 38, 36, 34, 37, 35, 31])  # fictif",
        "",
        "fig, ax = plt.subplots()",
        "ax.plot(jours, visites, marker='o')",
        "plt.show()",
      ),
      solution: lines(
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "jours = np.arange(1, 15)",
        "visites = np.array([30, 32, 35, 33, 40, 52, 61, 45, 38, 36, 34, 37, 35, 31])  # fictif",
        "",
        "fig, ax = plt.subplots()",
        "ax.plot(jours, visites, marker='o')",
        "i = visites.argmax()",
        "ax.annotate('pic', xy=(jours[i], visites[i]), xytext=(jours[i] + 2, visites[i] + 3), arrowprops={'arrowstyle': '->'})",
        "ax.axhline(visites.mean(), color='gray', linestyle=':')",
        "plt.show()",
      ),
      test: lines(
        "from matplotlib.text import Annotation",
        "annotations = [t for t in ax.texts if isinstance(t, Annotation)]",
        "assert annotations, \"ajoutez une annotation avec ax.annotate(...)\"",
        "pic = annotations[0]",
        "assert pic.get_text() == 'pic', f\"le texte de l'annotation doit être « pic » (vous avez « {pic.get_text()} »)\"",
        "assert tuple(pic.xy) == (7, 61), f\"la flèche doit pointer le maximum, au jour 7 (61 visites) ; elle pointe {tuple(pic.xy)}\"",
        "assert pic.arrow_patch is not None, \"ajoutez une flèche avec arrowprops\"",
        "horizontales = [l for l in ax.lines if len(set(l.get_ydata())) == 1]",
        "assert horizontales and abs(horizontales[0].get_ydata()[0] - visites.mean()) < 1e-9, \"ajoutez une ligne horizontale à la moyenne : ax.axhline(visites.mean())\"",
      ),
      hint: "visites.argmax() donne l'indice du maximum ; ax.annotate('pic', xy=(jours[i], visites[i]), ..., arrowprops={'arrowstyle': '->'}).",
    },
    {
      kind: "text",
      md: `### Exporter

\`fig.savefig('graphique.png', dpi=200, bbox_inches='tight')\` enregistre la figure. Le format compte :

- **PNG** : une image en pixels, pour le web ou une présentation ; \`dpi\` règle la finesse ;
- **SVG** ou **PDF** : des formats vectoriels, nets à toutes les tailles, idéaux pour un rapport imprimé ou une retouche ;
- \`bbox_inches='tight'\` retire les marges inutiles.

Dans ce site, les figures sont rendues en PNG et affichées sous le code ; \`plt.show()\` ne fait rien d'autre que marquer la fin du graphique.`,
    },
  ],
  quiz: [
    {
      question: "Dans fig, ax = plt.subplots(), que représente ax ?",
      options: ["La page entière", "Un graphique (un repère avec son contenu)", "Les données", "Le fichier exporté"],
      correct: 1,
      explanation: "fig est la figure (la page), ax un système d'axes, c'est-à-dire un graphique. Une figure peut contenir plusieurs axes.",
    },
    {
      question: "Pourquoi utiliser sharey=True pour comparer deux histogrammes côte à côte ?",
      options: [
        "Pour aller plus vite",
        "Pour que les deux graphiques aient la même échelle verticale, et que la comparaison soit honnête",
        "Pour fusionner les deux histogrammes",
        "Pour ajouter une légende",
      ],
      correct: 1,
      explanation: "Avec des échelles différentes, deux barres de même hauteur peuvent représenter des valeurs très différentes. Partager l'axe évite ce piège.",
    },
    {
      question: "Quel format choisir pour une figure destinée à un rapport imprimé ?",
      options: ["Un JPEG très compressé", "Un format vectoriel comme SVG ou PDF", "Une capture d'écran", "Peu importe"],
      correct: 1,
      explanation: "Un format vectoriel reste net à toutes les tailles. Le PNG convient au web, avec un dpi suffisant.",
    },
    {
      question: "À quoi sert ax.axhline(valeur) ?",
      options: [
        "À tracer une ligne horizontale de référence, par exemple une moyenne ou un seuil",
        "À changer l'échelle de l'axe horizontal",
        "À ajouter une légende",
        "À supprimer l'axe horizontal",
      ],
      correct: 0,
      explanation: "Une ligne de référence aide le lecteur à situer les valeurs : au-dessus ou en dessous de la moyenne, d'un objectif, d'un seuil.",
    },
  ],
};
