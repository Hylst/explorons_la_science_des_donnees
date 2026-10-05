
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  ResponsiveContainer 
} from "recharts";

const InferentialStatistics = () => {
  // Data for hypothesis testing visualization
  const hypothesisData = [
    { name: "Group A", value: 42 },
    { name: "Group B", value: 58 }
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
              <p className="mb-2"><strong>Exemple :</strong> Test A/B sur une page web</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Hypothèse nulle (H₀) :</strong> Pas de différence de taux de conversion</li>
                <li><strong>Résultat :</strong> p-value = 0.03 (inférieur à 0.05)</li>
                <li><strong>Conclusion :</strong> On rejette H₀, la nouvelle version performe mieux</li>
              </ul>
              <p className="mt-2">Les tests d'hypothèse permettent de déterminer si les différences observées sont statistiquement significatives.</p>
            </div>
          </details>
        </div>
        
        <div className="mt-6 mb-8 h-64 chart-container">
          <p className="text-sm text-gray-500 mb-8 chart-description">Visualisation : Comparaison entre deux groupes (Test A/B)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hypothesisData}
              margin={{ top: 20, right: 30, left: 30, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Taux de conversion']} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="value" name="Taux de conversion (%)">
                {hypothesisData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4 text-center chart-legend-container">
            Les tests statistiques nous aident à déterminer si les différences observées sont dues au hasard ou significatives.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InferentialStatistics;
