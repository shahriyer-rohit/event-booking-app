const mongoose = require('mongoose');

// Category schema stores event categories like Tech, Music, Sports.
const categorySchema = new mongoose.Schema(
  {
    // Category name should be unique so duplicates are avoided.
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Optional category description.
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt.
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
