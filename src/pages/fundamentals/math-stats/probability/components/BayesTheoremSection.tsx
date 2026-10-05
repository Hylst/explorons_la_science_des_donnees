import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calculator } from "lucide-react";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Composant pour la section sur le théorème de Bayes
 * Présente le théorème avec des exemples interactifs et des applications pratiques
 */
const BayesTheoremSection = () => {
  const [selectedExample, setSelectedExample] = useState<'medical' | 'spam' | 'weather'>('medical');
  const [testResult, setTestResult] = useState<'positive' | 'negative'>('positive');

  // Données pour l'exemple médical
  const medicalData = {
    diseasePrevalence: 0.001, // 0.1% de la population a la maladie
    testSensitivity: 0.99,    // 99% de détection si malade
    testSpecificity: 0.95     // 95% de spécificité (5% de faux positifs)
  };

  // Calcul de Bayes pour l'exemple médical
  const calculateMedicalBayes = () => {
    const { diseasePrevalence, testSensitivity, testSpecificity } = medicalData;
    
    if (testResult === 'positive') {
      const truePositive = diseasePrevalence * testSensitivity;
      const falsePositive = (1 - diseasePrevalence) * (1 - testSpecificity);
      const totalPositive = truePositive + falsePositive;
      return truePositive / totalPositive;
    } else {
      const trueNegative = (1 - diseasePrevalence) * testSpecificity;
      const falseNegative = diseasePrevalence * (1 - testSensitivity);
      const totalNegative = trueNegative + falseNegative;
      return falseNegative / totalNegative;
    }
  };

  const medicalProbability = calculateMedicalBayes();

  // Données pour la visualisation
  const bayesVisualizationData = [
    { category: 'Vrais Positifs', value: medicalData.diseasePrevalence * medicalData.testSensitivity * 100000, color: '#10B981' },
    { category: 'Faux Positifs', value: (1 - medicalData.diseasePrevalence) * (1 - medicalData.testSpecificity) * 100000, color: '#EF4444' },
    { category: 'Vrais Négatifs', value: (1 - medicalData.diseasePrevalence) * medicalData.testSpecificity * 100000, color: '#3B82F6' },
    { category: 'Faux Négatifs', value: medicalData.diseasePrevalence * (1 - medicalData.testSensitivity) * 100000, color: '#F59E0B' }
  ];

  const examples = {
    medical: {
      title: "🏥 Diagnostic Médical",
      description: "Test de dépistage d'une maladie rare",
      scenario: "Une maladie touche 0.1% de la population. Un test a 99% de sensibilité et 95% de spécificité."
    },
    spam: {
      title: "📧 Détection de Spam",
      description: "Classification automatique des emails",
      scenario: "30% des emails sont des spams. Le filtre détecte 95% des spams mais classe 2% des vrais emails comme spam."
    },
    weather: {
      title: "🌧️ Prévision Météo",
      description: "Prédiction de pluie basée sur les nuages",
      scenario: "Il pleut 20% des jours. Quand il pleut, il y a des nuages 90% du temps. Quand il ne pleut pas, il y a des nuages 30% du temps."
    }
  };

  return (
    <section id="bayes-theorem" className="mb-16">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        🧠 3. Le Théorème de Bayes : L'Art de Réviser ses Croyances
      </h2>

      {/* Introduction conceptuelle */}
      <div className="mb-8">
        <CourseHighlight title="🎭 L'histoire du détective Bayes" type="concept">
          <div className="space-y-4">
            <p className="text-lg">
              Imaginez un détective qui reçoit un nouvel indice dans une enquête. 
              Avant cet indice, il avait une certaine conviction sur qui était le coupable. 
              Maintenant, avec cette nouvelle information, comment doit-il réviser sa conviction ?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm">
                <strong>🎯 C'est exactement ce que fait le théorème de Bayes :</strong> 
                Il nous dit comment mettre à jour nos croyances quand on reçoit de nouvelles informations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded text-center">
                <strong>Avant l'indice</strong><br/>
                Probabilité a priori<br/>
                P(Coupable)
              </div>
              <div className="bg-yellow-50 p-3 rounded text-center">
                <strong>Nouvel indice</strong><br/>
                Vraisemblance<br/>
                P(Indice|Coupable)
              </div>
              <div className="bg-green-50 p-3 rounded text-center">
                <strong>Après l'indice</strong><br/>
                Probabilité a posteriori<br/>
                P(Coupable|Indice)
              </div>
            </div>
          </div>
        </CourseHighlight>
      </div>

      {/* Formule mathématique */}
      <Card className="mb-8 border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            La Formule Magique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-center">Théorème de Bayes</h4>
              <CourseEquation latex="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-semibold">🔍 Décomposition :</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">P(A|B)</Badge>
                    <span>Probabilité a posteriori (ce qu'on cherche)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">P(B|A)</Badge>
                    <span>Vraisemblance (probabilité de l'observation)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">P(A)</Badge>
                    <span>Probabilité a priori (croyance initiale)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800">P(B)</Badge>
                    <span>Évidence (probabilité totale de l'observation)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">💡 En mots simples :</h5>
                <p className="text-sm">
                  <strong>Nouvelle croyance</strong> = <br/>
                  (Ancienne croyance × Compatibilité avec l'observation) / Probabilité totale de l'observation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples interactifs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exemples Interactifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sélecteur d'exemple */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(examples).map(([key, example]) => (
                <Button
                  key={key}
                  variant={selectedExample === key ? "default" : "outline"}
                  onClick={() => setSelectedExample(key as typeof selectedExample)}
                  className="text-sm"
                >
                  {example.title}
                </Button>
              ))}
            </div>

            {/* Exemple médical détaillé */}
            {selectedExample === 'medical' && (
              <div className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">{examples.medical.title}</h4>
                  <p className="text-sm text-red-700 mb-4">{examples.medical.scenario}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">Paramètres du test :</h5>
                      <div className="space-y-1 text-sm">
                        <div>Prévalence de la maladie : <strong>0.1%</strong></div>
                        <div>Sensibilité du test : <strong>99%</strong></div>
                        <div>Spécificité du test : <strong>95%</strong></div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2">Résultat du test :</h5>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={testResult === 'positive' ? "default" : "outline"}
                          onClick={() => setTestResult('positive')}
                        >
                          Positif
                        </Button>
                        <Button
                          size="sm"
                          variant={testResult === 'negative' ? "default" : "outline"}
                          onClick={() => setTestResult('negative')}
                        >
                          Négatif
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calcul et résultat */}
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-semibold mb-3">🧮 Calcul de Bayes :</h5>
                  
                  {testResult === 'positive' ? (
                    <div className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div>P(Malade|Test+) = P(Test+|Malade) × P(Malade) / P(Test+)</div>
                        <div>P(Test+|Malade) = 0.99 (sensibilité)</div>
                        <div>P(Malade) = 0.001 (prévalence)</div>
                        <div>P(Test+) = P(Test+|Malade) × P(Malade) + P(Test+|Sain) × P(Sain)</div>
                        <div>P(Test+) = 0.99 × 0.001 + 0.05 × 0.999 = {(0.99 * 0.001 + 0.05 * 0.999).toFixed(6)}</div>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                        <p className="font-semibold text-lg">
                          Probabilité d'être réellement malade : <span className="text-red-600">{(medicalProbability * 100).toFixed(2)}%</span>
                        </p>
                        <p className="text-sm mt-1">
                          Malgré un test positif, il n'y a que {(medicalProbability * 100).toFixed(2)}% de chances d'être réellement malade !
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div>P(Malade|Test-) = P(Test-|Malade) × P(Malade) / P(Test-)</div>
                        <div>P(Test-|Malade) = 0.01 (1 - sensibilité)</div>
                        <div>P(Malade) = 0.001 (prévalence)</div>
                        <div>P(Test-) = P(Test-|Malade) × P(Malade) + P(Test-|Sain) × P(Sain)</div>
                        <div>P(Test-) = 0.01 × 0.001 + 0.95 × 0.999 = {(0.01 * 0.001 + 0.95 * 0.999).toFixed(6)}</div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                        <p className="font-semibold text-lg">
                          Probabilité d'être malade malgré un test négatif : <span className="text-green-600">{(medicalProbability * 100).toFixed(4)}%</span>
                        </p>
                        <p className="text-sm mt-1">
                          Un test négatif est très rassurant avec cette maladie rare !
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visualisation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">📊 Visualisation sur 100,000 personnes :</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bayesVisualizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip formatter={(value) => [Math.round(Number(value)), 'Personnes']} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Autres exemples (versions simplifiées) */}
            {selectedExample === 'spam' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{examples.spam.title}</h4>
                <p className="text-sm text-blue-700 mb-3">{examples.spam.scenario}</p>
                <div className="text-sm">
                  <p><strong>Question :</strong> Si un email est classé comme spam, quelle est la probabilité qu'il soit vraiment un spam ?</p>
                  <p className="mt-2"><strong>Réponse :</strong> P(Spam|Classé Spam) = (0.95 × 0.30) / (0.95 × 0.30 + 0.02 × 0.70) ≈ <strong>95.3%</strong></p>
                </div>
              </div>
            )}

            {selectedExample === 'weather' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">{examples.weather.title}</h4>
                <p className="text-sm text-green-700 mb-3">{examples.weather.scenario}</p>
                <div className="text-sm">
                  <p><strong>Question :</strong> S'il y a des nuages, quelle est la probabilité qu'il pleuve ?</p>
                  <p className="mt-2"><strong>Réponse :</strong> P(Pluie|Nuages) = (0.90 × 0.20) / (0.90 × 0.20 + 0.30 × 0.80) ≈ <strong>42.9%</strong></p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applications en Data Science */}
      <CourseHighlight title="🚀 Applications en Data Science" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">🤖 Machine Learning :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Naive Bayes Classifier :</strong> Classification de textes, emails, sentiments
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Bayesian Networks :</strong> Modélisation de dépendances complexes
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>A/B Testing :</strong> Mise à jour des croyances avec nouvelles données
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">🏢 Applications Business :</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Détection de Fraude :</strong> Mise à jour du risque avec chaque transaction
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Recommandations :</strong> Affinement des préférences utilisateur
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Pricing Dynamique :</strong> Ajustement des prix selon la demande
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-indigo-100 p-4 rounded-lg">
          <h5 className="font-semibold text-indigo-800 mb-2">💡 Pourquoi Bayes est-il si puissant ?</h5>
          <div className="text-sm text-indigo-700 space-y-1">
            <p>• <strong>Apprentissage continu :</strong> Les modèles s'améliorent avec chaque nouvelle donnée</p>
            <p>• <strong>Gestion de l'incertitude :</strong> Quantification explicite de la confiance</p>
            <p>• <strong>Intégration d'expertise :</strong> Combinaison de connaissances et de données</p>
            <p>• <strong>Robustesse :</strong> Fonctionne même avec peu de données</p>
          </div>
        </div>
      </CourseHighlight>
    </section>
  );
};

export default BayesTheoremSection;