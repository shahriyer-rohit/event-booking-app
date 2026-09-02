const express = require('express');
const { body } = require('express-validator');

const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/bookings
// Create booking for a logged-in user.
router.post(
  '/',
  protect,
  [
    // eventId is required.
    body('eventId').notEmpty().withMessage('eventId is required'),

    // seatsBooked must be at least 1.
    body('seatsBooked').isInt({ min: 1 }).withMessage('seatsBooked must be at least 1'),
  ],
  validateRequest,
  createBooking
);

// GET /api/bookings/my
// Get all bookings of logged-in user.
router.get('/my', protect, getMyBookings);

// PUT /api/bookings/:id/cancel
// Cancel one booking.
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
