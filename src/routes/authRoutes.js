const express = require('express');
const { body } = require('express-validator');

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    // Validate name field.
    body('name').trim().notEmpty().withMessage('Name is required'),

    // Validate email format.
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),

    // Password must be at least 6 chars.
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  registerUser
);

// POST /api/auth/login
router.post(
  '/login',
  [
    // Email is required and should be valid.
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),

    // Password is required.
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

// GET /api/auth/me
// Protected route to get currently logged-in user profile.
router.get('/me', protect, getCurrentUser);

// POST /api/auth/logout
// Protected route because only logged-in user should logout token session.
router.post('/logout', protect, logoutUser);

module.exports = router;
