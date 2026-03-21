const mongoose = require('mongoose');

/**
 * Task Model Schema
 * Stores individual task data linked to a user
 */
const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'study', 'health', 'finance', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  reminder: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);
