import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ScatterChart, TrendingUp, Eye } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import CorrelationHeatmap from "./CorrelationHeatmap";
import { DistributionPanel, OutliersPanel, ProfilingPanel } from "./ExplorationPanels";
import { SAMPLE_DATASETS, SampleDataset } from "@/lib/sample-datasets";

/**
 * Visual Exploration Section Component
 * Interactive exploration on seeded sample datasets: every figure is computed from the rows (see lib/sample-datasets).
 */
export const VisualExplorationSection: React.FC = () => {
  const [activeChart, setActiveChart] = useState<string>("distribution");
  const [selectedDataset, setSelectedDataset] = useState<SampleDataset["id"]>("sales");
  const dataset = SAMPLE_DATASETS[selectedDataset];

  /**
   * Chart configuration for different visualization types
   */
  const chartTypes = [
    {
      id: "distribution",
      name: "Distribution",
      icon: BarChart3,
      description: "Histogrammes et densités"
    },
    {
      id: "correlation",
      name: "Corrélation",
      icon: ScatterChart,
      description: "Matrices de corrélation"
    },
    {
      id: "outliers",
      name: "Outliers",
      icon: TrendingUp,
      description: "Détection visuelle"
    },
    {
      id: "profiling",
      name: "Profiling",
      icon: Eye,
      description: "Analyse automatique"
    }
  ];

  return (
    <section id="exploration" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-500" />
          Exploration Visuelle des Données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          L'exploration visuelle permet de comprendre rapidement la structure,
          la distribution et les relations dans vos données avant tout traitement.
        </p>
      </div>

      <CourseHighlight type="concept" title="Les 4 Piliers de l'Exploration Visuelle">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {chartTypes.map((chart) => {
            const IconComponent = chart.icon;
            return (
              <Card
                key={chart.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeChart === chart.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setActiveChart(chart.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">{chart.name}</h4>
                  <p className="text-sm text-muted-foreground">{chart.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CourseHighlight>

      {/* Interactive Visualization Panel */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Visualisation Interactive
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dataset Selector */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Jeu de données d'exemple">
            {Object.values(SAMPLE_DATASETS).map((ds) => (
              <button key={ds.id} type="button" onClick={() => setSelectedDataset(ds.id)} aria-pressed={selectedDataset === ds.id}>
                <Badge variant={selectedDataset === ds.id ? "default" : "outline"} className="cursor-pointer">
                  {ds.name} ({ds.rows.length.toLocaleString("fr-FR")} lignes)
                </Badge>
              </button>
            ))}
          </div>

          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              {chartTypes.map((chart) => (
                <TabsTrigger key={chart.id} value={chart.id}>
                  {chart.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="distribution" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">📊 Graphiques de Distribution</h4>
                <DistributionPanel ds={dataset} />
              </div>
            </TabsContent>

            <TabsContent value="correlation" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">🔗 Matrice de Corrélation</h4>
                <CorrelationHeatmap />
                <p className="mt-3 text-xs text-muted-foreground">Cet onglet utilise son propre jeu à six variables numériques, indépendant du jeu choisi ci-dessus.</p>
              </div>
            </TabsContent>

            <TabsContent value="outliers" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">🎯 Détection Visuelle d'Outliers</h4>
                <OutliersPanel ds={dataset} />
              </div>
            </TabsContent>

            <TabsContent value="profiling" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">🤖 Profiling Automatique des Datasets</h4>
                <ProfilingPanel ds={dataset} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default VisualExplorationSection;
