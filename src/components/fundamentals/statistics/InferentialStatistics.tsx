
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";

const InferentialStatistics = () => {
  // Exemple FICTIF : 3 000 visiteurs par version, 120 conversions pour A (4,0 %) et 156 pour B (5,2 %).
  // Test z de deux proportions (ou khi-deux sans correction) : z = 2,22 et p = 0,027, vérifié avec scipy.
  const hypothesisData = [
    { name: "Version A", value: 4.0 },
    { name: "Version B", value: 5.2 }
  ];
  const COLORS = ["#0088FE", "#8884d8"];

  return (
    <Card className="border-t-4 border-t-ds-purple-500 hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle>Statistiques inférentielles</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Méthodes pour tirer des conclusions sur une population à partir d'un échantillon, incluant les tests d'hypothèses et les intervalles de confiance.</p>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer text-sm text-purple-600">
              <span>Exemple pratique</span>
              <span className="transition group-open:rotate-180">
                <ChevronRight size={16} />
              </span>
            </summary>
            <div className="mt-3 text-sm bg-purple-50 p-3 rounded-md">
              <p className="mb-2"><strong>Exemple (données fictives) :</strong> test A/B sur une page web, 3 000 visiteurs par version</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Hypothèse nulle (H₀) :</strong> les deux versions ont le même taux de conversion</li>
                <li><strong>Observé :</strong> 4,0 % pour la version A (120 conversions), 5,2 % pour la version B (156 conversions)</li>
                <li><strong>Résultat :</strong> valeur p ≈ 0,03 (0,027), inférieure au seuil de 0,05 fixé à l'avance</li>
                <li><strong>Conclusion :</strong> on rejette H₀ : un écart aussi grand serait peu probable si les deux versions étaient équivalentes</li>
              </ul>
              <p className="mt-2">Un test dit si un écart observé est compatible avec le hasard. Une valeur p n'est ni la probabilité que H₀ soit vraie, ni la taille de l'effet : il faut aussi regarder l'écart (ici 1,2 point) et son intervalle de confiance.</p>
            </div>
          </details>
        </div>
        
        <div className="mt-6 mb-8 h-64 chart-container">
          <p className="text-sm text-gray-500 mb-8 chart-description">Visualisation : taux de conversion des deux versions du test A/B (données fictives)</p>
          <DeferredResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hypothesisData}
              margin={{ top: 20, right: 30, left: 30, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 8]} unit=" %" />
              <Tooltip formatter={(value: number) => [`${String(value).replace(".", ",")} %`, 'Taux de conversion']} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="value" name="Taux de conversion (%)">
                {hypothesisData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </DeferredResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4 text-center chart-legend-container">
            Un test statistique aide à juger si une différence observée est compatible avec le hasard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InferentialStatistics;
