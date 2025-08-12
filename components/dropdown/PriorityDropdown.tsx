'use client';

import { useMemo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCheckedPriorities, setCheckedPriorities } from '@/lib/features/filters/filtersSlice';
import { selectAllTasks } from '@/lib/features/tasks/tasksSlice';
import type { Priority, DropdownItem } from './types';
import FilterDropdown from './FilterDropdown';
import { PRIORITY_ITEMS } from './constants';

const PriorityDropdown = () => {
  const checkedPriorities = useAppSelector(selectCheckedPriorities);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);

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
      onSelectionChange={priorities => dispatch(setCheckedPriorities(priorities))}
    />
  );
};

export default PriorityDropdown;
