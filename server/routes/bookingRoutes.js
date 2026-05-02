// Booking Routes - API endpoints for rental bookings
import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  checkAvailability,
} from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
// GET /api/bookings/check-availability - Check if car is available for dates
router.get('/check-availability', checkAvailability);

// Protected Routes (Auth required)
// POST /api/bookings - Create new booking
router.post('/', authMiddleware, createBooking);

// GET /api/bookings/my - Get all bookings for current user
router.get('/my', authMiddleware, getMyBookings);

// GET /api/bookings/:bookingId - Get booking details
router.get('/:bookingId', authMiddleware, getBookingDetails);

// PUT /api/bookings/:bookingId/cancel - Cancel booking
router.put('/:bookingId/cancel', authMiddleware, cancelBooking);

export default router;
