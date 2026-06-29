import { Lock, Key } from "lucide-react";
import Button from "../common/Button";

const PasswordForm = ({ passwordData, onChange, onSubmit, status }) => {
  return (
    <div className="glass-card p-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
          <Lock size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black capitalize tracking-tighter text-text-main">Change Password</h2>
          <p className="text-[10px] text-text-dim uppercase tracking-[0.3em] font-black">Credential Management</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Current Password</label>
          <div className="relative">
            <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={onChange} required className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-text-main font-bold" />
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">New Password</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={onChange} required className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-text-main font-bold" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={onChange} required className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-text-main font-bold" />
          </div>
        </div>

        <div className="pt-4">
          <Button variant="secondary" loading={status === "loading"} className="w-full bg-black py-5 rounded font-black uppercase tracking-[0.2em] border-orange-500/30 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
