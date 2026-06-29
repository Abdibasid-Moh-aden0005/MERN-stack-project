import { useNavigate } from "react-router-dom";
import { Calendar, Shield, CheckCircle, ChevronRight, XCircle } from "lucide-react";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "text-green-700 bg-green-100 border-green-200";
    case "completed":
      return "text-blue-700 bg-blue-100 border-blue-200";
    case "pending":
      return "text-amber-700 bg-amber-100 border-amber-200";
    case "cancelled":
      return "text-red-700 bg-red-100 border-red-200";
    default:
      return "text-text-dim bg-bg-dark border-border";
  }
};

const getTotalAmount = (booking) =>
  (booking.totalRent || 0) + (booking.securityDeposit || 0);

const canCancel = (booking) =>
  !["completed", "cancelled"].includes(booking.status?.toLowerCase());

const BookingCard = ({ booking, loading, onOpenCancel }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card group hover:border-primary/50 transition-all duration-300 p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="lg:w-1/3 relative overflow-hidden">
          <div className="h-full min-h-62.5 relative">
            <img
              src={
                booking.carId?.images?.[0]
                  ? booking.carId.images[0].startsWith("http")
                    ? booking.carId.images[0]
                    : `http://localhost:5000${booking.carId.images[0]}`
                  : "https://via.placeholder.com/800x600?text=Luxury+Car"
              }
              alt={booking.carId?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                {booking.carId?.brand || "Premium"}
              </p>
              <h3 className="text-2xl font-black">
                {booking.carId?.name || "Vehicle"}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary border border-primary/20">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Rental Period</p>
                  <p className="text-lg font-bold text-text-main">
                    {new Date(booking.pickupDate).toLocaleDateString()} -{" "}
                    {new Date(booking.dropoffDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-bg-dark rounded text-text-dim border border-border">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Security Deposit</p>
                  <p className="text-lg font-bold text-text-main">${booking.securityDeposit || 0}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-bg-dark rounded text-text-dim border border-border">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Booking Status</p>
                  <div className={`mt-1 inline-flex items-center px-4 py-1.5 rounded text-xs font-black border uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
              </div>
              {booking.status === "Cancelled" && (
                <div className="rounded border border-red-100 bg-red-50 px-4 py-3 text-sm">
                  <p className="text-[10px] uppercase font-black text-red-500 tracking-widest mb-1">Cancellation</p>
                  <p className="font-semibold text-red-800">{booking.cancellationReason || "No reason provided"}</p>
                  <p className="mt-1 text-red-700">Refund: ${booking.refundAmount || 0}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Days</p>
                <p className="text-xl font-black text-text-main">{booking.numberOfDays}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Total Amount</p>
                <p className="text-3xl font-black text-primary">${getTotalAmount(booking)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {canCancel(booking) && (
                <button
                  onClick={() => onOpenCancel(booking)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded border border-red-200 bg-red-50 text-sm font-black text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors uppercase tracking-widest"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              )}
              <button className="flex items-center gap-2 text-sm font-black text-primary hover:text-emerald-600 transition-colors group/btn uppercase tracking-widest">
                Reservation Details{" "}
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
