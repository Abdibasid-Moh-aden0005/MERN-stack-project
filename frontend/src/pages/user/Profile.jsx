import React, { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/zustand/auth";
import useUserStore from "../../store/zustand/users";
import { Lock } from "lucide-react";
import ProfileHeader from "../../components/customer/ProfileHeader";
import ProfileForm from "../../components/customer/ProfileForm";
import PasswordForm from "../../components/customer/PasswordForm";
import IdentityCard from "../../components/customer/IdentityCard";

const Profile = () => {
  const { user } = useAuthStore();
  const { updateProfile, status, error, clearError } = useUserStore();
  const refreshUser = () => useAuthStore.getState().refreshUser();

  const fileRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    image: user.image || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try { await updateProfile(profileData); setMessage({ type: "success", text: "Profile updated successfully!" }); refreshUser(); }
    catch (err) { setMessage({ type: "error", text: err.message }); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { setMessage({ type: "error", text: err.message }); }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "rental_car_marketplace");
      data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      const res = await fetch("https://api.cloudinary.com/v1_1/dahqdijlh/image/upload", { method: "POST", body: data });
      const imageData = await res.json();
      if (!imageData.url) return;
      const updatedProfile = { ...profileData, image: imageData.url };
      setProfileData(updatedProfile);
      await updateProfile(updatedProfile);
      refreshUser();
      setMessage({ type: "success", text: "Profile image updated successfully!" });
    } catch (err) { setMessage({ type: "error", text: err.message || "Failed to upload image" }); }
    finally { setUploadingImage(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <ProfileHeader user={user} profileData={profileData} uploadingImage={uploadingImage} onImageClick={() => fileRef.current.click()} fileRef={fileRef} onImageChange={handleImage} />

      {(message.text || error) && (
        <div className={`p-6 rounded border animate-in zoom-in duration-300 flex items-center gap-4 ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-700" : "bg-red-500/10 border-red-500/20 text-red-700"}`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
          <p className="font-black uppercase tracking-widest text-xs">{message.text || error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <ProfileForm profileData={profileData} onChange={handleProfileChange} onSubmit={handleUpdateProfile} status={status} />
          <IdentityCard user={user} />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <PasswordForm passwordData={passwordData} onChange={handlePasswordChange} onSubmit={handleChangePassword} status={status} />

          <div className="p-8 bg-orange-50 border border-orange-100 rounded space-y-4 shadow-sm">
            <div className="flex items-start gap-4">
              <Lock size={20} className="text-orange-500 mt-1 shrink-0" />
              <div className="space-y-2">
                <p className="text-xs font-black text-orange-800 uppercase tracking-widest">Security Protocol</p>
                <p className="text-[11px] text-orange-600/80 font-bold leading-relaxed">Changing your password will re-encrypt your session data. We recommend using at least 12 characters with symbols and numbers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
