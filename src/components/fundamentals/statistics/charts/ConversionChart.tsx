import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

// Exemple FICTIF : 3 000 visiteurs par version, 120 conversions pour A (4,0 %) et 156 pour B (5,2 %).
// Test z de deux proportions (ou khi-deux sans correction) : z = 2,22 et p = 0,027, vérifié avec scipy.
const hypothesisData = [
  { name: "Version A", value: 4.0 },
  { name: "Version B", value: 5.2 }
];
const COLORS = ["#0088FE", "#8884d8"];

/** Taux de conversion du test A/B de la carte « Statistiques inférentielles » (chargé par LazyChart) */
const ConversionChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={hypothesisData} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 8]} unit=" %" />
      <Tooltip formatter={(value: number) => [`${String(value).replace(".", ",")} %`, 'Taux de conversion']} />
      <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
      <Bar dataKey="value" name="Taux de conversion (%)">
        {hypothesisData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default ConversionChart;
