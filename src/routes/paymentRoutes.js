const express = require('express');
const { body } = require('express-validator');

const {
  getPaymentSummary,
  confirmPayment,
  getPaymentSuccess,
  getPaymentFailed,
} = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// GET /api/payments/summary/:bookingId
 
router.get('/summary/:bookingId', protect, getPaymentSummary);

// POST /api/payments/confirm
// Confirm dummy payment and save transaction.
router.post(
  '/confirm',
  protect,
  [
    // bookingId is required.
    body('bookingId').isMongoId().withMessage('bookingId must be valid'),

    // paymentMethod is optional text.
    body('paymentMethod').optional().isString().withMessage('paymentMethod must be text'),

    // simulateStatus can be success or failed (optional).
    body('simulateStatus')
      .optional()
      .isIn(['success', 'failed'])
      .withMessage('simulateStatus must be success or failed'),
  ],
  validateRequest,
  confirmPayment
);

// GET /api/payments/success/:transactionId

router.get('/success/:transactionId', protect, getPaymentSuccess);

// GET /api/payments/failed/:transactionId
// Read failed transaction details.
router.get('/failed/:transactionId', protect, getPaymentFailed);

module.exports = router;
