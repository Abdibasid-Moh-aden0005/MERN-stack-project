// Car Routes - API endpoints for car management
import express from 'express';
import { addCar, getAllCars, getCarById, updateCar, deleteCar, deleteCarImage } from '../controllers/carController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

// Public Routes
// GET /api/cars - Get all available cars with filters
router.get('/', getAllCars);

// GET /api/cars/:id - Get car details by ID
router.get('/:id', getCarById);

// Protected Admin Routes
// POST /api/cars - Add new car (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 6), addCar);

// PUT /api/cars/:id - Update car details (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 6), updateCar);

// DELETE /api/cars/:id - Delete car (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);

// DELETE /api/cars/:id/image - Delete specific car image (Admin only)
router.delete('/:id/image', authMiddleware, adminMiddleware, deleteCarImage);

export default router;
