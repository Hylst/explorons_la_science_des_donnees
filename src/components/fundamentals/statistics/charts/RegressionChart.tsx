import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Droite des moindres carrés calculée sur les points (pente 85/110 ≈ 0,773, ordonnée ≈ 2,318)
const regressionPoints = [
  { x: 0, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 4 }, { x: 4, y: 6 }, { x: 5, y: 5 },
  { x: 6, y: 8 }, { x: 7, y: 7 }, { x: 8, y: 9 }, { x: 9, y: 8 }, { x: 10, y: 11 },
];
const meanX = regressionPoints.reduce((sum, p) => sum + p.x, 0) / regressionPoints.length;
const meanY = regressionPoints.reduce((sum, p) => sum + p.y, 0) / regressionPoints.length;
const slope =
  regressionPoints.reduce((sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0) /
  regressionPoints.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0);
const intercept = meanY - slope * meanX;
const regressionData = regressionPoints.map((p) => ({ ...p, yhat: Math.round((intercept + slope * p.x) * 100) / 100 }));

/** Régression linéaire simple de « Concepts statistiques avancés » (chargé par LazyChart) */
const RegressionChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={regressionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip formatter={(value: number) => [value.toFixed(2), 'Valeur']} />
      <Legend />
      <Line type="monotone" dataKey="y" name="Données" stroke="#8884d8" fill="#8884d8" dot={{ r: 5 }} />
      <Line type="monotone" dataKey="yhat" name="Prédiction" stroke="#ff7300" dot={false} activeDot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default RegressionChart;
