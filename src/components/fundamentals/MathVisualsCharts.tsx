// Graphiques de MathVisualsSection (Recharts), chargés à l'approche de l'écran par LazyChart
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { fr, normalDistributionData, probabilityData, regressionData } from "./math-visuals-data";

export const RegressionVisual = () => (
    <ChartContainer
      className="aspect-auto h-full w-full"
      config={{
        raw: { label: "Données brutes", color: "#4F46E5" },
        prediction: { label: "Prédiction", color: "#EF4444" },
      }}
    >
      <ComposedChart data={regressionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="x"
          type="number"
          label={{ value: 'Variable X', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          label={{ value: 'Variable Y', angle: -90, position: 'insideLeft', offset: -5 }}
        />
        <Scatter name="Données" dataKey="y" fill="#4F46E5" />
        <Line
          name="Prédiction"
          type="linear"
          dataKey="prediction"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
      </ComposedChart>
    </ChartContainer>
);

export const NormalVisual = () => (
    <ChartContainer
      className="aspect-auto h-full w-full"
      config={{
        distribution: { label: "Distribution", color: "#8B5CF6" },
      }}
    >
      <LineChart data={normalDistributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="x"
          interval={4}
          label={{ value: 'Écarts à la moyenne (en écarts types)', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          label={{ value: 'Densité', angle: -90, position: 'insideLeft', offset: -5 }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={false}
          name="distribution"
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
      </LineChart>
    </ChartContainer>
);

export const BayesVisual = () => (
    <ChartContainer
      className="aspect-auto h-full w-full"
      config={{
        probabilité: { label: "Probabilité", color: "#0EA5E9" },
      }}
    >
      <BarChart data={probabilityData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="category"
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis
          domain={[0, 100]}
          label={{ value: 'Probabilité d\'être malade (%)', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle' } }}
        />
        <Bar
          dataKey="value"
          name="probabilité"
          fill="#0EA5E9"
          radius={[4, 4, 0, 0]}
        >
          <LabelList dataKey="value" position="top" formatter={(value: number) => `${fr(value, 1)} %`} />
        </Bar>
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
      </BarChart>
    </ChartContainer>
);
