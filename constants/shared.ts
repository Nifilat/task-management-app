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
  Bug,
  Sparkles,
  BookOpen,
  TestTube,
  Rocket,
  RefreshCw,
} from 'lucide-react';
import type { Priority, Status, Label } from '@/data/types';
import type { StatsCardProps } from '@/components/statsCard/types';

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export const labelConfig: Record<
  Label,
  {
    value: Label;
    label: string;
    color: string;
    bgColor: string;
    darkBgColor: string;
    icon: any;
  }
> = {
  Bug: {
    value: 'Bug',
    label: 'Bug',
    color: '#ef4444',
    bgColor: '#fee2e2',
    darkBgColor: '#450a0a',
    icon: Bug,
  },
  Feature: {
    value: 'Feature',
    label: 'Feature',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    darkBgColor: '#1e3a8a',
    icon: Sparkles,
  },
  Documentation: {
    value: 'Documentation',
    label: 'Documentation',
    color: '#10b981',
    bgColor: '#d1fae5',
    darkBgColor: '#064e3b',
    icon: BookOpen,
  },
  Testing: {
    value: 'Testing',
    label: 'Testing',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    darkBgColor: '#451a03',
    icon: TestTube,
  },
  Deployment: {
    value: 'Deployment',
    label: 'Deployment',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    darkBgColor: '#4c1d95',
    icon: Rocket,
  },
  Refactoring: {
    value: 'Refactoring',
    label: 'Refactoring',
    color: '#06b6d4',
    bgColor: '#cffafe',
    darkBgColor: '#164e63',
    icon: RefreshCw,
  },
};

export const labels: Label[] = Object.keys(labelConfig) as Label[];

export const getLabelColor = (label: Label): string | undefined => {
  return labelConfig[label]?.color;
};

export const getLabelBgColor = (label: Label): string | undefined => {
  return labelConfig[label]?.bgColor;
};

export const getLabelDarkBgColor = (label: Label): string | undefined => {
  return labelConfig[label]?.darkBgColor;
};

export const getLabelIcon = (label: Label) => {
  return labelConfig[label]?.icon;
};

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

export const TABLE_HEADERS = ['Task', 'Title', 'Status', 'Priority', 'Created At'];
