import React from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";

const statusConfig = {
  Available: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Reserved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Maintainance: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
};

const getImageUrl = (images) => {
  if (!images || images.length === 0) return null;
  const img = images[0];
  if (img.startsWith("http")) return img;
  return `http://localhost:5000${img}`;
};

const CarTable = ({ cars, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="px-8 py-20 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-text-dim text-sm font-medium">Loading fleet data...</p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="px-8 py-20 text-center text-text-dim">
        <div className="flex justify-center mb-4 opacity-20">
          <MoreVertical size={48} />
        </div>
        <p className="text-base font-semibold">No vehicles found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new car.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
              Vehicle Details
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
              Daily Rate
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
              Specs
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {cars.map((car) => {
            const img = getImageUrl(car.images);
            const statusStyle = statusConfig[car.status] || statusConfig.Available;
            return (
              <tr key={car._id} className="hover:bg-bg-dark/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 border border-border shrink-0">
                      {img ? (
                        <img src={img} alt={car.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-dim text-xs font-bold">N/A</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-main">{car.name}</p>
                      <p className="text-xs text-text-dim">{car.brand} &bull; {car.model}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {car.fuelType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {car.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-primary font-semibold">$</span>
                    <span className="font-bold text-text-main">{car.rentPerDay}</span>
                    <span className="text-xs text-text-dim">/day</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-xs text-text-dim">
                    <span>{car.seatingCapacity} seats</span>
                    <span className="text-border">|</span>
                    <span>{car.transmission === "Automatic" ? "Auto" : "Manual"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(car)}
                      className="p-2 hover:bg-primary/10 text-text-dim hover:text-primary rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(car._id)}
                      className="p-2 hover:bg-red-50 text-text-dim hover:text-red-500 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CarTable;
