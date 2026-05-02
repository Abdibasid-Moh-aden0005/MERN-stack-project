// Admin Controller - Handles admin operations
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { status, carId, customerId, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (carId) {
      filter.carId = carId;
    }

    if (customerId) {
      filter.customerId = customerId;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('carId', 'name brand model rentPerDay')
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'All bookings retrieved',
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message,
    });
  }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update status
    booking.status = status;
    if (adminNotes) {
      booking.adminNotes = adminNotes.trim();
    }
    booking.updatedAt = Date.now();

    await booking.save();

    await booking.populate('carId', 'name brand');
    await booking.populate('customerId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message,
    });
  }
};

// Update payment status (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Failed'];

    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.paymentStatus = paymentStatus;
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    booking.updatedAt = Date.now();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message,
    });
  }
};

// Get dashboard statistics (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total revenue
    const totalRevenue = await Booking.aggregate([
      {
        $match: { status: 'Completed' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalRent' },
        },
      },
    ]);

    // Total cars
    const totalCars = await Car.countDocuments();

    // Total users (customers)
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('carId', 'name brand')
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Most booked cars
    const topCars = await Booking.aggregate([
      {
        $group: {
          _id: '$carId',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved',
      stats: {
        totalBookings,
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCars,
        totalCustomers,
        recentBookings,
        topCars,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: error.message,
    });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) {
      filter.role = role;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'All users retrieved',
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account',
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, address, city, state, zipCode, role, isActive, licenseNumber, licenseExpiry } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone) user.phone = phone;
    if (address) user.address = address.trim();
    if (city) user.city = city.trim();
    if (state) user.state = state.trim();
    if (zipCode) user.zipCode = zipCode;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (licenseNumber) user.licenseNumber = licenseNumber.trim();
    if (licenseExpiry) user.licenseExpiry = licenseExpiry;

    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// Add new user (Admin only)
export const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, city, state, zipCode, role, licenseNumber, licenseExpiry } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed by pre-save hook
      phone,
      address,
      city,
      state,
      zipCode,
      role: role || 'customer',
      licenseNumber,
      licenseExpiry,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

export default {
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUser,
  addUser,
};
