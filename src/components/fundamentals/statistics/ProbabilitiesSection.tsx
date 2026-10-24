
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyChart } from "@/components/ui/lazy-chart";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { statisticsDefinitions } from "../definitions/statistics-definitions";

// Graphique et données dans charts/BernoulliChart.tsx, chargé à l'approche de l'écran
const loadBernoulliChart = () => import("./charts/BernoulliChart");

const ProbabilitiesSection = () => {
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
                <li><strong>Probabilité a priori :</strong> 0,1 % de transactions frauduleuses</li>
                <li><strong>Sensibilité :</strong> 85 % des fraudes déclenchent une alerte</li>
                <li><strong>Faux positifs :</strong> 5 % des transactions légitimes déclenchent une alerte</li>
                <li><strong>Application du théorème de Bayes :</strong> P(fraude | alerte) = (0,001 × 0,85) / (0,001 × 0,85 + 0,999 × 0,05) ≈ 1,7 % : malgré une bonne détection, la grande majorité des alertes sont de fausses alertes, car la fraude est très rare</li>
              </ul>
              <p className="mt-2">Le théorème de Bayes aide à interpréter une alerte : sa fiabilité dépend autant de la rareté de l'événement que de la qualité du détecteur.</p>
            </div>
          </details>
        </div>
        
        <div className="mt-6 h-64 chart-container">
          <p className="text-sm text-gray-500 mb-2 chart-description">Visualisation : une loi de Bernoulli de paramètre 0,3 (exemple)</p>
          <div className="flex justify-center h-full">
            <LazyChart load={loadBernoulliChart} width="70%" />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center chart-legend-container">
            Les probabilités permettent de quantifier l'incertitude : ici, 30 % de chances de succès et 70 % d'échec.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilitiesSection;
