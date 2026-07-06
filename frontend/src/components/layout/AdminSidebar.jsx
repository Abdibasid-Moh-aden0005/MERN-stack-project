import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  Settings,
  UserCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import useAuthStore from "../../store/zustand/auth";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Inventory", path: "/admin/cars", icon: Car },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Profile", path: "/profile", icon: UserCircle },
  { name: "Settings", path: "/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const loginOut = () => {
    logout();
    navigate("/login");
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.name || "User";
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return (user?.firstName?.[0] || user?.name?.[0] || "U").toUpperCase();
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-lg bg-bg-sidebar text-white shadow-xl border border-white/10"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 w-72 h-screen bg-bg-sidebar flex flex-col p-6 shadow-2xl z-40
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:z-50
        `}
      >
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
              <Car className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Classic Rental Car
              </h1>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-semibold">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded text-text-dim hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded transition-all duration-300 group
                ${isActive ? "bg-white/10 text-white" : "text-text-dim hover:bg-white/5 hover:text-white"}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={22} className="transition-colors" />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-40 transition-opacity"
              />
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">
                {getDisplayName()}
              </p>
              <p className="text-[10px] text-text-dim truncate uppercase tracking-tighter">
                Admin
              </p>
            </div>
          </div>

          <button
            onClick={loginOut}
            className="w-full flex items-center gap-4 px-4 py-3 rounded text-text-dim hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <LogOut size={22} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
