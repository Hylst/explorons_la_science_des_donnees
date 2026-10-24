import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LazyChart } from "@/components/ui/lazy-chart";
import { AlertCircle, ArrowRight, Info } from "lucide-react";
import { fr, probabilityData, regression } from "./math-visuals-data";

// Graphiques dans MathVisualsCharts.tsx : Recharts n'est chargé qu'à l'approche de l'écran
const loadRegressionVisual = () => import("./MathVisualsCharts").then((m) => ({ default: m.RegressionVisual }));
const loadNormalVisual = () => import("./MathVisualsCharts").then((m) => ({ default: m.NormalVisual }));
const loadBayesVisual = () => import("./MathVisualsCharts").then((m) => ({ default: m.BayesVisual }));

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
                <LazyChart load={loadRegressionVisual} />
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
                <LazyChart load={loadNormalVisual} />
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
                <LazyChart load={loadBayesVisual} />
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
