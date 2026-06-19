import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import {
  CheckCircle,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import useBookingStore from '../../store/zustand/Bookings';
import { toast } from 'react-toastify';

Modal.setAppElement("#root");

const statusConfig = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `http://localhost:5000${image}`;
};

const AdminBookings = () => {
  const { bookings, loading } = useBookingStore();
  const fetchAllBookings = useBookingStore((state) => state.fetchAllBookings);
  const updateBookingStatus = useBookingStore((state) => state.updateBookingStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookingToReject, setBookingToReject] = useState(null);
  const [adminReason, setAdminReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleComplete = async (id) => {
    try {
      await updateBookingStatus({ id, status: 'Completed' });
      toast.success("Booking marked as completed!");
    } catch (err) {
      toast.error(err || "Failed to update booking");
    }
  };

  const handleConfirm = async (id) => {
    try {
      await updateBookingStatus({ id, status: 'Confirmed' });
      toast.success("Booking confirmed!");
    } catch (err) {
      toast.error(err || "Failed to confirm booking");
    }
  };

  const openRejectModal = (booking) => {
    setBookingToReject(booking);
    setAdminReason('');
    setReasonError('');
  };

  const closeRejectModal = () => {
    if (loading) return;
    setBookingToReject(null);
    setAdminReason('');
    setReasonError('');
  };

  const handleReject = async () => {
    const reason = adminReason.trim();
    if (!reason) {
      setReasonError('Please write the cancellation reason.');
      return;
    }

    try {
      const result = await updateBookingStatus({
        id: bookingToReject._id,
        status: 'Cancelled',
        adminNotes: reason,
      });
      toast.success(result.message || "Booking cancelled");
      closeRejectModal();
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${b.customerId?.firstName} ${b.customerId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length;
  const getTotalAmount = (booking) => (booking.totalRent || 0) + (booking.securityDeposit || 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + getTotalAmount(b), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Bookings Review</h1>
          <p className="text-text-dim text-sm mt-1">Review and manage recent customer reservations.</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main shadow-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Total Bookings</span>
            <Receipt size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-main">{totalBookings}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-text-dim font-medium">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>All reservations</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Pending</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{pendingBookings}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-medium">
            <span>Awaiting review</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Confirmed</span>
            <CheckCircle size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{confirmedBookings}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
            <span>Active rentals</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Completed</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{completedBookings}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <span>Successfully finished</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Total Revenue</span>
            <DollarSign size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">${totalRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} />
            <span>From all bookings</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-text-dim">Active Order Queue</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Car Model</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Rental Dates</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Total Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    <p className="mt-3 text-text-dim text-sm font-medium">Loading bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-text-dim">
                    <Receipt size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-base font-semibold">No bookings found</p>
                    <p className="text-sm mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusStyle = statusConfig[booking.status] || statusConfig.Pending;
                  const customerName = `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'Unknown';
                  const initials = (booking.customerId?.firstName?.[0] || 'U') + (booking.customerId?.lastName?.[0] || '');
                  const carImg = getImageUrl(booking.carId?.images?.[0]);

                  return (
                    <tr key={booking._id} className="hover:bg-bg-dark/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-text-main">{customerName}</p>
                            <p className="text-xs text-text-dim">{booking.customerId?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {carImg && (
                            <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 border border-border shrink-0">
                              <img src={carImg} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm text-text-main">{booking.carId?.name || 'Vehicle'}</p>
                            <p className="text-xs text-text-dim">{booking.carId?.brand || ''} {booking.carId?.model || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-main font-medium">
                          {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.dropoffDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-text-dim">
                          {booking.numberOfDays} {booking.numberOfDays === 1 ? 'day' : 'days'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-main">${getTotalAmount(booking).toLocaleString()}</span>
                        <div className="text-xs text-text-dim">
                          Rent ${booking.totalRent?.toLocaleString() || '0'} + Deposit ${booking.securityDeposit?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {booking.status || 'Pending'}
                        </div>
                        {booking.status === 'Cancelled' && booking.cancellationReason && (
                          <p className="mt-1 max-w-48 text-xs text-red-600 truncate" title={booking.cancellationReason}>
                            {booking.cancellationReason}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'Pending' ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleConfirm(booking._id)}
                              className="p-2 hover:bg-emerald-50 text-text-dim hover:text-emerald-600 rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() => openRejectModal(booking)}
                              className="p-2 hover:bg-red-50 text-text-dim hover:text-red-500 rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : booking.status === 'Confirmed' ? (
                          <button
                            onClick={() => handleComplete(booking._id)}
                            className="p-2 hover:bg-emerald-50 text-text-dim hover:text-emerald-600 rounded-lg transition-all"
                            title="Mark Completed"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        ) : (
                          <span className="text-xs text-text-dim">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
          <p className="text-sm text-text-dim">
            Showing <span className="font-semibold text-text-main">{filteredBookings.length}</span> of{" "}
            <span className="font-semibold text-text-main">{bookings.length}</span> bookings
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">Next</button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(bookingToReject)}
        onRequestClose={closeRejectModal}
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
                Cancel Customer Booking
              </h2>
              <p className="mt-1 text-sm text-text-dim">
                {bookingToReject?.customerId?.firstName || "Customer"} -{" "}
                {bookingToReject?.carId?.name || "Vehicle"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-text-dim">
              Reason Shown To Customer
            </label>
            <textarea
              value={adminReason}
              onChange={(e) => {
                setAdminReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              rows={4}
              className="w-full resize-none rounded border border-border bg-bg-dark px-4 py-3 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Explain why this booking is being cancelled..."
            />
            {reasonError && (
              <p className="text-sm font-semibold text-red-600">
                {reasonError}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={closeRejectModal}
              disabled={loading}
              className="px-5 py-2.5 rounded border border-border text-sm font-black uppercase tracking-widest text-text-dim hover:text-text-main disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="px-5 py-2.5 rounded bg-red-600 text-sm font-black uppercase tracking-widest text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
