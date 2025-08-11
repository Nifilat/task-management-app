import { Copy, Edit2, Star } from 'lucide-react';
import { MenuItemType } from './types';
import { priorities, statuses } from '@/constants/shared';
import { DropdownItem, Priority, Status } from './types';

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
export const PRIORITY_ITEMS: DropdownItem<Priority>[] = priorities.map(
  (p): DropdownItem<Priority> => ({
    value: p.value.toLowerCase(),
    label: p.label as Priority, // ✅ narrow type
    icon: p.icon,
    count: 0,
  })
);

export const STATUS_ITEMS: DropdownItem<Status>[] = statuses.map(
  (s): DropdownItem<Status> => ({
    value: s.value.toLowerCase().replace(' ', '-'),
    label: s.label as Status, // ✅ narrow type
    icon: s.icon,
    count: 0,
  })
);
