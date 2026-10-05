
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, TrendingUp } from "lucide-react";

const ANOVASection = () => {
  const anovaTypes = [
    {
      type: "ANOVA à un facteur",
      description: "Compare les moyennes de 3+ groupes",
      example: "Comparer l'efficacité de 4 médicaments",
      formula: "F = MSB / MSW"
    },
    {
      type: "ANOVA à deux facteurs",
      description: "Deux variables indépendantes",
      example: "Effet du sexe ET de l'âge sur le salaire",
      formula: "F = MS_effet / MS_erreur"
    },
    {
      type: "ANOVA répétée",
      description: "Mesures répétées sur mêmes sujets",
      example: "Poids avant/pendant/après traitement",
      formula: "F = MS_temps / MS_erreur"
    }
  ];

  return (
    <section id="anova" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Calculator className="h-8 w-8 text-purple-600" />
          Analyse de Variance (ANOVA)
        </h2>
        <p className="text-lg text-gray-600">
          Comparez simultanément les moyennes de plusieurs groupes avec l'ANOVA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Principe de l'ANOVA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                L'ANOVA décompose la variance totale en variance inter-groupes et intra-groupes 
                pour déterminer si les différences observées sont significatives.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-3">Décomposition de la variance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Variance totale (SST)</span>
                    <span className="font-mono">Σ(xi - x̄)²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variance inter-groupes (SSB)</span>
                    <span className="font-mono">Σni(x̄i - x̄)²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variance intra-groupes (SSW)</span>
                    <span className="font-mono">Σ(xij - x̄i)²</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded text-center">
                <strong>SST = SSB + SSW</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Test F et interprétation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Statistique F</h4>
                <div className="font-mono text-center bg-white p-3 rounded border mb-3">
                  F = MSB / MSW
                </div>
                <p className="text-sm text-blue-600">
                  Où MSB = SSB/(k-1) et MSW = SSW/(N-k)
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-700">Si F {'>'}F_critique :</strong>
                  <p className="text-sm text-green-600">Rejeter H₀, les moyennes diffèrent</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <strong className="text-red-700">Si F ≤ F_critique :</strong>
                  <p className="text-sm text-red-600">Ne pas rejeter H₀, pas de différence</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Types d'ANOVA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {anovaTypes.map((anova, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-2">{anova.type}</h4>
                <p className="text-sm text-gray-600 mb-3">{anova.description}</p>
                <div className="bg-white p-2 rounded border mb-2">
                  <code className="text-xs">{anova.formula}</code>
                </div>
                <p className="text-xs text-blue-600 italic">{anova.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conditions d'application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Normalité</strong>
                  <p className="text-sm text-gray-600">Données normalement distribuées dans chaque groupe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Homoscédasticité</strong>
                  <p className="text-sm text-gray-600">Variances égales entre les groupes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Indépendance</strong>
                  <p className="text-sm text-gray-600">Observations indépendantes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tests post-hoc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Si l'ANOVA est significative, utilisez ces tests pour identifier quels groupes diffèrent :
              </p>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Test de Tukey</strong>
                  <p className="text-xs text-gray-600">Comparaisons multiples conservatrices</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Test de Bonferroni</strong>
                  <p className="text-xs text-gray-600">Ajustement strict du seuil α</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Test de Scheffé</strong>
                  <p className="text-xs text-gray-600">Toutes combinaisons possibles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ANOVASection;
