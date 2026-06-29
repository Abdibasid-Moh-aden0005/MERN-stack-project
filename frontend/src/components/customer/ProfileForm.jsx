import { User as UserIcon, MapPin, Phone, Mail, Save } from "lucide-react";
import Button from "../common/Button";

const ProfileForm = ({ profileData, onChange, onSubmit, status }) => {
  return (
    <div className="glass-card p-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <UserIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-text-main">Profile Details</h2>
          <p className="text-[10px] text-text-dim uppercase tracking-[0.3em] font-black">Personal Vault Information</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">First Name</label>
            <input name="firstName" value={profileData.firstName} onChange={onChange} className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Last Name</label>
            <input name="lastName" value={profileData.lastName} onChange={onChange} className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Mobile Contact</label>
          <div className="relative">
            <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
            <input name="phone" value={profileData.phone} onChange={onChange} className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
            <input name="email" value={profileData.email} onChange={onChange} className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin size={18} />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Residential Address</h3>
          </div>
          <div className="space-y-3">
            <textarea name="address" value={profileData.address} onChange={onChange} rows="2" className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input name="city" placeholder="City" value={profileData.city} onChange={onChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
            <input name="state" placeholder="State" value={profileData.state} onChange={onChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
            <input name="zipCode" placeholder="Zip" value={profileData.zipCode} onChange={onChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
          </div>
        </div>

        <div className="pt-6">
          <Button loading={status === "loading"} icon={Save} className="btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] font-black shadow-xl shadow-primary/20">
            Securely Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
