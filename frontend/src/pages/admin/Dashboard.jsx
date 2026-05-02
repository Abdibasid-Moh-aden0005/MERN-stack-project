import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Car, 
  Plus, 
  Bell, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { fetchCars } from '../../store/slices/carSlice';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { cars, loading } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const stats = [
    { label: 'Total Revenue', value: '$24,450.00', trend: '+12.5%', icon: DollarSign, color: 'bg-primary' },
    { label: 'Active Bookings', value: '145', trend: '+5.2%', icon: ShoppingCart, color: 'bg-primary' },
    { label: 'New Customers', value: '328', trend: '+8.1%', icon: Users, color: 'bg-primary' },
    { label: 'Fleet Level', value: cars.length.toString(), trend: '-2.4%', icon: Car, color: 'bg-primary' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-text-dim mt-1">Welcome back, Administrator.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-bg-card border border-white/10 rounded-full text-text-dim hover:text-white transition-all">
            <Bell size={20} />
          </button>
          <Button icon={Plus}>New Product</Button>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-bg-card to-slate-900 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Car" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="relative z-20 p-12 md:p-16 max-w-2xl space-y-6">
          <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest">
            New Season
          </span>
          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            The Future of <span className="text-primary">Performance</span>
          </h2>
          <p className="text-lg text-text-dim leading-relaxed">
            Discover the new Autumn Collection 2024. Premium engineering, timeless style, and modern comfort.
          </p>
          <Button variant="primary" className="rounded-full px-8 py-4 text-lg group">
            View Campaign <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card hover:bg-bg-card/80 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl ${stat.color}/20 text-primary group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-text-dim text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">Trending Fleet</h2>
          <button className="text-primary hover:underline flex items-center gap-1 text-sm font-semibold">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Porsche 911 GT3', category: 'Supercar', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800' },
            { name: 'Mercedes-AMG GT', category: 'Sport', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800' },
            { name: 'BMW M4 Competition', category: 'Coupe', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800' },
          ].map((car, index) => (
            <div key={index} className="relative group overflow-hidden rounded-[2rem] aspect-[4/5] bg-bg-card">
              <img 
                src={car.img} 
                alt={car.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 space-y-1">
                <p className="text-primary text-xs font-bold uppercase tracking-widest">{car.category}</p>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{car.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
