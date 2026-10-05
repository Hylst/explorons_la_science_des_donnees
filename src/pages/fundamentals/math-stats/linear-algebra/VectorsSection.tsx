
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Calculator, Eye, Lightbulb } from "lucide-react";

const VectorsSection = () => {
  const [showVectorCalculation, setShowVectorCalculation] = useState(false);
  const [vectorA, setVectorA] = useState([3, 4]);
  const [vectorB, setVectorB] = useState([1, 2]);

  const calculateDotProduct = () => {
    return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
  };

  const calculateMagnitude = (vector: number[]) => {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  };

  return (
    <section id="vectors" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">1. Vecteurs : Les Coordonnées de Vos Données</h2>
      
      <CourseHighlight title="🧭 Rappel fondamental" type="concept">
        <p>
          Un vecteur, c'est comme l'adresse GPS d'un point dans l'espace. 
          Au lieu de dire "123 rue de la Paix", on dit "3 unités vers la droite, 4 unités vers le haut".
        </p>
      </CourseHighlight>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Visualisation intuitive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Imaginez un vecteur comme une flèche dans l'espace :
              </p>
              <CourseEquation latex="\vec{v} = \begin{pmatrix} 3 \\ 4 \end{pmatrix}" />
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">En pratique :</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Position d'un robot :</strong> [x=3m, y=4m]</li>
                  <li>• <strong>Caractéristiques client :</strong> [âge=30, salaire=50k€]</li>
                  <li>• <strong>Pixel d'image :</strong> [rouge=255, vert=128, bleu=0]</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-600" />
              Calculateur interactif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Vecteur A: [{vectorA[0]}, {vectorA[1]}]</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="number" 
                    value={vectorA[0]} 
                    onChange={(e) => setVectorA([parseInt(e.target.value) || 0, vectorA[1]])}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <input 
                    type="number" 
                    value={vectorA[1]} 
                    onChange={(e) => setVectorA([vectorA[0], parseInt(e.target.value) || 0])}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Vecteur B: [{vectorB[0]}, {vectorB[1]}]</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="number" 
                    value={vectorB[0]} 
                    onChange={(e) => setVectorB([parseInt(e.target.value) || 0, vectorB[1]])}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <input 
                    type="number" 
                    value={vectorB[1]} 
                    onChange={(e) => setVectorB([vectorB[0], parseInt(e.target.value) || 0])}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              <Button 
                onClick={() => setShowVectorCalculation(!showVectorCalculation)}
                className="w-full"
              >
                {showVectorCalculation ? "Masquer" : "Calculer"} les opérations
              </Button>

              {showVectorCalculation && (
                <div className="bg-green-50 p-3 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Produit scalaire :</strong> {calculateDotProduct()}</p>
                  <p className="text-sm"><strong>Magnitude A :</strong> {calculateMagnitude(vectorA).toFixed(2)}</p>
                  <p className="text-sm"><strong>Magnitude B :</strong> {calculateMagnitude(vectorB).toFixed(2)}</p>
                  <p className="text-sm"><strong>Addition :</strong> [{vectorA[0] + vectorB[0]}, {vectorA[1] + vectorB[1]}]</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🔍 Zoom sur : Le produit scalaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Formule mathématique</h4>
              <CourseEquation latex="\vec{u} \cdot \vec{v} = \sum_{i=1}^{n} u_i v_i = u_1v_1 + u_2v_2 + ... + u_nv_n" />
              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                <p className="text-sm">
                  <strong>Interprétation :</strong> Plus le produit scalaire est grand, 
                  plus les vecteurs "pointent dans la même direction".
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Applications concrètes</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Similarité :</strong> Comparer deux documents texte</li>
                <li>• <strong>Recommendations :</strong> "Les utilisateurs qui aiment A aiment aussi B"</li>
                <li>• <strong>Computer Vision :</strong> Détecter des formes dans les images</li>
                <li>• <strong>Machine Learning :</strong> Calculer la "distance" entre données</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseHighlight title="🎯 Exercice corrigé : Système de recommandation simple" type="example">
        <div className="space-y-4">
          <p><strong>Problème :</strong> Alice aime les films [Action: 5, Comédie: 2, Drame: 1] et Bob aime [Action: 4, Comédie: 3, Drame: 2]. Sont-ils compatibles ?</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Solution :</strong></p>
            <CourseEquation latex="\vec{Alice} \cdot \vec{Bob} = 5 \times 4 + 2 \times 3 + 1 \times 2 = 20 + 6 + 2 = 28" />
            <p className="text-sm mt-2">
              Avec une magnitude d'Alice = √(5²+2²+1²) = √30 ≈ 5.48 et Bob = √(4²+3²+2²) = √29 ≈ 5.39
            </p>
            <p className="text-sm">
              <strong>Similarité cosinus :</strong> 28 / (5.48 × 5.39) ≈ 0.95 → Très compatibles ! 🎬
            </p>
          </div>
        </div>
      </CourseHighlight>

      {/* Advanced Vector Concepts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-red-600" />
              Produit Vectoriel (3D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Le produit vectoriel crée un nouveau vecteur perpendiculaire aux deux vecteurs d'origine :
              </p>
              <CourseEquation latex="\vec{u} \times \vec{v} = \begin{pmatrix} u_2v_3 - u_3v_2 \\ u_3v_1 - u_1v_3 \\ u_1v_2 - u_2v_1 \end{pmatrix}" />
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Applications pratiques :</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Physique :</strong> Force magnétique, moment angulaire</li>
                  <li>• <strong>3D Graphics :</strong> Calcul des normales de surface</li>
                  <li>• <strong>Robotique :</strong> Orientation dans l'espace</li>
                  <li>• <strong>Computer Vision :</strong> Détection de plans</li>
                </ul>
              </div>

              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Propriété clé :</strong> |u × v| = |u| |v| sin(θ) représente l'aire du parallélogramme formé par u et v.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              Propriétés Géométriques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Angle entre deux vecteurs :</h4>
                <CourseEquation latex="\cos(\theta) = \frac{\vec{u} \cdot \vec{v}}{|\vec{u}| |\vec{v}|}" />
                <p className="text-sm mt-2">
                  Cette formule permet de mesurer la "similarité" entre deux directions.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Projection orthogonale :</h4>
                <CourseEquation latex="\text{proj}_{\vec{v}}\vec{u} = \frac{\vec{u} \cdot \vec{v}}{|\vec{v}|^2} \vec{v}" />
                <p className="text-sm mt-2">
                  Projette u sur la direction de v - utile en régression linéaire !
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Distance entre points :</strong> d(A,B) = |B - A| = √[(x₂-x₁)² + (y₂-y₁)²]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vector Spaces and Linear Independence */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🏗️ Espaces Vectoriels et Indépendance Linéaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Espace Vectoriel</h4>
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <p className="text-sm">
                  Un espace vectoriel est un "terrain de jeu" où les vecteurs peuvent être additionnés et multipliés par des scalaires.
                </p>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Propriétés essentielles :</p>
                  <ul className="text-xs space-y-1">
                    <li>• Fermeture : u + v reste dans l'espace</li>
                    <li>• Associativité : (u + v) + w = u + (v + w)</li>
                    <li>• Élément neutre : vecteur zéro 0</li>
                    <li>• Distributivité : a(u + v) = au + av</li>
                  </ul>
                </div>
                <p className="text-sm">
                  <strong>Exemples :</strong> ℝ², ℝ³, espace des polynômes, espace des matrices n×m
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-green-600">Indépendance Linéaire</h4>
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <p className="text-sm">
                  Des vecteurs sont <strong>linéairement indépendants</strong> si aucun ne peut s'exprimer comme combinaison des autres.
                </p>
                <CourseEquation latex="a_1\vec{v_1} + a_2\vec{v_2} + ... + a_n\vec{v_n} = \vec{0} \Rightarrow a_1 = a_2 = ... = a_n = 0" />
                
                <div className="bg-white p-3 rounded">
                  <p className="text-xs font-semibold mb-1">Test pratique (2D) :</p>
                  <p className="text-xs">
                    Deux vecteurs u = [a,b] et v = [c,d] sont indépendants si ad - bc ≠ 0
                  </p>
                </div>
                
                <div className="bg-yellow-100 p-2 rounded">
                  <p className="text-xs">
                    <strong>En ML :</strong> Les features indépendantes apportent de l'information unique au modèle !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Practical Example */}
      <CourseHighlight title="🎯 Exercice avancé : Analyse de sentiment avec vecteurs" type="example">
        <div className="space-y-4">
          <p><strong>Problème :</strong> Analyser la similarité entre trois avis clients représentés par des vecteurs de caractéristiques [Positivité, Longueur, Complexité].</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded">
                <p className="text-sm font-semibold">Avis A: [0.8, 0.6, 0.3]</p>
                <p className="text-xs">"Excellent produit, je recommande !"</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-sm font-semibold">Avis B: [0.9, 0.4, 0.2]</p>
                <p className="text-xs">"Parfait, très satisfait"</p>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="text-sm font-semibold">Avis C: [-0.7, 0.8, 0.6]</p>
                <p className="text-xs">"Produit décevant, qualité insuffisante, service client peu réactif"</p>
              </div>
            </div>
            
            <p><strong>Analyse :</strong></p>
            <div className="space-y-2 text-sm">
              <p>• <strong>Similarité A-B :</strong> cos(θ) = (0.8×0.9 + 0.6×0.4 + 0.3×0.2) / (|A|×|B|) ≈ 0.95 → Très similaires</p>
              <p>• <strong>Similarité A-C :</strong> cos(θ) = (0.8×(-0.7) + 0.6×0.8 + 0.3×0.6) / (|A|×|C|) ≈ -0.12 → Opposés</p>
              <p>• <strong>Conclusion :</strong> A et B sont des avis positifs similaires, C est négatif et détaillé</p>
            </div>
          </div>
        </div>
      </CourseHighlight>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Astuce de pro
        </h4>
        <p className="text-sm text-yellow-700">
          En Data Science, on normalise souvent les vecteurs (magnitude = 1) pour comparer uniquement les "directions" 
          sans être influencé par les "intensités". C'est comme comparer des boussoles plutôt que des distances !
        </p>
      </div>
    </section>
  );
};

export default VectorsSection;
