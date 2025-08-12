'use client';

import { useMemo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCheckedStatuses, setCheckedStatuses } from '@/lib/features/filters/filtersSlice';
import { selectAllTasks } from '@/lib/features/tasks/tasksSlice';
import type { Status, DropdownItem } from './types';
import FilterDropdown from './FilterDropdown';
import { STATUS_ITEMS } from './constants';

const StatusDropdown = () => {
  const checkedStatuses = useAppSelector(selectCheckedStatuses);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);

  const statusItemsWithCounts: DropdownItem<Status>[] = useMemo(() => {
    const statusItemsWithCounts = STATUS_ITEMS.map(item => ({
      ...item,
      count: 0,
    }));

    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        const taskStatus = task.status as Status;
        const statusItem = statusItemsWithCounts.find(item => item.label === taskStatus);
        if (statusItem) {
          statusItem.count++;
        }
      });
    }

    return statusItemsWithCounts;
  }, [tasks]);

  return (
    <FilterDropdown<Status>
      title="Status"
      placeholder="Change status..."
      items={statusItemsWithCounts}
      selectedItems={checkedStatuses}
      onSelectionChange={statuses => dispatch(setCheckedStatuses(statuses))}
      maxDisplayBadges={2}
    />
  );
};

export default StatusDropdown;
