import {
  Circle,
  HelpCircle,
  CircleOff,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Timer,
  CircleCheckBig,
} from 'lucide-react';
import type { Status, Priority } from '@/data/types';

export const getStatusIcon = (status: Status) => {
  const statusIcons = {
    Backlog: HelpCircle,
    Canceled: CircleOff,
    Done: CircleCheckBig,
    'In Progress': Timer,
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
