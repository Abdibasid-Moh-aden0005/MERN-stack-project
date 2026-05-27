import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCarStore from '../../store/zustand/cars';
import useAuthStore from '../../store/zustand/auth';
import CarCard from '../../components/cars/CarCard';
import { Search, Filter, ArrowRight, Car } from 'lucide-react';
import Button from '../../components/common/Button';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, loading } = useCarStore();
  const { isAuthenticated } = useAuthStore();
  const fetchCars = useCarStore((state) => state.fetchCars);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleBookNow = (car) => {
    if (!isAuthenticated) {
      toast.info("Login first to book a car", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate('/login', { state: { from: location } });
    } else {
      navigate(`/cars/${car._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-bg-sidebar">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Car" 
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-sidebar/90 via-bg-sidebar/50 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-[1440px]">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <span className="px-4 py-1.5 bg-primary/20 text-white border border-primary/30 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              Premium Car Rental
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white">
              DRIVE THE <br />
              <span className="text-primary italic">FUTURE</span> TODAY
            </h1>
            <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
              Experience the pinnacle of luxury and performance with our exclusive fleet of world-class vehicles.
            </p>
            <div className="flex gap-4 pt-4">
              <Button className="btn-primary px-10 py-5 text-lg rounded shadow-2xl shadow-primary/30 group">
                Explore Fleet <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20 max-w-[1440px]">
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
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
            <Button className="btn-primary flex-1 md:flex-none px-8 h-12 rounded">Search</Button>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
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
              <CarCard 
                key={car._id} 
                car={car} 
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mt-32 max-w-[1440px]">
        <div className="relative rounded bg-bg-sidebar p-12 md:p-24 text-center space-y-8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-3xl md:text-5xl font-black text-white relative z-10 leading-tight">
            READY TO START <br /> YOUR JOURNEY?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto relative z-10">
            Join thousands of satisfied drivers and experience the best luxury car rental service in the world.
          </p>
          <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary px-10 py-4 text-base shadow-lg shadow-primary/20"
            >
              Sign Up Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white text-bg-sidebar rounded font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Member Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
