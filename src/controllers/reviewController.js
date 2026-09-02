const mongoose = require('mongoose');
const Review = require('../models/Review');
const Event = require('../models/Event');

const buildReviewSummary = async (eventId) => {
  const [summary] = await Review.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$event',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return {
    averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0,
    totalReviews: summary ? summary.totalReviews : 0,
  };
};

// Add review for an event.
const addReview = async (req, res, next) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingReview = await Review.findOne({
      event: eventId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this event' });
    }

    const review = await Review.create({
      event: eventId,
      user: req.user.id,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('event', 'title');

    const summary = await buildReviewSummary(eventId);

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview,
      ...summary,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this event' });
    }

    next(error);
  }
};

// Get all reviews for one event with average rating.
const getEventReviews = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const reviews = await Review.find({ event: eventId })
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    const summary = await buildReviewSummary(eventId);

    res.status(200).json({
      message: 'Reviews fetched successfully',
      ...summary,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get only average rating summary for one event.
const getAverageRating = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const summary = await buildReviewSummary(eventId);

    res.status(200).json({
      message: 'Average rating fetched successfully',
      eventId,
      ...summary,
    });
  } catch (error) {
    next(error);
  }
};

// Edit a review owned by the logged-in user.
const editReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id format' });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You can only edit your own review' });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id)
      .populate('user', 'name email')
      .populate('event', 'title');

    const summary = await buildReviewSummary(review.event);

    res.status(200).json({
      message: 'Review updated successfully',
      review: populatedReview,
      ...summary,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review owned by the logged-in user.
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id format' });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You can only delete your own review' });
    }

    const eventId = review.event;
    await Review.findByIdAndDelete(id);
    const summary = await buildReviewSummary(eventId);

    res.status(200).json({
      message: 'Review deleted successfully',
      review,
      ...summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getEventReviews,
  getAverageRating,
  editReview,
  deleteReview,
};
