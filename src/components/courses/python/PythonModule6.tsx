import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, BarChart3, PieChart, LineChart, Palette, Image, TrendingUp } from 'lucide-react';
import PythonInteractiveSchemas from './PythonInteractiveSchemas';

/**
 * PythonModule6 Component - Matplotlib pour la Visualisation de Données
 * 
 * This component provides comprehensive coverage of Matplotlib fundamentals
 * with a focus on data visualization for data science. It includes:
 * - Introduction to Matplotlib and its architecture
 * - Basic plotting with pyplot interface
 * - Advanced customization and styling
 * - Statistical plots and data exploration
 * - Interactive visualizations
 * - Integration with Pandas and Seaborn
 */
const PythonModule6: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Module Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-l-blue-500">
        <h2 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-3">
          <BarChart3 className="h-6 w-6" />
          Module 6: Matplotlib - Visualisation de Données
        </h2>
        <p className="text-blue-700 mb-4">
          Découvrez Matplotlib, une bibliothèque très utilisée pour créer des visualisations de données
          professionnelles en Python. De graphiques simples aux visualisations complexes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">20+</div>
            <div className="text-sm text-blue-700">Types de graphiques</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">100%</div>
            <div className="text-sm text-blue-700">Personnalisable</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">Publication</div>
            <div className="text-sm text-blue-700">Qualité scientifique</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">Pandas</div>
            <div className="text-sm text-blue-700">Intégration native</div>
          </div>
        </div>
      </div>

      {/* Section 1: Introduction à Matplotlib */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Introduction à Matplotlib</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Fondamental</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-blue-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-blue-100 rounded-b-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📊 Qu'est-ce que Matplotlib ?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span><strong>Bibliothèque 2D:</strong> Graphiques statiques, animés et interactifs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span><strong>Publication:</strong> Qualité professionnelle et scientifique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span><strong>Formats:</strong> PNG, PDF, SVG, EPS et plus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span><strong>Écosystème:</strong> Base pour Seaborn, Pandas plotting</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🏗️ Architecture Matplotlib</h4>
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="border-b pb-2">
                        <div className="font-semibold text-purple-800">Backend Layer</div>
                        <div className="text-gray-600">Rendu et affichage (Agg, Qt, Tk)</div>
                      </div>
                      <div className="border-b pb-2">
                        <div className="font-semibold text-green-800">Artist Layer</div>
                        <div className="text-gray-600">Objets graphiques (Figure, Axes)</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">Scripting Layer</div>
                        <div className="text-gray-600">Interface pyplot (MATLAB-like)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">💻 Installation et Configuration</h4>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Installation
pip install matplotlib

# Import standard
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Configuration pour Jupyter
%matplotlib inline  # Affichage inline
%matplotlib widget  # Interactif

# Style et configuration
plt.style.use('seaborn-v0_8')  # Style moderne
plt.rcParams['figure.figsize'] = (10, 6)  # Taille par défaut
plt.rcParams['font.size'] = 12  # Taille police`}
              </pre>
            </div>
            
            {/* Interactive Matplotlib Workflow */}
            <div className="mt-6">
              <PythonInteractiveSchemas type="matplotlib-workflow" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 2: Graphiques de Base */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Graphiques de Base</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Essentiel</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-green-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-green-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Line Plots */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Graphiques Linéaires
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">Graphique simple</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données simples
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Graphique de base
plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.title('Fonction Sinus')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)
plt.show()

# Plusieurs courbes
y2 = np.cos(x)
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)', color='blue')
plt.plot(x, y2, label='cos(x)', color='red')
plt.legend()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">Personnalisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Styles de ligne
plt.figure(figsize=(10, 6))
plt.plot(x, y, 
         linestyle='--',     # Style: '-', '--', '-.', ':'
         linewidth=2,        # Épaisseur
         color='red',        # Couleur
         marker='o',         # Marqueurs: 'o', 's', '^', 'v'
         markersize=4,       # Taille marqueurs
         alpha=0.7)          # Transparence

# Couleurs et styles
colors = ['red', 'blue', 'green', 'orange']
styles = ['-', '--', '-.', ':']

for i, (color, style) in enumerate(zip(colors, styles)):
    plt.plot(x, np.sin(x + i*0.5), 
             color=color, linestyle=style, 
             label=f'Phase {i}')

plt.legend()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Scatter Plots */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Graphiques de Dispersion
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">Scatter plot simple</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données aléatoires
np.random.seed(42)
n = 100
x = np.random.randn(n)
y = 2 * x + np.random.randn(n)

# Scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6)
plt.xlabel('Variable X')
plt.ylabel('Variable Y')
plt.title('Relation X-Y')
plt.grid(True, alpha=0.3)
plt.show()

