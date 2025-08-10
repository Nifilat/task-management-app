'use client';

import { useMemo } from 'react';
import { useCheckedPrioritiesStore } from '@/hooks/useCheckedPrioritiesStore';
import { tasks } from '@/data/tasks-data';
import { Priority } from './types';
import FilterDropdown from './FilterDropdown';
import { PRIORITY_ITEMS } from './constants';

const PriorityDropdown = () => {
  const { checkedPriorities, setCheckedPriorities } = useCheckedPrioritiesStore();

  const priorityItemsWithCounts = useMemo(() => {
    if (!tasks) return PRIORITY_ITEMS;

    return PRIORITY_ITEMS.map(item => ({
      ...item,
      count: tasks.filter(task => task.priority === item.label).length,
    }));
  }, []);

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
