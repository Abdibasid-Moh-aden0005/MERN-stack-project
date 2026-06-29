import {
  CheckCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";

const BookingStats = ({ totalBookings, pendingBookings, confirmedBookings, completedBookings, totalRevenue }) => {
  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Receipt,
      color: "text-primary",
      sub: "All reservations",
      subColor: "text-emerald-500",
    },
    {
      label: "Pending",
      value: pendingBookings,
      icon: Clock,
      color: "text-amber-500",
      sub: "Awaiting review",
      subColor: "text-amber-600",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      icon: CheckCircle,
      color: "text-blue-500",
      sub: "Active rentals",
      subColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: completedBookings,
      icon: CheckCircle2,
      color: "text-emerald-500",
      sub: "Successfully finished",
      subColor: "text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      sub: "From all bookings",
      subColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

export default BookingStats;
