import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Car, Shield, DollarSign, CreditCard, CircleAlert, Info } from "lucide-react";
import useBookingStore from "../../store/zustand/Bookings";

const statusConfig = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  Confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Confirmed" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Cancelled" },
};

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `http://localhost:5000${image}`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const BookingHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, loading } = useBookingStore();
  const fetchAllBookings = useBookingStore((state) => state.fetchAllBookings);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const found = bookings.find((b) => b._id === id);
    if (found) {
      setBooking(found);
    } else {
      fetchAllBookings().then((all) => {
        const match = all.find((b) => b._id === id);
        if (match) setBooking(match);
      });
    }
  }, [id, bookings, fetchAllBookings]);

  if (loading && !booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-text-dim font-bold animate-pulse">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <CircleAlert size={48} className="text-text-dim mb-4" />
        <h2 className="text-2xl font-bold text-text-main mb-2">Booking Not Found</h2>
        <p className="text-text-dim mb-6">The booking you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/admin/bookings")} className="btn-primary px-8 py-3 font-black text-sm uppercase tracking-widest rounded">
          Back to Bookings
        </button>
      </div>
    );
  }

  const statusStyle = statusConfig[booking.status] || statusConfig.Pending;
  const carImg = getImageUrl(booking.carId?.images?.[0]);

  const DetailRow = ({ label, value }) => (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="py-4 pr-8 w-48">
        <p className="text-[10px] uppercase font-black tracking-widest text-text-dim">{label}</p>
      </td>
      <td className="py-4">
        <p className="text-sm font-semibold text-text-main">{value}</p>
      </td>
    </tr>
  );

  return (
    <div className="space-y-8 pb-20">
      <button
        onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-2 text-sm font-black text-text-dim hover:text-primary transition-colors uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Bookings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden rounded">
            <div className="h-56 bg-bg-dark relative overflow-hidden">
              {carImg ? (
                <img src={carImg} alt={booking.carId?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car size={48} className="text-text-dim/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {booking.carId?.brand || "Premium"}
                </p>
                <h3 className="text-xl font-black">{booking.carId?.name || "Vehicle"}</h3>
                <p className="text-sm text-white/70">{booking.carId?.model || ""}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-text-dim">Booking ID</span>
                <span className="text-xs font-mono font-bold text-text-dim bg-bg-dark px-2 py-1 rounded">
                  {booking._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-text-dim">Customer</span>
                <span className="text-xs font-bold text-text-main">
                  {booking.customerId?.firstName} {booking.customerId?.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-text-dim">Email</span>
                <span className="text-xs font-bold text-text-main">{booking.customerId?.email || "—"}</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black border uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {statusStyle.label}
              </div>
            </div>
          </div>

          {booking.status === "Cancelled" && (
            <div className="rounded border border-red-200 bg-red-50 p-5">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-red-500 mb-2 flex items-center gap-2">
                <Info size={14} /> Cancellation Details
              </h4>
              <p className="text-sm font-semibold text-red-800 mb-1">{booking.cancellationReason || "No reason provided"}</p>
              {booking.refundAmount > 0 && (
                <p className="text-sm text-red-700">
                  Refund Amount: <span className="font-bold">${booking.refundAmount}</span>
                </p>
              )}
              {booking.cancelledAt && (
                <p className="text-xs text-red-600 mt-1">Cancelled on {formatDate(booking.cancelledAt)}</p>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Rental Period
              </h3>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-border/60">
                <DetailRow label="Pickup Date" value={formatDate(booking.pickupDate)} />
                <DetailRow label="Dropoff Date" value={formatDate(booking.dropoffDate)} />
                <DetailRow label="Duration" value={`${booking.numberOfDays} ${booking.numberOfDays === 1 ? "day" : "days"}`} />
              </tbody>
            </table>
          </div>

          <div className="glass-card rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                <DollarSign size={16} className="text-primary" /> Pricing Breakdown
              </h3>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-border/60">
                <DetailRow label="Rent Per Day" value={`$${booking.rentPerDay?.toLocaleString() || "0"}`} />
                <DetailRow label="Total Rent" value={`$${booking.totalRent?.toLocaleString() || "0"}`} />
                <DetailRow label="Security Deposit" value={`$${booking.securityDeposit?.toLocaleString() || "0"}`} />
                <tr className="border-b border-border/60 last:border-b-0">
                  <td className="py-4 pr-8 w-48">
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-main">Total Amount</p>
                  </td>
                  <td className="py-4">
                    <p className="text-lg font-black text-primary">
                      ${((booking.totalRent || 0) + (booking.securityDeposit || 0)).toLocaleString()}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                <CreditCard size={16} className="text-primary" /> Payment Info
              </h3>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-border/60">
                <DetailRow label="Payment Method" value={booking.paymentMethod || "—"} />
                <DetailRow
                  label="Payment Status"
                  value={
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                      booking.paymentStatus === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.paymentStatus === "Failed"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        booking.paymentStatus === "Completed"
                          ? "bg-emerald-500"
                          : booking.paymentStatus === "Failed"
                          ? "bg-red-500"
                          : "bg-amber-500"
                      }`} />
                      {booking.paymentStatus || "Pending"}
                    </span>
                  }
                />
                {booking.specialRequirements && (
                  <DetailRow label="Special Requests" value={booking.specialRequirements} />
                )}
                {booking.adminNotes && (
                  <DetailRow label="Admin Notes" value={booking.adminNotes} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
