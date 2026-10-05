
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, CheckCircle2 } from "lucide-react";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { dataProcessingDefinitions } from "./definitions/data-processing-definitions";
import { programmingDefinitions } from "./definitions/programming-definitions";

const DataProcessingSection = () => {
  return (
    <div id="dataprocessing" className="scroll-mt-24 border-l-4 border-ds-purple-400 pl-6 py-2">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-ds-purple-400 to-ds-blue-400 bg-clip-text text-transparent">
        <GlossaryTerm definition={dataProcessingDefinitions["traitement-données"]}>
          Traitement des données
        </GlossaryTerm>
      </h2>
      <div className="max-w-none">
        <p className="text-lg">
          Le traitement des données est souvent l'étape qui prend le plus de temps dans un projet de Data Science, 
          mais c'est aussi une étape cruciale pour garantir des résultats fiables et des analyses pertinentes.
        </p>
        
        <div className="my-8">
          <div className="flex flex-wrap justify-between items-center">
            {['Collecte', 'Nettoyage', 'Transformation', 'Intégration'].map((step, i) => (
              <div key={i} className="text-center mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-r from-ds-blue-100 to-ds-purple-100 rounded-full mx-auto mb-2 shadow-sm">
                  <span className="text-2xl font-bold text-ds-blue-600">{i + 1}</span>
                </div>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-ds-blue-200 to-ds-purple-200 rounded-full my-4"></div>
        </div>
        
        <h3 className="text-xl font-semibold mt-8 mb-4">Étapes du traitement des données</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <Card className="border-t-4 border-t-ds-blue-500 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-ds-blue-100 p-2 rounded-full mr-2">
                  <ArrowRightIcon className="h-4 w-4 text-ds-blue-500" />
                </span>
                Collecte de données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Acquisition de données à partir de diverses sources:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> 
                  <GlossaryTerm definition={programmingDefinitions["api"]} variant="tooltip">
                    APIs et services web
                  </GlossaryTerm>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> Web scraping et extraction automatisée
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> Bases de données relationnelles et NoSQL
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> Fichiers CSV, JSON, XML, etc.
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-ds-purple-500 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-ds-purple-100 p-2 rounded-full mr-2">
                  <ArrowRightIcon className="h-4 w-4 text-ds-purple-500" />
                </span>
                <GlossaryTerm definition={dataProcessingDefinitions["data-cleaning"]}>
                  Nettoyage de données
                </GlossaryTerm>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Assurer la qualité des données en gérant:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Valeurs manquantes (imputation, suppression)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Détection et traitement des anomalies (outliers)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Correction des erreurs et incohérences
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> 
                  <GlossaryTerm definition={dataProcessingDefinitions["standardisation"]} variant="tooltip">
                    Standardisation des formats et des unités
                  </GlossaryTerm>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-ds-blue-300 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-ds-blue-100 p-2 rounded-full mr-2">
                  <ArrowRightIcon className="h-4 w-4 text-ds-blue-500" />
                </span>
                Transformation des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Préparation des données pour l'analyse:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> 
                  <GlossaryTerm definition={dataProcessingDefinitions["normalisation"]} variant="tooltip">
                    Normalisation et standardisation
                  </GlossaryTerm>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> 
                  <GlossaryTerm definition={dataProcessingDefinitions["encodage-catégoriel"]} variant="tooltip">
                    Encodage des variables catégorielles
                  </GlossaryTerm> (one-hot, label)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> Réduction de dimension (PCA, t-SNE)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-blue-500 mr-2" /> 
                  <GlossaryTerm definition={dataProcessingDefinitions["feature-engineering"]}>
                    Feature engineering et création de variables
                  </GlossaryTerm>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-ds-purple-300 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-ds-purple-100 p-2 rounded-full mr-2">
                  <ArrowRightIcon className="h-4 w-4 text-ds-purple-500" />
                </span>
                Intégration de données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Combinaison de différentes sources:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Jointures et fusions de datasets
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Agrégations et résumés statistiques
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> Harmonisation des schémas et formats
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ds-purple-500 mr-2" /> 
                  <GlossaryTerm definition={dataProcessingDefinitions["data-warehouse"]} variant="tooltip">
                    Création d'ensembles de données cohérents
                  </GlossaryTerm>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg my-8 border border-purple-100 shadow-sm">
          <p className="text-lg font-medium text-gray-800">
            Un traitement de données efficace garantit que les modèles d'analyse et de machine learning reçoivent des données 
            de qualité, augmentant ainsi leur performance et leur fiabilité. Selon les enquêtes Anaconda auprès des praticiens, cette étape occupe 
            entre 38 % (enquête 2022) et 45 % (enquête 2020) du temps déclaré, la plus grande part de toutes les activités.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataProcessingSection;
