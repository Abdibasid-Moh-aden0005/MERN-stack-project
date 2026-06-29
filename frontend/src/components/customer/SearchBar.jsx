import { Search, Filter } from "lucide-react";
import Button from "../common/Button";

const SearchBar = () => {
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
            className="w-full bg-bg-dark border border-border rounded pl-12 pr-4 h-12 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-12 bg-bg-dark border border-border rounded text-text-main hover:border-primary hover:text-primary transition-all">
            <Filter size={20} />
            <span className="font-bold">Filters</span>
          </button>
          <Button className="btn-primary flex-1 md:flex-none px-8 h-12 rounded">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
