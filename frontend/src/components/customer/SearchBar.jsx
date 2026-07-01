import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="container mx-auto px-6 -mt-12 relative z-20 max-w-360">
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by car name or brand..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-bg-dark border border-border rounded pl-12 pr-4 h-12 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
