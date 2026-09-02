const mongoose = require('mongoose');

// Booking schema stores which user booked which event.
const bookingSchema = new mongoose.Schema(
  {
    // Reference to the logged-in user who made this booking.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Reference to the event that was booked.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    // How many seats user booked for this event.
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },

    // Total amount = event price * seats booked.
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Booking status for simple cancellation handling.
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },

    // Tracks whether booking has been paid.
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },

    // Saves when payment was attempted.
    paymentAttemptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Auto-create createdAt and updatedAt fields.
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
