import type { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export interface StatsCardContainerProps {
  className?: string;
}
