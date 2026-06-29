import { CreditCard } from "lucide-react";

const IdentityCard = ({ user }) => {
  return (
    <div className="bg-bg-dark border border-border p-8 rounded flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-text-dim border border-border shadow-sm">
          <CreditCard size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">Verified License</p>
          <p className="text-text-main font-mono font-bold">{user?.licenseNumber || "Not provided"}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">Expires On</p>
        <p className="text-text-main font-bold">
          {user?.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default IdentityCard;
