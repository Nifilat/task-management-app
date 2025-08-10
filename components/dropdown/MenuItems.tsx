import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { useOpenDialogStore } from '@/hooks/useOpenDialogStore';
import { type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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
  const { selectedTask, fetchTasks } = useTasksDataStore();
  const { setIsOpen } = useOpenDialogStore();

  const { user } = useAuth();

  const handleEdit = () => {
    setIsOpen(true);
    // selectedTask is already set, so the dialog will open in edit mode
  };

  const handleClick = () => {
    handleMenuItemClick(
      kind,
      selectedTask,
      () => fetchTasks(user?.uid ?? ''),
      handleEdit 
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
