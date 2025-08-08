import React from 'react';
import Dropdown from './Dropdown';
import { statuses } from '@/constants/status';
import type { Status } from './types';

const StatusDropDown = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null);

  const handleStatusChange = (item: Status | null) => {
    setSelectedStatus(item);
  };

  return (
    <Dropdown
      items={statuses}
      selectedItem={selectedStatus}
      onSelectedItemChange={handleStatusChange}
      title="Status"
      placeholder="Change Status..."
      groupHeading="Statuses"
      badges={['Todo', 'Done']}
    />
  );
};

export default StatusDropDown;
