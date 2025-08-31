import type { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export interface InteractiveStatsCardProps extends StatsCardProps {
  onClick?: () => void;
  isActive?: boolean;
}

export interface StatsCardContainerProps {
  className?: string;
}

export type StatsCardType =
  | 'Total Tasks'
  | 'Completed Tasks'
  | 'Pending Tasks'
  | 'High Priority Tasks';

export interface FilterState {
  checkedStatuses: string[];
  checkedPriorities: string[];
}
