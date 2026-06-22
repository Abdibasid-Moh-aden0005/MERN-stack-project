import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCarStore from "../../store/zustand/cars";
import useBookingStore from "../../store/zustand/Bookings";
import {
  Users,
  Fuel,
  Settings,
  ArrowLeft,
  Check,
  Calendar,
  Gauge,
  Zap,
  Timer,
  Star,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import Button from "../common/Button";
import { toast } from "react-toastify";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCar, loading, error } = useCarStore();
  const fetchCarDetails = useCarStore((state) => state.fetchCarDetails);
  const createNewBooking = useBookingStore((state) => state.createNewBooking);
  const bookingLoading = useBookingStore((state) => state.loading);

  useEffect(() => {
    fetchCarDetails(id);
  }, [fetchCarDetails, id]);

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/800x600?text=No+Image";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  const computedDropoffDate = pickupDate
    ? new Date(new Date(pickupDate).getTime() + numberOfDays * 86400000)
        .toISOString()
        .split("T")[0]
    : "";

  const totalRent = selectedCar?.rentPerDay
    ? selectedCar.rentPerDay * numberOfDays
    : 0;
  const securityDeposit = Math.ceil(totalRent * 0.1);
  const grandTotal = totalRent + securityDeposit;

  const handleReserve = async () => {
    if (!pickupDate) {
      toast.info("Please choose a pick-up date first");
      return;
    }

    if (selectedCar.status !== "Available") {
      toast.error("This vehicle is not available for booking right now");
      return;
    }

    try {
      await createNewBooking({ carId: id, pickupDate, numberOfDays });
      toast.success("Booking created successfully");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.message || "Failed to create booking");
    }
  };

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

  const mainImage = selectedCar.images?.[selectedImage]
    ? getImageUrl(selectedCar.images[selectedImage])
    : getImageUrl(null);

  const allImages =
    selectedCar.images?.length > 0 ? selectedCar.images : [null];

  const isCarAvailable = selectedCar.status === "Available";
  const statusDetails = {
    Available: {
      panel: "bg-emerald-50 border-emerald-200 text-emerald-700",
      dot: "bg-emerald-500",
      message: "This vehicle is available for booking",
      buttonText: "Reserve Now",
    },
    Reserved: {
      panel: "bg-blue-50 border-blue-200 text-blue-700",
      dot: "bg-blue-500",
      message: "This vehicle is already reserved for another customer",
      buttonText: "Currently Reserved",
    },
    Maintainance: {
      panel: "bg-orange-50 border-orange-200 text-orange-700",
      dot: "bg-orange-500",
      message: "This vehicle is in maintenance and cannot be booked",
      buttonText: "In Maintenance",
    },
  };
  const currentStatus =
    statusDetails[selectedCar.status] || statusDetails.Maintainance;

  const specsCards = [
    { label: "Top Speed", value: "191 MPH", icon: Gauge },
    { label: "0-60 MPH", value: "3.5 SEC", icon: Timer },
    { label: "Horsepower", value: "443 HP", icon: Zap },
    { label: "Torque", value: "390 LB-FT", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-text-dim hover:text-primary transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Fleet
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Images & Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden border border-border bg-white shadow-sm aspect-16/10">
            <img
              src={mainImage}
              alt={selectedCar.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 aspect-video transition-all ${
                    selectedImage === index
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Specs Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specsCards.map((spec, idx) => (
              <div
                key={idx}
                className="bg-white border border-border rounded-xl p-4 text-center shadow-sm"
              >
                <spec.icon size={20} className="text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-text-main">{spec.value}</p>
                <p className="text-xs text-text-dim font-medium">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>

          {/* Vehicle Specifications */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-4">
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Settings size={14} className="text-primary/70" />
                  <span>Transmission</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.transmission}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Fuel size={14} className="text-primary/70" />
                  <span>Fuel Type</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.fuelType}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Users size={14} className="text-primary/70" />
                  <span>Seating</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.seatingCapacity}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Gauge size={14} className="text-primary/70" />
                  <span>Mileage</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.mileage} km/l
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <span className="w-3 h-3 rounded bg-primary/70" />
                  <span>Color</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.color}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Calendar size={14} className="text-primary/70" />
                  <span>Year</span>
                </div>
                <span className="text-sm font-semibold text-text-main">
                  {selectedCar.year}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedCar.description && (
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-3">
                Description
              </h3>
              <p className="text-sm text-text-main leading-relaxed">
                {selectedCar.description}
              </p>
            </div>
          )}

          {/* Features */}
          {selectedCar.features?.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim mb-3">
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedCar.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm text-text-main"
                  >
                    <Check size={16} className="text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm sticky top-24">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 border border-primary/20">
              <Star size={12} />
              Premium Tier
            </div>

            {/* Car Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-main leading-tight">
                {selectedCar.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-text-dim">5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-text-dim">
                <MapPin size={12} />
                <span>Available in {selectedCar.city || "your area"}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-primary">
                ${selectedCar.rentPerDay}
              </span>
              <span className="text-text-dim text-sm">/ DAY</span>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex flex-col items-center p-3 rounded-lg bg-bg-dark border border-border">
                <Users size={16} className="text-text-dim mb-1" />
                <span className="text-xs font-semibold text-text-main">
                  {selectedCar.seatingCapacity} Seats
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-bg-dark border border-border">
                <Fuel size={16} className="text-text-dim mb-1" />
                <span className="text-xs font-semibold text-text-main truncate">
                  {selectedCar.fuelType}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-bg-dark border border-border">
                <Settings size={16} className="text-text-dim mb-1" />
                <span className="text-xs font-semibold text-text-main">
                  {selectedCar.transmission === "Automatic" ? "Auto" : "Manual"}
                </span>
              </div>
            </div>

            {/* Booking Section */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim">
                Booking Details
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={today}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-bg-dark border border-border rounded-lg text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim uppercase tracking-widest">
                  Rental Days
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setNumberOfDays(Math.max(1, numberOfDays - 1))
                    }
                    className="w-10 h-10 flex items-center justify-center bg-bg-dark border border-border rounded-lg text-text-dim hover:text-primary hover:border-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center text-lg font-bold text-text-main">
                    {numberOfDays}
                  </span>
                  <button
                    onClick={() => setNumberOfDays(numberOfDays + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-bg-dark border border-border rounded-lg text-text-dim hover:text-primary hover:border-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {pickupDate && (
                <div className="flex items-center gap-2 text-sm text-text-dim">
                  <Calendar size={14} />
                  <span>
                    Return:{" "}
                    <strong className="text-text-main">
                      {computedDropoffDate}
                    </strong>
                  </span>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-2 bg-bg-dark rounded-lg p-4 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim">
                    ${selectedCar.rentPerDay} x {numberOfDays}{" "}
                    {numberOfDays === 1 ? "Day" : "Days"}
                  </span>
                  <span className="font-medium text-text-main">
                    ${totalRent}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim">Security Deposit (10%)</span>
                  <span className="font-medium text-text-main">
                    ${securityDeposit}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-text-main">Total Amount</span>
                  <span className="font-bold text-primary">${grandTotal}</span>
                </div>
              </div>

              <Button
                onClick={handleReserve}
                disabled={
                  !pickupDate ||
                  bookingLoading ||
                  !isCarAvailable
                }
                className="w-full py-3 text-base shadow-lg shadow-primary/20"
              >
                <Check size={18} />
                {bookingLoading ? "Booking..." : currentStatus.buttonText}
              </Button>
              <p className="text-xs text-text-dim text-center">
                Free cancellation up to 24 hours before pick-up.
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`mt-6 p-3 rounded-lg border text-sm font-medium flex items-center gap-2 ${currentStatus.panel}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${currentStatus.dot}`}
              />
              {currentStatus.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
