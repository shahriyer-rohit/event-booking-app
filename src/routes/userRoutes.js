const express = require('express');
const { body } = require('express-validator');

const { getLoggedInUser } = require('../controllers/authController');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// GET /api/users/me (protected route)
router.get('/me', protect, getLoggedInUser);

// GET /api/users/profile
// Get logged-in user's profile.
router.get('/profile', protect, getProfile);

// PUT /api/users/profile
// Update logged-in user's name and email.
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  ],
  validateRequest,
  updateProfile
);

// POST /api/users/profile-picture
 
router.post('/profile-picture', protect, upload.single('image'), uploadProfilePicture);

// PUT /api/users/change-password
 
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validateRequest,
  changePassword
);

module.exports = router;
