const express = require('express');
const { body, param } = require('express-validator');

const {
  addReview,
  getEventReviews,
  getAverageRating,
  editReview,
  deleteReview,
} = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/reviews
 
router.post(
  '/',
  protect,
  [
    body('eventId').isMongoId().withMessage('eventId must be valid Mongo id'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validateRequest,
  addReview
);

// GET /api/reviews/event/:eventId
 
router.get(
  '/event/:eventId',
  [param('eventId').isMongoId().withMessage('eventId must be valid Mongo id')],
  validateRequest,
  getEventReviews
);

// GET /api/reviews/average/:eventId
 
router.get(
  '/average/:eventId',
  [param('eventId').isMongoId().withMessage('eventId must be valid Mongo id')],
  validateRequest,
  getAverageRating
);

// PUT /api/reviews/:id
 
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Review id must be valid Mongo id'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  ],
  validateRequest,
  editReview
);

// DELETE /api/reviews/:id
 
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Review id must be valid Mongo id')],
  validateRequest,
  deleteReview
);

module.exports = router;
