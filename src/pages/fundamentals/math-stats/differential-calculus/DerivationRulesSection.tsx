
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Calculator, BookOpen, Lightbulb } from "lucide-react";

const DerivationRulesSection = () => {
  const [selectedRule, setSelectedRule] = useState("basic");

  const basicRules = [
    {
      name: "Règle de la constante",
      formula: "\\frac{d}{dx}[c] = 0",
      explanation: "La dérivée d'une constante est toujours zéro",
      example: "\\frac{d}{dx}[5] = 0"
    },
    {
      name: "Règle de la puissance",
      formula: "\\frac{d}{dx}[x^n] = nx^{n-1}",
      explanation: "Pour dériver x^n, on multiplie par l'exposant et on diminue l'exposant de 1",
      example: "\\frac{d}{dx}[x^3] = 3x^2"
    },
    {
      name: "Règle de la somme",
      formula: "\\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)",
      explanation: "La dérivée d'une somme est la somme des dérivées",
      example: "\\frac{d}{dx}[x^2 + x] = 2x + 1"
    },
    {
      name: "Règle du produit par une constante",
      formula: "\\frac{d}{dx}[cf(x)] = cf'(x)",
      explanation: "Les constantes sortent de la dérivée",
      example: "\\frac{d}{dx}[3x^2] = 3 \\cdot 2x = 6x"
    }
  ];

  const advancedRules = [
    {
      name: "Règle du produit",
      formula: "\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)",
      explanation: "Pour dériver un produit : (première)' × (seconde) + (première) × (seconde)'",
      example: "\\frac{d}{dx}[x^2 \\sin(x)] = 2x\\sin(x) + x^2\\cos(x)",
      mnemonic: "Premier fois seconde prime, plus premier prime fois seconde"
    },
    {
      name: "Règle du quotient",
      formula: "\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
      explanation: "Pour dériver un quotient : (num' × dén - num × dén') / dén²",
      example: "\\frac{d}{dx}\\left[\\frac{x^2}{x+1}\\right] = \\frac{2x(x+1) - x^2 \\cdot 1}{(x+1)^2}",
      mnemonic: "Bas d'haut moins haut d'bas, tout sur bas au carré"
    },
    {
      name: "Règle de la chaîne",
      formula: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
      explanation: "Pour dériver une composition : dérivée externe × dérivée interne",
      example: "\\frac{d}{dx}[\\sin(x^2)] = \\cos(x^2) \\cdot 2x",
      mnemonic: "Dérive l'extérieur, garde l'intérieur, multiplie par la dérivée de l'intérieur"
    }
  ];

  const mlFunctions = [
    {
      name: "Exponentielle",
      formula: "\\frac{d}{dx}[e^x] = e^x",
      description: "Auto-dérivée ! Propriété unique de l'exponentielle",
      mlUse: "Base des activations softmax et des distributions exponentielles"
    },
    {
      name: "Logarithme naturel",
      formula: "\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}",
      description: "x > 0. Inverse de l'exponentielle",
      mlUse: "Log-likelihood, entropie croisée"
    },
    {
      name: "Sigmoïde",
      formula: "\\frac{d}{dx}[\\sigma(x)] = \\sigma(x)(1-\\sigma(x))",
      description: "Où σ(x) = 1/(1+e^(-x)). Propriété remarquable !",
      mlUse: "Activation classique, régression logistique"
    },
    {
      name: "Tanh",
      formula: "\\frac{d}{dx}[\\tanh(x)] = 1 - \\tanh^2(x)",
      description: "Activation centrée en zéro",
      mlUse: "Réseaux de neurones récurrents (RNN, LSTM)"
    },
    {
      name: "ReLU",
      formula: "\\frac{d}{dx}[\\max(0,x)] = \\begin{cases} 1 & \\text{si } x > 0 \\\\ 0 & \\text{si } x < 0 \\\\ \\text{indéfini} & \\text{si } x = 0 \\end{cases}",
      description: "Non dérivable en 0, mais on utilise 0 par convention",
      mlUse: "Activation la plus populaire en deep learning"
    }
  ];

  return (
    <section id="rules" className="scroll-mt-24 space-y-8">
      <h2 className="text-3xl font-bold mb-6">2. Règles de Dérivation</h2>
      
      <CourseHighlight title="🎯 Stratégie d'apprentissage" type="concept">
        <p className="mb-4">
          Travailler les règles de dérivation, c'est comme apprendre les gammes en musique : 
          une fois automatisées, elles libèrent votre créativité pour résoudre des problèmes complexes !
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <Calculator className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-semibold">1. Mémoriser</p>
            <p className="text-xs">Les règles de base</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-semibold">2. Pratiquer</p>
            <p className="text-xs">Avec des exercices</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-semibold">3. Appliquer</p>
            <p className="text-xs">À des cas réels</p>
          </div>
        </div>
      </CourseHighlight>

      <Tabs value={selectedRule} onValueChange={setSelectedRule} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Règles de base</TabsTrigger>
          <TabsTrigger value="advanced">Règles avancées</TabsTrigger>
          <TabsTrigger value="ml">Fonctions ML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basicRules.map((rule, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseEquation latex={rule.formula} />
                  <p className="text-sm text-gray-600 mb-3">{rule.explanation}</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold">Exemple :</p>
                    <CourseEquation latex={rule.example} displayMode={false} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <CourseHighlight title="💡 Astuce mnémotechnique" type="example">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Règle de la puissance</h4>
                <p className="text-sm">"Descendre l'exposant devant, diminuer de 1"</p>
                <p className="text-xs text-gray-600">x⁵ → 5x⁴</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Règle de la somme</h4>
                <p className="text-sm">"Dérivée distribue sur l'addition"</p>
                <p className="text-xs text-gray-600">(u + v)' = u' + v'</p>
              </div>
            </div>
          </CourseHighlight>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-6">
            {advancedRules.map((rule, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseEquation latex={rule.formula} />
                  <p className="text-sm text-gray-600 mb-3">{rule.explanation}</p>
                  <div className="bg-green-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-semibold">Exemple :</p>
                    <CourseEquation latex={rule.example} displayMode={false} />
                  </div>
                  {rule.mnemonic && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold">💭 Moyen mnémotechnique :</p>
                      <p className="text-xs">{rule.mnemonic}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <CourseHighlight title="🔥 Focus : Règle de la chaîne" type="warning">
            <p className="mb-3">
              La règle de la chaîne est <strong>fondamentale</strong> en machine learning ! 
              Elle est à la base de la backpropagation dans les réseaux de neurones.
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Exemple concret en ML :</h4>
              <p className="text-sm mb-2">
                Pour un réseau : entrée → couche cachée → sortie
              </p>
              <CourseEquation latex="\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial y} \frac{\partial y}{\partial h} \frac{\partial h}{\partial w_1}" />
              <p className="text-xs text-gray-600">
                Gradient de la perte par rapport aux poids = règle de la chaîne !
              </p>
            </div>
          </CourseHighlight>
        </TabsContent>
        
        <TabsContent value="ml" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mlFunctions.map((func, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{func.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseEquation latex={func.formula} />
                  <p className="text-sm text-gray-600 mb-3">{func.description}</p>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold">Usage en ML :</p>
                    <p className="text-xs">{func.mlUse}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <CourseHighlight title="⚡ Le saviez-vous ? Propriété de la sigmoïde" type="info">
            <p className="mb-3">
              La sigmoïde a une propriété remarquable : sa dérivée s'exprime uniquement 
              en fonction d'elle-même ! Cela simplifie énormément les calculs.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <CourseEquation latex="\sigma'(x) = \sigma(x)(1-\sigma(x))" />
              <p className="text-sm">
                En code : <code>sigmoid_derivative = sigmoid_output * (1 - sigmoid_output)</code>
              </p>
            </div>
          </CourseHighlight>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default DerivationRulesSection;
