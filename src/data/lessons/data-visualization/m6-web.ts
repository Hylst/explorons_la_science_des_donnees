import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const moduleWeb: LessonModule = {
  id: "d3js-web",
  title: "La visualisation sur le web (SVG et D3.js)",
  duration: "2 h",
  summary: "Ce qu'il y a sous un graphique web : du SVG, des échelles qui traduisent des valeurs en pixels, et la jointure de données de D3.js.",
  objectives: [
    "Reconnaître la structure d'un graphique SVG",
    "Programmer une échelle linéaire, comme d3.scaleLinear",
    "Comprendre la jointure de données de D3.js à la lecture",
    "Choisir entre une image (PNG), du SVG et une bibliothèque web",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un graphique web est souvent du SVG

**SVG** (*Scalable Vector Graphics*) est un format texte qui décrit des formes : \`<rect>\` pour un rectangle, \`<circle>\` pour un cercle, \`<line>\`, \`<path>\` pour une forme quelconque, \`<text>\` pour du texte. Le navigateur les dessine, nettes à toutes les tailles, et chaque forme peut réagir à la souris. Les bibliothèques web (D3.js, Plotly, Vega-Lite) produisent du SVG, ou dessinent sur un \`<canvas>\` quand il y a des dizaines de milliers de points.

Matplotlib sait lui aussi écrire du SVG : regardons ce qu'il produit.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import io",
        "import matplotlib.pyplot as plt",
        "",
        "fig, ax = plt.subplots(figsize=(3, 2))",
        "ax.bar(['A', 'B'], [3, 5])",
        "tampon = io.StringIO()",
        "fig.savefig(tampon, format='svg')",
        "svg = tampon.getvalue()",
        "print(len(svg), 'caractères de SVG')",
        "debut = svg.find('<svg')",
        "print(svg[debut:debut + 300])",
        "print('Nombre de formes <path> :', svg.count('<path'))",
      ),
      caption: "Un graphique de deux barres devient quelques milliers de caractères de texte : des balises que le navigateur sait dessiner.",
    },
    {
      kind: "text",
      md: `### Les échelles : des valeurs aux pixels

Pour dessiner une barre de valeur 5 dans un graphique de 300 pixels de haut, il faut **traduire** la valeur en pixels. C'est le rôle d'une **échelle**. L'échelle linéaire associe un **domaine** (les valeurs, par exemple de 0 à 10) à une **plage** (les pixels, par exemple de 0 à 300) par une simple règle de trois :

\`\`\`
pixel = plage_min + (valeur - domaine_min) / (domaine_max - domaine_min) × (plage_max - plage_min)
\`\`\`

C'est exactement ce que fait \`d3.scaleLinear().domain([0, 10]).range([0, 300])\` en D3.js. Astuce fréquente : comme l'axe vertical du SVG descend vers le bas, on inverse la plage (\`range([300, 0])\`) pour que les grandes valeurs soient en haut.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez une fonction `echelle_lineaire(domaine, plage)` qui **renvoie une fonction** traduisant une valeur du domaine en une valeur de la plage, comme `d3.scaleLinear`. Par exemple, `echelle_lineaire((0, 10), (0, 300))(5)` doit valoir 150, et `echelle_lineaire((0, 10), (300, 0))(10)` doit valoir 0.",
      starter: lines(
        "def echelle_lineaire(domaine, plage):",
        "    def echelle(valeur):",
        "        return valeur  # à compléter",
        "    return echelle",
      ),
      solution: lines(
        "def echelle_lineaire(domaine, plage):",
        "    d0, d1 = domaine",
        "    p0, p1 = plage",
        "    def echelle(valeur):",
        "        return p0 + (valeur - d0) / (d1 - d0) * (p1 - p0)",
        "    return echelle",
        "",
        "y = echelle_lineaire((0, 10), (300, 0))",
        "print(y(0), y(5), y(10))",
      ),
      test: lines(
        "assert echelle_lineaire((0, 10), (0, 300))(5) == 150, \"au milieu du domaine, on doit tomber au milieu de la plage : 150\"",
        "assert echelle_lineaire((0, 10), (300, 0))(10) == 0, \"avec une plage inversée (300, 0), la valeur 10 doit donner 0\"",
        "assert echelle_lineaire((20, 40), (0, 100))(25) == 25, \"le domaine ne commence pas forcément à 0 : (20, 40) vers (0, 100) donne 25 pour la valeur 25\"",
      ),
      hint: "Proportion parcourue dans le domaine : (valeur - d0) / (d1 - d0). On l'applique ensuite à la plage : p0 + proportion × (p1 - p0).",
    },
    {
      kind: "text",
      md: `### La jointure de données de D3.js, en lecture

D3.js (*Data-Driven Documents*) relie des **données** à des **éléments** de la page : c'est la « jointure de données ».

\`\`\`
const y = d3.scaleLinear().domain([0, d3.max(donnees)]).range([300, 0]);
d3.select("svg")
  .selectAll("rect")
  .data(donnees)
  .join("rect")
    .attr("x", (d, i) => i * 40)
    .attr("y", d => y(d))
    .attr("width", 30)
    .attr("height", d => 300 - y(d));
\`\`\`

Pour chaque valeur de \`donnees\`, D3 crée (ou met à jour, ou supprime) un \`<rect>\`, et calcule ses attributs avec des fonctions des données. Puissant et précis, mais exigeant : on construit chaque axe, chaque étiquette. Pour un tableau de bord courant, une bibliothèque de plus haut niveau va plus vite ; D3 brille pour les visualisations sur mesure. Le site n'exécute pas D3.js (aucune bibliothèque tierce n'est chargée).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec votre échelle, calculez la **hauteur en pixels** de chaque barre pour les valeurs `[2, 5, 8]` dans un graphique de **300 pixels** de haut dont le domaine va de **0 à 8**. Rangez la liste dans `hauteurs` (une barre de valeur 8 fait toute la hauteur).",
      setup: lines(
        "def echelle_lineaire(domaine, plage):",
        "    d0, d1 = domaine",
        "    p0, p1 = plage",
        "    return lambda v: p0 + (v - d0) / (d1 - d0) * (p1 - p0)",
      ),
      starter: lines("valeurs = [2, 5, 8]", "hauteurs = valeurs"),
      solution: lines(
        "valeurs = [2, 5, 8]",
        "hauteur = echelle_lineaire((0, 8), (0, 300))",
        "hauteurs = [hauteur(v) for v in valeurs]",
        "print(hauteurs)",
      ),
      test: "assert [round(h, 6) for h in hauteurs] == [75.0, 187.5, 300.0], f\"on attend 75, 187,5 et 300 pixels (vous avez {hauteurs})\"",
      hint: "echelle_lineaire((0, 8), (0, 300)) appliquée à chaque valeur.",
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce que le SVG ?",
      options: [
        "Une image en pixels compressée",
        "Un format texte qui décrit des formes (rectangles, cercles, chemins), dessinées nettes à toutes les tailles",
        "Une bibliothèque Python",
        "Un format de base de données",
      ],
      correct: 1,
      explanation: "Le SVG est vectoriel et textuel : chaque forme est une balise, que le navigateur dessine et que l'on peut animer ou rendre interactive.",
    },
    {
      question: "Que fait une échelle linéaire de domaine (0, 10) et de plage (0, 300) pour la valeur 2 ?",
      options: ["Elle renvoie 2", "Elle renvoie 60", "Elle renvoie 150", "Elle renvoie 300"],
      correct: 1,
      explanation: "2 est au cinquième du domaine, donc au cinquième de la plage : 300 × 0,2 = 60.",
    },
    {
      question: "Pourquoi inverse-t-on souvent la plage verticale (range([300, 0])) en SVG ?",
      options: [
        "Pour accélérer l'affichage",
        "Parce que l'axe vertical du SVG descend vers le bas : sans inversion, les grandes valeurs seraient en bas",
        "Pour faire un graphique en miroir",
        "Ce n'est jamais nécessaire",
      ],
      correct: 1,
      explanation: "En SVG, y = 0 est en haut de la zone. Inverser la plage place les grandes valeurs en haut, comme on s'y attend.",
    },
    {
      question: "Quand D3.js est-il le plus intéressant ?",
      options: [
        "Pour un graphique standard à produire très vite",
        "Pour une visualisation web sur mesure, où l'on veut contrôler chaque élément",
        "Pour faire des statistiques",
        "Pour stocker des données",
      ],
      correct: 1,
      explanation: "D3 donne un contrôle total, au prix de plus de code. Pour un graphique courant, une bibliothèque de plus haut niveau (Plotly, Vega-Lite) est souvent plus rapide à mettre en place.",
    },
  ],
};
