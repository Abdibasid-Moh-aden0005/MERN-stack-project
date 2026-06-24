import { useEffect, useState } from "react";
import useUserStore from "../../store/zustand/users";
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
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

Modal.setAppElement("#root");

const Customers = () => {
  const {
    users,
    status,
    fetchUsers,
    deleteUser,
    adminUpdateUser,
    adminAddUser,
    error,
    clearError,
  } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
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
  }, [fetchUsers]);

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
      password: "",
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
      customUI: ({ onClose }) => (
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
                  ? This action is irreversible.
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
                  loading={status === "loading"}
                  icon={Trash2}
                  className="py-4 rounded font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20"
                >
                  Delete User
                </Button>
                <button
                  onClick={onClose}
                  className="py-4 text-text-dim font-black uppercase tracking-[0.2em] hover:text-text-main transition-all"
                >
                  Cancel
                </button>
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
      if (selectedUser) {
        await adminUpdateUser({ id: selectedUser._id, userData: dataToSend });
        toast.success("Updated successfully");
      } else {
        await adminAddUser(dataToSend);
        toast.success("Added successfully");
      }
      setIsFormModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.isActive !== false) ||
      (statusFilter === "Inactive" && user.isActive === false);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            Customers
          </h1>
          <p className="text-text-dim text-sm mt-1">
            Manage and track your global client base.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers()}
            className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all hover:border-primary/30 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <Button
            onClick={handleAddNew}
            icon={UserPlus}
            className="shadow-lg shadow-primary/20"
          >
            Add New Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Total Customers
            </span>
            <Users size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-main">{totalUsers}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} />
            <span>Registered members</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Active
            </span>
            <UserCheck size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{activeUsers}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <span>
              {totalUsers > 0
                ? Math.round((activeUsers / totalUsers) * 100)
                : 0}
              % of total
            </span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Inactive
            </span>
            <UserX size={18} className="text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-text-main">{inactiveUsers}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
            <span>Needs attention</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Administrators
            </span>
            <Shield size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{adminUsers}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 font-medium">
            <span>With full access</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
          <button
            onClick={clearError}
            className="text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
                  Customer Profile
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim">
                  Date Joined
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-dim text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    <p className="mt-3 text-text-dim text-sm font-medium">
                      Loading customer data...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-text-dim"
                  >
                    <Users size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-base font-semibold">
                      No customers found
                    </p>
                    <p className="text-sm mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-bg-dark/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {user.firstName?.[0] || "U"}
                          {user.lastName?.[0] || ""}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-text-main">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-text-dim font-mono">
                            ID: {user._id.slice(-6).toUpperCase()}
                          </p>
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
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                          user.isActive !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-text-dim">
                        <Calendar size={12} className="text-text-dim/60" />
                        <span>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-primary/10 text-text-dim hover:text-primary rounded-lg transition-all"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className="p-2 hover:bg-red-50 text-text-dim hover:text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
          <p className="text-sm text-text-dim">
            Showing{" "}
            <span className="font-semibold text-text-main">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-text-main">{users.length}</span>{" "}
            customers
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">
              Next
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
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-bg-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <UserIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-text-main">
                {selectedUser ? "Edit User Profile" : "Add New Member"}
              </h2>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-semibold">
                Administrative Control
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFormModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-6 max-h-[70vh]"
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                First Name
              </label>
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                Last Name
              </label>
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!selectedUser}
                className={`w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main ${selectedUser ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
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
              className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
            />
          </div>
          <div className="grid grid-cols-2 gap-5 p-5 bg-primary/5 rounded-lg border border-primary/10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1 flex items-center gap-2">
                <Shield size={12} className="text-primary" /> Role Assignment
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none shadow-sm"
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after-left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                <span className="ml-3 text-xs font-bold text-text-main uppercase tracking-widest">
                  Active Status
                </span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Identity & License
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                  License Number
                </label>
                <input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Location Details
              </h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                Residential Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">
                  Zip Code
                </label>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-4 border-t border-border bg-bg-dark flex justify-end gap-3">
          <button
            onClick={() => setIsFormModalOpen(false)}
            className="px-6 py-2.5 text-text-dim font-bold uppercase tracking-widest text-xs hover:text-text-main transition-all"
          >
            Cancel
          </button>
          <Button
            onClick={handleFormSubmit}
            loading={status === "loading"}
            icon={Save}
            className="shadow-lg shadow-primary/30"
          >
            {selectedUser ? "Save Changes" : "Create Member"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;
