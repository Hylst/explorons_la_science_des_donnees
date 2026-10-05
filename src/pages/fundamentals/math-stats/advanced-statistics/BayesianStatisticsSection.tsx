
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, Target } from "lucide-react";

const BayesianStatisticsSection = () => {
  return (
    <section id="bayesian" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Zap className="h-8 w-8 text-yellow-600" />
          Statistiques Bayésiennes
        </h2>
        <p className="text-lg text-gray-600">
          Découvrez l'approche bayésienne qui intègre les connaissances préalables dans l'analyse statistique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-yellow-600" />
              Théorème de Bayes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Le théorème de Bayes permet de mettre à jour nos croyances à la lumière 
                de nouvelles données observées.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-3 text-center">Théorème de Bayes</h4>
                <div className="font-mono text-center bg-white p-4 rounded border text-lg mb-3">
                  P(θ|D) = P(D|θ) × P(θ) / P(D)
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>P(θ|D)</strong> : Probabilité a posteriori</div>
                  <div><strong>P(D|θ)</strong> : Vraisemblance</div>
                  <div><strong>P(θ)</strong> : Probabilité a priori</div>
                  <div><strong>P(D)</strong> : Évidence</div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <h5 className="font-semibold text-blue-700 mb-2">En pratique :</h5>
                <p className="text-sm text-blue-600">
                  Posterieur ∝ Vraisemblance × Prieur
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Avantages de l'approche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded">
                  <h5 className="font-semibold text-green-700">✅ Intégration des connaissances</h5>
                  <p className="text-sm text-green-600">
                    Utilise l'expertise et les études antérieures
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <h5 className="font-semibold text-blue-700">✅ Quantification de l'incertitude</h5>
                  <p className="text-sm text-blue-600">
                    Distributions de probabilité complètes
                  </p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded">
                  <h5 className="font-semibold text-purple-700">✅ Mise à jour continue</h5>
                  <p className="text-sm text-purple-600">
                    Apprentissage séquentiel avec nouvelles données
                  </p>
                </div>
                
                <div className="bg-orange-50 p-3 rounded">
                  <h5 className="font-semibold text-orange-700">✅ Décisions optimales</h5>
                  <p className="text-sm text-orange-600">
                    Théorie de la décision bayésienne
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distributions a priori communes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-red-700 mb-2">Prieur conjugué</h4>
              <p className="text-sm text-gray-600 mb-2">
                La forme mathématique est préservée après mise à jour
              </p>
              <div className="text-xs text-red-600">
                Ex: Beta pour Binomiale, Gamma pour Poisson
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-2">Prieur non-informatif</h4>
              <p className="text-sm text-gray-600 mb-2">
                Laisse les données "parler" (Jeffrey's prior)
              </p>
              <div className="text-xs text-blue-600">
                Ex: Uniforme, Normal vague
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-green-700 mb-2">Prieur informatif</h4>
              <p className="text-sm text-gray-600 mb-2">
                Intègre des connaissances d'expert
              </p>
              <div className="text-xs text-green-600">
                Ex: Normal centré sur valeur attendue
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MCMC (Monte Carlo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Méthodes d'échantillonnage pour les distributions complexes :
              </p>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded">
                  <strong className="text-blue-700">Metropolis-Hastings</strong>
                  <p className="text-xs text-blue-600">Algorithme de base MCMC</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-700">Gibbs Sampling</strong>
                  <p className="text-xs text-green-600">Pour distributions multivariées</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <strong className="text-purple-700">Hamiltonian MC</strong>
                  <p className="text-xs text-purple-600">Utilise les gradients (Stan)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications pratiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <strong>A/B Testing</strong>
                  <p className="text-sm text-gray-600">Mise à jour continue des taux de conversion</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Modèles hiérarchiques</strong>
                  <p className="text-sm text-gray-600">Données groupées avec effets aléatoires</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Prédiction</strong>
                  <p className="text-sm text-gray-600">Intervalles prédictifs bayésiens</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Sélection de modèles</strong>
                  <p className="text-sm text-gray-600">Facteurs de Bayes, DIC, WAIC</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BayesianStatisticsSection;
