import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation
} from 'react-icons/hi';

/**
 * StatsCards - Dashboard statistics cards with animated counters
 */
export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: HiOutlineClipboardList,
      color: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-500/10',
      textColor: 'text-primary-600 dark:text-primary-400'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: HiOutlineCheckCircle,
      color: 'from-success-500 to-success-600',
      bgLight: 'bg-success-500/10',
      textColor: 'text-success-600 dark:text-success-400'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: HiOutlineClock,
      color: 'from-warning-500 to-warning-600',
      bgLight: 'bg-warning-500/10',
      textColor: 'text-warning-600 dark:text-warning-400'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: HiOutlineExclamation,
      color: 'from-danger-500 to-danger-600',
      bgLight: 'bg-danger-500/10',
      textColor: 'text-danger-600 dark:text-danger-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
              <card.icon className={`text-xl ${card.textColor}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 mb-1">
            {card.value}
          </div>
          <p className="text-xs text-neutral-400 font-medium">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
