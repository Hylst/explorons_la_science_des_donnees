
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Code, Database, BrainCircuit, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

// Types for course structure
interface Course {
  id: string;
  title: string;
  description: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  duration: string;
  link: string;
}

interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  courses: Course[];
}

const InitiationCoursesSection = () => {
  const [activeTab, setActiveTab] = useState("fondations");

  // Course categories data
  const categories: CourseCategory[] = [
    {
      id: "fondations",
      name: "Fondations Mathématiques et Logiques",
      slug: "fondations-mathematiques-et-logiques",
      icon: <Calculator className="h-5 w-5" />,
      courses: [
        {
          id: "math-intro",
          title: "Introduction aux Mathématiques pour la Data Science",
          description: "Les bases mathématiques nécessaires : ensembles, fonctions, calcul différentiel et intégral.",
          level: "Débutant",
          duration: "4 semaines",
          link: "/courses/math-stats/math-intro"
        },
        {
          id: "proba-stat",
          title: "Probabilités et Statistiques Essentielles",
          description: "Comprendre les concepts de probabilité, distributions, tests statistiques et intervalles de confiance.",
          level: "Débutant",
          duration: "5 semaines",
          link: "/fundamentals/math-stats/probability-theory"
        },
        {
          id: "algebra",
          title: "Algèbre Linéaire pour la Data Science",
          description: "Manipuler les vecteurs, matrices et comprendre les transformations linéaires.",
          level: "Intermédiaire",
          duration: "6 semaines",
          link: "/fundamentals/math-stats/linear-algebra"
        },
        {
          id: "logic",
          title: "Logique et Raisonnement Formel",
          description: "Les fondements de la logique, raisonnement déductif et inductif, formalisation des problèmes.",
          level: "Intermédiaire",
          duration: "4 semaines",
          link: "/fundamentals/math-stats"
        }
      ]
    },
    {
      id: "programming",
      name: "Programmation et Algorithmes",
      slug: "programmation-et-algorithmes",
      icon: <Code className="h-5 w-5" />,
      courses: [
        {
          id: "python-basics",
          title: "Python pour la Data Science - Fondamentaux",
          description: "Structures de données, fonctions et bibliothèques pour la manipulation de données.",
          level: "Débutant",
          duration: "6 semaines",
          link: "/courses/programming/python-basics"
        },
        {
          id: "python-adv",
          title: "Python Avancé pour l'Analyse de Données",
          description: "Optimisation, programmation fonctionnelle et orientée objet pour l'analyse de données.",
          level: "Intermédiaire",
          duration: "5 semaines",
          link: "/fundamentals/programming"
        },
        {
          id: "algorithms",
          title: "Algorithmes et Structures de Données",
          description: "Complexité algorithmique, structures de données efficaces et algorithmes fondamentaux.",
          level: "Intermédiaire",
          duration: "8 semaines",
          link: "/fundamentals/programming"
        },
        {
          id: "big-data",
          title: "Programmation pour le Big Data",
          description: "Spark, Hadoop et outils de traitement distribué pour les gros volumes de données.",
          level: "Avancé",
          duration: "10 semaines",
          link: "/fundamentals/databases"
        }
      ]
    },
    {
      id: "databases",
      name: "Bases de Données et Stockage",
      slug: "bases-de-donnees-et-stockage",
      icon: <Database className="h-5 w-5" />,
      courses: [
        {
          id: "sql-basics",
          title: "SQL et Bases de Données Relationnelles",
          description: "Conception, requêtes et optimisation de bases de données SQL.",
          level: "Débutant",
          duration: "4 semaines",
          link: "/courses/databases/database-fundamentals"
        },
        {
          id: "nosql",
          title: "Bases de Données NoSQL",
          description: "MongoDB, Cassandra, Redis et autres bases de données non-relationnelles.",
          level: "Intermédiaire",
          duration: "5 semaines",
          link: "/fundamentals/databases"
        },
        {
          id: "data-warehouse",
          title: "Data Warehousing et ETL",
          description: "Conception d'entrepôts de données et processus d'extraction, transformation et chargement.",
          level: "Intermédiaire",
          duration: "6 semaines",
          link: "/fundamentals/databases"
        },
        {
          id: "data-lake",
          title: "Data Lakes et Architecture Data",
          description: "Conception de lacs de données et architectures modernes pour le stockage massif.",
          level: "Avancé",
          duration: "5 semaines",
          link: "/fundamentals/databases"
        }
      ]
    },
    {
      id: "ml-ai",
      name: "Machine Learning et IA",
      slug: "machine-learning-et-ia",
      icon: <BrainCircuit className="h-5 w-5" />,
      courses: [
        {
          id: "ml-basics",
          title: "Introduction au Machine Learning",
          description: "Apprentissage supervisé, non supervisé, évaluation et sélection de modèles.",
          level: "Débutant",
          duration: "8 semaines",
          link: "/courses/machine-learning/supervised-learning"
        },
        {
          id: "deep-learning",
          title: "Deep Learning - Réseaux de Neurones",
          description: "Architectures de réseaux, CNN, RNN, techniques d'optimisation.",
          level: "Intermédiaire",
          duration: "10 semaines",
          link: "/machine-learning"
        },
        {
          id: "nlp",
          title: "Traitement du Langage Naturel",
          description: "Techniques d'analyse et de génération de texte, modèles de langage.",
          level: "Intermédiaire",
          duration: "7 semaines",
          link: "/courses/nlp/natural-language-processing"
        },
        {
          id: "cv",
          title: "Computer Vision",
          description: "Traitement d'images, détection d'objets, segmentation et reconnaissance.",
          level: "Avancé",
          duration: "8 semaines",
          link: "/machine-learning"
        },
        {
          id: "ml-models",
          title: "Modèles ML & IA",
          description: "Guide complet des algorithmes de Machine Learning : supervisé, non-supervisé, deep learning et sélection de modèles.",
          level: "Intermédiaire",
          duration: "6 semaines",
          link: "/courses/machine-learning/ml-models-guide"
        },
        {
          id: "transformers",
          title: "Transformers et Attention",
          description: "Architecture Transformer, mécanismes d'attention, BERT, GPT et applications modernes du NLP.",
          level: "Avancé",
          duration: "8 semaines",
          link: "/courses/machine-learning/transformers"
        }
      ]
    },
    {
      id: "dataviz",
      name: "Visualisation de Données",
      slug: "visualisation-de-donnees",
      icon: <LineChart className="h-5 w-5" />,
      courses: [
        {
          id: "viz-basics",
          title: "Principes de la Visualisation de Données",
          description: "Théories visuelles, perception humaine et bonnes pratiques de visualisation.",
          level: "Débutant",
          duration: "3 semaines",
          link: "/courses/dataviz/data-visualization"
        },
        {
          id: "dataviz-tools",
          title: "Outils de Visualisation de Données",
          description: "Prise en main de Matplotlib, Seaborn, Plotly et Tableau.",
          level: "Débutant",
          duration: "5 semaines",
          link: "/courses/dataviz/data-visualization"
        },
        {
          id: "interactive-viz",
          title: "Visualisations Interactives et Dashboards",
          description: "Création de visualisations interactives avec D3.js, Dash et Streamlit.",
          level: "Intermédiaire",
          duration: "6 semaines",
          link: "/courses/dataviz/data-visualization"
        },
        {
          id: "storytelling",
          title: "Data Storytelling",
          description: "L'art de communiquer des insights à travers des narrations visuelles.",
          level: "Intermédiaire",
          duration: "4 semaines",
          link: "/courses/dataviz/data-visualization"
        }
      ]
    }
  ];



  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Cours d'initiation par thématique</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Découvrez nos cours d'initiation couvrant les fondamentaux de la data science, 
        de la théorie aux applications pratiques. Chaque cours est conçu pour vous 
        donner une base solide dans un domaine spécifique.
      </p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto p-1 gap-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id}
            className="mt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.courses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${course.level === 'Débutant' ? 'bg-emerald-100 text-emerald-800' : 
                        course.level === 'Intermédiaire' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}`}>
                      Niveau: {course.level}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      Durée conseillée : {course.duration}
                    </span>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button asChild>
                      <Link to={course.link} className="flex items-center gap-1">
                        Accéder au cours complet <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default InitiationCoursesSection;
