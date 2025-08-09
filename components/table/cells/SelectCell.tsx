'use client';

import React from 'react';
import type { SelectHeaderProps, SelectCellProps } from '../types';
import { Checkbox } from '../../ui/checkbox';

export const SelectHeader: React.FC<SelectHeaderProps> = ({ table }) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
    }
    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
);

export const SelectCell: React.FC<SelectCellProps> = ({ row }) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={value => row.toggleSelected(!!value)}
    aria-label="Select row"
  />
);
