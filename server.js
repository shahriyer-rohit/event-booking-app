// Load environment variables from .env as early as possible.
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Create the Express application.
const app = express();

// Allow your frontend (or Postman) to call this API.
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost on any port for Flutter Web development.
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      // Allow 127.0.0.1 on any port.
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
// Parse incoming JSON body data.
app.use(express.json());

// Parse incoming URL-encoded form data.
app.use(express.urlencoded({ extended: true }));

// Parse cookies so we can read JWT from cookies as well.
app.use(cookieParser());

// Serve uploaded images publicly.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health route to check if server is running.
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Event Booking API is running.' });
});

// Auth routes: register, login, logout.
app.use('/api/auth', authRoutes);

// User routes: protected profile route.
app.use('/api/users', userRoutes);

// Event routes: create/get/update/delete/search/filter/pagination/sorting.
app.use('/api/events', eventRoutes);

// Booking routes: create booking, get my bookings, cancel booking.
app.use('/api/bookings', bookingRoutes);

// Category routes: create/get/update/delete categories and show events by category.
app.use('/api/categories', categoryRoutes);

// Payment routes: summary, confirm dummy payment, success and failed details.
app.use('/api/payments', paymentRoutes);

// Review routes: add/edit/delete reviews and calculate average rating.
app.use('/api/reviews', reviewRoutes);

// Favorite routes: add, remove, and list user's favorite events.
app.use('/api/favorites', favoriteRoutes);

// Upload routes: upload images and return public image URLs.
app.use('/api/uploads', uploadRoutes);

// If route is not found, send 404.
app.use(notFound);

// Handle all thrown errors in one place.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server only after MongoDB connection succeeds.
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
