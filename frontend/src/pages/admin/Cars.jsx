import React, { useEffect, useState } from "react";
import { ChevronRight, Plus, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import useCarStore from "../../store/zustand/cars";
import Button from "../../components/common/Button";
import CarTable from "../../components/cars/CarTable";
import CarStats from "../../components/admin/CarStats";
import CarFilters from "../../components/admin/CarFilters";
import CarFormModal from "../../components/admin/CarFormModal";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
    name: "", brand: "", model: "", year: new Date().getFullYear(), color: "",
    fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, mileage: 0,
    rentPerDay: 0, description: "", features: [], status: "Available",
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => { fetchCars(); }, [fetchCars]);
  useEffect(() => { if (success) { setIsFormOpen(false); setEditingCar(null); resetCarStatus(); } }, [success, resetCarStatus]);

  const handleAddCar = () => {
    setEditingCar(null);
    setFormData({ name: "", brand: "", model: "", year: new Date().getFullYear(), color: "", fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, mileage: 0, rentPerDay: 0, description: "", features: [], status: "Available" });
    setNewImages([]); setExistingImages([]); setIsFormOpen(true);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setFormData({ ...car, features: Array.isArray(car.features) ? car.features : [] });
    setExistingImages(car.images || []); setNewImages([]); setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setFormData((prev) => ({ ...prev, images: prev.images.filter((img) => img !== imageUrl) }));
  };

  const handleDeleteCar = (id) => {
    const car = cars.find((c) => c._id === id);
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
                <p className="text-text-dim font-medium leading-relaxed">
                  Are you sure you want to delete <span className="text-text-main font-bold">{car?.name}</span>? This action is irreversible.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="danger" onClick={async () => { try { await deleteCar(id); toast.success("Car deleted successfully"); onClose(); } catch (err) { toast.error(err || "Failed to delete car"); } }} loading={loading} icon={Trash2} className="py-4 rounded font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20">Delete Vehicle</Button>
                <button onClick={onClose} className="py-4 text-text-dim font-black uppercase tracking-[0.2em] hover:text-text-main transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) { await updateCar({ id: editingCar._id, carData: formData, newImages }); toast.success("Updated successfully"); }
      else { await addNewCar({ carData: formData, images: newImages }); toast.success("Added successfully"); }
      setIsFormOpen(false); setEditingCar(null);
    } catch (err) { toast.error(err || "Operation failed"); }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || car.status === statusFilter;
    const matchesFuel = fuelFilter === "All" || car.fuelType === fuelFilter;
    return matchesSearch && matchesStatus && matchesFuel;
  });

  const reservedCars = cars.filter((c) => c.status === "Reserved").length;
  const maintenanceCars = cars.filter((c) => c.status === "Maintainance").length;
  const availableCars = cars.filter((c) => c.status === "Available").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 text-sm text-text-dim">
        <span className="hover:text-text-main transition-colors cursor-default">Fleet</span>
        <ChevronRight size={14} className="text-text-dim/50" />
        <span className="text-text-main font-medium">Inventory Management</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Vehicle Fleet</h1>
          <p className="text-text-dim text-sm mt-1">Manage and monitor your high-performance rental assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchCars()} className="p-2.5 bg-white border border-border rounded-lg text-text-dim hover:text-text-main transition-all hover:border-primary/30 shadow-sm">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <Button onClick={handleAddCar} icon={Plus} className="shadow-lg shadow-primary/20">Add New Car</Button>
        </div>
      </div>

      <CarStats totalCars={cars.length} availableCars={availableCars} reservedCars={reservedCars} maintenanceCars={maintenanceCars} />
      <CarFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} fuelFilter={fuelFilter} onFuelChange={setFuelFilter} onRefresh={fetchCars} loading={loading} />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{error}
        </div>
      )}

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <CarTable cars={filteredCars} loading={loading} onEdit={handleEditCar} onDelete={handleDeleteCar} />
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-dark/50">
          <p className="text-sm text-text-dim">Showing <span className="font-semibold text-text-main">{filteredCars.length}</span> of <span className="font-semibold text-text-main">{cars.length}</span> vehicles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main disabled:opacity-50 shadow-sm" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-white border border-border rounded text-xs text-text-dim hover:text-text-main shadow-sm">Next</button>
          </div>
        </div>
      </div>

      <CarFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingCar={editingCar}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        featureInput={featureInput}
        onFeatureInputChange={setFeatureInput}
        onAddFeature={addFeature}
        onRemoveFeature={removeFeature}
        newImages={newImages}
        setNewImages={setNewImages}
        existingImages={existingImages}
        onDeleteExistingImage={handleDeleteExistingImage}
      />
    </div>
  );
};

export default Cars;
