import Modal from "react-modal";
import { XCircle } from "lucide-react";

const RejectBookingModal = ({
  isOpen,
  onClose,
  booking,
  adminReason,
  onReasonChange,
  reasonError,
  onSubmit,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
              {booking?.customerId?.firstName || "Customer"} -{" "}
              {booking?.carId?.name || "Vehicle"}
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
              onReasonChange(e.target.value);
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
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded border border-border text-sm font-black uppercase tracking-widest text-text-dim hover:text-text-main disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded bg-red-600 text-sm font-black uppercase tracking-widest text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectBookingModal;
