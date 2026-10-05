import { Link } from "react-router-dom";
import { TestTube, Target, Brain, AlertTriangle, CheckCircle, TrendingUp, Lightbulb, Calculator, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ErrorBar, Cell } from "recharts";

// Couleurs des étapes du test : classes complètes, sinon Tailwind ne les génère pas au build
const stepStyles: Record<string, { box: string; badge: string; title: string }> = {
  blue: { box: "bg-blue-50 border-blue-400", badge: "bg-blue-100 text-blue-700", title: "text-blue-700" },
  green: { box: "bg-green-50 border-green-400", badge: "bg-green-100 text-green-700", title: "text-green-700" },
  purple: { box: "bg-purple-50 border-purple-400", badge: "bg-purple-100 text-purple-700", title: "text-purple-700" },
  orange: { box: "bg-orange-50 border-orange-400", badge: "bg-orange-100 text-orange-700", title: "text-orange-700" }
};

// Vraie moyenne de la population, connue ici pour l'illustration (en pratique, elle ne l'est jamais)
const TRUE_MEAN = 85;

const confidenceIntervalData = [
  { sample: "Éch. 1", mean: 85, lower: 82, upper: 88 },
  { sample: "Éch. 2", mean: 87, lower: 84, upper: 90 },
  { sample: "Éch. 3", mean: 83, lower: 80, upper: 86 },
  { sample: "Éch. 4", mean: 86, lower: 83, upper: 89 },
  { sample: "Éch. 5", mean: 84, lower: 81, upper: 87 },
  { sample: "Éch. 6", mean: 90, lower: 87, upper: 93 }
].map((d) => ({
  ...d,
  // Erreur vers le bas et vers le haut, au format attendu par <ErrorBar>
  error: [d.mean - d.lower, d.upper - d.mean],
  containsTrueMean: d.lower <= TRUE_MEAN && TRUE_MEAN <= d.upper
}));

