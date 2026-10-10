import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronRight, Grid3X3, Calculator, Layers, Zap } from 'lucide-react';

interface PythonInteractiveSchemasProps {
  type: 'numpy-array-structure' | 'numpy-broadcasting' | 'pandas-dataframe' | 'data-types-comparison' | 'python-vs-numpy-performance' | 'matplotlib-workflow' | 'jupyter-workflow';
  className?: string;
}

/**
 * Interactive schemas for Python Data Science concepts
 * Provides visual and interactive explanations to enhance learning
 */
const PythonInteractiveSchemas: React.FC<PythonInteractiveSchemasProps> = ({ type, className = '' }) => {
  const [activeElement, setActiveElement] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timer = useRef<number | null>(null);
  // minuteur arrêté si le schéma disparaît pendant l'animation
  useEffect(() => () => {
    if (timer.current !== null) window.clearInterval(timer.current);
  }, []);

  const schemas = {
    'numpy-array-structure': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-blue-600" />
            Structure des Arrays NumPy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 1D Array Visualization */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Array 1D (Vecteur)</h4>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 border-2 border-blue-300 bg-white rounded flex items-center justify-center font-mono text-sm cursor-pointer transition-all duration-300 ${
                      activeElement === idx ? 'bg-blue-200 border-blue-500 scale-110' : 'hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveElement(activeElement === idx ? null : idx)}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <div className="text-xs text-blue-600 font-mono">shape: (5,) | dtype: int64 | size: 5</div>
              {activeElement !== null && activeElement < 5 && (
                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm"><strong>Index {activeElement}:</strong> Valeur = {[1, 2, 3, 4, 5][activeElement]}</p>
                  <p className="text-xs text-gray-600">Accès: arr[{activeElement}]</p>
                </div>
              )}
            </div>

            {/* 2D Array Visualization */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Array 2D (Matrice)</h4>
              <div className="grid grid-cols-3 gap-1 w-fit mb-2">
                {[
                  [1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9]
                ].flat().map((val, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-12 border-2 border-green-300 bg-white rounded flex items-center justify-center font-mono text-sm cursor-pointer transition-all duration-300 ${
                        activeElement === idx + 10 ? 'bg-green-200 border-green-500 scale-110' : 'hover:bg-green-100'
                      }`}
                      onClick={() => setActiveElement(activeElement === idx + 10 ? null : idx + 10)}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-green-600 font-mono">shape: (3, 3) | dtype: int64 | size: 9</div>
              {activeElement !== null && activeElement >= 10 && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  {(() => {
                    const idx = activeElement - 10;
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const val = [1, 2, 3, 4, 5, 6, 7, 8, 9][idx];
                    return (
                      <div>
                        <p className="text-sm"><strong>Position [{row}, {col}]:</strong> Valeur = {val}</p>
                        <p className="text-xs text-gray-600">Accès: arr[{row}, {col}] ou arr[{row}][{col}]</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* 3D Array Visualization */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-800">Array 3D (Tenseur)</h4>
              <div className="flex gap-4">
                {[0, 1].map(layer => (
                  <div key={layer} className="relative">
                    <div className="text-xs text-purple-600 mb-1 font-semibold">Couche {layer}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        [[1, 2], [3, 4]],
                        [[5, 6], [7, 8]]
                      ][layer].flat().map((val, idx) => (
                        <div
                          key={`${layer}-${idx}`}
                          className="w-10 h-10 border-2 border-purple-300 bg-white rounded flex items-center justify-center font-mono text-xs cursor-pointer transition-all duration-300 hover:bg-purple-100"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-purple-600 font-mono mt-2">shape: (2, 2, 2) | dtype: int64 | size: 8</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">Points clés</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• <strong>Shape:</strong> Dimensions de l'array (lignes, colonnes, profondeur...)</li>
                <li>• <strong>Dtype:</strong> Type de données (int64, float64, bool...). L'entier par défaut est int64 sous Linux/macOS, mais int32 dans l'éditeur du site</li>
                <li>• <strong>Size:</strong> Nombre total d'éléments</li>
                <li>• <strong>Indexation:</strong> Commence à 0, utilise [ligne, colonne] pour 2D</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'numpy-broadcasting': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Broadcasting NumPy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-800">Qu'est-ce que le Broadcasting ?</h4>
              <p className="text-sm text-gray-700 mb-4">
                Le broadcasting permet d'effectuer des opérations entre arrays de formes différentes sans copier explicitement les données.
              </p>
              
              {/* Animation Controls */}
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Pause : on arrête le minuteur en cours (avant, il tournait jusqu'à 6 s quoi qu'on fasse)
                    if (timer.current !== null) {
                      window.clearInterval(timer.current);
                      timer.current = null;
                      setIsAnimating(false);
                      return;
                    }
                    setIsAnimating(true);
                    timer.current = window.setInterval(() => {
                      setAnimationStep((prev) => (prev + 1) % 4);
                    }, 1500);
                  }}
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isAnimating ? 'Pause' : 'Animer'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (timer.current !== null) window.clearInterval(timer.current);
                    timer.current = null;
                    setIsAnimating(false);
                    setAnimationStep(0);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Revenir au début
                </Button>
              </div>

              {/* Broadcasting Example */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Array A */}
                <div className="text-center">
                  <div className="text-sm font-semibold mb-2">Array A (2x3)</div>
                  <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                    {[1, 2, 3, 4, 5, 6].map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-10 h-10 border-2 bg-blue-100 border-blue-300 rounded flex items-center justify-center font-mono text-sm transition-all duration-500 ${
                          animationStep >= 1 ? 'scale-110 bg-blue-200' : ''
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operation */}
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-all duration-500 ${
                    animationStep >= 2 ? 'text-green-600 scale-125' : 'text-gray-400'
                  }`}>
                    +
                  </div>
                </div>

                {/* Array B */}
                <div className="text-center">
                  <div className="text-sm font-semibold mb-2">Array B (1x3)</div>
                  <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                    {[10, 20, 30].map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-10 h-10 border-2 bg-green-100 border-green-300 rounded flex items-center justify-center font-mono text-sm transition-all duration-500 ${
                          animationStep >= 1 ? 'scale-110 bg-green-200' : ''
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                  {animationStep >= 2 && (
                    <div className="mt-2 text-xs text-green-600 animate-pulse">
                      Répété pour chaque ligne
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              {animationStep >= 3 && (
                <div className="mt-6 text-center animate-fade-in">
                  <div className="text-sm font-semibold mb-2">Résultat (2x3)</div>
                  <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                    {[11, 22, 33, 14, 25, 36].map((val, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 border-2 bg-yellow-100 border-yellow-300 rounded flex items-center justify-center font-mono text-sm animate-bounce"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Broadcasting Rules */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Règles du Broadcasting</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Compatible</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>(3, 4)</span>
                      <span>+</span>
                      <span>(1, 4)</span>
                      <span>=</span>
                      <span className="text-green-600">(3, 4)</span>
                    </div>
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>(2, 3, 4)</span>
                      <span>+</span>
                      <span>(3, 4)</span>
                      <span>=</span>
                      <span className="text-green-600">(2, 3, 4)</span>
                    </div>
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>(5, 1)</span>
                      <span>+</span>
                      <span>(1, 3)</span>
                      <span>=</span>
                      <span className="text-green-600">(5, 3)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-red-700">Incompatible</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>(3, 4)</span>
                      <span>+</span>
                      <span>(2, 3)</span>
                      <span>=</span>
                      <span className="text-red-600">Erreur</span>
                    </div>
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>(2, 3, 4)</span>
                      <span>+</span>
                      <span>(2, 4)</span>
                      <span>=</span>
                      <span className="text-red-600">Erreur</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'python-vs-numpy-performance': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-red-600" />
            Performance: Python vs NumPy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Performance Comparison */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-800">Comparaison de Performance</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Python Pure */}
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    Python Pur
                  </h5>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto mb-3">
{`# Addition de 1M d'éléments
import time

a = list(range(1000000))
b = list(range(1000000))

start = time.time()
result = []
for i in range(len(a)):
    result.append(a[i] + b[i])
end = time.time()

print(f"Temps: {end-start:.3f}s")`}
                  </pre>
                  <div className="bg-red-100 p-2 rounded">
                    <div className="text-sm font-semibold text-red-800">Une opération Python par élément, dans une boucle</div>
                  </div>
                </div>

                {/* NumPy */}
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    NumPy
                  </h5>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto mb-3">
{`# Addition de 1M d'éléments
import numpy as np
import time

a = np.arange(1000000)
b = np.arange(1000000)

start = time.time()
result = a + b  # Vectorisé
end = time.time()

print(f"Temps: {end-start:.3f}s")`}
                  </pre>
                  <div className="bg-blue-100 p-2 rounded">
                    <div className="text-sm font-semibold text-blue-800">Une seule opération sur tout le tableau, exécutée en code compilé</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-6 bg-white p-4 rounded-lg border">
                <h5 className="font-semibold mb-3 text-gray-800">Métriques de Performance</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">Bien plus rapide</div>
                    <div className="text-sm text-green-700">L'écart dépend de l'opération et de la machine : le banc d'essai du module le mesure chez vous</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">Compact</div>
                    <div className="text-sm text-blue-700">Valeurs contiguës, type fixe</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">C/Fortran</div>
                    <div className="text-sm text-purple-700">Optimisé</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why NumPy is Faster */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-yellow-800">Pourquoi NumPy est-il si rapide ?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-yellow-700">Optimisations</h5>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>Code C/Fortran:</strong> Compilé, pas interprété</li>
                    <li>• <strong>Vectorisation:</strong> Opérations SIMD</li>
                    <li>• <strong>Mémoire contiguë:</strong> Cache CPU efficace</li>
                    <li>• <strong>Pas de boucles Python:</strong> Évite l'overhead</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-yellow-700">Avantages</h5>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>Broadcasting:</strong> Opérations intelligentes</li>
                    <li>• <strong>Types homogènes:</strong> Pas de vérification de type</li>
                    <li>• <strong>Parallélisation:</strong> algèbre linéaire multithread via BLAS ; opérations élémentaires mono-thread</li>
                    <li>• <strong>Algorithmes optimisés:</strong> BLAS/LAPACK</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'pandas-dataframe': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-green-600" />
            Structure DataFrame Pandas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* DataFrame Structure */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Anatomie d'un DataFrame</h4>
              
              <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
                {/* Column Headers */}
                <div className="bg-green-100 border-b border-green-200">
                  <div className="grid grid-cols-4 gap-px">
                    <div className="p-2 bg-gray-100 font-semibold text-xs text-center">Index</div>
                    <div className="p-2 font-semibold text-xs text-center cursor-pointer hover:bg-green-200 transition-colors"
                         onClick={() => setActiveElement(activeElement === 100 ? null : 100)}>
                      Nom
                    </div>
                    <div className="p-2 font-semibold text-xs text-center cursor-pointer hover:bg-green-200 transition-colors"
                         onClick={() => setActiveElement(activeElement === 101 ? null : 101)}>
                      Âge
                    </div>
                    <div className="p-2 font-semibold text-xs text-center cursor-pointer hover:bg-green-200 transition-colors"
                         onClick={() => setActiveElement(activeElement === 102 ? null : 102)}>
                      Ville
                    </div>
                  </div>
                </div>
                
                {/* Data Rows */}
                {[
                  { index: 0, nom: 'Alice', age: 25, ville: 'Paris' },
                  { index: 1, nom: 'Bob', age: 30, ville: 'Lyon' },
                  { index: 2, nom: 'Charlie', age: 35, ville: 'Marseille' }
                ].map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-4 gap-px border-b border-green-100 last:border-b-0">
                    <div className="p-2 bg-gray-50 text-xs text-center font-mono">{row.index}</div>
                    <div className="p-2 text-xs text-center cursor-pointer hover:bg-green-50 transition-colors"
                         onClick={() => setActiveElement(activeElement === rowIdx + 200 ? null : rowIdx + 200)}>
                      {row.nom}
                    </div>
                    <div className="p-2 text-xs text-center cursor-pointer hover:bg-green-50 transition-colors"
                         onClick={() => setActiveElement(activeElement === rowIdx + 200 ? null : rowIdx + 200)}>
                      {row.age}
                    </div>
                    <div className="p-2 text-xs text-center cursor-pointer hover:bg-green-50 transition-colors"
                         onClick={() => setActiveElement(activeElement === rowIdx + 200 ? null : rowIdx + 200)}>
                      {row.ville}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Explanations */}
              {activeElement === 100 && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Colonne 'Nom':</strong> Series de texte (dtype str depuis pandas 3.0, object avant)</p>
                  <p className="text-xs text-gray-600">Accès: df['Nom'] ou df.Nom</p>
                </div>
              )}
              {activeElement === 101 && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Colonne 'Âge':</strong> Series de type int64</p>
                  <p className="text-xs text-gray-600">Accès: df['Âge'] - Opérations numériques possibles</p>
                </div>
              )}
              {activeElement === 102 && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Colonne 'Ville':</strong> Series de texte (dtype str depuis pandas 3.0, object avant)</p>
                  <p className="text-xs text-gray-600">Accès: df['Ville'] - Opérations de texte possibles</p>
                </div>
              )}
              {activeElement !== null && activeElement >= 200 && activeElement < 203 && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Ligne {activeElement - 200}:</strong> Enregistrement complet</p>
                  <p className="text-xs text-gray-600">Accès: df.iloc[{activeElement - 200}] ou df.loc[{activeElement - 200}]</p>
                </div>
              )}
            </div>

            {/* DataFrame Operations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Opérations Courantes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Sélection</h5>
                  <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs">
{`# Sélectionner une colonne
df['Nom']

# Sélectionner plusieurs colonnes
df[['Nom', 'Âge']]

# Filtrer les lignes
df[df['Âge'] > 25]`}
                  </pre>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Manipulation</h5>
                  <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs">
{`# Ajouter une colonne
df['Salaire'] = [50000, 60000, 70000]

# Grouper et agréger
df.groupby('Ville')['Âge'].mean()

# Trier
df.sort_values('Âge')`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'matplotlib-workflow': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-purple-600" />
            Workflow Matplotlib
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Workflow Steps */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-purple-800">Étapes de Création d'un Graphique</h4>
              
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Import et Données",
                    code: `import matplotlib.pyplot as plt
import numpy as np

# Préparer les données
x = np.linspace(0, 10, 100)
y = np.sin(x)`,
                    color: "bg-red-100 border-red-300 text-red-800"
                  },
                  {
                    step: 2,
                    title: "Créer Figure et Axes",
                    code: `# Méthode 1: Simple
plt.figure(figsize=(10, 6))

# Méthode 2: Orientée objet
fig, ax = plt.subplots(figsize=(10, 6))`,
                    color: "bg-orange-100 border-orange-300 text-orange-800"
                  },
                  {
                    step: 3,
                    title: "Tracer les Données",
                    code: `# Méthode simple
plt.plot(x, y, 'b-', linewidth=2)

# Méthode orientée objet
ax.plot(x, y, 'b-', linewidth=2)`,
                    color: "bg-yellow-100 border-yellow-300 text-yellow-800"
                  },
                  {
                    step: 4,
                    title: "Personnaliser",
                    code: `# Ajouter titres et labels
plt.title('Fonction Sinus')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)`,
                    color: "bg-green-100 border-green-300 text-green-800"
                  },
                  {
                    step: 5,
                    title: "Afficher/Sauvegarder",
                    code: `# Afficher
plt.show()

# Sauvegarder
plt.savefig('sinus.png', dpi=300, bbox_inches='tight')`,
                    color: "bg-blue-100 border-blue-300 text-blue-800"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${item.color}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <h5 className="font-semibold">{item.title}</h5>
                    </div>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      {item.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Matplotlib */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-800">Architecture Matplotlib</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold text-blue-700 mb-2">Figure</h5>
                  <p className="text-xs text-gray-600 mb-2">Conteneur principal</p>
                  <ul className="text-xs space-y-1">
                    <li>• Taille (figsize)</li>
                    <li>• DPI</li>
                    <li>• Couleur de fond</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold text-green-700 mb-2">Axes</h5>
                  <p className="text-xs text-gray-600 mb-2">Zone de tracé</p>
                  <ul className="text-xs space-y-1">
                    <li>• Échelles X/Y</li>
                    <li>• Grille</li>
                    <li>• Légendes</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold text-purple-700 mb-2">Artists</h5>
                  <p className="text-xs text-gray-600 mb-2">Éléments visuels</p>
                  <ul className="text-xs space-y-1">
                    <li>• Lignes</li>
                    <li>• Texte</li>
                    <li>• Formes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'data-types-comparison': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-indigo-600" />
            Types de Données Python vs NumPy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-indigo-800">Comparaison des Types</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-indigo-200">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="border border-indigo-200 p-2 text-left text-sm font-semibold">Concept</th>
                      <th className="border border-indigo-200 p-2 text-left text-sm font-semibold">Python Pur</th>
                      <th className="border border-indigo-200 p-2 text-left text-sm font-semibold">NumPy</th>
                      <th className="border border-indigo-200 p-2 text-left text-sm font-semibold">Avantages NumPy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        concept: "Entiers",
                        python: "int (taille variable)",
                        numpy: "int8, int16, int32, int64",
                        advantage: "Contrôle précis de la mémoire"
                      },
                      {
                        concept: "Flottants",
                        python: "float (64-bit)",
                        numpy: "float16, float32, float64",
                        advantage: "Optimisation mémoire/précision"
                      },
                      {
                        concept: "Booléens",
                        python: "bool (objet Python, 24 à 28 octets)",
                        numpy: "bool_ (1 octet par élément)",
                        advantage: "Tableau compact : bien moins de mémoire"
                      },
                      {
                        concept: "Collections",
                        python: "list, tuple",
                        numpy: "ndarray",
                        advantage: "Homogène, contiguë, rapide"
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-indigo-25'} hover:bg-indigo-100 transition-colors cursor-pointer`}
                          onClick={() => setActiveElement(activeElement === idx + 300 ? null : idx + 300)}>
                        <td className="border border-indigo-200 p-2 text-sm font-medium">{row.concept}</td>
                        <td className="border border-indigo-200 p-2 text-sm font-mono text-red-600">{row.python}</td>
                        <td className="border border-indigo-200 p-2 text-sm font-mono text-blue-600">{row.numpy}</td>
                        <td className="border border-indigo-200 p-2 text-sm text-green-700">{row.advantage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Explanations */}
              {activeElement === 300 && (
                <div className="mt-4 p-4 bg-white rounded border border-indigo-200">
                  <h5 className="font-semibold mb-2">Entiers NumPy</h5>
                  <p className="text-sm mb-2">NumPy offre différentes tailles d'entiers pour optimiser l'utilisation mémoire :</p>
                  <ul className="text-sm space-y-1">
                    <li>• <code className="bg-gray-100 px-1 rounded">int8</code>: -128 à 127 (1 octet)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">int16</code>: -32 768 à 32 767 (2 octets)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">int32</code>: environ ±2,1 milliards (4 octets)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">int64</code>: environ ±9,2 × 10^18 (8 octets)</li>
                  </ul>
                </div>
              )}
              {activeElement === 301 && (
                <div className="mt-4 p-4 bg-white rounded border border-indigo-200">
                  <h5 className="font-semibold mb-2">Flottants NumPy</h5>
                  <p className="text-sm mb-2">Différentes précisions selon les besoins :</p>
                  <ul className="text-sm space-y-1">
                    <li>• <code className="bg-gray-100 px-1 rounded">float16</code>: demi-précision (2 octets)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">float32</code>: simple précision (4 octets)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">float64</code>: double précision (8 octets), le type par défaut</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Memory Usage Example */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-yellow-800">Exemple d'Usage Mémoire</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold text-red-700 mb-2">Liste Python (1M entiers)</h5>
                  <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mb-2">
{`import sys
data = list(range(1000000))
liste = sys.getsizeof(data)                    # le tableau de pointeurs seulement
entiers = sum(sys.getsizeof(x) for x in data)  # les objets int eux-mêmes
print(f"Mémoire : {liste + entiers} octets")
# Résultat typique (système 64 bits): ~36 Mo, soit ~8 Mo de pointeurs + ~28 Mo d'entiers`}
                  </pre>
                  <div className="text-xs text-red-600">Chaque entier Python : 28 octets (Python 64 bits), plus un pointeur de 8 octets dans la liste</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold text-blue-700 mb-2">Array NumPy (1M entiers)</h5>
                  <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mb-2">
{`import numpy as np
data = np.arange(1000000, dtype=np.int32)
print(f"Mémoire : {data.nbytes} octets")
# Résultat : 4000000 octets exactement (environ 4 Mo)`}
                  </pre>
                  <div className="text-xs text-blue-600">4 octets par valeur, sans surcoût par élément</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),

    'jupyter-workflow': (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Workflow Jupyter Notebook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Jupyter Workflow Steps */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-orange-800">Étapes du Workflow Data Science</h4>
              
              <div className="grid gap-4">
                {[
                  { step: 1, title: "Import & Setup", code: "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt", desc: "Importation des bibliothèques essentielles" },
                  { step: 2, title: "Data Loading", code: "df = pd.read_csv('data.csv')\ndf.head()", desc: "Chargement et aperçu des données" },
                  { step: 3, title: "Exploration", code: "df.info()\ndf.describe()\ndf.isnull().sum()", desc: "Analyse exploratoire des données" },
                  { step: 4, title: "Visualization", code: "plt.figure(figsize=(10,6))\nplt.hist(df['column'])\nplt.show()", desc: "Création de visualisations" },
                  { step: 5, title: "Analysis", code: "correlation = df.corr()\nresults = model.fit(X, y)", desc: "Analyse statistique et modélisation" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded border-l-4 border-orange-400 bg-white cursor-pointer transition-all duration-300 ${
                    activeElement === idx + 400 ? 'shadow-lg scale-105' : 'hover:shadow-md'
                  }`}
                       onClick={() => setActiveElement(activeElement === idx + 400 ? null : idx + 400)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <h5 className="font-semibold text-orange-800">{item.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                    {activeElement === idx + 400 && (
                      <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                        {item.code}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Jupyter Features */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Avantages de Jupyter</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Interactivité</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Exécution cellule par cellule</li>
                    <li>• Visualisations inline</li>
                    <li>• Debugging interactif</li>
                    <li>• Variables persistantes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Documentation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Markdown intégré</li>
                    <li>• Équations LaTeX</li>
                    <li>• Graphiques intégrés</li>
                    <li>• Export multiple formats</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  return schemas[type] || null;
};

export default PythonInteractiveSchemas;