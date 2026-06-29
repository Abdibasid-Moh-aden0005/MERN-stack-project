import Modal from "react-modal";
import { X, User as UserIcon, Lock, Shield, CreditCard, MapPin, Save } from "lucide-react";
import Button from "../common/Button";

const CustomerFormModal = ({
  isOpen,
  onClose,
  selectedUser,
  formData,
  onChange,
  onSubmit,
  status,
}) => {
  const loading = status === "loading";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={selectedUser ? "Edit User" : "Add User"}
      className="relative w-full max-w-2xl bg-white border border-border rounded shadow-2xl flex flex-col overflow-hidden outline-none mx-4"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-bg-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text-main">
              {selectedUser ? "Edit User Profile" : "Add New Member"}
            </h2>
            <p className="text-[10px] text-text-dim uppercase tracking-widest font-semibold">Administrative Control</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 max-h-[70vh]">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">First Name</label>
            <input required name="firstName" value={formData.firstName} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Last Name</label>
            <input required name="lastName" value={formData.lastName} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={onChange} disabled={!!selectedUser} className={`w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main ${selectedUser ? "opacity-50 cursor-not-allowed" : ""}`} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Phone Number</label>
            <input required name="phone" value={formData.phone} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
            <Lock size={12} className="text-primary" /> {selectedUser ? "Reset Password (Optional)" : "Secure Password"}
          </label>
          <input required={!selectedUser} type="password" name="password" placeholder={selectedUser ? "Leave blank to keep current" : "Enter strong password"} value={formData.password} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
        </div>
        <div className="grid grid-cols-2 gap-5 p-5 bg-primary/5 rounded-lg border border-primary/10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
              <Shield size={12} className="text-primary" /> Role Assignment
            </label>
            <select name="role" value={formData.role} onChange={onChange} className="w-full bg-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none shadow-sm">
              <option value="customer">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex items-center gap-4 h-full pt-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={onChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after-left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              <span className="ml-3 text-xs font-bold text-text-main uppercase tracking-widest">Active Status</span>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Identity & License</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">License Number</label>
              <input name="licenseNumber" value={formData.licenseNumber} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Expiry Date</label>
              <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Location Details</h3>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Residential Address</label>
            <textarea name="address" value={formData.address} onChange={onChange} rows="2" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">City</label>
              <input name="city" value={formData.city} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">State</label>
              <input name="state" value={formData.state} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Zip Code</label>
              <input name="zipCode" value={formData.zipCode} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
          </div>
        </div>
      </form>

      <div className="px-8 py-4 border-t border-border bg-bg-dark flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2.5 text-text-dim font-bold uppercase tracking-widest text-xs hover:text-text-main transition-all">
          Cancel
        </button>
        <Button onClick={onSubmit} loading={loading} icon={Save} className="shadow-lg shadow-primary/30">
          {selectedUser ? "Save Changes" : "Create Member"}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomerFormModal;
