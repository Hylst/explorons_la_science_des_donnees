
import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

export const datavizDefinitions: Record<string, GlossaryTermDefinition> = {
  "visualisation-données": {
    term: "Visualisation de données",
    shortDefinition: "Représentation graphique des données pour faciliter leur compréhension et leur analyse.",
    longDefinition: "La visualisation de données est l'art et la science de représenter des données sous forme graphique pour faciliter leur interprétation et leur analyse. Elle permet de communiquer des informations complexes de manière claire et efficace, de détecter des tendances, des modèles et des anomalies, et d'appuyer la prise de décision.",
    examples: [
      "Graphique de l'évolution des ventes mensuelles d'une entreprise",
      "Carte de chaleur montrant la densité de population par région"
    ],
    relatedTerms: ["Graphique", "Diagramme", "Tableau de bord", "Infographie"],
    source: "Principes de la visualisation de données"
  },
  
  "matplotlib": {
    term: "Matplotlib",
    shortDefinition: "Bibliothèque de visualisation pour Python inspirée de MATLAB.",
    longDefinition: "Matplotlib est une bibliothèque complète de création de graphiques statiques, animés et interactifs en Python. Elle offre une API orientée objet pour intégrer des graphiques dans des applications, ainsi qu'une interface semblable à MATLAB pour une utilisation rapide.",
    examples: [
      "Création de graphiques linéaires, à barres, à secteurs et de nuages de points",
      "Personnalisation fine des graphiques avec des options de style et de mise en page"
    ],
    relatedTerms: ["pyplot", "figure", "axes", "Python", "visualisation"],
    source: "matplotlib.org"
  },
  
  "seaborn": {
    term: "Seaborn",
    shortDefinition: "Bibliothèque Python de visualisation statistique basée sur matplotlib.",
    longDefinition: "Seaborn est une bibliothèque de visualisation de données Python basée sur matplotlib. Elle fournit une interface de plus haut niveau pour dessiner des graphiques statistiques informatifs et esthétiquement plaisants. Seaborn simplifie la création de visualisations complexes et intègre nativement les structures de données pandas.",
    examples: [
      "Création de heatmaps pour visualiser des matrices de corrélation",
      "Tracé de distributions avec violin plots et box plots"
    ],
    relatedTerms: ["matplotlib", "pandas", "statistical visualization"],
    source: "seaborn.pydata.org"
  },
  
  "tableau": {
    term: "Tableau",
    shortDefinition: "Plateforme logicielle de business intelligence et de visualisation de données.",
    longDefinition: "Tableau est une plateforme d'analyse visuelle qui transforme les données brutes en insights exploitables. Elle permet aux utilisateurs de créer des visualisations interactives, des tableaux de bord et des histoires sans nécessiter de compétences avancées en programmation.",
    examples: [
      "Création d'un tableau de bord interactif pour suivre les KPIs d'une entreprise",
      "Analyse visuelle des tendances de vente par région et par période"
    ],
    relatedTerms: ["Business Intelligence", "Dashboard", "Data Discovery", "Tableau Public"],
    source: "tableau.com"
  },
  
  "d3js": {
    term: "D3.js",
    shortDefinition: "Bibliothèque JavaScript pour produire des visualisations de données dynamiques et interactives dans un navigateur web.",
    longDefinition: "D3.js (Data-Driven Documents) est une bibliothèque JavaScript qui permet de manipuler des documents basés sur des données. Elle utilise HTML, SVG et CSS pour créer des visualisations de données dynamiques et interactives dans le navigateur web. D3.js offre une grande flexibilité mais nécessite une certaine expertise en programmation.",
    examples: [
      "Création de visualisations personnalisées et interactives pour le web",
      "Animation de transitions entre différents états de données"
    ],
    relatedTerms: ["JavaScript", "SVG", "DOM manipulation", "Web visualization"],
    source: "d3js.org"
  },
  
  "power-bi": {
    term: "Power BI",
    shortDefinition: "Suite d'outils d'analyse commerciale de Microsoft pour l'analyse et le partage de données.",
    longDefinition: "Microsoft Power BI est une collection d'applications, de services et de connecteurs qui transforment des sources de données disparates en insights cohérents, visuellement immersifs et interactifs. Il permet de connecter à diverses sources de données, de simplifier la préparation des données et de créer des visualisations rapidement.",
    examples: [
      "Création de tableaux de bord pour suivre les performances commerciales",
      "Partage de rapports interactifs au sein d'une organisation"
    ],
    relatedTerms: ["DAX", "Power Query", "Microsoft Excel", "Business Intelligence"],
    source: "microsoft.com/powerbi"
  },
  
  "heatmap": {
    term: "Heatmap",
    shortDefinition: "Représentation graphique où les valeurs individuelles sont représentées par des couleurs.",
    longDefinition: "Une heatmap (carte de chaleur) est une technique de visualisation où les valeurs d'une matrice sont représentées par des couleurs. L'intensité de la couleur correspond à la magnitude de la valeur. Les heatmaps sont particulièrement utiles pour identifier des modèles, des clusters et des corrélations dans des ensembles de données complexes.",
    examples: [
      "Visualisation d'une matrice de corrélation entre variables",
      "Représentation de l'activité utilisateur sur un site web"
    ],
    relatedTerms: ["Matrice de corrélation", "Carte de chaleur", "Gradient de couleur"],
    source: "Techniques de visualisation de données"
  }
};
