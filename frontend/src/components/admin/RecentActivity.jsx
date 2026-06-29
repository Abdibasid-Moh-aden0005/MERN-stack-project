const RecentActivity = ({ bookings }) => {
  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {bookings.slice(0, 4).map((booking, idx) => (
          <div
            key={booking._id || idx}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-dark transition-all"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                booking.status === "Completed"
                  ? "bg-emerald-500"
                  : booking.status === "Confirmed"
                    ? "bg-blue-500"
                    : booking.status === "Pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main truncate">
                {booking.customerId?.firstName || "Customer"} booked{" "}
                {booking.carId?.name || "a vehicle"}
              </p>
              <p className="text-xs text-text-dim">
                {new Date(booking.createdAt).toLocaleDateString()} &bull; $
                {booking.totalRent}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                booking.status === "Completed"
                  ? "bg-emerald-50 text-emerald-700"
                  : booking.status === "Confirmed"
                    ? "bg-blue-50 text-blue-700"
                    : booking.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
              }`}
            >
              {booking.status}
            </span>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-sm text-text-dim text-center py-6">
            No recent bookings
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
