import React from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Users as UsersIcon,
  Fuel,
  Zap,
} from "lucide-react";

const CarTable = ({ cars, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="px-8 py-20 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-text-dim animate-pulse">
          Loading fleet data...
        </p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="px-8 py-20 text-center text-text-dim">
        <div className="flex justify-center mb-4 opacity-20">
          <Zap size={64} />
        </div>
        <p className="text-xl font-medium">
          No cars found matching your search.
        </p>
        <p className="text-sm">
          Try adjusting your filters or adding a new vehicle.
        </p>
      </div>
    );
  }
  console.log(cars[0].images);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim">
              Car Details
            </th>
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim">
              Category
            </th>
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim">
              Specs
            </th>
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim">
              Price/Day
            </th>
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim">
              Status
            </th>
            <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-text-dim text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {cars.map((car) => (
            <tr
              key={car._id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shadow-lg group-hover:border-primary/50 transition-colors">
                    <img
                      src={
                        car.images?.[0]
                          ? `http://localhost:5000${car.images[4]}`
                          : `http://localhost:5000${car.images[1]}`
                      }
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">
                      {car.name}
                    </p>
                    <p className="text-sm text-text-dim">
                      {car.brand} • {car.model}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                  {car.fuelType}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-4 text-text-dim">
                  <div
                    className="flex flex-col items-center gap-1"
                    title="Seating"
                  >
                    <UsersIcon size={14} className="text-primary/70" />
                    <span className="text-[10px] font-bold">
                      {car.seatingCapacity}
                    </span>
                  </div>
                  <div
                    className="flex flex-col items-center gap-1"
                    title="Transmission"
                  >
                    <Zap size={14} className="text-primary/70" />
                    <span className="text-[10px] font-bold capitalize">
                      {car.transmission.slice(0, 4)}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-primary">$</span>
                  <span className="font-black text-md text-gray-700 tracking-tighter">
                    {car.rentPerDay}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${car.isAvailable ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.8)]"}`}
                  />
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${car.isAvailable ? "text-green-500" : "text-red-500"}`}
                  >
                    {car.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(car)}
                    className="p-2.5 bg-bg-card hover:bg-primary/20 hover:text-primary text-text-dim rounded-xl border border-white/5 hover:border-primary/50 transition-all shadow-xl"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(car._id)}
                    className="p-2.5 bg-bg-card hover:bg-red-500/20 hover:text-red-500 text-text-dim rounded-xl border border-white/5 hover:border-red-500/50 transition-all shadow-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarTable;
