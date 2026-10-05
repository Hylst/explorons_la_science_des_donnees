import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Calculator, BarChart3, Zap, Target, Code2, Database } from 'lucide-react';
import PythonInteractiveSchemas from './PythonInteractiveSchemas';
import NumpyBenchmark from './NumpyBenchmark';

/**
 * PythonModule4 Component - NumPy pour la Data Science
 * 
 * This component provides comprehensive coverage of NumPy fundamentals
 * with a focus on data science applications. It includes:
 * - Introduction to NumPy and its importance
 * - Array creation and manipulation
 * - Mathematical operations and broadcasting
 * - Data analysis techniques
 * - Performance comparisons with pure Python
 * - Practical exercises and examples
 */
const PythonModule4: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Module Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-l-blue-500">
        <h2 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-3">
          <Calculator className="h-6 w-6" />
          Module 4: NumPy - Calcul Scientifique
        </h2>
        <p className="text-blue-700 mb-4">
          Découvrez NumPy, la bibliothèque fondamentale pour le calcul scientifique en Python. 
          Apprenez à manipuler des tableaux multidimensionnels et à effectuer des calculs performants.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">10 à 100x</div>
            <div className="text-sm text-blue-700">Plus rapide que Python pur, selon l'opération</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">N-D</div>
            <div className="text-sm text-blue-700">Tableaux multidimensionnels</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">C/Fortran</div>
            <div className="text-sm text-blue-700">Optimisé en langage bas niveau</div>
          </div>
        </div>
      </div>

      {/* Section 1: Introduction à NumPy */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Qu'est-ce que NumPy ?</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Fondamental</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-blue-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-blue-100 rounded-b-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🎯 Pourquoi NumPy ?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Performance:</strong> Calculs vectorisés, bien plus rapides que des boucles Python (mesurez-le à droite)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Mémoire:</strong> Stockage efficace des données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Écosystème:</strong> Base de Pandas, Matplotlib, Scikit-learn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Interopérabilité:</strong> Compatible C/C++/Fortran</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📊 Comparaison Performance</h4>
                <NumpyBenchmark />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">💻 Installation et Import</h4>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Installation
pip install numpy

# Import standard
import numpy as np

# Vérifier la version
print(np.__version__)  # affiche votre version (2.4.6 dans l'éditeur du site)`}
              </pre>
            </div>
            
            {/* Interactive Performance Comparison */}
            <div className="mt-6">
              <PythonInteractiveSchemas type="python-vs-numpy-performance" />
            </div>
            
            {/* Interactive Data Types Comparison */}
            <div className="mt-6">
              <PythonInteractiveSchemas type="data-types-comparison" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 2: Création et Manipulation d'Arrays */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Création et Manipulation d'Arrays</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Essentiel</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-green-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-green-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Array Creation Methods */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Méthodes de Création d'Arrays
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">🔢 À partir de listes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Array 1D
arr_1d = np.array([1, 2, 3, 4, 5])
print(arr_1d.shape)  # (5,)

# Array 2D (matrice)
arr_2d = np.array([[1, 2, 3], 
                   [4, 5, 6]])
print(arr_2d.shape)  # (2, 3)

# Array 3D
arr_3d = np.array([[[1, 2], [3, 4]], 
                   [[5, 6], [7, 8]]])
print(arr_3d.shape)  # (2, 2, 2)`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-800">⚡ Fonctions de création</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Zéros et uns
zeros = np.zeros((3, 4))     # Matrice 3x4 de zéros
ones = np.ones((2, 3))       # Matrice 2x3 de uns

# Séquences
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)  # 5 points de 0 à 1

