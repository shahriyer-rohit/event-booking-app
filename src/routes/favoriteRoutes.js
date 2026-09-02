const express = require('express');
const { body, param } = require('express-validator');

const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require('../controllers/favoriteController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/favorites
 
router.post(
  '/',
  protect,
  [body('eventId').isMongoId().withMessage('eventId must be valid Mongo id')],
  validateRequest,
  addFavorite
);

// GET /api/favorites
 
router.get('/', protect, getFavorites);

// DELETE /api/favorites/:eventI
router.delete(
  '/:eventId',
  protect,
  [param('eventId').isMongoId().withMessage('eventId must be valid Mongo id')],
  validateRequest,
  removeFavorite
);

module.exports = router;
