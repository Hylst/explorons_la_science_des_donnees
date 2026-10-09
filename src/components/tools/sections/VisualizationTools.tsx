import { asset } from "@/lib/asset";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import { Check, ExternalLink } from "lucide-react";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { datavizDefinitions } from "@/components/fundamentals/definitions/dataviz-definitions";

const VisualizationTools = () => {
  // Données pour les exemples de visualisation
  const lineChartData = [
    { month: 'janv.', temperature: 4, rainfall: 65 },
    { month: 'févr.', temperature: 6, rainfall: 59 },
    { month: 'mars', temperature: 10, rainfall: 80 },
    { month: 'avr.', temperature: 14, rainfall: 78 },
    { month: 'mai', temperature: 18, rainfall: 95 },
    { month: 'juin', temperature: 22, rainfall: 58 },
    { month: 'juil.', temperature: 25, rainfall: 40 },
    { month: 'août', temperature: 24, rainfall: 52 },
    { month: 'sept.', temperature: 20, rainfall: 63 },
    { month: 'oct.', temperature: 16, rainfall: 75 },
    { month: 'nov.', temperature: 10, rainfall: 88 },
    { month: 'déc.', temperature: 6, rainfall: 67 }
  ];

  const barChartData = [
    { category: 'A', value: 42 },
    { category: 'B', value: 28 },
    { category: 'C', value: 36 },
    { category: 'D', value: 19 },
    { category: 'E', value: 45 }
  ];

  // Données fictives : le graphique illustre seulement le type « graphique circulaire »
  const pieChartData = [
    { name: 'Catégorie A', value: 48 },
    { name: 'Catégorie B', value: 23 },
    { name: 'Catégorie C', value: 18 },
    { name: 'Catégorie D', value: 7 },
    { name: 'Autres', value: 4 }
  ];

  const scatterData = [
    { x: 12, y: 23, z: 9 },
    { x: 22, y: 3, z: 15 },
    { x: 40, y: 30, z: 7 },
    { x: 29, y: 11, z: 22 },
    { x: 19, y: 27, z: 18 },
    { x: 7, y: 42, z: 8 },
    { x: 35, y: 14, z: 11 },
    { x: 45, y: 35, z: 16 },
    { x: 16, y: 19, z: 23 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div id="visualization-tools" className="space-y-10">
      <h2 className="text-2xl font-bold">Outils de visualisation de données</h2>
      <p className="text-lg mb-6">
        La visualisation est essentielle pour comprendre, analyser et communiquer efficacement les
        enseignements tirés des données. Ces outils permettent de transformer des données brutes en
        représentations visuelles lisibles.
      </p>

      {/* Exemples de visualisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Graphique linéaire</CardTitle>
            <CardDescription>Évolution de données au fil du temps</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72 mb-4">
              <DeferredResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    name="Température (°C)"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#82ca9d"
                    name="Précipitations (mm)"
                  />
                </LineChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mb-4">
                Graphique linéaire sur des données fictives : température et précipitations mensuelles
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Diagramme à barres</CardTitle>
            <CardDescription>Comparaison entre différentes catégories</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72 mb-4">
              <DeferredResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Valeur" />
                </BarChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mb-4">
                Diagramme à barres sur des données fictives, comparant des valeurs entre différentes catégories
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Graphique en secteurs</CardTitle>
            <CardDescription>Distribution en pourcentages</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72 mb-4">
              <DeferredResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} : ${(percent * 100).toFixed(0)} %`}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mb-4">
                Graphique circulaire sur des données fictives : cinq catégories dont les parts totalisent 100 %
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nuage de points</CardTitle>
            <CardDescription>Relations entre variables</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72 mb-4">
              <DeferredResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Variable X" />
                  <YAxis type="number" dataKey="y" name="Variable Y" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Données" data={scatterData} fill="#8884d8">
                    {scatterData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mb-4">
                Nuage de points sur des données fictives, illustrant la relation entre deux variables
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Section bibliothèques matplotlib, etc. */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Bibliothèques de visualisation pour développeurs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-blue-50 rounded-t-lg border-b">
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21.141 3.91A6.262 6.262 0 0 0 16.654 2c-1.621 0-3.252.635-4.488 1.91-.06.06-.11.125-.165.19-.055-.06-.105-.13-.165-.19A6.263 6.263 0 0 0 7.35 2c-1.621 0-3.252.635-4.488 1.91-2.481 2.545-2.481 6.67 0 9.21l8.935 8.79c.06.06.135.09.21.09.075 0 .15-.03.21-.09l8.935-8.79c2.467-2.54 2.467-6.665-.01-9.21Zm-1.78 7.35-7.37 7.245-7.369-7.245c-1.47-1.525-1.466-3.99.015-5.51A3.73 3.73 0 0 1 7.33 4.605c1.005 0 2.19.505 2.996 1.25.73.68 1.066 1.235 1.361 1.655.03.045.125.215.3.215s.27-.17.3-.215c.296-.42.631-.975 1.361-1.655.806-.75 1.991-1.25 2.997-1.25a3.74 3.74 0 0 1 2.696 1.145c1.486 1.525 1.491 3.99.02 5.514Z"/>
                </svg>
                Matplotlib
              </CardTitle>
              <CardDescription>
                Bibliothèque de visualisation de référence en Python
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50">Flexibilité</Badge>
                  <Badge variant="outline" className="bg-blue-50">Personnalisation</Badge>
                  <Badge variant="outline" className="bg-blue-50">Publication</Badge>
                  <Badge variant="outline" className="bg-blue-50">Très utilisé</Badge>
                </div>
                
                <p className="text-sm">
                  <GlossaryTerm definition={datavizDefinitions["matplotlib"]}>Matplotlib</GlossaryTerm> est la bibliothèque de visualisation fondamentale en Python, offrant un contrôle
                  précis sur tous les aspects des graphiques. Elle sert de base à de nombreuses autres
                  bibliothèques de visualisation.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <h4 className="font-medium text-blue-700 mb-2">Exemple de code Matplotlib</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                    <pre>{`import matplotlib.pyplot as plt
import numpy as np

# Créer des données
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Créer la figure et les axes
fig, ax = plt.subplots(figsize=(10, 6))

# Tracer le graphique
ax.plot(x, y, label='sin(x)', color='blue', linewidth=2)

# Ajouter une grille
ax.grid(True, linestyle='--', alpha=0.7)

# Ajouter des étiquettes et un titre
ax.set_xlabel('X', fontsize=12)
ax.set_ylabel('Y', fontsize=12)
ax.set_title('Fonction sinus', fontsize=14, fontweight='bold')

# Ajouter une légende
ax.legend(frameon=True)

# Ajuster la mise en page
plt.tight_layout()

# Enregistrer l'image
plt.savefig('sinus.png', dpi=300)

# Afficher le graphique
plt.show()`}</pre>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Adaptée aux graphiques personnalisés destinés à la publication</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-green-50 rounded-t-lg border-b">
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-700" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 17h10v-2H7v2m0-4h10v-2H7v2m0-4h10V7H7v2M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2" />
                </svg>
                Seaborn
              </CardTitle>
              <CardDescription>
                Interface de haut niveau pour créer des visualisations statistiques attrayantes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-green-50">Statistiques</Badge>
                  <Badge variant="outline" className="bg-green-50">Esthétique</Badge>
                  <Badge variant="outline" className="bg-green-50">Facilité</Badge>
                  <Badge variant="outline" className="bg-green-50">Intégration pandas</Badge>
                </div>
                
                <p className="text-sm">
                  <GlossaryTerm definition={datavizDefinitions["seaborn"]}>Seaborn</GlossaryTerm> est bâti sur Matplotlib et offre une interface de plus haut niveau pour créer
                  rapidement des visualisations statistiques avec moins de code.
                </p>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-4">
                  <h4 className="font-medium text-green-700 mb-2">Exemple de code Seaborn</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                    <pre>{`import seaborn as sns
import matplotlib.pyplot as plt

# Charger un jeu de données d'exemple (téléchargé au premier appel : connexion nécessaire)
tips = sns.load_dataset("tips")

# Définir le style
sns.set_theme(style="whitegrid")

# Créer un graphique
plt.figure(figsize=(10, 6))
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex", palette="pastel")

# Personnaliser le graphique
plt.title("Distribution des additions par jour et par sexe", fontsize=14)
plt.xlabel("Jour", fontsize=12)
plt.ylabel("Addition totale ($)", fontsize=12)

# Afficher le graphique
plt.tight_layout()
plt.show()`}</pre>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Adapté à l'exploration de données et aux visualisations statistiques</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-yellow-50 rounded-t-lg border-b">
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-700" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.95 8.6a6.554 6.554 0 0 1 6.55-6.55c3.596 0 6.55 2.819 6.55 6.45a6.554 6.554 0 0 1-6.55 6.55c-3.626 0-6.55-2.954-6.55-6.45Zm12 .167c0-3.019-2.382-5.5-5.5-5.5c-3.133 0-5.5 2.367-5.5 5.5c0 3.133 2.367 5.5 5.5 5.5c3.118 0 5.5-2.481 5.5-5.5Zm-3.823 2.943c.639-.643.639-1.688 0-2.331l-.858.857c.217.217.218.56 0 .778a.55.55 0 0 1-.778 0a.569.569 0 0 1 0-.778l-1.083 1.084a12.59 12.59 0 0 1-2.824-1.389c-.803-.56-1.584-1.27-2.342-2.025c-.732-.732-1.853-2.023-2.426-3.218c-.628-1.323-.957-2.756-.957-4.058c0-.348.014-.869.034-1.156H2a1 1 0 0 0-1 1v21a1 1 0 0 0 1 1h21a1 1 0 0 0 1-1v-8.989a6.067 6.067 0 0 1-3.08 2.226c-1.442.43-2.866.403-4.293.003l.445.445a.55.55 0 0 1 0 .778a.55.55 0 0 1-.778 0a.55.55 0 0 1 0-.778l2.058-2.057Z" />
                </svg>
                Plotly
              </CardTitle>
              <CardDescription>
                Bibliothèque pour créer des visualisations interactives et des dashboards
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-yellow-50">Interactivité</Badge>
                  <Badge variant="outline" className="bg-yellow-50">Web</Badge>
                  <Badge variant="outline" className="bg-yellow-50">Dashboards</Badge>
                  <Badge variant="outline" className="bg-yellow-50">3D</Badge>
                </div>
                
                <p className="text-sm">
                  Plotly permet de créer des visualisations interactives pour le web,
                  avec zoom, survol et animation. Il est disponible en Python,
                  R et JavaScript.
                </p>
                
                <div className="flex items-center gap-2 mt-4">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Adapté aux dashboards interactifs et aux visualisations web</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-purple-50 rounded-t-lg border-b">
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-700" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M1 1h22v22H1V1zm11 14c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm-7.5 3.5c0-1.1.9-2 2-2h1.1c.3-.6.9-1 1.6-1h5.6c.7 0 1.3.4 1.6 1h1.1c1.1 0 2 .9 2 2v.5h-15v-.5z" />
                </svg>
                ggplot2 (R)
              </CardTitle>
              <CardDescription>
                Système déclaratif pour créer des graphiques élégants en R
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-purple-50">Grammaire des graphiques</Badge>
                  <Badge variant="outline" className="bg-purple-50">Déclaratif</Badge>
                  <Badge variant="outline" className="bg-purple-50">Esthétique</Badge>
                  <Badge variant="outline" className="bg-purple-50">Cohérence</Badge>
                </div>
                
                <p className="text-sm">
                  ggplot2 implémente la « grammaire des graphiques », une approche cohérente et expressive
                  pour décrire et créer des visualisations complexes en R. C'est la bibliothèque de 
                  visualisation la plus répandue de l'écosystème R.
                </p>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4">
                  <h4 className="font-medium text-purple-700 mb-2">Exemple de code ggplot2</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                    <pre>{`library(ggplot2)
library(dplyr)

# Charger et préparer les données
data(diamonds)
diamond_sample <- diamonds %>%
  slice_sample(n = 1000)

# Créer le graphique
p <- ggplot(diamond_sample, aes(x = carat, y = price, color = cut)) +
  geom_point(alpha = 0.7) +
  geom_smooth(method = "lm", se = FALSE) +
  facet_wrap(~color) +
  scale_color_brewer(palette = "Set1") +
  labs(
    title = "Relation entre poids et prix des diamants",
    subtitle = "Par qualité de taille et couleur",
    x = "Poids (carats)",
    y = "Prix (USD)",
    color = "Qualité de taille"
  ) +
  theme_minimal() +
  theme(
    plot.title = element_text(face = "bold"),
    legend.position = "bottom"
  )

# Afficher le graphique
print(p)

# Sauvegarder le graphique
ggsave("diamonds_plot.png", p, width = 10, height = 8, dpi = 300)`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Altair</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Bibliothèque Python basée sur Vega-Lite qui utilise une approche déclarative pour créer des 
                visualisations interactives avec une API concise.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs">Déclaratif</Badge>
                <Badge variant="outline" className="text-xs">JSON</Badge>
                <Badge variant="outline" className="text-xs">Interactif</Badge>
                <Badge variant="outline" className="text-xs">Vega-Lite</Badge>
              </div>
              <a 
                href="https://altair-viz.github.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm inline-flex items-center"
              >
                Documentation <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bokeh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Bibliothèque Python qui se concentre sur la création de visualisations interactives pour le web,
                avec une attention particulière aux grands ensembles de données.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs">Interactif</Badge>
                <Badge variant="outline" className="text-xs">Web</Badge>
                <Badge variant="outline" className="text-xs">Streaming</Badge>
                <Badge variant="outline" className="text-xs">JavaScript</Badge>
              </div>
              <a 
                href="https://bokeh.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm inline-flex items-center"
              >
                Documentation <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg"><GlossaryTerm definition={datavizDefinitions["d3js"]}>D3.js</GlossaryTerm></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Bibliothèque JavaScript pour manipuler des documents à partir de données (Data-Driven Documents), 
                qui permet de créer des visualisations web très personnalisées.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs">JavaScript</Badge>
                <Badge variant="outline" className="text-xs">SVG</Badge>
                <Badge variant="outline" className="text-xs">Web</Badge>
                <Badge variant="outline" className="text-xs">Flexible</Badge>
              </div>
              <a 
                href="https://d3js.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm inline-flex items-center"
              >
                Documentation <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Section outils BI */}
      <div id="bi-tools" className="mt-16">
        <h3 className="text-xl font-bold mb-4">Outils de Business Intelligence (BI)</h3>
        <p className="mb-6">
          Les outils de Business Intelligence permettent aux entreprises d'analyser leurs données
          et de créer des tableaux de bord interactifs pour faciliter la prise de décision.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">Tableau</CardTitle>
                <img src={asset("img/logos/tableau.svg")} alt="" className="h-8 w-8" />
              </div>
              <CardDescription>
                Plateforme de visualisation et d'analyse de Salesforce
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  <GlossaryTerm definition={datavizDefinitions["tableau"]}>Tableau</GlossaryTerm> est une plateforme qui permet de créer des visualisations
                  interactives et des tableaux de bord sans coder, avec des fonctionnalités d'analyse avancées.
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Points forts</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Interface glisser-déposer intuitive</li>
                    <li>Visualisations avancées et interactives</li>
                    <li>Connecteurs pour de nombreuses sources de données</li>
                    <li>Partage et collaboration faciles</li>
                    <li>Fonctionnalités avancées d'analyse</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Type :</span>
                  <span>Commercial (Tableau Public est gratuit, mais ce que vous y publiez est visible de tous)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-yellow-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><GlossaryTerm definition={datavizDefinitions["power-bi"]}>Power BI</GlossaryTerm></CardTitle>
                <img src={asset("img/logos/powerbi.svg")} alt="" className="h-8 w-8" />
              </div>
              <CardDescription>
                Solution de Business Intelligence de Microsoft
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Power BI est une suite d'outils d'analyse qui s'intègre bien à
                  l'écosystème Microsoft (Excel, Azure, Teams).
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Points forts</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Intégration étroite avec les produits Microsoft</li>
                    <li>Langage DAX pour les calculs avancés</li>
                    <li>Power Query pour la préparation des données</li>
                    <li>Publication web et partage facile</li>
                    <li>Rapport mobile optimisé</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Type :</span>
                  <span>Commercial (Power BI Desktop est gratuit pour créer des rapports ; leur partage en ligne demande une licence)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-purple-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">Looker Studio</CardTitle>
              </div>
              <CardDescription>
                Outil de reporting et de visualisation de Google
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Looker Studio (anciennement Google Data Studio) est un outil gratuit qui permet de créer 
                  des rapports et des tableaux de bord interactifs, avec une forte intégration aux services Google.
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Points forts</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Entièrement gratuit pour un usage de base</li>
                    <li>Intégration avec Google Analytics, Sheets, BigQuery</li>
                    <li>Partage et collaboration faciles</li>
                    <li>Intégration web simple</li>
                    <li>Fonctionne dans le navigateur, avec un compte Google</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Type :</span>
                  <span>Gratuit (une version Pro payante existe)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-orange-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">Metabase</CardTitle>
                <svg viewBox="0 0 32 32" className="h-8 w-8 text-orange-500">
                  <path fill="currentColor" d="M16.08 0c-2.87 0-5.27 1.96-5.92 4.6 0 0-.08.25-.08.49 0 .65.26 1.02.26 1.02.61 1.29 1.89 2.15 3.38 2.15 1.67 0 3.07-.95 3.7-2.31l.51-.9c.06-.11.15-.22.28-.25.25-.07.47.12.5.37l.12.76c.04.24.09.47.17.7.44 1.3 1.33 2.4 2.49 3.15-1.25.5-2.36 1.26-3.26 2.25-1.35 1.49-2.16 3.44-2.16 5.58 0 2.19.84 4.17 2.25 5.68 1.39 1.5 3.37 2.45 5.58 2.45 2.2 0 4.19-.95 5.58-2.45 1.41-1.51 2.25-3.49 2.25-5.68 0-2.14-.81-4.09-2.16-5.58-.9-.99-2.02-1.76-3.28-2.25 1.19-.76 2.2-1.89 2.67-3.24.08-.25.15-.49.17-.74l.05-.86c.01-.26.26-.43.52-.34.12.03.22.15.26.27l.35.96c.62 1.35 2.07 2.23 3.68 2.23 1.46 0 2.74-.84 3.36-2.09 0 0 .27-.37.27-1.02 0-.24-.08-.49-.08-.49C30.37 1.96 27.97 0 25.1 0zm-4.4 15.75c1.34 0 2.42 1.09 2.42 2.42s-1.08 2.43-2.42 2.43c-1.34 0-2.43-1.09-2.43-2.43s1.09-2.42 2.43-2.42z"/>
                </svg>
              </div>
              <CardDescription>
                Solution open-source pour l'analyse de données d'entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Metabase est une solution open-source facile à utiliser qui permet aux entreprises
                  de poser des questions sur leurs données et de partager les résultats.
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Points forts</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Open-source et auto-hébergeable</li>
                    <li>Interface simple pour les non-techniciens</li>
                    <li>SQL pour les utilisateurs avancés</li>
                    <li>Tableaux de bord partagés et interactifs</li>
                    <li>Connecteurs pour de nombreuses bases de données</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Type :</span>
                  <span>Open-source (avec version cloud payante)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">Apache Superset</CardTitle>
                <svg viewBox="0 0 32 32" className="h-8 w-8 text-green-600">
                  <path fill="currentColor" d="M16.53.006c-.97-.012-1.99.055-3.05.213-2.25.325-3.91.857-5.26 1.696-1.1.673-1.8 1.443-2.27 2.481-.254.562-.293.741-.293 1.364 0 .622.04.802.293 1.364.467 1.038 1.17 1.808 2.27 2.481 1.1.673 2.4 1.111 4.38 1.485.756.144 1.22.243 2.08.454.864.21 1.46.385 2.29.692 1.69.623 2.72 1.305 3.22 2.159.198.336.216.394.216.779 0 .385-.018.442-.216.779-.528.897-1.71 1.61-3.61 2.184-1.78.533-2.79.67-5.6.764-1.79.06-2.38.12-3.48.334-1.42.279-2.8.722-3.88 1.248-2.16 1.055-3.3 2.393-3.3 3.894 0 1.5 1.14 2.839 3.3 3.893 3.46 1.69 8.15 2.147 12.3 1.202 3.99-.901 6.59-2.798 6.59-4.798 0-.385-.018-.443-.216-.779-.498-.854-1.53-1.536-3.22-2.16-.829-.306-1.43-.482-2.29-.692-.862-.211-1.33-.31-2.08-.454-1.98-.374-3.28-.812-4.38-1.485-1.1-.673-1.8-1.443-2.27-2.481-.254-.562-.293-.741-.293-1.364 0-.622.04-.802.293-1.364.467-1.038 1.17-1.808 2.27-2.481.67-.41 1.36-.724 2.32-1.02 1.1-.339 1.32-.39 3.17-.733.96-.179 1.47-.315 2.47-.643 2.22-.73 3.81-1.774 4.52-2.957.19-.323.22-.399.22-.712 0-.312-.03-.389-.22-.712-.13-.224-.36-.524-.51-.666-.78-.741-2.11-1.417-3.8-1.92-1.43-.428-2.94-.662-4.8-.742-.31-.013-.62-.02-.93-.023z"/>
                </svg>
              </div>
              <CardDescription>
                Plateforme d'exploration de données et de visualisation moderne
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Apache Superset est une plateforme open-source d'exploration de données et de visualisation
                  qui permet aux utilisateurs de créer des tableaux de bord interactifs et des analyses détaillées.
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Points forts</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Interface d'exploration de données sans code</li>
                    <li>SQL Lab pour les requêtes directes</li>
                    <li>Visualisations avancées et personnalisables</li>
                    <li>Connecteurs pour de nombreuses bases de données (voir la documentation de Superset)</li>
                    <li>Gestion des accès par rôles</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Type :</span>
                  <span>Open-source</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section comparaison des outils */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold mb-6">Comment choisir le bon outil de visualisation ?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-blue-700 mb-4">Pour les développeurs</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Exploration de données</h5>
                <p className="text-sm">
                  <strong>Matplotlib/Seaborn :</strong> Pour l'analyse exploratoire rapide dans des notebooks Jupyter.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Intégration Python</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Statistiques</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Applications web interactives</h5>
                <p className="text-sm">
                  <strong>Plotly/Dash ou D3.js :</strong> Pour des visualisations interactives incorporées dans des applications web.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Interactivité</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Intégration web</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Publications scientifiques</h5>
                <p className="text-sm">
                  <strong>Matplotlib ou ggplot2 :</strong> Pour des graphiques statiques de haute qualité destinés à la publication.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Personnalisation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Haute résolution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-4">Pour les analystes et décideurs</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Tableaux de bord d'entreprise</h5>
                <p className="text-sm">
                  <strong>Tableau ou Power BI :</strong> Pour des tableaux de bord professionnels avec partage facile et peu de code.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Facilité d'utilisation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Support professionnel</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Projets à budget limité</h5>
                <p className="text-sm">
                  <strong>Looker Studio ou Metabase :</strong> Solutions gratuites ou open-source avec une courbe d'apprentissage modérée.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Coût réduit/nul</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Installation simple</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium mb-2">Analyse avancée</h5>
                <p className="text-sm">
                  <strong>Apache Superset :</strong> Pour les équipes techniques qui veulent combiner SQL avancé et visualisations personnalisées.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">SQL avancé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Personnalisation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm mt-6">
          <h4 className="font-medium mb-3">Facteurs à considérer dans le choix d'un outil</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">1</div>
                <span className="font-medium">Public cible</span>
              </div>
              <p className="text-xs pl-8">
                Qui utilisera les visualisations ? Des développeurs, analystes ou dirigeants ?
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">2</div>
                <span className="font-medium">Type de données</span>
              </div>
              <p className="text-xs pl-8">
                La complexité, le volume et la nature des données à visualiser.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">3</div>
                <span className="font-medium">Interactivité</span>
              </div>
              <p className="text-xs pl-8">
                Besoin de filtres, d'exploration détaillée (drill-down) ou d'autres interactions ?
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">4</div>
                <span className="font-medium">Intégration</span>
              </div>
              <p className="text-xs pl-8">
                Compatibilité avec vos sources de données et plateformes existantes.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">5</div>
                <span className="font-medium">Budget</span>
              </div>
              <p className="text-xs pl-8">
                Coûts des licences, de l'hébergement et des ressources humaines pour le développement.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">6</div>
                <span className="font-medium">Évolutivité</span>
              </div>
              <p className="text-xs pl-8">
                Capacité à évoluer avec vos besoins futurs et volumes de données croissants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationTools;
