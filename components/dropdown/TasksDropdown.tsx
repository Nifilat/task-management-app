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
import { MENU_ITEMS } from './constants';
import { MenuItem } from './MenuItems';
import { SubLabelMenu } from './SubLabelMenu';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { Label } from '@/data/types';
import { toast } from 'sonner';

interface TasksDropdownProps {
  onOpen: () => void;
  onClose: () => void;
}

export function TasksDropdown({ onOpen, onClose }: TasksDropdownProps) {
  const [selectedLabel, setSelectedLabel] = useState<Label>('Bug');
  const { selectedTask, updateTask } = useTasksDataStore();
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

    if (selectedTask) {
      try {
        const result = await updateTask(selectedTask.taskId, {
          label: newLabel as Label,
        });

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

  return (
    <DropdownMenu onOpenChange={(open: boolean) => (open ? onOpen() : onClose())}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <LucideEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
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
            onClickedLabelItem={clickedLabelItem}
            value={selectedLabel}
            onValueChange={(value: string) => setSelectedLabel(value as Label)}
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
