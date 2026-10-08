
import { ExternalLink, BookOpen, Lightbulb, CirclePercent } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";

const AdvancedStatistics = () => {
  // Data for regression example chart
  // Droite des moindres carrés calculée sur les points (pente 85/110 ≈ 0,773, ordonnée ≈ 2,318)
  const regressionPoints = [
    { x: 0, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 4 }, { x: 4, y: 6 }, { x: 5, y: 5 },
    { x: 6, y: 8 }, { x: 7, y: 7 }, { x: 8, y: 9 }, { x: 9, y: 8 }, { x: 10, y: 11 },
  ];
  const meanX = regressionPoints.reduce((sum, p) => sum + p.x, 0) / regressionPoints.length;
  const meanY = regressionPoints.reduce((sum, p) => sum + p.y, 0) / regressionPoints.length;
  const slope =
    regressionPoints.reduce((sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0) /
    regressionPoints.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  const regressionData = regressionPoints.map((p) => ({ ...p, yhat: Math.round((intercept + slope * p.x) * 100) / 100 }));

  return (
    <Accordion type="single" collapsible className="w-full my-6 border rounded-lg">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="px-4 text-lg font-medium text-ds-blue-600">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            En savoir plus sur les concepts statistiques avancés
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Régression et corrélation</h4>
              <p className="mb-2">
                Les techniques de régression permettent de modéliser les relations entre variables et faire des prédictions. 
                La corrélation mesure la force de l'association entre deux variables.
              </p>
              
              <div className="mt-4 mb-6 h-64 chart-container">
                <p className="text-sm text-gray-500 mb-2 chart-description">Visualisation : Régression linéaire simple</p>
                <DeferredResponsiveContainer width="100%" height="100%">
                  <LineChart data={regressionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value.toFixed(2), 'Valeur']} />
                    <Legend />
                    <Line type="monotone" dataKey="y" name="Données" stroke="#8884d8" fill="#8884d8" dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="yhat" name="Prédiction" stroke="#ff7300" dot={false} activeDot={false} />
                  </LineChart>
                </DeferredResponsiveContainer>
                <p className="text-xs text-gray-500 mt-1 text-center chart-legend-container">
                  La régression linéaire trouve la meilleure droite ajustant un ensemble de points.
                </p>
              </div>
              
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li><strong>Coefficient de corrélation de Pearson</strong> : Mesure la relation linéaire (-1 à 1)</li>
                <li><strong>Régression linéaire</strong> : Modélise la relation par une droite (y = ax + b)</li>
                <li><strong>R² (coefficient de détermination)</strong> : Mesure la qualité d'ajustement du modèle</li>
              </ul>
              <div className="text-sm flex items-center gap-1 text-blue-600 mt-2">
                <Lightbulb className="h-4 w-4" /> 
                <span className="italic">Important : Corrélation n'implique pas causalité !</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Tests statistiques courants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">Tests paramétriques</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>T-test (comparaison de moyennes)</li>
                    <li>ANOVA (analyse de variance)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">Tests non-paramétriques</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Test de Mann-Whitney U</li>
                    <li>Test du χ² (variables catégorielles)</li>
                    <li>Test de Wilcoxon</li>
                    <li>Test de Kruskal-Wallis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md my-4">
              <h4 className="font-semibold text-lg mb-2 text-blue-700">Statistiques bayésiennes</h4>
              <p className="mb-3">
                Contrairement aux statistiques fréquentistes, l'approche bayésienne traite les paramètres comme des variables aléatoires 
                et intègre des connaissances préalables (prior) qui sont mises à jour avec de nouvelles observations.
              </p>
              
              <div className="p-3 bg-white rounded-md border border-blue-100">
                <p className="font-medium text-center mb-2">Théorème de Bayes</p>
                <div className="flex justify-center">
                  <div className="font-mono bg-blue-100 p-2 rounded text-center">
                    P(A|B) = P(B|A) × P(A) / P(B)
                  </div>
                </div>
                <ul className="mt-3 text-sm space-y-1">
                  <li><strong>P(A|B)</strong> : Probabilité a posteriori</li>
                  <li><strong>P(B|A)</strong> : Vraisemblance</li>
                  <li><strong>P(A)</strong> : Probabilité a priori</li>
                  <li><strong>P(B)</strong> : Évidence</li>
                </ul>
              </div>
              
              <div className="mt-3 text-sm flex items-center">
                <CirclePercent className="h-4 w-4 text-blue-500 mr-2" />
                <span>
                  Les méthodes bayésiennes sont particulièrement utiles quand on dispose de peu de données
                  ou quand l'incertitude doit être explicitement quantifiée.
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="font-medium">Ressources recommandées:</p>
              <ul className="pl-5 space-y-1 mt-1">
                <li className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Seeing Theory - Visualisation interactive des concepts statistiques
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Khan Academy - Probabilités et statistiques
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    StatQuest - Explications claires de concepts statistiques (en anglais)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedStatistics;
