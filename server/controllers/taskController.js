const Task = require('../models/Task');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all tasks for authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort } = req.query;
    
    // Build query filter
    const filter = { user: req.user._id };
    
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Build sort option
    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };
    if (sort === 'createdAt') sortOption = { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, status, priority, category, tags, dueDate, reminder } = req.body;

    // Get the highest order number for this user's tasks
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      category,
      tags: tags || [],
      dueDate: dueDate || null,
      reminder: reminder || null,
      order
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'category', 'tags', 'dueDate', 'order', 'reminder'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder tasks (for drag and drop)
 * @route   PUT /api/tasks/reorder
 * @access  Private
 */
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // Array of { id, order }
    
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks array is required' });
    }

    // Update each task's order
    const updatePromises = tasks.map(({ id, order }) =>
      Task.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    
    // Return updated tasks
    const updatedTasks = await Task.find({ user: req.user._id }).sort({ order: 1 });
    res.json(updatedTasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics for dashboard
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, completed, pending, highPriority, mediumPriority, lowPriority] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Task.countDocuments({ user: userId, status: 'pending' }),
      Task.countDocuments({ user: userId, priority: 'high' }),
      Task.countDocuments({ user: userId, priority: 'medium' }),
      Task.countDocuments({ user: userId, priority: 'low' })
    ]);

    // Category breakdown
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Overdue tasks
    const overdue = await Task.countDocuments({
      user: userId,
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    res.json({
      total,
      completed,
      pending,
      overdue,
      priority: { high: highPriority, medium: mediumPriority, low: lowPriority },
      categories: categoryStats.reduce((acc, cat) => {
        acc[cat._id] = cat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, reorderTasks, getTaskStats };
