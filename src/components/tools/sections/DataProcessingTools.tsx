import { asset } from "@/lib/asset";
import { SourceNote } from "@/components/ui/source-note";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { 
  Database, 
  ArrowRight, 
  Workflow,
  AlertCircle,
  Check
} from "lucide-react";

const DataProcessingTools = () => {
  return (
    <div id="data-processing-tools" className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Outils de traitement des données</h2>
        <p className="text-lg mb-8">
          Le prétraitement et la transformation des données sont des étapes cruciales du processus de Data Science. 
          Ces outils permettent de nettoyer, transformer et préparer les données pour l'analyse.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-green-800">Le cycle de traitement des données</h3>
          
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex-1 max-w-[200px]">
              <div className="rounded-full bg-green-100 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-green-700">Acquisition</h4>
              <p className="text-xs text-gray-600 mt-1">Collecte depuis diverses sources</p>
            </div>
            
            <ArrowRight className="hidden xl:block h-6 w-6 text-gray-400" />
            <div className="h-6 w-6 xl:hidden flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex-1 max-w-[200px]">
              <div className="rounded-full bg-blue-100 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-700">Nettoyage</h4>
              <p className="text-xs text-gray-600 mt-1">Correction des erreurs et valeurs manquantes</p>
            </div>
            
            <ArrowRight className="hidden xl:block h-6 w-6 text-gray-400" />
            <div className="h-6 w-6 xl:hidden flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex-1 max-w-[200px]">
              <div className="rounded-full bg-purple-100 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-purple-700">Transformation</h4>
              <p className="text-xs text-gray-600 mt-1">Conversion en formats exploitables</p>
            </div>
            
            <ArrowRight className="hidden xl:block h-6 w-6 text-gray-400" />
            <div className="h-6 w-6 xl:hidden flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex-1 max-w-[200px]">
              <div className="rounded-full bg-orange-100 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
              </div>
              <h4 className="font-medium text-orange-700">Analyse</h4>
              <p className="text-xs text-gray-600 mt-1">Extraction d'enseignements et modélisation</p>
            </div>
          </div>
          
          <div className="text-sm flex items-center mt-4 bg-white p-3 rounded-lg border border-green-100">
            <AlertCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
            <p>
              <strong>Saviez-vous que :</strong> Selon les enquêtes Anaconda, les data scientists déclarent consacrer entre 38 % (2022) et 45 % (2020) de leur temps au chargement et au nettoyage des données, la plus grande part de toutes leurs activités.
            </p>
          </div>
          <SourceNote
            consulted="1er octobre 2026"
            sources={[
              { label: "Anaconda, State of Data Science 2020", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-SODS-Report-2020-Final.pdf" },
              { label: "Anaconda 2022 (relayé par VentureBeat)", href: "https://venturebeat.com/ai/what-are-data-scientists-biggest-concerns-the-2022-state-of-data-science-report-has-the-answers" },
            ]}
          />
        </div>
      </div>

      <Tabs defaultValue="frameworks" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="databases">Bases de données</TabsTrigger>
          <TabsTrigger value="etl">ETL & Pipelines</TabsTrigger>
          <TabsTrigger value="big-data">Big Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frameworks" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center">
                  <img src={asset("img/logos/pandas.svg")} alt="" className="h-6 w-6 mr-2" />
                  Pandas
                </CardTitle>
                <CardDescription>
                  Bibliothèque Python pour la manipulation et l'analyse de données
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>DataFrames</Badge>
                    <Badge>Filtrage</Badge>
                    <Badge>Agrégation</Badge>
                    <Badge>Jointures</Badge>
                    <Badge>I/O</Badge>
                  </div>
                  
                  <p className="text-sm">
                    Pandas est une bibliothèque très utilisée qui permet de manipuler facilement des données
                    structurées avec ses structures DataFrames et Series.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                    <h4 className="font-medium text-blue-700 mb-2">Exemple de code Pandas</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                      <pre>{`import pandas as pd

# Charger les données
df = pd.read_csv('donnees.csv')

# Nettoyage des données
df = df.dropna(subset=['colonne_importante'])
df['date'] = pd.to_datetime(df['date'])

# Filtrage
clients_actifs = df[df['statut'] == 'actif']

# Agrégation
resume = df.groupby('categorie').agg({
    'ventes': ['sum', 'mean'],
    'client_id': 'count'
})`}</pre>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Idéal pour l'analyse exploratoire et la préparation des données</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="bg-yellow-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Dplyr & Tidyr (R)
                </CardTitle>
                <CardDescription>
                  Bibliothèques R du tidyverse pour la manipulation des données
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-yellow-50">filter</Badge>
                    <Badge variant="outline" className="bg-yellow-50">select</Badge>
                    <Badge variant="outline" className="bg-yellow-50">mutate</Badge>
                    <Badge variant="outline" className="bg-yellow-50">group_by</Badge>
                    <Badge variant="outline" className="bg-yellow-50">summarize</Badge>
                  </div>
                  
                  <p className="text-sm">
                    Les packages dplyr et tidyr offrent une grammaire intuitive pour manipuler les données
                    en R, avec des opérations enchaînables et lisibles.
                  </p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
                    <h4 className="font-medium text-yellow-700 mb-2">Exemple de code dplyr</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                      <pre>{`library(dplyr)
library(tidyr)

# Lire les données
donnees <- read.csv("donnees.csv")

# Chaîne de traitements
resultats <- donnees %>%
  # Sélectionner des colonnes
  select(id, nom, ventes, date) %>%
  # Filtrer
  filter(ventes > 1000) %>%
  # Ajouter une colonne calculée
  mutate(categorie_ventes = case_when(
    ventes < 5000 ~ "Faible",
    ventes < 10000 ~ "Moyen",
    TRUE ~ "Élevé"
  )) %>%
  # Grouper et résumer
  group_by(categorie_ventes) %>%
  summarize(
    n = n(),
    ventes_moyennes = mean(ventes),
    ventes_totales = sum(ventes)
  )`}</pre>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Puissant pour les analyses statistiques et le nettoyage de données</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="bg-purple-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  NumPy
                </CardTitle>
                <CardDescription>
                  Bibliothèque fondamentale pour le calcul scientifique en Python
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-purple-50">Arrays</Badge>
                    <Badge variant="outline" className="bg-purple-50">Vectorisation</Badge>
                    <Badge variant="outline" className="bg-purple-50">Algèbre linéaire</Badge>
                    <Badge variant="outline" className="bg-purple-50">Calcul scientifique</Badge>
                  </div>
                  
                  <p className="text-sm">
                    NumPy fournit des structures de données efficaces pour manipuler de grands tableaux
                    et des opérations vectorisées rapides, fondamentales pour le calcul scientifique.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Base de nombreuses bibliothèques de data science (pandas, scikit-learn...)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="bg-green-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Dask
                </CardTitle>
                <CardDescription>
                  Traitement parallèle pour Python avec une API similaire à pandas et NumPy
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-green-50">Calcul parallèle</Badge>
                    <Badge variant="outline" className="bg-green-50">Big Data</Badge>
                    <Badge variant="outline" className="bg-green-50">API pandas</Badge>
                    <Badge variant="outline" className="bg-green-50">Traitement paresseux</Badge>
                  </div>
                  
                  <p className="text-sm">
                    Dask permet de traiter des données plus volumineuses que la mémoire vive en
                    parallélisant les calculs, tout en gardant une API familière pour les utilisateurs de pandas.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Idéal pour passer à l'échelle des analyses pandas sur des données volumineuses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="databases" className="pt-6">
          <div className="space-y-6">
            <p className="text-lg mb-4">
              Les bases de données sont essentielles pour stocker, organiser et accéder efficacement aux données.
              Chaque type de base de données possède des caractéristiques adaptées à différents besoins.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-blue-50 rounded-t-lg">
                  <CardTitle>Bases SQL relationnelles</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/postgresql.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">PostgreSQL</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/mysql.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">MySQL</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/sqlite.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">SQLite</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-blue-600">
                          <path fill="currentColor" d="M4,1H20A1,1 0 0,1 21,2V6.5C21,7.4 20.1,8 19.5,8C19.07,8 18.76,7.85 18.5,7.67C18.24,7.85 17.93,8 17.5,8C17.07,8 16.76,7.85 16.5,7.67C16.24,7.85 15.93,8 15.5,8C15.07,8 14.76,7.85 14.5,7.67C14.24,7.85 13.93,8 13.5,8C13.07,8 12.76,7.85 12.5,7.67C12.24,7.85 11.93,8 11.5,8C11.07,8 10.76,7.85 10.5,7.67C10.24,7.85 9.93,8 9.5,8C9.07,8 8.76,7.85 8.5,7.67C8.24,7.85 7.93,8 7.5,8C7.07,8 6.76,7.85 6.5,7.67C6.24,7.85 5.93,8 5.5,8C4.97,8 4,7.4 4,6.5V2C4,1.45 4.45,1 5,1L4,1M5,13.5V19H7V13.74C7.62,13.91 8.03,14 8.74,14C12.28,14 15.08,11.18 15.08,7.64C15.08,7.59 15.08,7.55 15.08,7.5H14V8.33C13.4,10.36 11.7,11.89 9.5,12C8.11,12.06 7.97,12 5,12V13.5M9.44,11H9.5C11.17,11 12.5,9.61 12.5,7.88C12.5,6.15 11.17,4.75 9.5,4.75C7.83,4.75 6.5,6.15 6.5,7.88C6.5,9.61 7.83,11 9.44,11Z" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">MS SQL</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-700">Points forts</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Structure en tables avec relations</li>
                        <li>ACID (Atomicité, Cohérence, Isolation, Durabilité)</li>
                        <li>Requêtes SQL standardisées</li>
                        <li>Excellentes pour les données structurées</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-green-50 rounded-t-lg">
                  <CardTitle>Bases NoSQL</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/mongodb.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">MongoDB</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/redis.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">Redis</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <img src={asset("img/logos/couchbase.svg")} alt="" className="h-8 w-8 mx-auto" />
                        <span className="text-sm font-medium block mt-1">Couchbase</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-green-600">
                          <path fill="currentColor" d="M12.005 0L4.952 7.053H9.87v9.879h4.269V7.053h4.918L12.005 0zM4.952 16.932v-4.879l-3.01 3.009 3.01 3.01v-1.14h14.109v1.14l3.01-3.01-3.01-3.009v4.879H4.952z" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">Neo4j</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-700">Points forts</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Schéma flexible ou sans schéma</li>
                        <li>Conçues pour la mise à l'échelle horizontale (sauf les bases de graphes, plus délicates à répartir)</li>
                        <li>Performances élevées pour des cas spécifiques</li>
                        <li>Types : document, clé-valeur, colonne, graphe</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-purple-50 rounded-t-lg">
                  <CardTitle>Data Warehouses</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-blue-600">
                          <path fill="currentColor" d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">Snowflake</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-red-600">
                          <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">Redshift</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-blue-600">
                          <path fill="currentColor" d="M19.15,10.15C18.68,9.7 18.11,9.35 17.5,9.13C17.83,8.6 18,8 18,7.38C18,6.73 17.81,6.11 17.45,5.58C17.09,5.06 16.56,4.66 15.95,4.42C15.33,4.18 14.65,4.12 14,4.26C13.34,4.41 12.75,4.74 12.29,5.21C11.9,4.76 11.4,4.41 10.83,4.21C10.26,4 9.65,3.94 9.06,4.04C8.46,4.14 7.91,4.39 7.45,4.75C7,5.11 6.65,5.58 6.44,6.13C6.23,6.67 6.17,7.26 6.26,7.83C6.36,8.41 6.6,8.94 6.97,9.37C6.31,9.65 5.75,10.1 5.35,10.68C4.95,11.26 4.75,11.94 4.75,12.64C4.75,13.43 5.04,14.19 5.56,14.77C6.09,15.35 6.81,15.71 7.58,15.79C7.45,16.25 7.42,16.74 7.5,17.21C7.58,17.68 7.77,18.13 8.05,18.5C8.33,18.88 8.69,19.19 9.11,19.39C9.53,19.6 9.99,19.7 10.45,19.7C11.07,19.7 11.68,19.5 12.19,19.14C12.57,19.65 13.11,20.02 13.71,20.2C14.32,20.38 14.97,20.36 15.57,20.13C16.17,19.91 16.69,19.5 17.05,18.95C17.42,18.41 17.61,17.77 17.61,17.12C17.6,16.55 17.43,16 17.11,15.53C17.81,15.19 18.38,14.62 18.71,13.9C19.04,13.18 19.12,12.36 18.93,11.59C18.75,10.81 18.32,10.12 17.7,9.63M11.59,17.56C11.21,17.78 10.75,17.84 10.32,17.71C9.89,17.59 9.53,17.29 9.3,16.89C9.08,16.5 9.03,16.06 9.16,15.63C9.29,15.2 9.58,14.84 9.96,14.61C10.35,14.37 10.83,14.31 11.27,14.45C11.71,14.59 12.08,14.89 12.3,15.3C12.52,15.71 12.56,16.2 12.41,16.64C12.26,17.09 11.97,17.47 11.59,17.69M7.16,13.18C6.85,13 6.59,12.75 6.4,12.44C6.22,12.14 6.11,11.79 6.09,11.44C6.08,11.09 6.15,10.73 6.3,10.41C6.45,10.08 6.67,9.8 6.95,9.58C7.22,9.36 7.55,9.21 7.89,9.15C8.23,9.08 8.59,9.1 8.92,9.19C9.25,9.29 9.55,9.47 9.8,9.71C10.04,9.95 10.21,10.24 10.31,10.57C10.39,10.92 10.38,11.28 10.28,11.63C10.18,11.97 10,12.28 9.76,12.53C9.5,12.79 9.2,12.97 8.86,13.07C8.52,13.18 8.16,13.2 7.81,13.14C7.59,13.18 7.37,13.2 7.15,13.18H7.16M10.3,11.1C10.2,10.91 10.07,10.75 9.9,10.63C9.73,10.5 9.54,10.42 9.33,10.38C9.14,10.34 8.93,10.34 8.74,10.39C8.55,10.44 8.38,10.52 8.23,10.65C8.08,10.78 7.96,10.93 7.88,11.11C7.8,11.29 7.77,11.48 7.78,11.67C7.8,11.86 7.85,12.05 7.95,12.21C8.05,12.37 8.19,12.5 8.34,12.6C8.5,12.7 8.68,12.76 8.88,12.78C9.07,12.8 9.26,12.78 9.44,12.71C9.62,12.65 9.78,12.54 9.91,12.4C10.05,12.26 10.14,12.09 10.2,11.9L10.29,11.1H10.3M13.84,8.92C13.42,8.59 12.87,8.47 12.35,8.59C11.83,8.7 11.39,9.05 11.14,9.52C10.9,10 10.87,10.55 11.05,11.06C11.23,11.56 11.62,11.95 12.11,12.14C12.6,12.33 13.14,12.29 13.61,12.04C14.08,11.79 14.43,11.35 14.54,10.84C14.64,10.32 14.5,9.77 14.15,9.35C14.43,9.37 14.69,9.25 14.89,9.05C15.08,8.85 15.18,8.57 15.18,8.29C15.18,8.01 15.07,7.74 14.86,7.54C14.65,7.35 14.37,7.24 14.08,7.24C13.79,7.24 13.51,7.35 13.3,7.54C13.09,7.74 12.97,8.01 12.97,8.29C12.97,8.57 13.08,8.85 13.28,9.05C13.45,9.22 13.69,9.33 13.93,9.36M11.95,12.97C12.25,13.01 12.53,13.11 12.78,13.27C13.03,13.42 13.24,13.62 13.39,13.86C13.54,14.1 13.63,14.37 13.65,14.65C13.68,14.93 13.63,15.2 13.53,15.46C13.43,15.72 13.27,15.95 13.07,16.14C12.86,16.33 12.63,16.48 12.36,16.57C12.09,16.66 11.81,16.68 11.54,16.65C11.26,16.61 10.99,16.52 10.75,16.37C10.74,16.04 10.61,15.72 10.38,15.48C10.15,15.25 9.84,15.12 9.51,15.11C9.62,14.89 9.78,14.7 9.98,14.56C10.17,14.41 10.4,14.31 10.65,14.26C10.89,14.21 11.14,14.22 11.37,14.29C11.61,14.35 11.82,14.47 12,14.63C12,14.16 11.87,13.71 11.61,13.32C11.36,12.93 11,12.63 10.58,12.44C10.16,12.25 9.69,12.19 9.24,12.26C8.79,12.33 8.37,12.54 8.04,12.85C7.95,12.65 7.83,12.46 7.68,12.29C8.01,11.84 8.47,11.48 9,11.26C9.54,11.04 10.12,10.97 10.69,11.06C11.26,11.15 11.78,11.4 12.21,11.77C12.64,12.14 12.96,12.61 13.13,13.13C13.06,13.07 12.99,13.01 12.92,12.95L11.93,12.97H11.95Z" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">BigQuery</span>
                      </div>
                      <div className="p-3 bg-white rounded border text-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-green-600">
                          <path fill="currentColor" d="M16.61 13.5C15.81 13.85 15.11 14.36 14.54 15C13.97 15.64 13.54 16.4 13.3 17.25C12.11 17.09 10.9 17 9.68 17C7.2 17 4.79 17.38 2.61 18.07C1.48 18.52 1 19.55 1 20.56V22H7V20.56C7 19.55 7.52 18.47 8.65 18.07C9.67 17.72 10.72 17.5 11.77 17.42C11.59 18.39 11.82 19.4 12.4 20.28C13.17 21.43 14.54 22 15.87 22H22V20.5C22 17.47 19.19 14.11 16.61 13.5M7.72 14.43C6.65 14.43 5.8 13.38 5.8 12.06C5.8 10.75 6.65 9.69 7.72 9.69S9.65 10.75 9.65 12.06C9.65 13.38 8.8 14.43 7.72 14.43M16.28 14.43C15.2 14.43 14.36 13.38 14.36 12.06C14.36 10.75 15.2 9.69 16.28 9.69C17.36 9.69 18.2 10.75 18.2 12.06C18.2 13.38 17.36 14.43 16.28 14.43M22 13V11H16V13H22M7.93 3.97C7.55 3.67 7.09 3.5 6.58 3.5C5.68 3.5 4.84 4.17 4.84 5.29V5.87H3V3.87H3.03L3 3.76C3 2.63 4.21 1.69 5.76 1.69C6.23 1.7 6.68 1.85 7.09 2.04C7.5 2.24 7.84 2.55 8.09 2.92C8.35 2.56 8.69 2.26 9.1 2.06C9.5 1.86 9.96 1.72 10.43 1.72C11.9 1.72 12.91 2.53 13.08 3.78L13.12 3.87H13.11V5.87H11.36V5.29C11.36 4.17 10.5 3.5 9.6 3.5C9.09 3.5 8.63 3.67 8.26 3.97C7.88 4.27 7.61 4.71 7.61 5.23V9.55C7.03 9.05 6.32 8.69 5.54 8.44C5.26 8.44 5 8.5 4.75 8.57C5.19 8.21 5.5 7.73 5.66 7.19C5.82 6.66 5.82 6.08 5.67 5.55C5.5 5 5.18 4.5 4.72 4.13C5.21 4.43 5.65 4.82 5.99 5.29C6.33 5.77 6.54 6.33 6.61 6.93C6.66 7.46 6.57 8 6.38 8.5C8.36 8.93 9.97 10.27 11.08 12.14C11.25 11.77 11.45 11.4 11.67 11.07C11.32 10.31 10.88 9.61 10.37 8.97C10.68 9.08 11 9.12 11.34 9.07C11.67 9.03 11.99 8.9 12.26 8.69C11.86 9.75 11.63 10.87 11.59 12C12.4 11.85 13.22 11.82 14.05 11.91C13.91 10.38 13.56 8.9 13.04 7.47C12.73 7.79 12.29 8 11.8 8.04C11.3 8.09 10.82 7.97 10.41 7.7C11.46 7.25 12.43 6.67 13.32 5.96C13.23 6.44 13.29 6.94 13.5 7.37C13.71 7.81 14.05 8.16 14.47 8.37C14.88 8.58 15.36 8.65 15.81 8.55C16.27 8.46 16.67 8.21 16.97 7.86C17.28 7.51 17.47 7.07 17.5 6.6C17.54 6.13 17.41 5.66 17.14 5.27C16.88 4.88 16.5 4.59 16.06 4.44C15.61 4.29 15.13 4.29 14.69 4.44C15.17 4.05 15.78 3.84 16.41 3.87H21C21.55 3.87 22 4.32 22 4.87V12.12C20.42 10.5 18.26 9.34 15.87 9C16.17 8.5 16.31 7.93 16.28 7.36C16.24 6.78 16.03 6.22 15.67 5.77C15.32 5.31 14.82 4.97 14.26 4.78C14.61 5.3 14.78 5.91 14.76 6.55C14.73 7.13 14.55 7.69 14.24 8.17C14.55 8.29 14.89 8.33 15.22 8.28C15.56 8.22 15.87 8.07 16.13 7.84C16.14 8.5 16.03 9.15 15.83 9.77C17.56 10.37 19 11.87 19.83 13.87H22V14.59C20.34 13.35 18.11 12.75 16.28 14.43" />
                        </svg>
                        <span className="text-sm font-medium block mt-1">Athena (requêtes SQL sur S3)</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-700">Points forts</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Optimisés pour les requêtes analytiques</li>
                        <li>Stockage en colonnes pour les performances</li>
                        <li>Extensibilité et élasticité cloud</li>
                        <li>Séparation stockage/calcul</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="etl" className="pt-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg border border-orange-100">
              <h3 className="font-bold text-lg mb-4">ETL (Extract, Transform, Load) et Pipelines de données</h3>
              <p className="mb-4">
                Les outils ETL permettent d'automatiser l'extraction, la transformation et le chargement des données
                entre différentes sources et destinations, assurant la qualité et la cohérence des données.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/90 p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Outils ETL traditionnels
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Apache NiFi</Badge>
                      <span className="text-sm">Gestion de flux de données automatisée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Talend</Badge>
                      <span className="text-sm">Intégration de données d'entreprise</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Informatica</Badge>
                      <span className="text-sm">Solution ETL complète et mature</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/90 p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Outils modernes ELT/Data Engineering
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Airflow</Badge>
                      <span className="text-sm">Orchestration de workflows programmatique</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">dbt</Badge>
                      <span className="text-sm">Transformation dans l'entrepôt de données</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Prefect</Badge>
                      <span className="text-sm">Orchestration de flux de données modernes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Apache Airflow</CardTitle>
                  <CardDescription>Plateforme d'orchestration de workflows programmable en Python</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Airflow est devenu un standard dans l'industrie pour l'orchestration de pipelines de données complexes 
                      grâce à sa flexibilité et sa robustesse. Il permet de définir des workflows sous forme de graphes 
                      acycliques dirigés (DAGs) en Python.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-700 mb-2">Exemple d'un DAG Airflow simple</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                        <pre>{`from datetime import datetime, timedelta
from airflow import DAG
# Airflow 2.x ; en Airflow 3, ces opérateurs viennent du paquet apache-airflow-providers-standard
# (airflow.providers.standard.operators.python et .bash)
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator

# Définition des arguments par défaut
default_args = {
    'owner': 'data_engineer',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email_on_failure': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Création du DAG
dag = DAG(
    'traitement_donnees_quotidien',
    default_args=default_args,
    description='Pipeline ETL quotidien',
    schedule=timedelta(days=1),  # remplace schedule_interval (retiré en Airflow 3)
    catchup=False,
)

# Définition des tâches
extraction = BashOperator(
    task_id='extraction_donnees',
    bash_command='python /scripts/extract_data.py',
    dag=dag,
)

def transformer_donnees(**kwargs):
    # Code de transformation des données
    print("Transformation des données en cours...")
    
transformation = PythonOperator(
    task_id='transformation_donnees',
    python_callable=transformer_donnees,
    dag=dag,
)

chargement = BashOperator(
    task_id='chargement_donnees',
    bash_command='python /scripts/load_data.py',
    dag=dag,
)

# Définition des dépendances
extraction >> transformation >> chargement`}</pre>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Idéal pour les pipelines complexes avec de nombreuses dépendances</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>dbt (data build tool)</CardTitle>
                  <CardDescription>Transformations SQL dans les entrepôts de données</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-sm">
                      dbt transforme l'approche de transformation des données en permettant aux analystes 
                      d'écrire des transformations en SQL directement dans l'entrepôt de données, 
                      suivant la méthodologie ELT (Extract, Load, Transform).
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="bg-blue-50">Modularité</Badge>
                      <Badge variant="outline" className="bg-blue-50">Tests</Badge>
                      <Badge variant="outline" className="bg-blue-50">Documentation</Badge>
                      <Badge variant="outline" className="bg-blue-50">Gestion des dépendances</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Parfait pour les équipes analytiques travaillant avec des entrepôts SQL</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-2">Évolution des approches de pipelines de données</h3>
              <p className="text-xs text-gray-600 mb-4">Repères simplifiés par l'auteur, pas une classification standard : ces approches coexistent et les outils cités se recoupent.</p>
              <ResponsiveTable stickyHeader={true}>
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Étape</th>
                      <th scope="col" className="px-6 py-3">Approche</th>
                      <th scope="col" className="px-6 py-3">Outils</th>
                      <th scope="col" className="px-6 py-3">Caractéristiques</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">Étape 1</td>
                      <td className="px-6 py-4">ETL traditionnel</td>
                      <td className="px-6 py-4">Informatica, Talend, SSIS</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-5">
                          <li>Interface graphique</li>
                          <li>Traitement par lots</li>
                          <li>Monolithique</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-gray-50 border-b">
                      <td className="px-6 py-4 font-medium">Étape 2</td>
                      <td className="px-6 py-4">Big Data ETL</td>
                      <td className="px-6 py-4">Hadoop, Spark, Hive</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-5">
                          <li>Traitement distribué</li>
                          <li>Grandes quantités de données</li>
                          <li>Scripts ou code</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">Étape 3</td>
                      <td className="px-6 py-4">ELT & Data Engineering</td>
                      <td className="px-6 py-4">Airflow, dbt, Prefect</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-5">
                          <li>Infrastructure as code</li>
                          <li>Orchestration</li>
                          <li>Tests et documentation</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-gray-50 border-b">
                      <td className="px-6 py-4 font-medium">Étape 4</td>
                      <td className="px-6 py-4">Data Mesh & Temps réel</td>
                      <td className="px-6 py-4">Kafka, Flink, Dagster</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-5">
                          <li>Streaming temps réel</li>
                          <li>Décentralisation</li>
                          <li>Auto-service</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ResponsiveTable>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="big-data" className="pt-6">
          <div className="space-y-6">
            <p className="text-lg mb-6">
              Les outils de Big Data permettent de traiter des volumes massifs de données qui dépassent
              les capacités des systèmes traditionnels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-yellow-50 rounded-t-lg border-b">
                  <CardTitle className="flex items-center">
                    <img src={asset("img/logos/apache.svg")} alt="" className="h-6 w-6 mr-2" />
                    Apache Hadoop
                  </CardTitle>
                  <CardDescription>
                    Écosystème pour le traitement distribué de grands ensembles de données
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Hadoop fournit un framework distribué pour stocker et traiter de grandes quantités de données
                      sur des clusters de matériel standard, avec son système de fichiers HDFS et le modèle
                      de programmation MapReduce.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-yellow-50 rounded text-center">
                        <h5 className="font-medium text-yellow-700 text-sm">HDFS</h5>
                        <p className="text-xs mt-1">Système de fichiers distribué</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded text-center">
                        <h5 className="font-medium text-yellow-700 text-sm">MapReduce</h5>
                        <p className="text-xs mt-1">Modèle de programmation parallèle</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded text-center">
                        <h5 className="font-medium text-yellow-700 text-sm">YARN</h5>
                        <p className="text-xs mt-1">Gestion des ressources</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded text-center">
                        <h5 className="font-medium text-yellow-700 text-sm">Hive</h5>
                        <p className="text-xs mt-1">Requêtes SQL sur Hadoop</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-orange-50 rounded-t-lg border-b">
                  <CardTitle className="flex items-center">
                    <img src={asset("img/logos/apachespark.svg")} alt="" className="h-6 w-6 mr-2" />
                    Apache Spark
                  </CardTitle>
                  <CardDescription>
                    Moteur de traitement analytique unifié rapide
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Spark est un moteur de traitement rapide avec des APIs en Scala, Java, Python et R,
                      avec des gains pouvant atteindre 20 fois par rapport à Hadoop MapReduce pour des applications itératives. Le gain réel dépend beaucoup du traitement.
                    </p>
                    <SourceNote
                      consulted="5 octobre 2026"
                      sources={[{ label: "Zaharia et al., « Resilient Distributed Datasets », NSDI 2012", href: "https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf" }]}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-orange-50 rounded text-center">
                        <h5 className="font-medium text-orange-700 text-sm">Spark SQL</h5>
                        <p className="text-xs mt-1">Requêtes sur données structurées</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded text-center">
                        <h5 className="font-medium text-orange-700 text-sm">Structured Streaming</h5>
                        <p className="text-xs mt-1">Flux traités avec l'API DataFrame</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded text-center">
                        <h5 className="font-medium text-orange-700 text-sm">MLlib</h5>
                        <p className="text-xs mt-1">Bibliothèque de machine learning</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded text-center">
                        <h5 className="font-medium text-orange-700 text-sm">GraphX</h5>
                        <p className="text-xs mt-1">Traitement de graphes</p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mt-4">
                      <h4 className="font-medium text-orange-700 mb-2">Exemple de code PySpark</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                        <pre>{`from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Initialiser une session Spark
spark = (SparkSession.builder
    .appName("Analyse de données")
    .getOrCreate())

# Charger les données
df = spark.read.csv("donnees.csv", header=True, inferSchema=True)

# Transformer les données
resultats = (df.filter(col("montant") > 1000)
    .groupBy("categorie")
    .agg({"montant": "sum", "id": "count"})
    .withColumnRenamed("sum(montant)", "montant_total")
    .withColumnRenamed("count(id)", "nombre_transactions"))

# Afficher les résultats
resultats.show()

# Sauvegarder les résultats
resultats.write.parquet("resultats.parquet")`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-blue-50 rounded-t-lg border-b">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Apache Kafka
                  </CardTitle>
                  <CardDescription>
                    Plateforme de streaming distribuée pour le traitement en temps réel
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Kafka est une plateforme de streaming événementiel qui permet de publier, stocker et traiter
                      des flux d'enregistrements en temps réel, idéale pour construire des pipelines de données
                      en temps réel et des applications de streaming.
                    </p>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-700">Architecture Kafka</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>Producteurs :</strong> Publient des messages dans des topics</li>
                        <li><strong>Topics :</strong> Catégories ou flux de messages</li>
                        <li><strong>Brokers :</strong> Serveurs qui constituent le cluster Kafka</li>
                        <li><strong>Consommateurs :</strong> Lisent les messages des topics</li>
                        <li><strong>Kafka Streams :</strong> API de traitement de flux</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="bg-green-50 rounded-t-lg border-b">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Apache Flink
                  </CardTitle>
                  <CardDescription>
                    Framework de traitement de flux et de lots avec garanties exactes
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Flink est un cadre de traitement de données distribué qui excelle dans le traitement
                      de flux avec une sémantique exacte, des fenêtres flexibles et des garanties de cohérence.
                    </p>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-700">Avantages de Flink</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Traitement d'événements avec horodatage précis</li>
                        <li>Garanties de traitement exactement une fois</li>
                        <li>Gestion avancée de l'état et du temps d'événement</li>
                        <li>Haute disponibilité et reprise après panne</li>
                        <li>Performances élevées et faible latence</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100 my-8">
              <h3 className="text-xl font-bold mb-4 text-blue-800">Évolution des architectures Big Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-blue-700 mb-2">Lambda</h4>
                  <p className="text-sm">
                    Architecture combinant traitement par lots (batch) et en temps réel (speed) dans des couches séparées
                    avec une couche de service pour les requêtes.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-blue-700 mb-2">Kappa</h4>
                  <p className="text-sm">
                    Simplifie Lambda en traitant toutes les données comme des flux, éliminant la couche batch pour
                    réduire la complexité.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-blue-700 mb-2">Data Lake</h4>
                  <p className="text-sm">
                    Stockage centralisé de données brutes à grande échelle, permettant d'accéder et d'analyser 
                    des données structurées et non structurées.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-blue-700 mb-2">Data Mesh</h4>
                  <p className="text-sm">
                    Approche décentralisée où les données sont traitées comme des produits gérés par des équipes 
                    distribuées avec des standards communs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 p-6 rounded-lg mt-10">
        <h3 className="text-xl font-bold mb-4">Choisir les bons outils de traitement de données</h3>
        <div className="space-y-4">
          <p>
            La sélection des outils dépend de nombreux facteurs tels que le volume de données, 
            les besoins de performance, les compétences de l'équipe et les cas d'utilisation spécifiques.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-blue-700 mb-2">Pour l'analyse exploratoire</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Python avec pandas pour les données moyennes</li>
                <li>R pour l'analyse statistique approfondie</li>
                <li>Dask pour les ensembles de données plus volumineux</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-blue-700 mb-2">Pour le traitement en production</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Airflow pour l'orchestration de workflows</li>
                <li>Spark pour le traitement distribué</li>
                <li>Kafka pour les flux de données en temps réel</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-blue-700 mb-2">Pour l'analyse décisionnelle</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Snowflake/BigQuery pour les entrepôts de données</li>
                <li>dbt pour les transformations SQL</li>
                <li>Tableau/Power BI pour la visualisation</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
            <h4 className="font-medium text-blue-700 mb-2">Conseils pour la sélection d'outils</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Privilégiez les outils qui s'intègrent bien ensemble</li>
              <li>Tenez compte de la capacité à monter en charge</li>
              <li>Évaluez le coût total (licences, infrastructure, maintenance)</li>
              <li>Considérez l'écosystème et le support communautaire</li>
              <li>Optez pour la simplicité lorsque possible, la complexité augmente les coûts de maintenance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProcessingTools;
