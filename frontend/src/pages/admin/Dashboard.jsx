import { useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Car,
  Bell,
  ArrowRight,
  ChevronRight,
  Receipt,
  TrendingUp,
  UserCheck,
  Wrench,
} from "lucide-react";
import useCarStore from "../../store/zustand/cars";
import useUserStore from "../../store/zustand/users";
import useBookingStore from "../../store/zustand/Bookings";
import Button from "../../components/common/Button";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const { cars, loading: carsLoading } = useCarStore();
  const { users, fetchUsers } = useUserStore();
  const { bookings, fetchAllBookings } = useBookingStore();
  const fetchCars = useCarStore((state) => state.fetchCars);

  useEffect(() => {
    fetchCars();
    fetchUsers();
    fetchAllBookings();
  }, [fetchCars, fetchUsers, fetchAllBookings]);

  const calculateTrend = () => {
    if (!users || users.length === 0) return "+0%";
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const currentMonthUsers = users.filter(
      (u) => new Date(u.createdAt) > thirtyDaysAgo,
    ).length;
    const previousMonthUsers = users.filter((u) => {
      const date = new Date(u.createdAt);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    }).length;
    if (previousMonthUsers === 0)
      return currentMonthUsers > 0 ? "+100%" : "+0%";
    const diff =
      ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalRent || 0), 0);
  const activeBookings = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending",
  ).length;
  const maintenanceCars = cars.filter(
    (c) => c.status === "Maintainance",
  ).length;
  const availableCars = cars.filter((c) => c.status === "Available").length;
  const reservedCars = cars.filter((c) => c.status === "Reserved").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      accent: "bg-emerald-500",
      positive: true,
    },
    {
      label: "Active Bookings",
      value: activeBookings.toString(),
      trend: "+8.2%",
      icon: Receipt,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      accent: "bg-blue-500",
      positive: true,
    },
    {
      label: "Total Customers",
      value: users.length.toString(),
      trend: calculateTrend(),
      icon: Users,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
      accent: "bg-purple-500",
      positive: calculateTrend().startsWith("+"),
    },
    {
      label: "Fleet Size",
      value: cars.length.toString(),
      trend: `${availableCars} available`,
      icon: Car,
      color: "text-primary",
      iconBg: "bg-primary/10",
      accent: "bg-primary",
      positive: true,
    },
  ];

  const getImageUrl = (image) => {
    if (!image)
      return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const featuredCar = cars.length > 0 ? cars[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            Dashboard
          </h1>
          <p className="text-text-dim text-sm mt-1">
            Welcome back, Administrator.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all shadow-sm">
            <Bell size={18} />
          </button>
          <NavLink to="/admin/cars">
            <Button icon={Car} className="shadow-lg shadow-primary/20">
              View Cars
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Fleet Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100">
              <Car size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
                Available
              </p>
              <p className="text-xl font-bold text-emerald-600">
                {availableCars}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{
                width: `${cars.length > 0 ? (availableCars / cars.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <UserCheck size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
                Reserved
              </p>
              <p className="text-xl font-bold text-blue-600">{reservedCars}</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{
                width: `${cars.length > 0 ? (reservedCars / cars.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-100">
              <Wrench size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
                Maintenance
              </p>
              <p className="text-xl font-bold text-orange-600">
                {maintenanceCars}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full"
              style={{
                width: `${cars.length > 0 ? (maintenanceCars / cars.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Featured Car Banner */}
      <div className="relative overflow-hidden rounded-lg bg-white border border-border shadow-sm min-h-50">
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent z-10" />
        <img
          src={getImageUrl(featuredCar?.images?.[0])}
          alt={featuredCar?.name || "Premium Car"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-8 md:p-10 max-w-xl space-y-4">
          <span className="inline-flex items-center px-2.5 py-1 bg-primary/20 text-white border border-primary/30 rounded text-xs font-bold uppercase tracking-widest">
            {featuredCar ? "Featured Vehicle" : "New Season"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
            {featuredCar ? featuredCar.name : "The Future of Performance"}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {featuredCar
              ? featuredCar.description ||
                `${featuredCar.brand} ${featuredCar.model}`
              : "Discover premium engineering and modern comfort."}
          </p>
          <NavLink to="/admin/cars">
            <Button className="shadow-xl shadow-primary/20">
              View Fleet <ArrowRight size={16} className="ml-1" />
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <NavLink
              to="/admin/cars"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border hover:border-primary/30 transition-all"
            >
              <Car size={18} className="text-primary" />
              <span className="text-sm font-semibold text-text-main">
                Add Car
              </span>
            </NavLink>
            <NavLink
              to="/admin/bookings"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border hover:border-primary/30 transition-all"
            >
              <Receipt size={18} className="text-primary" />
              <span className="text-sm font-semibold text-text-main">
                View Orders
              </span>
            </NavLink>
            <NavLink
              to="/admin/customers"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border hover:border-primary/30 transition-all"
            >
              <Users size={18} className="text-primary" />
              <span className="text-sm font-semibold text-text-main">
                Customers
              </span>
            </NavLink>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border hover:border-primary/30 transition-all"
            >
              <Wrench size={18} className="text-primary" />
              <span className="text-sm font-semibold text-text-main">
                Settings
              </span>
            </NavLink>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking, idx) => (
              <div
                key={booking._id || idx}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-dark transition-all"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    booking.status === "Completed"
                      ? "bg-emerald-500"
                      : booking.status === "Confirmed"
                        ? "bg-blue-500"
                        : booking.status === "Pending"
                          ? "bg-amber-500"
                          : "bg-red-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">
                    {booking.customerId?.firstName || "Customer"} booked{" "}
                    {booking.carId?.name || "a vehicle"}
                  </p>
                  <p className="text-xs text-text-dim">
                    {new Date(booking.createdAt).toLocaleDateString()} &bull; $
                    {booking.totalRent}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    booking.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : booking.status === "Confirmed"
                        ? "bg-blue-50 text-blue-700"
                        : booking.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-sm text-text-dim text-center py-6">
                No recent bookings
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
