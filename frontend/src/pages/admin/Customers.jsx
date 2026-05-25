import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  X,
  Save,
  User as UserIcon,
  Shield,
  MapPin,
  CreditCard,
  Lock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import UserList from "../../components/users/UserList";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Set Modal root element
Modal.setAppElement("#root");

const Customers = () => {
  const {
    users,
    loading,
    fetchUsers,
    deleteUser,
    adminUpdateUser,
    adminAddUser,
    error,
    clearError,
  } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
    licenseExpiry: "",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      licenseNumber: "",
      licenseExpiry: "",
      isActive: true,
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      ...user,
      password: "", // Don't show password on edit
      licenseExpiry: user.licenseExpiry
        ? new Date(user.licenseExpiry).toISOString().split("T")[0]
        : "",
    });
    setIsFormModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteClick = (userId) => {
    const user = users.find((u) => u._id === userId);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white border border-border rounded shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-text-main">
                    Confirm Deletion
                  </h2>
                  <p className="text-text-dim font-medium leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="text-text-main font-bold">
                      {user?.firstName} {user?.lastName}
                    </span>
                    ? This action is irreversible and will purge all related
                    data from the secure vaults.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        await deleteUser(userId);
                        toast.success("User deleted successfully");
                        onClose();
                      } catch (err) {
                        toast.error(err.message || "Failed to delete user");
                      }
                    }}
                    loading={loading}
                    icon={Trash2}
                    className="py-4 rounded font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20"
                  >
                    Authorize Deletion
                  </Button>
                  <button
                    onClick={onClose}
                    className="py-4 text-text-dim font-black uppercase tracking-[0.2em] hover:text-text-main transition-all"
                  >
                    Cancel Protocol
                  </button>
                </div>
              </div>
              <div className="bg-red-50 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 text-center border-t border-red-100">
                System Purge Authorization Required
              </div>
            </div>
          </div>
        );
      },
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!selectedUser;
      const dataToSend = { ...formData };
      if (isEdit && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (selectedUser) {
        await adminUpdateUser(selectedUser._id, dataToSend);
        toast.success("Edited successfully");
      } else {
        await adminAddUser(dataToSend);
        toast.success("Added successfully");
      }
      setIsFormModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="bg-white p-10 rounded shadow-sm border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-text-main uppercase">
              Customer Base
            </h1>
            <p className="text-text-dim mt-3 font-medium text-lg">
              Managing the elite community of LuxeDrive members.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-3 px-8 py-5 btn-primary rounded font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <UserPlus size={20} />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => fetchUsers()}
              className="p-5 bg-bg-dark hover:bg-gray-100 rounded border border-border text-text-dim hover:text-text-main transition-all group shadow-sm"
            >
              <RefreshCw
                size={24}
                className={
                  loading
                    ? "animate-spin"
                    : "group-hover:rotate-180 transition-transform duration-700"
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Members", value: users.length, color: "text-primary" },
          {
            label: "Active Now",
            value: users.filter((u) => u.isActive !== false).length,
            color: "text-emerald-600",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
            color: "text-red-600",
          },
          {
            label: "Verified",
            value: users.filter((u) => u.licenseNumber).length,
            color: "text-blue-600",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass-card border border-border p-6 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors"
            size={24}
          />
          <input
            type="text"
            placeholder="Search database by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-full pl-16 pr-8 py-6 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-xl font-bold text-text-main placeholder:text-text-dim/60 shadow-sm"
          />
        </div>
        <button className="px-10 py-6 bg-white border border-border rounded-full text-text-dim hover:text-text-main hover:border-primary transition-all font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
          <Filter size={20} />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-red-600 flex items-center justify-between animate-in shake duration-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-bold">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      <div className="glass-card p-0 border border-border overflow-hidden shadow-lg">
        <UserList
          users={filteredUsers}
          loading={loading}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />

        <div className="px-12 py-10 border-t border-border bg-bg-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {users.slice(0, 5).map((u, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-black text-text-dim"
                >
                  {u.firstName?.[0] || "U"}
                </div>
              ))}
              {users.length > 5 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">
                  +{users.length - 5}
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-text-dim">
              Securely managing{" "}
              <span className="text-text-main">{users.length}</span> verified
              accounts.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 rounded bg-white border border-border text-text-dim text-xs font-black uppercase tracking-widest disabled:opacity-50 shadow-sm"
              disabled
            >
              Previous
            </button>
            <button className="px-6 py-3 rounded bg-white border border-border text-text-dim hover:text-text-main text-xs font-black uppercase tracking-widest shadow-sm">
              Next Page
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit User */}
      <Modal
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        contentLabel={selectedUser ? "Edit User" : "Add User"}
        className="relative w-full max-w-2xl bg-white border border-border rounded shadow-2xl flex flex-col overflow-hidden outline-none mx-4"
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-bg-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-text-main">
                {selectedUser ? "Edit User Profile" : "Add New Member"}
              </h2>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-black">
                Administrative Control
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFormModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[70vh]"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                First Name
              </label>
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                Last Name
              </label>
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main ${selectedUser ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!!selectedUser}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
              <Lock size={12} className="text-primary" />{" "}
              {selectedUser ? "Reset Password (Optional)" : "Secure Password"}
            </label>
            <input
              required={!selectedUser}
              type="password"
              name="password"
              placeholder={
                selectedUser
                  ? "Leave blank to keep current"
                  : "Enter strong password"
              }
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 p-6 bg-primary/5 rounded border border-primary/10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
                <Shield size={12} className="text-primary" /> Role Assignment
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main appearance-none shadow-sm"
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex items-center gap-4 h-full pt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-xs font-black text-text-main uppercase tracking-widest">
                  Active Status
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Identity & License
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  License Number
                </label>
                <input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Location Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  Residential Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">
                  Zip Code
                </label>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-border bg-bg-dark flex justify-end gap-4">
          <button
            onClick={() => setIsFormModalOpen(false)}
            className="px-8 py-4 text-text-dim font-black uppercase tracking-widest hover:text-text-main transition-all"
          >
            Cancel
          </button>
          <Button
            onClick={handleFormSubmit}
            loading={loading}
            icon={Save}
            className="btn-primary px-10 py-4 shadow-lg shadow-primary/30"
          >
            {selectedUser ? "Save Changes" : "Create Member"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;
