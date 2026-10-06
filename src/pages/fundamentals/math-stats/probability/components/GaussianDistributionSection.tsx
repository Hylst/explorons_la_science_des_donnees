import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import { AlertTriangle, Eye, Zap, Calculator, Target, Bell, Layers } from "lucide-react";

/**
 * Section complète sur la Distribution Gaussienne/Normale
 * Couvre les propriétés, paramètres, estimation, applications pratiques
 */
const GaussianDistributionSection = () => {
  const [selectedExample, setSelectedExample] = useState<keyof typeof practicalExamples>('heights');

  // Données pour la courbe normale standard
  const standardNormalData = Array.from({ length: 100 }, (_, i) => {
    const x = -4 + (i * 8) / 99;
    const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
    return { x: x.toFixed(2), y: y.toFixed(4), xNum: x };
  });

  // Données pour différentes distributions normales
  const normalComparisons = Array.from({ length: 100 }, (_, i) => {
    const x = -6 + (i * 12) / 99;
    const n1 = (1 / Math.sqrt(2 * Math.PI * 1)) * Math.exp(-((x - 0) ** 2) / (2 * 1)); // N(0,1)
    const n2 = (1 / Math.sqrt(2 * Math.PI * 4)) * Math.exp(-((x - 0) ** 2) / (2 * 4)); // N(0,4) : variance 4, σ = 2
    const n3 = (1 / Math.sqrt(2 * Math.PI * 1)) * Math.exp(-((x - 2) ** 2) / (2 * 1)); // N(2,1)
    return { 
      x: x.toFixed(1), 
      'N(0,1)': n1.toFixed(4), 
      'N(0,4)': n2.toFixed(4), 
      'N(2,1)': n3.toFixed(4),
      xNum: x
    };
  });

  // Données pour la règle 68-95-99.7
  const empiricalRuleData = [
    { range: '±1σ', percentage: 68.27, color: '#3b82f6', description: 'Dans 1 écart-type' },
    { range: '±2σ', percentage: 95.45, color: '#10b981', description: 'Dans 2 écarts-types' },
    { range: '±3σ', percentage: 99.73, color: '#f59e0b', description: 'Dans 3 écarts-types' }
  ];

  // Exemples pratiques
  const practicalExamples = {
    heights: {
      title: "Tailles humaines",
      mean: 170,
      std: 10,
      unit: "cm",
      description: "Distribution des tailles dans une population adulte",
      interpretation: "68% des personnes mesurent entre 160-180cm"
    },
    iq: {
      title: "Quotient Intellectuel (QI)",
      mean: 100,
      std: 15,
      unit: "points",
      description: "Scores de QI standardisés",
      interpretation: "68% des personnes ont un QI entre 85-115"
    },
    returns: {
      title: "Rendements financiers",
      mean: 8,
      std: 15,
      unit: "%",
      description: "Rendements annuels d'un portefeuille",
      interpretation: "68% des années: rendement entre -7% et +23%"
    }
  } as const;

  const currentExample = practicalExamples[selectedExample];

  return (
    <section className="space-y-8">
      {/* Introduction et définition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            🔔 Distribution Gaussienne : La Reine des Distributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <CourseHighlight title="🎯 Qu'est-ce que la distribution normale ?" type="concept">
              <p className="mb-4">
                La distribution normale (ou gaussienne) est la distribution de probabilité continue la plus importante en statistiques. 
                Elle décrit de nombreux phénomènes naturels et est au cœur du théorème central limite.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-blue-700">📐 Fonction de densité</h5>
                  <CourseEquation 
                    latex="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}"
                  />
                  <div className="mt-3 text-sm space-y-1">
                    <p>• <strong>μ (mu) :</strong> Centre de la distribution</p>
                    <p>• <strong>σ (sigma) :</strong> Étalement de la distribution</p>
                    <p>• <strong>Notation :</strong> X ~ N(μ, σ²)</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-green-700">✨ Propriétés clés</h5>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Symétrique :</strong> Parfaitement équilibrée autour de μ</li>
                    <li>• <strong>Unimodale :</strong> Un seul pic au centre</li>
                    <li>• <strong>Asymptotique :</strong> Queue infinie mais probabilité → 0</li>
                    <li>• <strong>Aire totale = 1 :</strong> Somme de toutes les probabilités</li>
                    <li>• <strong>Forme de cloche :</strong> Maximum à x = μ</li>
                  </ul>
                </div>
              </div>
            </CourseHighlight>
          </div>

          {/* Visualisation interactive */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualisation de la courbe normale standard N(0,1)
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DeferredResponsiveContainer width="100%" height={300}>
                <AreaChart data={standardNormalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    scale="linear"
                    domain={[-4, 4]}
                    tickFormatter={(value) => value.toString()}
                  />
                  <YAxis tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip 
                    formatter={(value, _) => [parseFloat(value.toString()).toFixed(4), 'Densité']}
                    labelFormatter={(label) => `x = ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Distribution normale standard : μ = 0, σ = 1. La forme caractéristique en "cloche" de Gauss.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres et leurs effets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-600" />
            ⚙️ Impact des Paramètres μ et σ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <CourseHighlight title="🎛️ Comment μ et σ façonnent la distribution" type="concept">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-purple-700">📍 Effet de la moyenne (μ)</h5>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Translation horizontale :</strong> Déplace toute la courbe</li>
                    <li>• <strong>Centre de symétrie :</strong> Point d'équilibre</li>
                    <li>• <strong>Mode = Médiane = Moyenne :</strong> Toutes égales à μ</li>
                    <li>• <strong>Pas d'effet sur la forme :</strong> Seule la position change</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-orange-700">📏 Effet de l'écart-type (σ)</h5>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Étalement :</strong> σ ↑ → courbe plus large et plate</li>
                    <li>• <strong>Concentration :</strong> σ ↓ → courbe plus étroite et haute</li>
                    <li>• <strong>Points d'inflexion :</strong> À μ ± σ</li>
                    <li>• <strong>Aire constante :</strong> Toujours égale à 1</li>
                  </ul>
                </div>
              </div>
            </CourseHighlight>
          </div>

          {/* Comparaison de différentes distributions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">📊 Comparaison de distributions normales</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DeferredResponsiveContainer width="100%" height={350}>
                <LineChart data={normalComparisons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    scale="linear"
                    domain={[-6, 6]}
                  />
                  <YAxis tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip 
                    formatter={(value, name) => [parseFloat(value.toString()).toFixed(4), name]}
                    labelFormatter={(label) => `x = ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="N(0,1)" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    name="N(0,1) - Standard"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="N(0,4)" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                    name="N(0,4) - Plus large"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="N(2,1)" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={false}
                    name="N(2,1) - Décalée"
                  />
                </LineChart>
              </DeferredResponsiveContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-500"></div>
                  <span className="text-sm">N(0,1) : μ=0, σ=1 (standard)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-500"></div>
                  <span className="text-sm">N(0,4) : μ=0, σ=2 (plus étalée)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-yellow-500"></div>
                  <span className="text-sm">N(2,1) : μ=2, σ=1 (décalée)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Règle empirique 68-95-99.7 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-red-600" />
            🎯 Règle Empirique : 68-95-99.7%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <CourseHighlight title="📏 La règle des écarts-types" type="example">
              <p className="mb-4">
                Cette règle fondamentale permet d'estimer rapidement les probabilités dans une distribution normale 
                sans calculs complexes. Elle est essentielle pour l'interprétation pratique.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {empiricalRuleData.map((rule, index) => (
                  <div key={index} className="bg-white border-2 rounded-lg p-4" style={{borderColor: rule.color}}>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2" style={{color: rule.color}}>
                        {rule.percentage}%
                      </div>
                      <div className="text-lg font-semibold mb-1">{rule.range}</div>
                      <div className="text-sm text-gray-600">{rule.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-blue-700">🧮 Formules mathématiques</h5>
                <div className="space-y-2 text-sm">
                  <CourseEquation 
                    latex="P(\mu - \sigma \leq X \leq \mu + \sigma) \approx 0.6827"
                  />
                  <p className="text-xs text-gray-600">68.27% des valeurs dans [μ-σ, μ+σ]</p>
                  <CourseEquation 
                    latex="P(\mu - 2\sigma \leq X \leq \mu + 2\sigma) \approx 0.9545"
                  />
                  <p className="text-xs text-gray-600">95.45% des valeurs dans [μ-2σ, μ+2σ]</p>
                  <CourseEquation 
                    latex="P(\mu - 3\sigma \leq X \leq \mu + 3\sigma) \approx 0.9973"
                  />
                  <p className="text-xs text-gray-600">99.73% des valeurs dans [μ-3σ, μ+3σ]</p>
                </div>
              </div>
            </CourseHighlight>
          </div>

          {/* Visualisation de la règle empirique */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">📊 Visualisation de la règle empirique</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DeferredResponsiveContainer width="100%" height={250}>
                <BarChart data={empiricalRuleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  <Bar dataKey="percentage" fill="#3b82f6" />
                </BarChart>
              </DeferredResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples pratiques interactifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
            ⚡ Exemples Pratiques Interactifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-4">🎮 Sélectionnez un exemple :</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(practicalExamples).map(([key, example]) => (
                <Button
                  key={key}
                  variant={selectedExample === key ? "default" : "outline"}
                  onClick={() => setSelectedExample(key as keyof typeof practicalExamples)}
                  className="text-sm"
                >
                  {example.title}
                </Button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h5 className="font-semibold text-lg mb-4 text-purple-800">
                📊 {currentExample.title}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h6 className="font-semibold mb-2">📈 Paramètres de la distribution</h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Moyenne (μ) :</span>
                        <span className="font-semibold">{currentExample.mean} {currentExample.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Écart-type (σ) :</span>
                        <span className="font-semibold">{currentExample.std} {currentExample.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Notation :</span>
                        <span className="font-mono text-xs">N({currentExample.mean}, {currentExample.std}²)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h6 className="font-semibold mb-2">🎯 Plages de valeurs attendues (règle 68-95-99,7)</h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>68% des valeurs :</span>
                        <span className="font-semibold">
                          [{(currentExample.mean - currentExample.std).toFixed(1)}, {(currentExample.mean + currentExample.std).toFixed(1)}] {currentExample.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>95% des valeurs :</span>
                        <span className="font-semibold">
                          [{(currentExample.mean - 2*currentExample.std).toFixed(1)}, {(currentExample.mean + 2*currentExample.std).toFixed(1)}] {currentExample.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>99.7% des valeurs :</span>
                        <span className="font-semibold">
                          [{(currentExample.mean - 3*currentExample.std).toFixed(1)}, {(currentExample.mean + 3*currentExample.std).toFixed(1)}] {currentExample.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold mb-2">💡 Interprétation pratique</h6>
                  <p className="text-sm mb-3">{currentExample.description}</p>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-800">
                      {currentExample.interpretation}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h6 className="font-semibold text-sm mb-2">🔍 Applications :</h6>
                    <ul className="text-xs space-y-1">
                      {selectedExample === 'heights' && (
                        <>
                          <li>• Conception d'équipements (sièges, vêtements)</li>
                          <li>• Études démographiques et santé publique</li>
                          <li>• Contrôle qualité en anthropométrie</li>
                        </>
                      )}
                      {selectedExample === 'iq' && (
                        <>
                          <li>• Évaluation psychologique et éducative</li>
                          <li>• Recherche en psychologie cognitive</li>
                          <li>• Standardisation des tests</li>
                        </>
                      )}
                      {selectedExample === 'returns' && (
                        <>
                          <li>• Gestion de portefeuille et risque</li>
                          <li>• Modèles d'évaluation d'options</li>
                          <li>• Value at Risk (VaR) et stress testing</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimation des paramètres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            🔬 Estimation des Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <CourseHighlight title="📊 Comment estimer μ et σ à partir des données" type="concept">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-blue-700">📐 Estimateurs ponctuels</h5>
                  <div className="space-y-3">
                    <div>
                      <h6 className="font-semibold text-sm">Moyenne de l'échantillon :</h6>
                      <CourseEquation 
                        latex="\hat{\mu} = \bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i"
                      />
                      <p className="text-xs text-gray-600">Estimateur non biaisé de μ</p>
                    </div>
                    <div>
                      <h6 className="font-semibold text-sm">Écart-type de l'échantillon :</h6>
                      <CourseEquation 
                        latex="\hat{\sigma} = s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (x_i - \bar{x})^2}"
                      />
                      <p className="text-xs text-gray-600">Correction de Bessel (n-1) : s² est un estimateur non biaisé de σ² (s reste légèrement biaisé)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3 text-green-700">🎯 Méthodes d'estimation</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h6 className="font-semibold">1. Méthode des moments :</h6>
                      <p>Égaler les moments empiriques aux moments théoriques</p>
                    </div>
                    <div>
                      <h6 className="font-semibold">2. Maximum de vraisemblance :</h6>
                      <p>Maximiser la fonction de vraisemblance L(μ,σ)</p>
                    </div>
                    <div>
                      <h6 className="font-semibold">3. Estimation bayésienne :</h6>
                      <p>Utiliser des distributions a priori conjuguées</p>
                    </div>
                  </div>
                </div>
              </div>
            </CourseHighlight>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-3 text-purple-700">📏 Intervalles de confiance</h5>
              <div className="space-y-3 text-sm">
                <div>
                  <h6 className="font-semibold">Pour la moyenne (σ connu) :</h6>
                  <CourseEquation 
                    latex="\bar{x} \pm z_{\alpha/2} \frac{\sigma}{\sqrt{n}}"
                  />
                  <p className="text-xs text-gray-600">Distribution normale</p>
                </div>
                <div>
                  <h6 className="font-semibold">Pour la moyenne (σ inconnu) :</h6>
                  <CourseEquation 
                    latex="\bar{x} \pm t_{\alpha/2,n-1} \frac{s}{\sqrt{n}}"
                  />
                  <p className="text-xs text-gray-600">Distribution t de Student</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-3 text-orange-700">🧪 Tests de normalité</h5>
              <div className="space-y-2 text-sm">
                <div><strong>Shapiro-Wilk :</strong> Petit échantillon (n ≤ 50)</div>
                <div><strong>Kolmogorov-Smirnov :</strong> Grand échantillon</div>
                <div><strong>Anderson-Darling :</strong> Sensible aux queues</div>
                <div><strong>Jarque-Bera :</strong> Basé sur l'asymétrie (skewness) et l'aplatissement (kurtosis)</div>
                <div><strong>Q-Q plot :</strong> Méthode graphique</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications et utilité */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Applications et Utilité de la Distribution Normale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h6 className="font-semibold mb-2 text-blue-700">📊 Statistiques</h6>
              <ul className="text-xs space-y-1">
                <li>• Théorème central limite</li>
                <li>• Tests d'hypothèses (z-test, t-test)</li>
                <li>• Intervalles de confiance</li>
                <li>• ANOVA et régression</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h6 className="font-semibold mb-2 text-green-700">🤖 Machine Learning</h6>
              <ul className="text-xs space-y-1">
                <li>• Initialisation des poids</li>
                <li>• Régularisation gaussienne</li>
                <li>• Modèles génératifs (VAE)</li>
                <li>• Processus gaussiens</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h6 className="font-semibold mb-2 text-purple-700">💰 Finance</h6>
              <ul className="text-xs space-y-1">
                <li>• Modèle de Black-Scholes</li>
                <li>• Value at Risk (VaR)</li>
                <li>• Théorie moderne du portefeuille</li>
                <li>• Modèles de taux d'intérêt</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h6 className="font-semibold mb-2 text-orange-700">🔬 Sciences</h6>
              <ul className="text-xs space-y-1">
                <li>• Erreurs de mesure</li>
                <li>• Contrôle qualité (Six Sigma)</li>
                <li>• Modélisation physique</li>
                <li>• Analyse d'images médicales</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Limitations et précautions</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Hypothèse forte :</strong> Beaucoup de phénomènes ne sont pas normaux</li>
                  <li>• <strong>Queues légères :</strong> Sous-estime les événements extrêmes</li>
                  <li>• <strong>Symétrie :</strong> Inadaptée aux données asymétriques</li>
                  <li>• <strong>Paramètres fixes :</strong> Ne capture pas la volatilité variable</li>
                  <li>• <strong>Indépendance :</strong> Assume l'absence d'autocorrélation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Astuces et règles pratiques */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Astuces et Règles Pratiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-blue-700">🎯 Règles de pouce</h5>
                <ul className="text-sm space-y-2">
                  <li>• <strong>n ≥ 30 :</strong> TCL applicable pour la moyenne</li>
                  <li>• <strong>|Skewness| ≤ 2 :</strong> Approximation normale acceptable</li>
                  <li>• <strong>Kurtosis ≈ 3 :</strong> Forme proche de la normale</li>
                  <li>• <strong>99.7% dans ±3σ :</strong> Détection d'outliers</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-green-700">🔧 Transformations utiles</h5>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Log-normale :</strong> ln(X) si X &gt; 0 et asymétrique</li>
                  <li>• <strong>Box-Cox :</strong> Transformation paramétrique</li>
                  <li>• <strong>Standardisation :</strong> Z = (X-μ)/σ</li>
                  <li>• <strong>Winsorisation :</strong> Limiter les valeurs extrêmes</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-purple-700">📈 Diagnostic visuel</h5>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Histogramme :</strong> Forme en cloche symétrique</li>
                  <li>• <strong>Q-Q plot :</strong> Points alignés sur la diagonale</li>
                  <li>• <strong>Boîte à moustaches :</strong> médiane centrée, moustaches équilibrées</li>
                  <li>• <strong>Courbe de densité :</strong> courbe lisse, un seul sommet</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-orange-700">⚡ Calculs rapides</h5>
                <ul className="text-sm space-y-2">
                  <li>• <strong>P(|Z| &gt; 2) ≈ 5% :</strong> Seuil de significativité</li>
                  <li>• <strong>P(|Z| &gt; 1.96) = 5% :</strong> Intervalle 95%</li>
                  <li>• <strong>P(Z &gt; 1.645) = 5% :</strong> Test unilatéral</li>
                  <li>• <strong>Φ(0) = 0.5 :</strong> Médiane de N(0,1)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GaussianDistributionSection;