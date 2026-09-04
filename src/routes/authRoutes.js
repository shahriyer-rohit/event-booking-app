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
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),

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
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

// GET /api/auth/me
router.get(
  '/me',
  protect,
  getCurrentUser
);

// POST /api/auth/logout
router.post(
  '/logout',
  protect,
  logoutUser
);

module.exports = router;