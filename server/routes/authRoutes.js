// Auth Routes - User authentication and profile management
import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public Routes
// POST /api/auth/register - Register a new user
router.post("/register", validateUserRegistration, register);

// POST /api/auth/login - Login user
router.post("/login", validateUserLogin, login);

// Protected Routes (require authentication)
// GET /api/auth/profile - Get current user profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/auth/profile - Update user profile
router.put("/profile", authMiddleware, updateProfile);

// PUT /api/auth/change-password - Change user password
router.put("/change-password", authMiddleware, changePassword);

export default router;
