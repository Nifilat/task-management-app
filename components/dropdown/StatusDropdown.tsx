'use client';

import { useMemo } from 'react';
import { useCheckedStatusesStore } from '@/hooks/useCheckedStatusesStore';
import { Status, DropdownItem } from './types';
import FilterDropdown from './FilterDropdown';
import { STATUS_ITEMS } from './constants';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';

const StatusDropdown = () => {
  const { checkedStatuses, setCheckedStatuses } = useCheckedStatusesStore();
  const { tasks } = useTasksDataStore();

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
      onSelectionChange={setCheckedStatuses}
      maxDisplayBadges={2}
    />
  );
};

export default StatusDropdown;
