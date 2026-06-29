import { Search } from "lucide-react";

const BookingFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full md:w-72 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-border rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main shadow-sm"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <span className="text-sm text-text-dim">Active Order Queue</span>
    </div>
  );
};

export default BookingFilters;
