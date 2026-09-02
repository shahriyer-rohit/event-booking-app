const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user.
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already used.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    // Hash password before storing it.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT for immediate login after registration.
    const token = generateToken(user);

    // Store token in cookie for easier browser usage.
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return safe user data (exclude password).
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login existing user.
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email.
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare entered password with hashed password in DB.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Create fresh JWT token after successful login.
    const token = generateToken(user);

    // Save token in cookie.
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Protected route: get currently logged-in user.
const getCurrentUser = async (req, res, next) => {
  try {
    // req.user comes from protect middleware after token verification.
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      message: 'Logged-in user fetched successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Alias kept for compatibility with existing /api/users/me route.
const getLoggedInUser = getCurrentUser;

// Logout user by clearing cookie token.
const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token');

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getLoggedInUser,
  logoutUser,
};
