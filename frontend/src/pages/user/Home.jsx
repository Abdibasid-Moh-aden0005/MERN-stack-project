import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCars } from '../../store/slices/carSlice';
import { useAuth } from '../../context/AuthContext';
import CarCard from '../../components/cars/CarCard';
import { Search, Filter, ArrowRight, Car } from 'lucide-react';
import Button from '../../components/common/Button';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, loading } = useSelector((state) => state.cars);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleBookNow = (car) => {
    if (!isAuthenticated) {
      toast.info("Login first to book a car", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      // Redirect to login and save current location
      navigate('/login', { state: { from: location } });
    } else {
      navigate(`/cars/${car._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Car" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-b from-bg-dark/20 via-bg-dark/60 to-bg-dark" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Car Rental
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
              DRIVE THE <br />
              <span className="text-primary italic">FUTURE</span> TODAY
            </h1>
            <p className="text-xl text-text-dim max-w-xl leading-relaxed">
              Experience the pinnacle of luxury and performance with our exclusive fleet of world-class vehicles.
            </p>
            <div className="flex gap-4 pt-4">
              <Button className="px-10 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/30 group">
                Explore Fleet <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by car name or brand..."
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/5 rounded-xl text-text-dim hover:text-white transition-all">
              <Filter size={20} />
              <span className="font-bold">Filters</span>
            </button>
            <Button className="flex-1 md:flex-none px-8 py-4 rounded-xl">Search</Button>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <section className="container mx-auto px-6 mt-24 space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight">OUR EXCLUSIVE FLEET</h2>
            <p className="text-text-dim mt-2">Handpicked selection for the ultimate driving experience.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-text-dim font-bold text-sm">
            <span>Total Cars:</span>
            <span className="text-primary">{cars.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card aspect-16/14 animate-pulse bg-white/5 rounded-[2.5rem]" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
               <Car className="text-text-dim" size={40} />
             </div>
             <h3 className="text-xl font-bold mb-2">No cars available</h3>
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
      <section className="container mx-auto px-6 mt-32">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-24 text-center space-y-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <h2 className="text-4xl md:text-6xl font-black text-white relative z-10 leading-tight">
            READY TO START <br /> YOUR JOURNEY?
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto relative z-10">
            Join thousands of satisfied drivers and experience the best luxury car rental service in the world.
          </p>
          <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
            >
              Sign Up Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
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
