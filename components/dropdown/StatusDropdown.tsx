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
    if (!tasks || tasks.length === 0) return STATUS_ITEMS;

    const statusMap = tasks.reduce(
      (acc, task) => {
        const label = task.status as Status;
        if (!acc[label]) {
          const foundItem = STATUS_ITEMS.find(i => i.label === label);
          acc[label] = {
            value: foundItem?.value ?? label.toLowerCase().replace(/\s+/g, '-'),
            label,
            icon: foundItem?.icon ?? (() => null),
            count: 0,
          };
        }
        acc[label].count++;
        return acc;
      },
      {} as Record<Status, DropdownItem<Status>>
    );

    return Object.values(statusMap);
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
