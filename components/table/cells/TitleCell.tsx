'use client';

import React from 'react';
import { Row } from '@tanstack/react-table';
import { Badge } from '../../ui/badge';
import type { Task } from '@/data/types';

interface TitleCellProps {
  row: Row<Task>;
}

export const TitleCell: React.FC<TitleCellProps> = ({ row }) => {
  const { label, title } = row.original;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{label}</Badge>
      <span>{title}</span>
    </div>
  );
};
