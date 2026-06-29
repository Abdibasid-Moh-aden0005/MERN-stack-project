import { Search, RefreshCw } from "lucide-react";

const CustomerFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, roleFilter, onRoleChange, onRefresh, loading }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-border rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main shadow-sm"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
        >
          <option value="All">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={onRefresh}
          className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all hover:border-primary/30 shadow-sm"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default CustomerFilters;
