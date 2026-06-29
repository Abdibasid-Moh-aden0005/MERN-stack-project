import { Car } from "lucide-react";
import CarCard from "../cars/CarCard";

const FleetGrid = ({ cars, loading, onBookNow }) => {
  return (
    <section className="container mx-auto px-6 mt-24 space-y-12 max-w-[1440px]">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main">OUR EXCLUSIVE FLEET</h2>
          <p className="text-text-dim mt-2 text-sm">Handpicked selection for the ultimate driving experience.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-text-dim font-bold text-sm">
          <span>Total Cars:</span>
          <span className="text-primary">{cars.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card aspect-[16/14] animate-pulse bg-gray-200" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-bg-dark rounded flex items-center justify-center mb-6">
            <Car className="text-text-dim" size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-text-main">No cars available</h3>
          <p className="text-text-dim max-w-xs">Our fleet is currently out on the road. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} onBookNow={onBookNow} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FleetGrid;
