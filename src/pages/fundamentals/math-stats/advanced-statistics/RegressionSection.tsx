
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Target } from "lucide-react";

const RegressionSection = () => {
  const regressionTypes = [
    {
      type: "Régression linéaire multiple",
      equation: "Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε",
      usage: "Plusieurs variables explicatives continues",
      example: "Prix maison = f(surface, âge, localisation)"
    },
    {
      type: "Régression logistique",
      equation: "logit(p) = ln(p/(1-p)) = β₀ + β₁X₁ + ...",
      usage: "Variable dépendante binaire",
      example: "Probabilité de guérison = f(âge, traitement)"
    },
    {
      type: "Régression polynomiale",
      equation: "Y = β₀ + β₁X + β₂X² + β₃X³ + ... + ε",
      usage: "Relations non-linéaires",
      example: "Performance = f(stress) avec courbe en U inversé"
    }
  ];

  return (
    <section id="regression" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Brain className="h-8 w-8 text-indigo-600" />
          Régression Avancée
        </h2>
        <p className="text-lg text-gray-600">
          Explorez les modèles de régression sophistiqués pour analyser des relations complexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-l-4 border-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              Régression multiple
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                La régression multiple permet d'analyser l'effet de plusieurs variables 
                explicatives sur une variable dépendante.
              </p>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 mb-2">Équation générale</h4>
                <div className="font-mono text-center bg-white p-3 rounded border">
                  Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Interprétation des coefficients :</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>β₀</strong> : Ordonnée à l'origine</li>
                  <li>• <strong>βᵢ</strong> : Effet de Xᵢ, toutes choses égales par ailleurs</li>
                  <li>• <strong>ε</strong> : Terme d'erreur (résidus)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              Évaluation du modèle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <h5 className="font-semibold text-green-700">R² ajusté</h5>
                  <p className="text-sm text-green-600">Qualité d'ajustement corrigée</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <h5 className="font-semibold text-blue-700">AIC/BIC</h5>
                  <p className="text-sm text-blue-600">Critères de sélection</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <h5 className="font-semibold text-purple-700">RMSE</h5>
                  <p className="text-sm text-purple-600">Racine de l'erreur quadratique moyenne</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <h5 className="font-semibold text-orange-700">Test F</h5>
                  <p className="text-sm text-orange-600">Significativité globale</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <h5 className="font-semibold text-yellow-700 mb-1">Attention à :</h5>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• Multicolinéarité (VIF {'>'}10)</li>
                  <li>• Hétéroscédasticité</li>
                  <li>• Non-linéarité des résidus</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Types de régression avancée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {regressionTypes.map((regression, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg text-indigo-700">{regression.type}</h4>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <code className="text-sm">{regression.equation}</code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-sm text-gray-700">Usage :</strong>
                    <p className="text-sm text-gray-600">{regression.usage}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-700">Exemple :</strong>
                    <p className="text-sm text-blue-600 italic">{regression.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sélection de variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <strong className="text-blue-700">Forward Selection</strong>
                <p className="text-xs text-blue-600">Ajout progressif de variables</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <strong className="text-green-700">Backward Elimination</strong>
                <p className="text-xs text-green-600">Suppression progressive</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <strong className="text-purple-700">Stepwise</strong>
                <p className="text-xs text-purple-600">Combinaison des deux approches</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <strong className="text-orange-700">LASSO (et Ridge)</strong>
                <p className="text-xs text-orange-600">LASSO met certains coefficients à 0 (il sélectionne) ; Ridge réduit les coefficients sans en éliminer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diagnostics des résidus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <strong>Normalité</strong>
                  <p className="text-sm text-gray-600">Test de Shapiro-Wilk, Q-Q plot</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Homoscédasticité</strong>
                  <p className="text-sm text-gray-600">Test de Breusch-Pagan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Indépendance</strong>
                  <p className="text-sm text-gray-600">Test de Durbin-Watson</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Linéarité</strong>
                  <p className="text-sm text-gray-600">Graphiques des résidus</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegressionSection;
