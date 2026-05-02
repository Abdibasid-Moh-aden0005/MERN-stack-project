import React from 'react';
import { Mail, Phone, Calendar, Shield, Trash2, Edit } from 'lucide-react';

const UserList = ({ users, loading, onDelete, onEdit }) => {
  if (loading) {
    return (
      <div className="px-8 py-20 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-text-dim animate-pulse uppercase tracking-[0.2em] text-xs font-black">Decrypting user database...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="px-8 py-20 text-center text-text-dim">
        <div className="flex justify-center mb-4 opacity-10">
          <Shield size={80} />
        </div>
        <p className="text-xl font-black uppercase tracking-tight">No customers found.</p>
        <p className="text-sm font-medium mt-2">The database appears to be empty or filters are too strict.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-4 px-8">
        <thead>
          <tr className="text-text-dim uppercase text-[10px] font-black tracking-[0.2em]">
            <th className="px-6 py-2">Customer Profile</th>
            <th className="px-6 py-2">Contact Info</th>
            <th className="px-6 py-2">License Details</th>
            <th className="px-6 py-2">Status</th>
            <th className="px-6 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white/5 hover:bg-white/[0.08] transition-all group rounded-2xl overflow-hidden">
              <td className="px-6 py-5 first:rounded-l-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-tight text-white">{user.firstName} {user.lastName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                            {user.role}
                        </span>
                        <span className="text-[10px] text-text-dim font-bold italic">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-text-dim group-hover:text-white transition-colors">
                    <Mail size={14} className="text-primary/70" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-dim group-hover:text-white transition-colors">
                    <Phone size={14} className="text-primary/70" />
                    <span className="font-medium">{user.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-wider">{user.licenseNumber || 'N/A'}</p>
                  <div className="flex items-center gap-2 text-[10px] text-text-dim font-bold">
                    <Calendar size={12} />
                    <span>Exp: {user.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.isActive !== false ? 'text-green-500' : 'text-red-500'}`}>
                    {user.isActive !== false ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 last:rounded-r-2xl text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(user)}
                    className="p-2.5 hover:bg-primary/20 text-text-dim hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/30 shadow-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(user._id)}
                    className="p-2.5 hover:bg-red-500/20 text-text-dim hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30 shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
