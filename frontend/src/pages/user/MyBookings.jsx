import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Package,
  Shield,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import useBookingStore from "../../store/zustand/Bookings";

Modal.setAppElement("#root");

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useBookingStore();
  const fetchMyBookings = useBookingStore((state) => state.fetchMyBookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const getTotalAmount = (booking) =>
    (booking.totalRent || 0) + (booking.securityDeposit || 0);

  const canCancel = (booking) =>
    !["completed", "cancelled"].includes(booking.status?.toLowerCase());

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setCancellationReason("");
    setReasonError("");
  };

  const closeCancelModal = () => {
    if (loading) return;
    setBookingToCancel(null);
    setCancellationReason("");
    setReasonError("");
  };

  const handleCancel = async () => {
    const reason = cancellationReason.trim();
    if (!reason) {
      setReasonError("Please write a cancellation reason.");
      return;
    }

    try {
      const result = await cancelBooking({
        id: bookingToCancel._id,
        reason,
      });
      toast.success(result.message || "Booking cancelled successfully");
      closeCancelModal();
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

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

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-text-main">
          MY ORDERS
        </h1>
        <p className="text-text-dim mt-1 text-lg">
          Track your luxury vehicle reservations and rental history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-text-dim font-bold animate-pulse">
              Loading your reservations...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-border">
            <div className="w-24 h-24 bg-bg-dark rounded-full flex items-center justify-center mb-8">
              <Package className="text-text-dim" size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-text-main">
              No Bookings Found
            </h3>
            <p className="text-text-dim max-w-sm text-lg leading-relaxed mb-8">
              You haven't made any reservations yet. Ready to experience the
              ultimate drive?
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-10 py-4 font-black text-sm uppercase tracking-widest rounded shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Explore Our Fleet
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="glass-card group hover:border-primary/50 transition-all duration-300 p-0 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Left: Car Image & Info */}
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

                {/* Right: Booking Details */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Period & Time */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded text-primary border border-primary/20">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">
                            Rental Period
                          </p>
                          <p className="text-lg font-bold text-text-main">
                            {new Date(booking.pickupDate).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(booking.dropoffDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-bg-dark rounded text-text-dim border border-border">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">
                            Security Deposit
                          </p>
                          <p className="text-lg font-bold text-text-main">
                            ${booking.securityDeposit || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-bg-dark rounded text-text-dim border border-border">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">
                            Booking Status
                          </p>
                          <div
                            className={`mt-1 inline-flex items-center px-4 py-1.5 rounded text-xs font-black border uppercase tracking-widest ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </div>
                      {booking.status === "Cancelled" && (
                        <div className="rounded border border-red-100 bg-red-50 px-4 py-3 text-sm">
                          <p className="text-[10px] uppercase font-black text-red-500 tracking-widest mb-1">
                            Cancellation
                          </p>
                          <p className="font-semibold text-red-800">
                            {booking.cancellationReason || "No reason provided"}
                          </p>
                          <p className="mt-1 text-red-700">
                            Refund: ${booking.refundAmount || 0}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">
                          Days
                        </p>
                        <p className="text-xl font-black text-text-main">
                          {booking.numberOfDays}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">
                          Total Amount
                        </p>
                        <p className="text-3xl font-black text-primary">
                          ${getTotalAmount(booking)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {canCancel(booking) && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 rounded border border-red-200 bg-red-50 text-sm font-black text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors uppercase tracking-widest"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}
                      <button className="flex items-center gap-2 text-sm font-black text-primary hover:text-emerald-600 transition-colors group/btn uppercase tracking-widest">
                        Reservation Details{" "}
                        <ChevronRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={Boolean(bookingToCancel)}
        onRequestClose={closeCancelModal}
        className="w-[min(92vw,520px)] rounded-lg bg-white border border-border shadow-2xl outline-none"
        overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-red-50 text-red-600 border border-red-100">
              <XCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text-main">
                Cancel Booking
              </h2>
              <p className="mt-1 text-sm text-text-dim">
                {bookingToCancel?.carId?.name || "Vehicle"} from{" "}
                {bookingToCancel
                  ? new Date(bookingToCancel.pickupDate).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-text-dim">
              Cancellation Reason
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => {
                setCancellationReason(e.target.value);
                if (reasonError) setReasonError("");
              }}
              rows={4}
              className="w-full resize-none rounded border border-border bg-bg-dark px-4 py-3 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Write the reason for cancelling this booking..."
            />
            {reasonError && (
              <p className="text-sm font-semibold text-red-600">
                {reasonError}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={closeCancelModal}
              disabled={loading}
              className="px-5 py-2.5 rounded border border-border text-sm font-black uppercase tracking-widest text-text-dim hover:text-text-main disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2.5 rounded bg-red-600 text-sm font-black uppercase tracking-widest text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
