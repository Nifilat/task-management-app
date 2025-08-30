import { Task } from '@/data/types';

export interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirmDelete: (taskId: string) => void;
  loading?: boolean;
}
