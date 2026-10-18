import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseEquation from "@/components/courses/CourseEquation";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { VERIFIER_PRIMITIVES } from "@/data/integral-demos";

const integrationTechniques = [
  {
    name: "Intégration par substitution",
    formula: "∫ f(g(x))g'(x)dx = ∫ f(u)du",
    description: "Changement de variable pour simplifier l'intégrale : on repère une fonction g(x) dont la dérivée apparaît aussi.",
    example: "∫ 2x(x² + 1)³dx = (x² + 1)⁴/4 + C (avec u = x² + 1)",
  },
  {
    name: "Intégration par parties",
    formula: "∫ udv = uv - ∫ vdu",
    description: "Pour les produits de fonctions : on dérive le facteur qui se simplifie (un polynôme) et on intègre l'autre.",
    example: "∫ x·eˣdx = (x - 1)eˣ + C (avec u = x et dv = eˣdx)",
  },
  {
    name: "Fractions partielles",
    formula: "∫ P(x)/Q(x)dx",
    description: "Décomposition d'une fraction rationnelle en fractions simples, chacune facile à intégrer.",
    example: "∫ 1/(x² - 1)dx = ½ ln|(x - 1)/(x + 1)| + C, car 1/(x² - 1) = ½ [1/(x - 1) - 1/(x + 1)]",
  },
];

const TechniquesSection = () => (
  <div className="max-w-4xl mx-auto">
    <section id="techniques" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-purple-600" />
        Techniques d'intégration
      </h2>

      <div className="space-y-6">
        {integrationTechniques.map((technique, index) => (
          <Card key={technique.name} className="border-l-4 border-purple-400">
            <CardHeader>
              <Badge variant="outline" className="mb-2 w-fit">Technique {index + 1}</Badge>
              <CardTitle className="text-lg">{technique.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <CourseEquation latex={technique.formula} />
              </div>
              <p className="text-sm text-gray-700 mb-3">{technique.description}</p>
              <div className="bg-blue-50 p-3 rounded border">
                <p className="text-sm font-medium text-blue-800">Exemple : {technique.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-10 mb-3">Vérifier une primitive par le calcul</h3>
      <p className="text-gray-700 mb-4">
        Une primitive trouvée à la main se contrôle en deux lignes : on compare F(b) − F(a) à une intégration numérique
        sur le même intervalle. Si les deux valeurs diffèrent, la primitive est fausse (ou la fonction n'est pas continue sur l'intervalle).
        Dériver F et retrouver f est l'autre contrôle classique.
      </p>
      <RunnableCode
        language="python"
        code={VERIFIER_PRIMITIVES}
        label="Vérification numérique des trois primitives, modifiable"
        caption="Les trois primitives des exemples sont confirmées : 3,75 sur [0, 1] pour la substitution, 1 sur [0, 1] pour l'intégration par parties, 0,202733 sur [2, 3] pour les fractions partielles (½ ln 1,5). La primitive fausse x·eˣ, où l'on a oublié le terme − eˣ, donne e ≈ 2,718282 au lieu de 1."
      />
    </section>
  </div>
);

export default TechniquesSection;
