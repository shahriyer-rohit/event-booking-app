const mongoose = require('mongoose');

// Favorite schema links a user with an event they saved.
const favoriteSchema = new mongoose.Schema(
  {
    // Logged-in user who added this favorite.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Event saved by the user.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields.
    timestamps: true,
  }
);

// Prevent the same user from saving the same event more than once.
favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
