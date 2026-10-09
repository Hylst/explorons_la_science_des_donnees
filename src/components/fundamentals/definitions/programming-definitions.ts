
import { GlossaryTermDefinition } from "@/components/ui/glossary-term";

export const programmingDefinitions: Record<string, GlossaryTermDefinition> = {
  "python": {
    term: "Python",
    shortDefinition: "Langage de programmation polyvalent et facile à apprendre, très utilisé en Data Science.",
    longDefinition: "Python est un langage de programmation interprété, multi-paradigme (objet, impératif, fonctionnel) et de haut niveau, à la syntaxe simple et lisible. Sa popularité en Data Science s'explique par son écosystème riche de bibliothèques spécialisées comme pandas, NumPy, scikit-learn et TensorFlow.",
    examples: [
      "Analyse de données avec pandas et matplotlib",
      "Création de modèles de machine learning avec scikit-learn"
    ],
    relatedTerms: ["pandas", "NumPy", "scikit-learn", "Jupyter Notebook"],
    source: "Python Software Foundation"
  },
  
  "r": {
    term: "R",
    shortDefinition: "Langage de programmation spécialisé dans l'analyse statistique et la visualisation de données.",
    longDefinition: "R est un langage de programmation et un environnement logiciel libre dédié aux statistiques et à la science des données. Il offre une grande variété de techniques statistiques et graphiques, et est hautement extensible grâce à ses nombreux packages.",
    examples: [
      "Manipulation de données avec dplyr et tidyr, modèles statistiques avec stats (lm, glm) ou lme4",
      "Création de visualisations élégantes avec ggplot2"
    ],
    relatedTerms: ["tidyverse", "ggplot2", "RStudio", "CRAN"],
    source: "The R Foundation"
  },
  
  "sql": {
    term: "SQL",
    shortDefinition: "Langage informatique normalisé pour exploiter et manipuler des bases de données relationnelles.",
    longDefinition: "SQL (Structured Query Language) est un langage informatique normalisé servant à interroger, manipuler et définir des données dans des bases de données relationnelles. Il permet d'effectuer des requêtes, d'insérer, de mettre à jour et de supprimer des données, ainsi que de gérer la structure des bases de données.",
    examples: [
      "SELECT * FROM clients WHERE pays='France'",
      "JOIN tables pour combiner des données de plusieurs sources"
    ],
    relatedTerms: ["Base de données relationnelle", "JOIN", "Query", "CRUD"],
    source: "ISO/IEC 9075"
  },
  
  "pandas": {
    term: "pandas",
    shortDefinition: "Bibliothèque Python offrant des structures de données et des outils d'analyse puissants.",
    longDefinition: "pandas est une bibliothèque Python qui fournit des structures de données flexibles comme les DataFrames et des outils d'analyse de données puissants. Elle facilite la manipulation, le nettoyage et l'analyse des données structurées, offrant des fonctionnalités similaires à celles disponibles dans R.",
    examples: [
      "Lecture de données CSV avec pd.read_csv()",
      "Manipulation de données avec des opérations comme groupby(), merge(), pivot()"
    ],
    relatedTerms: ["DataFrame", "Series", "NumPy", "Data cleaning"],
    source: "pandas.pydata.org"
  },
  
  "jupyter-notebook": {
    term: "Jupyter Notebook",
    shortDefinition: "Application web permettant de créer et de partager des documents contenant du code exécutable, des visualisations et du texte.",
    longDefinition: "Jupyter Notebook est une application web open-source qui permet de créer et de partager des documents contenant du code exécutable, des équations, des visualisations et du texte narratif. Les notebooks sont largement utilisés en data science pour le prototypage, l'exploration de données, la modélisation et la communication des résultats.",
    examples: [
      "Analyse exploratoire de données avec code et visualisations interactives",
      "Création de rapports d'analyse combinant code, résultats et explications"
    ],
    relatedTerms: ["JupyterLab", "IPython", "Markdown", "Code interactif"],
    source: "jupyter.org"
  },
  
  "api": {
    term: "API",
    shortDefinition: "Interface de programmation qui permet à différents logiciels de communiquer entre eux.",
    longDefinition: "Une API (Application Programming Interface) est un ensemble de règles et de protocoles permettant à différents logiciels ou services de communiquer entre eux. En data science, les APIs sont souvent utilisées pour récupérer des données à partir de services web, de bases de données ou d'autres sources de données externes.",
    examples: [
      "Récupérer des jeux de données ouverts via l'API de data.gouv.fr",
      "Accéder à des données financières via l'API d'un fournisseur de données"
    ],
    relatedTerms: ["REST API", "JSON", "Endpoint", "Request", "Response"],
  },
  
  "github": {
    term: "GitHub",
    shortDefinition: "Plateforme web de versionnage et de collaboration pour le code source.",
    longDefinition: "GitHub est un service d'hébergement de code et de collaboration construit autour de Git (le système de contrôle de version). Il permet aux développeurs de stocker, gérer et collaborer sur des projets de code. En data science, GitHub est utilisé pour partager du code, collaborer sur des projets et assurer la reproductibilité des analyses.",
    examples: [
      "Collaboration sur un projet d'analyse de données avec plusieurs data scientists",
      "Publication d'un package Python ou R pour la communauté"
    ],
    relatedTerms: ["Git", "Repository", "Commit", "Pull Request", "Version control"],
    source: "github.com"
  }
};
