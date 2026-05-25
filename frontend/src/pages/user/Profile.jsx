import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Save, 
  CreditCard,
  ShieldCheck,
  Key
} from 'lucide-react';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { updateProfile, loading, error, clearError } = useUser();
  
  // Profile Details State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
  });

  // Sync profileData with user context when it changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      });
    }
  }, [user]);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      refreshUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-bg-sidebar p-12 rounded shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-32 h-32 rounded bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white text-5xl font-black shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
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

      {/* Status Messages */}
      {(message.text || error) && (
        <div className={`p-6 rounded border animate-in zoom-in duration-300 flex items-center gap-4 ${
          (message.type === 'success') 
            ? 'bg-green-500/10 border-green-500/20 text-green-700' 
            : 'bg-red-500/10 border-red-500/20 text-red-700'
        }`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="font-black uppercase tracking-widest text-xs">{message.text || error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Profile Update Form */}
        <div className="lg:col-span-7 space-y-8">
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

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">First Name</label>
                  <input name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Last Name</label>
                  <input name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Mobile Contact</label>
                <div className="relative">
                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
                    <input name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
                    <input name="email" value={profileData.email} onChange={handleProfileChange} className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main" />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 text-primary">
                    <MapPin size={18} />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">Residential Address</h3>
                </div>
                <div className="space-y-3">
                    <textarea name="address" value={profileData.address} onChange={handleProfileChange} rows="2" className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-text-main resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <input name="city" placeholder="City" value={profileData.city} onChange={handleProfileChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
                    <input name="state" placeholder="State" value={profileData.state} onChange={handleProfileChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
                    <input name="zipCode" placeholder="Zip" value={profileData.zipCode} onChange={handleProfileChange} className="bg-bg-dark border border-border rounded px-6 py-4 text-text-main font-bold focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" />
                </div>
              </div>

              <div className="pt-6">
                <Button loading={loading} icon={Save} className="btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] font-black shadow-xl shadow-primary/20">
                  Securely Update Profile
                </Button>
              </div>
            </form>
          </div>
          
          {/* Identity Section (Read Only in Profile for security) */}
          <div className="bg-bg-dark border border-border p-8 rounded flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-text-dim border border-border shadow-sm">
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">Verified License</p>
                    <p className="text-text-main font-mono font-bold">{user?.licenseNumber || 'Not provided'}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">Expires On</p>
                <p className="text-text-main font-bold">{user?.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-text-main">Security Vault</h2>
                <p className="text-[10px] text-text-dim uppercase tracking-[0.3em] font-black">Credential Management</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                    <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim" />
                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="w-full bg-bg-dark border border-border rounded pl-16 pr-6 py-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-text-main font-bold" />
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-text-main font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required className="w-full bg-bg-dark border border-border rounded px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-text-main font-bold" />
                </div>
              </div>

              <div className="pt-4">
                <Button variant="secondary" loading={loading} className="w-full py-5 rounded font-black uppercase tracking-[0.2em] border-orange-500/30 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all">
                  Update Credentials
                </Button>
              </div>
            </form>
          </div>

          <div className="p-8 bg-orange-50 border border-orange-100 rounded space-y-4 shadow-sm">
             <div className="flex items-start gap-4">
                <Lock size={20} className="text-orange-500 mt-1 shrink-0" />
                <div className="space-y-2">
                    <p className="text-xs font-black text-orange-800 uppercase tracking-widest">Security Protocol</p>
                    <p className="text-[11px] text-orange-600/80 font-bold leading-relaxed">
                        Changing your password will re-encrypt your session data. We recommend using at least 12 characters with symbols and numbers.
                    </p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
