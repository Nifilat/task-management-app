import { Task } from '@/data/types';
import { Kind } from './types';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';
import useTasksDataStore from '@/hooks/useTasksDataStore';

export async function handleMenuItemClick(
  kind: Kind,
  selectedTask: Task | null,
  refreshTasks: () => Promise<void>,
  onEdit?: () => void // ← Add edit callback
) {
  if (!selectedTask) return;

  switch (kind) {
    case 'edit':
      onEdit?.();
      break;

    case 'favorite':
      try {
        const { success, message } = await useTasksDataStore
          .getState()
          .toggleFavorite(selectedTask.taskId, !selectedTask.isFavorite);
        if (!success) throw new Error(message);

        await refreshTasks();
        toast('Task updated!', { description: message });
      } catch {
        toast('Operation failed', {
          description: 'Failed to update favorite status',
        });
      }
      break;

    case 'copy':
      try {
        const copiedTask = {
          ...selectedTask,
          taskId: `${selectedTask.taskId}-copy-${Date.now()}`,
          title: `${selectedTask.title} - copy`,
        };
        await taskService.addTask(copiedTask);
        await refreshTasks();
        toast('Copied successfully!', {
          description: 'Task has been duplicated',
        });
      } catch {
        toast('Copy failed', {
          description: 'Failed to copy task',
        });
      }
      break;

    case 'delete':
      try {
        const { success, message } = await useTasksDataStore
          .getState()
          .deleteTask(selectedTask.taskId);
        if (!success) throw new Error(message);

        await refreshTasks();
        toast('Deleted successfully!', { description: message });
      } catch {
        toast('Deletion failed', { description: 'Failed to delete task' });
      }
      break;

    default:
      break;
  }
}
