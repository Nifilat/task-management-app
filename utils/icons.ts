import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import type { Status, Priority } from '@/data/types';

export const getStatusIcon = (status: Status) => {
  const statusIcons = {
    Backlog: HelpCircle,
    Canceled: XCircle,
    Done: CheckCircle2,
    'In Progress': ArrowUpCircle,
    Todo: Circle,
  } as const;

  return statusIcons[status];
};

export const getPriorityIcon = (priority: Priority) => {
  const priorityIcons = {
    Low: ArrowDown,
    Medium: ArrowRight,
    High: ArrowUp,
  } as const;

  return priorityIcons[priority];
};
