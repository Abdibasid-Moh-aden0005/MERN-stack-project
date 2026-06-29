import { Mail, Phone, ShieldCheck } from "lucide-react";

const ProfileHeader = ({ user, profileData, uploadingImage, onImageClick, fileRef, onImageChange }) => {
  return (
    <div className="relative overflow-hidden bg-bg-sidebar p-12 rounded shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <input type="file" hidden ref={fileRef} accept="image/*" onChange={onImageChange} />
          <div className="w-32 h-32 rounded bg-linear-to-br from-primary to-emerald-700 flex items-center justify-center text-white text-5xl font-black shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] relative overflow-hidden">
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {profileData.image ? (
              <img src={profileData.image} alt="" onClick={onImageClick} className="w-full h-full object-cover rounded" />
            ) : (
              <span className="cursor-pointer" onClick={onImageClick}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded border-4 border-bg-sidebar flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter text-white">
            {user?.firstName} {user?.lastName}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-gray-300 text-xs font-bold uppercase tracking-widest">
              <Mail size={14} className="text-primary" /> {user?.email}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-gray-300 text-xs font-bold uppercase tracking-widest">
              <Phone size={14} className="text-primary" /> {user?.phone}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded text-primary text-xs font-black uppercase tracking-[0.2em]">
              {user?.role} Profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
