import type { Task } from '@/data/types';
import type { Kind } from './types';
import { toast } from 'sonner';
import { AppDispatch } from '@/store/store';
import {
  toggleFavoriteAsync,
  deleteTaskAsync,
  addTaskAsync,
} from '@/lib/features/tasks/tasksSlice';

export const handleMenuItemClick = async (
  kind: Kind,
  selectedTask: Task | null,
  fetchTasks: () => Promise<void>,
  handleEdit: () => void,
  dispatch: AppDispatch,
  userId?: string
) => {
  if (!selectedTask) return;

  switch (kind) {
    case 'edit':
      handleEdit();
      break;
    case 'favorite':
      if (userId) {
        try {
          const result = await dispatch(
            toggleFavoriteAsync({
              taskId: selectedTask.taskId,
              isFavorite: !selectedTask.isFavorite,
              userId,
            })
          ).unwrap();

          if (result.success) {
            await fetchTasks();
            toast('Task updated!', { description: result.message });
          }
        } catch {
          toast('Operation failed', {
            description: 'Failed to update favorite status',
          });
        }
      }
      break;
    case 'delete':
      if (userId) {
        try {
          const result = await dispatch(
            deleteTaskAsync({
              taskId: selectedTask.taskId,
              userId,
            })
          ).unwrap();

          if (result.success) {
            await fetchTasks();
            toast('Deleted successfully!', { description: result.message });
          }
        } catch {
          toast('Deletion failed', { description: 'Failed to delete task' });
        }
      }
      break;

    case 'copy':
      if (userId) {
        try {
          const copiedTask = {
            ...selectedTask,
            taskId: `${selectedTask.taskId}-copy-${Date.now()}`,
            title: `${selectedTask.title} - copy`,
            userId,
          };

          const result = await dispatch(addTaskAsync(copiedTask)).unwrap();

          if (result.success) {
            await fetchTasks();
            toast('Copied successfully!', {
              description: 'Task has been duplicated',
            });
          }
        } catch {
          toast('Copy failed', {
            description: 'Failed to copy task',
          });
        }
      }
      break;
    default:
      break;
  }
};
