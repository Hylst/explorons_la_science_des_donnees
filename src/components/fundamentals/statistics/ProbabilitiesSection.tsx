
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { statisticsDefinitions } from "../definitions/statistics-definitions";

const ProbabilitiesSection = () => {
  // Data for probability visualization
  const probabilityData = [
    { name: 'Succès', value: 30 },
    { name: 'Échec', value: 70 },
  ];
  
  const COLORS = ['#4f46e5', '#e11d48'];

  return (
    <Card className="border-t-4 border-t-ds-blue-300 hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle>
          <GlossaryTerm definition={statisticsDefinitions["probabilité"]}>
            Probabilités
          </GlossaryTerm>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Théorie des probabilités, distributions (normale, binomiale, Poisson), et théorème de Bayes pour modéliser l'incertitude.</p>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer text-sm text-blue-600">
              <span>Exemple pratique</span>
              <span className="transition group-open:rotate-180">
                <ChevronRight size={16} />
              </span>
            </summary>
            <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md">
              <p className="mb-2"><strong>Exemple (chiffres illustratifs) :</strong> Modèle de fraude par carte de crédit</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Probabilité a priori :</strong> 0.1% de transactions frauduleuses</li>
                <li><strong>Sensibilité :</strong> 85% des fraudes déclenchent une alerte</li>
                <li><strong>Faux positifs :</strong> 5% des transactions légitimes déclenchent une alerte</li>
                <li><strong>Application du théorème de Bayes :</strong> P(fraude | alerte) = (0,001 × 0,85) / (0,001 × 0,85 + 0,999 × 0,05) ≈ 1,7 % : malgré une bonne détection, la grande majorité des alertes sont de fausses alertes, car la fraude est très rare</li>
              </ul>
              <p className="mt-2">Le théorème de Bayes est crucial pour les systèmes de détection d'anomalies.</p>
            </div>
          </details>
        </div>
        
        <div className="mt-6 h-64 chart-container">
          <p className="text-sm text-gray-500 mb-2 chart-description">Visualisation : Distribution de probabilité</p>
          <div className="flex justify-center h-full">
            <ResponsiveContainer width="70%" height="100%">
              <PieChart>
                <Pie
                  data={probabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {probabilityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center chart-legend-container">
            Les probabilités nous permettent de quantifier l'incertitude dans nos prédictions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilitiesSection;
