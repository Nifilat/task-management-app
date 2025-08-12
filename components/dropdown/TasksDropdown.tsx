'use client';

import { LucideEllipsis, Trash } from 'lucide-react';
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
import { MoreHorizontal } from 'lucide-react';
import { deleteTask, toggleFavorite, setSelectedTask } from '@/lib/features/tasks/tasksSlice';
import { useAuth } from '@/hooks/useAuth';
import type { Task } from '@/data/types';

interface TasksDropdownProps {
  onOpen: () => void;
  onClose: () => void;
}

export function TasksDropdown({ onOpen, onClose }: TasksDropdownProps) {
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

  const handleToggleFavorite = (task: Task) => {
    if (user) {
      dispatch(
        toggleFavorite({ taskId: task.taskId, isFavorite: !task.isFavorite, userId: user.uid })
      );
    }
  };

  const handleDelete = (task: Task) => {
    if (user) {
      dispatch(deleteTask({ taskId: task.taskId, userId: user.uid }));
    }
    onClose();
  };

  const handleEdit = (task: Task) => {
    dispatch(setSelectedTask(task));
    onClose();
  };

  return (
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
                onClick={() => {
                  if (item.kind === 'edit') {
                    handleEdit(selectedTask);
                  } else if (item.kind === 'favorite') {
                    handleToggleFavorite(selectedTask);
                  }
                }}
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
            onClick={() => handleDelete(selectedTask as Task)}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
