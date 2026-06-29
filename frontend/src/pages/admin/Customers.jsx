import { useEffect, useState } from "react";
import useUserStore from "../../store/zustand/users";
import { UserPlus, AlertTriangle, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import CustomerStats from "../../components/admin/CustomerStats";
import CustomerFilters from "../../components/admin/CustomerFilters";
import CustomerTable from "../../components/admin/CustomerTable";
import CustomerFormModal from "../../components/admin/CustomerFormModal";

const Customers = () => {
  const { users, status, fetchUsers, deleteUser, adminUpdateUser, adminAddUser, error, clearError } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "", role: "customer",
    address: "", city: "", state: "", zipCode: "", licenseNumber: "", licenseExpiry: "", isActive: true,
  });

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "customer", address: "", city: "", state: "", zipCode: "", licenseNumber: "", licenseExpiry: "", isActive: true });
    setIsFormModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ ...user, password: "", licenseExpiry: user.licenseExpiry ? new Date(user.licenseExpiry).toISOString().split("T")[0] : "" });
    setIsFormModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDeleteClick = (userId) => {
    const user = users.find((u) => u._id === userId);
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-full max-w-md bg-white border border-border rounded shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-text-main">Confirm Deletion</h2>
                <p className="text-text-dim font-medium leading-relaxed">Are you sure you want to delete <span className="text-text-main font-bold">{user?.firstName} {user?.lastName}</span>? This action is irreversible.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="danger" onClick={async () => { try { await deleteUser(userId); toast.success("User deleted successfully"); onClose(); } catch (err) { toast.error(err.message || "Failed to delete user"); } }} loading={status === "loading"} icon={Trash2} className="py-4 rounded font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20">Delete User</Button>
                <button onClick={onClose} className="py-4 text-text-dim font-black uppercase tracking-[0.2em] hover:text-text-main transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (selectedUser && !dataToSend.password) delete dataToSend.password;
      if (selectedUser) { await adminUpdateUser({ id: selectedUser._id, userData: dataToSend }); toast.success("Updated successfully"); }
      else { await adminAddUser(dataToSend); toast.success("Added successfully"); }
      setIsFormModalOpen(false);
    } catch (err) { toast.error(err.message || "Operation failed"); }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "Active" && user.isActive !== false) || (statusFilter === "Inactive" && user.isActive === false);
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive !== false).length;
  const inactiveUsers = users.filter((u) => u.isActive === false).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const loading = status === "loading";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Customers</h1>
          <p className="text-text-dim text-sm mt-1">Manage and track your global client base.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleAddNew} icon={UserPlus} className="shadow-lg shadow-primary/20">Add New Customer</Button>
        </div>
      </div>

      <CustomerStats totalUsers={totalUsers} activeUsers={activeUsers} inactiveUsers={inactiveUsers} adminUsers={adminUsers} />
      <CustomerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} roleFilter={roleFilter} onRoleChange={setRoleFilter} onRefresh={fetchUsers} loading={loading} />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{error}</div>
          <button onClick={clearError} className="text-xs font-bold uppercase tracking-widest hover:underline">Dismiss</button>
        </div>
      )}

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <CustomerTable users={filteredUsers} loading={loading} onEdit={handleEdit} onDelete={handleDeleteClick} />
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
          <p className="text-sm text-text-dim">Showing <span className="font-semibold text-text-main">{filteredUsers.length}</span> of <span className="font-semibold text-text-main">{users.length}</span> customers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">Next</button>
          </div>
        </div>
      </div>

      <CustomerFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} selectedUser={selectedUser} formData={formData} onChange={handleChange} onSubmit={handleFormSubmit} status={status} />
    </div>
  );
};

export default Customers;
