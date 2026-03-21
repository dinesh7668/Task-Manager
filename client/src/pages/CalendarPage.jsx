import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlus
} from 'react-icons/hi';

const priorityDot = {
  high: 'bg-danger-500',
  medium: 'bg-warning-500',
  low: 'bg-success-500'
};

/**
 * CalendarPage - Calendar view showing tasks by date
 */
export default function CalendarPage() {
  const { tasks, fetchTasks, createTask, updateTask } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks({});
  }, [fetchTasks]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });

    // Pad start to fill the week
    const startDay = start.getDay();
    const paddedDays = [];
    for (let i = 0; i < startDay; i++) {
      paddedDays.push(null);
    }
    return [...paddedDays, ...allDays];
  }, [currentMonth]);

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task =>
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const handleCreateTask = async (taskData) => {
    if (selectedDate) {
      taskData.dueDate = selectedDate.toISOString();
    }
    const result = await createTask(taskData);
    if (result.success) {
      toast.success('Task created!');
      setShowModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditTask = async (taskData) => {
    const result = await updateTask(editingTask._id, taskData);
    if (result.success) {
      toast.success('Task updated!');
      setEditingTask(null);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <HiOutlineCalendar className="text-primary-500" />
          Calendar
        </h1>
        <button
          onClick={() => { setSelectedDate(new Date()); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary 
            hover:opacity-90 transition-all shadow-lg shadow-primary-500/25"
        >
          <HiOutlinePlus className="text-lg" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
            >
              <HiOutlineChevronLeft className="text-lg text-dark-600 dark:text-dark-300" />
            </button>
            <h2 className="text-lg font-bold text-neutral-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
            >
              <HiOutlineChevronRight className="text-lg text-dark-600 dark:text-dark-300" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-neutral-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
              
              const dayTasks = getTasksForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const inCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all text-sm relative
                    ${!inCurrentMonth ? 'opacity-30' : ''}
                    ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : ''}
                    ${isCurrentDay && !isSelected ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold' : ''}
                    ${!isSelected && !isCurrentDay ? 'hover:bg-white/5 text-neutral-300' : ''}
                  `}
                >
                  <span className="text-xs mt-1">{format(day, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task._id}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : priorityDot[task.priority]}`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className={`text-[8px] ${isSelected ? 'text-white/70' : 'text-neutral-400'}`}>
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected date tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-100">
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
            </h3>
            {selectedDate && (
              <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors"
              >
                <HiOutlinePlus className="text-sm" />
              </button>
            )}
          </div>

          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div
                    key={task._id}
                    onClick={() => setEditingTask(task)}
                    className={`p-3 rounded-xl border-l-3 cursor-pointer transition-colors hover:bg-white/5
                      ${task.priority === 'high' ? 'border-l-danger-500' : task.priority === 'medium' ? 'border-l-warning-500' : 'border-l-success-500'}
                      ${task.status === 'completed' ? 'opacity-60' : ''}
                      bg-black/20`}
                  >
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-danger-500/10 text-danger-600 dark:text-danger-400' :
                        task.priority === 'medium' ? 'bg-warning-500/10 text-warning-600 dark:text-warning-400' :
                        'bg-success-500/10 text-success-600 dark:text-success-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-neutral-400">{task.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-400 mb-3">No tasks for this date</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  + Add task
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <HiOutlineCalendar className="text-3xl text-dark-300 dark:text-dark-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">Click a date to see tasks</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal || !!editingTask}
        onClose={() => { setShowModal(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
}
