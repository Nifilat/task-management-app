'use client';

import { useMemo } from 'react';
import { useCheckedPrioritiesStore } from '@/hooks/useCheckedPrioritiesStore';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { Priority, DropdownItem } from './types';
import FilterDropdown from './FilterDropdown';
import { PRIORITY_ITEMS } from './constants';

const PriorityDropdown = () => {
  const { checkedPriorities, setCheckedPriorities } = useCheckedPrioritiesStore();
  const { tasks } = useTasksDataStore();

  const priorityItemsWithCounts: DropdownItem<Priority>[] = useMemo(() => {
    if (!tasks || tasks.length === 0) return PRIORITY_ITEMS;

    const priorityMap = tasks.reduce(
      (acc, task) => {
        const label = task.priority as Priority;
        if (!acc[label]) {
          const foundItem = PRIORITY_ITEMS.find(i => i.label === label);
          acc[label] = {
            value: foundItem?.value ?? label.toLowerCase(),
            label,
            icon: foundItem?.icon ?? (() => null),
            count: 0,
          };
        }
        acc[label].count++;
        return acc;
      },
      {} as Record<Priority, DropdownItem<Priority>>
    );

    return Object.values(priorityMap);
  }, [tasks]);

  return (
    <FilterDropdown<Priority>
      title="Priority"
      placeholder="Change priority..."
      items={priorityItemsWithCounts}
      selectedItems={checkedPriorities}
      onSelectionChange={setCheckedPriorities}
    />
  );
};

export default PriorityDropdown;
