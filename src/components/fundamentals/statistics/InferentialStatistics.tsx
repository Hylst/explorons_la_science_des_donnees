
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyChart } from "@/components/ui/lazy-chart";

// Graphique et données (exemple fictif vérifié avec scipy) dans charts/ConversionChart.tsx, chargé à l'approche de l'écran
const loadConversionChart = () => import("./charts/ConversionChart");

const InferentialStatistics = () => {
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
          <LazyChart load={loadConversionChart} />
          <p className="text-xs text-gray-500 mt-4 text-center chart-legend-container">
            Un test statistique aide à juger si une différence observée est compatible avec le hasard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InferentialStatistics;
