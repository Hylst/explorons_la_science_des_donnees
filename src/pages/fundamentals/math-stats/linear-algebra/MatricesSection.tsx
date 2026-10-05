
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Grid3X3, Eye, Zap } from "lucide-react";

const MatricesSection = () => {
  const [showMatrixDemo, setShowMatrixDemo] = useState(false);
  const [matrixA] = useState([[2, 1], [3, 4]]);
  const [vectorX] = useState([3, 2]);

  const multiplyMatrixVector = () => {
    return [
      matrixA[0][0] * vectorX[0] + matrixA[0][1] * vectorX[1],
      matrixA[1][0] * vectorX[0] + matrixA[1][1] * vectorX[1]
    ];
  };

  return (
    <section id="matrices" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">2. Matrices : Les Machines à Transformer l'Espace</h2>
      
      <CourseHighlight title="🔧 Analogie : La matrice comme une usine" type="concept">
        <p>
          Imaginez une matrice comme une usine : vous entrez un vecteur par un côté, 
          la machine le transforme selon ses "réglages" (les nombres dans la matrice), 
          et vous récupérez un nouveau vecteur de l'autre côté !
        </p>
      </CourseHighlight>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-purple-600" />
              Anatomie d'une matrice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CourseEquation latex="A = \begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix}" />
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Lecture intuitive :</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Ligne 1 :</strong> "Recette" pour la première coordonnée du résultat</li>
                  <li>• <strong>Ligne 2 :</strong> "Recette" pour la deuxième coordonnée</li>
                  <li>• <strong>Colonnes :</strong> Influence de chaque variable d'entrée</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">En pratique :</h4>
                <p className="text-sm">
                  Une matrice 2×2 peut représenter une rotation, une mise à l'échelle, 
                  ou même une transformation plus complexe dans le plan !
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Transformation en action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Voyons comment la matrice A transforme le vecteur x = [3, 2] :
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <CourseEquation latex="\begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 3 \\ 2 \end{pmatrix}" />
              </div>

              <Button 
                onClick={() => setShowMatrixDemo(!showMatrixDemo)}
                className="w-full"
              >
                {showMatrixDemo ? "Masquer" : "Voir"} le calcul détaillé
              </Button>

              {showMatrixDemo && (
                <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Ligne 1 :</strong> 2×3 + 1×2 = {2*3 + 1*2}</p>
                  <p className="text-sm"><strong>Ligne 2 :</strong> 3×3 + 4×2 = {3*3 + 4*2}</p>
                  <p className="text-sm font-semibold">
                    <strong>Résultat :</strong> [{multiplyMatrixVector()[0]}, {multiplyMatrixVector()[1]}]
                  </p>
                  <p className="text-xs text-gray-600">
                    Le point (3,2) a été transformé en ({multiplyMatrixVector()[0]},{multiplyMatrixVector()[1]}) !
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🔍 Zoom sur : Types de matrices importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Matrice Identité</h4>
              <CourseEquation latex="I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}" />
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs">
                  <strong>Effet :</strong> Ne change rien ! Comme multiplier par 1.
                </p>
                <p className="text-xs mt-1">
                  <strong>Usage :</strong> Point de référence, initialisation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Matrice de Rotation</h4>
              <CourseEquation latex="R = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}" />
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs">
                  <strong>Effet :</strong> Fait tourner les vecteurs de θ degrés
                </p>
                <p className="text-xs mt-1">
                  <strong>Usage :</strong> Computer vision, robotique
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">Matrice d'Échelle</h4>
              <CourseEquation latex="S = \begin{pmatrix} s_x & 0 \\ 0 & s_y \end{pmatrix}" />
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs">
                  <strong>Effet :</strong> Étire ou compresse selon x et y
                </p>
                <p className="text-xs mt-1">
                  <strong>Usage :</strong> Normalisation, redimensionnement
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseHighlight title="🎯 Exercice corrigé : Transformation d'image" type="example">
        <div className="space-y-4">
          <p><strong>Problème :</strong> Vous voulez faire tourner une image de 90° dans le sens antihoraire. Quelle matrice utiliser ?</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Solution :</strong></p>
            <p className="text-sm mb-2">Pour θ = 90°, cos(90°) = 0 et sin(90°) = 1</p>
            <CourseEquation latex="R_{90°} = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}" />
            <p className="text-sm mt-2">
              <strong>Test :</strong> Le point (1,0) devient (0,1) → rotation parfaite ! ✅
            </p>
            <div className="bg-blue-100 p-3 rounded-lg mt-3">
              <p className="text-sm">
                <strong>Dans le code :</strong> Cette matrice est utilisée dans tous les logiciels de retouche photo 
                pour les rotations d'images !
              </p>
            </div>
          </div>
        </div>
      </CourseHighlight>

      {/* Matrix Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Opérations Matricielles Fondamentales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Addition et Soustraction :</h4>
                <CourseEquation latex="A + B = \begin{pmatrix} a_{11}+b_{11} & a_{12}+b_{12} \\ a_{21}+b_{21} & a_{22}+b_{22} \end{pmatrix}" />
                <p className="text-sm mt-2">
                  <strong>Condition :</strong> Les matrices doivent avoir les mêmes dimensions !
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Multiplication par un scalaire :</h4>
                <CourseEquation latex="kA = \begin{pmatrix} ka_{11} & ka_{12} \\ ka_{21} & ka_{22} \end{pmatrix}" />
                <p className="text-sm mt-2">
                  Multiplie chaque élément par le scalaire k.
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Applications :</strong> Ajustement de luminosité d'images, normalisation de données
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-green-600" />
              Multiplication Matricielle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Règle fondamentale :</h4>
                <CourseEquation latex="(AB)_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj}" />
                <p className="text-sm mt-2">
                  Pour multiplier A(m×n) par B(n×p), le nombre de colonnes de A doit égaler le nombre de lignes de B.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Propriétés importantes :</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Non-commutative :</strong> AB ≠ BA en général</li>
                  <li>• <strong>Associative :</strong> (AB)C = A(BC)</li>
                  <li>• <strong>Distributive :</strong> A(B+C) = AB + AC</li>
                </ul>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Piège courant :</strong> L'ordre compte ! AB ≠ BA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Matrix Properties */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🔍 Propriétés Avancées des Matrices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Transposition Détaillée</h4>
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <CourseEquation latex="(A^T)_{ij} = A_{ji}" />
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés :</p>
                  <ul className="text-xs space-y-1">
                    <li>• (A^T)^T = A</li>
                    <li>• (A + B)^T = A^T + B^T</li>
                    <li>• (AB)^T = B^T A^T</li>
                    <li>• (kA)^T = kA^T</li>
                  </ul>
                </div>
                <p className="text-sm">
                  <strong>Usage :</strong> Calculs de covariance, optimisation
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-purple-600">Trace d'une Matrice</h4>
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <CourseEquation latex="\text{tr}(A) = \sum_{i=1}^{n} a_{ii}" />
                <p className="text-sm">
                  La trace est la somme des éléments diagonaux.
                </p>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés :</p>
                  <ul className="text-xs space-y-1">
                    <li>• tr(A + B) = tr(A) + tr(B)</li>
                    <li>• tr(kA) = k·tr(A)</li>
                    <li>• tr(AB) = tr(BA)</li>
                  </ul>
                </div>
                <p className="text-sm">
                  <strong>Usage :</strong> Réseaux de neurones, analyse spectrale
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-green-600">Rang d'une Matrice</h4>
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <p className="text-sm">
                  Le rang est le nombre maximal de lignes (ou colonnes) linéairement indépendantes.
                </p>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés :</p>
                  <ul className="text-xs space-y-1">
                    <li>• rang(A) ≤ min(m,n) pour A(m×n)</li>
                    <li>• rang(AB) ≤ min(rang(A), rang(B))</li>
                    <li>• rang(A) = rang(A^T)</li>
                  </ul>
                </div>
                <p className="text-sm">
                  <strong>Usage :</strong> Détection de redondance, compression
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Practical Example */}
      <CourseHighlight title="🎯 Exercice avancé : Transformation d'image par matrices" type="example">
        <div className="space-y-4">
          <p><strong>Problème :</strong> Appliquer une rotation de 45° suivie d'une mise à l'échelle (×2 en x, ×0.5 en y) à un pixel situé en (4, 2).</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-semibold mb-2">Étape 1 : Matrice de rotation (45°)</h5>
                <CourseEquation latex="R = \begin{pmatrix} \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} \\ \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} \end{pmatrix} \approx \begin{pmatrix} 0.707 & -0.707 \\ 0.707 & 0.707 \end{pmatrix}" />
              </div>
              <div>
                <h5 className="font-semibold mb-2">Étape 2 : Matrice d'échelle</h5>
                <CourseEquation latex="S = \begin{pmatrix} 2 & 0 \\ 0 & 0.5 \end{pmatrix}" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold">Composition des transformations :</h5>
                <CourseEquation latex="T = S \cdot R = \begin{pmatrix} 2 & 0 \\ 0 & 0.5 \end{pmatrix} \begin{pmatrix} 0.707 & -0.707 \\ 0.707 & 0.707 \end{pmatrix} = \begin{pmatrix} 1.414 & -1.414 \\ 0.354 & 0.354 \end{pmatrix}" />
              </div>
              
              <div>
                <h5 className="font-semibold">Application au point (4, 2) :</h5>
                <CourseEquation latex="\begin{pmatrix} 1.414 & -1.414 \\ 0.354 & 0.354 \end{pmatrix} \begin{pmatrix} 4 \\ 2 \end{pmatrix} = \begin{pmatrix} 2.828 \\ 2.121 \end{pmatrix}" />
              </div>
              
              <div className="bg-blue-100 p-3 rounded">
                <p className="text-sm">
                  <strong>Résultat :</strong> Le pixel (4, 2) devient (2.83, 2.12) après transformation !
                </p>
                <p className="text-xs mt-1">
                  <strong>Note :</strong> L'ordre des transformations compte : rotation puis échelle ≠ échelle puis rotation
                </p>
              </div>
            </div>
          </div>
        </div>
      </CourseHighlight>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Le saviez-vous ? Les matrices en Deep Learning
        </h4>
        <div className="space-y-3 text-sm text-purple-700">
          <p>
            Dans un réseau de neurones, chaque couche est une multiplication matricielle ! 
            Un réseau "dense" avec 1000 neurones d'entrée et 500 de sortie utilise une matrice 500×1000.
          </p>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs">
              <strong>Exemple concret :</strong> GPT-3 répartit ses 175 milliards de paramètres dans des centaines de matrices.
              Pour chaque mot qu'il produit, cela représente des centaines de milliards d'opérations arithmétiques (multiplications et additions) !
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg mt-3">
            <p className="text-xs">
              <strong>Ordre de grandeur :</strong> les paramètres d'un réseau de neurones sont stockés dans des matrices. GPT-3 en compte 175 milliards (Brown et al., 2020).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatricesSection;
