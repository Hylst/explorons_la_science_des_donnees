import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Square, Eye, Calculator, Triangle, Zap, RotateCcw } from "lucide-react";

/**
 * MatrixTypesSection Component
 * 
 * Comprehensive section covering all important matrix types:
 * - Square matrices
 * - Identity matrices
 * - Null/Zero matrices
 * - Diagonal matrices
 * - Symmetric and antisymmetric matrices
 * - Triangular matrices (upper/lower)
 * - Invertible matrices
 * 
 * Each type includes definitions, properties, examples, and practical applications.
 */
const MatrixTypesSection = () => {
  const [showInverseDemo, setShowInverseDemo] = useState(false);

  return (
    <section id="matrix-types" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">4. Types de Matrices Importantes : La Boîte à Outils</h2>
      
      <CourseHighlight title="🧰 Analogie : Les matrices comme des outils spécialisés" type="concept">
        <p>
          Chaque type de matrice est comme un outil spécialisé dans une boîte à outils. 
          Un marteau pour enfoncer des clous, un tournevis pour visser... 
          Chaque matrice a sa spécialité et ses applications optimales !
        </p>
      </CourseHighlight>

      {/* Basic Matrix Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5 text-blue-600" />
              Matrices Carrées et Identité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Matrice Carrée :</h4>
                <p className="text-sm mb-2">
                  Une matrice n×n où le nombre de lignes égale le nombre de colonnes.
                </p>
                <CourseEquation latex="A = \begin{pmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix}" />
                <Badge className="mt-2 bg-blue-100 text-blue-800">Fondamental</Badge>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Matrice Identité I :</h4>
                <CourseEquation latex="I = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}" />
                <p className="text-sm mt-2">
                  <strong>Propriété magique :</strong> AI = IA = A pour toute matrice A compatible
                </p>
                <div className="bg-white p-2 rounded mt-2">
                  <p className="text-xs">
                    <strong>Applications :</strong> Initialisation, point de référence, transformations neutres
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Matrices Nulles et Diagonales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Matrice Nulle 0 :</h4>
                <CourseEquation latex="0 = \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}" />
                <p className="text-sm mt-2">
                  <strong>Propriété :</strong> A + 0 = A, A × 0 = 0
                </p>
                <p className="text-xs mt-1">L'élément neutre de l'addition matricielle</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Matrice Diagonale D :</h4>
                <CourseEquation latex="D = \begin{pmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \\ 0 & 0 & d_3 \end{pmatrix}" />
                <p className="text-sm mt-2">
                  Seuls les éléments diagonaux sont non-nuls.
                </p>
                <div className="bg-white p-2 rounded mt-2">
                  <p className="text-xs">
                    <strong>Avantage :</strong> Calculs très rapides ! D^n se calcule en O(n) au lieu de O(n³)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symmetric and Antisymmetric Matrices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-green-600" />
            Matrices Symétriques et Antisymétriques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Matrice Symétrique</h4>
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <p className="text-sm">
                  Une matrice A est symétrique si A = A^T
                </p>
                <CourseEquation latex="A = \begin{pmatrix} 2 & 3 & 1 \\ 3 & 5 & 4 \\ 1 & 4 & 6 \end{pmatrix}" />
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés importantes :</p>
                  <ul className="text-xs space-y-1">
                    <li>• Toutes les valeurs propres sont réelles</li>
                    <li>• Les vecteurs propres sont orthogonaux</li>
                    <li>• Diagonalisable par une matrice orthogonale</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p className="text-xs">
                    <strong>Applications :</strong> Matrices de covariance, formes quadratiques, optimisation
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-red-600">Matrice Antisymétrique</h4>
              <div className="bg-red-50 p-4 rounded-lg space-y-3">
                <p className="text-sm">
                  Une matrice A est antisymétrique si A = -A^T
                </p>
                <CourseEquation latex="A = \begin{pmatrix} 0 & 2 & -1 \\ -2 & 0 & 3 \\ 1 & -3 & 0 \end{pmatrix}" />
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés importantes :</p>
                  <ul className="text-xs space-y-1">
                    <li>• Diagonale principale = 0</li>
                    <li>• Valeurs propres imaginaires pures</li>
                    <li>• Déterminant = 0 si dimension impaire</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-2 rounded">
                  <p className="text-xs">
                    <strong>Applications :</strong> Rotations 3D, mécanique quantique, théorie des groupes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triangular Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Triangle className="h-5 w-5 text-orange-600" />
              Matrices Triangulaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Triangulaire Supérieure :</h4>
                <CourseEquation latex="U = \begin{pmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{pmatrix}" />
                <p className="text-sm mt-2">
                  Tous les éléments sous la diagonale sont nuls.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Triangulaire Inférieure :</h4>
                <CourseEquation latex="L = \begin{pmatrix} l_{11} & 0 & 0 \\ l_{21} & l_{22} & 0 \\ l_{31} & l_{32} & l_{33} \end{pmatrix}" />
                <p className="text-sm mt-2">
                  Tous les éléments au-dessus de la diagonale sont nuls.
                </p>
              </div>

              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Avantages :</strong> Résolution rapide de systèmes linéaires, décomposition LU
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-indigo-600" />
              Matrices Inversibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Définition :</h4>
                <p className="text-sm mb-2">
                  Une matrice A est inversible s'il existe A^(-1) tel que :
                </p>
                <CourseEquation latex="A \cdot A^{-1} = A^{-1} \cdot A = I" />
                <p className="text-sm mt-2">
                  <strong>Condition :</strong> det(A) ≠ 0
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formule 2×2 :</h4>
                <CourseEquation latex="A^{-1} = \frac{1}{\det(A)} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />
                <p className="text-xs mt-2">Pour A = [[a,b],[c,d]]</p>
              </div>

              <Button 
                onClick={() => setShowInverseDemo(!showInverseDemo)}
                className="w-full"
              >
                {showInverseDemo ? "Masquer" : "Voir"} exemple de calcul
              </Button>

              {showInverseDemo && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-semibold">Exemple : A = [[2,1],[3,4]]</p>
                  <p className="text-sm">det(A) = 2×4 - 1×3 = 5</p>
                  <CourseEquation latex="A^{-1} = \frac{1}{5} \begin{pmatrix} 4 & -1 \\ -3 & 2 \end{pmatrix} = \begin{pmatrix} 0.8 & -0.2 \\ -0.6 & 0.4 \end{pmatrix}" />
                  <p className="text-xs text-green-600">Vérification : A × A^(-1) = I ✓</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practical Applications */}
      <CourseHighlight title="🎯 Applications pratiques : Système de recommandation matriciel" type="example">
        <div className="space-y-4">
          <p><strong>Problème :</strong> Netflix utilise des matrices pour recommander des films. Comment ça marche ?</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2">Matrice Utilisateurs-Films R :</h5>
                <div className="bg-white p-3 rounded text-center">
                  <table className="text-xs mx-auto">
                    <thead>
                      <tr>
                        <th className="px-2"></th>
                        <th className="px-2">Action</th>
                        <th className="px-2">Comédie</th>
                        <th className="px-2">Drame</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 font-semibold">Alice</td>
                        <td className="px-2">5</td>
                        <td className="px-2">?</td>
                        <td className="px-2">3</td>
                      </tr>
                      <tr>
                        <td className="px-2 font-semibold">Bob</td>
                        <td className="px-2">4</td>
                        <td className="px-2">2</td>
                        <td className="px-2">?</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Décomposition matricielle :</h5>
                <CourseEquation latex="R \approx U \times V^T" />
                <p className="text-sm mt-2">
                  U = préférences utilisateurs<br/>
                  V = caractéristiques films
                </p>
              </div>
            </div>
            
            <div className="bg-blue-100 p-3 rounded mt-4">
              <p className="text-sm">
                <strong>Magie :</strong> En décomposant la matrice incomplète, on peut prédire les notes manquantes ! 
                La factorisation matricielle a été popularisée par le Netflix Prize (2006-2009), un concours de prédiction de notes de films.
              </p>
            </div>
          </div>
        </div>
      </CourseHighlight>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Récapitulatif : Quand utiliser quel type de matrice ?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-blue-600">Identité & Diagonale</p>
            <p className="text-xs">Initialisation, mise à l'échelle, calculs rapides</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-green-600">Symétrique</p>
            <p className="text-xs">Covariance, optimisation, physique</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-red-600">Antisymétrique</p>
            <p className="text-xs">Rotations, transformations 3D</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-orange-600">Triangulaire</p>
            <p className="text-xs">Résolution de systèmes, décompositions</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-purple-600">Inversible</p>
            <p className="text-xs">Résolution d'équations, transformations réversibles</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold text-gray-600">Nulle</p>
            <p className="text-xs">Élément neutre, initialisation, masquage</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrixTypesSection;