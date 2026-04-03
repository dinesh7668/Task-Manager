import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlinePlus } from 'react-icons/hi';

const categories = ['work', 'personal', 'study', 'health', 'finance', 'other'];
const priorities = ['low', 'medium', 'high'];
const selectOptionStyle = {
  backgroundColor: '#111827',
  color: '#f5f5f5'
};

/**
 * TaskModal - Create/Edit task modal form
 */
export default function TaskModal({ isOpen, onClose, onSubmit, task = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    status: 'pending',
    dueDate: '',
    tags: [],
    reminder: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'other',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags || [],
        reminder: task.reminder ? new Date(task.reminder).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'other',
        status: 'pending',
        dueDate: '',
        tags: [],
        reminder: ''
      });
    }
    setTagInput('');
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title is too long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submitData = { ...formData };
    if (!submitData.dueDate) delete submitData.dueDate;
    if (!submitData.reminder) delete submitData.reminder;
    
    onSubmit(submitData);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-neutral-100">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 transition-colors"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Title <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors text-sm
                    ${errors.title ? 'border-danger-500' : 'border-white/10'}
                    bg-black/20 text-neutral-100
                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500`}
                  placeholder="Enter task title..."
                  autoFocus
                />
                {errors.title && <p className="text-xs text-danger-500 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 
                    bg-black/20 text-neutral-100
                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm resize-none"
                  placeholder="Describe your task..."
                />
              </div>

              {/* Priority & Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 
                      bg-black/20 dark:bg-white/5 text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p} style={selectOptionStyle}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 
                      bg-black/20 dark:bg-white/5 text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} style={selectOptionStyle}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date & Reminder */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 
                      bg-black/20 text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Reminder</label>
                  <input
                    type="date"
                    value={formData.reminder}
                    onChange={e => setFormData(prev => ({ ...prev, reminder: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 
                      bg-black/20 text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Tags <span className="text-xs text-neutral-500">(max 5)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 
                      bg-black/20 text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                    placeholder="Add a tag..."
                    disabled={formData.tags.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={formData.tags.length >= 5}
                    className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    <HiOutlinePlus className="text-sm" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-danger-500 transition-colors"
                        >
                          <HiOutlineX className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25"
                >
                  {task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
