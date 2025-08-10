import {
  Copy,
  Edit2,
  Star,
} from 'lucide-react';
import { MenuItemType } from './types';
import { priorities, statuses } from '@/constants/shared';

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

// Convert shared constants to dropdown items
export const PRIORITY_ITEMS = priorities.map(p => ({
  value: p.value.toLowerCase(),
  label: p.label,
  icon: p.icon,
  count: 0,
}));

export const STATUS_ITEMS = statuses.map(s => ({
  value: s.value.toLowerCase().replace(' ', '-'),
  label: s.label,
  icon: s.icon,
  count: 0,
}));