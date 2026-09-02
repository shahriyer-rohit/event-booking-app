const mongoose = require('mongoose');

// Review schema stores a user's rating and comment for an event.
const reviewSchema = new mongoose.Schema(
  {
    // Reference to the event being reviewed.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    // Reference to the logged-in user who wrote the review.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Rating value from 1 to 5.
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Written feedback from the user.
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields.
    timestamps: true,
  }
);

// One user can review an event only once.
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
