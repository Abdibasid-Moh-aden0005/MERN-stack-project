import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchAllBookings, updateBookingStatus } from '../../store/slices/bookingSlice';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const BookingList = ({ bookings, type, onComplete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-white/5">
        <AlertCircle className="text-text-dim mb-4" size={40} />
        <h3 className="text-lg font-bold">No {type} bookings found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking._id} className="glass-card hover:bg-bg-card/80 transition-all group p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-48 aspect-video rounded-xl overflow-hidden bg-slate-800">
              <img 
                src={booking.carId?.images?.[0] || 'https://via.placeholder.com/300x200'} 
                alt="Car" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-text-dim tracking-widest">Car & Customer</p>
                <h4 className="font-bold text-white">{booking.carId?.name || 'Vehicle'}</h4>
                <div className="flex items-center gap-2 text-xs text-text-dim">
                  <User size={12} />
                  <span>{booking.customerId?.firstName} {booking.customerId?.lastName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-text-dim tracking-widest">Dates & Duration</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.dropoffDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-text-dim">{booking.numberOfDays} Days • {booking.pickupTime}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-text-dim tracking-widest">Payment Status</p>
                <p className="text-xl font-black text-primary">${booking.totalRent}</p>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  booking.paymentStatus === 'Completed' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                }`}>
                  {booking.paymentStatus}
                </div>
              </div>
            </div>

            {type === 'pending' && (
              <div className="w-full lg:w-auto">
                <Button 
                  onClick={() => onComplete(booking._id)}
                  icon={CheckCircle2}
                  className="w-full lg:w-auto px-6 py-3 text-xs bg-green-600 hover:bg-green-500"
                >
                  Mark Completed
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleComplete = async (id) => {
    try {
      await dispatch(updateBookingStatus({ id, status: 'Completed' })).unwrap();
      toast.success("Booking marked as completed!");
    } catch (err) {
      toast.error(err || "Failed to update booking");
    }
  };

  const pendingBookings = bookings.filter(b => 
    b.status?.toLowerCase() !== 'completed' && b.status?.toLowerCase() !== 'cancelled'
  ).filter(b => 
    b.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedBookings = bookings.filter(b => 
    b.status?.toLowerCase() === 'completed'
  ).filter(b => 
    b.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">BOOKING MANAGEMENT</h1>
          <p className="text-text-dim mt-1">Review and verify vehicle reservations.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-card border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-[2rem] w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'pending' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-dim hover:text-white'
          }`}
        >
          Pending Orders ({pendingBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'completed' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-dim hover:text-white'
          }`}
        >
          Completed ({completedBookings.length})
        </button>
      </div>

      {activeTab === 'pending' ? (
        <BookingList 
          bookings={pendingBookings} 
          type="pending" 
          onComplete={handleComplete} 
          loading={loading}
        />
      ) : (
        <BookingList 
          bookings={completedBookings} 
          type="completed" 
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminBookings;
