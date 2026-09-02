const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Event = require('../models/Event');

// Add event to logged-in user's favorites.
const addFavorite = async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      event: eventId,
    });

    const populatedFavorite = await Favorite.findById(favorite._id)
      .populate('event', 'title location date time price category image')
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Favorite added successfully',
      favorite: populatedFavorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Event is already in favorites' });
    }

    next(error);
  }
};

// Remove event from logged-in user's favorites.
const removeFavorite = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      event: eventId,
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({
      message: 'Favorite removed successfully',
      favorite,
    });
  } catch (error) {
    next(error);
  }
};

// Get all favorite events for logged-in user.
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('event', 'title description location date time price category image availableSeats')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Favorites fetched successfully',
      totalFavorites: favorites.length,
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
