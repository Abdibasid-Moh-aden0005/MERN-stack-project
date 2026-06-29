import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import useBookingStore from "../../store/zustand/Bookings";
import BookingCard from "../../components/customer/BookingCard";
import CancelBookingModal from "../../components/customer/CancelBookingModal";

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useBookingStore();
  const fetchMyBookings = useBookingStore((state) => state.fetchMyBookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => { fetchMyBookings(); }, [fetchMyBookings]);

  const openCancelModal = (booking) => { setBookingToCancel(booking); setCancellationReason(""); setReasonError(""); };

  const closeCancelModal = () => { if (loading) return; setBookingToCancel(null); setCancellationReason(""); setReasonError(""); };

  const handleCancel = async () => {
    const reason = cancellationReason.trim();
    if (!reason) { setReasonError("Please write a cancellation reason."); return; }
    try { const result = await cancelBooking({ id: bookingToCancel._id, reason }); toast.success(result.message || "Booking cancelled successfully"); closeCancelModal(); }
    catch (err) { toast.error(err.message || "Failed to cancel booking"); }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-text-main">MY ORDERS</h1>
        <p className="text-text-dim mt-1 text-lg">Track your luxury vehicle reservations and rental history.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-text-dim font-bold animate-pulse">Loading your reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-border">
            <div className="w-24 h-24 bg-bg-dark rounded-full flex items-center justify-center mb-8">
              <Package className="text-text-dim" size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-text-main">No Bookings Found</h3>
            <p className="text-text-dim max-w-sm text-lg leading-relaxed mb-8">You haven't made any reservations yet. Ready to experience the ultimate drive?</p>
            <button onClick={() => navigate("/")} className="btn-primary px-10 py-4 font-black text-sm uppercase tracking-widest rounded shadow-xl shadow-primary/20 hover:scale-105 transition-all">Explore Our Fleet</button>
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} loading={loading} onOpenCancel={openCancelModal} />
          ))
        )}
      </div>

      <CancelBookingModal
        isOpen={Boolean(bookingToCancel)}
        onClose={closeCancelModal}
        booking={bookingToCancel}
        reason={cancellationReason}
        onReasonChange={(val) => { setCancellationReason(val); if (reasonError) setReasonError(""); }}
        reasonError={reasonError}
        onSubmit={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default MyBookings;
