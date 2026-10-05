
import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";

const X_MIN = -3;
const X_MAX = 5;
const X_START = -2;
const ANIMATION_STEP = 0.2;
const ANIMATION_DELAY_MS = 120;
const TANGENT_HALF_WIDTH = 2.5;
const SERIES_LABELS: Record<string, string> = { f: "f(x)", df: "f'(x)", tangent: "tangente" };

// f(x) = x² - 2x - 3 et sa dérivée f'(x) = 2x - 2
const f = (x: number) => x * x - 2 * x - 3;
const df = (x: number) => 2 * x - 2;
const round1 = (value: number) => Math.round(value * 10) / 10;

const curve = Array.from({ length: Math.round((X_MAX - X_MIN) / 0.1) + 1 }, (_, i) => {
  const x = round1(X_MIN + i * 0.1);
  return { x, f: f(x), df: df(x) };
});

const DerivativeConceptSection = () => {
  const [x0, setX0] = useState(X_START);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation : le point de tangence parcourt la courbe de gauche à droite
  useEffect(() => {
    if (!isAnimating) return;
    const timer = window.setInterval(() => {
      setX0((current) => Math.min(X_MAX, round1(current + ANIMATION_STEP)));
    }, ANIMATION_DELAY_MS);
    return () => window.clearInterval(timer);
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating && x0 >= X_MAX) setIsAnimating(false);
  }, [isAnimating, x0]);

  const toggleAnimation = () => {
    if (!isAnimating && x0 >= X_MAX) setX0(X_MIN);
    setIsAnimating((running) => !running);
  };

  const reset = () => {
    setIsAnimating(false);
    setX0(X_START);
  };

  const slope = df(x0);
  // La tangente n'est tracée que localement, autour du point de tangence
  const chartData = curve.map((point) => ({
    ...point,
    tangent: Math.abs(point.x - x0) <= TANGENT_HALF_WIDTH ? f(x0) + slope * (point.x - x0) : null
  }));
  const trend =
    Math.abs(slope) < 0.05
      ? "Pente nulle : la tangente est horizontale, c'est le minimum de f (en x = 1)."
      : slope > 0
        ? "Pente positive : f est croissante, la tangente monte."
        : "Pente négative : f est décroissante, la tangente descend.";

  const analogies = [
    {
      title: "🚗 Analogie automobile",
      description: "Si votre position est f(t), alors votre vitesse est f'(t) - la dérivée de votre position par rapport au temps.",
      example: "Position f(t) = 5t² (en m) → vitesse à t = 1 s : f'(1) = 10 m/s"
    },
    {
      title: "🏔️ Analogie montagne",
      description: "La dérivée, c'est la pente de la montagne à l'endroit où vous vous trouvez.",
      example: "Pente raide → Dérivée élevée | Plateau → Dérivée nulle"
    },
    {
      title: "💰 Analogie économique",
      description: "Si f(t) est votre capital au temps t, f'(t) est la vitesse à laquelle il varie (en euros par mois, par exemple).",
      example: "Capital croissant → Dérivée positive | Perte → Dérivée négative"
    }
  ];

  return (
    <section id="derivatives" className="scroll-mt-24 space-y-8">
      <h2 className="text-3xl font-bold mb-6">1. Le Concept de Dérivée</h2>
      
      <CourseHighlight title="🧠 Intuition fondamentale" type="concept">
        <p className="mb-4">
          Imaginez que vous regardez une courbe à la loupe. Plus vous zoomez, plus la courbe 
          ressemble à une ligne droite. La dérivée, c'est la pente de cette ligne droite !
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-800">
            💡 La dérivée = "À quelle vitesse ça change ?"
          </p>
        </div>
      </CourseHighlight>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Définition mathématique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              La dérivée de f(x) en un point x₀ mesure le taux de variation instantané :
            </p>
            <CourseEquation latex="f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}" />
            
            <div className="space-y-3 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-semibold">Interprétation géométrique :</p>
                <p className="text-xs">Pente de la tangente = dérivée</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-semibold">Interprétation physique :</p>
                <p className="text-xs">Vitesse instantanée = dérivée de la position</p>
              </div>
            </div>

            <CourseHighlight title="📝 Rappel important" type="info">
              <p className="text-sm">
                La dérivée n'existe que si la fonction est "lisse" au point considéré. 
                Une fonction peut être continue sans être dérivable !
              </p>
            </CourseHighlight>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualisation interactive : f(x) = x² - 2x - 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" domain={[X_MIN, X_MAX]} ticks={[-3, -2, -1, 0, 1, 2, 3, 4, 5]} />
                  <YAxis type="number" domain={[-10, 14]} allowDataOverflow />
                  <Tooltip
                    labelFormatter={(x) => `x = ${x}`}
                    formatter={(value, name) => [typeof value === "number" ? value.toFixed(2) : value, SERIES_LABELS[String(name)] ?? name]}
                  />
                  <Line type="monotone" dataKey="f" stroke="#2563EB" strokeWidth={2} name="f" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="df" stroke="#DC2626" strokeWidth={2} name="df" dot={false} isAnimationActive={false} />
                  <Line type="linear" dataKey="tangent" stroke="#059669" strokeWidth={2} strokeDasharray="5 3" name="tangent" dot={false} isAnimationActive={false} connectNulls={false} />
                  <ReferenceLine x={1} stroke="#94A3B8" strokeDasharray="3 3" label="Min en x=1" />
                  <ReferenceDot x={x0} y={f(x0)} r={6} fill="#059669" stroke="#ffffff" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={toggleAnimation}>
                  {isAnimating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                  {isAnimating ? "Pause" : "Animer la tangente"}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              </div>
              <div>
                <p className="text-sm font-semibold">Point de tangence : x₀ = {x0.toFixed(1)}</p>
                <Slider
                  aria-label="Point de tangence x0"
                  value={[x0]}
                  min={X_MIN}
                  max={X_MAX}
                  step={0.1}
                  onValueChange={([value]) => {
                    setIsAnimating(false);
                    setX0(round1(value));
                  }}
                  className="mt-2"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm" aria-live="polite">
                <p>
                  <strong>f(x₀) = {f(x0).toFixed(2)}</strong> · <strong>f'(x₀) = 2x₀ − 2 = {slope.toFixed(2)}</strong> (pente de la tangente)
                </p>
                <p className="text-xs text-gray-700 mt-1">{trend}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-blue-600"></div>
                <span>f(x) = x² - 2x - 3 (fonction)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-red-600"></div>
                <span>f'(x) = 2x - 2 (dérivée)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-green-600"></div>
                <span>Tangente à la courbe en x₀ (pointillés)</span>
              </div>
              <p className="text-xs text-gray-600">Le minimum est atteint quand f'(x) = 0, soit x = 1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CourseHighlight title="🔍 Zoom sur : Analogies pour comprendre" type="example">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analogies.map((analogy, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">{analogy.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{analogy.description}</p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <strong>Exemple :</strong> {analogy.example}
              </div>
            </div>
          ))}
        </div>
      </CourseHighlight>

      <CourseHighlight title="⚠️ Le saviez-vous ?" type="warning">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Fonctions non dérivables</h4>
            <ul className="text-sm space-y-1">
              <li>• |x| en x = 0 (point anguleux)</li>
              <li>• ReLU en x = 0 (utilisée en ML !)</li>
              <li>• √x en x = 0 (tangente verticale)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">En machine learning</h4>
            <ul className="text-sm space-y-1">
              <li>• La ReLU s'utilise telle quelle : on fixe par convention sa dérivée en 0</li>
              <li>• Variantes : Leaky ReLU (pente non nulle à gauche), Swish et GELU (lisses)</li>
              <li>• La rétropropagation fonctionne sans difficulté</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      <Card>
        <CardHeader>
          <CardTitle>Notation et vocabulaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Notations courantes</h4>
              <ul className="text-sm space-y-1">
                <li>• f'(x) (Lagrange)</li>
                <li>• df/dx (Leibniz)</li>
                <li>• Df(x) (opérateur)</li>
                <li>• ∂f/∂x (partielles)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ordres de dérivation</h4>
              <ul className="text-sm space-y-1">
                <li>• f'(x) : première</li>
                <li>• f''(x) : seconde</li>
                <li>• f'''(x) : troisième</li>
                <li>• f⁽ⁿ⁾(x) : n-ième</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Différentiabilité</h4>
              <ul className="text-sm space-y-1">
                <li>• Continue ≠ dérivable</li>
                <li>• Dérivable ⟹ continue</li>
                <li>• C¹ : dérivée continue</li>
                <li>• C^∞ : infiniment dérivable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Applications ML</h4>
              <ul className="text-sm space-y-1">
                <li>• Descente de gradient</li>
                <li>• Rétropropagation</li>
                <li>• Optimisation</li>
                <li>• Fonctions de coût</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DerivativeConceptSection;
