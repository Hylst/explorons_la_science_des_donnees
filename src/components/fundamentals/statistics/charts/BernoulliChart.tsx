import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Loi de Bernoulli de paramètre 0,3 (exemple)
const probabilityData = [
  { name: 'Succès', value: 30 },
  { name: 'Échec', value: 70 },
];
const COLORS = ['#4f46e5', '#e11d48'];

/** Camembert de la carte « Probabilités » (chargé par LazyChart) */
const BernoulliChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={probabilityData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)} %`}
      >
        {probabilityData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default BernoulliChart;
