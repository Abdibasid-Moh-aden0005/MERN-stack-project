import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Save,
  Car,
  Tag,
  Settings,
  DollarSign,
  Info,
  AlertTriangle,
  Trash2,
  Fuel,
  Users,
  TrendingUp,
  Wrench,
} from "lucide-react";
import useCarStore from "../../store/zustand/cars";
import Button from "../../components/common/Button";
import CarTable from "../../components/cars/CarTable";
import ImageUpload from "../../components/cars/ImageUpload";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

Modal.setAppElement("#root");

const Cars = () => {
  const { cars, loading, success, error } = useCarStore();
  const fetchCars = useCarStore((state) => state.fetchCars);
  const addNewCar = useCarStore((state) => state.addNewCar);
  const updateCar = useCarStore((state) => state.updateCar);
  const deleteCar = useCarStore((state) => state.deleteCar);
  const resetCarStatus = useCarStore((state) => state.resetCarStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    mileage: 0,
    rentPerDay: 0,
    description: "",
    features: [],
    status: "Available",
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    if (success) {
      setIsFormOpen(false);
      setEditingCar(null);
      resetCarStatus();
    }
  }, [success, resetCarStatus]);

  const handleAddCar = () => {
    setEditingCar(null);
    setFormData({
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      fuelType: "Petrol",
      transmission: "Automatic",
      seatingCapacity: 5,
      mileage: 0,
      rentPerDay: 0,
      description: "",
      features: [],
      status: "Available",
    });
    setNewImages([]);
    setExistingImages([]);
    setIsFormOpen(true);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setFormData({
      ...car,
      features: Array.isArray(car.features) ? car.features : [],
    });
    setExistingImages(car.images || []);
    setNewImages([]);
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
  };

  const handleDeleteCar = (id) => {
    const car = cars.find((c) => c._id === id);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white border border-border rounded shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-text-main">Confirm Deletion</h2>
                  <p className="text-text-dim font-medium leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="text-text-main font-bold">{car?.name}</span>?
                    This action is irreversible.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        await deleteCar(id);
                        toast.success("Car deleted successfully");
                        onClose();
                      } catch (err) {
                        toast.error(err || "Failed to delete car");
                      }
                    }}
                    loading={loading}
                    icon={Trash2}
                    className="py-4 rounded font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20"
                  >
                    Delete Vehicle
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
        );
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await updateCar({ id: editingCar._id, carData: formData, newImages });
        toast.success("Updated successfully");
      } else {
        await addNewCar({ carData: formData, images: newImages });
        toast.success("Added successfully");
      }
      setIsFormOpen(false);
      setEditingCar(null);
    } catch (err) {
      toast.error(err || "Operation failed");
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || car.status === statusFilter;
    const matchesFuel = fuelFilter === "All" || car.fuelType === fuelFilter;
    return matchesSearch && matchesStatus && matchesFuel;
  });

  const totalCars = cars.length;
  const reservedCars = cars.filter((c) => c.status === "Reserved").length;
  const maintenanceCars = cars.filter((c) => c.status === "Maintainance").length;
  const availableCars = cars.filter((c) => c.status === "Available").length;
  const dailyRevenue = cars.reduce((sum, c) => sum + c.rentPerDay, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-dim">
        <span className="hover:text-text-main transition-colors cursor-default">Fleet</span>
        <ChevronRight size={14} className="text-text-dim/50" />
        <span className="text-text-main font-medium">Inventory Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Vehicle Fleet</h1>
          <p className="text-text-dim text-sm mt-1">Manage and monitor your high-performance rental assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCars()}
            className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all hover:border-primary/30 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <Button onClick={handleAddCar} icon={Plus} className="shadow-lg shadow-primary/20">
            Add New Car
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Total Vehicles</span>
            <Car size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-main">{totalCars}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} />
            <span>Fleet at full capacity</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Available</span>
            <Users size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{availableCars}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
            <span>Ready to rent</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">Reserved</span>
            <Fuel size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{reservedCars}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
            <span>{totalCars > 0 ? Math.round((reservedCars / totalCars) * 100) : 0}% utilization</span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">In Maintenance</span>
            <Wrench size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{maintenanceCars}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 font-medium">
            <span>{maintenanceCars > 0 ? "Attention needed" : "All clear"}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name, brand, or model..."
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
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintainance">Maintenance</option>
          </select>
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-text-dim focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
          >
            <option value="All">All Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <CarTable cars={filteredCars} loading={loading} onEdit={handleEditCar} onDelete={handleDeleteCar} />
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
          <p className="text-sm text-text-dim">
            Showing <span className="font-semibold text-text-main">{filteredCars.length}</span> of{" "}
            <span className="font-semibold text-text-main">{cars.length}</span> vehicles
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Car Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onRequestClose={() => setIsFormOpen(false)}
        contentLabel={editingCar ? "Edit Car" : "Add Car"}
        className="relative w-full max-w-4xl bg-white border border-border rounded shadow-2xl flex flex-col overflow-hidden outline-none mx-4"
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-bg-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Car size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-text-main">
                {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-semibold">Fleet Management</p>
            </div>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[75vh]">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-primary">
              <Tag size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Car Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Toyota Corolla 2022" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Brand</label>
                <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Toyota" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Model</label>
                <input required name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Corolla" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Year</label>
                <input required type="number" name="year" value={formData.year} onChange={handleChange} min="1990" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Color</label>
                <input required name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Red" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 text-primary">
              <Settings size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Specifications</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Seats</label>
                <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} min="2" max="8" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Mileage (km/l)</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Pricing & Availability</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Rent Per Day ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                  <input required type="number" name="rentPerDay" value={formData.rentPerDay} onChange={handleChange} className="w-full bg-white border border-border rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main font-semibold shadow-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none font-semibold shadow-sm">
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintainance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 text-primary">
              <Info size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Details & Features</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main resize-none" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Features</label>
                <div className="flex gap-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Add a feature..." className="flex-1 bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
                  <button type="button" onClick={addFeature} className="btn-primary px-5 text-xs font-bold uppercase tracking-widest rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded text-xs font-medium text-text-main shadow-sm">
                      {feature}
                      <button type="button" onClick={() => removeFeature(index)} className="text-text-dim hover:text-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ImageUpload images={newImages} setImages={setNewImages} existingImages={existingImages} onDeleteExisting={handleDeleteExistingImage} />
        </form>

        <div className="px-8 py-4 border-t border-border bg-bg-dark flex justify-end gap-3">
          <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 text-text-dim font-bold uppercase tracking-widest text-xs hover:text-text-main transition-all">
            Cancel
          </button>
          <Button onClick={handleSubmit} loading={loading} icon={Save} className="shadow-lg shadow-primary/30">
            {editingCar ? "Update Vehicle" : "Register Vehicle"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Cars;
