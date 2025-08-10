import { FilterFn } from "@tanstack/react-table";

// Stats card types
export interface StatsCardProps {
  title: string;
  value: string;
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