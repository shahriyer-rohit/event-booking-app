const mongoose = require('mongoose');
const Category = require('../models/Category');
const Event = require('../models/Event');

// Create a new category.
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // findOne() checks if same category name already exists.
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // save() inserts new category document into MongoDB.
    const category = new Category({ name, description });
    const savedCategory = await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: savedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories.
const getCategories = async (req, res, next) => {
  try {
    // find() gets all category documents.
    const categories = await Category.find({}).sort({ name: 1 });

    res.status(200).json({
      message: 'Categories fetched successfully',
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get one category and also events in that category.
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB id format.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category id format' });
    }

    // findById() gets one category document.
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // find() gets all events linked by categoryId.
    const events = await Event.find({ categoryId: id })
      .sort({ date: 1 })
      .populate('organizer', 'name email')
      .populate('categoryId', 'name description');

    res.status(200).json({
      message: 'Category details fetched successfully',
      category,
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Update category by id.
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB id format.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category id format' });
    }

    // findByIdAndUpdate() updates category and returns updated document.
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category by id.
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB id format.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category id format' });
    }

    // countDocuments() checks if any event still uses this category.
    const linkedEventsCount = await Event.countDocuments({ categoryId: id });

    // Block delete when events are linked for data safety.
    if (linkedEventsCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category because events are linked to it',
      });
    }

    // findByIdAndDelete() removes category document.
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      category: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Show events by category id.
const getEventsByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB id format.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category id format' });
    }

    // findById() confirms category exists before event lookup.
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // find() gets all events that have this category id.
    const events = await Event.find({ categoryId: id })
      .sort({ date: 1 })
      .populate('organizer', 'name email')
      .populate('categoryId', 'name');

    res.status(200).json({
      message: 'Events by category fetched successfully',
      category,
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getEventsByCategory,
};
