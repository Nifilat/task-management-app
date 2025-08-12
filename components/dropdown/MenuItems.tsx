'use client';

import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { selectSelectedTask, fetchTasksAsync } from '@/lib/features/tasks/tasksSlice';
import { useOpenDialogStore } from '@/hooks/useOpenDialogStore';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { handleMenuItemClick } from './utils';
import type { Kind } from './types';

export function MenuItem({
  Icon,
  kind,
  label,
  shortcut,
  className,
}: {
  Icon: LucideIcon;
  kind: Kind;
  label: string;
  shortcut: string;
  className?: string;
  onClick?: () => void;
}) {
  const selectedTask = useAppSelector(selectSelectedTask);
  const dispatch = useAppDispatch();
  const { setIsOpen } = useOpenDialogStore();

  const { user } = useAuth();

  const handleEdit = () => {
    if (selectedTask) {
      setIsOpen(true, 'edit', selectedTask);
    }
  };

  const fetchTasks = async () => {
    if (user?.uid) {
      await dispatch(fetchTasksAsync(user.uid));
    }
  };

  const handleClick = async () => {
    await handleMenuItemClick(kind, selectedTask, fetchTasks, handleEdit, dispatch, user?.uid);
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <Icon className={`mr-2 h-4 w-4 ${className}`} />
      <span className={`${className}`}>{label}</span>
      {shortcut && (
        <DropdownMenuShortcut className={`${className}`}>{shortcut}</DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  );
}
