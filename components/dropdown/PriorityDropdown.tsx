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
    const priorityItemsWithCounts = PRIORITY_ITEMS.map(item => ({
      ...item,
      count: 0,
    }));

    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        const taskPriority = task.priority as Priority;
        const priorityItem = priorityItemsWithCounts.find(item => item.label === taskPriority);
        if (priorityItem) {
          priorityItem.count++;
        }
      });
    }

    return priorityItemsWithCounts;
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
