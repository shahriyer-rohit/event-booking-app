const { validationResult } = require('express-validator');

// This middleware checks if validation rules failed.
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  // If there are validation errors, stop the request here.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  // Validation passed, continue to controller.
  next();
};

module.exports = validateRequest;
