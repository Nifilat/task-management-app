import { LucideIcon } from 'lucide-react';

export interface DropdownItem<T extends string> {
  value: string;
  label: T;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
}

// Task menu types
export type Kind = 'edit' | 'copy' | 'favorite' | 'delete';

export interface MenuItemType {
  icon: LucideIcon;
  label: string;
  kind: Kind;
  shortcut: string;
}

// Filter dropdown types
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
export type Label = 'Bug' | 'Deployment' | 'Documentation' | 'Feature' | 'Refactoring' | 'Testing';

export interface FilterDropdownProps<T extends string> {
  title: string;
  placeholder: string;
  items: DropdownItem<T>[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  maxDisplayBadges?: number;
}
export interface SubLabelMenuProps {
  value: string;
  onValueChange: (value: string) => void;
  onClickedLabelItem: (value: string) => void;
}

export interface TasksDropdownProps {
  onOpen: () => void;
  onClose: () => void;
}
