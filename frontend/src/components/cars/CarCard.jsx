import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const statusConfig = {
  Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Reserved: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Maintainance: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
};

const CarCard = ({ car, onBookNow }) => {
  const navigate = useNavigate();

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/800x600?text=No+Image+Available';
    const img = images[0];
    if (img.startsWith('http')) return img;
    return `http://localhost:5000${img}`;
  };

  const isBookable = car.status === 'Available';
  const statusStyle = statusConfig[car.status] || statusConfig.Maintainance;

  return (
    <div className="glass-card group flex flex-col h-full hover:border-primary/50 transition-all duration-300">
      {/* Image Container */}
      <div 
        className="relative aspect-[16/10] overflow-hidden rounded bg-bg-dark cursor-pointer mb-4"
        onClick={() => navigate(`/cars/${car._id}`)}
      >
        <img 
          src={getImageUrl(car.images)} 
          alt={car.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
          {car.brand}
        </div>
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {car.status}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 space-y-4">
        <div>
          <h3 
            className="text-lg font-bold text-text-main group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/cars/${car._id}`)}
          >
            {car.name}
          </h3>
          <p className="text-text-dim text-xs font-mono mt-1">{car.model} • {car.year}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded bg-bg-dark border border-border">
            <Users size={14} className="text-text-dim mb-1" />
            <span className="text-[10px] font-bold text-text-main">{car.seatingCapacity} Seats</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-bg-dark border border-border">
            <Fuel size={14} className="text-text-dim mb-1" />
            <span className="text-[10px] font-bold text-text-main truncate w-full text-center">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-bg-dark border border-border">
            <Settings size={14} className="text-text-dim mb-1" />
            <span className="text-[10px] font-bold text-text-main">{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
          </div>
        </div>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-border">
          <div>
            <p className="text-[10px] uppercase font-bold text-text-dim tracking-widest">Price / Day</p>
            <p className="text-xl font-black text-primary">${car.rentPerDay}</p>
          </div>
          <Button 
            onClick={() => onBookNow && isBookable ? onBookNow(car) : navigate(`/cars/${car._id}`)}
            className="btn-primary px-4 py-2 text-xs"
          >
            {onBookNow && isBookable ? 'Book Now' : 'Details'} <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
