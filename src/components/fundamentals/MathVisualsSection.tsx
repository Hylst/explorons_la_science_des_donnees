
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertCircle, ExternalLink, Info } from "lucide-react";

// Données pour la visualisation de la régression linéaire
const regressionData = [
  { x: 1, y: 3, prediction: 2.5 },
  { x: 2, y: 4, prediction: 3.8 },
  { x: 3, y: 5, prediction: 5.1 },
  { x: 4, y: 7, prediction: 6.4 },
  { x: 5, y: 6, prediction: 7.7 },
  { x: 6, y: 9, prediction: 9 },
  { x: 7, y: 8, prediction: 10.3 },
  { x: 8, y: 11, prediction: 11.6 },
  { x: 9, y: 13, prediction: 12.9 },
  { x: 10, y: 14, prediction: 14.2 },
];

// Données pour la distribution normale
const normalDistributionData = Array.from({ length: 20 }, (_, i) => {
  const x = -3 + i * 0.3;
  // Formule de la distribution normale
  const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2) * 100;
  return { x: x.toFixed(1), y: y };
});

// Données pour la visualisation des probabilités
const probabilityData = [
  { category: "Très improbable", value: 5 },
  { category: "Improbable", value: 15 },
  { category: "Possible", value: 30 },
  { category: "Probable", value: 35 },
  { category: "Très probable", value: 15 },
];

const MathVisualsSection = () => {
  return (
    <div id="mathvisuals" className="scroll-mt-24 border-l-4 border-ds-blue-400 pl-6 py-2">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-ds-blue-400 to-ds-purple-400 bg-clip-text text-transparent">Visualisations Mathématiques Interactives</h2>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          Les visualisations interactives aident à comprendre intuitivement des concepts mathématiques et statistiques 
          complexes qui sont essentiels en Data Science.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-blue-600">Régression Linéaire</h3>
              <p className="mb-4 text-sm text-gray-600">
                Visualisation de la relation linéaire entre deux variables avec prédiction basée sur la droite de régression.
              </p>
              <div className="h-[250px]">
                <ChartContainer
                  config={{
                    raw: { label: "Données brutes", color: "#4F46E5" },
                    prediction: { label: "Prédiction", color: "#EF4444" },
                  }}
                >
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      label={{ value: 'Variable X', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      dataKey="y" 
                      label={{ value: 'Variable Y', angle: -90, position: 'insideLeft', offset: -5 }}
                    />
                    <Scatter name="Données réelles" data={regressionData} fill="#4F46E5" />
                    <Line 
                      name="Prédiction" 
                      data={regressionData} 
                      dataKey="prediction" 
                      stroke="#EF4444" 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={false}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </ScatterChart>
                </ChartContainer>
              </div>
              <div className="flex items-center mt-4 text-xs text-gray-500">
                <Info className="h-4 w-4 mr-1" />
                <span>Équation: y = 1.3x + 1.2 (R² = 0.92)</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-purple-600">Distribution Normale</h3>
              <p className="mb-4 text-sm text-gray-600">
                La distribution normale (gaussienne) est fondamentale en statistiques et en machine learning.
              </p>
              <div className="h-[250px]">
                <ChartContainer
                  config={{
                    distribution: { label: "Distribution", color: "#8B5CF6" },
                  }}
                >
                  <LineChart data={normalDistributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="x" 
                      label={{ value: 'Écarts-types', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      label={{ value: 'Densité', angle: -90, position: 'insideLeft', offset: -5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                      dot={false} 
                      name="distribution"
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              <div className="mt-4 text-xs text-gray-600 bg-purple-50 p-2 rounded">
                <div className="flex items-start mb-1">
                  <AlertCircle className="h-4 w-4 mr-1 text-purple-600 mt-0.5" />
                  <p>68% des données se trouvent à ±1 écart-type de la moyenne, 95% à ±2 écarts-types, et 99.7% à ±3 écarts-types.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-blue-500">Visualisation des Probabilités</h3>
              <p className="mb-4 text-sm text-gray-600">
                Représentation d'une distribution de probabilités subjectives, utile pour l'analyse bayésienne et la prise de décision.
              </p>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    probabilité: { label: "Probabilité", color: "#0EA5E9" },
                  }}
                >
                  <BarChart data={probabilityData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="category" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                    />
                    <YAxis 
                      label={{ value: 'Probabilité (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Bar 
                      dataKey="value" 
                      name="probabilité"
                      fill="#0EA5E9" 
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-end mt-4">
                <a href="#" className="text-xs text-blue-600 flex items-center hover:underline">
                  Explorer le théorème de Bayes <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg my-8 border border-blue-100">
          <h3 className="text-xl font-bold mb-4">Pourquoi les visualisations mathématiques sont-elles importantes?</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1">1</span>
              <p><strong>Intuition:</strong> Elles permettent de développer une intuition sur des concepts abstraits.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1">2</span>
              <p><strong>Communication:</strong> Elles facilitent la communication de résultats complexes à des publics non techniques.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1">3</span>
              <p><strong>Exploration:</strong> Elles permettent d'explorer les données et de découvrir des patterns cachés.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1">4</span>
              <p><strong>Validation:</strong> Elles aident à valider ou infirmer des hypothèses statistiques.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MathVisualsSection;
