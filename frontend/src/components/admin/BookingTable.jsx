import { CheckCircle2, XCircle, Receipt, FileText } from "lucide-react";

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

const getTotalAmount = (booking) => (booking.totalRent || 0) + (booking.securityDeposit || 0);

const BookingTable = ({ bookings, loading, onConfirm, onComplete, onOpenReject, onViewDetails, filteredCount, totalCount }) => {
  if (loading) {
    return (
      <div className="px-6 py-20 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-3 text-text-dim text-sm font-medium">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="px-6 py-20 text-center text-text-dim">
        <Receipt size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-base font-semibold">No bookings found</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
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
            {bookings.map((booking) => {
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
                          onClick={() => onConfirm(booking._id)}
                          className="p-2 hover:bg-emerald-50 text-text-dim hover:text-emerald-600 rounded-lg transition-all"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => onOpenReject(booking)}
                          className="p-2 hover:bg-red-50 text-text-dim hover:text-red-500 rounded-lg transition-all"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : booking.status === 'Confirmed' ? (
                      <button
                        onClick={() => onComplete(booking._id)}
                        className="p-2 hover:bg-emerald-50 text-text-dim hover:text-emerald-600 rounded-lg transition-all"
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    ) : null}
                    <button
                      onClick={() => onViewDetails(booking._id)}
                      className="p-2 hover:bg-blue-50 text-text-dim hover:text-blue-600 rounded-lg transition-all"
                      title="View Reports"
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
        <p className="text-sm text-text-dim">
          Showing <span className="font-semibold text-text-main">{filteredCount}</span> of{" "}
          <span className="font-semibold text-text-main">{totalCount}</span> bookings
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm" disabled>Previous</button>
          <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">Next</button>
        </div>
      </div>
    </>
  );
};

export default BookingTable;
