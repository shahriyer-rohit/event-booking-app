// Called when no route matches the request.
const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Route not found: ${req.originalUrl}`);
  next(error);
};

// Central place for handling all thrown errors.
const errorHandler = (err, req, res, next) => {
  // If status code is still 200, convert it to 500 for server errors.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
    // Show stack only in development for easier debugging.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
