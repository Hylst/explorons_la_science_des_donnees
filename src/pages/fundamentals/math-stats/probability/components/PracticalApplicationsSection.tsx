import { useState } from "react";
import { Brain, Shield, Zap, Target, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseHighlight from "@/components/courses/CourseHighlight";
import CourseEquation from "@/components/courses/CourseEquation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";

/**
 * Component for practical applications of probability in data science
 * Demonstrates real-world use cases including ML, A/B testing, risk analysis, and recommendation systems
 */
const PracticalApplicationsSection = () => {
  const [selectedApplication, setSelectedApplication] = useState<'ml' | 'ab-testing' | 'risk' | 'recommendation'>('ml');

  // Classification data for ML example
  const classificationData = [
    { category: 'Spam', probability: 0.85, label: 'Très probable' },
    { category: 'Important', probability: 0.12, label: 'Peu probable' },
    { category: 'Promotion', probability: 0.03, label: 'Très peu probable' }
  ];

  // A/B testing data
  const abTestData = [
    { variant: 'Version A', conversions: 245, visitors: 1000, rate: 24.5 },
    { variant: 'Version B', conversions: 287, visitors: 1000, rate: 28.7 }
  ];

  // Risk analysis data
  const riskData = [
    { scenario: 'Optimiste', probability: 0.2, return: 15 },
    { scenario: 'Probable', probability: 0.6, return: 8 },
    { scenario: 'Pessimiste', probability: 0.2, return: -3 }
  ];

  // Recommendation system data
  const recommendationData = [
    { item: 'Produit A', score: 0.92, category: 'Électronique' },
    { item: 'Produit B', score: 0.87, category: 'Électronique' },
    { item: 'Produit C', score: 0.73, category: 'Maison' },
    { item: 'Produit D', score: 0.68, category: 'Sport' },
    { item: 'Produit E', score: 0.45, category: 'Livres' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  /**
   * Calculate expected return for risk analysis
   */
  const calculateExpectedReturn = () => {
    return riskData.reduce((sum, scenario) => {
      return sum + (scenario.probability * scenario.return);
    }, 0);
  };

  /** Écart-type des rendements : la mesure de risque la plus simple */
  const calculateReturnStd = () => {
    const mean = calculateExpectedReturn();
    return Math.sqrt(riskData.reduce((sum, scenario) => sum + scenario.probability * (scenario.return - mean) ** 2, 0));
  };

  /**
   * Calculate confidence interval for A/B testing
   */
  const calculateConfidenceInterval = (conversions: number, visitors: number) => {
    const p = conversions / visitors;
    const margin = 1.96 * Math.sqrt((p * (1 - p)) / visitors);
    return {
      lower: ((p - margin) * 100).toFixed(2),
      upper: ((p + margin) * 100).toFixed(2)
    };
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Applications Pratiques des Probabilités en Data Science
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CourseHighlight title="Applications Pratiques" type="concept">
              Les probabilités sont au cœur de la Data Science moderne. Elles permettent de quantifier 
              l'incertitude, d'évaluer les risques et de prendre des décisions éclairées basées sur les données.
            </CourseHighlight>
            
            <p className="text-gray-700">
              De la classification automatique d'emails à l'optimisation de campagnes marketing, 
              en passant par l'analyse de risques financiers, les probabilités aident à décider malgré l'incertitude.
            </p>
            <p className="text-sm text-gray-600">
              Les chiffres des quatre exemples ci-dessous sont fictifs : ils servent seulement à illustrer les calculs.
            </p>

            {/* Navigation des applications */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button 
                variant={selectedApplication === 'ml' ? 'default' : 'outline'}
                onClick={() => setSelectedApplication('ml')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Machine Learning
              </Button>
              <Button 
                variant={selectedApplication === 'ab-testing' ? 'default' : 'outline'}
                onClick={() => setSelectedApplication('ab-testing')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                A/B Testing
              </Button>
              <Button 
                variant={selectedApplication === 'risk' ? 'default' : 'outline'}
                onClick={() => setSelectedApplication('risk')}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Analyse de Risque
              </Button>
              <Button 
                variant={selectedApplication === 'recommendation' ? 'default' : 'outline'}
                onClick={() => setSelectedApplication('recommendation')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Recommandation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machine Learning */}
      {selectedApplication === 'ml' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Classification d'e-mails (exemple fictif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Distribution des probabilités</h4>
                <div className="h-64">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={classificationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, probability }) => `${category}: ${(probability * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="probability"
                      >
                        {classificationData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Probabilité']} />
                    </PieChart>
                  </DeferredResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Prédictions du modèle</h4>
                {classificationData.map((item, index) => (
                  <div key={item.category} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.category}</span>
                      <Badge className="ml-2" variant={item.probability >= 0.7 ? 'default' : item.probability >= 0.1 ? 'secondary' : 'outline'}>
                        {item.label}
                      </Badge>
                    </div>
                    <span className="text-lg font-bold" style={{ color: COLORS[index] }}>
                      {(item.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Décision automatique :</h5>
                  <p className="text-sm">
                    <strong>Classification :</strong> Spam (probabilité estimée : 85 %, au-dessus du seuil)<br/>
                    <strong>Action :</strong> Déplacer vers le dossier spam<br/>
                    <strong>Seuil de décision :</strong> 70%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <CourseEquation latex="P(Spam|Email) = \frac{P(Email|Spam) \cdot P(Spam)}{P(Email)}" />
              <p className="text-sm text-gray-600 mt-2">
                Théorème de Bayes appliqué à la classification d'emails
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* A/B Testing */}
      {selectedApplication === 'ab-testing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Test A/B : comparer deux versions (exemple fictif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Comparaison des variantes</h4>
                <div className="h-64">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <BarChart data={abTestData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="variant" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Taux de conversion']} />
                      <Bar dataKey="rate" fill="#10B981" />
                    </BarChart>
                  </DeferredResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Analyse statistique</h4>
                {abTestData.map((variant) => {
                  const ci = calculateConfidenceInterval(variant.conversions, variant.visitors);
                  return (
                    <div key={variant.variant} className="bg-gray-50 p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{variant.variant}</span>
                        <span className="text-lg font-bold text-green-600">{variant.rate}%</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Conversions: {variant.conversions}/{variant.visitors}</div>
                        <div>IC 95%: [{ci.lower}% - {ci.upper}%]</div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Résultats :</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Amélioration :</strong> +4.2 points de pourcentage</li>
                    <li>• <strong>Lift relatif :</strong> +17.1%</li>
                    <li>• <strong>Test :</strong> Z ≈ 2,13, p ≈ 0,033 (bilatéral), donc p &lt; 0,05</li>
                    <li>• <strong>Lecture :</strong> un écart aussi grand serait rare si les deux versions convertissaient pareil ; reste à juger s'il compte en pratique</li>
                    <li>• <strong>Piège :</strong> les deux intervalles ci-dessus se chevauchent, et pourtant la différence est significative : il faut tester la différence elle-même</li>
                  </ul>
                </div>
              </div>
            </div>
              
            <div className="mt-6">
              <CourseEquation latex="Z = \frac{p_B - p_A}{\sqrt{\frac{p_A(1-p_A)}{n_A} + \frac{p_B(1-p_B)}{n_B}}}" />
              <p className="text-sm text-gray-600 mt-2">
                Où p_A et p_B sont les taux de conversion, n_A et n_B les tailles d'échantillon
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Analysis */}
      {selectedApplication === 'risk' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Analyse de risque (exemple fictif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Scénarios de rendement</h4>
                <div className="h-64">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'probability' ? `${(Number(value) * 100).toFixed(0)}%` : `${value}%`,
                        name === 'probability' ? 'Probabilité' : 'Rendement'
                      ]} />
                      <Bar dataKey="return" fill="#3B82F6" />
                    </BarChart>
                  </DeferredResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Analyse quantitative</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Rendement Espéré</div>
                    <span className="font-bold text-blue-600">{calculateExpectedReturn().toFixed(2)}%</span>
                  </div>
                </div>
                
                {riskData.map((scenario) => (
                  <div key={scenario.scenario} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                    <div>
                      <span className="font-medium">{scenario.scenario}</span>
                      <div className="text-sm text-gray-600">
                        Probabilité: {(scenario.probability * 100).toFixed(0)}%
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${
                      scenario.return > 0 ? 'text-green-600' : scenario.return < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {scenario.return > 0 ? '+' : ''}{scenario.return}%
                    </span>
                  </div>
                ))}
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    À retenir :
                  </h5>
                  <p className="text-sm">
                    Rendement espéré : {calculateExpectedReturn().toFixed(2)} %. L'espérance ne dit rien du risque : il faut aussi
                    regarder la dispersion des scénarios (de -3 % à +15 %), ici un écart-type d'environ {calculateReturnStd().toFixed(2)} points.
                    Ce calcul illustre une notion de cours, ce n'est pas un conseil d'investissement.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <CourseEquation latex={`E[R] = \\sum_{i=1}^n p_i \\cdot r_i = 0.2 \\times 15 + 0.6 \\times 8 + 0.2 \\times (-3) = ${calculateExpectedReturn().toFixed(2)}\\%`} />
              <p className="text-sm text-gray-600 mt-2">
                Calcul de l'espérance mathématique du rendement
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation System */}
      {selectedApplication === 'recommendation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Système de recommandation (exemple fictif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Scores de recommandation personnalisés</h4>
                <div className="space-y-3">
                  {recommendationData.map((item) => (
                    <div key={item.item} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.item}</span>
                        <Badge className="ml-2" variant="outline">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.score * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-blue-600">{(item.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Recommandation Top</h5>
                  <div className="space-y-2">
                    <div><strong>Produit :</strong> {recommendationData[0].item}</div>
                    <div><strong>Score :</strong> {(recommendationData[0].score * 100).toFixed(0)}%</div>
                    <div><strong>Catégorie :</strong> {recommendationData[0].category}</div>
                    <div><strong>À noter :</strong> un score de recommandation n'est pas une probabilité d'achat</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Métriques du système</h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Précision :</strong> 87.3%</div>
                    <div><strong>Rappel :</strong> 82.1%</div>
                    <div><strong>Taux de clic :</strong> +34%</div>
                    <div><strong>Conversion :</strong> +28%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <CourseEquation latex="Score(u,i) = \sum_{j \in factors} w_j \cdot P(like_j | user_u, item_i)" />
              <p className="text-sm text-gray-600 mt-2">
                Modèle simplifié, à titre d'illustration : les systèmes réels utilisent plutôt le filtrage collaboratif ou la factorisation de matrices
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synthesis */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-green-600" />
            Synthèse : ce que les probabilités apportent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CourseHighlight title="Points Clés" type="info">
              Les probabilités permettent de prendre des décisions en tenant compte de l'incertitude, et de dire avec quelle assurance on le fait.
            </CourseHighlight>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>• Pratiquer avec des jeux de données réels</li>
                <li>• Implémenter des modèles probabilistes</li>
                <li>• Approfondir les tests statistiques</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>• Comprendre les biais cognitifs</li>
                <li>• Apprendre l'inférence bayésienne</li>
                <li>• Développer l'intuition statistique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticalApplicationsSection;