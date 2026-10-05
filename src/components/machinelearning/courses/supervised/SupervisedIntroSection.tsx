
import { EducationalCard } from "@/components/ui/educational-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, BookOpen, Lightbulb, Users, Trophy } from "lucide-react";

const SupervisedIntroSection = () => {
  return (
    <div className="space-y-8">
      {/* Introduction avec analogie principale */}
      <EducationalCard title="🎯 Qu'est-ce que l'apprentissage supervisé ?" type="concept">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              L'analogie du professeur et de l'élève
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Le Professeur</h4>
                <p className="text-sm text-blue-700">
                  Donne des exercices avec leurs solutions (données d'entraînement étiquetées)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="font-semibold mb-2">L'Élève (IA)</h4>
                <p className="text-sm text-indigo-700">
                  Apprend les patterns en étudiant les exemples fournis
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">L'Examen</h4>
                <p className="text-sm text-purple-700">
                  Test sur de nouveaux problèmes jamais vus auparavant
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectif principal
              </h4>
              <p className="text-green-700 text-sm">
                Créer une fonction intelligente qui peut prédire des résultats pour de nouvelles données,
                en s'appuyant sur des exemples d'entraînement où l'on connaît déjà les bonnes réponses.
              </p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Pourquoi "supervisé" ?
              </h4>
              <p className="text-orange-700 text-sm">
                Comme un élève sous la supervision d'un professeur, l'algorithme a accès aux "bonnes réponses"
                pendant l'apprentissage, contrairement à l'apprentissage non-supervisé.
              </p>
            </div>
          </div>
        </div>
      </EducationalCard>

      {/* Schéma du processus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Le processus d'apprentissage supervisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <svg width="800" height="300" viewBox="0 0 800 300" className="border rounded-lg bg-gray-50">
              {/* Données d'entrée */}
              <rect x="20" y="80" width="120" height="80" fill="#3B82F6" rx="8" />
              <text x="80" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Données
              </text>
              <text x="80" y="130" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Étiquetées
              </text>
              <text x="80" y="145" textAnchor="middle" fill="white" fontSize="10">
                (X, y)
              </text>

              {/* Flèche 1 */}
              <path d="M150 120 L190 120" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Algorithme */}
              <rect x="200" y="80" width="120" height="80" fill="#10B981" rx="8" />
              <text x="260" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Algorithme
              </text>
              <text x="260" y="130" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                d'Apprentissage
              </text>
              <text x="260" y="145" textAnchor="middle" fill="white" fontSize="10">
                (Training)
              </text>

              {/* Flèche 2 */}
              <path d="M330 120 L370 120" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Modèle */}
              <rect x="380" y="80" width="120" height="80" fill="#8B5CF6" rx="8" />
              <text x="440" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Modèle
              </text>
              <text x="440" y="130" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Entraîné
              </text>
              <text x="440" y="145" textAnchor="middle" fill="white" fontSize="10">
                f(X) → ŷ
              </text>

              {/* Nouvelles données */}
              <rect x="550" y="20" width="100" height="60" fill="#F59E0B" rx="8" />
              <text x="600" y="45" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Nouvelles
              </text>
              <text x="600" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Données
              </text>

              {/* Flèche 3 */}
              <path d="M550 50 L480 80" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Prédictions */}
              <rect x="600" y="140" width="100" height="60" fill="#EF4444" rx="8" />
              <text x="650" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                Prédictions
              </text>
              <text x="650" y="180" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                ŷ
              </text>

              {/* Flèche 4 */}
              <path d="M480 140 L580 170" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

              {/* Définition des marqueurs de flèches */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                </marker>
              </defs>

              {/* Labels */}
              <text x="170" y="110" textAnchor="middle" fontSize="10" fill="#6B7280">Entraînement</text>
              <text x="350" y="110" textAnchor="middle" fontSize="10" fill="#6B7280">Produit</text>
              <text x="530" y="70" textAnchor="middle" fontSize="10" fill="#6B7280">Prédiction</text>
              <text x="540" y="185" textAnchor="middle" fontSize="10" fill="#6B7280">Résultat</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Exemples concrets de la vie quotidienne */}
      <EducationalCard title="🌟 Exemples de la vie quotidienne" type="exemple">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📧</span>
                <div>
                  <CardTitle className="text-lg">Email Spam</CardTitle>
                  <Badge variant="outline" className="text-xs">Classification</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                <strong>Situation :</strong> Votre boîte mail doit décider si un email est du spam.
              </p>
              <p className="text-sm mb-3">
                <strong>Données :</strong> Des milliers d'emails déjà classés "spam" ou "légitime".
              </p>
              <p className="text-sm text-blue-600">
                <strong>Prédiction :</strong> Pour un nouvel email → Spam ou Non-spam ?
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <div>
                  <CardTitle className="text-lg">Prix Immobilier</CardTitle>
                  <Badge variant="outline" className="text-xs">Régression</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                <strong>Situation :</strong> Estimer le prix d'une maison à vendre.
              </p>
              <p className="text-sm mb-3">
                <strong>Données :</strong> Historique de ventes avec surface, localisation, prix...
              </p>
              <p className="text-sm text-green-600">
                <strong>Prédiction :</strong> Pour une nouvelle maison → Prix en euros
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🩺</span>
                <div>
                  <CardTitle className="text-lg">Diagnostic Médical</CardTitle>
                  <Badge variant="outline" className="text-xs">Classification</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                <strong>Situation :</strong> Détecter une maladie à partir de symptômes.
              </p>
              <p className="text-sm mb-3">
                <strong>Données :</strong> Dossiers patients avec symptômes et diagnostics confirmés.
              </p>
              <p className="text-sm text-purple-600">
                <strong>Prédiction :</strong> Pour nouveaux symptômes → Maladie probable
              </p>
            </CardContent>
          </Card>
        </div>
      </EducationalCard>

      {/* Caractéristiques clés */}
      <Card>
        <CardHeader>
          <CardTitle>🔑 Caractéristiques clés de l'apprentissage supervisé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Données étiquetées</h4>
                  <p className="text-sm text-gray-600">
                    Chaque exemple d'entraînement a une "réponse correcte" associée
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Objectif de généralisation</h4>
                  <p className="text-sm text-gray-600">
                    Le but est de bien prédire sur de nouvelles données, pas de mémoriser
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-2 mt-1">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">Évaluation mesurable</h4>
                  <p className="text-sm text-gray-600">
                    Performance quantifiable avec des métriques précises
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full p-2 mt-1">
                  <Lightbulb className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Feedback dirigé</h4>
                  <p className="text-sm text-gray-600">
                    L'algorithme sait quand il se trompe et peut s'ajuster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisedIntroSection;
