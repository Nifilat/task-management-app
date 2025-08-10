import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { useOpenDialogStore } from '@/hooks/useOpenDialogStore';
import { tasks } from '@/data/tasks-data';
import { LucideIcon } from 'lucide-react';
import { handleMenuItemClick } from './utils';
import { Kind } from './types';

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
}) {
  const { selectedTask, updateTasks } = useTasksDataStore();
  const { setIsOpen } = useOpenDialogStore();

  const handleEdit = () => {
    setIsOpen(true);
    // selectedTask is already set, so the dialog will open in edit mode
  };

  const handleClick = () => {
    handleMenuItemClick(
      kind,
      tasks,
      selectedTask,
      updateTasks,
      handleEdit // ← Pass the edit callback
    );
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
