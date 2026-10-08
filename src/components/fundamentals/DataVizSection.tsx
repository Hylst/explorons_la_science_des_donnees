
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Scatter, AreaChart } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const pieData = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 300 },
  { name: "D", value: 200 },
];

// Données FICTIVES pour l'exemple interactif (le revenu par visite est calculé : ventes / visites)
const interactiveData = [
  { month: "Jan", sales: 1000, visits: 1400 },
  { month: "Feb", sales: 1500, visits: 1200 },
  { month: "Mar", sales: 1300, visits: 1800 },
  { month: "Apr", sales: 1700, visits: 2200 },
  { month: "May", sales: 2000, visits: 2500 },
  { month: "Jun", sales: 2400, visits: 3000 },
  { month: "Jul", sales: 2300, visits: 2800 },
  { month: "Aug", sales: 2100, visits: 2600 },
  { month: "Sep", sales: 2500, visits: 3200 },
  { month: "Oct", sales: 2700, visits: 3500 },
  { month: "Nov", sales: 3000, visits: 3700 },
  { month: "Dec", sales: 3500, visits: 4000 },
].map((row) => ({ ...row, revenuParVisite: Math.round((row.sales / row.visits) * 100) / 100 }));

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DataVizSection = () => {
  const [activeChart, setActiveChart] = useState("line");

  return (
    <div id="dataviz" className="scroll-mt-24 border-l-4 border-ds-blue-400 pl-6 py-2">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-ds-blue-400 to-ds-purple-400 bg-clip-text text-transparent">Visualisation de données</h2>
      <div className="max-w-none">
        <p className="text-lg">
          La visualisation est essentielle pour comprendre les données, identifier des tendances, 
          et communiquer des résultats de manière efficace aux parties prenantes.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-4">Principes de la visualisation efficace</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="bg-gradient-to-r from-ds-blue-50 to-ds-blue-100 rounded-lg p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-ds-blue-700 mb-2">Simplicité</h4>
            <p className="text-sm">Éliminer les éléments non nécessaires qui distraient de l'information principale</p>
          </div>
          <div className="bg-gradient-to-r from-ds-purple-50 to-ds-purple-100 rounded-lg p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-ds-purple-700 mb-2">Lisibilité</h4>
            <p className="text-sm">Utiliser des étiquettes claires, des couleurs appropriées et des échelles adaptées</p>
          </div>
          <div className="bg-gradient-to-r from-ds-blue-50 to-ds-purple-50 rounded-lg p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-ds-blue-600 mb-2">Adaptation</h4>
            <p className="text-sm">Choisir le type de graphique en fonction des données et du message à communiquer</p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold mb-4 text-center">Données temporelles</h4>
              <DeferredResponsiveContainer width="100%" height={200}>
                <LineChart data={sampleData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </DeferredResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold mb-4 text-center">Données catégorielles</h4>
              <DeferredResponsiveContainer width="100%" height={200}>
                <BarChart data={sampleData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </DeferredResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mt-8 mb-4">Types de visualisations courants</h3>
        <Card className="p-6 my-6">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-ds-blue-500 rounded-full mr-2"></span>
                    <strong>Données catégorielles:</strong> Diagrammes à barres, camemberts, treemaps
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-ds-purple-500 rounded-full mr-2"></span>
                    <strong>Données temporelles:</strong> Graphiques linéaires, graphiques à bandes
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-ds-blue-300 rounded-full mr-2"></span>
                    <strong>Distributions:</strong> Histogrammes, box plots, violin plots
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-ds-purple-300 rounded-full mr-2"></span>
                    <strong>Relations:</strong> Nuages de points, matrices de corrélation, heatmaps
                  </li>
                </ul>
              </div>
              <DeferredResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </DeferredResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <h3 className="text-xl font-semibold mt-10 mb-6">Exemple interactif: Analyse des ventes et visites</h3>
        
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Sélectionnez différentes visualisations pour explorer les mêmes données sous plusieurs angles.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="line" onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="line">Tendance</TabsTrigger>
            <TabsTrigger value="bar">Comparaison</TabsTrigger>
            <TabsTrigger value="area">Évolution</TabsTrigger>
            <TabsTrigger value="composed">Multi-dimensions</TabsTrigger>
          </TabsList>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">
                  {activeChart === "line" && "Tendance des ventes et visites"}
                  {activeChart === "bar" && "Comparaison des ventes et visites par mois"}
                  {activeChart === "area" && "Évolution cumulative au fil du temps"}
                  {activeChart === "composed" && "Relation entre ventes, visites et revenu par visite (données fictives)"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {activeChart === "line" && "Visualisez l'évolution des métriques au fil du temps pour identifier les tendances saisonnières."}
                  {activeChart === "bar" && "Comparez facilement les valeurs mois par mois pour repérer les périodes de performance."}
                  {activeChart === "area" && "L'aire sous la courbe permet de visualiser l'accumulation et les proportions relatives."}
                  {activeChart === "composed" && "Combinez plusieurs types de visualisations pour explorer des relations complexes."}
                </p>
              </div>
              
              <div className="h-[400px] mt-6">
                <TabsContent value="line" className="h-full mt-0">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <LineChart data={interactiveData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Line yAxisId="left" type="monotone" dataKey="sales" name="Ventes (€)" stroke="#8884d8" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="visits" name="Visites" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </DeferredResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="bar" className="h-full mt-0">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <BarChart data={interactiveData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="sales" name="Ventes (€)" fill="#8884d8" />
                      <Bar dataKey="visits" name="Visites" fill="#82ca9d" />
                    </BarChart>
                  </DeferredResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="area" className="h-full mt-0">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <AreaChart data={interactiveData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Area type="monotone" dataKey="sales" name="Ventes (€)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="visits" name="Visites" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    </AreaChart>
                  </DeferredResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="composed" className="h-full mt-0">
                  <DeferredResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={interactiveData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Bar yAxisId="left" dataKey="sales" name="Ventes (€)" fill="#8884d8" />
                      <Line yAxisId="left" type="monotone" dataKey="visits" name="Visites" stroke="#82ca9d" strokeWidth={2} />
                      <Scatter yAxisId="right" dataKey="revenuParVisite" name="Revenu par visite (€)" fill="#ff7300" />
                    </ComposedChart>
                  </DeferredResponsiveContainer>
                </TabsContent>
              </div>
              
              <div className="mt-6 text-sm">
                <p className="text-gray-600 border-t pt-4">
                  <strong>Analyse (données fictives) :</strong> {activeChart === "line" && "Le graphique montre une tendance globale à la hausse pour les ventes et les visites, avec un pic en décembre."}
                  {activeChart === "bar" && "La comparaison des barres montre que le revenu par visite (ventes / visites) varie selon les mois : février est le plus élevé, janvier et mars les plus bas."}
                  {activeChart === "area" && "Les ventes (en €) et les visites (en nombre) n'ont pas la même unité : seule leur évolution commune se compare, pas leur écart sur l'axe."}
                  {activeChart === "composed" && "Cette visualisation permet d'observer que les périodes de ventes élevées (décembre) ne coïncident pas toujours avec le meilleur revenu par visite (février)."}
                </p>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default DataVizSection;
