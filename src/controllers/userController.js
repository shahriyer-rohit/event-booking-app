const bcrypt = require('bcryptjs');
const User = require('../models/User');

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Get logged-in user's profile.
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update name/email for logged-in user.
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: safeUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

// Upload profile picture and store file URL on user document.
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      imageUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Change logged-in user's password.
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
};
