import type { Task, Status, Priority } from '@/data/types';
import { ListTodoIcon, CircleCheckIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import type { StatsCardProps, StatsCardType, FilterState } from './types';

export const calculateTaskStats = (tasks: Task[] | null, loading: boolean): StatsCardProps[] => {
  if (!tasks || loading) {
    return getLoadingStats(loading);
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.status === 'Done').length;
  const pendingTasks = tasks.filter(
    (task: Task) =>
      task.status === 'Todo' || task.status === 'In Progress' || task.status === 'Backlog'
  ).length;
  const highPriorityTasks = tasks.filter((task: Task) => task.priority === 'High').length;

  return [
    {
      title: 'Total Tasks',
      value: totalTasks.toString(),
      icon: ListTodoIcon,
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.toString(),
      icon: CircleCheckIcon,
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.toString(),
      icon: ClockIcon,
    },
    {
      title: 'High Priority Tasks',
      value: highPriorityTasks.toString(),
      icon: TriangleAlertIcon,
    },
  ];
};

/**
 * Get loading state stats
 */
const getLoadingStats = (loading: boolean): StatsCardProps[] => [
  {
    title: 'Total Tasks',
    value: loading ? '--' : '0',
    icon: ListTodoIcon,
  },
  {
    title: 'Completed Tasks',
    value: loading ? '--' : '0',
    icon: CircleCheckIcon,
  },
  {
    title: 'Pending Tasks',
    value: loading ? '--' : '0',
    icon: ClockIcon,
  },
  {
    title: 'High Priority Tasks',
    value: loading ? '--' : '0',
    icon: TriangleAlertIcon,
  },
];

export const isCardActive = (cardTitle: StatsCardType, filterState: FilterState): boolean => {
  const { checkedStatuses, checkedPriorities } = filterState;

  switch (cardTitle) {
    case 'Total Tasks':
      return checkedStatuses.length === 0 && checkedPriorities.length === 0;

    case 'Completed Tasks':
      return checkedStatuses.length === 1 && checkedStatuses.includes('Done');

    case 'Pending Tasks':
      return (
        checkedStatuses.length === 3 &&
        checkedStatuses.includes('Todo') &&
        checkedStatuses.includes('In Progress') &&
        checkedStatuses.includes('Backlog')
      );

    case 'High Priority Tasks':
      return checkedPriorities.length === 1 && checkedPriorities.includes('High');

    default:
      return false;
  }
};

export const getCardFilterConfig = (cardTitle: StatsCardType) => {
  switch (cardTitle) {
    case 'Total Tasks':
      return {
        statuses: [] as Status[],
        priorities: [] as Priority[],
      };

    case 'Completed Tasks':
      return {
        statuses: ['Done'] as Status[],
        priorities: [] as Priority[],
      };

    case 'Pending Tasks':
      return {
        statuses: ['Todo', 'In Progress', 'Backlog'] as Status[],
        priorities: [] as Priority[],
      };

    case 'High Priority Tasks':
      return {
        statuses: [] as Status[],
        priorities: ['High'] as Priority[],
      };

    default:
      return {
        statuses: [] as Status[],
        priorities: [] as Priority[],
      };
  }
};
