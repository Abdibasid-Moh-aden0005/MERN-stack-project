import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const CarCard = ({ car, onBookNow }) => {
  const navigate = useNavigate();
  console.log(car.images)

  return (
    <div className="glass-card group overflow-hidden flex flex-col h-full hover:bg-bg-card/80 transition-all duration-500 border-white/5 hover:border-primary/20">
      {/* Image Container */}
      <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-slate-800">
        <img 
          src={car.images[0] ? `http://localhost:5000${car.images[0]}`:car.images[1]} 
          alt={car.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          {car.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{car.name}</h3>
          <p className="text-text-dim text-sm">{car.model} • {car.year}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
            <Users size={14} className="text-primary mb-1" />
            <span className="text-[10px] font-bold text-text-dim">{car.seatingCapacity} Seats</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
            <Fuel size={14} className="text-primary mb-1" />
            <span className="text-[10px] font-bold text-text-dim truncate w-full text-center">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
            <Settings size={14} className="text-primary mb-1" />
            <span className="text-[10px] font-bold text-text-dim">{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
          </div>
        </div>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
          <div>
            <p className="text-[10px] uppercase font-bold text-text-dim tracking-widest">Price / Day</p>
            <p className="text-2xl font-black text-white">${car.rentPerDay}</p>
          </div>
          <Button 
            onClick={() => onBookNow(car)}
            className="rounded-xl px-5 py-3 text-xs group"
          >
            Book Now <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
