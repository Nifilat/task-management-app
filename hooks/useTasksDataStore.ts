import { Task } from '@/data/types';
import { taskService } from '@/services/taskService';
import { create } from 'zustand';
import { auth } from '@/config/firebase';

export interface useTasksDataStoreInterface {
  tasks: Task[] | null;
  loading: boolean;
  selectedTask: Task | null;
  currentPage: number;
  rowsPerPage: number;
  setSelectedTask: (task: Task | null) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  fetchTasks: (userId: string) => Promise<void>;
  updateTask: (
    taskId: string,
    updates: Partial<Task>
  ) => Promise<{ success: boolean; message: string }>;
  addTask: (
    task: Omit<Task, 'id' | 'taskId' | 'createdAt'>
  ) => Promise<{ success: boolean; message: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; message: string }>;
  toggleFavorite: (
    taskId: string,
    isFavorite: boolean
  ) => Promise<{ success: boolean; message: string }>;
}

export const useTasksDataStore = create<useTasksDataStoreInterface>((set, get) => ({
  tasks: null,
  loading: false,
  selectedTask: null,
  currentPage: 1,
  rowsPerPage: 10,

  setSelectedTask: task => set({ selectedTask: task }),
  setCurrentPage: page => set({ currentPage: page }),
  setRowsPerPage: rows => set({ rowsPerPage: rows, currentPage: 1 }),

  fetchTasks: async (userId: string) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const userTasks = await taskService.getUserTasks(userId);
      set({ tasks: userTasks });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ tasks: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (taskId, updates) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, message: 'User not authenticated!' };
    try {
      await taskService.updateTask(taskId, updates, userId);
      set(state => ({
        tasks:
          state.tasks?.map(task => (task.taskId === taskId ? { ...task, ...updates } : task)) ||
          null,
      }));
      return { success: true, message: 'Task updated successfully!' };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Failed to update task!' };
    }
  },

  addTask: async task => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, message: 'User not authenticated!' };
    try {
      const taskId = await taskService.addTask({ ...task, userId });
      set(state => ({
        tasks: [{ ...task, taskId, userId, createdAt: new Date() }, ...(state.tasks || [])],
      }));
      return { success: true, message: 'Task added successfully!' };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false, message: 'Failed to add task!' };
    }
  },

  deleteTask: async taskId => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, message: 'User not authenticated!' };
    try {
      await taskService.deleteTask(taskId, userId);
      set(state => ({
        tasks: state.tasks?.filter(task => task.taskId !== taskId) || null,
      }));
      return { success: true, message: 'Task deleted successfully!' };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, message: 'Failed to delete task!' };
    }
  },

  toggleFavorite: async (taskId, isFavorite) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, message: 'User not authenticated!' };
    try {
      await taskService.toggleFavorite(taskId, isFavorite, userId);
      set(state => ({
        tasks:
          state.tasks?.map(task => (task.taskId === taskId ? { ...task, isFavorite } : task)) ||
          null,
      }));
      return {
        success: true,
        message: `Task ${isFavorite ? 'added to' : 'removed from'} favorites!`,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, message: 'Failed to update favorite status!' };
    }
  },
}));

export default useTasksDataStore;
