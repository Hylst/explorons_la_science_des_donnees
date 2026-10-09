
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { AlertCircle, ArrowRight, Info } from "lucide-react";

/** Nombre à la française (virgule décimale) */
const fr = (value: number, digits = 2) => value.toFixed(digits).replace(".", ",");

// Régression linéaire : dix points FICTIFS ; la droite des moindres carrés et le R² sont calculés, pas écrits à la main
const observations = [3, 4, 5, 7, 6, 9, 8, 11, 13, 14].map((y, i) => ({ x: i + 1, y }));
const regression = (() => {
  const n = observations.length;
  const meanX = observations.reduce((s, p) => s + p.x, 0) / n;
  const meanY = observations.reduce((s, p) => s + p.y, 0) / n;
  const sxy = observations.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const sxx = observations.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const ssRes = observations.reduce((s, p) => s + (p.y - (intercept + slope * p.x)) ** 2, 0);
  const ssTot = observations.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  return { slope, intercept, r2: 1 - ssRes / ssTot };
})();
const regressionData = observations.map((p) => ({
  ...p,
  prediction: Math.round((regression.intercept + regression.slope * p.x) * 100) / 100,
}));

// Loi normale centrée réduite : densité f(x) = exp(-x²/2) / sqrt(2π), de -3 à 3 par pas de 0,3
const normalDistributionData = Array.from({ length: 21 }, (_, i) => {
  const x = -3 + i * 0.3;
  const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
  return { x: x.toFixed(1), y: Number(y.toFixed(4)) };
});

// Mise à jour bayésienne : exemple d'un test médical FICTIF (prévalence 1 %, sensibilité 90 %, faux positifs 9 %).
// Chaque test positif multiplie les cotes (odds) par le rapport de vraisemblance 0,9 / 0,09 = 10.
// Les deux tests sont supposés indépendants entre eux, ce qui est une hypothèse forte en pratique.
const probabilityData = (() => {
  const prevalence = 0.01;
  const likelihoodRatio = 0.9 / 0.09;
  const labels = ["Avant le test", "Après 1 test positif", "Après 2 tests positifs"];
  let odds = prevalence / (1 - prevalence);
  return labels.map((category) => {
    const value = Math.round((odds / (1 + odds)) * 1000) / 10;
    odds *= likelihoodRatio;
    return { category, value };
  });
})();

const MathVisualsSection = () => {
  return (
    <div id="mathvisuals" className="scroll-mt-24 border-l-4 border-ds-blue-400 pl-6 py-2">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-ds-blue-400 to-ds-purple-400 bg-clip-text text-transparent">Trois visualisations mathématiques</h2>

      <div className="max-w-none">
        <p className="text-lg mb-6">
          Une figure aide à se faire une intuition de notions abstraites. Voici trois exemples utiles en data science : une droite de régression,
          la loi normale et la mise à jour d'une probabilité. Les données de la régression et du test médical sont fictives, les courbes et les nombres affichés sont calculés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-blue-600">Régression linéaire</h3>
              <p className="mb-4 text-sm text-gray-600">
                Relation linéaire entre deux variables : la droite rouge est la droite des moindres carrés, celle qui minimise la somme des carrés des écarts verticaux.
              </p>
              <div className="h-[250px]">
                <ChartContainer
                  className="aspect-auto h-full w-full"
                  config={{
                    raw: { label: "Données brutes", color: "#4F46E5" },
                    prediction: { label: "Prédiction", color: "#EF4444" },
                  }}
                >
                  <ComposedChart data={regressionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="x"
                      type="number"
                      label={{ value: 'Variable X', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                      type="number"
                      label={{ value: 'Variable Y', angle: -90, position: 'insideLeft', offset: -5 }}
                    />
                    <Scatter name="Données" dataKey="y" fill="#4F46E5" />
                    <Line
                      name="Prédiction"
                      type="linear"
                      dataKey="prediction"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </ComposedChart>
                </ChartContainer>
              </div>
              <div className="flex items-start mt-4 text-xs text-gray-500">
                <Info className="h-4 w-4 mr-1 shrink-0" />
                <span>Équation calculée : y = {fr(regression.slope)} x + {fr(regression.intercept)} (R² = {fr(regression.r2)})</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-purple-600">Loi normale</h3>
              <p className="mb-4 text-sm text-gray-600">
                La loi normale (ou gaussienne) est omniprésente en statistiques, notamment pour modéliser des erreurs de mesure et des moyennes.
              </p>
              <div className="h-[250px]">
                <ChartContainer
                  className="aspect-auto h-full w-full"
                  config={{
                    distribution: { label: "Distribution", color: "#8B5CF6" },
                  }}
                >
                  <LineChart data={normalDistributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="x"
                      interval={4}
                      label={{ value: 'Écarts à la moyenne (en écarts types)', position: 'insideBottom', offset: -10 }}
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
                  <AlertCircle className="h-4 w-4 mr-1 text-purple-600 mt-0.5 shrink-0" />
                  <p>Pour une variable qui suit une loi normale, environ 68 % des valeurs se trouvent à moins de 1 écart type de la moyenne, 95 % à moins de 2 et 99,7 % à moins de 3.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-ds-blue-500">Mettre à jour une probabilité (théorème de Bayes)</h3>
              <p className="mb-4 text-sm text-gray-600">
                Exemple fictif : une maladie touche 1 % de la population. Un test la détecte dans 90 % des cas, mais se trompe aussi chez 9 % des personnes saines.
                Après un test positif, la probabilité d'être malade n'est pas de 90 % : elle est d'environ {fr(probabilityData[1].value, 1)} %.
                Un second test positif, supposé indépendant du premier, la porte à environ {fr(probabilityData[2].value, 1)} %.
              </p>
              <div className="h-[300px]">
                <ChartContainer
                  className="aspect-auto h-full w-full"
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
                      domain={[0, 100]}
                      label={{ value: 'Probabilité d\'être malade (%)', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle' } }}
                    />
                    <Bar
                      dataKey="value"
                      name="probabilité"
                      fill="#0EA5E9"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList dataKey="value" position="top" formatter={(value: number) => `${fr(value, 1)} %`} />
                    </Bar>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-end mt-4">
                <Link to="/fundamentals/math-stats/probability-theory#bayes-theorem" className="text-xs text-blue-600 flex items-center hover:underline">
                  Le théorème de Bayes en détail <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg my-8 border border-blue-100">
          <h3 className="text-xl font-bold mb-4">À quoi servent les visualisations ?</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">1</span>
              <p><strong>Intuition :</strong> elles aident à se représenter des concepts abstraits.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">2</span>
              <p><strong>Communication :</strong> elles facilitent l'explication de résultats à des publics non techniques.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">3</span>
              <p><strong>Exploration :</strong> elles permettent de repérer des motifs ou des valeurs inattendues dans les données.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">4</span>
              <p><strong>Vérification :</strong> elles montrent si une hypothèse (linéarité, normalité) est plausible, sans remplacer un test statistique.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MathVisualsSection;
