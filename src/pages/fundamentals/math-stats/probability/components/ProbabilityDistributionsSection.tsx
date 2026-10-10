import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Slider } from "@/components/ui/slider";
import { BarChart3, Zap, Clock, Shuffle, Target } from "lucide-react";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";

// Fonctions de calcul des distributions : pures, donc définies hors du composant (elles ne sont pas des dépendances des hooks)
/**
 * Calcule la fonction de masse de probabilité binomiale
 */
const calculateBinomial = (n: number, p: number, k: number): number => {
  const combination = factorial(n) / (factorial(k) * factorial(n - k));
  return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

/**
 * Calcule la factorielle d'un nombre
 */
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

/**
 * Calcule la fonction de masse de probabilité de Poisson
 */
const calculatePoisson = (lambda: number, k: number): number => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

/**
 * Calcule la fonction de densité de probabilité exponentielle
 */
const calculateExponential = (lambda: number, x: number): number => {
  return lambda * Math.exp(-lambda * x);
};

/**
 * Calcule la fonction de densité de probabilité uniforme
 */
const calculateUniform = (a: number, b: number, x: number): number => {
  return x >= a && x <= b ? 1 / (b - a) : 0;
};

/**
 * Composant pour la section sur les distributions de probabilité
 * Présente les principales distributions avec des visualisations interactives
 */
const ProbabilityDistributionsSection = () => {
  const [selectedDistribution, setSelectedDistribution] = useState<'binomial' | 'poisson' | 'exponential' | 'uniform'>('binomial');
  
  // Paramètres pour la distribution binomiale
  const [binomialN, setBinomialN] = useState([20]);
  const [binomialP, setBinomialP] = useState([0.3]);
  
  // Paramètres pour la distribution de Poisson
  const [poissonLambda, setPoissonLambda] = useState([3]);
  
  // Paramètres pour la distribution exponentielle
  const [exponentialLambda, setExponentialLambda] = useState([1]);
  
  // Paramètres pour la distribution uniforme
  const [uniformA, setUniformA] = useState([0]);
  const [uniformB, setUniformB] = useState([10]);

  // Génération des données pour les graphiques
  const binomialData = useMemo(() => {
    const n = binomialN[0];
    const p = binomialP[0];
    const data = [];
    for (let k = 0; k <= n; k++) {
      data.push({
        x: k,
        probability: calculateBinomial(n, p, k),
        cumulative: Array.from({length: k + 1}, (_, i) => calculateBinomial(n, p, i)).reduce((a, b) => a + b, 0)
      });
    }
    return data;
  }, [binomialN, binomialP]);

  const poissonData = useMemo(() => {
    const lambda = poissonLambda[0];
    const data = [];
    const maxK = Math.min(20, lambda + 10);
    for (let k = 0; k <= maxK; k++) {
      data.push({
        x: k,
        probability: calculatePoisson(lambda, k),
        cumulative: Array.from({length: k + 1}, (_, i) => calculatePoisson(lambda, i)).reduce((a, b) => a + b, 0)
      });
    }
    return data;
  }, [poissonLambda]);

  const exponentialData = useMemo(() => {
    const lambda = exponentialLambda[0];
    const data = [];
    const maxX = 5 / lambda;
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * maxX;
      data.push({
        x: x,
        probability: calculateExponential(lambda, x),
        cumulative: 1 - Math.exp(-lambda * x)
      });
    }
    return data;
  }, [exponentialLambda]);

  const uniformData = useMemo(() => {
    const a = uniformA[0];
    const b = uniformB[0];
    const data = [];
    const range = b - a;
    const step = range / 100;
    for (let i = 0; i <= 100; i++) {
      const x = a + i * step;
      data.push({
        x: x,
        probability: calculateUniform(a, b, x),
        cumulative: x < a ? 0 : x > b ? 1 : (x - a) / (b - a)
      });
    }
    return data;
  }, [uniformA, uniformB]);

  const distributions = {
    binomial: {
      title: "Distribution Binomiale",
      icon: Target,
      description: "Nombre de succès dans n essais indépendants",
      formula: "P(X = k) = C(n,k) \\cdot p^k \\cdot (1-p)^{n-k}",
      parameters: "n (nombre d'essais), p (probabilité de succès)",
      examples: "Lancers de pièce, tests de qualité, sondages",
      data: binomialData,
      color: "#3B82F6"
    },
    poisson: {
      title: "Distribution de Poisson",
      icon: Zap,
      description: "Nombre d'événements rares dans un intervalle fixe",
      formula: "P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
      parameters: "λ (taux moyen d'occurrence)",
      examples: "Appels téléphoniques, pannes, accidents",
      data: poissonData,
      color: "#10B981"
    },
    exponential: {
      title: "Distribution Exponentielle",
      icon: Clock,
      description: "Temps d'attente entre événements",
      formula: "f(x) = \\lambda e^{-\\lambda x}",
      parameters: "λ (taux d'occurrence)",
      examples: "Durée de vie, temps de service, intervalles",
      data: exponentialData,
      color: "#F59E0B"
    },
    uniform: {
      title: "Distribution Uniforme",
      icon: Shuffle,
      description: "Probabilité égale sur un intervalle",
      formula: "f(x) = \\frac{1}{b-a} \\text{ pour } a \\leq x \\leq b",
      parameters: "a (borne inférieure), b (borne supérieure)",
      examples: "Nombres aléatoires, erreurs de mesure",
      data: uniformData,
      color: "#8B5CF6"
    }
  };

  const currentDistribution = distributions[selectedDistribution];

  return (
    <section id="probability-distributions" className="mb-16">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        4. Les Distributions de Probabilité : Les Modèles de l'Aléatoire
      </h2>

      {/* Introduction */}
      <div className="mb-8">
        <CourseHighlight title="Qu'est-ce qu'une distribution de probabilité ?" type="concept">
          <div className="space-y-4">
            <p className="text-lg">
              Une distribution de probabilité est comme un "moule" mathématique qui décrit 
              comment les valeurs d'une variable aléatoire sont réparties. 
              C'est la "recette" qui nous dit quelle est la probabilité d'observer chaque valeur possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Variables Discrètes</h4>
                <p className="text-sm text-blue-700">
                  Valeurs séparées (0, 1, 2, 3...)<br/>
                  <strong>Fonction de masse :</strong> P(X = k)
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Variables Continues</h4>
                <p className="text-sm text-green-700">
                  Valeurs dans un intervalle<br/>
                  <strong>Fonction de densité :</strong> f(x)
                </p>
              </div>
            </div>
          </div>
        </CourseHighlight>
      </div>

      {/* Sélecteur de distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Explorateur de Distributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Boutons de sélection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(distributions).map(([key, dist]) => {
                const IconComponent = dist.icon;
                return (
                  <Button
                    key={key}
                    variant={selectedDistribution === key ? "default" : "outline"}
                    onClick={() => setSelectedDistribution(key as typeof selectedDistribution)}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs text-center">{dist.title}</span>
                  </Button>
                );
              })}
            </div>

            {/* Informations sur la distribution sélectionnée */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">{currentDistribution.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{currentDistribution.description}</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Paramètres :</strong> {currentDistribution.parameters}</div>
                    <div><strong>Exemples :</strong> {currentDistribution.examples}</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-semibold mb-2">Formule :</h5>
                  <CourseEquation latex={currentDistribution.formula} />
                </div>
              </div>
            </div>

            {/* Contrôles des paramètres */}
            <div className="space-y-4">
              <h4 className="font-semibold">Paramètres interactifs :</h4>
              
              {selectedDistribution === 'binomial' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre d'essais (n): {binomialN[0]}</label>
                    <Slider
                      value={binomialN}
                      onValueChange={setBinomialN}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Probabilité de succès (p): {binomialP[0].toFixed(2)}</label>
                    <Slider
                      value={binomialP}
                      onValueChange={setBinomialP}
                      min={0.01}
                      max={0.99}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {selectedDistribution === 'poisson' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Taux moyen (λ): {poissonLambda[0].toFixed(1)}</label>
                  <Slider
                    value={poissonLambda}
                    onValueChange={setPoissonLambda}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              {selectedDistribution === 'exponential' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Taux (λ): {exponentialLambda[0].toFixed(1)}</label>
                  <Slider
                    value={exponentialLambda}
                    onValueChange={setExponentialLambda}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              {selectedDistribution === 'uniform' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Borne inférieure (a): {uniformA[0]}</label>
                    <Slider
                      value={uniformA}
                      onValueChange={setUniformA}
                      min={-10}
                      max={uniformB[0] - 1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Borne supérieure (b): {uniformB[0]}</label>
                    <Slider
                      value={uniformB}
                      onValueChange={setUniformB}
                      min={uniformA[0] + 1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fonction de probabilité/densité */}
              <div className="space-y-3">
                <h5 className="font-semibold">Fonction de {selectedDistribution === 'exponential' || selectedDistribution === 'uniform' ? 'densité' : 'masse'}</h5>
                <div className="h-64 bg-white rounded border">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    {selectedDistribution === 'exponential' || selectedDistribution === 'uniform' ? (
                      <AreaChart data={currentDistribution.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" fontSize={12} tickFormatter={(value) => Number(value).toFixed(1)} />
                        <YAxis fontSize={12} tickFormatter={(value) => Number(value).toFixed(2)} />
                        <Tooltip formatter={(value) => [Number(value).toFixed(4), 'Densité']} />
                        <Area 
                          type="monotone" 
                          dataKey="probability" 
                          stroke={currentDistribution.color} 
                          fill={currentDistribution.color} 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={currentDistribution.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" fontSize={12} />
                        <YAxis fontSize={12} tickFormatter={(value) => Number(value).toFixed(2)} />
                        <Tooltip formatter={(value) => [Number(value).toFixed(4), 'Probabilité']} />
                        <Bar dataKey="probability" fill={currentDistribution.color} />
                      </BarChart>
                    )}
                  </DeferredResponsiveContainer>
                </div>
              </div>

              {/* Fonction de répartition */}
              <div className="space-y-3">
                <h5 className="font-semibold">Fonction de répartition F(x) = P(X ≤ x)</h5>
                <div className="h-64 bg-white rounded border">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentDistribution.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" fontSize={12} tickFormatter={(value) => Number(value).toFixed(selectedDistribution === "binomial" || selectedDistribution === "poisson" ? 0 : 1)} />
                      <YAxis fontSize={12} tickFormatter={(value) => Number(value).toFixed(2)} />
                      <Tooltip formatter={(value) => [Number(value).toFixed(4), 'P(X ≤ x)']} />
                      <Line 
                        type="monotone" 
                        dataKey="cumulative" 
                        stroke={currentDistribution.color} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </DeferredResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3">Statistiques de la distribution :</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {selectedDistribution === 'binomial' && (
                  <>
                    <div className="text-center">
                      <div className="font-semibold">Espérance</div>
                      <div className="text-blue-600">{(binomialN[0] * binomialP[0]).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Variance</div>
                      <div className="text-blue-600">{(binomialN[0] * binomialP[0] * (1 - binomialP[0])).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Écart-type</div>
                      <div className="text-blue-600">{Math.sqrt(binomialN[0] * binomialP[0] * (1 - binomialP[0])).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Mode</div>
                      <div className="text-blue-600">{Math.floor((binomialN[0] + 1) * binomialP[0])}</div>
                    </div>
                  </>
                )}
                
                {selectedDistribution === 'poisson' && (
                  <>
                    <div className="text-center">
                      <div className="font-semibold">Espérance</div>
                      <div className="text-green-600">{poissonLambda[0].toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Variance</div>
                      <div className="text-green-600">{poissonLambda[0].toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Écart-type</div>
                      <div className="text-green-600">{Math.sqrt(poissonLambda[0]).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Mode</div>
                      <div className="text-green-600">{Math.floor(poissonLambda[0])}</div>
                    </div>
                  </>
                )}
                
                {selectedDistribution === 'exponential' && (
                  <>
                    <div className="text-center">
                      <div className="font-semibold">Espérance</div>
                      <div className="text-yellow-600">{(1 / exponentialLambda[0]).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Variance</div>
                      <div className="text-yellow-600">{(1 / (exponentialLambda[0] * exponentialLambda[0])).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Écart-type</div>
                      <div className="text-yellow-600">{(1 / exponentialLambda[0]).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Médiane</div>
                      <div className="text-yellow-600">{(Math.log(2) / exponentialLambda[0]).toFixed(2)}</div>
                    </div>
                  </>
                )}
                
                {selectedDistribution === 'uniform' && (
                  <>
                    <div className="text-center">
                      <div className="font-semibold">Espérance</div>
                      <div className="text-purple-600">{((uniformA[0] + uniformB[0]) / 2).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Variance</div>
                      <div className="text-purple-600">{(Math.pow(uniformB[0] - uniformA[0], 2) / 12).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Écart-type</div>
                      <div className="text-purple-600">{(Math.sqrt(Math.pow(uniformB[0] - uniformA[0], 2) / 12)).toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Médiane</div>
                      <div className="text-purple-600">{((uniformA[0] + uniformB[0]) / 2).toFixed(2)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications pratiques */}
      <CourseHighlight title="Applications en Data Science" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Distribution Binomiale :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Test A/B :</strong> taux de conversion
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Contrôle qualité :</strong> taux de défauts
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Enquêtes :</strong> réponses oui/non
              </div>
            </div>
            
            <h4 className="font-semibold">Distribution de Poisson :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Audience web :</strong> pages vues par heure
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Trafic réseau :</strong> arrivée des paquets
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Service client :</strong> appels reçus par heure
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Distribution Exponentielle :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Fiabilité :</strong> durée de vie d'un composant
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Files d'attente :</strong> durées de service
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Finance :</strong> délai entre deux transactions
              </div>
            </div>
            
            <h4 className="font-semibold">Distribution Uniforme :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Monte Carlo :</strong> génération de nombres aléatoires
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Simulation :</strong> tirage uniforme
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Cryptographie :</strong> génération de clés
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-indigo-100 p-4 rounded-lg">
          <h5 className="font-semibold text-indigo-800 mb-2">Choisir la bonne distribution :</h5>
          <div className="text-sm text-indigo-700 space-y-1">
            <p>• <strong>Comptage d'événements rares :</strong> Poisson</p>
            <p>• <strong>Succès/échecs répétés :</strong> Binomiale</p>
            <p>• <strong>Temps d'attente :</strong> Exponentielle</p>
            <p>• <strong>Valeurs équiprobables :</strong> Uniforme</p>
            <p>• <strong>Phénomènes naturels :</strong> Normale (Gaussienne)</p>
          </div>
        </div>
      </CourseHighlight>
    </section>
  );
};

export default ProbabilityDistributionsSection;