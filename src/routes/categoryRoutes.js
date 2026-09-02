const express = require('express');
const { body } = require('express-validator');

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getEventsByCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/categories
 
router.post(
  '/',
  protect,
  [
    // Name is required.
    body('name').trim().notEmpty().withMessage('Category name is required'),

    // Description is optional text.
    body('description').optional().isString().withMessage('Description must be text'),
  ],
  validateRequest,
  createCategory
);

// GET /api/categories
 
router.get('/', getCategories);

// GET /api/categories/:id
 
router.get('/:id', getCategoryById);

// GET /api/categories/:id/events
 
router.get('/:id/events', getEventsByCategory);

// PUT /api/categories/:id
 
router.put(
  '/:id',
  protect,
  [
    // Validate fields only if provided.
    body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
    body('description').optional().isString().withMessage('Description must be text'),
  ],
  validateRequest,
  updateCategory
);

// DELETE /api/categories/:id
// Delete category (protected route).
router.delete('/:id', protect, deleteCategory);

module.exports = router;
