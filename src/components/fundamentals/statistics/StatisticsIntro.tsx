
import { Book, BookOpen } from "lucide-react";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { statisticsDefinitions } from "../definitions/statistics-definitions";

const StatisticsIntro = () => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 bg-clip-text text-transparent">
        Mathématiques et statistiques
      </h2>
      <div className="max-w-none">
        <p className="text-lg">
          Les mathématiques et les 
          <GlossaryTerm 
            definition={statisticsDefinitions["statistiques"]} 
            highlightStyle="underline"
          > statistiques </GlossaryTerm> 
          sont le langage fondamental de la Data Science. 
          Ces disciplines fournissent les outils nécessaires pour comprendre, modéliser et tirer des conclusions à partir des données.
        </p>
        
        <div className="my-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex gap-3 items-start">
            <BookOpen className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Pourquoi les statistiques sont-elles si importantes ?</h3>
              <p className="text-gray-700">
                Les 
                <GlossaryTerm 
                  definition={statisticsDefinitions["statistiques"]} 
                  variant="hover"
                  highlightStyle="dotted"
                > statistiques </GlossaryTerm> 
                nous permettent de faire face à l'incertitude de manière rigoureuse. 
                Dans un monde où les données sont abondantes mais imparfaites, 
                les méthodes statistiques nous offrent un cadre pour :
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">
                <li>
                  Découvrir des tendances et des modèles dans des ensembles de données complexes avec des techniques comme la 
                  <GlossaryTerm 
                    definition={statisticsDefinitions["corrélation"]} 
                    variant="tooltip"
                    highlightStyle="dashed"
                  > corrélation </GlossaryTerm>
                </li>
                <li>
                  Quantifier l'
                  <GlossaryTerm 
                    definition={statisticsDefinitions["probabilité"]} 
                    variant="click"
                    highlightStyle="glow"
                  >incertitude et le risque</GlossaryTerm> 
                  dans nos analyses
                </li>
                <li>
                  <GlossaryTerm 
                    definition={statisticsDefinitions["test-d'hypothèse"]} 
                    highlightStyle="solid"
                  >Tester des hypothèses</GlossaryTerm> 
                  et prendre des décisions basées sur les données
                </li>
                <li>
                  Faire des prédictions, avec une idée de leur incertitude, à partir d'échantillons limités, grâce à des modèles comme la 
                  <GlossaryTerm 
                    definition={statisticsDefinitions["régression-linéaire"]}
                  > régression linéaire</GlossaryTerm>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-purple-50 rounded-lg border border-purple-100 mt-8">
          <div className="flex gap-3 items-start">
            <Book className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Les deux branches principales des statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-purple-100 bg-white p-3 rounded-md">
                  <h4 className="font-medium text-purple-700">
                    <GlossaryTerm 
                      definition={statisticsDefinitions["statistiques-descriptives"]}
                      variant="hover"
                      highlightStyle="underline"
                    >
                      Statistiques descriptives
                    </GlossaryTerm>
                  </h4>
                  <p className="text-sm mt-2 text-gray-600">
                    Ensemble de méthodes pour résumer, visualiser et synthétiser les informations contenues dans un jeu de données.
                  </p>
                </div>
                
                <div className="border border-purple-100 bg-white p-3 rounded-md">
                  <h4 className="font-medium text-purple-700">
                    <GlossaryTerm 
                      definition={statisticsDefinitions["statistiques-inférentielles"]}
                      variant="hover"
                      highlightStyle="underline"
                    >
                      Statistiques inférentielles
                    </GlossaryTerm>
                  </h4>
                  <p className="text-sm mt-2 text-gray-600">
                    Méthodes pour généraliser les résultats observés sur un échantillon à l'ensemble d'une population.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsIntro;
