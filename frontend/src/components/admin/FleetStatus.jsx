import { Car, UserCheck, Wrench } from "lucide-react";

const FleetStatus = ({ availableCars, reservedCars, maintenanceCars, totalCars }) => {
  const items = [
    {
      label: "Available",
      value: availableCars,
      icon: Car,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      barColor: "bg-emerald-500",
    },
    {
      label: "Reserved",
      value: reservedCars,
      icon: UserCheck,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      barColor: "bg-blue-500",
    },
    {
      label: "Maintenance",
      value: maintenanceCars,
      icon: Wrench,
      color: "text-orange-600",
      iconBg: "bg-orange-100",
      barColor: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${item.iconBg}`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
                {item.label}
              </p>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`${item.barColor} h-1.5 rounded-full`}
              style={{
                width: `${totalCars > 0 ? (item.value / totalCars) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FleetStatus;
