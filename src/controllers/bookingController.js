const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

 
// CREATE BOOKING
// POST /api/bookings
 
const createBooking = async (req, res, next) => {
  try {
    const { eventId, seatsBooked } = req.body;

    // Validate event ID
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: 'Invalid event id format',
      });
    }

    // Validate seats
    const seats = Number(seatsBooked);

    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({
        message: 'Seats booked must be a positive number',
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    // Check available seats
    if (seats > Number(event.availableSeats)) {
      return res.status(400).json({
        message: 'Not enough seats available',
      });
    }

    // Calculate total price
    const totalPrice = seats * Number(event.price || 0);

    // Atomically decrease available seats.
    // We intentionally do NOT use event.save().
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableSeats: { $gte: seats },
      },
      {
        $inc: {
          availableSeats: -seats,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        message: 'Not enough seats available',
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      event: event._id,
      seatsBooked: seats,
      totalPrice: totalPrice,
    });

    // Save booking
    let savedBooking;

    try {
      savedBooking = await booking.save();
    } catch (bookingError) {
      // Restore seats if booking creation fails
      await Event.findByIdAndUpdate(eventId, {
        $inc: {
          availableSeats: seats,
        },
      });

      throw bookingError;
    }

    // Populate booking details
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate(
        'event',
        'title location date time price category image availableSeats'
      )
      .populate('user', 'name email');

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};


 
// GET MY BOOKINGS
// GET /api/bookings/my
 
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate(
        'event',
        'title location date time price category image availableSeats'
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'My bookings fetched successfully',
      totalBookings: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};


 
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
 
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate booking ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid booking id format',
      });
    }

    // Find booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        message: 'You can only cancel your own booking',
      });
    }

    // Prevent duplicate cancellation
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled',
      });
    }

    // Return seats to event using update instead of event.save().
    const updatedEvent = await Event.findByIdAndUpdate(
      booking.event,
      {
        $inc: {
          availableSeats: Number(booking.seatsBooked),
        },
      },
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: 'Related event not found',
      });
    }

    // Update booking status
    booking.status = 'cancelled';

    const updatedBooking = await booking.save();

    // Populate response
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate(
        'event',
        'title location date time price category image availableSeats'
      )
      .populate('user', 'name email');

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};