import type { Priority, Status } from '@/components/dropdown/types';
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CircleQuestionMark,
  Circle,
  Clock1,
  CircleOff,
  CircleCheckBig,
} from 'lucide-react';

export const priorities: Priority[] = [
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: ArrowRight,
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
  },
];

export const statuses: Status[] = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: CircleQuestionMark,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: Clock1,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CircleCheckBig,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff,
  },
];
