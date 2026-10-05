
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, AlertCircle } from "lucide-react";

const ConfidenceIntervalsSection = () => {
  const confidenceLevels = [
    { level: "90%", z: 1.645, usage: "Exploration préliminaire" },
    { level: "95%", z: 1.96, usage: "Standard en recherche" },
    { level: "99%", z: 2.576, usage: "Quand une erreur coûte cher (plus de confiance, intervalle plus large)" }
  ];

  return (
    <section id="confidence-intervals" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Target className="h-8 w-8 text-green-600" />
          Intervalles de Confiance
        </h2>
        <p className="text-lg text-gray-600">
          Quantifiez l'incertitude de vos estimations avec les intervalles de confiance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              Principe fondamental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Un intervalle de confiance à 95% signifie que si nous répétions l'expérience 100 fois, 
                95 de ces intervalles contiendraient la vraie valeur du paramètre.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Formule générale</h4>
                <div className="font-mono text-center bg-white p-3 rounded border">
                  IC = Estimation ± (Valeur critique × Erreur standard)
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Composants :</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>Estimation</strong> : Moyenne, proportion, etc.</li>
                  <li>• <strong>Valeur critique</strong> : Dépend du niveau de confiance</li>
                  <li>• <strong>Erreur standard</strong> : Variabilité de l'estimation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Interprétation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">✅ Interprétation correcte</h4>
                <p className="text-sm text-blue-600">
                  "Nous sommes confiants à 95% que la vraie moyenne se situe entre [a, b]"
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">❌ Interprétation incorrecte</h4>
                <p className="text-sm text-red-600">
                  "Il y a 95% de chance que la vraie moyenne soit entre [a, b]"
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <strong>Attention :</strong> L'intervalle est aléatoire, pas le paramètre !
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Niveaux de confiance courants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {confidenceLevels.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600 mb-2">{item.level}</div>
                <div className="text-sm font-mono text-gray-700 mb-2">z = ±{item.z}</div>
                <div className="text-xs text-gray-600">{item.usage}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Types d'intervalles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold">Pour une moyenne</h4>
                <p className="text-sm text-gray-600">Quand σ est connu ou n {'>'}30</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold">Pour une proportion</h4>
                <p className="text-sm text-gray-600">Variables catégorielles binaires</p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold">Pour une variance</h4>
                <p className="text-sm text-gray-600">Distribution du χ²</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Facteurs d'influence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <strong>Taille d'échantillon</strong>
                  <p className="text-sm text-gray-600">Plus n augmente, plus l'IC se resserre</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <strong>Niveau de confiance</strong>
                  <p className="text-sm text-gray-600">Plus haut = IC plus large</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <strong>Variabilité</strong>
                  <p className="text-sm text-gray-600">Plus de variance = IC plus large</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ConfidenceIntervalsSection;
