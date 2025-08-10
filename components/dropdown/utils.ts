import { Task } from '@/data/types';
import { Kind } from './types';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';

export async function handleMenuItemClick(
  kind: Kind,
  selectedTask: Task | null,
  refreshTasks: () => Promise<void>,
  onEdit?: () => void // ← Add edit callback
) {
  if (!selectedTask) return;

  switch (kind) {
    case 'edit':
      // Trigger edit mode
      onEdit?.();
      break;

    case 'favorite':
      try {
        await taskService.toggleFavorite(selectedTask.taskId, !selectedTask.isFavorite);
        await refreshTasks();
        toast('Task updated!', {
          description: `Task ${selectedTask.isFavorite ? 'removed from' : 'added to'} favorites`,
        });
      } catch (error) {
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
      } catch (error) {
        toast('Copy failed', {
          description: 'Failed to copy task',
        });
      }
      break;

    case 'delete':
      try {
        await taskService.deleteTask(selectedTask.taskId);
        await refreshTasks();
        toast('Deleted successfully!', {
          description: 'Task has been deleted',
        });
      } catch (error) {
        toast('Deletion failed', {
          description: 'Failed to delete task',
        });
      }
      break;

    default:
      break;
  }
}
