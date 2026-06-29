import { DollarSign, Receipt, Users, Car, TrendingUp } from "lucide-react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-border rounded-lg p-5 shadow-sm hover:border-primary/30 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <span
              className={`text-xs font-semibold ${stat.positive ? "text-emerald-600" : "text-red-500"}`}
            >
              {stat.trend}
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-dim mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-text-main">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
