import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import { TaskListSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineCollection } from 'react-icons/hi';

/**
 * SortableTaskCard - Wraps TaskCard with drag-and-drop capability
 */
function SortableTaskCard({ task, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto'
  };

  return (
    <div ref={setNodeRef}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        style={style}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}

/**
 * TasksPage - Full task list with filtering, search, and drag-and-drop reordering
 */
export default function TasksPage() {
  const {
    tasks,
    loading,
    filters,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    reorderTasks,
    setFilters
  } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Debounced fetch
  const debouncedFetch = useCallback(() => {
    const timeout = setTimeout(() => {
      fetchTasks(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, fetchTasks]);

  useEffect(() => {
    const cleanup = debouncedFetch();
    if (initialLoad) setInitialLoad(false);
    return cleanup;
  }, [debouncedFetch]);// eslint-disable-line react-hooks/exhaustive-deps

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t._id === active.id);
    const newIndex = tasks.findIndex(t => t._id === over.id);

    const reordered = [...tasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    reorderTasks(reordered);
    toast.success('Tasks reordered');
  };

  const handleCreateTask = async (taskData) => {
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
      fetchStats();
    } else {
      toast.error(result.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            <HiOutlineCollection className="text-primary-500" />
            My Tasks
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary 
            hover:opacity-90 transition-all shadow-lg shadow-primary-500/25"
        >
          <HiOutlinePlus className="text-lg" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Task List with Drag and Drop */}
      {initialLoad && loading ? (
        <TaskListSkeleton />
      ) : tasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(t => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <SortableTaskCard
                    key={task._id}
                    task={task}
                    onEdit={(t) => setEditingTask(t)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineCollection className="text-2xl text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-200 mb-2">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
              ? 'No matching tasks'
              : 'No tasks yet'}
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started!'}
          </p>
          {!(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all') && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white gradient-primary hover:opacity-90 transition-opacity"
            >
              Create Task
            </button>
          )}
        </div>
      )}

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
