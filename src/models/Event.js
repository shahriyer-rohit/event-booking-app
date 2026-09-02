const mongoose = require('mongoose');

// Event schema defines the structure of each event document in MongoDB.
const eventSchema = new mongoose.Schema(
  {
    // Title of the event (example: "Music Night").
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Short details about what the event is about.
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Place where the event will happen.
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Event date (stored as a real date value in MongoDB).
    date: {
      type: Date,
      required: true,
    },

    // Event time (stored as text like "06:30 PM" for beginner simplicity).
    time: {
      type: String,
      required: true,
      trim: true,
    },

    // Ticket price for one seat.
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Number of seats still available.
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    // Optional image URL for event poster/banner.
    image: {
      type: String,
      default: '',
      trim: true,
    },

    // Event category (example: "Music", "Tech", "Sports").
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional reference to Category collection (relationship field).
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    // User id of the person who created this event.
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields.
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
