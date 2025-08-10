import { Task } from '@/data/types';
import { taskService } from '@/services/taskService';
import { useAuth } from '@/contexts/AuthContext';
import { create } from 'zustand';

export interface useTasksDataStoreInterface {
  tasks: Task[] | null;
  loading: boolean;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  fetchTasks: () => Promise<void>;
  updateTasks: (
    tasks: Task[],
    operation?: string | undefined
  ) => Promise<{ success: boolean; message: string }>;
  addTask: (task: Task) => Promise<{ success: boolean; message: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; message: string }>;
  toggleFavorite: (taskId: string, isFavorite: boolean) => Promise<{ success: boolean; message: string }>;
}

export const useTasksDataStore = create<useTasksDataStoreInterface>((set, get) => ({
  tasks: null,
  loading: false,
  selectedTask: null,

  setSelectedTask: task => {
    set({ selectedTask: task });
  },

  fetchTasks: async () => {
    const { user } = useAuth.getState?.() || {};
    if (!user) return;

    set({ loading: true });
    try {
      const userTasks = await taskService.getUserTasks(user.uid);
      set({ tasks: userTasks });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ tasks: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateTasks: async (updatedTasksArray: Task[], operation?: string) => {
    try {
      // This method is kept for compatibility but should be replaced with specific operations
      set({ tasks: updatedTasksArray });
      return {
        success: true,
        message: 'Tasks updated successfully!',
      };
    } catch (error) {
      console.error('Error updating tasks:', error);
      return { success: false, message: 'Failed to update tasks!' };
    }
  },

  addTask: async (task: Omit<Task, 'createdAt'>) => {
    const { user } = useAuth.getState?.() || {};
    if (!user) {
      return { success: false, message: 'User not authenticated!' };
    }

    try {
      const taskWithUser = { ...task, userId: user.uid };
      await taskService.addTask(taskWithUser);
      
      // Refresh tasks
      await get().fetchTasks();
      
      return {
        success: true,
        message: 'Task added successfully!',
      };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false, message: 'Failed to add task!' };
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      
      // Remove from local state
      set(state => ({
        tasks: state.tasks?.filter(task => task.taskId !== taskId) || null,
      }));
      
      return {
        success: true,
        message: 'Task deleted successfully!',
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, message: 'Failed to delete task!' };
    }
  },

  toggleFavorite: async (taskId: string, isFavorite: boolean) => {
    try {
      await taskService.toggleFavorite(taskId, isFavorite);
      
      // Update local state
      set(state => ({
        tasks: state.tasks?.map(task =>
          task.taskId === taskId ? { ...task, isFavorite } : task
        ) || null,
      }));
      
      return {
        success: true,
        message: `Task ${isFavorite ? 'added to' : 'removed from'} favorites!`,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, message: 'Failed to add task!' };
    }
  },
}));
