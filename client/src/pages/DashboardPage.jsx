import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatsCards from '../components/StatsCards';
import ProgressChart from '../components/ProgressChart';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi';

/**
 * DashboardPage - Overview with stats, progress charts, and recent tasks
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, loading, fetchTasks, fetchStats, createTask, updateTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks({}), fetchStats()]);
      setInitialLoad(false);
    };
    loadData();
  }, [fetchTasks, fetchStats]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      toast.success('Task created!');
      setShowModal(false);
      fetchStats();
    } else {
      toast.error(result.message);
    }
  };

  const handleEditTask = async (taskData) => {
    const result = await updateTask(editingTask._id, taskData);
    if (result.success) {
      toast.success('Task updated!');
      setEditingTask(null);
      fetchStats();
    } else {
      toast.error(result.message);
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (initialLoad && loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 skeleton w-64 rounded-lg" />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-neutral-100"
          >
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </motion.h1>
          <p className="text-sm text-neutral-400 mt-1">Here&apos;s your task overview for today</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary 
            hover:opacity-90 transition-all shadow-lg shadow-primary-500/25"
        >
          <HiOutlinePlus className="text-lg" />
          New Task
        </motion.button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Progress Charts */}
      <ProgressChart stats={stats} />

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <HiOutlineSparkles className="text-accent-500" />
            Recent Tasks
          </h2>
        </div>

        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlinePlus className="text-2xl text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">No tasks yet</h3>
            <p className="text-sm text-neutral-400 mb-4">Create your first task to get started!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white gradient-primary hover:opacity-90 transition-opacity"
            >
              Create Task
            </button>
          </div>
        )}
      </motion.div>

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
