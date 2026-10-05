
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const HypothesisTestingSection = () => {
  const pValueData = [
    { alpha: "0.01", criticalValue: 2.58, rejection: "Très forte évidence" },
    { alpha: "0.05", criticalValue: 1.96, rejection: "Évidence modérée" },
    { alpha: "0.10", criticalValue: 1.65, rejection: "Évidence faible" }
  ];

  const testTypes = [
    {
      name: "Test t de Student",
      usage: "Comparaison de moyennes",
      example: "Comparer l'efficacité de deux traitements",
      icon: <TestTube className="h-5 w-5 text-blue-600" />
    },
    {
      name: "Test du χ²",
      usage: "Variables catégorielles",
      example: "Tester l'indépendance entre sexe et préférence",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      name: "Test de Mann-Whitney",
      usage: "Données non-paramétriques",
      example: "Comparer des médianes sans normalité",
      icon: <XCircle className="h-5 w-5 text-purple-600" />
    }
  ];

  return (
    <section id="hypothesis-testing" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <TestTube className="h-8 w-8 text-blue-600" />
          Tests d'Hypothèses
        </h2>
        <p className="text-lg text-gray-600">
          Apprenez à valider vos hypothèses scientifiques avec rigueur statistique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              Processus de test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">1</Badge>
                <div>
                  <strong>Hypothèse nulle (H₀)</strong>
                  <p className="text-sm text-gray-600">Aucune différence ou effet</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">2</Badge>
                <div>
                  <strong>Hypothèse alternative (H₁)</strong>
                  <p className="text-sm text-gray-600">Différence significative</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">3</Badge>
                <div>
                  <strong>Seuil de signification (α)</strong>
                  <p className="text-sm text-gray-600">Généralement 0.05</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">4</Badge>
                <div>
                  <strong>Décision</strong>
                  <p className="text-sm text-gray-600">Rejeter ou ne pas rejeter H₀</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Types d'erreurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">Erreur de Type I (α)</h4>
                <p className="text-sm text-red-600">
                  Rejeter H₀ alors qu'elle est vraie (faux positif)
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Erreur de Type II (β)</h4>
                <p className="text-sm text-blue-600">
                  Ne pas rejeter H₀ alors qu'elle est fausse (faux négatif)
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Puissance (1-β)</h4>
                <p className="text-sm text-green-600">
                  Probabilité de détecter un effet s'il existe vraiment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tests statistiques courants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testTypes.map((test, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {test.icon}
                  <h4 className="font-semibold">{test.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{test.usage}</p>
                <p className="text-xs text-blue-600 italic">{test.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
        <h3 className="text-xl font-semibold mb-4">Seuils de signification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pValueData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600 mb-2">α = {item.alpha}</div>
              <div className="text-sm text-gray-600 mb-1">Valeur critique: ±{item.criticalValue}</div>
              <div className="text-xs text-gray-500">{item.rejection}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HypothesisTestingSection;
