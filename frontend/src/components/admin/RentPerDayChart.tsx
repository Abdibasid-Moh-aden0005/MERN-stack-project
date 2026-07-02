import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RentPerDayChartProps {
  cars: { rentPerDay?: number }[];
}

const BUCKET_SIZE = 50;

const RentPerDayChart = ({ cars }: RentPerDayChartProps) => {
  const rents = cars
    .map((c) => c.rentPerDay)
    .filter((r): r is number => r != null);

  if (!rents.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-text-main mb-4">
          Rent Per Day Distribution
        </h3>
        <p className="text-text-dim text-sm">No rental data available.</p>
      </div>
    );
  }

  const min = Math.floor(Math.min(...rents) / BUCKET_SIZE) * BUCKET_SIZE;
  const max = Math.ceil(Math.max(...rents) / BUCKET_SIZE) * BUCKET_SIZE;

  const buckets: Record<string, number> = {};
  for (let i = min; i < max; i += BUCKET_SIZE) {
    const label = `$${i}-${i + BUCKET_SIZE}`;
    buckets[label] = 0;
  }

  rents.forEach((r) => {
    const bucketStart = Math.floor(r / BUCKET_SIZE) * BUCKET_SIZE;
    const label = `$${bucketStart}-${bucketStart + BUCKET_SIZE}`;
    if (buckets[label] !== undefined) {
      buckets[label]++;
    }
  });

  const data = Object.entries(buckets).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-text-main mb-4">
        Rent Per Day Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis stroke="#6b7280" allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RentPerDayChart;