# Avec couleurs selon une variable
colors = np.random.rand(n)
plt.scatter(x, y, c=colors, alpha=0.6, cmap='viridis')
plt.colorbar()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-800">Scatter avancé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Tailles variables
sizes = np.random.randint(20, 200, n)

plt.figure(figsize=(10, 8))
scatter = plt.scatter(x, y, 
                     c=colors,           # Couleurs
                     s=sizes,            # Tailles
                     alpha=0.6,          # Transparence
                     cmap='plasma',      # Palette
                     edgecolors='black', # Contours
                     linewidth=0.5)      # Épaisseur contour

plt.colorbar(scatter, label='Valeur')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Scatter Plot Avancé')
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bar Charts */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Graphiques en Barres
              </h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Données catégorielles
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

# Graphique en barres vertical
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Barres verticales
ax1.bar(categories, values, color=['red', 'blue', 'green', 'orange', 'purple'])
ax1.set_title('Barres Verticales')
ax1.set_ylabel('Valeurs')

# Barres horizontales
ax2.barh(categories, values, color='skyblue')
ax2.set_title('Barres Horizontales')
ax2.set_xlabel('Valeurs')

plt.tight_layout()
plt.show()

# Barres groupées
values2 = [20, 35, 30, 35, 27]
x_pos = np.arange(len(categories))
width = 0.35

plt.figure(figsize=(10, 6))
plt.bar(x_pos - width/2, values, width, label='Série 1', alpha=0.8)
plt.bar(x_pos + width/2, values2, width, label='Série 2', alpha=0.8)

