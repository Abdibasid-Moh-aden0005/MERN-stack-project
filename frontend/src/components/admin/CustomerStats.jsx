import { Users, UserCheck, UserX, Shield, TrendingUp } from "lucide-react";

const CustomerStats = ({ totalUsers, activeUsers, inactiveUsers, adminUsers }) => {
  const stats = [
    {
      label: "Total Customers",
      value: totalUsers,
      icon: Users,
      color: "text-primary",
      sub: "Registered members",
      subColor: "text-emerald-600",
    },
    {
      label: "Active",
      value: activeUsers,
      icon: UserCheck,
      color: "text-emerald-500",
      sub: `${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% of total`,
      subColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: inactiveUsers,
      icon: UserX,
      color: "text-gray-400",
      sub: "Needs attention",
      subColor: "text-gray-500",
    },
    {
      label: "Administrators",
      value: adminUsers,
      icon: Shield,
      color: "text-purple-500",
      sub: "With full access",
      subColor: "text-purple-600",
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

export default CustomerStats;
