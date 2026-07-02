import { ArrowRight } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-bg-sidebar">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
          alt="Hero Car"
          className="w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg-sidebar/90 via-bg-sidebar/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-360">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <span className="px-4 py-1.5 bg-primary/20 text-white border border-primary/30 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            Classic Rental Car
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white">
            DRIVE THE <br />
            <span className="text-primary italic">FUTURE</span> TODAY
          </h1>
          <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
            Experience the pinnacle of luxury and performance with our exclusive
            fleet of world-class vehicles.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/">
              <Button className="btn-primary px-10 py-5 text-lg rounded shadow-2xl shadow-primary/30 group">
                Explore Fleet{" "}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
