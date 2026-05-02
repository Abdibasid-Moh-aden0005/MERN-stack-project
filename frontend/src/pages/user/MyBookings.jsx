import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChevronRight,
  Package,
  Car
} from 'lucide-react';
import { fetchMyBookings } from '../../store/slices/bookingSlice';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-text-dim bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">MY ORDERS</h1>
        <p className="text-text-dim mt-1 text-lg">Track your luxury vehicle reservations and rental history.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-text-dim font-bold animate-pulse">Loading your reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <Package className="text-text-dim" size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Bookings Found</h3>
            <p className="text-text-dim max-w-sm text-lg leading-relaxed mb-8">
              You haven't made any reservations yet. Ready to experience the ultimate drive?
            </p>
            <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Explore Our Fleet
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="glass-card group hover:bg-bg-card/80 transition-all duration-500 border-white/5 hover:border-primary/20 p-0 overflow-hidden">
              <div className="flex flex-col lg:flex-row h-full">
                {/* Left: Car Image & Info */}
                <div className="lg:w-1/3 relative group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="h-full min-h-[250px] overflow-hidden">
                    <img 
                      src={booking.carId?.images?.[0] || 'https://via.placeholder.com/800x600?text=Luxury+Car'} 
                      alt={booking.carId?.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:bg-gradient-to-t" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                        {booking.carId?.brand || 'Premium'}
                      </p>
                      <h3 className="text-2xl font-black">{booking.carId?.name || 'Vehicle'}</h3>
                    </div>
                  </div>
                </div>

                {/* Right: Booking Details */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Period & Time */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Rental Period</p>
                          <p className="text-lg font-bold text-white">
                            {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.dropoffDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-text-dim border border-white/10">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Scheduled Time</p>
                          <p className="text-lg font-bold text-white">{booking.pickupTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Location & Status */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-text-dim border border-white/10">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Pickup Location</p>
                          <p className="text-lg font-bold text-white truncate max-w-[200px]">{booking.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-text-dim border border-white/10">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Booking Status</p>
                          <div className={`mt-1 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                       <div>
                        <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Days</p>
                        <p className="text-xl font-black text-white">{booking.numberOfDays}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Total Paid</p>
                        <p className="text-3xl font-black text-primary">${booking.totalRent}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black text-text-dim hover:text-primary transition-colors group/btn uppercase tracking-widest">
                      Reservation Details <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
