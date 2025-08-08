'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { PanelsLeftRight } from 'lucide-react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { columnOptions } from '@/constants/viewColumnsDropdown';

type Checked = DropdownMenuCheckboxItemProps['checked'];

const ViewColumnsDropDown = () => {
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, Checked>>(() =>
    columnOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.key]: option.defaultChecked,
      }),
      {}
    )
  );

  const handleColumnToggle = (columnKey: string) => (checked: Checked) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: checked,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className="h-11 px-8">
          <PanelsLeftRight />
          <span>View</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnOptions.map(option => (
          <DropdownMenuCheckboxItem
            key={option.key}
            checked={columnVisibility[option.key]}
            onCheckedChange={handleColumnToggle(option.key)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewColumnsDropDown;
