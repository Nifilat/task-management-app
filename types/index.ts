import { FilterFn } from '@tanstack/react-table';
import { Table } from '@tanstack/react-table';
import { Task } from '@/data/types';

// Stats card types
export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType;
}

// User types
export interface User {
  displayName: string;
  email: string;
  profilePhoto?: string;
}

// Filter function type
export type TableFilterFn<T> = FilterFn<T>;

export interface PaginationAreaProps {
  table: Table<Task>;
}
