import { LucideIcon } from 'lucide-react';

export interface DropdownItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

export type Priority = DropdownItem;
export type Status = DropdownItem;

export interface GenericDropdownProps {
  items: DropdownItem[];
  selectedItem: DropdownItem | null;
  onSelectedItemChange: (item: DropdownItem | null) => void;
  title: string;
  placeholder: string;
  groupHeading: string;
  badges: string[];
}

export interface ColumnOption {
  key: string;
  label: string;
  defaultChecked: boolean;
}
