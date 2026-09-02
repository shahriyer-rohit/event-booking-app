const mongoose = require('mongoose');

// Transaction schema stores payment attempts for bookings.
const transactionSchema = new mongoose.Schema(
  {
    // User who made payment.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Booking for which payment was attempted.
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },

    // Event for which this booking belongs.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    // Total amount paid (or attempted).
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment status from dummy gateway.
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },

    // Dummy payment method (UPI, card, netbanking, etc).
    paymentMethod: {
      type: String,
      default: 'card',
    },

    // Reference id to mimic real gateway transaction id.
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },

    // Message returned by dummy gateway.
    message: {
      type: String,
      default: '',
    },
  },
  {
    // Add createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
