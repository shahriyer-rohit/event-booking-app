const express = require('express');
const { body, query } = require('express-validator');

const {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/events
 
router.post(
  '/',
  protect,
  [
    // Required text fields.
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),

    // Date must be valid date format.
    body('date').isISO8601().withMessage('Date must be a valid date'),

    // Numeric fields should be valid positive/zero numbers.
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
    body('availableSeats')
      .isInt({ min: 0 })
      .withMessage('Available seats must be 0 or more'),

    // Optional image URL.
    body('image').optional().isString().withMessage('Image must be text'),

    // Optional relationship id.
    body('categoryId').optional().isMongoId().withMessage('categoryId must be valid Mongo id'),
  ],
  validateRequest,
  createEvent
);

// GET /api/events
// Get all events + search + category filter + price filter + pagination + sorting.
router.get(
  '/',
  [
    // Optional query validations.
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be valid'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be valid'),
    query('categoryId').optional().isMongoId().withMessage('categoryId must be valid'),
    query('date').optional().isISO8601().withMessage('date must be valid'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be at least 1'),
    query('limit').optional().isInt({ min: 1 }).withMessage('limit must be at least 1'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('order must be asc or desc'),
  ],
  validateRequest,
  getAllEvents
);

// GET /api/events/:id 
router.get('/:id', getSingleEvent);

// PUT /api/events/:id
// Update event by id (protected route).
router.put(
  '/:id',
  protect,
  [
    // All fields optional in update, but validate if provided.
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('date').optional().isISO8601().withMessage('Date must be valid'),
    body('time').optional().trim().notEmpty().withMessage('Time cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
    body('availableSeats')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Available seats must be 0 or more'),
    body('image').optional().isString().withMessage('Image must be text'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('categoryId').optional().isMongoId().withMessage('categoryId must be valid Mongo id'),
  ],
  validateRequest,
  updateEvent
);

// DELETE /api/events/:id
 
router.delete('/:id', protect, deleteEvent);

module.exports = router;
