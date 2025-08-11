'use client';
import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Task } from '@/data/types';
import { Table } from '@tanstack/react-table';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';

const ViewColumnsDropDown = ({ table }: { table: Table<Task> }) => {
  const { tasks } = useTasksDataStore();

  const columnsToHide = ['priority', 'status', 'createdAt'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={!tasks}
          variant={'outline'}
          className="h-8 sm:h-11 px-3 sm:px-8 text-xs sm:text-sm"
        >
          <Settings2 className="h-4 w-4" />
          <span className="ml-2">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 sm:w-56"
        side="bottom"
        align="end"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
      >
        {table
          .getAllColumns()
          .filter(column => column.getCanHide() && columnsToHide.includes(column.id))
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-sm py-2"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewColumnsDropDown;