const InferentialStatisticsCourse = () => {
  const testTypes = [
    {
      name: "Test t de Student",
      usage: "Comparaison de moyennes",
      conditions: ["Données normales ou n > 30", "Variance inconnue", "Échantillons indépendants"],
      formula: "t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}",
      example: "Tester si un nouveau médicament améliore le temps de guérison",
      icon: <TestTube className="h-5 w-5 text-blue-600" />
    },
    {
      name: "Test Z",
      usage: "Comparaison avec population connue",
      conditions: ["Distribution normale", "Variance connue", "Grand échantillon"],
      formula: "Z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}",
      example: "Vérifier si le QI moyen d'un groupe diffère de 100",
      icon: <Calculator className="h-5 w-5 text-green-600" />
    },
    {
      name: "Test du χ²",
      usage: "Variables catégorielles",
      conditions: ["Effectifs attendus ≥ 5", "Observations indépendantes"],
      formula: "\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}",
      example: "Tester l'indépendance entre sexe et préférence politique",
      icon: <BarChart3 className="h-5 w-5 text-purple-600" />
    }
  ];

  const bayesianConcepts = [
    {
      concept: "Probabilité a priori P(H)",
      description: "Croyance initiale avant observation des données",
      example: "P(Pièce truquée) = 0.1 avant le test"
    },
    {
      concept: "Vraisemblance P(D|H)",
      description: "Probabilité d'observer les données sachant l'hypothèse",
      example: "P(8 faces sur 10 lancers | Pièce truquée)"
    },
    {
      concept: "Probabilité a posteriori P(H|D)",
      description: "Croyance mise à jour après observation",
      example: "P(Pièce truquée | 8 faces observées)"
    }
  ];

  return (
    <div className="w-full p-6 space-y-12">
      {/* Introduction pédagogique (le titre de la page est porté par l'en-tête du cours) */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            🤔 Qu'est-ce que l'Inférence Statistique ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/80 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">📊 Le Défi Fondamental</h3>
              <p className="text-gray-700 mb-4">
                Imaginez que vous voulez connaître la taille moyenne de tous les adultes français. 
                Impossible de mesurer des dizaines de millions de personnes ! L'inférence statistique vous permet
                de tirer des conclusions fiables sur toute la population en n'étudiant qu'un échantillon.
              </p>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                  <strong>Échantillon</strong> (ce qu'on observe) → <strong>Population</strong> (ce qu'on veut connaître)
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">🎯 Les Deux Piliers</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-green-100 text-green-700">1</Badge>
                  <div>
                    <strong className="text-green-700">Estimation</strong>
                    <p className="text-sm text-gray-600">Estimer des paramètres avec intervalles de confiance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">2</Badge>
                  <div>
                    <strong className="text-orange-700">Tests d'Hypothèses</strong>
                    <p className="text-sm text-gray-600">Valider ou rejeter des suppositions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schéma conceptuel */}
          <div className="bg-white/60 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">🔄 Processus d'Inférence</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <strong className="text-yellow-800">Population</strong>
                <p className="text-xs text-yellow-600">Paramètres inconnus (μ, σ, p...)</p>
              </div>
              <div className="text-2xl">↓</div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <strong className="text-green-800">Échantillonnage</strong>
                <p className="text-xs text-green-600">Sélection représentative</p>
              </div>
              <div className="text-2xl">↓</div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <strong className="text-blue-800">Échantillon</strong>
                <p className="text-xs text-blue-600">Statistiques observées (x̄, s, p̂...)</p>
              </div>
              <div className="text-2xl">↓</div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <strong className="text-purple-800">Inférence</strong>
                <p className="text-xs text-purple-600">Conclusions sur la population</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tests d'Hypothèses */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-xl border border-orange-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <TestTube className="h-8 w-8 text-orange-600" />
            🧪 Tests d'Hypothèses : La Méthode Scientifique en Action
          </h2>

          <CourseHighlight title="📚 Rappel : Logique du Test" type="concept">
            <p className="mb-3">
              Un test d'hypothèse fonctionne comme un procès : on suppose l'innocence (H₀) jusqu'à preuve du contraire. 
              Si les preuves sont "suffisamment fortes", on rejette H₀.
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm">
                <strong>H₀ (Hypothèse nulle) :</strong> "Rien ne change", "Pas de différence"<br/>
                <strong>H₁ (Hypothèse alternative) :</strong> "Il y a un effet", "Il y a une différence"
              </p>
            </div>
          </CourseHighlight>

          {/* Processus étape par étape */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { step: "1", title: "Formuler H₀ et H₁", desc: "Définir clairement les hypothèses", color: "blue" },
              { step: "2", title: "Choisir α", desc: "Seuil de signification (souvent 5%)", color: "green" },
              { step: "3", title: "Calculer la statistique", desc: "t, Z, χ² selon le contexte", color: "purple" },
              { step: "4", title: "Décider", desc: "Comparer p-value à α", color: "orange" }
            ].map((item) => (
              <div key={item.step} className={`${stepStyles[item.color].box} p-4 rounded-lg border-l-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={stepStyles[item.color].badge}>Étape {item.step}</Badge>
                </div>
                <h4 className={`font-semibold ${stepStyles[item.color].title} mb-1`}>{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Types d'erreurs */}
          <div className="bg-white/80 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ⚠️ Types d'Erreurs : Le Dilemme du Statisticien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-700 mb-2">Erreur de Type I (α)</h4>
                <p className="text-sm text-red-600 mb-2">
                  <strong>Faux Positif :</strong> Rejeter H₀ alors qu'elle est vraie
                </p>
                <p className="text-xs text-gray-600 italic">
                  Exemple : Dire qu'un médicament est efficace alors qu'il ne l'est pas
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-700 mb-2">Erreur de Type II (β)</h4>
                <p className="text-sm text-blue-600 mb-2">
                  <strong>Faux Négatif :</strong> Ne pas rejeter H₀ alors qu'elle est fausse
                </p>
                <p className="text-xs text-gray-600 italic">
                  Exemple : Manquer un médicament réellement efficace
                </p>
              </div>
            </div>
            <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Puissance du test (1-β) :</strong> Probabilité de détecter un effet s'il existe vraiment. 
                Plus l'échantillon est grand, plus la puissance augmente.
              </p>
            </div>
          </div>

          {/* Tests statistiques courants */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">🔬 Tests Statistiques Courants</h3>
            {testTypes.map((test, index) => (
              <Card key={index} className="bg-white/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {test.icon}
                    {test.name}
                  </CardTitle>
                  <p className="text-gray-600">{test.usage}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-semibold text-sm mb-2 text-gray-700">Conditions d'application</h5>
                      <ul className="space-y-1">
                        {test.conditions.map((condition, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-2 text-gray-700">Formule</h5>
                      <div className="bg-gray-50 p-2 rounded">
                        <CourseEquation latex={test.formula} displayMode={false} />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-2 text-gray-700">Exemple d'application</h5>
                      <p className="text-xs text-blue-600 italic">{test.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intervalles de Confiance */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl border border-green-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-green-600" />
            🎯 Intervalles de Confiance : Quantifier l'Incertitude
          </h2>

          <CourseHighlight title="🔍 Zoom sur : Qu'est-ce qu'un Intervalle de Confiance ?" type="concept">
            <p className="mb-3">
              Un intervalle de confiance à 95% ne signifie PAS "il y a 95% de chance que le paramètre soit dans cet intervalle". 
              Cela signifie : "Si on répétait l'expérience 100 fois, environ 95 intervalles contiendraient le vrai paramètre."
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <CourseEquation latex="IC_{95\%} = \bar{x} \pm t_{\alpha/2} \times \frac{s}{\sqrt{n}}" />
            </div>
          </CourseHighlight>

          {/* Visualisation des intervalles de confiance */}
          <div className="bg-white/80 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">📊 Visualisation : Intervalles de Confiance Multiples</h3>
            <p className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <span><span className="mr-1 inline-block h-0 w-5 border-t-2 border-dashed border-indigo-600 align-middle" aria-hidden="true" />vraie moyenne μ = {TRUE_MEAN}</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500 align-middle" aria-hidden="true" />l'intervalle contient μ</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-red-500 align-middle" aria-hidden="true" />l'intervalle manque μ</span>
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceIntervalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sample" />
                  <YAxis domain={[75, 100]} ticks={[75, 80, 85, 90, 95, 100]} />
                  <Tooltip
                    formatter={(value: number, _name: string, item) => [
                      `${value} (IC 95 % : [${item.payload.lower} ; ${item.payload.upper}])`,
                      "Moyenne de l'échantillon"
                    ]}
                  />
                  <Bar dataKey="mean" name="Moyenne de l'échantillon">
                    {confidenceIntervalData.map((d) => (
                      <Cell key={d.sample} fill={d.containsTrueMean ? "#10b981" : "#ef4444"} />
                    ))}
                    <ErrorBar dataKey="error" width={8} strokeWidth={2} stroke="#1f2937" />
                  </Bar>
                  {/* Après les barres : la ligne reste visible par-dessus */}
                  <ReferenceLine y={TRUE_MEAN} stroke="#4f46e5" strokeWidth={2} strokeDasharray="6 4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Chaque barre est la moyenne d'un échantillon, et la barre d'erreur son intervalle de confiance à 95 %.
              Ici, 5 intervalles sur 6 (en vert) contiennent la vraie moyenne μ, que l'on ne connaît jamais en pratique ; un seul (en rouge) la manque.
              C'est exactement ce que signifie « 95 % » : à long terme, environ 95 % des intervalles construits ainsi contiennent le vrai paramètre.
            </p>
          </div>

          {/* Facteurs affectant la largeur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-700 mb-2">📏 Taille d'échantillon (n)</h4>
              <p className="text-sm text-gray-600 mb-2">
                Plus n est grand, plus l'intervalle est étroit
              </p>
              <div className="bg-blue-50 p-2 rounded text-xs">
                Largeur ∝ 1/√n
              </div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-700 mb-2">📊 Variabilité (s)</h4>
              <p className="text-sm text-gray-600 mb-2">
                Plus les données sont dispersées, plus l'intervalle est large
              </p>
              <div className="bg-purple-50 p-2 rounded text-xs">
                Largeur ∝ s
              </div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-700 mb-2">🎯 Niveau de confiance</h4>
              <p className="text-sm text-gray-600 mb-2">
                Plus on veut être sûr, plus l'intervalle est large
              </p>
              <div className="bg-green-50 p-2 rounded text-xs">
                95% {"<"} 99% en largeur
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approche Bayésienne */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            🧠 Approche Bayésienne : Mise à Jour des Croyances
          </h2>

          <CourseHighlight title="💡 Philosophie Bayésienne vs Fréquentiste" type="concept">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-700 mb-2">Approche Fréquentiste</h4>
                <ul className="text-sm space-y-1">
                  <li>• Paramètres fixes mais inconnus</li>
                  <li>• Probabilité = fréquence à long terme</li>
                  <li>• Tests d'hypothèses binaires</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-700 mb-2">Approche Bayésienne</h4>
                <ul className="text-sm space-y-1">
                  <li>• Paramètres sont des variables aléatoires</li>
                  <li>• Probabilité = degré de croyance</li>
                  <li>• Mise à jour continue des croyances</li>
                </ul>
              </div>
            </div>
          </CourseHighlight>

          {/* Théorème de Bayes */}
          <div className="bg-white/80 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">🔄 Théorème de Bayes</h3>
            <div className="text-center mb-6">
              <CourseEquation latex="P(H|D) = \frac{P(D|H) \times P(H)}{P(D)}" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bayesianConcepts.map((item, index) => (
                <div key={index} className="bg-gradient-to-b from-white to-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-700 mb-2">{item.concept}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs text-purple-600 italic">{item.example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exemple pratique Bayésien */}
          <div className="bg-white/80 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">📈 Exemple : Test Médical Bayésien</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔢 Données du problème</h4>
                <div className="space-y-2 text-sm">
                  <p>• Prévalence de la maladie : 1%</p>
                  <p>• Sensibilité du test : 95%</p>
                  <p>• Spécificité du test : 95%</p>
                  <p className="font-semibold text-red-600">• Test positif observé</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🧮 Calcul Bayésien</h4>
                <div className="bg-gray-50 p-3 rounded space-y-1 text-xs">
                  <p>P(Malade|Test+) = ?</p>
                  <p>= P(Test+|Malade) × P(Malade) / P(Test+)</p>
                  <p>P(Test+) = 0.95 × 0.01 + 0.05 × 0.99 = 0.059</p>
                  <p>= 0.95 × 0.01 / 0.059 ≈ 0.161</p>
                  <p className="font-bold text-purple-600">≈ 16% seulement !</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Même avec un test positif, la probabilité d'être malade n'est que de 16% à cause de la faible prévalence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Pratiques */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-8 rounded-xl border border-teal-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-teal-600" />
            🚀 Applications en Data Science
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "A/B Testing",
                icon: "🧪",
                description: "Comparer deux versions d'une interface",
                techniques: ["Test t pour moyennes", "Test Z pour proportions", "Test de Mann-Whitney"],
                example: "Bouton rouge vs bleu : lequel convertit mieux ?"
              },
              {
                title: "Contrôle Qualité",
                icon: "🔍",
                description: "Détecter les défauts de production",
                techniques: ["Cartes de contrôle", "Tests de conformité", "Intervalles de tolérance"],
                example: "Vérifier que 95% des produits respectent les spécifications"
              },
              {
                title: "Marketing Analytics",
                icon: "📊",
                description: "Mesurer l'efficacité des campagnes",
                techniques: ["Attribution causale", "Tests multivariés", "Analyse de cohortes"],
                example: "Cette pub a-t-elle vraiment augmenté les ventes ?"
              },
              {
                title: "Machine Learning",
                icon: "🤖",
                description: "Validation et sélection de modèles",
                techniques: ["Cross-validation", "Tests de significativité", "Intervalles de prédiction"],
                example: "Ce modèle est-il significativement meilleur ?"
              },
              {
                title: "Finance Quantitative",
                icon: "💰",
                description: "Gestion des risques et des portefeuilles",
                techniques: ["VaR (Value at Risk)", "Tests de stress", "Backtesting"],
                example: "Quelle est la perte maximale probable à 95% ?"
              },
              {
                title: "Recherche Clinique",
                icon: "🏥",
                description: "Évaluation de l'efficacité des traitements",
                techniques: ["Essais randomisés", "Méta-analyses", "Analyse de survie"],
                example: "Ce traitement prolonge-t-il vraiment la vie ?"
              }
            ].map((app, index) => (
              <Card key={index} className="bg-white/80 hover:bg-white transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    {app.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{app.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-xs text-gray-500 uppercase mb-2">Techniques utilisées</h5>
                      <ul className="space-y-1">
                        {app.techniques.map((technique, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-teal-400 rounded-full" />
                            {technique}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-teal-50 p-3 rounded">
                      <p className="text-xs text-teal-700 italic">{app.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exercices pratiques */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-xl border border-amber-100">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-amber-600" />
            ✍️ Exercices Pratiques & Auto-évaluation
          </h2>

          <Tabs defaultValue="exercise1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="exercise1">Test t</TabsTrigger>
              <TabsTrigger value="exercise2">Intervalle de Confiance</TabsTrigger>
              <TabsTrigger value="exercise3">Bayes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exercise1" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Exercice : Test t de Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded mb-4">
                    <p className="text-sm">
                      <strong>Énoncé :</strong> Une entreprise affirme que ses employés travaillent en moyenne 40h/semaine. 
                      Un échantillon de 25 employés donne : moyenne = 42h, écart-type = 5h. 
                      Cette différence est-elle significative (α = 0.05) ?
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong>Étapes de résolution :</strong>
                      <ol className="list-decimal pl-5 space-y-1 text-sm mt-2">
                        <li>H₀: μ = 40, H₁: μ ≠ 40</li>
                        <li>Test t bilatéral, α = 0.05, ddl = 24</li>
                        <li>t = (42-40)/(5/√25) = 2</li>
                        <li>t critique = ±2.064</li>
                        <li>|2| {"<"} 2.064 → Ne pas rejeter H₀</li>
                      </ol>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-700">
                        <strong>Conclusion :</strong> la différence n'est pas statistiquement significative au seuil de 5 % (p ≈ 0.057) :
                        on ne peut pas conclure que la moyenne diffère de 40 h. Attention, ne pas rejeter H₀ ne prouve pas que H₀ est vraie :
                        l'échantillon est peut-être simplement trop petit pour détecter un écart de 2 h.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exercise2" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Exercice : Intervalle de Confiance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded mb-4">
                    <p className="text-sm">
                      <strong>Énoncé :</strong> Dans un sondage, 156 personnes sur 200 sont favorables à une mesure. 
                      Calculez l'intervalle de confiance à 95% pour la proportion dans la population.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong>Solution :</strong>
                      <div className="bg-gray-50 p-3 rounded mt-2 space-y-1 text-sm">
                        <p>p̂ = 156/200 = 0.78</p>
                        <p>Erreur standard = √[p̂(1-p̂)/n] = √[0.78×0.22/200] = 0.029</p>
                        <p>IC₉₅% = 0.78 ± 1.96 × 0.029 = [0.723, 0.837]</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-700">
                        <strong>Interprétation :</strong> la proportion de personnes favorables dans la population est estimée entre 72.3 % et 83.7 %.
                        La méthode utilisée produit un intervalle qui contient la vraie proportion dans 95 % des sondages.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exercise3" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🧠 Exercice : Théorème de Bayes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded mb-4">
                    <p className="text-sm">
                      <strong>Énoncé :</strong> Un test de dépistage de maladie a 90% de sensibilité et 95% de spécificité. 
                      La prévalence est de 2%. Si le test est positif, quelle est la probabilité d'être réellement malade ?
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong>Application de Bayes :</strong>
                      <div className="bg-gray-50 p-3 rounded mt-2 space-y-1 text-sm">
                        <p>P(Malade) = 0.02, P(Sain) = 0.98</p>
                        <p>P(+|Malade) = 0.90, P(+|Sain) = 0.05</p>
                        <p>P(+) = 0.90×0.02 + 0.05×0.98 = 0.067</p>
                        <p>P(Malade|+) = (0.90×0.02)/0.067 = 0.269</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm text-purple-700">
                        <strong>Résultat surprenant :</strong> Même avec un test positif, il n'y a que 26.9% de chance 
                        d'être vraiment malade ! C'est l'effet de la faible prévalence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-100">
          <h2 className="text-3xl font-bold mb-6 text-center">🎓 Synthèse & Prochaines Étapes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">✅ Ce que vous avez parcouru</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Logique des tests d'hypothèses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Construction d'intervalles de confiance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Approche bayésienne
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Applications pratiques en data science
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🚀 Pour aller plus loin</h3>
              <ul className="space-y-2 text-sm">
                <li>📊 ANOVA et plans d'expérience</li>
                <li>📈 Régression et modélisation</li>
                <li>🎲 Méthodes de bootstrap et jackknife</li>
                <li>🧠 Machine Learning bayésien</li>
                <li>📉 Analyse de survie</li>
                <li>🔄 Méthodes de rééchantillonnage</li>
              </ul>
              <p className="mt-4 text-sm text-gray-700">
                Retrouvez les tests, les intervalles de confiance, l'ANOVA, la régression et l'approche bayésienne dans leur version détaillée :{" "}
                <Link to="/fundamentals/math-stats/advanced-statistics" className="font-medium text-blue-700 underline">
                  Statistiques avancées
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InferentialStatisticsCourse;
