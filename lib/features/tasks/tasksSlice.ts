import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskService, TaskInput } from '@/data/types';
import { taskService } from '@/services/taskService';

interface TasksState {
  tasks: Task[] | null;
  loading: boolean;
  selectedTask: Task | null;
  error: string | null;
}

const initialState: TasksState = {
  tasks: null,
  loading: false,
  selectedTask: null,
  error: null,
};

const convertTaskServiceToTask = (task: TaskService): Task => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt ? task.updatedAt.toISOString() : undefined,
});

const serializeTaskForRedux = (task: Task | TaskService): Task => {
  if ('createdAt' in task && task.createdAt instanceof Date) {
    return convertTaskServiceToTask(task as TaskService);
  }
  return task as Task;
};

const serializeTasksForRedux = (tasks: TaskService[]): Task[] =>
  tasks.map(convertTaskServiceToTask);

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const userTasks = await taskService.getUserTasks(userId);

      return serializeTasksForRedux(userTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: TaskInput, { rejectWithValue }) => {
    try {
      const taskId = await taskService.addTask(task);

      const newTask: Task = {
        ...task,
        taskId,
        createdAt: new Date().toISOString(),
      };
      return { task: newTask, message: 'Task added successfully!', success: true };
    } catch (error) {
      console.error('Error adding task:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const userId = updates.userId;
      if (!userId) throw new Error('User not authenticated!');

      await taskService.updateTask(taskId, updates, userId);

      const serializedUpdates = {
        ...updates,

        ...(updates.createdAt && {
          createdAt: typeof updates.createdAt === 'string' ? updates.createdAt : updates.createdAt,
        }),

        ...(updates.updatedAt && {
          updatedAt: typeof updates.updatedAt === 'string' ? updates.updatedAt : updates.updatedAt,
        }),
      };

      return {
        taskId,
        updates: serializedUpdates,
        message: 'Task updated successfully!',
        success: true,
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId, userId }: { taskId: string; userId: string }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error('User not authenticated!');

      await taskService.deleteTask(taskId, userId);
      return { taskId, message: 'Task deleted successfully!', success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'tasks/toggleFavorite',
  async (
    { taskId, isFavorite, userId }: { taskId: string; isFavorite: boolean; userId: string },
    { rejectWithValue }
  ) => {
    try {
      if (!userId) throw new Error('User not authenticated!');

      await taskService.toggleFavorite(taskId, isFavorite, userId);
      return {
        taskId,
        isFavorite,
        message: `Task ${isFavorite ? 'added to' : 'removed from'} favorites!`,
        success: true,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update favorite status'
      );
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload ? serializeTaskForRedux(action.payload) : null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.tasks = [];
      })

      // Add task
      .addCase(addTask.pending, state => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (state.tasks) {
          state.tasks = [action.payload.task, ...state.tasks];
        } else {
          state.tasks = [action.payload.task];
        }
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update task
      .addCase(updateTask.pending, state => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (state.tasks) {
          state.tasks = state.tasks.map(task =>
            task.taskId === action.payload.taskId ? { ...task, ...action.payload.updates } : task
          );
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete task
      .addCase(deleteTask.pending, state => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (state.tasks) {
          state.tasks = state.tasks.filter(task => task.taskId !== action.payload.taskId);
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Toggle favorite
      .addCase(toggleFavorite.pending, state => {
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.tasks) {
          state.tasks = state.tasks.map(task =>
            task.taskId === action.payload.taskId
              ? { ...task, isFavorite: action.payload.isFavorite }
              : task
          );
        }
        state.error = null;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTask, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;

// Selectors
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TasksState }) => state.tasks.loading;
export const selectSelectedTask = (state: { tasks: TasksState }) => state.tasks.selectedTask;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;

export const fetchTasksAsync = fetchTasks;
export const addTaskAsync = addTask;
export const updateTaskAsync = updateTask;
export const deleteTaskAsync = deleteTask;
export const toggleFavoriteAsync = toggleFavorite;

export const selectAllTasks = selectTasks;
export const selectTasksState = (state: { tasks: TasksState }) => state.tasks;
