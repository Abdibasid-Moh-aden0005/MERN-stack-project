// Booking Model - Handles car rental bookings and status tracking
import mongoose from "mongoose";
import Car from "./Car.js";

const bookingSchema = new mongoose.Schema(
  {
    // ... same as before
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },
    // Reference to Car
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car ID is required"],
    },
    // Booking Dates and Times
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    dropoffDate: {
      type: Date,
      required: [true, "Dropoff date is required"],
    },

    // Pricing Information
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    totalRent: {
      type: Number,
      required: [true, "Total rent must be calculated"],
    },
    // Additional Charges
    securityDeposit: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    // Payment Information
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Cash on Delivery",
        "Digital Wallet",
        "Zaad",
      ],
      required: [true, "Payment method is required"],
    },
    // Special Requirements/Notes
    specialRequirements: {
      type: String,
      trim: true,
    },

    // Admin Notes
    adminNotes: {
      type: String,
      trim: true,
    },
    // Cancellation Information
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    // Refund Information
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  // Timestamps
  { timestamps: true },
);

// Index for faster queries
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ carId: 1 });
bookingSchema.index({ pickupDate: 1, dropoffDate: 1 });
bookingSchema.index({ status: 1 });

// Virtual for total cost including insurance and additional charges
bookingSchema.virtual("totalCost").get(function () {
  return this.totalRent + this.securityDeposit;
});

// Ensure virtuals are included when converting to JSON
bookingSchema.set("toJSON", { virtuals: true });

const ACTIVE_BOOKING_STATUSES = ["Pending", "Confirmed"];

bookingSchema.post("save", async function syncCarStatusAfterSave(doc) {
  if (ACTIVE_BOOKING_STATUSES.includes(doc.status)) {
    await Car.findByIdAndUpdate(doc.carId, { status: "Reserved" });
    return;
  }

  if (["Cancelled", "Completed"].includes(doc.status)) {
    const hasActiveBooking = await mongoose.models.Booking.exists({
      _id: { $ne: doc._id },
      carId: doc.carId,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });

    if (!hasActiveBooking) {
      await Car.updateOne(
        { _id: doc.carId, status: "Reserved" },
        { status: "Available" },
      );
    }
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
