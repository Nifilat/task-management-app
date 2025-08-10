'use client';

import { useMemo } from 'react';
import { useCheckedStatusesStore } from '@/hooks/useCheckedStatusesStore';
import { Status } from './types';
import FilterDropdown from './FilterDropdown';
import { STATUS_ITEMS } from './constants';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';

const StatusDropdown = () => {
  const { checkedStatuses, setCheckedStatuses } = useCheckedStatusesStore();

  const { tasks } = useTasksDataStore();

  const statusItemsWithCounts = useMemo(() => {
    if (!tasks) return STATUS_ITEMS;

    return STATUS_ITEMS.map(item => ({
      ...item,
      count: tasks.filter(task => task.status === item.label).length,
    }));
  }, []);

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
