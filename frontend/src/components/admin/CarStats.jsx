import { Car, Users, Fuel, Wrench, TrendingUp } from "lucide-react";

const CarStats = ({ totalCars, availableCars, reservedCars, maintenanceCars }) => {
  const stats = [
    {
      label: "Total Vehicles",
      value: totalCars,
      icon: Car,
      color: "text-primary",
      sub: "Fleet at full capacity",
      subColor: "text-emerald-600",
    },
    {
      label: "Available",
      value: availableCars,
      icon: Users,
      color: "text-emerald-500",
      sub: "Ready to rent",
      subColor: "text-emerald-600",
    },
    {
      label: "Reserved",
      value: reservedCars,
      icon: Fuel,
      color: "text-blue-500",
      sub: `${totalCars > 0 ? Math.round((reservedCars / totalCars) * 100) : 0}% utilization`,
      subColor: "text-blue-600",
    },
    {
      label: "In Maintenance",
      value: maintenanceCars,
      icon: Wrench,
      color: "text-orange-500",
      sub: maintenanceCars > 0 ? "Attention needed" : "All clear",
      subColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">{stat.label}</span>
            <stat.icon size={18} className={stat.color} />
          </div>
          <p className="text-2xl font-bold text-text-main">{stat.value}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${stat.subColor} font-medium`}>
            <TrendingUp size={14} />
            <span>{stat.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarStats;
