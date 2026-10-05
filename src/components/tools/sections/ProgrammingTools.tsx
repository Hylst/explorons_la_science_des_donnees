import { asset } from "@/lib/asset";
import { SourceNote } from "@/components/ui/source-note";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  BookOpen, 
  ExternalLink,
  Code,
  Star,
  Bookmark,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const ProgrammingTools = () => {
  // Stack Overflow Developer Survey, question « langages utilisés », part de TOUS les répondants (pas seulement des
  // data scientists). Relevé le 1er octobre 2026 sur survey.stackoverflow.co. Julia n'apparaît pas dans la liste de 2025.
  const languageUsageData = [
    { year: '2021', Python: 48.24, SQL: 47.08, R: 5.07, Julia: 1.29 },
    { year: '2022', Python: 48.07, SQL: 49.43, R: 4.66, Julia: 1.53 },
    { year: '2023', Python: 49.28, SQL: 48.66, R: 4.23, Julia: 1.15 },
    { year: '2024', Python: 51, SQL: 51, R: 4.3, Julia: 1.1 },
    { year: '2025', Python: 57.9, SQL: 58.6, R: 4.9, Julia: null },
  ];

  // Nombre de paquets dans le registre officiel de chaque langage, relevé le 1er octobre 2026 (détails dans docs/SOURCES.md).
  // Les unités diffèrent : projets (PyPI), paquets (CRAN, Julia, npm), projets indexés (Scaladex).
  const packageEcosystemData = [
    { name: 'JavaScript (npm)', packages: 4443317 },
    { name: 'Python (PyPI)', packages: 905050 },
    { name: 'R (CRAN)', packages: 25284 },
    { name: 'Julia (General)', packages: 14438 },
    { name: 'Scala (Scaladex)', packages: 9450 },
  ];
  const formatCount = (value: number) =>
    value >= 1000000 ? `${(value / 1000000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M` : `${(value / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} k`;

  return (
    <div id="programming-tools" className="space-y-10">
      <h2 className="text-2xl font-bold">Langages de programmation pour la Data Science</h2>
      <p className="text-lg">
        Les langages de programmation sont les fondations de tout projet de Data Science. Chacun possède ses forces 
        et ses domaines d'application privilégiés.
      </p>
      
      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Usage des langages, de 2021 à 2025</CardTitle>
            <CardDescription>Part des répondants de l'enquête Stack Overflow qui déclarent utiliser le langage (tous les développeurs interrogés, pas seulement les data scientists)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={languageUsageData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Année de l\'enquête', position: 'insideBottom', offset: -15 }} />
                  <YAxis domain={[0, 70]} label={{ value: 'Répondants (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString('fr-FR')} %`, name]} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="Python" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="R" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="SQL" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Julia" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <SourceNote
                className="text-center mb-4 pb-4"
                consulted="1er octobre 2026"
                sources={[
                  { label: "Stack Overflow Developer Survey 2021", href: "https://survey.stackoverflow.co/2021/" },
                  { label: "2022", href: "https://survey.stackoverflow.co/2022/" },
                  { label: "2023", href: "https://survey.stackoverflow.co/2023/" },
                  { label: "2024", href: "https://survey.stackoverflow.co/2024/technology" },
                  { label: "2025", href: "https://survey.stackoverflow.co/2025/technology" },
                ]}
              />
              <p className="text-xs text-muted-foreground text-center">Julia ne figure pas dans la liste de 2025. Parmi les data scientists, R est nettement plus utilisé que dans cet échantillon généraliste (27 % des praticiens de l'enquête Anaconda 2021 l'utilisent souvent ou toujours).</p>
              <SourceNote
                className="text-center"
                consulted="1er octobre 2026"
                sources={[{ label: "Anaconda, State of Data Science 2021", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-2021-SODS-Report-Final.pdf" }]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Taille des registres de paquets</CardTitle>
            <CardDescription>Nombre de paquets publiés dans le registre officiel de chaque langage, au 1er octobre 2026 (échelle logarithmique)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageEcosystemData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis scale="log" domain={[1000, 10000000]} allowDataOverflow tickFormatter={formatCount} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Paquets']} />
                  <Bar dataKey="packages" name="Paquets" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <SourceNote
                className="text-center mb-4 pb-4"
                consulted="1er octobre 2026"
                sources={[
                  { label: "PyPI", href: "https://pypi.org/" },
                  { label: "CRAN", href: "https://cran.r-project.org/web/packages/" },
                  { label: "registre General de Julia", href: "https://github.com/JuliaRegistries/General" },
                  { label: "npm (base de réplication)", href: "https://replicate.npmjs.com/" },
                  { label: "Scaladex", href: "https://index.scala-lang.org/" },
                ]}
              />
              <p className="text-xs text-muted-foreground text-center">Les unités diffèrent d'un registre à l'autre (projets, paquets, projets indexés) : ces chiffres comparent des volumes, pas la qualité des paquets.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Python */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-3 md:col-span-2 hover:shadow-md transition-all">
          <CardHeader className="bg-blue-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center text-blue-800">
              <img src={asset("img/logos/python.svg")} alt="" className="h-6 w-6 mr-2" />
              Python
            </CardTitle>
            <CardDescription>
              Le langage le plus utilisé par les praticiens de la data dans l'enquête Anaconda 2021 (63 % l'emploient souvent ou toujours)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50">pandas</Badge>
                <Badge variant="outline" className="bg-blue-50">NumPy</Badge>
                <Badge variant="outline" className="bg-blue-50">scikit-learn</Badge>
                <Badge variant="outline" className="bg-blue-50">TensorFlow</Badge>
                <Badge variant="outline" className="bg-blue-50">PyTorch</Badge>
                <Badge variant="outline" className="bg-blue-50">Matplotlib</Badge>
              </div>
              
              <p>
                Python est devenu le langage de choix pour la Data Science grâce à sa simplicité, sa lisibilité
                et son vaste écosystème de bibliothèques spécialisées.
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <h4 className="font-medium mb-2">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Syntaxe simple et intuitive, idéale pour les débutants</li>
                  <li>Écosystème riche avec des packages spécialisés (pandas, NumPy, scikit-learn)</li>
                  <li>Excellente intégration avec les frameworks de deep learning</li>
                  <li>Large communauté et documentation abondante</li>
                  <li>Notebooks Jupyter pour l'analyse interactive</li>
                </ul>
              </div>
              
              <Tabs defaultValue="analyse" className="mt-6">
                <TabsList className="grid h-auto grid-cols-1 sm:grid-cols-3 mb-4">
                  <TabsTrigger value="analyse" className="whitespace-normal">Analyse de données</TabsTrigger>
                  <TabsTrigger value="ml" className="whitespace-normal">Machine Learning</TabsTrigger>
                  <TabsTrigger value="viz" className="whitespace-normal">Visualisation</TabsTrigger>
                </TabsList>
                <TabsContent value="analyse" className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Exemple de code Python pour l'analyse de données</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`import pandas as pd
import numpy as np

# Charger les données
df = pd.read_csv('data.csv')

# Afficher les premières lignes
print(df.head())

# Statistiques descriptives
print(df.describe())

# Vérifier les valeurs manquantes
print(df.isna().sum())

# Opérations de filtrage
filtered_df = df[df['age'] > 30]

# Groupement et agrégation
grouped = df.groupby('category').agg({
    'value': ['mean', 'sum', 'count'],
    'age': 'mean'
})`}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="ml" className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Exemple de code Python pour le Machine Learning</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Préparation des données
X = df.drop('target', axis=1)
y = df['target']

# Division train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entraînement du modèle
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Évaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))`}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="viz" className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Exemple de code Python pour la visualisation</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`import matplotlib.pyplot as plt
import seaborn as sns

# Configuration de base
plt.figure(figsize=(12, 6))
sns.set_theme(style="whitegrid")

# Visualisation avec Seaborn
sns.histplot(df['age'], kde=True)
plt.title('Distribution des âges')
plt.xlabel('Âge')
plt.show()

# Graphique avancé
fig, axes = plt.subplots(1, 2, figsize=(15, 6))

# Premier subplot: boxplot
sns.boxplot(x='category', y='value', data=df, ax=axes[0])
axes[0].set_title('Valeurs par catégorie')

# Second subplot: heatmap de corrélation
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap='coolwarm', ax=axes[1])
axes[1].set_title('Matrice de corrélation')

plt.tight_layout()
plt.show()`}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="bg-blue-50/30 border-t flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="mr-2 whitespace-normal h-auto py-2 text-left">
              <a href="https://www.python.org/doc/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                Documentation officielle
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="whitespace-normal h-auto py-2 text-left">
              <a href="https://www.kaggle.com/learn/python" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Cours en ligne
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:row-span-2 hover:shadow-md transition-all">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle>Ressources Python</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Documentation
                </h4>
                <div className="space-y-2">
                  <a href="https://www.python.org/doc/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Documentation officielle Python</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  <a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Documentation pandas</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  <a href="https://numpy.org/doc/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Documentation NumPy</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Code className="h-4 w-4 text-blue-600" />
                  Tutoriels et guides
                </h4>
                <div className="space-y-2">
                  <a href="https://matplotlib.org/stable/tutorials/index" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Tutoriels Matplotlib</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  <a href="https://scikit-learn.org/stable/getting_started.html" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Prise en main de scikit-learn</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  <a href="https://realpython.com/tutorials/data-science/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Real Python - Tutoriels Data Science</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Bookmark className="h-4 w-4 text-blue-600" />
                  Livres recommandés
                </h4>
                <div className="space-y-2">
                  <a href="https://wesmckinney.com/book/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Python for Data Analysis - Wes McKinney</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  <a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9798341607972/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-md hover:bg-blue-50 transition-colors">
                    <span>Hands-On Machine Learning with Scikit-Learn and PyTorch</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild variant="default" size="sm" className="w-full whitespace-normal h-auto py-2">
                  <a href="https://www.kaggle.com/learn/python" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4" />
                    Cours interactif gratuit sur Kaggle
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Autres langages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-green-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center text-green-800">
              <img src={asset("img/logos/r.svg")} alt="" className="h-6 w-6 mr-2" />
              R
            </CardTitle>
            <CardDescription>
              Langage spécialisé pour l'analyse statistique
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-green-50">ggplot2</Badge>
                <Badge variant="outline" className="bg-green-50">dplyr</Badge>
                <Badge variant="outline" className="bg-green-50">tidyr</Badge>
                <Badge variant="outline" className="bg-green-50">tidymodels</Badge>
              </div>
              
              <p className="text-sm">
                R excelle dans les analyses statistiques avancées et la création de visualisations 
                de qualité publication. Idéal pour le travail dans les domaines de la recherche,
                de la biostatistique et de l'économétrie.
              </p>
              
              <div className="p-3 bg-gray-50 rounded-lg mt-2">
                <h4 className="font-medium mb-2 text-sm">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Excellente capacité pour l'analyse statistique</li>
                  <li>Visualisations de haute qualité avec ggplot2</li>
                  <li>Forte adoption dans la recherche et le milieu académique</li>
                  <li>Nombreux packages pour des analyses spécialisées</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="whitespace-normal h-auto py-2 text-left">
              <a href="https://r4ds.hadley.nz/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                R for Data Science (livre gratuit)
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-orange-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center text-orange-800">
              <img src={asset("img/logos/postgresql.svg")} alt="" className="h-6 w-6 mr-2" />
              SQL
            </CardTitle>
            <CardDescription>
              Langage courant pour la manipulation des données
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-orange-50">PostgreSQL</Badge>
                <Badge variant="outline" className="bg-orange-50">MySQL</Badge>
                <Badge variant="outline" className="bg-orange-50">SQLite</Badge>
                <Badge variant="outline" className="bg-orange-50">BigQuery</Badge>
              </div>
              
              <p className="text-sm">
                SQL reste essentiel pour tout data scientist, permettant d'interroger et de manipuler
                efficacement des données stockées dans des bases de données relationnelles.
              </p>
              
              <div className="p-3 bg-gray-50 rounded-lg mt-2">
                <h4 className="font-medium mb-2 text-sm">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Standard pour les requêtes de bases de données</li>
                  <li>Efficace pour manipuler de grands volumes de données</li>
                  <li>Intégration avec pratiquement tous les outils de data science</li>
                  <li>Optimisé pour les agrégations et jointures complexes</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="whitespace-normal h-auto py-2 text-left">
              <a href="https://www.thoughtspot.com/sql-tutorial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                Tutoriel SQL (ThoughtSpot, ex-Mode)
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-purple-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center text-purple-800">
              <img src={asset("img/logos/julia.svg")} alt="" className="h-6 w-6 mr-2" />
              Julia
            </CardTitle>
            <CardDescription>
              Langage moderne optimisé pour le calcul scientifique
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-purple-50">Flux</Badge>
                <Badge variant="outline" className="bg-purple-50">DataFrames.jl</Badge>
                <Badge variant="outline" className="bg-purple-50">Plots.jl</Badge>
              </div>
              
              <p className="text-sm">
                Julia vise la simplicité d'un langage de haut niveau avec des performances souvent proches du C sur les calculs numériques (benchmarks sur julialang.org). Il est employé pour le calcul scientifique et la modélisation complexe ; son usage reste minoritaire dans les enquêtes citées plus haut.
              </p>
              
              <div className="p-3 bg-gray-50 rounded-lg mt-2">
                <h4 className="font-medium mb-2 text-sm">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Performances souvent proches du C/C++ sur les calculs numériques (benchmarks du projet)</li>
                  <li>Syntaxe intuitive proche de Python et MATLAB</li>
                  <li>Parallélisation et calcul distribué intégrés</li>
                  <li>Multiple dispatch pour une programmation flexible</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="whitespace-normal h-auto py-2 text-left">
              <a href="https://julialang.org/learning/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                Ressources d'apprentissage Julia
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-blue-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center text-blue-800">
              <img src={asset("img/logos/scala.svg")} alt="" className="h-6 w-6 mr-2" />
              Scala
            </CardTitle>
            <CardDescription>
              Langage pour le traitement de données à grande échelle
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-blue-50">Apache Spark</Badge>
                <Badge variant="outline" className="bg-blue-50">Spark MLlib</Badge>
                <Badge variant="outline" className="bg-blue-50">Vegas</Badge>
              </div>
              
              <p className="text-sm">
                Scala est souvent utilisé avec Apache Spark pour l'analyse de données massives et 
                le traitement distribué, apportant les avantages de la programmation fonctionnelle.
              </p>
              
              <div className="p-3 bg-gray-50 rounded-lg mt-2">
                <h4 className="font-medium mb-2 text-sm">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Parfaitement intégré avec Apache Spark</li>
                  <li>Combine programmation fonctionnelle et orientée objet</li>
                  <li>Performances élevées sur la JVM</li>
                  <li>Idéal pour les applications big data</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="whitespace-normal h-auto py-2 text-left">
              <a href="https://docs.scala-lang.org/learn.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                Documentation Scala
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100 my-8">
        <h3 className="text-xl font-bold mb-4">Environnements de développement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-800 mb-2">Jupyter Notebooks</h4>
            <p className="text-sm">Environnement interactif idéal pour l'exploration de données et la visualisation.</p>
            <div className="mt-3">
              <a 
                href="https://jupyter.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Site officiel
              </a>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-800 mb-2">RStudio</h4>
            <p className="text-sm">IDE complet pour le langage R, avec de nombreuses fonctionnalités pour l'analyse statistique.</p>
            <div className="mt-3">
              <a 
                href="https://posit.co/products/open-source/rstudio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Site officiel
              </a>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-800 mb-2">VS Code</h4>
            <p className="text-sm">Éditeur polyvalent avec d'excellentes extensions pour Python, R, Julia et autres langages.</p>
            <div className="mt-3">
              <a 
                href="https://code.visualstudio.com/docs/datascience/overview" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Data Science avec VS Code
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Comment choisir son langage ?</h3>
        
        <details className="group border rounded-lg p-4 mb-4">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-blue-600">Critères de sélection</span>
            <span className="transition group-open:rotate-180">
              <ChevronRight size={16} />
            </span>
          </summary>
          <div className="mt-3 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span><strong>Type de projet :</strong> Python pour la polyvalence, R pour les statistiques, SQL pour le travail avec des bases de données</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span><strong>Volume de données :</strong> Scala/Spark pour les données massives, Python/R pour les volumes moyens</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span><strong>Performances requises :</strong> Julia ou C++ pour les calculs intensifs, Python pour le développement rapide</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                <span><strong>Écosystème :</strong> Considérer les bibliothèques disponibles pour votre domaine spécifique</span>
              </li>
            </ul>
          </div>
        </details>
        
        <details className="group border rounded-lg p-4 mb-4">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-blue-600">Guide débutant : Par où commencer ?</span>
            <span className="transition group-open:rotate-180">
              <ChevronRight size={16} />
            </span>
          </summary>
          <div className="mt-3 text-sm space-y-4">
            <p>
              Pour les débutants en data science, nous recommandons fortement de commencer par Python 
              pour plusieurs raisons :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Syntaxe simple et intuitive facile à apprendre</li>
              <li>Vaste écosystème de bibliothèques pour tous les aspects de la data science</li>
              <li>Grande communauté et nombreuses ressources d'apprentissage</li>
              <li>Applicable à pratiquement tous les domaines de la data science</li>
            </ul>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Commencez par les bases de Python, puis explorez pandas pour la manipulation de données 
                et matplotlib/seaborn pour la visualisation. Une fois à l'aise avec ces fondamentaux, vous pourrez
                progresser vers scikit-learn pour le machine learning.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild variant="default" size="sm" className="whitespace-normal h-auto py-2">
                <a href="https://www.kaggle.com/learn/python" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  Commencer avec Python pour la Data Science
                  <ArrowRight size={14} />
                </a>
              </Button>
            </div>
          </div>
        </details>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">
            Le meilleur langage est celui qui permet de résoudre efficacement le problème posé : 
            la polyvalence d'un data scientist tient à sa capacité à choisir le bon outil au bon moment.
          </p>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg mt-8">
        <h3 className="text-lg font-medium mb-3 text-blue-800">Ressources d'apprentissage supplémentaires</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium mb-2">Cours en ligne</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.coursera.org/specializations/data-science-python" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-1">Spécialisation Data Science avec Python (Université du Michigan)</span>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.kaggle.com/learn/intro-to-sql" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-1">Kaggle - Introduction à SQL (gratuit)</span>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Livres de référence</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wesmckinney.com/book/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-1">Python for Data Analysis - Wes McKinney</span>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://r4ds.hadley.nz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-1">R for Data Science - Hadley Wickham (gratuit)</span>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.oreilly.com/library/view/sql-for-data/9781492088776/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-1">SQL for Data Analysis - Cathy Tanimura</span>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingTools;