plt.xlabel('Catégories')
plt.ylabel('Valeurs')
plt.title('Barres Groupées')
plt.xticks(x_pos, categories)
plt.legend()
plt.show()`}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 3: Graphiques Statistiques */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Graphiques Statistiques</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Analyse</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-purple-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-purple-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Histograms */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Histogrammes et Distributions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-800">Histogrammes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données normales
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

# Histogramme simple
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
plt.xlabel('Valeurs')
plt.ylabel('Fréquence')
plt.title('Distribution Normale')
plt.grid(True, alpha=0.3)
plt.show()

# Histogrammes multiples
data2 = np.random.normal(120, 20, 1000)

plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.5, label='Groupe 1', color='blue')
plt.hist(data2, bins=30, alpha=0.5, label='Groupe 2', color='red')
plt.legend()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">Box plots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données pour box plots
data_groups = [np.random.normal(100, 15, 100),
               np.random.normal(110, 20, 100),
               np.random.normal(95, 10, 100),
               np.random.normal(105, 25, 100)]

# Box plot
plt.figure(figsize=(10, 6))
box_plot = plt.boxplot(data_groups, 
                       tick_labels=['Groupe A', 'Groupe B', 'Groupe C', 'Groupe D'],
                       patch_artist=True,  # Couleurs
                       notch=True)         # Encoche médiane

# Personnaliser couleurs
colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightyellow']
for patch, color in zip(box_plot['boxes'], colors):
    patch.set_facecolor(color)

plt.ylabel('Valeurs')
plt.title('Comparaison de Distributions')
plt.grid(True, alpha=0.3)
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Heatmaps and Correlation */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🔥 Heatmaps et Corrélations</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Matrice de corrélation
np.random.seed(42)
n_vars = 5
data_matrix = np.random.randn(100, n_vars)
data_matrix[:, 1] = data_matrix[:, 0] + np.random.randn(100) * 0.5  # Corrélation
data_matrix[:, 2] = -data_matrix[:, 0] + np.random.randn(100) * 0.3  # Anti-corrélation

# Calculer matrice de corrélation
corr_matrix = np.corrcoef(data_matrix.T)

# Heatmap
fig, ax = plt.subplots(figsize=(8, 6))
im = ax.imshow(corr_matrix, cmap='coolwarm', vmin=-1, vmax=1)

# Ajouter les valeurs dans les cellules
for i in range(n_vars):
    for j in range(n_vars):
        text = ax.text(j, i, f'{corr_matrix[i, j]:.2f}',
                      ha="center", va="center", color="black")

# Personnalisation
ax.set_xticks(range(n_vars))
ax.set_yticks(range(n_vars))
ax.set_xticklabels([f'Var {i+1}' for i in range(n_vars)])
ax.set_yticklabels([f'Var {i+1}' for i in range(n_vars)])
ax.set_title('Matrice de Corrélation')

# Colorbar
cbar = plt.colorbar(im)
cbar.set_label('Corrélation')
plt.show()`}
              </pre>
            </div>

            {/* Pie Charts */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🥧 Graphiques Circulaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-orange-800">Pie chart simple</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données FICTIVES pour pie chart (parts inventées pour l'exemple)
labels = ['Python', 'JavaScript', 'Java', 'C++', 'Autres']
sizes = [35, 25, 20, 10, 10]
colors = ['gold', 'lightcoral', 'lightskyblue', 'lightgreen', 'plum']
explode = (0.1, 0, 0, 0, 0)  # Séparer une part

plt.figure(figsize=(8, 8))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('Langages de programmation (données fictives)')
plt.axis('equal')  # Cercle parfait
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-800">Donut chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Donut chart (pie avec trou)
fig, ax = plt.subplots(figsize=(8, 8))

# Cercle extérieur
wedges, texts, autotexts = ax.pie(sizes, labels=labels, 
                                  autopct='%1.1f%%',
                                  colors=colors,
                                  pctdistance=0.85)

# Créer le trou au centre
centre_circle = plt.Circle((0,0), 0.70, fc='white')
fig.gca().add_artist(centre_circle)

# Texte au centre
ax.text(0, 0, 'Langages\\n(fictif)', 
        horizontalalignment='center',
        verticalalignment='center',
        fontsize=14, fontweight='bold')

ax.set_title('Distribution des Langages')
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 4: Subplots et Layouts */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <div className="flex items-center gap-3">
            <Image className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-900">Subplots et Layouts Avancés</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">Layout</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-orange-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-orange-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Basic Subplots */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📐 Subplots de Base</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Données pour les exemples
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.tan(x)
y4 = np.exp(-x/5) * np.sin(x)

# Subplots 2x2
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Graphique 1 (haut gauche)
axes[0, 0].plot(x, y1, 'b-')
axes[0, 0].set_title('Sinus')
axes[0, 0].grid(True)

# Graphique 2 (haut droite)
axes[0, 1].plot(x, y2, 'r--')
axes[0, 1].set_title('Cosinus')
axes[0, 1].grid(True)

# Graphique 3 (bas gauche)
axes[1, 0].plot(x, y3, 'g-.')
axes[1, 0].set_title('Tangente')
axes[1, 0].set_ylim(-5, 5)  # Limiter l'axe Y
axes[1, 0].grid(True)

# Graphique 4 (bas droite)
axes[1, 1].plot(x, y4, 'm:')
axes[1, 1].set_title('Sinus Amorti')
axes[1, 1].grid(True)

# Ajuster l'espacement
plt.tight_layout()
plt.show()`}
              </pre>
            </div>

            {/* Advanced Layouts */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎨 Layouts Avancés</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-orange-800">GridSpec</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`import matplotlib.gridspec as gridspec

# Layout personnalisé avec GridSpec
fig = plt.figure(figsize=(12, 8))
gs = gridspec.GridSpec(3, 3, figure=fig)

# Graphique principal (2x2)
ax_main = fig.add_subplot(gs[0:2, 0:2])
ax_main.plot(x, y1, 'b-', linewidth=2)
ax_main.set_title('Graphique Principal')
ax_main.grid(True)

# Graphique droit (2x1)
ax_right = fig.add_subplot(gs[0:2, 2])
ax_right.hist(np.random.randn(1000), bins=20, orientation='horizontal')
ax_right.set_title('Histogramme')

# Graphique bas (1x2)
ax_bottom = fig.add_subplot(gs[2, 0:2])
ax_bottom.plot(x, y2, 'r--')
ax_bottom.set_title('Graphique Bas')
ax_bottom.grid(True)

# Petit graphique coin
ax_corner = fig.add_subplot(gs[2, 2])
ax_corner.pie([1, 2, 3], labels=['A', 'B', 'C'])
ax_corner.set_title('Pie')

plt.tight_layout()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-800">Axes partagés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Axes partagés
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8), 
                                    sharex=True)  # Partager axe X

# Données temporelles
dates = pd.date_range('2023-01-01', periods=100)
values1 = np.cumsum(np.random.randn(100))
values2 = np.cumsum(np.random.randn(100))
values3 = np.random.randn(100)

# Graphiques avec axe X partagé
ax1.plot(dates, values1, 'b-')
ax1.set_ylabel('Série 1')
ax1.grid(True)

ax2.plot(dates, values2, 'r-')
ax2.set_ylabel('Série 2')
ax2.grid(True)

ax3.bar(dates[::10], values3[::10], width=2)
ax3.set_ylabel('Série 3')
ax3.set_xlabel('Date')
ax3.grid(True)

# Rotation des labels de date
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Styling and Themes */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎭 Styles et Thèmes</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Styles disponibles
print(plt.style.available)
# ['seaborn-v0_8', 'ggplot', 'dark_background', 'bmh', 'classic', ...]

# Utiliser un style
with plt.style.context('seaborn-v0_8'):
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(x, y1, label='sin(x)')
    ax.plot(x, y2, label='cos(x)')
    ax.legend()
    ax.set_title('Style Seaborn')
    plt.show()

