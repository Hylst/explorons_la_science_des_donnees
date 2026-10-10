
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Calculator, Target, Layers, TrendingUp, RotateCcw, AlertCircle, ArrowDown } from "lucide-react";

const OperationsSection = () => {
  const [showDeterminantCalc, setShowDeterminantCalc] = useState(false);
  const [matrix] = useState([[2, 3], [1, 4]]);

  const calculateDeterminant = () => {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  };

  return (
    <section id="operations" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">4. Opérations Matricielles : Les Règles du Jeu</h2>
      
      <CourseHighlight title="Rappel : Les matrices comme des règles de jeu" type="concept">
        <p>
          Chaque opération matricielle a ses propres règles, comme aux échecs. 
          Comprendre ces règles vous donne le pouvoir de manipuler l'information à volonté.
        </p>
      </CourseHighlight>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-blue-600" />
              Transposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                La transposée A^T s'obtient en "retournant" la matrice le long de sa diagonale :
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <CourseEquation latex="A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}" />
                  <ArrowDown className="h-5 w-5 mx-auto my-2 text-blue-600" aria-hidden="true" />
                  <CourseEquation latex="A^T = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}" />
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-semibold text-green-700 mb-2">Applications pratiques :</h5>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Changer l'organisation des données</li>
                  <li>• Calculs de covariance en statistiques</li>
                  <li>• Optimisation en machine learning</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              Déterminant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Le déterminant mesure "l'effet d'échelle" d'une transformation :
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm mb-2">Matrice exemple :</p>
                <CourseEquation latex="\begin{pmatrix} 2 & 3 \\ 1 & 4 \end{pmatrix}" />
              </div>

              <Button 
                onClick={() => setShowDeterminantCalc(!showDeterminantCalc)}
                className="w-full"
              >
                {showDeterminantCalc ? "Masquer" : "Calculer"} le déterminant
              </Button>

              {showDeterminantCalc && (
                <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Formule :</strong> det(A) = ad - bc
                  </p>
                  <p className="text-sm">
                    <strong>Calcul :</strong> (2 × 4) - (3 × 1) = 8 - 3 = {calculateDeterminant()}
                  </p>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs">
                      <strong>Interprétation :</strong> Cette transformation multiplie les aires par {calculateDeterminant()}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoom sur : L'inverse d'une matrice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Concept intuitif</h4>
                <p className="text-sm mb-3">
                  L'inverse A^(-1) "annule" l'effet de A. Si A fait tourner de 90°, 
                  alors A^(-1) fait tourner de -90°.
                </p>
                <CourseEquation latex="A \times A^{-1} = I" />
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-xs">
                    Comme 5 × (1/5) = 1, mais pour les matrices.
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Condition d'existence</h4>
                <div className="space-y-3">
                  <Badge className="bg-green-100 text-green-800">
                    det(A) ≠ 0 → Inverse existe
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    det(A) = 0 → Pas d'inverse
                  </Badge>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs">
                      <strong>Intuition :</strong> Si le déterminant est 0, la transformation "écrase" 
                      l'espace en une dimension inférieure. Impossible de revenir en arrière.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CourseHighlight title="Exemple concret : Résoudre un système d'équations" type="example">
              <div className="space-y-3">
                <p><strong>Problème :</strong> Résoudre le système 2x + 3y = 7 et x + 4y = 6</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2"><strong>En notation matricielle :</strong></p>
                  <CourseEquation latex="\begin{pmatrix} 2 & 3 \\ 1 & 4 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 7 \\ 6 \end{pmatrix}" />
                  <p className="text-sm mt-2"><strong>Solution :</strong> x = A^(-1) × b</p>
                  <div className="bg-green-100 p-2 rounded mt-2">
                    <p className="text-xs">En pratique : x = 2, y = 1 → Vérifiez : 2×2 + 3×1 = 7</p>
                  </div>
                </div>
              </div>
            </CourseHighlight>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Trace d'une matrice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <CourseEquation latex="\text{tr}(A) = \sum_{i=1}^{n} a_{ii}" />
              <p className="text-sm">
                La trace est la somme des éléments diagonaux. Simple, mais utile.
              </p>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs">
                  <strong>Propriété magique :</strong> tr(A) = somme des valeurs propres
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg">Rang d'une matrice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                Le rang mesure la "dimension effective" de l'information dans la matrice.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs">
                  <strong>Intuition :</strong> Combien de directions indépendantes la matrice peut-elle représenter ?
                </p>
                <p className="text-xs mt-1">
                  <strong>Usage :</strong> Réduction de dimensionnalité, compression de données
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3">Astuce de mémorisation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">Transposée</p>
            <p className="text-xs text-gray-600">"Miroir diagonal"</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">Déterminant</p>
            <p className="text-xs text-gray-600">"Facteur d'échelle"</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">Inverse</p>
            <p className="text-xs text-gray-600">"Marche arrière"</p>
          </div>
        </div>
      </div>

      {/* Advanced Operations Section */}
      <div className="mt-12 space-y-8">
        <h3 className="text-2xl font-bold mb-6">Opérations Avancées : Les Super-Pouvoirs des Matrices</h3>
        
        {/* Matrix Inverse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Matrice Inverse : L'Opération "Annuler"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CourseHighlight title="Analogie : L'inverse comme un bouton Annuler matriciel" type="concept">
                <p>
                  Si une matrice A transforme un vecteur, son inverse A^(-1) fait exactement l'opération contraire. 
                  C'est comme avoir un bouton "Annuler" pour les transformations géométriques.
                </p>
              </CourseHighlight>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Définition et Propriétés :</h4>
                  <CourseEquation latex="A \cdot A^{-1} = A^{-1} \cdot A = I" />
                  <div className="space-y-2 mt-3 text-sm">
                    <p><strong>Condition d'existence :</strong> det(A) ≠ 0</p>
                    <p><strong>Propriété :</strong> (AB)^(-1) = B^(-1)A^(-1)</p>
                    <p><strong>Propriété :</strong> (A^(-1))^(-1) = A</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Calcul pour matrice 2×2 :</h4>
                  <CourseEquation latex="A^{-1} = \frac{1}{ad-bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />
                  <div className="bg-white p-3 rounded mt-3">
                    <p className="text-sm font-semibold">Exemple pratique :</p>
                    <p className="text-xs">A = [[3,1],[2,1]] → det = 1</p>
                    <p className="text-xs">A^(-1) = [[1,-1],[-2,3]]</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">À quoi ça sert :</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded">
                    <p className="font-semibold text-blue-600">Résolution de systèmes</p>
                    <p className="text-xs">Ax = b → x = A^(-1)b</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-semibold text-green-600">Cryptographie</p>
                    <p className="text-xs">Chiffrement/déchiffrement</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-semibold text-purple-600">Graphiques 3D</p>
                    <p className="text-xs">Transformations inverses</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eigenvalues and Eigenvectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Valeurs et Vecteurs Propres : Les Directions Privilégiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CourseHighlight title="Analogie : Les vecteurs propres comme des rails de transformation" type="concept">
                <p>
                  Imaginez une transformation matricielle comme un flux d'eau. Les vecteurs propres sont les directions 
                  où l'eau coule naturellement, sans changer de direction - elle ne fait qu'accélérer ou ralentir.
                </p>
              </CourseHighlight>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Définition Mathématique :</h4>
                  <CourseEquation latex="A\mathbf{v} = \lambda\mathbf{v}" />
                  <div className="space-y-2 mt-3 text-sm">
                    <p><strong>λ (lambda) :</strong> valeur propre (scalaire)</p>
                    <p><strong>v :</strong> vecteur propre (direction)</p>
                    <p><strong>Interprétation :</strong> A étire v par un facteur λ</p>
                  </div>
                  <Badge className="mt-2 bg-purple-100 text-purple-800">Fondamental</Badge>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Calcul des Valeurs Propres :</h4>
                  <CourseEquation latex="\det(A - \lambda I) = 0" />
                  <div className="bg-white p-3 rounded mt-3">
                    <p className="text-sm font-semibold">Exemple 2×2 :</p>
                    <p className="text-xs">A = [[3,1],[0,2]]</p>
                    <p className="text-xs">Polynôme : (3-λ)(2-λ) = 0</p>
                    <p className="text-xs text-green-600">λ₁ = 3, λ₂ = 2</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Quelques applications :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded">
                      <p className="font-semibold text-blue-600">Analyse en Composantes Principales (PCA)</p>
                      <p className="text-xs">Réduction de dimensionnalité, compression d'images</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-semibold text-green-600">PageRank de Google</p>
                      <p className="text-xs">Classement des pages web par importance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded">
                      <p className="font-semibold text-purple-600">Reconnaissance Faciale</p>
                      <p className="text-xs">Eigenfaces pour identifier les visages</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-semibold text-red-600">Systèmes Dynamiques</p>
                      <p className="text-xs">Stabilité, oscillations, chaos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matrix Decompositions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-orange-600" />
              Décompositions Matricielles : Démonter pour Mieux Comprendre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CourseHighlight title="Analogie : Décomposer comme démonter un moteur" type="concept">
                <p>
                  Décomposer une matrice, c'est comme démonter un moteur complexe en pièces simples. 
                  Chaque pièce a un rôle spécifique, et ensemble elles reconstruisent la machine originale.
                </p>
              </CourseHighlight>

              <div className="space-y-6">
                {/* LU Decomposition */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">LU</Badge>
                    Décomposition LU : Lower × Upper
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <CourseEquation latex="A = L \times U" />
                      <div className="text-sm mt-2 space-y-1">
                        <p><strong>L :</strong> Matrice triangulaire inférieure</p>
                        <p><strong>U :</strong> Matrice triangulaire supérieure</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold">Applications :</p>
                      <ul className="text-xs space-y-1">
                        <li>• Résolution rapide de systèmes</li>
                        <li>• Calcul de déterminant</li>
                        <li>• Inversion matricielle</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SVD */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">SVD</Badge>
                    Décomposition en Valeurs Singulières : Le Couteau Suisse
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <CourseEquation latex="A = U \Sigma V^T" />
                      <div className="text-sm mt-2 space-y-1">
                        <p><strong>U, V :</strong> Matrices orthogonales</p>
                        <p><strong>Σ :</strong> Matrice diagonale (valeurs singulières)</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold">Applications :</p>
                      <ul className="text-xs space-y-1">
                        <li>• Compression d'images (approximation de rang faible)</li>
                        <li>• Systèmes de recommandation</li>
                        <li>• Analyse de données (PCA)</li>
                        <li>• Traitement du langage naturel</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* QR Decomposition */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">QR</Badge>
                    Décomposition QR : Orthogonal × Triangulaire
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <CourseEquation latex="A = Q \times R" />
                      <div className="text-sm mt-2 space-y-1">
                        <p><strong>Q :</strong> Matrice orthogonale</p>
                        <p><strong>R :</strong> Matrice triangulaire supérieure</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold">Utilisations :</p>
                      <ul className="text-xs space-y-1">
                        <li>• Régression linéaire</li>
                        <li>• Calcul de valeurs propres</li>
                        <li>• Orthogonalisation de Gram-Schmidt</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-3">Exemple Concret : Compression d'Image par SVD</h4>
                <div className="space-y-3">
                  <p className="text-sm">
                    Une image 1000×1000 pixels = 1 million de nombres. Avec SVD, on peut la compresser 
                    en gardant seulement les 50 plus grandes valeurs singulières.
                  </p>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm">
                      <strong>Compression :</strong> 1,000,000 → 100,050 nombres (90 % de réduction)<br/>
                      <strong>Qualité :</strong> correcte pour une image peu détaillée ; les détails fins se perdent quand on garde peu de valeurs singulières
                    </p>
                  </div>
                  <p className="text-xs text-purple-600">
                    Le format JPEG repose sur une idée voisine (garder ce qui compte le plus), mais avec une autre transformation : la transformée en cosinus discrète.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OperationsSection;
