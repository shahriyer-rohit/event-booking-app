const mongoose = require('mongoose');

// User schema defines how user data will be stored in MongoDB.
const userSchema = new mongoose.Schema(
  {
    // Full name of the user.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email should be unique so one account maps to one email.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (never save plain password).
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Public URL for uploaded profile picture.
    profilePicture: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    // Auto add createdAt and updatedAt fields.
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
