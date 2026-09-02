const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

// Build payment summary for checkout screen.
const getPaymentSummary = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Validate booking id format.
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking id format' });
    }

    // findById() gets one booking and populate event for display details.
    const booking = await Booking.findById(bookingId)
      .populate('event', 'title date time location price')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user can access only their own booking.
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this booking' });
    }

    // Block payment summary for cancelled booking.
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot pay for cancelled booking' });
    }

    // Keep tax and platform fee simple for learning.
    const baseAmount = booking.totalPrice;
    const taxAmount = Number((baseAmount * 0.1).toFixed(2));
    const platformFee = 20;
    const grandTotal = Number((baseAmount + taxAmount + platformFee).toFixed(2));

    res.status(200).json({
      message: 'Payment summary fetched successfully',
      booking,
      summary: {
        baseAmount,
        taxAmount,
        platformFee,
        grandTotal,
        currency: 'INR',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment using dummy logic (no real gateway).
const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod = 'card', simulateStatus } = req.body;

    // Validate booking id format.
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking id format' });
    }

    // findById() gets booking for payment processing.
    const booking = await Booking.findById(bookingId).populate('event', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user can pay only their own booking.
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this booking' });
    }

    // Prevent payment for cancelled bookings.
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot pay for cancelled booking' });
    }

    // Prevent duplicate successful payment.
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This booking is already paid' });
    }

    // Dummy gateway decision:
    // 1) If simulateStatus is passed (success/failed), use it.
    // 2) Otherwise randomly decide success 70% of time.
    let finalStatus = 'failed';

    if (simulateStatus === 'success' || simulateStatus === 'failed') {
      finalStatus = simulateStatus;
    } else {
      finalStatus = Math.random() < 0.7 ? 'success' : 'failed';
    }

    // Generate fake transaction reference similar to gateway response.
    const referenceId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const message =
      finalStatus === 'success'
        ? 'Dummy payment approved'
        : 'Dummy payment declined';

    // save() on new Transaction stores payment attempt.
    const transaction = new Transaction({
      user: req.user.id,
      booking: booking._id,
      event: booking.event._id,
      amount: booking.totalPrice,
      status: finalStatus,
      paymentMethod,
      referenceId,
      message,
    });

    const savedTransaction = await transaction.save();

    // Update booking payment state using save().
    booking.paymentStatus = finalStatus === 'success' ? 'paid' : 'unpaid';
    booking.paymentAttemptedAt = new Date();
    await booking.save();

    res.status(200).json({
      message: finalStatus === 'success' ? 'Payment success' : 'Payment failed',
      paymentStatus: finalStatus,
      transaction: savedTransaction,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get successful payment details for a transaction.
const getPaymentSuccess = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction id format' });
    }

    // findById() loads transaction data.
    const transaction = await Transaction.findById(transactionId)
      .populate('booking', 'seatsBooked totalPrice status paymentStatus')
      .populate('event', 'title date time location')
      .populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this transaction' });
    }

    if (transaction.status !== 'success') {
      return res.status(400).json({ message: 'This transaction is not successful' });
    }

    res.status(200).json({
      message: 'Payment success details fetched',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get failed payment details for a transaction.
const getPaymentFailed = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction id format' });
    }

    // findById() loads transaction data.
    const transaction = await Transaction.findById(transactionId)
      .populate('booking', 'seatsBooked totalPrice status paymentStatus')
      .populate('event', 'title date time location')
      .populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this transaction' });
    }

    if (transaction.status !== 'failed') {
      return res.status(400).json({ message: 'This transaction is not failed' });
    }

    res.status(200).json({
      message: 'Payment failed details fetched',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentSummary,
  confirmPayment,
  getPaymentSuccess,
  getPaymentFailed,
};
