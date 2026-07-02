import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FuelTypeChartProps {
  cars: { fuelType?: string; rentPerDay?: number }[];
}

const FuelTypeChart = ({ cars }: FuelTypeChartProps) => {
  const fuelTypeCount = cars.reduce<Record<string, number>>((acc, car) => {
    const type = car.fuelType || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(fuelTypeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-text-main mb-4">
        Fuel Type Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelTypeChart;
