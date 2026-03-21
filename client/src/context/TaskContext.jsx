import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  }
};

const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS: 'SET_TASKS',
  SET_STATS: 'SET_STATS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTERS: 'SET_FILTERS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case TASK_ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload, loading: false };
    case TASK_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks], loading: false };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t),
        loading: false
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(t => t._id !== action.payload),
        loading: false
      };
    case TASK_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case TASK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case TASK_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

/**
 * TaskProvider - Manages task state and API operations
 */
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch all tasks with filters
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });
      const { data } = await api.get(`/tasks?${params.toString()}`);
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: data });
    } catch (error) {
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to fetch tasks' });
    }
  }, []);

  // Fetch task statistics
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      dispatch({ type: TASK_ACTIONS.SET_STATS, payload: data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Create task
  const createTask = async (taskData) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      const { data } = await api.post('/tasks', taskData);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: data });
      fetchStats();
      return { success: true, task: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: data });
      fetchStats();
      return { success: true, task: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id) => {
    const task = state.tasks.find(t => t._id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return updateTask(id, { status: newStatus });
  };

  // Reorder tasks (drag and drop)
  const reorderTasks = async (reorderedTasks) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: reorderedTasks });
      const taskOrders = reorderedTasks.map((task, index) => ({ id: task._id, order: index }));
      await api.put('/tasks/reorder', { tasks: taskOrders });
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      fetchTasks(state.filters);
    }
  };

  // Set filters
  const setFilters = (newFilters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      fetchStats,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      reorderTasks,
      setFilters
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
