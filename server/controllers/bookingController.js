// Booking Controller - Handles booking operations
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import {
  calculateTotalRent,
  checkCarAvailability,
  validateBookingDates,
  calculateRefund,
  calculateSecurityDeposit,
  calculateTotalAmount,
} from '../utils/bookingUtils.js';

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      pickupDate,
      numberOfDays,
      specialRequirements,
      paymentMethod,
    } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!carId || !pickupDate || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields',
      });
    }

    // Derive dropoffDate from pickupDate + numberOfDays
    const dropoffDate = new Date(pickupDate);
    dropoffDate.setDate(dropoffDate.getDate() + numberOfDays);

    // Validate dates
    const dateValidation = validateBookingDates(pickupDate, dropoffDate);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking dates',
        errors: dateValidation.errors,
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    if (!Car.isBookableStatus(car.status)) {
      return res.status(409).json({
        success: false,
        message: `Car is currently ${car.status.toLowerCase()} and cannot be booked`,
      });
    }

    // Check car availability
    const isAvailable = await checkCarAvailability(carId, pickupDate, dropoffDate.toISOString());
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates',
      });
    }

    const reservedCar = await Car.findOneAndUpdate(
      { _id: carId, status: 'Available' },
      { status: 'Reserved' },
      { new: true },
    );

    if (!reservedCar) {
      return res.status(409).json({
        success: false,
        message: 'Car is no longer available for booking',
      });
    }

    // Calculate rental details
    const totalRent = calculateTotalRent(reservedCar.rentPerDay, numberOfDays);
    const securityDeposit = calculateSecurityDeposit(totalRent);

    // Create booking
    const newBooking = new Booking({
      customerId: userId,
      carId,
      pickupDate: new Date(pickupDate),
      dropoffDate,
      numberOfDays,
      rentPerDay: reservedCar.rentPerDay,
      totalRent,
      securityDeposit,
      specialRequirements: specialRequirements ? specialRequirements.trim() : '',
      paymentMethod: paymentMethod || 'Zaad',
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    // Save booking
    try {
      await newBooking.save();
    } catch (saveError) {
      const hasActiveBooking = await Booking.exists({
        carId,
        status: { $in: ['Pending', 'Confirmed'] },
      });

      if (!hasActiveBooking) {
        await Car.updateOne(
          { _id: carId, status: 'Reserved' },
          { status: 'Available' },
        );
      }

      throw saveError;
    }

    // Populate car and customer details
    await newBooking.populate('carId', 'name brand model rentPerDay');
    await newBooking.populate('customerId', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

// Get all bookings for current user
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { customerId: userId };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('carId', 'name brand model rentPerDay fuelType seatingCapacity images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message,
    });
  }
};

// Get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId)
      .populate('carId')
      .populate('customerId', 'firstName lastName email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner or admin
    const user = await User.findById(userId);
    if (booking.customerId._id.toString() !== userId.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking details retrieved',
      data: booking,
    });
  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking details',
      error: error.message,
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner
    if (booking.customerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status.toLowerCase()} booking`,
      });
    }

    // Calculate refund
    const totalAmount = calculateTotalAmount(booking.totalRent, booking.securityDeposit);
    const refund = calculateRefund(totalAmount, booking.pickupDate);

    // Update booking
    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'No reason provided';
    booking.refundAmount = refund.amount;
    booking.paymentStatus = 'Pending'; // Mark for refund processing

    await booking.save();

    const activeBookingExists = await Booking.exists({
      _id: { $ne: booking._id },
      carId: booking.carId,
      status: { $in: ['Pending', 'Confirmed'] },
    });
    if (!activeBookingExists) {
      await Car.updateOne(
        { _id: booking.carId, status: 'Reserved' },
        { status: 'Available' },
      );
    }

    res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Refund: $${refund.amount} (${refund.percentage}%).`,
      booking,
      refund: {
        amount: refund.amount,
        percentage: refund.percentage,
        totalAmount,
      },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
};

// Check car availability for given dates
export const checkAvailability = async (req, res) => {
  try {
    const { carId, pickupDate, dropoffDate } = req.query;

    if (!carId || !pickupDate || !dropoffDate) {
      return res.status(400).json({
        success: false,
        message: 'Car ID, pickup date, and dropoff date are required',
      });
    }

    const car = await Car.findById(carId).select('status');
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    if (!Car.isBookableStatus(car.status)) {
      return res.status(200).json({
        success: true,
        isAvailable: false,
        message: `Car is currently ${car.status.toLowerCase()}`,
      });
    }

    const isAvailable = await checkCarAvailability(carId, pickupDate, dropoffDate);

    res.status(200).json({
      success: true,
      isAvailable,
      message: isAvailable ? 'Car is available' : 'Car is not available for selected dates',
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message,
    });
  }
};

export default {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  checkAvailability,
};
