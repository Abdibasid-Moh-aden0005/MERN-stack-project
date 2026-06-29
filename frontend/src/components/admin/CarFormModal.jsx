import React from "react";
import Modal from "react-modal";
import { X, Car, Tag, Settings, DollarSign, Info, Save } from "lucide-react";
import Button from "../common/Button";
import ImageUpload from "../cars/ImageUpload";

const CarFormModal = ({
  isOpen,
  onClose,
  editingCar,
  formData,
  onChange,
  onSubmit,
  loading,
  featureInput,
  onFeatureInputChange,
  onAddFeature,
  onRemoveFeature,
  newImages,
  setNewImages,
  existingImages,
  onDeleteExistingImage,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded text-text-dim hover:text-text-main transition-all">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[75vh]">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-primary">
            <Tag size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Car Name</label>
              <input required name="name" value={formData.name} onChange={onChange} placeholder="e.g. Toyota Corolla 2022" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Brand</label>
              <input required name="brand" value={formData.brand} onChange={onChange} placeholder="e.g. Toyota" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Model</label>
              <input required name="model" value={formData.model} onChange={onChange} placeholder="e.g. Corolla" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Year</label>
              <input required type="number" name="year" value={formData.year} onChange={onChange} min="1990" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Color</label>
              <input required name="color" value={formData.color} onChange={onChange} placeholder="e.g. Red" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
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
              <select name="fuelType" value={formData.fuelType} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Seats</label>
              <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={onChange} min="2" max="8" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Mileage (km/l)</label>
              <input type="number" name="mileage" value={formData.mileage} onChange={onChange} className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
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
                <input required type="number" name="rentPerDay" value={formData.rentPerDay} onChange={onChange} className="w-full bg-white border border-border rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main font-semibold shadow-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Status</label>
              <select name="status" value={formData.status} onChange={onChange} className="w-full bg-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main appearance-none font-semibold shadow-sm">
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
            <textarea name="description" value={formData.description} onChange={onChange} rows="2" className="w-full bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main resize-none" />
            <div className="space-y-3">
              <label className="text-xs font-semibold text-text-dim uppercase tracking-widest ml-1">Features</label>
              <div className="flex gap-2">
                <input value={featureInput} onChange={(e) => onFeatureInputChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAddFeature())} placeholder="Add a feature..." className="flex-1 bg-bg-dark border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-text-main" />
                <button type="button" onClick={onAddFeature} className="btn-primary px-5 text-xs font-bold uppercase tracking-widest rounded-lg">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded text-xs font-medium text-text-main shadow-sm">
                    {feature}
                    <button type="button" onClick={() => onRemoveFeature(index)} className="text-text-dim hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ImageUpload images={newImages} setImages={setNewImages} existingImages={existingImages} onDeleteExisting={onDeleteExistingImage} />
      </form>

      <div className="px-8 py-4 border-t border-border bg-bg-dark flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-6 py-2.5 text-text-dim font-bold uppercase tracking-widest text-xs hover:text-text-main transition-all">
          Cancel
        </button>
        <Button onClick={onSubmit} loading={loading} icon={Save} className="shadow-lg shadow-primary/30">
          {editingCar ? "Update Vehicle" : "Register Vehicle"}
        </Button>
      </div>
    </Modal>
  );
};

export default CarFormModal;
