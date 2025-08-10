import { LucideIcon } from "lucide-react";

// Base dropdown item interface
export interface DropdownItem {
  value: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

// Task menu types
export type Kind = "edit" | "copy" | "favorite" | "delete";

export interface MenuItemType {
  icon: LucideIcon;
  label: string;
  kind: Kind;
  shortcut: string;
}

// Filter dropdown types
export type Priority = "Low" | "Medium" | "High";
export type Status = "Backlog" | "Todo" | "In Progress" | "Done" | "Canceled";
export type Label = "Bug" | "Deployment" | "Documentation" | "Feature" | "Refactoring" | "Testing";

// Generic filter dropdown props
export interface FilterDropdownProps<T> {
  title: string;
  placeholder: string;
  items: DropdownItem[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  maxDisplayBadges?: number;
}
export interface SubLabelMenuProps {
    value: string;
    onValueChange: (value: string) => void;
    onClickedLabelItem: (value: string) => void;
}