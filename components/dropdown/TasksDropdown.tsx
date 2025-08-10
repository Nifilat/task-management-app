'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { LucideEllipsis, Trash } from 'lucide-react';
import { MENU_ITEMS, LABEL_OPTIONS } from './constants';
import { MenuItem } from './MenuItems';
import { SubLabelMenu } from './SubLabelMenu';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { Label, Task } from '@/data/types';
import { tasks } from '@/data/tasks-data';
import { toast } from 'sonner';

interface TasksDropdownProps {
  onOpen: () => void;
  onClose: () => void;
}

export function TasksDropdown({ onOpen, onClose }: TasksDropdownProps) {
  const [selectedLabel, setSelectedLabel] = useState<Label>('Bug');
  const { selectedTask, updateTasks } = useTasksDataStore();
  const [menuItemsArray, setMenuItemsArray] = useState(MENU_ITEMS);

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

  const handleLabelChange = async (newLabel: string) => {
    if (!LABEL_OPTIONS.includes(newLabel) || !selectedTask || !tasks) return;

    const updatedTask: Task = { ...selectedTask, label: newLabel as Label };
    const updatedTasks = tasks.map(task =>
      task.taskId === selectedTask.taskId ? updatedTask : task
    );

    try {
      const result = await updateTasks(updatedTasks);
      toast(
        result.success
          ? `${selectedTask.taskId} updated successfully!`
          : `${selectedTask.taskId} update failed`,
        { description: result.message }
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      toast('Update failed', { description: 'An unexpected error occurred' });
    }
  };

  const handleLabelValueChange = (value: string) => {
    setSelectedLabel(value as Label);
  };

  return (
    <DropdownMenu onOpenChange={(open: boolean) => (open ? onOpen() : onClose())}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <LucideEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 poppins">
        <DropdownMenuGroup>
          {menuItemsArray.map(item => (
            <MenuItem
              key={item.label}
              kind={item.kind}
              Icon={item.icon}
              label={item.label}
              shortcut={item.shortcut}
            />
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <SubLabelMenu
            onClickedLabelItem={handleLabelChange}
            value={selectedLabel}
            onValueChange={handleLabelValueChange}
          />
          <DropdownMenuSeparator />
          <MenuItem
            Icon={Trash}
            kind="delete"
            label="Delete"
            shortcut="⇧⌘Q"
            className="text-red-500"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
