
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Zap, Brain, Star } from "lucide-react";

const DecompositionsSection = () => {
  const [showSVDDemo, setShowSVDDemo] = useState(false);
  // Nombre de valeurs singulières gardées pour une image en niveaux de gris de 1920 x 1080
  const [rank, setRank] = useState(50);
  const kept = rank * (1920 + 1080 + 1);
  const saved = 1 - kept / (1920 * 1080);

  return (
    <section id="decompositions" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">5. Décompositions : Décortiquer les Matrices</h2>
      
      <CourseHighlight title="Analogie : La décomposition comme une autopsie" type="concept">
        <p>
          Imaginez que vous démontez une montre complexe pour comprendre ses mécanismes. 
          Les décompositions matricielles font pareil : elles révèlent les "rouages" cachés de vos données.
        </p>
      </CourseHighlight>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Décomposition en Valeurs Propres (EVD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Le concept fondamental</h4>
                <p className="text-sm mb-3">
                  Une valeur propre λ et son vecteur propre v vérifient :
                </p>
                <CourseEquation latex="A\vec{v} = \lambda\vec{v}" />
                <div className="bg-purple-50 p-4 rounded-lg mt-3">
                  <h5 className="font-semibold text-purple-700 mb-2">Interprétation intuitive :</h5>
                  <p className="text-sm text-purple-600">
                    Le vecteur v garde sa direction quand on lui applique A. 
                    Il est juste "étiré" d'un facteur λ.
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">La formule complète</h4>
                <CourseEquation latex="A = Q\Lambda Q^{-1}" />
                <div className="space-y-2 text-sm">
                  <p>• <strong>Q :</strong> matrice des vecteurs propres</p>
                  <p>• <strong>Λ :</strong> matrice diagonale des valeurs propres</p>
                  <p>• <strong>Q^(-1) :</strong> inverse de Q</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-xs">
                    <strong>Intérêt :</strong> Cette décomposition révèle les "directions privilégiées" de vos données.
                  </p>
                </div>
              </div>
            </div>

            <CourseHighlight title="Exemple concret : PageRank de Google" type="example">
              <div className="space-y-3">
                <p><strong>Le problème :</strong> Comment classer des milliards de pages web ?</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    <strong>La solution :</strong> Créer une matrice géante où chaque ligne/colonne 
                    représente une page web, et les valeurs représentent les liens.
                  </p>
                  <p className="text-sm mb-2">
                    <strong>L'astuce :</strong> Le vecteur propre principal donne l'importance de chaque page.
                  </p>
                  <div className="bg-blue-100 p-3 rounded">
                    <p className="text-xs">
                      <strong>Résultat :</strong> Plus une page a de liens entrants de qualité, 
                      plus sa valeur dans le vecteur propre est élevée → meilleur classement.
                    </p>
                  </div>
                </div>
              </div>
            </CourseHighlight>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Décomposition en Valeurs Singulières (SVD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">La super-formule universelle</h4>
                  <CourseEquation latex="A = U\Sigma V^T" />
                  <div className="space-y-2 text-sm">
                    <p>• <strong>U :</strong> vecteurs singuliers gauches</p>
                    <p>• <strong>Σ :</strong> valeurs singulières (diagonale)</p>
                    <p>• <strong>V^T :</strong> vecteurs singuliers droits</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg mt-3">
                    <p className="text-xs">
                      <strong>Superpouvoir :</strong> Fonctionne sur TOUTES les matrices, 
                      même rectangulaires.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Compression interactive</h4>
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="svd-rank">
                      Valeurs singulières gardées (k) : {rank}
                    </label>
                    <input
                      id="svd-rank"
                      type="range"
                      min="1"
                      max="400"
                      value={rank}
                      onChange={(e) => setRank(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs">
                        <strong>Valeurs à stocker :</strong> k × (1920 + 1080 + 1) = {kept.toLocaleString("fr-FR")} au lieu de 2 073 600
                      </p>
                      <p className="text-xs">
                        <strong>Espace économisé :</strong> {saved > 0 ? `${(saved * 100).toFixed(1)} %` : "aucun (k trop grand : mieux vaut garder l'image telle quelle)"}
                      </p>
                      <p className="text-xs">
                        La qualité conservée dépend de l'image : elle se lit sur la décroissance des valeurs singulières, pas sur une règle fixe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowSVDDemo(!showSVDDemo)}
                className="w-full"
              >
                {showSVDDemo ? "Masquer" : "Voir"} l'exemple de compression d'image
              </Button>

              {showSVDDemo && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-3">Compression d'image avec SVD</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">Image originale</Badge>
                      <p className="text-sm">1920×1080 pixels</p>
                      <p className="text-sm">2 073 600 valeurs (niveaux de gris)</p>
                      <p className="text-sm font-semibold">Image complète</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <Badge className="bg-green-100 text-green-800 mb-2">k = 50 composantes</Badge>
                      <p className="text-sm">150,050 valeurs : 50 × (1920 + 1080 + 1)</p>
                      <p className="text-sm">93% de compression</p>
                      <p className="text-sm font-semibold">Qualité : dépend de l'image</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <Badge className="bg-purple-100 text-purple-800 mb-2">k = 20 composantes</Badge>
                      <p className="text-sm">60,020 valeurs : 20 × (1920 + 1080 + 1)</p>
                      <p className="text-sm">97% de compression</p>
                      <p className="text-sm font-semibold">Qualité : dépend de l'image</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Le secret :</strong> Les premières valeurs singulières capturent l'essentiel de l'information. 
                      On peut jeter les petites valeurs sans perdre grand-chose.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">Décomposition LU</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <CourseEquation latex="A = LU" />
                <p className="text-sm">
                  Décompose en matrices triangulaires Lower (L) et Upper (U).
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs">
                    <strong>Usage :</strong> Résolution ultra-rapide de systèmes d'équations
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Domaine :</strong> Simulations numériques, ingénierie
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg">Décomposition QR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <CourseEquation latex="A = QR" />
                <p className="text-sm">
                  Q est orthogonale, R est triangulaire supérieure.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs">
                    <strong>Usage :</strong> Régression linéaire, méthode des moindres carrés
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Avantage :</strong> Très stable numériquement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CourseHighlight title="Zoom sur : Choisir la bonne décomposition" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Pour l'analyse de données :</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>SVD :</strong> Réduction de dimensionnalité, recommandations</li>
              <li>• <strong>EVD :</strong> PCA, analyse spectrale</li>
              <li>• <strong>Cholesky :</strong> Matrices de covariance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Pour le calcul numérique :</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>LU :</strong> Systèmes d'équations répétés</li>
              <li>• <strong>QR :</strong> Régression, problèmes mal conditionnés</li>
              <li>• <strong>Schur :</strong> Calcul de valeurs propres</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Récap express : Quelle décomposition pour quoi ?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium text-purple-600">Analyse de données</p>
            <p className="text-xs text-gray-600">SVD, EVD → structures cachées</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium text-blue-600">Calcul rapide</p>
            <p className="text-xs text-gray-600">LU, QR → Systèmes d'équations</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium text-green-600">Stabilité</p>
            <p className="text-xs text-gray-600">QR, SVD → Données bruitées</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecompositionsSection;
