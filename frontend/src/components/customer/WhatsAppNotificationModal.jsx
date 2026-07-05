import Modal from "react-modal";
import { MessageCircle, X } from "lucide-react";

const WhatsAppNotificationModal = ({ isOpen, onClose, userName, phoneNumber, onNavigate }) => {
  const formatPhone = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("252")) return `+252 ${phone.slice(3)}`;
    return phone;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[min(92vw,480px)] rounded-lg bg-white border border-border shadow-2xl outline-none"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-dim hover:text-text-main transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
            <MessageCircle size={32} className="text-emerald-600" />
          </div>

          <h2 className="text-xl font-black text-text-main">Booking Confirmed!</h2>

          <p className="mt-3 text-sm text-text-dim leading-relaxed max-w-sm">
            Hey <strong className="text-text-main">{userName}</strong>, a confirmation message has been sent to your WhatsApp number{" "}
            <strong className="text-text-main">{formatPhone(phoneNumber)}</strong>.
          </p>

          <p className="mt-2 text-xs text-text-dim">
            Please check your messages. If you don't see it within a few minutes, contact our support team.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded border border-border text-sm font-black uppercase tracking-widest text-text-dim hover:text-text-main"
          >
            Close
          </button>
          <button
            onClick={onNavigate}
            className="px-5 py-2.5 rounded bg-primary text-sm font-black uppercase tracking-widest text-white hover:bg-primary/90"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppNotificationModal;
