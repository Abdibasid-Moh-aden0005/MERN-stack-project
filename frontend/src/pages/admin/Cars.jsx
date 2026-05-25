import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";
import {
  fetchCars,
  addNewCar,
  updateCar,
  deleteCar,
  resetCarStatus,
} from "../../store/slices/carSlice";
import Button from "../../components/common/Button";
import CarTable from "../../components/cars/CarTable";
import ImageUpload from "../../components/cars/ImageUpload";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Set Modal root element
Modal.setAppElement("#root");

const Cars = () => {
  const dispatch = useDispatch();
  const { cars, loading, success, error } = useSelector((state) => state.cars);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Form State
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
    isAvailable: true,
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    dispatch(fetchCars());
  }, []);

  useEffect(() => {
    if (success) {
      setIsFormOpen(false);
      setEditingCar(null);
      dispatch(resetCarStatus());
    }
  }, [success, dispatch]);

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
      isAvailable: true,
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                      {car?.name}
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
                        await dispatch(deleteCar(id)).unwrap();
                        toast.success("car deleted successfully");
                        onClose();
                      } catch (err) {
                        toast.error(err || "Failed to delete car");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await dispatch(
          updateCar({
            id: editingCar._id,
            carData: formData,
            newImages: newImages,
          }),
        ).unwrap();
        toast.success("Edited successfully");
      } else {
        await dispatch(
          addNewCar({
            carData: formData,
            images: newImages,
          }),
        ).unwrap();
        toast.success("Added successfully");
      }
      setIsFormOpen(false);
      setEditingCar(null);
    } catch (err) {
      toast.error(err || "Operation failed");
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded shadow-sm border border-border">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">
            Fleet Inventory
          </h1>
          <p className="text-text-dim mt-2 font-medium">
            Manage and monitor your premium car collection with precision.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(fetchCars())}
            className="p-4 bg-bg-dark hover:bg-gray-100 rounded border border-border text-text-dim hover:text-text-main transition-all group shadow-sm"
          >
            <RefreshCw
              size={20}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
          <Button
            onClick={handleAddCar}
            icon={Plus}
            className="btn-primary shadow-lg shadow-primary/20 py-4 px-8"
          >
            Add New Car
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, brand, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded pl-16 pr-6 py-5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-lg font-medium text-text-main shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-5 bg-white border border-border rounded text-text-dim hover:text-text-main hover:border-primary transition-all font-bold shadow-sm">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm font-bold flex items-center gap-3 animate-in shake duration-500">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="glass-card p-0 overflow-hidden shadow-lg border border-border">
        <CarTable
          cars={filteredCars}
          loading={loading}
          onEdit={handleEditCar}
          onDelete={handleDeleteCar}
        />

        {/* Pagination */}
        <div className="px-10 py-8 border-t border-border flex items-center justify-between bg-bg-dark">
          <p className="text-sm text-text-dim font-bold uppercase tracking-widest">
            Showing{" "}
            <span className="text-text-main">{filteredCars.length}</span> of{" "}
            <span className="text-text-main">{cars.length}</span> vehicles
          </p>
          <div className="flex gap-3">
            <button
              className="p-3 bg-white border border-border rounded text-text-dim hover:text-text-main disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              disabled
            >
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 bg-white border border-border rounded text-text-dim hover:text-text-main transition-all shadow-sm">
              <ChevronRight size={20} />
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
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-bg-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Car size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-text-main">
                {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
                Fleet Management System
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(false)}
            className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-10 max-h-[75vh]"
        >
          {/* Basic Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Tag size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Car Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Toyota Corolla 2022"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Brand
                </label>
                <input
                  required
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Model
                </label>
                <input
                  required
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Corolla"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Year
                </label>
                <input
                  required
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Color
                </label>
                <input
                  required
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Red"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Settings size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Specifications
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main appearance-none"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main appearance-none"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Seats
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  min="2"
                  max="8"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Mileage (km/l)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-6 p-6 bg-primary/5 rounded border border-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Pricing & Availability
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Rent Per Day ($)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    name="rentPerDay"
                    value={formData.rentPerDay}
                    onChange={handleChange}
                    className="w-full bg-white border border-border rounded pl-10 pr-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main font-bold shadow-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 h-full pt-6 md:pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-bold text-text-main uppercase tracking-widest">
                    Available for Rent
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Description & Features Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Info size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Details & Features
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest ml-1">
                  Features
                </label>
                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                    placeholder="Add a feature (e.g. Adaptive Cruise Control)"
                    className="flex-1 bg-bg-dark border border-border rounded px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="btn-primary px-6 font-black uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full text-xs font-medium group shadow-sm text-text-main"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-text-dim hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <ImageUpload
            images={newImages}
            setImages={setNewImages}
            existingImages={existingImages}
            onDeleteExisting={handleDeleteExistingImage}
          />
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-border bg-bg-dark flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-8 py-4 text-text-dim font-black uppercase tracking-widest hover:text-text-main transition-all"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            icon={Save}
            className="btn-primary px-10 py-4 shadow-xl shadow-primary/30"
          >
            {editingCar ? "Update Vehicle" : "Register Vehicle"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Cars;
