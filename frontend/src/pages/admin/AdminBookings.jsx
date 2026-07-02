import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookingStore from '../../store/zustand/Bookings';
import { toast } from 'react-toastify';
import BookingStats from '../../components/admin/BookingStats';
import BookingFilters from '../../components/admin/BookingFilters';
import BookingTable from '../../components/admin/BookingTable';
import RejectBookingModal from '../../components/admin/RejectBookingModal';

const AdminBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useBookingStore();
  const fetchAllBookings = useBookingStore((state) => state.fetchAllBookings);
  const updateBookingStatus = useBookingStore((state) => state.updateBookingStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookingToReject, setBookingToReject] = useState(null);
  const [adminReason, setAdminReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => { fetchAllBookings(); }, [fetchAllBookings]);

  const handleComplete = async (id) => {
    try { await updateBookingStatus({ id, status: 'Completed' }); toast.success("Booking marked as completed!"); }
    catch (err) { toast.error(err || "Failed to update booking"); }
  };

  const handleConfirm = async (id) => {
    try { await updateBookingStatus({ id, status: 'Confirmed' }); toast.success("Booking confirmed!"); }
    catch (err) { toast.error(err || "Failed to confirm booking"); }
  };

  const openRejectModal = (booking) => { setBookingToReject(booking); setAdminReason(''); setReasonError(''); };

  const closeRejectModal = () => { if (loading) return; setBookingToReject(null); setAdminReason(''); setReasonError(''); };

  const handleReject = async () => {
    const reason = adminReason.trim();
    if (!reason) { setReasonError('Please write the cancellation reason.'); return; }
    try {
      const result = await updateBookingStatus({ id: bookingToReject._id, status: 'Cancelled', adminNotes: reason });
      toast.success(result.message || "Booking cancelled"); closeRejectModal();
    } catch (err) { toast.error(err.message || "Failed to cancel booking"); }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || `${b.customerId?.firstName} ${b.customerId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Bookings Review</h1>
          <p className="text-text-dim text-sm mt-1">Review and manage recent customer reservations.</p>
        </div>
      </div>

      <BookingStats totalBookings={totalBookings} pendingBookings={pendingBookings} confirmedBookings={confirmedBookings} completedBookings={completedBookings} totalRevenue={totalRevenue} />
      <BookingFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <BookingTable bookings={filteredBookings} loading={loading} onConfirm={handleConfirm} onComplete={handleComplete} onOpenReject={openRejectModal} onViewDetails={(id) => navigate(`/admin/bookings/${id}`)} filteredCount={filteredBookings.length} totalCount={bookings.length} />
      </div>

      <RejectBookingModal
        isOpen={Boolean(bookingToReject)}
        onClose={closeRejectModal}
        booking={bookingToReject}
        adminReason={adminReason}
        onReasonChange={(val) => { setAdminReason(val); if (reasonError) setReasonError(''); }}
        reasonError={reasonError}
        onSubmit={handleReject}
        loading={loading}
      />
    </div>
  );
};

export default AdminBookings;
