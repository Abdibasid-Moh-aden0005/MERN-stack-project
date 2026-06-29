import { Mail, Phone, Calendar, Users as UsersIcon } from "lucide-react";

const CustomerTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="px-6 py-20 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-3 text-text-dim text-sm font-medium">Loading customer data...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-20 text-center text-text-dim">
        <UsersIcon size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-base font-semibold">No customers found</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Customer Profile</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Contact Info</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Status</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">Date Joined</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-bg-dark/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {user.firstName?.[0] || "U"}{user.lastName?.[0] || ""}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-text-main">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-text-dim font-mono">ID: {user._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-text-dim">
                    <Mail size={12} className="text-text-dim/60" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-dim">
                    <Phone size={12} className="text-text-dim/60" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${user.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? "bg-emerald-500" : "bg-gray-400"}`} />
                  {user.isActive !== false ? "Active" : "Inactive"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-text-dim">
                  <Calendar size={12} className="text-text-dim/60" />
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(user)} className="p-2 hover:bg-primary/10 text-text-dim hover:text-primary rounded-lg transition-all" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(user._id)} className="p-2 hover:bg-red-50 text-text-dim hover:text-red-500 rounded-lg transition-all" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
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

export default CustomerTable;
