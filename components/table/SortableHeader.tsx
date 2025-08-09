'use client';

import React from 'react';
import type { SortableHeaderProps } from './types';
import { ArrowUp, ArrowDown, ChevronsUpDown, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import type { Task } from '@/data/types';

export const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
  // Fix: Call the function to get the actual sort direction
  const sortDirection = column.getIsSorted();
  const SortingIcon =
    sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ChevronsUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-start py-[14px] select-none cursor-pointer p-2 gap-1 ${
            sortDirection ? 'text-primary' : '' // Fix: Check if sortDirection exists
          }`}
          aria-label={`Sort by ${label}`}
        >
          {label}
          <SortingIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeOff className="mr-2 h-4 w-4" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
