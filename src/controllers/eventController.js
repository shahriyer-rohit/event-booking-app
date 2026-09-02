const mongoose = require('mongoose');
const Event = require('../models/Event');
const Category = require('../models/Category');

// Create a new event.
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      date,
      time,
      price,
      availableSeats,
      image,
      category,
      categoryId,
    } = req.body;

    let finalCategoryName = category;
    let finalCategoryId = null;

    // If categoryId is provided, read category name from Category collection.
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid category id format' });
      }

      // findById() gets category document so event can store relation and name.
      const foundCategory = await Category.findById(categoryId);

      if (!foundCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      finalCategoryName = foundCategory.name;
      finalCategoryId = foundCategory._id;
    }

    // Build new event document from request body.
    const event = new Event({
      title,
      description,
      location,
      date,
      time,
      price,
      availableSeats,
      image,
      category: finalCategoryName,
      categoryId: finalCategoryId,
      // Organizer is taken from logged-in user token payload.
      organizer: req.user.id,
    });

    // save() inserts this event document into MongoDB.
    const savedEvent = await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: savedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Get all events with search, filtering, sorting, and pagination.
const getAllEvents = async (req, res, next) => {
  try {
    const {
      search,
      name,
      location,
      category,
      categoryId,
      date,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // queryObject will hold MongoDB filter conditions.
    const queryObject = {};

    // Search in title OR description OR location using case-insensitive text search.
    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Search by event name/title.
    if (name) {
      queryObject.title = { $regex: name, $options: 'i' };
    }

    // Search by event location.
    if (location) {
      queryObject.location = { $regex: location, $options: 'i' };
    }

    // Filter by exact category.
    if (category) {
      queryObject.category = category;
    }

    // Filter by category relationship id.
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid category id format' });
      }
      queryObject.categoryId = categoryId;
    }

    // Filter by event date for a full calendar day.
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      queryObject.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Filter by price range.
    if (minPrice || maxPrice) {
      queryObject.price = {};

      // $gte means greater than or equal to minPrice.
      if (minPrice) {
        queryObject.price.$gte = Number(minPrice);
      }

      // $lte means less than or equal to maxPrice.
      if (maxPrice) {
        queryObject.price.$lte = Number(maxPrice);
      }
    }

    // Convert page and limit to numbers and keep minimum value as 1.
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    // skip tells MongoDB how many documents to skip for pagination.
    const skip = (pageNumber - 1) * limitNumber;

    // Convert order text to MongoDB sort value (1 for ASC, -1 for DESC).
    const sortOrder = order === 'asc' ? 1 : -1;

    // Dynamic sort object (example: { price: 1 }).
    const sortObject = { [sortBy]: sortOrder };

    // Count all matching events before pagination for metadata.
    const totalEvents = await Event.countDocuments(queryObject);

    // find() gets matching events, then we apply sorting and pagination.
    const events = await Event.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limitNumber)
      .populate('organizer', 'name email')
      .populate('categoryId', 'name description');

    res.status(200).json({
      message: 'Events fetched successfully',
      totalEvents,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalEvents / limitNumber),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single event by id.
const getSingleEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check id format before querying MongoDB.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    // findById() gets one document using its _id.
    const event = await Event.findById(id)
      .populate('organizer', 'name email')
      .populate('categoryId', 'name description');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event fetched successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Update event by id.
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check id format before querying MongoDB.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    const updateData = { ...req.body };

    // If categoryId is sent in update, sync category name from Category collection.
    if (updateData.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.categoryId)) {
        return res.status(400).json({ message: 'Invalid category id format' });
      }

      // findById() gets category document for relationship validation.
      const foundCategory = await Category.findById(updateData.categoryId);

      if (!foundCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      updateData.category = foundCategory.name;
    }

    // findByIdAndUpdate() updates matching document and returns updated doc.
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('organizer', 'name email')
      .populate('categoryId', 'name description');

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete event by id.
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check id format before querying MongoDB.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event id format' });
    }

    // findByIdAndDelete() removes one document by _id.
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event deleted successfully',
      event: deletedEvent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
