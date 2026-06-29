import { useEffect } from "react";
import {
  DollarSign,
  Users,
  Car,
  Bell,
  Receipt,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useCarStore from "../../store/zustand/cars";
import useUserStore from "../../store/zustand/users";
import useBookingStore from "../../store/zustand/Bookings";
import Button from "../../components/common/Button";
import DashboardStats from "../../components/admin/DashboardStats";
import FleetStatus from "../../components/admin/FleetStatus";
import FeaturedCar from "../../components/admin/FeaturedCar";
import QuickActions from "../../components/admin/QuickActions";
import RecentActivity from "../../components/admin/RecentActivity";

const Dashboard = () => {
  const { cars } = useCarStore();
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
  const maintenanceCars = cars.filter((c) => c.status === "Maintainance").length;
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
      positive: true,
    },
    {
      label: "Active Bookings",
      value: activeBookings.toString(),
      trend: "+8.2%",
      icon: Receipt,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      positive: true,
    },
    {
      label: "Total Customers",
      value: users.length.toString(),
      trend: calculateTrend(),
      icon: Users,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
      positive: calculateTrend().startsWith("+"),
    },
    {
      label: "Fleet Size",
      value: cars.length.toString(),
      trend: `${availableCars} available`,
      icon: Car,
      color: "text-primary",
      iconBg: "bg-primary/10",
      positive: true,
    },
  ];

  const featuredCar = cars.length > 0 ? cars[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Dashboard</h1>
          <p className="text-text-dim text-sm mt-1">Welcome back, Administrator.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all shadow-sm">
            <Bell size={18} />
          </button>
          <NavLink to="/admin/cars">
            <Button icon={Car} className="shadow-lg shadow-primary/20">View Cars</Button>
          </NavLink>
        </div>
      </div>

      <DashboardStats stats={stats} />
      <FleetStatus availableCars={availableCars} reservedCars={reservedCars} maintenanceCars={maintenanceCars} totalCars={cars.length} />
      <FeaturedCar car={featuredCar} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity bookings={bookings} />
      </div>
    </div>
  );
};

export default Dashboard;
