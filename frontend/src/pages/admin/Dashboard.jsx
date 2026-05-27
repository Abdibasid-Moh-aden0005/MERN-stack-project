import { useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Car,
  Plus,
  Bell,
  ArrowRight,
  ChevronRight,
  Link,
} from "lucide-react";
import useCarStore from "../../store/zustand/cars";
import useUserStore from "../../store/zustand/users";
import Button from "../../components/common/Button";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const { cars, loading } = useCarStore();
  const { users, fetchUsers } = useUserStore();
  const fetchCars = useCarStore((state) => state.fetchCars);

  useEffect(() => {
    fetchCars();
    fetchUsers();
  }, [fetchCars, fetchUsers]);

  // Calculate new users trend
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

    if (previousMonthUsers === 0) {
      return currentMonthUsers > 0 ? "+100%" : "+0%";
    }
    const diff =
      ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  const stats = [
    {
      label: "Total Revenue",
      value: "$0.00",
      trend: "0%",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      label: "Active Bookings",
      value: "0",
      trend: "0%",
      icon: ShoppingCart,
      color: "text-emerald-600 bg-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      label: "New Customers",
      value: users.length === 0 ? "No User" : users.length.toString(),
      trend: calculateTrend(),
      icon: Users,
      color: "text-emerald-600 bg-emerald-100",
      accent: "bg-emerald-500",
      recent: users.slice(0, 3),
    },
    {
      label: "Fleet Level",
      value: cars.length.toString(),
      trend: "+2.4%",
      icon: Car,
      color: "text-emerald-600 bg-emerald-100",
      accent: "bg-emerald-500",
    },
  ];

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/800x600?text=No+Image";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const featuredCar = cars.length > 0 ? cars[0] : null;
  const trendingCars = cars.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main">
            Overview
          </h1>
          <p className="text-text-dim mt-1">Welcome back, Administrator.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-bg-dark border border-border rounded-full text-text-dim hover:text-text-main transition-all shadow-sm">
            <Bell size={20} />
          </button>
          <NavLink to="/admin/cars">
            <Button icon={Car} className="btn-primary">
              View Cars
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="relative overflow-hidden rounded bg-bg-sidebar border border-border shadow-lg min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-sidebar/90 to-transparent z-10" />
        <img
          src={
            featuredCar
              ? getImageUrl(featuredCar.images[0])
              : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
          }
          alt={featuredCar ? featuredCar.name : "Premium Car"}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 p-12 md:p-16 max-w-2xl space-y-6">
          <span className="px-4 py-1.5 bg-primary/20 text-white border border-primary/30 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            {featuredCar ? "Featured Vehicle" : "New Season"}
          </span>
          <h2 className="text-5xl md:text-6xl font-black leading-tight text-white">
            {featuredCar ? (
              featuredCar.name
            ) : (
              <>
                The Future of <span className="text-primary">Performance</span>
              </>
            )}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {featuredCar
              ? featuredCar.description ||
                `${featuredCar.brand} ${featuredCar.model} - Experience luxury and performance.`
              : "Discover the new Autumn Collection 2024. Premium engineering, timeless style, and modern comfort."}
          </p>
          <NavLink to="/admin/cars">
            <Button className="btn-primary rounded px-8 py-4 text-lg group shadow-xl shadow-primary/20">
              View Campaign{" "}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-card hover:border-primary/50 group transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-3 rounded ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={24} />
              </div>
              <span
                className={`text-sm font-bold ${stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-text-dim text-sm font-medium mb-1">
              {stat.label}
            </p>
            <h3 className="text-3xl font-bold text-text-main">{stat.value}</h3>
            {stat.recent && stat.recent.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-2">
                  Recent Engagement
                </p>
                {stat.recent.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 group/user cursor-default"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${stat.accent} opacity-60 group-hover/user:opacity-100 transition-colors`}
                    />
                    <p className="text-[11px] text-text-dim group-hover/user:text-text-main truncate transition-colors font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-text-main">Trending Fleet</h2>
          <NavLink
            to="/admin/cars"
            className="text-primary hover:text-emerald-700 hover:underline flex items-center gap-1 text-sm font-semibold transition-colors"
          >
            View All <ChevronRight size={14} />
          </NavLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingCars.length > 0 ? (
            trendingCars.map((car, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded bg-bg-dark shadow-sm border border-border"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={getImageUrl(car.images[0])}
                    alt={car.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 space-y-1 z-10">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">
                      {car.brand}
                    </p>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-text-dim font-medium">
              No vehicles found in fleet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
