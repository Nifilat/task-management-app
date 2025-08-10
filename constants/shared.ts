import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CircleQuestionMark,
  Circle,
  Timer,
  CircleOff,
  CircleCheckBig,
  TriangleAlertIcon,
  CircleCheckIcon,
  ListTodoIcon,
  ClockIcon,
} from 'lucide-react';
import type { Priority, Status, Label } from '@/data/types';
import type { StatsCardProps } from '@/components/statsCard/types';

// Priority configuration
export const priorities = [
  {
    value: 'Low' as Priority,
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: 'Medium' as Priority,
    label: 'Medium',
    icon: ArrowRight,
  },
  {
    value: 'High' as Priority,
    label: 'High',
    icon: ArrowUp,
  },
];

// Status configuration
export const statuses = [
  {
    value: 'Backlog' as Status,
    label: 'Backlog',
    icon: CircleQuestionMark,
  },
  {
    value: 'Todo' as Status,
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'In Progress' as Status,
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'Done' as Status,
    label: 'Done',
    icon: CircleCheckBig,
  },
  {
    value: 'Canceled' as Status,
    label: 'Canceled',
    icon: CircleOff,
  },
];

// Label options
export const labels: Label[] = [
  'Bug',
  'Feature',
  'Documentation',
  'Testing',
  'Deployment',
  'Refactoring',
];

// Stats card configuration
export const defaultStats: StatsCardProps[] = [
  {
    title: 'Total Tasks',
    value: '0',
    icon: ListTodoIcon,
  },
  {
    title: 'Completed Tasks',
    value: '0',
    icon: CircleCheckIcon,
  },
  {
    title: 'Pending Tasks',
    value: '0',
    icon: ClockIcon,
  },
  {
    title: 'High Priority Tasks',
    value: '0',
    icon: TriangleAlertIcon,
  },
];
