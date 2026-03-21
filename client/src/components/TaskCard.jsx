import { motion } from 'framer-motion';
import { format, isPast, isToday } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import {
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineClock
} from 'react-icons/hi';

// Priority color mapping
const priorityConfig = {
  high: { bg: 'bg-danger-500/10', text: 'text-danger-600 dark:text-danger-400', border: 'border-l-danger-500', dot: 'bg-danger-500' },
  medium: { bg: 'bg-warning-500/10', text: 'text-warning-600 dark:text-warning-400', border: 'border-l-warning-500', dot: 'bg-warning-500' },
  low: { bg: 'bg-success-500/10', text: 'text-success-600 dark:text-success-400', border: 'border-l-success-500', dot: 'bg-success-500' }
};

// Category icon/color mapping
const categoryConfig = {
  work: { color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' },
  personal: { color: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' },
  study: { color: 'bg-success-500/10 text-success-600 dark:text-success-400' },
  health: { color: 'bg-danger-500/10 text-danger-600 dark:text-danger-400' },
  finance: { color: 'bg-warning-500/10 text-warning-600 dark:text-warning-400' },
  other: { color: 'bg-white/5 text-neutral-400' }
};

/**
 * TaskCard - Individual task card with status toggle, edit, and delete
 */
export default function TaskCard({ task, onEdit, style, dragListeners, dragAttributes }) {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isCompleted && !isToday(new Date(task.dueDate));
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const handleToggle = async (e) => {
    e.stopPropagation();
    await toggleTaskStatus(task._id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={style}
      className={`glass-card rounded-2xl p-4 border-l-4 ${priority.border} transition-all duration-200 hover:shadow-lg group ${
        isCompleted ? 'opacity-70' : ''
      }`}
      {...dragAttributes}
      {...dragListeners}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${isCompleted
              ? 'bg-success-500 border-success-500 text-white'
              : 'border-white/10 hover:border-primary-500'
            }`}
        >
          {isCompleted && <HiOutlineCheck className="text-xs" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold mb-1 ${
            isCompleted ? 'line-through text-neutral-500' : 'text-neutral-100'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`text-xs mb-2 line-clamp-2 ${
              isCompleted ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              {task.description}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {task.priority}
            </span>

            {/* Category badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig[task.category]?.color || categoryConfig.other.color}`}>
              {task.category}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs ${
                isOverdue ? 'text-danger-500 font-medium' : 'text-neutral-400'
              }`}>
                {isOverdue ? <HiOutlineClock className="text-sm" /> : <HiOutlineCalendar className="text-sm" />}
                {isOverdue ? 'Overdue · ' : ''}
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}

            {/* Tags */}
            {task.tags?.length > 0 && (
              <div className="flex items-center gap-1">
                <HiOutlineTag className="text-xs text-neutral-400" />
                {task.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-xs text-neutral-400">
                    #{tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-xs text-neutral-400">+{task.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg hover:bg-primary-500/10 text-neutral-400 hover:text-primary-500 transition-colors"
            title="Edit"
          >
            <HiOutlinePencil className="text-sm" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-danger-500/10 text-neutral-400 hover:text-danger-500 transition-colors"
            title="Delete"
          >
            <HiOutlineTrash className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
