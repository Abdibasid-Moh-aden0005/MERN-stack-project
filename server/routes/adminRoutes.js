// Admin Routes - API endpoints for administrative operations
import express from 'express';
import {
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUser,
  addUser,
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(authMiddleware, adminMiddleware);

// Admin Dashboard
router.get('/dashboard', getDashboardStats);

// Booking Management
router.get('/bookings', getAllBookings);
router.put('/bookings/:bookingId/status', updateBookingStatus);
router.put('/bookings/:bookingId/payment', updatePaymentStatus);

// User Management
router.get('/users', getAllUsers);
router.post('/users', addUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

export default router;
