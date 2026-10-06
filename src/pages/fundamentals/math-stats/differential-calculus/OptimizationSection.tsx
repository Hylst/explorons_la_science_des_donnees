
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ComposedChart } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import { Pause, Play, RotateCcw, Target, TrendingDown } from "lucide-react";

const REPLAY_DELAY_MS = 450;

const OptimizationSection = () => {
  const [learningRate, setLearningRate] = useState([0.1]);
  // null : tout le chemin est affiché ; sinon seules les itérations 0..currentStep le sont (rejeu animé)
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Données pour la descente de gradient avec différents learning rates
  const generateGradientDescent = (alpha: number) => {
    const steps = [];
    let x = 4; // Point de départ
    for (let i = 0; i <= 20; i++) {
      const fx = (x - 1) * (x - 1); // f(x) = (x-1)²
      const gradient = 2 * (x - 1); // f'(x) = 2(x-1)
      steps.push({ 
        step: i, 
        x: parseFloat(x.toFixed(3)), 
        fx: parseFloat(fx.toFixed(3)),
        gradient: parseFloat(gradient.toFixed(3))
      });
      x = x - alpha * gradient;
      if (Math.abs(gradient) < 0.001) break;
    }
    return steps;
  };

  const gradientData = generateGradientDescent(learningRate[0]);
  const lastStep = gradientData.length - 1;
  const visiblePath = currentStep === null ? gradientData : gradientData.slice(0, Math.min(currentStep, lastStep) + 1);

  // Rejeu : une itération de plus à chaque tick, arrêt à la dernière
  useEffect(() => {
    if (!isAnimating) return;
    const timer = window.setInterval(() => setCurrentStep((step) => (step ?? 0) + 1), REPLAY_DELAY_MS);
    return () => window.clearInterval(timer);
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating && currentStep !== null && currentStep >= lastStep) setIsAnimating(false);
  }, [isAnimating, currentStep, lastStep]);

  const toggleReplay = () => {
    if (isAnimating) {
      setIsAnimating(false);
      return;
    }
    if (currentStep === null || currentStep >= lastStep) setCurrentStep(0);
    setIsAnimating(true);
  };

  const showFullPath = () => {
    setIsAnimating(false);
    setCurrentStep(null);
  };

  // Fonction quadratique pour visualisation (x de -2 à 5)
  const functionPoints = Array.from({ length: 101 }, (_, i) => {
    const x = -2 + i * 0.07;
    const fx = (x - 1) * (x - 1);
    return { x: parseFloat(x.toFixed(2)), fx: parseFloat(fx.toFixed(2)) };
  });

  const criticalPointsExamples = [
    {
      function: "f(x) = x³ - 3x",
      derivative: "f'(x) = 3x² - 3",
      criticalPoints: "x = ±1",
      analysis: "f''(-1) = -6 < 0 → maximum local | f''(1) = 6 > 0 → minimum local"
    },
    {
      function: "f(x) = x⁴ - 4x³",
      derivative: "f'(x) = 4x³ - 12x²",
      criticalPoints: "x = 0, x = 3",
      analysis: "f''(0) = 0 → test inconcluant | f''(3) = 36 > 0 → minimum local"
    }
  ];

  return (
    <section id="optimization" className="scroll-mt-24 space-y-8">
      <h2 className="text-3xl font-bold mb-6">3. Optimisation avec les Dérivées</h2>
      
      <CourseHighlight title="🎯 L'objectif" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-4">
              En machine learning, optimiser = <strong>minimiser l'erreur</strong>. 
              Les dérivées nous indiquent dans quelle direction aller !
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Principe fondamental
              </h4>
              <p className="text-sm">Suivre la pente négative pour descendre vers le minimum</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Applications concrètes :</h4>
            <ul className="text-sm space-y-1">
              <li>• Ajuster les poids d'un réseau de neurones</li>
              <li>• Ajuster les coefficients d'une régression</li>
              <li>• Minimiser la fonction de coût</li>
              <li>• Trouver les meilleurs paramètres de modèle</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Points critiques et extrema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Les extrema d'une fonction se trouvent aux points où la dérivée s'annule 
              ou n'existe pas.
            </p>
            <CourseEquation latex="f'(x) = 0 \text{ ou } f'(x) \text{ n'existe pas}" />
            
            <div className="space-y-3 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm">Test de la dérivée seconde</h4>
                <ul className="text-xs space-y-1 mt-2">
                  <li>• Si f&apos;&apos;(x) &gt; 0 : minimum local (courbe vers le haut ∪)</li>
                  <li>• Si f&apos;&apos;(x) &lt; 0 : maximum local (courbe vers le bas ∩)</li>
                  <li>• Si f&apos;&apos;(x) = 0 : test inconcluant (point d&apos;inflexion ?)</li>
                </ul>
              </div>
              
              <CourseHighlight title="💡 Astuce visuelle" type="example">
                <p className="text-sm">
                  Imaginez une bille qui roule : elle s'arrête naturellement dans les creux (minima) 
                  et tombe des bosses (maxima) !
                </p>
              </CourseHighlight>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exemples détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalPointsExamples.map((example, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h5 className="font-semibold text-sm mb-2">Exemple {index + 1}</h5>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold">Fonction :</span> {example.function}
                    </div>
                    <div>
                      <span className="font-semibold">Dérivée :</span> {example.derivative}
                    </div>
                    <div>
                      <span className="font-semibold">Points critiques :</span> {example.criticalPoints}
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-semibold">Analyse :</span> {example.analysis}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Simulateur de descente de gradient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="mb-4">
                Explorez l'effet du taux d'apprentissage α sur la convergence 
                pour minimiser f(x) = (x-1)².
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <CourseEquation latex="x_{n+1} = x_n - \alpha f'(x_n)" />
                <p className="text-sm text-center">
                  α = {learningRate[0].toLocaleString("fr-FR")} (taux d'apprentissage)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Taux d'apprentissage (α) :</label>
                  <Slider
                    aria-label="Taux d'apprentissage"
                    value={learningRate}
                    onValueChange={(value) => {
                      setLearningRate(value);
                      showFullPath();
                    }}
                    min={0.01}
                    max={1}
                    step={0.01}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0,01 (lent)</span>
                    <span>0,5 (un seul pas)</span>
                    <span>1 (oscille sans fin)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={toggleReplay}>
                    {isAnimating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {isAnimating ? "Pause" : "Rejouer la descente"}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={showFullPath} disabled={currentStep === null}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Afficher tout le chemin
                  </Button>
                  <span className="text-sm text-gray-600" aria-live="polite">
                    Itération {visiblePath.length - 1} sur {lastStep}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Fonction f(x) = (x-1)²</h4>
                    <div className="h-48">
                      <DeferredResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={functionPoints}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="x" domain={[-2, 5]} allowDataOverflow />
                          <YAxis type="number" domain={[0, 10]} allowDataOverflow />
                          <Tooltip />
                          <Line type="monotone" dataKey="fx" stroke="#94A3B8" strokeWidth={2} dot={false} name="f(x)" isAnimationActive={false} />
                          <Scatter data={visiblePath} dataKey="fx" fill="#DC2626" name="Itérations" isAnimationActive={false} />
                        </ComposedChart>
                      </DeferredResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Convergence</h4>
                    <div className="h-48">
                      <DeferredResponsiveContainer width="100%" height="100%">
                        <LineChart data={gradientData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="step" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="fx" stroke="#DC2626" strokeWidth={2} name="f(x)" />
                          <Line type="monotone" dataKey="x" stroke="#2563EB" strokeWidth={2} name="x" />
                        </LineChart>
                      </DeferredResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Résultats de la simulation :</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Point de départ :</span> x₀ = 4
                    </div>
                    <div>
                      <span className="font-semibold">Nombre d'itérations :</span> {lastStep}
                    </div>
                    <div>
                      <span className="font-semibold">Point final :</span> x = {gradientData[gradientData.length - 1]?.x}
                    </div>
                    <div>
                      <span className="font-semibold">Erreur finale :</span> {gradientData[gradientData.length - 1]?.fx}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseHighlight title="⚠️ Un réglage décisif : le taux d'apprentissage" type="warning">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">α trop grand</h4>
            <ul className="text-sm space-y-1">
              <li>• Oscillations autour du minimum</li>
              <li>• Risque de divergence</li>
              <li>• Instabilité numérique</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">α bien choisi</h4>
            <ul className="text-sm space-y-1">
              <li>• Convergence rapide et stable</li>
              <li>• Bon compromis vitesse/stabilité</li>
              <li>• Dépend du problème : pour f(x) = (x-1)², α = 0,5 converge en un pas, α &gt; 0,5 oscille et α &gt; 1 diverge</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">α trop petit</h4>
            <ul className="text-sm space-y-1">
              <li>• Convergence très lente</li>
              <li>• Beaucoup d'itérations nécessaires</li>
              <li>• Coût de calcul élevé</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      <CourseHighlight title="🔍 Zoom sur : Variantes de l'optimisation" type="info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Descente de gradient classique</h4>
            <CourseEquation latex="\theta_{t+1} = \theta_t - \alpha \nabla J(\theta_t)" />
            <p className="text-sm text-gray-600">Simple mais peut être lent</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Momentum</h4>
            <CourseEquation latex="v_t = \beta v_{t-1} + (1-\beta) \nabla J(\theta_t), \quad \theta_{t+1} = \theta_t - \alpha v_t" />
            <p className="text-sm text-gray-600">Accélère la convergence avec &quot;inertie&quot;</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Adam (moments adaptatifs)</h4>
            <CourseEquation latex="\theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t" />
            <p className="text-sm text-gray-600">Adapte le taux d'apprentissage pour chaque paramètre (m̂ et v̂ : moyennes mobiles du gradient et de son carré, corrigées de leur biais)</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Descente de gradient stochastique (SGD)</h4>
            <CourseEquation latex="\theta_{t+1} = \theta_t - \alpha \nabla J_i(\theta_t)" />
            <p className="text-sm text-gray-600">Utilise un échantillon aléatoire à chaque étape</p>
          </div>
        </div>
      </CourseHighlight>
    </section>
  );
};

export default OptimizationSection;
