import { TriangleAlertIcon, CircleCheckIcon, ListTodoIcon, ClockIcon } from 'lucide-react';
import type { StatsCardProps } from '@/components/statsCard/types';

export const stats: StatsCardProps[] = [
  {
    title: 'Total Tasks',
    value: '3',
    icon: ListTodoIcon,
  },
  {
    title: 'Completed Tasks',
    value: '1',
    icon: CircleCheckIcon,
  },
  {
    title: 'Pending Tasks',
    value: '2',
    icon: ClockIcon,
  },
  {
    title: 'High Priority Tasks',
    value: '1',
    icon: TriangleAlertIcon,
  },
];