# Aléatoire
random_arr = np.random.random((3, 3))
normal_arr = np.random.normal(0, 1, (2, 4))`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Interactive Array Structure Visualization */}
            <div className="mt-6">
              <PythonInteractiveSchemas type="numpy-array-structure" />
            </div>

            {/* Array Properties */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📋 Propriétés des Arrays</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Créer un array d'exemple (dtype explicite : le type entier par défaut dépend de la plate-forme)
data = np.array([[1, 2, 3, 4], 
                 [5, 6, 7, 8], 
                 [9, 10, 11, 12]], dtype=np.int64)

# Propriétés importantes
print(f"Shape (forme): {data.shape}")        # (3, 4)
print(f"Size (taille): {data.size}")         # 12
print(f"Ndim (dimensions): {data.ndim}")     # 2
print(f"Dtype (type): {data.dtype}")        # int64
print(f"Itemsize: {data.itemsize} bytes")   # 8
print(f"Nbytes: {data.nbytes} bytes")       # 96`}
                </pre>
              </div>
            </div>

            {/* Indexing and Slicing */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎯 Indexation et Slicing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Indexation de base</h5>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`arr = np.array([[1, 2, 3], 
                 [4, 5, 6], 
                 [7, 8, 9]])

# Accès aux éléments
print(arr[0, 1])     # 2 (ligne 0, colonne 1)
print(arr[1])        # [4 5 6] (ligne 1)
print(arr[:, 2])     # [3 6 9] (colonne 2)
print(arr[0:2, 1:3]) # [[2 3] [5 6]]`}
                  </pre>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Indexation avancée</h5>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Indexation booléenne
mask = arr > 5
print(arr[mask])     # [6 7 8 9]

# Indexation avec des arrays
rows = np.array([0, 2])
cols = np.array([1, 2])
print(arr[rows, cols])  # [2 9]

# Modification conditionnelle
arr[arr > 5] = 0
print(arr)  # [[1 2 3] [4 5 0] [0 0 0]]`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 3: Opérations Mathématiques */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Opérations Mathématiques et Broadcasting</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Avancé</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-purple-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-purple-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Mathematical Operations */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🧮 Opérations Élémentaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">Opérations de base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

# Opérations élément par élément
print(a + b)    # [6  8 10 12]
print(a * b)    # [5 12 21 32]
print(a ** 2)   # [1  4  9 16]
print(np.sqrt(a))  # [1.         1.41421356 1.73205081 2.        ]

# Opérations avec scalaires
print(a * 2)    # [2 4 6 8]
print(a + 10)   # [11 12 13 14]`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">Fonctions mathématiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Fonctions trigonométriques
angles = np.array([0, np.pi/2, np.pi])
# sin(π) et cos(π/2) ne sont pas exactement 0 : erreurs d'arrondi des flottants
print(np.sin(angles))  # [0.0000000e+00 1.0000000e+00 1.2246468e-16]
print(np.cos(angles))  # [ 1.000000e+00  6.123234e-17 -1.000000e+00]

# Fonctions exponentielles et log
print(np.exp([1, 2, 3]))    # [ 2.71828183  7.3890561  20.08553692]
print(np.log([1, 2, 3]))    # [0.         0.69314718 1.09861229]

# Fonctions statistiques
data = np.array([1, 2, 3, 4, 5])
print(np.mean(data))   # 3.0
print(np.std(data))    # 1.4142135623730951`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Broadcasting */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📡 Broadcasting - Le Superpouvoir de NumPy</h4>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-yellow-800 text-sm mb-2">
                  <strong>💡 Concept clé:</strong> Le broadcasting permet d'effectuer des opérations entre arrays de formes différentes sans copier les données.
                </p>
              </div>
              
              {/* Interactive Broadcasting Visualization */}
              <div className="mb-6">
                <PythonInteractiveSchemas type="numpy-broadcasting" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Exemples de Broadcasting</h5>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Array 2D + scalaire
matrix = np.array([[1, 2, 3], 
                   [4, 5, 6]])
result = matrix + 10
print(result)
# [[11 12 13]
#  [14 15 16]]

# Array 2D + Array 1D
vector = np.array([10, 20, 30])
result = matrix + vector
print(result)
# [[11 22 33]
#  [14 25 36]]`}
                  </pre>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Règles de Broadcasting</h5>
                  <div className="space-y-2 text-sm">
                    <div className="bg-green-50 p-2 rounded">
                      <strong>✓ Compatible:</strong> (3, 4) + (4,) → (3, 4)
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <strong>✓ Compatible:</strong> (3, 1) + (1, 4) → (3, 4)
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <strong>✗ Incompatible:</strong> (3, 4) + (3, 2)
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <strong>Règle:</strong> Les dimensions sont compatibles si elles sont égales ou si l'une vaut 1.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Linear Algebra */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🔢 Algèbre Linéaire</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Matrices d'exemple
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Multiplication matricielle
C = np.dot(A, B)  # ou A @ B
print(C)
# [[19 22]
#  [43 50]]

# Transposée
print(A.T)
# [[1 3]
#  [2 4]]

# Déterminant et inverse
print(np.linalg.det(A))    # -2.0000000000000004 (arrondi : proche de -2)
print(np.linalg.inv(A))    # [[-2.   1. ] [ 1.5 -0.5]]

