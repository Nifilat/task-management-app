import {
  Copy,
  Edit2,
  Star,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Timer,
  Circle,
  HelpCircle,
  CircleOff,
  CircleCheckBig,
} from 'lucide-react';
import { MenuItemType, DropdownItem } from './types';

export const MENU_ITEMS: MenuItemType[] = [
  {
    icon: Edit2,
    label: 'Edit',
    kind: 'edit',
    shortcut: '⇧⌘E',
  },
  {
    icon: Copy,
    label: 'Make a Copy',
    kind: 'copy',
    shortcut: '⌘C',
  },
  {
    icon: Star,
    label: 'Favorite',
    kind: 'favorite',
    shortcut: '⌘S',
  },
];

export const LABEL_OPTIONS = [
  'Bug',
  'Deployment',
  'Documentation',
  'Feature',
  'Refactoring',
  'Testing',
];

export const PRIORITY_ITEMS: DropdownItem[] = [
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
    count: 0,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: ArrowRight,
    count: 0,
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
    count: 0,
  },
];

export const STATUS_ITEMS: DropdownItem[] = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle,
    count: 0,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
    count: 0,
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    icon: Timer,
    count: 0,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CircleCheckBig,
    count: 0,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff,
    count: 0,
  },
];
