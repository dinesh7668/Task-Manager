const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask, reorderTasks, getTaskStats } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// @route   GET /api/tasks/stats
// Must be before /:id route to avoid treating "stats" as an id
router.get('/stats', getTaskStats);

// @route   PUT /api/tasks/reorder
router.put('/reorder', reorderTasks);

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   GET /api/tasks/:id
router.get('/:id', getTask);

// @route   POST /api/tasks
router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  body('category').optional().isIn(['work', 'personal', 'study', 'health', 'finance', 'other']).withMessage('Invalid category')
], createTask);

// @route   PUT /api/tasks/:id
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  body('category').optional().isIn(['work', 'personal', 'study', 'health', 'finance', 'other']).withMessage('Invalid category')
], updateTask);

// @route   DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
