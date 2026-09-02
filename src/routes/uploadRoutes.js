const express = require('express');

const { uploadImage } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// POST /api/uploads/image
 
router.post('/image', protect, upload.single('image'), uploadImage);

module.exports = router;
