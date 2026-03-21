import { motion } from 'framer-motion';

/**
 * ProgressChart - Visual progress indicators for the dashboard
 */
export default function ProgressChart({ stats }) {
  if (!stats || stats.total === 0) return null;

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  const priorityData = [
    { label: 'High', value: stats.priority?.high || 0, color: 'bg-danger-500' },
    { label: 'Medium', value: stats.priority?.medium || 0, color: 'bg-warning-500' },
    { label: 'Low', value: stats.priority?.low || 0, color: 'bg-success-500' }
  ];

  const categoryData = Object.entries(stats.categories || {}).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: {
      work: 'bg-primary-500',
      personal: 'bg-accent-500',
      study: 'bg-success-500',
      health: 'bg-danger-500',
      finance: 'bg-warning-500',
      other: 'bg-dark-400'
    }[key] || 'bg-dark-400'
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Completion Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-neutral-200 mb-4">Overall Progress</h3>
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                className="stroke-dark-200 dark:stroke-dark-700"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50" cy="50" r="42"
                className="stroke-primary-500"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 264' }}
                animate={{ strokeDasharray: `${completionRate * 2.64} 264` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-neutral-100">{completionRate}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-neutral-400">
                {stats.completed} of {stats.total} completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-dark-200 dark:bg-dark-700" />
              <span className="text-sm text-neutral-400">
                {stats.pending} remaining
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Priority Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-neutral-200 mb-4">Priority Breakdown</h3>
        <div className="space-y-3">
          {priorityData.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-400">{item.label}</span>
                <span className="text-sm font-medium text-neutral-200">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-dark-100 dark:bg-dark-700 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: stats.total > 0 ? `${(item.value / stats.total) * 100}%` : '0%' }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Category chips */}
        {categoryData.length > 0 && (
          <div className="mt-5 pt-4 border-t border-dark-100 dark:border-dark-700">
            <h4 className="text-xs font-medium text-neutral-400 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categoryData.map((cat) => (
                <span
                  key={cat.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-xs font-medium text-neutral-300"
                >
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  {cat.label}: {cat.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
