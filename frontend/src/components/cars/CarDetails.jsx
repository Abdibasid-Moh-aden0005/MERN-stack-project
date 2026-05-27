import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCarStore from "../../store/zustand/cars";
import {
  Users,
  Fuel,
  Settings,
  ArrowLeft,
  Check,
  Calendar,
} from "lucide-react";
import Button from "../common/Button";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCar, loading, error } = useCarStore();
  const fetchCarDetails = useCarStore((state) => state.fetchCarDetails);

  useEffect(() => {
    fetchCarDetails(id);
  }, [fetchCarDetails, id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !selectedCar) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 text-lg font-semibold">
          {error || "Car not found"}
        </p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  // Placeholder logic for missing images
  const getImageUrl = (image) => {
    if (!image)
      return "https://via.placeholder.com/800x600?text=No+Image+Available";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const mainImage =
    selectedCar.images && selectedCar.images.length > 0
      ? getImageUrl(selectedCar.images[0])
      : getImageUrl(null);

  return (
    <div className="max-w-360 mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header / Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-text-dim hover:text-primary transition-colors font-semibold text-sm uppercase tracking-wider"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Fleet
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg overflow-hidden border border-border shadow-sm aspect-[16/10] bg-white">
            <img
              src={mainImage}
              alt={selectedCar.name}
              className="w-full h-full object-cover"
            />
          </div>
          {selectedCar.images && selectedCar.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {selectedCar.images.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-border aspect-square bg-white cursor-pointer hover:border-primary transition-colors"
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${selectedCar.name} detail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Booking Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-2">
                  {selectedCar.brand}
                </span>
                <h1 className="text-3xl font-bold text-text-main leading-tight">
                  {selectedCar.name}
                </h1>
                <p className="text-text-dim mt-1 font-mono text-sm">
                  {selectedCar.model} • {selectedCar.year}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-text-dim tracking-widest">
                  Daily Rate
                </p>
                <p className="text-3xl font-black text-primary">
                  ${selectedCar.rentPerDay}
                </p>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border my-6">
              <div className="flex flex-col items-center justify-center p-3 rounded bg-bg-dark border border-border text-center">
                <Users size={18} className="text-text-dim mb-2" />
                <span className="text-xs font-bold text-text-main">
                  {selectedCar.seatingCapacity} Seats
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded bg-bg-dark border border-border text-center">
                <Fuel size={18} className="text-text-dim mb-2" />
                <span className="text-xs font-bold text-text-main">
                  {selectedCar.fuelType}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded bg-bg-dark border border-border text-center">
                <Settings size={18} className="text-text-dim mb-2" />
                <span className="text-xs font-bold text-text-main">
                  {selectedCar.transmission === "Automatic" ? "Auto" : "Manual"}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedCar.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-2">
                  Description
                </h3>
                <p className="text-text-main leading-relaxed text-sm">
                  {selectedCar.description}
                </p>
              </div>
            )}

            {/* Features List */}
            {selectedCar.features && selectedCar.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-3">
                  Key Features
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  {selectedCar.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-text-main"
                    >
                      <Check size={16} className="text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-auto pt-6 border-t border-border space-y-4">
              <div className="bg-bg-dark p-4 rounded border border-border flex items-center justify-between">
                <div className="flex items-center text-sm text-text-main font-medium">
                  <Calendar size={16} className="text-text-dim mr-2" /> Select
                  Dates
                </div>
                <span className="text-primary text-sm font-bold cursor-pointer hover:underline">
                  Choose
                </span>
              </div>
              <button className="w-full btn-primary py-4 text-base shadow-lg shadow-primary/20">
                Reserve Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