# Valeurs et vecteurs propres
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"Valeurs propres: {eigenvalues}")
print(f"Vecteurs propres:\\n{eigenvectors}")`}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Section 4: Applications Data Science */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <div className="flex items-center gap-3">
            <Code2 className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-900">Applications en Data Science</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pratique</Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-orange-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border border-orange-100 rounded-b-lg">
          <div className="space-y-6">
            {/* Data Analysis Examples */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Analyse de Données avec NumPy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">Statistiques descriptives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données de ventes (en milliers €)
sales_data = np.array([
    [120, 150, 180, 200, 175],  # Q1
    [200, 220, 190, 210, 195],  # Q2
    [180, 160, 170, 185, 190],  # Q3
    [250, 280, 260, 290, 275]   # Q4
])

# Statistiques par trimestre
print("Moyenne par trimestre:")
print(np.mean(sales_data, axis=1))
# [165. 203. 177. 271.]

# Statistiques par mois
print("\\nMédiane par mois:")
print(np.median(sales_data, axis=0))
# [190.  190.  185.  205.  192.5]`}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">Analyse de corrélation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Données: température et ventes de glaces
temperature = np.array([15, 20, 25, 30, 35, 40])
ice_cream_sales = np.array([50, 75, 100, 150, 200, 250])

# Coefficient de corrélation
correlation = np.corrcoef(temperature, ice_cream_sales)
print(f"Corrélation: {correlation[0,1]:.3f}")
# Corrélation: 0.989 (très forte!)

# Régression linéaire simple
coeffs = np.polyfit(temperature, ice_cream_sales, 1)
print(f"Pente: {coeffs[0]:.2f}")
print(f"Ordonnée: {coeffs[1]:.2f}")
# y = 8.14x - 86.43`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Data Cleaning */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🧹 Nettoyage de Données</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Données avec valeurs manquantes (représentées par NaN)
data_with_nan = np.array([1.0, 2.0, np.nan, 4.0, 5.0, np.nan, 7.0])

# Détecter les valeurs manquantes
nan_mask = np.isnan(data_with_nan)
print(f"Positions des NaN: {np.where(nan_mask)[0]}")  # [2 5]

# Supprimer les NaN
clean_data = data_with_nan[~nan_mask]
print(f"Données nettoyées: {clean_data}")  # [1. 2. 4. 5. 7.]

# Remplacer les NaN par la moyenne
mean_value = np.nanmean(data_with_nan)  # Moyenne en ignorant NaN
data_filled = np.where(nan_mask, mean_value, data_with_nan)
print(f"NaN remplacés par moyenne: {data_filled}")

# Détection d'outliers (méthode IQR)
Q1 = np.percentile(clean_data, 25)
Q3 = np.percentile(clean_data, 75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
outliers = (clean_data < lower_bound) | (clean_data > upper_bound)
print(f"Outliers détectés: {clean_data[outliers]}")`}
              </pre>
            </div>

            {/* Performance Tips */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">⚡ Optimisation des Performances</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-800">✅ Bonnes Pratiques</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>• Utilisez les opérations vectorisées</div>
                    <div>• Évitez les boucles Python quand possible</div>
                    <div>• Préallouez les arrays avec <code>np.zeros()</code></div>
                    <div>• Utilisez les vues au lieu des copies</div>
                    <div>• Choisissez le bon dtype (int32 vs int64)</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-800">❌ À Éviter</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>• Boucles for sur les éléments d'arrays</div>
                    <div>• Concaténation répétée d'arrays</div>
                    <div>• Conversion fréquente list ↔ array</div>
                    <div>• Copies inutiles d'arrays volumineux</div>
                    <div>• Opérations sur des arrays non-contigus</div>
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
          <Target className="h-5 w-5" />
          Exercices Pratiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-indigo-800">🎯 Exercice 1: Analyse de Ventes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2">Analysez les données de ventes trimestrielles d'une entreprise:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Calculer la croissance mois par mois</li>
                <li>• Identifier le meilleur et pire trimestre</li>
                <li>• Prédire les ventes du prochain trimestre</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-800">🎯 Exercice 2: Traitement d'Images</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2">Manipulez une image représentée comme array 3D:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Convertir en niveaux de gris</li>
                <li>• Appliquer des filtres (flou, netteté)</li>
                <li>• Détecter les contours</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PythonModule4;