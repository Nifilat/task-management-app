import { LucideEllipsis, Trash, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectSelectedTask, updateTaskAsync } from '@/lib/features/tasks/tasksSlice';
import type { Label } from '@/data/types';
import { toast } from 'sonner';
import { MENU_ITEMS } from './constants';
import { MenuItem } from './MenuItems';
import { SubLabelMenu } from './SubLabelMenu';
import { deleteTask } from '@/lib/features/tasks/tasksSlice';
import { useAuth } from '@/hooks/useAuth';
import type { Task } from '@/data/types';
import DeleteTaskDialog from '../task-dialog/DeleteTaskDialog';
import type { TasksDropdownProps } from './types';

export function TasksDropdown({ onOpen, onClose }: TasksDropdownProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label>('Bug');
  const selectedTask = useAppSelector(selectSelectedTask);
  const dispatch = useAppDispatch();
  const [menuItemsArray, setMenuItemsArray] = useState(MENU_ITEMS);
  const { user } = useAuth();

  useEffect(() => {
    setMenuItemsArray(prev =>
      prev.map(item => {
        if (item.kind === 'favorite') {
          return {
            ...item,
            label: selectedTask?.isFavorite ? 'Unfavorite' : 'Favorite',
          };
        }
        return item;
      })
    );
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask) {
      setSelectedLabel(selectedTask.label);
    }
  }, [selectedTask]);

  const clickedLabelItem = async (newLabel: string) => {
    const validLabels: Label[] = [
      'Bug',
      'Deployment',
      'Documentation',
      'Feature',
      'Refactoring',
      'Testing',
    ];

    if (!validLabels.includes(newLabel as Label)) {
      console.error(`The type ${newLabel} is incorrect`);
      return;
    }

    if (selectedTask && user) {
      try {
        const result = await dispatch(
          updateTaskAsync({
            taskId: selectedTask.taskId,
            updates: { label: newLabel as Label, userId: user.uid },
          })
        ).unwrap();

        toast(
          result.success
            ? `${selectedTask.taskId} Updated successfully!`
            : `${selectedTask.taskId} Update failed`,
          { description: result.message }
        );
      } catch (error) {
        console.error('Failed to update tasks:', error);
      }
    }
  };

  const handleDeleteConfirm = async (taskId: string) => {
    if (user) {
      try {
        setDeleting(true);
        await dispatch(deleteTask({ taskId, userId: user.uid }));
        toast.success('Task deleted successfully');
      } catch {
        toast.error('Failed to delete task');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteClick = () => {
    if (selectedTask) {
      setTaskToDelete(selectedTask);
      setShowDeleteModal(true);
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={(open: boolean) => (open ? onOpen() : onClose())}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {selectedTask ? <LucideEllipsis /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {selectedTask && (
            <DropdownMenuGroup>
              {menuItemsArray.map(item => (
                <MenuItem
                  key={item.label}
                  kind={item.kind}
                  Icon={item.icon}
                  label={item.label}
                  shortcut={item.shortcut}
                  // Only pass onClick for delete action to show modal
                  onClick={item.kind === 'delete' ? handleDeleteClick : undefined}
                />
              ))}
            </DropdownMenuGroup>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {selectedTask && (
              <SubLabelMenu
                onClickedLabelItem={clickedLabelItem}
                value={selectedLabel}
                onValueChange={(value: string) => setSelectedLabel(value as Label)}
              />
            )}
            <DropdownMenuSeparator />
            <MenuItem
              Icon={Trash}
              kind="delete"
              label="Delete"
              shortcut="⇧⌘Q"
              className="text-red-500"
              onClick={handleDeleteClick}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTaskDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        task={taskToDelete}
        onConfirmDelete={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
