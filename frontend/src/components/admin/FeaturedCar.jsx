import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";

const getImageUrl = (image) => {
  if (!image)
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000";
  if (image.startsWith("http")) return image;
  return `http://localhost:5000${image}`;
};

const FeaturedCar = ({ car }) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white border border-border shadow-sm min-h-50">
      <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent z-10" />
      <img
        src={getImageUrl(car?.images?.[0])}
        alt={car?.name || "Premium Car"}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 p-8 md:p-10 max-w-xl space-y-4">
        <span className="inline-flex items-center px-2.5 py-1 bg-primary/20 text-white border border-primary/30 rounded text-xs font-bold uppercase tracking-widest">
          {car ? "Featured Vehicle" : "New Season"}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
          {car ? car.name : "The Future of Performance"}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          {car
            ? car.description || `${car.brand} ${car.model}`
            : "Discover premium engineering and modern comfort."}
        </p>
        <NavLink to="/admin/cars">
          <Button className="shadow-xl shadow-primary/20">
            View Fleet <ArrowRight size={16} className="ml-1" />
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default FeaturedCar;
