import React from 'react';
import Dropdown from './Dropdown';
import { priorities } from '@/constants/status';
import type { Priority } from './types';

const PriorityDropDown = () => {
  const [selectedPriority, setSelectedPriority] = React.useState<Priority | null>(null);

  const handlePriorityChange = (item: Priority | null) => {
    setSelectedPriority(item);
  };

  return (
    <Dropdown
      items={priorities}
      selectedItem={selectedPriority}
      onSelectedItemChange={handlePriorityChange}
      title="Priority"
      placeholder="Change Priority..."
      groupHeading="Priorities"
      badges={['Low', 'Medium']}
    />
  );
};

export default PriorityDropDown;
