import { NavLink } from "react-router-dom";
import { Car, Receipt, Users, Wrench } from "lucide-react";

const actions = [
  { to: "/admin/cars", icon: Car, label: "Add Car" },
  { to: "/admin/bookings", icon: Receipt, label: "View Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/settings", icon: Wrench, label: "Settings" },
];

const QuickActions = () => {
  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <NavLink
            key={action.to}
            to={action.to}
            className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border hover:border-primary/30 transition-all"
          >
            <action.icon size={18} className="text-primary" />
            <span className="text-sm font-semibold text-text-main">
              {action.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