# Style sombre
with plt.style.context('dark_background'):
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(x, y1, color='cyan', linewidth=2)
    ax.plot(x, y2, color='magenta', linewidth=2)
    ax.set_title('Style Sombre', color='white')
    ax.grid(True, alpha=0.3)
    plt.show()

# Configuration personnalisée
plt.rcParams.update({
    'font.size': 12,
    'axes.linewidth': 2,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'xtick.major.size': 7,
    'xtick.minor.size': 4,
    'ytick.major.size': 7,
    'ytick.minor.size': 4
})`}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 5: Intégration avec Pandas */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-teal-600" />
            <span className="font-semibold text-teal-900">Intégration avec Pandas</span>
            <Badge variant="secondary" className="bg-teal-100 text-teal-800">Pratique</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-teal-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-teal-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Pandas Plotting */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Plotting avec Pandas</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Créer des données de démonstration
np.random.seed(42)
dates = pd.date_range('2023-01-01', periods=365)
data = pd.DataFrame({
    'ventes': np.random.randint(100, 1000, 365),
    'temperature': 20 + 10 * np.sin(np.arange(365) * 2 * np.pi / 365) + np.random.randn(365) * 2,
    'region': np.random.choice(['Nord', 'Sud', 'Est', 'Ouest'], 365),
    'produit': np.random.choice(['A', 'B', 'C'], 365)
}, index=dates)

# Graphiques directs avec Pandas
# Série temporelle
data['ventes'].plot(figsize=(12, 6), title='Évolution des Ventes')
plt.ylabel('Ventes')
plt.show()

# Histogramme
data['temperature'].hist(bins=30, figsize=(8, 6), alpha=0.7)
plt.title('Distribution des Températures')
plt.xlabel('Température (°C)')
plt.ylabel('Fréquence')
plt.show()

# Box plot par catégorie
data.boxplot(column='ventes', by='region', figsize=(10, 6))
plt.title('Ventes par Région')
plt.suptitle('')  # Supprimer titre automatique
plt.show()

# Graphiques multiples
data[['ventes', 'temperature']].plot(subplots=True, figsize=(12, 8))
plt.show()`}
              </pre>
            </div>

            {/* Advanced Pandas Visualization */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📈 Visualisations Avancées</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-teal-800">Corrélations et heatmaps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Matrice de corrélation avec Pandas
numeric_data = data.select_dtypes(include=[np.number])
corr_matrix = numeric_data.corr()

# Heatmap avec matplotlib
fig, ax = plt.subplots(figsize=(8, 6))
im = ax.imshow(corr_matrix, cmap='coolwarm', vmin=-1, vmax=1)

# Labels
ax.set_xticks(range(len(corr_matrix.columns)))
ax.set_yticks(range(len(corr_matrix.columns)))
ax.set_xticklabels(corr_matrix.columns)
ax.set_yticklabels(corr_matrix.columns)

# Valeurs dans les cellules
for i in range(len(corr_matrix.columns)):
    for j in range(len(corr_matrix.columns)):
        text = ax.text(j, i, f'{corr_matrix.iloc[i, j]:.2f}',
                      ha="center", va="center")

plt.colorbar(im)
plt.title('Matrice de Corrélation')
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">Analyse temporelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Analyse par mois
monthly_sales = data.groupby(data.index.month)['ventes'].mean()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Graphique linéaire mensuel
ax1.plot(monthly_sales.index, monthly_sales.values, 'o-')
ax1.set_xlabel('Mois')
ax1.set_ylabel('Ventes Moyennes')
ax1.set_title('Saisonnalité des Ventes')
ax1.grid(True)

# Heatmap par jour de semaine et mois
data['weekday'] = data.index.dayofweek
data['month'] = data.index.month
heatmap_data = data.pivot_table(values='ventes', 
                               index='weekday', 
                               columns='month', 
                               aggfunc='mean')

im = ax2.imshow(heatmap_data, cmap='YlOrRd', aspect='auto')
ax2.set_xlabel('Mois')
ax2.set_ylabel('Jour de la semaine')
ax2.set_title('Heatmap Ventes')
plt.colorbar(im, ax=ax2)

plt.tight_layout()
plt.show()`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Exercices Pratiques */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-l-indigo-500">
        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Projets de Visualisation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-indigo-800">📊 Projet 1: Dashboard Financier</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2">Créez un dashboard d'analyse financière:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Évolution des prix d'actions</li>
                <li>• Comparaison de performances</li>
                <li>• Analyse de volatilité</li>
                <li>• Corrélations entre actifs</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-800">🌡️ Projet 2: Analyse Climatique</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2">Visualisez des données météorologiques:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Tendances de température</li>
                <li>• Patterns saisonniers</li>
                <li>• Cartes de chaleur mensuelles</li>
                <li>• Comparaisons régionales</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PythonModule6;